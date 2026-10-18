# Hodný pes: Psí dobrodružství

Responzivní herní prototyp pro prohlížeč, inspirovaný izometrickým ovládáním typu point-and-click. Hráč prozkoumává stylizovaný výcvikový areál, vybírá aktivity, trénuje se psem, stará se o jeho energii a důvěru a postupně odemyká další psí parťáky.

## Aktuální základ

- Šest samostatně tematizovaných lokací: hlavní areál, cvičiště, Dog Puller aréna, čichací zahrada, klidová zóna a psí park.
- Klikání na aktivity přesouvá postavu a psa k cíli a spouští herní akci.
- Mise a odměny: Hafíci, XP, úrovně, důvěra, energie a odemykání psů.
- Každý pes má vlastní uloženou energii, důvěru a zkušenosti.
- Opakování již splněné aktivity poskytne malou zkušenostní odměnu bez opakovaného získání mincí.
- Čeština a angličtina, responzivní desktopové i dotykové rozhraní.
- Místní ukládání postupu v prohlížeči; možnost začít znovu.
- Odkazy na skutečné centrum a e-shop Hodný pes bez rušivých reklam.

## Co zatím není implementované

Přihlášení a účty, cloudová synchronizace, skutečný online multiplayer, sdílené mise, žebříčky, skutečné 3D modely/animace, zvukové soubory a serverové ukládání. Současná mapa je stylizovaná SVG/2D scéna, nikoli plnohodnotný 3D svět. Herní prototyp proto nepředstírá, že online funkce již fungují.

## Technologie

- Next.js App Router
- React 19 + TypeScript
- Lucide icons
- Cloudflare Pages s OpenNext

## Vývoj

Vyžaduje Node.js 20+.

```bash
npm install
npm run dev
```

Kontrola typů:

```bash
npm run typecheck
```

Cloudflare build:

```bash
npx opennextjs-cloudflare build
```

Cloudflare deployment se provádí přes nastavený projekt a jeho build/deploy workflow. Nepovažuj změny v GitHubu za potvrzené nasazení, dokud Cloudflare neoznámí úspěšný build a deployment.

## Designové zásady

- Pozitivní výcvik a důvěra před výkonem.
- Žádné tresty za přestávku ani pay-to-win výhody.
- Bezplatné assety a infrastruktura jako výchozí volba.
- Vlastní herní identita inspirovaná přírodou a přátelským prostředím.
- Značka Hodný pes se propaguje citlivě a obsahuje odkazy na skutečné služby.
