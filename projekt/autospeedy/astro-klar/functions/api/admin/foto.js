// POST /api/admin/foto (BAUPLAN 4.1): nimmt ein Teamfoto (im Browser schon auf 800 px JPEG verkleinert) entgegen,
// prüft Magic Bytes und Grösse (≤ 400 KB), entfernt EXIF/IPTC und legt es als public/bilder/team/<slug>.jpg ab.
// Der Slug kommt aus dem Personennamen; der Original-Dateiname wird nie übernommen. Hinter Access (401 ohne JWT).
import { access } from "../../../../gemeinsam/access.js";
import { lesen, schreiben } from "../../../../gemeinsam/github.js";
import { istJpeg, ohneMetadaten } from "../../../../gemeinsam/jpeg.js";

const MAX = 400 * 1024; // 400 KB

function antwort(status, daten) {
  return new Response(JSON.stringify(daten), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}

/** Aus einem Personennamen einen sicheren Dateinamen bilden: Umlaute auflösen, nur a–z, 0–9 und «-». */
export function slugVonName(name) {
  // «ss» für das scharfe S als Unicode-Escape (de-CH schreibt kein Eszett; die Zuordnung bleibt für eingefügte Namen).
  const karte = { "ä": "ae", "ö": "oe", "ü": "ue", "\u00df": "ss", "à": "a", "á": "a", "â": "a", "é": "e", "è": "e", "ê": "e", "ï": "i", "î": "i", "ô": "o", "ç": "c", "ñ": "n", "š": "s", "č": "c", "ć": "c", "ž": "z", "đ": "d" };
  const s = String(name || "").toLowerCase().replace(/[äöü\u00dfàáâéèêïîôçñšččćžđ]/g, (c) => karte[c] || "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return s.slice(0, 80);
}

export async function onRequestPost({ request, env }) {
  if (env.ERLAUBTE_HERKUNFT && request.headers.get("Origin") !== env.ERLAUBTE_HERKUNFT) return antwort(403, { ok: false, fehler: "herkunft" });
  const mail = await access(request, env);
  if (!mail) return antwort(401, { ok: false, fehler: "zugriff" });

  if (!(request.headers.get("Content-Type") || "").includes("multipart/form-data")) return antwort(415, { ok: false, fehler: "format" });
  let form;
  try { form = await request.formData(); } catch { return antwort(400, { ok: false, fehler: "format" }); }

  const slug = slugVonName(form.get("name"));
  if (slug.length < 2) return antwort(422, { ok: false, fehler: "name" });
  const datei = form.get("foto");
  if (!datei || typeof datei.arrayBuffer !== "function") return antwort(422, { ok: false, fehler: "foto" });

  const roh = new Uint8Array(await datei.arrayBuffer());
  if (roh.length > MAX) return antwort(413, { ok: false, fehler: "zu-gross" });
  if (!istJpeg(roh)) return antwort(422, { ok: false, fehler: "kein-jpeg" });
  const sauber = ohneMetadaten(roh);

  const pfad = `public/bilder/team/${slug}.jpg`;
  let sha;
  try { const vorhanden = await lesen(env, pfad); sha = vorhanden && vorhanden.sha; } catch { sha = undefined; }
  try {
    await schreiben(env, pfad, sauber, sha, `Editor: Teamfoto ${slug}.jpg geändert durch ${mail}`);
  } catch (e) {
    if (e && e.code === "konflikt") return antwort(409, { ok: false, fehler: "konflikt" });
    return antwort(502, { ok: false, fehler: "github" });
  }
  return antwort(200, { ok: true, foto: `/bilder/team/${slug}.jpg` });
}
