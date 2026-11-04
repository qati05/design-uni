// GitHub Contents-API (BAUPLAN 4.0): der Editor speichert, indem die Function eine Datei im Repo als Commit schreibt.
// Danach baut Cloudflare Pages die Website neu. Der Token (env.GITHUB_TOKEN, Fine-grained, nur «Contents: read/write»)
// liegt nur in der Function-Umgebung, nie im Browser und nie in einem Log.
// Erlaubt sind ausschliesslich zwei Pfade (Allowlist): die Pflege-Datei site.json und Teamfotos public/bilder/team/<slug>.jpg.
// Nur fetch und btoa/atob – läuft bei Cloudflare und im Node-Test (fetch als Attrappe).

const TEAMFOTO = /^public\/bilder\/team\/[a-z0-9-]{2,80}\.jpg$/;

/** Pfad der Pflege-Datei aus der Konfiguration (env.GITHUB_SITE_PFAD), Vorgabe src/daten/site.json. */
export function sitePfad(env) {
  const p = (env && env.GITHUB_SITE_PFAD) || "src/daten/site.json";
  return p.replace(/^\/+/, "");
}

/** true, wenn der Pfad in der Allowlist steht (site.json aus der Konfiguration oder ein Teamfoto). */
export function erlaubt(env, pfad) {
  if (typeof pfad !== "string" || pfad.includes("..")) return false;
  return pfad === sitePfad(env) || TEAMFOTO.test(pfad);
}

function pruefeEnv(env) {
  if (!env || !env.GITHUB_TOKEN || !env.GITHUB_REPO || !env.GITHUB_ZWEIG) throw new Error("GitHub nicht eingerichtet (GITHUB_TOKEN, GITHUB_REPO, GITHUB_ZWEIG nötig)");
  if (!/^[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}$/.test(env.GITHUB_REPO)) throw new Error("GITHUB_REPO ungültig (owner/name)");
}
const url = (env, pfad) => `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${pfad}`;
const kopf = (env) => ({ Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json", "User-Agent": "autospeedy-editor", "X-GitHub-Api-Version": "2022-11-28" });

/** base64 aus Text (UTF-8) oder Uint8Array, ohne Node-Buffer. */
function base64(inhalt) {
  const bytes = typeof inhalt === "string" ? new TextEncoder().encode(inhalt) : (inhalt instanceof Uint8Array ? inhalt : new Uint8Array(inhalt));
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 0x8000)));
  return btoa(s);
}

/**
 * Liest eine Datei. Rückgabe { inhalt (Text, nur bei JSON/Text sinnvoll), sha } oder null, wenn es sie nicht gibt.
 */
export async function lesen(env, pfad) {
  pruefeEnv(env);
  if (!erlaubt(env, pfad)) throw new Error(`Pfad nicht erlaubt: ${pfad}`);
  const r = await fetch(`${url(env, pfad)}?ref=${encodeURIComponent(env.GITHUB_ZWEIG)}`, { headers: kopf(env), signal: AbortSignal.timeout(15000) });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub lesen fehlgeschlagen (Status ${r.status})`);
  const daten = await r.json();
  const inhalt = typeof daten.content === "string" ? new TextDecoder().decode(Uint8Array.from(atob(daten.content.replace(/\n/g, "")), (c) => c.charCodeAt(0))) : null;
  return { inhalt, sha: daten.sha };
}

/**
 * Schreibt eine Datei als Commit. sha ist der bekannte Stand (für ein Update nötig); fehlt er bei einer vorhandenen
 * Datei, liefert GitHub 409 → wir werfen einen Fehler mit code "konflikt", damit die Function mit 409 antwortet.
 * @param {string|Uint8Array} inhalt
 */
export async function schreiben(env, pfad, inhalt, sha, nachricht) {
  pruefeEnv(env);
  if (!erlaubt(env, pfad)) throw new Error(`Pfad nicht erlaubt: ${pfad}`);
  const koerper = { message: nachricht || "Editor", content: base64(inhalt), branch: env.GITHUB_ZWEIG };
  if (sha) koerper.sha = sha;
  const r = await fetch(url(env, pfad), { method: "PUT", headers: { ...kopf(env), "Content-Type": "application/json" }, body: JSON.stringify(koerper), signal: AbortSignal.timeout(20000) });
  if (r.status === 409 || r.status === 422) { const e = new Error("Inzwischen geändert"); e.code = "konflikt"; throw e; }
  if (!r.ok) throw new Error(`GitHub schreiben fehlgeschlagen (Status ${r.status})`);
  const daten = await r.json().catch(() => ({}));
  return { sha: daten.content && daten.content.sha };
}
