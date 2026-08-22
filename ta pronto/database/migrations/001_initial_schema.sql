-- TA PRONTO — modelo base PostgreSQL
-- Compatível com PostgreSQL 15+ e serviços como Supabase/Neon.

begin;

create extension if not exists pgcrypto;

create function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Identidade e acesso -------------------------------------------------------

create table app_users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  phone text,
  full_name text not null,
  avatar_url text,
  document_number text,
  status text not null default 'active' check (status in ('pending', 'active', 'blocked', 'deleted')),
  email_verified_at timestamptz,
  phone_verified_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index app_users_email_unique on app_users (lower(email)) where deleted_at is null;
create unique index app_users_phone_unique on app_users (phone) where phone is not null and deleted_at is null;

create table user_roles (
  user_id uuid not null references app_users(id) on delete cascade,
  role text not null check (role in ('customer', 'provider', 'admin', 'support')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users(id) on delete cascade,
  label text not null default 'Principal',
  postal_code text not null,
  street text not null,
  number text,
  complement text,
  neighborhood text not null,
  city text not null,
  state char(2) not null,
  latitude numeric(9,6),
  longitude numeric(9,6),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index addresses_one_default_per_user on addresses (user_id) where is_default;
create index addresses_location_idx on addresses (city, state, neighborhood);

-- Prestadores e catálogo ----------------------------------------------------

create table provider_profiles (
  user_id uuid primary key references app_users(id) on delete cascade,
  public_name text not null,
  bio text,
  years_experience smallint check (years_experience >= 0),
  service_radius_km numeric(6,2) not null default 10 check (service_radius_km > 0),
  base_latitude numeric(9,6),
  base_longitude numeric(9,6),
  verification_status text not null default 'pending' check (verification_status in ('pending', 'reviewing', 'verified', 'rejected', 'suspended')),
  available_now boolean not null default false,
  rating_average numeric(3,2) not null default 0 check (rating_average between 0 and 5),
  rating_count integer not null default 0 check (rating_count >= 0),
  completed_jobs integer not null default 0 check (completed_jobs >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index provider_profiles_discovery_idx on provider_profiles (verification_status, available_now, rating_average desc);

create table provider_documents (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references provider_profiles(user_id) on delete cascade,
  document_type text not null check (document_type in ('identity', 'cpf', 'address_proof', 'certificate', 'criminal_record', 'other')),
  file_url text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  reviewed_by uuid references app_users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table service_categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references service_categories(id) on delete set null,
  slug text not null unique,
  name text not null,
  description text,
  icon_key text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references service_categories(id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text,
  price_unit text not null default 'quote' check (price_unit in ('quote', 'hour', 'day', 'unit', 'visit')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table provider_services (
  provider_id uuid not null references provider_profiles(user_id) on delete cascade,
  service_id uuid not null references services(id) on delete cascade,
  starting_price numeric(12,2) check (starting_price >= 0),
  price_unit text check (price_unit in ('quote', 'hour', 'day', 'unit', 'visit')),
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (provider_id, service_id)
);

create table provider_availability (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references provider_profiles(user_id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  starts_at time not null,
  ends_at time not null,
  is_active boolean not null default true,
  check (starts_at < ends_at),
  unique (provider_id, weekday, starts_at, ends_at)
);

create table provider_portfolio (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references provider_profiles(user_id) on delete cascade,
  title text,
  description text,
  media_url text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Solicitação, proposta e execução -----------------------------------------

create table service_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references app_users(id) on delete restrict,
  service_id uuid not null references services(id) on delete restrict,
  address_id uuid not null references addresses(id) on delete restrict,
  title text not null,
  description text not null,
  urgency text not null default 'flexible' check (urgency in ('immediate', 'today', 'scheduled', 'flexible')),
  preferred_at timestamptz,
  budget_min numeric(12,2) check (budget_min >= 0),
  budget_max numeric(12,2) check (budget_max >= 0),
  status text not null default 'open' check (status in ('draft', 'open', 'quoted', 'accepted', 'cancelled', 'expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (budget_max is null or budget_min is null or budget_max >= budget_min)
);

create index service_requests_matching_idx on service_requests (service_id, status, created_at desc);

create table request_attachments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references service_requests(id) on delete cascade,
  file_url text not null,
  media_type text not null check (media_type in ('image', 'video', 'document')),
  created_at timestamptz not null default now()
);

create table quotes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references service_requests(id) on delete cascade,
  provider_id uuid not null references provider_profiles(user_id) on delete restrict,
  description text not null,
  labor_amount numeric(12,2) not null default 0 check (labor_amount >= 0),
  materials_amount numeric(12,2) not null default 0 check (materials_amount >= 0),
  platform_fee numeric(12,2) not null default 0 check (platform_fee >= 0),
  total_amount numeric(12,2) generated always as (labor_amount + materials_amount + platform_fee) stored,
  estimated_minutes integer check (estimated_minutes > 0),
  valid_until timestamptz,
  status text not null default 'sent' check (status in ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (request_id, provider_id)
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references service_requests(id) on delete restrict,
  quote_id uuid not null unique references quotes(id) on delete restrict,
  customer_id uuid not null references app_users(id) on delete restrict,
  provider_id uuid not null references provider_profiles(user_id) on delete restrict,
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  status text not null default 'confirmed' check (status in ('confirmed', 'provider_en_route', 'in_progress', 'completed', 'cancelled', 'disputed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index jobs_customer_idx on jobs (customer_id, created_at desc);
create index jobs_provider_idx on jobs (provider_id, created_at desc);

create table job_status_history (
  id bigint generated always as identity primary key,
  job_id uuid not null references jobs(id) on delete cascade,
  status text not null,
  changed_by uuid references app_users(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

-- Comunicação ---------------------------------------------------------------

create table conversations (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references service_requests(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  customer_id uuid not null references app_users(id) on delete restrict,
  provider_id uuid not null references provider_profiles(user_id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (request_id is not null or job_id is not null)
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references app_users(id) on delete restrict,
  message_type text not null default 'text' check (message_type in ('text', 'image', 'location', 'system')),
  body text,
  media_url text,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  check (body is not null or media_url is not null)
);

create index messages_conversation_idx on messages (conversation_id, created_at);

-- Financeiro, reputação e retenção -----------------------------------------

create table payments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete restrict,
  payer_id uuid not null references app_users(id) on delete restrict,
  provider_id uuid not null references provider_profiles(user_id) on delete restrict,
  provider_reference text,
  currency char(3) not null default 'BRL',
  gross_amount numeric(12,2) not null check (gross_amount >= 0),
  platform_fee numeric(12,2) not null default 0 check (platform_fee >= 0),
  provider_amount numeric(12,2) not null check (provider_amount >= 0),
  method text check (method in ('pix', 'credit_card', 'debit_card', 'cash', 'other')),
  status text not null default 'pending' check (status in ('pending', 'authorized', 'paid', 'failed', 'refunded', 'partially_refunded', 'cancelled')),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (provider_amount + platform_fee <= gross_amount)
);

create unique index payments_provider_reference_unique on payments (provider_reference) where provider_reference is not null;

create table payouts (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references provider_profiles(user_id) on delete restrict,
  payment_id uuid not null unique references payments(id) on delete restrict,
  amount numeric(12,2) not null check (amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'processing', 'paid', 'failed', 'cancelled')),
  provider_reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references jobs(id) on delete restrict,
  customer_id uuid not null references app_users(id) on delete restrict,
  provider_id uuid not null references provider_profiles(user_id) on delete restrict,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  provider_reply text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reviews_provider_idx on reviews (provider_id, is_visible, created_at desc);

create table favorites (
  customer_id uuid not null references app_users(id) on delete cascade,
  provider_id uuid not null references provider_profiles(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (customer_id, provider_id),
  check (customer_id <> provider_id)
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on notifications (user_id, read_at, created_at desc);

create table audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references app_users(id) on delete set null,
  entity_type text not null,
  entity_id text not null,
  action text not null,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

-- Atualização automática de updated_at -------------------------------------

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'app_users', 'addresses', 'provider_profiles', 'service_categories',
    'services', 'provider_services', 'service_requests', 'quotes', 'jobs',
    'conversations', 'payments', 'payouts', 'reviews'
  ] loop
    execute format('create trigger %I_set_updated_at before update on %I for each row execute function set_updated_at()', table_name, table_name);
  end loop;
end;
$$;

commit;

