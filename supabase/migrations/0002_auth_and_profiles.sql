-- Adds real accounts on top of Supabase Auth: a profiles table (with
-- role-based access), links inquiries to the user who submitted them, and
-- row-level security so a signed-in user can only ever see their own
-- inquiries while an admin can see everything.
--
-- Run this in the Supabase project's SQL editor after 0001_inquiries.sql.

-- ---------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- security definer so it can read `profiles` even though `profiles` itself
-- has RLS enabled with policies that call this function (avoids recursion).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on profiles for select
  using (public.is_admin());

-- Auto-create a profile row whenever someone signs up. The one email below
-- is granted the admin role automatically on first signup; everyone else
-- starts as a regular user. Promote further admins later with:
--   update profiles set role = 'admin' where email = '...';
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    case
      when new.email = 'shehzaddarbar1996@gmail.com' then 'admin'
      else 'user'
    end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Inquiries: link to the submitting user (nullable, since the inquiry
-- form stays open to signed-out visitors) and lock down reads with RLS.
-- ---------------------------------------------------------------------

alter table inquiries
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create policy "Users can view own inquiries"
  on inquiries for select
  using (auth.uid() = user_id);

create policy "Admins can view all inquiries"
  on inquiries for select
  using (public.is_admin());

-- Lets the public inquiry form insert rows directly with the anon key if
-- ever called from the browser. The app currently inserts server-side with
-- the service role key (which bypasses RLS), so this is a safety net.
create policy "Anyone can submit an inquiry"
  on inquiries for insert
  with check (true);
