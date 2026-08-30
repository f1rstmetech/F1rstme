-- ===== Run this once in Supabase → SQL Editor → New query =====

create extension if not exists "pgcrypto";

-- Phones table (used for reviews + comparison tool)
create table if not exists phones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  price numeric,
  image_url text,
  display text,
  chipset text,
  ram int,
  storage int,
  battery int,
  camera int,
  score int,
  review text,
  created_at timestamptz default now()
);

-- News posts table
create table if not exists news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tag text,
  excerpt text,
  body text,
  created_at timestamptz default now()
);

-- Single-row settings table (social links + contact info)
create table if not exists site_settings (
  id int primary key default 1,
  instagram_url text,
  youtube_url text,
  contact_email text,
  contact_phone text
);
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ===== Row Level Security: anyone can read, only logged-in admin can write =====

alter table phones enable row level security;
alter table news_posts enable row level security;
alter table site_settings enable row level security;

create policy "Public read phones" on phones for select using (true);
create policy "Admin write phones" on phones for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Public read news" on news_posts for select using (true);
create policy "Admin write news" on news_posts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Public read settings" on site_settings for select using (true);
create policy "Admin write settings" on site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
