import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import type { AuditEintrag, Backend, CodeAntwort, Einrichten, SitzungsStand, TotpAntwort } from "./backend";
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

type Zeile = { id: string; erstellt: string; art: string; tesla: boolean; stellen: string[]; bemerkung: string; name: string; telefon: string; quelle: Meldung["quelle"]; status: Status; notiz: string; meldung_fotos: { id: string; pfad: string }[] };

async function mitFotos(client: Awaited<ReturnType<typeof sb>>, zeilen: Zeile[]): Promise<Meldung[]> {
  const pfade = zeilen.flatMap((z) => z.meldung_fotos.map((f) => f.pfad));
  const urls = new Map<string, string>();
  if (pfade.length) {
    const { data } = await client.storage.from("schadenfotos").createSignedUrls(pfade, 600); // 10 Minuten gültig
    for (const d of data ?? []) if (d.path && d.signedUrl) urls.set(d.path, d.signedUrl);
  }
  return zeilen.map(({ meldung_fotos, ...z }) => ({ ...z, fotos: meldung_fotos.flatMap((f) => (urls.get(f.pfad) ? [{ id: f.id, url: urls.get(f.pfad)! }] : [])) }));
}

const SPALTEN = "id, erstellt, art, tesla, stellen, bemerkung, name, telefon, quelle, status, notiz, meldung_fotos(id, pfad)";

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
  async audit(e: AuditEintrag) {
    const h = await headers();
    const roh = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
    await (await sb()).rpc("audit_schreiben", { p_aktion: e.aktion, p_ergebnis: e.ergebnis, p_ziel: e.ziel ?? null, p_ip: /^[0-9a-fA-F:.]{2,45}$/.test(roh) ? roh : null, p_user_agent: h.get("user-agent")?.slice(0, 400) ?? null });
  },
};
