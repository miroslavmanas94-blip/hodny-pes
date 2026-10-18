# Nastavení a spuštění

## Požadavky
- Node.js 20.9 nebo novější
- npm
- Git

## Lokální spuštění
1. Naklonuj repozitář.
2. Spusť `npm install`.
3. Zkopíruj `.env.example` na `.env.local`.
4. Vyplň `NEXT_PUBLIC_SUPABASE_URL` a `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` z projektu Supabase.
5. Spusť `npm run dev` a otevři http://localhost:3000.

Bez proměnných Supabase se zobrazí 3D scéna a místní tréninkové obrazovky, ale přihlášení, cloudový katalog a cloudové ukládání nejsou dostupné. Místní XP, mince a mise se záměrně nesmějí vydávat za cloudový postup.

## Supabase
Použij existující projekt hodny-pes v regionu eu-west-2. SQL migrace v `supabase/migrations` jsou uloženy ve stejném repozitáři. Základní schéma, inicializace hráče, katalog a funkce nákupu byly aplikovány do připojeného projektu.

Proměnné pro Vercel nastav v Project Settings → Environment Variables pro Production a Preview. Používej pouze publishable klíč v klientovi. Nikdy nevkládej service_role/secret klíč do `NEXT_PUBLIC_*` proměnné.

V Supabase → Authentication → URL Configuration nastav:
- Site URL na produkční adresu aplikace.
- Redirect URLs pro produkční doménu a lokální vývoj.
- Obnovu hesla na cestu `/account/reset`.

### Co dělá databáze
- Při registraci vytvoří profil, peněženku se startovními 100 mincemi, postup a herní nastavení.
- Katalog kosmetických předmětů a misí je seedovaný daty.
- `buy_cosmetic` ověřuje přihlášení, aktuální cenu, vlastnictví a zůstatek a zapisuje peněženku, inventář a transakci v jedné databázové transakci.
- Klient nemá přímé oprávnění upravovat peněženku ani katalog.
- Místní odměny z tréninkových tlačítek nejsou zatím propojené se serverovým udělováním mincí nebo XP.

## Vercel
Repozitář: https://github.com/miroslavmanas94-blip/hodny-pes

Projekt Vercel: hodny-pes. Framework musí být Next.js, Root Directory prázdný a Output Directory automatický — nepřepisovat na `public`. Po každém commitu ověř poslední deployment a build logy. Nástroj v této relaci dokáže vypsat stav deploymentu, ale detailní logy aktuálně blokuje oprávnění Vercel team scope.

## Testy
`npm test` spouští Vitest. `npm run typecheck` provádí kontrolu TypeScriptu a `npm run build` produkční build. GitHub Actions workflow je připraven, ale stav jeho běhu je nutné ověřit v GitHub Actions; žádný test se nesmí označit za úspěšný, pokud se skutečně nespustil.

## Stav funkcí
- 3D cvičiště s procedurálním modelem, pohybem, první/třetí osobou, myší a dotykovými tlačítky: implementováno, vyžaduje ověření v prohlížeči.
- Registrace/přihlášení/obnova hesla: UI a Supabase volání implementováno, end-to-end ověření chybí.
- Vytvoření a obnova profilu psa: cloudový zápis/čtení implementován, vyžaduje ověření s reálným účtem.
- Kosmetický obchod: databázový katalog a bezpečná nákupní funkce implementovány; UI propojeno, vyžaduje ověření s přihlášeným testovacím účtem.
- Psí škola a místní mise: základní UI; odměny jsou pouze v relaci.
- Puller: základní fyzika kruhu, nikoli oficiální soutěžní systém.
- Online multiplayer, plynulá synchronizace, kompletní příběh, realistické rigované modely, zvuky, dynamické počasí/den-noc: nedokončeno.
