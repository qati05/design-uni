# Entscheide des Auftraggebers (design-uni Schritt 1.1, text-uni Text-Akte, web-uni Grundregel 8)

Quelle aller Zeilen: `eingabe/kundenangaben.md` Teil 5 (Wünsche des Kunden, wörtlich über den Auftraggeber) und der Auftrag dieses Laufs (2. November 2026). Diese Liste geht jeder Regel der drei Skills vor.

| # | Entscheid | Quelle | Folge im Bau |
|---|---|---|---|
| E1 | Helle Seite, helle Farben | Kunde, Teil 5 | Grund «Kabinenweiss» (kühles Fast-Weiss), Fotos hell im Zweiton |
| E2 | Auf jeder Seite, auf jedem Gerät ein CTA für die Schadenmeldung | Kunde, Teil 5; Teil 1 Hauptaktion | «Schaden melden» fest im Kopf (klebt beim Scrollen), Desktop und Handy |
| E3 | Tesla-Partner (Tesla Approved Body Shop), Weiterleitungen von Tesla; Tesla-Leute sollen sich direkt finden | Kunde, Teil 5 | eigene Seite `tesla.html`, im Menü; Partnerschaft extern **nicht belegt** (Q25): als Angabe des Betriebs geführt, Nachweis im Zusagen-Blatt |
| E4 | «Sauber, informativ und simple to use», Schadenmeldung mit wenigen Klicks und Angaben | Kunde, Teil 5 | 2 Pflichtfelder (Name, Telefon), höchstens 4 Textfelder |
| E5 | Google-Bewertungen als Karten, kein fremdes Widget | Kunde, Teil 5 | drei Karten, gesetzt in der Hausschrift, Link zur Quelle; Einwilligung der Verfasser offen (sichtbar vermerkt) |
| E6 | Formular schreibt nur eine E-Mail, kein Backend | Kunde, Teil 5 | `mailto:` (mit JS vorbereitet, ohne JS als `form action="mailto:"`) |
| E7 | Bei Tesla Modelle wählbar | Kunde, Teil 5 | Modell-Liste als Auswahlfeld auf `tesla.html` |
| E8 | Kein Grün; Farben des Logos benutzen | Kunde, Teil 5 und Teil 3 «Gegenbild» | Palette aus dem Logo: Navy, Schwarz, Silber; dazu das Blau des Markerkreises aus foto-06 als einziger Akzent `[Annahme, zur Bestätigung]` |
| E9 | Nur öffentlich zugängliche Angaben, nichts erfinden (keine Preise, Fristen, Garantien, Jahre) | Rahmen Teil 5 | Lücken als Satz; keine Antwortfrist, kein Preis |
| E10 | Bilder nur von der Website des Betriebs; keine Porträts, keine Drittlogos, keine Stock- oder KI-Bilder | Rahmen Teil 5 | 9 eigene Fotos, Lichtregel als Skript; kein Tesla-Logo; foto-18 zeigt eine Person nicht erkennbar (Schutzanzug, Maske) `[Annahme]` |
| E11 | Statisch, ohne Cookies, ohne fremde Hosts | Rahmen Teil 5 | Astro statisch, Schrift lokal, keine Karte eingebettet, keine Zählung mit Speicher |
| E12 | Vorschau `noindex`, nichts geht live | Rahmen Teil 5 | `noindex, nofollow`, `robots.txt` sperrt alles, keine Sitemap |
| E13 | Standard-Stack Astro, statische Ausgabe, aus `vorlage-astro` | Auftrag dieses Laufs; web-uni Schritt 2 | `ergebnis/seite/` |
| E14 | Ton «Sie» | Kundenangaben Teil 3 `[Annahme]` | ganze Website siezt |
| E15 | Freitag schliesst um 17.15 Uhr (Website gilt vor Verzeichnissen) | Kundenangaben Teil 2, fakten.md Teil 3 | in `betrieb.json`; Bestätigung offen (Zusagen-Blatt) |
