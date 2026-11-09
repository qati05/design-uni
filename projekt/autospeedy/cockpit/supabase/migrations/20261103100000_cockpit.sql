-- Medaur-Cockpit: eine Datenbank für alle Kunden-Betriebe. NICHT ohne Freigabe anwenden.
-- Nie angewendet (kein Supabase-Projekt angelegt, Stand 09.11.2026): darum diese eine Datei verkleinert statt einer
-- Folge-Migration [Entscheid · Roni, 08./09.11.2026: das Cockpit macht nur noch «Website pflegen»].
-- Muster aus qati05/medaur (Audit nur anfügbar, Akteur aus auth.uid()). Geschäftsregel: Website kaufen, Cockpit mieten.
--   * Keine Kundendaten: Formulare der Website gehen direkt per Mail an den Betrieb. Keine Meldungen, keine Fotos,
--     keine Zählung, kein Speicher-Bucket, keine Löschfrist, kein Export.
--   * betrieb.aktiv = false: niemand vom Betrieb kommt ins Cockpit. Die Website läuft weiter.
--   * Lesen nur die Mitglieder dieses Betriebs (mein_betrieb()); Anmeldung mit Mail-Code (Supabase Auth, 30 Tage pro Gerät).
--   * Die Inhalte der Website liegen nicht hier, sondern als site.json im Repo des Betriebs (GitHub-API, Token in der Umgebung).

create table public.betrieb (
  id                   text primary key check (id ~ '^[a-z0-9-]{2,40}$'),
  name                 text not null check (length(name) between 2 and 120),
  aktiv                boolean not null default true,  -- Cockpit gemietet
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

-- Betrieb des angemeldeten Kontos, nur wenn das Cockpit für den Betrieb an ist. Sonst null.
create function public.mein_betrieb() returns text
language sql stable security definer set search_path = '' as $$
  select m.betrieb_id from public.betrieb_mitglied m join public.betrieb b on b.id = m.betrieb_id
   where m.user_id = auth.uid() and b.aktiv
$$;
create function public.ist_mitglied() returns boolean
language sql stable security definer set search_path = '' as $$ select public.mein_betrieb() is not null $$;

alter table public.betrieb enable row level security;
alter table public.betrieb_mitglied enable row level security;

create policy mitglied_sieht_sich on public.betrieb_mitglied for select to authenticated using (user_id = auth.uid());
-- Supabase gibt per Default-Privileges allen Rollen alles: hier ausdrücklich zurücknehmen (Muster medaur).
revoke all on public.betrieb, public.betrieb_mitglied from anon, authenticated;
grant select on public.betrieb_mitglied to authenticated;
-- Tabelle betrieb (mit Repo-Angaben) liest nur die Funktion mein_betrieb_website(); Einstellungen ändert das Studio direkt in Supabase.

create function public.mein_betrieb_website() returns table (id text, name text, website_url text, github_repo text, github_pfad text, github_zweig text)
language sql stable security definer set search_path = '' as $$
  select b.id, b.name, b.website_url, b.github_repo, b.github_pfad, b.github_zweig from public.betrieb b where b.id = public.mein_betrieb()
$$;

-- Audit-Log wie medaur: nur anfügbar, Akteur aus auth.uid(), Betrieb aus der Mitgliedschaft (auch wenn das Cockpit aus ist).
-- Enthält nur Konten des Betriebs (Anmeldung, Pflege), keine Kundendaten.
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

-- Rechte auf Funktionen: erst allen nehmen, dann gezielt geben. anon bekommt keine Funktion.
revoke all on all functions in schema public from public, anon, authenticated;
grant execute on function public.mein_betrieb(), public.ist_mitglied(), public.mein_betrieb_website(), public.pflege_zuletzt(),
  public.audit_schreiben(text, text, text, inet, text) to authenticated;

-- Neuer Betrieb: siehe LIESMICH.md («Neuen Kunden anlegen»).
