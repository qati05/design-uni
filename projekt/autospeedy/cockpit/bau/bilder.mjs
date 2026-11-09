// Kopiert die Startbilder der Website ins Cockpit, damit es sie zeigen kann (Bereiche «Fotos» und «Partner»).
// Aufruf: npm run bilder. Die Kopien sind eingecheckt; ein Test prüft, dass sie zur Website passen.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const hier = dirname(fileURLToPath(import.meta.url));
const website = join(hier, "../../astro-klar/public"), cockpit = join(hier, "../public");

/** Pfade (wie auf der Website), die das Cockpit zeigt: die Vorgaben aus BILD_PLAETZE und die Partner-Logos aus site.json. */
export function startbilder() {
  const quelle = readFileSync(join(hier, "../../gemeinsam/site.ts"), "utf8");
  const site = JSON.parse(readFileSync(join(hier, "../../astro/src/daten/site.json"), "utf8"));
  const plaetze = [...quelle.matchAll(/vorgabe: "(\/bilder\/[a-z0-9/-]+\.webp)"/g)].map((m) => m[1]);
  const logos = (site.partner ?? []).map((p) => p.logo).filter((l) => typeof l === "string" && l.startsWith("/bilder/"));
  return [...new Set([...plaetze, ...logos])];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const p of startbilder()) { mkdirSync(dirname(join(cockpit, p)), { recursive: true }); copyFileSync(join(website, p), join(cockpit, p)); }
  console.log(`${startbilder().length} Startbilder kopiert.`);
}
