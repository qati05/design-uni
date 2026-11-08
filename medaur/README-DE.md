# Medaur — kleiner echter Website-Swarm
Version 2, Stand 8. November 2026, Europe/Zurich. Vorlagen, kein installierter Agenten-Dienst. Neu in v2: Betriebsmodi, technische Schreibbereich-Sperre per Hook, Schweizer Pflichtseiten und lokales SEO, Asset- und Fotobriefing.

## In drei Schritten
1. Paket separat entpacken. Im gewünschten Kundenprojekt Claude Code öffnen. Bestehende Regeln und Dateien behalten.
2. `STARTPROMPT-DE.txt` einfügen und dessen Briefingfelder ausfüllen. Den absoluten Pfad zu diesem entpackten Paket ergänzen. Ohne Projektauftrag arbeitet Claude zunächst nur lesend und plant.
3. Claude prüft echte Parallelität und legt 2–3 Art Directions vor. Du wählst ausdrücklich eine Richtung. Erst dann beginnt die Umsetzung im freigegebenen Projektumfang.

Der Startprompt funktioniert mit den lesbaren Rollenvorlagen. Für häufige Nutzung kann Claude **nach deiner Zustimmung** die fünf Dateien aus `agent-vorlagen/` einzeln nach `.claude/agents/` übernehmen. Keine bestehende Datei ersetzen. Namen und Toolverfügbarkeit vorher prüfen; bei erstmalig neuem Agentenverzeichnis kann ein Neustart nötig sein. `CLAUDE-MERGE-ONLY.md` ist ein optionaler Ergänzungsblock, keine Datei zum Überschreiben von CLAUDE.md. Keine automatische Installation. Der Schreibbereich-Hook in `hook-vorlagen/` wird nur nach deiner Zustimmung eingerichtet (Anleitung: `hook-vorlagen/EINRICHTUNG-DE.md`).

## Was «echt» bedeutet
**A: Native Agent Teams, bevorzugt.** Interaktive Claude-Code-Sitzung, mehrere echte Teammates mit eigenen Kontexten, Koordinator, Nachrichten und — falls vorhanden — gemeinsamer Taskliste. Experimentell und standardmässig deaktiviert. Agenten-Panel allein beweist keinen Teamstart. Team-Spawnresultate und erste gleichzeitig laufende Aufgaben protokollieren.

Die offizielle Aktivierung ist die Umgebungsvariable `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Falls deaktiviert: Claude soll dir die Aktivierung für deine Shell erklären, nicht still Einstellungen ändern. Keine komplette settings.json aus einem Beispiel ersetzen. Für das Standarddisplay «in-process» braucht es kein tmux. Native Teams werden im nichtinteraktiven `claude -p` nicht gestartet.

**B: Parallele Subagents, deklarierter Fallback.** Echte gleichzeitig laufende delegierte Agenten; der Lead verteilt und sammelt Resultate. Nicht gleichwertig mit nativen Teams. Bei fehlender Teamfunktion darf Claude diesen Modus für lesende Vorarbeiten wählen und benennt ihn ausdrücklich. Keine verfügbare Parallelfunktion: BLOCKED, nicht Rollenspiel als Swarm verkaufen.

**Isolation:** Native Teammates haben keine automatische Worktree-Isolation. Klare Dateizuständigkeiten sind Pflicht. Für unterstützte Subagents sind isolierte Worktrees möglich. Eine Agentenvorlage mit `isolation: worktree` allein garantiert beim Spawn als Teammate keine Isolation. Ausgangscommit und tatsächlichen Arbeitsordner prüfen; uncommittete Änderungen werden nicht einfach mitgenommen. Kein blindes Kopieren von .env-Dateien.

## Paket und Grenzen
- STARTPROMPT: operativer Einstieg und Briefing.
- BETRIEB-DE: Aufgabenvertrag, Übergaben, Konflikte, Freigaben.
- DESIGN-UND-QA-DE: konkrete Taste- und Testkriterien.
- agent-vorlagen/: fünf kompakte Spezialisten, nicht fünf dauernd beschäftigte Schreiber.
- MODI-DE: Schlank (Standard), Voll, Bestandsprojekt.
- SCHWEIZ-PFLICHTEN-UND-SEO-DE: Impressum, Datenschutz (revDSG), lokales SEO, AEO, QA-Prüfliste.
- hook-vorlagen/: technische Schreibbereich-Sperre.
- vorlagen/DESIGN-ENTSCHEID.md: verbindliche Richtungswahl.
- vorlagen/ASSETS-UND-FOTOBRIEFING.md: Bildrechte und Briefing für den Fotografen.
- QUELLEN-UND-PRUEFUNG.md: Quellen, durchgeführte und fehlende Prüfungen.

Default: Modus Schlank (Strategie, ein Frontend, QA; Kritiker zur Abnahme). Modus Voll: höchstens drei Spezialisten gleichzeitig, höchstens zwei Quellcode-Schreiber. Nach zwei Korrekturrunden eskalieren. Die Anzahl der Agenten ist keine harte Runtime-Sperre; die Schreibbereiche sind es, wenn der Hook eingerichtet ist (ausser Shell-Befehle). Keine Qualitäts-, Umsatz- oder Laufzeitgarantie.

Impeccable muss **in deinem Claude Code** verfügbar sein. Fehlt es, kann das Team nach den dokumentierten Designkriterien planen, meldet aber «Impeccable nicht ausführbar». Es installiert nichts ungefragt.
