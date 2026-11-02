# Drei Fassungen von Auto Speedy im blinden Vergleich

Stand 2. November 2026. Gleicher Aufbau für alle drei: erster Bildschirm Desktop 1440 × 900, **6 Bewerter je Satz** (3 Opus, 3 Sonnet, Denkstufe hoch, ohne Projektkontext, je eigene zufällige Reihenfolge), **dieselben 5 Referenzen** (Lucid, Rimac, Gschwend Garage, Hermann Zäch AG, Falle). Nur eine Fassung pro Satz (design-uni blindtest.md). Auftragstext 3.1 mit Geschwister-Frage 3.2.

| Fassung | Gebaut von | Note (Mittel) | Opus | Sonnet | «Agentur» | P4 (≥ 7,5 und ≥ 4 von 6) |
|---|---|---|---|---|---|---|
| Erste Probe, Runde 2 (`site/`) | diese Sitzung, Sonnet 5.5, mit Rückmeldungen des Auftraggebers | 6,33 | 6,33 | 6,33 | 2 von 6 | nicht bestanden |
| Nullstart-Lauf (`zero-lauf/`) | Unteragent, Sonnet 5.5, nur Eingabe und Skills | 7,33 | 7,33 | 7,33 | 5 von 6 | knapp nicht (Mittel) |
| Nullstart-Lauf (`zero-lauf-opus/`) | Unteragent, **Opus 5.5**, gleiche Eingabe und Skills | **8,00** | 8,00 | 8,00 | **6 von 6** | **bestanden** |

Referenzen über die drei Sätze: Lucid 9,00 / 8,67 / 9,00; Rimac 7,00 / 6,50 / 6,67; Gschwend 3,00 / 3,00 / 3,33; Zäch 3,17 / 3,33 / 3,00; Falle 1,00 in allen. Die Sätze sind stabil; die Unterschiede des Kandidaten liegen über dem Rauschen von ±0,5. Geschwister-Test: In keinem Satz legt ein Bewerter den Kandidaten mit einer fremden Seite zusammen.

Rohdaten: `zero-lauf/blind/`, `zero-lauf-opus/blind/`. Die Satz-«alt»-Werte stehen in `zero-lauf/BLINDTEST.md`.

## Auffällig: beide Nullstart-Läufe fanden dieselbe Idee

Sonnet und Opus wählten unabhängig denselben Titel **«Zeigen Sie uns den Schaden.»** mit einem gezeichneten Kreis um «Schaden», abgeleitet aus demselben Foto der Werkstatt (Felge mit blau eingekreistem Bordsteinschaden, `foto-06`). Geprüft: Das Protokoll des Opus-Laufs zeigt **keinen** Zugriff auf den Ordner des Sonnet-Laufs, auf `probe/autospeedy/` oder andere Dateien unter `/home/user` (nur das Arbeitsverzeichnis der Sitzung steht in den Metadaten). Die Übereinstimmung entstand aus derselben Eingabe und denselben Skills.

Was das heisst `[Annahme]`:
- **Das Verfahren ist wiederholbar**: gleiche Eingabe, gleiche Idee. Das spricht für die Skills.
- **Das Material entscheidet die Idee.** Ein einziges starkes Foto aus dem Betrieb hat in beiden Läufen alles getragen.
- **Gefahr der Gleichheit:** Zwei Betriebe mit ähnlichem Material könnten ähnliche Seiten bekommen. Dafür gibt es in design-uni das Register und die Abstandsregel gegen die letzten drei Websites; in isolierten Läufen ist das Register leer und greift nicht.

## Was sich zwischen Sonnet und Opus unterscheidet (aus den Bewertungen)

- **Opus:** kursive, kondensierte Grotesk (Mona Sans), Kreis als einziges Motiv auch im Knopf, Foto als Duoton, mehr Ruhe; Tadel: Logo pixelig, unten etwas leer.
- **Sonnet:** gerade, kondensierte Grotesk (Barlow), Kreis plus gefüllte Knöpfe mit zweitem Ring; Tadel: Logo klein, doppelt umrandete Knöpfe, leere untere Fläche.
- Ein Lauf je Modell. Ob Opus **regelmässig** besser abschneidet, ist mit je einem Lauf nicht belegt.

## Grenzen

- Nur Sprachmodelle als Bewerter, nur der erste Bildschirm am Desktop. Handy, ganze Website (P8), Bewegung (P5), Kunden-Agenten (P7) und Menschen fehlen.
- Die Skills enthalten in `design-uni/referenzen/vorbilder-gemessen.md` Teil 4 Messwerte der ersten Probe (ohne Bilder, Farben oder Texte). Beide Nullstart-Läufe konnten diese Zahlen lesen; der Opus-Lauf nennt sie in `prozess.md`.
- Die 22 Fotos sind eine Auswahl der ersten Probe.
- Beide Läufe haben offene Mängel für einen Livegang (Einwilligung zu Zitaten, Tesla-Beleg, 16 statt 30 Kundenworte, Antwortfrist).
