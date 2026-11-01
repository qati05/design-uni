#!/usr/bin/env python3
"""Bilder der Website autospeedy.ch für die Vorschau aufbereiten.

Aufruf:  python3 -I werkzeuge/bilder-aufbereiten.py <arbeitsordner> <zielordner>

- lädt die Originale aus den Wix-Medien (siehe bilder/INVENTAR.md) in <arbeitsordner>,
  der NICHT im Repository liegen soll (Originale sind bis zu 4,5 MB gross),
- dreht nach EXIF, entfernt alle Metadaten (GPS, Gerät, Zeitstempel),
- skaliert auf die genannte Breite, schneidet nur dort, wo 'crop' steht,
- ändert KEINE Farben, Kontraste oder Helligkeit: Bei einem Lackierbetrieb darf das Foto
  den Lack nicht verfälschen.
"""
import hashlib
import os
import sys
import urllib.request

from PIL import Image, ImageOps

BASIS = "https://static.wixstatic.com/media/"

# name: (media-id, ziel-breite, crop als (links, oben, rechts, unten) in Bruchteilen oder None)
BILDER = {
    "hero-kabine-defender.jpg":      ("23d933_1ddcc99b68794acbaae4acc3b90a1f86~mv2.jpeg", 1800, (0.0, 0.10, 1.0, 0.91)),
    "hebebuehne-audi.jpg":           ("23d933_1a41a5e7ed704f34b2ef8b6c7c5d4cde~mv2_d_5184_3456_s_4_2.jpg", 1400, None),
    "lieferwagen-abgeklebt.jpg":     ("23d933_e7cfc6736e8043d9a1b6b2f583670837~mv2.jpeg", 1200, None),
    "lieferwagen-rot-folie.jpg":     ("23d933_27e10184ab2849fa978eae7e28b60972~mv2.jpeg", 1200, None),
    "lack-kante-rot-weiss.jpg":      ("23d933_689a59812ed9481bb3d32db976635cab~mv2.jpeg", 900, None),
    "lackierer-kabine.jpg":          ("23d933_e0b932c4767246e3b5f50ef68647e02d~mv2_d_3024_4032_s_4_2.jpg", 1200, None),
    "kabine-defender-tuer.jpg":      ("23d933_921cf01cab3745929a0c7540a9ea56aa~mv2.jpeg", 1200, None),
    "kabine-defender-heck.jpg":      ("23d933_d374134339964ab58fa7f57ceaaa0f9f~mv2.jpeg", 1200, None),
    "kabine-defender-seite.jpg":     ("23d933_4a006fdb14ef464ead713d3ec93e93f6~mv2.jpeg", 1200, None),
    "sportwagen-rot.jpg":            ("23d933_07579685f4bd46aeb18d3bd96a5c7343~mv2.jpeg", 1200, None),
    "felge-bordstein.jpg":           ("23d933_0314f9cfbc6d4283a8ca057d2a4e3757~mv2.jpeg", 1200, None),
    "felge-markiert.jpg":            ("23d933_cda1a7e737e947a3a4aa13cd1fa294ee~mv2.jpg", 900, None),
    "felge-gold-regal.jpg":          ("23d933_2fb7c9d076d349afa8366a0fa0a7fc42~mv2.jpeg", 900, None),
    "felge-schwarz-detail.jpg":      ("23d933_30faf987792d4c1e9919c1834165e0cd~mv2.jpeg", 1200, None),
    "felge-schwarz-poliert.jpg":     ("23d933_57b05abdf3674036b084b976c3dd181c~mv2.jpeg", 900, None),
    "felge-magenta.jpg":             ("23d933_e21da27037e44718a37a7d17563fb39f~mv2.jpeg", 900, None),
    "felge-blau-abgeklebt.jpg":      ("23d933_0ca3ea7dd6174ca2b9059b22fa3210e4~mv2.jpeg", 900, None),
    "folie-motorhaube.jpg":          ("23d933_69f57d9589884c9189a3abb3d1806021~mv2.jpeg", 1200, None),
    "defender-schriftzug-matt.jpg":  ("23d933_c21fb1bc70cd424fa95b9a7177a86bc0~mv2.jpeg", 1200, None),
    "matt-kante-blau.jpg":           ("23d933_ed89a13c5f8e4b4a83cf3f7321519687~mv2.jpeg", 900, None),
    "halle-areal.jpg":               ("23d933_2be29023e4c644b7a031c834b0e8d407~mv2.jpg", 1600, None),
    "halle-defender-schild.jpg":     ("23d933_6f8125b29e76404daa7c39eae882f3b2~mv2.jpeg", 1200, None),
    "logo-wirbel-s.png":             ("f05f45_73a3de092b7444e091767929315e09bd~mv2.png", 600, None),
}


def laden(media_id, ordner):
    pfad = os.path.join(ordner, media_id)
    if not os.path.exists(pfad):
        req = urllib.request.Request(BASIS + media_id, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r, open(pfad, "wb") as f:
            f.write(r.read())
    return pfad


def main():
    arbeit, ziel = sys.argv[1], sys.argv[2]
    os.makedirs(arbeit, exist_ok=True)
    os.makedirs(ziel, exist_ok=True)
    zeilen = []
    for name, (media_id, breite, crop) in BILDER.items():
        quelle = laden(media_id, arbeit)
        sha = hashlib.sha256(open(quelle, "rb").read()).hexdigest()[:12]
        im = ImageOps.exif_transpose(Image.open(quelle))
        w0, h0 = im.size
        if crop:
            l, o, r, u = crop
            im = im.crop((int(w0 * l), int(h0 * o), int(w0 * r), int(h0 * u)))
        if im.width > breite:
            im = im.resize((breite, round(im.height * breite / im.width)), Image.LANCZOS)
        ausgabe = os.path.join(ziel, name)
        if name.endswith(".png"):
            im.save(ausgabe, optimize=True)
        else:
            im.convert("RGB").save(ausgabe, "JPEG", quality=82, optimize=True, progressive=True)
        zeilen.append(f"{name}\t{media_id}\t{w0}x{h0}\t{im.width}x{im.height}\t{os.path.getsize(ausgabe)//1024} KB\t{sha}")
    print("\n".join(zeilen))


if __name__ == "__main__":
    main()
