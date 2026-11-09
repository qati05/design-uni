# Werkstatt-Cockpit (Medaur-Starter, erster Kunde Auto Speedy)

Web-App für das Team eines Betriebs, **eine App und eine Datenbank für alle Kunden-Betriebe**. Das Cockpit macht nur noch, was der Betrieb an seiner Website selbst ändern kann: **«Website pflegen»** (Hinweis-Leiste, Öffnungszeiten, Feiertage und Ferien, Team mit Fotos, Satz vom Inhaber, Google-Bewertungen zeigen). Das ist die Startseite. Anmeldung mit **Code per Mail**, danach 30 Tage angemeldet pro Gerät; kein Fingerabdruck [Entscheid · Roni, 08.11.2026].

**Keine Kundendaten im Cockpit** [Entscheid · Roni, 08./09.11.2026]: Formulare der Website (Schaden melden, Rückruf) gehen direkt per Mail an den Betrieb (Website-Funktionen, nicht Teil dieses Ordners). Entfallen sind Meldungsliste und -detail, Status, Zahlen/Kennzahlen, Link «Auto fertig», Bewertungs-Mails und Versand-Zeitplan, WhatsApp-Antworten, Foto-Bucket für Meldungen, Löschfrist, Studio-Bereich mit CSV-Export und damit auch der Fingerabdruck für Studio-Konten.

**Eine App für Handy und Computer:** dieselbe Web-App, gleiche Daten. Am Handy «Zum Home-Bildschirm» (iPhone, Safari: Teilen → Zum Home-Bildschirm; Android, Chrome: «App installieren»), am Computer in Chrome/Edge «App installieren». Kein App Store. Der Service Worker speichert keine Seiten, ohne Netz zeigt er nur eine Hinweisseite.

**Stand 09.11.2026:** gebaut und lokal getestet, **nicht deployt**, kein Supabase-Projekt angelegt. Nichts davon ist live.

## Aufbau
| Teil | Wo | Herkunft |
|---|---|---|
| Zugang: ohne Sitzung → Login, Mitglied mit Mail-Code → weiter, kein Mitglied oder Cockpit des Betriebs aus → 403 | `proxy.ts`, `lib/zugang.ts` | medaur, verkleinert |
| Nonce-CSP, no-store, DENY und weitere Header | `lib/sicherheit.ts` | medaur, unverändert |
| Sitzung nur in httpOnly-Cookies (höchstens 30 Tage), Log ohne Personendaten | `lib/cookies.ts`, `lib/log.ts` | medaur |
| Backend-Schnittstelle, zwei Umsetzungen | `lib/backend.ts`, `backend.supabase.server.ts`, `backend.demo.server.ts` | neu |
| Datenbank für alle Betriebe: `betrieb` (aktiv, Website, Repo), `betrieb_mitglied`, RLS über `mein_betrieb()`, Audit nur anfügbar (Anmeldung, Pflege), «zuletzt gepflegt von». Keine Meldungen, kein Speicher-Bucket, kein Zeitplan | `supabase/migrations/20261103100000_cockpit.sql` (eine Datei; nie angewendet, darum verkleinert statt Folge-Migration) | Muster medaur |
| Website pflegen (Startseite `/`, alte Adresse `/pflege` leitet um): schreibt `site.json` über die GitHub-API ins Repo des Betriebs (nur mit der gelesenen Version, sonst «jemand anderes hat gespeichert»); der Commit baut die Website neu. Teamfotos im Bild-Speicher R2, nie im Git; entfernte Fotos werden gelöscht. Regeln aus `../gemeinsam/site.ts` | `app/page.tsx`, `app/pflege/`, `lib/pflege.ts`, `lib/website.server.ts` | neu |
| Installierbar (Manifest, Symbole, Service Worker ohne Datenspeicher) | `app/manifest.ts`, `public/sw.js`, `public/offline.html` | neu |
| Anmelde-Mail: Supabase Auth (eigener SMTP-Absender in Supabase), nicht das Cockpit | Supabase-Einstellungen | – |

## Demo starten (ohne fremde Dienste)
```sh
npm install --legacy-peer-deps
NEXT_PUBLIC_SUPABASE_URL=https://platzhalter.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=platzhalter npx next build
COCKPIT_DEMO=1 npx next start -p 4400
```
Anmelden mit `werkstatt@autospeedy.example`; Mail-Code unter `/demo/postfach`. `fremd@beispiel.example` zeigt den 403-Fall. Die Demo startet mit der echten `../astro/src/daten/site.json` und hält Änderungen und Teamfotos nur im Speicher; die echte Website bleibt unverändert.

## Tests
- `npm test`: 27 Einheitstests (Zugang nur mit Mail-Code, entfernte Pfade nicht mehr öffentlich, Login-Validierung, Demo-Sitzung fälschungssicher und nach 30 Tagen abgelaufen, Cookie-Härtung, Pflege-Formular, Sprungmarken, fremde Foto-Adresse abgewiesen, GitHub lesen/schreiben/Konflikt, R2 hochladen/löschen).
- `npm run rauchprobe` (lokales Postgres 16 unter `/usr/lib/postgresql/16`, als root): Migration gegen einen Supabase-Stub, 31 Regeln mit drei Betrieben: nur drei Tabellen, kein Bucket, keine Meldungs-/Export-/Versand-Funktionen; anon sieht und ruft nichts; A sieht nichts von B; gesperrter Betrieb kommt nicht rein; Audit nur anfügbar und nur über die Funktion.
- `node tests/ende-zu-ende.cjs <ordner>` (frisch gestartetes Demo-Cockpit auf 4400, Playwright; `<ordner>/testfotos/a.jpg` und `b.jpg`): 34 Schritte, u. a. Login mit Mail-Code direkt auf «Website pflegen», entfernte Seiten 404, 403 für fremdes Konto, Teamfoto in den Bild-Speicher, «Foto entfernen» löscht es wirklich, zwei Fenster speichern: Konflikt statt Überschreiben, Manifest und Service Worker.
- **Nicht geprüft:** echtes Supabase (Auth-Mail mit Code, 30-Tage-Sitzung im echten Refresh), echtes GitHub (Token, Konflikt-Antwort), echtes R2 (Signatur, öffentliche Adresse), echte Handys, Deploy, Safari/iPhone, Lighthouse.

## Vor dem echten Betrieb (Freigabe nötig)
1. Supabase-Projekt, Region Zürich, Migration anwenden. Neuen Betrieb anlegen: in Supabase `insert into betrieb (id, name, website_url, github_repo, github_pfad) values (…)`, Konten in `betrieb_mitglied` (siehe auch `../LIESMICH.md`).
2. Supabase Auth: Mail-Vorlage mit 6-stelligem Code, eigener Absender (SPF, DKIM, DMARC), «Neue Konten anlegen» aus. Sitzungsdauer so einstellen, dass ein Gerät 30 Tage angemeldet bleibt.
3. Cockpit auf eine Subdomain des Studios. Umgebung: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `R2_KONTO`, `R2_SCHLUESSEL_ID`, `R2_GEHEIMNIS`, `R2_BUCKET`, `TEAMFOTO_BASIS`, je Betrieb `GITHUB_TOKEN_<BETRIEB>` (fein abgestuft, nur dessen Repo, nur «Contents: Read and write»).
4. Datenschutzerklärung: das Cockpit verarbeitet nur Konten des Betriebs (Mail, Anmelde- und Pflege-Protokoll mit IP und Browser) und Teamfotos mit Einverständnis.
