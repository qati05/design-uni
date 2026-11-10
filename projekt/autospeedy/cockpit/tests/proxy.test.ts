// Proxy im echten Betrieb (ohne COCKPIT_DEMO): Erneuert Supabase im Proxy die Sitzung, müssen die neuen Cookies mit JEDER
// Antwort zum Browser, auch mit der 403-Seite. Sonst behält der Browser das schon benutzte Refresh-Token, Supabase beendet
// die Sitzung beim nächsten Versuch (nach 10 Sekunden Kulanz), und das Konto landet statt auf «Kein Zugang» wieder im Login.
// Supabase ist hier eine Attrappe: getUser() spielt eine Erneuerung, indem es setAll mit neuen Cookies aufruft.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

type Cookie = { name: string; value: string; options?: Record<string, unknown> };
type Optionen = { cookies: { getAll: () => Cookie[]; setAll: (liste: Cookie[]) => void } };
const lage = { mitglied: true, konto: "konto-1" as string | null, erneuert: true };

vi.mock("@supabase/ssr", () => ({
  createServerClient: (_url: string, _key: string, o: Optionen) => ({
    auth: {
      getUser: async () => {
        if (lage.erneuert) o.cookies.setAll([{ name: "sb-test-auth-token", value: "NEU", options: { maxAge: 34_560_000, domain: "fremd.example" } }]);
        return { data: { user: lage.konto ? { id: lage.konto } : null } };
      },
    },
    rpc: async () => ({ data: lage.mitglied }),
  }),
}));

const anfrage = (pfad = "/") => new NextRequest("https://cockpit.test" + pfad, { headers: { cookie: "sb-test-auth-token=ALT" } });
const gesetzt = (a: Response) => a.headers.getSetCookie().filter((c) => c.startsWith("sb-test-auth-token="));

describe("Proxy im echten Betrieb: erneuerte Sitzung kommt mit jeder Antwort zum Browser", () => {
  beforeEach(() => {
    vi.stubEnv("COCKPIT_DEMO", ""); vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "sb_publishable_test");
    Object.assign(lage, { mitglied: true, konto: "konto-1", erneuert: true });
  });
  afterEach(() => vi.unstubAllEnvs());

  it("Mitglied: weiter, mit den neuen Cookies (gehärtet: httpOnly, höchstens 30 Tage, keine fremde Domain)", async () => {
    const { proxy } = await import("../proxy");
    const a = await proxy(anfrage());
    expect(a.status).toBe(200);
    expect(gesetzt(a)).toHaveLength(1);
    expect(gesetzt(a)[0]).toMatch(/^sb-test-auth-token=NEU;/);
    expect(gesetzt(a)[0]).toMatch(/HttpOnly/i); expect(gesetzt(a)[0]).toMatch(/Max-Age=2592000/i); expect(gesetzt(a)[0]).not.toMatch(/Domain=/i);
    expect(a.headers.get("content-security-policy")).toMatch(/script-src 'self' 'nonce-/);
  });
  it("kein Mitglied (oder Cockpit des Betriebs aus): 403, und die neuen Cookies kommen trotzdem mit", async () => {
    lage.mitglied = false;
    const { proxy } = await import("../proxy");
    const a = await proxy(anfrage("/irgendwo"));
    expect(a.status).toBe(403);
    expect(a.headers.get("x-middleware-rewrite")).toBe("https://cockpit.test/403");
    expect(gesetzt(a)).toHaveLength(1);
    expect(gesetzt(a)[0]).toMatch(/^sb-test-auth-token=NEU;/);
    expect(gesetzt(a)[0]).toMatch(/HttpOnly/i);
  });
  it("Sitzung ungültig: zum Login, Cookies (hier: das Aufräumen von Supabase) kommen mit", async () => {
    lage.konto = null;
    const { proxy } = await import("../proxy");
    const a = await proxy(anfrage());
    expect(a.status).toBe(303); expect(a.headers.get("location")).toBe("https://cockpit.test/login");
    expect(gesetzt(a)).toHaveLength(1);
  });
  it("ohne Erneuerung setzt der Proxy keine Cookies", async () => {
    lage.erneuert = false; lage.mitglied = false;
    const { proxy } = await import("../proxy");
    const a = await proxy(anfrage());
    expect(a.status).toBe(403); expect(gesetzt(a)).toHaveLength(0);
  });
});
