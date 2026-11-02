import { defineConfig } from "astro/config";

// Statische Ausgabe, Seiten als «name.html» (wie bisher), HTML nicht verdichtet (lesbarer Vergleich).
export default defineConfig({
  output: "static",
  build: { format: "file" },
  compressHTML: false,
  devToolbar: { enabled: false },
});
