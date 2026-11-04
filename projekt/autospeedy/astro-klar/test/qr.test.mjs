// QR-Dekodier-Test (BAUPLAN 4.6): bau/qr.mjs erzeugt public/bewerten/qr.svg. Hier wird die SVG mit sharp zu einem
// Rasterbild gemacht und mit jsQR gelesen — der dekodierte Text muss genau die Ziel-URL (…/bewerten/?q=qr) sein.
// So ist belegt, dass ein Scanner die richtige Adresse erhält. Keine echten Netzaufrufe.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import sharp from "sharp";
import jsQR from "jsqr";
import { erzeugeQr, QR_ZIEL } from "../bau/qr.mjs";

test("Ziel-URL zeigt auf /bewerten/?q=qr", () => {
  assert.match(QR_ZIEL, /^https:\/\/[^/]+\/bewerten\/\?q=qr$/);
});

test("erzeugte qr.svg lässt sich scannen und ergibt die Ziel-URL", async () => {
  const pfad = await erzeugeQr();
  const svg = fs.readFileSync(pfad);
  assert.match(svg.toString("utf8"), /<svg/, "es ist wirklich ein SVG");

  // SVG zu RGBA-Pixeln rastern (grosszügig, mit weissem Hintergrund für den Scanner).
  const breite = 512;
  const { data, info } = await sharp(svg, { density: 300 })
    .resize(breite, breite, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const ergebnis = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  assert.ok(ergebnis, "jsQR hat einen Code gefunden");
  assert.equal(ergebnis.data, QR_ZIEL);
});
