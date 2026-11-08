#!/usr/bin/env node
// Medaur: technische Schreibbereich-Sperre fuer Spezialisten.
// Laeuft als PreToolUse-Hook fuer Edit|Write|NotebookEdit.
// Regeln:
//  - Kein agent_type (Lead / Hauptsitzung): erlaubt.
//  - agent_type ohne Praefix "medaur-": erlaubt (fremde Agenten nicht anfassen).
//  - agent_type "medaur-*": nur Pfade aus .medaur/schreibbereiche.json erlaubt, sonst Block (Exit 2).
//  - Fehlende/kaputte Datei bei medaur-Agent: Block (sicherer Standard).
// Grenze: Shell-Befehle (Bash/PowerShell) werden NICHT geprueft.
import { readFileSync } from "node:fs";
import path from "node:path";

function block(grund) {
  process.stderr.write(`Medaur-Schreibbereich: ${grund}\n`);
  process.exit(2);
}

function globZuRegex(glob) {
  let r = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*" && glob[i + 1] === "*") {
      i++;
      if (glob[i + 1] === "/") { i++; r += "(?:.*/)?"; } else { r += ".*"; }
    } else if (c === "*") r += "[^/]*";
    else if (c === "?") r += "[^/]";
    else r += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${r}$`, process.platform === "win32" ? "i" : "");
}

let eingabe;
try { eingabe = JSON.parse(readFileSync(0, "utf8")); } catch { block("Hook-Eingabe nicht lesbar."); }

const typ = eingabe.agent_type;
if (!typ || !typ.startsWith("medaur-")) process.exit(0);

const ziel = eingabe.tool_input?.file_path ?? eingabe.tool_input?.notebook_path;
if (!ziel) block(`${typ}: kein Dateipfad im Aufruf.`);

const projekt = process.env.CLAUDE_PROJECT_DIR || eingabe.cwd || process.cwd();
let regeln;
try {
  regeln = JSON.parse(readFileSync(path.join(projekt, ".medaur", "schreibbereiche.json"), "utf8"));
} catch {
  block(`${typ}: .medaur/schreibbereiche.json fehlt oder ist ungueltig. Lead muss den Schreibbereich zuweisen.`);
}

const erlaubt = regeln[typ] ?? [];
const rel = path.relative(projekt, path.resolve(projekt, ziel)).split(path.sep).join("/");
if (rel.startsWith("../") || rel === ".." || path.isAbsolute(rel)) block(`${typ}: ${ziel} liegt ausserhalb des Projekts.`);
if (erlaubt.some((g) => globZuRegex(g).test(rel))) process.exit(0);
block(`${typ} darf ${rel} nicht aendern. Erlaubt: ${erlaubt.length ? erlaubt.join(", ") : "nichts"}. Beim Lead eine Uebergabe anfragen.`);
