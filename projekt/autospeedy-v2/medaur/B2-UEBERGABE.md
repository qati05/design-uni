# Übergabe B2: Cockpit nur noch «Website pflegen»

Format nach `medaur/BETRIEB-DE.md` («Übergabe — vor Integration»).

```text
Task / Agent / tatsächlicher Arbeitsordner / Ausgangsstand:
  B2 / medaur-frontend-b (Entwickler B) / /home/claude/design-uni (Branch claude/autospeedy-v2, kein eigener Worktree) / Basis 569b177
```

## Ergebnis
Entscheid Roni 08./09.11.2026 umgesetzt: Das Cockpit macht nur noch «Website pflegen» und speichert keine Kundendaten mehr.

- **Bleibt:** Login nur mit Mail-Code (30 Tage pro Gerät, httpOnly-Cookies), «Website pflegen» als Startseite `/` (Hinweise, Öffnungszeiten, Feiertage/Ferien, Team mit Fotos, Satz vom Inhaber, Google-Bewertungen zeigen), installierbare Web-App, Sicherheits-Header (Nonce-CSP, DENY, no-store usw. unverändert), Demo-Modus.
- **Entfernt:** Meldungsliste und -detail, Status, Notizen, Zahlen/Kennzahlen (inkl. Zählung `/api/zaehl` und Tabelle `zaehlung`), Link «Auto fertig» (`/auftrag/…`), Bewertungs-Mails und Versand-Zeitplan (`/api/versand`), WhatsApp-Antworten, Foto-Bucket `schadenfotos`, Löschfrist, Studio-CSV-Export, `/api/meldung`.
- **Studio-Bereich ganz entfernt (Begründung):** Ohne Meldungen bliebe nur eine reine Leseliste der Betriebe (Name, aktiv). Betriebe und Konten legt das Studio ohnehin direkt in Supabase an (LIESMICH), dort sieht es die Liste auch. Für diese Liste müsste das Cockpit aber den ganzen Fingerabdruck-Weg (Supabase WebAuthn-MFA, Beta, nie gegen echtes Supabase geprüft) behalten. Mit dem Studio fallen darum auch `/mfa`, `/mfa/einrichten`, die WebAuthn-Prüfung, `studio_admin`, `ist_studio_admin()` und `betriebe_liste()` weg. Weniger Angriffsfläche, kein Beta-Risiko.
- **Navigation:** Das Cockpit hat nur einen Bereich. Die Bereichs-Leiste (am Handy unten fixiert) ist weg; oben auf der Seite Sprungmarken zu den sechs Abschnitten (Pillen auf Fläche 2, Klar-Stil). Kopf: Logo, «Cockpit», Mail-Adresse, Abmelden. `/pflege` leitet dauerhaft auf `/` um (alte Lesezeichen, installierte Apps).
- **Datenbank:** `cockpit/LIESMICH.md` (Stand 03.11.) sagt «kein Supabase-Projekt angelegt», die Migration ersetzt schon nie angewendete Entwürfe. Darum **die eine Migrationsdatei verkleinert** statt einer Folge-Migration (Dateiname gleich, damit Verweise im Projekt-LIESMICH gültig bleiben). Übrig: `betrieb` (ohne `automation_bewertung`), `betrieb_mitglied`, `mein_betrieb()`, `ist_mitglied()`, `mein_betrieb_website()`, `audit_log` (nur anfügbar) mit `audit_schreiben()`, `pflege_zuletzt()`. Kein Storage-Bucket, keine Storage-Policies, keine Zeitplan-Funktionen. anon bekommt keine Funktion mehr.
- Nebenbei: «Zuletzt geändert» zeigt die Zeit jetzt in Europe/Zurich (vorher Server-Zeitzone). Login-Audit wird jetzt beim Code-Prüfen geschrieben (vorher im MFA-Schritt).

## Geänderte und entfernte Dateien (alle unter `projekt/autospeedy/cockpit/`)
**Entfernt (27):** `app/api/meldung/route.ts`, `app/api/versand/route.ts`, `app/api/zaehl/route.ts`, `app/auftrag/[token]/{page.tsx,aktionen.ts,ErledigtFormular.tsx}`, `app/meldung/[id]/page.tsx`, `app/zahlen/page.tsx`, `app/studio/page.tsx`, `app/studio/export/[betrieb]/route.ts`, `app/mfa/{page.tsx,aktionen.ts,PasskeyKnopf.tsx,einrichten/page.tsx}`, `app/demo/postfach/aktionen.ts`, `app/pflege/page.tsx` (Inhalt jetzt in `app/page.tsx`), `lib/{status,zahlen,anzeige,csv,mailtexte,versand.server,mail.server,webauthn-pruefung,rp.server}.ts`, `tests/auftrag-ende-zu-ende.cjs`, `tests/passkey-pflege.test.ts` (Pflege-Teil nach `tests/pflege.test.ts`).

**Neu:** `tests/pflege.test.ts`.

**Geändert:** `app/page.tsx` (Startseite = Pflege), `app/_teile/Kopf.tsx`, `app/aktionen.ts` (nur Abmelden), `app/pflege/PflegeFormular.tsx` (Abschnitts-ids), `app/pflege/aktionen.ts` (revalidate `/`), `app/login/aktionen.ts` (nach Code direkt `/`), `app/layout.tsx`, `app/manifest.ts`, `app/demo/postfach/page.tsx`, `app/globals.css` (Meldungs-/Zahlen-/Bereichsleisten-Stile raus, Sprungmarken rein), `lib/backend.ts`, `lib/backend.supabase.server.ts`, `lib/backend.demo.server.ts`, `lib/demo-speicher.ts`, `lib/zugang.ts`, `lib/validierung.ts`, `lib/pflege.ts` (`ABSCHNITTE`), `proxy.ts`, `next.config.ts` (Umleitung `/pflege`), `public/sw.js` (Cache-Version 2), `public/offline.html`, `supabase/migrations/20261103100000_cockpit.sql`, `tests/einheit.test.ts`, `tests/ende-zu-ende.cjs`, `tests/db/rauchprobe.sql`, `tests/db/stub.sql`, `LIESMICH.md`, `PRODUCT.md`, `DESIGN.md`.

Gesamt: 56 Dateien, +278 / −2009 Zeilen. `package.json` und `package-lock.json` unverändert (Lockfile gehört dem Lead). Entstanden und gitignored: `node_modules/`, `.next/`, `next-env.d.ts`.

## Schnittstelle, Assets, Abhängigkeiten
- Keine neuen Abhängigkeiten. `@supabase/supabase-js` wird nicht mehr direkt importiert, bleibt aber als Basis von `@supabase/ssr` im package.json.
- Liest weiter (nur lesend): `../gemeinsam/site.ts`, `../astro/src/daten/site.json`. `../gemeinsam/brevo.ts` und `../gemeinsam/meldung.ts` nutzt das Cockpit nicht mehr.

## Ausgeführte Prüfungen
| Befehl | Ergebnis |
|---|---|
| `npm install --legacy-peer-deps` | ok, 0 vulnerabilities, Lockfile unverändert |
| `npx tsc --noEmit` | ok, keine Fehler |
| `npm test` | 3 Dateien, **27/27 grün** (vorher 45; entfallen sind Tests für Status, Kennzahlen, CSV, WebAuthn, Bewertungs-Mail, Trichter, Telefonformate) |
| `NEXT_PUBLIC_SUPABASE_URL=https://platzhalter.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=platzhalter npx next build` | ok; Routen: `/`, `/403`, `/api/demo-foto/[name]`, `/demo/postfach`, `/login`, `/manifest.webmanifest`, Proxy |
| `npm run rauchprobe` (lokales Postgres 16, als root) | **31/31 Regeln grün**, «RAUCHPROBE GRÜN» |
| `COCKPIT_DEMO=1 npx next start -p 4400` + `NODE_PATH=/opt/node22/lib/node_modules node tests/ende-zu-ende.cjs <scratch>/e2e-lauf` (Playwright, Testfotos mit PIL erzeugt) | **34/34 Schritte grün**, «ALLES GRÜN» |

Belege (Bildschirmfotos Handy 390 px und Computer 1280 px): `/tmp/claude-0/-home-claude-design-uni/74937679-c533-5ae7-8450-0374beafdd1e/scratchpad/e2e-lauf/e2e/` (1-start-handy.png, 2-team-handy.png, 3-start-computer.png). Nicht ins Repo kopiert (`.medaur/belege/` gehört QA).

Ende-zu-Ende prüft u. a.: Login nur mit Mail-Code direkt auf «Website pflegen», Cookie httpOnly 30 Tage, kein seitliches Scrollen am Handy, Sicherheits-Header, `/zahlen`, `/meldung/…`, `/studio`, `/auftrag/…`, `/mfa`, `/api/meldung` → 404 (Formular-POST auf `/api/meldung` → 400, nimmt nichts an), `/pflege` → `/`, fremdes Konto → 403, Pflege speichern/Fehler mit Ort/Neuladen, Sprungmarke, Teamfoto hochladen/entfernen löscht wirklich, Konflikt bei zwei Fenstern, Manifest/Service Worker, Abmelden.

Hinweis zur alten Ende-zu-Ende-Datei: Zwei Erwartungen waren schon auf der Basis veraltet (Fehlermeldung «Zeile 2», Lea Schlegel an Position `team.1.p.0`), weil `site.json` in 77f6bb8 umgebaut wurde. Angepasst; Teamfelder werden jetzt über die Person gesucht, nicht über die Position.

## Nicht geprüft / offene Risiken
- Kein echtes Supabase: Anmelde-Mail mit Code, Sitzungsdauer 30 Tage im echten Refresh, Login-Audit direkt nach `verifyOtp` (gleiche Anfrage; scheitert es, wird es nur geloggt, der Login geht trotzdem).
- Kein echtes GitHub, kein echtes R2, keine echten Handys, kein Safari/iPhone, kein Deploy, kein Lighthouse.
- Sprung auf «Team» scrollt zur Tafel, klappt sie aber nicht auf (Team bleibt ein zugeklapptes `details`).
- `audit_log` speichert weiter IP und Browser der Konten des Betriebs (Mitarbeitende, keine Kunden). Muss in die Datenschutzerklärung; oder später entfernen.
- Ohne Studio-Bereich verwaltet das Studio Betriebe und Konten nur im Supabase-Dashboard.
- Dateiänderungen per Shell: Entfernte Dateien habe ich mit `rm` im eigenen Schreibbereich gelöscht, weil es kein Löschwerkzeug gibt. Ein `sed -i` auf `tests/ende-zu-ende.cjs` lief versehentlich, hat den Inhalt aber nicht verändert (ersetzte eine Zeile durch sich selbst). Sonst nur Edit/Write.

## Entfallene Umgebungsvariablen (Cockpit)
`BREVO_SCHLUESSEL`, `MAIL_ABSENDER`, `MAIL_ABSENDER_NAME` (Cockpit verschickt keine Mails mehr; Anmelde-Codes schickt Supabase Auth), `VERSAND_GEHEIMNIS`, `SUPABASE_SERVICE_KEY` (nur Löschfrist der Fotos), `COCKPIT_ORIGIN` (nur WebAuthn), `DEMO_WEBSITE_ORIGIN` (nur Demo-Meldungseingang und Zählung). Ebenso die Supabase-Einrichtung: Tabelle `versand_geheimnis` und der pg_cron-Zeitplan auf `/api/versand`.

Bleiben: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `R2_KONTO`, `R2_SCHLUESSEL_ID`, `R2_GEHEIMNIS`, `R2_BUCKET`, `TEAMFOTO_BASIS`, `GITHUB_TOKEN_<BETRIEB>`, Demo: `COCKPIT_DEMO`, `DEMO_GEHEIMNIS`.

## Übergabe-Wünsche ausserhalb meines Schreibbereichs (nichts davon geändert)
1. **Entwickler A:** `astro/functions/api/zaehl.js` und `astro-klar/functions/api/zaehl.js` rufen `rpc/zaehlen` in Supabase auf. Diese Funktion gibt es nicht mehr (Zahlen entfallen); entfernen oder ohne Supabase lassen. `schaden.js` darf nicht mehr in `meldungen`/`schadenfotos` schreiben (macht A mit dem Mail-Weg). Auf der Website entfallen damit `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `BETRIEB_ID`, `COCKPIT_URL`. `gemeinsam/meldung.ts` (`hinweisText` mit Cockpit- und «Auto fertig»-Link) ist für das Cockpit nicht mehr nötig.
2. **Lead:** `projekt/autospeedy/LIESMICH.md` beschreibt noch das alte Cockpit (Zeilen etwa 9 bis 11, 20, 26, 34 bis 35: Meldungen im Cockpit, Automation «Auto fertig», CSV-Export, `SUPABASE_SERVICE_KEY`, `automation_bewertung` beim Anlegen eines Betriebs). `projekt/autospeedy/vorschau-bau/demo.js` bildet das alte Cockpit nach.
3. **Lead:** Der Auftrag nannte `/home/claude/design-uni/medaur/BETRIEB-DE.md` als Ziel. Das ist die Framework-Vorlage (Betriebsregeln mit Übergabe-Schema) und liegt ausserhalb meines Schreibbereichs. Ich habe sie nicht überschrieben, sondern die Übergabe in ihrem Format hier abgelegt. Soll sie dort zusätzlich stehen, bitte durch den Lead.

## Integrationshinweis
Lokale Dateien im Arbeitsbaum auf `claude/autospeedy-v2`, nicht committet, nicht gepusht. Betroffene Pfade nur `projekt/autospeedy/cockpit/**` und diese Datei.

## Bereit für unabhängige Abnahme
Ja. Tests, Build, Rauchprobe und Ende-zu-Ende sind lokal grün. Offen sind nur Prüfungen gegen echte Dienste und Geräte, die ohne Freigabe nicht möglich sind.
