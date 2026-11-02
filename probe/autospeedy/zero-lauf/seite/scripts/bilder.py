#!/usr/bin/env python3
"""Lichtregel für die ganze Serie (design-uni Schritt 4, «Schwache Fotos»): eine feste Bearbeitung, kein Bild einzeln gerettet.
1. Weissabgleich zur Hälfte Richtung neutral (Graue-Welt, 50 %). 2. Sättigung 0,86. 3. Tonkurve: sanfter Kontrast,
   Schwarz bleibt Schwarz, Lichter 2 % gedämpft. 4. leichte Schärfung. 5. Metadaten weg, WebP in drei Breiten.
Aufruf: python3 scripts/bilder.py  (liest ../../eingabe/fotos, schreibt public/bilder)"""
import numpy as np, os, json
from PIL import Image, ImageFilter, ImageEnhance
QUELLE = os.path.join(os.path.dirname(__file__), "../../../eingabe/fotos")
ZIEL = os.path.join(os.path.dirname(__file__), "../public/bilder")
os.makedirs(ZIEL, exist_ok=True)
# name: (datei, [breiten], schnitt (links, oben, rechts, unten in Anteilen) oder None)
BILDER = {
  "schaden-kreis":      ("foto-06.jpg", [480, 720], None),
  "felge-randschaden":  ("foto-07.jpg", [480, 800, 1200], None),
  "felge-grau":         ("foto-03.jpg", [480, 800, 1200], None),
  "felge-maske":        ("foto-02.jpg", [480, 720, 900], None),
  "felge-gold":         ("foto-04.jpg", [480, 720, 900], None),
  "felge-pink":         ("foto-05.jpg", [480, 720, 900], None),
  "felge-schwarz":      ("foto-08.jpg", [480, 720, 900], None),
  "kabine-front":       ("foto-13.jpg", [480, 800, 1200, 1600], None),
  "kabine-seite":       ("foto-14.jpg", [480, 800, 1200], None),
  "kabine-folie":       ("foto-09.jpg", [480, 800, 1200], None),
  "halle":              ("foto-10.jpg", [480, 800, 1200], None),
  "halle-schild":       ("foto-11.jpg", [480, 800, 1200], None),
  "hebebuehne":         ("foto-12.jpg", [480, 800, 1200], None),
  "lieferwagen":        ("foto-19.jpg", [480, 800, 1200], None),
  "folie-rot":          ("foto-20.jpg", [480, 800, 1200], None),
  "lackkante":          ("foto-17.jpg", [480, 720, 900], None),
  "metallic":           ("foto-21.jpg", [480, 720, 900], None),
  "ferrari":            ("foto-22.jpg", [480, 800, 1200], None),
}
def grade(im):
    a = np.asarray(im.convert("RGB"), dtype=np.float32) / 255.0
    m = a.reshape(-1, 3).mean(0); g = m.mean()
    gain = 1 + 0.5 * (g / np.maximum(m, 1e-3) - 1)
    a = np.clip(a * gain, 0, 1)
    im = Image.fromarray((a * 255).astype(np.uint8))
    im = ImageEnhance.Color(im).enhance(0.86)
    a = np.asarray(im, dtype=np.float32) / 255.0
    a = a + 0.10 * (a - 0.5) * (1 - np.abs(2 * a - 1))   # S-Kurve, Enden fest
    a = np.minimum(a, 0.98 + 0.02 * a)                   # Lichter leicht dämpfen
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
mass = {}
for name, (datei, breiten, schnitt) in BILDER.items():
    im = Image.open(os.path.join(QUELLE, datei)); im.load()
    if schnitt:
        w, h = im.size; im = im.crop((int(w*schnitt[0]), int(h*schnitt[1]), int(w*schnitt[2]), int(h*schnitt[3])))
    im = grade(im)
    w0, h0 = im.size
    mass[name] = {"w": w0, "h": h0, "breiten": [b for b in breiten if b <= w0]}
    for b in breiten:
        if b > w0: continue
        k = im.resize((b, round(h0 * b / w0)), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.0, percent=40, threshold=2))
        k.save(os.path.join(ZIEL, f"{name}-{b}.webp"), "WEBP", quality=(66 if name == "schaden-kreis" else 74), method=6)
json.dump(mass, open(os.path.join(os.path.dirname(__file__), "../src/content/bilder.json"), "w"), indent=1)
print(len(mass), "Bilder")
