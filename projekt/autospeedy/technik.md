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
