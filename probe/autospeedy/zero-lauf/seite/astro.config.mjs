import { defineConfig } from "astro/config";

// Statische Ausgabe, Seiten als «name.html», HTML nicht verdichtet (lesbarer Vergleich und Fehlersuche).
export default defineConfig({
  output: "static",
  build: { format: "file" },
  compressHTML: false,
  devToolbar: { enabled: false },
});
