import "./bau/daten-pfad.mjs"; // zuerst: Inhaltspfad setzen (plattformunabhaengig, auch Windows)
import { defineConfig } from "astro/config";
import "../astro/bau/daten.mjs"; // dieselben Pflichtprüfungen wie die erste Linie
import dateien from "../astro/bau/dateien.mjs"; // robots.txt, _headers (noindex in der Vorschau), Linkprüfung wie die erste Linie
import editor from "../astro/bau/editor.mjs"; // Sveltia-Notweg unter /admin/ (Standard aus), wie die erste Linie
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Editor /admin/ («Website bearbeiten»): Die Pflege liegt im Cockpit (entscheide.md, 02.11.2026). Darum gehört die Seite
// nicht mehr zum normalen Bau (Prüfung 10.11.2026, Befund 10). Wie in der ersten Linie gilt: /admin/ gibt es nur, wenn beim
// Bau ausdrücklich EDITOR_AKTIV=true gesetzt ist. Ohne den Schalter entfernt der Bau die Seite samt ihrem Skript und Stil.
// Die Functions unter /api/admin/* bleiben; ohne Anmeldung (Cloudflare Access) antworten sie mit 401.
const editorAn = process.env.EDITOR_AKTIV === "true";
function adminNurAufWunsch() {
  return {
    name: "admin-nur-auf-wunsch",
    hooks: {
      "astro:build:done": ({ dir }) => {
        if (editorAn) return;
        const ziel = fileURLToPath(dir);
        for (const p of ["admin", "js/admin.js", "css/admin.css"]) fs.rmSync(path.join(ziel, p), { recursive: true, force: true });
      },
    },
  };
}

// Zweite Linie «Klar»: gleiche Inhalte (../astro/src/content), anderes Aussehen. Statisch, Verzeichnisformat wie die erste Linie.
export default defineConfig({
  output: "static",
  // Nur fuer den Test: anderes Ausgabeverzeichnis (sonst dist/), damit ein Fixture-Bau den normalen Bau nicht ueberschreibt.
  ...(process.env.AUSGABE ? { outDir: `./${process.env.AUSGABE}` } : {}),
  build: { format: "directory" },
  trailingSlash: "always",
  compressHTML: false,
  devToolbar: { enabled: false },
  // volle CSP nur in Klar: kein Inline-Skript mehr. adminNurAufWunsch steht vor dateien(), damit die Linkprüfung und die
  // Sitemap den Stand ohne /admin/ sehen. Der Sveltia-Notweg (EDITOR_AKTIV=true mit EDITOR_REPO, siehe LIESMICH.md) legt
  // seine Seite wie bisher über /admin/; ohne EDITOR_REPO baut EDITOR_AKTIV=true den eigenen Editor (src/pages/admin/).
  integrations: [adminNurAufWunsch(), dateien({ csp: true }), ...(editorAn && process.env.EDITOR_REPO ? [editor()] : [])],
});
