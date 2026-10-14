-- ============================================================================
-- Bin Suleman Real Estate — Blog CMS (blog_posts)
-- Run this whole file in the Supabase SQL editor (Dashboard → SQL).
-- Requires 0001_init.sql (is_admin(), touch_updated_at()) and 0002_grants.sql
-- (table grants pattern, admin bootstrap) to have been run first.
-- Idempotent: safe to re-run any time.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Posts
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,          -- url-safe id, e.g. 'prism-sector-j-vs-c'
  title        text not null,
  category     text not null default 'News',
  excerpt      text not null default '',      -- the text shown on the public card
  body         text not null default '',      -- full article text (card-only UI for now)
  cover_path   text,                          -- object path inside the public 'blog' bucket
  author       text not null default 'Bin Suleman',
  read_time    text not null default '',      -- e.g. '6 min read'
  badge        text not null default '',      -- optional card badge, e.g. 'NEW'
  featured     boolean not null default false,
  published    boolean not null default false,
  sort_order   integer not null default 0,    -- manual override; ties fall back to date
  published_at date,                          -- display date on the card
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists blog_posts_public_idx
  on public.blog_posts (sort_order, published_at desc) where published;

-- updated_at maintenance (same function 0001 defines for listings; declared
-- here too so this file stays self-contained if 0001 is ever re-applied).
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists blog_posts_touch on public.blog_posts;
create trigger blog_posts_touch before update on public.blog_posts
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 2. Row Level Security — same shape as listings (0001)
-- ---------------------------------------------------------------------------
alter table public.blog_posts enable row level security;

drop policy if exists "public reads published posts" on public.blog_posts;
create policy "public reads published posts" on public.blog_posts
  for select using (published = true);

drop policy if exists "admin reads all posts" on public.blog_posts;
create policy "admin reads all posts" on public.blog_posts
  for select using (public.is_admin());

drop policy if exists "admin inserts posts" on public.blog_posts;
create policy "admin inserts posts" on public.blog_posts
  for insert with check (public.is_admin());

drop policy if exists "admin updates posts" on public.blog_posts;
create policy "admin updates posts" on public.blog_posts
  for update using (public.is_admin());

drop policy if exists "admin deletes posts" on public.blog_posts;
create policy "admin deletes posts" on public.blog_posts
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 3. Grants — same pattern as 0002_grants.sql (RLS alone can never produce
--    "permission denied"; PostgREST needs these table privileges).
-- ---------------------------------------------------------------------------
grant select on public.blog_posts to anon;
grant select, insert, update, delete on public.blog_posts to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Storage — public 'blog' bucket for cover images. Storage schema grants
--    come from 0002_grants.sql; row access is guarded by these policies.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('blog', 'blog', true)
on conflict (id) do nothing;

drop policy if exists "public reads blog covers" on storage.objects;
create policy "public reads blog covers" on storage.objects
  for select using (bucket_id = 'blog');

drop policy if exists "admin uploads blog covers" on storage.objects;
create policy "admin uploads blog covers" on storage.objects
  for insert with check (bucket_id = 'blog' and public.is_admin());

drop policy if exists "admin updates blog covers" on storage.objects;
create policy "admin updates blog covers" on storage.objects
  for update using (bucket_id = 'blog' and public.is_admin());

drop policy if exists "admin deletes blog covers" on storage.objects;
create policy "admin deletes blog covers" on storage.objects
  for delete using (bucket_id = 'blog' and public.is_admin());

-- ---------------------------------------------------------------------------
-- 5. Realtime — the public /blog grid refreshes without a rebuild
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime'
                   and schemaname = 'public' and tablename = 'blog_posts') then
    alter publication supabase_realtime add table public.blog_posts;
  end if;
exception when undefined_object then
  null; -- self-hosted / publication absent: client refetches on focus instead
end $$;
