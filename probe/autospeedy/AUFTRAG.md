# Auftrag: Website für Auto Speedy AG (Probe mit design-uni und text-uni)

Stand: 1. November 2026 · Branch `claude/text-uni-und-probe` · nichts veröffentlicht, nichts gemergt.

## Wortlaut des Auftrags

> Also Baue mit den beiden Skills in diesem Repo (skills/design-uni und skills/text-uni) eine Website für den Betrieb Auto Speedy. Nutze nur öffentlich zugängliche Angaben über den Betrieb, die du selbst im Netz findest (Website https://www.autospeedy.ch/, Google-Profil, Verzeichnisse, Handelsregister). Erfinde keine Fakten. Halte deinen Auftrag und alle Quellen im Ordner probe/autospeedy/ fest. Bilder: nur Fotos von der Website des Betriebs oder sichtbar markierte Platzhalter. Nichts geht live, nichts wird gemergt; arbeite auf dem Branch claude/text-uni-und-probe und pushe dorthin.

## Wie ich den Auftrag gelesen habe

| Punkt | Lesart | Folge |
|---|---|---|
| «mit den beiden Skills» | Verfahren aus `skills/design-uni/SKILL.md` (Schritte 1 bis 11, Prüfpunkte P0 bis P8) und `skills/text-uni/SKILL.md` (Schritte 1 bis 9, T0 bis T8), nach dem Abschnitt «Zusammenarbeit» im Text-Uni-Skill | Eine Faktenliste, eine Entscheide-Liste, ein Antwort-Plan vor dem Bau, Text vor Gestalt |
| «nur öffentlich zugängliche Angaben» | kein Gespräch mit dem Betrieb, keine Anfrage an den Betrieb, keine Kontozugänge | Jede Aussage trägt Quelle und Datum in [fakten.md](fakten.md); was fehlt, bleibt Lücke ([luecken.md](luecken.md)) |
| «Erfinde keine Fakten» | auch keine Preise, Fristen, Garantien, Jahre, Zusagen | Keine Preise auf der Seite, keine Antwortfrist, kein Gründungsjahr, kein Notfalldienst |
| «Bilder nur von der Website des Betriebs» | Fotos von `autospeedy.ch` (Wix-Medien), sonst sichtbar markierter Platzhalter | [bilder/INVENTAR.md](bilder/INVENTAR.md); keine Porträts von Mitarbeitenden, keine Drittlogos, keine Stock- und KI-Bilder |
| «Nichts geht live, nichts wird gemergt» | Vorschau mit `noindex`, `robots.txt` sperrt, keine Domain, kein PR | Push nur auf `claude/text-uni-und-probe` |

## Abweichungen von den Skills (mit Grund)

1. **Kein Gespräch mit dem Betrieb** (design-uni Schritt 2, text-uni Schritt 1). Das Richtungs- und Angebotsblatt stützt sich auf öffentliche Quellen und Fotos. Jede Antwort ist als `[Fakt]`, `[Annahme]` oder `[Lücke]` markiert. P0 ist deshalb nur teilweise erfüllt.
2. **Keine Unteragenten gestartet.** Die Blindtests (P1, P4, P5, P8, T2, T4, T5, T6) und die Kunden-Agenten (P7) brauchen Unteragenten. Der Auftrag nennt sie nicht; ich habe sie nicht von mir aus gestartet. Alle diese Prüfpunkte heissen im Bericht **«nicht gelaufen»**. Der Skill hält an dieser Stelle an (`P1`); ich habe trotzdem gebaut, weil der Auftrag den Bau verlangt. Das ist ein Entscheid des Auftraggebers, der den Skill-Halt übersteuert (Grundregel 4 in design-uni).
3. **Kundenworte unter der Schwelle.** T0 verlangt 30 wörtliche Aussagen aus 2 Quellenarten. Öffentlich fanden sich 15 Texte aus Google-Bewertungen und 1 aus local.ch ([kundenworte.md](kundenworte.md)). T0 gilt als **nicht erfüllt**.
4. **Suchbegriffe ohne Search Console und ohne Autovervollständigung.** Der Antwort-Plan stützt sich auf Verzeichniskategorien, Treffer, die Begriffe des Betriebs selbst und Branchenwissen. Alle Begriffe sind `[Annahme]`.

## Nachträge während des Baus

Der Auftraggeber hat den Wunsch des Kunden mitgeteilt (E6 bis E9 in [entscheide.md](entscheide.md)): helle Seite; auf jeder Seite ein Knopf «Schaden melden»; Tesla-Seite, weil der Betrieb Tesla-Partner ist und Weiterleitungen von Tesla bekommt; «sauber, informativ, simple to use», Formulare mit wenigen Klicks und Angaben. Ausserdem: Google-Bewertungs-Karten, das Formular schreibt nur eine E-Mail, Tesla-Modelle wählbar. Alles ist umgesetzt oder als Lücke ausgewiesen.

## Was entstanden ist

```
probe/autospeedy/
├── AUFTRAG.md            dieses Blatt
├── QUELLEN.md            jede gelesene Quelle mit Datum, Zweck und Status
├── fakten.md             Faktenliste mit Quelle, Widersprüchen und Lücken
├── luecken.md            was fehlt und wer es klären muss
├── entscheide.md         Entscheide des Auftraggebers und Annahmen
├── kundenworte.md        Kundenworte, sortiert und gezählt, ohne Personendaten
├── richtung.md           Inventar, Sieben, Kandidaten, Entscheidung, Ableitung
├── antwort-plan.md       Seitenplan nach text-uni Schritt 2
├── register.md           Abstandsregister mit Messung
├── tokens.json           Design Tokens (W3C DTCG) mit Namen aus dem Betrieb
├── bilder/               Inventar und Aufbereitung der Fotos
├── site/                 die Vorschau: 12 Seiten, statisches HTML, CSS, JS, lokale Schriften
├── daten/                bewertungen.json (Zitate, Einwilligung offen)
├── livegang.md           was vor einem Livegang geschehen muss
├── werkzeuge/            Bauskript und Prüfskripte mit Selbsttest
├── pruefung/             Ergebnisse der maschinellen Prüfungen
├── zusagen-blatt.md      jede Zusage und jedes Faktum zur Freigabe
├── messplan.md           Messplan nach M11 und conversion.md Teil 7
└── LIESMICH.md           Stand, Prüfpunkte mit Zahlen, was nicht geprüft ist
```

Ein früherer Lauf mit anderem Ergebnis liegt auf dem Branch `claude/epic-pascal-akk7h1`. Ich habe ihn **nicht gelesen**, damit diese Probe unabhängig bleibt.
