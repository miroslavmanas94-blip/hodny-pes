# Hodný pes: Psí dobrodružství — plán vývoje světa a hry

## Princip
Vývoj po ověřitelných fázích. Každá fáze má vlastní kontrolu na mobilu i počítači. Existující účty, uložené hry, Supabase schéma a klíč lokálního ukládání zůstávají zachované. Produkční změny se posílají na `main`; nasazení považujeme za hotové až po ověření buildu a URL.

## Fáze 1 — Pohyb a základ velkého světa
- Rozšířit 3D terén a rozestupy krajiny.
- Kamera izometricky sleduje hráče při průzkumu.
- Kliknutí do terénu a klávesy WASD/šipky vedou postavu plynulým pohybem místo okamžitého teleportu.
- Zachovat ovládání dotykem a rozložení HUD pro malé obrazovky.
- Kontrola: typy, build, ovládání na desktopu i mobilu.

## Fáze 2 — Odemykatelné oblasti
- Výcvikové centrum a domov od začátku.
- Městský park: úroveň 2.
- Lesní stezka: úroveň 3.
- Tréninková hala: úroveň 4.
- Jezerní údolí: úroveň 5.
- Psí vesnička: úroveň 6.
- Horská vyhlídka: úroveň 8.
- Každá oblast má vlastní barevnost, orientační body a vhodné mise.
- Zamčené oblasti zobrazují požadovanou úroveň a nelze do nich vstoupit předčasně.

## Fáze 3 — Obsah a objevování
- Rozšířit mapu o vedlejší cesty, místa k prozkoumání, sběratelské předměty a krátké výpravy.
- Přidat jasné cíle, které se odhalují postupně; žádné dlouhé povinné čekání.
- Odměny za průzkum: zkušenosti, mince, kosmetika a dekorace.
- Každá oblast získá několik jedinečných úkolů.

## Fáze 4 — Stavba a vylepšování
- Stavět a vylepšovat budovy, cesty, zahradu a tréninková stanoviště.
- Náklady a odměny musí být viditelné před potvrzením.
- Vizuální změny se projeví přímo ve světě.
- Ukládání postupu musí fungovat po obnovení stránky.

## Fáze 5 — Mise, příběh a dlouhodobý postup
- Kapitoly příběhu, denní a týdenní cíle, sbírka odznaků a úrovně dovedností.
- Odemknutí nového obsahu navázat na postup, ne na placení.
- Vyvážit obtížnost a odměny tak, aby se dalo postupovat běžným hraním.

## Fáze 6 — Online svět
- Nejdřív spolehlivá přítomnost přátel a návštěvy oblastí.
- Potom společné výzvy a soutěže.
- Synchronizovaný pohyb a sdílené objekty až po návrhu bezpečného datového modelu a testech souběžného hraní.

## Fáze 7 — Dokončení a kvalita
- Vyladit světla, stíny, vegetaci, cesty, zvuky a animace podle výkonu zařízení.
- Otestovat ukládání, přihlášení, uzamčení oblastí, návrat do hry a mobilní ovládání.
- Ověřit produkční build Cloudflare a otevřít nasazenou URL; samotný push nestačí.

## Stav implementace
- Základní rozšíření 3D prostoru a sledování hráče: implementováno.
- Plynulý pohyb na kliknutí a z kláves: implementováno.
- Tři nové odemykatelné oblasti (jezero, vesnice, hory) s odlišnými 3D prvky: implementováno.
- Další fáze jsou plánované; nepovažují se za hotové, dokud nejsou samostatně implementované a ověřené.
