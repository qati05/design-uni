-- Medaur-Cockpit: eine Datenbank für alle Kunden-Betriebe. NICHT ohne Freigabe anwenden.
-- Ersetzt die früheren Entwürfe (nie angewendet). Muster aus qati05/medaur (Audit nur anfügbar, Akteur aus auth.uid()).
-- Geschäftsregel: Website kaufen, Cockpit mieten.
--   * betrieb.aktiv = false: niemand vom Betrieb kommt ins Cockpit. Website, Formular (dann per Mail) und gekaufte
--     Automationen laufen weiter: die Website-Funktion schreibt mit service_role, Mail-Link und Versand prüfen Token bzw. Geheimnis.
--   * Jede Zeile trägt betrieb_id. Lesen nur die Mitglieder dieses Betriebs (mein_betrieb()), mit zweitem Faktor (aal2).
--   * Meldungen schreibt nur die Website-Funktion (service_role). Status und Notiz nur über die Funktionen unten.
--   * Fotos im privaten Bucket «schadenfotos» unter <betrieb_id>/<meldung_id>/foto-n.jpg, signierte Links (10 Minuten).
--   * Löschfrist 365 Tage [Annahme, je Betrieb festzulegen]: erst die Fotos über die Storage-API, dann die Zeilen.
--   * Studio-Admins (Medaur) dürfen pro Betrieb einen CSV-Export ziehen, sonst nichts. Sie sind keine Mitglieder.

create table public.betrieb (
  id                   text primary key check (id ~ '^[a-z0-9-]{2,40}$'),
  name                 text not null check (length(name) between 2 and 120),
  aktiv                boolean not null default true,  -- Cockpit gemietet
  automation_bewertung boolean not null default false, -- einzeln gekauft: Link «Auto fertig» und Bitte um Bewertung
  website_url          text not null check (website_url ~ '^https://[a-z0-9.-]+$'),
  github_repo          text check (github_repo ~ '^[A-Za-z0-9-]{1,39}/[A-Za-z0-9._-]{1,100}$'),
  github_pfad          text check (github_pfad ~ '^[A-Za-z0-9._/-]{1,200}\.json$' and github_pfad !~ '\.\.'),
  github_zweig         text not null default 'main' check (github_zweig ~ '^[A-Za-z0-9._/-]{1,100}$'),
  erstellt             timestamptz not null default now()
);

-- Ein Konto gehört zu genau einem Betrieb.
create table public.betrieb_mitglied (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  betrieb_id text not null references public.betrieb(id) on delete cascade,
  rolle      text not null default 'werkstatt' check (rolle in ('werkstatt', 'leitung'))
);
create index betrieb_mitglied_betrieb on public.betrieb_mitglied (betrieb_id);

create table public.studio_admin (user_id uuid primary key references auth.users(id) on delete cascade);

-- Betrieb des angemeldeten Kontos, nur mit zweitem Faktor und nur, wenn das Cockpit für den Betrieb an ist. Sonst null.
create function public.mein_betrieb() returns text
language sql stable security definer set search_path = '' as $$
  select m.betrieb_id from public.betrieb_mitglied m join public.betrieb b on b.id = m.betrieb_id
   where m.user_id = auth.uid() and b.aktiv and coalesce(auth.jwt()->>'aal', '') = 'aal2'
$$;
create function public.ist_mitglied() returns boolean
language sql stable security definer set search_path = '' as $$ select public.mein_betrieb() is not null $$;
create function public.ist_studio_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.studio_admin where user_id = auth.uid()) and coalesce(auth.jwt()->>'aal', '') = 'aal2'
$$;

create table public.meldungen (
  id           text primary key default replace(gen_random_uuid()::text, '-', ''),
  betrieb_id   text not null references public.betrieb(id) on delete cascade,
  erstellt     timestamptz not null default now(),
  aktualisiert timestamptz not null default now(),
  art          text not null check (art in ('Parkschaden','Unfall','Hagel','Kratzer oder Lack','Scheibe','Felge','Etwas anderes','Rückruf')),
  tesla        boolean not null default false,
  tesla_modell text check (tesla_modell is null or tesla_modell in ('Model 3', 'Model Y', 'Model S', 'Model X', 'Anderes Modell')),
  stellen      text[] not null default '{}' check (cardinality(stellen) <= 12),
  bemerkung    text not null default '' check (length(bemerkung) <= 3000),
  name         text not null check (length(name) between 1 and 120),
  telefon      text not null check (telefon ~ '^[+0-9 ()./-]{6,40}$'),
  email        text check (email is null or (length(email) <= 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$')),
  quelle       text not null default 'website' check (quelle in ('website','whatsapp','telefon')),
  status       text not null default 'neu' check (status in ('neu','zurueckgerufen','offerte','auftrag','erledigt','verloren')),
  notiz        text not null default '' check (length(notiz) <= 2000),
  -- Link «Auto fertig»: die Website-Funktion legt das Token beim Eingang an (nur bei gekaufter Automation), hier nur der Hash.
  erledigt_token_hash text check (erledigt_token_hash is null or erledigt_token_hash ~ '^[0-9a-f]{64}$'),
  erledigt_token_bis  timestamptz,
  bewertung_faellig   timestamptz,
  bewertung_gesendet  timestamptz,
  constraint tesla_modell_nur_bei_tesla check (tesla_modell is null or tesla)
);
create index meldungen_betrieb_erstellt on public.meldungen (betrieb_id, erstellt desc);
create index meldungen_bewertung_faellig on public.meldungen (bewertung_faellig) where bewertung_gesendet is null;
create index meldungen_betrieb_email on public.meldungen (betrieb_id, email, erstellt) where email is not null; -- Grenze Bestätigungs-Mails

create table public.meldung_fotos (
  id         text primary key default replace(gen_random_uuid()::text, '-', ''),
  meldung_id text not null references public.meldungen(id) on delete cascade,
  pfad       text not null unique check (pfad ~ '^[a-z0-9-]{2,40}/[A-Za-z0-9]+/foto-[0-9]{1,2}\.jpg$')
);
-- Der Foto-Pfad muss mit Betrieb und Meldung beginnen: sonst könnte ein Foto in einem fremden Ordner landen.
create function public.foto_pfad_pruefen() returns trigger language plpgsql set search_path = '' as $$
begin
  if not exists (select 1 from public.meldungen m where m.id = new.meldung_id and new.pfad like m.betrieb_id || '/' || m.id || '/%') then
    raise exception 'Foto-Pfad passt nicht zur Meldung' using errcode = '23514';
  end if;
  return new;
end $$;
create trigger meldung_fotos_pfad before insert or update on public.meldung_fotos for each row execute function public.foto_pfad_pruefen();

alter table public.betrieb enable row level security;
alter table public.betrieb_mitglied enable row level security;
alter table public.studio_admin enable row level security;
alter table public.meldungen enable row level security;
alter table public.meldung_fotos enable row level security;

create policy mitglied_sieht_sich on public.betrieb_mitglied for select to authenticated using (user_id = auth.uid());
create policy mitglied_liest_meldungen on public.meldungen for select to authenticated using (betrieb_id = public.mein_betrieb());
create policy mitglied_liest_fotos on public.meldung_fotos for select to authenticated
  using (exists (select 1 from public.meldungen m where m.id = meldung_id and m.betrieb_id = public.mein_betrieb()));
-- Supabase gibt per Default-Privileges allen Rollen alles: hier ausdrücklich zurücknehmen (Muster medaur).
revoke all on public.betrieb, public.betrieb_mitglied, public.studio_admin, public.meldungen, public.meldung_fotos from anon, authenticated;
grant select on public.betrieb_mitglied, public.meldungen, public.meldung_fotos to authenticated;
-- Tabelle betrieb (mit Repo-Angaben) liest nur die Funktion mein_betrieb_website(); Einstellungen ändert das Studio direkt in Supabase.

create function public.mein_betrieb_website() returns table (id text, name text, website_url text, github_repo text, github_pfad text, github_zweig text)
language sql stable security definer set search_path = '' as $$
  select b.id, b.name, b.website_url, b.github_repo, b.github_pfad, b.github_zweig from public.betrieb b where b.id = public.mein_betrieb()
$$;

create function public.meldung_status_setzen(p_id text, p_status text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  update public.meldungen set status = p_status, aktualisiert = now() where id = p_id and betrieb_id = public.mein_betrieb();
  if not found then raise exception 'nur Mitglieder dieses Betriebs' using errcode = '42501'; end if;
  perform public.audit_schreiben('status_' || p_status, 'ok', p_id);
end $$;

create function public.meldung_notiz_setzen(p_id text, p_notiz text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  update public.meldungen set notiz = left(p_notiz, 2000), aktualisiert = now() where id = p_id and betrieb_id = public.mein_betrieb();
  if not found then raise exception 'nur Mitglieder dieses Betriebs' using errcode = '42501'; end if;
  perform public.audit_schreiben('notiz', 'ok', p_id);
end $$;

-- Audit-Log wie medaur: nur anfügbar, Akteur aus auth.uid(), Betrieb aus der Mitgliedschaft (auch wenn das Cockpit aus ist).
create table public.audit_log (
  id bigserial primary key, zeit timestamptz not null default now(), akteur uuid, betrieb_id text,
  aktion text not null check (aktion ~ '^[a-z][a-z0-9_]{2,59}$'), ziel text check (length(ziel) <= 200),
  ergebnis text not null check (ergebnis in ('ok','abgelehnt','fehler')), ip inet, user_agent text check (length(user_agent) <= 400)
);
create index audit_log_betrieb_aktion on public.audit_log (betrieb_id, aktion, zeit desc);
alter table public.audit_log enable row level security;
revoke all on public.audit_log from anon, authenticated;
revoke all on sequence public.audit_log_id_seq from anon, authenticated;
create function public.audit_log_unveraenderlich() returns trigger language plpgsql set search_path = '' as $$
begin raise exception 'audit_log ist nur anfügbar: % verboten', tg_op using errcode = '42501'; end $$;
create trigger audit_log_sperre before update or delete or truncate on public.audit_log for each statement execute function public.audit_log_unveraenderlich();
create function public.audit_schreiben(p_aktion text, p_ergebnis text, p_ziel text default null, p_ip inet default null, p_user_agent text default null) returns bigint
language plpgsql security definer set search_path = '' as $$
declare v_id bigint;
begin
  if auth.uid() is null then raise exception 'angemeldetes Konto nötig' using errcode = '42501'; end if;
  insert into public.audit_log (akteur, betrieb_id, aktion, ziel, ergebnis, ip, user_agent)
  values (auth.uid(), (select betrieb_id from public.betrieb_mitglied where user_id = auth.uid()), p_aktion, left(p_ziel, 200), p_ergebnis, p_ip, left(p_user_agent, 400))
  returning id into v_id;
  return v_id;
end $$;

-- Wann und von wem die Website zuletzt gepflegt wurde (die Commit-Nachricht im Repo trägt bewusst keinen Namen).
create function public.pflege_zuletzt() returns table (zeit timestamptz, email text)
language sql stable security definer set search_path = '' as $$
  select a.zeit, u.email::text from public.audit_log a left join auth.users u on u.id = a.akteur
   where a.betrieb_id = public.mein_betrieb() and a.aktion = 'pflege' and a.ergebnis = 'ok' order by a.zeit desc limit 1
$$;

-- Zählung ohne Cookies (Website-Funktion /api/zaehl mit service_role): nur Betrieb, Tag, Punkt, Ort, Anzahl. Keine IP, keine Kennung.
create table public.zaehlung (
  betrieb_id text not null references public.betrieb(id) on delete cascade,
  tag    date not null default (now() at time zone 'Europe/Zurich')::date,
  punkt  text not null check (punkt ~ '^[a-z0-9-]{2,40}$'),
  ort    text not null check (ort ~ '^[a-z0-9-]{2,40}$'),
  anzahl integer not null default 0 check (anzahl >= 0),
  primary key (betrieb_id, tag, punkt, ort)
);
alter table public.zaehlung enable row level security;
revoke all on public.zaehlung from anon, authenticated;
grant select on public.zaehlung to authenticated;
create policy mitglied_liest_zaehlung on public.zaehlung for select to authenticated using (betrieb_id = public.mein_betrieb());
create function public.zaehlen(p_betrieb text, p_punkt text, p_ort text) returns void
language sql security definer set search_path = '' as $$
  insert into public.zaehlung (betrieb_id, punkt, ort, anzahl) values (p_betrieb, p_punkt, p_ort, 1)
  on conflict (betrieb_id, tag, punkt, ort) do update set anzahl = public.zaehlung.anzahl + 1;
$$;

-- «Auto fertig» und Bitte um Bewertung (einzeln gekaufte Automation, läuft auch ohne gemietetes Cockpit):
--   «erledigt» (per Link oder im Cockpit) plant bei angegebener Mail die Bitte für 24 Stunden später.
--   Zurück aus «erledigt» hebt die Planung auf. «erledigt» oder «verloren» macht den Link ungültig.
create function public.bewertung_planen() returns trigger language plpgsql set search_path = '' as $$
begin
  if new.status = 'erledigt' and old.status is distinct from 'erledigt' and new.email is not null and new.bewertung_gesendet is null
     and exists (select 1 from public.betrieb b where b.id = new.betrieb_id and b.automation_bewertung) then
    new.bewertung_faellig := now() + interval '24 hours';
  elsif new.status <> 'erledigt' and new.bewertung_gesendet is null then
    new.bewertung_faellig := null;
  end if;
  if new.status in ('erledigt', 'verloren') then new.erledigt_token_hash := null; new.erledigt_token_bis := null; end if;
  return new;
end $$;
create trigger meldungen_bewertung_planen before update of status on public.meldungen for each row execute function public.bewertung_planen();

-- Was der Link zeigt (ohne Personendaten). Nur mit gültigem Token und offener Meldung.
create function public.auftrag_link_ansehen(p_token text) returns table (art text, tesla boolean, erstellt timestamptz, mit_mail boolean)
language sql stable security definer set search_path = '' as $$
  select m.art, m.tesla, m.erstellt, m.email is not null from public.meldungen m
   where p_token ~ '^[0-9a-f]{64}$' and m.status in ('neu','zurueckgerufen','offerte','auftrag')
     and m.erledigt_token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex') and m.erledigt_token_bis > now()
$$;

-- Erledigt melden: einmalig, danach ist das Token gelöscht (Trigger). Protokolliert ohne Akteur (Mail-Link).
create function public.auftrag_erledigt_mit_token(p_token text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare v_id text; v_betrieb text;
begin
  if p_token !~ '^[0-9a-f]{64}$' then return false; end if;
  update public.meldungen set status = 'erledigt', aktualisiert = now()
   where status in ('neu','zurueckgerufen','offerte','auftrag') and erledigt_token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex') and erledigt_token_bis > now()
   returning id, betrieb_id into v_id, v_betrieb;
  if v_id is null then return false; end if;
  insert into public.audit_log (akteur, betrieb_id, aktion, ziel, ergebnis) values (null, v_betrieb, 'auftrag_erledigt_link', v_id, 'ok');
  return true;
end $$;

-- Zeitplan-Aufgaben (Cockpit /api/versand): nur mit dem Versand-Geheimnis. Es liegt gehasht in einer Tabelle ohne Rechte.
create table public.versand_geheimnis (id smallint primary key default 1 check (id = 1), hash text not null check (hash ~ '^[0-9a-f]{64}$'));
alter table public.versand_geheimnis enable row level security;
revoke all on public.versand_geheimnis from anon, authenticated;
create function public.versand_erlaubt(p_geheimnis text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.versand_geheimnis where hash = encode(extensions.digest(coalesce(p_geheimnis, ''), 'sha256'), 'hex'))
$$;

-- Holt fällige Bitten aller Betriebe mit gekaufter Automation (auch bei Cockpit aus) und markiert sie sofort als gesendet.
create function public.bewertungen_abholen(p_geheimnis text, p_max integer default 20) returns table (id text, email text, name text, website text, betrieb text)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if not public.versand_erlaubt(p_geheimnis) then raise exception 'kein Versand' using errcode = '42501'; end if;
  return query
    with weg as (
      update public.meldungen m set bewertung_gesendet = now()
       where m.id in (select x.id from public.meldungen x join public.betrieb b on b.id = x.betrieb_id
                       where x.bewertung_faellig <= now() and x.bewertung_gesendet is null and x.status = 'erledigt' and x.email is not null and b.automation_bewertung
                       order by x.bewertung_faellig limit least(greatest(p_max, 1), 100) for update of x skip locked)
      returning m.id, m.email, m.name, m.betrieb_id)
    select w.id, w.email, w.name, b.website_url, b.name from weg w join public.betrieb b on b.id = w.betrieb_id;
end $$;

create function public.bewertung_zuruecklegen(p_geheimnis text, p_id text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.versand_erlaubt(p_geheimnis) then raise exception 'kein Versand' using errcode = '42501'; end if;
  update public.meldungen set bewertung_gesendet = null, bewertung_faellig = now() + interval '1 hour' where id = p_id and status = 'erledigt';
end $$;

-- Privater Bucket für Schadenfotos. Mitglieder lesen nur den Ordner ihres Betriebs.
insert into storage.buckets (id, name, public) values ('schadenfotos', 'schadenfotos', false) on conflict (id) do nothing;
create policy mitglied_liest_schadenfotos on storage.objects for select to authenticated
  using (bucket_id = 'schadenfotos' and split_part(name, '/', 1) = public.mein_betrieb());

-- Löschfrist [Annahme 365 Tage]. Supabase verbietet DELETE auf storage.objects per SQL; darum zwei Schritte im Zeitplan:
--   1. fotos_abgelaufen() nennt die Pfade; das Cockpit löscht sie über die Storage-API (die Policy unten erlaubt genau diese).
--   2. meldungen_aufraeumen() löscht Meldungen über der Frist, deren Fotos nicht mehr im Speicher liegen.
create function public.foto_abgelaufen(p_pfad text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.meldung_fotos f join public.meldungen m on m.id = f.meldung_id where f.pfad = p_pfad and m.erstellt < now() - interval '365 days')
$$;
create policy frist_abgelaufen_lesen on storage.objects for select to anon using (bucket_id = 'schadenfotos' and public.foto_abgelaufen(name));
create policy frist_abgelaufen_loeschen on storage.objects for delete to anon using (bucket_id = 'schadenfotos' and public.foto_abgelaufen(name));
create function public.fotos_abgelaufen(p_geheimnis text) returns setof text
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.versand_erlaubt(p_geheimnis) then raise exception 'kein Versand' using errcode = '42501'; end if;
  return query select f.pfad from public.meldung_fotos f join public.meldungen m on m.id = f.meldung_id
    where m.erstellt < now() - interval '365 days'
      and exists (select 1 from storage.objects o where o.bucket_id = 'schadenfotos' and o.name = f.pfad) limit 1000;
end $$;
create function public.meldungen_aufraeumen(p_geheimnis text) returns integer
language plpgsql security definer set search_path = '' as $$
declare v integer;
begin
  if not public.versand_erlaubt(p_geheimnis) then raise exception 'kein Versand' using errcode = '42501'; end if;
  with weg as (
    delete from public.meldungen m where m.erstellt < now() - interval '365 days'
       and not exists (select 1 from public.meldung_fotos f join storage.objects o on o.bucket_id = 'schadenfotos' and o.name = f.pfad where f.meldung_id = m.id)
    returning 1)
  select count(*)::integer into v from weg;
  return v;
end $$;

-- CSV-Export eines Betriebs: nur Studio-Admins (Kündigung: der Kunde bekommt seine Daten). Wird protokolliert.
create function public.export_meldungen(p_betrieb text) returns table (erstellt timestamptz, art text, tesla boolean, tesla_modell text, stellen text, bemerkung text, name text, telefon text, email text, quelle text, status text, notiz text)
language plpgsql security definer set search_path = '' as $$
begin
  if not public.ist_studio_admin() then raise exception 'nur Studio' using errcode = '42501'; end if;
  insert into public.audit_log (akteur, betrieb_id, aktion, ergebnis) values (auth.uid(), p_betrieb, 'export', 'ok');
  return query select m.erstellt, m.art, m.tesla, m.tesla_modell, array_to_string(m.stellen, ', '), m.bemerkung, m.name, m.telefon, m.email, m.quelle, m.status, m.notiz
    from public.meldungen m where m.betrieb_id = p_betrieb order by m.erstellt;
end $$;
create function public.betriebe_liste() returns table (id text, name text, aktiv boolean)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.ist_studio_admin() then raise exception 'nur Studio' using errcode = '42501'; end if;
  return query select b.id, b.name, b.aktiv from public.betrieb b order by b.name;
end $$;

-- Rechte auf Funktionen: erst allen nehmen, dann gezielt geben.
revoke all on all functions in schema public from public, anon, authenticated;
grant execute on function public.mein_betrieb(), public.ist_mitglied(), public.ist_studio_admin(), public.mein_betrieb_website(), public.pflege_zuletzt(),
  public.meldung_status_setzen(text, text), public.meldung_notiz_setzen(text, text), public.audit_schreiben(text, text, text, inet, text),
  public.export_meldungen(text), public.betriebe_liste() to authenticated;
grant execute on function public.auftrag_link_ansehen(text), public.auftrag_erledigt_mit_token(text),
  public.bewertungen_abholen(text, integer), public.bewertung_zuruecklegen(text, text), public.fotos_abgelaufen(text), public.meldungen_aufraeumen(text) to anon, authenticated;
grant execute on function public.foto_abgelaufen(text) to anon; -- nur für die Storage-Policy
grant execute on function public.zaehlen(text, text, text) to service_role;

-- Einrichten (einmal):
--   insert into public.versand_geheimnis (hash) values (encode(extensions.digest('<geheimnis aus VERSAND_GEHEIMNIS>', 'sha256'), 'hex'));
--   select cron.schedule('versand', '*/15 * * * *', $$ select net.http_post('https://<cockpit>/api/versand', '{}'::jsonb, headers => '{"Authorization":"Bearer <geheimnis>"}'::jsonb) $$);
-- Neuer Betrieb: siehe LIESMICH.md («Neuen Kunden anlegen»).
