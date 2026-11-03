import { describe, expect, it } from "vitest";
import { entscheideZugang } from "../lib/zugang";
import { kennzahlen, naechsteSchritte, websiteZahlen, type Meldung } from "../lib/status";
import { sichererPfad, statusSchema } from "../lib/validierung";
import { sitzungLesen, sitzungSignieren } from "../lib/demo-speicher";
import { e164 } from "../lib/anzeige";

const q = (o: Partial<{ s: boolean; uid: string | null; aal: string | null; nae: string | null; m: boolean; admin: boolean }> = {}) => ({
  hatSitzung: o.s ?? true, nutzerId: async () => (o.uid === undefined ? "u1" : o.uid), stufe: async () => ({ aktuell: o.aal ?? "aal2", naechste: o.nae ?? "aal2" }), istMitglied: async () => o.m ?? true, istStudioAdmin: async () => o.admin ?? false,
});

describe("Zugang (Muster medaur)", () => {
  it("öffentliche Pfade gehen immer", async () => { expect(await entscheideZugang("/login", q({ s: false }))).toEqual({ art: "weiter" }); expect(await entscheideZugang("/api/meldung", q({ s: false }))).toEqual({ art: "weiter" }); });
  it("ohne Sitzung zum Login", async () => { expect(await entscheideZugang("/", q({ s: false }))).toEqual({ art: "login" }); expect(await entscheideZugang("/", q({ uid: null }))).toEqual({ art: "login" }); });
  it("nur Mail-Code (aal1) führt zum zweiten Code", async () => { expect(await entscheideZugang("/", q({ aal: "aal1" }))).toEqual({ art: "mfa" }); expect(await entscheideZugang("/", q({ aal: "aal1", nae: "aal1" }))).toEqual({ art: "mfa_einrichten" }); expect(await entscheideZugang("/mfa", q({ aal: "aal1" }))).toEqual({ art: "weiter" }); });
  it("Konto ohne Mitgliedschaft bekommt 403", async () => { expect(await entscheideZugang("/", q({ m: false }))).toEqual({ art: "verboten" }); });
  it("Mitglied mit aal2 darf", async () => { expect(await entscheideZugang("/meldung/abcdef1", q())).toEqual({ art: "weiter" }); });
  it("Studio: nur Admins unter /studio, Admin ohne Betrieb landet dort; Mitglieder kommen nicht hinein", async () => {
    expect(await entscheideZugang("/studio/export/auto-speedy", q({ m: false, admin: true }))).toEqual({ art: "weiter" });
    expect(await entscheideZugang("/", q({ m: false, admin: true }))).toEqual({ art: "studio" });
    expect(await entscheideZugang("/studio", q())).toEqual({ art: "verboten" });
    expect(await entscheideZugang("/studio", q({ aal: "aal1", admin: true }))).toEqual({ art: "mfa" });
  });
});

describe("CSV-Export", async () => {
  const { csv, zelle } = await import("../lib/csv");
  it("Formeln werden entschärft, Trennzeichen und Anführungszeichen maskiert", () => {
    expect(zelle("=HYPERLINK(\"http://x\")")).toBe("\"'=HYPERLINK(\"\"http://x\"\")\"");
    expect(zelle("+41 71 555 00 00")).toBe("+41 71 555 00 00"); expect(zelle("+1+cmd|x")).toBe("'+1+cmd|x");
    expect(zelle("@SUM(A1)")).toBe("'@SUM(A1)");
    expect(zelle("a;b")).toBe("\"a;b\"");
    expect(zelle(null)).toBe("");
  });
  it("Kopfzeile, BOM für Excel, CRLF", () => {
    expect(csv(["a", "b"], [{ a: 1, b: "x\ny" }])).toBe("\uFEFFa;b\r\n1;\"x\ny\"\r\n");
  });
});

describe("Status und Kennzahlen", () => {
  const m = (status: Meldung["status"], minuten = 10): Meldung => ({ id: "x" + Math.random(), erstellt: new Date(Date.now() - minuten * 60e3).toISOString(), art: "Hagel", tesla: false, stellen: [], bemerkung: "", name: "A", telefon: "0715550000", quelle: "website", status, notiz: "", fotos: [] });
  it("Quote aus entschiedenen Meldungen", () => { const k = kennzahlen([m("auftrag"), m("erledigt"), m("verloren"), m("neu"), m("offerte")]); expect(k).toMatchObject({ gesamt: 5, neu: 1, offen: 1, auftraege: 2, quote: 67 }); });
  it("ohne Entscheide keine Quote", () => { expect(kennzahlen([m("neu")]).quote).toBeNull(); });
  it("neue Meldungen älter als 2 Stunden werden gezählt", () => { expect(kennzahlen([m("neu", 200), m("neu", 30)]).aelterAls2hNeu).toBe(1); });
  it("Website-Zahlen: nur Anfragen über die Website, Aufträge daraus", () => {
    const w = (status: Meldung["status"], quelle: Meldung["quelle"] = "website", art = "Hagel") => ({ ...m(status), quelle, art });
    expect(websiteZahlen([w("auftrag"), w("erledigt", "website", "Rückruf"), w("verloren"), w("auftrag", "whatsapp"), w("neu", "telefon")])).toEqual({ anfragen: 3, auftraege: 2, quote: 67, rueckrufe: 1 });
  });
  it("nur erlaubte Schritte", () => { expect(naechsteSchritte("neu")).toEqual(["zurueckgerufen", "verloren"]); expect(naechsteSchritte("erledigt")).not.toContain("neu"); });
});

describe("Validierung", () => {
  it("Status nur aus der Liste, ID nur sicher", () => { expect(statusSchema.safeParse({ id: "abcdef12", status: "auftrag" }).success).toBe(true); expect(statusSchema.safeParse({ id: "abcdef12", status: "geloescht" }).success).toBe(false); expect(statusSchema.safeParse({ id: "../etc", status: "neu" }).success).toBe(false); });
  it("keine offenen Weiterleitungen", () => { expect(sichererPfad("//boese.example")).toBe("/"); expect(sichererPfad("https://x.example")).toBe("/"); expect(sichererPfad("/meldung/abc")).toBe("/meldung/abc"); });
});

describe("Demo-Sitzung", () => {
  it("signiert und unverfälschbar", () => {
    const w = sitzungSignieren({ uid: "u", email: "a@b.example", aal: "aal1" });
    expect(sitzungLesen(w)?.aal).toBe("aal1");
    const [roh, sig] = w.split(".") as [string, string];
    const gefaelscht = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(roh, "base64url").toString()), aal: "aal2" })).toString("base64url") + "." + sig;
    expect(sitzungLesen(gefaelscht)).toBeNull();
    expect(sitzungLesen("kaputt")).toBeNull();
  });
});

describe("Telefon für Anruf und WhatsApp", () => {
  it("Schweizer Formate", () => { expect(e164("071 555 00 00")).toBe("+41715550000"); expect(e164("+41 76 615 44 41")).toBe("+41766154441"); expect(e164("0041 71 555 00 00")).toBe("+41715550000"); expect(e164("12")).toBeNull(); });
});
