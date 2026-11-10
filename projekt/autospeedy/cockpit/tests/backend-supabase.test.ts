// Echter Betrieb (supabaseBackend), Supabase als Attrappe. supabase-js wirft bei Fehlern nicht, es gibt { error } zurück:
// Ein Audit-Eintrag, den die Datenbank ablehnt, darf nicht still verloren gehen. Wer audit() aufruft, loggt dann «audit_fehler».
import { beforeEach, describe, expect, it, vi } from "vitest";

const lage = { fehler: null as null | { code: string; message: string }, kopf: {} as Record<string, string> };
const rpc = vi.fn(async (_name: string, _args?: Record<string, unknown>) => ({ data: lage.fehler ? null : 1, error: lage.fehler }));

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => ({ getAll: () => [], set: () => {} }), headers: async () => new Headers(lage.kopf) }));
vi.mock("@supabase/ssr", () => ({ createServerClient: () => ({ rpc }) }));

describe("Audit im echten Betrieb", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "sb_publishable_test");
    rpc.mockClear(); lage.fehler = null; lage.kopf = { "x-forwarded-for": "203.0.113.7, 10.0.0.1", "user-agent": "Prüf-Browser" };
  });

  it("schreibt über audit_schreiben, mit der ersten Adresse aus x-forwarded-for und dem Browser", async () => {
    const { supabaseBackend } = await import("../lib/backend.supabase.server");
    await supabaseBackend.audit({ aktion: "pflege", ergebnis: "ok" });
    expect(rpc).toHaveBeenCalledWith("audit_schreiben", { p_aktion: "pflege", p_ergebnis: "ok", p_ziel: null, p_ip: "203.0.113.7", p_user_agent: "Prüf-Browser" });
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
