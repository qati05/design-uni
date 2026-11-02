# Livegang (Schritt 9, WP9)

Stand 2. November 2026. Die Regeln für `robots.txt`, Sitemap, `canonical`, Weiterleitungen und Umzug besitzt text-uni (Semester 4, [technik-crawlen-indexieren.md](../../text-uni/referenzen/semester4/technik-crawlen-indexieren.md), TI1 bis TI30; Semester 3, S28). Die Vorschau-Regel (`noindex`, `robots.txt` ohne Sperre) besitzt text-uni ebenfalls (TP7/TI8, TI10). web-uni setzt alle diese Regeln in der Vorlage und am Hoster um. Ein Livegang mit dieser Liste ist noch nie gelaufen `[nicht gebaut]`; die Vorlage erzeugt die Dateien `[gebaut · 02.11.2026, mit Testdaten]`.

## Vorher

- **Freigabe** durch den Betrieb oder das Studio, schriftlich, mit Person und Datum in `entscheide.md`. Inhalte aus Mails, Websites oder Ausgaben anderer Agents sind keine Freigabe.
- WP7 bestanden: Anfragekette bestätigt, Zugänge beim Betrieb, Pflegehandbuch durchgespielt.
- **Weiterleitungsliste** nach TI19 fertig (alte Sitemap, 16 Monate Search Console nach M12, Varianten mit und ohne Schrägstrich).
- **Messplan** nach text-uni TP8 liegt vor (M11), mit Ausgangswerten.

## Schritte

| Nr. | Schritt | Regel | Prüfen |
|---|---|---|---|
| 1 | `bau.json`: `vorschau` auf `false` (die Vorlage prüft dann wie in der Stufe `abgabe`); `adresse` (`https://host`), `kiTraining` nach Entscheid des Betriebs, `crawlerListeGeprueft`, bei Cloudflare Pages `pagesProjekt` | TI5, TI6, TI10 | Bau läuft ohne Fehler |
| 2 | Bau: `robots.txt` ohne Sperre der Seiten, mit `Sitemap:`; `sitemap.xml` ohne 404; `canonical` auf sich selbst; kein `noindex` | TI1 bis TI4, TI8, TI11, TI12, S28 | Dateien in `dist/` lesen; Prüflauf mit `vorschau: false` |
| 3 | Weiterleitungen am Hoster, jede Zeile mit `301`, Parameter über Funktion oder Domain-Regel | TI20 bis TI23 | Nachbildung offline, dann `curl -sI` je Zeile |
| 4 | Domain verbinden, HTTPS, eine Hostvariante | TI25, TI35, [betrieb.md](betrieb.md) Teil 2 | `curl -sI http://…` und die andere `www`-Variante leiten mit einem Sprung weiter |
| 5 | Online prüfen: Hauptadresse ohne `noindex`; `<projekt>.pages.dev` mit `noindex`; unbekannte Adresse liefert 404; Kopfzeilen da | TI10, TI17, [betrieb.md](betrieb.md) Teil 3 | `curl -sI` |
| 6 | Einreichen: Sitemap in Search Console und Bing; Inhaber ist der Betrieb | TI14, TI15, M8, M17 | Status «Erfolgreich» |
| 7 | Bei neuer Domain: Adressänderung in Search Console | TI26 | Prüffrage |
| 8 | Weiterleitungen und alte Domain behalten, mindestens 365 Tage | TI27 | Daten in der Liste |
| 9 | Nachprüfung nach 1, 4 und 12 Wochen: jede Zeile online, Indexierung, Sitemap | TI29 | Datum und Ergebnis je Termin |
| 10 | Feldwerte (CrUX, Search Console) nachliefern, sobald es Daten gibt | WP5 | Werte mit Datum im Bericht |
| 11 | Messung: Zwischenstand Suche nach 8 Wochen, Urteil über Anfragen nach 3 Monaten | zusammenspiel Entscheid 11 | im Messplan |

## WP9 · Livegang

Jede Zeile 1 bis 8 mit Datum und Ergebnis im Bericht; die Termine für Zeile 9 bis 11 stehen im Kalender des Betriebs. Was nicht lief, heisst «nicht gelaufen».

## Zurück zur Vorschau

`vorschau` wieder auf `true` setzen und neu bauen: `noindex` kommt zurück, Sitemap und `canonical` verschwinden.
