// Erzeugt public/css/tokens.css aus tokens.json (eine Quelle, web-uni Schritt 4). Läuft vor jedem Bau.
import fs from "node:fs";
const t = JSON.parse(fs.readFileSync(new URL("../tokens.json", import.meta.url), "utf8"));
const zeilen = [];
const wert = (typ, v) => {
  if (typ === "color") return v.hex;
  if (typ === "dimension" || typ === "duration") return `${v.value}${v.unit}`;
  if (typ === "fontFamily") return v.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", ");
  if (typ === "cubicBezier") return `cubic-bezier(${v.join(", ")})`;
  return String(v);
};
for (const [gruppe, inhalt] of Object.entries(t)) {
  if (gruppe.startsWith("$")) continue;
  const typ = inhalt.$type;
  for (const [name, tok] of Object.entries(inhalt)) {
    if (name.startsWith("$")) continue;
    zeilen.push(`  --${gruppe}-${name}: ${wert(typ, tok.$value)};`);
  }
}
fs.writeFileSync(new URL("../public/css/tokens.css", import.meta.url), `/* erzeugt aus tokens.json, nicht von Hand ändern */\n:root {\n${zeilen.join("\n")}\n}\n`);
console.log(`tokens.css: ${zeilen.length} Tokens`);
