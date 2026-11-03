// Einfacher Editor für den Kunden nach einer Kündigung des Cockpits: Sveltia CMS unter /admin/.
// Standard AUS. Nur wenn beim Bau EDITOR_AKTIV=true gesetzt ist, legt der Bau /admin/ an; sonst gibt es /admin/ nicht.
// Sveltia wird selbst ausgeliefert (aus node_modules, Version fest in package.json), nicht von einem CDN.
// Bearbeitet nur src/daten/site.json (Zeiten, Feiertage, Hinweis, Team). Teamfotos: bei der Übergabe kommen sie aus R2 in die
// Website-Dateien des Kunden (public/bilder/team/); im Editor steht nur ihr Verweis. Speichert jemand Unsinn, bricht der nächste Bau an der Prüfung
// (gemeinsam/site.ts) ab, und die bisherige Website bleibt online.
// Einstellungen: EDITOR_REPO (owner/name), EDITOR_ZWEIG (Vorgabe main), EDITOR_PFAD (Pfad von site.json im Repo).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HINWEIS_LINKS } from "../../gemeinsam/site.ts";

const WOCHENTAGE = [["Monday", "Montag"], ["Tuesday", "Dienstag"], ["Wednesday", "Mittwoch"], ["Thursday", "Donnerstag"], ["Friday", "Freitag"], ["Saturday", "Samstag"], ["Sunday", "Sonntag"]];
const ZEIT = ["^([01]?\\d|2[0-3])\\.[0-5]\\d$", "Zeit als 7.30 oder 17.15"];

/** Die Felder entsprechen gemeinsam/site.ts; die eigentliche Prüfung macht der Bau. */
export function editorKonfiguration({ repo, zweig = "main", pfad = "astro/src/daten/site.json" }) {
  if (!/^[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}$/.test(repo || "")) throw new Error("EDITOR_REPO fehlt oder ist ungültig (owner/name)");
  if (!/^[A-Za-z0-9._/-]{1,200}\.json$/.test(pfad) || pfad.includes("..")) throw new Error("EDITOR_PFAD ungültig");
  const text = (name, label, extra = {}) => ({ name, label, widget: "string", ...extra });
  return {
    backend: { name: "github", repo, branch: zweig, commit_messages: { update: "Website pflegen (Editor)" } },
    media_folder: "",
    locale: "de",
    collections: [{
      name: "website", label: "Website", editor: { preview: false },
      files: [{
        name: "site", label: "Öffnungszeiten, Hinweis und Team", file: pfad,
        fields: [
          { name: "_hinweis", widget: "hidden", required: false },
          { name: "hinweis", label: "Hinweis oben auf der Website", widget: "object", fields: [
            { name: "aktiv", label: "Hinweis zeigen", widget: "boolean", default: false },
            text("text", "Text (höchstens 120 Zeichen)", { required: false, pattern: ["^[^<>]{0,120}$", "Höchstens 120 Zeichen, ohne < und >"] }),
            { name: "link", label: "Führt zu", widget: "select", options: HINWEIS_LINKS.map((l) => ({ label: l.text, value: l.wert })) },
          ] },
          { name: "zeiten", label: "Öffnungszeiten", widget: "list", min: 1, max: 7, fields: [
            text("tage", "Tage, ausgeschrieben (z. B. Montag bis Donnerstag)"),
            text("kurz", "Tage, kurz (z. B. Mo bis Do)"),
            { name: "wochentage", label: "Wochentage", widget: "select", multiple: true, min: 1, options: WOCHENTAGE.map(([value, label]) => ({ value, label })) },
            { name: "geschlossen", label: "Geschlossen", widget: "boolean", default: false },
            { name: "fenster", label: "Zeitfenster (höchstens 2)", widget: "list", max: 2, required: false, fields: [text("von", "von", { pattern: ZEIT }), text("bis", "bis", { pattern: ZEIT })] },
          ] },
          { name: "ausnahmen", label: "Feiertage und Ferien", widget: "list", max: 40, required: false, fields: [
            text("name", "Bezeichnung (z. B. Weihnachten)"),
            { name: "datum", label: "Datum", widget: "datetime", date_format: "YYYY-MM-DD", time_format: false, format: "YYYY-MM-DD" },
            { name: "geschlossen", label: "Ganzer Tag geschlossen", widget: "boolean", default: true },
            text("von", "offen von (nur wenn nicht geschlossen)", { required: false, pattern: ZEIT }),
            text("bis", "offen bis (nur wenn nicht geschlossen)", { required: false, pattern: ZEIT }),
          ] },
          { name: "team", label: "Team", widget: "list", max: 12, required: false, fields: [
            text("name", "Gruppe (z. B. Werkstatt)"),
            { name: "leute", label: "Personen", widget: "list", max: 30, required: false, fields: [
              text("name", "Name"), text("rolle", "Rolle", { required: false }),
              text("foto", "Foto (Verweis, z. B. /bilder/team/anna-muster.webp)", { required: false, hint: "Die Bilddatei liegt im Ordner bilder/team. Foto entfernen: Feld leeren und die Datei löschen. Siehe Übergabe-Anleitung." }),
              text("email", "Mail (freiwillig)", { required: false }),
            ] },
          ] },
        ],
      }],
    }],
  };
}

export default function editor() {
  return {
    name: "editor",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        if (process.env.EDITOR_AKTIV !== "true") return;
        const ziel = path.join(fileURLToPath(dir), "admin");
        const k = editorKonfiguration({ repo: process.env.EDITOR_REPO, zweig: process.env.EDITOR_ZWEIG || "main", pfad: process.env.EDITOR_PFAD || "astro/src/daten/site.json" });
        const quelle = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "node_modules", "@sveltia", "cms", "dist");
        fs.mkdirSync(ziel, { recursive: true });
        fs.copyFileSync(path.join(quelle, "sveltia-cms.js"), path.join(ziel, "sveltia-cms.js"));
        fs.cpSync(path.join(quelle, "chunks"), path.join(ziel, "chunks"), { recursive: true, filter: (p) => !p.endsWith(".map") });
        fs.writeFileSync(path.join(ziel, "config.yml"), JSON.stringify(k, null, 2) + "\n"); // JSON ist gültiges YAML
        fs.writeFileSync(path.join(ziel, "index.html"), `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>Website bearbeiten</title></head><body><script src="/admin/sveltia-cms.js"></script></body></html>
`);
        // Editor nie in Suchmaschinen
        fs.appendFileSync(path.join(fileURLToPath(dir), "_headers"), "\n/admin/*\n  X-Robots-Tag: noindex\n  Cache-Control: no-store\n");
        console.log(`[editor] /admin/ angelegt für ${k.backend.repo} (${k.backend.branch})`);
      },
    },
  };
}
