# B1 Übergabe: Formulare direkt per Mail (Schadenmeldung prüfen, Rückruf ohne Cockpit)

Format nach `medaur/BETRIEB-DE.md`, Abschnitt «Übergabe — vor Integration».

**Task / Agent / Arbeitsordner / Ausgangsstand:** B1 · medaur-frontend (Entwickler A) · `/home/claude/design-uni`, Branch `claude/autospeedy-v2`, Basis `569b177` · keine Commits, kein Push. Die Cockpit-Änderungen im Arbeitsbaum stammen von Entwickler B, nicht von mir.

## Ergebnis

Entscheid Roni 08./09.11.2026 umgesetzt: Beide Formulare der Website gehen direkt als Mail an den Betrieb. Es gibt kein Cockpit, keine Datenbank und es wird nichts gespeichert.

1. **Schadenmeldung (`/api/schaden`):** geprüft, kein Weg ins Cockpit oder zu Supabase. Das Verhalten ist gleich geblieben. Die Schutzfunktionen habe ich unverändert nach `gemeinsam/schutz.js` verschoben, damit Rückruf dieselben nutzt. Alle bisherigen Schaden-Tests sind weiter grün.
2. **Rückruf (`POST /api/rueckruf`, neu):** Die Prüfreihenfolge ist dieselbe wie bei der Schadenmeldung: Origin → Format (multipart oder urlencoded, keine Dateien) → Grösse (32 KiB) → Honigtopf → Zeitfalle → Drossel → Prüfung. Danach geht **genau eine Mail** an `RUECKRUF_AN`, sonst an `SCHADEN_AN`, über `gemeinsam/mail.js`. Eine Bestätigung an die Kundschaft geht nur, wenn eine Mail-Adresse angegeben wurde. Kein Log mit Personendaten: Der einzige Log-Eintrag ist «rueckruf: Zeitfalle aus».
   - Prüfungen: Anliegen nur aus der Liste der Seiten (Allgemein, Occasion kaufen, Mein Auto verkaufen, Leasing, Flotte oder Firmenfahrzeuge, Garage oder Händler). Name 1–120 Zeichen, Steuerzeichen werden entfernt. Telefon braucht 9–15 Ziffern. Wunschzeiten nur aus dem Raster Montag–Freitag × Vormittag/Nachmittag, doppelte fallen weg. Nachricht höchstens 1000 Zeichen und höchstens 2 Links. Mail freiwillig, wird auf das Format geprüft.
   - Betreff ohne Namen: «Neue Rückruf-Bitte: {Anliegen}». Reply-To nur bei gültiger Kundenmail.
   - Zeitfalle wie in `BUCHUNG-DURCH-AGENTEN.md`: `GET /api/rueckruf?t=1` liefert das Token `t` mit demselben Schlüssel `FORMULAR_HMAC`. Ist es zu schnell, antwortet der Server 422 `zeit-schnell` mit `warte`, und die Seite sendet automatisch nochmals. Ein fehlendes, kaputtes oder abgelaufenes Token ergibt 422 `zeit`: Die Seite holt ein neues Token und sendet einmal nochmals. Damit ist Befund 1 aus dem Agenten-Test behoben: Rückruf scheitert nicht mehr, wenn die Zeitfalle an ist.
3. **Seite:** `rueckruf.js` sendet an `/api/rueckruf` die Felder `anliegen`, `name`, `telefon`, `zeit` (je angetipptes Feld), `bemerkung`, `email` (falls ein Feld da ist), `ort`, `website` und `t`. «Angekommen» erscheint **nur bei 200 mit `ok:true`**. Vorher galt jede Antwort mit 200 als Erfolg. Der Rückfall per `mailto:` ohne JavaScript bleibt.
   - `Rueckruf.astro` in beiden Linien: Ist ein Formular-Endpunkt gesetzt, wird `…/api/schaden` zu `…/api/rueckruf`. Jeder andere Endpunkt, etwa ein altes Cockpit unter `/api/meldung`, wird zu `/api/rueckruf` auf der eigenen Website. Ohne Endpunkt bleibt es bei der Vorführung in der Vorschau.
   - Die CSP braucht keine Änderung: Die Adresse ist relativ (`'self'`) oder hat dieselbe Herkunft wie `FORMULAR_ENDPUNKT`.

## Geänderte Dateien

| Datei | Art |
|---|---|
| `projekt/autospeedy/gemeinsam/schutz.js` | neu: `antwort`, `herkunftOk`, `tokenAntwort`, `zeitfalle`, `gedrosselt` (aus schaden.js) |
| `projekt/autospeedy/gemeinsam/rueckruf.js` | neu: `ANLIEGEN`, `ZEITEN`, `pruefeRueckruf`, Mailtexte (Text, HTML, Bestätigung) |
| `projekt/autospeedy/astro/functions/api/rueckruf.js` | neu: `onRequestGet` (Token), `onRequestPost` |
| `projekt/autospeedy/astro-klar/functions/api/rueckruf.js` | neu: re-exportiert die Funktion wie bei schaden.js |
| `projekt/autospeedy/astro/functions/api/schaden.js` | Schutzfunktionen kommen aus schutz.js, Verhalten gleich |
| `projekt/autospeedy/astro/public/js/rueckruf.js` | Felder einzeln, Erfolg nur bei `ok:true` (astro-klar kopiert die Datei beim Bau über `bau/teilen.mjs`) |
| `projekt/autospeedy/astro/src/components/Rueckruf.astro` | Endpunkt `/api/rueckruf`, Kommentar ohne Cockpit |
| `projekt/autospeedy/astro-klar/src/components/Rueckruf.astro` | dasselbe |
| `projekt/autospeedy/astro/test/rueckruf.test.mjs` | neu: 17 Tests der Funktion |
| `projekt/autospeedy/astro/test/schaden.test.mjs` | 1 Import-Zeile, damit rueckruf.test.mjs in `npm test` mitläuft |
| `projekt/autospeedy/astro-klar/test/rueckruf.test.mjs` | neu: 5 Browser-Tests gegen die echte Funktion, Versand gemockt |
| `projekt/autospeedy/astro-klar/test/formular.test.mjs` | 1 Import-Zeile, damit rueckruf.test.mjs in `npm test` mitläuft |

**Schnittstelle:** `POST /api/rueckruf` (multipart/form-data oder x-www-form-urlencoded)

- 200 `{ok:true}`: Mail ist beim Betrieb. Ist der Honigtopf gefüllt, kommt dieselbe Antwort, aber es wird nichts gesendet.
- 403 `herkunft` · 415/400 `format` · 413 `groesse` · 422 `zeit-schnell` (+`warte`) / `zeit` / Feldnamen · 429 `drossel` · 502 `senden`.
- Jede Fehlerantwort enthält `telefon`.

`GET /api/rueckruf?t=1` liefert `{t}`.

**Neue Abhängigkeiten:** keine. **Assets:** keine.

**Neue oder geänderte Umgebungsvariablen (Cloudflare Pages):**

- `RUECKRUF_AN` (neu, freiwillig): Empfänger der Rückruf-Bitten. Fehlt sie, gilt `SCHADEN_AN`.
- Unverändert genutzt: `SCHADEN_AN`, `MAIL_ABSENDER`, `MAIL_ABSENDER_NAME`, `EMAIL` (send_email-Binding), `BREVO_SCHLUESSEL`, `MAIL_WEG_BETRIEB`, `MAIL_WEG_KUNDE`, `ERLAUBTE_HERKUNFT`, `FORMULAR_HMAC`, `DROSSEL`.
- Beim Bau: `FORMULAR_ENDPUNKT`. Ist sie gesetzt, bekommt Rückruf automatisch `/api/rueckruf`. Eine eigene Variable für den Rückruf-Endpunkt gibt es bewusst nicht.
- **Achtung:** Die Empfänger-Adresse (`RUECKRUF_AN` oder `SCHADEN_AN`) muss im Cloudflare-Email-Routing als Zieladresse bestätigt sein, sonst schlägt der Versand fehl (502).

## Ausgeführte Prüfungen

| Befehl | vorher (569b177) | nachher |
|---|---|---|
| `cd projekt/autospeedy/astro && npm test` | 36/36 grün | 53/53 grün (+17 Rückruf) |
| `cd projekt/autospeedy/astro-klar && npm run build && CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome npm test` | 133/133 grün | 138/138 grün (+5 Rückruf im Browser) |
| `FORMULAR_ENDPUNKT=/api/schaden npx astro build --outDir <scratch>` (astro-klar) | – | Rückruf `data-endpunkt="/api/rueckruf"`, Schaden `"/api/schaden"` |
| `FORMULAR_ENDPUNKT=http://localhost:8788/api/meldung npx astro build --outDir <scratch>` | – | Rückruf `"/api/rueckruf"`, also nicht ins Cockpit |

Vorher: `npm ci` in `gemeinsam`, `astro-klar` und `astro`. Ohne Build und ohne `CHROME` schlägt `npm test` in astro-klar schon auf der Basis fehl (18 rot, weil `dist/` und Chrome fehlen). Das ist kein Befund dieser Änderung.

Abgedeckt (Versand immer gemockt, ein Fetch-Stub lässt jeden fremden Netzaufruf scheitern, kein Kontakt zu Brevo oder Cloudflare):

- gültig → genau 1 Mail
- `RUECKRUF_AN` geht vor `SCHADEN_AN`
- Bestätigung nur mit Mail-Adresse, ohne den Text der Nachricht
- Bestätigung scheitert → trotzdem 200
- Versand an den Betrieb scheitert oder kein Empfänger → 502
- Telefon zu kurz → 422
- Name, Anliegen, Zeit ausserhalb des Rasters, Links, Mail → 422
- Honigtopf → 200 ohne Mail
- falscher oder fehlender Origin → 403
- 415, 413, Datei im Formular → 422
- urlencoded geht
- Drossel → 429
- Zeitfalle: zu schnell → 422 mit `warte`; kaputt, fehlend oder älter als 2 h → 422 `zeit`; gültig → 200
- ein Token von `/api/schaden` gilt auch für `/api/rueckruf`

Browser-Tests (Linie Klar, CSP aus `_headers`, echte Funktion):

- Kontakt, sofort gesendet bei eingeschalteter Zeitfalle: automatischer Neuversand, «Angekommen» mit Wunschzeit, genau 1 Mail mit Anliegen, Zeit, Nachricht und Formular
- Flotten: das gewählte Anliegen geht mit
- Telefon zu kurz: kein Request
- Server antwortet 200 ohne `ok:true` oder 502: kein «Angekommen», Knopf bleibt aktiv

**Belege:** Die Testprotokolle liegen im Scratchpad dieser Sitzung (`test-vorher.txt`, `test-nachher.txt`). Für die Abnahme bitte selbst neu laufen lassen.

## Nicht geprüft / offene Risiken

- Kein echter Versand: Cloudflare Email und Brevo laufen nur als Attrappe. Das gilt auch für echtes Turnstile: `cf-turnstile-response` wird mitgeschickt, aber wie bei der Schadenmeldung **serverseitig nicht geprüft**.
- Die Linie «Lack» (`astro/`) wurde nicht im Browser getestet, nur die Funktion. Ihr Rückruf-Formular hat weder Nachricht noch Zeitwahl. Das passt zur Funktion, beides ist freiwillig.
- Neue Anliegen auf einer Seite müssen auch in `gemeinsam/rueckruf.js` → `ANLIEGEN` stehen, sonst antwortet der Server 422 `anliegen` und die Seite zeigt «Das hat nicht geklappt». Ändert sich das Zeitwahl-Raster in `astro-klar/src/components/Rueckruf.astro`, muss `ZEITEN` mitgehen.
- Bei 422 für ein Feld zeigt `rueckruf.js` nur den allgemeinen Hinweis «Das hat nicht geklappt, bitte anrufen». Name und Telefon prüft schon die Seite, darum ist das nur bei manipulierten Anfragen relevant.
- `/api/schaden` nimmt die Art «Rückruf» weiter an (`ARTEN` in `gemeinsam/meldung.ts`). Ich habe das unverändert gelassen, um nichts zu brechen. Die Website nutzt diesen Weg nicht mehr.
- `astro/functions/api/zaehl.js` schreibt weiterhin in Supabase. Das ist ein Zähler, kein Formular, und er ist laut Kommentar nicht deployt. Er steht im Widerspruch zu «keine Datenbank», falls das für die ganze Website gilt.
- Veraltete Hinweise ausserhalb meines Schreibbereichs:
  - `astro/src/pages/schaden-melden.astro` (Kommentar «z. B. für das lokale Cockpit»)
  - `astro/src/content/bau.json` `_formular` (nennt `MAIL_ENDPUNKT`)
  - `astro/test/ende-zu-ende.mjs` (alte Variablen `MAIL_ENDPUNKT`/`MAIL_AN`, nicht in `npm test`)
  - `vorschau-bau/demo.js` (Cockpit-Demo)

## Übergabe-Wünsche an den Lead (Dateien ausserhalb B1)

1. `astro/package.json` und `astro-klar/package.json`: `test/rueckruf.test.mjs` direkt in das `test`-Skript aufnehmen. Danach die Import-Zeilen in `schaden.test.mjs` und `formular.test.mjs` entfernen.
2. `projekt/autospeedy/technik.md` oder `astro/README.md`: `RUECKRUF_AN` und `/api/rueckruf` dokumentieren.
3. Kommentare oder Hinweise wie oben bei «Veraltete Hinweise» bereinigen. Über `zaehl.js` (Supabase) entscheiden.

**Integrationshinweis:** lokale Dateien im Arbeitsbaum von `claude/autospeedy-v2`, nicht committet. Bitte nur die zwölf Pfade oben übernehmen. `astro-klar/public/js/rueckruf.js` und `dist/` sind Bau-Ausgaben.

**Bereit für unabhängige Abnahme:** ja. Alle Tests sind grün, auch die bisherigen. Die Grenzen liegen beim echten Versand und bei Turnstile, siehe oben.
