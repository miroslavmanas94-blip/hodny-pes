# Bezpečný plán přestavby

## Výchozí audit
- Next.js App Router, React 19, TypeScript; vstup `app/page.tsx` → `app/FarmGame.tsx`.
- Původní hra měla jednu izometrickou mapu s pozemky a budovami; nebyly implementované účty, cloud save ani multiplayer.
- Ukládání bylo pouze lokální. Staré globální CSS obsahovalo mnoho překrývajících se stylů.

## Bezpečnost změn
Změny jsou na větvi `rebuild/psie-dobrodruzstvi-foundation`, nikoli přímo na `main`. Historie GitHubu, Cloudflare projekt i případné Supabase schéma se zachovávají. Produkční nastavení a databáze se nemažou ani nemění bez samostatného schválení.

## Provedeno v první etapě
- Nový vlastní vizuální systém v přírodních zelených a krémových odstínech.
- Šest tematizovaných lokací s odlišnými scénami a vlastními aktivitami.
- Klikací/klepací aktivity a animovaný přesun postavy se psem.
- Mise, XP, Hafíci, důvěra, energie a lokální ukládání.
- Samostatné zkušenosti, energie a důvěra pro každého psa; další psi se odemykají podle jeho pokroku.
- Opakování splněných aktivit s malým XP bez dalších mincí.
- Čeština/angličtina, mobilní navigace, skrývání HUD a potvrzení restartu.
- Čistší globální CSS, metadata, README a nová specifikace.

## Další kroky
1. Spustit typovou kontrolu a produkční Cloudflare build; opravit všechny chyby.
2. Ověřit onboarding, přechody mezi lokacemi, mise, energii, opakování, odemykání psů, jazyk, HUD a save po obnovení stránky.
3. Opravit případné chyby z Cloudflare Preview build logu.
4. Rozšířit aktivity na propracované lekce poslušnosti, aportování, triky, čichání a Dog Puller.
5. Navrhnout účty a cloud save; až poté multiplayer a moderaci.
6. Produkční nasazení až po úspěšném preview buildu a kontrole skutečného webu.

## Neověřeno / není hotové
V tomto zápisu nebyl ověřen Cloudflare build ani deployment. Přihlášení, cloud save, synchronizace, multiplayer, zvukové soubory a plnohodnotné 3D nejsou implementované v první etapě. Neoznačovat je za hotové.
