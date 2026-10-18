# Hodný pes: Psí svět — technická architektura
Verze: 0.1 · Architektura pro postupnou implementaci

## 1. Principy
- Jedna Next.js aplikace, s 3D klientem izolovaným do client-only komponenty.
- Čistá logika herních pravidel oddělená od React UI, Three.js renderování a Supabase transportu.
- Server/database je autorita pro inventář, peněženku, odměny, žebříčky a soutěžní výsledky.
- Migrace databáze verzované v GitHubu; žádné ruční změny schématu bez migrace.
- Malé vydatelné kroky s testy, preview buildem a ověřeným stavem Vercel.

## 2. Doporučená struktura repozitáře
```
src/
  app/
    page.tsx
    layout.tsx
    account/reset/page.tsx
    api/health/route.ts
  components/
    game/GameCanvas.tsx
    game/Hud.tsx
    game/TouchControls.tsx
    account/AuthPanel.tsx
    dog/DogPicker.tsx
    training/TrainingLesson.tsx
    puller/PullerPanel.tsx
    shop/ShopPanel.tsx
  game/
    core/                 # čistá pravidla, typy, skórování, XP
    data/                 # katalog plemen, mise, překlady
    runtime/              # input, pohyb, kamera, stav disciplín
    three/                # modely, animace, prostředí, LOD
  i18n/
    cs.json
    en.json
  lib/
    supabase/client.ts
    supabase/server.ts
    validation/
    telemetry/
  styles/
supabase/
  migrations/
  seed.sql
docs/
  GAME_DESIGN.md
  ARCHITECTURE.md
  RELEASE_CHECKLIST.md
tests/
  unit/
  integration/
  e2e/
.github/workflows/
  verify.yml
```
Tato struktura je cílový směr, nikoli tvrzení, že všechny soubory už existují. Stávající cesty se přesouvají jen tehdy, když je to přínosné a ověřené testy.

## 3. Herní runtime
- React Three Fiber Canvas se spouští pouze na klientovi; použít Suspense a fallback.
- Modely a textury načítat líně po lokaci; komprimovat glTF (meshopt/Draco dle kompatibility), textury KTX2 pokud pipeline dovolí.
- Instancovat opakované dekorace, používat LOD a omezit dynamické stíny na hlavní objekty.
- Žádné nové objekty/vektory vytvářené bez potřeby v každém snímku; recyklovat pomocné hodnoty.
- Adaptivní DPR a kvalita: detekovat slabý výkon opatrně, dát uživateli ruční přepínač; nevyžadovat WebGPU.
- Vstupní vrstva sjednotí klávesnici, gamepad (volitelné) a dotykové ovládání do akcí pohybu.
- Kamera je samostatný systém s kolizemi a limity; first-person mód nesmí umístit kameru dovnitř geometrie.

## 4. Datový model Supabase (cílový)
Všechny tabulky s uživatelskými daty mají RLS. Níže je cílové schéma; před migrací se musí porovnat s existujícími migracemi a tabulkami, aby nedošlo k duplicitám.

- `profiles`: id = auth.users.id, display_name, locale, created_at, privacy flags.
- `dogs`: id, user_id, name, breed_id, coat_id, cosmetics jsonb (validovaný), created_at, updated_at.
- `dog_stats`: dog_id PK, motivation, focus, stamina, bond, confidence, technique, updated_at; 0–100 check constraints.
- `player_progress`: user_id PK, experience, level, campaign_chapter, updated_at.
- `mission_progress`: user_id, mission_id, status, progress jsonb, completed_at; unique(user_id, mission_id).
- `training_sessions`: id, user_id, dog_id, lesson_id, score, duration_seconds, server_verified, created_at.
- `training_claims`: user_id, command_id, claim_date, reward; unique(user_id, command_id, claim_date).
- `wallets`: user_id PK, coins, updated_at; coins >= 0.
- `inventory_items`: id, name_key, description_key, category, price_coins, active, cosmetic_payload.
- `player_inventory`: user_id, item_id, acquired_at; unique(user_id,item_id).
- `puller_attempts`: id, user_id, dog_id, mode, score, rules_version, valid, created_at.
- `daily_challenges` / `weekly_challenges`: challenge_id, window_start, window_end, config.
- `challenge_claims`: user_id, challenge_id, window_start, reward; unique key to prevent duplicate claims.
- `friendships`: requester_id, addressee_id, status, created_at; unique normalized pair.
- `game_rooms`: id, host_user_id, visibility, status, region, created_at; members table with RLS.
- `leaderboard_entries`: season_id, user_id, category, score, verified_at; writes only via trusted server/database function.
- `lead_submissions`: minimal contact data, explicit consent timestamp, privacy notice version, source campaign; access restricted and retention documented.
- `purchase_receipts`: only if external payments are later implemented; validate provider webhook on server.
- `game_settings`: user_id PK, settings jsonb with schema validation.

Existing tables like `dogs`, `wallets`, `player_progress`, `game_settings`, `inventory_items`, `player_inventory` and RPCs already appear in the current client code. Reconcile the exact current schema before adding or renaming fields.

## 5. Security and database rules
- Browser client uses only Supabase publishable/anon key. Service-role key must never be shipped to client.
- RLS on all user-owned rows; ownership checks use auth.uid().
- No client direct UPDATE of coins, XP, verified score, item ownership, campaign unlocks or daily claims.
- RPC functions validate caller, input bounds, eligibility, cooldown/date window, and idempotency key. Use transactions for wallet + inventory changes.
- Restrict function EXECUTE grants to intended roles. Use fixed search_path for SECURITY DEFINER functions and fully qualify referenced objects.
- Leaderboard submission validates mode, score bounds, attempt timing, rules version, and replay prevention on server/database. Client event payload alone is never trusted.
- Apply rate limits to auth-sensitive and public endpoints. Never expose emails or private profile data in public leaderboards.
- For guest-to-account linking, present merge summary, resolve duplicates, and never overwrite cloud data silently.

## 6. Authentication and guest save
- Optional account: local guest profile is available immediately; sign-up/login via Supabase Auth.
- Cloud save requires authenticated user and RLS.
- Guest merge is an explicit flow with conflict handling and idempotent server transaction. Do not store sensitive data in localStorage.
- Recovery URL must be allowlisted in Supabase Auth and Vercel environment.
- Validate password and error messaging without revealing whether an email exists.

## 7. Multiplayer
Phase 1: server-verified leaderboard only.
Phase 2: private rooms and presence using Supabase Realtime.
Phase 3: public rooms, invitations and friends after moderation / abuse controls.
Realtime broadcasts positions/presence; durable state belongs in tables. Use throttled updates, room membership validation, disconnect cleanup, and server-authoritative result validation. No unrestricted public text chat in the first release; this product may be used by children.

## 8. Localization
Use stable keys such as `ui.play`, `training.recall.title`, `puller.running.instructions`; avoid hard-coded user-facing strings in logic. Czech is default, English is supported via locale selection. Names and user-generated content are not translated automatically.

## 9. Test plan
- Unit: XP/level curves, score calculation, bounds, safe training progression, mission eligibility, idempotency.
- Database integration: RLS owner isolation, anonymous denial, RPC grants, duplicate claims, purchase transaction rollback, non-negative wallet.
- UI: guest start, dog selection, camera toggle, touch controls, auth and recovery, locale toggle, settings persistence.
- E2E: desktop and mobile viewport, one training lesson, one Puller round, account save/restore, shop purchase with test data.
- Performance: measure frame rate on representative low-end mobile, memory after location transitions, bundle size and model loading.
- Release: successful lint/typecheck/unit tests/production build; preview smoke test; only then production promotion.

## 10. Delivery stages
1. Baseline audit: repo, current schema/migrations, deployment and build status.
2. Foundation: coherent design tokens, input abstraction, dog movement and camera, accessible HUD.
3. First playable vertical slice: guest start, dog profile, one training lesson, one Puller mode, reliable feedback.
4. Save and progress: auth, explicit guest merge, server-verified XP/coins/mission claims.
5. Content: more dog models/animations, missions, 8-chapter campaign, multiple zones, localization.
6. Community: verified leaderboards, friends and rooms, abuse controls.
7. Business: verified Hodný pes links, consent-based lead flow, cosmetics/DLC after product/legal review.
8. Stabilization: performance, accessibility, security review, E2E, production release.

## 11. Definition of done
A feature is done only when implementation, error handling, tests and deployment verification exist. A UI control or database table alone is not proof of a complete user-facing feature. Record status as implemented, partially implemented, blocked, or planned.
