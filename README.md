# Hodný pes: Psí svět

Nově obnovovaný projekt české 3D webové hry o společném dobrodružství člověka a psa. Aktuální verze je **hratelný prototyp první lokace**, nikoli dokončená plná hra.

## Co je v aktuální verzi

- 3D cvičiště renderované pomocí Next.js, React Three Fiber a Three.js.
- Procedurální nízkopolygonový model psa s pohybem, otočením a kamerou.
- Prostor pro volný průzkum, tréninkové značky a režim Dog Puller.
- Sběratelské zářící tlapky; za jejich nalezení se přičítají XP a mince v aktuální herní relaci.
- Přepínání režimů a kamery, české/anglické UI, nápověda a responzivní rozvržení s dotykovými tlačítky.
- Základní endpoint pro kontrolu běhu aplikace: `/api/health`.

## Ovládání

- **W A S D** nebo šipky: pohyb
- **E**: aktivovat hod Dog Puller v režimu Dog Puller
- **R**: návrat na start
- Na telefonu použij směrová tlačítka na scéně.

## Spuštění lokálně

Požadavky: Node.js 20+, npm a Git.

```bash
git clone https://github.com/miroslavmanas94-blip/hodny-pes.git
cd hodny-pes
npm install
cp .env.example .env.local
npm run dev
```

Otevři http://localhost:3000. Hra se spustí i bez Supabase konfigurace; přihlášení a cloudové ukládání zatím nejsou součástí této první hratelné verze.

## Technický základ

- Next.js App Router + TypeScript
- React 19, Three.js, React Three Fiber, Drei
- Barvy značky: `#FFD6A5` a `#6A00F4`
- GitHub Actions ověřuje typecheck a produkční build.
- Vercel projekt a Supabase projekt jsou zachovány, databáze nebyla smazána ani resetována.

## Co ještě není hotové

Plná příběhová kampaň, více lokací, skutečné animace/modely plemen, trvalé ukládání, autentizace, multiplayer, soutěžní pravidla Dog Puller a propojení s rezervacemi/e-shopem musí být implementovány a ověřeny v dalších etapách. Aktuální prototyp nesmí být zaměňován za tyto dokončené funkce.

## Dokumentace

- `docs/GAME_DESIGN.md` — návrh herního obsahu.
- `docs/ARCHITECTURE.md` — cílová technická architektura.
- `docs/implementation-status.md` — původní auditní stav; aktualizovat spolu s dalšími etapami.
- `docs/setup.md` — nastavení služeb.
