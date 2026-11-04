// Holt Bilder und Formular-Skripte aus der ersten Linie (../astro/public), damit beide Linien dieselben Fotos und
// dieselbe Logik nutzen. Die Kopien sind nicht im Git (.gitignore).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const hier = path.dirname(fileURLToPath(import.meta.url));
const quelle = path.join(hier, "..", "..", "astro", "public");
const ziel = path.join(hier, "..", "public");
fs.cpSync(path.join(quelle, "bilder"), path.join(ziel, "bilder"), { recursive: true });
for (const d of ["schaden.js", "rueckruf.js", "zaehl.js"]) fs.copyFileSync(path.join(quelle, "js", d), path.join(ziel, "js", d));
console.log("teilen: Bilder und Skripte aus ../astro übernommen");
// Stock-Platzhalter von Entwurf C (B1 Hero) aus referenz-c erzeugen (nach dem Kopieren, eigener Unterordner stock/)
await import("./stock-c.mjs");
// Nachtrag: Leistungskarten (3:2 AVIF/WebP), Hero/Tesla-AVIF, OG-Bild und Icons (nach dem Kopieren der WebP-Quellen)
await import("./bilder-c.mjs");
