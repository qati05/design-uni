# Betrieb: Hoster, Sicherheit, Daten, Anfrage, Pflege, Kosten

Stand 2. November 2026. Kennzeichen wie in [SKILL.md](../SKILL.md). **Nichts in dieser Datei ist an einem Kundenprojekt gebaut**, ausser wo `[gebaut]` steht. Was hier steht, ist eine kurze Referenz; vor jedem Einsatz die aktuelle Dokumentation des Anbieters lesen.

## 1. Hoster wählen (WP2)

Der Hoster muss können, was text-uni für Suche und Umzug verlangt:

| Fähigkeit | Grund | Prüfen |
|---|---|---|
| Statische Dateien mit gzip oder Brotli | Messregel ([messungen.md](messungen.md)) | `curl -sI -H 'Accept-Encoding: br' <adresse>` |
| Vorschau je Änderung, mit `noindex` | zusammenspiel Entscheid 4, text-uni TI10 | `curl -sI <vorschau>` zeigt `X-Robots-Tag: noindex` |
| Eigene 404 mit Status 404 | text-uni TI17 | `curl -sI <adresse>/gibt-es-nicht` |
| Weiterleitungen mit 301, auch für Parameter | text-uni TI20, TI23 | Weiterleitungsliste online abrufen |
| Kopfzeilen setzbar | Vorschau, Sicherheit (Teil 3) | `curl -sI` |
| Zugang für den Betrieb als Inhaber | text-uni TI30, M17 | Konto auf den Betrieb |

**Cloudflare Pages** (Stand der Dokumentation, nicht an einem Kundenprojekt gebaut):

- Vorschau-Fassungen mit Hash bekommen selbst `X-Robots-Tag: noindex`; die Hauptadresse `<projekt>.pages.dev` braucht eine eigene Regel in `_headers` `[gelesen · Cloudflare Headers und Preview deployments, 25.08. und 12.10.2026, über text-uni TI-Q45]`. Die Vorlage schreibt diese Regel, wenn `pagesProjekt` in `bau.json` steht.
- `/kontakt.html` leitet auf `/kontakt` um, `/kontakt/index.html` auf `/kontakt/`; ohne `404.html` an der Wurzel liefert Pages für jede unbekannte Adresse die Startseite `[gelesen · Cloudflare «Serving Pages», 10.10.2026]`.
- Pages setzt immer `X-Content-Type-Options: nosniff` und `Referrer-Policy: strict-origin-when-cross-origin` und liefert gzip und Brotli aus `[gelesen · Cloudflare «Serving Pages», 10.10.2026]`.
- `_redirects`: Zeile ohne Code liefert 302, Parameter werden nicht ausgewertet, 2000 feste und 100 dynamische Regeln `[gelesen · über text-uni TI-Q43]`.

**Standort und Datenschutz:** Wo der Hoster die Daten bearbeitet, gehört in die Liste für die Datenschutzerklärung (Teil 6). Ob ein Standort im Ausland zusätzliche Pflichten auslöst, beurteilt keine Regel dieses Skills `[Lücke: Recht, text-uni]`. Ein Standort in der Schweiz ist kein Versprechen für den Rang (text-uni TI39).

## 2. Domain, DNS, HTTPS

- **Halter ist der Betrieb** (text-uni TI30). Zugang zum Registrar beim Betrieb; das Studio hat höchstens die kleinste nötige Rolle.
- **Vor jeder Änderung am DNS** alle Einträge sichern, auch `MX` und `TXT`, sonst bricht die E-Mail (Teil 5) `[Annahme]`. TTL eine Woche vor einem Wechsel senken (text-uni TI28).
- **Eine Hostvariante** (`https://` und mit oder ohne `www`); die andere leitet mit einem Sprung weiter (text-uni TI25).
- **HTTPS:** Zertifikat vom Hoster, automatisch erneuert `[Annahme, je Hoster prüfen]`. Nach dem Livegang sendet die Vorlage `Strict-Transport-Security: max-age=31536000`, ohne `includeSubDomains` und ohne `preload`, weil beides andere Dienste der Domain trifft `[Annahme]`.

## 3. Sicherheits-Kopfzeilen

Die Vorlage schreibt `_headers` im Format von Cloudflare Pages `[gebaut · 02.11.2026, nur mit Testdaten, nicht online geprüft]`:

| Kopfzeile | Wert | Kennzeichen |
|---|---|---|
| `X-Robots-Tag` | `noindex` (nur Vorschau) | zusammenspiel Entscheid 4 |
| `X-Content-Type-Options` | `nosniff` | setzt Cloudflare ohnehin `[gelesen]` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | setzt Cloudflare ohnehin `[gelesen]` |
| `Content-Security-Policy` | `frame-ancestors 'none'` | `[Annahme]`: niemand bettet die Seite ein |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | `[Annahme]` |
| `Strict-Transport-Security` | `max-age=31536000` (nur Livegang) | `[Annahme]` |

Eine vollständige Content-Security-Policy (`script-src 'self'` und mehr) ist `[nicht gebaut]`: Sie bricht still, sobald ein Projekt Stile oder Skripte einbettet, und braucht deshalb einen Test im Prüflauf. Auf einem anderen Hoster setzt man dieselben Werte in dessen Konfiguration. Prüfen: `curl -sI <adresse>`.

## 4. Sicherungen

- **Die Website** liegt im Git-Repo; das ist ihre Sicherung. Der Bau muss aus dem Repo allein laufen (`npm ci && npm run build`).
- **Anfragen, Zugänge, Personendaten** gehören nicht ins Repo und nicht in eine Claude-Sitzung (Schutzregel 2 von Medaur). Wo Anfragen liegen und wie lange, legt der Betrieb fest (Teil 7).
- **Wiederherstellung** einmal durchgespielt (frischer Klon, Bau, Vorschau): `[nicht gebaut]`.

## 5. E-Mail-Zustellung

Schickt die Website oder ein Formular E-Mails im Namen der Domain, braucht die Domain SPF, DKIM und DMARC, sonst landen Anfragen im Spam `[Annahme; Normen SPF RFC 7208, DKIM RFC 6376, DMARC RFC 7489, hier nicht nachgelesen]`. Die Einträge kommen vom Mail-Anbieter des Betriebs. Prüfen: eine Testanfrage an ein fremdes Postfach und den Kopf der Mail lesen (`spf=pass`, `dkim=pass`). Stand: `[nicht gebaut]`.

## 6. Fremde Hosts, Cookies, Datenschutz-Technik (DSG)

- **Alles vom eigenen Host:** Schriften, Skripte, Bilder, Modelle. Geprüft in DP6 (`pruefen.cjs`: fremde Herkunft 0, Cookies 0, nichts im Speicher).
- **Fremde Inhalte erst nach Klick** (text-uni CL3): Karte, Video, Feed als Link oder Vorschaubild; der fremde Dienst lädt erst beim Klick.
- **Fremde Skripte** nur mit Grund im Entscheid und erst nach Einwilligung oder Klick (zusammenspiel Entscheid 10). Das gilt vor text-uni TI34, das nur `async` oder `defer` verlangt.
- **Keine Cookies**, kein Speicher im Browser, Zählung ohne Cookies. Braucht ein Entscheid doch Cookies, gilt: erst nach Einwilligung, und der Hinweis überlagert nur (text-uni TI37).
- **Liste für die Datenschutzerklärung:** Hoster und Standort, Weg der Anfrage (Postfach, Server), Aufbewahrung und Löschung, Zählung, jeder fremde Dienst nach Klick. web-uni liefert die Liste, text-uni den Wortlaut.

## 7. Anfrage, Spamschutz, Zählendpunkt

**Stand: `[nicht gebaut]`.** Bis es gebaut ist, führt die Hauptaktion auf `tel:` oder `mailto:`. Linktext und Hinweis kommen aus text-uni (Wortlaut der Knöpfe und Mikrotexte, U-Grundsätze); die Zählpunkte `data-zaehl` bleiben. Was ein Formular-Backend braucht `[Annahme]`:

1. **Endpunkt beim Hoster** (zum Beispiel eine Funktion des Hosters), ohne fremden Formulardienst.
2. **Prüfung am Server:** Pflichtfelder, Längen, Typen; Anzahl der Felder nach design-uni, Beschriftung nach text-uni (U10, U11, U12).
3. **Spamschutz ohne Fremd-Skript:** verstecktes Feld, das Menschen nicht füllen, Mindestzeit zwischen Laden und Senden, Begrenzung je Absender.
4. **Zustellung** per Mail an das Postfach aus der Anfragekette, mit SPF und DKIM (Teil 5).
5. **Bestätigung** auf der Seite mit Wer, Wann, Was (text-uni U19, U20).
6. **Anhänge** (zum Beispiel Schadenfotos): Typ und Grösse begrenzt.
7. **Aufbewahrung und Löschung** nach Entscheid des Betriebs; in der Datenschutzerklärung.
8. **Rückfall ohne JavaScript:** gewöhnliches `POST` mit Antwortseite.

**Zählendpunkt** `[nicht gebaut]`: zählt Aufrufe und Klicks auf `data-zaehl` ohne Cookies und ohne gespeicherte IP-Adresse. Zählpunkte setzt design-uni, den Messplan schreibt text-uni (TP8).

## 8. Mehrsprachigkeit

Technik bei web-uni, Inhalt bei text-uni (S31 bis S33). Stand: `[nicht gebaut]`. Vorgehen `[Annahme]`:

- Eine Adresse je Sprache (`/fr/kontakt/`), `lang` je Seite, `hreflang` gegenseitig mit `x-default` (S32), keine Weiche nach Browsersprache (S33), Sprachwahl als Links.
- Eine Datenquelle je Sprache für den Wortlaut (`texte.fr.json`), Fakten einmal (`betrieb.json`).
- Die Sitemap nennt alle Fassungen.
- Grenze: `slop-de.js` prüft nur Deutsch; für andere Sprachen gibt es kein Werkzeug `[Lücke]`.

## 9. Pflege, Zugänge, Übergabe (WP7)

- **Zugänge**, alle auf den Betrieb: Domain, Hoster, Repo, Search Console und Bing (text-uni M17, TI15), Unternehmensprofil, Mail-Anbieter. Das Studio hat die kleinste nötige Rolle. Zugangsdaten stehen weder im Repo noch in einer Sitzung.
- **Pflegehandbuch** mit Bildern: welche Datei welchen Wert ändert (`betrieb.json` für Zeiten und Telefon, `texte.json` für Wortlaut), wie die Vorschau entsteht, wer freigibt. Eine Person des Betriebs spielt es einmal durch; das Ergebnis steht im Bericht.
- **Prüfrhythmus** je Inhalt nach text-uni CL4.
- **Weiterleitungsliste** nach text-uni TI19, vor dem Livegang fertig.
- **Übergabe:** `LIESMICH.md` Teil Technik (Schritt 8), Pflegehandbuch, Liste der Zugänge (ohne Passwörter), Termine der Nachprüfung ([livegang.md](livegang.md)).

## 10. Kosten an den Kunden

Kostenblatt für Bewegung ([animation-3d.md](animation-3d.md)), Stunden für den Bau, laufende Kosten (Hoster, Domain, Pflege) sind **Entwürfe**. Sie tragen oben «Entwurf, nicht an den Kunden» und gehen erst an den Betrieb, wenn das Studio sie freigegeben hat (zusammenspiel Teil 2; Schutzregel 4 von Medaur). Eine Zahl ohne Messung trägt `[Annahme]`.
