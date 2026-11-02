-- Rauchprobe der Migration: Zugriffsregeln wie im echten Betrieb prüfen. Bricht beim ersten Fehler ab.
\set ON_ERROR_STOP on
insert into auth.users values ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222');
insert into public.betrieb_mitglied values ('11111111-1111-1111-1111-111111111111', 'werkstatt');
-- service_role (Serverfunktion der Website) schreibt eine Meldung
set role service_role;
insert into public.meldungen (id, art, name, telefon, stellen) values ('m1', 'Hagel', 'Test', '071 555 00 00', '{Dach}');
insert into public.meldung_fotos (meldung_id, pfad) values ('m1', 'm1/foto-1.jpg');
reset role;
create or replace function pg_temp.erwarte(ist bigint, soll bigint, was text) returns void language plpgsql as $$
begin if ist <> soll then raise exception 'FEHLER %: % statt %', was, ist, soll; end if; raise notice 'ok  %', was; end $$;
-- anon sieht nichts und schreibt nichts
set role anon;
do $$ begin perform count(*) from public.meldungen; raise exception 'anon durfte lesen'; exception when insufficient_privilege then raise notice 'ok  anon liest keine Meldungen (kein Recht)'; end $$;
do $$ begin insert into public.meldungen (art, name, telefon) values ('Hagel', 'X', '071 555 00 00'); raise exception 'anon durfte schreiben'; exception when insufficient_privilege then raise notice 'ok  anon schreibt nicht'; end $$;
reset role;
-- Mitglied nur mit Mail-Code (aal1): liest nichts
set role authenticated; set test.uid = '11111111-1111-1111-1111-111111111111'; set test.aal = 'aal1';
select pg_temp.erwarte((select count(*) from public.meldungen), 0, 'Mitglied mit aal1 liest nichts');
-- Mitglied mit aal2: liest, setzt Status über die Funktion, nicht direkt
set test.aal = 'aal2';
select pg_temp.erwarte((select count(*) from public.meldungen), 1, 'Mitglied mit aal2 liest die Meldung');
select pg_temp.erwarte((select count(*) from public.meldung_fotos), 1, 'Mitglied mit aal2 liest die Fotozeile');
select public.meldung_status_setzen('m1', 'zurueckgerufen');
select pg_temp.erwarte((select count(*) from public.meldungen where status = 'zurueckgerufen'), 1, 'Status über Funktion gesetzt');
do $$ begin update public.meldungen set status = 'auftrag' where id = 'm1'; raise exception 'direktes Update erlaubt'; exception when insufficient_privilege then raise notice 'ok  kein direktes Update'; end $$;
do $$ begin perform public.meldung_status_setzen('m1', 'geloescht'); raise exception 'ungültiger Status erlaubt'; exception when check_violation then raise notice 'ok  ungültiger Status abgewiesen'; end $$;
-- fremdes Konto mit aal2: liest nichts, darf nicht ändern
set test.uid = '22222222-2222-2222-2222-222222222222';
select pg_temp.erwarte((select count(*) from public.meldungen), 0, 'Nicht-Mitglied liest nichts');
do $$ begin perform public.meldung_status_setzen('m1', 'verloren'); raise exception 'Nicht-Mitglied durfte ändern'; exception when insufficient_privilege then raise notice 'ok  Nicht-Mitglied ändert nicht'; end $$;
reset role;
-- Audit-Log: Eintrag da, nur anfügbar
select pg_temp.erwarte((select count(*) from public.audit_log where aktion = 'status_zurueckgerufen'), 1, 'Audit-Eintrag geschrieben');
do $$ begin delete from public.audit_log; raise exception 'Audit löschbar'; exception when insufficient_privilege then raise notice 'ok  Audit-Log nur anfügbar'; end $$;
-- Löschfrist
update public.meldungen set erstellt = now() - interval '400 days' where id = 'm1';
select pg_temp.erwarte(public.meldungen_aufraeumen(), 1, 'Meldung nach Frist gelöscht');
select pg_temp.erwarte((select count(*) from public.meldung_fotos), 0, 'Fotozeilen mitgelöscht');
-- Zählung: nur service_role zählt, Mitglied mit aal2 liest, anon nichts
set role service_role; select public.zaehlen('anruf', 'kopf'); select public.zaehlen('anruf', 'kopf'); reset role;
select pg_temp.erwarte((select anzahl from public.zaehlung where punkt = 'anruf')::bigint, 2, 'Zählung addiert');
set role authenticated; set test.uid = '11111111-1111-1111-1111-111111111111'; set test.aal = 'aal2';
select pg_temp.erwarte((select count(*) from public.zaehlung), 1, 'Mitglied liest Zählung');
do $$ begin perform public.zaehlen('anruf', 'kopf'); raise exception 'authenticated durfte zählen'; exception when insufficient_privilege then raise notice 'ok  nur die Website-Funktion zählt'; end $$;
reset role;
do $$ begin insert into public.zaehlung (punkt, ort) values ('<b>', 'x'); raise exception 'ungültiger Punkt'; exception when check_violation then raise notice 'ok  ungültiger Zählpunkt abgewiesen'; end $$;
-- Pflege: anon liest nur über pflege_oeffentlich, aal1 schreibt nicht, Mitglied mit aal2 schreibt über die Funktion
set role anon;
do $$ begin perform count(*) from public.pflege; raise exception 'anon liest Pflege-Tabelle'; exception when insufficient_privilege then raise notice 'ok  anon liest die Pflege-Tabelle nicht'; end $$;
do $$ begin perform public.pflege_speichern('{"hinweis":{},"zeiten":[],"ausnahmen":[],"team":[]}'); raise exception 'anon schreibt Pflege'; exception when insufficient_privilege then raise notice 'ok  anon schreibt keine Pflege'; end $$;
reset role;
set role authenticated; set test.uid = '11111111-1111-1111-1111-111111111111'; set test.aal = 'aal1';
do $$ begin perform public.pflege_speichern('{"hinweis":{},"zeiten":[],"ausnahmen":[],"team":[]}'); raise exception 'aal1 schreibt Pflege'; exception when insufficient_privilege then raise notice 'ok  nur Mail-Code (aal1) schreibt keine Pflege'; end $$;
set test.aal = 'aal2';
do $$ begin perform public.pflege_speichern('{"hinweis":{}}'); raise exception 'unvollständig gespeichert'; exception when invalid_parameter_value then raise notice 'ok  unvollständige Pflege abgewiesen'; end $$;
select public.pflege_speichern('{"hinweis":{"aktiv":true},"zeiten":[],"ausnahmen":[],"team":[]}');
select pg_temp.erwarte((select count(*) from public.pflege), 1, 'Mitglied mit aal2 speichert und liest Pflege');
do $$ begin update public.pflege set daten = '{}'; raise exception 'direktes Update Pflege'; exception when insufficient_privilege then raise notice 'ok  Pflege nicht direkt änderbar'; end $$;
set test.uid = '22222222-2222-2222-2222-222222222222';
do $$ begin perform public.pflege_speichern('{"hinweis":{},"zeiten":[],"ausnahmen":[],"team":[]}'); raise exception 'Nicht-Mitglied schreibt Pflege'; exception when insufficient_privilege then raise notice 'ok  Nicht-Mitglied schreibt keine Pflege'; end $$;
reset role;
set role anon;
select pg_temp.erwarte((select (public.pflege_oeffentlich() -> 'hinweis' ->> 'aktiv')::boolean::int)::bigint, 1, 'Website-Bau liest Pflege über pflege_oeffentlich');
reset role;
select pg_temp.erwarte((select count(*) from public.audit_log where aktion = 'pflege'), 1, 'Pflege protokolliert');
-- Teamfotos: nur Mitglied mit aal2 lädt hoch
grant insert on storage.objects to authenticated;
set role authenticated; set test.uid = '11111111-1111-1111-1111-111111111111'; set test.aal = 'aal2';
insert into storage.objects (bucket_id, name) values ('teamfotos', 'a.webp');
select pg_temp.erwarte(1, 1, 'Mitglied mit aal2 lädt Teamfoto hoch');
set test.aal = 'aal1';
do $$ begin insert into storage.objects (bucket_id, name) values ('teamfotos', 'b.webp'); raise exception 'aal1 lädt hoch'; exception when insufficient_privilege then raise notice 'ok  nur Mail-Code (aal1) lädt kein Teamfoto hoch'; end $$;
set test.uid = '22222222-2222-2222-2222-222222222222'; set test.aal = 'aal2';
do $$ begin insert into storage.objects (bucket_id, name) values ('teamfotos', 'c.webp'); raise exception 'Fremder lädt hoch'; exception when insufficient_privilege then raise notice 'ok  Nicht-Mitglied lädt kein Teamfoto hoch'; end $$;
do $$ begin insert into storage.objects (bucket_id, name) values ('schadenfotos', 'd.jpg'); raise exception 'Schadenfoto hochgeladen'; exception when insufficient_privilege then raise notice 'ok  in den Schadenfoto-Bucket lädt niemand vom Cockpit hoch'; end $$;
reset role;
-- Auftrag erledigt per Mail-Link, Bewertung 24 h später
set role service_role;
insert into public.meldungen (id, art, name, telefon, email) values ('a1', 'Hagel', 'Kunde', '071 555 00 01', 'kunde@beispiel.ch'), ('a2', 'Felge', 'Ohne Mail', '071 555 00 02', null);
reset role;
insert into public.versand_geheimnis (hash) values (encode(extensions.digest('geheim-test', 'sha256'), 'hex'));
set role authenticated; set test.uid = '11111111-1111-1111-1111-111111111111'; set test.aal = 'aal2';
do $$ begin perform public.auftrag_link_erzeugen('a1'); raise exception 'Link ohne Auftrag'; exception when invalid_parameter_value then raise notice 'ok  Link nur für Aufträge'; end $$;
select public.meldung_status_setzen('a1', 'auftrag'); select public.meldung_status_setzen('a2', 'auftrag');
create temp table t (token text); grant all on t to anon, authenticated;
insert into t select public.auftrag_link_erzeugen('a1');
select pg_temp.erwarte((select count(*) from public.meldungen where id = 'a1' and erledigt_token_hash is not null and erledigt_token_hash <> (select token from t))::bigint, 1, 'nur der Hash des Tokens liegt in der Datenbank');
set test.uid = '22222222-2222-2222-2222-222222222222';
do $$ begin perform public.auftrag_link_erzeugen('a2'); raise exception 'Fremder erzeugt Link'; exception when insufficient_privilege then raise notice 'ok  Nicht-Mitglied erzeugt keinen Link'; end $$;
reset role;
set role anon;
select pg_temp.erwarte((select count(*) from public.auftrag_link_ansehen((select token from t)))::bigint, 1, 'Link zeigt den Auftrag (ohne Personendaten)');
select pg_temp.erwarte((select count(*) from public.auftrag_link_ansehen(repeat('0', 64)))::bigint, 0, 'falsches Token zeigt nichts');
select pg_temp.erwarte(public.auftrag_erledigt_mit_token(repeat('a', 64))::int::bigint, 0, 'falsches Token meldet nichts');
select pg_temp.erwarte(public.auftrag_erledigt_mit_token((select token from t))::int::bigint, 1, 'Klick im Mail: Auftrag erledigt');
select pg_temp.erwarte(public.auftrag_erledigt_mit_token((select token from t))::int::bigint, 0, 'derselbe Link geht nur einmal');
reset role;
select pg_temp.erwarte((select count(*) from public.meldungen where id = 'a1' and status = 'erledigt' and bewertung_faellig between now() + interval '23 hours' and now() + interval '25 hours')::bigint, 1, 'Bewertung für in 24 Stunden geplant');
select pg_temp.erwarte((select count(*) from public.audit_log where aktion = 'auftrag_erledigt_link')::bigint, 1, 'Klick protokolliert');
set role authenticated; set test.uid = '11111111-1111-1111-1111-111111111111'; set test.aal = 'aal2';
select public.meldung_status_setzen('a2', 'erledigt');
reset role;
select pg_temp.erwarte((select count(*) from public.meldungen where id = 'a2' and bewertung_faellig is null)::bigint, 1, 'ohne Mail des Kunden keine Bewertungs-Mail geplant');
set role anon;
select pg_temp.erwarte((select count(*) from public.bewertungen_abholen('geheim-test'))::bigint, 0, 'vor Ablauf von 24 Stunden nichts fällig');
reset role;
update public.meldungen set bewertung_faellig = now() - interval '1 minute' where id = 'a1';
set role anon;
do $$ begin perform public.bewertungen_abholen('falsch'); raise exception 'Versand ohne Geheimnis'; exception when insufficient_privilege then raise notice 'ok  Versand nur mit Geheimnis'; end $$;
select pg_temp.erwarte((select count(*) from public.bewertungen_abholen('geheim-test') where email = 'kunde@beispiel.ch')::bigint, 1, 'nach 24 Stunden: Bewertungs-Mail fällig');
select pg_temp.erwarte((select count(*) from public.bewertungen_abholen('geheim-test'))::bigint, 0, 'jede Bewertungs-Mail nur einmal');
select public.bewertung_zuruecklegen('geheim-test', 'a1');
reset role;
select pg_temp.erwarte((select count(*) from public.meldungen where id = 'a1' and bewertung_gesendet is null and bewertung_faellig > now())::bigint, 1, 'Fehlschlag: neuer Versuch später');
set role anon;
do $$ begin perform count(*) from public.versand_geheimnis; raise exception 'Geheimnis lesbar'; exception when insufficient_privilege then raise notice 'ok  Versand-Geheimnis nicht lesbar'; end $$;
reset role;
\echo RAUCHPROBE GRÜN
