# Korrektur Footer (Entwurf C)

Stand 04.11.2026. Worktree `autospeedy-c`, Branch `claude/autospeedy-c`. Reihenfolge: nach KORREKTUR-MOTION.md.
Screenshots: `korr-fuss-desktop.png`, `korr-fuss-handy.png` (erzeugt mit `bau/korr-fuss-screens.mjs`).

## Zuerst geprueft: doppelter Aufruf → verbunden

Vor der Korrektur lagen **zwei** Abschluss-Elemente hintereinander:
`Abschluss.astro` (`.schluss`) war bereits ein grosser Aufruf — Titel «Schaden passiert. / Wir kümmern uns
darum.», zwei grosse CTAs (Schaden melden + Anrufen) und ein Fakten-`dl` mit Adresse/Öffnungszeiten/Kontakt —
und direkt darunter die schmale Fusszeile (`Fuss.astro`).

Laut Auftrag darf das nicht gedoppelt werden («ein letzter Aufruf, nicht zwei hintereinander»). Darum sind
**Abschluss und Fuss zu einem Block verbunden**: `Abschluss.astro` wurde entfernt, seine Rolle ist vollstaendig
in den neuen `Fuss.astro` aufgegangen. Der Fuss liegt im Layout (`Klar.astro`) und ist damit auf **jeder** Seite
der eine, einheitliche letzte Aufruf — vorher war der grosse Aufruf nur auf 4 Seiten (Start, Tesla, Leistungen,
Team), die uebrigen hatten gar keinen. Die vier Seiten verlieren nur die Zeile `<Abschluss …>`; nichts anderes.

Folgen:
- Die Handyleiste beobachtet nun `.fuss` statt `.schluss, .fuss` (gleiche Wirkung: Leiste verschwindet, sobald
  der letzte Aufruf im Bild ist, weil dort dieselben Knoepfe stehen).
- Der frühere Anker `#kontakt` entfaellt; er war nirgends verlinkt (die Navigation zeigt auf die Seite `/kontakt/`).

## Aufbau des neuen Fuss (von oben nach unten)

1. **Letzter Aufruf** «Schaden? Rufen Sie an.» (Source Serif 4, gross). Haupt-CTA **gefuellt**: Anrufen mit
   Telefonnummer als `tel:`-Link (Archivo tabular-nums), daneben sekundaer «Schaden melden» (Kontur). Am Handy
   ist der Anruf-Knopf volle Breite (`.ctas .knopf { flex: 1 1 100% }`).
2. **Öffnungsstatus live** als Text, z. B. «Jetzt offen, bis 12.00 Uhr.» / «Jetzt geschlossen, Montag ab 7.30 Uhr
   offen.». Der farbige Punkt ist **nur zusaetzlich** (`::before`, erst wenn das Skript `data-zustand` setzt).
   **Ohne JavaScript** steht nur die neutrale Zeile «Öffnungszeiten siehe Kontakt.» — kein `data-zustand`, kein
   falscher Zustand im HTML. Wortlaut aus `texte.json` (`mikrotexte.status`), nichts erfunden.
3. **Adresse** als Text + Link «Route in Google Maps öffnen» (`betrieb.route`, neuer Tab, `rel="noopener"`).
   Keine eingebettete Karte.
4. **Slogan** «Qualität, die man sieht und fährt.» sehr gross (`clamp(56px, 11vw, 150px)`), Source Serif 4, blass,
   unten durch den Rand leicht angeschnitten (`.fuss { overflow: hidden }`). Echter Text (nicht `aria-hidden`).
   Einmaliges weiches Einblenden nur bei `prefers-reduced-motion: no-preference` (via `.js-bewegung` + `beobachte`),
   nur `opacity`/`transform`, keine Laufschrift.
5. **Rechtszeile**: © Jahr Auto Speedy AG · Impressum · Datenschutz · Bildnachweise · «Nach oben ↑». «Nach oben»
   springt ohne Skript (`href="#top"`), mit Skript ruhiges Scrollen, bei reduzierter Bewegung springend.
6. **Ganze Woche** als `<table>` mit tabular-nums, nach Tagesgruppen (`betrieb.zeiten`, dieselbe Quelle wie
   `Zeiten.astro`), inkl. künftiger Ausnahmen (Feiertage/Ferien). Die heutige Zeile markiert das Skript als Text
   «heute»; ohne Skript steht die vollstaendige Tabelle.
7. **Kopieren** bei Telefon und Adresse: kleine `<button>` (ohne Skript versteckt, erscheinen nur mit
   Clipboard-API). Bestaetigung «Adresse kopiert» / «Telefon kopiert» über eine `aria-live="polite"`-Zeile.
   Logik in `klar.js`.
8. **WhatsApp**: bewusst **weggelassen** (siehe offene Punkte). **Flotten-Zeile** «Für Flotten und Versicherungen:
   Firmenkunden» verlinkt auf die bestehende Seite `/flotten/`.
9. **Reihenfolge am Handy**: Anruf → Status → Zeiten → Adresse → Slogan (siehe `korr-fuss-handy.png`).

## Status-Berechnung (rein und testbar)

`berechneStatus(daten, jetzt)` in `klar.js` ist eine reine Funktion: aus den Daten (`data-fuss` am `<footer>`:
Zeiten je Wochentag in Minuten, Ausnahmen je Datum, Status-Texte) und einem Zeitpunkt leitet sie `{ offen, text }`
ab. Zeitzone **Europe/Zurich** (über `Intl`), Mittagspause durch die zwei Fenster je Tag, Feiertage/Ferien durch
die Ausnahmen (leeres Fenster = an dem Tag geschlossen). Im Browser wird sie mit `new Date()` aufgerufen und auf
`[data-status]` geschrieben; für Tests ist sie als `window.__klar.status` zugaenglich.

Kein Inline-Skript: die Daten liegen als `data-fuss`-Attribut am `<footer>` (ein Datenblock, kein ausfuehrbares
Skript), passend zur strengen CSP `script-src 'self'`.

Getestete feste Uhrzeiten (Winter = CET, in `test/browser.test.mjs`):

| Fall | Zeitpunkt (Zürich) | Ergebnis |
|---|---|---|
| offen | Mo 10:00 | «Jetzt offen, bis 12.00 Uhr.» |
| Mittagspause | Mo 12:30 | «Jetzt geschlossen, heute ab 13.15 Uhr offen.» |
| Abend / öffnet morgen | Mo 18:00 | «Jetzt geschlossen, Dienstag ab 7.30 Uhr offen.» |
| Freitagabend / öffnet Mo | Fr 19:00 | «Jetzt geschlossen, Montag ab 7.30 Uhr offen.» |
| Wochenende / Sonntag | So 11:00 | «Jetzt geschlossen, Montag ab 7.30 Uhr offen.» |
| Feiertag geschlossen | Di 10:00 (Ausnahme leer) | «Jetzt geschlossen, Mittwoch ab 7.30 Uhr offen.» |
| Feiertag mit Sonderzeiten | Di 10:00 (Ausnahme 9–12) | «Jetzt offen, bis 12.00 Uhr.» |

Die Ausnahme in der Wochen-Tabelle und in `data-fuss` prueft `test/schluss.test.mjs` zusaetzlich mit einer
Fixture-`site.json` (relativ zum Build-Tag).

## Kontrastwerte (WCAG AA)

Flaeche des Fuss = `--grund` #f4f4f2.

| Element | Farbe | Kontrast | Vorgabe |
|---|---|---|---|
| Slogan (grosser Text) | #83858a | **3.35:1** | ≥ 3:1 (grosser Text) ✓ |
| Status-Text | `--tinte` #1d1e20 | 15.2:1 | ≥ 4.5:1 ✓ |
| «heute»-Markierung | `--akzent` #1566b8 | 5.26:1 | ≥ 4.5:1 ✓ |
| Links (Route, Flotten-Link) | #1566b8 | 5.26:1 | ≥ 4.5:1 ✓ |
| Freitag-Zeile, Flotten-Zeile | `--leise` #5b5f66 | 5.83:1 | ≥ 4.5:1 ✓ |
| Anrufen-Knopf (Text auf Akzent) | #fff auf #1566b8 | 5.2:1 | ≥ 4.5:1 ✓ |
| Status-Punkt offen (dekorativ) | #1b7f4b | 4.56:1 | nur zusaetzlich |
| Status-Punkt geschlossen (dekorativ) | #c0392b | 4.94:1 | nur zusaetzlich |

## Bewegung (Regeln der Motion-Korrektur eingehalten)

- Slogan-Einblenden und «Nach oben» nur ohne Reduced-Motion; Hover nur in `@media (hover: hover)`.
- Animiert werden ausschliesslich `transform`/`opacity` (kein Schatten/Blur). Kein Layoutsprung (CLS): Slogan
  reserviert seinen Platz, der Status-Wechsel bleibt einzeilig, der Punkt sitzt in einem `inline-flex`.

## Offene Punkte (nichts erfunden)

- **WhatsApp**: `betrieb.json` hat `whatsapp.nutzung_bestaetigt: true`, aber `whatsapp.nummer_bestaetigt: false`
  (Hinweis in den Daten: «ob genau diese Nummer WhatsApp hat, ist noch nicht bestaetigt»). Darum erscheint
  **kein** `wa.me`-Knopf; er wird eingeblendet, sobald `nummer_bestaetigt: true` gesetzt ist. Entscheid des
  Betriebs noetig.
- **Flotten-Zeile**: verlinkt auf die bestehende Seite `/flotten/` (Linktext «Firmenkunden»). Eine eigene
  Ansprechperson/Kondition fuer Firmenkunden steht noch nicht in den Daten (bereits als Lücke auf `/flotten/`
  vermerkt).
- **Samstag/Sonntag**: in den Betriebsdaten gibt es keine Wochenend-Zeile; die Tabelle zeigt nur die vorhandenen
  Gruppen (Mo–Do, Fr), wie `Zeiten.astro`. Es wird keine «geschlossen»-Zeile erfunden.

## Geaenderte Dateien

- `src/components/Fuss.astro` — neuer, vollstaendiger Fuss-Block (+ `data-fuss` für das Skript).
- `src/components/Abschluss.astro` — **entfernt** (in den Fuss verbunden).
- `src/layouts/Klar.astro` — `<Fuss ort={seite} />` (Zaehlung je Seite).
- `src/pages/{index,tesla,leistungen,team}.astro` — `<Abschluss …>` entfernt.
- `public/js/klar.js` — Status-Berechnung, «heute»-Markierung, Kopieren, «Nach oben».
- `public/css/klar.css` — Fuss-Stile neu; alter `.schluss`/`.fakten`-Block entfernt; Slogan-Einblenden.
- `test/schluss.test.mjs` — prueft nun den Fuss-Block (Struktur, `data-fuss`, Ausnahme in der Wochen-Tabelle).
- `test/browser.test.mjs` — `.schluss` → `.fuss`; neue Status- und Kopieren-Tests.
- `bau/korr-fuss-screens.mjs` — Hilfsskript für die Screenshots (nicht Teil des Baus).

## Prüfungen

- `npm run build` (astro-klar): **grün**, 15 Seiten.
- `npm test` (astro-klar): **grün**, 112 Tests (inkl. neuer Status-/Fuss-/Kopieren-Tests, Browser mit Chrome).
- `astro`-Tests (`node --test test/*`): **grün**, 36 Tests. Das `astro`-Projekt wurde nicht veraendert; sein
  `npm run build` liess sich im Sandbox-Arbeitsverzeichnis (fest auf `astro-klar`) nicht ausloesen — da keine
  Datei unter `astro/` oder `gemeinsam/` geaendert wurde, ist sein Build von dieser Korrektur nicht betroffen.

Nichts gepusht, gemergt oder deployed. Keine echte Mail. Keine neuen Pakete. `cockpit/` unveraendert.
