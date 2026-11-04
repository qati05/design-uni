// JPEG prüfen und von Metadaten befreien, ohne das Bild neu zu kodieren.
// Magic Bytes FF D8 FF (sonst kein JPEG). Entfernt die Segmente APP1 (EXIF, auch GPS) und APP13 (IPTC/Photoshop),
// indem die Segmentkette geparst wird; die Bilddaten bleiben Byte für Byte erhalten.
// Plain JS, läuft bei Cloudflare und im Node-Test.

/** true, wenn die ersten Bytes FF D8 FF sind. */
export function istJpeg(bytes) {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
}

/**
 * Gibt eine neue Uint8Array ohne APP1- und APP13-Segmente zurück. Wirft, wenn es kein JPEG ist.
 * Die Segmente vor dem Scanbeginn (SOS, FFDA) werden gelesen; ab SOS wird der Rest unverändert übernommen.
 */
export function ohneMetadaten(bytes) {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (!istJpeg(b)) throw new Error("kein JPEG (Magic Bytes FF D8 FF fehlen)");
  const teile = [b.subarray(0, 2)]; // SOI (FF D8)
  let i = 2;
  while (i + 1 < b.length) {
    if (b[i] !== 0xff) { teile.push(b.subarray(i)); break; } // keine saubere Marke mehr: Rest unverändert
    const marke = b[i + 1];
    // Füllbytes (FF FF) überspringen
    if (marke === 0xff) { teile.push(b.subarray(i, i + 1)); i += 1; continue; }
    // Scanbeginn (SOS) oder Dateiende (EOI): ab hier alles unverändert übernehmen
    if (marke === 0xda || marke === 0xd9) { teile.push(b.subarray(i)); break; }
    // Marken ohne Länge (RST0–7, TEM): einfach übernehmen
    if ((marke >= 0xd0 && marke <= 0xd7) || marke === 0x01) { teile.push(b.subarray(i, i + 2)); i += 2; continue; }
    // Marke mit Länge: zwei Byte Länge (inkl. der zwei Längenbytes), big-endian
    if (i + 3 >= b.length) { teile.push(b.subarray(i)); break; }
    const laenge = (b[i + 2] << 8) | b[i + 3];
    const ende = i + 2 + laenge;
    if (laenge < 2 || ende > b.length) { teile.push(b.subarray(i)); break; } // kaputt: Rest unverändert
    if (marke !== 0xe1 && marke !== 0xed) teile.push(b.subarray(i, ende)); // APP1 (E1) und APP13 (ED) weglassen
    i = ende;
  }
  let gesamt = 0;
  for (const t of teile) gesamt += t.length;
  const aus = new Uint8Array(gesamt);
  let pos = 0;
  for (const t of teile) { aus.set(t, pos); pos += t.length; }
  return aus;
}
