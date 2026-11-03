// «Website pflegen»: site.json über die GitHub-API (mit Konfliktschutz) und Teamfotos im Bild-Speicher (R2). Ohne Netz.
import { afterEach, describe, expect, it, vi } from "vitest";
import { siteLesen, siteSchreiben, fotoHochladen, fotoLoeschen, type Repo, type BildSpeicher } from "../lib/website.server";
import start from "../../astro/src/daten/site.json";

const REPO: Repo = { repo: "medaur/auto-speedy", pfad: "astro/src/daten/site.json", zweig: "main", token: "TOKEN" };
const SHA = "a".repeat(40);
const R2: BildSpeicher = { konto: "konto123", schluesselId: "ID", geheimnis: "GEHEIM", bucket: "fotos", basis: "https://fotos.beispiel.ch" };
type Aufruf = { url: string; methode: string; kopf: Headers; body: unknown };
function netz(antwort: (a: Aufruf) => Response) {
  const aufrufe: Aufruf[] = [];
  vi.stubGlobal("fetch", async (u: string | URL | Request, o: RequestInit = {}) => {
    const req = u instanceof Request ? u : new Request(u, o);
    const a = { url: req.url, methode: req.method, kopf: req.headers, body: req.method === "PUT" && req.url.includes("github") ? await req.json() : null };
    aufrufe.push(a); return antwort(a);
  });
  return aufrufe;
}
afterEach(() => vi.unstubAllGlobals());
const inhalt = (d: unknown) => ({ content: Buffer.from(JSON.stringify(d)).toString("base64"), encoding: "base64", sha: SHA });

describe("site.json über GitHub", () => {
  it("liest und prüft die Datei, mit Token nur im Kopf", async () => {
    const a = netz(() => Response.json(inhalt(start)));
    const s = await siteLesen(REPO);
    expect(s?.sha).toBe(SHA); expect(s?.daten.zeiten.length).toBeGreaterThan(0);
    expect(a[0]!.url).toBe("https://api.github.com/repos/medaur/auto-speedy/contents/astro/src/daten/site.json?ref=main");
    expect(a[0]!.kopf.get("authorization")).toBe("Bearer TOKEN");
  });
  it("ungültige Datei im Repo: null statt kaputter Daten", async () => {
    netz(() => Response.json(inhalt({ ...start, hinweis: { aktiv: true, text: "<script>", link: "/" } })));
    expect(await siteLesen(REPO)).toBeNull();
  });
  it("schreibt mit der gelesenen Version (sha), ohne Namen in der Commit-Nachricht", async () => {
    const a = netz(() => Response.json({}, { status: 200 }));
    expect(await siteSchreiben(REPO, start as never, SHA)).toBe("ok");
    const b = a[0]!.body as { sha: string; branch: string; message: string; content: string };
    expect(b.sha).toBe(SHA); expect(b.branch).toBe("main"); expect(b.message).toBe("Website pflegen (Cockpit)");
    expect(JSON.parse(Buffer.from(b.content, "base64").toString())).toEqual(start);
  });
  it("jemand anderes hat inzwischen gespeichert: «konflikt»; GitHub weg: «fehler»", async () => {
    netz(() => new Response("{}", { status: 409 }));
    expect(await siteSchreiben(REPO, start as never, SHA)).toBe("konflikt");
    netz(() => new Response("{}", { status: 500 }));
    expect(await siteSchreiben(REPO, start as never, SHA)).toBe("fehler");
  });
  it("ungültige Daten oder Repo-Angaben gehen gar nicht erst raus", async () => {
    const a = netz(() => Response.json({}));
    expect(await siteSchreiben(REPO, { ...start, zeiten: [] } as never, SHA)).toBe("fehler");
    await expect(siteLesen({ ...REPO, pfad: "../../geheim.json" })).rejects.toThrow();
    expect(a.length).toBe(0);
  });
});

describe("Teamfotos im Bild-Speicher (R2)", () => {
  it("Hochladen: zufälliger Name unter team/, signiert, Adresse passt zum Schema", async () => {
    const a = netz(() => new Response(null, { status: 200 }));
    const url = await fotoHochladen(R2, new Uint8Array([0xff, 0xd8, 0xff]), "image/jpeg");
    expect(url).toMatch(/^https:\/\/fotos\.beispiel\.ch\/team\/[0-9a-f-]{36}\.jpg$/);
    expect(a[0]!.url).toBe(`https://konto123.r2.cloudflarestorage.com/fotos/${url!.slice(R2.basis.length + 1)}`);
    expect(a[0]!.methode).toBe("PUT"); expect(a[0]!.kopf.get("authorization")).toMatch(/^AWS4-HMAC-SHA256 Credential=ID\//);
  });
  it("Löschen entfernt das Objekt wirklich (DELETE); fremde Adressen werden nie gelöscht", async () => {
    const a = netz(() => new Response(null, { status: 204 }));
    const eigen = "https://fotos.beispiel.ch/team/0b5f6c1e-1a2b-4c3d-8e9f-001122334455.webp";
    expect(await fotoLoeschen(R2, eigen)).toBe(true);
    expect(a[0]!.methode).toBe("DELETE"); expect(a[0]!.url).toBe("https://konto123.r2.cloudflarestorage.com/fotos/team/0b5f6c1e-1a2b-4c3d-8e9f-001122334455.webp");
    expect(await fotoLoeschen(R2, "https://anders.example/team/0b5f6c1e-1a2b-4c3d-8e9f-001122334455.webp")).toBe(false);
    expect(await fotoLoeschen(R2, "/bilder/team/anna.webp")).toBe(false);
    expect(a.length).toBe(1);
  });
  it("Speicher antwortet nicht: Hochladen null, Löschen false", async () => {
    netz(() => new Response(null, { status: 500 }));
    expect(await fotoHochladen(R2, new Uint8Array([1]), "image/png")).toBeNull();
    expect(await fotoLoeschen(R2, "https://fotos.beispiel.ch/team/0b5f6c1e-1a2b-4c3d-8e9f-001122334455.webp")).toBe(false);
  });
});
