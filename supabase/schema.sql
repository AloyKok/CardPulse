create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'event_type') then
    create type event_type as enum (
      'TOURNAMENT',
      'LEAGUE',
      'TRADE_NIGHT',
      'CARD_SHOW',
      'MEETUP'
    );
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'event_status') then
    create type event_status as enum (
      'DRAFT',
      'PUBLISHED',
      'CANCELLED',
      'ARCHIVED'
    );
  end if;
end
$$;

create table if not exists organizers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz,
  venue_address text not null,
  organizer_id uuid references organizers(id),
  event_type event_type not null,
  status event_status not null default 'DRAFT',
  telegram_link text,
  registration_link text,
  admission_time_start time not null,
  admission_time_end time not null,
  admission_fee text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists event_interests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  telegram_user_id text not null,
  created_at timestamptz not null default now(),
  unique (event_id, telegram_user_id)
);

create index if not exists events_start_at_idx on events (start_at);
create index if not exists events_status_idx on events (status);
create index if not exists event_interests_event_id_idx on event_interests (event_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_organizers_updated_at on organizers;
create trigger set_organizers_updated_at
before update on organizers
for each row execute procedure set_updated_at();

drop trigger if exists set_events_updated_at on events;
create trigger set_events_updated_at
before update on events
for each row execute procedure set_updated_at();

alter table organizers enable row level security;
alter table events enable row level security;
alter table event_interests enable row level security;

drop policy if exists "Public organizers are readable" on organizers;
create policy "Public organizers are readable"
  on organizers
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public events are readable" on events;
create policy "Public events are readable"
  on events
  for select
  to anon, authenticated
  using (status = 'PUBLISHED');
