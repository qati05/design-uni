# Anforderungsblatt (web-uni Schritt 0) und Stack-Entscheid (Schritt 2)

## Anforderungsblatt (V0)

| # | Punkt | Antwort | Marke |
|---|---|---|---|
| 1 | Ziel | Schadenmeldung (E-Mail) und Anruf; Erfolg = gemeldete Schäden je Woche | [Entscheid · Kunde] |
| 2 | Wunsch des Kunden | **«Sauber, informativ und simple to use», hell, in den Logo-Farben, überall ein CTA zur Schadenmeldung, Tesla-Leute finden sich direkt.** Gegenbild: hellgrüne Carrosserie-Seite | [Entscheid · Kunde, Teil 5] |
| 3 | Besucher und Geräte | Anteil Handy unbekannt; Annahme: Mehrheit am Handy (Unfall, unterwegs); Rheintal, Deutsch | [Annahme] |
| 4 | Inhalte | 22 Handyfotos (9 verwendet), Rasterlogo, keine Videos, keine 3D-Modelle, keine Preise | [Fakt · eingabe] |
| 5 | Funktionen | Formular ohne Server (nur E-Mail), Tesla-Modellwahl, Bewertungen als Karten; keine Buchung, kein Konto, kein Shop | [Entscheid · Kunde] |
| 6 | Pflege | wer Zeiten, Fotos, Team ändert: [Lücke]. Heute: Wix (Q11) | [Lücke] |
| 7 | Budget und Frist | [Lücke] | [Lücke] |
| 8 | Recht und Daten | Schweiz (DSG, UWG); keine Cookies; Anfragen landen nur im Postfach; Hosting-Standort [Lücke] | [Entscheid · Rahmen] |
| 9 | Bestand | alte Adressen auf autospeedy.ch (Q1 bis Q10) für Weiterleitungen; Rankings unbekannt | [Fakt · QUELLEN] |
| 10 | Messung | Meldungen und Anrufe je Woche; Strichliste im Betrieb (messplan.md) | [Annahme] |
| 11 | Anfragekette | Eingang info@autospeedy.ch und Telefon; wer liest, wie schnell, was danach: **[Lücke]** | [Lücke] |

**V0:** alle elf Punkte beantwortet oder als Lücke geführt; Wunsch als Satz festgehalten. **Bestanden** (mit 4 Lücken).

## V1 · Klasse

| Merkmal | verlangt | erleichtert |
|---|---|---|
| 8 Seiten, wiederkehrende Bauteile (Kopf, Fuss, Zeiten) aus einer Quelle | B | – |
| Formular ohne Server | A oder B | – |
| Bewegung: ein gezeichneter Kreis | A/B (Stufe 1, CSS) | – |
| Pflege durch Laien | D oder B mit CMS (nicht gebaut) | B (eine Datei `betrieb.json`) |
| Konto, Shop, Buchung | keine | – |

## Entscheid-Stack

1. **Wahl:** Klasse B, **Astro 7.4.4**, statische Ausgabe, `build.format: "file"`, aus `skills/web-uni/vorlage-astro` (Standard-Stack, Entscheid E13).
2. **Weil-Sätze:**
   - weil Name, Telefon, Zeiten und Route auf allen 8 Seiten und im JSON-LD stehen und bei einer Änderung (Freitag 17.15 oder 17.30 Uhr ist offen, Anforderungsblatt 6 und entscheide.md E15) **eine** Datei (`src/content/betrieb.json`) geändert wird; das ist der Grund aus der **Organisation** (Pflege, ohne dass jemand acht Seiten durchsucht);
   - weil das Formular nur eine E-Mail vorbereiten darf (Anforderungsblatt 5) und darum kein Server und kein Framework-JavaScript nötig ist (gemessen 6,2 KB JS je Seite);
   - weil Bewegung und Interaktion mit CSS und 4 KB eigenem Skript auskommen (Anforderungsblatt 5, Stufe 1).
3. **Gegenentwurf:** Klasse A, Handgeschriebenes HTML. Warum nicht: acht Seiten mit gleichem Kopf, Fuss, Zeiten und Strukturdaten wären achtfach zu pflegen; der offene Freitags-Widerspruch zeigt, dass Zeiten sich ändern.
4. **Der einfachste Weg** (Klasse D, Wix wie heute): Der Kunde verliert «keine Cookies, keine fremden Hosts» (E11), das eigene Formularverhalten ohne Fremd-Widget und die Kontrolle über Ladezeit; er gewinnt Selbstpflege ohne Entwickler. Weil der Rahmen E11 ausdrücklich ohne fremde Hosts verlangt, verliert der einfachste Weg hier etwas.
5. **Kosten und Pflege** `[Annahme]`: Bau dieser Vorschau rund 1 Arbeitstag; Hosting statisch, Schweizer Anbieter wenige Franken im Monat [Lücke: Angebot]; Pflege: Änderung in `betrieb.json` durch eine Person mit Git-Zugang oder Agentur; Laien-CMS (Keystatic, Decap) **[nicht gebaut]**.
6. **Umkehrbarkeit:** Die Ausgabe ist reines HTML/CSS; ein Wechsel nach Klasse A kostet nichts (dist übernehmen), nach D den Neuaufbau der Seiten (Texte und Bilder sind wiederverwendbar).

**V2 · Entscheid geprüft: nicht gelaufen.** Verlangt ist ein zweiter Blick durch einen Unteragenten ohne Kontext oder eine Fachperson; in dieser Sitzung gibt es kein Werkzeug zum Starten von Unteragenten. Eigener stärkster Einwand (zählt nicht als V2): «Ohne Laien-CMS bleibt die Pflege beim Entwickler; Wix hätte das gelöst.» Antwort: Pflege ist Lücke 6, im Zusagen-Blatt als Frage an den Betrieb.
