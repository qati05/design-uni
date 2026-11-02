-- Teamfotos aus dem Cockpit: öffentlicher Bucket (die Fotos stehen ohnehin auf der Website), hochladen nur Mitglieder mit aal2.
-- Nur Bilder, höchstens 1,5 MB. Der Website-Bau lädt die Fotos herunter und liefert sie selbst aus (keine Abfrage bei Supabase durch Besucher).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('teamfotos', 'teamfotos', true, 1500000, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
create policy mitglied_laedt_teamfoto_hoch on storage.objects for insert to authenticated
  with check (bucket_id = 'teamfotos' and public.ist_mitglied());
