# Hodný pes: Psí dobrodružství — bezpečný plán a specifikace

## Závazná specifikace z odpovědí uživatele
- **Název:** Hodný pes: Psí dobrodružství.
- **Publikum a účel:** pejskaři a kynologové; propagace značky Hodný pes bez rušivých reklam.
- **Vizuál:** od nuly, přírodní a přátelský; realistický, ale mírně arkádový. Vlastní herní identita; barvy mají vycházet ze skutečného webu značky.
- **Jazyk:** čeština a angličtina s přepínačem.
- **Svět:** středně velký výcvikový areál, několik lokací, každá s vlastní mapou. Izometrická kamera shora.
- **Postava a ovládání:** člověk se psem; pohyb kliknutím/klepnutím na cíl jako v Hay Day, včetně mobilního rozhraní.
- **Psi:** začít s 5–8 plemeny; další psy odemykat po tréninkovém pokroku prvního psa. Každý pes má vlastní pokrok a vyžaduje péči.
- **Aktivity:** poslušnost, Dog Puller, aportování, čichání, triky, péče, průzkum a další kvalitně proveditelné aktivity. Různé psí animace a úpravy mají postupně přibývat.
- **Mise:** lehký příběh, běžné mise i opakovatelné výzvy; jasně viditelný cíl; odměny kombinující XP, úrovně, měnu a odemykatelný obsah.
- **Rozhraní:** hlavní menu s velkou ilustrací a tlačítkem Hrát; HUD lze skrýt/nastavit; mapa a navigace k aktivnímu cíli; obchod s odemykatelnými předměty.
- **Multiplayer:** cílem jsou společné mise a výcvik s ostatními hráči.
- **Ukládání a účty:** bezpečné lokální i cloudové ukládání; nejprve e-mail, Google/Apple až později.
- **Web:** úplná prezentace hry a značky, odkazy na skutečný výcvik bez agresivní reklamy.
- **Zvuk/prostředí:** zvukové efekty, hudba s možností vypnutí, stálé denní světlo.
- **Obtížnost:** realistická, ale bez frustrace; do první verze dostat maximum kvalitně dokončených funkcí.
- **Technologie a cena:** zachovat Next.js a stávající Cloudflare projekt; rozpočet 0 Kč; dlouhodobě rozšiřitelná architektura.

## Audit aktuálního repozitáře
- Repozitář: https://github.com/miroslavmanas94-blip/hodny-pes
- Pracovní větev: `rebuild/psie-dobrodruzstvi-foundation`
- Pull request: https://github.com/miroslavmanas94-blip/hodny-pes/pull/1
- `main` zůstává beze změny, aby se nepřepsal produkční web bez kontroly.
- Základ je klientská hra v Next.js s 6 tematickými scénami, SVG krajinou, aktivitami, odměnami, XP, lokálním ukládáním, přepínačem jazyka a základním systémem psů.
- Aktuální scény jsou stylizované 2D/SVG, nikoli plnohodnotný 3D svět.
- Ukládání je jen v localStorage. Účty, cloud sync, multiplayer a zvukové soubory nejsou zapojené.
- Build workflow dříve skončil úspěšně pro commit `2dbb5ddf765bb16c852bc65fe30479b5a34bbb42`; jde o typovou kontrolu/build, nikoli o důkaz funkčnosti hry v prohlížeči.

## Bezpečný postup
1. Pracovat na samostatné větvi a zachovat historii; nemazat produkční data, Supabase schéma ani nastavení Cloudflare.
2. Nejprve opravit a zpřesnit hratelné jádro: cíl mise naviguje na místo, neoznačí misi automaticky jako splněnou; ovládání a stav hry musí být srozumitelné.
3. Dokončit jednotlivé herní smyčky, odměny, ekonomiku, obchod, péči o více psů, přístupnost a CZ/EN.
4. Přidat skutečné bezplatné zvukové assety a ovládání zvuku až po ověření licencí a funkčnosti.
5. Navrhnout přihlášení e-mailem a bezpečné cloudové ukládání; tajné klíče nesmějí být v klientovi.
6. Multiplayer až po serverově ověřeném postupu, identitě hráče, synchronizaci a základní moderaci.
7. Spustit automatické kontroly, potom samostatně ověřit preview v desktopovém a mobilním prohlížeči.
8. Produkci nasadit až po úspěšném preview a kontrole skutečné URL. Bez důkazu neoznačovat deployment za hotový.

## Stav implementace
### Základ je v repozitáři
- Nový přírodní vizuální systém a vlastní identita.
- Šest tematických lokací a klikací/klepací aktivity.
- Základní mise, XP, měna Hafíci, důvěra a energie.
- Základní roster psů s odemykáním podle úrovně a oddělenými statistikami.
- Lokální ukládání, CZ/EN, základní nastavení HUD a panel obchodu.
- Navigace k dalšímu cíli je upravena tak, aby cíl pouze označila a přesunula hráče; aktivitu musí hráč spustit samostatně.

### Ještě není dokončeno / ověřeno
- Plnohodnotná 3D izometrická hra a bohaté psí animace.
- Samostatně propracované mapy a hlubší herní smyčky pro všechny aktivity.
- Skutečné zvukové soubory a hudba.
- Účty, cloudové ukládání a synchronizace.
- Online kooperativní multiplayer.
- Kompletní marketingová prezentace mimo samotnou hru.
- Ruční testování hraní, ovládání na mobilu a skutečného Cloudflare preview.
- Produkční nasazení.

## Kritéria dalšího ověření
- [ ] Nový hráč projde onboardingem.
- [ ] Cíl mise naviguje do správné lokace a označí aktivitu, ale sám ji nesplní.
- [ ] Aktivita upraví energii, XP, měnu a stav dokončení správně.
- [ ] Pes s nízkou energií je přesměrován na odpočinek.
- [ ] Opakování nedává znovu stejné mince.
- [ ] Odemknutí dalšího psa i péče o něj fungují.
- [ ] Obchod nedovolí záporný zůstatek ani dvojitý nákup.
- [ ] CZ/EN, HUD a ukládání fungují po obnovení stránky.
- [ ] Preview je ověřeno na desktopu i mobilu před produkčním nasazením.
