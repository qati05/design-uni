-- Rauchprobe der Migration: Zugriffsregeln wie im echten Betrieb, mit drei Betrieben. Bricht beim ersten Fehler ab.
\set ON_ERROR_STOP on
create or replace function pg_temp.erwarte(ist bigint, soll bigint, was text) returns void language plpgsql as $$
begin if ist <> soll then raise exception 'FEHLER %: % statt %', was, ist, soll; end if; raise notice 'ok  %', was; end $$;
-- A = Auto Speedy (Cockpit an), B = anderer Betrieb, C = Cockpit gekündigt (aktiv = false)
insert into auth.users values ('11111111-1111-1111-1111-111111111111', 'a@beispiel.ch'), ('22222222-2222-2222-2222-222222222222', 'b@beispiel.ch'),
  ('33333333-3333-3333-3333-333333333333', 'c@beispiel.ch'), ('44444444-4444-4444-4444-444444444444', 'fremd@beispiel.ch');
insert into public.betrieb (id, name, aktiv, website_url, github_repo, github_pfad) values
  ('auto-speedy', 'Auto Speedy AG', true, 'https://www.autospeedy.ch', 'medaur/auto-speedy', 'astro/src/daten/site.json'),
  ('garage-b', 'Garage B', true, 'https://garage-b.ch', 'medaur/garage-b', 'site.json'),
  ('garage-c', 'Garage C', false, 'https://garage-c.ch', 'medaur/garage-c', 'site.json');
insert into public.betrieb_mitglied values ('11111111-1111-1111-1111-111111111111', 'auto-speedy', 'werkstatt'),
  ('22222222-2222-2222-2222-222222222222', 'garage-b', 'werkstatt'), ('33333333-3333-3333-3333-333333333333', 'garage-c', 'leitung');
create or replace function pg_temp.als(uid text) returns void language plpgsql as $$
begin perform set_config('test.uid', uid, false); end $$;

-- Keine Kundendaten: keine Meldungs-, Foto- oder Zähltabellen, kein Speicher-Bucket, keine Zeitplan-Funktionen
select pg_temp.erwarte((select count(*) from pg_tables where schemaname = 'public'), 3, 'nur drei Tabellen: betrieb, betrieb_mitglied, audit_log');
select pg_temp.erwarte((select count(*) from pg_tables where schemaname = 'public' and tablename in ('meldungen', 'meldung_fotos', 'zaehlung', 'versand_geheimnis', 'studio_admin')), 0, 'keine Meldungen, Fotos, Zählung, Versand, Studio');
select pg_temp.erwarte((select count(*) from storage.buckets), 0, 'kein Speicher-Bucket angelegt');
select pg_temp.erwarte((select count(*) from pg_policies where schemaname = 'storage'), 0, 'keine Regeln im Speicher');
select pg_temp.erwarte((select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public'
  and p.proname in ('export_meldungen', 'betriebe_liste', 'bewertungen_abholen', 'fotos_abgelaufen', 'meldungen_aufraeumen', 'zaehlen', 'auftrag_erledigt_mit_token')), 0, 'keine Funktionen für Meldungen, Export, Versand, Löschfrist, Zählung');

-- anon sieht nichts und ruft nichts auf
set role anon;
do $$ begin perform count(*) from public.betrieb; raise exception 'anon liest Betriebe'; exception when insufficient_privilege then raise notice 'ok  anon liest keine Betriebe'; end $$;
do $$ begin perform count(*) from public.betrieb_mitglied; raise exception 'anon liest Mitglieder'; exception when insufficient_privilege then raise notice 'ok  anon liest keine Mitglieder'; end $$;
do $$ begin perform public.ist_mitglied(); raise exception 'anon ruft Funktion'; exception when insufficient_privilege then raise notice 'ok  anon ruft keine Funktion auf'; end $$;
do $$ begin perform public.audit_schreiben('pflege', 'ok'); raise exception 'anon schreibt Audit'; exception when insufficient_privilege then raise notice 'ok  anon schreibt kein Audit'; end $$;
reset role;

-- Mitglied A mit Mail-Code: sieht nur Betrieb A
set role authenticated; select pg_temp.als('11111111-1111-1111-1111-111111111111');
select pg_temp.erwarte(public.ist_mitglied()::int, 1, 'Mail-Code genügt für Mitglieder');
select pg_temp.erwarte((select count(*) from public.mein_betrieb_website() where github_repo = 'medaur/auto-speedy'), 1, 'A liest die Repo-Angaben seiner Website');
select pg_temp.erwarte((select count(*) from public.mein_betrieb_website()), 1, 'A liest nur seinen Betrieb');
select pg_temp.erwarte((select count(*) from public.betrieb_mitglied), 1, 'A sieht nur die eigene Mitgliedschaft');
do $$ begin perform count(*) from public.betrieb; raise exception 'Mitglied liest Betriebe-Tabelle'; exception when insufficient_privilege then raise notice 'ok  Betriebe-Tabelle nur über Funktionen'; end $$;
do $$ begin update public.betrieb_mitglied set betrieb_id = 'garage-b'; raise exception 'Mitglied wechselt Betrieb'; exception when insufficient_privilege then raise notice 'ok  Mitglied wechselt den Betrieb nicht'; end $$;
do $$ begin insert into public.betrieb_mitglied values ('44444444-4444-4444-4444-444444444444', 'auto-speedy', 'leitung'); raise exception 'Mitglied lädt ein'; exception when insufficient_privilege then raise notice 'ok  Mitglieder legen keine Konten an'; end $$;
do $$ begin insert into public.audit_log (aktion, ergebnis) values ('pflege', 'ok'); raise exception 'direkt ins Audit'; exception when insufficient_privilege then raise notice 'ok  Audit nur über die Funktion'; end $$;
do $$ begin perform public.audit_schreiben('pflege', 'ok'); end $$;
select pg_temp.erwarte((select count(*) from public.pflege_zuletzt() where email = 'a@beispiel.ch'), 1, 'zuletzt gepflegt: Zeit und Konto aus dem Audit-Log');
-- Mitglied B sieht nichts von A
select pg_temp.als('22222222-2222-2222-2222-222222222222');
select pg_temp.erwarte((select count(*) from public.mein_betrieb_website() where id = 'auto-speedy'), 0, 'B liest die Repo-Angaben von A nicht');
select pg_temp.erwarte((select count(*) from public.pflege_zuletzt()), 0, 'B sieht nicht, wer bei A gepflegt hat');
-- Gesperrter Betrieb C (Cockpit gekündigt): kommt nicht rein, sieht nichts
select pg_temp.als('33333333-3333-3333-3333-333333333333');
select pg_temp.erwarte(public.ist_mitglied()::int, 0, 'gesperrter Betrieb gilt nicht als Mitglied (Login gesperrt)');
select pg_temp.erwarte((select count(*) from public.mein_betrieb_website()), 0, 'gesperrter Betrieb liest keine Repo-Angaben');
-- Konto ohne Betrieb
select pg_temp.als('44444444-4444-4444-4444-444444444444');
select pg_temp.erwarte(public.ist_mitglied()::int, 0, 'Konto ohne Betrieb ist kein Mitglied');
select pg_temp.erwarte((select count(*) from public.mein_betrieb_website()), 0, 'Konto ohne Betrieb liest nichts');
-- Ohne Konto kein Audit
select pg_temp.als('');
do $$ begin perform public.audit_schreiben('pflege', 'ok'); raise exception 'Audit ohne Konto'; exception when insufficient_privilege then raise notice 'ok  Audit nur mit angemeldetem Konto'; end $$;
reset role;

-- Audit-Log: Eintrag mit Betrieb, nur anfügbar
select pg_temp.erwarte((select count(*) from public.audit_log where aktion = 'pflege' and betrieb_id = 'auto-speedy'), 1, 'Audit-Eintrag mit Betrieb geschrieben');
do $$ begin delete from public.audit_log; raise exception 'Audit löschbar'; exception when insufficient_privilege then raise notice 'ok  Audit-Log nur anfügbar (kein Löschen)'; end $$;
do $$ begin update public.audit_log set aktion = 'anders'; raise exception 'Audit änderbar'; exception when insufficient_privilege then raise notice 'ok  Audit-Log nur anfügbar (kein Ändern)'; end $$;

-- Eingaben
do $$ begin insert into public.betrieb (id, name, website_url, github_pfad) values ('x-y', 'X', 'https://x.ch', '../../etc.json'); raise exception 'Pfad mit ..'; exception when check_violation then raise notice 'ok  Repo-Pfad ohne «..»'; end $$;
do $$ begin insert into public.betrieb (id, name, website_url) values ('x-z', 'X', 'http://x.ch'); raise exception 'Website ohne https'; exception when check_violation then raise notice 'ok  Website nur mit https'; end $$;
do $$ begin insert into public.betrieb_mitglied values ('44444444-4444-4444-4444-444444444444', 'gibt-es-nicht', 'werkstatt'); raise exception 'Mitglied ohne Betrieb'; exception when foreign_key_violation then raise notice 'ok  Mitglied nur für bestehenden Betrieb'; end $$;
\echo RAUCHPROBE GRÜN
