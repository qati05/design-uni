import { describe, expect, it } from "vitest";
import { entscheideZugang } from "../lib/zugang";

const ja = async () => true, nein = async () => false;

describe("Zugang (Anmeldung macht Cloudflare Access, das Cockpit prüft den Ausweis)", () => {
  it("öffentliche Pfade gehen immer, ohne den Ausweis zu prüfen", async () => {
    let gefragt = 0; const zaehlt = async () => { gefragt++; return false; };
    expect(await entscheideZugang("/403", zaehlt)).toEqual({ art: "weiter" });
    expect(await entscheideZugang("/bilder/logo-48.webp", zaehlt)).toEqual({ art: "weiter" });
    expect(gefragt).toBe(0);
  });
  it("mit gültigem Ausweis geht es weiter", async () => { expect(await entscheideZugang("/", ja)).toEqual({ art: "weiter" }); });
  it("ohne gültigen Ausweis: 403, auch auf Unterseiten", async () => {
    expect(await entscheideZugang("/", nein)).toEqual({ art: "verboten" });
    expect(await entscheideZugang("/api/demo-foto/x.webp", nein)).toEqual({ art: "verboten" });
  });
  it("eine eigene Login-Seite gibt es nicht mehr; entfernte Teile sind nicht öffentlich", async () => {
    for (const p of ["/login", "/demo/postfach", "/api/meldung", "/api/versand", "/api/zaehl", "/auftrag/" + "a".repeat(64), "/studio", "/mfa"]) expect(await entscheideZugang(p, nein)).toEqual({ art: "verboten" });
  });
  it("App-Dateien ohne Prüfung im Cockpit: Manifest, Service Worker, Offline-Seite, Symbole", async () => {
    for (const p of ["/manifest.webmanifest", "/sw.js", "/offline.html", "/icon-192.png", "/apple-touch-icon.png"]) expect(await entscheideZugang(p, nein)).toEqual({ art: "weiter" });
  });
});
