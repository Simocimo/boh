-- Il Cartografo Errante: synchronised saves.
-- Run this once in your Supabase project: Dashboard -> SQL Editor -> New query -> paste -> Run.

create table if not exists public.saves (
  id text not null,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  data jsonb not null,
  updated bigint not null,
  primary key (user_id, id)
);

alter table public.saves enable row level security;

-- Each person sees and changes only their own saves.
drop policy if exists "saves: read own" on public.saves;
drop policy if exists "saves: insert own" on public.saves;
drop policy if exists "saves: update own" on public.saves;
drop policy if exists "saves: delete own" on public.saves;
create policy "saves: read own" on public.saves for select using (auth.uid() = user_id);
create policy "saves: insert own" on public.saves for insert with check (auth.uid() = user_id);
create policy "saves: update own" on public.saves for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "saves: delete own" on public.saves for delete using (auth.uid() = user_id);
