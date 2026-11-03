-- Rauchprobe der Migration: Zugriffsregeln wie im echten Betrieb, mit zwei Betrieben. Bricht beim ersten Fehler ab.
\set ON_ERROR_STOP on
create or replace function pg_temp.erwarte(ist bigint, soll bigint, was text) returns void language plpgsql as $$
begin if ist <> soll then raise exception 'FEHLER %: % statt %', was, ist, soll; end if; raise notice 'ok  %', was; end $$;
-- A = Auto Speedy (Cockpit an, Automation gekauft), B = anderer Betrieb, C = Cockpit gekündigt (aktiv = false), Automation gekauft
insert into auth.users values ('11111111-1111-1111-1111-111111111111', 'a@beispiel.ch'), ('22222222-2222-2222-2222-222222222222', 'b@beispiel.ch'),
  ('33333333-3333-3333-3333-333333333333', 'c@beispiel.ch'), ('44444444-4444-4444-4444-444444444444', 'fremd@beispiel.ch'), ('55555555-5555-5555-5555-555555555555', 'studio@medaur.ch');
insert into public.betrieb (id, name, aktiv, automation_bewertung, website_url, github_repo, github_pfad) values
  ('auto-speedy', 'Auto Speedy AG', true, true, 'https://www.autospeedy.ch', 'medaur/auto-speedy', 'astro/src/daten/site.json'),
  ('garage-b', 'Garage B', true, false, 'https://garage-b.ch', null, null),
  ('garage-c', 'Garage C', false, true, 'https://garage-c.ch', null, null);
insert into public.betrieb_mitglied values ('11111111-1111-1111-1111-111111111111', 'auto-speedy', 'werkstatt'),
  ('22222222-2222-2222-2222-222222222222', 'garage-b', 'werkstatt'), ('33333333-3333-3333-3333-333333333333', 'garage-c', 'leitung');
insert into public.studio_admin values ('55555555-5555-5555-5555-555555555555');
create or replace function pg_temp.als(uid text, aal text) returns void language plpgsql as $$
begin perform set_config('test.uid', uid, false); perform set_config('test.aal', aal, false); end $$;

-- Die Website-Funktionen (service_role) schreiben Meldungen und Fotos, auch für den gesperrten Betrieb C
set role service_role;
insert into public.meldungen (id, betrieb_id, art, name, telefon, stellen) values ('ma1', 'auto-speedy', 'Hagel', 'Kunde A', '071 555 00 00', '{Dach}'),
  ('mb1', 'garage-b', 'Felge', 'Kunde B', '071 555 00 01', '{}'), ('mc1', 'garage-c', 'Unfall', 'Kunde C', '071 555 00 02', '{}');
insert into public.meldung_fotos (meldung_id, pfad) values ('ma1', 'auto-speedy/ma1/foto-1.jpg'), ('mb1', 'garage-b/mb1/foto-1.jpg');
insert into storage.objects (bucket_id, name) values ('schadenfotos', 'auto-speedy/ma1/foto-1.jpg'), ('schadenfotos', 'garage-b/mb1/foto-1.jpg');
do $$ begin insert into public.meldung_fotos (meldung_id, pfad) values ('ma1', 'garage-b/ma1/foto-2.jpg'); raise exception 'Foto in fremdem Ordner'; exception when check_violation then raise notice 'ok  Foto-Pfad muss zu Betrieb und Meldung passen'; end $$;
reset role;

-- anon sieht nichts und schreibt nichts
set role anon;
do $$ begin perform count(*) from public.meldungen; raise exception 'anon durfte lesen'; exception when insufficient_privilege then raise notice 'ok  anon liest keine Meldungen (kein Recht)'; end $$;
do $$ begin perform count(*) from public.betrieb; raise exception 'anon liest Betriebe'; exception when insufficient_privilege then raise notice 'ok  anon liest keine Betriebe'; end $$;
do $$ begin insert into public.meldungen (betrieb_id, art, name, telefon) values ('auto-speedy', 'Hagel', 'X', '071 555 00 00'); raise exception 'anon durfte schreiben'; exception when insufficient_privilege then raise notice 'ok  anon schreibt nicht'; end $$;
select pg_temp.erwarte((select count(*) from storage.objects where bucket_id = 'schadenfotos'), 0, 'anon sieht keine Schadenfotos');
reset role;

-- Mitglied A nur mit Mail-Code (aal1): liest nichts
set role authenticated; select pg_temp.als('11111111-1111-1111-1111-111111111111', 'aal1');
select pg_temp.erwarte((select count(*) from public.meldungen), 0, 'Mitglied mit aal1 liest nichts');
select pg_temp.erwarte(public.ist_mitglied()::int, 0, 'aal1 gilt nicht als Mitglied');
-- Mitglied A mit aal2: sieht nur Betrieb A
select pg_temp.als('11111111-1111-1111-1111-111111111111', 'aal2');
select pg_temp.erwarte((select count(*) from public.meldungen), 1, 'A liest genau seine Meldung');
select pg_temp.erwarte((select count(*) from public.meldungen where betrieb_id <> 'auto-speedy'), 0, 'A sieht nichts von B und C');
select pg_temp.erwarte((select count(*) from public.meldung_fotos), 1, 'A liest nur seine Fotozeile');
select pg_temp.erwarte((select count(*) from storage.objects where bucket_id = 'schadenfotos'), 1, 'A sieht im Speicher nur seinen Ordner');
select pg_temp.erwarte((select count(*) from public.mein_betrieb_website() where github_repo = 'medaur/auto-speedy'), 1, 'A liest die Repo-Angaben seiner Website');
do $$ begin perform count(*) from public.betrieb; raise exception 'Mitglied liest Betriebe-Tabelle'; exception when insufficient_privilege then raise notice 'ok  Betriebe-Tabelle nur über Funktionen'; end $$;
select public.meldung_status_setzen('ma1', 'zurueckgerufen');
select pg_temp.erwarte((select count(*) from public.meldungen where status = 'zurueckgerufen'), 1, 'Status über Funktion gesetzt');
do $$ begin perform public.meldung_status_setzen('mb1', 'verloren'); raise exception 'A ändert B'; exception when insufficient_privilege then raise notice 'ok  A ändert keine Meldung von B'; end $$;
do $$ begin perform public.meldung_notiz_setzen('mb1', 'x'); raise exception 'A notiert bei B'; exception when insufficient_privilege then raise notice 'ok  A schreibt keine Notiz bei B'; end $$;
do $$ begin update public.meldungen set status = 'auftrag' where id = 'ma1'; raise exception 'direktes Update erlaubt'; exception when insufficient_privilege then raise notice 'ok  kein direktes Update'; end $$;
do $$ begin perform public.meldung_status_setzen('ma1', 'geloescht'); raise exception 'ungültiger Status erlaubt'; exception when check_violation then raise notice 'ok  ungültiger Status abgewiesen'; end $$;
do $$ begin perform public.export_meldungen('auto-speedy'); raise exception 'Mitglied exportiert'; exception when insufficient_privilege then raise notice 'ok  CSV-Export nicht für Mitglieder'; end $$;
-- Mitglied B sieht nichts von A
select pg_temp.als('22222222-2222-2222-2222-222222222222', 'aal2');
select pg_temp.erwarte((select count(*) from public.meldungen where betrieb_id = 'auto-speedy'), 0, 'B sieht nichts von A');
select pg_temp.erwarte((select count(*) from public.meldungen), 1, 'B liest nur seine Meldung');
select pg_temp.erwarte((select count(*) from public.mein_betrieb_website() where id = 'auto-speedy'), 0, 'B liest die Repo-Angaben von A nicht');
-- Gesperrter Betrieb C (Cockpit gekündigt): kommt nicht rein, sieht nichts, ändert nichts
select pg_temp.als('33333333-3333-3333-3333-333333333333', 'aal2');
select pg_temp.erwarte(public.ist_mitglied()::int, 0, 'gesperrter Betrieb gilt nicht als Mitglied (Login gesperrt)');
select pg_temp.erwarte((select count(*) from public.meldungen), 0, 'gesperrter Betrieb liest nichts');
do $$ begin perform public.meldung_status_setzen('mc1', 'verloren'); raise exception 'gesperrt ändert'; exception when insufficient_privilege then raise notice 'ok  gesperrter Betrieb ändert nichts'; end $$;
-- Konto ohne Betrieb
select pg_temp.als('44444444-4444-4444-4444-444444444444', 'aal2');
select pg_temp.erwarte((select count(*) from public.meldungen), 0, 'Konto ohne Betrieb liest nichts');
reset role;
select pg_temp.erwarte((select count(*) from public.meldungen where id = 'mc1'), 1, 'Meldung für gesperrten Betrieb trotzdem gespeichert (Website läuft)');

-- Audit-Log: Eintrag mit Betrieb, nur anfügbar
select pg_temp.erwarte((select count(*) from public.audit_log where aktion = 'status_zurueckgerufen' and betrieb_id = 'auto-speedy'), 1, 'Audit-Eintrag mit Betrieb geschrieben');
do $$ begin delete from public.audit_log; raise exception 'Audit löschbar'; exception when insufficient_privilege then raise notice 'ok  Audit-Log nur anfügbar'; end $$;
set role authenticated; select pg_temp.als('11111111-1111-1111-1111-111111111111', 'aal2');
do $$ begin perform public.audit_schreiben('pflege', 'ok'); end $$;
select pg_temp.erwarte((select count(*) from public.pflege_zuletzt() where email = 'a@beispiel.ch'), 1, 'zuletzt gepflegt: Zeit und Konto aus dem Audit-Log');
select pg_temp.als('22222222-2222-2222-2222-222222222222', 'aal2');
select pg_temp.erwarte((select count(*) from public.pflege_zuletzt()), 0, 'B sieht nicht, wer bei A gepflegt hat');
reset role;

-- Studio-Admin: CSV-Export pro Betrieb, protokolliert; nur mit aal2; sieht sonst keine Meldungen
set role authenticated; select pg_temp.als('55555555-5555-5555-5555-555555555555', 'aal1');
do $$ begin perform public.export_meldungen('garage-c'); raise exception 'Export mit aal1'; exception when insufficient_privilege then raise notice 'ok  Export nur mit zweitem Faktor'; end $$;
select pg_temp.als('55555555-5555-5555-5555-555555555555', 'aal2');
select pg_temp.erwarte((select count(*) from public.export_meldungen('garage-c') where name = 'Kunde C'), 1, 'Studio exportiert die Meldungen von C (auch gekündigt)');
select pg_temp.erwarte((select count(*) from public.betriebe_liste()), 3, 'Studio sieht die Liste der Betriebe');
select pg_temp.erwarte((select count(*) from public.meldungen), 0, 'Studio liest Meldungen nicht direkt');
reset role;
select pg_temp.erwarte((select count(*) from public.audit_log where aktion = 'export' and betrieb_id = 'garage-c'), 1, 'Export protokolliert');

-- Zählung: nur service_role zählt, je Betrieb getrennt
set role service_role; select public.zaehlen('auto-speedy', 'anruf', 'kopf'); select public.zaehlen('auto-speedy', 'anruf', 'kopf'); select public.zaehlen('garage-b', 'anruf', 'kopf'); reset role;
select pg_temp.erwarte((select anzahl from public.zaehlung where betrieb_id = 'auto-speedy' and punkt = 'anruf')::bigint, 2, 'Zählung addiert je Betrieb');
set role authenticated; select pg_temp.als('11111111-1111-1111-1111-111111111111', 'aal2');
select pg_temp.erwarte((select count(*) from public.zaehlung), 1, 'A liest nur seine Zählung');
do $$ begin perform public.zaehlen('auto-speedy', 'anruf', 'kopf'); raise exception 'authenticated durfte zählen'; exception when insufficient_privilege then raise notice 'ok  nur die Website-Funktion zählt'; end $$;
reset role;
do $$ begin insert into public.zaehlung (betrieb_id, punkt, ort) values ('auto-speedy', '<b>', 'x'); raise exception 'ungültiger Punkt'; exception when check_violation then raise notice 'ok  ungültiger Zählpunkt abgewiesen'; end $$;

-- «Auto fertig» per Link aus der ersten Mail, Bewertung 24 h später (Automation), auch wenn das Cockpit aus ist
set role service_role;
insert into public.meldungen (id, betrieb_id, art, name, telefon, email, erledigt_token_hash, erledigt_token_bis) values
  ('a1', 'auto-speedy', 'Hagel', 'Kunde', '071 555 00 01', 'kunde@beispiel.ch', encode(extensions.digest(repeat('1', 64), 'sha256'), 'hex'), now() + interval '120 days'),
  ('c1', 'garage-c', 'Hagel', 'Kunde C', '071 555 00 03', 'kunde.c@beispiel.ch', encode(extensions.digest(repeat('3', 64), 'sha256'), 'hex'), now() + interval '120 days'),
  ('b1', 'garage-b', 'Hagel', 'Kunde B', '071 555 00 04', 'kunde.b@beispiel.ch', null, null),
  ('a2', 'auto-speedy', 'Felge', 'Ohne Mail', '071 555 00 02', null, null, null);
reset role;
insert into public.versand_geheimnis (hash) values (encode(extensions.digest('geheim-test', 'sha256'), 'hex'));
set role anon;
select pg_temp.erwarte((select count(*) from public.auftrag_link_ansehen(repeat('1', 64)))::bigint, 1, 'Link zeigt die offene Meldung (ohne Personendaten), schon ab Status «neu»');
select pg_temp.erwarte((select count(*) from public.auftrag_link_ansehen(repeat('0', 64)))::bigint, 0, 'falsches Token zeigt nichts');
select pg_temp.erwarte(public.auftrag_erledigt_mit_token(repeat('a', 64))::int::bigint, 0, 'falsches Token meldet nichts');
select pg_temp.erwarte(public.auftrag_erledigt_mit_token(repeat('1', 64))::int::bigint, 1, 'Klick im Mail: Auto fertig');
select pg_temp.erwarte(public.auftrag_erledigt_mit_token(repeat('1', 64))::int::bigint, 0, 'derselbe Link geht nur einmal');
select pg_temp.erwarte(public.auftrag_erledigt_mit_token(repeat('3', 64))::int::bigint, 1, 'Link geht auch beim gesperrten Betrieb C (Automation läuft weiter)');
reset role;
select pg_temp.erwarte((select count(*) from public.meldungen where id = 'a1' and status = 'erledigt' and bewertung_faellig between now() + interval '23 hours' and now() + interval '25 hours')::bigint, 1, 'Bewertung für in 24 Stunden geplant');
select pg_temp.erwarte((select count(*) from public.audit_log where aktion = 'auftrag_erledigt_link' and betrieb_id = 'auto-speedy')::bigint, 1, 'Klick protokolliert');
set role authenticated;
select pg_temp.als('11111111-1111-1111-1111-111111111111', 'aal2'); select public.meldung_status_setzen('a2', 'erledigt');
select pg_temp.als('22222222-2222-2222-2222-222222222222', 'aal2'); select public.meldung_status_setzen('b1', 'erledigt');
reset role;
select pg_temp.erwarte((select count(*) from public.meldungen where id = 'a2' and bewertung_faellig is null)::bigint, 1, 'ohne Mail des Kunden keine Bewertungs-Mail geplant');
select pg_temp.erwarte((select count(*) from public.meldungen where id = 'b1' and bewertung_faellig is null)::bigint, 1, 'Betrieb ohne gekaufte Automation: keine Bewertungs-Mail');
set role anon;
select pg_temp.erwarte((select count(*) from public.bewertungen_abholen('geheim-test'))::bigint, 0, 'vor Ablauf von 24 Stunden nichts fällig');
reset role;
update public.meldungen set bewertung_faellig = now() - interval '1 minute' where id in ('a1', 'c1');
set role anon;
do $$ begin perform public.bewertungen_abholen('falsch'); raise exception 'Versand ohne Geheimnis'; exception when insufficient_privilege then raise notice 'ok  Versand nur mit Geheimnis'; end $$;
create temp table faellig as select * from public.bewertungen_abholen('geheim-test');
select pg_temp.erwarte((select count(*) from faellig where email = 'kunde@beispiel.ch' and website = 'https://www.autospeedy.ch' and betrieb = 'Auto Speedy AG')::bigint, 1, 'fällig mit Website und Name des eigenen Betriebs');
select pg_temp.erwarte((select count(*) from faellig where email = 'kunde.c@beispiel.ch')::bigint, 1, 'Bewertung auch beim gesperrten Betrieb C (Automation läuft weiter)');
select pg_temp.erwarte((select count(*) from public.bewertungen_abholen('geheim-test'))::bigint, 0, 'jede Bewertungs-Mail nur einmal');
select public.bewertung_zuruecklegen('geheim-test', 'a1');
reset role;
select pg_temp.erwarte((select count(*) from public.meldungen where id = 'a1' and bewertung_gesendet is null and bewertung_faellig > now())::bigint, 1, 'Fehlschlag: neuer Versuch später');
set role anon;
do $$ begin perform count(*) from public.versand_geheimnis; raise exception 'Geheimnis lesbar'; exception when insufficient_privilege then raise notice 'ok  Versand-Geheimnis nicht lesbar'; end $$;
reset role;
set role service_role; update public.meldungen set erledigt_token_hash = encode(extensions.digest(repeat('2', 64), 'sha256'), 'hex'), erledigt_token_bis = now() + interval '1 day' where id = 'ma1'; reset role;
set role authenticated; select pg_temp.als('11111111-1111-1111-1111-111111111111', 'aal2'); select public.meldung_status_setzen('ma1', 'verloren'); reset role;
set role anon; select pg_temp.erwarte((select count(*) from public.auftrag_link_ansehen(repeat('2', 64)))::bigint, 0, '«verloren» macht den Link ungültig'); reset role;

-- Löschfrist: erst Fotos über die Storage-API, dann die Zeilen. SQL-DELETE im Speicher ist gesperrt (wie Supabase).
update public.meldungen set erstellt = now() - interval '400 days' where id in ('ma1', 'mb1');
select pg_temp.erwarte(public.meldungen_aufraeumen('geheim-test'), 0, 'Meldungen mit Fotos im Speicher bleiben, bis die Fotos weg sind');
set role anon;
select pg_temp.erwarte((select count(*) from public.fotos_abgelaufen('geheim-test'))::bigint, 2, 'Zeitplan bekommt die Pfade abgelaufener Fotos');
do $$ begin perform public.fotos_abgelaufen('falsch'); raise exception 'Pfade ohne Geheimnis'; exception when insufficient_privilege then raise notice 'ok  Pfade nur mit Geheimnis'; end $$;
-- anon hat im Speicher keine Regel: auch überfällige Fotos sind nicht öffentlich und nicht löschbar
set storage.allow_delete_query = 'true';
select pg_temp.erwarte((select count(*) from storage.objects), 0, 'anon sieht auch überfällige Fotos nicht');
delete from storage.objects where bucket_id = 'schadenfotos';
reset role;
select pg_temp.erwarte((select count(*) from storage.objects), 2, 'anon löscht keine Fotos');
-- so wie die Storage-API mit dem service_role-Schlüssel löscht
set role service_role; delete from storage.objects where bucket_id = 'schadenfotos' and name in (select public.fotos_abgelaufen('geheim-test')); reset role; reset storage.allow_delete_query;
select pg_temp.erwarte((select count(*) from storage.objects), 0, 'abgelaufene Fotos über die Storage-API gelöscht');
select pg_temp.erwarte(public.meldungen_aufraeumen('geheim-test'), 2, 'danach Meldungen nach Frist gelöscht');
select pg_temp.erwarte((select count(*) from public.meldung_fotos), 0, 'Fotozeilen mitgelöscht');
set role service_role; insert into storage.objects (bucket_id, name) values ('schadenfotos', 'auto-speedy/neu1/foto-1.jpg'); reset role;
do $$ begin delete from storage.objects; raise exception 'SQL-DELETE im Speicher'; exception when insufficient_privilege then raise notice 'ok  SQL-DELETE im Speicher gesperrt'; end $$;

-- Tesla-Modell: nur aus der Liste, nur bei Tesla
set role service_role;
insert into public.meldungen (id, betrieb_id, art, name, telefon, tesla, tesla_modell) values ('t1', 'auto-speedy', 'Hagel', 'T', '071 555 00 09', true, 'Model Y');
reset role;
select pg_temp.erwarte((select count(*) from public.meldungen where tesla_modell = 'Model Y')::bigint, 1, 'Tesla-Modell gespeichert');
do $$ begin insert into public.meldungen (betrieb_id, art, name, telefon, tesla, tesla_modell) values ('auto-speedy', 'Hagel', 'T', '071 555 00 09', true, 'Roadster'); raise exception 'unbekanntes Modell'; exception when check_violation then raise notice 'ok  unbekanntes Tesla-Modell abgewiesen'; end $$;
do $$ begin insert into public.meldungen (betrieb_id, art, name, telefon, tesla, tesla_modell) values ('auto-speedy', 'Hagel', 'T', '071 555 00 09', false, 'Model 3'); raise exception 'Modell ohne Tesla'; exception when check_violation then raise notice 'ok  Modell nur bei Tesla'; end $$;
do $$ begin insert into public.meldungen (betrieb_id, art, name, telefon) values ('gibt-es-nicht', 'Hagel', 'T', '071 555 00 09'); raise exception 'Meldung ohne Betrieb'; exception when foreign_key_violation then raise notice 'ok  Meldung nur für bestehenden Betrieb'; end $$;
do $$ begin insert into public.betrieb (id, name, website_url, github_pfad) values ('x-y', 'X', 'https://x.ch', '../../etc.json'); raise exception 'Pfad mit ..'; exception when check_violation then raise notice 'ok  Repo-Pfad ohne «..»'; end $$;
\echo RAUCHPROBE GRÜN
