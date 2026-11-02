"""Lichtregel fuer die ganze Fotoserie (design-uni Schritt 4, schwache Fotos):
Zweiton von Logo-Navy (#253145) zu Kabinenweiss (#F4F6F8), feste Kontrastkurve, leichte Koernung.
Jedes Bild gleich, kein Einzelbild «gerettet». Metadaten werden entfernt (neues Bild ohne EXIF).
Aufruf: python3 -I lichtregel.py <eingabe/fotos> <public/bilder>"""
import sys, os, random
from PIL import Image, ImageOps, ImageFilter
QUELLE, ZIEL = sys.argv[1], sys.argv[2]
os.makedirs(ZIEL, exist_ok=True)
DUNKEL, HELL = (37, 49, 69), (244, 246, 248)
BREITEN = [480, 640, 800, 1200]
AUSWAHL = ["foto-03", "foto-06", "foto-09", "foto-10", "foto-11", "foto-12", "foto-17", "foto-18", "foto-21"]
random.seed(7)
def kurve(v):  # S-Kurve: Schatten tiefer, Lichter offen
    x = v / 255.0
    y = x * x * (3 - 2 * x)
    return int(255 * (0.55 * y + 0.45 * x))
for name in AUSWAHL:
    im = Image.open(os.path.join(QUELLE, name + ".jpg")).convert("L")
    im = im.filter(ImageFilter.MedianFilter(3))  # Handyrauschen glätten, bevor die Körnung gleichmässig dazukommt
    im = ImageOps.autocontrast(im, cutoff=1).point(kurve)
    rausch = Image.effect_noise(im.size, 10).filter(ImageFilter.GaussianBlur(0.4))
    im = Image.blend(im, Image.merge("L", [rausch]).point(lambda v: v), 0.04)
    farbig = ImageOps.colorize(im, black=DUNKEL, white=HELL)
    for b in BREITEN:
        if b > farbig.width: continue
        h = round(farbig.height * b / farbig.width)
        k = farbig.resize((b, h), Image.LANCZOS)
        k.save(os.path.join(ZIEL, f"{name}-{b}.webp"), "WEBP", quality=66, method=6)
        k.save(os.path.join(ZIEL, f"{name}-{b}.jpg"), "JPEG", quality=78, optimize=True, progressive=True)
    print(name, farbig.size)
