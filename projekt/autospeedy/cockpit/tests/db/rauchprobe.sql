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
\echo RAUCHPROBE GRÜN
