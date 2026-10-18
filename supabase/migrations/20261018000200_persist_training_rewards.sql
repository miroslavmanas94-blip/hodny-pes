-- Persist training rewards with server-side validation and daily idempotency.
create table if not exists public.game_event_claims (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  event_key text not null,
  event_day date not null,
  created_at timestamptz not null default now(),
  primary key (user_id, event_type, event_key, event_day)
);
alter table public.game_event_claims enable row level security;
revoke all on public.game_event_claims from public, anon, authenticated;

create or replace function public.complete_training_command(p_command text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_day date := (now() at time zone 'utc')::date;
  v_claimed text;
  v_experience bigint;
  v_coins bigint;
begin
  if v_user_id is null then
    raise exception 'Přihlášení je povinné.' using errcode = '28000';
  end if;
  if p_command is null or p_command not in ('Sedni','Lehni','Zůstaň','Ke mně','K noze','Čekej','Přines','Pusť','Volno') then
    raise exception 'Neplatný výcvikový povel.' using errcode = '22023';
  end if;

  insert into public.game_event_claims(user_id,event_type,event_key,event_day)
  values (v_user_id,'training',p_command,v_day)
  on conflict do nothing
  returning event_key into v_claimed;

  if v_claimed is null then
    select experience into v_experience from public.player_progress where user_id=v_user_id;
    select coins into v_coins from public.wallets where user_id=v_user_id;
    return jsonb_build_object('status','already_claimed','command',p_command,
      'experience',coalesce(v_experience,0),'coins',coalesce(v_coins,0));
  end if;

  insert into public.player_progress(user_id,experience)
  values (v_user_id,20)
  on conflict (user_id) do update
    set experience=public.player_progress.experience+20, updated_at=now();

  insert into public.wallets(user_id,coins)
  values (v_user_id,5)
  on conflict (user_id) do update
    set coins=public.wallets.coins+5, updated_at=now();

  insert into public.wallet_transactions(user_id,amount,reason,idempotency_key)
  values (v_user_id,5,'training:'||p_command,'training:'||v_day::text||':'||p_command)
  on conflict (user_id,idempotency_key) do nothing;

  select experience into v_experience from public.player_progress where user_id=v_user_id;
  select coins into v_coins from public.wallets where user_id=v_user_id;
  return jsonb_build_object('status','awarded','command',p_command,
    'xp_awarded',20,'coins_awarded',5,'experience',v_experience,'coins',v_coins);
end;
$$;
revoke all on function public.complete_training_command(text) from public, anon;
grant execute on function public.complete_training_command(text) to authenticated;
