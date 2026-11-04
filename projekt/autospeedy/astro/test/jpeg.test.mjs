// Prüft gemeinsam/jpeg.js: Magic Bytes und das Entfernen von APP1 (EXIF/GPS) und APP13 (IPTC) ohne Neu-Kodieren.
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { istJpeg, ohneMetadaten } from "../../gemeinsam/jpeg.js";
import { machExifJpeg, schreibeFixture } from "./fixtures/exif.mjs";

before(() => { schreibeFixture(); }); // test/fixtures/exif-gps.jpg erzeugen

const enthaelt = (bytes, text) => new TextDecoder("latin1").decode(bytes).includes(text);

test("istJpeg erkennt FF D8 FF, lehnt anderes ab", () => {
  assert.equal(istJpeg(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])), true);
  assert.equal(istJpeg(new Uint8Array([0x89, 0x50, 0x4e, 0x47])), false); // PNG
  assert.equal(istJpeg(new Uint8Array([0xff, 0xd8])), false);
});

test("ohneMetadaten entfernt APP1 (EXIF/GPS) und APP13 (IPTC), behält SOI und Bilddaten", () => {
  const roh = machExifJpeg();
  assert.ok(enthaelt(roh, "GPSLatitude"), "Fixture hat GPS");
  assert.ok(enthaelt(roh, "8BIM IPTC"), "Fixture hat IPTC");
  const sauber = ohneMetadaten(roh);
  assert.equal(sauber[0], 0xff); assert.equal(sauber[1], 0xd8); // SOI bleibt
  assert.ok(!enthaelt(sauber, "GPSLatitude"), "GPS entfernt");
  assert.ok(!enthaelt(sauber, "Longitude"), "GPS entfernt");
  assert.ok(!enthaelt(sauber, "8BIM IPTC"), "IPTC entfernt");
  assert.ok(sauber.length < roh.length, "kleiner als vorher");
  // Bilddaten (ab SOS) unverändert: die letzten Bytes (Scan + EOI) bleiben
  assert.deepEqual([...sauber.slice(-2)], [0xff, 0xd9]);
});

test("ohneMetadaten wirft bei Nicht-JPEG", () => {
  assert.throws(() => ohneMetadaten(new Uint8Array([1, 2, 3])));
});

test("ohneMetadaten lässt ein JPEG ohne APP1/APP13 unverändert", () => {
  const ohne = new Uint8Array([0xff, 0xd8, 0xff, 0xdb, 0x00, 0x03, 0x00, 0xff, 0xda, 0x00, 0x02, 0x10, 0xff, 0xd9]);
  assert.deepEqual([...ohneMetadaten(ohne)], [...ohne]);
});
