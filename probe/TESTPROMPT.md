# Testprompt für Claude Code

Zweck: prüfen, ob design-uni, text-uni und web-uni **aus Kundenangaben allein** gemeinsam eine Website bauen, die den blinden Vorfilter und die maschinellen Prüfungen besteht; ob sie der gemeinsamen Abfolge in `skills/design-uni/referenzen/zusammenspiel.md` folgen; und ob die Werkzeuge (Techniken, Vorbilder-Band, Galerie, Prüflauf) im Lauf wirklich benutzt werden.

## Vorbereitung (Mensch, einmal)

1. Patches gemergt; in Claude Code im Repo-Ordner starten. Skills liegen unter `skills/`; für den Test nach `.claude/skills/` kopieren:
   ```
   mkdir -p .claude/skills && cp -R skills/design-uni skills/text-uni skills/web-uni .claude/skills/
   npm i -D playwright && npx playwright install chromium
   ```
2. Einen Ordner `probe/<kunde>/eingabe/` anlegen mit:
   - `kundenangaben.md` (ausgefüllte Vorlage aus `skills/design-uni/eingabe/kundenangaben.md`, mit den Teilen für text-uni und web-uni; alle ★-Fragen beantwortet oder als Lücke bestätigt),
   - `logo/` und `fotos/` mit Rechten.
   Am besten ein **echter** nächster Kunde. Ohne eigene Fotos misst der Test nur den Schrift-Weg (DL10, DL11). Kundenworte und Einwilligungen mit Namen bleiben beim Betrieb, nicht im Repository.
3. Für einen Lauf ohne Kunden: den erfundenen Übungsbetrieb nehmen (siehe unten, Variante B). Dann gilt alles als Übung; nichts geht an einen Betrieb.

## Variante A: echter Kunde (in Claude Code einfügen, `<kunde>` ersetzen)

```
Nutze die Skills design-uni, text-uni und web-uni, nach der gemeinsamen Abfolge in
skills/design-uni/referenzen/zusammenspiel.md Teil 6.

Eingabe: probe/<kunde>/eingabe/kundenangaben.md, dazu logo/ und fotos/ im selben Ordner.
Baue daraus eine Vorschau der Website in probe/<kunde>/site/ (Stack nach web-uni WP2;
Vorschau mit noindex, robots.txt ohne «Disallow: /»; keine fremden Hosts ohne Not).

Ablauf, insbesondere:
- Eingangstor DP0 = TP0 = WP0 einmal: Fehlen ★-Angaben oder Rechte an Bildern, Logo,
  Schriften, halte an und liste sie auf, statt zu raten.
- WP1 Klassen, TP1 Antwort-Plan; gebaut wird keine Seite ausserhalb des Plans.
- DP1: drei Collagen, blind mit Unteragenten (3 Bewerter Modell A, 3 Modell B, ohne
  Projektkontext), Modell-Urteil als Vorfilter. Zeige mir die gewählte Richtung und frag
  mich, bevor du baust.
- DP2: tragende Technik und höchstens zwei stützende aus referenzen/techniken.md
  (TK1 bis TK14), je mit «weil»-Satz; Bewegung so viel, wie die Idee braucht, mit dem
  Boden aus referenzen/bewegung.md Teil 2; dann WP3 Kostenblatt.
- TP2, Ziele an die Gestaltung, DP3 = TP3 (Prüflisten LA, LP, LH) in einem Lauf, TP4.
- DP4: erster Bildschirm mit einer grossen Sache und einer Faktenzeile (Entscheid 3);
  die h1 nennt Leistung und Ort (Entscheid 2). Vorher werkzeuge/vermessen.cjs und
  werkzeuge/vergleichen.cjs; Vorlagen-Signale 0 oder begründet. Dann DP4 blind
  (Bildtest, Geschwister-Test, Fünf-Sekunden-Test) als Vorfilter.
- Ein Prüflauf DP6 + TP7 + WP4 + WP5: projekt.json anlegen, werkzeuge/pruefen.cjs zuerst
  mit --selbsttest, dann normal; 0 Fehler. Dazu slop-de.js.
- DP7 Kunden-Agenten und DP8 blind, wenn Unteragenten verfügbar sind; sonst
  «nicht gelaufen». Menschentest (blindtest.md Teil 6) nur, wenn ich ihn freigebe.
- TP8 Messplan, WP7 Betrieb und Übergabe als Entwurf.

Grenzen: Nichts veröffentlichen, nichts an den Betrieb senden, nichts erfinden.
Selbstbewertung zählt nicht. Kosten nur als Entwurf.

Am Ende: probe/<kunde>/LIESMICH.md mit jedem Prüfpunkt (DP, TP, WP; Zahl, Bewerter,
Modell, «Modell-Urteil bestanden» statt «belegt») oder «nicht gelaufen», die gewählten
Techniken mit Begründung, die Ausgabe von vergleichen.cjs, und eine Liste, welche Stellen
der Skills unklar oder widersprüchlich waren.
```

## Variante B: Übungsbetrieb ohne Kunden

```
Nutze die Skills design-uni, text-uni und web-uni.

Lege probe/uebung/eingabe/kundenangaben.md aus der Vorlage an und fülle sie für einen ERFUNDENEN Übungsbetrieb:
«Schreinerei Muster AG», 9000 St. Gallen (Musteranschrift), Telefon 071 555 00 00, seit 1998 (Musterwert),
Hauptaktion «Anfrage für eine Küche», 6 Personen, Werkstatt mit Hobelbank und Formatkreissäge, Eiche und Nussbaum,
Schreinerdreieck auf jedem Brett, kein Logo als Vektordatei, keine eigenen Fotos, nur Deutsch, Anfragen per E-Mail an
die Werkstatt, Antwort innert eines Werktags (Musterwert).
Markiere jede Angabe als [Übung]. Dann baue die Website wie in Variante A beschrieben.
Erwartung: Ohne Fotos muss die tragende Technik eine Schrift- oder Fakten-Technik sein (techniken.md, Material-Weiche).
```

## Was der Test zeigen soll

| Frage | Woran man es sieht | Schwelle |
|---|---|---|
| Hält der Lauf am Eingangstor an, wenn ★-Angaben oder Rechte fehlen? | Antwort vor dem Bau | ja |
| Folgen die Skills der gemeinsamen Abfolge, mit Übergaben? | Reihenfolge der Prüfpunkte im LIESMICH | DP, TP, WP in der Folge von zusammenspiel.md Teil 6 |
| Wird eine Technik gewählt und begründet? | Ableitungskette, Register | 1 tragende, ≤ 2 stützende, je «weil» |
| Benutzt der Lauf die Werkzeuge? | `vergleichen.cjs`-Ausgabe, `pruefen.cjs`-Selbsttest im LIESMICH | beides vorhanden |
| Vorlagen-Signale | vergleichen.cjs | 0 oder begründet |
| Erster Bildschirm | vergleichen.cjs, Bild | eine grosse Sache plus Faktenzeile, etwa 60 Wörter `[Annahme]`; h1 mit Leistung und Ort |
| DP4 blind | Bildtest | Mittel ≥ 7,5, ≥ 4 von 6 «Agentur» (Modell-Urteil, Vorfilter) |
| Ein Prüflauf | pruefen.cjs, slop-de.js | 0 Fehler |
| Steht irgendwo Auto Speedy, Carrosserie-Text oder ein Wert aus einem früheren Projekt? | Suche im Bau | 0 Treffer |

Ergebnis als Lektion (Format in `skills/design-uni/referenzen/lektionen.md`, Kennung DL) zurück in den Skill, auch wenn es durchfällt; Befunde zu text-uni und web-uni in deren Lektionen.
