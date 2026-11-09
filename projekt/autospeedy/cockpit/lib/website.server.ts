// «Website pflegen» schreibt direkt in die Website des Kunden: site.json im Repo (GitHub-API), Teamfotos im Bild-Speicher (R2).
// Der Commit löst bei Cloudflare Pages den Neubau aus; ein eigener Deploy Hook ist nicht nötig.
// Ohne Abhängigkeit von Next, damit die Tests es direkt mit einem Schein-fetch prüfen können.
import { AwsClient } from "aws4fetch";
import { siteSchema, SPEICHERBILD, TEAMFOTO, type Site } from "../../gemeinsam/site";

/** Wo die site.json eines Betriebs liegt. Token: fein abgestuft, nur dieses eine Repo, nur «Contents: Read and write». */
export type Repo = { repo: string; pfad: string; zweig: string; token: string };
export type SiteStand = { daten: Site; sha: string };
export type Schreiben = "ok" | "konflikt" | "fehler" | "unklar"; // unklar: keine Antwort (Zeitüberschreitung), GitHub kann trotzdem gespeichert haben

const REPO = /^[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}$/;
const PFAD = /^[A-Za-z0-9._/-]{1,200}\.json$/;

function adresse(r: Repo): string {
  if (!REPO.test(r.repo) || !PFAD.test(r.pfad) || r.pfad.includes("..") || !/^[A-Za-z0-9._/-]{1,100}$/.test(r.zweig)) throw new Error("Repo-Angaben ungültig");
  return `https://api.github.com/repos/${r.repo}/contents/${r.pfad.split("/").map(encodeURIComponent).join("/")}`;
}
const kopf = (r: Repo) => ({ authorization: `Bearer ${r.token}`, accept: "application/vnd.github+json", "x-github-api-version": "2022-11-28", "user-agent": "cockpit" });

/** Liest site.json und prüft sie. null, wenn GitHub nicht antwortet oder die Datei ungültig ist.
 *  «stand»: ein früherer Commit aus siteVerlauf (für «letzte Änderung zurücknehmen»); sonst der Zweig. */
export async function siteLesen(r: Repo, stand?: string): Promise<SiteStand | null> {
  if (stand !== undefined && !/^[0-9a-f]{40}$/.test(stand)) return null;
  const a = await fetch(`${adresse(r)}?ref=${encodeURIComponent(stand ?? r.zweig)}`, { headers: kopf(r), cache: "no-store", signal: AbortSignal.timeout(10000) }).catch(() => null);
  if (!a?.ok) return null;
  const j = (await a.json().catch(() => null)) as { content?: string; sha?: string; encoding?: string } | null;
  if (!j?.content || !j.sha || j.encoding !== "base64") return null;
  try {
    const g = siteSchema.safeParse(JSON.parse(Buffer.from(j.content, "base64").toString("utf8")));
    return g.success ? { daten: g.data, sha: j.sha } : null;
  } catch { return null; }
}

/** Die letzten Commits an site.json, neuester zuerst (höchstens 10). Leer, wenn GitHub nicht antwortet. */
export async function siteVerlauf(r: Repo): Promise<{ id: string; zeit: string }[]> {
  adresse(r); // prüft die Repo-Angaben
  const a = await fetch(`https://api.github.com/repos/${r.repo}/commits?path=${encodeURIComponent(r.pfad)}&sha=${encodeURIComponent(r.zweig)}&per_page=10`, { headers: kopf(r), cache: "no-store", signal: AbortSignal.timeout(10000) }).catch(() => null);
  if (!a?.ok) return [];
  const j = (await a.json().catch(() => null)) as { sha?: unknown; commit?: { committer?: { date?: unknown } } }[] | null;
  if (!Array.isArray(j)) return [];
  return j.flatMap((c) => (typeof c.sha === "string" && /^[0-9a-f]{40}$/.test(c.sha) && typeof c.commit?.committer?.date === "string" && !Number.isNaN(Date.parse(c.commit.committer.date)) ? [{ id: c.sha, zeit: c.commit.committer.date }] : [])).slice(0, 10);
}

/** Schreibt site.json, aber nur auf den Stand, der gelesen wurde (sha). Hat inzwischen jemand anderes gespeichert: «konflikt». */
export async function siteSchreiben(r: Repo, daten: Site, sha: string): Promise<Schreiben> {
  const g = siteSchema.safeParse(daten);
  if (!g.success || !/^[0-9a-f]{40}$/.test(sha)) return "fehler";
  const inhalt = Buffer.from(JSON.stringify(g.data, null, 2) + "\n", "utf8").toString("base64");
  const a = await fetch(adresse(r), {
    method: "PUT", headers: { ...kopf(r), "content-type": "application/json" }, cache: "no-store", signal: AbortSignal.timeout(15000),
    // Keine Namen in der Commit-Nachricht: Git vergisst nicht. Wer gespeichert hat, steht im Audit-Log des Cockpits.
    body: JSON.stringify({ message: "Website pflegen (Cockpit)", content: inhalt, sha, branch: r.zweig }),
  }).catch(() => null);
  if (!a) return "unklar";
  if (a.ok) return "ok";
  return a.status === 409 ? "konflikt" : "fehler"; // 409: sha passt nicht mehr (jemand anderes hat gespeichert)
}

/** Bild-Speicher Cloudflare R2 (S3-Schnittstelle). basis: öffentliche Adresse des Buckets, z. B. https://fotos.beispiel.ch */
export type BildSpeicher = { konto: string; schluesselId: string; geheimnis: string; bucket: string; basis: string };
const ENDUNG = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as const;

function r2(s: BildSpeicher) {
  return { aws: new AwsClient({ accessKeyId: s.schluesselId, secretAccessKey: s.geheimnis, service: "s3", region: "auto", retries: 0 }), ziel: (name: string) => `https://${s.konto}.r2.cloudflarestorage.com/${s.bucket}/${name}` };
}

/** Lädt ein geprüftes Bild hoch; der Name ist zufällig (UUID). Gibt die öffentliche Adresse zurück, die in site.json steht.
 *  Ordner «team»: Porträts. Ordner «bild»: ersetzte Fotos der Website und Partner-Logos. */
export async function fotoHochladen(s: BildSpeicher, bytes: Uint8Array, typ: keyof typeof ENDUNG, ordner: "team" | "bild" = "team"): Promise<string | null> {
  const name = `${ordner}/${crypto.randomUUID()}.${ENDUNG[typ]}`;
  const url = `${s.basis.replace(/\/$/, "")}/${name}`;
  if (!(ordner === "team" ? TEAMFOTO : SPEICHERBILD).test(url)) return null; // Basis falsch eingerichtet: lieber nichts hochladen
  const { aws, ziel } = r2(s);
  const a = await aws.fetch(ziel(name), { method: "PUT", body: bytes as BodyInit, headers: { "content-type": typ, "cache-control": "public, max-age=300" }, signal: AbortSignal.timeout(15000) }).catch(() => null);
  return a?.ok ? url : null;
}

/** Löscht ein Bild wirklich aus dem Speicher. Nur Adressen unter der eigenen Basis und in den Ordnern team/ und bild/. */
export async function fotoLoeschen(s: BildSpeicher, url: string): Promise<boolean> {
  const basis = s.basis.replace(/\/$/, "") + "/";
  const eigen = (TEAMFOTO.test(url) && url.startsWith(basis + "team/")) || (SPEICHERBILD.test(url) && url.startsWith(basis + "bild/"));
  if (!eigen) return false;
  const { aws, ziel } = r2(s);
  const a = await aws.fetch(ziel(url.slice(basis.length)), { method: "DELETE", signal: AbortSignal.timeout(10000) }).catch(() => null);
  return !!a && (a.ok || a.status === 404); // schon weg zählt als gelöscht
}
