# Betrieb: ein Projekt, ein Integrator, eindeutige Claims

## Minimales Projektgedächtnis
Der Lead hält im vereinbarten lokalen Projekt-Dokumentationsordner vier kleine Artefakte: BRIEF.md (Bestätigtes/Annahmen/Fragen), DESIGN.md (gewählter Vertrag oder Verweis auf vorhandene Quelle), TASKS.md (IDs/Status/Owner/Abhängigkeiten), REVIEW.md (Belege/Befunde/Abnahme). Nicht unnötig vorhandene gleichwertige Dokumente duplizieren. Screenshots und Testlogs separat und ohne personenbezogene Daten ablegen.

## DAG und Parallelität
I Intake → R1 Strategie || R2 Designrecherche → G menschliche Richtungswahl → D Vertrag + C freigegebener Content → B1/B2 getrennte Bausteine → M Integration → Q Browser-QA || K visuelle Kritik → F Korrektur → erneutes Q/K.

D und C können sich nach G abstimmen; Komponenten starten erst mit ihren bestätigten Inputs. Keine leeren Warteagenten produzieren. Kleine Projekte brauchen oft nur einen Entwickler; Parallelität entsteht sinnvoll in Recherche und unabhängiger Prüfung.

## Taskvertrag — durch Lead vor Claim
```yaml
id: B1
ziel: Kontaktstrecke in freigegebener Richtung
abhaengig_von: [D, C]
inputs: [BRIEF.md, DESIGN.md]
owner: noch_unbesetzt
status: pending
schreibbereich: ["<konkrete projektbezogene Dateien>"]
read_only: ["<gemeinsame Tokens / Routing / andere Komponenten>"]
basis: "<Commit oder dokumentierter Arbeitsstand>"
lieferung: "<Dateien, Schnittstelle, Tests, Übergabe>"
abnahme: "<beobachtbare Kriterien>"
budget: "<Zeit-/Turnlimit innerhalb freigegebenem Rahmen>"
```
Die Pfade sind Beispiele, kein vorausgesetzter Techstack. Leads weisen echte Pfade nach Projektprüfung zu. Komponentenvertrag enthält Props/Datenformate, Ereignisse, Fehlerzustände und benutzte Tokens. Sonst entstehen optisch und technisch inkompatible Inseln.

**Claim:** Falls native Taskwerkzeuge vorhanden: deren Claim-/Abhängigkeitsmechanismus nutzen. Ohne diese schreibt ausschliesslich der Lead TASKS.md und bestätigt den Claim per unterstützter Nachricht/Delegation. Arbeiter editieren nicht konkurrierend die Boarddatei. Vor bestätigtem Claim und freiem Schreibbereich keine Änderung. BLOCKED ist ein fachlicher Zusatz im Board, kein erfundener nativer Taskstatus; native Statuswerte pending/in progress/completed abbilden.

## Übergabe — vor Integration
```text
Task / Agent / tatsächlicher Arbeitsordner / Ausgangsstand:
Ergebnis und geänderte Dateien:
Schnittstelle, benötigte Assets, neue Abhängigkeiten:
Ausgeführte Prüfungen: Befehl oder Flow, Ergebnis, Belegpfad:
Nicht geprüft / offene Risiken:
Integrationshinweis: Branch/Commit, Patch oder lokale Dateien, je nach Modus:
Bereit für unabhängige Abnahme: ja/nein, Begründung:
```
Lead prüft Scope und Diff, integriert einzeln und führt Integrationstests nochmals aus. Globale Styles, Design-Tokens, Routing, Konfiguration und Lockfiles haben je genau einen Owner. Gleiche Datei nötig? Anfrage, Arbeit an der Grenze stoppen, Ownerwechsel erst nach Handover. Bei Konflikt nie «letzter Schreiber gewinnt» und nie fremde Änderungen wegsetzen.

Worktree ist Isolation, keine automatische Zusammenführung. Reale Basis mit freigegebenem Design-/Contentstand abgleichen; bei falscher Basis nicht einfach losbauen. Nicht ungefragt git init, commit, reset, rebase, push oder Worktrees mit Arbeit löschen. Integrationsweg mit bestehender Projektpraxis und Freigabe abstimmen. Lokale Git-Schritte, falls nötig, vorher transparent planen. Ohne sichere Integration Schreibparallelität reduzieren, nicht Qualität reduzieren.

## Technische Schreibbereich-Sperre
Ist der Hook aus `hook-vorlagen/` eingerichtet, schreibt der Lead bei jedem Claim den `schreibbereich` des Tasks nach `.medaur/schreibbereiche.json` (Schlüssel = Agententyp) und entfernt ihn bei der Übergabe. Nur der Lead schreibt diese Datei. Ein blockierter Schreibversuch ist ein Signal für eine fehlende Übergabe, kein Fehler zum Umgehen. Ohne Hook gilt die Dateizuständigkeit weiter als Arbeitsregel; der Lead meldet dann «Schreibbereich nicht technisch gesperrt».

## Störungen, Neustart, Budget
Agentfehler oder Limit: Teilresultat als unvollständig sichern, abhängige Aufgaben blockieren, Lead entscheidet innerhalb Restbudget über Wiederaufnahme. Kein automatisches Retry nach verweigerter Aktion. Bei Wiederaufnahme Board, echte Dateien und offene Tasks abgleichen; native Teams sind experimentell, ein Resume stellt Teammates nicht zuverlässig wieder her. Vor neuer Zuweisung lebenden Owner verifizieren.

Eine Korrekturrunde = gebündelte Befunde → Owner-Fixes → neue unabhängige Prüfung. Nach zwei Runden oder erreichtem Budget: an den Entscheider aus dem Briefing eskalieren mit Restfehlern, Folgen und den Optionen Scope reduzieren / mehr Budget / blockierte Vorschau behalten. Kein PASS für ungeprüfte Pflichtkriterien. Vorschau-fertig und veröffentlichungsbereit sind unterschiedliche Zustände.
