# Messplan

text-uni Schritt 9 (M11 bis M15), design-uni conversion.md Teil 7. **Die Ausgangswerte fehlen** (nur der Betrieb hat sie); damit ist T8 formal **nicht bestanden**.

## Ziel (M11)

Mehr Schadenmeldungen und Anrufe über die Website, insbesondere von Tesla-Fällen. **Kein Zahlenziel:** Es gibt keine Ausgangswerte. `[Lücke]`

## Begriffe mit Zielseite (5 bis 10, alle `[Annahme]`)

| Begriff | Zielseite |
|---|---|
| Auto Speedy Altstätten | `/` |
| Carrosserie Altstätten | `/carrosserie.html` |
| Unfallschaden Versicherung Altstätten | `/carrosserie.html` |
| Hagelschaden Dellen drücken | `/carrosserie.html#dellen` |
| Autolackiererei Altstätten | `/lackiererei.html` |
| Alufelgen Bordsteinschaden | `/felgen-folierung.html` |
| Tesla Carrosserie Altstätten | `/tesla.html` |
| Occasionen Altstätten | `/occasionen.html` |

## Ausgangswerte (Lücke, beim Betrieb zu holen)

- Search Console: Export der letzten 16 Monate **beim Betrieb**, nicht im Repository (M12).
- Google-Unternehmensprofil: Aufrufe, Anrufe, Routen der letzten 3 Monate.
- Bisherige Zahl der Schadenmeldungen (E-Mails mit Betreff «Schadenmeldung») und Anrufe je Woche, Zahl der Tesla-Fälle.
- Bekannt ist nur: Google 4,8 bei 37 Bewertungen am 1. November 2026.

## Eigene Zählung der Anfragen nach Kanal (M14)

Jeder Link zum Anrufen, zur Route, zur E-Mail und zur Schadenmeldung trägt `data-zaehl` (`anruf`, `route`, `mail`, `anfrage`) und `data-ort` (Stelle auf der Seite). In der Vorschau ist `ZAEHL_ENDPUNKT` in `js/main.js` **leer**: nichts wird gesendet. Vor dem Livegang braucht es einen eigenen Endpunkt, der nur Art, Stelle, Seite und Datum speichert, **ohne Cookies, ohne Kennung, ohne IP**; die Datenschutzerklärung beschreibt ihn (offene Rechtsfrage FMG Art. 45c, [recht-schweiz.md](../../skills/design-uni/referenzen/recht-schweiz.md) Teil 4).

**Formulare zählt der Betrieb selbst:** Das Formular öffnet nur das E-Mail-Programm. Wie viele Meldungen wirklich ankommen, sieht nur das Postfach `info@autospeedy.ch`. Die Zahl der **begonnenen** Meldungen ist darum nicht messbar; nur Klicks auf «Schaden melden» lassen sich zählen.

## Strichliste im Betrieb (8 Wochen, nur Zahlen, keine Namen)

«Wie sind Sie auf uns gekommen?» · Website · Google-Suche · Empfehlung · Stammkundschaft · **von Tesla weitergeleitet** · Sonstiges.

## Erste Auswertung

Frühestens **8 Wochen** nach dem Livegang (M13). Drei Monate vor und nach dem Livegang vergleichen. Kleine Zahlen als «zu wenig Daten» (M3); Ursache nur nach Ausschluss von Saison (Hagel, Winterräder), Updates und Technik (M15); Zitat in KI-Antworten ist kein Klick (KQ17).

## Warnwerte `[Annahme]`

| Kennzahl | Warnwert |
|---|---|
| Anruf-Tipps je Woche | 0 bei ≥ 50 Handy-Besuchen (Link kaputt?) |
| Tipps auf «Schaden melden» | 0 in 14 Tagen bei ≥ 50 Besuchen |
| E-Mails «Schadenmeldung» | 0 in 14 Tagen trotz ≥ 10 Tipps (Mail-Programm öffnet sich nicht?) |
| Technik täglich | `tel:`-Nummer ≠ Faktenliste; Testmeldung kommt nicht an |
| Seitenaufrufe je Woche | Rückgang über 50 % |

## Technik, die täglich zu prüfen ist, bis ein Endpunkt steht

Testmeldung über das Formular an `info@autospeedy.ch` senden und ihren Eingang prüfen; die Nummer im Link ist `+41717558861`.
