# impeccable: Einrichtung und Sicherheitsprüfung (Runde «Neu», 03.11.2026)

- Quelle: github.com/pbakaus/impeccable (Apache-2.0), geklont nach `/workspace/tools/impeccable`, fest auf Tag `skill-v4.8.0` (Commit 414603bf1).
- `npx impeccable install` wurde **nicht** ausgeführt (würde Skills in eine Harness/global schreiben).
- Launcher `skill/scripts/impeccable` und npm-Shim `cli/bin/cli.js`: laden beim ersten Lauf die Engine
  `impeccable-<os>-<arch>` von `https://github.com/pbakaus/impeccable/releases/download/engine-v<ENGINE_VERSION>/`
  und prüfen sie gegen `skill/scripts/engine-checksums.txt` (fail closed: ohne Prüfsumme kein Download).
- Engine 0.1.18 linux-x64 von Hand geladen nach `/workspace/tools/impeccable-bin/impeccable`.
  SHA-256 `736ed785e74ae2344d3036127f614ddde5ab520a527d8bc82a891612ef71f648` =
  Eintrag im gepinnten Tag **und** = `digest` des Release-Assets in der GitHub-API. Verifiziert.
- Aufruf nur pro Sitzung über Umgebungsvariablen, nichts global installiert:
  `IMPECCABLE_BIN=/workspace/tools/impeccable-bin/impeccable IMPECCABLE_SKILL_DIR=/workspace/tools/impeccable/skill IMPECCABLE_NO_TELEMETRY=1`
- Telemetrie (Roll-API) aus: `IMPECCABLE_NO_TELEMETRY=1`. Die kurz angelegte `~/.impeccable/config.json` wurde wieder gelöscht.
- Genutzt: `impeccable context`, `impeccable detect`, Leitfäden SKILL, craft-floor.md, new-work.md, mode-persuade.md.

Stand: Prozess geändert auf Designer-Vorgehen. Schritt 1 Moodboard liegt in `/workspace/agency/autospeedy-moodboard/`.
