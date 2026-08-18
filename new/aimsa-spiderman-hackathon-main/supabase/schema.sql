-- Cohort PCCOE clone — Supabase schema
-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query) once
-- you've created a project. Safe to re-run: uses "if not exists" / "or replace".

create extension if not exists "uuid-ossp";

-- ---------- users ----------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null,
  display_name text not null,
  avatar_url text,
  banner_url text,
  department text,
  role text not null default 'user' check (role in ('user', 'admin')),
  whatsapp text,
  linkedin_username text,
  email text,
  bio text,
  communities_count int not null default 0,
  followers_count int not null default 0,
  following_count int not null default 0,
  flex_count int not null default 0,
  created_at timestamptz not null default now()
);

-- Auto-create a users row when someone signs in with Google for the first time.
create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.users (id, handle, display_name, email, avatar_url)
  values (
    new.id,
    coalesce(split_part(new.email, '@', 1), 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

-- ---------- posts / replies / likes ----------
create table if not exists public.posts (
  id text primary key,
  author_id uuid not null references public.users(id) on delete cascade,
  body text not null,
  mentions text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.replies (
  id text primary key,
  post_id text not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.post_likes (
  post_id text not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- ---------- communities ----------
create table if not exists public.communities (
  id text primary key,
  handle text unique not null,
  name text not null,
  description text,
  department text not null,
  logo_url text,
  banner_url text,
  instagram_url text,
  linkedin_url text,
  member_count int not null default 0,
  is_new boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.community_subscriptions (
  community_id text not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (community_id, user_id)
);

-- ---------- follows ----------
create table if not exists public.follows (
  follower_id uuid not null references public.users(id) on delete cascade,
  followee_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id)
);

-- ---------- connect (encrypted DMs) ----------
create table if not exists public.conversations (
  id text primary key,
  user_a uuid not null references public.users(id) on delete cascade,
  user_b uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id text primary key,
  conversation_id text not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete cascade,
  body_ciphertext text not null,
  sent_at timestamptz not null default now(),
  read_at timestamptz,
  expires_at timestamptz
);

-- ---------- XD (exchange feed) ----------
create table if not exists public.xd_items (
  id text primary key,
  tag text not null,
  media_url text not null,
  source_url text,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  caption text,
  like_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.xd_likes (
  item_id text not null references public.xd_items(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  primary key (item_id, user_id)
);

-- ---------- campus map ----------
create table if not exists public.map_pois (
  id text primary key,
  name text not null,
  category text not null,
  lat double precision not null,
  lng double precision not null,
  description text
);

-- ---------- academic calendar ----------
create table if not exists public.academic_events (
  id text primary key,
  title text not null,
  date date not null,
  type text not null check (type in ('exam', 'holiday', 'deadline', 'event')),
  description text
);

-- ---------- notifications ----------
create table if not exists public.notifications (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null check (type in ('people', 'community', 'mention', 'like', 'reply', 'event')),
  ref_id text,
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

-- ---------- contact ----------
create table if not exists public.contact_messages (
  id text primary key default uuid_generate_v4()::text,
  user_id uuid references public.users(id) on delete set null,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- ======================================================================
-- Row Level Security
-- ======================================================================

alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.replies enable row level security;
alter table public.post_likes enable row level security;
alter table public.communities enable row level security;
alter table public.community_subscriptions enable row level security;
alter table public.follows enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.xd_items enable row level security;
alter table public.xd_likes enable row level security;
alter table public.map_pois enable row level security;
alter table public.academic_events enable row level security;
alter table public.notifications enable row level security;
alter table public.contact_messages enable row level security;

-- Public read access for shared/reference data.
create policy "public read users" on public.users for select using (true);
create policy "public read communities" on public.communities for select using (true);
create policy "public read posts" on public.posts for select using (true);
create policy "public read replies" on public.replies for select using (true);
create policy "public read post_likes" on public.post_likes for select using (true);
create policy "public read community_subscriptions" on public.community_subscriptions for select using (true);
create policy "public read follows" on public.follows for select using (true);
create policy "public read xd_items" on public.xd_items for select using (true);
create policy "public read xd_likes" on public.xd_likes for select using (true);
create policy "public read map_pois" on public.map_pois for select using (true);
create policy "public read academic_events" on public.academic_events for select using (true);

-- Users can only write their own rows.
create policy "users update own row" on public.users for update using (auth.uid() = id);

create policy "insert own posts" on public.posts for insert with check (auth.uid() = author_id);
create policy "insert own replies" on public.replies for insert with check (auth.uid() = author_id);
create policy "manage own likes" on public.post_likes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "manage own subscriptions" on public.community_subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "manage own follows" on public.follows for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);
create policy "manage own xd_likes" on public.xd_likes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Conversations & messages: only the two participants can see/write.
create policy "read own conversations" on public.conversations for select
  using (auth.uid() = user_a or auth.uid() = user_b);
create policy "create own conversations" on public.conversations for insert
  with check (auth.uid() = user_a or auth.uid() = user_b);

create policy "read own messages" on public.messages for select
  using (exists (
    select 1 from public.conversations c
    where c.id = conversation_id and (c.user_a = auth.uid() or c.user_b = auth.uid())
  ));
create policy "send own messages" on public.messages for insert
  with check (auth.uid() = sender_id);
create policy "update own messages read state" on public.messages for update
  using (exists (
    select 1 from public.conversations c
    where c.id = conversation_id and (c.user_a = auth.uid() or c.user_b = auth.uid())
  ));

-- Notifications: only visible to their owner.
create policy "read own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- Contact messages: anyone signed in can submit; nobody can read others'.
create policy "insert own contact message" on public.contact_messages for insert
  with check (auth.uid() = user_id or user_id is null);

-- Enable Realtime on the tables the app subscribes to live.
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.notifications;
