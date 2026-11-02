# Auto Speedy Werkstatt-Cockpit

Web-App für das Team von Auto Speedy: Schadenmeldungen aus der Website ansehen, zurückrufen, per WhatsApp antworten, Status bis zum Auftrag führen, interne Notizen. Dazu **«Website pflegen»** (Öffnungszeiten, Feiertage, Hinweis-Leiste, Team) und **«Geräte»**. Anmeldung mit **Code per Mail**, dann **Fingerabdruck oder Gesicht** des eigenen Handys oder Laptops (Passkey als zweiter Faktor); keine weitere App. Muster aus `qati05/medaur`, `cockpit-app/`.

**Eine App für Handy und Computer:** dieselbe Web-App, gleiche Daten. Am Handy «Zum Home-Bildschirm» (iPhone, Safari: Teilen → Zum Home-Bildschirm; Android, Chrome: «App installieren»), am Computer in Chrome/Edge «App installieren». Am Handy liegen die Bereiche unten in Daumenreichweite. Kein App Store. Kundendaten werden bewusst nicht offline gespeichert (Service Worker zeigt ohne Netz nur eine Hinweisseite).

**Stand 02.11.2026:** gebaut und lokal getestet, **nicht deployt**, kein Supabase-Projekt angelegt. Nichts davon ist live.

## Aufbau
| Teil | Wo | Herkunft |
|---|---|---|
| Zugang: ohne Sitzung → Login, nur Mail-Code → Fingerabdruck (erstes Mal: einrichten), kein Mitglied → 403 | `proxy.ts`, `lib/zugang.ts` | medaur |
| Nonce-CSP, no-store, DENY und weitere Header | `lib/sicherheit.ts` | medaur, unverändert |
| Sitzung nur in httpOnly-Cookies, Log ohne Personendaten | `lib/cookies.ts`, `lib/log.ts` | medaur |
| Backend-Schnittstelle, zwei Umsetzungen | `lib/backend.ts`, `backend.supabase.server.ts`, `backend.demo.server.ts` | neu |
| Status, Kennzahlen (Abschlussquote, wartet > 2 Std.) | `lib/status.ts` | neu |
| Datenbank, RLS, privater Foto-Bucket, Audit nur anfügbar, Löschfrist | `supabase/migrations/20261102000000_autospeedy_cockpit.sql` | Muster medaur |
| Fingerabdruck/Gesicht: Supabase MFA «webauthn» (Server ruft challenge/verify, Sitzung bleibt httpOnly); Demo prüft selbst mit node:crypto | `lib/backend.supabase.server.ts`, `lib/webauthn-pruefung.ts`, `app/mfa/` | neu |
| Website pflegen: Tabelle `pflege`, nur über `pflege_speichern` (aal2, Audit); Website-Bau holt über `pflege_oeffentlich` | `supabase/migrations/20261102010000_autospeedy_pflege.sql`, `app/pflege/`, `../astro/bau/pflege-holen.mjs` | neu, ersetzt Decap |
| Installierbar (Manifest, Symbole, Service Worker ohne Datenspeicher) | `app/manifest.ts`, `public/sw.js`, `public/offline.html` | neu |
| Website-Seite: Meldung und Fotos in Supabase, Hinweis-Mail ohne Personendaten | `../astro/functions/api/schaden.js` | neu |

## Demo starten (ohne fremde Dienste)
```sh
npm install --legacy-peer-deps
NEXT_PUBLIC_SUPABASE_URL=https://platzhalter.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=platzhalter npx next build
COCKPIT_DEMO=1 DEMO_WEBSITE_ORIGIN=http://localhost:4332 npx next start -p 4400
# Website-Vorschau, die ans Demo-Cockpit sendet:
cd ../astro && FORMULAR_ENDPUNKT=http://localhost:4400/api/meldung npx astro build --outDir dist-demo && python3 -m http.server 4332 -d dist-demo
```
Anmelden mit `werkstatt@autospeedy.example`; Mail-Code unter `/demo/postfach`; beim ersten Mal «Fingerabdruck oder Gesicht einrichten» (Touch ID, Windows Hello, Handy). Die Demo hält alles im Speicher; nach einem Neustart ist das Gerät wieder neu einzurichten. `fremd@beispiel.example` zeigt den 403-Fall. Alle Beispiel-Meldungen sind als «Beispiel» markiert.

## Tests
- `npm test`: 30 Einheitstests (Zugang, Status, Kennzahlen, TOTP, Validierung, Demo-Sitzung fälschungssicher, Telefonformate; neu: Fingerabdruck-Prüfung mit echtem ES256-Schlüssel inkl. falscher Seite/Phishing, alter Challenge, ohne Prüfung der Person, Zähler; Pflege-Formular inkl. unsinniger Zeiten und HTML).
- `npm run rauchprobe`: Migration gegen lokales Postgres 16 mit Supabase-Stub, 27 Regeln (anon ohne Recht, aal1 liest nichts, Status nur über Funktion, Nicht-Mitglied ohne Zugriff, Audit nur anfügbar, Löschfrist, Zählung, Pflege: nur Mitglied mit aal2 schreibt, nur über die Funktion, protokolliert, Website-Bau liest).
- `node tests/ende-zu-ende.cjs <ordner-mit-testfotos>` (Playwright mit simuliertem Fingerabdruck-Gerät von Chromium): Website sendet Meldung → Mail-Code → Gerät einrichten → abmelden, wieder anmelden mit einem Tipp → Sitzung 30 Tage httpOnly → fremdes Gerät abgewiesen → Gerät ohne Personenprüfung abgewiesen → Nicht-Mitglied 403 auch mit Fingerabdruck → Pflege: unsinnige Zeit mit verständlicher Meldung, speichern, neu laden → Geräte → Manifest, Service Worker. 24 von 24 grün. Bilder: `../vorschau/cockpit/`.
- **Nicht geprüft:** echtes Supabase (Auth-Mails, Storage, signierte Links, **WebAuthn-MFA ist bei Supabase Beta** und hier nur nach den Typen von supabase-js 2.117.3 gebaut), echte Handys (Face ID/Fingerabdruck), Deploy, Safari/iPhone, Lighthouse.

## Vor dem echten Betrieb (Freigabe nötig)
1. Supabase-Projekt, Region Zürich, Migration anwenden; Konten der Mitarbeitenden anlegen und in `betrieb_mitglied` eintragen.
2. Supabase Auth: Mail-Vorlage mit 6-stelligem Code, eigener Absender (SPF, DKIM, DMARC).
3. Cockpit auf eine Subdomain (z. B. `cockpit.autospeedy.ch`), Website-Funktion mit `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (nur Server), `COCKPIT_URL`, `MAIL_*`.
4. `COCKPIT_ORIGIN` (für Fingerabdruck, nie aus dem Host-Header), `WEBSITE_DEPLOY_HOOK` (Cloudflare Deploy Hook, damit «Speichern» die Website neu baut); im Website-Bau `PFLEGE_URL` und `PFLEGE_ANON_KEY`. WebAuthn-MFA im Supabase-Projekt einschalten und mit echtem iPhone und Android testen. Pro Person beim Start Handy **und** Computer einrichten; Ersatz, wenn alle Geräte weg sind: Studio entfernt die Faktoren im Supabase-Dashboard.
5. Löschfrist mit dem Betrieb festlegen (vorgeschlagen 365 Tage) und als Job einplanen; Datenschutzerklärung ergänzen (Supabase, Mail-Dienst).
