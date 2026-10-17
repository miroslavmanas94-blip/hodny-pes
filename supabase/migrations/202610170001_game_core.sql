-- Hodný pes: Psí dobrodružství — foundational schema.
-- All player-owned data is scoped to auth.uid(); economy mutations must be server-authoritative.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (char_length(username) between 3 and 24),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (username)
);
create table if not exists public.dogs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 24),
  breed_id text not null,
  coat_id text not null default 'default',
  accessories jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists dogs_user_id_idx on public.dogs(user_id);
create table if not exists public.player_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  level integer not null default 1 check (level >= 1),
  experience bigint not null default 0 check (experience >= 0),
  unlocked_locations text[] not null default array['training_ground']::text[],
  story_chapter integer not null default 0 check (story_chapter >= 0),
  save_version integer not null default 1,
  updated_at timestamptz not null default now()
);
create table if not exists public.dog_progress (
  dog_id uuid primary key references public.dogs(id) on delete cascade,
  obedience numeric(5,2) not null default 0 check (obedience between 0 and 100),
  speed numeric(5,2) not null default 0 check (speed between 0 and 100),
  stamina numeric(5,2) not null default 0 check (stamina between 0 and 100),
  accuracy numeric(5,2) not null default 0 check (accuracy between 0 and 100),
  recall numeric(5,2) not null default 0 check (recall between 0 and 100),
  puller_skill numeric(5,2) not null default 0 check (puller_skill between 0 and 100),
  updated_at timestamptz not null default now()
);
create table if not exists public.missions (
  id text primary key,
  title text not null,
  description text not null,
  definition jsonb not null default '{}'::jsonb,
  enabled boolean not null default true
);
create table if not exists public.player_missions (
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_id text not null references public.missions(id),
  status text not null default 'available' check (status in ('available','active','completed')),
  progress jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  primary key(user_id, mission_id)
);
create table if not exists public.inventory_items (
  id text primary key,
  name text not null,
  description text not null default '',
  category text not null,
  price integer not null check (price >= 0),
  metadata jsonb not null default '{}'::jsonb,
  active boolean not null default true
);
create table if not exists public.player_inventory (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null references public.inventory_items(id),
  quantity integer not null default 1 check (quantity > 0),
  acquired_at timestamptz not null default now(),
  primary key(user_id, item_id)
);
create table if not exists public.wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  coins bigint not null default 0 check (coins >= 0),
  updated_at timestamptz not null default now()
);
create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount bigint not null check (amount <> 0),
  reason text not null,
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  unique(user_id, idempotency_key)
);
create table if not exists public.achievements (
  id text primary key,
  title text not null,
  description text not null,
  definition jsonb not null default '{}'::jsonb
);
create table if not exists public.player_achievements (
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null references public.achievements(id),
  earned_at timestamptz not null default now(),
  primary key(user_id, achievement_id)
);
create table if not exists public.trophies (
  id text primary key,
  title text not null,
  description text not null default ''
);
create table if not exists public.player_trophies (
  user_id uuid not null references auth.users(id) on delete cascade,
  trophy_id text not null references public.trophies(id),
  earned_at timestamptz not null default now(),
  primary key(user_id, trophy_id)
);
create table if not exists public.puller_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dog_id uuid references public.dogs(id) on delete set null,
  mode text not null check (mode in ('practice','running','jumping')),
  score numeric(10,2) not null check (score >= 0),
  duration_ms integer not null check (duration_ms >= 0),
  details jsonb not null default '{}'::jsonb,
  validated boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists puller_results_leaderboard_idx on public.puller_results(mode, score desc, created_at desc) where validated;
create table if not exists public.game_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{"quality":"auto","sound":true,"camera":"third-person"}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.online_lobbies (
  id uuid primary key default gen_random_uuid(),
  host_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 48),
  activity text not null check (activity in ('walk','training','puller')),
  is_public boolean not null default true,
  max_members integer not null default 8 check (max_members between 2 and 16),
  created_at timestamptz not null default now()
);
create table if not exists public.lobby_members (
  lobby_id uuid not null references public.online_lobbies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key(lobby_id,user_id)
);

-- No client-side writes to wallet balances, transaction history, mission catalog or item catalog.
alter table public.profiles enable row level security;
alter table public.dogs enable row level security;
alter table public.player_progress enable row level security;
alter table public.dog_progress enable row level security;
alter table public.missions enable row level security;
alter table public.player_missions enable row level security;
alter table public.inventory_items enable row level security;
alter table public.player_inventory enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.achievements enable row level security;
alter table public.player_achievements enable row level security;
alter table public.trophies enable row level security;
alter table public.player_trophies enable row level security;
alter table public.puller_results enable row level security;
alter table public.game_settings enable row level security;
alter table public.online_lobbies enable row level security;
alter table public.lobby_members enable row level security;

create policy "profiles readable to signed-in players" on public.profiles for select to authenticated using (true);
create policy "players insert own profile" on public.profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "players update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "dogs read own" on public.dogs for select to authenticated using ((select auth.uid()) = user_id);
create policy "dogs insert own" on public.dogs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "dogs update own" on public.dogs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "dogs delete own" on public.dogs for delete to authenticated using ((select auth.uid()) = user_id);
create policy "progress read own" on public.player_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "progress insert own" on public.player_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "progress update own" on public.player_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "dog stats read through owned dog" on public.dog_progress for select to authenticated using (exists(select 1 from public.dogs d where d.id=dog_id and d.user_id=(select auth.uid())));
create policy "dog stats insert through owned dog" on public.dog_progress for insert to authenticated with check (exists(select 1 from public.dogs d where d.id=dog_id and d.user_id=(select auth.uid())));
create policy "dog stats update through owned dog" on public.dog_progress for update to authenticated using (exists(select 1 from public.dogs d where d.id=dog_id and d.user_id=(select auth.uid()))) with check (exists(select 1 from public.dogs d where d.id=dog_id and d.user_id=(select auth.uid())));
create policy "mission catalog readable" on public.missions for select to authenticated using (enabled);
create policy "player mission read own" on public.player_missions for select to authenticated using ((select auth.uid()) = user_id);
create policy "player mission insert own" on public.player_missions for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "player mission update own" on public.player_missions for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "item catalog readable" on public.inventory_items for select to authenticated using (active);
create policy "inventory read own" on public.player_inventory for select to authenticated using ((select auth.uid()) = user_id);
create policy "wallet read own" on public.wallets for select to authenticated using ((select auth.uid()) = user_id);
create policy "wallet transactions read own" on public.wallet_transactions for select to authenticated using ((select auth.uid()) = user_id);
create policy "achievement catalog readable" on public.achievements for select to authenticated using (true);
create policy "player achievements read own" on public.player_achievements for select to authenticated using ((select auth.uid()) = user_id);
create policy "trophy catalog readable" on public.trophies for select to authenticated using (true);
create policy "player trophies read own" on public.player_trophies for select to authenticated using ((select auth.uid()) = user_id);
create policy "puller results readable" on public.puller_results for select to authenticated using ((select auth.uid()) = user_id or validated);
create policy "puller results insert own unvalidated" on public.puller_results for insert to authenticated with check ((select auth.uid()) = user_id and validated = false);
create policy "settings read own" on public.game_settings for select to authenticated using ((select auth.uid()) = user_id);
create policy "settings insert own" on public.game_settings for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "settings update own" on public.game_settings for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "public lobbies readable" on public.online_lobbies for select to authenticated using (is_public or host_user_id=(select auth.uid()) or exists(select 1 from public.lobby_members m where m.lobby_id=id and m.user_id=(select auth.uid())));
create policy "host creates lobby" on public.online_lobbies for insert to authenticated with check (host_user_id=(select auth.uid()));
create policy "host updates lobby" on public.online_lobbies for update to authenticated using (host_user_id=(select auth.uid())) with check (host_user_id=(select auth.uid()));
create policy "members readable in accessible lobbies" on public.lobby_members for select to authenticated using (user_id=(select auth.uid()) or exists(select 1 from public.online_lobbies l where l.id=lobby_id and (l.is_public or l.host_user_id=(select auth.uid()))));
create policy "join lobby as self" on public.lobby_members for insert to authenticated with check (user_id=(select auth.uid()));
create policy "leave lobby as self" on public.lobby_members for delete to authenticated using (user_id=(select auth.uid()));

-- Public clients cannot mutate economy, official validation, or catalog rows.
revoke insert, update, delete on public.wallets, public.wallet_transactions, public.player_inventory from anon, authenticated;
revoke insert, update, delete on public.inventory_items, public.missions, public.achievements, public.trophies from anon, authenticated;
grant select on public.profiles, public.dogs, public.player_progress, public.dog_progress, public.missions, public.player_missions, public.inventory_items, public.player_inventory, public.wallets, public.wallet_transactions, public.achievements, public.player_achievements, public.trophies, public.player_trophies, public.puller_results, public.game_settings, public.online_lobbies, public.lobby_members to authenticated;
