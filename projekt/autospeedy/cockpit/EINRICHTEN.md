# Cockpit einrichten: echter Betrieb auf Cloudflare

Diese Liste führt vom leeren Stand zum Cockpit, das der Betrieb am PC und am Handy testen kann.

**Es braucht zwei Konten: Cloudflare und GitHub.** Keine Datenbank, kein eigener Mail-Dienst für die Anmeldung.
Beide Konten gehören dem Betrieb (oder dem, der die Website betreut). [Entscheid · Roni, 10.11.2026]

| Was | Wo |
|---|---|
| Anmeldung (Code per Mail) und wer hinein darf | Cloudflare Access, eine Liste von Mail-Adressen |
| Inhalte der Website (`site.json`) und der Verlauf | GitHub, im Repository der Website |
| Fotos | Cloudflare R2 |
| Das Cockpit selbst | Cloudflare Workers |

**Drei Regeln**

1. Geheimnisse (Tokens, Schlüssel) trägt der Inhaber des Kontos selbst im Dashboard ein. Sie gehören nie in einen Chat und nie ins Repository.
2. Die Reihenfolge einhalten. Spätere Schritte brauchen Werte aus früheren.
3. Namen von Einstellungen genau so schreiben wie hier, mit Grossbuchstaben und Unterstrichen.

**Was geprüft ist und was nicht:** Der Bau, der lokale Lauf im Laufzeitsystem von Cloudflare und alle Tests sind ausgeführt.
Die Anmeldung ist gegen ein nachgestelltes Cloudflare Access geprüft (echte Unterschriften, `tests/betrieb.cjs`).
Auf echtem Cloudflare, echtem GitHub und echtem R2 lief noch nichts. Die Namen der Menüpunkte stammen aus der
Dokumentation von Cloudflare und GitHub (Stand 10.11.2026) und können im Dashboard leicht anders heissen.

**Zeit und Kosten:** etwa eine Stunde. Laufend 0 bis 5 Dollar im Monat (Schritt 3). Cloudflare verlangt für die Anmeldung
(«Zero Trust», Gratis-Plan) ein hinterlegtes Zahlungsmittel, belastet es laut Dokumentation aber nicht.

## Übersicht

| Schritt | Was | Dauer |
|---|---|---|
| 1 | GitHub-Token für das Repository der Website | 5 Min. |
| 2 | Website auf Cloudflare Pages: Zweig und Bau-Pfade prüfen | 5 Min. |
| 3 | Cockpit als Worker anlegen | 15 Min. |
| 4 | Anmeldung einschalten (Cloudflare Access) | 15 Min. |
| 5 | Einstellungen beim Worker eintragen | 10 Min. |
| 6 | Bildspeicher R2 (für Fotos) | 10 bis 15 Min. |
| 7 | Besucherzahlen (freiwillig) | 10 Min. |
| 8 | Durchgang am PC und am Handy | 30 Min. |

## Schritt 1: GitHub-Token

**Wo:** GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens.

- Repository access: «Only select repositories», nur das Repository der Website.
- Permissions: Repository permissions → «Contents»: «Read and write». Sonst nichts.
- Ablaufdatum setzen und im Kalender eintragen. Läuft das Token ab, kann das Cockpit nicht mehr speichern.
- Das Token in Schritt 5 eintragen. Es ist geheim.

Gut zu wissen: Das Token darf im ganzen Repository schreiben. Das Cockpit schreibt nur die eine Datei `site.json`. Die Commits erscheinen unter dem Namen des Kontos, dem das Token gehört.

## Schritt 2: Website auf Cloudflare Pages

**Wo:** Cloudflare-Dashboard → Workers & Pages → das Pages-Projekt der Website → Settings.

Das Cockpit schreibt die Datei `site.json` ins Repository (heute `projekt/autospeedy/astro/src/daten/site.json`). Cloudflare Pages baut die Website danach neu. Dafür müssen zwei Dinge stimmen:

- **Production branch:** derselbe Zweig, der in Schritt 5 als `GITHUB_ZWEIG` eingetragen wird. Sonst speichert das Cockpit, und auf der Website passiert nichts.
- **Build watch paths** (falls gesetzt): Der Ordner mit `site.json` und der Ordner `gemeinsam` müssen eingeschlossen sein. Die Datei des Cockpits liegt im Ordner `astro`, nicht in `astro-klar`.

Änderungen am Code kommen per Merge in diesen Zweig, nie per Force-Push. Sonst gehen Änderungen des Betriebs verloren.

## Schritt 3: Cockpit als Worker anlegen

**Wo:** Cloudflare-Dashboard → Workers & Pages → «Create» → «Import a repository».

| Feld | Wert |
|---|---|
| Repository | das Repository der Website |
| Zweig | der Zweig mit dem Code des Cockpits |
| Name des Workers | `cockpit` (muss gleich heissen wie `name` in `wrangler.jsonc`) |
| Root directory | der Ordner `cockpit` (heute `projekt/autospeedy/cockpit`) |
| Build command | `npm ci --prefix ../gemeinsam && npm run bau:cloudflare` |
| Deploy command | `npx wrangler deploy` (das ist die Vorgabe) |
| Bauten für andere Zweige | aus |

Bau-Variablen braucht es keine. Die Pakete des Cockpits installiert Cloudflare vor dem Bau von selbst. Die Node-Version steht in `.node-version`.

Falls «Build watch paths» gesetzt werden: die Ordner `cockpit` und `gemeinsam` einschliessen, den Ordner mit `site.json` ausschliessen. Sonst baut jedes Speichern im Cockpit auch das Cockpit neu.

**Sicher von Anfang an:** Solange Schritt 4 und 5 fehlen, lässt das Cockpit niemanden hinein. Es zeigt nur «Kein Zugang».

**Tarif:** Gratis sind laut Dokumentation 10 Millisekunden Rechenzeit pro Aufruf. Lokal gemessen braucht eine Seite etwa 6 Millisekunden. Das ist knapp. Zeigt das Cockpit «Error 1102», auf «Workers Paid» umstellen (5 Dollar im Monat).

## Schritt 4: Anmeldung einschalten (Cloudflare Access)

Cloudflare Access stellt sich vor das ganze Cockpit. Wer es öffnet, gibt seine Mail-Adresse ein und bekommt einen Code per Mail. Nur Adressen auf der Liste bekommen einen Code. Das Cockpit hat keine eigene Anmeldeseite.

1. **Zero Trust einschalten** (nur beim ersten Mal). Cloudflare-Dashboard → Zero Trust. Einen Team-Namen wählen, zum Beispiel `auto-speedy`. Plan «Free» wählen. Cloudflare verlangt dabei ein Zahlungsmittel, belastet es laut Dokumentation aber nicht. **Den Team-Namen notieren.**
2. **Code per Mail einschalten.** Zero Trust → Integrations → Identity providers → «Add new identity provider» → «One-time PIN». Neue Konten haben das nicht mehr von selbst.
3. **Das Cockpit schützen.** Workers & Pages → Worker `cockpit` → Reiter «Access» → «Protect this Worker behind Access» → «All traffic». Bei «Authentication policy» vorerst «Cloudflare account» wählen → «Apply Access».
4. **Festlegen, wer hinein darf.** Zero Trust → Access controls → Applications → die Anwendung des Workers → «Edit»:
   - Policy bearbeiten: Aktion «Allow», bei «Include» den Typ «Emails» wählen und die Mail-Adressen der Personen eintragen, die das Cockpit bedienen. Die Vorgabe «Cloudflare account» entfernen.
   - Login methods: nur «One-time PIN» ankreuzen. Dann erscheint gleich das Feld für die Mail-Adresse.
   - Session Duration: «1 month». So bleibt man auf einem Gerät einen Monat angemeldet.
   - Unter «Additional settings» steht der **«Application Audience (AUD) Tag»**. Diesen Wert notieren (nicht geheim).

**Später jemanden hinzufügen oder entfernen:** nur Punkt 4, die Liste der Mail-Adressen. Sonst nichts.

Gut zu wissen: Die Anmeldeseite und die Mail mit dem Code kommen von Cloudflare, nicht vom Cockpit. Logo und Text der Seite lassen sich unter Zero Trust → Reusable components → Custom pages anpassen. In welcher Sprache Seite und Mail erscheinen, ist hier nicht belegt: beim Durchgang (Schritt 8) ansehen.

## Schritt 5: Einstellungen beim Worker

**Wo:** der Worker `cockpit` → Settings → «Variables and Secrets». Geht erst, wenn der Worker einmal gebaut ist.
Geheime Werte als Typ «Secret» anlegen, die anderen als «Text».

| Name | Wert | Typ |
|---|---|---|
| `ACCESS_TEAM` | der Team-Name aus Schritt 4, zum Beispiel `auto-speedy` | Text |
| `ACCESS_AUD` | der «Application Audience (AUD) Tag» aus Schritt 4 | Text |
| `GITHUB_REPO` | das Repository der Website in der Form `konto/name` | Text |
| `GITHUB_PFAD` | Pfad zu `site.json`, heute `projekt/autospeedy/astro/src/daten/site.json` | Text |
| `GITHUB_ZWEIG` | der Zweig, den Cloudflare Pages baut (Schritt 2). Ohne Angabe: `main` | Text |
| `GITHUB_TOKEN` | das Token aus Schritt 1 | Secret |

Für Fotos (Schritt 6):

| Name | Wert | Typ |
|---|---|---|
| `R2_KONTO` | Konto-Kennung (Account ID) | Text |
| `R2_SCHLUESSEL_ID` | «Access Key ID» | Secret |
| `R2_GEHEIMNIS` | «Secret Access Key» | Secret |
| `R2_BUCKET` | Name des Buckets | Text |
| `TEAMFOTO_BASIS` | öffentliche Adresse des Buckets | Text |

`TEAMFOTO_BASIS` genau in dieser Form: `https://pub-….r2.dev`. Mit `https://`, alles klein geschrieben, ohne Schrägstrich am Ende und ohne Pfad. Sonst lässt sich kein Foto speichern.

Freiwillig:

| Name | Wert | Typ |
|---|---|---|
| `WEBSITE_URL` | Adresse der Website mit `https://`, für die Zeile «Website ansehen» | Text |
| `HILFE_MAIL` | Mail-Adresse des Betreuers, für «Ihrem Betreuer schreiben» | Text |
| `CF_KONTO`, `CF_SEITE`, `CF_ANALYSE_TOKEN` | siehe Schritt 7 | Text, Text, Secret |

**Nicht setzen:** `COCKPIT_DEMO`. Damit wäre das Cockpit für alle offen.

**Wenn nach der Anmeldung «Kein Zugang» steht:** `ACCESS_TEAM` oder `ACCESS_AUD` stimmt nicht. Das Cockpit prüft bei jeder Anfrage den Ausweis von Access gegen genau diese zwei Werte.

## Schritt 6: Bildspeicher R2

**Wo:** Cloudflare-Dashboard → R2. Ohne diesen Schritt geht alles ausser Fotos.

1. Bucket anlegen, zum Beispiel `cockpit-bilder`. **Keine Jurisdiktion wählen** (nicht «EU»). Mit Jurisdiktion erreicht das Cockpit den Bucket nicht.
2. Im Bucket: Settings → «Public Development URL» einschalten. Das ergibt eine Adresse der Form `https://pub-….r2.dev`. Für den Test genügt sie. Cloudflare nennt sie nicht für den Dauerbetrieb geeignet. Später: eigene Adresse (braucht eine Domain im selben Cloudflare-Konto).
3. R2 → «Manage API Tokens» → Token anlegen: Recht «Object Read & Write», nur für diesen Bucket.
4. Die fünf Werte in Schritt 5 eintragen.

**Kosten:** laut Dokumentation gratis bis 10 GB.

## Schritt 7: Besucherzahlen (freiwillig)

**Wo:** Cloudflare-Dashboard → Web Analytics.

Ohne diesen Schritt zeigt das Cockpit bei den Besuchen «noch nicht verbunden». Alles andere geht.

- Die Website in Web Analytics hinzufügen. Notieren: den «Site Tag».
- API-Token anlegen mit dem Recht «Account Analytics: Read».
- Im Worker `cockpit` drei Einstellungen ergänzen: `CF_KONTO` (Konto-Kennung, Text), `CF_SEITE` (Site Tag, Text), `CF_ANALYSE_TOKEN` (das Token, Secret).

## Schritt 8: Durchgang

**Wo:** die Adresse des Workers (Form `https://cockpit.<konto>.workers.dev`), am PC und am Handy.

1. Die Adresse öffnen. Es erscheint die Anmeldung von Cloudflare. Mail-Adresse von der Liste eingeben, der Code kommt per Mail (gültig 10 Minuten).
2. Mit einer Adresse, die nicht auf der Liste steht: Es darf kein Code kommen.
3. Einen Text ändern, «Prüfen und veröffentlichen».
4. Warten, bis Cloudflare Pages die Website neu gebaut hat. Die Zeit dabei einmal stoppen: Sie ist bisher nicht gemessen.
5. Die Website neu laden. Die Änderung muss sichtbar sein.
6. Ein Teamfoto hochladen und veröffentlichen. Es muss im Cockpit und auf der Website erscheinen.
7. Am Handy anmelden und «Zum Home-Bildschirm» ausprobieren. Im Cockpit «Abmelden» antippen: Danach verlangt Cloudflare wieder einen Code.

Gut zu wissen:

- Das Cockpit zeigt den neuen Stand sofort, die Website erst nach dem Bau. Scheitert der Bau der Website, merkt das Cockpit es nicht. Darum in Cloudflare eine Benachrichtigung für fehlgeschlagene Bauten einrichten.
- Wer sich wann angemeldet hat, steht bei Cloudflare (Zero Trust → Logs). Wann veröffentlicht wurde, steht im Verlauf des Cockpits und im Repository. Wer veröffentlicht hat, wird nirgends mit Namen festgehalten.

## Lokal bauen und ansehen (für uns)

```sh
npm ci && npm ci --prefix ../gemeinsam
npm run bau:cloudflare
npm run vorschau:cloudflare     # Demo im Laufzeitsystem von Cloudflare, http://localhost:8790
```

`vorschau:cloudflare` startet den Demo-Modus (`COCKPIT_DEMO`), nur lokal und ohne Anmeldung. Den Zugang im echten Modus prüft `tests/betrieb.cjs` gegen ein nachgestelltes Access (Aufruf steht oben in der Datei).
