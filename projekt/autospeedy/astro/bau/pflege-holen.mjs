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
  schreibe(d);
  console.log("pflege-holen: Pflege aus dem Cockpit übernommen.");
}
