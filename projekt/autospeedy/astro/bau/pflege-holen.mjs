// Holt vor dem Bau die Pflege aus dem Cockpit (Supabase, Funktion pflege_oeffentlich) und schreibt
// src/content/pflege.json und team.json. Ohne PFLEGE_URL bleibt alles, wie es im Repo liegt (Vorschau, Tests).
// Bricht den Bau ab, wenn die Antwort nicht die erwartete Form hat: lieber alte Zeiten als kaputte Seite.
import fs from "node:fs";
import path from "node:path";

const url = process.env.PFLEGE_URL, key = process.env.PFLEGE_ANON_KEY;
const ORDNER = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "src", "content");

export function pruefe(d) {
  const ok = d && typeof d === "object" && d.hinweis && typeof d.hinweis.aktiv === "boolean"
    && Array.isArray(d.zeiten) && d.zeiten.length > 0 && d.zeiten.every((z) => typeof z.tage === "string" && Array.isArray(z.fenster))
    && Array.isArray(d.ausnahmen) && Array.isArray(d.team) && d.team.every((g) => typeof g.name === "string" && Array.isArray(g.leute));
  return Boolean(ok);
}

const BILDER = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "public", "bilder", "team");
const FOTO_URL = /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/teamfotos\/([A-Za-z0-9._-]{8,120})$/;

/** Teamfotos aus dem Cockpit herunterladen und selbst ausliefern: Besucher der Website fragen nie bei Supabase an. */
export async function fotosHolen(d, ordner = BILDER, holen = fetch) {
  fs.mkdirSync(ordner, { recursive: true });
  for (const g of d.team) for (const p of g.leute) {
    if (!p.foto) continue;
    if (/^\/bilder\/team\/[a-z0-9-]+\.webp$/.test(p.foto)) continue;
    const m = FOTO_URL.exec(p.foto);
    if (!m) { delete p.foto; continue; }
    const r = await holen(p.foto, { signal: AbortSignal.timeout(10000) });
    const typ = r.headers.get("content-type") || "";
    const endung = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" }[typ];
    if (!r.ok || !endung) { delete p.foto; continue; }
    const datei = `cockpit-${m[1].replace(/\.[a-z]+$/, "").toLowerCase().replace(/[^a-z0-9-]/g, "")}.${endung}`;
    fs.writeFileSync(path.join(ordner, datei), Buffer.from(await r.arrayBuffer()));
    p.foto = `/bilder/team/${datei}`;
  }
  return d;
}

export function schreibe(d, ordner = ORDNER) {
  const hin = "Kommt aus dem Cockpit (Website pflegen). Hier nicht von Hand ändern.";
  fs.writeFileSync(path.join(ordner, "pflege.json"), JSON.stringify({ _hinweis: hin, hinweis: d.hinweis, zeiten: d.zeiten, ausnahmen: d.ausnahmen }, null, 2) + "\n");
  fs.writeFileSync(path.join(ordner, "team.json"), JSON.stringify({ _hinweis: hin + " Namen nur mit Einverständnis (rechte.md).", gruppen: d.team }, null, 2) + "\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!url || !key) { console.log("pflege-holen: PFLEGE_URL fehlt, Pflege aus dem Repo bleibt."); process.exit(0); }
  const u = new URL("/rest/v1/rpc/pflege_oeffentlich", url);
  if (u.protocol !== "https:") { console.error("pflege-holen: nur https"); process.exit(1); }
  const r = await fetch(u, { method: "POST", headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json" }, body: "{}", signal: AbortSignal.timeout(10000) });
  const d = r.ok ? await r.json() : null;
  if (d === null) { console.log("pflege-holen: im Cockpit noch nichts gespeichert, Pflege aus dem Repo bleibt."); process.exit(0); }
  if (!pruefe(d)) { console.error("pflege-holen: Antwort hat nicht die erwartete Form, Bau abgebrochen."); process.exit(1); }
  await fotosHolen(d);
  schreibe(d);
  console.log("pflege-holen: Pflege aus dem Cockpit übernommen.");
}
