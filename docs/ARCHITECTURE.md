# Hodný Pes Academy — architektura

## Prototyp
Next.js App Router, React, TypeScript a responzivní CSS. UI obsahuje přehled, akademii, profil psa, komunitu, odměny, přepnutí CS/EN a interaktivní ukázku lekce. PWA manifest je připraven; offline cache a push notifikace nejsou hotové.

## Cílové vrstvy
1. UI: dashboard, lekce, editor psa, skill tree a odměny.
2. Doména: definice lekcí, stav lekce, progrese a pravidla odměn.
3. Persistence: guest save, později Supabase repository.
4. Obsah: verzované scénáře a lokalizační klíče.
5. Observability: consent-first analytika a diagnostika výkonu.

## Databázové zásady
Stávající Supabase schéma se zachovává. Odměny, měny a soutěžní skóre se mají validovat serverově. RLS je nutné testovat pro anonymního, přihlášeného i jiného uživatele. Tajné klíče nikdy nepatří do klienta.

## Kvalita
Ověřit build, typecheck, Lighthouse, klávesnici, redukovaný pohyb, iOS Safari, Android Chrome a desktop Chromium. Před tvrzením o úspěšném nasazení ověřit skutečný deployment a smoke test.