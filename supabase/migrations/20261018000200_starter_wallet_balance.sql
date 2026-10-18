-- A small, non-purchasable starter balance makes the free cosmetic shop usable.
-- Applies only to accounts created after this migration; no existing wallet is altered.
create or replace function public.handle_new_game_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  base_name text;
begin
  base_name := lower(regexp_replace(coalesce(split_part(new.email, '@', 1), 'hrac'), '[^a-z0-9_]', '', 'g'));
  if length(base_name) < 3 then base_name := 'hrac'; end if;
  insert into public.profiles(user_id, username)
  values (new.id, left(base_name, 16) || '_' || substr(replace(new.id::text, '-', ''), 1, 6))
  on conflict (user_id) do nothing;
  insert into public.wallets(user_id, coins) values (new.id, 100) on conflict (user_id) do nothing;
  insert into public.player_progress(user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.game_settings(user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_game_user() from public, anon, authenticated;
