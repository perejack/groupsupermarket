-- Supabase schema for storing interview applications + admin access
-- Run this in Supabase SQL Editor (it is safe to run multiple times).

create extension if not exists pgcrypto;

-- 1) Main table: applications (all submissions)
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Client-side reference ID (useful for support/debugging)
  application_id text not null,

  -- Job context
  supermarket text not null,
  position text not null,

  -- Applicant info
  full_name text not null,
  email text null,
  phone text not null,
  whatsapp_number text null,
  location text not null,

  -- Preferences
  start_time text not null,
  willing_to_train text not null,
  work_type text not null,
  interview_mode text not null,
  employment_type text not null,
  salary_range text not null,
  education_level text not null,
  experience_level text not null,

  -- Interview booking
  interview_date date not null,
  interview_time text not null,
  contact_method text not null,
  contact_value text not null,

  -- Payment metadata
  mpesa_number text null,
  processing_fee integer null,
  payment_status text null,
  checkout_request_id text null
);

-- Admin tracking fields
alter table public.applications
  add column if not exists replied_at timestamptz null;

alter table public.applications
  add column if not exists forwarded_at timestamptz null;

create index if not exists applications_forwarded_at_idx on public.applications (forwarded_at);

create unique index if not exists applications_application_id_uidx on public.applications (application_id);
create index if not exists applications_created_at_idx on public.applications (created_at desc);
create index if not exists applications_supermarket_idx on public.applications (supermarket);
create index if not exists applications_position_idx on public.applications (position);
create index if not exists applications_phone_idx on public.applications (phone);
create index if not exists applications_whatsapp_number_idx on public.applications (whatsapp_number);
create index if not exists applications_payment_status_idx on public.applications (payment_status);
create index if not exists applications_replied_at_idx on public.applications (replied_at);

-- 2) Admin allow-list: only these auth users can view all applications
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 3) Row Level Security (RLS)
alter table public.applications enable row level security;
alter table public.admin_users enable row level security;

-- Anyone can insert an application (public form)
drop policy if exists "Anyone can submit application" on public.applications;
create policy "Anyone can submit application"
on public.applications
for insert
to anon, authenticated
with check (true);

-- PUBLIC ADMIN DASHBOARD (NOT RECOMMENDED):
-- Anyone with your site link can read all applications.
-- If you want this secured, remove this policy and restore an authenticated-admin-only policy.
drop policy if exists "Admins can view applications" on public.applications;
drop policy if exists "Anyone can view applications" on public.applications;
create policy "Anyone can view applications"
on public.applications
for select
to anon, authenticated
using (true);

-- Allow updates from the admin dashboard UI (used for "Mark as replied").
-- NOTE: This project currently keeps /admin public (anon). This policy means anyone with the link
-- can update rows. If you later secure admin behind auth, replace this with an admin-only policy.
drop policy if exists "Anyone can update applications" on public.applications;
create policy "Anyone can update applications"
on public.applications
for update
to anon, authenticated
using (true)
with check (true);

-- Allow any logged-in user to check if they are an admin (read their own row only)
drop policy if exists "Users can read own admin row" on public.admin_users;
create policy "Users can read own admin row"
on public.admin_users
for select
to authenticated
using (auth.uid() = user_id);

-- 4) Delayed auto-replies (server-side only)
-- Used to send an automatic confirmation email to the applicant after a delay (e.g. 6 hours).
create table if not exists public.pending_auto_replies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  send_at timestamptz not null,
  sent_at timestamptz null,
  status text not null default 'pending',
  last_error text null,
  application_id text null,
  applicant_name text null,
  to_email text not null,
  subject text not null,
  message text not null
);

create index if not exists pending_auto_replies_send_at_idx
  on public.pending_auto_replies (send_at)
  where sent_at is null;

alter table public.pending_auto_replies enable row level security;

-- PUBLIC ADMIN DASHBOARD: allow /admin to read auto-reply status without a token.
drop policy if exists "Anyone can view pending auto replies" on public.pending_auto_replies;
create policy "Anyone can view pending auto replies"
on public.pending_auto_replies
for select
to anon, authenticated
using (true);

-- Inserts/updates remain server-side only (service role from API functions).
