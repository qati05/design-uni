# Nachtrag zum Review · Leistungen, Felgen, Google-Bewertungen

> **Update 04.11.2026, 11:30, Vorgaben von Reshat (gelten vor dem Text unten):**
> - Die Karte heisst **«Felgen»**, nicht «Alufelgen».
> - Jede der 6 Leistungskarten bekommt ein **Bild im Format 3:2**. In der Vorschau sind das Stockfotos ohne Gesichter, später Fotos aus dem Shooting (S03–S08 in `SHOOTING-LISTE.md`).
> - **Kein Felgen-Vorher/Nachher auf der Startseite.** Die Felgen-Karte verlinkt auf `/leistungen/#felgen`, und der Regler bleibt dort.
> - **Partner als Logos** in einem automatischen Band, das von links nach rechts läuft. Bei Hover und Fokus hält es an, bei `prefers-reduced-motion` steht es still. Reshat bestätigt, dass wir die Logos verwenden dürfen.
> - **2–3 echte Google-Bewertungen** kommen wörtlich auf die Startseite. Quelle und Wortlaut prüfen wir vor dem Livegang im Google-Profil selbst (siehe `WEG-ZU-10.md`).
> - Status: Boti baut die Vorschau auf Port 4392. Bauen erst nach Reshats Ja.
> - Wo der Text unten davon abweicht («Alufelgen», Regler unter den Karten, keine Bewertungen zeigen), gilt dieses Update.

Designer, 04.11.2026. Anlass: drei Wünsche von Reshat (über Boti). Geprüft habe ich `/`, `/leistungen/` und `/tesla/` sowie die Dateien `index.astro`, `Leistungen.astro`, `leistungen.astro`, `Bewertungen.astro`, `daten/bewertungen.json` und `fakten.md` (F5, F6, F7, F11, F16). Nichts ist gebaut. Ich empfehle, diesen Nachtrag **nach** dem laufenden Auftrag A+C als eigenen Auftrag zu bauen.

## Stand heute
- Die Startseite hat 4 Karten: «Unfall und Carrosserie», «Lackiererei», «Felgen und Folien» und «Hagel und Dellen». Darunter steht eine kleine Zeile: «Ausserdem: Scheiben, Rost, Oldtimer, Nutzfahrzeuge und Occasionen».
- Felgen und Folien sind zu einer Karte zusammengefasst. Der Vorher/Nachher-Regler für Felgen steht auf der Startseite ohne Verbindung zur Leistung. Auf `/leistungen/#felgen` gibt es nur Bilder und eine Lücke für den Text.
- Die alte Betriebs-Website führt **Alufelgen** und **Folierung** als zwei eigene Seiten (F16). Das stützt Reshats Wunsch.
- Der Abschnitt `Bewertungen.astro` ist schon gebaut und hängt in der Startseite. Er bleibt verborgen, solange `bewertungen.json` den Status «leer» hat. Das ist richtig so.

## 1 · Felgen als eigene Leistung (ja, sinnvoll)
- **Besucher:** Wer eine verkratzte Felge hat, sucht «Felgen», nicht «Folien». Eine gemischte Karte versteckt die Leistung, und Felgen sind ein guter Einstieg mit kleinem Auftrag und schnellem Ergebnis.
- **Soll:**
  - Die Karte «Felgen und Folien» wird in zwei Karten geteilt: **«Alufelgen»** mit dem Text «Randstein- und Kratzerschäden an Alufelgen bereiten wir wieder auf.» (das ist der heutige Text auf der Startseite) und **«Folierung»** mit dem Text «Fahrzeuge ganz oder teilweise folieren.».
  - Der Vorher/Nachher-Regler auf der Startseite wird zum Beweis der Felgen-Leistung. Er steht direkt unter den Leistungskarten, die H2 heisst «Alufelgen, vorher und nachher.», und darunter kommt ein Link «Mehr zu Alufelgen» auf `/leistungen/#felgen`.
  - Auf `/leistungen/` werden «Alufelgen» und «Folierung» zwei eigene Abschnitte mit eigener Sprungmarke (`#felgen`, `#folierung`). In der Sprungleiste stehen sie getrennt. Der Felgen-Abschnitt zeigt den Regler gross und danach «Felgenschaden melden» (Formular mit vorgewählter Kachel «Felge»).
- **Später, wenn der Betrieb den Text liefert:** eine eigene Seite `/leistungen/alufelgen/`. Dann lohnt sie sich auch für Google («Felgen aufbereiten Altstätten»). Ohne echten Text wäre sie nur eine leere Hülle.

## 2 · Alle Leistungen auf der Startseite (ja, aber gruppiert)
- **Besucher:** Die erste Frage ist «Machen die das auch?». Jede Leistung, die man sieht, beantwortet sie. Zwölf gleichwertige Karten würden aber erschlagen und den Haupt-CTA schwächen.
- **Soll:** 6 Karten, am Desktop im Raster 3 × 2 und am Handy als Liste mit Pfeil (wie heute). Jede Karte hat eine kurze Unterzeile mit den Einzelleistungen aus F5 bis F7:
  1. **Unfall und Carrosserie**: Blechschäden bis Chassisschäden, Stossstangen, Rost, Schweissarbeiten
  2. **Hagel und Dellen**: Dellendrücken, Hagelschäden
  3. **Lackiererei**: Spot-Repair bis Neulackierung, Restaurationen, Aufpolieren
  4. **Alufelgen**: Randstein- und Kratzerschäden
  5. **Folierung**: ganz oder teilweise
  6. **Scheiben**: Wechsel und Reparatur
- Die Zeile «Ausserdem» schrumpft auf «Ausserdem: Occasionen, Ankauf und Leasing», mit Link auf `/occasionen/`. Das ist Autohandel, keine Reparatur, und läuft deshalb nicht als Karte.
- **Faktenprüfung:** «Oldtimer» und «Nutzfahrzeuge» stehen heute auf der Startseite, aber nicht in `fakten.md`. Soll: weglassen, oder als Lücke an den Betrieb («Machen Sie Oldtimer und Nutzfahrzeuge?»). «Restaurationen» (F6) ist belegt.
- Unter dem Raster steht ein gefüllter CTA «Schaden melden», damit nach dem Lesen der nächste Schritt sofort da ist.
- Alle 6 Karten verlinken auf eine echte Sprungmarke auf `/leistungen/`. Dafür kommt `#scheiben` neu dazu.

## 3 · Google-Bewertungen auf der Startseite
- **Besucher:** Bei einem fremden Betrieb und viel Geld fragt man sich: «Kann ich denen trauen?». Eine echte Google-Note ist dafür der stärkste Beleg und gehört deshalb **nahe an die Entscheidung**, nicht nur ans Seitenende.
- **Jetzt (ohne Place-ID):** nichts zeigen. Keine Sterne, keine Note, keine Platzhalter-Zitate, und auch die Facebook-Note (F11) nicht, weil ihr Stand unbekannt ist. Der Abschnitt bleibt verborgen wie heute. Die Lücke geht an den Betrieb: Link zum Google-Unternehmensprofil, Place-ID und Einverständnis.
- **Später (mit Place-ID und echten Daten), an zwei Stellen:**
  1. In der **Faktenleiste unter dem Hero** kommt ein Feld «Google» dazu, mit Note, Anzahl, Sternen und Link zum Profil. So steht der Vertrauensbeweis im ersten Bildschirm neben dem Haupt-CTA.
  2. Der Abschnitt `Bewertungen.astro` rückt **vor den Inhaber-Teil**, direkt nach Tesla. Er zeigt Note, Anzahl und «Alle Bewertungen auf Google».
  - Optional zeigt er 3 kurze, echte Auszüge aus der Places API mit Name, Datum und Google-Attribution, mit Reshats Ja und gemäss Googles Regeln. Keine Karussells, und keine Auswahl nur der besten ohne Hinweis.
- Auf `/schaden-melden/` steht später eine kleine Zeile «4,x von 5 auf Google» neben «Lieber sprechen?». Das hilft gegen die Angst kurz vor dem Absenden.

## Reihenfolge Startseite danach
Hero, Faktenleiste (später mit Google), Partnerband, **6 Leistungskarten mit CTA**, **Alufelgen vorher/nachher**, Anfrage-Band, Tesla, **Google-Bewertungen (wenn Daten da sind)**, Inhaber und Team, Footer.

## Offene Fragen an den Betrieb (über Reshat)
1. Link zum Google-Unternehmensprofil (für die Place-ID)
2. Text zu Alufelgen und Folierung: Was genau, und wie lange dauert es?
3. Machen Sie auch Oldtimer und Nutzfahrzeuge?
