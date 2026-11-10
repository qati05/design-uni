// Baut das Cockpit für Cloudflare Workers: npm run bau:cloudflare. Ergebnis: .open-next/ (Worker und statische Dateien).
//
// Warum nicht einfach «opennextjs-cloudflare build»: OpenNext sucht die Wurzel des Projekts über die Sperrdatei
// (package-lock.json) und findet sie hier in cockpit/. Next baut aber mit dem Elternordner als Wurzel (next.config.ts,
// turbopack.root), weil das Cockpit ../gemeinsam einbindet, und legt sein Ergebnis darum unter .next/standalone/cockpit/ ab.
// OpenNext sucht es dann am falschen Ort und bricht ab («ENOENT … middleware.js.nft.json»).
// Dieses Skript sagt OpenNext für die Dauer des Baus, die Sperrdatei liege im Elternordner. Es legt dort keine Datei an
// und ändert nichts ausserhalb von cockpit/: Es beantwortet nur die Frage «gibt es diese Datei?» im eigenen Prozess anders.
// Der Bau von Next läuft als eigener Prozess und merkt davon nichts.
// Ändert OpenNext seine Suche, scheitert der Bau laut (mit dem Fehler oben oder an der Prüfung am Schluss), nicht still.
import fs from "node:fs";
import path from "node:path";
import { syncBuiltinESMExports } from "node:module";
import { pathToFileURL } from "node:url";

const cockpit = path.resolve(import.meta.dirname, "..");
const wurzel = path.dirname(cockpit); // dieselbe Wurzel wie turbopack.root in next.config.ts
const SPERRDATEIEN = ["bun.lockb", "bun.lock", "package-lock.json", "yarn.lock", "pnpm-lock.yaml"];
const abbruch = (text) => { console.error("\nBau abgebrochen: " + text + "\n"); process.exit(1); };

process.chdir(cockpit);
// Beide Werte werden fest in den Bau geschrieben. Ohne sie gelänge der Bau, und das Cockpit scheiterte erst im Betrieb.
for (const name of ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"])
  if (!process.env[name]) abbruch(`${name} fehlt. Beide NEXT_PUBLIC_…-Werte müssen beim Bau gesetzt sein (EINRICHTEN.md, Schritt 9).`);
if (!fs.existsSync(path.join(wurzel, "gemeinsam/node_modules/zod")))
  abbruch("../gemeinsam ist nicht installiert. Zuerst: npm ci --prefix ../gemeinsam");

const echteWurzel = SPERRDATEIEN.some((d) => fs.existsSync(path.join(wurzel, d)));
if (!echteWurzel) {
  const gibtEs = fs.existsSync;
  fs.existsSync = (p) => {
    if (typeof p === "string") {
      const ziel = path.resolve(p);
      if (path.dirname(ziel) === cockpit && SPERRDATEIEN.includes(path.basename(ziel))) return false;
      if (ziel === path.join(wurzel, "package-lock.json")) return true;
    }
    return gibtEs(p);
  };
  syncBuiltinESMExports();
}

const start = Date.now();
process.on("exit", (code) => {
  if (code !== 0) return;
  const worker = path.join(cockpit, ".open-next/worker.js");
  const frisch = fs.statSync(worker, { throwIfNoEntry: false })?.mtimeMs ?? 0;
  if (frisch < start) { console.error("\nBau abgebrochen: .open-next/worker.js ist nicht neu entstanden.\n"); process.exitCode = 1; }
});
process.argv = [process.argv[0], "opennextjs-cloudflare", "build", ...process.argv.slice(2)];
// Die Datei von OpenNext startet den Bau beim Laden von selbst (sie liest process.argv).
await import(pathToFileURL(path.join(cockpit, "node_modules/@opennextjs/cloudflare/dist/cli/index.js")).href);
