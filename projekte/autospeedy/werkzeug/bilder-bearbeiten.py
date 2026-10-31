#!/usr/bin/env python3
"""Eine feste Bearbeitung für die ganze Serie (Lichtregel), als Skript wiederholbar.
Liest bilder-roh/, schreibt site/bilder/<name>-<breite>.webp.
Regel: leichte Kontrastkurve, Sättigung 88 %, Weiss der Kabinen neutral, nichts einzeln «schöner».
Aufruf: python3 -I werkzeug/bilder-bearbeiten.py <projektordner>"""
import sys, pathlib
from PIL import Image, ImageEnhance, ImageOps

basis = pathlib.Path(sys.argv[1])
roh, ziel = basis / 'bilder-roh', basis / 'site' / 'bilder'
ziel.mkdir(parents=True, exist_ok=True)

def regel(im):
    im = ImageOps.exif_transpose(im).convert('RGB')
    im = ImageOps.autocontrast(im, cutoff=(0.4, 0.6))
    im = ImageEnhance.Color(im).enhance(0.88)
    im = ImageEnhance.Contrast(im).enhance(1.06)
    return im

for f in sorted(roh.glob('*.jpg')):
    im = regel(Image.open(f))
    for b in (1600, 800):
        k = im.copy(); k.thumbnail((b, b * 2))
        k.save(ziel / f'{f.stem}-{b}.webp', 'WEBP', quality=78, method=6)
print('fertig', len(list(ziel.glob('*.webp'))))
