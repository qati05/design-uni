import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { describe, expect, it } from "vitest";
import { anmeldungPruefen, registrierungPruefen } from "../lib/webauthn-pruefung";
import { pflegeAusFormular, pflegeSchema, zeitenZeile, type Pflege } from "../lib/pflege";
import start from "../../astro/src/daten/site.json";
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
  const alt = pflegeSchema.parse(start) as Pflege;
  const form = (f: Record<string, string>) => { const d = new FormData(); for (const [k, v] of Object.entries(f)) d.set(k, v); return d; };
  const basis = { "bewertungen.zeigen": "on", "zeit.0.von1": "7.30", "zeit.0.bis1": "12.00", "zeit.0.von2": "13.15", "zeit.0.bis2": "17.30" };
  it("Startwerte ergeben dieselbe Zeile wie die Website", () => { expect(zeitenZeile(alt)).toBe("Mo bis Fr 7.30 bis 12.00 und 13.15 bis 17.30 Uhr"); });
  const hinweis = { "hin.0.art": "hagel", "hin.0.form": "banner", "hin.0.titel": "", "hin.0.text": "Hagel? Jetzt melden.", "hin.0.link": "/schaden-melden/?art=hagel", "hin.0.von": "2026-11-08", "hin.0.bis": "2026-11-22" };
  it("Hinweis einschalten, Feiertag hinzufügen, Zeit ändern", () => {
    const r = pflegeAusFormular(form({ ...basis, ...hinweis, "zeit.0.bis2": "16.00", "aus.0.datum": "2026-12-25", "aus.0.name": "Weihnachten", "aus.0.art": "zu", "aus.0.von": "", "aus.0.bis": "" }), alt);
    expect(r.success).toBe(true);
    expect(r.data?.hinweise).toEqual([{ art: "hagel", form: "banner", titel: "", text: "Hagel? Jetzt melden.", link: "/schaden-melden/?art=hagel", von: "2026-11-08", bis: "2026-11-22" }]);
    expect(r.data?.ausnahmen).toEqual([{ name: "Weihnachten", datum: "2026-12-25", geschlossen: true }]);
    expect(r.data?.zeiten[0]?.fenster[1]).toEqual({ von: "13.15", bis: "16.00" });
  });
  it("Unsinnige Zeiten und HTML werden abgewiesen", () => {
    expect(pflegeAusFormular(form({ ...basis, "zeit.0.bis1": "7.00" }), alt).success).toBe(false);
    expect(pflegeAusFormular(form({ ...basis, "zeit.0.von1": "25.00" }), alt).success).toBe(false);
    expect(pflegeAusFormular(form({ ...basis, ...hinweis, "hin.0.text": "<script>x</script>" }), alt).success).toBe(false);
    expect(pflegeAusFormular(form({ ...basis, ...hinweis, "hin.0.link": "https://boese.example" }), alt).success).toBe(false); // nur Links auf die eigene Website
    expect(pflegeAusFormular(form({ ...basis, ...hinweis, "hin.0.art": "info", "hin.0.form": "popup" }), alt).success).toBe(false); // Pop-up nur für Hagel und Aktion
  });
  it("Speichern verliert weder Inhaber-Satz noch Bewertungen-Schalter noch Einverständnis", () => {
    const f: Record<string, string> = { ...basis, "stimme.text": "Wir stehen dafür ein.", "stimme.name": "Name", "stimme.rolle": "Inhaber", "stimme.freigegeben": "on", "team.0.p.0.name": "Anna", "team.0.p.0.rolle": "Büro", "team.0.p.0.einverstaendnis": "on", "team.0.p.1.name": "Ben", "team.0.p.1.rolle": "Lack" };
    const r = pflegeAusFormular(form(f), alt);
    expect(r.data?.stimme).toEqual({ text: "Wir stehen dafür ein.", name: "Name", rolle: "Inhaber", freigegeben: true });
    expect(r.data?.bewertungen.zeigen).toBe(true);
    expect(r.data?.team[0]?.leute.map((p) => p.einverstaendnis)).toEqual([true, false]);
  });
  it("Person entfernen und hinzufügen", () => {
    const f: Record<string, string> = { ...basis };
    alt.team.forEach((g, gi) => g.leute.forEach((p, pi) => { f[`team.${gi}.p.${pi}.name`] = p.name; f[`team.${gi}.p.${pi}.rolle`] = p.rolle; }));
    f["team.0.p.0.weg"] = "on"; f["team.1.p.9.name"] = "Neue Person"; f["team.1.p.9.rolle"] = "Lernende";
    const r = pflegeAusFormular(form(f), alt);
    expect(r.success).toBe(true);
    expect(r.data?.team[0]?.leute.length).toBe(alt.team[0]!.leute.length - 1);
    expect(r.data?.team[1]?.leute.at(-1)).toEqual({ name: "Neue Person", rolle: "Lernende", einverstaendnis: false });
  });
});

describe("App-Dateien sind ohne Login erreichbar, alles andere nicht", () => {
  const ohne = { hatSitzung: false, nutzerId: async () => null, stufe: async () => ({ aktuell: null, naechste: null }), istMitglied: async () => false };
  it("Manifest, Service Worker, Offline-Seite, Symbole", async () => { for (const p of ["/manifest.webmanifest", "/sw.js", "/offline.html", "/icon-192.png"]) expect(await entscheideZugang(p, ohne)).toEqual({ art: "weiter" }); });
  it("Pflege nur mit Login", async () => { for (const p of ["/pflege"]) expect(await entscheideZugang(p, ohne)).toEqual({ art: "login" }); });
});

describe("Teamfotos", async () => {
  const { fotoTyp } = await import("../lib/foto");
  const { TEAMFOTO, fotosErlaubt } = await import("../lib/pflege");
  it("erkennt Bilder an den ersten Bytes, nicht am Namen", () => {
    expect(fotoTyp(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe("image/jpeg");
    expect(fotoTyp(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0, 0]))).toBe("image/png");
    expect(fotoTyp(new Uint8Array([...Buffer.from("RIFF0000WEBPVP8 ")]))).toBe("image/webp");
    expect(fotoTyp(new Uint8Array([...Buffer.from("<svg onload=alert(1)>")]))).toBeNull();
  });
  it("nur erlaubte Foto-Adressen: Startbild oder Bild-Speicher mit zufälligem Namen, nie data: im Git", () => {
    expect(TEAMFOTO.test("/bilder/team/anna-meier.webp")).toBe(true);
    expect(TEAMFOTO.test("https://fotos.beispiel.ch/team/0b5f6c1e-1a2b-4c3d-8e9f-001122334455.webp")).toBe(true);
    expect(TEAMFOTO.test("data:image/webp;base64,UklGRg==")).toBe(false);
    expect(TEAMFOTO.test("https://boese.example/x.webp")).toBe(false);
    expect(TEAMFOTO.test("javascript:alert(1)")).toBe(false);
    expect(TEAMFOTO.test("https://fotos.beispiel.ch/team/0b5f6c1e-1a2b-4c3d-8e9f-001122334455.svg")).toBe(false);
  });
  it("fremde Foto-Adresse im Formular wird abgewiesen (sonst liesse sich ein fremdes Bild löschen)", () => {
    const fremd = "https://fotos.beispiel.ch/team/99999999-1a2b-4c3d-8e9f-001122334455.webp";
    const mit = (foto: string) => ({ ...start, team: [{ name: "A", leute: [{ name: "Anna", rolle: "x", foto }] }] }) as unknown as Pflege;
    expect(fotosErlaubt(mit(fremd), start as unknown as Pflege, [])).toBe(false);
    expect(fotosErlaubt(mit(fremd), start as unknown as Pflege, [fremd])).toBe(true); // eben hochgeladen
    expect(fotosErlaubt(mit("/bilder/team/" + "x".repeat(3) + ".webp"), mit("/bilder/team/xxx.webp"), [])).toBe(true);
  });
});

describe("Auftrag erledigt und Bewertung", async () => {
  const { bewertungMail } = await import("../lib/mailtexte");
  const { trichter } = await import("../lib/zahlen");
  it("Bewertungs-Mail: Vorname, Link auf /bewerten/, sagt warum sie kommt", () => {
    const b = bewertungMail({ name: "Peter Muster", website: "https://www.autospeedy.ch/", betrieb: "Auto Speedy AG" });
    expect(b.betreff).toBe("Danke für Ihren Auftrag bei Auto Speedy AG");
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
