import { defineConfig } from "astro/config";
import "./bau/daten.mjs"; // prüft die Pflichtfelder vor dem Bau und bricht mit einer Liste ab
import dateien from "./bau/dateien.mjs";

// Statische Ausgabe im Verzeichnisformat: kontakt/index.html, Adresse und Link /kontakt/.
// So zeigt kein interner Link auf eine Weiterleitung (text-uni TI24); Cloudflare Pages leitet /kontakt.html auf /kontakt um.
export default defineConfig({
  output: "static",
  build: { format: "directory" },
  trailingSlash: "always",
  compressHTML: false,
  devToolbar: { enabled: false },
  integrations: [dateien()],
});
