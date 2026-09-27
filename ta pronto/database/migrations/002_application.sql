begin;

alter table app_users add column password_hash text;

alter table provider_profiles
  add column city text not null default 'Teresina',
  add column state char(2) not null default 'PI';

create table auth_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index auth_sessions_user_idx on auth_sessions(user_id);
create index auth_sessions_expiry_idx on auth_sessions(expires_at);

alter table service_requests
  add column target_provider_id uuid references provider_profiles(user_id) on delete restrict;
alter table service_requests drop constraint service_requests_urgency_check;
alter table service_requests add constraint service_requests_urgency_check
  check (urgency in ('immediate','today','tomorrow','this_week','scheduled','flexible'));
create index service_requests_target_idx on service_requests(target_provider_id, status, created_at desc);

create unique index conversations_request_provider_unique
  on conversations(request_id, provider_id) where request_id is not null;

commit;
