# Testprompt für Claude Code

Zweck: prüfen, ob design-uni und text-uni **aus Kundenangaben allein** eine Website bauen, die blind besteht, und ob die neuen Teile (Techniken, Vorbilder-Band, Galerie, allgemeine Werkzeuge) im Lauf wirklich benutzt werden.

## Vorbereitung (Mensch, einmal)

1. Patches gemergt; in Claude Code im Repo-Ordner starten. Skills liegen unter `skills/`; für den Test nach `.claude/skills/` kopieren:
   ```
   mkdir -p .claude/skills && cp -R skills/design-uni skills/text-uni .claude/skills/
   npm i -D playwright && npx playwright install chromium
   ```
2. Einen Ordner `probe/<kunde>/eingabe/` anlegen mit:
   - `kundenangaben.md` (ausgefüllte Vorlage aus `skills/design-uni/eingabe/kundenangaben.md`, alle ★-Fragen beantwortet oder als Lücke bestätigt),
   - `logo/` und `fotos/` mit Rechten.
   Am besten ein **echter** nächster Kunde. Ohne eigene Fotos misst der Test nur den Schrift-Weg (L10, L11).
3. Für einen Lauf ohne Kunden: den erfundenen Übungsbetrieb nehmen (siehe unten, Variante B). Dann gilt alles als Übung; nichts geht an einen Betrieb.

## Variante A: echter Kunde (in Claude Code einfügen, `<kunde>` ersetzen)

```
Nutze die Skills design-uni und text-uni.

Eingabe: probe/<kunde>/eingabe/kundenangaben.md, dazu logo/ und fotos/ im selben Ordner.
Baue daraus eine Vorschau der Website in probe/<kunde>/site/ (statisches HTML, CSS, JS; lokale Schriften; keine fremden Hosts).

Ablauf: genau nach SKILL.md, Schritt 1 bis 11. Insbesondere:
- Fehlen ★-Angaben, halte an und liste sie auf, statt zu raten.
- Schritt 3: drei Collagen, P1 blind mit Unteragenten (3 Bewerter Modell A, 3 Modell B, ohne Projektkontext). Zeige mir die gewählte Richtung und frag mich, bevor du baust.
- Schritt 4: tragende Technik und höchstens zwei stützende aus referenzen/techniken.md, je mit «weil»-Satz; Bewegung keine oder eine, aus galerie/index.html, selbst gebaut.
- Schritt 6: vor P4 werkzeuge/vermessen.cjs und werkzeuge/vergleichen.cjs; Vorlagen-Signale 0 oder begründet. Dann P4 blind (Bildtest, Geschwister-Test, Fünf-Sekunden-Test).
- Schritt 8: projekt.json anlegen, werkzeuge/pruefen.cjs zuerst mit --selbsttest, dann normal; 0 Fehler.
- Schritt 9 und 10: P7 Kunden-Agenten und P8 blind, wenn Unteragenten verfügbar sind.

Grenzen: Nichts veröffentlichen, nichts an den Betrieb senden, nichts erfinden. Selbstbewertung zählt nicht.

Am Ende: probe/<kunde>/LIESMICH.md mit jedem Prüfpunkt (Zahl, Bewerter, Modell) oder «nicht gelaufen», die gewählten Techniken mit Begründung, die Ausgabe von vergleichen.cjs, und eine Liste, welche Stellen der Skills unklar oder widersprüchlich waren.
```

## Variante B: Übungsbetrieb ohne Kunden

```
Nutze die Skills design-uni und text-uni.

Lege probe/uebung/eingabe/kundenangaben.md aus der Vorlage an und fülle sie für einen ERFUNDENEN Übungsbetrieb:
«Schreinerei Muster AG», 9000 St. Gallen (Musteranschrift), Telefon 071 555 00 00, seit 1998 (Musterwert),
Hauptaktion «Anfrage für eine Küche», 6 Personen, Werkstatt mit Hobelbank und Formatkreissäge, Eiche und Nussbaum,
Schreinerdreieck auf jedem Brett, kein Logo als Vektordatei, keine eigenen Fotos.
Markiere jede Angabe als [Übung]. Dann baue die Website wie in Variante A beschrieben.
Erwartung: Ohne Fotos muss die tragende Technik eine Schrift- oder Fakten-Technik sein (techniken.md, Material-Weiche).
```

## Was der Test zeigen soll

| Frage | Woran man es sieht | Schwelle |
|---|---|---|
| Hält der Skill an, wenn ★-Angaben fehlen? | Antwort vor dem Bau | ja |
| Wird eine Technik gewählt und begründet? | Ableitungskette, Register | 1 tragende, ≤ 2 stützende, je «weil» |
| Benutzt der Lauf die neuen Werkzeuge? | `vergleichen.cjs`-Ausgabe, `pruefen.cjs`-Selbsttest im LIESMICH | beides vorhanden |
| Vorlagen-Signale | vergleichen.cjs | 0 oder begründet |
| P4 blind | Bildtest | Mittel ≥ 7,5, ≥ 4 von 6 «Agentur» |
| P6 | pruefen.cjs | 0 Fehler |
| Steht irgendwo Auto Speedy, Carrosserie-Text oder ein Wert aus einem früheren Projekt? | Suche im Bau | 0 Treffer |

Ergebnis als Lektion (Format in `referenzen/lektionen.md`) zurück in den Skill, auch wenn es durchfällt.
