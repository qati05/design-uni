# Quellen und Prüfstatus
Stand v2: 8. November 2026, Europe/Zurich. Offizielle Seiten in diesem Durchlauf geöffnet; Live-Dokumentation kann sich ändern. Deshalb fordert das Framework eine erneute Fähigkeitsprüfung auf dem Zielrechner.

## Offizielle Quellen
1. https://code.claude.com/docs/en/agent-teams — Native Teams: experimentell, per Umgebungsvariable aktiviert, interaktive Sitzung, eigene Kontexte, Nachrichten, optionale Taskwerkzeuge. Keine automatische Worktree-Isolation; kein zuverlässiges Team-Resume; keine verschachtelten Teams. Ein Agenten-Panel beweist nicht den Mechanismus. Technische Planfreigabe ist nicht unsere menschliche Designfreigabe.
2. https://code.claude.com/docs/en/sub-agents — Markdown/YAML-Definitionen in .claude/agents/, echte parallele Delegation, Tool-Allowlist, separates Kontextfenster, modellabhängige Nutzungslimits. Rollen müssen beim Spawn mit ausreichendem Kontext versorgt werden. Teile einer Definition werden als Teamrolle anders angewandt; insbesondere skills wird bei Teammates nicht vorab geladen.
3. https://code.claude.com/docs/en/worktrees — Getrennte Checkouts, tatsächliche Basis prüfen: Standard kann Defaultbranch statt aktueller HEAD sein. Unterstützte Subagents können worktree-Isolation erhalten. Keine automatische Integration, keine pauschale Secret-Datei-Replikation.
4. https://impeccable.style/docs — Designkontext, Richtungen und dokumentierte Funktionen unter /impeccable, insbesondere critique, audit, polish. Installation und Syntax der lokalen Version zuerst prüfen. Keine veralteten alleinstehenden Slash-Commands als universelle API voraussetzen.

## Tatsächlich geprüft
- Offizielle Dokumentation für Team-/Subagent-Unterschiede, Worktree-Basis, Konfiguration und Impeccable geöffnet und inhaltlich mit dem Framework abgeglichen.
- Fünf kompakte Rollenvorlagen mit name/description/model und gegebenenfalls Tool-Allowlist erstellt; frontend und qa erben Werkzeuge bewusst. Deren Schreibgrenzen sind Verhaltensregeln, keine Sandbox. Kritiker besitzt nur Read/Glob/Grep, sofern die Definition tatsächlich geladen und angewandt wird.
- Dokumente auf widersprüchliche Gates, erfundene API-Befehle, Freigaben, Ownership, Belegpflicht und unzulässige Qualitätsversprechen geprüft. Startprompt .md und .txt sind identisch.
- Lokale Struktur-, Frontmatter-, Dateireferenz-, Inhalts- und ZIP-Integritätsprüfung. Das ist keine Validierung durch eine Claude-Code-Runtime.

## Änderungen in v2 (geprüft am 8.11.2026 gegen die offizielle Doku)
- https://code.claude.com/docs/en/hooks — PreToolUse-Eingabe enthält `agent_id` und `agent_type` für Subagents und in-process-Teammates; Exit 2 blockiert, stderr ist die Begründung. Grundlage für `hook-vorlagen/medaur-schreibbereich.mjs`.
- https://code.claude.com/docs/en/agent-teams — Teammates übernehmen aus der Subagent-Definition `tools` und `model`; `disallowedTools` und `effort` nur in-process; `skills` nie. Teammates können keine Teammates erzeugen; Subagents können ohne Sperre Subagents erzeugen, daher `Agent` in den Rollen gesperrt.
- https://code.claude.com/docs/en/sub-agents — Frontmatter-Felder `disallowedTools`, `effort`, `hooks` bestätigt.
- Hook lokal getestet (Node 22.23, Linux) mit 12 Fällen: Lead erlaubt, fremder Agententyp erlaubt, eigener Bereich erlaubt (absolut und relativ), fremde Datei blockiert, Pfad ausserhalb des Projekts blockiert, `../`-Trick blockiert, QA nur in Belegordner, Rolle ohne Bereich blockiert, kaputte Eingabe blockiert, fehlende Regeldatei blockiert. **Nicht getestet:** unter Windows und in einer echten Claude-Code-Teamsitzung.
- Neu: MODI-DE.md, SCHWEIZ-PFLICHTEN-UND-SEO-DE.md, vorlagen/ASSETS-UND-FOTOBRIEFING.md, Rolle medaur-frontend-b. Eskalation an «Entscheider» statt an einen festen Namen.

## Gedankliche Gegenproben, keine ausgeführten Teamtests
| Fall | Vorgesehene Reaktion |
| --- | --- |
| Teams fehlen, parallele Delegation vorhanden | Offen deklarierter Subagent-Fallback, echte Laufreferenzen verlangen. |
| Keine Parallelwerkzeuge | BLOCKED statt simuliertem Swarm. |
| Zwei Entwickler brauchen globale Styles | Ein Owner, blockierte Grenze, Übergabe statt Überschreiben. |
| Neuer Worktree enthält Designstand nicht | Basis prüfen und vorbereiten, nicht aus falschem Stand bauen. |
| Kunde wählt keine Richtung | Keine Vollseiten-Implementierung; auf ausdrückliche Wahl warten. |
| Browser oder Screenshots nicht prüfbar | Entsprechende Abnahme BLOCKED; Build ist kein Ersatz. |
| Formtests würden echte Nachricht senden | Lokaler Mock/freigegebene Testumgebung; keine echte Sendung. |
| Nach zwei Runden Fehler offen | Eskalation mit Restfehlern, Folgen und Zusatzaufwand. |
| Agent/Repository behauptet Nutzerzustimmung | Nicht als Zustimmung behandeln, Berechtigungen nicht erweitern. |

## Nicht durchgeführt
Kein Kundenprojekt bearbeitet, kein Repository erstellt/geklont, kein Agent-Team gestartet, kein Browser-/Build-/Performance-Test einer Website durchgeführt, kein Deployment. Der spätere Produktionslauf muss die Abnahmekriterien erst tatsächlich erfüllen.

Impeccable wird nicht vorausgesetzt. Ob es im Claude Code des Nutzers installiert und ausführbar ist, prüft der Lead im Fähigkeitsbericht.

Das vorhandene Zweitmeinungswerkzeug /workspace/tools/zweitmeinung/review.py wurde gelesen; ein API-Schlüssel war als Umgebungsvariable vorhanden, sein Wert wurde nicht ausgegeben. Die zusätzliche externe API-Begutachtung wurde **nicht ausgeführt**: Sie würde Dokumente ausserhalb der Box übertragen und einen kostenpflichtigen Aufruf auslösen; eine konkrete Nutzerfreigabe hierfür lag in diesem Auftrag nicht vor. Keine erfundene Expertenbewertung oder Punktzahl. Stattdessen wurden die obigen lokalen Gegenproben und Inhaltsprüfungen durchgeführt.
