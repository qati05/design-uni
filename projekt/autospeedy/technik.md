# technik.md (Entwurf, web-uni WP2)

**Wahl:** Klasse B, Astro 7.4.1, statische Ausgabe, Gerüst aus `skills/web-uni/vorlage-astro`. Hoster: Cloudflare Pages als Vorschlag der Vorlage, **nichts eingerichtet, nichts live.**

**Weil-Sätze**
1. Organisation: Öffnungszeiten, Telefon und Anschrift stehen an einer Stelle (`betrieb.json`) und erscheinen überall gleich, ein Wert, kein Abgleich von Hand.
2. Funktion: Die Seite braucht keine Konten, keinen Shop, keine Buchung; Schadenmeldung geht ohne Server als E-Mail (Klasse C wäre unnötig, +133 KB JS im Spike).
3. Wunsch «hell und übersichtlich»: kein Zwang zu Bewegung oder 3D, also keine Klasse E.

**Gegenentwurf:** Der Betrieb hat heute eine **Wix**-Seite (Klasse D, `generator: Wix.com`). Wer sie pflegt, ist unbekannt (★ Pflege: Lücke). Bleibt der Betrieb bei Wix, geht das als Entscheid des Betriebs dem Hausentscheid vor; Gestaltung und Texte sind dann nur eingeschränkt umsetzbar.

**Einfachster Weg:** Klasse A, handgeschriebenes HTML. Verliert die einzelne Datenquelle und die Bauprüfungen.

**Pflege (Lücke):** Astro hat kein CMS `[nicht gebaut]`. Wer ändert die Öffnungszeiten? Ohne Antwort ist es ein Kostenpunkt (web-uni Grundregel 10).

**Kosten (Entwurf, nicht freigegeben):** nicht berechnet. Budget und Frist des Betriebs unbekannt.

**Formular:** kein Server-Endpunkt. Das Formular übergibt an das E-Mail-Programm; der Text sagt das ehrlich und behauptet kein «gesendet».

**Gemessen:** Bau mit `npm run build` (Stufe `geruest`): 0 FEHLER, 9 HINWEIS (fehlende Beschreibungen und Rechtsseiten). Lighthouse, WP5-Prüflauf, `pruefen.cjs`: **nicht gelaufen.**

## Bewegung (WP3)
GB6, GB1, GB5: Stufe 1, nur CSS (`clip-path`, `stroke-dashoffset`, Farbe), 0 KB JavaScript. Rückfall: ohne Animation steht alles offen; unter Reduced Motion aus. LCP: das Startfoto wird 900 ms lang aufgedeckt, das kann den gemessenen LCP verschieben; Lighthouse nicht gelaufen.

## Formular-Backend (WP4) · gebaut, getestet, **nicht deployt**
- `functions/api/schaden.js`: Cloudflare Pages Function, `POST /api/schaden`, JSON. Prüft Fahrzeug, Beschreibung, Name, Telefon, Stellen (Längen, Format), Herkunft (`ERLAUBTE_HERKUNFT`), Grösse (10 KB), Spamschutz mit Honigtopf «website». Speichert nichts; leitet an einen Mail-Dienst weiter (`MAIL_ENDPUNKT`, `MAIL_SCHLUESSEL`, `MAIL_AN`). Fehlt die Einrichtung, antwortet sie 503, nie «angekommen».
- Tests: `npm test`, 9 von 9 grün (Erfolg, Pflichtfelder, Honigtopf, fremde Herkunft, Format, Grösse, nicht eingerichtet, Mail-Dienst fällt aus, Telefon/Stellen) `[gebaut und gemessen · 02.11.2026]`. Ohne Netz, Mail-Dienst simuliert.
- Frontend (`public/js/schaden.js`): mit `bau.json formularEndpunkt` POST und «angekommen» nur bei 200; sonst Rapport und Übergabe an das E-Mail-Programm. Doppeltes Senden gesperrt.
- **Offen vor dem Einschalten:** Mail-Dienst wählen (Sitz Schweiz oder EU bevorzugt), Datenschutzerklärung ergänzen (text-uni CL3), Anfragekette mit dem Betrieb (wer liest, wann), Foto-Upload (braucht Speicher und Löschfrist, darum noch nicht gebaut).

## Bewegung, Ergänzung
Umlackieren: View Transitions (Stufe 2) mit CSS-Maske, `public/js/lack.js` rund 2 KB; Firefox und ältere Browser wechseln ohne Bewegung. Schadenplan-Perspektive: CSS-Transform, statisch. Kein zusätzliches JavaScript-Paket.

## Schadenmeldung «in drei Tipps» mit drei Wegen (Auftrag Studio, 02.11.2026: «alle 3 Wege, so haben alle ihre Möglichkeit»)
| Weg | Was geschieht | Stand |
|---|---|---|
| **A · Website** | `POST /api/schaden` (multipart) mit Art, Kontakt, Tesla, Stellen, Bemerkung und bis zu 6 Fotos; die Fotos verkleinert der Browser (JPEG, längste Seite 1600 px, im Test 2 Fotos = 439 KB); die Funktion hängt sie an die Mail, **speichert nichts** (kein Foto-Speicher, keine Löschfrist nötig). «Angekommen» nur bei Antwort 200. | gebaut; `npm test` 10 von 10; Ende-zu-Ende mit echter Browser-Anfrage durch die echte Funktion (`test/ende-zu-ende.mjs`): Status 200, Mail mit 2 Anhängen. **Nicht deployt.** In der Vorschau ohne Endpunkt nur vorgeführt, ehrlich beschriftet. |
| **B · WhatsApp** | öffnet `wa.me/41766154441` mit fertiger Nachricht; Fotos hängt man in WhatsApp an | gebaut; Nummer ist die Mobilnummer der Website, **WhatsApp-Nutzung nicht belegt**: sichtbare Lücke, bis der Betrieb bestätigt (`betrieb.json whatsapp.bestaetigt`) |
| **C · E-Mail** | öffnet das E-Mail-Programm mit fertiger Nachricht; Fotos dort anhängen | gebaut; auch der Weg ohne JavaScript |
Fehlerfall A: Hinweis auf WhatsApp, E-Mail und Telefon. Doppeltes Senden gesperrt.
**Vor dem Einschalten von A:** Mail-Dienst wählen (Sitz Schweiz oder EU), `MAIL_*` am Hoster setzen, `formularEndpunkt` in `bau.json`, Datenschutzerklärung ergänzen (Mail-Dienst, Fotos als Anhang), Anfragekette mit dem Betrieb.

## Änderung 02.11.2026: E-Mail-Weg entfernt (Studio)
Weg C («Per E-Mail senden») ist weg: Weg A geht ohnehin als E-Mail an den Betrieb. Es bleiben **A · Website** und **B · WhatsApp**. Ohne JavaScript bleibt das Formular über `mailto` als einziger Rückfall (sonst gäbe es ohne Skript keinen Weg). Fehlerfall A verweist auf WhatsApp und Telefon.

## Partikel-Kacheln
Zwei PNG-Kacheln, je rund 75 KB, auf jeder Seite geladen (gecacht); innerhalb des Bild-Budgets (WP5, Richtwert je Datei ≤ 200 KB). Eine kleinere Fassung (Palette, 8 Bit) ist möglich, falls Lighthouse es verlangt.
