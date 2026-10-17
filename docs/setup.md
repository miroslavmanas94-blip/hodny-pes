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

Bez Supabase proměnných se zobrazí pouze klientská 3D scéna. Cloudové ukládání ani autentizace nejsou v tomto stavu aktivní.

## Supabase
SQL migrace je v `supabase/migrations/202610170001_game_core.sql`. Před nasazením ji zkontroluj a spusť na určeném projektu přes Supabase SQL editor nebo migrace CLI. Ověř RLS a doporučení Security Advisor. Nikdy nedávej service-role/secret klíč do prohlížeče.

Schéma připravuje tabulky pro profily, psy, postup, mise, inventář, měnu, výsledky a lobby. Serverové transakce pro nákupy, udělování odměn a validaci soutěžních výsledků ještě musí být implementovány před produkční ekonomikou.

## Vercel
Propoj repozitář `miroslavmanas94-blip/hodny-pes` s projektem Vercel `hodny-pes`, root directory ponech prázdný. Nastav obě proměnné prostředí pro Preview i Production a proveď deploy. Po nasazení otestuj autentizační redirect URL v Supabase.

## Stav funkcí
- 3D scéna s procedurálním dočasným modelem psa a pohybem: základní prototyp.
- Ovládání: WASD/šipky, Shift běh; zatím bez mobilního joysticku a plnohodnotné kamery první osoby.
- Plemena, příběhové mise, Dog Puller soutěžní pravidla, účty a online multiplayer: nedokončeno.
- Modely a animace: procedurální zástupný obsah, nikoli realistické licencované modely.
