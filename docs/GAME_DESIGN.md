# Hodný pes: Psí svět — herní design dokument
Verze: 0.1 · Stav: návrh pro postupnou implementaci · Jazyk hry: čeština + připravená lokalizace

## 1. Produktové pilíře
1. **Vztah před výkonem:** pes se učí odměnou, bezpečným opakováním a přestávkami. Frustrace, přetížení nebo nátlak snižují motivaci a důvěru; hra nikdy nepodporuje násilné zacházení.
2. **Přátelské dobrodružství:** semi-cartoon low-poly svět, čitelná silueta psa, teplé světlo a jasné cíle bez dětsky přehnaných efektů.
3. **Sport i hra:** Dog Puller má volný trénink a soutěžní pravidla; soutěžní výsledky jsou oddělené od arkádových odměn.
4. **Poctivé vzdělávání:** vysvětlení ve hře je obecné vzdělávací vodítko, ne náhrada individuálního posouzení trenérem.
5. **Odpovědná propagace:** centrum Hodný pes se nabízí jako další krok, nikoli jako agresivní reklama. Kontakty a rezervace se aktivují až po ověření skutečných oficiálních odkazů a souhlasu centra.

## 2. Platformy a vizuální identita
- React, Next.js App Router, TypeScript, React Three Fiber / Three.js, Supabase, Vercel, GitHub.
- Primární barvy: meruňková **#FFD6A5** a fialová **#6A00F4**. Tmavé plochy #17151D, světlý text #FFFFFF.
- Styl: low-poly / stylizovaný 3D, čisté tvary, kvalitní nasvícení, měkké stíny, přírodní paleta prostředí. Fialová je pro interakce a aktivní stavy, meruňková pro odměny a přátelské zvýraznění.
- Responzivní HUD: klávesnice/myš na desktopu; dotykový joystick a velká akční tlačítka na mobilu; bezpečné okraje a podpora orientace na výšku.
- Adaptivní kvalita: automatický DPR, stíny, počet dekorací a post-processing podle zařízení. Nabídnout ruční nízkou/střední/vysokou kvalitu.
- Přepínatelná kamera třetí a první osoby; první osoba musí zůstat pohodlná a nevyvolávat rychlé pohyby kamery.

## 3. Úvod a výběr psa
- Host může začít bez účtu; při propojení účtu se místní postup bezpečně sloučí pouze po vyřešení konfliktů a potvrzení hráčem.
- Hráč zvolí jméno, plemeno, variantu srsti a doplňky. Začít s menším počtem kvalitních rigovaných modelů a rozšiřovat katalog; cílový katalog 15–20 plemen včetně možnosti křížence.
- Každé skutečně dostupné plemeno musí mít model, rig, animace a validované ID. Nedostupné modely nesmí být prezentovány jako hratelné.
- Po úvodu hráč navštíví bezpečné cvičiště, pozná trenérku a dostane první krátký úkol.

## 4. Atributy psa
Všechny hodnoty jsou v rozsahu 0–100 a musí být vysvětlené hráči:
- **Motivace:** ochota zapojit se; zvyšuje se vhodnou odměnou, hrou a pauzou.
- **Fokus:** schopnost věnovat pozornost; roste krátkými úspěšnými bloky a snižuje se při rušení.
- **Kondice:** sportovní připravenost; obnovuje se odpočinkem, nesmí podporovat přetěžování.
- **Vztah:** kvalita spolupráce; roste konzistentními pozitivními interakcemi.
- **Sebedůvěra:** ochota zkoušet úkoly; roste postupnou obtížností a bezpečným úspěchem.
- **Technika:** herní dovednost v naučených disciplínách; roste praxí a zpětnou vazbou.
Atributy nesmí být skrytým pay-to-win systémem. Kosmetické nákupy výkon nezvyšují.

## 5. Hlavní herní smyčka
Prozkoumej lokaci → vyber krátký cíl → trénuj pomocí pozitivního posilování → přečti si zpětnou vazbu → dopřej psovi odpočinek → získej XP / herní mince / kosmetické odemčení → otevři další výzvu nebo lokaci. Každá aktivita má jasné zahájení, podmínku úspěchu, bezpečné selhání a možnost opakování bez trestu.

## 6. Příběhová kampaň (cílově 8 kapitol)
1. **Nový parťák:** jméno, základní ovládání, první společná procházka, pozitivní odměna.
2. **Základy důvěry:** přivolání, pozornost, odpočinek a čtení signálů psa.
3. **Psí škola:** sedni, lehni, zůstaň, pusť; krátké tréninkové bloky.
4. **Svět plný podnětů:** lesní stezka a park, postupné přidávání rušivých vlivů.
5. **První Puller:** bezpečné seznámení s pomůckou, hra a pravidla bezpečného přerušení.
6. **Sportovní příprava:** disciplíny Running a Jumping, kondice, technika a odpočinek.
7. **Klubová výzva:** vedlejší mise, přátelská soutěž, férové skóre a spolupráce.
8. **Den společného úspěchu:** závěrečná výzva, rekapitulace pokroku a doporučení dalšího tréninku.
Kapitoly mají cíl, 3–5 misí, krátké dialogy, odměny a volitelný vzdělávací tip. Dokončení kampaně nevyžaduje placené předměty.

## 7. Svět a lokace
Hybridní struktura: propojená centrální oblast a samostatné instance disciplín.
- **Cvičiště:** výchozí hub, výcvikové zóny, informační tabule.
- **Park a louky:** procházky, přivolání, hledání předmětů.
- **Lesní stezka:** orientace a postupné zvykání na podněty.
- **Sportovní areál:** Dog Puller Running/Jumping a časované výzvy.
- **Klubovna:** vybavení, rekordy, plán výzev a kosmetika.
- **Výukový kout:** krátké bezpečnostní tipy a vysvětlení pozitivního tréninku.
Počasí, den/noc a další dekorace jsou rozšiřující systémy; nesmí zhoršit stabilní FPS na mobilu.

## 8. Dog Puller
- **Volný trénink:** bez žebříčku, volné házení/chytání, opakování.
- **Running:** jasně definovaný start/cíl, bezpečné návraty a skóre za přesnost / platné pokusy.
- **Jumping:** skoky a technika; body pouze za platný, bezpečně dokončený pokus.
- Další disciplíny lze přidat až po validaci fyziky a pravidel.
- Rozlišit fyziku kruhu, detekci chycení, pokus, skóre a serverové potvrzení výsledku. Klientské eventy nejsou důvěryhodný zdroj soutěžního skóre.
- V soutěžním režimu zobrazit pravidla a upozornění, že herní fyzika je zjednodušená simulace, ne oficiální rozhodčí systém.

## 9. Výzvy, postup a ekonomika
- XP odemyká úrovně a nové výzvy; herní mince se získávají hraním, denními/týdenními úkoly a férovými soutěžemi.
- Denní a týdenní výzvy mají serverově ověřený claim, časové okno a idempotentní zpracování.
- Kosmetický obchod nabízí obojky, postroje, vzhledy Pulleru, dekorace a sezónní balíčky.
- Placené DLC je pouze kosmetické / obsahové bez výhody ve skóre nebo atributech. Nákupy za skutečné peníze přidat až po výběru poskytovatele, právním a věkovém posouzení a testování plateb.
- Bez loot boxů a bez placených mechanismů, které cílí na děti. Veřejné žebříčky umožní přezdívku, soukromí a nahlášení.
- Odměny za úkol musí být uděleny transakčně na serveru; UI nesmí samostatně přičítat cloudové mince.

## 10. Virtuální trenérky
- V první verzi jde o fiktivní postavy, nikoli podobizny konkrétních osob.
- Každá trenérka nabízí krátké dialogy, cíle, nápovědu a pozitivní zpětnou vazbu.
- Texty jsou oddělené od komponent a připravené na češtinu/angličtinu.
- Případné pozdější spojení s reálnými trenérkami vyžaduje jejich výslovný souhlas a schválení centra.

## 11. Propojení s Hodným psem
- Kontextové vzdělávací karty: „Chceš se naučit víc?“ s odkazem na oficiální kurzy.
- Lead formulář sbírá jen nezbytné údaje, s jasným účelem, souhlasem a odkazem na zásady ochrany soukromí.
- Rezervace / e-shop se otevírají na ověřených oficiálních URL; rezervace se nesmí simulovat, pokud neexistuje reálné API nebo odkaz.
- Promo kód je zobrazen pouze pokud jej centrum skutečně schválilo.
- Analytika je minimalizovaná, bez sledování dětí nebo citlivých profilů; marketingový souhlas je oddělený od podmínek hry.

## 12. Multiplayer a sociální funkce
- Veřejné a soukromé místnosti, pozvánky, přátelé, společné volné aktivity.
- Žebříčky jsou podle serverově ověřených výsledků; rate limit, idempotency, anti-replay a validace pravidel.
- Realtime slouží k aktualizaci přítomnosti / událostí, ne jako jediná autorita skóre.
- Ochrana soukromí: blokování a nahlašování, přezdívky místo veřejných e-mailů, minimalizace osobních údajů. Dětská bezpečnost musí být posouzena před veřejným chatem; výchozí volba je bez volného textového chatu.

## 13. Přístupnost a lokalizace
- Čeština je výchozí; angličtina je druhá locale. Všechny UI texty přes překladové klíče.
- Podpora klávesnice, touch, dostatečných kontrastů, popisků tlačítek, redukovaného pohybu a vypnutí zvuku.
- Žádné důležité informace pouze barvou nebo zvukem.
- Respektovat reduced-motion a nastavení hlasitosti.

## 14. Akceptační kritéria prvního hratelného vydání
- Hra se spustí bez účtu; hráč vybere psa a ovládá jej na desktopu i mobilu.
- Kamera třetí osoby a první osoby fungují a nezpůsobují clipping / dezorientaci.
- Nejméně jedna lokace, jedna kompletní výcviková lekce a jedna hratelná disciplína Dog Puller mají start, úspěch, selhání a opakování.
- Přihlášení volitelně propojí profil a serverově ověřený postup; konflikty lokálního postupu jsou vysvětlené.
- Testy ověřují pravidla, odměny, bezpečnost databázových funkcí a základní uživatelské toky.
- Produkční build a nasazení jsou ověřené; chyby jsou zdokumentované. Žádná funkce není označena hotovou jen proto, že existuje tlačítko nebo návrh.
