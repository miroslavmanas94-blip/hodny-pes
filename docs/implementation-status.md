# Stav implementace

Aktualizováno: 18. 10. 2026

## Ověřené infrastruktury a databáze
- [x] Repozitář miroslavmanas94-blip/hodny-pes existuje a je propojený s Vercel projektem hodny-pes.
- [x] Dřívější produkční deployment na commitu 790ab34 měl stav READY.
- [x] Supabase projekt hodny-pes je aktivní v regionu eu-west-2.
- [x] V databázi jsou základní tabulky pro profily, psy, postup, mise, inventář, peněženku, výsledky a lobby.
- [x] Bylo ověřeno 5 aktivních kosmetických předmětů, 3 mise, 3 odznaky a 2 trofeje.
- [x] Funkce nákupu je dostupná přihlášeným uživatelům; anonymní uživatel ji spustit nemůže.
- [x] Pomocná SECURITY DEFINER funkce rls_auto_enable není dostupná roli anon.
- [x] Next.js a React byly aktualizovány na bezpečnostně opravené verze.

## Implementováno, ale čeká na end-to-end ověření
- 3D cvičiště s dočasným procedurálním modelem psa.
- Pohyb WASD/šipkami, běh se Shiftem, otáčení kamery tažením myší, kamera první/třetí osoby.
- Dotyková směrová tlačítka, přepnutí kamery a tlačítko pro hod kruhu.
- Základní simulace Puller kruhu: let, gravitace, odraz, návrat a detekce přiblížení.
- Výběr z 15 plemen jako herních profilů; modely zatím nemají skutečně odlišnou anatomii.
- UI registrace, přihlášení, odhlášení, požadavek na reset hesla a stránka pro změnu hesla.
- Vytvoření psa v Supabase a obnovení posledního uloženého psa po přihlášení.
- Cloudový kosmetický katalog, načítání peněženky a vlastněných předmětů, serverový RPC nákup.
- Tréninkové akce, místní skóre, XP a jednorázové odměny v rámci aktuální relace.
- Jednotkové testy pro XP, úrovně, Puller skóre, kontrolu ceny a jednorázovou odměnu jsou napsané.

## Testování a nasazení
- [ ] Vitest nebyl v tomto prostředí skutečně spuštěn.
- [ ] TypeScript kontrola nebyla v tomto prostředí skutečně spuštěna.
- [ ] Aktuální produkční build ještě není potvrzen jako úspěšný; předchozí commity selhávaly po chybném escapování zdrojového souboru. Oprava je v commitu 86b4fea a čeká na výsledek Vercelu.
- [ ] Detailní logy Vercelu nelze přečíst z aktuálního připojení kvůli chybě 403 pro team scope. Stav deploymentů je čitelný.
- [ ] Test registrace, nákupu a obnovení psa s reálným testovacím účtem nebyl proveden.

## Nedokončeno
- Kvalitní licencované GLB modely a rigované animace 15 plemen.
- Plné kolize, skok, sednutí/ležení, přivolání a animace s blendováním.
- Skutečně samostatné lokace otevřeného světa, přechody, dynamické počasí a den/noc.
- Kompletní povely a výcvikové minihry založené na skutečných událostech.
- Soutěžní Puller Running/Jumping s přesnými, ověřenými pravidly a serverově ověřeným skóre.
- Cloudové ukládání a obnova XP, misí, mincí a celé progrese. Místní XP/mince/mise jsou zatím pouze v paměti relace.
- Bezpečné serverové udělování herních odměn a limitování požadavků.
- Skutečný multiplayer, pozvánky, synchronizace polohy a reconnect.
- Trofeje/odznaky propojené s automatickým vyhodnocováním hry.
- Skutečné zvukové soubory, dynamické zvuky prostředí a ovládání hlasitosti.
- E2E testy Playwright a testování na skutečných telefonech/tabletech.
- Ověřený produkční build a kompletní end-to-end testovací průchod.

Tento seznam rozlišuje databázové základy od hotových herních funkcí. Samotná existence tabulky nebo tlačítka není důkazem plné implementace.
