-- Keep progression and achievements server-owned until verified RPCs are implemented.
revoke insert, update, delete on public.player_progress, public.dog_progress, public.player_missions, public.player_achievements, public.player_trophies from anon, authenticated;
grant select on public.player_progress, public.dog_progress, public.player_missions, public.player_achievements, public.player_trophies to authenticated;
