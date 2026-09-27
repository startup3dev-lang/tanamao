begin;

-- Estrutura para uma futura assinatura. Nenhum plano é criado ou cobrado nesta etapa.
create table subscription_plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  monthly_price numeric(12,2) not null check (monthly_price >= 0),
  currency char(3) not null default 'BRL',
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table provider_subscriptions (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references provider_profiles(user_id) on delete restrict,
  plan_id uuid not null references subscription_plans(id) on delete restrict,
  status text not null check (status in ('trialing','active','past_due','cancelled','expired')),
  external_reference text unique,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index provider_subscriptions_provider_idx on provider_subscriptions(provider_id,status);
create trigger provider_subscriptions_set_updated_at before update on provider_subscriptions
  for each row execute function set_updated_at();

commit;
