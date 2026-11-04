// Holt beim Build NUR die Google-Gesamtnote, die Anzahl und den Maps-Link (BAUPLAN 4.3, Entscheid 03.11.2026:
// «nur Note, Anzahl und Link, keine Texte»). KEINE reviews, keine Namen, keine Bewertungstexte.
// Der Schluessel liegt nur in der Umgebung, nie im Repo, nie im Browser, nie im Log.
// Fehlt GOOGLE_PLACES_SCHLUESSEL oder GOOGLE_PLACE_ID: Datei {"status":"leer"}, der Build laeuft weiter (exit 0).
// Bei einem Abruf-Fehler: {"status":"fehler"}, der Build laeuft weiter.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ziel = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "daten", "bewertungen.json");

function schreibe(obj) {
  fs.mkdirSync(path.dirname(ziel), { recursive: true });
  fs.writeFileSync(ziel, JSON.stringify(obj, null, 2) + "\n");
}

const schluessel = process.env.GOOGLE_PLACES_SCHLUESSEL;
const placeId = process.env.GOOGLE_PLACE_ID;

if (!schluessel || !placeId) {
  schreibe({ status: "leer" });
  console.log("bewertungen: kein Schluessel oder keine Place-ID — Platzhalter bleiben (Build laeuft weiter)");
  process.exit(0);
}

try {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
  // FieldMask ohne «reviews»: wir holen und speichern bewusst keine Bewertungstexte und keine Namen.
  const antwort = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": schluessel,
      "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!antwort.ok) throw new Error(`HTTP ${antwort.status}`);
  const d = await antwort.json();
  schreibe({
    status: "ok",
    note: typeof d.rating === "number" ? d.rating : null,
    anzahl: typeof d.userRatingCount === "number" ? d.userRatingCount : null,
    maps_link: typeof d.googleMapsUri === "string" ? d.googleMapsUri : null,
    geholt_am: new Date().toISOString(),
  });
  console.log("bewertungen: Note, Anzahl und Maps-Link von Google geholt (ohne Texte)");
} catch (e) {
  // Nur die Fehlerart melden — nie Schluessel, Header oder Antwort ausgeben.
  schreibe({ status: "fehler" });
  console.warn(`bewertungen: Abruf fehlgeschlagen (${e && e.name ? e.name : "Fehler"}) — Platzhalter bleiben, Build laeuft weiter`);
  process.exit(0);
}
