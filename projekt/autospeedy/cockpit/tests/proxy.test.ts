// Proxy im echten Betrieb (ohne COCKPIT_DEMO): Cloudflare Access steht vor dem Cockpit. Der Proxy lässt nur Anfragen durch,
// die einen gültigen Ausweis von Access tragen (Kopf «Cf-Access-Jwt-Assertion»). Access ist hier eine Attrappe mit echtem
// Schlüsselpaar: Die Unterschrift wird wirklich geprüft.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { _speicherLeeren } from "../../gemeinsam/access.js";
import { AUD, TEAM, accessFetch, ausweis, paar } from "./access-hilfe";

const echt = paar(), fremd = paar("k1"); // fremd: gleiche Kennung, anderer Schlüssel
const anfrage = (pfad: string, jwt?: string) => new NextRequest("https://cockpit.test" + pfad, { headers: jwt ? { "cf-access-jwt-assertion": jwt } : {} });
let netz: ReturnType<typeof accessFetch>;

describe("Proxy im echten Betrieb: nur mit gültigem Ausweis von Cloudflare Access", () => {
  beforeEach(() => {
    vi.stubEnv("COCKPIT_DEMO", ""); vi.stubEnv("ACCESS_TEAM", TEAM); vi.stubEnv("ACCESS_AUD", AUD);
    _speicherLeeren(); netz = accessFetch([echt]); vi.stubGlobal("fetch", netz.f);
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("gültiger Ausweis: weiter, mit strenger CSP und den Sicherheits-Headern; es werden keine Cookies gesetzt", async () => {
    const { proxy } = await import("../proxy");
    const a = await proxy(anfrage("/", ausweis(echt)));
    expect(a.status).toBe(200);
    expect(a.headers.get("content-security-policy")).toMatch(/script-src 'self' 'nonce-/);
    expect(a.headers.get("content-security-policy")).toMatch(/connect-src 'self';/);
    expect(a.headers.get("cache-control")).toBe("no-store"); expect(a.headers.get("x-frame-options")).toBe("DENY");
    expect(a.headers.getSetCookie()).toHaveLength(0);
  });
  it("ohne Ausweis: 403 mit der Seite «Kein Zugang», auch auf Unterseiten und für die alte Login-Adresse", async () => {
    const { proxy } = await import("../proxy");
    for (const p of ["/", "/irgendwo", "/login", "/api/demo-foto/x.webp"]) {
      const a = await proxy(anfrage(p));
      expect(a.status).toBe(403); expect(a.headers.get("x-middleware-rewrite")).toBe("https://cockpit.test/403");
    }
  });
  it("gefälschter Ausweis (anderer Schlüssel), fremde Anwendung, fremdes Team, abgelaufen, kein RS256: 403", async () => {
    const { proxy } = await import("../proxy");
    const vorbei = Math.floor(Date.now() / 1000) - 3600;
    for (const jwt of [ausweis(fremd), ausweis(echt, { aud: ["b".repeat(64)] }), ausweis(echt, { iss: "https://fremd.cloudflareaccess.com" }), ausweis(echt, { exp: vorbei }), ausweis(echt, {}, { alg: "none" }), "kein.jwt", ausweis(echt).replace(/\.[^.]+$/, ".AAAA")])
      expect((await proxy(anfrage("/", jwt))).status).toBe(403);
  });
  it("Ausweis ohne Mail-Adresse (z. B. Dienst-Token): 403", async () => {
    const { proxy } = await import("../proxy");
    expect((await proxy(anfrage("/", ausweis(echt, { email: undefined })))).status).toBe(403);
  });
  it("nicht eingerichtet (ACCESS_TEAM oder ACCESS_AUD fehlt): niemand kommt herein, auch nicht mit Ausweis", async () => {
    const { proxy } = await import("../proxy");
    vi.stubEnv("ACCESS_AUD", "");
    expect((await proxy(anfrage("/", ausweis(echt)))).status).toBe(403);
    vi.stubEnv("ACCESS_AUD", AUD); vi.stubEnv("ACCESS_TEAM", "");
    expect((await proxy(anfrage("/", ausweis(echt)))).status).toBe(403);
  });
  it("Access nicht erreichbar (Schlüssel lassen sich nicht holen): 403 statt offen", async () => {
    const { proxy } = await import("../proxy");
    vi.stubGlobal("fetch", async () => { throw new Error("kein Netz"); });
    expect((await proxy(anfrage("/", ausweis(echt)))).status).toBe(403);
  });
  it("öffentliche Dateien brauchen keinen Ausweis, und die Schlüssel werden nur einmal geholt", async () => {
    const { proxy } = await import("../proxy");
    expect((await proxy(anfrage("/bilder/logo-96.webp"))).status).toBe(200);
    expect(netz.stand.aufrufe).toBe(0);
    await proxy(anfrage("/", ausweis(echt))); await proxy(anfrage("/", ausweis(echt)));
    expect(netz.stand.aufrufe).toBe(1);
    expect(netz.stand.adressen[0]).toBe(`https://${TEAM}.cloudflareaccess.com/cdn-cgi/access/certs`);
  });
  it("Demo (nur lokal): ohne Anmeldung", async () => {
    vi.stubEnv("COCKPIT_DEMO", "1");
    const { proxy } = await import("../proxy");
    expect((await proxy(anfrage("/"))).status).toBe(200);
    expect(netz.stand.aufrufe).toBe(0);
  });
});
