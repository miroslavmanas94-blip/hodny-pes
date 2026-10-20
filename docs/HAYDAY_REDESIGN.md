# Hodný pes: Psí dobrodružství — redesign podle principů Hay Day

**Specifikace uživatele:** 20. 10. 2026  
**Stav:** návrh a bezpečná implementační roadmapa  
**Cíl:** vytvořit vlastní útulnou, barevnou a dlouhodobě hratelnou psí dobrodružnou hru. Inspirace Hay Day se týká především čitelnosti, izometrického světa, přístupného klepacího ovládání, odměňující herní smyčky a postupného odemykání obsahu. Nekopírovat grafické assety, značku ani konkrétní rozhraní Hay Day.

## 1. Potvrzená vize

- **Vizuál:** barevný, přátelský styl inspirovaný Hay Day; detailní, ručně stylizovaný svět.
- **Kamera:** izometrická, vyvýšený šikmý pohled.
- **Kvalita:** vysoký detail prostředí a animací, ale s adaptivním výkonem pro mobil i počítač.
- **Hlavní ovládání:** klepni/klikni na cíl, stanoviště nebo objekt; pohybové prvky jsou doplňkové, ne povinné.
- **Začátek:** hráč nejprve pozná a vybere svého psa, potom vstoupí do prvního tréninku.
- **Budování:** vlastní domov, zahrada, psí akademie a další části areálu.
- **Svět:** několik tematických oblastí odemykaných postupem.
- **Psi:** hlavní parťák plus další trénovatelní psi; každý má vlastní dovednosti, úroveň, energii a vztah.
- **Aktivity:** trénink, příběh a mise, budování, průzkum, sbírky, soutěže, péče, sociální funkce a minihry.
- **Odměny:** herní mince, XP, psi, dekorace, kosmetika, dovednosti a odznaky.
- **Tempo:** krátké čekání. Hráč má mít vždy jinou smysluplnou činnost, pokud něco čeká.
- **Progrese:** kombinace úrovní, misí, herní měny, sbírek a úspěchů.
- **Online:** přítomnost, návštěvy, kooperativní mise, soutěže, přátelé a pozvánky. Tyto funkce se označí jako hotové až po end-to-end ověření.
- **Monetizace:** žádné nákupy za skutečné peníze, žádné reklamy, žádné placené výhody.
- **UI:** moderní prémiový vzhled, čisté panely, výrazná hierarchie, jemné animace a velké dotykové cíle.
- **Zařízení:** mobil i počítač jsou stejně důležité.
- **Důvod návratu:** mise, události, vylepšování akademie, sbírky a nové lokace.
- **UI bez emoji:** používat konzistentní ikony (např. Lucide), vlastní ilustrace a modely, ne emoji znaky.

## 2. Herní smyčka

1. Hráč otevře akademii a uvidí jeden hlavní cíl, stav psa a dostupné aktivity.
2. Klepne na stanoviště nebo úkol; pes se přesune k cíli a objeví se jasná interakce.
3. Dokončí krátkou aktivitu: poslušnost, přivolání, nosework, agility, Dog Puller, triky nebo kvíz.
4. Hra poskytne čitelnou zpětnou vazbu a přiměřené XP, mince, důvěru a pokrok dovednosti.
5. Odměna posune hráče k novému cíli: další úroveň, pes, dekorace, stanice, lokace nebo soutěž.
6. Hráč může utratit získané mince za kosmetiku, dekorace a rozšíření akademie.
7. Péče a odpočinek obnovují energii; žádné trestání za neaktivitu a žádné tvrdé časové zdi.
8. Mise a události obnovují krátkodobé cíle, zatímco příběh, sbírky a rozvoj areálu dávají dlouhodobý cíl.

### Zásady férové progrese

- Odměny se validují podle skutečného výsledku aktivity; opakování nesmí umožnit neomezené farmení mincí.
- Hráč musí mít možnost pokračovat jinou činností, pokud je pes unavený nebo se něco dokončuje.
- Hráč nikdy neztratí psa, uložený postup ani dekorace za neaktivitu.
- Žádné placené zrychlení ani nákup za reálné peníze.
- Každá odemykatelná věc má jasně uvedenou cenu nebo podmínku.

## 3. Oblasti a budování

Základní oblasti:
- **Centrum akademie:** recepce, nástěnka misí, základní poslušnost a přehled pokroku.
- **Domov a zahrada:** péče, odpočinek, výběr psa, dekorace a fotografie.
- **Městský park:** přivolání, chůze kolem rušivých podnětů a průzkum.
- **Lesní stezka:** nosework, pachové stopy a sběratelské nálezy.
- **Tréninková hala:** agility a další technické disciplíny.
- **Dog Puller aréna:** bezpečné minihry a soutěžní výzvy.

Budování začíná malým funkčním areálem. Dekorace se umísťují do povolených míst; funkční stanice se odemykají postupem. V první fázi se použije jednoduchá mřížka/sloty a validace kolizí, nikoli komplikovaný editor terénu.

## 4. Systémy

### Psi a péče
- Katalog plemen a výběr aktivního psa.
- Oddělené XP, úroveň, energie, důvěra a dovednosti každého psa.
- Kosmetické doplňky a odemykatelné animace.
- Krátké interakce péče a odpočinku.
- Získání dalšího psa nesmí resetovat postup předchozího.

### Mise a události
- Hlavní příběhové mise, denní úkoly, týdenní výzvy a sezónní události.
- Každá mise má podmínku, cíl, odměnu a stav.
- Navigace k cíli nesmí misi automaticky dokončit; hráč musí aktivitu opravdu dokončit.
- Události se nejprve implementují jako lokální herní obsah s jasnými pravidly. Časové/online události vyžadují serverovou autoritu.

### Sbírky a odměny
- Odznaky za konkrétní milníky.
- Album psů, kosmetiky a dekorací.
- Viditelný přehled zamčeného obsahu a podmínky odemčení.
- Mince a XP jsou herní zdroje, ne placené produkty.

### Online
- Aktuální Supabase Presence je pouze signál přítomnosti.
- Návštěvy, kooperace, soutěže a přátelé potřebují vlastní datové modely, autorizaci, RLS a serverově validované výsledky.
- Před multiplayerem definovat soukromí, odchod hráče, blokování/nahlášení a ochranu proti podvržení odměn.
- Nepřidávat nové tabulky ani měnit existující schéma, dokud není zjištěn aktuální Supabase stav a navržen bezpečný kompatibilní plán.

## 5. Technické zásady a kompatibilita

- Zachovat Next.js App Router, React, TypeScript, Three.js a OpenNext pro Cloudflare Workers Builds.
- Zachovat Git historii, stávající produkční projekt a jeho konfiguraci.
- Zachovat klíč localStorage `hodny-pes-training-save-v3` a kompatibilitu se stávajícími uloženými daty.
- Nové položky ukládání přidávat jako volitelné, s bezpečnými výchozími hodnotami a validací při načtení.
- Zachovat stávající Supabase schéma i data. Žádné destruktivní SQL ani automatické mazání dat.
- Nepřesouvat tajné klíče do klienta; používat pouze veřejné proměnné určené pro browser.
- Ukládání do `user_metadata` nepovažovat za bezpečné úložiště serverově důvěryhodné ekonomiky nebo soutěžních skóre.
- Respektovat reduced motion, klávesnici, kontrast, bezpečné oblasti mobilních zařízení a přístupné popisky.
- Udržet assety lokální nebo s ověřenou licencí; neodkazovat na neověřené externí obrázky jako na trvalé produkční assety.

## 6. Audit před redesignem (20. 10. 2026)

### Zjištěno v repozitáři
- Produkční větev `main` obsahuje Next.js 15, React 19, TypeScript, Three.js a OpenNext Cloudflare adapter.
- `app/hra/page.tsx` vykresluje `app/TrainingGame.tsx`.
- Hlavní herní komponenta je velmi rozsáhlá a obsahuje více systémů v jedné komponentě.
- `app/ThreeWorld.tsx` vytváří základní izometrickou Three.js scénu; současná geometrie a prostředí jsou převážně jednoduché procedurální tvary.
- Současné CSS vrstvy `training-game.css`, `extreme-redesign.css` a `academy-redesign.css` se překrývají. Redesign musí postupně sjednotit tokeny a odstranit konflikty, ne bezmyšlenkovitě přidávat další přepisovací vrstvu.
- Local save key `hodny-pes-training-save-v3` existuje a načítá/ukládá herní stav.
- Kód ukládá také do Supabase `user_metadata.hodny_pes_save`, pokud je přihlášený uživatel a proměnné prostředí jsou dostupné.
- Realtime Presence kanál `hodny-pes-academy-world` je implementován jako seznam přítomných hráčů; není to plnohodnotná synchronizace herního světa.
- Starší `app/FarmGame.tsx` a `app/Game3D.tsx` zůstávají v repozitáři. Zatím se nemažou.
- `docs/ARCHITECTURE.md`, `docs/GAME_DESIGN.md` a `docs/REBUILD_PLAN.md` obsahují částečně starší nebo rozporné informace. Tento dokument je aktuální specifikace uživatele z 20. 10. 2026.
- Ve zkoumaném rootu nebyla nalezena složka `supabase/`; to samo o sobě nedokazuje, že neexistuje vzdálené schéma. Do databáze se bez samostatného auditu nezasahuje.
- Poslední poskytnutý Cloudflare log ukázal úspěšnou kompilaci Next.js, ale selhání TypeScriptu kvůli chybějícímu importu `Users`. Import byl následně přidán do větve `main`; úspěšný nový build zatím není potvrzen.

### Hlavní rizika
1. Příliš mnoho odpovědností v jednom komponentu zvyšuje riziko regresí a build chyb.
2. Překrývající se CSS může způsobovat rozdílné rozložení na mobilu a desktopu.
3. Lokální pohyb postavy/psa a 3D scéna zatím nejsou plnohodnotný pathfinding systém.
4. Presence nesmí být prezentována jako hotový multiplayer.
5. Cloud save v uživatelských metadatech je vhodný pro prototyp, ne pro autoritativní měnu, soutěže nebo anti-cheat.
6. Vzdálené Supabase schéma/data a skutečný Cloudflare deployment musí být ověřeny samostatně.

## 7. Bezpečné pořadí implementace

### Fáze 0 — audit a build
- Potvrdit stav `main`, poslední commit a Cloudflare build.
- Vytvořit samostatnou větev redesignu.
- Prohlédnout všechny aktivní cesty, uložená data a konfiguraci.
- Zachovat produkční `main` a všechny existující Supabase objekty.

### Fáze 1 — hratelné jádro
- Oddělit typy, definice obsahu a pravidla odměn od UI.
- Upevnit migraci a validaci save dat bez změny klíče.
- Zajistit skutečné klepací ovládání, dosažitelná stanoviště a jasný stav interakce.
- Ověřit, že dokončení aktivity je jediná cesta k odměně.

### Fáze 2 — Hay Day principy v UI a světě
- Jednotná barevná paleta, typografie, komponenty a ikony bez emoji.
- Izometrický svět s jasně odlišnými oblastmi, objekty a interaktivními stanicemi.
- Adaptivní detaily a stíny pro výkon mobilních zařízení.
- Velké dotykové cíle, čisté panely a spodní navigace.

### Fáze 3 — progres a každodenní hraní
- Nástěnka misí, denní/týdenní cíle, události a odznaky.
- Obchod s kosmetikou, sbírka psů a dekorací.
- Rozvoj akademie a péče o více psů.
- Krátké, opakovatelné aktivity bez agresivního čekání.

### Fáze 4 — multiplayer a cloud
- Nejprve audit existujícího Supabase schématu a RLS.
- Navrhnout kompatibilní tabulky/politiky až po potvrzení skutečného stavu.
- Návštěvy a přátelé před kooperativními misemi; soutěže až se serverově ověřeným skóre.
- End-to-end test více účtů a současných relací.

### Fáze 5 — ověření a vydání
- Spustit TypeScript kontrolu a produkční build.
- Ověřit preview na mobilu i desktopu, ukládání po refreshi a migraci starých save dat.
- Ověřit přihlášení, odhlášení a chování bez Supabase proměnných.
- Produkci měnit až po úspěšném buildu a kontrole skutečné URL.
- Nikdy netvrdit, že build, test nebo deployment uspěl, pokud není k dispozici odpovídající výsledek.

## 8. Akceptační kritéria

- [ ] Nový hráč si vybere psa a rozumí prvnímu cíli.
- [ ] Klepnutí na stanici spustí odpovídající aktivitu a na mobilu nic důležitého nepřekrývá.
- [ ] Svět je izometrický, barevný a čitelný; ikony UI neobsahují emoji.
- [ ] Dokončená aktivita změní dovednost, XP, energii, důvěru a odměny podle pravidel.
- [ ] Opakování nedává neomezené mince.
- [ ] Každý pes má samostatný postup.
- [ ] Hráč může odemykat oblasti, dekorace, kosmetiku, dovednosti a odznaky.
- [ ] Budování neztrácí předměty a nepovolí neplatné umístění.
- [ ] Starý save se načte pod klíčem `hodny-pes-training-save-v3`.
- [ ] Žádná změna nesmaže Supabase schéma nebo data.
- [ ] Presence je označená pouze jako přítomnost, dokud není multiplayer dokončen.
- [ ] Build, mobilní ovládání a Cloudflare preview jsou ověřené samostatně.
