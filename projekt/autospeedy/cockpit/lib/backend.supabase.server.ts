import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import type { AuditEintrag, Backend, CodeAntwort, SitzungsStand } from "./backend";
import { siteLesen, siteSchreiben, siteVerlauf, fotoHochladen, fotoLoeschen, type Repo, type BildSpeicher } from "./website.server";
import { besucherLesen } from "./besucher.server";
import { COOKIE_GRUNDLAGE, haerte } from "./cookies";

// Muster aus qati05/medaur cockpit-app/lib/supabase.server.ts: Sitzung nur in httpOnly-Cookies, kein Browser-Client.
// Supabase hält nur Konten, Betriebe, Mitgliedschaften und das Audit-Log. Keine Kundendaten.
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

/** Wo die Website des eigenen Betriebs liegt (Tabelle «betrieb»). Das Token kommt aus der Umgebung:
 *  GITHUB_TOKEN_<BETRIEB>, z. B. GITHUB_TOKEN_AUTO_SPEEDY. Es steht nie in der Datenbank. */
async function ziel(): Promise<{ betrieb: string; repo: Repo } | null> {
  const { data } = await (await sb()).rpc("mein_betrieb_website");
  const b = (data as { id: string; github_repo: string | null; github_pfad: string | null; github_zweig: string | null }[] | null)?.[0];
  if (!b?.github_repo || !b.github_pfad) return null;
  const token = process.env[`GITHUB_TOKEN_${b.id.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`];
  return token ? { betrieb: b.id, repo: { repo: b.github_repo, pfad: b.github_pfad, zweig: b.github_zweig || "main", token } } : null;
}
/** Ein Bild-Speicher (R2-Bucket) für alle Betriebe; Fotos heissen zufällig (UUID). */
function bildSpeicher(): BildSpeicher | null {
  const e = process.env;
  return e.R2_KONTO && e.R2_SCHLUESSEL_ID && e.R2_GEHEIMNIS && e.R2_BUCKET && e.TEAMFOTO_BASIS
    ? { konto: e.R2_KONTO, schluesselId: e.R2_SCHLUESSEL_ID, geheimnis: e.R2_GEHEIMNIS, bucket: e.R2_BUCKET, basis: e.TEAMFOTO_BASIS } : null;
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
    const { data: m } = await c.rpc("ist_mitglied");
    return { userId: u.user.id, email: u.user.email ?? "", mitglied: m === true };
  },
  async pflegeLesen() {
    const z = await ziel();
    const stand = z ? await siteLesen(z.repo) : null;
    if (!stand) return null;
    const { data } = await (await sb()).rpc("pflege_zuletzt");
    const l = (data as { zeit: string; email: string | null }[] | null)?.[0];
    return { ...stand, geaendert: l?.zeit ?? null, von: l?.email ?? null };
  },
  async pflegeSpeichern(p, sha) {
    const z = await ziel();
    return z ? siteSchreiben(z.repo, p, sha) : "nicht_eingerichtet";
  },
  async verlauf() {
    const z = await ziel();
    return z ? siteVerlauf(z.repo) : [];
  },
  async pflegeVersion(id) {
    const z = await ziel();
    return z ? (await siteLesen(z.repo, id))?.daten ?? null : null;
  },
  async bildSpeichern(bytes, typ, ordner) {
    const s = bildSpeicher();
    return s ? fotoHochladen(s, bytes, typ, ordner) : null;
  },
  async bildLoeschen(url) {
    const s = bildSpeicher();
    return s ? fotoLoeschen(s, url) : false;
  },
  // Zählung der Website (Cloudflare Web Analytics). Ohne diese drei Angaben zeigt das Cockpit «noch nicht verbunden».
  async besucher() {
    const e = process.env;
    return e.CF_KONTO && e.CF_SEITE && e.CF_ANALYSE_TOKEN ? besucherLesen({ konto: e.CF_KONTO, seite: e.CF_SEITE, token: e.CF_ANALYSE_TOKEN }) : null;
  },
  async abmelden() { await (await sb()).auth.signOut(); },
  async audit(e: AuditEintrag) {
    const h = await headers();
    const roh = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
    const { error } = await (await sb()).rpc("audit_schreiben", { p_aktion: e.aktion, p_ergebnis: e.ergebnis, p_ziel: e.ziel ?? null, p_ip: /^[0-9a-fA-F:.]{2,45}$/.test(roh) ? roh : null, p_user_agent: h.get("user-agent")?.slice(0, 400) ?? null });
    // supabase-js wirft bei Fehlern nicht. Ohne diese Zeile ginge ein abgelehnter Audit-Eintrag still verloren; so loggen die Aufrufer «audit_fehler».
    if (error) throw new Error("audit_schreiben fehlgeschlagen");
  },
};
