-- Run this in the Supabase project's SQL editor once to create the table
-- that stores website-build inquiries.

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new',
  name text not null,
  email text not null,
  phone text,
  project_name text,
  project_type text not null default 'Not sure',
  budget text not null default 'Not sure',
  timeline text not null default 'Not sure',
  ai_features text[] not null default '{}',
  description text not null
);

create index if not exists inquiries_created_at_idx
  on inquiries (created_at desc);

-- Row Level Security is enabled with no policies, so only requests using
-- the service role key (server-side only, via SUPABASE_SERVICE_ROLE_KEY)
-- can read or write this table. Do not add a public/anon policy here.
alter table inquiries enable row level security;
