# Hodný pes: Psí dobrodružství — Game Design Document

**Verze:** 2.0 · **Stav:** specifikace nové verze · **Rozpočet:** 0 Kč

## 1. Vize
Dlouhodobě rozšiřitelná webová hra pro pejskaře a kynology, jejímž hlavním účelem je propagace výcvikového centra Hodný pes prostřednictvím zábavného a respektujícího zážitku. Vizuální směr je realistický, ale lehce arkádový, s vlastní herní identitou, přírodní zelenou, krémovou a teplými materiály.

Ovládací inspirací je jednoduchost Hay Day: hráč klikne nebo klepne na objekt/aktivitu a postava se psem se přesune k cíli. Hra nekopíruje jeho vizuál ani obsah.

## 2. Herní smyčka
1. Vybrat lokaci.
2. Kliknout/klepnout na aktivitu.
3. Postava a pes se přesunou k cíli.
4. Aktivita udělí zpětnou vazbu, zkušenosti a případnou měnu.
5. Energie psa se upraví podle aktivity; klidová zóna umožňuje obnovu.
6. Postup odemyká další psy, aktivity a vybavení.
7. Opakování splněné aktivity poskytuje malé XP bez dalších mincí.

## 3. Lokace
- **Hlavní areál:** recepce a výchozí bod.
- **Cvičiště:** sedni, čekej, přivolání a pozornost.
- **Dog Puller aréna:** příprava, Running a Jumping.
- **Čichací zahrada:** pachové boxy, stopa a hledání odměny.
- **Klidová zóna:** voda, odpočinek a společná chvíle.
- **Psí park:** průzkum, přivolání a čichací stezka.

Každá lokace má vlastní scénu a aktivity. Současný prototyp používá stylizované 2D/SVG scény, nikoli plnohodnotný 3D svět ani přesnou rekonstrukci skutečného areálu. 3D bude vyhodnoceno po stabilizaci herních systémů a s ohledem na výkon mobilů a bezplatné assety.

## 4. Postava a ovládání
- Člověk a pes tvoří jeden ovládaný tým.
- Desktop: kliknutí na aktivitu.
- Mobil: klepnutí na aktivitu, bez nutnosti klávesnice.
- Postava a pes se vizuálně přesunou k cíli.
- Šest lokací, navigace a panel misí.
- HUD lze skrýt.
- Zachovat přístupné ovládací prvky, viditelný focus a respektovat omezení animací.

## 5. Psi a péče
Počáteční nabídka má 5–8 plemen. Další pes se odemyká podle výcvikového pokroku aktivního psa. Každý pes má vlastní XP/úroveň, energii a důvěru; přepnutí psa nesmí resetovat jeho postup. Získání dalšího psa přidává odpovědnost za péči. V první fázi jsou profily stylizované; propracované modely, srst, anatomie a rozšířené animace jsou pozdější etapa.

## 6. Aktivity a ekonomika
Obsah: pozitivní výcvik a poslušnost, Dog Puller, aportování, čichání, triky, průzkum a péče. Hra používá XP, úrovně centra i psů a měnu Hafíci. První dokončení aktivity uděluje hlavní odměnu; opakování uděluje malé XP bez opakovaných mincí. Obchod odemyká kosmetiku a herní pomůcky za získanou měnu; žádné placené výhody ani pay-to-win.

## 7. Značka Hodný pes
Hra má citlivě představovat pozitivní výcvik, Dog Puller, kurzy, workshopy a skutečný e-shop. Odkazy na oficiální web a obchod neblokují hraní reklamou. Skutečné logo, fotografie, produkty a konkrétní trenéři se použijí jen ze schválených podkladů.

Značkový kontext vychází z veřejného webu [hodnypes.cz](https://www.hodnypes.cz/): pozitivní výcvik, individuální přístup, výcvikové pomůcky, Dog Puller a služby centra. Zeleno-krémová paleta prototypu je návrhová interpretace přírodního a přátelského směru, nikoli tvrzení o oficiálních hex kódech značky.

## 8. Jazyk a nastavení
- Čeština a angličtina s přepínačem.
- Nastavení skrývání HUD a přepínač zvuku.
- Restart vyžaduje potvrzení.
- Zvukové soubory zatím nejsou součástí prototypu.

## 9. Ukládání a online funkce
**Aktuální prototyp:** localStorage v daném prohlížeči, bez účtu a bez synchronizace.
**Plán:** e-mailové přihlášení, cloud save a případně Google/Apple, potom multiplayer pro společný výcvik a soutěže. Před online funkcemi jsou nutné bezpečné ukládání, soukromí, moderace a nástroje pro blokování/nahlášení. Online funkce se nesmí označit za hotové, dokud nejsou ověřené end-to-end.

## 10. Technologie a fáze
- Next.js App Router, React 19, TypeScript.
- Cloudflare Pages + OpenNext.
- Zachovat historii repozitáře a konfiguraci; velké změny nejdřív na samostatné větvi.
- **A:** vlastní rozhraní, lokace, klikací aktivity, local save, jazyk a péče.
- **B:** hlubší lekce, aportování, triky, Dog Puller a opakovatelné výzvy.
- **C:** více plemen, kosmetika, animace, příběh a zvuk.
- **D:** účty, cloud save a multiplayer.
- **E:** vyhodnocení 3D světa a rozšíření map.

## 11. Kritéria hotovosti
Produkční build musí projít; desktop a mobil musí být použitelné; každá lokace musí mít vlastní scénu a aktivity; akce musí měnit polohu, energii, XP a odměny; opakování nesmí farmit mince; každý pes si zachovává svůj postup; local save funguje po refreshi; jazyk a HUD se ukládají; neimplementované funkce jsou jasně označené. Build ani deployment se označí za úspěšné pouze na základě ověřeného výsledku.
