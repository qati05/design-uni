-- Auftrag erledigt per Link in der Mail, Bitte um Bewertung 24 Stunden später. NICHT ohne Freigabe anwenden.
-- Ablauf:
--   1. Ein Mitglied setzt eine Meldung auf «Auftrag»: auftrag_link_erzeugen() gibt einmalig ein Token zurück; das Cockpit
--      schickt dem Betrieb eine Mail mit Link. In der Datenbank liegt nur der Hash des Tokens.
--   2. Klick im Mail → Bestätigungsseite im Cockpit → auftrag_erledigt_mit_token() (anon, nur mit gültigem Token, einmalig).
--   3. Wird eine Meldung «erledigt» (per Link oder im Cockpit) und hat der Kunde freiwillig eine Mail angegeben,
--      plant der Trigger die Bitte um Bewertung für 24 Stunden später. Zurück aus «erledigt» hebt die Planung auf.
--   4. Der Versand (Cockpit /api/versand, vom Zeitplan aufgerufen) holt fällige Mails mit einem Geheimnis ab
--      (bewertungen_abholen) und meldet Fehlschläge zurück (bewertung_zuruecklegen). Jede Mail höchstens einmal.

alter table public.meldungen
  add column email text check (email is null or (length(email) <= 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$')),
  add column erledigt_token_hash text check (erledigt_token_hash is null or erledigt_token_hash ~ '^[0-9a-f]{64}$'),
  add column erledigt_token_bis timestamptz,
  add column bewertung_faellig timestamptz,
  add column bewertung_gesendet timestamptz;
create index meldungen_bewertung_faellig on public.meldungen (bewertung_faellig) where bewertung_gesendet is null;

-- Planung der Bewertung: an den Status gebunden, egal ob per Link oder im Cockpit gesetzt.
create function public.bewertung_planen() returns trigger language plpgsql set search_path = '' as $$
begin
  if new.status = 'erledigt' and old.status is distinct from 'erledigt' and new.email is not null and new.bewertung_gesendet is null then
    new.bewertung_faellig := now() + interval '24 hours';
  elsif new.status <> 'erledigt' and new.bewertung_gesendet is null then
    new.bewertung_faellig := null;
  end if;
  if new.status <> 'auftrag' then new.erledigt_token_hash := null; new.erledigt_token_bis := null; end if;
  return new;
end $$;
create trigger meldungen_bewertung_planen before update of status on public.meldungen for each row execute function public.bewertung_planen();

-- 1. Link erzeugen (nur Mitglied, nur bei Status «Auftrag»). Gibt das Token im Klartext genau einmal zurück.
create function public.auftrag_link_erzeugen(p_id text) returns text
language plpgsql security definer set search_path = '' as $$
declare v_token text := encode(extensions.gen_random_bytes(32), 'hex');
begin
  if not public.ist_mitglied() then raise exception 'nur Mitglieder' using errcode = '42501'; end if;
  update public.meldungen set erledigt_token_hash = encode(extensions.digest(v_token, 'sha256'), 'hex'), erledigt_token_bis = now() + interval '60 days'
   where id = p_id and status = 'auftrag';
  if not found then raise exception 'Meldung ist kein Auftrag' using errcode = '22023'; end if;
  return v_token;
end $$;

-- 2a. Was der Link zeigt (ohne Personendaten): Art, Tesla, Eingang. Nur mit gültigem Token.
create function public.auftrag_link_ansehen(p_token text) returns table (art text, tesla boolean, erstellt timestamptz, mit_mail boolean)
language sql stable security definer set search_path = '' as $$
  select m.art, m.tesla, m.erstellt, m.email is not null from public.meldungen m
   where p_token ~ '^[0-9a-f]{64}$' and m.status = 'auftrag'
     and m.erledigt_token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex') and m.erledigt_token_bis > now()
$$;

-- 2b. Erledigt melden: einmalig, danach ist das Token gelöscht (Trigger). Protokolliert ohne Akteur (Mail-Link).
create function public.auftrag_erledigt_mit_token(p_token text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare v_id text;
begin
  if p_token !~ '^[0-9a-f]{64}$' then return false; end if;
  update public.meldungen set status = 'erledigt', aktualisiert = now()
   where status = 'auftrag' and erledigt_token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex') and erledigt_token_bis > now()
   returning id into v_id;
  if v_id is null then return false; end if;
  insert into public.audit_log (akteur, aktion, ziel, ergebnis) values (null, 'auftrag_erledigt_link', v_id, 'ok');
  return true;
end $$;

-- 4. Versand: Geheimnis liegt nur in der Datenbank (Tabelle ohne Rechte) und beim Versand-Aufruf des Cockpits.
create table public.versand_geheimnis (id smallint primary key default 1 check (id = 1), hash text not null check (hash ~ '^[0-9a-f]{64}$'));
alter table public.versand_geheimnis enable row level security;
revoke all on public.versand_geheimnis from anon, authenticated;

create function public.versand_erlaubt(p_geheimnis text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.versand_geheimnis where hash = encode(extensions.digest(coalesce(p_geheimnis, ''), 'sha256'), 'hex'))
$$;

-- Holt fällige Bitten und markiert sie sofort als gesendet (kein Doppelversand bei parallelen Aufrufen).
create function public.bewertungen_abholen(p_geheimnis text, p_max integer default 20) returns table (id text, email text, name text)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if not public.versand_erlaubt(p_geheimnis) then raise exception 'kein Versand' using errcode = '42501'; end if;
  return query
    update public.meldungen m set bewertung_gesendet = now()
     where m.id in (select x.id from public.meldungen x where x.bewertung_faellig <= now() and x.bewertung_gesendet is null and x.status = 'erledigt' and x.email is not null
                    order by x.bewertung_faellig limit least(greatest(p_max, 1), 100) for update skip locked)
    returning m.id, m.email, m.name;
end $$;

-- Fehlschlag beim Mail-Dienst: zurück in die Warteschlange, neuer Versuch in einer Stunde.
create function public.bewertung_zuruecklegen(p_geheimnis text, p_id text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.versand_erlaubt(p_geheimnis) then raise exception 'kein Versand' using errcode = '42501'; end if;
  update public.meldungen set bewertung_gesendet = null, bewertung_faellig = now() + interval '1 hour' where id = p_id and status = 'erledigt';
end $$;

revoke all on function public.auftrag_link_erzeugen(text), public.auftrag_link_ansehen(text), public.auftrag_erledigt_mit_token(text),
  public.versand_erlaubt(text), public.bewertungen_abholen(text, integer), public.bewertung_zuruecklegen(text, text) from public, anon, authenticated;
grant execute on function public.auftrag_link_erzeugen(text) to authenticated;
grant execute on function public.auftrag_link_ansehen(text), public.auftrag_erledigt_mit_token(text), public.bewertungen_abholen(text, integer), public.bewertung_zuruecklegen(text, text) to anon, authenticated;
-- Einrichten (einmal, mit dem Geheimnis aus VERSAND_GEHEIMNIS):
--   insert into public.versand_geheimnis (hash) values (encode(extensions.digest('<geheimnis>', 'sha256'), 'hex'));
-- Zeitplan (alle 15 Minuten), z. B. mit pg_cron und pg_net:
--   select cron.schedule('bewertungen', '*/15 * * * *', $$ select net.http_post('https://cockpit.autospeedy.ch/api/versand', '{}'::jsonb, headers => '{"Authorization":"Bearer <geheimnis>"}'::jsonb) $$);
