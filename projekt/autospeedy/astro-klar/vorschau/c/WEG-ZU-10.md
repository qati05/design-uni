# Weg zu 10/10 · Autospeedy Entwurf C

Designer, 04.11.2026. Grundlage:
- der live-Stand auf :4391 (die A+C-Korrektur läuft noch),
- die Vorschau v2 auf :4392 mit Leistungskarten, Partnerband und Bewertungen,
- das `REVIEW-FINAL.md`.

Die Noten sind ehrlich und messen den Vergleich mit einer sehr guten Seite eines Schweizer Kleinbetriebs, nicht mit einem Konzern.

## Note heute

| Bereich | Note | Warum nicht 10 |
|---|---|---|
| Hero | 7 | Text und CTAs sind stark. Aber das Foto ist Stock, und die Kopfleiste verdeckt am Handy die H1 (A1, wird korrigiert). |
| Leistungen (v2) | 7 | Die Struktur ist richtig: 6 Karten plus CTA. Die Stockbilder passen aber nicht zusammen: Bei «Lack» ist der Hintergrund grün, bei «Felgen» steht ein Lagerregal statt einer Reparatur, bei «Folierung» ist ein BMW-Logo gross im Bild. Für Felgen und Folierung fehlen echte Texte. |
| Vertrauen / Bewertungen (v2) | 6 | Die 3 Bewertungen sind echt, aber aus einer Drittquelle (exa.ai), ohne Namen («Name folgt»), und die Anzahl schwankt je nach Quelle zwischen 33 und 36. Es fehlen das Gesicht des Inhabers, sein Zitat und das Teamfoto. |
| Partner (v2) | 7 | Die Logos laufen ruhig. Das Tesla-Logo ist optisch viel schwerer als die anderen. «Land Rover» ist nur Text. |
| Tesla | 5 | Der Hero wirkt mit Raster, Pill und Glow wie eine Vorlage. Es gibt kein echtes Foto und keinen CTA am Ende. Interne Notizen und der versprochene Rückruf (A3/A4) werden korrigiert. |
| Formular | 8.5 | 3 Schritte, grosse Kacheln und «Lieber sprechen?» funktionieren. Es fehlt eine Aussage, wann sich der Betrieb meldet. |
| Footer | 8.5 | Live-Status, Wochenzeiten und Slogan sind stark. Die Tippziele sind zu klein (A2, wird korrigiert). |
| Handy | 7 | Die Reihenfolge stimmt, die Anrufleiste ist da. Abzug für die Kopfleiste und die Tippziele. Ein Test auf einem echten Gerät fehlt noch. |
| Tempo / SEO | 6 | Am Handy liegt der LCP bei 3.3 s, Meta-Descriptions und `favicon.ico` fehlen, und `noindex` ist für die Vorschau gewollt. Das JSON-LD mit den Öffnungszeiten ist vorhanden. |
| **Gesamt** | **7** | Die Bauweise ist auf 9er-Niveau. Was zur 10 fehlt, ist vor allem Echtheit: Fotos, Gesichter und Antworten des Betriebs. |

## Was zur 10/10 fehlt (nach Wirkung sortiert)

| # | Punkt | Wirkung | Wer liefert |
|---|---|---|---|
| 1 | **Echte Fotos nach `SHOOTING-LISTE.md`**: Hero, 6 Leistungen, Tesla, Felgen vorher/nachher, Fassade. Das hebt jeden Bereich um 1–2 Punkte und besteht den Logo-Tausch-Test. | sehr hoch | Shooting (Reshat und Bruder) |
| 2 | **Inhaber mit Gesicht und eigenem Satz, dazu das Teamfoto.** Die Leute kaufen bei Menschen, und bei einem 10-Leute-Betrieb ist das der stärkste Unterschied zu einer Kette. | sehr hoch | Betrieb (Satz und Einwilligung), Shooting |
| 3 | **Fehler A1–A5 korrigiert**: Kopfleiste, Tippziele, interne Notizen, Rückruf, Footer auf dem Formular. | hoch | Claude (läuft) |
| 4 | **Bewertungen sauber belegen** (Details unten): Wortlaut und Datum im Google-Profil selbst prüfen, Namen so wie auf Google, eine einzige Zahl mit Stand-Datum, Link auf das Profil. Später über die Place-ID automatisch. | hoch | Betrieb (Profil-Link), wir (Prüfung), Claude (Einbau) |
| 5 | **Antwortversprechen** im Formular und auf der Erfolgsseite, zum Beispiel «Wir melden uns am gleichen Arbeitstag». Nur wenn der Betrieb das so hält. Das ist die grösste offene Angst der Persona Unfallfahrerin. | hoch | Betrieb (Zusage), Claude |
| 6 | **Kurze Fragen und Antworten** (4–5 Stück) auf der Startseite oder auf `/schaden-melden/`: «Wer zahlt?», «Was kostet ein Kostenvoranschlag?», «Wie lange dauert es?», «Bekomme ich einen Ersatzwagen?» (auf Anfrage), «Muss ich zuerst zur Versicherung?». | hoch | Betrieb (Antworten), wir (Text), Claude |
| 7 | **Tesla-Seite neu fassen**: ein ruhiger Hero mit echtem Tesla-Foto (S07), die Tesla-Leistungen laut Betrieb und ein CTA am Ende (C14). | mittel-hoch | Shooting, Betrieb, Claude |
| 8 | **Tempo und SEO**: LCP unter 2.5 s mit dem echten Hero (AVIF, etwa 800 px am Handy), Meta-Description pro Seite, Favicon, Apple-Touch-Icon und ein OG-Bild (S20). | mittel | Claude |
| 9 | **Texte zu Felgen, Folierung und Scheiben**: Was genau wird gemacht, und wie lange dauert es? Ohne diese Texte bleiben es Karten ohne Inhalt. | mittel | Betrieb |
| 10 | **Partnerband**: Die Logos werden optisch gleich gross (gleiche Höhe der Grossbuchstaben, Tesla kleiner). Für «Land Rover» braucht es ein echtes Logo oder eine einheitliche Wortmarke. | mittel | Claude |
| 11 | **Feinschliff C13–C23**: Kopfleiste milchig, Fotos sanft einblenden, Eyebrow weg, «heute» im Footer. | mittel | Claude |
| 12 | **Test auf echten Geräten** (iPhone und ein älteres Android): Daumen, Sonnenlicht, langsames Netz. Dazu eine Bildschirmaufnahme. | mittel | wir |
| 13 | **Bis zum Shooting Stockbilder vereinheitlichen**: gleiche Lichtrichtung, gleiche Entsättigung, kein Grün, kein gross sichtbares Markenlogo. Ersetzen sollen wir das Lack-Bild (grüner Grund) und das Felgen-Bild (Regal). | niedrig, aber sofort | wir und Claude |
| 14 | **Nach dem Livegang**: Anrufe, Formulare und Routenklicks messen. Nach 4–8 Wochen eine Verbesserung. Google-Profil mit denselben Fotos pflegen. | später | wir |

## Zu den Google-Bewertungen (wichtig)
- Die Zitate stammen aus einer öffentlichen **Kopie** der Google-Rezensionen und nicht aus Google selbst. Vor dem Livegang braucht es deshalb vier Dinge:
  1. Den Wortlaut, das Datum und die Sterne im Google-Profil selbst prüfen, im Browser oder mit dem Betrieb am Handy.
  2. Den Namen so übernehmen, wie Google ihn zeigt, zum Beispiel «Marco R.». «Name folgt» darf nicht live gehen.
  3. Eine einzige Zahl mit Stand-Datum zeigen, zum Beispiel «4,8 von 5 · 33 Bewertungen · Stand Nov. 2026».
  4. Unter den Bewertungen einen Link «Alle Bewertungen auf Google» setzen.
- Bewertung 2 («immer top zufrieden … Absolut empfehlenswert!») klingt allgemein. Besser ist eine Bewertung, die eine konkrete Leistung nennt, zum Beispiel Versicherungsabwicklung, Hagel oder Tesla. Das beantwortet Ängste.
- Später läuft das automatisch: Mit der Place-ID füllt `bau/bewertungen.mjs` die Note und die Anzahl selbst.
