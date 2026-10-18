-- Secure account bootstrap and server-authoritative cosmetic purchases.
-- Functions are SECURITY DEFINER only where required, verify auth.uid(), and are not executable by PUBLIC/anon.
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
  insert into public.wallets(user_id, coins) values (new.id, 0) on conflict (user_id) do nothing;
  insert into public.player_progress(user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.game_settings(user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_game_user() from public, anon, authenticated;
drop trigger if exists on_auth_user_created_game_profile on auth.users;
create trigger on_auth_user_created_game_profile after insert on auth.users for each row execute function public.handle_new_game_user();

create or replace function public.buy_cosmetic(p_item_id text, p_idempotency_key text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_price integer;
  v_coins bigint;
  v_existing text;
begin
  if v_user_id is null then raise exception 'Přihlášení je povinné.' using errcode = '28000'; end if;
  if p_item_id is null or length(p_item_id) not between 1 and 80 then raise exception 'Neplatný předmět.' using errcode = '22023'; end if;
  if p_idempotency_key is null or length(p_idempotency_key) not between 8 and 128 then raise exception 'Neplatný identifikátor požadavku.' using errcode = '22023'; end if;
  select reason into v_existing from public.wallet_transactions where user_id = v_user_id and idempotency_key = p_idempotency_key;
  if found then return jsonb_build_object('ok', true, 'status', 'already_processed'); end if;
  select price into v_price from public.inventory_items where id = p_item_id and active = true for share;
  if not found then raise exception 'Předmět není dostupný.' using errcode = 'P0002'; end if;
  if exists (select 1 from public.player_inventory where user_id = v_user_id and item_id = p_item_id) then return jsonb_build_object('ok', true, 'status', 'already_owned'); end if;
  select coins into v_coins from public.wallets where user_id = v_user_id for update;
  if not found then
    insert into public.wallets(user_id, coins) values (v_user_id, 0) on conflict (user_id) do nothing;
    select coins into v_coins from public.wallets where user_id = v_user_id for update;
  end if;
  if v_coins < v_price then return jsonb_build_object('ok', false, 'status', 'insufficient_funds', 'coins', v_coins, 'price', v_price); end if;
  update public.wallets set coins = coins - v_price, updated_at = now() where user_id = v_user_id;
  insert into public.wallet_transactions(user_id, amount, reason, idempotency_key) values (v_user_id, -v_price, 'cosmetic:' || p_item_id, p_idempotency_key);
  insert into public.player_inventory(user_id, item_id, quantity) values (v_user_id, p_item_id, 1) on conflict (user_id, item_id) do nothing;
  return jsonb_build_object('ok', true, 'status', 'purchased', 'item_id', p_item_id, 'price', v_price, 'coins', v_coins - v_price);
end;
$$;
revoke all on function public.buy_cosmetic(text, text) from public, anon;
grant execute on function public.buy_cosmetic(text, text) to authenticated;
