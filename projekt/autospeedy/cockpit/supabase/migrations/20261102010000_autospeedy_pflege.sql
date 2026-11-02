-- Pflege der Website im Cockpit (ersetzt den Git-Editor /admin/): Öffnungszeiten, Ausnahmen, Hinweis-Leiste, Team.
-- Eine Zeile (id = 1). Lesen und Schreiben nur Mitglieder mit aal2; schreiben nur über pflege_speichern (prüft, protokolliert).
-- Der Website-Bau liest über pflege_oeffentlich() (anon): nur, was ohnehin auf der Website steht.
create table public.pflege (
  id smallint primary key default 1 check (id = 1),
  daten jsonb not null check (jsonb_typeof(daten) = 'object' and octet_length(daten::text) <= 50000),
  geaendert timestamptz not null default now(),
  geaendert_von text check (length(geaendert_von) <= 254)
);
alter table public.pflege enable row level security;
revoke all on public.pflege from anon, authenticated;
grant select on public.pflege to authenticated;
create policy mitglied_liest_pflege on public.pflege for select to authenticated using (public.ist_mitglied());

create function public.pflege_speichern(p_daten jsonb) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.ist_mitglied() then raise exception 'nur Mitglieder' using errcode = '42501'; end if;
  if jsonb_typeof(p_daten) <> 'object' or not (p_daten ?& array['hinweis', 'zeiten', 'ausnahmen', 'team']) then
    raise exception 'Pflege unvollständig' using errcode = '22023';
  end if;
  insert into public.pflege (id, daten, geaendert, geaendert_von) values (1, p_daten, now(), auth.jwt() ->> 'email')
  on conflict (id) do update set daten = excluded.daten, geaendert = excluded.geaendert, geaendert_von = excluded.geaendert_von;
  perform public.audit_schreiben('pflege', 'ok', null);
end $$;

create function public.pflege_oeffentlich() returns jsonb
language sql stable security definer set search_path = '' as $$
  select daten - '_intern' from public.pflege where id = 1
$$;

revoke all on function public.pflege_speichern(jsonb), public.pflege_oeffentlich() from public, anon, authenticated;
grant execute on function public.pflege_speichern(jsonb) to authenticated;
grant execute on function public.pflege_oeffentlich() to anon, authenticated;
