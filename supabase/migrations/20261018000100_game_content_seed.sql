-- Seed fictional game catalog content. No player progress or wallet balances are changed.
insert into public.inventory_items(id, name, description, category, price, metadata, active) values
('collar-forest','Lesní obojek','Tmavě zelený kosmetický obojek.','collar',40,'{"color":"forest"}'::jsonb,true),
('bandana-sun','Slunečný šátek','Žlutý šátek pro veselá dobrodružství.','bandana',55,'{"color":"sun"}'::jsonb,true),
('collar-copper','Měděný obojek','Elegantní měděný odstín.','collar',90,'{"color":"copper"}'::jsonb,true),
('toy-puller-gold','Zlatý Puller','Kosmetická varianta tréninkového kruhu.','toy',120,'{"color":"gold"}'::jsonb,true),
('clubhouse-paw-flag','Vlajka tlapky','Dekorace do klubovny.','decoration',75,'{"theme":"paw"}'::jsonb,true)
on conflict (id) do update set name=excluded.name, description=excluded.description, category=excluded.category, price=excluded.price, metadata=excluded.metadata, active=excluded.active;
insert into public.missions(id,title,description,definition,enabled) values
('welcome','První společná procházka','Prozkoumej cvičiště se svým psem.','{"type":"exploration","target":8,"reward":30}'::jsonb,true),
('sit','První povel: Sedni','Procvič základní povel Sedni.','{"type":"training","command":"sit","reward":45}'::jsonb,true),
('puller-first','První Puller','Proveď první tréninkový pokus s kruhem.','{"type":"puller","attempts":1,"reward":60}'::jsonb,true)
on conflict (id) do update set title=excluded.title, description=excluded.description, definition=excluded.definition, enabled=excluded.enabled;
insert into public.achievements(id,title,description,definition) values
('first-command','První povel','Procvič první povel.','{"type":"training_count","target":1}'::jsonb),
('puller-starter','První chycení','Dokonči první tréninkový pokus.','{"type":"puller_catches","target":1}'::jsonb),
('explorer','Malý průzkumník','Objevuj herní cvičiště.','{"type":"exploration","target":8}'::jsonb)
on conflict (id) do nothing;
insert into public.trophies(id,title,description) values
('training-bronze','Bronzová tlapka','Trofej za první kroky ve výcviku.'),
('puller-bronze','Bronzový kruh','Trofej za první Puller trénink.')
on conflict (id) do nothing;
