# Cockpit einrichten: echter Betrieb auf Cloudflare Workers

Diese Liste führt vom leeren Stand zum Cockpit, das der Betrieb am PC und am Handy testen kann.

**Drei Regeln**

1. Geheimnisse (Tokens, Passwörter, Schlüssel) trägt der Auftraggeber selbst im Dashboard ein. Sie gehören nie in den Chat und nie ins Repo.
2. Die Reihenfolge einhalten. Spätere Schritte brauchen Werte aus früheren.
3. Namen von Variablen genau so schreiben wie hier, mit Grossbuchstaben und Unterstrichen.

**Was geprüft ist und was nicht:** Der Bau, der lokale Lauf im Laufzeitsystem von Cloudflare und alle Tests sind hier
ausgeführt. Auf echtem Cloudflare, echtem Supabase, echtem GitHub und echtem R2 lief noch nichts. Die Namen der
Menüpunkte stammen aus der Dokumentation der Anbieter (Stand 10.11.2026) und können im Dashboard leicht anders heissen.

**Zeit und Kosten:** etwa 1.5 bis 2 Stunden, ohne die Wartezeit auf DNS. Laufend 0 bis 5 Dollar im Monat (Schritt 9).

## Übersicht

| Schritt | Was | Wer | Dauer |
|---|---|---|---|
| 1 | Supabase-Projekt anlegen | Auftraggeber | 10 Min. |
| 2 | Datenbank einrichten (Migration) | Auftraggeber oder wir | 5 Min. |
| 3 | Mail-Dienst für den Anmelde-Code | Auftraggeber | 20 bis 40 Min., dazu Wartezeit DNS |
| 4 | Supabase Auth einstellen | Auftraggeber | 15 Min. |
| 5 | Konten und Betrieb anlegen | Auftraggeber | 10 Min. |
| 6 | GitHub-Token | Auftraggeber | 5 Min. |
| 7 | Bildspeicher R2 | Auftraggeber | 10 bis 15 Min. |
| 8 | Website auf Cloudflare Pages: Zweig und Bau-Pfade | Auftraggeber | 10 Min. |
| 9 | Cockpit als Worker anlegen | Auftraggeber, wir begleiten | 20 Min. |
| 10 | Besucherzahlen (freiwillig) | Auftraggeber | 10 Min. |
| 11 | Durchgang am PC und am Handy | wir, dann der Betrieb | 30 Min. |

## Schritt 1: Supabase-Projekt anlegen

**Wer:** Auftraggeber. **Wo:** Die Supabase-Organisation hängt an Vercel. Laut Dokumentation legt man Projekte dann im Dashboard von Vercel an, nicht bei Supabase direkt.

- Region: Zürich (`eu-central-2`).
- Ein neues Projekt anlegen. Das pausierte Projekt «medaur» nicht wiederverwenden.
- Notieren (beides ist nicht geheim):
  - die Adresse des Projekts, Form `https://<kennung>.supabase.co`
  - den «Publishable key», er beginnt mit `sb_publishable_`

**Kosten:** gratis. Laut Dokumentation sind 2 aktive Projekte gratis. Gratis-Projekte werden nach einer Woche ohne Nutzung pausiert. Dann muss sie jemand im Dashboard wecken. Für den Test geht das, für den Dauerbetrieb braucht es den bezahlten Tarif.

## Schritt 2: Datenbank einrichten

**Wer:** Auftraggeber oder wir, sobald wir Zugang haben. **Wo:** Supabase, SQL Editor.

- Den ganzen Inhalt von `supabase/migrations/20261103100000_cockpit.sql` einfügen und ausführen.
- Das legt drei Tabellen, die Zugriffs-Regeln und fünf Funktionen an. Geprüft mit `npm run rauchprobe` (31 Regeln).

## Schritt 3: Mail-Dienst für den Anmelde-Code

**Wer:** Auftraggeber. **Wo:** beim Mail-Dienst, zum Beispiel Brevo (derselbe wie für die Formulare der Website).

Ohne eigenen Mail-Dienst bekommt der Betrieb keinen Code: Supabase schickt sonst nur an Mitglieder der eigenen Organisation und nur 2 Mails pro Stunde.

- Absender-Domain bestätigen. Der Dienst zeigt dafür DNS-Einträge an. Die genauen Einträge sind hier nicht belegt.
- SMTP-Zugang anlegen. Notieren: Host, Port, Benutzer. Das Passwort bleibt beim Auftraggeber.

**Kosten:** bei Brevo laut Dokumentation gratis bis 300 Mails pro Tag.

## Schritt 4: Supabase Auth einstellen

**Wer:** Auftraggeber. **Wo:** Supabase, Bereich «Authentication».

- Alle Einstellungen stehen in `einrichten/supabase-auth-einstellungen.md`.
- Die Mail-Vorlage steht in `einrichten/mail-code-vorlage.html`.
- Die SMTP-Werte aus Schritt 3 eintragen. Das Passwort trägt der Auftraggeber selbst ein.
- «Site URL» kommt erst nach Schritt 9, wenn die Adresse des Cockpits bekannt ist.

## Schritt 5: Konten und Betrieb anlegen

**Wer:** Auftraggeber. **Wo:** Supabase.

1. Authentication → Users → «Add user»: für jede Person des Betriebs ein Konto. Genaues Vorgehen in `einrichten/supabase-auth-einstellungen.md`, Abschnitt «Konten anlegen».
2. SQL Editor: `einrichten/betrieb-anlegen.sql` einfügen, die vier Platzhalter ersetzen (sie beginnen mit `HIER-`), ausführen.
3. Die letzte Abfrage zeigt eine Zeile. «konten» muss der Zahl der Konten entsprechen, nicht 0.

Der Wert für `HIER-ZWEIG-DEN-PAGES-BAUT` ist der Zweig aus Schritt 8. Der Wert für `HIER-HOST-DER-TEST-WEBSITE` ist die Adresse der Test-Website ohne `https://`.

## Schritt 6: GitHub-Token

**Wer:** Auftraggeber. **Wo:** GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens.

- Repository access: «Only select repositories», nur `qati05/design-uni`.
- Permissions: Repository permissions → «Contents»: «Read and write». Sonst nichts.
- Ablaufdatum setzen und im Kalender eintragen. Läuft das Token ab, kann das Cockpit nicht mehr speichern.
- Das Token gleich in Schritt 9 eintragen. Es ist geheim.

Gut zu wissen: Das Token darf im ganzen Repository schreiben. Das Cockpit schreibt nur die eine Datei `site.json`. Die Commits erscheinen unter dem Namen der Person, der das Token gehört.

## Schritt 7: Bildspeicher R2

**Wer:** Auftraggeber. **Wo:** Cloudflare-Dashboard → R2.

1. Bucket anlegen, zum Beispiel `cockpit-bilder`. **Keine Jurisdiktion wählen** (nicht «EU»). Mit Jurisdiktion erreicht das Cockpit den Bucket nicht.
2. Im Bucket: Settings → «Public Development URL» einschalten. Das ergibt eine Adresse der Form `https://pub-….r2.dev`. Für den Test genügt sie. Cloudflare nennt sie nicht für den Dauerbetrieb geeignet. Später: eigene Adresse (braucht eine Domain im selben Cloudflare-Konto).
3. R2 → «Manage API Tokens» → Token anlegen: Recht «Object Read & Write», nur für diesen Bucket.
4. Notieren: die Konto-Kennung (Account ID), den Namen des Buckets, die öffentliche Adresse. «Access Key ID» und «Secret Access Key» sind geheim und kommen direkt in Schritt 9.

**Kosten:** laut Dokumentation gratis bis 10 GB. Ob Cloudflare dafür eine Zahlungsart verlangt, ist nicht belegt.

## Schritt 8: Website auf Cloudflare Pages

**Wer:** Auftraggeber. **Wo:** Cloudflare-Dashboard → Workers & Pages → das Pages-Projekt der Test-Website → Settings.

Das Cockpit schreibt die Datei `projekt/autospeedy/astro/src/daten/site.json` ins Repository. Cloudflare Pages baut die Website danach neu. Dafür müssen zwei Dinge stimmen:

- **Production branch:** derselbe Zweig, der in Schritt 5 als `HIER-ZWEIG-DEN-PAGES-BAUT` eingetragen wird. Sonst speichert das Cockpit, und auf der Website passiert nichts.
- **Build watch paths** (falls gesetzt): Die Pfade `projekt/autospeedy/astro/*` und `projekt/autospeedy/gemeinsam/*` müssen eingeschlossen sein. Die Datei des Cockpits liegt im Ordner `astro`, nicht in `astro-klar`.

Empfehlung: ein eigener Zweig nur für die Test-Website. Änderungen am Code kommen per Merge hinein, nie per Force-Push. Sonst gehen Änderungen des Betriebs verloren.

## Schritt 9: Cockpit als Worker anlegen

**Wer:** Auftraggeber, wir begleiten. **Wo:** Cloudflare-Dashboard → Workers & Pages → «Create» → «Import a repository».

### Einstellungen für «Workers Builds»

| Feld | Wert |
|---|---|
| Repository | `qati05/design-uni` |
| Zweig | der Zweig mit dem Code des Cockpits |
| Name des Workers | `cockpit` (muss gleich heissen wie `name` in `wrangler.jsonc`) |
| Root directory | `projekt/autospeedy/cockpit` |
| Build command | `npm ci --prefix ../gemeinsam && npm run bau:cloudflare` |
| Deploy command | `npx wrangler deploy` (das ist die Vorgabe) |
| Bauten für andere Zweige | aus |

Die Pakete des Cockpits installiert Cloudflare vor dem Bau von selbst. Die Node-Version steht in `.node-version`.

Falls «Build watch paths» gesetzt werden: `projekt/autospeedy/cockpit/*` und `projekt/autospeedy/gemeinsam/*` einschliessen, `projekt/autospeedy/astro/src/daten/*` ausschliessen. Sonst baut jedes Speichern im Cockpit auch das Cockpit neu.

### Bau-Variablen

Wo: beim Anlegen unter «Build variables and secrets», später unter Settings → Build.
Diese zwei Werte werden fest in den Bau geschrieben. Fehlt einer, bricht der Bau mit einer klaren Meldung ab.

| Name | Wert | Geheim |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Adresse des Projekts aus Schritt 1 | nein |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | der «Publishable key» aus Schritt 1 | nein |

Achtung: Die Verknüpfung von Vercel nennt den Schlüssel `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Das Cockpit liest ihn unter `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Laufzeit-Variablen

Wo: der Worker `cockpit` → Settings → «Variables and Secrets». Geht erst, wenn der Worker einmal gebaut ist.
Geheime Werte als Typ «Secret» anlegen, die anderen als «Text».

| Name | Wert | Typ |
|---|---|---|
| `GITHUB_TOKEN_AUTO_SPEEDY` | das Token aus Schritt 6 | Secret |
| `R2_KONTO` | Konto-Kennung (Account ID) aus Schritt 7 | Text |
| `R2_SCHLUESSEL_ID` | «Access Key ID» aus Schritt 7 | Secret |
| `R2_GEHEIMNIS` | «Secret Access Key» aus Schritt 7 | Secret |
| `R2_BUCKET` | Name des Buckets aus Schritt 7 | Text |
| `TEAMFOTO_BASIS` | öffentliche Adresse des Buckets aus Schritt 7 | Text |

`TEAMFOTO_BASIS` genau in dieser Form: `https://pub-….r2.dev`. Mit `https://`, alles klein geschrieben, ohne Schrägstrich am Ende und ohne Pfad. Sonst lässt sich nichts speichern.

Freiwillig:

| Name | Wert | Typ |
|---|---|---|
| `WEBSITE_URL` | Adresse der Website mit `https://`, für die Zeile «Website ansehen» | Text |
| `HILFE_MAIL` | Mail-Adresse des Betreuers, für «Ihrem Betreuer schreiben» | Text |
| `CF_KONTO`, `CF_SEITE`, `CF_ANALYSE_TOKEN` | siehe Schritt 10 | Text, Text, Secret |

**Nicht setzen:** `COCKPIT_DEMO` und `DEMO_GEHEIMNIS`. Mit `COCKPIT_DEMO` wäre das Cockpit für alle offen.

### Danach

- Die Adresse des Workers notieren (Form `https://cockpit.<konto>.workers.dev`) und in Supabase als «Site URL» eintragen (Schritt 4).
- Tarif: Gratis sind laut Dokumentation 10 Millisekunden Rechenzeit pro Aufruf. Lokal gemessen braucht eine Seite etwa 6 Millisekunden. Das ist knapp. Zeigt das Cockpit «Error 1102», auf «Workers Paid» umstellen (5 Dollar im Monat).

## Schritt 10: Besucherzahlen (freiwillig)

**Wer:** Auftraggeber. **Wo:** Cloudflare-Dashboard → Web Analytics.

Ohne diesen Schritt zeigt das Cockpit bei den Besuchen «noch nicht verbunden». Alles andere geht.

- Die Website in Web Analytics hinzufügen. Notieren: den «Site Tag».
- API-Token anlegen mit dem Recht «Account Analytics: Read».
- Im Worker `cockpit` drei Laufzeit-Variablen ergänzen: `CF_KONTO` (Konto-Kennung, Text), `CF_SEITE` (Site Tag, Text), `CF_ANALYSE_TOKEN` (das Token, Secret).

## Schritt 11: Durchgang

**Wer:** zuerst wir, dann der Betrieb. **Wo:** die Adresse des Workers, am PC und am Handy.

1. Anmelden mit einer Adresse aus Schritt 5. Der Code kommt per Mail. Kommt keiner: im Log des Workers nach `login_code_supabase` suchen. Dort steht der Fehlercode von Supabase.
2. Einen Text ändern, «Prüfen und veröffentlichen».
3. Warten, bis Cloudflare Pages die Website neu gebaut hat. Die Zeit dabei einmal stoppen: Sie ist bisher nicht gemessen.
4. Die Website neu laden. Die Änderung muss sichtbar sein.
5. Ein Teamfoto hochladen und veröffentlichen. Es muss im Cockpit und auf der Website erscheinen.
6. Am Handy anmelden. Am PC muss man angemeldet bleiben. Am Handy abmelden. Am PC muss man weiter angemeldet sein.
7. Mit einer Adresse ohne Konto versuchen: Es darf kein Code kommen.

Gut zu wissen: Das Cockpit zeigt den neuen Stand sofort, die Website erst nach dem Bau. Scheitert der Bau der Website, merkt das Cockpit es nicht. Darum in Cloudflare eine Benachrichtigung für fehlgeschlagene Bauten an das Studio einrichten.

## Lokal bauen und ansehen (für uns)

```sh
npm ci && npm ci --prefix ../gemeinsam
NEXT_PUBLIC_SUPABASE_URL=https://platzhalter.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=platzhalter npm run bau:cloudflare
npm run vorschau:cloudflare     # Demo im Laufzeitsystem von Cloudflare, http://localhost:8790
```

`vorschau:cloudflare` startet den Demo-Modus (`COCKPIT_DEMO`), nur lokal. Für den echten Modus lokal: die echten Werte beim Bau setzen, die Laufzeit-Variablen in eine Datei `.dev.vars` schreiben (steht in `.gitignore`) und `npx wrangler dev` starten.
