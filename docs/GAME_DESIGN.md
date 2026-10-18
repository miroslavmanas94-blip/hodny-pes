# Hodný Pes Academy — Game Design Document
**Verze:** 1.0 · **Stav:** návrh pro herní studio a implementační plán · **Datum:** 18. 10. 2026

## 1. Executive summary
Hodný Pes Academy je responzivní vzdělávací hra pro web a mobilní prohlížeče, která převádí principy pozitivního výcviku do krátkých interaktivních lekcí. Hráč rozvíjí vztah se psem, učí se číst jeho signály, trénuje základní dovednosti a seznamuje se s Dog Pullerem. Odměny oceňují spolupráci, bezpečí a učení, nikoli výkon za každou cenu. Produkt podporuje značku a služby centra Hodný pes, buduje komunitu a může využívat férový freemium model.

**Produktový slib:** „Učte se spolu. Roste spolu.“  
**Základní smyčka:** vyber lekci → pozoruj psa → zvol reakci → dostaň vysvětlenou zpětnou vazbu → dej pauzu → zaznamenej pokrok → vrať se, až to oběma vyhovuje.

## 2. Vize a pilíře
1. Vztah před výkonem: úspěch znamená bezpečí, dobrovolnou spolupráci a srozumitelnou komunikaci.
2. Pozitivní výcvik bez moralizování: chyba je příležitost zjednodušit úkol.
3. Krátké lekce: 3–8 minut, jasný cíl a doporučená pauza.
4. Férová hra: žádné pay-to-win, odměny za přestávku a žádné trestání za vynechaný den.
5. Přístupnost: mobil-first, ovládání dotykem i klávesnicí, čeština a angličtina.
6. Autentická značka: skutečné prostory, produkty, logo a trenéři se použijí až po schválení vlastníkem práv.

## 3. Cílová skupina a tón
Majitelé psů všech úrovní, rodiny s dětmi od 8 let a začínající či mírně pokročilí trenéři. Tón je respektující, pozitivní, praktický, lehce humorný a nikdy infantilní. Dětské účty vyžadují minimalizaci dat, soukromí ve výchozím stavu a omezení sociálních funkcí.

## 4. Svět a propojení s realitou
- Akademická recepce: onboarding, volba jazyka a psa.
- Výcviková hala: základy poslušnosti, marker a rušivé vlivy.
- Venkovní cvičiště: přivolání, sebedůvěra a práce na vodítku.
- Dog Puller aréna: výukový a tréninkový režim Running a Jumping.
- Klidová zóna: kooperativní péče a bezpečné přerušení.
- Park a běžné prostředí: přenos dovedností do každodenních situací.
- Klubovna: komunitní výzvy, výsledky a kosmetické odměny.

Počáteční verze používá stylizované ilustrace. Rekonstrukce skutečného areálu, fotografie, názvy produktů, 4dox a podoba členů týmu vyžadují dodané podklady a souhlas. Fiktivní trenéři nesmějí být vydáváni za konkrétní reálné osoby.

## 5. Hlavní herní systémy
### 5.1 Editor psa
MVP: jméno, typ/plemeno, základní vzhled. Později: velikost, stavba těla, srst, uši, ocas, oči, znaky, osobnost a doplňky. Mix je plnohodnotná volba. Osobnost upravuje doporučenou obtížnost, nikoli „sílu“ psa nebo trest za citlivost.

### 5.2 Progrese
Oddělené úrovně psa a psovoda. XP se udělují za lekce, reflexi a bezpečnou práci. Návrhová křivka: úrovně 1–5 po 250 XP; 6–15 po 450 XP; vyšší úrovně po 650–1 000 XP. Opakování slouží učení, nikoli nekonečnému farmení. Reset skill tree je bezplatný.

### 5.3 Skill tree
- **Důvěra:** dobrovolný kontakt, bezpečný odchod, práce s pauzou.
- **Komunikace:** marker, načasování odměny, čtení signálů.
- **Sebedůvěra:** průzkum nového povrchu, volba vzdálenosti.
- **Dog Puller:** seznámení s kruhem, motivace, Running a Jumping.
- **Kooperativní péče:** dotyk tlapky, kartáč, krátká kontrola a signál stop.
- **Sociální pohoda:** pozorování z dálky a bezpečné míjení.

### 5.4 Výcvik a načasování
Lekce má cíl, kontext, 1–3 rozhodnutí, okamžitou zpětnou vazbu a doporučenou pauzu. Marker označuje chování co nejblíže okamžiku, kdy nastalo. Při chybě hra vysvětlí alternativu a nabídne snazší variantu; nezahanbuje hráče. Obtížnost zvyšuje vždy jednu proměnnou: vzdálenost, délku, rušení nebo přesnost.

### 5.5 Scénáře problémového chování
Scénáře: tahání na vodítku, štěkání, strach, reaktivita a skákání na lidi. Hráč pozoruje signály, mění prostředí a vzdálenost, posiluje žádoucí chování a může bezpečně odejít. Hra vysvětlí rizika zastrašování, fyzických trestů a nuceného vystavení. Nenahrazuje individuální posouzení kvalifikovaným trenérem nebo veterinárním behavioristou.

### 5.6 Kooperativní péče
Tlapky, kartáčování, uši, zuby a drápky jsou rozděleny na mikrokroky: ukázat pomůcku → dobrovolné přiblížení → krátký dotyk → odměna → pauza. Pes může kdykoliv dát signál k přerušení. Body získává hráč i za rozpoznání nepohody a bezpečné ukončení.

### 5.7 Dog Puller
Disciplíny Running a Jumping mají výuku, trénink a soutěžní simulaci. Hra zdůrazňuje rozcvičení, vhodný povrch, pauzy a přizpůsobení zátěže. Herní simulace není návodem pro reálný sport; pravidla a technické rady před vydáním ověří kompetentní instruktor. Žebříčky používají stejné podmínky a placené položky výsledek nemění.

### 5.8 Volný režim
Pozorovací hry, hledání předmětů, klidné přivolání, volba vhodné vzdálenosti, denní mikroúkoly a sezónní arény. MVP dodá několik opakovatelných interakcí; rozsáhlejší obsah je až následná fáze.

### 5.9 Příběh
Kapitola 1: hráč přichází do akademie, poznává fiktivní trenérku Kláru a svého psa. První quest je pozorování toho, co psovi pomáhá cítit se bezpečně. Další kapitoly otevírají lokality a témata důvěry, péče, prostředí a týmové komunikace.

### 5.10 Sociální vrstva
Přátelé, kluby, sdílení odznaků, komunitní výzvy a žebříčky. Profil je ve výchozím stavu soukromý; poloha se nesdílí. Dětský režim nemá otevřené soukromé zprávy. Před multiplayerem je nutná moderace, nahlášení, blokování a jasná pravidla komunity.

## 6. Player journey
1. **První spuštění:** volba jazyka, filozofie, soukromí a přístupnosti.
2. **Vytvoření psa:** jméno, typ, vzhled a preference.
3. **První úspěch:** pozorování a správné načasování markeru.
4. **První návrat:** doporučená krátká lekce bez agresivních notifikací.
5. **První týden:** důvěra, komunikace, péče a první bezpečné seznámení s Pullerem.
6. **Dlouhodobě:** kapitoly, kluby, kosmetika a sezónní výzvy.
7. **Návrat po pauze:** bez ztráty postupu a bez penalizace za přestávku.

## 7. Klíčové obrazovky
- Dashboard: doporučená lekce, pokrok, denní plán a odměny.
- Onboarding a editor psa.
- Akademie: kategorie, obtížnost, délka a výukový cíl.
- Scénář lekce: pozorování, rozhodnutí, zpětná vazba, pauza a reflexe.
- Profil psa a skill tree.
- Dog Puller aréna: checklist, pokusy, pauzy a výsledky.
- Odměny, kosmetika a pass.
- Komunita: kluby, výzvy, soukromí a moderace.
- Nastavení: jazyk, zvuk, velikost textu, pohyb, notifikace a správa dat.

## 8. Ekonomika a monetizace
Měny: XP pro progres, tlapkové mince pro kosmetiku a odznaky jako trvalé milníky. Základní hra zůstává dlouhodobě zdarma. Příjmy mohou tvořit kosmetika, sezónní pass, tematické balíčky a kosmetické varianty Pullerů či postrojů. Žádné loot boxy, nákup soutěžních výsledků ani placené výhody v žebříčcích. Boostery lze zvažovat pouze v nekompetitivních režimech a bez nátlaku na děti.

| Akce | XP | Mince | Pravidlo |
|---|---:|---:|---|
| První lekce | 80 | 20 | jednorázově |
| Krátká lekce | 40–100 | 5–15 | denní limit |
| Reflexe | 10 | 0 | dobrovolná |
| Týdenní výzva | 150 | 50 | bez streak penalizace |
| Nová kapitola | 200 | 30 | postup příběhem |
| Bezpečná pauza | 20 | 5 | ocenění čtení signálů |

## 9. Ukázkové questy
1. **První společný krok:** dokonči úvodní lekci; 80 XP, 20 mincí a odznak Společná domluva.
2. **Pohled, který říká ahoj:** označ dobrovolný pohled ve třech opakováních; 60 XP.
3. **Víc prostoru, víc klidu:** uprav vzdálenost při signálu nepohody; 90 XP.
4. **Tlapka na pozvánku:** odměň dobrovolné přiblížení k pomůcce; 70 XP.
5. **Kruh bez spěchu:** bezpečné seznámení s Pullerem a pauza; 100 XP.
6. **Čtyři tlapky na zemi:** odměň klidné přivítání; 80 XP.
7. **Klidný pozorovatel:** rozpoznej tři signály psa; 100 XP.
8. **Pauza je taky pokrok:** ukonči scénář podle signálu psa; 40 XP a reflexní odznak.

## 10. Odznaky a skilly
Odznaky: **Společná domluva**, **Klidná tlapka**, **Čtenář psí řeči**, **Mistr načasování**, **Pečující parťák**, **Kruh bez spěchu**, **Odvážný průzkumník**, **Týmová radost**, **Návrat s úsměvem**, **Respekt k hranicím**.

| Větev | Skill | Herní efekt |
|---|---|---|
| Důvěra | Bezpečná základna | odemkne klidovou zónu |
| Komunikace | Přesný marker | zvýrazní vhodný okamžik odměny |
| Sebedůvěra | Volba vzdálenosti | upraví obtížnost scénáře |
| Dog Puller | Seznámení s kruhem | výukový režim bez časového tlaku |
| Péče | Souhlasový signál | bezpečné přerušení péče |
| Sociální pohoda | Klidné míjení | scénáře práce s prostorem |

## 11. Sezóny, eventy a slogany
- Jarní čichací zahrada.
- Týden důvěry.
- Puller Play Days.
- Podzimní stezky.
- Zimní klubovna.
- Akademický festival.
- Slogany: „Vztah na prvním místě“, „Každý pes má svůj příběh“, „Malé kroky. Velké pouto.“

Eventy nikdy nepenalizují vynechaný den a odměny lze získat více způsoby.

## 12. KPI a analytika
S consentem měřit dokončení onboardingu, čas k prvnímu úspěchu, dokončení lekcí, D1/D7/D30 návratnost, použití nápovědy a pauz, výkon zařízení a chybovost. Minimalizovat osobní údaje, poskytovat opt-out a neprovádět experimenty, které by učily nebezpečný výcvik nebo manipulovaly děti.

## 13. Technická doporučení
Frontend: Next.js App Router, TypeScript, React a responzivní CSS. Interaktivní lekce používají datově řízené scénáře a testovatelné stavové přechody. Supabase je cílová vrstva pro Auth, Postgres, Storage a Realtime. RLS na všech exponovaných tabulkách; odměny a měny ověřovat serverově; žádné service-role klíče v klientovi. Guest save musí být jasně označený a při přihlášení bezpečně sloučen. PWA potřebuje verzování cache a strategii aktualizace před zavedením offline režimu. Sociální funkce až po návrhu moderace a dětského soukromí.

## 14. Rizika a mitigace
- Nesprávná kynologická rada: revize kvalifikovaným trenérem.
- Přetížení psa kvůli skóre: pauzy a limity.
- Nepřesné zobrazení značky: schválení skutečným centrem.
- Ochrana dětí: minimální data, soukromí, omezené zprávy a moderace.
- Pay-to-win: kosmetická monetizace a oddělené žebříčky.
- Slabý výkon: lehké assety, lazy loading a testy na telefonech střední třídy.
- Rozsah: prioritizovat MVP a nepředstírat, že návrh je hotová funkce.

## 15. Vývojové fáze
**Fáze 0 — Discovery (1–2 týdny):** rozhovory s centrem, revize výcvikových scénářů, souhlas s assety a schválení vizuálního směru.

**Fáze 1 — MVP (4–8 týdnů, plánovací odhad):** dashboard, onboarding, základní editor psa, 5–8 lekcí, první Dog Puller aréna, XP, odznaky, lokální save, CZ/EN a PWA základ.

**Fáze 2 — Closed beta (3–5 týdnů):** testy s majiteli, úpravy obtížnosti, opt-in analytika, Supabase Auth/cloud save a bezpečnostní audit RLS.

**Fáze 3 — Full launch (8–16 týdnů):** plné moduly, lokality, účty, synchronizace, moderovaná komunita, sezónní obsah a schválené značkové assety.

**Fáze 4 — Live ops:** nové lekce, eventy, kosmetika, obsahové revize, bezpečnostní patche a pravidelné audity.

Odhady jsou plánovací, nikoli garantovaný harmonogram.
