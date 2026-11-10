// Backend im echten Betrieb: ohne Datenbank. Wer angemeldet ist, sagt der Ausweis von Cloudflare Access;
// wo die Website liegt, sagen die Einstellungen (GITHUB_REPO, GITHUB_PFAD, GITHUB_ZWEIG, GITHUB_TOKEN).
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { _speicherLeeren } from "../../gemeinsam/access.js";
import { AUD, BASIS, TEAM, ausweis, paar } from "./access-hilfe";
import siteStart from "../../astro/src/daten/site.json";

vi.mock("server-only", () => ({}));
const kopf = new Headers();
vi.mock("next/headers", () => ({ headers: async () => kopf }));

const echt = paar();
const SHA = "c".repeat(40), COMMIT = "d".repeat(40);
const anfragen: { adresse: string; methode: string; token: string | null }[] = [];
const github = async (adresse: string | URL, init?: RequestInit) => {
  const u = String(adresse);
  anfragen.push({ adresse: u, methode: init?.method ?? "GET", token: new Headers(init?.headers).get("authorization") });
  if (u === `${BASIS}/cdn-cgi/access/certs`) return Response.json({ keys: [echt.jwk] });
  if (u.startsWith("https://api.github.com/repos/betrieb/website/commits")) return Response.json([{ sha: COMMIT, commit: { committer: { date: "2026-11-09T08:00:00Z" } } }]);
  if (u.startsWith("https://api.github.com/repos/betrieb/website/contents/daten/site.json")) return init?.method === "PUT" ? Response.json({}) : Response.json({ sha: SHA, encoding: "base64", content: Buffer.from(JSON.stringify(siteStart)).toString("base64") });
  return new Response("nein", { status: 404 });
};

describe("Backend im Betrieb (Cloudflare Access und GitHub, keine Datenbank)", () => {
  beforeEach(() => {
    vi.stubEnv("ACCESS_TEAM", TEAM); vi.stubEnv("ACCESS_AUD", AUD);
    vi.stubEnv("GITHUB_REPO", "betrieb/website"); vi.stubEnv("GITHUB_PFAD", "daten/site.json"); vi.stubEnv("GITHUB_TOKEN", "geheim-test"); vi.stubEnv("GITHUB_ZWEIG", "");
    _speicherLeeren(); anfragen.length = 0; kopf.delete("cf-access-jwt-assertion"); vi.stubGlobal("fetch", github);
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it("Sitzung: die Mail-Adresse aus dem Ausweis von Access; ohne oder mit falschem Ausweis niemand", async () => {
    const { cloudflareBackend: b } = await import("../lib/backend.cloudflare.server");
    expect(await b.sitzung()).toBeNull();
    kopf.set("cf-access-jwt-assertion", ausweis(echt, { email: "chef@beispiel.example" }));
    expect(await b.sitzung()).toEqual({ email: "chef@beispiel.example" });
    kopf.set("cf-access-jwt-assertion", ausweis(echt, { aud: ["falsch"] }));
    expect(await b.sitzung()).toBeNull();
  });
  it("Pflege lesen: site.json aus dem eingestellten Repository, Zweig «main» ohne Angabe; «zuletzt veröffentlicht» ist der jüngste Stand", async () => {
    const { cloudflareBackend: b } = await import("../lib/backend.cloudflare.server");
    const s = await b.pflegeLesen();
    expect(s?.sha).toBe(SHA); expect(s?.geaendert).toBe("2026-11-09T08:00:00Z");
    expect(anfragen.some((a) => a.adresse === "https://api.github.com/repos/betrieb/website/contents/daten/site.json?ref=main" && a.token === "Bearer geheim-test")).toBe(true);
    expect(await b.verlauf()).toEqual([{ id: COMMIT, zeit: "2026-11-09T08:00:00Z" }]);
  });
  it("anderer Zweig aus GITHUB_ZWEIG", async () => {
    vi.stubEnv("GITHUB_ZWEIG", "live");
    const { cloudflareBackend: b } = await import("../lib/backend.cloudflare.server");
    await b.pflegeLesen();
    expect(anfragen.some((a) => a.adresse.endsWith("site.json?ref=live"))).toBe(true);
  });
  it("speichern schreibt in dasselbe Repository", async () => {
    const { cloudflareBackend: b } = await import("../lib/backend.cloudflare.server");
    const s = await b.pflegeLesen();
    expect(await b.pflegeSpeichern(s!.daten, s!.sha)).toBe("ok");
    expect(anfragen.filter((a) => a.methode === "PUT")).toHaveLength(1);
  });
  it("nicht eingerichtet (Repository, Pfad oder Token fehlt): nichts lesen, nichts schreiben, keine Anfrage an GitHub", async () => {
    const { cloudflareBackend: b } = await import("../lib/backend.cloudflare.server");
    for (const fehlt of ["GITHUB_REPO", "GITHUB_PFAD", "GITHUB_TOKEN"]) {
      vi.stubEnv(fehlt, ""); anfragen.length = 0;
      expect(await b.pflegeLesen()).toBeNull(); expect(await b.verlauf()).toEqual([]); expect(await b.pflegeVersion(COMMIT)).toBeNull();
      expect(await b.pflegeSpeichern(siteStart as never, SHA)).toBe("nicht_eingerichtet");
      expect(anfragen).toHaveLength(0);
      vi.stubEnv(fehlt, fehlt === "GITHUB_REPO" ? "betrieb/website" : fehlt === "GITHUB_PFAD" ? "daten/site.json" : "geheim-test");
    }
  });
  it("ohne Bild-Speicher und ohne Zählung: Fotos gehen nicht, Besucherzahlen «nicht verbunden»", async () => {
    const { cloudflareBackend: b } = await import("../lib/backend.cloudflare.server");
    expect(await b.bildSpeichern(new Uint8Array([1]), "image/webp", "team")).toBeNull();
    expect(await b.bildLoeschen("https://fotos.beispiel.ch/team/x.webp")).toBe(false);
    expect(await b.besucher()).toBeNull();
  });
});
