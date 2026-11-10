// Echter Betrieb (supabaseBackend), Supabase als Attrappe. supabase-js wirft bei Fehlern nicht, es gibt { error } zurück:
// Ein Audit-Eintrag, den die Datenbank ablehnt, darf nicht still verloren gehen. Wer audit() aufruft, loggt dann «audit_fehler».
// Dazu: Abmelden nur auf diesem Gerät, und der Fehlercode von Supabase beim Senden des Mail-Codes im Log (ohne Personendaten).
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const lage = { fehler: null as null | { code: string; message: string }, kopf: {} as Record<string, string>, otpFehler: null as null | { code?: string; status?: number; message: string } };
const rpc = vi.fn(async (_name: string, _args?: Record<string, unknown>) => ({ data: lage.fehler ? null : 1, error: lage.fehler }));
const signOut = vi.fn(async (_o?: { scope?: string }) => ({ error: null }));
const signInWithOtp = vi.fn(async (_o: { email: string; options?: { shouldCreateUser?: boolean } }) => ({ data: {}, error: lage.otpFehler }));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => ({ getAll: () => [], set: () => {} }), headers: async () => new Headers(lage.kopf) }));
vi.mock("@supabase/ssr", () => ({ createServerClient: () => ({ rpc, auth: { signOut, signInWithOtp } }) }));

describe("Audit im echten Betrieb", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "sb_publishable_test");
    rpc.mockClear(); signOut.mockClear(); signInWithOtp.mockClear(); lage.fehler = null; lage.otpFehler = null;
    lage.kopf = { "x-forwarded-for": "203.0.113.7, 10.0.0.1", "user-agent": "Prüf-Browser" };
  });

  it("schreibt über audit_schreiben, mit der ersten Adresse aus x-forwarded-for und dem Browser", async () => {
    const { supabaseBackend } = await import("../lib/backend.supabase.server");
    await supabaseBackend.audit({ aktion: "pflege", ergebnis: "ok" });
    expect(rpc).toHaveBeenCalledWith("audit_schreiben", { p_aktion: "pflege", p_ergebnis: "ok", p_ziel: null, p_ip: "203.0.113.7", p_user_agent: "Prüf-Browser" });
  });
  it("auf Cloudflare zählt cf-connecting-ip (setzt die Plattform), nicht x-forwarded-for (kann der Aufrufer vorgeben)", async () => {
    lage.kopf = { "cf-connecting-ip": "198.51.100.9", "x-forwarded-for": "203.0.113.7, 10.0.0.1" };
    const { supabaseBackend } = await import("../lib/backend.supabase.server");
    await supabaseBackend.audit({ aktion: "pflege", ergebnis: "ok" });
    expect(rpc.mock.calls[0]![1]).toMatchObject({ p_ip: "198.51.100.9" });
  });
  it("unbrauchbare Adresse wird nicht übergeben (inet würde den ganzen Eintrag ablehnen)", async () => {
    lage.kopf = { "x-forwarded-for": "<script>" };
    const { supabaseBackend } = await import("../lib/backend.supabase.server");
    await supabaseBackend.audit({ aktion: "login", ergebnis: "ok" });
    expect(rpc.mock.calls[0]![1]).toMatchObject({ p_ip: null, p_user_agent: null });
  });
  it("lehnt die Datenbank den Eintrag ab, schlägt audit() fehl (statt still nichts zu schreiben)", async () => {
    lage.fehler = { code: "42501", message: "permission denied for function audit_schreiben" };
    const { supabaseBackend } = await import("../lib/backend.supabase.server");
    await expect(supabaseBackend.audit({ aktion: "pflege", ergebnis: "ok" })).rejects.toThrow(/audit/i);
  });
});

describe("Abmelden im echten Betrieb", () => {
  beforeEach(() => { vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "sb_publishable_test"); signOut.mockClear(); });

  it("meldet nur dieses Gerät ab (scope local), nicht alle Geräte des Kontos", async () => {
    const { supabaseBackend } = await import("../lib/backend.supabase.server");
    await supabaseBackend.abmelden();
    expect(signOut).toHaveBeenCalledTimes(1);
    expect(signOut).toHaveBeenCalledWith({ scope: "local" });
  });
});

describe("Mail-Code anfordern im echten Betrieb", () => {
  const ADRESSE = "jemand@beispiel.example";
  let info: ReturnType<typeof vi.spyOn>;
  const zeilen = () => info.mock.calls.map((c: unknown[]) => String(c[0]));
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "sb_publishable_test");
    signInWithOtp.mockClear(); lage.otpFehler = null; info = vi.spyOn(console, "info").mockImplementation(() => {});
  });
  afterEach(() => info.mockRestore());

  it("ohne Fehler: «gesendet», kein neues Konto, nichts im Log", async () => {
    const { supabaseBackend } = await import("../lib/backend.supabase.server");
    expect(await supabaseBackend.codeAnfordern(ADRESSE)).toEqual({ status: "gesendet" });
    expect(signInWithOtp).toHaveBeenCalledWith({ email: ADRESSE, options: { shouldCreateUser: false } });
    expect(zeilen()).toHaveLength(0);
  });
  it("Supabase lehnt ab: Der Nutzer sieht dasselbe, im Log steht der Fehlercode, aber nie die Adresse oder der Text von Supabase", async () => {
    lage.otpFehler = { code: "email_address_not_authorized", status: 400, message: `Email address ${ADRESSE} not authorized` };
    const { supabaseBackend } = await import("../lib/backend.supabase.server");
    expect(await supabaseBackend.codeAnfordern(ADRESSE)).toEqual({ status: "gesendet" });
    expect(zeilen()).toHaveLength(1);
    expect(JSON.parse(zeilen()[0]!)).toMatchObject({ aktion: "login_code_supabase", status: "email_address_not_authorized" });
    expect(zeilen()[0]).not.toContain("jemand"); expect(zeilen()[0]).not.toContain("beispiel"); expect(zeilen()[0]).not.toContain("Email address");
    expect(Object.keys(JSON.parse(zeilen()[0]!)).sort()).toEqual(["aktion", "status", "zeit"]);
  });
  it("zu viele Anfragen (429): «zu_viele», mit Fehlercode im Log", async () => {
    lage.otpFehler = { code: "over_email_send_rate_limit", status: 429, message: "zu viele" };
    const { supabaseBackend } = await import("../lib/backend.supabase.server");
    expect(await supabaseBackend.codeAnfordern(ADRESSE)).toEqual({ status: "zu_viele" });
    expect(JSON.parse(zeilen()[0]!)).toMatchObject({ status: "over_email_send_rate_limit" });
  });
  it("Fehler ohne brauchbaren Code (z. B. Netz): nur der HTTP-Status im Log, kein fremder Text", async () => {
    lage.otpFehler = { code: `kaputt ${ADRESSE}`, status: 500, message: "x" };
    const { supabaseBackend } = await import("../lib/backend.supabase.server");
    expect(await supabaseBackend.codeAnfordern(ADRESSE)).toEqual({ status: "gesendet" });
    expect(JSON.parse(zeilen()[0]!)).toMatchObject({ status: "http_500" });
    expect(zeilen()[0]).not.toContain("jemand");
  });
});
