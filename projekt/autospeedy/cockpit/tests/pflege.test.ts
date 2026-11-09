import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BEREICHE, aenderungen, entwurfAus, entwurfPruefen, entwurfZuDaten, fehlendeFotosEntfernen, fotoAnzeige, fotosEinsetzen, fotosErlaubt, neueFotos, pflegeSchema, zeitenZeile, type Entwurf, type Pflege } from "../lib/pflege";
import { ausnahmeTage } from "../../gemeinsam/site";
import { besucherBeispiel, besucherLesen, letzteTage } from "../lib/besucher.server";
import { baueCsp } from "../lib/sicherheit";
// @ts-expect-error Baustein ohne Typen (reines Node-Skript)
import { startbilder } from "../bau/bilder.mjs";
import start from "../../astro/src/daten/site.json";

const alt = pflegeSchema.parse(start) as Pflege;
const basis = () => entwurfAus(alt);
const daten = (fn?: (e: Entwurf) => void) => { const e = basis(); fn?.(e); return entwurfZuDaten(e); };
const texte = (fn: (e: Entwurf) => void) => aenderungen(daten(), daten(fn)).map((a) => a.text);
const UUID = "0b5f6c1e-1a2b-4c3d-8e9f-001122334455";

describe("Entwurf im Cockpit", () => {
  it("Startwerte ergeben dieselbe Zeile wie die Website", () => { expect(zeitenZeile(alt)).toBe("Mo bis Fr 7.30 bis 12.00 und 13.15 bis 17.30 Uhr"); });
  it("unveränderter Entwurf: gültig, keine Änderung, und beim Speichern geht nichts verloren", () => {
    expect(aenderungen(daten(), daten())).toEqual([]);
    expect(entwurfPruefen(basis())).toBeNull();
    const zurueck = pflegeSchema.parse(entwurfZuDaten(basis(), alt._hinweis));
    expect(zurueck).toEqual(alt);
  });
  it("leere neue Zeilen stören nicht und zählen nicht als Änderung", () => {
    expect(texte((e) => { e.team[0]!.leute.push({ name: "", rolle: "", email: "", einverstaendnis: false }); e.ausnahmen.push({ name: "", datum: "", bisDatum: "", geschlossen: true, von: "", bis: "" }); e.hinweise.push({ art: "info", form: "banner", titel: "", text: " ", link: "", von: "2026-11-09", bis: "2026-11-23" }); e.faq!.push({ frage: "", antwort: "" }); })).toEqual([]);
  });
  it("Hinweis, Feiertag, Zeit: Änderungen in Alltagssprache", () => {
    expect(texte((e) => {
      e.hinweise.push({ art: "hagel", form: "popup", titel: "", text: "Hagel? Jetzt melden.", link: "/schaden-melden/?art=hagel", von: "2026-11-08", bis: "2026-11-22" });
      e.zeiten[0]!.fenster[1].bis = "16.00";
      e.ausnahmen.push({ name: "Weihnachten", datum: "2026-12-25", bisDatum: "", geschlossen: true, von: "", bis: "" });
    })).toEqual(["Neuer Hinweis: «Hagel? Jetzt melden.»", "Öffnungszeiten neu: Mo bis Fr 7.30 bis 12.00 und 13.15 bis 16.00 Uhr", "Neuer Tag: Weihnachten (25.12.2026)"]);
  });
  it("Pop-up gilt nur für Hagel und Aktion: bei anderer Art wird daraus eine Leiste", () => {
    const d = daten((e) => { e.hinweise.push({ art: "info", form: "popup", titel: "", text: "Wir sind umgezogen.", link: "", von: "2026-11-08", bis: "2026-11-22" }); });
    expect(d.hinweise[0]?.form).toBe("banner");
  });
  it("Darstellung «Karte in der Ecke»: gilt für jede Art, aber höchstens eine gleichzeitig", () => {
    const eine = daten((e) => { e.hinweise.push({ art: "ferien", form: "ecke", titel: "Betriebsferien", text: "Wir sind ab dem 4. Januar wieder da.", link: "", von: "2026-12-20", bis: "2027-01-03" }); });
    expect(eine.hinweise[0]?.form).toBe("ecke");
    expect(pflegeSchema.safeParse(eine).success).toBe(true);
    const e = basis();
    for (const text of ["Erste Karte", "Zweite Karte"]) e.hinweise.push({ art: "info", form: "ecke", titel: "", text, link: "", von: "2026-11-08", bis: "2026-11-22" });
    expect(entwurfPruefen(e)).toEqual({ bereich: "hinweise", meldung: "Hinweise: höchstens eine Karte in der Ecke gleichzeitig" });
  });
  it("Ferien von bis: ein Eintrag für mehrere Tage, in Alltagssprache, mit Prüfung", () => {
    const ferien = (bisDatum: string) => (e: Entwurf) => { e.ausnahmen.push({ name: "Betriebsferien", datum: "2026-12-24", bisDatum, geschlossen: true, von: "", bis: "" }); };
    expect(texte(ferien("2027-01-02"))).toEqual(["Neue Ferien: Betriebsferien (24.12.2026 bis 02.01.2027)"]);
    expect(daten(ferien("2027-01-02")).ausnahmen.at(-1)).toEqual({ name: "Betriebsferien", datum: "2026-12-24", bisDatum: "2027-01-02", geschlossen: true });
    expect(ausnahmeTage({ datum: "2026-12-30", bisDatum: "2027-01-02" })).toEqual(["2026-12-30", "2026-12-31", "2027-01-01", "2027-01-02"]);
    expect(ausnahmeTage({ datum: "2026-12-25" })).toEqual(["2026-12-25"]);
    // «Bis» gleich wie «Von» oder leer: ein einzelner Tag, das Feld fällt weg.
    expect(daten(ferien("2026-12-24")).ausnahmen.at(-1)).toEqual({ name: "Betriebsferien", datum: "2026-12-24", geschlossen: true });
    expect(texte(ferien(""))).toEqual(["Neuer Tag: Betriebsferien (24.12.2026)"]);
    const falsch = basis(); ferien("2026-12-20")(falsch);
    expect(entwurfPruefen(falsch)).toEqual({ bereich: "ausnahmen", meldung: "Feiertage und Ferien, Betriebsferien: «bis» darf nicht vor «von» liegen" });
    const lang = basis(); ferien("2027-06-30")(lang);
    expect(entwurfPruefen(lang)?.meldung).toBe("Feiertage und Ferien, Betriebsferien: höchstens 62 Tage am Stück");
  });
  it("Team: entfernen, hinzufügen, Gruppe wechseln, Reihenfolge, Name ändern", () => {
    expect(texte((e) => { e.team[0]!.leute.splice(1, 1); })).toEqual(["Person entfernt: Lea Schlegel"]);
    expect(texte((e) => { e.team[1]!.leute.push({ name: "Neue Person", rolle: "Lernende", email: "", einverstaendnis: false }); })).toEqual(["Neue Person: Neue Person (Carrosserie)"]);
    expect(texte((e) => { const [x] = e.team[0]!.leute.splice(1, 1); e.team[2]!.leute.push(x!); })).toEqual(["Lea Schlegel: neu in der Gruppe «Lackiererei»"]);
    expect(texte((e) => { e.team[1]!.leute.reverse(); })).toEqual(["Team: Reihenfolge geändert"]);
    expect(texte((e) => { e.team[0]!.leute[1]!.name = "Lea Muster"; })).toEqual(["Name geändert: Lea Schlegel heisst neu Lea Muster"]);
    expect(texte((e) => { e.team[0]!.leute[1]!.einverstaendnis = false; e.team[0]!.leute[1]!.foto = "neu:abc123def456"; })).toEqual(["Lea Schlegel: neues Foto", "Lea Schlegel wird nicht mehr auf der Website gezeigt"]);
  });
  it("Fragen, Fotos, Partner, Kontakt, Inhaber", () => {
    expect(texte((e) => { e.faq![0]!.antwort = "Ihre Versicherung, wir klären das."; e.faq!.push({ frage: "Arbeiten Sie am Samstag?", antwort: "Nein, {zeiten}." }); })).toEqual(["Neue Frage: «Arbeiten Sie am Samstag?»", "Antwort geändert: «Wer zahlt die Reparatur?»"]);
    expect(texte((e) => { e.bilder.start = { foto: "neu:abc123def456", alt: "Roter Tesla in der Lackierkabine", b: 1600, h: 1067 }; })).toEqual(["Foto ersetzt: Startseite, Grosses Foto oben"]);
    expect(texte((e) => { e.partner!.splice(1, 1); e.partner!.push({ name: "AXA" }); })).toEqual(["Neuer Partner: AXA", "Partner entfernt: AMAG"]);
    // Letzten entfernen und einen neuen anhängen ist kein «umbenannt»; denselben Eintrag anders nennen schon.
    expect(texte((e) => { e.partner!.pop(); e.partner!.push({ name: "AXA", logo: "neu:abc123def456", b: 300, h: 100 }); })).toEqual(["Neuer Partner: AXA", "Partner entfernt: Ayvens"]);
    expect(texte((e) => { e.partner![1]!.name = "AMAG Rheintal"; })).toEqual(["Partner umbenannt: AMAG heisst neu AMAG Rheintal"]);
    expect(texte((e) => { e.faq![0]!.frage = "Wer bezahlt die Reparatur?"; })).toEqual(["Frage geändert: «Wer bezahlt die Reparatur?»"]);
    expect(texte((e) => { e.kontakt.whatsapp = "076 123 45 67"; e.kontakt.telefon = "071 755 88 62"; })).toEqual(["Telefon neu: 071 755 88 62", "WhatsApp-Nummer neu: 076 123 45 67"]);
    expect(texte((e) => { e.stimme.text = "Wir stehen dafür ein."; e.stimme.freigegeben = true; e.bewertungen.zeigen = false; })).toEqual(["Satz vom Inhaber geändert", "Satz vom Inhaber wird gezeigt", "Google-Bewertungen werden nicht mehr gezeigt"]);
  });
  it("Fehler mit Ort, in Alltagssprache", () => {
    const f = (fn: (e: Entwurf) => void) => { const e = basis(); fn(e); return entwurfPruefen(e); };
    expect(f((e) => { e.zeiten[0]!.fenster[0].bis = "7.00"; })).toEqual({ bereich: "zeiten", meldung: "Öffnungszeiten, Montag bis Freitag: «bis» muss nach «von» liegen" });
    expect(f((e) => { e.team[0]!.leute[1]!.email = "keine-mail"; })).toEqual({ bereich: "team", meldung: "Team, Lea Schlegel: Mail-Adresse ungültig" });
    expect(f((e) => { e.team[0]!.leute[1]!.name = "L"; })).toEqual({ bereich: "team", meldung: "Team, L: Name fehlt oder ist zu kurz" });
    expect(f((e) => { e.hinweise.push({ art: "info", form: "banner", titel: "", text: "<script>x</script>", link: "", von: "2026-11-08", bis: "2026-11-22" }); })?.bereich).toBe("hinweise");
    expect(f((e) => { e.hinweise.push({ art: "info", form: "banner", titel: "", text: "Guten Tag", link: "https://boese.example", von: "2026-11-08", bis: "2026-11-22" }); })?.bereich).toBe("hinweise"); // nur Links auf die eigene Website
    expect(f((e) => { e.kontakt.whatsapp = "12345"; })).toEqual({ bereich: "kontakt", meldung: "Kontakt: WhatsApp-Nummer wie 076 123 45 67" });
    expect(f((e) => { e.bilder.start = { foto: "neu:abc123def456", alt: "", b: 1600, h: 1067 }; })).toEqual({ bereich: "fotos", meldung: "Fotos, Grosses Foto oben: Beschreibung fehlt oder ist zu kurz" });
    expect(f((e) => { e.faq![0]!.antwort = "ok"; })).toEqual({ bereich: "fragen", meldung: "Häufige Fragen, Frage 1: Antwort fehlt oder ist zu kurz" });
    expect(f((e) => { e.partner = []; })).toEqual({ bereich: "partner", meldung: "Partner: Es braucht mindestens einen und höchstens 12 Partner." });
  });
  it("Bereiche: jede Kennung genau einmal", () => {
    expect(new Set(BEREICHE.map((a) => a.id)).size).toBe(BEREICHE.length);
    for (const a of BEREICHE) expect(a.id).toMatch(/^[a-z]+$/);
  });
});

describe("Fotos", async () => {
  const { fotoTyp } = await import("../lib/foto");
  const { TEAMFOTO } = await import("../lib/pflege");
  it("erkennt Bilder an den ersten Bytes, nicht am Namen", () => {
    expect(fotoTyp(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe("image/jpeg");
    expect(fotoTyp(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0, 0]))).toBe("image/png");
    expect(fotoTyp(new Uint8Array([...Buffer.from("RIFF0000WEBPVP8 ")]))).toBe("image/webp");
    expect(fotoTyp(new Uint8Array([...Buffer.from("<svg onload=alert(1)>")]))).toBeNull();
  });
  it("nur erlaubte Foto-Adressen: Startbild oder Bild-Speicher mit zufälligem Namen, nie data: im Git", () => {
    expect(TEAMFOTO.test("/bilder/team/anna-meier.webp")).toBe(true);
    expect(TEAMFOTO.test(`https://fotos.beispiel.ch/team/${UUID}.webp`)).toBe(true);
    expect(TEAMFOTO.test("data:image/webp;base64,UklGRg==")).toBe(false);
    expect(TEAMFOTO.test("https://boese.example/x.webp")).toBe(false);
    expect(TEAMFOTO.test("javascript:alert(1)")).toBe(false);
    expect(TEAMFOTO.test(`https://fotos.beispiel.ch/team/${UUID}.svg`)).toBe(false);
  });
  it("neue Fotos: Platzhalter werden gefunden (mit Ordner) und durch die Adresse ersetzt", () => {
    const d = daten((e) => { e.team[0]!.leute[0]!.foto = "neu:aaaaaa111111"; e.bilder.start = { foto: "neu:bbbbbb222222", alt: "Auto in der Kabine", b: 1600, h: 1067 }; e.partner![0]!.logo = "neu:cccccc333333"; });
    expect(neueFotos(d)).toEqual([{ platzhalter: "neu:aaaaaa111111", ordner: "team" }, { platzhalter: "neu:bbbbbb222222", ordner: "bild" }, { platzhalter: "neu:cccccc333333", ordner: "bild" }]);
    fotosEinsetzen(d, new Map([["neu:aaaaaa111111", `https://fotos.beispiel.ch/team/${UUID}.webp`], ["neu:bbbbbb222222", `https://fotos.beispiel.ch/bild/${UUID}.webp`], ["neu:cccccc333333", `https://fotos.beispiel.ch/bild/${UUID}.png`]]));
    expect(pflegeSchema.safeParse(d).success).toBe(true);
    expect(neueFotos(d)).toEqual([]);
    expect(neueFotos("unsinn")).toEqual([]); expect(neueFotos({ team: "x", bilder: [1], partner: [null] })).toEqual([]);
  });
  it("ein Platzhalter, zu dem kein Foto hochgeladen wurde, fällt beim Prüfen durch", () => {
    const d = daten((e) => { e.team[0]!.leute[0]!.foto = "neu:aaaaaa111111"; });
    expect(pflegeSchema.safeParse(d).success).toBe(false);
  });
  it("fremde Adresse im Bild-Speicher wird abgewiesen (sonst liesse sich ein fremdes Bild löschen)", () => {
    const fremd = `https://fotos.beispiel.ch/team/9999${UUID.slice(4)}.webp`;
    const mit = (foto: string) => ({ ...alt, team: [{ name: "Administration", leute: [{ name: "Anna", rolle: "x", foto, einverstaendnis: true }] }] }) as Pflege;
    expect(fotosErlaubt(mit(fremd), alt, [])).toBe(false);
    expect(fotosErlaubt(mit(fremd), alt, [fremd])).toBe(true); // eben hochgeladen
    expect(fotosErlaubt(mit("/bilder/team/lea-schlegel.webp"), alt, [])).toBe(true); // Startbild der Website
    const logo = `https://fotos.beispiel.ch/bild/${UUID}.png`;
    expect(fotosErlaubt({ ...alt, partner: [{ name: "AXA", logo }] } as Pflege, alt, [])).toBe(false);
    expect(fotosErlaubt({ ...alt, bilder: { start: { foto: logo, alt: "Auto in der Kabine", b: 800, h: 600 } } } as Pflege, alt, [])).toBe(false);
  });
  it("alten Stand laden: Bilder, die es im Bild-Speicher nicht mehr gibt, fallen weg; der Rest bleibt", () => {
    const foto = `https://fotos.beispiel.ch/team/${UUID}.webp`, bild = `https://fotos.beispiel.ch/bild/${UUID}.webp`;
    const frueher = structuredClone(alt);
    frueher.team[0]!.leute[0]!.foto = foto; frueher.bilder = { start: { foto: bild, alt: "Auto in der Kabine", b: 800, h: 600 } }; frueher.partner![0]!.logo = bild;
    const r = fehlendeFotosEntfernen(frueher, alt);
    expect(r.fehlen).toBe(3);
    expect(r.daten.team[0]!.leute[0]!.foto).toBeUndefined(); expect(r.daten.bilder).toEqual({}); expect(r.daten.partner![0]).toEqual({ name: frueher.partner![0]!.name });
    expect(r.daten.team[0]!.leute[1]!.foto).toBe("/bilder/team/lea-schlegel.webp");
    expect(pflegeSchema.safeParse(r.daten).success).toBe(true);
    expect(fehlendeFotosEntfernen(frueher, frueher).fehlen).toBe(0);
  });
  it("Demo: Bilder aus beiden Ordnern kommen über /api/demo-foto, alles andere bleibt", () => {
    expect(fotoAnzeige(`https://demo-fotos.invalid/team/${UUID}.webp`)).toBe(`/api/demo-foto/${UUID}.webp`);
    expect(fotoAnzeige(`https://demo-fotos.invalid/bild/${UUID}.png`)).toBe(`/api/demo-foto/${UUID}.png`);
    expect(fotoAnzeige("/bilder/team/lea-schlegel.webp")).toBe("/bilder/team/lea-schlegel.webp");
  });
  it("das Cockpit hat dieselben Startbilder wie die Website (npm run bilder)", () => {
    const pfade = startbilder() as string[];
    expect(pfade.length).toBeGreaterThan(9);
    for (const p of pfade) expect(readFileSync(new URL(`../public${p}`, import.meta.url)).equals(readFileSync(new URL(`../../astro-klar/public${p}`, import.meta.url))), p).toBe(true);
  });
  it("CSP: Bilder nur vom Cockpit selbst und vom eigenen Bild-Speicher", () => {
    expect(baueCsp("n")).toContain("img-src 'self' data: blob:;");
    expect(baueCsp("n", { bildSpeicher: "https://fotos.beispiel.ch/irgendwas" })).toContain("img-src 'self' data: blob: https://fotos.beispiel.ch;");
    expect(baueCsp("n", { bildSpeicher: "http://unsicher.example" })).toContain("img-src 'self' data: blob:;");
    expect(baueCsp("n", { bildSpeicher: "kaputt" })).toContain("img-src 'self' data: blob:;");
  });
});

describe("Besucherzahlen (Cloudflare Web Analytics), ohne Netz", () => {
  const Z = { konto: "a".repeat(32), seite: "b".repeat(32), token: "TOKEN" };
  const HEUTE = new Date("2026-11-09T15:00:00Z");
  it("die letzten 28 Tage, ältester zuerst", () => {
    const t = letzteTage(HEUTE);
    expect(t.length).toBe(28); expect(t[0]).toBe("2026-10-13"); expect(t.at(-1)).toBe("2026-11-09");
  });
  it("fragt nur Summen ab, füllt Tage ohne Besuch mit 0 und schneidet Adressen hinter «?» ab", async () => {
    let gesendet: { query: string; variables: { konto: string; filter: { AND: Record<string, unknown>[] } } } | null = null, kopf: Headers | null = null;
    const altFetch = globalThis.fetch;
    globalThis.fetch = (async (_u: unknown, o: RequestInit) => { gesendet = JSON.parse(String(o.body)); kopf = new Headers(o.headers); return Response.json({ data: { viewer: { accounts: [{ tage: [{ sum: { visits: 12 }, dimensions: { date: "2026-11-09" } }, { sum: { visits: 3 }, dimensions: { date: "2026-10-13" } }], seiten: [{ sum: { visits: 9 }, dimensions: { requestPath: "/" } }, { sum: { visits: 4 }, dimensions: { requestPath: "/kontakt/?name=Muster" } }, { sum: { visits: 1 }, dimensions: { requestPath: 5 } }] }] } }, errors: null }); }) as typeof fetch;
    try {
      const r = await besucherLesen(Z, HEUTE);
      expect(r?.beispiel).toBe(false); expect(r?.tage.length).toBe(28);
      expect(r?.tage[0]).toEqual({ datum: "2026-10-13", besuche: 3 }); expect(r?.tage[1]?.besuche).toBe(0); expect(r?.tage.at(-1)).toEqual({ datum: "2026-11-09", besuche: 12 });
      expect(r?.seiten).toEqual([{ pfad: "/", besuche: 9 }, { pfad: "/kontakt/", besuche: 4 }]);
      expect(kopf!.get("authorization")).toBe("Bearer TOKEN");
      expect(gesendet!.variables.konto).toBe(Z.konto); expect(gesendet!.variables.filter.AND[0]).toEqual({ siteTag: Z.seite });
      expect(gesendet!.query).not.toMatch(/userAgent|clientIP|countryName|refererHost/); // keine Angaben zu einzelnen Besuchern
    } finally { globalThis.fetch = altFetch; }
  });
  it("Fehler von Cloudflare, falsche Angaben oder keine Antwort: null statt falscher Zahlen", async () => {
    const altFetch = globalThis.fetch;
    try {
      globalThis.fetch = (async () => Response.json({ data: null, errors: [{ message: "x" }] })) as typeof fetch;
      expect(await besucherLesen(Z, HEUTE)).toBeNull();
      globalThis.fetch = (async () => new Response("", { status: 403 })) as typeof fetch;
      expect(await besucherLesen(Z, HEUTE)).toBeNull();
      globalThis.fetch = (async () => { throw new Error("aus"); }) as typeof fetch;
      expect(await besucherLesen(Z, HEUTE)).toBeNull();
      let aufrufe = 0; globalThis.fetch = (async () => { aufrufe++; return Response.json({}); }) as typeof fetch;
      expect(await besucherLesen({ ...Z, konto: "../boese" }, HEUTE)).toBeNull(); expect(aufrufe).toBe(0);
    } finally { globalThis.fetch = altFetch; }
  });
  it("Demo-Zahlen sind als Beispiel gekennzeichnet", () => {
    const b = besucherBeispiel(HEUTE);
    expect(b.beispiel).toBe(true); expect(b.tage.length).toBe(28); expect(b.seiten[0]?.pfad).toBe("/");
  });
});
