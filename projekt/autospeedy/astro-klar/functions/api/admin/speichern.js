// POST /api/admin/speichern (BAUPLAN 4.1): schreibt site.json als Commit ins Repo. Danach baut Cloudflare Pages neu.
// Reihenfolge: Origin, Access (401), zod-Prüfung (422), Schreiben mit bekanntem SHA (409 bei Konflikt).
// Body: { site, sha, bereich }. Commit-Nachricht «Editor: <Bereich> geändert durch <mail>». Kein Schlüssel/Mail im Log.
import { access } from "../../../../gemeinsam/access.js";
import { schreiben, sitePfad } from "../../../../gemeinsam/github.js";
import { siteSchema } from "../../../../gemeinsam/site.ts";

function antwort(status, daten) {
  return new Response(JSON.stringify(daten), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}
// Bereichsname für die Commit-Nachricht säubern (keine Steuerzeichen, höchstens 40 Zeichen).
const BEREICHE = ["Zeiten", "Ferien", "Team", "Inhaber", "Hinweise", "Bewertungen"];
function bereichName(roh) {
  if (typeof roh === "string" && BEREICHE.includes(roh)) return roh;
  return "Website";
}

export async function onRequestPost({ request, env }) {
  if (env.ERLAUBTE_HERKUNFT && request.headers.get("Origin") !== env.ERLAUBTE_HERKUNFT) return antwort(403, { ok: false, fehler: "herkunft" });
  const mail = await access(request, env);
  if (!mail) return antwort(401, { ok: false, fehler: "zugriff" });

  let body;
  try { body = await request.json(); } catch { return antwort(400, { ok: false, fehler: "format" }); }
  const geprueft = siteSchema.safeParse(body && body.site);
  if (!geprueft.success) return antwort(422, { ok: false, fehler: "pruefung", stellen: geprueft.error.issues.map((i) => i.path.join(".") + ": " + i.message) });

  const inhalt = JSON.stringify(geprueft.data, null, 2) + "\n";
  const nachricht = `Editor: ${bereichName(body.bereich)} geändert durch ${mail}`;
  try {
    await schreiben(env, sitePfad(env), inhalt, body.sha, nachricht);
  } catch (e) {
    if (e && e.code === "konflikt") return antwort(409, { ok: false, fehler: "konflikt" });
    return antwort(502, { ok: false, fehler: "github" });
  }
  return antwort(200, { ok: true });
}
