// Erzeugt beim Build public/bewerten/qr.svg mit dem QR-Code auf https://<domain>/bewerten/?q=qr (BAUPLAN 4.6).
// Nutzt das npm-Paket «qrcode» (exakte Version, devDependency). Die Domain kommt aus bau.adresse bzw. betrieb.mail
// (gemeinsam/mailtexte.js → domainAus). Reines SVG, kein Raster; die Druckvorlage /bewerten/druck/ bindet es ein.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import QRCode from "qrcode";
import { domainAus } from "../../gemeinsam/mailtexte.js";

const hier = path.dirname(fileURLToPath(import.meta.url));
const lies = (name) => JSON.parse(fs.readFileSync(path.join(hier, "..", "..", "astro", "src", "content", name), "utf8"));
const betrieb = lies("betrieb.json");
const bau = lies("bau.json");

export const QR_ZIEL = `https://${domainAus(betrieb, bau)}/bewerten/?q=qr`;

export async function erzeugeQr() {
  // Fehlerkorrektur «M», kleiner Rand; schwarz auf weiss für guten Scan-Kontrast.
  const svg = await QRCode.toString(QR_ZIEL, { type: "svg", errorCorrectionLevel: "M", margin: 2, color: { dark: "#1d1e20", light: "#ffffff" } });
  const ziel = path.join(hier, "..", "public", "bewerten", "qr.svg");
  fs.mkdirSync(path.dirname(ziel), { recursive: true });
  fs.writeFileSync(ziel, svg);
  return ziel;
}

// Direktaufruf (node bau/qr.mjs) und Einbindung im prebuild.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ziel = await erzeugeQr();
  console.log(`qr: ${QR_ZIEL} → ${path.relative(process.cwd(), ziel)}`);
}
