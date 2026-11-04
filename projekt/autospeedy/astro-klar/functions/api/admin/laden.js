// GET /api/admin/laden (BAUPLAN 4.1): liefert die Pflege-Datei site.json und ihren GitHub-SHA an den Editor.
// Hinter Cloudflare Access. Ohne gültiges Access-JWT → 401. Kein Schlüssel und keine Mailadresse im Log.
import { access } from "../../../../gemeinsam/access.js";
import { lesen, sitePfad } from "../../../../gemeinsam/github.js";

function antwort(status, daten) {
  return new Response(JSON.stringify(daten), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}

export async function onRequestGet({ request, env }) {
  const mail = await access(request, env);
  if (!mail) return antwort(401, { ok: false, fehler: "zugriff" });
  let datei;
  try { datei = await lesen(env, sitePfad(env)); } catch { return antwort(502, { ok: false, fehler: "github" }); }
  if (!datei) return antwort(404, { ok: false, fehler: "keine-datei" });
  let site;
  try { site = JSON.parse(datei.inhalt); } catch { return antwort(502, { ok: false, fehler: "json" }); }
  return antwort(200, { ok: true, site, sha: datei.sha });
}
