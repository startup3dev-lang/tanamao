import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import request from 'supertest';
import { createApp } from './app.js';

const origin = 'http://localhost:5173';
const mutation = agent => ({
  post: (path, body) => agent.post(path).set('Origin', origin).set('X-Requested-With', 'XMLHttpRequest').send(body),
  patch: (path, body) => agent.patch(path).set('Origin', origin).set('X-Requested-With', 'XMLHttpRequest').send(body),
});

test('cadastro, aprovação, pedido, proposta, conversa e avaliação persistem com permissões', async () => {
  const pg = new PGlite();
  try {
    for (const file of ['001_initial_schema.sql','002_application.sql','003_future_subscriptions.sql']) {
      await pg.exec(await readFile(new URL(`../database/migrations/${file}`, import.meta.url), 'utf8'));
    }
    await pg.exec(await readFile(new URL('../database/seed.sql', import.meta.url), 'utf8'));
    const app = createApp({ query: (sql, values) => pg.query(sql, values), transaction: fn => pg.transaction(fn) }, { webOrigin: origin });
    const customer = request.agent(app);
    const provider = request.agent(app);
    const stranger = request.agent(app);
    const customerRegister = await mutation(customer).post('/api/auth/register', { name: 'Cliente Teste', email: 'cliente@example.com', password: 'uma senha de teste forte' });
    assert.equal(customerRegister.status, 201, JSON.stringify(customerRegister.body));
    const providerRegister = await mutation(provider).post('/api/auth/register', { name: 'Prestador Teste', email: 'prestador@example.com', password: 'outra senha de teste forte' });
    assert.equal(providerRegister.status, 201, JSON.stringify(providerRegister.body));
    const strangerRegister = await mutation(stranger).post('/api/auth/register', { name: 'Terceiro Teste', email: 'terceiro@example.com', password: 'terceira senha de teste' });
    assert.equal(strangerRegister.status, 201);

    const categories = await customer.get('/api/categories');
    assert.equal(categories.status, 200);
    const serviceId = categories.body.categories[0].service_id;
    const apply = await mutation(provider).post('/api/providers/apply', { publicName: 'João Reparos', bio: 'Instalações e reparos na cidade.', serviceId, startingPrice: 100,
      phone: '86999999999', city: 'Teresina', yearsExperience: 4, weekdays: [1,2,3,4,5], startsAt: '08:00', endsAt: '18:00' });
    assert.equal(apply.status, 201, JSON.stringify(apply.body));
    assert.equal((await customer.get('/api/providers')).body.providers.length, 0);

    await pg.query(`insert into user_roles(user_id,role) values($1,'admin')`, [customerRegister.body.user.id]);
    const rejectedAdmin = await mutation(stranger).patch(`/api/admin/providers/${providerRegister.body.user.id}/verification`, { status: 'verified' });
    assert.equal(rejectedAdmin.status, 403);
    const approved = await mutation(customer).patch(`/api/admin/providers/${providerRegister.body.user.id}/verification`, { status: 'verified' });
    assert.equal(approved.status, 200, JSON.stringify(approved.body));
    assert.equal((await customer.get('/api/providers')).body.providers.length, 1);
    const availability = await mutation(provider).patch('/api/provider/availability', { available: true });
    assert.equal(availability.status, 200);
    assert.equal((await customer.get('/api/providers')).body.providers[0].available, true);
    assert.equal((await mutation(customer).post(`/api/favorites/${providerRegister.body.user.id}`, {})).status, 204);
    assert.deepEqual((await customer.get('/api/favorites')).body.providerIds, [providerRegister.body.user.id]);

    const csrf = await customer.post('/api/requests').send({});
    assert.equal(csrf.status, 403);
    const created = await mutation(customer).post('/api/requests', {
      providerId: providerRegister.body.user.id, serviceId, title: 'Instalar tomada', description: 'Instalar duas tomadas na sala.', urgency: 'today',
      address: { postalCode: '64000000', street: 'Rua A', number: '1', neighborhood: 'Centro', city: 'Teresina', state: 'PI' },
    });
    assert.equal(created.status, 201, JSON.stringify(created.body));
    const requestId = created.body.request.id;
    const inbox = await provider.get('/api/provider/requests');
    assert.equal(inbox.body.requests[0].id, requestId);
    const conversationId = inbox.body.requests[0].conversation_id;
    assert.equal((await stranger.get(`/api/conversations/${conversationId}/messages`)).status, 403);
    const sent = await mutation(customer).post(`/api/conversations/${conversationId}/messages`, { body: 'Pode vir amanhã?' });
    assert.equal(sent.status, 201, JSON.stringify(sent.body));
    assert.equal((await provider.get(`/api/conversations/${conversationId}/messages`)).body.messages.length, 1);

    const illegalQuote = await mutation(customer).post(`/api/requests/${requestId}/quotes`, { description: 'Serviço', laborAmount: 100, materialsAmount: 20 });
    assert.equal(illegalQuote.status, 403);
    const quote = await mutation(provider).post(`/api/requests/${requestId}/quotes`, { description: 'Instalação com material', laborAmount: 100, materialsAmount: 20 });
    assert.equal(quote.status, 201, JSON.stringify(quote.body));
    assert.equal(Number(quote.body.quote.total_amount), 120);
    const accepted = await mutation(customer).post(`/api/quotes/${quote.body.quote.id}/accept`, {});
    assert.equal(accepted.status, 201, JSON.stringify(accepted.body));
    const jobId = accepted.body.job.id;
    const jobDetail = await provider.get(`/api/jobs/${jobId}`);
    assert.equal(jobDetail.body.job.street, 'Rua A');
    assert.equal((await stranger.get(`/api/jobs/${jobId}`)).status, 404);
    assert.equal((await mutation(customer).post(`/api/quotes/${quote.body.quote.id}/accept`, {})).status, 403);
    assert.equal((await mutation(customer).patch(`/api/jobs/${jobId}/status`, { status: 'completed' })).status, 403);
    for (const status of ['provider_en_route','in_progress','completed']) {
      const updated = await mutation(provider).patch(`/api/jobs/${jobId}/status`, { status });
      assert.equal(updated.status, 200, JSON.stringify(updated.body));
    }
    assert.equal((await provider.get(`/api/jobs/${jobId}/history`)).body.history.length, 4);
    assert.equal((await stranger.get(`/api/jobs/${jobId}/history`)).status, 404);
    const review = await mutation(customer).post(`/api/jobs/${jobId}/reviews`, { rating: 5, comment: 'Ótimo serviço' });
    assert.equal(review.status, 201, JSON.stringify(review.body));
    assert.equal((await mutation(customer).post(`/api/jobs/${jobId}/reviews`, { rating: 5 })).status, 409);
    const publicReviews = await customer.get(`/api/providers/${providerRegister.body.user.id}/reviews`);
    assert.equal(publicReviews.body.reviews.length, 1);
  } finally { await pg.close(); }
});
