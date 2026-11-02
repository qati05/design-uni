// Erzeugt public/css/tokens.css aus src/tokens/tokens.json (eine Quelle, web-uni Schritt 4).
import { readFileSync, writeFileSync } from "node:fs";
const t = JSON.parse(readFileSync(new URL("../src/tokens/tokens.json", import.meta.url), "utf8"));
const zeilen = [];
const dim = (v) => `${v.value}${v.unit}`;
const wert = (tok) => {
  const v = tok.$value, ty = tok.$type;
  if (ty === "color") return v.hex;
  if (ty === "dimension") return dim(v);
  if (ty === "duration") return dim(v);
  if (ty === "cubicBezier") return `cubic-bezier(${v.join(", ")})`;
  if (ty === "fontFamily") return v.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(", ");
  return String(v);
};
function lauf(obj, pfad, erbtTyp) {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith("$")) continue;
    if (v.$value !== undefined) {
      const tok = { ...v, $type: v.$type || erbtTyp };
      zeilen.push(`  --${pfad.concat(k).join("-")}: ${wert(tok)};`);
    } else lauf(v, pfad.concat(k), v.$type || erbtTyp);
  }
}
for (const [k, v] of Object.entries(t)) { if (k.startsWith("$")) continue; lauf({ [k]: v }, [], undefined); }
writeFileSync(new URL("../public/css/tokens.css", import.meta.url), `/* ERZEUGT aus src/tokens/tokens.json durch scripts/tokens.mjs. Nicht von Hand ändern. */\n:root {\n${zeilen.join("\n")}\n}\n`);
console.log(`tokens.css: ${zeilen.length} Tokens`);
