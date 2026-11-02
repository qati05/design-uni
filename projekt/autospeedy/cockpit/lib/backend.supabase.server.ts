import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";
import type { AuftragAnsicht, BewertungFaellig, AuditEintrag, Backend, Zaehlzeile, CodeAntwort, Einrichten, SitzungsStand, TotpAntwort, PasskeyStart, PasskeyAntwort, Rp } from "./backend";
import { pflegeSchema } from "./pflege";
import pflegeStart from "./pflege-start.json";
import { COOKIE_GRUNDLAGE, haerte } from "./cookies";
import type { Meldung, Status } from "./status";

// Muster aus qati05/medaur cockpit-app/lib/supabase.server.ts: Sitzung nur in httpOnly-Cookies, kein Browser-Client.
function oeffentlich() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase ist nicht konfiguriert (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY).");
  return { url, anonKey };
}
async function sb() {
  const { url, anonKey } = oeffentlich();
  const store = await cookies();
  return createServerClient(url, anonKey, {
    cookieOptions: COOKIE_GRUNDLAGE,
    cookies: {
      getAll: () => store.getAll(),
      setAll: (liste) => { try { for (const { name, value, options } of liste) store.set(name, value, haerte(options)); } catch { /* Server Component */ } },
    },
  });
}

type Zeile = { id: string; erstellt: string; art: string; tesla: boolean; stellen: string[]; bemerkung: string; name: string; telefon: string; quelle: Meldung["quelle"]; status: Status; notiz: string; email: string | null; bewertung_faellig: string | null; bewertung_gesendet: string | null; meldung_fotos: { id: string; pfad: string }[] };

async function mitFotos(client: Awaited<ReturnType<typeof sb>>, zeilen: Zeile[]): Promise<Meldung[]> {
  const pfade = zeilen.flatMap((z) => z.meldung_fotos.map((f) => f.pfad));
  const urls = new Map<string, string>();
  if (pfade.length) {
    const { data } = await client.storage.from("schadenfotos").createSignedUrls(pfade, 600); // 10 Minuten gültig
    for (const d of data ?? []) if (d.path && d.signedUrl) urls.set(d.path, d.signedUrl);
  }
  return zeilen.map(({ meldung_fotos, bewertung_faellig, bewertung_gesendet, ...z }) => ({ ...z, bewertungFaellig: bewertung_faellig, bewertungGesendet: bewertung_gesendet, fotos: meldung_fotos.flatMap((f) => (urls.get(f.pfad) ? [{ id: f.id, url: urls.get(f.pfad)! }] : [])) }));
}

// Fingerabdruck/Gesicht als zweiter Faktor (Supabase MFA «webauthn»). supabase-js macht die Zeremonie im Browser
// und braucht dort die Sitzung; das Cockpit hält die Sitzung aber nur in httpOnly-Cookies. Darum ruft der Server
// die beiden Auth-Endpunkte selbst auf (challenge, verify) und reicht nur die WebAuthn-Optionen (JSON) an den Browser.
// Ungeprüft gegen ein echtes Projekt (Beta seit Mai 2026): vor dem Livegang mit dem Supabase-Projekt testen.
async function authRest(pfad: string, body: unknown): Promise<{ ok: boolean; daten: Record<string, unknown> }> {
  const { url, anonKey } = oeffentlich();
  const { data } = await (await sb()).auth.getSession();
  const token = data.session?.access_token;
  if (!token) return { ok: false, daten: {} };
  const r = await fetch(`${url}/auth/v1${pfad}`, { method: "POST", headers: { apikey: anonKey, authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
  return { ok: r.ok, daten: (await r.json().catch(() => ({}))) as Record<string, unknown> };
}
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
async function webauthnChallenge(faktorId: string, rp: Rp): Promise<PasskeyStart> {
  const r = await authRest(`/factors/${faktorId}/challenge`, { webauthn: { rpId: rp.rpId, rpOrigins: [rp.origin] } });
  const w = r.daten.webauthn as { type?: string; credential_options?: { publicKey?: Record<string, unknown> } } | undefined;
  const id = r.daten.id;
  if (!r.ok || typeof id !== "string" || !w?.credential_options?.publicKey || (w.type !== "create" && w.type !== "request")) return { status: "fehler" };
  return { status: "bereit", vorgang: `${faktorId}.${id}.${w.type}`, art: w.type, optionen: w.credential_options.publicKey };
}

const SPALTEN = "id, erstellt, art, tesla, stellen, bemerkung, name, telefon, quelle, status, notiz, email, bewertung_faellig, bewertung_gesendet, meldung_fotos(id, pfad)";

/** Ohne Sitzung (Mail-Link, Zeitplan): nur der öffentliche Schlüssel; die Datenbankfunktionen prüfen Token bzw. Geheimnis. */
function ohneSitzung() {
  const { url, anonKey } = oeffentlich();
  return createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export const supabaseBackend: Backend = {
  art: "supabase",
  async codeAnfordern(email): Promise<CodeAntwort> {
    const { error } = await (await sb()).auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    return { status: error ? (error.status === 429 ? "zu_viele" : "gesendet") : "gesendet" }; // gleiche Antwort für unbekannte Adressen
  },
  async codePruefen(email, code) {
    const { error } = await (await sb()).auth.verifyOtp({ email, token: code, type: "email" });
    return !error;
  },
  async sitzung(): Promise<SitzungsStand> {
    const c = await sb();
    const { data: u } = await c.auth.getUser();
    if (!u.user) return null;
    const { data: a } = await c.auth.mfa.getAuthenticatorAssuranceLevel();
    const { data: m } = await c.rpc("ist_mitglied");
    return { userId: u.user.id, email: u.user.email ?? "", aal: a?.currentLevel === "aal2" ? "aal2" : "aal1", naechste: a?.nextLevel === "aal2" ? "aal2" : "aal1", mitglied: m === true };
  },
  async totpPruefen(code): Promise<TotpAntwort> {
    const c = await sb();
    const { data } = await c.auth.mfa.listFactors();
    const f = data?.totp?.[0];
    if (!f) return { status: "kein_faktor" };
    const { error } = await c.auth.mfa.challengeAndVerify({ factorId: f.id, code });
    return { status: error ? "falsch" : "ok" };
  },
  async totpEinrichten(): Promise<Einrichten> {
    const c = await sb();
    const { data: liste } = await c.auth.mfa.listFactors();
    if ((liste?.totp ?? []).some((f) => f.status === "verified")) return { status: "vorhanden" };
    for (const f of liste?.all ?? []) if (f.factor_type === "totp" && f.status === "unverified") await c.auth.mfa.unenroll({ factorId: f.id });
    const { data, error } = await c.auth.mfa.enroll({ factorType: "totp", friendlyName: "Auto Speedy Cockpit" });
    if (error || !data || data.type !== "totp") return { status: "fehler" };
    return { status: "bereit", faktorId: data.id, geheimnis: data.totp.secret, qr: data.totp.qr_code };
  },
  async totpEinrichtenBestaetigen(faktorId, code): Promise<TotpAntwort> {
    const { error } = await (await sb()).auth.mfa.challengeAndVerify({ factorId: faktorId, code });
    return { status: error ? "falsch" : "ok" };
  },
  async zweitfaktoren() {
    const { data } = await (await sb()).auth.mfa.listFactors();
    return { geraete: (data?.webauthn ?? []).map((f) => ({ id: f.id, name: f.friendly_name ?? "Gerät" })), totp: (data?.totp ?? []).length > 0 };
  },
  async passkeyStart(zweck, rp, geraetename = "Gerät"): Promise<PasskeyStart> {
    const c = await sb();
    const { data } = await c.auth.mfa.listFactors();
    if (zweck === "anmelden") {
      const f = data?.webauthn?.[0];
      return f ? webauthnChallenge(f.id, rp) : { status: "kein_faktor" };
    }
    for (const f of data?.all ?? []) if (f.factor_type === "webauthn" && f.status === "unverified") await c.auth.mfa.unenroll({ factorId: f.id });
    const { data: neu, error } = await c.auth.mfa.enroll({ factorType: "webauthn", friendlyName: `${geraetename.slice(0, 30)} ${new Date().toISOString().slice(0, 10)}` });
    if (error) return { status: error.code === "insufficient_aal" ? "nicht_erlaubt" : "fehler" };
    return webauthnChallenge(neu.id, rp);
  },
  async passkeyBestaetigen(vorgang, antwort, rp): Promise<PasskeyAntwort> {
    const [faktorId, challengeId, art] = vorgang.split(".");
    if (!faktorId || !challengeId || !uuid.test(faktorId) || !uuid.test(challengeId) || (art !== "create" && art !== "request")) return { status: "fehler" };
    const r = await authRest(`/factors/${faktorId}/verify`, { challenge_id: challengeId, webauthn: { type: art, rpId: rp.rpId, rpOrigins: [rp.origin], credential_response: antwort } });
    const access = r.daten.access_token, refresh = r.daten.refresh_token;
    if (!r.ok || typeof access !== "string" || typeof refresh !== "string") return { status: "falsch" };
    const { error } = await (await sb()).auth.setSession({ access_token: access, refresh_token: refresh }); // neue Sitzung mit aal2 in die httpOnly-Cookies
    return { status: error ? "fehler" : "ok" };
  },
  async geraetEntfernen(id) {
    const c = await sb();
    const { data } = await c.auth.mfa.listFactors();
    if ((data?.webauthn ?? []).length <= 1 || !uuid.test(id)) return false; // das letzte Gerät bleibt
    const { error } = await c.auth.mfa.unenroll({ factorId: id });
    return !error;
  },
  async auftragLink(id) {
    const { data, error } = await (await sb()).rpc("auftrag_link_erzeugen", { p_id: id });
    return error || typeof data !== "string" ? null : data;
  },
  async auftragAnsehen(token): Promise<AuftragAnsicht | null> {
    const { data } = await ohneSitzung().rpc("auftrag_link_ansehen", { p_token: token });
    const z = (data as { art: string; tesla: boolean; erstellt: string; mit_mail: boolean }[] | null)?.[0];
    return z ? { art: z.art, tesla: z.tesla, erstellt: z.erstellt, mitMail: z.mit_mail } : null;
  },
  async auftragErledigt(token) {
    const { data, error } = await ohneSitzung().rpc("auftrag_erledigt_mit_token", { p_token: token });
    return !error && data === true;
  },
  async bewertungenAbholen(geheimnis): Promise<BewertungFaellig[] | null> {
    const { data, error } = await ohneSitzung().rpc("bewertungen_abholen", { p_geheimnis: geheimnis, p_max: 20 });
    return error ? null : (data as BewertungFaellig[]);
  },
  async bewertungZuruecklegen(geheimnis, id) {
    await ohneSitzung().rpc("bewertung_zuruecklegen", { p_geheimnis: geheimnis, p_id: id });
  },
  async pflegeLesen() {
    const { data } = await (await sb()).from("pflege").select("daten, geaendert, geaendert_von").eq("id", 1).maybeSingle();
    const g = pflegeSchema.safeParse(data?.daten);
    const { _quelle, ...start } = pflegeStart as Record<string, unknown>; void _quelle;
    return { daten: g.success ? g.data : pflegeSchema.parse(start), geaendert: data?.geaendert ?? null, von: data?.geaendert_von ?? null };
  },
  async pflegeSpeichern(p) {
    const { error } = await (await sb()).rpc("pflege_speichern", { p_daten: p });
    return !error;
  },
  async teamFotoSpeichern(bytes, typ) {
    const c = await sb();
    const pfad = `${crypto.randomUUID()}.${typ === "image/jpeg" ? "jpg" : typ.slice(6)}`;
    const { error } = await c.storage.from("teamfotos").upload(pfad, bytes, { contentType: typ, upsert: false });
    if (error) return null;
    return c.storage.from("teamfotos").getPublicUrl(pfad).data.publicUrl;
  },
  async abmelden() { await (await sb()).auth.signOut(); },
  async meldungen() {
    const c = await sb();
    const { data, error } = await c.from("meldungen").select(SPALTEN).order("erstellt", { ascending: false }).limit(200);
    if (error) throw new Error("Meldungen nicht gelesen");
    return mitFotos(c, (data ?? []) as unknown as Zeile[]);
  },
  async meldung(id) {
    const c = await sb();
    const { data } = await c.from("meldungen").select(SPALTEN).eq("id", id).maybeSingle();
    return data ? (await mitFotos(c, [data as unknown as Zeile]))[0]! : null;
  },
  async statusSetzen(id, status) {
    const { error } = await (await sb()).rpc("meldung_status_setzen", { p_id: id, p_status: status });
    return !error;
  },
  async notizSetzen(id, notiz) {
    const { error } = await (await sb()).rpc("meldung_notiz_setzen", { p_id: id, p_notiz: notiz });
    return !error;
  },
  async zahlen(tage): Promise<Zaehlzeile[]> {
    const ab = new Date(Date.now() - tage * 864e5).toISOString().slice(0, 10);
    const { data, error } = await (await sb()).from("zaehlung").select("tag, punkt, ort, anzahl").gte("tag", ab);
    if (error) throw new Error("Zählung nicht gelesen");
    return (data ?? []) as Zaehlzeile[];
  },
  async audit(e: AuditEintrag) {
    const h = await headers();
    const roh = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
    await (await sb()).rpc("audit_schreiben", { p_aktion: e.aktion, p_ergebnis: e.ergebnis, p_ziel: e.ziel ?? null, p_ip: /^[0-9a-fA-F:.]{2,45}$/.test(roh) ? roh : null, p_user_agent: h.get("user-agent")?.slice(0, 400) ?? null });
  },
};
