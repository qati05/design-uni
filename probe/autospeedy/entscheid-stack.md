# Auto Speedy: Anforderungsblatt und Stack-Entscheid (web-uni V0 bis V3)

Stand 1. November 2026. Verfahren: `skills/web-uni/SKILL.md`. Kennzeichen: `[Fakt · Quelle]`, `[Annahme]`, `[Lücke]`.

## V0 · Anforderungsblatt

| # | Punkt | Stand |
|---|---|---|
| 1 | Ziel | Schaden melden (Formular) und Anruf. Tesla-Fälle sollen sich sofort finden. `[Fakt · kundenworte.md]` |
| 2 | Wunsch des Kunden | «sauber, informativ, simple to use», helle Seite, Schadenmeldung überall als CTA, Tesla-Partnerseite, wenige Klicks und Angaben, Google-Bewertungskarten, Formular schreibt nur eine E-Mail. `[Fakt · kundenworte.md]` |
| 3 | Besucher und Geräte | Anteil Handy unbekannt `[Lücke]`. Wer einen Schaden hat, steht oft neben dem Auto: Handy, Mobilnetz `[Annahme]`. |
| 4 | Inhalte | 12 Seiten, 22 Fotos aus dem Auftritt des Betriebs, keine Videos, keine 3D-Modelle `[Fakt · site/]`. |
| 5 | Funktionen | Formular mit Tesla-Weiche, Öffnungsstatus, Bewertungskarten. **Keine** Zahlung, **kein** Shop, **keine** Konten, einsprachig Deutsch. |
| 6 | Pflege | Heute Wix `[Fakt · fakten.md]`. Wer künftig Zeiten, Fotos und Occasionen ändert: `[Lücke]`. |
| 7 | Budget, Frist | `[Lücke]` |
| 8 | Recht und Daten | Schweiz (DSG). Das Formular erhebt Name, Telefon und (gewünscht) Schadenfotos: Personendaten. Hosting-Standort und Datenschutzerklärung nötig. |
| 9 | Bestand | Alte Wix-Adressen als 301 weiterleiten (`livegang.md`). |
| 10 | Messung | Anrufe, gesendete Schadenmeldungen, Klicks der Tesla-Weiche (`messplan.md`). |

**Wunsch in einem Satz:** Wer einen Schaden hat, soll in wenigen Klicks melden können, und Tesla-Fahrer sollen ohne Suchen am richtigen Ort landen.

## V1 · Klasse

Verlangt wird: schnelle Seite, ein Formular mit Fotoanhang, wenig Inhalt, selten Änderungen (Zeiten, Fotos, Occasionen). Nichts verlangt Konten, Zustand oder Zahlung. Klasse A oder B; E (Zuschlag) nicht verlangt.

## V2 · Stack-Entscheid

**Wahl (bedingt, siehe V2-Gegenprüfung):** Klasse A beibehalten (statisches HTML mit Bauskript; Laborwerte: Score 97, 3,6 KB JS), **wenn** ein Entwickler die Seite dauerhaft pflegt. **Dazu** ein kleiner Server-Endpunkt für das Formular (nimmt Name, Telefon, Fotos entgegen und verschickt **eine E-Mail**). Lautet die Antwort auf Zeile 6 «der Betrieb pflegt selbst, ohne Entwickler», gilt die Wahl **nicht**; dann Astro mit Inhaltsdateien (erst Spike) oder ein Baukasten.

**Weil:**
1. Die Seite braucht weder Konten noch Zustand noch Zahlung (Zeile 5); Next.js kostete im Spike +133 KB JS und rund 1 s LCP im Labor, und für diese Seite ist kein Gegenwert erkennbar (`skills/web-uni/referenzen/messungen.md`). Dieser Vergleich widerlegt nur Next.js, nicht Astro oder einen Baukasten.
2. Der Erfolg ist ein Anruf oder eine Meldung auf dem Handy: Geschwindigkeit ist hier Schwelle, kein Ziel (web-uni Grundregel 10): Über «gut» ist kein zusätzlicher Gewinn belegt, und eine Wirkung auf Besucher ist nicht gemessen.
3. Die Seite steht bereits und besteht 50 Maschinenprüfungen (`pruefung/selbsttest.txt`, `werkzeuge/pruefen.cjs`); ein Umbau auf einen anderen Stack würde Zeit kosten und keine der Kundenforderungen erfüllen (Zeile 2).

**Gegenentwurf 1: Astro (Klasse B) mit Inhaltsdateien.** Besser, wenn der Betrieb selbst pflegen will (Zeile 6 `[Lücke]`). `[nicht gebaut]`: Messung fehlt, deshalb heute kein Urteil. Vorher Spike bauen und gegen `statisch` messen.

**Gegenentwurf 2: Baukasten (Wix, Webflow).** Der einfachste Weg und der heutige Zustand. Der Betrieb pflegt selbst. Verlust: Tesla-Weiche, Fotoformular und Marke sind begrenzt umsetzbar `[Annahme]`; Fremd-Skripte; Geschwindigkeit nicht gemessen. **Das ist der stärkste Mitbewerber**, falls die Antwort auf Zeile 6 «ohne Entwickler» lautet.

**Der einfachste Weg** = Baukasten. Was der Kunde dabei verliert, ist `[Annahme]`, nicht belegt. Entscheid fällt mit Zeile 6.

**Bewegung und 3D (Stufe):** Hauptpfade Stufe 0. Optional eine Bewegung Stufe 1 (CSS, 0 KB JS) für die «Abdeckkante», nur wenn der blinde Test sie nicht schlechter bewertet. **3D: nein.** Begründung: Erfolg ist Anruf oder Meldung (Zeile 1); der Spike zeigte +240 KB JS und 3,4 s Blockierzeit im Labor; Tesla-Modelle nachzubauen wirft eine Markenrechtsfrage auf (`livegang.md` L8).

**Kosten und Pflege:** Bau `[Lücke]`. Laufend: Hosting mit Endpunkt, Standort Schweiz zu prüfen `[Annahme]`.

**Umkehrbarkeit:** hoch. Inhalte liegen als HTML und Daten vor und lassen sich in einen Generator (Astro) überführen.

## Was das Ergebnis der Probe wirklich verbessern würde (aus `pruefung/blindtest.md`)

Die blinden Bewerter beanstandeten vor allem **Material**, nicht den Stack: Logo nur als Pixelbild und klein, Handyfoto im Hero. Vektor-Logo und ein echtes Foto (Fototag) heben die Bewertung wahrscheinlich stärker als jede Technik `[Annahme, Hypothese]`.

## Organisation: der grössere Hebel (web-uni Grundregel 10)

Der Stack ist die kleinere Frage. Was zu mehr Aufträgen führen dürfte `[Annahme]`:
1. **Anfragekette:** Wer liest `info@autospeedy.ch`, zu welchen Zeiten, mit welcher Antwortzeit? Wer nimmt das Telefon ab, wenn die Werkstatt arbeitet (Öffnungszeiten Mo bis Fr, `fakten.md`)? Was geschieht nach einer Schadenmeldung (Rückruf, Termin, Besichtigung, Offerte)? **Die Seite darf nur versprechen, was diese Kette hält.** Bei Tesla-Fällen: wer bearbeitet sie, und mit welcher Referenz?
2. **Bewertungen:** 37 Google-Bewertungen, keine beantwortet (`livegang.md`). Antworten kosten keine Ladezeit.
3. **Google-Profil und Verzeichnisse:** Kategorie «Carrosserie» fehlt, local.ch nicht beansprucht (`livegang.md`).
4. **Pflege:** Wer ändert Zeiten, Fotos, Occasionen? (Zeile 6.)

## Offen, bevor gebaut wird

1. Wer pflegt die Seite? (entscheidet A, B oder Baukasten)
2. Formularweg: `mailto:` öffnet nur ein E-Mail-Programm, hängt keine Fotos an und scheitert auf Handys ohne eingerichtetes Mailprogramm `[Annahme]`. Ein Endpunkt löst das, braucht aber Hosting mit Funktion und Datenschutz-Entscheid.
3. Budget und Frist.
4. Zugang zu Vektor-Logo und einem Fototag.
5. Anfragekette: wer liest und beantwortet Schadenmeldungen, in welcher Zeit (siehe oben).

## V2-Gegenprüfung

Ein Agent ohne Vorwissen bekam nur dieses Blatt und `messungen.md` (2026-11-01). Seine drei Einwände:

1. **Pflege ist offen, der Entscheid steht trotzdem (stärkster Einwand).** Ohne Entwickler wäre eine handgebaute Seite ein Rückschritt gegenüber Wix. → **Übernommen:** Wahl ist jetzt bedingt; Astro bleibt Rückfall, Zeile 6 wird vor dem Bau geklärt.
2. **Der Endpunkt ist der Risikoträger und nicht bewertet** (Personendaten, Upload-Grenzen, Spam, Zustellung, Standort; grosse Fotos im Mobilnetz). → **Übernommen:** vor «Umkehrbarkeit hoch» ein Handy-Test mit Fotos (Grösse, Fehlerfall, Zustellung) und ein Datenschutz-Entscheid. Beides **nicht gelaufen**.
3. **Aussagen gehen über die Messung hinaus** («ohne Gegenwert», «Geschwindigkeit ist Funktion»; Next als Strohmann; Astro und Wix nie gemessen). → **Übernommen:** Formulierungen oben auf «Laborhinweis» und «dürfte» abgeschwächt. Der Vergleich widerlegt nur Next.js; für Astro und Baukasten fehlen Messungen. **Nächster Schritt:** Astro-Spike und Messung der heutigen Wix-Seite.

Der Prüfpunkt V2 gilt damit als **bedingt bestanden**, nicht als bestanden.
