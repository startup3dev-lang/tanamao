begin;

create table provider_service_tags (
  provider_id uuid not null references provider_profiles(user_id) on delete cascade,
  label varchar(60) not null,
  normalized_tag varchar(60) not null,
  created_at timestamptz not null default now(),
  primary key (provider_id, normalized_tag),
  check (length(trim(label)) > 0),
  check (length(trim(normalized_tag)) > 0)
);

create index provider_service_tags_search_idx on provider_service_tags (normalized_tag);

commit;
