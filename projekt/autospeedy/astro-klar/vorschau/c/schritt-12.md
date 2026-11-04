# Schritt 12 — Bericht (Linie «Klar», Entwurf C)

Formular, Spam-Schutz und Versand per Mail — ohne Datenbank, ohne Cockpit (Entscheide Reshat 03.11.).
Alles ungestaged; der Commit macht der Bauleiter.

## 1. Was geändert wurde

### Versand und Prüfung (Server)
- **`gemeinsam/mail.js` (neu)** — `sende({ an, betreff, text, html, antwortAn, anhaenge }, env, weg)` mit zwei
  Adaptern: **cloudflare** über das `send_email`-Binding `env.EMAIL.send` (baut eine RFC-5322-MIME-Nachricht,
  Anhänge base64, Gesamtgrösse < 25 MiB wird geprüft) und **brevo** über die HTTPS-API mit `env.BREVO_SCHLUESSEL`.
  Fehlt die Konfiguration oder scheitert der Versand → Fehler **ohne Schlüssel im Text**. `weg` kann explizit gesetzt
  werden, sonst gilt `env.MAIL_WEG`.
- **`gemeinsam/jpeg.js` (neu)** — `istJpeg` (Magic Bytes FF D8 FF) und `ohneMetadaten` entfernt die Segmente
  **APP1 (EXIF inkl. GPS)** und **APP13 (IPTC/Photoshop)** durch Parsen der Segmentkette; die Bilddaten ab SOS
  bleiben unverändert (kein Neu-Kodieren).
- **`gemeinsam/meldung.ts`** — Pflicht nur noch **Art, Name, Telefon**. Neue freiwillige Felder: Ersatzwagen
  (`ersatzwagen`, `ersatzwagen_tesla`), «zur Hand» (`kontrollschild`, `versicherung`, `schadennummer`, Foto
  `ausweis`). Nur Länge und Format werden geprüft, nie Pflicht. **Bemerkung mit mehr als 2 Links → 422.** Betreff
  «Neue Schadenmeldung» + Art (+ Tesla) (+ «· Ersatzwagen»), ohne Namen. Mail-Text mit allen Feldern **escaped**
  (Text säubert Steuerzeichen; zusätzlich eine HTML-Fassung `mailVollHtml` mit `<>&`-Escaping), oben «Liegt vor: …,
  Fehlt: …» und bei Wunsch «Ersatzwagen gewünscht (, Tesla wenn möglich)». (`hinweisText` bleibt nur noch als
  Kompatibilität für die eingefrorene Cockpit-Demo, nicht mehr auf der Website verwendet.)
- **`astro/functions/api/schaden.js` (neu geschrieben)** — Supabase-Speicherung und Rollback **vollständig entfernt**.
  Prüfreihenfolge nach BAUPLAN 4.3: **Origin → multipart → 16e6 → Honigtopf → Zeitfalle → Drossel → pruefe → Fotos →
  Mail**. Danach **genau eine Mail** an `SCHADEN_AN` über `gemeinsam/mail.js` (Betrieb-Weg `MAIL_WEG_BETRIEB`,
  Vorgabe cloudflare): Betreff + Text (escaped) + HTML, Fotos als Anhänge `foto-1.jpg …`, Fahrzeugausweis als
  `fahrzeugausweis.jpg`, **Reply-To nur bei gültiger Kundenmail**. Optionale Bestätigung an die Kundschaft
  (`MAIL_WEG_KUNDE`, Vorgabe brevo; neutral, ohne Fotos; Scheitern ist nicht kritisch). Versandfehler → **502 mit
  Telefonnummer**. Kein Speichern, kein Log mit Personendaten, kein Schlüssel im Log.
  - **Zeitfalle:** `GET /api/schaden?t=1` liefert ein HMAC-SHA256-Token (`FORMULAR_HMAC`) über den Zeitstempel;
    das Formular sendet es als Feld `t`. **< 4 s still 200**, **> 2 h → 422 «Bitte Seite neu laden»**, kaputtes
    Token → 422. Ohne `FORMULAR_HMAC` ist die Falle aus (Log-Hinweis **ohne Daten**).
  - **Drossel ohne Datenbank:** `env.DROSSEL.limit({ key })` mit Schlüssel = **SHA-256 der IP** aus
    `CF-Connecting-IP` (nicht gespeichert). Kein Binding → übersprungen. Abgewiesen → **429 mit Telefonnummer**.
- **`astro/bau/dateien.mjs` (`cspZeile`)** — `challenges.cloudflare.com` kommt **nur noch mit `TURNSTILE_SITEKEY`**
  in die CSP (sonst gar nicht); `frame-src` fällt dann auf `'none'`. Turnstile bleibt serverseitig aus.

### Formular (Browser)
- **`astro/public/js/schaden.js` (neu geschrieben, geteilt mit beiden Linien, DOM defensiv)** — Rückmeldung nach
  3.13: Schrittwechsel mit Fokus auf die Schritt-Überschrift, Fortschrittstext «Schritt n von 3», Foto-Vorschau
  («Foto wird vorbereitet …»). Fehler **ohne Schütteln** mit `aria-invalid`, `aria-describedby`, Feldtext und
  Sammelhinweis `role="alert"`, Fokus aufs erste fehlerhafte Feld. Senden über **XMLHttpRequest** mit
  `upload.onprogress` (echter Balken, sonst unbestimmt), Knopf `disabled` + `aria-busy`. Erfolg mit gezeichnetem
  Häkchen und Fokus auf die Meldung. Sendefehler mit **«Nochmals senden»** + Telefonnummer, Eingaben bleiben
  erhalten. Zeitfalle-Token wird per GET geholt. Ersatzwagen-Logik, «zur Hand»-Felder und Fahrzeugausweis (max. 1,
  zählt nicht zu den 6). Der `noscript`-Weg (mailto) bleibt.
- **`astro-klar/src/pages/schaden-melden.astro`** — neue Felder und Zustände: Ersatzwagen-Schalter nahe bei
  Name/Telefon mit Unterfrage «Wenn möglich einen Tesla» (nur bei Haken), `<details>` «Haben Sie es zur Hand?
  (freiwillig)» mit Kontrollschild, Versicherung (Textfeld mit Vorschlagsliste), Schadennummer, Foto vom
  Fahrzeugausweis. Fortschrittstext, Sendebalken, Erfolgs-Häkchen als SVG, Ausweis-Hinweis mit WhatsApp-Weg,
  verstecktes Feld `t`. Einleitung erwähnt «Ersatzwagen auf Anfrage».

### Tests und Screenshots
- **`astro/test/schaden.test.mjs` (neu)** — ohne Supabase; Mail-Adapter als Attrappe (Cloudflare-Binding und
  Brevo-fetch). Prüft Reihenfolge, Honigtopf, Zeitfalle, Drossel, EXIF-Entfernung, Reply-To, Ersatzwagen, «Liegt
  vor/Fehlt», 502 mit Telefon, Bestätigung ohne Inhalt.
- **`astro/test/jpeg.test.mjs`, `astro/test/mail.test.mjs` (neu)**, Fixture-Erzeuger
  **`astro/test/fixtures/exif.mjs`** (schreibt `exif-gps.jpg` mit APP1/GPS und APP13/IPTC selbst).
- **`astro-klar/test/formular.test.mjs` (neu)** — Browser-Test: Schrittwechsel + Fokus, Fehler pro Feld
  (aria-invalid + role=alert, keine Animation = kein Schütteln), Ersatzwagen + `?tesla=1`-Vorbelegung, lange
  Eingaben laufen nicht aus dem Feld/der Erfolgsmeldung.
- **`astro-klar/bau/schnappschuss-formular.mjs` (neu)** — erzeugt die Screenshots unten.

## 2. Feinschliff (NACHTRAG 22:13) — gefundene und behobene Stellen
1. **Hover nur in `@media (hover: hover)`** — 17 bisher freistehende `:hover`-Regeln umschlossen (Knöpfe `.k`/
   `.knopf`, Kopf-Nav, Chips, `.art`, `.fotos__knopf`, Partnerband-Karte, Vergleich-Griff, Kacheln, Kontakt,
   Fuss, Sprungleiste, Tesla-Bühne/-Liste, Leute). Nur die zwei Regeln, die Hover **und** `:focus(-within/-visible)`
   kombinieren (Partnerband-Pause, Vergleich-Griff), bleiben bewusst offen, damit der Tastatur-Fokus überall greift.
   Jeder Knopf/Link-Knopf hat `:active { transform: scale(.97) }` und einen deutlichen `:focus-visible`-Ring.
2. **Interaktionen als `transition`** — `box-shadow` und `filter` aus allen Knopf-Transitionen entfernt (nur noch
   Farbe und `transform`, 150–180 ms ease-out). Das `@keyframes wahl` (Art-Auswahl) entfernt, Auswahl ist jetzt ein
   reiner Farbwechsel. Der Schrittwechsel ist der dokumentierte Eintritt nach 3.13 (opacity + translateX(12px),
   240 ms `--aus`). `prefers-reduced-motion`: globaler `transition/animation: none`, Erfolgs-Häkchen sofort voll.
3. **Kein Fade-up je Sektion** — war bereits entfernt (BAUPLAN 3.15); kontrolliert, nichts Neues hinzugekommen.
4. **Eingabefelder ≥ 16 px** — Regel für `input/select/textarea` im Formular ergänzt (gegen iOS-Zoom).
5. **Schadenformular, alle Zustände sichtbar und gestaltet** — Ruhe, Fehler pro Feld (rote Umrandung + Text +
   `aria-invalid`), Senden/lädt (Knopf disabled, `aria-busy`, Balken, «Wird gesendet …»), Serverfehler (Meldung mit
   Telefonnummer, «Nochmals senden»), Erfolg (Häkchen, Fokus). Mit sehr langem Namen und langer Mail geprüft:
   nichts läuft aus dem Feld oder aus der Erfolgsmeldung (Test + Screenshots).

Screenshots (Handy 390): `12-formular-ruhe.png`, `12-formular-fehler.png`, `12-formular-laedt.png`,
`12-formular-serverfehler.png`, `12-formular-erfolg.png`, `12-formular-ersatzwagen.png`.

## 3. Umgebungsvariablen und Bindings (ohne Werte)
- `SCHADEN_AN` — Empfänger der Schadenmeldung (eigene, verifizierte Adresse)
- `MAIL_WEG_BETRIEB` — `cloudflare` (Vorgabe) | `brevo`
- `MAIL_WEG_KUNDE` — `brevo` (Vorgabe) | `cloudflare`
- `EMAIL` — Cloudflare `send_email`-Binding (Betrieb-Mail, gratis)
- `BREVO_SCHLUESSEL` — Brevo-API-Schlüssel (Kundschaft-Mails)
- `FORMULAR_HMAC` — Schlüssel der Zeitfalle (fehlt er, ist die Falle aus)
- `DROSSEL` — Workers-Rate-Limiting-Binding (fehlt es, wird die Drossel übersprungen)
- `TURNSTILE_SITEKEY` — nur gesetzt, wenn Turnstile genutzt wird; bringt `challenges.cloudflare.com` in die CSP
- weiter wie gehabt: `MAIL_ABSENDER`, `MAIL_ABSENDER_NAME`, `ERLAUBTE_HERKUNFT`, `FORMULAR_ENDPUNKT`

### Cloudflare-Rate-Limiting-Regel für `POST /api/schaden` (Doku)
Im Cloudflare-Konto von Auto Speedy eine Rate-Limiting-Regel anlegen: **Match** `http.request.method eq "POST" and
http.request.uri.path eq "/api/schaden"`, **Characteristics** IP-Adresse, **Rate** z. B. 5 Anfragen in 10 Minuten,
**Action** Block (oder Managed Challenge). Zusätzlich das Workers-Rate-Limiting-Binding `DROSSEL` in der Function
(Schlüssel = SHA-256 der IP, nicht gespeichert). Beides ist unabhängig; fehlt das Binding, bleibt die
Cloudflare-Regel als Schutz.

## 4. Prüfungen (alle grün)
- `astro` (Function): `npm test` → **36 Tests grün** (schaden, jpeg, mail, zaehl, site).
- `astro-klar`: `npm test` → **51 Tests grün** (validierung, statisch, bewertungen, schluss, browser, formular).
- `npm run build` (astro-klar) baut durch; CSP ohne `unsafe-inline`/`unsafe-eval` bei Skripten, ohne
  `challenges.cloudflare.com` (kein Sitekey), kein Inline-Skript, keine `on…`-Attribute, kein Eszett.

## 5. Offene Punkte
- `designer-wissen/15-galerien.md` und `16-x-designer.md` liegen ausserhalb des Worktrees und waren im Sandkasten
  nicht lesbar; der Feinschliff wurde nach den im Auftrag aufgezählten Punkten 1–5 umgesetzt.
- Die erste Linie `astro/src/pages/schaden-melden.astro` wurde bewusst nicht umgebaut (Entwurf C = `astro-klar`);
  die geteilte `schaden.js` bleibt dort durch Null-Prüfungen lauffähig.
- Cloudflare Email und Brevo sind gegen die echten Dienste ungeprüft (kein Konto); getestet nur mit Attrappen.
