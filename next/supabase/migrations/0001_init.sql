-- ============================================================================
-- Bin Suleman Real Estate — Supabase initialisation
-- Run this whole file in the Supabase SQL editor (Dashboard → SQL).
-- Idempotent: safe to re-run (seeds use ON CONFLICT DO NOTHING).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Admin membership
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Helper used by RLS: SECURITY DEFINER so policies can't recurse.
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- 2. Listings
-- ---------------------------------------------------------------------------
create table if not exists public.listings (
  id          uuid primary key default gen_random_uuid(),
  ref         text not null,                -- 'A-356', 'F-23+24', '46+47'
  block       text not null,                -- 'A Block', 'M Block'
  title       text not null,                -- 'Plot A-356'
  subtitle    text not null default '',     -- 'Direct plot'
  category    text not null default 'residential plot',
  collection  text not null default 'prism9'
  location    text not null default 'DHA Phase 9 Prism, Lahore',
  demand      bigint check (demand is null or demand > 0),  -- null = On Request
  demand_date date,                         -- displayed as 'DD Mon YYYY'
  is_final    boolean not null default false,
  featured    boolean not null default false,
  description text not null default '',
  published   boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists listings_public_idx
  on public.listings (collection, sort_order) where published;


-- ---------------------------------------------------------------------------
-- 3. Photos (ordered gallery per listing; objects live in the 'listings' bucket)
-- ---------------------------------------------------------------------------
create table if not exists public.listing_photos (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references public.listings(id) on delete cascade,
  storage_path text not null,               -- object path inside the bucket
  alt          text not null default '',
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists listing_photos_idx
  on public.listing_photos (listing_id, position);

-- updated_at maintenance
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists listings_touch on public.listings;
create trigger listings_touch before update on public.listings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.listings       enable row level security;
alter table public.listing_photos enable row level security;
alter table public.admin_users    enable row level security;

drop policy if exists "public reads published" on public.listings;
create policy "public reads published" on public.listings
  for select using (published = true);

drop policy if exists "admin reads all listings" on public.listings;
create policy "admin reads all listings" on public.listings
  for select using (public.is_admin());

drop policy if exists "admin inserts listings" on public.listings;
create policy "admin inserts listings" on public.listings
  for insert with check (public.is_admin());

drop policy if exists "admin updates listings" on public.listings;
create policy "admin updates listings" on public.listings
  for update using (public.is_admin());

drop policy if exists "admin deletes listings" on public.listings;
create policy "admin deletes listings" on public.listings
  for delete using (public.is_admin());

drop policy if exists "public reads photos of published listings" on public.listing_photos;
create policy "public reads photos of published listings" on public.listing_photos
  for select using (exists (
    select 1 from public.listings l
    where l.id = listing_id and l.published = true));

drop policy if exists "admin photo insert" on public.listing_photos;
create policy "admin photo insert" on public.listing_photos
  for insert with check (public.is_admin());

drop policy if exists "admin photo update" on public.listing_photos;
create policy "admin photo update" on public.listing_photos
  for update using (public.is_admin());

drop policy if exists "admin photo delete" on public.listing_photos;
create policy "admin photo delete" on public.listing_photos
  for delete using (public.is_admin());

drop policy if exists "admin reads admins" on public.admin_users;
create policy "admin reads admins" on public.admin_users
  for select using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 5. Storage — public 'listings' bucket
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('listings', 'listings', true)
on conflict (id) do nothing;

drop policy if exists "public reads listing photos" on storage.objects;
create policy "public reads listing photos" on storage.objects
  for select using (bucket_id = 'listings');

drop policy if exists "admin uploads listing photos" on storage.objects;
create policy "admin uploads listing photos" on storage.objects
  for insert with check (bucket_id = 'listings' and public.is_admin());

drop policy if exists "admin updates listing photos" on storage.objects;
create policy "admin updates listing photos" on storage.objects
  for update using (bucket_id = 'listings' and public.is_admin());

drop policy if exists "admin deletes listing photos" on storage.objects;
create policy "admin deletes listing photos" on storage.objects
  for delete using (bucket_id = 'listings' and public.is_admin());

-- ---------------------------------------------------------------------------
-- 6. Realtime — live updates on the public page without rebuild
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime'
                   and schemaname = 'public' and tablename = 'listings') then
    alter publication supabase_realtime add table public.listings;
  end if;
exception when undefined_object then
  null; -- self-hosted / publication absent: client refetches on focus instead
end $$;

-- ---------------------------------------------------------------------------
-- 7. Seed — current live inventory (matches next/src/content/listings.ts)
--    After creating your sign-in user in Dashboard → Authentication → Users,
--    grant admin access with:
--
--      insert into public.admin_users (user_id)
--      values ('<your-user-uuid>')
--      on conflict (user_id) do nothing;
-- ---------------------------------------------------------------------------
insert into public.listings
  (id, ref, block, title, subtitle, category, collection, location,
   demand, demand_date, is_final, featured, published, sort_order)
values
  ('a3560001-0000-4000-8000-000000000001', 'A-356',   'A Block',        'Plot A-356',      'Direct plot',           'residential plot', 'prism9', 'DHA Phase 9 Prism, Lahore', 40000000, '2026-10-05', false, true,  true, 1),
  ('a3560001-0000-4000-8000-000000000002', 'A-1043',  'A Block',        'Plot A-1043',     'Direct plot',           'residential plot', 'prism9', 'DHA Phase 9 Prism, Lahore', 40000000, '2026-10-02', false, false, true, 2),
  ('a3560001-0000-4000-8000-000000000003', 'F-23+24', 'F Block — Pair', 'Plots F-23 + F-24', 'Contiguous plot pair', 'pair plot',        'prism9', 'DHA Phase 9 Prism, Lahore', 90000000, '2026-10-05', false, false, true, 3),
  ('a3560001-0000-4000-8000-000000000004', 'F-820',   'F Block',        'Plot F-820',      'Owner''s final demand', 'residential plot', 'prism9', 'DHA Phase 9 Prism, Lahore', 43500000, '2026-10-02', true,  false, true, 4),
  ('a3560001-0000-4000-8000-000000000005', 'Q-820',   'Q Block',        'Plot Q-820',      'Owner''s final demand', 'residential plot', 'prism9', 'DHA Phase 9 Prism, Lahore', 36000000, '2026-10-02', true,  false, true, 5),
  ('a3560001-0000-4000-8000-000000000006', 'Q-1262',  'Q Block',        'Plot Q-1262',     'Direct plot',           'residential plot', 'prism9', 'DHA Phase 9 Prism, Lahore', 13000000, '2026-11-25', false, false, true, 6),
  ('a3560001-0000-4000-8000-000000000007', 'F-1843',  'F Block',        'Plot F-1843',     'Owner''s final demand', 'residential plot', 'prism9', 'DHA Phase 9 Prism, Lahore', 30500000, '2026-11-22', true,  false, true, 7),
  ('a3560001-0000-4000-8000-000000000008', 'L-1434',  'L Block',        'Plot L-1434',     'Direct plot',           'residential plot', 'prism9', 'DHA Phase 9 Prism, Lahore', 17000000, '2026-11-18', false, false, true, 8),
  ('a3560001-0000-4000-8000-000000000009', '46+47',   'M Block',        'Plots 46 + 47',   'Contiguous pair plots', 'pair plot',        'phase5', 'DHA Phase 5, Lahore',       null,     null,         false, false, true, 1),
  ('a3560001-0000-4000-8000-00000000000a', '180+181', 'M Block',        'Plots 180 + 181', 'Contiguous pair plots', 'pair plot',        'phase5', 'DHA Phase 5, Lahore',       null,     null,         false, false, true, 2)
on conflict (id) do nothing;


