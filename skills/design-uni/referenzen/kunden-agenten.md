# Kunden-Agenten

Ein Kunden-Agent ist ein Unteragent, der eine Person mit einer konkreten Absicht spielt und die Vorschau am Handy nur über Bildschirmfotos bedient. Er sieht keinen Quelltext und kennt die Fassung nicht.

**Warum:** Kunden-Agenten fanden Fehler, die weder Kontrastmessung noch Klicktest fanden, und die einen Menschen genauso getroffen hätten:
- eine Telefonnummer, die nirgendwohin wählt (`tel:+4152`);
- kein Weg zum Treffpunkt (Route nach 14 Aktionen abgebrochen);
- ein Absende-Knopf teils hinter der festen Anrufleiste, Bestätigung verzögert: fast doppelt gesendet;
- «Termin für morgen anfragen», obwohl morgen Sonntag war; Bestätigung «ab 08.00» ohne Tag;
- Formulare ohne eigenes Namensfeld («Ordnet man mich richtig zu?»);
- kein Hinweis, was bei einem Notfall oder am Wochenende gilt.

Eine Website lag im blinden Bildtest bei 8,0 und bekam im ersten Agentenlauf 3 von 10. Bildtest und Agent messen Verschiedenes; keiner ersetzt den anderen.

## 1. Werkzeug

[`../werkzeuge/kunde.cjs`](../werkzeuge/kunde.cjs) öffnet die Website am Handy (390 × 844, Touch), spielt alle Aktionen der Liste von vorn ab, macht ein Bildschirmfoto und listet die sichtbaren Bedienelemente.

```
node werkzeuge/kunde.cjs <website-ordner|url> '<aktionen-json>' <bild.png> [startseite]
```

Aktionen: `{"tippe":"Text"}`, `{"fuelle":["Feldbeschriftung","Wert"]}`, `{"waehle":["Feldbeschriftung","Option"]}`, `{"scroll":600}` (negativ = hoch), `{"zurueck":true}`.

Voraussetzung: Node.js und Playwright (`npm i playwright && npx playwright install chromium`).

## 2. Werkzeug zuerst prüfen

Ein neues Testwerkzeug wird an einem bekannten Fall geprüft, bevor man seinen Ergebnissen glaubt. In den Tests tippte das Werkzeug zuerst das erste Element mit passendem Text an (oft eine Überschrift statt des Knopfs) und täuschte vier gescheiterte Formulare vor. Die Knöpfe funktionierten.

Vor jedem Agentenlauf:

```
node werkzeuge/kunde.cjs werkzeuge/selbsttest \
  '[{"tippe":"Anrufen"},{"tippe":"Termin anfragen"},{"fuelle":["Name","Testperson Muster"]},{"fuelle":["Telefon","079 555 12 34"]},{"tippe":"Anfrage senden"}]' \
  /tmp/selbsttest.png
```

Erwartet (alle drei eingebauten Fehler sichtbar, richtiger Knopf getippt):

```
ANRUF AUSGELÖST: tel:+4152 · WARNUNG: Nummer «+4152» sieht nicht wählbar aus
getippt: Termin anfragen (a)            ← der Link, nicht die Überschrift h2
gefüllt: Name
gefüllt: Telefon
VERDECKT: «Anfrage senden» liegt unter div.leiste …
```

Weicht das Protokoll ab, wird zuerst das Werkzeug repariert.

## 3. Aufgaben bauen

- Jede Aufgabe ist eine **Lage aus dem Angebotsblatt**, mit Wochentag und Uhrzeit, in den Worten der Kundschaft.
- **Fester Einstieg** wie in Wirklichkeit: über die Suchmaschine auf eine Unterseite (`[startseite]`-Argument), nicht immer die Startseite.
- Drei Arten:
  1. **Hauptanfrage:** «Ihr Ofen ist 30 Jahre alt, Sie wollen eine Beratung für einen neuen.»
  2. **Eilfall:** «Ihr Hund hat Schokolade gefressen. Es ist Dienstag, 22.40.» Ziel: Anruf, richtige Nummer (Notfall oder Praxis).
  3. **Ort oder Preis:** «Sie wollen zum Treffpunkt und die Route öffnen.» oder «Was kostet es insgesamt bis zum Ausweis?»
- Je Aufgabe ein Lauf mit Modell A und einer mit Modell B.

## 4. Auftragstext für den Kunden-Agenten

```
# Kundentest am Handy

Du bist eine ganz normale Person aus der Region, kein Designer und kein
Techniker. Du hast dein Handy in der Hand, wenig Zeit und eine konkrete
Absicht. Du bedienst eine Website und versuchst, deine Aufgabe zu erledigen.

## Deine Aufgabe
<LAGE MIT WOCHENTAG UND UHRZEIT, z. B. «Es ist Samstag, 10 Uhr. Dein Kachelofen
raucht seit gestern. Du willst schnell jemanden erreichen.»>
Du bist über eine Suchmaschine auf dieser Seite gelandet.

## So bedienst du die Website
Werkzeug (nur dieses benutzen):
node <PFAD>/kunde.cjs <WEBSITE> '<aktionen>' <BILDORDNER>/<aufgabe>-<schritt>.png <STARTSEITE>
- Es öffnet die Seite am Handy, spielt alle Aktionen der Liste von vorn ab,
  macht ein Bildschirmfoto und zeigt dir, welche Bedienelemente sichtbar sind.
- Aktionen als JSON-Liste: {"tippe":"Text"}, {"fuelle":["Feldbeschriftung","Wert"]},
  {"waehle":["Feldbeschriftung","Option"]}, {"scroll":600} (negativ = hoch),
  {"zurueck":true}. Für Auswahl-Kacheln {"tippe":"<Text der Option>"}.
- Starte mit '[]', sieh dir das Bild an, entscheide wie ein Mensch den
  nächsten Schritt, hänge ihn an die Liste an, führe das Werkzeug erneut aus.
  Sieh nach jedem Schritt das Bild an.
- Ziel erreicht, wenn das Protokoll «ANRUF AUSGELÖST» oder «ROUTE GEÖFFNET»
  zeigt oder nach dem Absenden eine Bestätigung zu sehen ist.
- Höchstens 20 Aktionen. Wenn du nicht weiterweisst oder aufgeben würdest:
  abbrechen und sagen warum. Reagiert etwas nicht, versuche höchstens zwei
  andere Wege und melde dann, was nicht ging.
- Für Formulare: Name «Testperson Muster», Telefon «079 555 12 34»,
  E-Mail «test@example.ch», sonst passende erfundene Angaben.

Regeln: Lies keine Dateien der Website, keinen Quelltext, nichts anderes auf
diesem Rechner. Du siehst die Website nur über das Werkzeug, wie ein Mensch.
Kein Netz.

## Antwort (nur das)
AUFGABE: Erfolg ja/nein · Aktionen n · davon Tipps n, Felder n, Scrolls n ·
  Ziel: <Anruf/Formular/Route> · angerufene Nummer: <falls Anruf> ·
  Stolpersteine: <kurz>
WÜRDEST DU HIER ANFRAGEN ODER ANRUFEN? 1–10
VERTRAUEN 1–10
GRÖSSTES HINDERNIS (ein Satz):
```

## 5. Auswerten

| Erfasst je Lauf | |
|---|---|
| erreicht ja/nein, Anzahl Aktionen (Tipps, Felder, Scrolls) | gegen die Schwellen in SKILL.md, DP7 |
| Abbruchgrund | wörtlich |
| «anfragen» 1–10, «Vertrauen» 1–10 | Mittel je Modell und gesamt; **Modell-Urteil, Vorfilter** (Entscheid 1): darunter überarbeiten, darüber «Modell-Urteil bestanden», nicht belegt |
| grösstes Hindernis | wörtlich, gruppiert |

- **Jeder Befund wird getrennt:** Fehler des Werkzeugs oder Fehler der Seite. Ein Werkzeugfehler wird von Hand nachgeprüft (Bildschirmfoto, Protokoll) und nicht gezählt.
- **Angerufene Nummer** gegen die Faktenliste prüfen; «Anruf ausgelöst» mit falscher Nummer ist nicht erreicht.
- **Musterwerte:** Die Testkopie hat Musterwerte statt Klammern. Klammern kosteten in jedem Lauf Vertrauen; ein Teil des Vertrauensgewinns kommt von den Musterwerten. Im Bericht vermerken.
- Echte Befunde beheben oder im Bericht als offen mit Grund führen; danach betroffene Aufgabe wiederholen.

## 6. Grenzen

- Kunden-Agenten sind keine Menschen: Sie zögern, lesen und brechen anders ab. Bestätigung erst mit echten Besuchern (Messplan) oder einem Menschentest mit denselben Aufgaben ([blindtest.md](blindtest.md) Teil 6, 5 bis 10 Personen aus der Zielgruppe am eigenen Handy).
- Ein Lauf pro Aufgabe und Modell zeigt keine Streuung.
- Das Werkzeug misst den Weg, den der Agent wählt; ein Skript für den kürzesten Weg (Klickpfade, DP6) ergänzt es.
