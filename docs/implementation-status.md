# Stav implementace — Hodný pes: Psí svět

Poslední aktualizace: 2026-10-18

## Implementováno v novém základu

- [x] Obnovený Next.js App Router + TypeScript projekt.
- [x] Responzivní tmavé rozhraní se značkovými barvami `#FFD6A5` a `#6A00F4`.
- [x] Klientská 3D scéna přes React Three Fiber / Three.js.
- [x] Procedurální low-poly pes, travnaté cvičiště, stromy, orientační brána a osvětlení.
- [x] Pohyb WASD/šipkami, hranice lokace, kamera třetí/první osoby a foto režim.
- [x] Sběratelské zářící tlapky, průběžné XP/mince v aktuální relaci.
- [x] Režimy průzkum, trénink a základní interakce Dog Puller.
- [x] Český/anglický přepínač UI, nápověda a dotyková tlačítka.
- [x] `/api/health` endpoint.
- [x] GitHub Actions workflow pro typecheck a produkční build.

## Částečné / prototypové

- Model psa je procedurální blokovací model, nikoli hotový rigovaný model plemene.
- Dog Puller je prototyp interakce, nikoli ověřená soutěžní fyzika nebo oficiální skórování.
- XP, mince a sesbírané tlapky se zatím neukládají trvale.
- Tréninkové značky jsou vizuální prototyp, nikoli kompletní systém lekcí a hodnocení.
- Přepínač jazyka překládá hlavní UI; některé vedlejší popisky zatím zůstávají česky.

## Ještě není implementováno

- Registrace/přihlášení a ukládání do existujícího Supabase projektu.
- Plná 6–8 kapitolová kampaň, mise, více lokací a skutečné odemykání obsahu.
- Plnohodnotné modely 10–15 plemen, rigy, animace a zvuk.
- Skutečný multiplayer, přátelé, lobby, závody a žebříčky.
- Produkční integrace kurzů, rezervací, e-shopu a slev Hodný pes.
- Ověřené mobilní výkonové testy, automatické E2E a přístupnostní audit.

## Ověření

- Změny jsou zapsány do GitHub `main`; aktuální implementační commit: `48db84eeb02ba9047ca53f6bd9700caad25d0f4c`.
- Vercel preview deployment byl vyžádán, ale při poslední kontrole zůstal ve stavu `QUEUED`; build nelze označit za úspěšný, dokud nebude stav `READY` a nebudou zkontrolovány logy.
- GitHub status na posledním commitu ukazoval pouze čekající Vercel check. Typecheck/build proto zatím nejsou označeny jako ověřeně úspěšné.
- Supabase databáze nebyla v této etapě změněna ani resetována.
