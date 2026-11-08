# Schweizer Pflichtangaben, lokales SEO und AEO

Prüfliste für Websites Schweizer Betriebe. Keine Rechtsberatung: Texte für Impressum und Datenschutz stellt der Betrieb bereit oder lässt sie prüfen. Fehlende Angaben sind ein Blocker für die Veröffentlichung, nicht für eine interne Vorschau.

## Pflichtseiten und Angaben
- **Impressum:** Firmenname laut Handelsregister, Rechtsform, Adresse, E-Mail, Telefon, ggf. UID-Nummer, verantwortliche Person. Vom Betrieb bestätigen lassen.
- **Datenschutzerklärung (revDSG, seit 1.9.2023):** welche Daten (Formulare, Server-Logs, Karten, Analyse), Zweck, Empfänger und Länder (Hosting, Formulardienst, E-Mail-Anbieter), Aufbewahrung, Rechte der Betroffenen, Kontakt. Formulare verweisen auf die Erklärung.
- **Schriften selbst hosten**, keine externen Google-Fonts-Aufrufe. Karten und Videos erst nach Klick laden (Zwei-Klick-Lösung) oder als statisches Bild mit Link.
- **Keine Analyse- oder Werbe-Tracker** ohne ausdrücklichen Entscheid des Betriebs; falls doch: in der Datenschutzerklärung nennen und Einwilligung prüfen.
- **Formulare:** nur nötige Felder, Spam-Schutz ohne Tracking bevorzugen, Sendung serverseitig, keine Daten in URL-Parametern.

## Lokales SEO
- Einheitliche Angaben zu Name, Adresse, Telefon (NAP) auf jeder Seite (Fusszeile), identisch mit dem Google-Unternehmensprofil.
- Pro Leistung eine eigene Seite mit Ort im Titel und in der H1, wo es natürlich passt (z. B. «Hagelschaden reparieren in Musterort»). Keine Ortsseiten ohne echten Bezug.
- `lang="de-CH"`, Schweizer Schreibweise («ss»), CHF wo nötig.
- Titel ≤ 60 Zeichen, Beschreibung ≤ 155 Zeichen, eine H1 pro Seite, sprechende URLs, sitemap.xml, robots.txt, Canonical.
- Strukturierte Daten (JSON-LD): passender LocalBusiness-Untertyp (z. B. AutoBodyShop, AutoRepair), Adresse, Telefon, Öffnungszeiten aus derselben Datenquelle wie die Seite, Geo-Koordinaten, `sameAs` zum Unternehmensprofil; Service pro Leistung; BreadcrumbList; FAQPage nur für sichtbare FAQ.
- Bilder: beschreibende Dateinamen und Alt-Texte, moderne Formate, feste Masse gegen Layoutspringen.

## AEO (Antworten für KI-Assistenten)
- Häufige Kundenfragen sichtbar als FAQ beantworten, kurz und konkret, ohne erfundene Zahlen oder Fristen.
- `llms.txt` aus denselben Daten erzeugen wie die Seite, damit nichts auseinanderläuft.
- Entscheid des Betriebs zu KI-Crawlern in robots.txt dokumentieren.
- Formulare für Agenten bedienbar: echte Labels, native Eingabeelemente, klare Fehlermeldungen.

## Prüfliste für QA
| Punkt | Beleg |
| --- | --- |
| Impressum und Datenschutz erreichbar (Fusszeile, jede Seite) | Screenshot + URL |
| Keine Anfragen an fremde Schrift-/Tracking-Server beim ersten Laden | Netzwerkliste |
| NAP identisch auf allen Seiten und im JSON-LD | Ausgabe des Vergleichs |
| JSON-LD parsebar, Typen wie oben | Validator-Ausgabe (lokal) |
| Eine H1 pro Seite, Titel/Beschreibung in Länge | Liste je Seite |
| sitemap.xml und robots.txt vorhanden | Inhalt |
