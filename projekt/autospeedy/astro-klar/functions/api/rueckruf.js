// Dieselbe Funktion wie in der ersten Linie (ein Regelsatz, gleiche Daten in ../astro/src/content).
// Die Namen stehen einzeln da: Cloudflare Pages liest die Routen aus den Exporten dieser Datei und erkennt «export *» nicht.
export { onRequestGet, onRequestPost } from "../../../astro/functions/api/rueckruf.js";
