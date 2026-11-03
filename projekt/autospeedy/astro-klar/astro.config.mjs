import { defineConfig } from "astro/config";
import "../astro/bau/daten.mjs"; // dieselben Pflichtprüfungen wie die erste Linie
import dateien from "../astro/bau/dateien.mjs"; // robots.txt, _headers (noindex in der Vorschau), Linkprüfung wie die erste Linie

// Zweite Linie «Klar»: gleiche Inhalte (../astro/src/content), anderes Aussehen. Statisch, Verzeichnisformat wie die erste Linie.
export default defineConfig({
  output: "static",
  build: { format: "directory" },
  trailingSlash: "always",
  compressHTML: false,
  devToolbar: { enabled: false },
  integrations: [dateien()],
});
