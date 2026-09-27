import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import { z, ZodError } from 'zod';
import { canTransition, isConversationMember } from './policy.js';
import { normalizeServiceTag, saveServiceTags, serviceTags } from './service-tags.js';

const uuid = z.string().uuid();
const email = z.string().trim().email().max(254).transform(v => v.toLowerCase());
const password = z.string().min(12).max(72).refine(v => Buffer.byteLength(v, 'utf8') <= 72, 'Senha muito longa');
const safeText = (max) => z.string().trim().min(1).max(max);
const hashToken = token => createHash('sha256').update(token).digest('hex');
const cookieName = 'ta_pronto_session';
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', path: '/' };
const authLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });
const mutationLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false });

function error(status, message) {
  const result = new Error(message);
  result.status = status;
  return result;
}

function parseCookie(request) {
  const header = request.headers.cookie || '';
  return header.split(';').map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
}

function one(result, message = 'Registro não encontrado') {
  if (!result.rows[0]) throw error(404, message);
  return result.rows[0];
}

export function createApp(db, { webOrigin = process.env.WEB_ORIGIN } = {}) {
  if (!webOrigin) throw new Error('WEB_ORIGIN é obrigatória');
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(express.json({ limit: '64kb' }));
  app.use((req, res, next) => {
    if (req.headers.origin === webOrigin) {
      res.set('Access-Control-Allow-Origin', webOrigin);
      res.set('Access-Control-Allow-Credentials', 'true');
      res.set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
      res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
      res.set('Vary', 'Origin');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(req.headers.origin === webOrigin ? 204 : 403);
    if (!['GET', 'HEAD'].includes(req.method) && (req.headers.origin !== webOrigin || req.headers['x-requested-with'] !== 'XMLHttpRequest')) {
      return next(error(403, 'Origem não autorizada'));
    }
    next();
  });

  const optionalAuth = async (req, _res, next) => {
    try {
      const token = parseCookie(req);
      if (token) {
        const result = await db.query(`select u.id, u.email, u.full_name, u.status from auth_sessions s
          join app_users u on u.id = s.user_id
          where s.token_hash = $1 and s.expires_at > now() and u.status = 'active' and u.deleted_at is null`, [hashToken(token)]);
        req.user = result.rows[0] || null;
      }
      next();
    } catch (cause) { next(cause); }
  };
  const requireAuth = (req, _res, next) => req.user ? next() : next(error(401, 'Entre na sua conta para continuar'));
  app.use(optionalAuth);
  app.use((req, res, next) => ['GET','HEAD'].includes(req.method) ? next() : mutationLimiter(req,res,next));

  app.get('/api/health', async (_req, res) => {
    await db.query('select 1');
    res.json({ ok: true });
  });

  app.post('/api/auth/register', authLimiter, async (req, res) => {
    const input = z.object({ name: safeText(120), email, password }).strict().parse(req.body);
    const passwordHash = await bcrypt.hash(input.password, 12);
    const token = randomBytes(32).toString('base64url');
    const user = await db.transaction(async client => {
      const created = one(await client.query(`insert into app_users(full_name,email,password_hash)
        values($1,$2,$3) returning id,full_name,email`, [input.name, input.email, passwordHash]));
      await client.query(`insert into user_roles(user_id,role) values($1,'customer')`, [created.id]);
      await client.query(`insert into auth_sessions(user_id,token_hash,expires_at) values($1,$2,now()+interval '30 days')`, [created.id, hashToken(token)]);
      return created;
    });
    res.cookie(cookieName, token, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60_000 });
    res.status(201).json({ user: { id: user.id, name: user.full_name, email: user.email } });
  });

  app.post('/api/auth/login', authLimiter, async (req, res) => {
    const input = z.object({ email, password: z.string() }).strict().parse(req.body);
    const found = await db.query(`select id,full_name,email,password_hash from app_users
      where lower(email)=$1 and status='active' and deleted_at is null`, [input.email]);
    const user = found.rows[0];
    if (!user?.password_hash || !(await bcrypt.compare(input.password, user.password_hash))) throw error(401, 'E-mail ou senha inválidos');
    const token = randomBytes(32).toString('base64url');
    await db.query(`insert into auth_sessions(user_id,token_hash,expires_at) values($1,$2,now()+interval '30 days')`, [user.id, hashToken(token)]);
    res.cookie(cookieName, token, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60_000 });
    res.json({ user: { id: user.id, name: user.full_name, email: user.email } });
  });

  app.post('/api/auth/logout', requireAuth, async (req, res) => {
    await db.query('delete from auth_sessions where token_hash=$1', [hashToken(parseCookie(req))]);
    res.clearCookie(cookieName, cookieOptions);
    res.sendStatus(204);
  });
  app.get('/api/auth/me', (req, res) => res.json({ user: req.user ? { id: req.user.id, name: req.user.full_name, email: req.user.email } : null }));

  app.get('/api/categories', async (_req, res) => {
    const result = await db.query(`select c.id,c.name,c.slug,c.icon_key,s.id as service_id
      from service_categories c join services s on s.category_id=c.id and s.is_active
      where c.is_active order by c.display_order,c.name`);
    res.json({ categories: result.rows });
  });
  const providerSelect = `select p.user_id as id,p.public_name as name,p.bio,p.available_now as available,
    p.verification_status,p.rating_average as rating,p.rating_count as reviews,p.completed_jobs,p.city,p.state,
    s.name as profession,c.name as category,c.id as category_id,s.id as service_id,ps.starting_price,
    array[s.name] as services,
    array(select tag.label from provider_service_tags tag where tag.provider_id=p.user_id order by tag.created_at,tag.label) as service_tags
    from provider_profiles p join provider_services ps on ps.provider_id=p.user_id and ps.is_active
    join services s on s.id=ps.service_id and s.is_active
    join service_categories c on c.id=s.category_id and c.is_active`;
  app.get('/api/providers', async (req, res) => {
    const search = z.string().trim().max(100).optional().parse(req.query.search);
    const category = uuid.optional().parse(req.query.category);
    const result = await db.query(`${providerSelect} where p.verification_status='verified'
      and ($1::text is null or p.public_name ilike '%'||$1||'%' or p.bio ilike '%'||$1||'%'
        or s.name ilike '%'||$1||'%' or c.name ilike '%'||$1||'%'
        or exists (select 1 from provider_service_tags tag where tag.provider_id=p.user_id
          and position($3 in tag.normalized_tag)>0))
      and ($2::uuid is null or c.id=$2) order by p.rating_average desc limit 100`,
      [search || null, category || null, normalizeServiceTag(search || '')]);
    res.json({ providers: result.rows });
  });
  app.get('/api/providers/:id', async (req, res) => {
    const id = uuid.parse(req.params.id);
    const result = await db.query(`${providerSelect} where p.user_id=$1 and p.verification_status='verified' limit 1`, [id]);
    res.json({ provider: one(result) });
  });
  app.get('/api/providers/:id/reviews', async (req, res) => {
    const result = await db.query(`select r.id,r.rating,r.comment,r.created_at,
      split_part(u.full_name,' ',1) as author from reviews r join app_users u on u.id=r.customer_id
      where r.provider_id=$1 and r.is_visible order by r.created_at desc limit 50`, [uuid.parse(req.params.id)]);
    res.json({ reviews: result.rows });
  });

  app.get('/api/provider/me', requireAuth, async (req, res) => {
    const result = await db.query(`select p.public_name,p.verification_status,p.bio,p.available_now,
      array(select tag.label from provider_service_tags tag where tag.provider_id=p.user_id order by tag.created_at,tag.label) as service_tags
      from provider_profiles p where p.user_id=$1`, [req.user.id]);
    res.json({ profile: result.rows[0] || null });
  });
  app.patch('/api/provider/tags', requireAuth, async (req, res) => {
    const { tags } = z.object({ tags: serviceTags }).strict().parse(req.body);
    await db.transaction(async client => {
      one(await client.query('select user_id from provider_profiles where user_id=$1 for update', [req.user.id]));
      await saveServiceTags(client, req.user.id, tags);
    });
    res.json({ tags });
  });
  app.patch('/api/provider/availability', requireAuth, async (req, res) => {
    const input = z.object({ available: z.boolean() }).strict().parse(req.body);
    const result = await db.query(`update provider_profiles set available_now=$2 where user_id=$1 and verification_status='verified' returning available_now`, [req.user.id,input.available]);
    res.json({ profile: one(result) });
  });

  app.post('/api/providers/apply', requireAuth, async (req, res) => {
    const input = z.object({ publicName: safeText(120), bio: safeText(2000), serviceId: uuid, tags: serviceTags,
      startingPrice: z.number().nonnegative().max(1_000_000), phone: z.string().regex(/^\d{10,11}$/),
      city: safeText(100), yearsExperience: z.number().int().min(0).max(70),
      weekdays: z.array(z.number().int().min(0).max(6)).min(1).max(7).refine(days => new Set(days).size === days.length),
      startsAt: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
      endsAt: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/) }).strict().parse(req.body);
    if (input.city.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase() !== 'teresina') throw error(400,'Atendemos apenas Teresina nesta etapa');
    if (input.startsAt >= input.endsAt) throw error(400,'Horário de término deve ser posterior ao início');
    await db.transaction(async client => {
      const service = await client.query('select id from services where id=$1 and is_active', [input.serviceId]);
      one(service, 'Serviço inválido');
      await client.query(`update app_users set phone=$2 where id=$1`, [req.user.id,input.phone]);
      await client.query(`insert into provider_profiles(user_id,public_name,bio,years_experience,city,state)
        values($1,$2,$3,$4,$5,'PI')`, [req.user.id, input.publicName, input.bio,input.yearsExperience,input.city]);
      await client.query(`insert into provider_services(provider_id,service_id,starting_price) values($1,$2,$3)`, [req.user.id, input.serviceId, input.startingPrice]);
      await saveServiceTags(client, req.user.id, input.tags);
      for (const weekday of input.weekdays) {
        await client.query(`insert into provider_availability(provider_id,weekday,starts_at,ends_at)
          values($1,$2,$3,$4)`, [req.user.id,weekday,input.startsAt,input.endsAt]);
      }
      await client.query(`insert into user_roles(user_id,role) values($1,'provider') on conflict do nothing`, [req.user.id]);
    });
    res.status(201).json({ status: 'pending' });
  });

  app.patch('/api/admin/providers/:id/verification', requireAuth, async (req, res) => {
    const admin = await db.query(`select 1 from user_roles where user_id=$1 and role='admin'`, [req.user.id]);
    if (!admin.rows[0]) throw error(403, 'Acesso negado');
    const input = z.object({ status: z.enum(['verified','rejected','suspended']) }).strict().parse(req.body);
    const provider = await db.transaction(async client => {
      const target = uuid.parse(req.params.id);
      const previous = one(await client.query('select verification_status from provider_profiles where user_id=$1 for update', [target]));
      const result = one(await client.query(`update provider_profiles set verification_status=$2 where user_id=$1 returning user_id,verification_status`, [target,input.status]));
      await client.query(`insert into audit_logs(actor_id,entity_type,entity_id,action,old_data,new_data)
        values($1,'provider_profile',$2,'verification_changed',$3,$4)`, [req.user.id,target,JSON.stringify(previous),JSON.stringify(result)]);
      return result;
    });
    res.json({ provider });
  });

  app.get('/api/favorites', requireAuth, async (req, res) => {
    const result = await db.query('select provider_id from favorites where customer_id=$1', [req.user.id]);
    res.json({ providerIds: result.rows.map(row => row.provider_id) });
  });
  app.post('/api/favorites/:id', requireAuth, async (req, res) => {
    const id = uuid.parse(req.params.id);
    await db.query(`insert into favorites(customer_id,provider_id) values($1,$2) on conflict do nothing`, [req.user.id, id]);
    res.sendStatus(204);
  });
  app.delete('/api/favorites/:id', requireAuth, async (req, res) => {
    await db.query('delete from favorites where customer_id=$1 and provider_id=$2', [req.user.id, uuid.parse(req.params.id)]);
    res.sendStatus(204);
  });

  app.post('/api/requests', requireAuth, async (req, res) => {
    const input = z.object({ providerId: uuid, serviceId: uuid, title: safeText(150), description: safeText(5000),
      urgency: z.enum(['immediate','today','tomorrow','this_week','scheduled','flexible']), preferredAt: z.string().datetime().nullable().optional(),
      address: z.object({ postalCode: z.string().regex(/^\d{8}$/), street: safeText(200), number: safeText(30),
        neighborhood: safeText(100), city: safeText(100), state: z.string().length(2) }).strict() }).strict().parse(req.body);
    if (input.address.city.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase() !== 'teresina' || input.address.state.toUpperCase() !== 'PI') {
      throw error(400, 'Atendemos apenas Teresina - PI nesta etapa');
    }
    if (input.urgency === 'scheduled' && (!input.preferredAt || new Date(input.preferredAt) <= new Date())) {
      throw error(400,'Escolha uma data futura para o serviço');
    }
    const created = await db.transaction(async client => {
      const offered = await client.query(`select 1 from provider_services ps join provider_profiles p on p.user_id=ps.provider_id
        where ps.provider_id=$1 and ps.service_id=$2 and ps.is_active and p.verification_status='verified'`, [input.providerId,input.serviceId]);
      one(offered, 'Este profissional não oferece o serviço');
      const address = one(await client.query(`insert into addresses(user_id,postal_code,street,number,neighborhood,city,state)
        values($1,$2,$3,$4,$5,$6,$7) returning id`, [req.user.id,input.address.postalCode,input.address.street,input.address.number,input.address.neighborhood,input.address.city,input.address.state.toUpperCase()]));
      const request = one(await client.query(`insert into service_requests(customer_id,service_id,address_id,target_provider_id,title,description,urgency,preferred_at)
        values($1,$2,$3,$4,$5,$6,$7,$8) returning id,status`, [req.user.id,input.serviceId,address.id,input.providerId,input.title,input.description,input.urgency,input.preferredAt || null]));
      await client.query(`insert into conversations(request_id,customer_id,provider_id) values($1,$2,$3)`, [request.id,req.user.id,input.providerId]);
      return request;
    });
    res.status(201).json({ request: created });
  });
  app.get('/api/requests', requireAuth, async (req, res) => {
    const result = await db.query(`select r.id,r.title,r.description,r.status,r.created_at,r.target_provider_id,p.public_name as provider_name,
      q.id as quote_id,q.total_amount,q.status as quote_status,j.id as job_id,j.status as job_status,c.id as conversation_id
      from service_requests r left join provider_profiles p on p.user_id=r.target_provider_id
      left join quotes q on q.request_id=r.id and q.provider_id=r.target_provider_id
      left join jobs j on j.request_id=r.id
      left join conversations c on c.request_id=r.id and c.provider_id=r.target_provider_id
      where r.customer_id=$1 order by r.created_at desc limit 100`, [req.user.id]);
    res.json({ requests: result.rows });
  });
  app.get('/api/provider/requests', requireAuth, async (req, res) => {
    const result = await db.query(`select r.id,r.title,r.description,r.urgency,r.status,r.created_at,
      q.id as quote_id,q.status as quote_status,c.id as conversation_id,j.id as job_id,j.status as job_status
      from service_requests r left join quotes q on q.request_id=r.id and q.provider_id=$1
      left join conversations c on c.request_id=r.id and c.provider_id=$1
      left join jobs j on j.request_id=r.id
      where r.target_provider_id=$1 order by r.created_at desc limit 100`, [req.user.id]);
    res.json({ requests: result.rows });
  });
  app.post('/api/requests/:id/cancel', requireAuth, async (req, res) => {
    const result = await db.query(`update service_requests set status='cancelled' where id=$1 and customer_id=$2 and status in ('open','quoted') returning id`, [uuid.parse(req.params.id),req.user.id]);
    one(result, 'Solicitação não encontrada ou já contratada');
    res.sendStatus(204);
  });
  app.post('/api/requests/:id/quotes', requireAuth, async (req, res) => {
    const input = z.object({ description: safeText(2000), laborAmount: z.number().nonnegative().max(1_000_000),
      materialsAmount: z.number().nonnegative().max(1_000_000) }).strict().parse(req.body);
    const quote = await db.transaction(async client => {
      const request = one(await client.query(`select r.id,r.status,r.target_provider_id,p.verification_status
        from service_requests r join provider_profiles p on p.user_id=r.target_provider_id
        where r.id=$1 for update of r`, [uuid.parse(req.params.id)]));
      if (request.target_provider_id !== req.user.id || request.verification_status !== 'verified' || !['open','quoted'].includes(request.status)) throw error(403,'Solicitação indisponível');
      const created = one(await client.query(`insert into quotes(request_id,provider_id,description,labor_amount,materials_amount)
        values($1,$2,$3,$4,$5) returning id,total_amount,status`, [request.id,req.user.id,input.description,input.laborAmount,input.materialsAmount]));
      await client.query(`update service_requests set status='quoted' where id=$1`, [request.id]);
      return created;
    });
    res.status(201).json({ quote });
  });
  app.post('/api/quotes/:id/accept', requireAuth, async (req, res) => {
    const job = await db.transaction(async client => {
      const quote = one(await client.query(`select q.id,q.request_id,q.provider_id,q.status,r.customer_id,r.status as request_status
        from quotes q join service_requests r on r.id=q.request_id where q.id=$1 for update of q,r`, [uuid.parse(req.params.id)]));
      if (quote.customer_id !== req.user.id || quote.status !== 'sent' || quote.request_status !== 'quoted') throw error(403,'Proposta indisponível');
      await client.query(`update quotes set status='accepted' where id=$1`, [quote.id]);
      await client.query(`update service_requests set status='accepted' where id=$1`, [quote.request_id]);
      const created = one(await client.query(`insert into jobs(request_id,quote_id,customer_id,provider_id)
        values($1,$2,$3,$4) returning id,status`, [quote.request_id,quote.id,req.user.id,quote.provider_id]));
      await client.query(`insert into job_status_history(job_id,status,changed_by) values($1,'confirmed',$2)`, [created.id,req.user.id]);
      await client.query(`update conversations set job_id=$1 where request_id=$2 and provider_id=$3`, [created.id,quote.request_id,quote.provider_id]);
      return created;
    });
    res.status(201).json({ job });
  });

  app.get('/api/conversations', requireAuth, async (req, res) => {
    const result = await db.query(`select c.id,c.request_id,c.job_id,c.customer_id,c.provider_id,r.title,
      p.public_name as provider_name,u.full_name as customer_name,
      (select body from messages m where m.conversation_id=c.id order by created_at desc limit 1) as last_message
      from conversations c join service_requests r on r.id=c.request_id
      join provider_profiles p on p.user_id=c.provider_id join app_users u on u.id=c.customer_id
      where c.customer_id=$1 or c.provider_id=$1 order by c.updated_at desc limit 100`, [req.user.id]);
    res.json({ conversations: result.rows });
  });
  app.get('/api/conversations/:id/messages', requireAuth, async (req, res) => {
    const id = uuid.parse(req.params.id);
    const conversation = one(await db.query('select customer_id,provider_id from conversations where id=$1', [id]));
    if (!isConversationMember(conversation, req.user.id)) throw error(403,'Acesso negado');
    const result = await db.query(`select * from (select id,sender_id,body,created_at from messages
      where conversation_id=$1 order by created_at desc limit 200) recent order by created_at asc`, [id]);
    res.json({ messages: result.rows });
  });
  app.post('/api/conversations/:id/messages', requireAuth, async (req, res) => {
    const id = uuid.parse(req.params.id);
    const input = z.object({ body: safeText(2000) }).strict().parse(req.body);
    const conversation = one(await db.query('select customer_id,provider_id from conversations where id=$1', [id]));
    if (!isConversationMember(conversation,req.user.id)) throw error(403,'Acesso negado');
    const result = await db.query(`insert into messages(conversation_id,sender_id,body) values($1,$2,$3)
      returning id,sender_id,body,created_at`, [id,req.user.id,input.body]);
    await db.query('update conversations set updated_at=now() where id=$1', [id]);
    res.status(201).json({ message: result.rows[0] });
  });

  app.get('/api/jobs/:id', requireAuth, async (req, res) => {
    const result = await db.query(`select j.id,j.request_id,j.customer_id,j.provider_id,j.status,j.created_at,
      a.street,a.number,a.neighborhood,a.city,a.state,a.postal_code
      from jobs j join service_requests r on r.id=j.request_id join addresses a on a.id=r.address_id
      where j.id=$1 and (j.customer_id=$2 or j.provider_id=$2)`, [uuid.parse(req.params.id),req.user.id]);
    res.json({ job: one(result) });
  });
  app.get('/api/jobs/:id/history', requireAuth, async (req, res) => {
    const id = uuid.parse(req.params.id);
    const member = await db.query('select 1 from jobs where id=$1 and (customer_id=$2 or provider_id=$2)', [id,req.user.id]);
    one(member);
    const result = await db.query('select status,created_at from job_status_history where job_id=$1 order by created_at,id', [id]);
    res.json({ history: result.rows });
  });
  app.patch('/api/jobs/:id/status', requireAuth, async (req, res) => {
    const input = z.object({ status: z.enum(['provider_en_route','in_progress','completed','cancelled','disputed']) }).strict().parse(req.body);
    const job = await db.transaction(async client => {
      const current = one(await client.query('select id,customer_id,provider_id,status from jobs where id=$1 for update', [uuid.parse(req.params.id)]));
      const actor = current.customer_id === req.user.id ? 'customer' : current.provider_id === req.user.id ? 'provider' : null;
      if (!canTransition(current.status,input.status,actor)) throw error(403,'Mudança de status não permitida');
      const updated = one(await client.query(`update jobs set status=$2,
        completed_at=case when $2='completed' then now() else completed_at end,
        cancelled_at=case when $2='cancelled' then now() else cancelled_at end
        where id=$1 returning id,status`, [current.id,input.status]));
      await client.query('insert into job_status_history(job_id,status,changed_by) values($1,$2,$3)', [current.id,input.status,req.user.id]);
      return updated;
    });
    res.json({ job });
  });
  app.post('/api/jobs/:id/reviews', requireAuth, async (req, res) => {
    const input = z.object({ rating: z.number().int().min(1).max(5), comment: z.string().trim().max(2000).optional() }).strict().parse(req.body);
    const review = await db.transaction(async client => {
      const job = one(await client.query('select customer_id,provider_id,status from jobs where id=$1', [uuid.parse(req.params.id)]));
      if (job.customer_id !== req.user.id || job.status !== 'completed') throw error(403,'Avaliação não permitida');
      const created = one(await client.query(`insert into reviews(job_id,customer_id,provider_id,rating,comment)
        values($1,$2,$3,$4,$5) returning id,rating,comment`, [req.params.id,req.user.id,job.provider_id,input.rating,input.comment || null]));
      await client.query(`update provider_profiles set rating_average=(select avg(rating) from reviews where provider_id=$1),
        rating_count=(select count(*) from reviews where provider_id=$1) where user_id=$1`, [job.provider_id]);
      return created;
    });
    res.status(201).json({ review });
  });

  app.use((err, _req, res, _next) => {
    if (err instanceof ZodError) return res.status(400).json({ error: 'Dados inválidos', details: err.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message })) });
    if (err.code === '23505') return res.status(409).json({ error: 'Este registro já existe' });
    if (err.code === '23503') return res.status(400).json({ error: 'Referência inválida' });
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  });
  return app;
}
