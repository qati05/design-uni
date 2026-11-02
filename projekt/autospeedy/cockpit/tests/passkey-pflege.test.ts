import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { describe, expect, it } from "vitest";
import { anmeldungPruefen, registrierungPruefen } from "../lib/webauthn-pruefung";
import { pflegeAusFormular, pflegeSchema, zeitenZeile, type Pflege } from "../lib/pflege";
import start from "../lib/pflege-start.json";
import { entscheideZugang } from "../lib/zugang";

// Ein «Gerät» im Test: echter ES256-Schlüssel, Daten wie ein Handy sie liefert.
const RP = "localhost", ORIGIN = "http://localhost:4400";
const { publicKey, privateKey } = generateKeyPairSync("ec", { namedCurve: "P-256" });
const spki = publicKey.export({ format: "der", type: "spki" }).toString("base64url");
const b64 = (b: Buffer | string) => Buffer.from(b).toString("base64url");
const authData = (flags = 0x05, zaehler = 0, rp = RP) => { const z = Buffer.alloc(4); z.writeUInt32BE(zaehler); return Buffer.concat([createHash("sha256").update(rp).digest(), Buffer.from([flags]), z]); };
const cd = (type: string, challenge: string, origin = ORIGIN) => Buffer.from(JSON.stringify({ type, challenge, origin }));
const ID = "Z2VyYWV0LWlkLTEyMzQ1Njc4OTA";

function registrierung(challenge: string, o: { flags?: number; origin?: string; alg?: number } = {}) {
  return { id: ID, type: "public-key", response: { clientDataJSON: b64(cd("webauthn.create", challenge, o.origin)), authenticatorData: b64(authData(o.flags)), publicKey: spki, publicKeyAlgorithm: o.alg ?? -7 } };
}
function anmeldung(challenge: string, o: { flags?: number; zaehler?: number; rp?: string; falsch?: boolean } = {}) {
  const ad = authData(o.flags, o.zaehler, o.rp), c = cd("webauthn.get", challenge);
  const sig = sign("sha256", Buffer.concat([ad, createHash("sha256").update(c).digest()]), privateKey);
  if (o.falsch) sig.writeUInt8(sig.readUInt8(sig.length - 1) ^ 1, sig.length - 1);
  return { id: ID, type: "public-key", response: { clientDataJSON: b64(c), authenticatorData: b64(ad), signature: b64(sig) } };
}

describe("Fingerabdruck/Gesicht (WebAuthn, Demo-Prüfung)", () => {
  const erw = { challenge: "abcDEF123_-", origin: ORIGIN, rpId: RP };
  const reg = registrierungPruefen(registrierung(erw.challenge), { ...erw, name: "iPhone" });
  it("Einrichten mit Gerät, das die Person geprüft hat", () => { expect(reg.ok).toBe(true); });
  it("Einrichten ohne Fingerabdruck/Gesicht/PIN abgelehnt", () => { expect(registrierungPruefen(registrierung(erw.challenge, { flags: 0x01 }), { ...erw, name: "x" }).ok).toBe(false); });
  it("Einrichten von fremder Seite (Phishing) abgelehnt", () => { expect(registrierungPruefen(registrierung(erw.challenge, { origin: "https://autospeedy-login.example" }), { ...erw, name: "x" }).ok).toBe(false); });
  it("Einrichten mit alter Challenge abgelehnt", () => { expect(registrierungPruefen(registrierung("andere"), { ...erw, name: "x" }).ok).toBe(false); });
  it("Unbekanntes Verfahren abgelehnt", () => { expect(registrierungPruefen(registrierung(erw.challenge, { alg: -999 }), { ...erw, name: "x" }).ok).toBe(false); });
  const k = reg.ok ? [reg.wert] : [];
  it("Anmelden mit echter Unterschrift", () => { expect(anmeldungPruefen(anmeldung(erw.challenge), k, erw)).toEqual({ ok: true, wert: { id: ID, zaehler: 0 } }); });
  it("Falsche Unterschrift, falsche Seite, fremde Challenge: abgelehnt", () => {
    expect(anmeldungPruefen(anmeldung(erw.challenge, { falsch: true }), k, erw).ok).toBe(false);
    expect(anmeldungPruefen(anmeldung(erw.challenge, { rp: "boese.example" }), k, erw).ok).toBe(false);
    expect(anmeldungPruefen(anmeldung("alt"), k, erw).ok).toBe(false);
    expect(anmeldungPruefen(anmeldung(erw.challenge), [], erw).ok).toBe(false);
  });
  it("Zähler, der nicht steigt, wird abgelehnt (kopierter Schlüssel)", () => {
    const mitZaehler = [{ ...k[0]!, zaehler: 5 }];
    expect(anmeldungPruefen(anmeldung(erw.challenge, { zaehler: 5 }), mitZaehler, erw).ok).toBe(false);
    expect(anmeldungPruefen(anmeldung(erw.challenge, { zaehler: 6 }), mitZaehler, erw).ok).toBe(true);
  });
});

describe("Website-Pflege im Cockpit", () => {
  const { _quelle, ...roh } = start as Record<string, unknown>; void _quelle;
  const alt = pflegeSchema.parse(roh) as Pflege;
  const form = (f: Record<string, string>) => { const d = new FormData(); for (const [k, v] of Object.entries(f)) d.set(k, v); return d; };
  const basis = { "hinweis.text": "Hagel? Jetzt melden.", "hinweis.link": "/schaden-melden/?art=hagel", "zeit.0.von1": "7.30", "zeit.0.bis1": "12.00", "zeit.0.von2": "13.15", "zeit.0.bis2": "17.30", "zeit.1.von1": "7.30", "zeit.1.bis1": "12.00", "zeit.1.von2": "13.15", "zeit.1.bis2": "17.15" };
  it("Startwerte ergeben dieselbe Zeile wie die Website", () => { expect(zeitenZeile(alt)).toBe("Mo bis Do 7.30 bis 12.00 und 13.15 bis 17.30 Uhr, Fr 7.30 bis 12.00 und 13.15 bis 17.15 Uhr"); });
  it("Hinweis einschalten, Feiertag hinzufügen, Zeit ändern", () => {
    const r = pflegeAusFormular(form({ ...basis, "hinweis.aktiv": "on", "zeit.1.bis2": "16.00", "aus.0.datum": "2026-12-25", "aus.0.name": "Weihnachten", "aus.0.art": "zu", "aus.0.von": "", "aus.0.bis": "" }), alt);
    expect(r.success).toBe(true);
    expect(r.data?.hinweis.aktiv).toBe(true);
    expect(r.data?.ausnahmen).toEqual([{ name: "Weihnachten", datum: "2026-12-25", geschlossen: true }]);
    expect(r.data?.zeiten[1]?.fenster[1]).toEqual({ von: "13.15", bis: "16.00" });
  });
  it("Unsinnige Zeiten und HTML werden abgewiesen", () => {
    expect(pflegeAusFormular(form({ ...basis, "zeit.0.bis1": "7.00" }), alt).success).toBe(false);
    expect(pflegeAusFormular(form({ ...basis, "zeit.0.von1": "25.00" }), alt).success).toBe(false);
    expect(pflegeAusFormular(form({ ...basis, "hinweis.text": "<script>x</script>" }), alt).success).toBe(false);
    expect(pflegeAusFormular(form({ ...basis, "hinweis.link": "https://boese.example" }), alt).success).toBe(false); // nur Links auf die eigene Website
  });
  it("Person entfernen und hinzufügen", () => {
    const f: Record<string, string> = { ...basis };
    alt.team.forEach((g, gi) => g.leute.forEach((p, pi) => { f[`team.${gi}.p.${pi}.name`] = p.name; f[`team.${gi}.p.${pi}.rolle`] = p.rolle; }));
    f["team.0.p.0.weg"] = "on"; f["team.1.p.9.name"] = "Neue Person"; f["team.1.p.9.rolle"] = "Lernende";
    const r = pflegeAusFormular(form(f), alt);
    expect(r.success).toBe(true);
    expect(r.data?.team[0]?.leute.length).toBe(alt.team[0]!.leute.length - 1);
    expect(r.data?.team[1]?.leute.at(-1)).toEqual({ name: "Neue Person", rolle: "Lernende" });
  });
});

describe("App-Dateien sind ohne Login erreichbar, alles andere nicht", () => {
  const ohne = { hatSitzung: false, nutzerId: async () => null, stufe: async () => ({ aktuell: null, naechste: null }), istMitglied: async () => false };
  it("Manifest, Service Worker, Offline-Seite, Symbole", async () => { for (const p of ["/manifest.webmanifest", "/sw.js", "/offline.html", "/icon-192.png"]) expect(await entscheideZugang(p, ohne)).toEqual({ art: "weiter" }); });
  it("Pflege und Geräte nur mit Login", async () => { for (const p of ["/pflege", "/geraete"]) expect(await entscheideZugang(p, ohne)).toEqual({ art: "login" }); });
});

describe("Teamfotos", async () => {
  const { fotoTyp } = await import("../lib/foto");
  const { fotoSchema } = await import("../lib/pflege");
  it("erkennt Bilder an den ersten Bytes, nicht am Namen", () => {
    expect(fotoTyp(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe("image/jpeg");
    expect(fotoTyp(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0, 0]))).toBe("image/png");
    expect(fotoTyp(new Uint8Array([...Buffer.from("RIFF0000WEBPVP8 ")]))).toBe("image/webp");
    expect(fotoTyp(new Uint8Array([...Buffer.from("<svg onload=alert(1)>")]))).toBeNull();
  });
  it("nur erlaubte Foto-Adressen", () => {
    expect(fotoSchema.safeParse("/bilder/team/anna-meier.webp").success).toBe(true);
    expect(fotoSchema.safeParse("https://abcd.supabase.co/storage/v1/object/public/teamfotos/1234abcd.webp").success).toBe(true);
    expect(fotoSchema.safeParse("data:image/webp;base64,UklGRg==").success).toBe(true);
    expect(fotoSchema.safeParse("https://boese.example/x.webp").success).toBe(false);
    expect(fotoSchema.safeParse("javascript:alert(1)").success).toBe(false);
    expect(fotoSchema.safeParse("data:image/svg+xml;base64,PHN2Zz4=").success).toBe(false);
  });
});

describe("Auftrag erledigt und Bewertung", async () => {
  const { auftragMail, bewertungMail } = await import("../lib/mailtexte");
  const { trichter } = await import("../lib/zahlen");
  it("Auftrags-Mail: Link, ohne Personendaten, sagt ob Bewertungs-Mail kommt", () => {
    const a = auftragMail({ art: "Hagel", tesla: true, link: "https://cockpit.example/auftrag/abc", mitMail: true });
    expect(a.betreff).toContain("Hagel (Tesla)"); expect(a.text).toContain("https://cockpit.example/auftrag/abc"); expect(a.text).toContain("24 Stunden");
    expect(auftragMail({ art: "Felge", tesla: false, link: "x", mitMail: false }).text).toContain("WhatsApp");
  });
  it("Bewertungs-Mail: Vorname, Link auf /bewerten/, sagt warum sie kommt", () => {
    const b = bewertungMail({ name: "Peter Muster", website: "https://www.autospeedy.ch/" });
    expect(b.text).toMatch(/^Guten Tag Peter\n/); expect(b.text).toContain("https://www.autospeedy.ch/bewerten/"); expect(b.text).toContain("einmal");
  });
  it("Trichter: Anteil vom ersten Schritt", () => {
    const z = (punkt: string, anzahl: number) => ({ tag: "2026-11-02", punkt, ort: "schaden", anzahl });
    expect(trichter([z("trichter-1", 10), z("trichter-2", 6), z("trichter-3", 5), z("meldung-gesendet", 3), z("schaden-whatsapp", 1)]).map((t) => t.anteil)).toEqual([100, 60, 50, 40]);
    expect(trichter([])[0]!.anteil).toBeNull();
  });
  it("Mail-Link und Versand sind ohne Login erreichbar (geschützt durch Token bzw. Geheimnis)", async () => {
    const ohne = { hatSitzung: false, nutzerId: async () => null, stufe: async () => ({ aktuell: null, naechste: null }), istMitglied: async () => false };
    expect(await entscheideZugang("/auftrag/" + "a".repeat(64), ohne)).toEqual({ art: "weiter" });
    expect(await entscheideZugang("/api/versand", ohne)).toEqual({ art: "weiter" });
  });
});
