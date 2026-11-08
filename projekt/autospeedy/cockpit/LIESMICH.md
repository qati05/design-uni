# Werkstatt-Cockpit (Medaur-Starter, erster Kunde Auto Speedy)

Web-App für das Team eines Betriebs, **eine App und eine Datenbank für alle Kunden-Betriebe**: Schadenmeldungen aus der Website ansehen, zurückrufen, per WhatsApp antworten, Status bis zum Auftrag führen, interne Notizen. Dazu **«Website pflegen»** (Öffnungszeiten, Feiertage, Hinweis-Leiste, Team) und **«Geräte»**. Anmeldung mit **Code per Mail**, danach 30 Tage angemeldet pro Gerät [Entscheid · Roni, 08.11.2026: Fingerabdruck ist dem Kunden zu viel]. Nur Studio-Konten (`/studio`) brauchen weiterhin Fingerabdruck oder Gesicht.

**Eine App für Handy und Computer:** dieselbe Web-App, gleiche Daten. Am Handy «Zum Home-Bildschirm» (iPhone, Safari: Teilen → Zum Home-Bildschirm; Android, Chrome: «App installieren»), am Computer in Chrome/Edge «App installieren». Am Handy liegen die Bereiche unten in Daumenreichweite. Kein App Store. Kundendaten werden bewusst nicht offline gespeichert (Service Worker zeigt ohne Netz nur eine Hinweisseite).

**Stand 03.11.2026:** gebaut und lokal getestet, **nicht deployt**, kein Supabase-Projekt angelegt. Nichts davon ist live.

## Aufbau
| Teil | Wo | Herkunft |
|---|---|---|
| Zugang: ohne Sitzung → Login, Mitglied mit Mail-Code → weiter, Studio-Konto → Fingerabdruck (erstes Mal: einrichten), kein Mitglied oder Cockpit des Betriebs aus → 403, Studio-Admin → `/studio` | `proxy.ts`, `lib/zugang.ts` | medaur |
| Nonce-CSP, no-store, DENY und weitere Header | `lib/sicherheit.ts` | medaur, unverändert |
| Sitzung nur in httpOnly-Cookies, Log ohne Personendaten | `lib/cookies.ts`, `lib/log.ts` | medaur |
| Backend-Schnittstelle, zwei Umsetzungen | `lib/backend.ts`, `backend.supabase.server.ts`, `backend.demo.server.ts` | neu |
| Status, Kennzahlen (Abschlussquote, wartet > 2 Std.) | `lib/status.ts` | neu |
| Datenbank für alle Betriebe: Tabelle `betrieb` (aktiv, gekaufte Automation, Website, Repo), `betrieb_id` überall, RLS über `mein_betrieb()`, privater Foto-Bucket je Betriebs-Ordner, Audit nur anfügbar, Löschfrist (Fotos über die Storage-API, dann Zeilen), CSV-Export nur Studio | `supabase/migrations/20261103100000_cockpit.sql` (eine Datei, ersetzt die nie angewendeten Entwürfe) | Muster medaur |
| Fingerabdruck/Gesicht: Supabase MFA «webauthn» (Server ruft challenge/verify, Sitzung bleibt httpOnly); Demo prüft selbst mit node:crypto | `lib/backend.supabase.server.ts`, `lib/webauthn-pruefung.ts`, `app/mfa/` | neu |
| Website pflegen: schreibt `site.json` über die GitHub-API ins Repo des Betriebs (nur mit der gelesenen Version, sonst «jemand anderes hat gespeichert»); der Commit baut die Website neu. Teamfotos im Bild-Speicher R2, nie im Git; entfernte Fotos werden gelöscht. Regeln aus `../gemeinsam/site.ts` | `app/pflege/`, `lib/website.server.ts` | neu |
| Studio: Betriebe auflisten, Meldungen eines Betriebs als CSV (Formeln entschärft, protokolliert) | `app/studio/`, `lib/csv.ts` | neu |
| Installierbar (Manifest, Symbole, Service Worker ohne Datenspeicher) | `app/manifest.ts`, `public/sw.js`, `public/offline.html` | neu |
| Website-Seite: Meldung und Fotos in Supabase, Hinweis-Mail ohne Personendaten; ohne Cockpit oder bei Fehler die ganze Meldung per Mail | `../astro/functions/api/schaden.js`, `../gemeinsam/` | neu |
| Mail: ein Weg (Brevo) für Website und Cockpit | `../gemeinsam/brevo.ts`, `lib/mail.server.ts` | neu |

## Demo starten (ohne fremde Dienste)
```sh
npm install --legacy-peer-deps
NEXT_PUBLIC_SUPABASE_URL=https://platzhalter.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=platzhalter npx next build
COCKPIT_DEMO=1 DEMO_WEBSITE_ORIGIN=http://localhost:4332 npx next start -p 4400
# Website-Vorschau, die ans Demo-Cockpit sendet:
cd ../astro && FORMULAR_ENDPUNKT=http://localhost:4400/api/meldung npx astro build --outDir dist-demo && python3 -m http.server 4332 -d dist-demo
```
Anmelden mit `werkstatt@autospeedy.example` (Studio: `studio@medaur.example`); Mail-Code unter `/demo/postfach`. Nur das Studio-Konto richtet beim ersten Mal Fingerabdruck oder Gesicht ein. Die Demo hält alles im Speicher; nach einem Neustart ist das Gerät wieder neu einzurichten. `fremd@beispiel.example` zeigt den 403-Fall. Alle Beispiel-Meldungen sind als «Beispiel» markiert.

## Tests
- `npm test`: 45 Einheitstests (Zugang inkl. Studio, Status, Kennzahlen, Validierung, Demo-Sitzung fälschungssicher, Telefonformate, Fingerabdruck-Prüfung mit echtem ES256-Schlüssel, Pflege-Formular, fremde Foto-Adresse abgewiesen, GitHub lesen/schreiben/Konflikt, R2 hochladen/löschen, CSV mit entschärften Formeln).
- `npm run rauchprobe`: Migration gegen lokales Postgres 16 mit Supabase-Stub, 72 Regeln, mit drei Betrieben: A sieht nichts von B (Meldungen, Fotos, Speicher, Zählung, Repo-Angaben), gesperrter Betrieb kommt nicht rein, aber Meldungen, Mail-Link «Auto fertig» und Bewertungs-Mail laufen weiter; Automation nur, wenn gekauft; Export nur Studio mit aal2, protokolliert; Löschfrist löscht Fotos über die Storage-API (service_role, nur serverseitig), anon hat im Speicher keine Regel, SQL-Delete gesperrt wie bei Supabase.
- `node tests/ende-zu-ende.cjs <ordner-mit-testfotos>` (Website auf 4332, Demo-Cockpit auf 4400, siehe oben): 31 Schritte, u. a. Teamfoto in den Bild-Speicher, «Foto entfernen» löscht es wirklich, zwei Fenster speichern: Konflikt statt Überschreiben.
- `node tests/auftrag-ende-zu-ende.cjs` (frisch gestartetes Demo-Cockpit): 18 Schritte, Link «Auto fertig» schon in der ersten Mail, Bewertung 24 Stunden später, Studio lädt CSV.
- **Nicht geprüft:** echtes Supabase (Auth-Mails, Storage-API beim Löschen, signierte Links, **WebAuthn-MFA ist bei Supabase Beta**), echtes GitHub (Token, Konflikt-Antwort), echtes R2 (Signatur, öffentliche Adresse), echtes Brevo und Turnstile, echte Handys, Deploy, Safari/iPhone, Lighthouse.

## Vor dem echten Betrieb (Freigabe nötig)
1. Supabase-Projekt, Region Zürich, Migration anwenden. Neuen Betrieb anlegen: siehe `../LIESMICH.md` («Neuen Kunden anlegen»).
2. Supabase Auth: Mail-Vorlage mit 6-stelligem Code, eigener Absender (SPF, DKIM, DMARC). WebAuthn-MFA einschalten und mit echtem iPhone und Android testen.
3. Cockpit auf eine Subdomain des Studios. Umgebung: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `COCKPIT_ORIGIN`, `BREVO_SCHLUESSEL`, `MAIL_ABSENDER`, `VERSAND_GEHEIMNIS`, `SUPABASE_SERVICE_KEY` (nur für die Löschfrist der Fotos), `R2_KONTO`, `R2_SCHLUESSEL_ID`, `R2_GEHEIMNIS`, `R2_BUCKET`, `TEAMFOTO_BASIS`, je Betrieb `GITHUB_TOKEN_<BETRIEB>` (fein abgestuft, nur dessen Repo, nur «Contents: Read and write»).
4. Zeitplan alle 15 Minuten auf `/api/versand` (Bewertungs-Mails aller Betriebe, Löschfrist), Geheimnis in `versand_geheimnis`.
5. Löschfrist mit dem Betrieb festlegen (vorgeschlagen 365 Tage); Datenschutzerklärung ergänzen.
6. **Offener Punkt (Befund 3, zweites Gerät):** Ob ein zweites Gerät (Computer) nach dem Handy sauber eingerichtet werden kann, prüfen wir erst gegen ein echtes Supabase. Bis dahin: Ersatz, wenn alle Geräte weg sind, entfernt das Studio die Faktoren im Supabase-Dashboard.
