# Hodný pes: Psí dobrodružství — plán vývoje světa a hry

## Zásady
- Hlavní vizuální styl: Hay Day s realističtějšími detaily, pevná izometrická kamera.
- Zachovat účty, stávající Supabase schéma, lokální klíč `hodny-pes-training-save-v3`, uložené mince, zkušenosti, úrovně, odznaky a historii GitHubu.
- Převádět staré ID lokací na nové místo bez mazání uloženého postupu.
- Produkční změny posílat na `main`; nasazení považovat za hotové až po ověření buildu a produkční URL.
- Multiplayer až po stabilním singleplayeru.

## Nová mapa
- Teleportovací náměstí (hlavní rozcestník s viditelnými 3D portály).
- Psí park.
- Výcvikové centrum Hodný pes.
- Město.
- Dog Puller cvičiště.
- Nosework areál.
- Dogfrisbee park.
- Rozšiřující oblasti: Soutěžní stadion, Tajná dobrodružná oblast, Péče o psa a salon.
- Původní lokace domov, lesní stezka, hala, jezero, vesnice a hory už nejsou samostatnými položkami nové mapy; jejich stará uložená ID se převádějí na odpovídající novou oblast.

## Fáze
1. Stabilizovat 3D vykreslování, pevnou kameru a klikací portály.
2. Dokončit jednotlivé mapy a vizuálně odlišit každou disciplínu.
3. Doplnit skutečné minihry pro Dog Puller, Nosework a Dogfrisbee.
4. Příběhové kapitoly, denní program, postavy a dialogy.
5. Vylepšování pevných budov a volné umisťování dekorací s mřížkou a kontrolou kolizí.
6. Mobilní ovládání: joystick, klepnutí pro pohyb a přehledné ovládací prvky.
7. Testy: přihlášení, migrace starých uložených her, odemykání map, sbírky, mobilní rozložení, build a skutečné Cloudflare nasazení.
8. Multiplayer až po ověření stabilního singleplayeru.

## Průběžný stav
- [x] Přidán nový seznam deseti oblastí a migrace starých ID lokací při načtení uloženého postupu.
- [x] Zavedeno odemykání podle úrovně, počtu dokončených tréninků a mincí.
- [x] Zvýšeny odměny za trénink.
- [x] Přidán výběr psa při prvním spuštění bez staršího uloženého postupu.
- [x] Nová izometrická 3D scéna, oddělené vizuály oblastí a klikací portály na teleportovacím náměstí.
- [x] Přidáno dotykové směrové ovládání a tlačítko návratu na teleportovací náměstí.
- [x] Dogfrisbee výzva používá načasovací minihru jako první hratelný základ.
- [ ] Volné umisťování dekorací a ukládání jejich pozic.
- [ ] Příběhové kapitoly rozšířit o NPC dialogy a navázané odemykání.
- [ ] Spustit typecheck/build, opravit případné chyby a ověřit produkční Cloudflare nasazení.
- [ ] Multiplayer znovu zapnout až po stabilizaci singleplayeru.

Položky označené jako hotové znamenají provedené změny v repozitáři; automatické testy a produkční nasazení zatím nejsou potvrzené.
