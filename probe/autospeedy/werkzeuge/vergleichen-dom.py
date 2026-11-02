#!/usr/bin/env python3
"""Vergleicht zwei Seitenordner Token für Token (Tags, Attribute, Text), Leerraum und Attributreihenfolge egal.
Aufruf: python3 werkzeuge/vergleichen-dom.py <alt> <neu>"""
import sys, os, re
from html.parser import HTMLParser

class T(HTMLParser):
    def __init__(s): super().__init__(convert_charrefs=True); s.t=[]
    def handle_starttag(s, tag, attrs): s.t.append(("<"+tag, tuple(sorted((k, v or "") for k, v in attrs))))
    def handle_endtag(s, tag):
        if tag not in ("br","img","meta","link","input"): s.t.append(("</"+tag, ()))
    def handle_data(s, d):
        d = re.sub(r"[ \t\r\n]+", " ", d).strip()
        if d: s.t.append(("#", d))

def tokens(pfad):
    p = T(); p.feed(open(pfad, encoding="utf-8").read())
    t = p.t; aus = []; i = 0
    while i < len(t):
        # gewollte Abweichung 1: Datenblock für das Skript (nur in der Astro-Fassung)
        if t[i][0] == "<script" and ("id", "betrieb-daten") in t[i][1]:
            i += 3 if i + 2 < len(t) and t[i + 1][0] == "#" and t[i + 2][0] == "</script" else 1
            continue
        aus.append(t[i]); i += 1
    return aus

alt, neu = sys.argv[1], sys.argv[2]
seiten = sorted(f for f in os.listdir(alt) if f.endswith(".html"))
gleich = 0
for f in seiten:
    a, n = tokens(os.path.join(alt, f)), tokens(os.path.join(neu, f))
    if a == n: gleich += 1; print("gleich   ", f, len(a), "Tokens"); continue
    # Unterschiede kurz zeigen
    import difflib
    sm = difflib.SequenceMatcher(None, a, n, autojunk=False)
    print("UNGLEICH ", f)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal": continue
        print("   ", op, "alt:", a[i1:i2][:2], "neu:", n[j1:j2][:2])
print(f"{gleich} von {len(seiten)} Seiten Token für Token gleich")
