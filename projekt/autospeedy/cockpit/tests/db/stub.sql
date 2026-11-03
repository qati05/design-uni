-- Nur für die lokale Rauchprobe: ahmt Supabase-Rollen, auth und storage nach (Muster qati05/medaur tests/db/stub.sql). Nie auf Supabase ausführen.
create schema extensions; create extension if not exists pgcrypto with schema extensions;
create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
create schema auth;
create table auth.users (id uuid primary key, email text);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
create function auth.jwt() returns jsonb language sql stable as $$ select jsonb_build_object('aal', coalesce(nullif(current_setting('test.aal', true), ''), 'aal1')) $$;
grant usage on schema auth, public, extensions to anon, authenticated, service_role;
grant execute on function auth.uid(), auth.jwt() to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
create schema storage;
create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
create function storage.protect_delete() returns trigger language plpgsql as $$ begin if current_setting('storage.allow_delete_query', true) is distinct from 'true' then raise exception 'Direct deletion from storage tables is not allowed' using errcode = '42501'; end if; return old; end $$;
-- Wie Supabase: kein DELETE per SQL; die Storage-API setzt storage.allow_delete_query und prüft dabei die Policies.
create trigger protect_objects_delete before delete on storage.objects for each row execute function storage.protect_delete();
alter table storage.objects enable row level security;
grant usage on schema storage to anon, authenticated, service_role;
grant select, delete on storage.objects to anon, authenticated;
grant all on storage.objects to service_role;
