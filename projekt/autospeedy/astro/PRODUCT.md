# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Autofahrerinnen und Autofahrer aus Altstätten und dem St. Galler Rheintal, die gerade einen Schaden am Auto haben: Parkschaden, Unfall, Hagel, Kratzer oder Lack, Scheibe, Felge. Sie sind oft am Handy, manchmal direkt nach dem Schaden, und wollen schnell wissen, wo sie melden, wen sie anrufen und ob die Versicherung abgewickelt wird.

Weitere bestätigte Gruppen:
- Tesla-Besitzer, die eine zugelassene Carrosserie suchen (Wunsch 2 des Betriebs).
- Keine eigene Zielgruppe «Firmen und Flotten» und kein Leasing (Roni 09.11.2026). Beim Autohandel gibt es nur Verkauf und Ankauf.
- Leute, die eine Occasion kaufen oder ihr Auto verkaufen wollen.

Der Betrieb selbst (Annahme, Administration) liest Meldungen im Cockpit und pflegt Zeiten, Ferien, Hinweis und Team. Er gilt als nicht technikaffin [Entscheid · Studio, 02.11.2026].

## Product Purpose

Die Website der Auto Speedy AG, Carrosserie und Spritzwerk in Altstätten SG. Sie bringt Schadenmeldungen und Anrufe. Hauptaktion ist die Schadenmeldung «in drei Tipps» (Art, Fotos, Kontakt), gesendet über die Website oder WhatsApp. Zweitaktion ist der Anruf.

Erfolg heisst: Wer einen Schaden hat, meldet ihn ohne Hilfe vom Handy aus, mit Fotos, und der Betrieb bekommt eine vollständige Meldung. Gemessen wird nach dem Livegang über Zählpunkte ohne Cookies.

## Positioning

- Tesla Approved Body Shop, vom Studio bestätigt; in Teslas eigener Werkstattsuche nicht nachgeprüft (fakten.md F14).
- Zertifizierte K + L Partner laut bisheriger Website: Tesla, AMAG, Land Rover, Ayvens (F12, kein Zertifikat gelesen).
- Schadenabwicklung mit der Versicherung, ausschliesslich Original-Ersatzteile, neue grössere Lackierkabinen (F5, F6).
- Ausbildungsbetrieb, Mitglied Carrosserie Suisse, Sektion Ostschweiz (F8).

## Operating Context

- Schadenmeldung immer erreichbar: «Schaden melden» im Kopf jeder Seite, am Handy in der Leiste unten mit dem Telefon (Entscheid 1).
- Fotos werden im Browser verkleinert; die Meldung geht ins Werkstatt-Cockpit oder per Mail, bestätigt wird nur bei Antwort des Servers.
- Der Betrieb pflegt Zeiten, Feiertage, Hinweis und Team selbst im Cockpit; die Website baut bei jedem Commit neu.
- Occasionen stehen auf AutoScout24 (seller-67678); Google-Bewertungen und AutoScout24 laden erst nach Klick.
- Zwei Gestaltungslinien mit je eigener DESIGN.md: «Lack» (`astro/`, eigene DESIGN.md) und «Klar», Entwurf C «Werkbank x Messblatt» (`astro-klar/`, eigene DESIGN.md, Arbeitsstand 04.11.2026). Welche live geht, entscheidet das Studio mit dem Betrieb.

## Capabilities and Constraints

- Astro 7.4.1, statische Ausgabe, Cloudflare Pages; Node ab 22.22.0.
- Hell und übersichtlich (Entscheid 3); Dunkelmodus folgt dem Gerät, Knopf im Kopf wählt für den Besuch um und speichert nichts.
- Vorbild greco-car.ch: Wirkung und Techniken lernen, nichts kopieren (Entscheid 4).
- Keine Preise, Fristen, Garantien oder Superlative ohne Freigabe; «Beste Preise garantiert» der alten Website ist bewusst nicht übernommen (F13).
- Keine Cookies, kein Tracking, Schriften lokal, fremde Inhalte erst nach Klick.
- Nichts ist live, nichts ging an den Betrieb; Vorschau mit `noindex`.
- Offen: Samstag, Feiertage, Ferien, Notfall (F4); Gründungsjahr (F10); Rückrufzeit; WhatsApp-Nummer; Konditionen für Firmenkunden und Ersatzwagen; welche Tesla-Leistungen genau.

## Brand Commitments

- Name «Auto Speedy AG», Logo mit dem blauen S-Schwung; nur als Rasterbild vorhanden, Vektordatei fehlt.
- Anrede «Sie» [Annahme, vom Betrieb zu bestätigen]. Schweizer Schreibweise mit «ss».
- Tesla erhält einen eigenen, schnellen Einstieg (Wunsch 2).

## Evidence on Hand

- Fakten mit Quelle: `fakten.md` (F1 bis F18). Entscheide: `entscheide.md`. Richtung: `richtung.md`.
- Fotos von der bisherigen, öffentlichen Website des Betriebs: Halle, Werkstatt, Felgen, Folierung, Team (10 Porträts) unter `astro/public/bilder/`. Rechte und Einwilligung des Teams sind noch zu bestätigen.
- Partnerlogos von autospeedy.ch übernommen; Nutzung mit den Partnern zu bestätigen.
- Nicht vorhanden und nicht zu erfinden: Kundenbewertungen als Text (nur live von Google), Fallbeispiele, Vorher-nachher-Fotos, Preise, Jahreszahlen.

## Product Principles

1. Schaden melden geht immer und in drei Tipps, auch mit einer Hand am Handy.
2. Nur Belegtes steht da; jede Lücke bleibt als sichtbarer Satz stehen, bis der Betrieb sie füllt.
3. Hell und übersichtlich vor Effekt; Bewegung nur, wo sie etwas zeigt, und nie unter «Bewegung reduzieren».
4. Der Betrieb pflegt selbst, ohne Technik zu verstehen.

## Accessibility & Inclusion

WCAG 2.2 AA in beiden Lacken: Kontrast, Fokus, Tastatur, Reduced Motion, Formular und Schadenstellen ohne JavaScript nutzbar, Tippziele mindestens 44 × 44 px.
