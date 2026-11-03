# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Dieses Repository ist ein Claude-Code-Skill: Markdown-Verfahren, Referenzen und ein Node/Playwright-Werkzeug (`skills/design-uni/werkzeuge/kunde.cjs`). Es enthält keine Website und bekommt keine.

Websites entstehen in eigenen Repositories (eines pro Projekt). Hauptstack dort ist **Astro**; weitere Werkzeuge kommen je nach Bedarf dazu. design-uni ist stack-unabhängig geschrieben, die Technikbeispiele sind statisches HTML, CSS und JavaScript.

## Users

Primärer Nutzer ist der Autor selbst, ein einzelner Webdesigner, der mit Claude Code Websites und Landingpages für Kunden baut (kleine Betriebe: Handwerk, Auto, Bau, Gastro, Hotel, Gesundheit, Beauty, Handel, Manufaktur, Beratung, Recht, Finanzen). Eingesetzt wird der Skill im Kundenprojekt, wenn eine Seite entworfen, umgebaut oder beurteilt wird.

Zweiter Einsatz: die eigene Studio-Website des Autors, gebaut nach demselben Verfahren.

Nicht gebaut für: fremde Teams oder eine öffentliche Nutzerschaft; eine Veröffentlichung ist nicht entschieden.

## Product Purpose

design-uni ist ein Verfahren in elf Schritten mit Prüfpunkten P0 bis P8, das Websites auf Agentur-Niveau bauen und prüfen lässt, die zugleich Anfragen, Anrufe und Buchungen bringen. Es schützt vor zwei Fehlern, die blinde Tests wiederholt zeigten: Das Modell fällt ohne Verfahren auf seinen Standard zurück, und Selbstbewertung liegt im Mittel 1,3 Punkte über dem blinden Urteil.

Erfolg heisst: Blinde Bewerter halten die Seite für Agenturarbeit, Kunden-Agenten am Handy kommen ans Ziel (Anruf, Anfrage, Buchung, Route), und nach dem Livegang messbar mehr Anfragen (Messplan in `referenzen/conversion.md`; der Nachweis steht noch aus).

## Positioning

- **Eine grosse Entscheidung aus dem Betrieb** statt Branchenvorlage; alles andere hängt über einen «weil»-Satz daran. Gefragt wird nach Nomen, nicht nach Adjektiven.
- **Abstand zum eigenen Durchschnitt**, gemessen an acht Achsen und sieben Bauteilen gegen ein Abstandsregister der letzten eigenen Arbeiten.
- **Angebot als Inhalt, nicht als Form:** Leistung, Ort, Preis, Frist, Plan und ein Aufruf statt Badge, Countdown oder Häkchen.
- **Blind prüfen, nie selbst benoten:** sechs Bewerter auf zwei Modellfamilien, eine Fassung pro Satz, fremde Referenzen und eine Falle.
- **Kunden-Agenten am Handy** mit echten Aufgaben plus maschinelle Prüfungen (Telefon-Links, Kontrast aus der Kaskade, Verdeckung, Kalender).

## Operating Context

- Läuft in Claude Code, installiert als `.claude/skills/design-uni/` im Kundenprojekt oder global unter `~/.claude/skills/`.
- Braucht Unteragenten für Bewerter und Kunden-Agenten, idealerweise auf zwei Modellen; ohne sie hält das Verfahren nach der Richtung an und meldet «nicht gelaufen».
- Braucht einen Menschen, der freigibt: Vorschauen und Entwürfe werden gebaut, veröffentlicht und zugesagt wird nur mit Freigabe des Auftraggebers.
- Arbeitet mit Projektdateien im Kundenrepo: `entscheide.md` (Entscheide des Auftraggebers mit Quelle), `fakten.md`, Richtungsblatt, Angebotsblatt, Inventar «real · Bild · fehlt».
- Werkzeug `kunde.cjs` (Node 18+, Playwright, Chromium) simuliert Kunden-Agenten am Handy; `werkzeuge/selbsttest/` ist eine Prüfseite mit drei eingebauten Fehlern.
- **Reihenfolge der Skills:** Erst wird die Website mit design-uni (und den weiteren Skills des Autors) gebaut, bis das Verfahren durch ist: Lesen, Richtung, Angebot, Bau, Blindtest, Kunden-Agenten. Danach verfeinert Impeccable die fertige Seite (Polish, Audit, Typografie, Layout, Detektor-Hook). Impeccable kommt nie vor oder statt des Verfahrens; Richtung, Angebot und Bewertung gehören design-uni.
- Schweizer Kontext: Wenn der Betrieb in der Schweiz liegt, gelten die Hinweise in `referenzen/recht-schweiz.md` (UWG, PBV, DSG, FMG, MedBG). Keine Rechtsauskunft.
- Sprache des Skills und seiner Ausgaben: Deutsch (Schweizer Schreibweise mit «ss» und Guillemets).

## Capabilities and Constraints

Bestätigt:
- Elf Schritte mit Prüfpunkten P0 bis P8; fällt ein Prüfpunkt durch, geht es einen Schritt zurück, nie zwei vor.
- Grundregeln in jedem Schritt: keine erfundenen Fakten (Lücken bleiben als Satz sichtbar), keine Preise, Garantien oder Fristen ohne Freigabe, Entscheide des Auftraggebers gehen jeder Regel vor, Bilder nur mit Rechten, keine Kundendaten oder Schlüssel ins Repository, Selbstbewertung zählt nie.
- Gilt für Websites, Landingpages, Startseiten, erste Bildschirme. Nicht für App-Oberflächen (Dashboards, Einstellungen, Formular-Strecken in Anwendungen).
- Schwellen mit `[Annahme]` sind nicht kalibriert; Abweichungen stehen im Bericht.

Offen:
- Veröffentlichung des Skills für Dritte: nicht entschieden.
- Ob Menschen gleich urteilen wie die Modell-Bewerter: offen.
- Ob das Verfahren mehr Anfragen bringt: erst nach Livegang messbar.

## Evidence on Hand

- `skills/design-uni/referenzen/lektionen.md`: Lektionen L1 bis L11 ff. aus blinden Tests mit Zahlen (z. B. ohne Verfahren 5,83 und 6,17 von 10, mit Verfahren 6,67; bestes Bild 8,33 mit 6 von 6 «Agentur»; Material begrenzt ab etwa 6,7).
- `skills/design-uni/referenzen/branchen/`: Boden, Fototag, Vorbilder und «Nie»-Listen für fünf Branchengruppen.
- `skills/design-uni/werkzeuge/selbsttest/index.html`: Prüfseite mit erwartetem Protokoll in `referenzen/kunden-agenten.md`, Teil 2.
- Nicht vorhanden und nicht zu erfinden: Kundenlogos, Fotos, Testimonials, Preise, Referenzprojekte, Nutzerzahlen des Skills.

## Product Principles

1. Verfahren vor Freiheit: Das Modell fällt ohne Verfahren auf seinen Standard zurück, also bleibt jeder Schritt Pflicht.
2. Urteil kommt von aussen: Geschmack wird blind bewertet, Ziel-Erreichung von Kunden-Agenten geprüft, Maschinen prüfen, was Maschinen sicher finden.
3. Betrieb vor Branche: Branche ist nur Boden; Schrift, Farbe, Raster und Idee kommen aus dem konkreten Betrieb.
4. Angebot ist Inhalt: Was dasteht, entscheidet die Konversion; Form ersetzt keinen fehlenden Fakt.
5. Nichts geht ohne Freigabe nach aussen, und jede Lücke bleibt sichtbar.

## Accessibility & Inclusion

WCAG 2.2 AA ist Boden für jede gebaute Seite: Kontrast, Fokus, Tastatur, Reduced Motion, alles ohne JavaScript lesbar, Tippziele mindestens 44 × 44 px für Hauptaktionen. Schriften lokal, keine eingebetteten Karten, kein Tracking mit Cookies.
