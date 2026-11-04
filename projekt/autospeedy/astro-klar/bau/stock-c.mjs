// Erzeugt die Stock-Platzhalter von Entwurf C als WebP aus referenz-c/bilder/ (Quelle ist im Git, die Ableitungen nicht).
// B1 Hero 4:5 -> public/bilder/stock/b1-hero-{480,960,1440}.webp. Mit sharp (kommt mit Astro).
// B7 Tesla-Band (21:9 beschnitten) -> public/bilder/stock/b7-tesla-{640,1280,1920}.webp.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const hier = path.dirname(fileURLToPath(import.meta.url));
const quelle = path.join(hier, "..", "..", "referenz-c", "bilder");
const ziel = path.join(hier, "..", "public", "bilder", "stock");
fs.mkdirSync(ziel, { recursive: true });

const bilder = [
  { datei: "b1-hero-4x5.jpg", name: "b1-hero", breiten: [480, 960, 1440] },
  { datei: "unsplash-wbZ-k80yOqI.jpg", name: "b7-tesla", breiten: [640, 1280, 1920] },
];

for (const b of bilder) {
  // Ohne referenz-c (nicht im Paket) bleiben die eingecheckten WebP in public/bilder/stock/ stehen.
  if (!fs.existsSync(path.join(quelle, b.datei))) { console.warn(`stock-c: Quelle fehlt, behalte vorhandene ${b.name}-*.webp`); continue; }
  for (const w of b.breiten) {
    await sharp(path.join(quelle, b.datei))
      .resize({ width: w })
      .webp({ quality: 78 })
      .toFile(path.join(ziel, `${b.name}-${w}.webp`));
  }
}
console.log("stock-c: WebP-Platzhalter (B1) erzeugt");
