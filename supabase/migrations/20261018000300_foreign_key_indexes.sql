-- Cover foreign keys used by joins and delete cascades.
create index if not exists lobby_members_user_id_idx on public.lobby_members(user_id);
create index if not exists online_lobbies_host_user_id_idx on public.online_lobbies(host_user_id);
create index if not exists player_achievements_achievement_id_idx on public.player_achievements(achievement_id);
create index if not exists player_inventory_item_id_idx on public.player_inventory(item_id);
create index if not exists player_missions_mission_id_idx on public.player_missions(mission_id);
create index if not exists player_trophies_trophy_id_idx on public.player_trophies(trophy_id);
create index if not exists puller_results_dog_id_idx on public.puller_results(dog_id);
create index if not exists puller_results_user_id_idx on public.puller_results(user_id);
