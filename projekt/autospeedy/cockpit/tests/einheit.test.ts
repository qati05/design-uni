import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { entscheideZugang } from "../lib/zugang";
import { emailSchema, mailCodeSchema } from "../lib/validierung";
import { sitzungLesen, sitzungSignieren } from "../lib/demo-speicher";

const q = (o: Partial<{ s: boolean; uid: string | null; m: boolean }> = {}) => ({
  hatSitzung: o.s ?? true, nutzerId: async () => (o.uid === undefined ? "u1" : o.uid), istMitglied: async () => o.m ?? true,
});
const ohne = q({ s: false, uid: null, m: false });

describe("Zugang (Muster medaur, nur Mail-Code)", () => {
  it("öffentliche Pfade gehen immer", async () => { expect(await entscheideZugang("/login", ohne)).toEqual({ art: "weiter" }); expect(await entscheideZugang("/bilder/logo-48.webp", ohne)).toEqual({ art: "weiter" }); });
  it("ohne Sitzung zum Login", async () => { expect(await entscheideZugang("/", ohne)).toEqual({ art: "login" }); expect(await entscheideZugang("/", q({ uid: null }))).toEqual({ art: "login" }); });
  it("Mitglied kommt mit dem Mail-Code hinein, ohne zweiten Faktor", async () => { expect(await entscheideZugang("/", q())).toEqual({ art: "weiter" }); });
  it("Konto ohne Mitgliedschaft (oder Cockpit des Betriebs aus) bekommt 403, auch auf Unterseiten", async () => {
    expect(await entscheideZugang("/", q({ m: false }))).toEqual({ art: "verboten" });
    expect(await entscheideZugang("/api/demo-foto/x.webp", q({ m: false }))).toEqual({ art: "verboten" });
  });
  it("entfernte Teile sind nicht mehr öffentlich: Meldungs-Eingang, Versand, Zählung, Mail-Link, Studio", async () => {
    for (const p of ["/api/meldung", "/api/versand", "/api/zaehl", "/auftrag/" + "a".repeat(64), "/studio", "/mfa"]) expect(await entscheideZugang(p, ohne)).toEqual({ art: "login" });
    expect(await entscheideZugang("/studio", q({ m: false }))).toEqual({ art: "verboten" });
  });
  it("App-Dateien ohne Login: Manifest, Service Worker, Offline-Seite, Symbole", async () => {
    for (const p of ["/manifest.webmanifest", "/sw.js", "/offline.html", "/icon-192.png", "/apple-touch-icon.png"]) expect(await entscheideZugang(p, ohne)).toEqual({ art: "weiter" });
  });
});

describe("Validierung Login", () => {
  it("Mail-Adresse und 6-stelliger Code", () => {
    expect(emailSchema.safeParse({ email: "werkstatt@autospeedy.example" }).success).toBe(true);
    expect(emailSchema.safeParse({ email: "keine-mail" }).success).toBe(false);
    expect(mailCodeSchema.safeParse({ email: "a@b.example", code: "123456" }).success).toBe(true);
    expect(mailCodeSchema.safeParse({ email: "a@b.example", code: "12345" }).success).toBe(false);
    expect(mailCodeSchema.safeParse({ email: "a@b.example", code: "12345a" }).success).toBe(false);
  });
});

describe("Demo-Sitzung", () => {
  it("signiert und unverfälschbar", () => {
    const w = sitzungSignieren({ uid: "u", email: "fremd@beispiel.example" });
    expect(sitzungLesen(w)?.email).toBe("fremd@beispiel.example");
    const [roh, sig] = w.split(".") as [string, string];
    const gefaelscht = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(roh, "base64url").toString()), email: "werkstatt@autospeedy.example" })).toString("base64url") + "." + sig;
    expect(sitzungLesen(gefaelscht)).toBeNull();
    expect(sitzungLesen("kaputt")).toBeNull();
  });
  it("läuft nach 30 Tagen ab (wie im Betrieb: 30 Tage pro Gerät)", () => {
    const alt = Buffer.from(JSON.stringify({ uid: "u", email: "a@b.example", t: Date.now() - 31 * 864e5 })).toString("base64url");
    const sig = createHmac("sha256", process.env.DEMO_GEHEIMNIS || "demo-nur-lokal-nicht-fuer-den-betrieb").update(alt).digest("base64url");
    expect(sitzungLesen(`${alt}.${sig}`)).toBeNull();
  });
});

describe("Sitzungs-Cookies", async () => {
  const { haerte, SITZUNG_SEKUNDEN } = await import("../lib/cookies");
  it("immer httpOnly, SameSite=Lax, höchstens 30 Tage, keine fremde Domain; Löschen bleibt Löschen", () => {
    const o = haerte({ httpOnly: false, sameSite: "none", maxAge: 400 * 86400, domain: "boese.example" });
    expect(o).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/", maxAge: SITZUNG_SEKUNDEN });
    expect(o.domain).toBeUndefined();
    expect(haerte({ maxAge: 0 }).maxAge).toBe(0);
    expect(SITZUNG_SEKUNDEN).toBe(30 * 86400);
  });
});
