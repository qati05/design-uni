# Auto Speedy Werkstatt-Cockpit

Web-App für das Team von Auto Speedy: Schadenmeldungen aus der Website ansehen, zurückrufen, per WhatsApp antworten, Status bis zum Auftrag führen, interne Notizen. Anmeldung mit **Code per Mail** und **Code aus der Authenticator-App** (Muster aus `qati05/medaur`, `cockpit-app/`).

**Stand 02.11.2026:** gebaut und lokal getestet, **nicht deployt**, kein Supabase-Projekt angelegt. Nichts davon ist live.

## Aufbau
| Teil | Wo | Herkunft |
|---|---|---|
| Zugang: ohne Sitzung → Login, nur Mail-Code → zweiter Code, kein Mitglied → 403 | `proxy.ts`, `lib/zugang.ts` | medaur |
| Nonce-CSP, no-store, DENY und weitere Header | `lib/sicherheit.ts` | medaur, unverändert |
| Sitzung nur in httpOnly-Cookies, Log ohne Personendaten | `lib/cookies.ts`, `lib/log.ts` | medaur |
| Backend-Schnittstelle, zwei Umsetzungen | `lib/backend.ts`, `backend.supabase.server.ts`, `backend.demo.server.ts` | neu |
| Status, Kennzahlen (Abschlussquote, wartet > 2 Std.) | `lib/status.ts` | neu |
| Datenbank, RLS, privater Foto-Bucket, Audit nur anfügbar, Löschfrist | `supabase/migrations/20261102000000_autospeedy_cockpit.sql` | Muster medaur |
| Website-Seite: Meldung und Fotos in Supabase, Hinweis-Mail ohne Personendaten | `../astro/functions/api/schaden.js` | neu |

## Demo starten (ohne fremde Dienste)
```sh
npm install --legacy-peer-deps
NEXT_PUBLIC_SUPABASE_URL=https://platzhalter.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=platzhalter npx next build
COCKPIT_DEMO=1 DEMO_WEBSITE_ORIGIN=http://localhost:4332 npx next start -p 4400
# Website-Vorschau, die ans Demo-Cockpit sendet:
cd ../astro && FORMULAR_ENDPUNKT=http://localhost:4400/api/meldung npx astro build --outDir dist-demo && python3 -m http.server 4332 -d dist-demo
```
Anmelden mit `werkstatt@autospeedy.example`; Mail-Code unter `/demo/postfach`, zweiter Code unter `/demo/authenticator`. `fremd@beispiel.example` zeigt den 403-Fall. Alle Beispiel-Meldungen sind als «Beispiel» markiert.

## Tests
- `npm test`: 16 Einheitstests (Zugang, Status, Kennzahlen, TOTP mit RFC-6238-Testwerten, Validierung, Demo-Sitzung fälschungssicher, Telefonformate).
- `npm run rauchprobe`: Migration gegen lokales Postgres 16 mit Supabase-Stub, 14 Regeln (anon ohne Recht, aal1 liest nichts, Status nur über Funktion, Nicht-Mitglied ohne Zugriff, Audit nur anfügbar, Löschfrist).
- Ende-zu-Ende (Playwright, im Studio-Skript): Website sendet Meldung mit 2 Fotos → Hinweis im Postfach ohne Name/Telefon → Login mit Mail-Code und Authenticator → Meldung oben → Status bis Auftrag, Notiz; 403 für Fremde; gleiche Antwort für unbekannte Adressen. 21 von 21 grün.
- **Nicht geprüft:** echtes Supabase (Auth-Mails, Storage, signierte Links), Deploy, Safari/iPhone, Lighthouse.

## Vor dem echten Betrieb (Freigabe nötig)
1. Supabase-Projekt, Region Zürich, Migration anwenden; Konten der Mitarbeitenden anlegen und in `betrieb_mitglied` eintragen.
2. Supabase Auth: Mail-Vorlage mit 6-stelligem Code, eigener Absender (SPF, DKIM, DMARC).
3. Cockpit auf eine Subdomain (z. B. `cockpit.autospeedy.ch`), Website-Funktion mit `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (nur Server), `COCKPIT_URL`, `MAIL_*`.
4. Löschfrist mit dem Betrieb festlegen (vorgeschlagen 365 Tage) und als Job einplanen; Datenschutzerklärung ergänzen (Supabase, Mail-Dienst).
