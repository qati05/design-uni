# Entscheide des Auftraggebers

Sie gehen jeder Regel der beiden Skills vor (design-uni Grundregel 4, text-uni Grundregel 4).

## Entscheide

| Nr. | Entscheid | Quelle |
|---|---|---|
| E1 | Nur öffentlich zugängliche Angaben, die ich selbst im Netz finde (Website, Google-Profil, Verzeichnisse, Handelsregister). Keine erfundenen Fakten. | [Entscheid · Auftraggeber, 1. 11. 2026, Auftrag] |
| E2 | Auftrag und alle Quellen im Ordner `probe/autospeedy/` festhalten. | [Entscheid · Auftraggeber, 1. 11. 2026] |
| E3 | Bilder nur von der Website des Betriebs oder sichtbar markierte Platzhalter. | [Entscheid · Auftraggeber, 1. 11. 2026] |
| E4 | Nichts geht live, nichts wird gemergt. Arbeit und Push nur auf dem Branch `claude/text-uni-und-probe`. | [Entscheid · Auftraggeber, 1. 11. 2026] |
| E5 | Der Betrieb ist **Auto Speedy** (Auto Speedy AG, Altstätten). | [Entscheid · Auftraggeber, 1. 11. 2026] |

## Wunsch des Kunden (vom Auftraggeber weitergegeben)

Der Auftraggeber hat den Wunsch des Kunden am 1. 11. 2026 während des Baus genannt. Er geht allen Annahmen unten vor und ersetzt A2.

| Nr. | Wunsch des Kunden | Folge für Bau und Text |
|---|---|---|
| E6 | **Helle Seite, helle Farben.** | Weisser und hellgrauer Grund, heller Kopfstreifen, kein dunkler Grund. Das Grün des Abdeckbands bleibt der Akzent. |
| E7 | **Egal, wo der Besucher ist: ein CTA für die Schadenmeldung.** | Der Knopf «Schaden melden» steht in einem Kopfstreifen, der auf jeder Seite und auf jedem Gerät sichtbar bleibt, und am Ende jeder Seite noch einmal als Abschluss. |
| E8 | **Der Betrieb ist Tesla-Partner (Tesla Approved Body Shop) und bekommt Weiterleitungen von Tesla. Die Tesla-Leute sollen sich direkt klar finden.** | Eigene Seite `tesla.html` mit einer Zeile in der Navigation und einem Hinweis im Kopf jeder Seite; im Formular ein Kästchen «Der Fall kommt von Tesla» mit freiwilligem Feld für die Tesla-Referenz. Die Seite nennt **keinen** Ablauf von Tesla, den ich nicht kenne. |
| E9 | **«Sauber, informativ und simple to use»** für den Besucher in allem, auch in den Formularen: eine Schadenmeldung in wenigen Klicks und mit wenigen Angaben. | Ein Formular mit zwei Pflichtfeldern (Name, Telefon), drei freiwilligen Angaben; vom CTA bis zur E-Mail zwei Tipps; kein Pflichtfeld, das nicht gebraucht wird. |

E8 ist eine Aussage des Auftraggebers über den Kunden. Die Website des Betriebs zeigt ein Logo «TABS» in derselben Richtung ([fakten.md](fakten.md), Teil 5). Einen **Nachweis** (Vertrag, Zertifikat, erlaubtes Tesla-Zeichen) gibt es nicht öffentlich; er steht im [zusagen-blatt.md](zusagen-blatt.md) als offen.

## Annahmen (gelten, bis ein Entscheid sie ersetzt)

| Nr. | Annahme | Grund |
|---|---|---|
| A1 | Anrede «Sie». | Die Website des Betriebs siezt; ein Instagram-Auszug duzt (L12). text-uni CH4 gibt «Sie» als Vorgabe. |
| ~~A2~~ | ~~Hauptaktion ist der Anruf.~~ **Ersetzt durch E7:** Hauptaktion ist die **Schadenmeldung**; Zweitaktion ist der Anruf (071 755 88 61). | Auftraggeber, 1. 11. 2026 |
| A3 | **Statische** Website, kein Backend, keine Cookies, keine fremden Hosts. | design-uni Grundregel 9; Betrieb betreibt heute eine Wix-Seite. |
| A4 | **Keine Preise, keine Fristen, keine Garantien** auf der Seite. | L2, L4, L15; CH9, U20, A7. |
| A5 | Keine Porträtfotos und keine Drittlogos. | L8, L9; SLK B.7, B.10. |
| A6 | Die Vorschau ist `noindex`, `robots.txt` sperrt alles; keine Sitemap. | E4; TI9. |
| A7 | Eine Schreibweise der Firma: «Auto Speedy AG» (Handelsregister). | SLK B.10. |
