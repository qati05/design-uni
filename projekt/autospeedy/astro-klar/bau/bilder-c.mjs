// Nachtrag Startseite/SEO: erzeugt die Platzhalter-Bilder und Icons, die der Nachtrag braucht.
// Quelle sind die bereits von teilen.mjs kopierten WebP aus ../astro/public/bilder sowie die Stock-Quellen in
// referenz-c/bilder. Alle Ableitungen liegen unter public/bilder/ (per .gitignore nicht im Git, bei jedem Bau neu).
//   - 6 Leistungskarten als 3:2 in AVIF + WebP (400/800) -> public/bilder/leistungen/{slug}-{w}.{avif,webp}
//   - Hero B1 zusaetzlich als AVIF (inkl. ~800 px fuers Handy) -> public/bilder/stock/b1-hero-{w}.avif
//   - Tesla B7 zusaetzlich als AVIF -> public/bilder/stock/b7-tesla-{w}.avif
//   - Teilen-Bild (Open Graph) 1200x630 -> public/bilder/stock/og-start.jpg
//   - Favicon/Icon/Apple-Touch aus dem Logo -> public/bilder/icons/
// Platzhalter sind spaeter im Shooting ersetzbar (gleiche, klar benannte Dateinamen, S03-S08 der SHOOTING-LISTE).
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const hier = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(hier, "..", "public", "bilder");
const stockQuelle = path.join(hier, "..", "..", "referenz-c", "bilder");

// --- 6 Leistungskarten (3:2). Quelle = schon kopiertes WebP in public/bilder. Spaeter Shooting S03-S08. ---
const karten = [
  { slug: "unfall", quelle: "abgeklebt-960.webp" },
  { slug: "hagel", quelle: "dellen-960.webp" },
  { slug: "lack", quelle: "lackierkabine-960.webp" },
  { slug: "felgen", quelle: "felge-fertig-960.webp" },
  { slug: "folierung", quelle: "defender-folie-960.webp" },
  { slug: "scheiben", quelle: "werkstatt-960.webp" },
];
const zielLeist = path.join(pub, "leistungen");
fs.mkdirSync(zielLeist, { recursive: true });
for (const k of karten) {
  const quelle = path.join(pub, k.quelle);
  if (!fs.existsSync(quelle)) { console.warn(`bilder-c: Quelle fehlt, ueberspringe ${k.slug}: ${k.quelle}`); continue; }
  for (const w of [400, 800]) {
    const h = Math.round(w * 2 / 3);
    const basis = sharp(quelle).resize({ width: w, height: h, fit: "cover", position: "centre" });
    await basis.clone().avif({ quality: 55 }).toFile(path.join(zielLeist, `${k.slug}-${w}.avif`));
    await basis.clone().webp({ quality: 74 }).toFile(path.join(zielLeist, `${k.slug}-${w}.webp`));
  }
}

// --- Hero B1 als AVIF (4:5 wie das WebP), inkl. 800 px fuers Handy (LCP) ---
const heroQuelle = path.join(stockQuelle, "b1-hero-4x5.jpg");
const stockZiel = path.join(pub, "stock");
fs.mkdirSync(stockZiel, { recursive: true });
if (fs.existsSync(heroQuelle)) {
  for (const w of [480, 800, 960, 1440]) {
    await sharp(heroQuelle).resize({ width: w }).avif({ quality: 52 }).toFile(path.join(stockZiel, `b1-hero-${w}.avif`));
    if (w === 800 && !fs.existsSync(path.join(stockZiel, "b1-hero-800.webp")))
      await sharp(heroQuelle).resize({ width: w }).webp({ quality: 76 }).toFile(path.join(stockZiel, "b1-hero-800.webp"));
  }
  // Open-Graph-Bild 1200x630 aus derselben Quelle (Credit B1, siehe /bildnachweise/)
  await sharp(path.join(stockQuelle, "pexels-14615261.jpg")).resize({ width: 1200, height: 630, fit: "cover" }).jpeg({ quality: 82 }).toFile(path.join(stockZiel, "og-start.jpg"));
}
const teslaQuelle = path.join(stockQuelle, "unsplash-wbZ-k80yOqI.jpg");
if (fs.existsSync(teslaQuelle)) {
  for (const w of [640, 1280, 1920]) await sharp(teslaQuelle).resize({ width: w }).avif({ quality: 52 }).toFile(path.join(stockZiel, `b7-tesla-${w}.avif`));
}

// --- Icons aus dem Logo (Favicon, Apple-Touch, SVG-Huelle). Quelle: logo-144.webp ---
const logo = path.join(pub, "logo-144.webp");
const zielIcons = path.join(pub, "icons");
fs.mkdirSync(zielIcons, { recursive: true });
if (fs.existsSync(logo)) {
  // Apple-Touch 180x180 auf hellem Grund (Logo mittig, Rand)
  const grund = { r: 244, g: 244, b: 242, alpha: 1 };
  const logo120 = await sharp(logo).resize({ width: 120, height: 120, fit: "inside" }).png().toBuffer();
  await sharp({ create: { width: 180, height: 180, channels: 4, background: grund } })
    .composite([{ input: logo120, gravity: "centre" }]).png().toFile(path.join(zielIcons, "apple-touch-icon.png"));
  // 32x32 PNG fuer favicon.ico
  const png32 = await sharp({ create: { width: 32, height: 32, channels: 4, background: grund } })
    .composite([{ input: await sharp(logo).resize({ width: 26, height: 26, fit: "inside" }).png().toBuffer(), gravity: "centre" }])
    .png().toBuffer();
  await sharp(png32).toFile(path.join(zielIcons, "icon-32.png"));
  // ICO-Container (ein 32x32-PNG eingebettet) von Hand, da sharp kein .ico schreibt.
  const dir = Buffer.alloc(6); dir.writeUInt16LE(0, 0); dir.writeUInt16LE(1, 2); dir.writeUInt16LE(1, 4);
  const ent = Buffer.alloc(16); ent[0] = 32; ent[1] = 32; ent[2] = 0; ent[3] = 0;
  ent.writeUInt16LE(1, 4); ent.writeUInt16LE(32, 6); ent.writeUInt32LE(png32.length, 8); ent.writeUInt32LE(22, 12);
  fs.writeFileSync(path.join(pub, "icons", "favicon.ico"), Buffer.concat([dir, ent, png32]));
  // SVG-Icon: skalierbare Huelle mit dem Logo als eingebettetes Bild (bis ein echtes Vektorlogo vorliegt).
  const logo256 = (await sharp(logo).resize({ width: 220, height: 220, fit: "inside" }).png().toBuffer()).toString("base64");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" rx="48" fill="#f4f4f2"/><image x="18" y="18" width="220" height="220" href="data:image/png;base64,${logo256}"/></svg>\n`;
  fs.writeFileSync(path.join(zielIcons, "icon.svg"), svg);
}

console.log("bilder-c: Leistungskarten (3:2 AVIF/WebP), Hero/Tesla-AVIF, OG-Bild und Icons erzeugt");
