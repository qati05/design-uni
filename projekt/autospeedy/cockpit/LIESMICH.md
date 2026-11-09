# Werkstatt-Cockpit (Medaur-Starter, erster Kunde Auto Speedy)

Web-App für das Team eines Betriebs, **eine App und eine Datenbank für alle Kunden-Betriebe**. Das Cockpit macht nur, was der Betrieb an seiner Website selbst ändern kann: **«Website pflegen»**. Seit dem Ausbau [Auftrag · Roni, 09.11.2026] sind das elf Bereiche: Hinweise, Öffnungszeiten, Feiertage und Ferien, Team (entfernen mit «Rückgängig», Reihenfolge, Gruppe wechseln), Häufige Fragen, Fotos (Startseite, Leistungen, Vorher und nachher), Partner-Logos, Inhaber und Bewertungen, Kontakt (Telefon, Mail, WhatsApp), Besucherzahlen zum Lesen und der Verlauf mit «Letzte Änderung zurücknehmen». Die Oberfläche ist gebaut wie die Einstellungen auf dem iPhone oder Mac, damit sie vertraut wirkt (siehe `DESIGN.md`).

**So arbeitet man damit:** Alles, was man ändert, ist zuerst ein Entwurf im Browser. Unten erscheint «Prüfen und veröffentlichen» mit der Zahl der Änderungen. Ein Blatt zeigt alle Änderungen in Alltagssprache; erst «Jetzt veröffentlichen» schreibt auf die Website. Im Verlauf lässt sich jeder der letzten zehn Stände wieder laden und veröffentlichen.

**Was «Prüfen» nicht ist:** keine Vorschau der fertigen Seite. Gezeigt wird die Liste der Änderungen (bei Hinweisen und Öffnungszeiten zusätzlich ein Muster, wie es auf der Website steht). Eine echte Seitenvorschau bräuchte einen eigenen Vorschau-Bau der Website und ist nicht gebaut. Anmeldung mit **Code per Mail**, danach 30 Tage angemeldet pro Gerät; kein Fingerabdruck [Entscheid · Roni, 08.11.2026].

**Keine Kundendaten im Cockpit** [Entscheid · Roni, 08./09.11.2026]: Formulare der Website (Schaden melden, Rückruf) gehen direkt per Mail an den Betrieb (Website-Funktionen, nicht Teil dieses Ordners). Entfallen sind Meldungsliste und -detail, Status, Kennzahlen zu Meldungen, Link «Auto fertig», Bewertungs-Mails und Versand-Zeitplan, WhatsApp-Antworten, Foto-Bucket für Meldungen, Löschfrist, Studio-Bereich mit CSV-Export und damit auch der Fingerabdruck für Studio-Konten.

**Eine App für Handy und Computer:** dieselbe Web-App, gleiche Daten. Am Handy «Zum Home-Bildschirm» (iPhone, Safari: Teilen → Zum Home-Bildschirm; Android, Chrome: «App installieren»), am Computer in Chrome/Edge «App installieren». Kein App Store. Der Service Worker speichert keine Seiten, ohne Netz zeigt er nur eine Hinweisseite.

**Stand 09.11.2026:** gebaut und lokal getestet, **nicht deployt**, kein Supabase-Projekt angelegt. Nichts davon ist live.

## Aufbau
| Teil | Wo | Herkunft |
|---|---|---|
| Zugang: ohne Sitzung → Login, Mitglied mit Mail-Code → weiter, kein Mitglied oder Cockpit des Betriebs aus → 403 | `proxy.ts`, `lib/zugang.ts` | medaur, verkleinert |
| Nonce-CSP, no-store, DENY und weitere Header. Bilder nur vom Cockpit selbst und vom eigenen Bild-Speicher (`TEAMFOTO_BASIS`). Keine style-Attribute im Markup, eigene 404-Seite ohne eingebettete Styles | `lib/sicherheit.ts`, `app/not-found.tsx` | medaur, um den Bild-Speicher ergänzt |
| Sitzung nur in httpOnly-Cookies (höchstens 30 Tage), Log ohne Personendaten | `lib/cookies.ts`, `lib/log.ts` | medaur |
| Backend-Schnittstelle, zwei Umsetzungen | `lib/backend.ts`, `backend.supabase.server.ts`, `backend.demo.server.ts` | neu |
| Datenbank für alle Betriebe: `betrieb` (aktiv, Website, Repo), `betrieb_mitglied`, RLS über `mein_betrieb()`, Audit nur anfügbar (Anmeldung, Pflege), «zuletzt gepflegt von». Keine Meldungen, kein Speicher-Bucket, kein Zeitplan | `supabase/migrations/20261103100000_cockpit.sql` (eine Datei; nie angewendet, darum verkleinert statt Folge-Migration) | Muster medaur |
| Website pflegen (Startseite `/`, alte Adresse `/pflege` leitet um): schreibt `site.json` über die GitHub-API ins Repo des Betriebs (nur mit der gelesenen Version, sonst «jemand anderes hat gespeichert»); der Commit baut die Website neu. Fotos im Bild-Speicher R2, nie im Git (Ordner `team/` für Porträts, `bild/` für ersetzte Fotos der Website und Partner-Logos); nicht mehr gebrauchte Bilder werden gelöscht. Regeln aus `../gemeinsam/site.ts` | `app/page.tsx`, `app/pflege/` (`Cockpit.tsx` Rahmen und Entwurf, `bereiche.tsx` die elf Bereiche, `teile.tsx` Bausteine, `bild.ts` Bilder im Browser verkleinern, `aktionen.ts` Veröffentlichen und Stand laden), `lib/pflege.ts`, `lib/website.server.ts` | neu |
| Verlauf: die letzten zehn Commits an `site.json` (GitHub), ein früherer Stand lässt sich laden. Bilder, die es im Speicher nicht mehr gibt, fallen dabei weg und es wird gesagt | `lib/website.server.ts` (`siteVerlauf`, `siteLesen` mit Commit), `lib/pflege.ts` (`fehlendeFotosEntfernen`) | neu |
| Besucherzahlen: Summen pro Tag und pro Seite der letzten 28 Tage aus Cloudflare Web Analytics (dieselbe Zählung wie auf der Website, ohne Cookies). Nur lesen, keine Angaben zu einzelnen Besuchern. Ohne Einrichtung steht «noch nicht verbunden» | `lib/besucher.server.ts` | neu |
| Startbilder der Website als Kopie im Cockpit, damit es sie zeigen kann (`npm run bilder`; ein Test prüft, dass sie zur Website passen) | `bau/bilder.mjs`, `public/bilder/` | neu |
| Installierbar (Manifest, Symbole, Service Worker ohne Datenspeicher) | `app/manifest.ts`, `public/sw.js`, `public/offline.html` | neu |
| Anmelde-Mail: Supabase Auth (eigener SMTP-Absender in Supabase), nicht das Cockpit | Supabase-Einstellungen | – |

## Demo starten (ohne fremde Dienste)
```sh
npm install --legacy-peer-deps
NEXT_PUBLIC_SUPABASE_URL=https://platzhalter.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=platzhalter npx next build
COCKPIT_DEMO=1 npx next start -p 4400
```
Anmelden mit `werkstatt@autospeedy.example`; Mail-Code unter `/demo/postfach`. `fremd@beispiel.example` zeigt den 403-Fall. Die Demo startet mit der echten `../astro/src/daten/site.json` und hält Änderungen, Fotos und den Verlauf nur im Speicher; die echte Website bleibt unverändert. Die Besucherzahlen der Demo sind Beispielzahlen und so gekennzeichnet.

## Tests
- `npm test`: 44 Einheitstests (Zugang nur mit Mail-Code, entfernte Pfade nicht mehr öffentlich, Login-Validierung, Demo-Sitzung fälschungssicher und nach 30 Tagen abgelaufen, Cookie-Härtung, Entwurf ohne Verlust zurück in site.json, Änderungen in Alltagssprache, Fehler mit Ort, neue Fotos als Platzhalter, fremde Foto-Adresse abgewiesen, alter Stand ohne gelöschte Fotos, CSP für Bilder, Startbilder gleich wie auf der Website, Besucherzahlen ohne Netz, GitHub lesen/schreiben/Konflikt/Verlauf, R2 hochladen/löschen in beiden Ordnern).
- `npm run rauchprobe` (lokales Postgres 16 unter `/usr/lib/postgresql/16`, als root): Migration gegen einen Supabase-Stub, 31 Regeln mit drei Betrieben: nur drei Tabellen, kein Bucket, keine Meldungs-/Export-/Versand-Funktionen; anon sieht und ruft nichts; A sieht nichts von B; gesperrter Betrieb kommt nicht rein; Audit nur anfügbar und nur über die Funktion.
- `node tests/ende-zu-ende.cjs <ordner>` (frisch gestartetes Demo-Cockpit auf 4400, Playwright; `<ordner>/testfotos/a.jpg`, `b.jpg`, `quer.jpg` (mindestens 1600 Punkte breit, 3:2) und `logo.png`): 90 Schritte am Handy und am Computer, u. a. Login mit Mail-Code, 403 für fremdes Konto, jede Änderung zuerst in der Prüfliste, Person entfernen mit «Rückgängig», Reihenfolge und Gruppe, Fragen mit Platzhalter, Foto ersetzen (auf 1600 Punkte verkleinert, Beschreibung Pflicht), Partner mit Logo, WhatsApp-Nummer, Besucher nur lesen, «Letzte Änderung zurücknehmen» (gelöschte Fotos verschwinden wirklich aus dem Speicher), zwei Fenster: Konflikt statt Überschreiben, keine Fehler und keine CSP-Verstösse in der Konsole.
- **Nicht geprüft:** echtes Cloudflare Web Analytics (die Abfrage `rumPageloadEventsAdaptiveGroups` mit `siteTag` ist nach der Dokumentation geschrieben und nur gegen ein Schein-Netz getestet; vor dem Betrieb einmal mit echtem Token prüfen), echter GitHub-Verlauf, echtes Supabase (Auth-Mail mit Code, 30-Tage-Sitzung im echten Refresh), echtes GitHub (Token, Konflikt-Antwort), echtes R2 (Signatur, öffentliche Adresse), echte Handys, Deploy, Safari/iPhone, Lighthouse.

## Vor dem echten Betrieb (Freigabe nötig)
1. Supabase-Projekt, Region Zürich, Migration anwenden. Neuen Betrieb anlegen: in Supabase `insert into betrieb (id, name, website_url, github_repo, github_pfad) values (…)`, Konten in `betrieb_mitglied` (siehe auch `../LIESMICH.md`).
2. Supabase Auth: Mail-Vorlage mit 6-stelligem Code, eigener Absender (SPF, DKIM, DMARC), «Neue Konten anlegen» aus. Sitzungsdauer so einstellen, dass ein Gerät 30 Tage angemeldet bleibt.
3. Cockpit auf eine Subdomain des Studios. Umgebung: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `R2_KONTO`, `R2_SCHLUESSEL_ID`, `R2_GEHEIMNIS`, `R2_BUCKET`, `TEAMFOTO_BASIS` (öffentliche Adresse des Buckets; steht auch in der CSP, damit das Cockpit die Fotos zeigen darf), für die Besucherzahlen `CF_KONTO` (Account-ID), `CF_SEITE` (Site Tag der Website in Web Analytics) und `CF_ANALYSE_TOKEN` (nur «Account Analytics: Read»), je Betrieb `GITHUB_TOKEN_<BETRIEB>` (fein abgestuft, nur dessen Repo, nur «Contents: Read and write»).
4. Datenschutzerklärung: das Cockpit verarbeitet nur Konten des Betriebs (Mail, Anmelde- und Pflege-Protokoll mit IP und Browser) und Teamfotos mit Einverständnis. Die Besucherzahlen sind Summen ohne Personenbezug.
