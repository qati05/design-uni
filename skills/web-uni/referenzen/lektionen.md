# Lektionen aus Bau und Messung

Jede Lektion trägt ihre Herkunft. Neue Bauten ergänzen diese Datei; was sich nicht bestätigt, wird gestrichen. Kennung **WL** (zusammenspiel Teil 5). WL1 bis WL12 bleiben als Tabelle (Altbestand). Neue Lektionen im Format von design-uni ([lektionen.md](../../design-uni/referenzen/lektionen.md), «Format für neue Lektionen») als Abschnitt `### WL13 …` unter der Tabelle, mit Kennung WL statt DL.

| Nr. | Lektion | Herkunft |
|---|---|---|
| WL1 | Derselbe Inhalt in einem React-Framework kostete im Labor +133 KB JS und rund 1 s LCP; für Seiten ohne Zustand ist das ein Verlust, kein Gewinn. | Spike `next` gegen `statisch`, messungen.md |
| WL2 | Eine kleine 3D-Szene kostet nochmals 240 KB JS und 3,4 s Blockierzeit im Labor (ohne GPU). Foto zuerst schützt den LCP, nicht den Hauptthread danach. | Spike `next3d` |
| WL3 | Ein Messlauf ohne Komprimierung zeigt 3 bis 4 Mal zu viel JS und verfälscht den Vergleich. Immer gzip oder Brotli. | erster Lauf der Spikes |
| WL4 | Ein Wert gehört an **eine** Stelle. Öffnungszeiten, Telefon und Farben standen zeitweise im Text und im Skript; Abweichungen wurden erst durch Prüfungen sichtbar. Quelle: eine Datei, das Bauskript erzeugt den Rest. | frühere Probe, (frühere Probe, nicht in diesem Repo), `skills/design-uni/werkzeuge/pruefen.cjs` |
| WL5 | Prüfungen müssen **sich selbst prüfen**: Fehler einspritzen und sehen, dass die Prüfung anschlägt. Zwei der eigenen Prüfskripte hatten Fehler, die sonst grün gemeldet hätten. | `pruefung/selbsttest.txt` |
| WL6 | Ein langer Fehlertext im Formular verschob den Senden-Knopf um 22 px (Layoutsprung). Kurze Texte, feste Höhe. | frühere Probe |
| WL7 | Das Wort «gebaut» zählt nur mit Messung. Unterlagen, die Stacks beschreiben, ohne sie gebaut zu haben, klingen gleich sicher wie gemessene; deshalb die Kennzeichen. | dieses Repo |
| WL8 | Modellurteile zu «sieht hochwertig aus» stimmen nicht mit Menschenurteilen überein; die Probe erreichte 6,33 und 6,50 gegen 7,5 verlangt und blieb ohne Menschentest offen. | (frühere Probe, nicht in diesem Repo), `recherche-menschen.md` |
| WL9 | Ein Aufklappmenü entlastet die Kopfzeile, kostet aber Auffindbarkeit (Hinweis aus Studien zu versteckter Navigation: 27 gegen rund 50 Prozent Nutzung). Entscheid mit Menschentest, nicht mit Geschmack. | `recherche-menschen.md` |
| WL10 | Millisekunden sind kein Ziel. Über der Schwelle «gut» ist kein zusätzlicher Anfragegewinn belegt; die Anfragekette (wer antwortet, wie schnell, Bewertungen, Google-Profil) ist der grössere Hebel. In der frühere Probe waren 37 Google-Bewertungen unbeantwortet, das kostet nichts an Ladezeit. | Rückmeldung des Studios, (frühere Probe, nicht in diesem Repo), `branchenwerte.md` |
| WL11 | Astro 7.4.4 verlangt Node 22.23.4 oder neuer; im Container lief Node 22.22.0, und `astro build` brach vor dem Bau ab. Die Vorlage wurde am 02.11.2026 über die Programmschnittstelle von Astro (`build()`) gebaut. Version von Node vor dem Bau prüfen und in `package.json` (`engines`) festhalten. | Bau der Vorlage, 02.11.2026 |
| WL12 | Die Mindestversion von Node stieg innerhalb von Astro 7.4 von 22.22.0 (7.4.1) auf 22.23.4 (7.4.2), in einem Patch. Die Vorlage pinnt deshalb eine genaue Version (7.4.1), die zur Umgebung passt, statt «neueste»; sie baut so in der Cloud-Umgebung mit Node 22.22.0 direkt mit `npm install && npm run build`. Heben, sobald die Umgebung neuer ist. | npm-Registry und Bau der Vorlage, 02.11.2026 |

## Offene Fragen (nicht entschieden)

- Wie viel der Blockierzeit der 3D-Szene bleibt auf echten Geräten?
- Was kostet und bringt die Pflege mit Astro? Gleich schnell wie handgeschriebenes HTML ist es bei statischer Ausgabe (messungen.md); die Pflege durch Laien ist nicht erprobt.
- Lohnt eine Scroll-Animation mit reinem CSS die Mühe gegenüber keiner Bewegung (Menschentest)?
- Wie pflegt ein Betrieb ohne Entwickler diese Seite? Ein Pflegehandbuch wurde nie durchgespielt.
