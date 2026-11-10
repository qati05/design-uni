-- Cockpit: ersten Betrieb anlegen (EINRICHTEN.md, Schritt 5).
-- Wo: Supabase, SQL Editor. Wann: NACH der Migration (supabase/migrations/20261103100000_cockpit.sql)
-- und NACHDEM die Konten unter Authentication → Users angelegt sind.
--
-- Vorher die vier Platzhalter ersetzen. Sie beginnen alle mit HIER- und stehen in Grossbuchstaben:
--   HIER-HOST-DER-TEST-WEBSITE   Adresse der Website ohne https:// und ohne Schrägstrich, z. B. meine-seite.pages.dev
--   HIER-ZWEIG-DEN-PAGES-BAUT    der Zweig, den Cloudflare Pages als «Production branch» baut
--   HIER-MAIL-1, HIER-MAIL-2     die Mail-Adressen der angelegten Konten, klein geschrieben
-- Nichts davon ist geheim. Das GitHub-Token steht nie in der Datenbank.
-- Vergessene Platzhalter: Die Adresse der Website lehnt die Datenbank ab. Bei den Mail-Adressen zeigt Abfrage 3 «konten = 0».

-- 1) Betrieb: wo seine site.json liegt.
insert into public.betrieb (id, name, website_url, github_repo, github_pfad, github_zweig)
values ('auto-speedy', 'Auto Speedy AG', 'https://HIER-HOST-DER-TEST-WEBSITE', 'qati05/design-uni',
        'projekt/autospeedy/astro/src/daten/site.json', 'HIER-ZWEIG-DEN-PAGES-BAUT');

-- 2) Konten dem Betrieb zuordnen (ein Konto gehört zu genau einem Betrieb).
insert into public.betrieb_mitglied (user_id, betrieb_id, rolle)
select id, 'auto-speedy', 'werkstatt' from auth.users where lower(email) in ('HIER-MAIL-1', 'HIER-MAIL-2');

-- 3) Kontrolle: eine Zeile, aktiv = true, konten = Anzahl der zugeordneten Konten (nicht 0).
select b.id, b.aktiv, b.website_url, b.github_repo, b.github_pfad, b.github_zweig,
       (select count(*) from public.betrieb_mitglied m where m.betrieb_id = b.id) as konten
  from public.betrieb b;
