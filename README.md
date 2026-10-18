# Hodný pes: Psí dobrodružství

Česká 3D webová hra ve vývoji. Projekt používá Next.js App Router, TypeScript, React Three Fiber, Three.js, Supabase Auth/PostgreSQL a Vercel.

## Aktuální stav bez přikrášlování

- 3D cvičiště s procedurálním dočasným modelem psa, pohybem a sledovací kamerou.
- První a třetí osoba, základní dotyková tlačítka a adaptivní profil vykreslování jsou v aktuálním kódu; před označením za hotové je nutné ověřit je v prohlížeči.
- Výběr z 15 plemen je zatím herní profil. Všechna plemena zatím nemají samostatné anatomicky odlišné modely.
- Dog Puller má základní let, gravitaci, odraz, návrat kruhu a detekci přiblížení. Nejde o oficiální soutěžní fyziku ani oficiální skóre.
- Přihlášení, registrace a žádost o obnovu hesla používají Supabase Auth, pokud jsou nastavené veřejné proměnné.
- Založení účtu inicializuje profil, peněženku, postup a nastavení v databázi. Kosmetický nákup má serverovou transakční funkci.
- Tréninkové XP, mince a stav misí v uživatelském rozhraní jsou zatím pouze v paměti relace; nesmí se považovat za cloudový postup.
- Skutečný multiplayer, plná příběhová kampaň, licencované modely, skutečné animace a oficiální soutěže nejsou dokončené.
- Produkční nasazení na commitu 790ab34 bylo READY; novější změny se nasazují automaticky a musí se zkontrolovat samostatně.

## Spuštění lokálně

Požadavky: Node.js 20.9+, npm a Git.

```bash
git clone https://github.com/miroslavmanas94-blip/hodny-pes.git
cd hodny-pes
npm install
cp .env.example .env.local
npm run dev
```

Otevři http://localhost:3000. Bez proměnných Supabase je možné prohlížet lokální 3D scénu, ale cloudové účty a ukládání nejsou dostupné.

## Supabase

Projekt Supabase s názvem hodny-pes už existuje. Nastav v lokálním souboru .env.local a ve Vercel Preview/Production:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Hodnoty najdeš v Supabase → Project Settings → API Keys. Používej pouze publishable/anon klíč v prohlížeči. Nikdy nedávej service_role ani secret key do NEXT_PUBLIC proměnných nebo GitHubu.

Databázové migrace jsou v supabase/migrations. Migrace 202610170001_game_core.sql vytvořila základní schéma; 20261018000000_secure_economy_and_signup.sql přidala inicializaci účtu a bezpečný RPC nákupů; 20261018000100_game_content_seed.sql naplnila katalog kosmetických předmětů a definice misí. Tyto migrace byly aplikovány na propojený projekt Supabase.

Po změně Auth URL konfigurace nastav Site URL na produkční adresu Vercelu a přidej odpovídající redirect URLs pro lokální vývoj a produkci. Heslový reset používá cestu /account/reset.

## Vercel

Repozitář: https://github.com/miroslavmanas94-blip/hodny-pes

Vercel projekt: hodny-pes. Framework musí být Next.js, Root Directory prázdný (kořen repozitáře) a Output Directory automatický — nepřepisovat na public. Po každém commitu ověř stav nasazení a logy.

## Testy a CI

GitHub Actions workflow .github/workflows/quality.yml spouští typecheck, Vitest a produkční build. Samotné přidání workflow není důkazem, že testy prošly; stav kontrol je potřeba ověřit v GitHub Actions.

## Dokumentace

- docs/setup.md — instalace a propojení služeb.
- docs/implementation-status.md — seznam skutečně hotových, částečných a nedokončených funkcí.
