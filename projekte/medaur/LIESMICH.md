# Medaur · Prüfung und Umbau mit design-uni

Stand 31. Oktober 2026. Geprüft und umgebaut wurde die Website aus dem Artifact
«Websites für Betriebe, Entwurf vor Unterschrift · Medaur» (Fassung vom 28. Oktober 2026).
Verfahren: Kurzform «Prüfung ohne Bau» aus `skills/design-uni/SKILL.md`, danach Umbau und Nachprüfung.

Nichts ist veröffentlicht oder an Dritte gegangen. Das Artifact ist privat.

## Ergebnis in Zahlen

| Prüfpunkt | vorher | nachher | Schwelle |
|---|---|---|---|
| P4 Bildtest, Mittel aller 6 | 7,50 | 7,50 | ≥ 7,5 |
| P4 Bildtest, Opus / Sonnet | 6,67 / 8,33 | 7,33 / 7,67 | Abstand ≤ 1,5 |
| P4 «Agentur» | 5 von 6 | 6 von 6 | ≥ 4 von 6 |
| P4 Fünf-Sekunden-Test | 3 von 3 | nicht wiederholt | 3 von 3 |
| P7 erreicht | 2 von 6 | siehe unten | 6 von 6 |
| P7 «anfragen», Mittel | 5,0 | siehe unten | ≥ 8,0 |
| P7 «Vertrauen», Mittel | 5,2 | siehe unten | ≥ 7,0 |
| P6 maschinell | 4 Fehler | 0 Fehler | 0 |
| Lighthouse mobil, Median aus 5 | 97 / 100 / LCP 2,6 s | 98 / 100 / LCP 2,5 s | ≥ 90 |

Der Bildtest hat sich in der Note nicht bewegt. Unterschiede unter 0,5 Punkten sind laut Skill Streuung.
Bewegt haben sich der Anteil «Agentur» und der Abstand zwischen den Modellen, der vorher ein Befund war.

## Aufbau der Tests

- **Bewerter:** 3 × Opus, 3 × Sonnet, ohne Projektkontext, je eigene Reihenfolge.
- **Satz:** Medaur und 7 fremde Seiten, je Desktop 1440 × 900 und Handy 390 × 844 auf einem Blatt.
  Premium: emi-architekten.ch, bloomen.ch, qwstion.com. Regionale Webagenturen: fabo.ch, furrer-itx.ch, netify.ch.
  Falle: bloqlabs.ch («führende Webflow-Agentur» mit Vorlagen-Mustern).
- **Referenzen stabil:** emi 8,5 → 8,2 · bloomen 7,8 → 7,7 · qwstion 6,7 → 7,7 (Sprung von 1,0, ein Bewerter-Ausreisser je Runde).
- **Falle durchschaut:** bloqlabs lag in beiden Runden bei 4,5 und 4,3, mehrheitlich «Vorlage».
- **Geschwister-Test:** nicht gelaufen, weil es keine früheren Medaur-Websites gibt. Kein Bewerter ordnete Medaur einer anderen Seite im Satz zu.
- **Kunden-Agenten:** 3 Aufgaben × 2 Modelle am Handy mit `werkzeuge/kunde.cjs`, Testkopie mit Musterwerten statt Klammern.
- Sonnet-Bewerter vertauschten in 4 von 6 Tabellen die Bildnummern. Ausgewertet wurde nach der Beschreibung, nicht nach der Nummer.

## Befunde vorher

**Bedienung (Kunden-Agenten)**
- Auf Start- und Preisseite war keine Telefonnummer zu sehen. Die einzige tippbare Nummer lag tief unten im Formularkasten.
- Das Formular meldete nach dem Absenden «Es wurde nichts gesendet». Am Abend gab es so keinen Weg, sich zu melden.
- Inhalte waren nach dem Scrollen bis zu einer Sekunde unsichtbar und glitten noch. Ein Tipp auf «Alle Preise» ging deshalb daneben.
- Zählwerke zeigten im Vorbeiscrollen falsche Zahlen («CHF 0’000», «70/100»).
- Die Summe für das erste Jahr stand nur auf der Preisseite im Rechner.

**Angebot und Recht**
- Hero nannte CHF 2’900 für «1 bis 15 Mitarbeitende», obwohl es Start ab CHF 1’200 gibt.
- Impressum und Datenschutz zeigten Lücken in eckigen Klammern, dazu fehlte die bekannte Telefonnummer.
- MWST-Satz auf der Preisseite offen, obwohl das Impressum «nicht mehrwertsteuerpflichtig» sagt.
- Messwerte «0,9 s» und «100/100» liessen sich nicht nachmessen.

**Gestaltung (blind)**
- Stark: die Wortmarke mit dem gelben A, das konkrete Versprechen mit Preis.
- Schwach: leere Mitte am Desktop, Wortmarke doppelt (klein im Kopf, gross im Hero), kein eigenes Bild.

**Bewegung:** rund zehn Bewegungen, darunter eine Dauerschleife und ein Film in Schleife. Der Skill erlaubt eine.

## Was geändert wurde

- Telefon antippbar in Kopf und Fuss jeder Seite, oben auf der Preisseite, im Impressum und im Datenschutz.
- Formular ohne Eingang bietet «Per SMS senden» an: Die SMS-App öffnet sich mit Name, Nummer und Zeit an 078 857 53 73.
  Mit Eingang: Sperre gegen doppeltes Senden, Bestätigung mit Frist, bei Fehler wieder SMS.
- Pflichtfeld und Zweck am Knopf, Verantwortlicher mit Link auf den Datenschutz, Fehler am Feld ohne Verschieben des Knopfs.
- Eine Bewegung je Seite: Startseite Wortmarke und Sucher, Preisseite die Linie des Wegs. Alles andere steht.
- Hero nennt Ort, Zielgruppe, «ab CHF 1’200» und «mit Texten und Fotos CHF 2’900». Kopf zeigt nur das A.
- Preisabschnitt nennt die Summe im ersten Jahr: CHF 3’700 mit Pflege, CHF 4’800 mit Betreuung.
- Lücken als Sätze. MWST: «Endpreise in CHF. Medaur ist nicht mehrwertsteuerpflichtig.» (aus dem Impressum).
- Messwerte durch eigene Messung ersetzt: Lighthouse 12, Handy-Profil, Median aus 5 Läufen, 31.10.2026.
- `data-zaehl` und `data-ort` an allen Kontakt-Links und am Formular, für eine spätere Zählung ohne Cookies.
- Toter Verweis auf `index.md` entfernt.
- Englische Seite gleich behandelt.

## Offen, braucht Reshat

- **Formular-Eingang:** Das Supabase-Projekt «medaur» (Zürich) ist pausiert. Wird es reaktiviert und ein Endpunkt
  gebaut, gehört dessen URL in `data-endpoint` beider Startseiten. Bis dahin läuft der SMS-Weg.
- **Impressum:** Strasse, E-Mail-Adresse und UID-Nummer. Online-Angebote brauchen laut UWG Art. 3 lit. s eine E-Mail-Adresse.
- **Datenschutz:** Hosting der Website, Server-Protokolle, Aufbewahrungsdauer.
- **Belege:** Es gibt keine echten Kundenprojekte, Bewertungen oder Fotos von Reshat. Das Garagen-Beispiel ist als erfunden markiert.
  Die Bewerter nannten eigenes Material als Unterschied zu den besten Seiten im Satz.
- **Erreichbarkeit:** Zu welchen Zeiten jemand abnimmt, steht nirgends.

## Zusagen-Blatt (stimmt / ändern / streichen)

| Zusage | Wo | Prüfen |
|---|---|---|
| Rückruf am gleichen Werktag | Formular, Preisseite | Gilt das auch bei Anfragen nach Feierabend oder am Samstag? |
| Medaur ist nicht mehrwertsteuerpflichtig, Preise sind Endpreise | Impressum, Preisseite | stimmt / ändern |
| Online drei Wochen nach vollständigen Unterlagen | Startseite, Preisseite | stimmt / ändern |
| Erster Abo-Monat gratis, wenn nicht nach drei Wochen online | Preisseite | stimmt / ändern |
| Fehler im Code kostenlos behoben, auch nach Abnahme | Preisseite | stimmt / ändern |
| Code und Domain innert 10 Tagen nach Kündigung | Preisseite | stimmt / ändern |
| «Preise · Entwurf, Stand 28. Oktober 2026» | Preisseite oben | Sind die Preise noch ein Entwurf? Ein Agent las das als «unfertig». |

## Nicht geprüft

- Echte Geräte, Safari und iOS, insbesondere ob `sms:` mit vorausgefülltem Text auf allen Telefonen öffnet.
- Menschen aus der Zielgruppe. Alle Bewerter und Agenten waren Sprachmodelle.
- Die Preisseite im blinden Bildtest und die ganze Website (P8).
- Rechtliche Prüfung durch eine Fachperson.

## Werkzeug

`skills/design-uni/werkzeuge/kunde.cjs` sucht jetzt zuerst exakte Treffer und wartet nach dem Scrollen 1,2 s.
Vorher tippte es bei «Start» auf den Link «Startseite» statt auf die Auswahl «Start». Der Selbsttest besteht weiterhin.
