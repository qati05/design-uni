-- Auto Speedy Cockpit: Schadenmeldungen, Fotos, Mitglieder, Audit-Log. NICHT ohne Freigabe anwenden.
-- Muster aus qati05/medaur supabase/migrations/20261106000000_cockpit_basis.sql (Audit nur anfügbar, Akteur aus auth.uid()).
-- Regeln:
--   * Meldungen schreibt nur die Serverfunktion der Website mit dem service_role-Schlüssel (Insert). Browser und anon: nichts.
--   * Lesen und Status/Notiz ändern nur Mitglieder des Betriebs (ist_mitglied()), und nur über die Funktionen unten.
--   * Fotos liegen im privaten Bucket «schadenfotos»; das Cockpit zeigt sie über signierte Links (10 Minuten).
--   * Löschfrist: Meldungen und Fotos nach 365 Tagen [Annahme, vom Betrieb festzulegen], Funktion meldungen_aufraeumen().

create table public.betrieb_mitglied (
  user_id uuid primary key references auth.users(id) on delete cascade,
  rolle   text not null default 'werkstatt' check (rolle in ('werkstatt', 'leitung'))
);

-- Wie ist_gruender() in medaur: Mitglied UND zweiter Faktor (aal2). Eine Sitzung nur mit Mail-Code liest nichts.
create function public.ist_mitglied() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.betrieb_mitglied where user_id = auth.uid())
     and coalesce(auth.jwt()->>'aal', '') = 'aal2';
$$;

create table public.meldungen (
  id          text primary key default replace(gen_random_uuid()::text, '-', ''),
  erstellt    timestamptz not null default now(),
  aktualisiert timestamptz not null default now(),
  art         text not null check (art in ('Parkschaden','Unfall','Hagel','Kratzer oder Lack','Scheibe','Felge','Etwas anderes','Rückruf')),
  tesla       boolean not null default false,
  stellen     text[] not null default '{}' check (cardinality(stellen) <= 12),
  bemerkung   text not null default '' check (length(bemerkung) <= 3000),
  name        text not null check (length(name) between 1 and 120),
  telefon     text not null check (telefon ~ '^[+0-9 ()./-]{6,40}$'),
  quelle      text not null default 'website' check (quelle in ('website','whatsapp','telefon')),
  status      text not null default 'neu' check (status in ('neu','zurueckgerufen','offerte','auftrag','erledigt','verloren')),
  notiz       text not null default '' check (length(notiz) <= 2000)
);
create index meldungen_erstellt on public.meldungen (erstellt desc);

create table public.meldung_fotos (
  id         text primary key default replace(gen_random_uuid()::text, '-', ''),
  meldung_id text not null references public.meldungen(id) on delete cascade,
  pfad       text not null check (pfad ~ '^[A-Za-z0-9]+/[A-Za-z0-9-]+\.jpg$')
);

alter table public.betrieb_mitglied enable row level security;
alter table public.meldungen enable row level security;
alter table public.meldung_fotos enable row level security;

create policy mitglied_sieht_sich on public.betrieb_mitglied for select to authenticated using (user_id = auth.uid());
create policy mitglied_liest_meldungen on public.meldungen for select to authenticated using (public.ist_mitglied());
create policy mitglied_liest_fotos on public.meldung_fotos for select to authenticated using (public.ist_mitglied());
-- Supabase gibt per Default-Privileges allen Rollen alles: hier ausdrücklich zurücknehmen (Muster medaur).
revoke all on public.betrieb_mitglied, public.meldungen, public.meldung_fotos from anon, authenticated;
grant select on public.betrieb_mitglied, public.meldungen, public.meldung_fotos to authenticated;
-- Kein insert/update/delete für authenticated oder anon: Änderungen nur über die Funktionen unten bzw. service_role.

create function public.meldung_status_setzen(p_id text, p_status text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.ist_mitglied() then raise exception 'nur Mitglieder' using errcode = '42501'; end if;
  update public.meldungen set status = p_status, aktualisiert = now() where id = p_id;
  perform public.audit_schreiben('status_' || p_status, 'ok', p_id);
end $$;

create function public.meldung_notiz_setzen(p_id text, p_notiz text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.ist_mitglied() then raise exception 'nur Mitglieder' using errcode = '42501'; end if;
  update public.meldungen set notiz = left(p_notiz, 2000), aktualisiert = now() where id = p_id;
  perform public.audit_schreiben('notiz', 'ok', p_id);
end $$;

-- Audit-Log wie medaur: nur anfügbar, Akteur aus auth.uid().
create table public.audit_log (
  id bigserial primary key, zeit timestamptz not null default now(), akteur uuid,
  aktion text not null check (aktion ~ '^[a-z][a-z0-9_]{2,59}$'), ziel text check (length(ziel) <= 200),
  ergebnis text not null check (ergebnis in ('ok','abgelehnt','fehler')), ip inet, user_agent text check (length(user_agent) <= 400)
);
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
  insert into public.audit_log (akteur, aktion, ziel, ergebnis, ip, user_agent) values (auth.uid(), p_aktion, left(p_ziel, 200), p_ergebnis, p_ip, left(p_user_agent, 400)) returning id into v_id;
  return v_id;
end $$;

-- Funktionen nur für angemeldete Konten
revoke all on function public.ist_mitglied(), public.meldung_status_setzen(text, text), public.meldung_notiz_setzen(text, text), public.audit_schreiben(text, text, text, inet, text) from public, anon;
grant execute on function public.ist_mitglied(), public.meldung_status_setzen(text, text), public.meldung_notiz_setzen(text, text), public.audit_schreiben(text, text, text, inet, text) to authenticated;

-- Privater Bucket für Fotos; lesen nur Mitglieder (signierte Links), schreiben nur service_role.
insert into storage.buckets (id, name, public) values ('schadenfotos', 'schadenfotos', false) on conflict (id) do nothing;
create policy mitglied_liest_schadenfotos on storage.objects for select to authenticated using (bucket_id = 'schadenfotos' and public.ist_mitglied());

-- Löschfrist [Annahme 365 Tage]: täglich per pg_cron aufrufen, z. B. select cron.schedule('meldungen-aufraeumen', '17 3 * * *', 'select public.meldungen_aufraeumen()');
-- Fotos im Storage löscht die Serverfunktion oder ein Job über die Storage-API anhand der gelöschten Pfade [nicht gebaut].
create function public.meldungen_aufraeumen() returns integer language sql security definer set search_path = '' as $$
  with weg as (delete from public.meldungen where erstellt < now() - interval '365 days' returning 1) select count(*)::integer from weg;
$$;
revoke all on function public.meldungen_aufraeumen() from public, anon, authenticated;

-- Zählung ohne Cookies (Website-Funktion /api/zaehl mit service_role): nur Tag, Punkt, Ort, Anzahl. Keine IP, keine Kennung.
create table public.zaehlung (
  tag    date not null default (now() at time zone 'Europe/Zurich')::date,
  punkt  text not null check (punkt ~ '^[a-z0-9-]{2,40}$'),
  ort    text not null check (ort ~ '^[a-z0-9-]{2,40}$'),
  anzahl integer not null default 0 check (anzahl >= 0),
  primary key (tag, punkt, ort)
);
alter table public.zaehlung enable row level security;
revoke all on public.zaehlung from anon, authenticated;
grant select on public.zaehlung to authenticated;
create policy mitglied_liest_zaehlung on public.zaehlung for select to authenticated using (public.ist_mitglied());
create function public.zaehlen(p_punkt text, p_ort text) returns void
language sql security definer set search_path = '' as $$
  insert into public.zaehlung (punkt, ort, anzahl) values (p_punkt, p_ort, 1)
  on conflict (tag, punkt, ort) do update set anzahl = public.zaehlung.anzahl + 1;
$$;
revoke all on function public.zaehlen(text, text) from public, anon, authenticated;
grant execute on function public.zaehlen(text, text) to service_role;
