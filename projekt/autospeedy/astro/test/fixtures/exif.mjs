// Erzeugt ein kleines, gültiges JPEG-Gerüst mit einem APP1-Segment (EXIF inkl. GPS) und einem APP13-Segment (IPTC).
// Kein echtes Foto, nur die Segmentkette, damit gemeinsam/jpeg.js das Entfernen der Metadaten prüfbar ist.
// Beim Lauf von jpeg.test.mjs wird die Datei test/fixtures/exif-gps.jpg daraus geschrieben.
import { fileURLToPath } from "node:url";
import fs from "node:fs";

function segment(marke, nutzlast) {
  const laenge = nutzlast.length + 2; // inkl. der zwei Längenbytes
  return [0xff, marke, (laenge >> 8) & 0xff, laenge & 0xff, ...nutzlast];
}
const bytes = (s) => [...new TextEncoder().encode(s)];

export function machExifJpeg() {
  const soi = [0xff, 0xd8];
  // APP1: "Exif\0\0" + Platzhalter für einen GPS-Eintrag (nur als Markierung, nicht als echtes TIFF)
  const app1 = segment(0xe1, [...bytes("Exif\0\0"), ...bytes("GPSLatitude=47.4155 GPSLongitude=9.4913")]);
  // APP13: Photoshop/IPTC-Kennung
  const app13 = segment(0xed, [...bytes("Photoshop 3.0\0"), ...bytes("8BIM IPTC Ort=Altstaetten")]);
  const dqt = segment(0xdb, new Array(65).fill(1)); // winzige Quantisierungstabelle (nur damit eine Bildmarke da ist)
  const sos = [0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00]; // SOS-Kopf
  const scan = [0x7f, 0x10, 0x20]; // ein paar Scanbytes
  const eoi = [0xff, 0xd9];
  return new Uint8Array([...soi, ...app1, ...app13, ...dqt, ...sos, ...scan, ...eoi]);
}

/** Schreibt die Fixture neben dieses Modul und gibt den Pfad zurück. */
export function schreibeFixture() {
  const pfad = fileURLToPath(new URL("./exif-gps.jpg", import.meta.url));
  fs.writeFileSync(pfad, machExifJpeg());
  return pfad;
}
