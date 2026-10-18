# Stav implementace

Aktualizováno: 18. 10. 2026

## Ověřené základy
- Repo miroslavmanas94-blip/hodny-pes existuje a je propojené s Vercel projektem hodny-pes.
- Produkční deployment na commitu 790ab34 má stav READY.
- Supabase projekt hodny-pes je aktivní v regionu eu-west-2.
- Základní databázové tabulky a RLS byly nasazeny.
- Next.js a React byly aktualizovány na bezpečnostně opravené verze.
- Lokální instalace, testy a build nebyly spuštěny v tomto prostředí; úspěch se proto netvrdí.

## Částečně implementováno
- 3D cvičiště a procedurální zástupný model psa.
- Základní pohyb WASD/šipkami a sledovací kamera.
- Výběr aktivit: svět, psí škola, Puller.
- Základní SQL model profilů, psů, postupu, misí, inventáře, měny, výsledků a lobby.
- Deterministické pomocné funkce pro XP, úrovně, skóre Pulleru, kontrolu ceny a jednorázovou odměnu.

## Není dokončeno
- Kvalitní licencované GLB modely a skutečné rigované animace 15 plemen.
- Plná první osoba, dotykový joystick a mobilní akční tlačítka.
- Serverové RPC pro nákupy a udělování odměn, zabezpečený cloudový save.
- Kompletní autentizační UI a obnova hesla.
- Funkční více-lokační otevřený svět, příběhová kampaň, dialogy a všechny povely.
- Fyzikální Puller s plnou validací pokusů.
- Online multiplayer, synchronizace polohy a serverově ověřené soutěže.
- Zvukové soubory, dynamické počasí a den/noc.
- E2E testy Playwright a skutečné testování na mobilních zařízeních.

Tento seznam rozlišuje hotové základy od funkcí, které jsou pouze plánované. Samotná přítomnost databázové tabulky neznamená hotovou herní funkci.
