# Auto Speedy AG: Vorschau, Stand 02.11.2026

**Nichts ist live, nichts ist freigegeben, nichts ging an den Betrieb.** Gebaut ist nur der **erste Bildschirm** (Startseite) und eine Kontakt-Seite mit der Schadenmeldung. Alle übrigen Seiten stehen aus, bis das Studio entscheidet.

## Was gebaut ist
- `astro/`: Astro 7.4.1, statisch, Gerüst aus `skills/web-uni/vorlage-astro`. Starten: `cd astro && npm install && npm run build`, dann `dist/` mit einem beliebigen Server öffnen.
- Startseite `/`: Foto der Halle, Satz «Vom Kratzer bis zum Blechschaden.», `h1` «Carrosserie und Spritzwerk in Altstätten SG», drei Fakten, Tesla-Einstieg. Kopf mit Telefon und **Schaden melden** auf jeder Seite (Handy: Leiste unten).
- `/kontakt/`: Formular zur Schadenmeldung (ohne Server, öffnet das E-Mail-Programm), Anschrift, Zeiten.
- `vorschau/`: Bildschirmfotos Desktop 1440×900 und Handy 390×844.

## Abweichungen vom Verfahren (auf Weisung des Studios, 02.11.2026)
1. **Eingangstor DP0 + TP0 + WP0 nicht bestanden.** Es gab kein Gespräch mit dem Betrieb. Offene ★-Fragen: Logo als Vektordatei, Rechte an den Fotos, Wer gibt frei, Zusagen mit zuständiger Person, Geräte und Funktionen, Pflege, Budget, Daten, Anfragekette. Gebaut wird trotzdem, jede Lücke ist benannt.
2. **Foto-Rechte nicht bestätigt.** Das Hallenfoto stammt von der Website des Betriebs (Auftrag erlaubt das für die Vorschau). Schriftliche Zusage fehlt (`rechte.md`).
3. **Sieben und Richtung ohne Betrieb**, nur aus öffentlichen Quellen (`richtung.md`). Annahmen.

## Lücken, die der Betrieb füllen muss (sichtbar in der Vorschau oder in den Dateien)
- Tesla: keine öffentliche Angabe, ob und wie Auto Speedy Teslas repariert. Der Einstieg wählt nur «Tesla» im Formular vor und behauptet nichts. **Offen, ob die Tesla-Seite inhaltlich tragen kann.**
- Öffnungszeiten Samstag, Sonntag, Feiertage, Betriebsferien, Notfall; Freitag-Widerspruch (17.15 laut Website, 17.30 laut Instagram).
- Gründungsjahr (Register 2017, Website-Grafik «20 Jahre»), Bewertungen mit Stand-Datum, Zertifikate (K+L-Partner), Preise, Fristen, Ablauf nach der Anfrage.
- Logo als Vektordatei; eigene, aktuelle Fotos (Fototag).
- Impressum und Datenschutzerklärung: leer (HINWEIS im Bau). UID und Verwaltungsrat stammen nur aus Verzeichnissen, nicht aus dem Handelsregister.

## Nicht übernommen, bewusst
«Beste Preise garantiert» und «die besten Angebote» (unbelegt, R2/R14), Markenlogos, das Stockfoto der Kontaktseite, das Logo als Foto.

## Zusagen-Blatt (stimmt / ändern / streichen; Person und Stellvertretung offen)
| # | Aussage in der Vorschau | Quelle | Entscheid |
|---|---|---|---|
| Z1 | «Die Schadenabwicklung mit Ihrer Versicherung übernehmen wir.» | Betriebs-Website, Dienstleistungen | offen |
| Z2 | Öffnungszeiten Mo bis Fr wie oben | Fusszeile Betriebs-Website | offen |
| Z3 | «Wir melden uns bei Ihnen.» (Abschlusstext, ohne Frist) | Entwurf Studio | offen, braucht Anfragekette |

## Prüfstand (nichts davon ist «bestanden», wo nicht gemessen)
| Prüfung | Ergebnis |
|---|---|
| Bau `npm run build`, Stufe Gerüst | 0 FEHLER, 9 HINWEIS (fehlende Beschreibungen, Rechtsseiten), gelaufen |
| Kontrast aus der Kaskade, Start und Kontakt, 1440 und 390 px | 0 unter Soll, gelaufen (eigenes Skript, kein `pruefen.cjs`) |
| Überlauf quer 390 und 1440 px | keiner, gelaufen |
| Wörter im ersten Bildschirm | 68 Desktop, 67 Handy; Richtwert etwa 60 `[Annahme]`, **über dem Richtwert**, Hinweis |
| genau ein `h1`, Tippziele Hauptaktionen ≥ 44 px | ja, gemessen |
| Inhalt ohne JavaScript | Seiten sind statisches HTML; Formular-Rückmeldung braucht JS, das Formular selbst nicht; **nicht eigens geprüft** |
| `pruefen.cjs`, `slop-de.js`, Lighthouse, axe, Vorlagen-Signale | **nicht gelaufen** |
| Blinde Bewerter DP1, DP4, DP5, DP7, DP8, Menschentest, echte Geräte, Safari | **nicht gelaufen** |
| Recht (Impressum, Datenschutz, UWG-Prüfung) | **nicht gelaufen**, Rechtsprüfung nötig |
| Text nach text-uni (TP2 bis TP7) | Entwurf von Hand nach den Regeln, **kein** Testlauf |

## Dateien
`fakten.md` (Quellen) · `rechte.md` · `entscheide.md` · `technik.md` · `richtung.md` · `astro/` · `vorschau/`
