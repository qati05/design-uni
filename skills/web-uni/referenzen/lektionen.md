# Lektionen aus Bau und Messung

Jede Lektion trägt ihre Herkunft. Neue Bauten ergänzen diese Datei; was sich nicht bestätigt, wird gestrichen.

| Nr. | Lektion | Herkunft |
|---|---|---|
| W1 | Derselbe Inhalt in einem React-Framework kostete im Labor +133 KB JS und rund 1 s LCP; für Seiten ohne Zustand ist das ein Verlust, kein Gewinn. | Spike `next` gegen `statisch`, messungen.md |
| W2 | Eine kleine 3D-Szene kostet nochmals 240 KB JS und 3,4 s Blockierzeit im Labor (ohne GPU). Foto zuerst schützt den LCP, nicht den Hauptthread danach. | Spike `next3d` |
| W3 | Ein Messlauf ohne Komprimierung zeigt 3 bis 4 Mal zu viel JS und verfälscht den Vergleich. Immer gzip oder Brotli. | erster Lauf der Spikes |
| W4 | Ein Wert gehört an **eine** Stelle. Öffnungszeiten, Telefon und Farben standen zeitweise im Text und im Skript; Abweichungen wurden erst durch Prüfungen sichtbar. Quelle: eine Datei, das Bauskript erzeugt den Rest. | Probe Auto Speedy, `werkzeuge/bauen.cjs`, `pruefen.cjs` |
| W5 | Prüfungen müssen **sich selbst prüfen**: Fehler einspritzen und sehen, dass die Prüfung anschlägt. Zwei der eigenen Prüfskripte hatten Fehler, die sonst grün gemeldet hätten. | `pruefung/selbsttest.txt` |
| W6 | Ein langer Fehlertext im Formular verschob den Senden-Knopf um 22 px (Layoutsprung). Kurze Texte, feste Höhe. | Probe Auto Speedy |
| W7 | Das Wort «gebaut» zählt nur mit Messung. Unterlagen, die Stacks beschreiben, ohne sie gebaut zu haben, klingen gleich sicher wie gemessene; deshalb die Kennzeichen. | dieses Repo |
| W8 | Modellurteile zu «sieht hochwertig aus» stimmen nicht mit Menschenurteilen überein; die Probe erreichte 6,33 und 6,50 gegen 7,5 verlangt und blieb ohne Menschentest offen. | `probe/autospeedy/pruefung/blindtest.md`, `recherche-menschen.md` |
| W9 | Ein Aufklappmenü entlastet die Kopfzeile, kostet aber Auffindbarkeit (Hinweis aus Studien zu versteckter Navigation: 27 gegen rund 50 Prozent Nutzung). Entscheid mit Menschentest, nicht mit Geschmack. | `recherche-menschen.md` |

## Offene Fragen (nicht entschieden)

- Wie viel der Blockierzeit der 3D-Szene bleibt auf echten Geräten?
- Ist Astro bei gleichem Inhalt so schnell wie handgeschriebenes HTML, und was kostet die Pflege?
- Lohnt eine Scroll-Animation mit reinem CSS die Mühe gegenüber keiner Bewegung (Menschentest)?
- Wie pflegt ein Betrieb ohne Entwickler diese Seite? Ein Pflegehandbuch wurde nie durchgespielt.
