// Bilder im Browser vorbereiten, bevor sie hochgeladen werden: zuschneiden, verkleinern, in ein kleines Format wandeln.
// So kommen Handyfotos mit wenigen hundert Kilobyte an, und die Website bleibt schnell.

export type BildArt = "portraet" | "foto" | "logo";
export type Fertig = { blob: Blob; b: number; h: number };

const FEHLER = "Dieses Bild lässt sich nicht lesen. Bitte ein JPG oder PNG wählen.";

function alsBlob(c: HTMLCanvasElement, typ: string, q: number): Promise<Blob | null> {
  return new Promise((r) => c.toBlob(r, typ, q));
}

/** portraet: quadratisch, 640 px. foto: längste Seite höchstens 1600 px. logo: höchstens 600 × 300 px, Durchsicht bleibt. */
export async function bildVorbereiten(datei: File, art: BildArt): Promise<Fertig | { fehler: string }> {
  let bild: ImageBitmap;
  try { bild = await createImageBitmap(datei); } catch { return { fehler: FEHLER }; }
  let sx = 0, sy = 0, sb = bild.width, sh = bild.height, b: number, h: number;
  if (art === "portraet") {
    const s = Math.min(bild.width, bild.height);
    sx = (bild.width - s) / 2; sy = (bild.height - s) / 2; sb = s; sh = s;
    b = h = Math.min(640, s);
  } else {
    const f = art === "foto" ? Math.min(1, 1600 / Math.max(bild.width, bild.height)) : Math.min(1, 600 / bild.width, 300 / bild.height);
    b = Math.max(1, Math.round(bild.width * f)); h = Math.max(1, Math.round(bild.height * f));
  }
  if (art === "foto" && (b < 400 || h < 300)) return { fehler: "Dieses Foto ist zu klein. Bitte ein grösseres wählen (mindestens 400 × 300 Punkte)." };
  if (art === "logo" && (b < 40 || h < 20)) return { fehler: "Dieses Logo ist zu klein. Bitte ein grösseres wählen." };
  const c = document.createElement("canvas"); c.width = b; c.height = h;
  const k = c.getContext("2d");
  if (!k) return { fehler: FEHLER };
  k.drawImage(bild, sx, sy, sb, sh, 0, 0, b, h);
  let blob = await alsBlob(c, "image/webp", art === "logo" ? 0.92 : 0.82);
  // Manche Browser können kein WebP schreiben und liefern dann PNG. Für Fotos wäre das zu gross: lieber JPG.
  if (blob && blob.type !== "image/webp" && art !== "logo") blob = await alsBlob(c, "image/jpeg", 0.85);
  if (!blob) return { fehler: FEHLER };
  if (blob.size > 1_400_000) return { fehler: "Dieses Bild ist zu gross. Bitte ein anderes wählen." };
  return { blob, b, h };
}

/** Kurze, zufällige Kennung für ein neues Foto im Entwurf. */
export function neueKennung(): string {
  const a = new Uint8Array(9);
  crypto.getRandomValues(a);
  return Array.from(a, (x) => (x % 36).toString(36)).join("") + Date.now().toString(36).slice(-4);
}
