-- ChalkTalk cloud backend — run once in Supabase Dashboard → SQL Editor.
-- Creates: public bucket `chalktalk`, shared_files table, releases table,
-- and the minimal policies the app + website need. Nothing else required.

create extension if not exists pgcrypto;

-- 1) storage bucket (public reads so downloads never fail)
insert into storage.buckets (id, name, public)
values ('chalktalk', 'chalktalk', true)
on conflict (id) do update set public = true;

-- 2) library of files sent from the app
create table if not exists public.shared_files (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null check (kind in ('notes', 'pdf', 'ppt')),
  size_bytes bigint not null default 0,
  storage_path text not null,
  created_at timestamptz not null default now()
);
alter table public.shared_files enable row level security;
drop policy if exists "shared_files public read" on public.shared_files;
create policy "shared_files public read" on public.shared_files
  for select using (true);
drop policy if exists "shared_files anon insert" on public.shared_files;
create policy "shared_files anon insert" on public.shared_files
  for insert with check (true);

-- 3) app releases (single source of truth for website + auto-updater)
create table if not exists public.releases (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  notes text not null default '',
  zip_url text not null,
  sha256 text not null default '',
  size_bytes bigint not null default 0,
  created_at timestamptz not null default now()
);
alter table public.releases enable row level security;
drop policy if exists "releases public read" on public.releases;
create policy "releases public read" on public.releases
  for select using (true);
-- NOTE: no anon insert/update on releases on purpose.
-- Publish new versions from Supabase Dashboard (Table Editor) or with
-- scripts/publish-release.mjs + your SERVICE ROLE key (never the anon key).

-- 4) storage policies for the chalktalk bucket
drop policy if exists "chalktalk public read" on storage.objects;
create policy "chalktalk public read" on storage.objects
  for select using (bucket_id = 'chalktalk');
drop policy if exists "chalktalk anon upload" on storage.objects;
create policy "chalktalk anon upload" on storage.objects
  for insert with check (bucket_id = 'chalktalk');
