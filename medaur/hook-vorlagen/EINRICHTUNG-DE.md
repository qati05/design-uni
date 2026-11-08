# Schreibbereich-Hook einrichten (nur nach Zustimmung)

Der Hook macht die Dateizuständigkeit technisch verbindlich: Ein Agent vom Typ `medaur-*` kann mit Edit, Write oder NotebookEdit nur in den Pfaden schreiben, die der Lead ihm in `.medaur/schreibbereiche.json` zuweist. Der Lead selbst und fremde Agenten sind nicht betroffen.

## Einrichten
1. `medaur-schreibbereich.mjs` nach `<Projekt>/.claude/hooks/` kopieren. Node.js muss installiert sein.
2. Den Block aus `settings-ergaenzung.json` in `<Projekt>/.claude/settings.json` **einfügen**, nicht die Datei ersetzen. Gibt es schon `hooks.PreToolUse`, den Eintrag ergänzen.
3. Die Agentenvorlagen nach `<Projekt>/.claude/agents/` kopieren (keine bestehende Datei ersetzen). Der Ordner muss vertraut sein (Trust-Abfrage); bei neuem Ordner Claude Code neu starten.
4. Der Lead legt pro Task `.medaur/schreibbereiche.json` an (Beispiel: `schreibbereiche.beispiel.json`) und aktualisiert sie bei jedem Claim und jeder Übergabe. Nur der Lead schreibt diese Datei.

## Verhalten
| Fall | Ergebnis |
| --- | --- |
| Lead oder Agent ohne `medaur-`-Typ | erlaubt |
| `medaur-*` innerhalb des zugewiesenen Bereichs | erlaubt |
| `medaur-*` ausserhalb, ausserhalb des Projekts oder per `../`-Trick | blockiert mit Begründung |
| Datei `.medaur/schreibbereiche.json` fehlt oder ist kaputt | blockiert (sicherer Standard) |

Lokal mit 12 Fällen getestet (Node 22, Linux), siehe QUELLEN-UND-PRUEFUNG.md. Auf Windows noch nicht getestet; der Hook vergleicht dort Pfade ohne Gross-/Kleinschreibung.

## Grenzen
- Shell-Befehle (Bash, PowerShell) prüft der Hook nicht. Die Rollen verbieten Dateiänderungen per Shell; das bleibt eine Verhaltensregel.
- Der Hook erkennt Agenten über `agent_type`. Das liefert Claude Code für Subagents und in-process-Teammates. Split-Pane-Teammates sind nicht verifiziert.
- Zwei Schreiber brauchen zwei Agententypen (`medaur-frontend` und `medaur-frontend-b`), weil der Bereich pro Typ gilt.
