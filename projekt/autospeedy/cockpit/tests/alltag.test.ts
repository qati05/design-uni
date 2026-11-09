import { describe, expect, it } from "vitest";
import { HINWEIS_LINKS, aenderungen, entwurfAus, entwurfPruefen, entwurfZuDaten, pflegeSchema, type Entwurf, type EntwurfHinweis, type Pflege } from "../lib/pflege";
import {
  HINWEIS_VORLAGEN, ausnahmeAendern, ausnahmeAm, ausnahmeEntfernen, ausnahmeSchliessen, ferienBindung, ferienHinweis, ferienHinweisGrund, ferienHinweisIndex,
  ferienHinweisSchalten, ferienStand, ferienText, hagelHinweisIndex, hilfeAdresse, hinweisAusVorlage, hinweiseStand, letzterTag, websiteAdresse,
} from "../lib/alltag";
import start from "../../astro/src/daten/site.json";

const HEUTE = "2026-11-09";
const alt = pflegeSchema.parse(start) as Pflege;
const basis = () => entwurfAus(alt);
const texte = (e: Entwurf) => aenderungen(entwurfZuDaten(basis()), entwurfZuDaten(e)).map((a) => a.text);
const tag = (name: string, datum: string, bisDatum = "", offen?: [string, string]): Entwurf["ausnahmen"][number] => ({ name, datum, bisDatum, geschlossen: !offen, von: offen?.[0] ?? "", bis: offen?.[1] ?? "" });
const hinweis = (h: Partial<EntwurfHinweis>): EntwurfHinweis => ({ art: "info", form: "banner", titel: "", text: "Ein Hinweis.", link: "", von: HEUTE, bis: "2026-11-23", ...h });
/** Entwurf mit einem Eintrag bei «Feiertage und Ferien» (Stelle 0). */
const mit = (a: Entwurf["ausnahmen"][number], hinweise: EntwurfHinweis[] = []) => { const e = basis(); e.ausnahmen.push(a); e.hinweise.push(...hinweise); return e; };

describe("Vorlagen für Hinweise", () => {
  it("sechs Vorlagen, jede hält die Regeln der Website ein", () => {
    expect(HINWEIS_VORLAGEN.map((v) => v.name)).toEqual(["Hagel", "Betriebsferien", "Kurzfristig geschlossen", "Aktion", "Stelle frei", "Leerer Hinweis"]);
    const links = ["", ...HINWEIS_LINKS.map((l) => l.wert)];
    for (const v of HINWEIS_VORLAGEN) {
      expect(v.titel.length, v.name).toBeLessThanOrEqual(50);
      expect(v.text.length, v.name).toBeLessThanOrEqual(160);
      expect(links, v.name).toContain(v.link);
      const e = basis(); const h = hinweisAusVorlage(v.id, e, HEUTE)!;
      expect(h.von, v.name).toBe(HEUTE);
      expect(h.bis >= h.von, v.name).toBe(true);
      // Mit einem Text (dem vorgeschlagenen oder einem eigenen) lässt sich jede Vorlage veröffentlichen.
      e.hinweise.push({ ...h, text: h.text || "Eigener Text des Betriebs." });
      expect(entwurfPruefen(e), v.name).toBeNull();
    }
  });
  it("Texte: Schweizer Schreibweise, keine Preise, keine Versprechen, kein Firmen- oder Leasingangebot", () => {
    for (const v of HINWEIS_VORLAGEN) for (const t of [v.name, v.unter, v.titel, v.text]) expect(t, v.name).not.toMatch(/ß|[–—]|%|CHF|Fr\.|Rabatt|gratis|kostenlos|günstig|garant|Leasing|Flotte|Firmen/i);
  });
  it("Hagel: Fenster mit dem abgesprochenen Text und dem Link zur Schadenmeldung", () => {
    expect(hinweisAusVorlage("hagel", basis(), HEUTE)).toEqual({ art: "hagel", form: "popup", titel: "Hagelschaden?", text: "Melden Sie Ihren Schaden gleich online. Die Abwicklung mit Ihrer Versicherung übernehmen wir.", link: "/schaden-melden/?art=hagel", von: HEUTE, bis: "2026-12-07" });
  });
  it("Aktion und leerer Hinweis: ohne erfundenen Text; sie stören nicht, solange sie leer sind", () => {
    const e = basis();
    for (const id of ["aktion", "leer"] as const) { const h = hinweisAusVorlage(id, e, HEUTE)!; expect([h.titel, h.text]).toEqual(["", ""]); e.hinweise.push(h); }
    expect(texte(e)).toEqual([]);
    expect(entwurfPruefen(e)).toBeNull();
  });
  it("Fenster oder Karte schon belegt: Die Vorlage weicht auf die Leiste oben aus", () => {
    const fenster = basis(); fenster.hinweise.push(hinweis({ art: "aktion", form: "popup" }));
    expect(hinweisAusVorlage("hagel", fenster, HEUTE)?.form).toBe("banner");
    const karte = basis(); karte.hinweise.push(hinweis({ form: "ecke" }));
    expect(hinweisAusVorlage("aktion", karte, HEUTE)?.form).toBe("banner");
    expect(hinweisAusVorlage("stelle", karte, HEUTE)?.form).toBe("banner");
    expect(hinweisAusVorlage("hagel", karte, HEUTE)?.form).toBe("popup");
    // «Fenster» bei einer Art, die es nicht darf, ist in Wahrheit eine Leiste und belegt den Platz nicht.
    const schein = basis(); schein.hinweise.push(hinweis({ art: "info", form: "popup" }));
    expect(hinweisAusVorlage("hagel", schein, HEUTE)?.form).toBe("popup");
    // Zwei Vorlagen nacheinander bleiben gültig (höchstens 1 Fenster, 1 Karte).
    const e = basis();
    for (const id of ["hagel", "hagel", "stelle"] as const) e.hinweise.push(hinweisAusVorlage(id, e, HEUTE)!);
    expect(e.hinweise.map((h) => h.form)).toEqual(["popup", "banner", "ecke"]);
    expect(entwurfPruefen(e)).toBeNull();
  });
  it("schon 3 Hinweise: nichts wird angelegt", () => {
    const e = basis(); e.hinweise.push(hinweis({ text: "Eins" }), hinweis({ text: "Zwei" }), hinweis({ text: "Drei" }));
    for (const v of HINWEIS_VORLAGEN) expect(hinweisAusVorlage(v.id, e, HEUTE)).toBeNull();
  });
  it("Betriebsferien: nimmt Anlass und Datum der nächsten eingetragenen Ferien; ohne Ferien bleibt der Text leer", () => {
    expect(hinweisAusVorlage("ferien", basis(), HEUTE)).toMatchObject({ art: "ferien", form: "banner", titel: "Betriebsferien", text: "" });
    const e = mit(tag("Betriebsferien", "2026-12-24", "2027-01-02"));
    const h = hinweisAusVorlage("ferien", e, HEUTE)!;
    expect(h).toEqual({ art: "ferien", form: "banner", titel: "", text: "Betriebsferien vom 24.12.2026 bis 02.01.2027.", link: "", von: HEUTE, bis: "2027-01-02" });
    // Der Schalter im Blatt der Ferien erkennt diesen Hinweis als seinen; ein zweiter aus der Vorlage wäre doppelt.
    e.hinweise.push(h);
    expect(ferienHinweisIndex(e.hinweise, e.ausnahmen[0])).toBe(0);
    expect(hinweisAusVorlage("ferien", e, HEUTE)?.text).toBe("");
  });
  it("ein Hinweis mit Titel, aber ohne Text: Die Prüfung sagt, was fehlt", () => {
    const e = basis(); e.hinweise.push(hinweisAusVorlage("ferien", e, HEUTE)!);
    expect(entwurfPruefen(e)).toEqual({ bereich: "hinweise", meldung: "Hinweis 1: Hinweis braucht einen Text" });
  });
  it("«Hinweis nach Hagel»: Ein laufender oder geplanter Hagel-Hinweis wird wiedergefunden, ein abgelaufener nicht", () => {
    expect(hagelHinweisIndex([hinweis({}), hinweis({ art: "hagel", bis: "2026-11-09" })], HEUTE)).toBe(1);
    expect(hagelHinweisIndex([hinweis({ art: "hagel", von: "2026-07-01", bis: "2026-07-31" })], HEUTE)).toBe(-1);
  });
});

describe("Ferien und Hinweis zusammen", () => {
  it("Text aus Anlass und Datum", () => {
    expect(ferienText(tag("Betriebsferien", "2026-12-24", "2027-01-02"))).toBe("Betriebsferien vom 24.12.2026 bis 02.01.2027.");
    expect(ferienText(tag("Geschlossen", "2026-11-09"))).toBe("Geschlossen am 09.11.2026.");
    expect(ferienText(tag("Auffahrt", "2027-05-06"))).toBe("Auffahrt am 06.05.2027. Wir haben geschlossen.");
    expect(ferienText(tag("Umbau", "2027-02-01", "2027-02-05"))).toBe("Umbau vom 01.02.2027 bis 05.02.2027. Wir haben geschlossen.");
    expect(ferienText(tag("", "2026-12-24", "2027-01-02"))).toBe("Wir haben vom 24.12.2026 bis 02.01.2027 geschlossen.");
    expect(ferienText(tag("Heiligabend", "2026-12-24", "", ["7.30", "12.00"]))).toBe("Heiligabend am 24.12.2026: geöffnet von 7.30 bis 12.00 Uhr.");
    expect(ferienText(tag("", "2026-12-24", "", ["7.30", "12.00"]))).toBe("Am 24.12.2026: geöffnet von 7.30 bis 12.00 Uhr.");
    expect(ferienText(tag("Betriebsferien", ""))).toBe("");
    // Der längste Anlass (60 Zeichen) passt in einen Hinweis (160 Zeichen).
    expect(ferienText(tag("x".repeat(60), "2026-12-24", "2027-01-02")).length).toBeLessThanOrEqual(160);
    expect(letzterTag(tag("Falsch herum", "2026-12-24", "2026-12-20"))).toBe("2026-12-24");
  });
  it("Schalter an: Leiste oben, ab heute bis zum letzten Tag; die Prüfliste nennt Ferien und Hinweis", () => {
    const e = mit(tag("Betriebsferien", "2026-12-24", "2027-01-02"));
    expect(ferienBindung(e.hinweise, e.ausnahmen[0])).toBeNull();
    expect(ferienHinweisGrund(e, e.ausnahmen[0]!, HEUTE)).toBe("");
    const b = ferienHinweisSchalten(e, 0, true, HEUTE, null);
    expect(b).toEqual({ nr: 0, eigenerText: false });
    expect(e.hinweise).toEqual([{ art: "ferien", form: "banner", titel: "", text: "Betriebsferien vom 24.12.2026 bis 02.01.2027.", link: "", von: HEUTE, bis: "2027-01-02" }]);
    // Der Schalter zeigt den wahren Zustand: erkannt an Art und «Zeigen bis», ohne neues Feld in site.json.
    expect(ferienBindung(e.hinweise, e.ausnahmen[0])).toEqual(b);
    expect(entwurfPruefen(e)).toBeNull();
    expect(texte(e)).toEqual(["Neuer Hinweis: «Betriebsferien vom 24.12.2026 bis 02.01.2027.»", "Neue Ferien: Betriebsferien (24.12.2026 bis 02.01.2027)"]);
    // Nochmals «an» legt keinen zweiten an.
    ferienHinweisSchalten(e, 0, true, HEUTE, b);
    expect(e.hinweise).toHaveLength(1);
  });
  it("ein einzelner geschlossener Tag wird zur Art «geschlossen», Ferien und besondere Zeiten zur Art «ferien»", () => {
    expect(ferienHinweis(tag("Geschlossen", HEUTE), HEUTE)).toMatchObject({ art: "geschlossen", von: HEUTE, bis: HEUTE });
    expect(ferienHinweis(tag("Betriebsferien", "2026-12-24", "2027-01-02"), HEUTE)?.art).toBe("ferien");
    expect(ferienHinweis(tag("Heiligabend", "2026-12-24", "", ["7.30", "12.00"]), HEUTE)?.art).toBe("ferien");
  });
  it("Schalter aus: entfernt genau diesen Hinweis, die anderen bleiben", () => {
    const e = mit(tag("Betriebsferien", "2026-12-24", "2027-01-02"), [hinweis({ text: "Davor" })]);
    const b = ferienHinweisSchalten(e, 0, true, HEUTE, null)!;
    e.hinweise.push(hinweis({ text: "Danach" }));
    expect(ferienHinweisSchalten(e, 0, false, HEUTE, b)).toBeNull();
    expect(e.hinweise.map((h) => h.text)).toEqual(["Davor", "Danach"]);
    expect(ferienBindung(e.hinweise, e.ausnahmen[0])).toBeNull();
  });
  it("Schalter gesperrt, mit Grund: 3 Hinweise, Datum fehlt, Tag vorbei", () => {
    const voll = mit(tag("Betriebsferien", "2026-12-24", "2027-01-02"), [hinweis({ text: "Eins" }), hinweis({ text: "Zwei" }), hinweis({ text: "Drei" })]);
    expect(ferienHinweisGrund(voll, voll.ausnahmen[0]!, HEUTE)).toBe("Es gibt schon 3 Hinweise. Mehr zeigt die Website nicht.");
    expect(ferienHinweisSchalten(voll, 0, true, HEUTE, null)).toBeNull();
    expect(voll.hinweise).toHaveLength(3);
    const leer = mit(tag("Betriebsferien", ""));
    expect(ferienHinweisGrund(leer, leer.ausnahmen[0]!, HEUTE)).toBe("Bitte zuerst das Datum wählen.");
    const vorbei = mit(tag("Allerheiligen", "2026-11-01"));
    expect(ferienHinweisGrund(vorbei, vorbei.ausnahmen[0]!, HEUTE)).toBe("Dieser Tag ist schon vorbei.");
    expect(ferienHinweisSchalten(vorbei, 0, true, HEUTE, null)).toBeNull();
  });
  it("Datum der Ferien ändern: Der Hinweis zieht mit (Art, «Zeigen bis», vorgeschlagener Text)", () => {
    const e = mit(tag("Betriebsferien", "2026-12-24", "2027-01-02"));
    const b = ferienHinweisSchalten(e, 0, true, HEUTE, null);
    ausnahmeAendern(e, 0, (a) => { a.bisDatum = "2027-01-05"; }, HEUTE, b);
    expect(e.hinweise[0]).toMatchObject({ art: "ferien", text: "Betriebsferien vom 24.12.2026 bis 05.01.2027.", von: HEUTE, bis: "2027-01-05" });
    ausnahmeAendern(e, 0, (a) => { a.name = "Weihnachtsferien"; }, HEUTE, b);
    expect(e.hinweise[0]?.text).toBe("Weihnachtsferien vom 24.12.2026 bis 05.01.2027.");
    // Aus den Ferien wird ein einzelner Tag: andere Art, anderes Ende, und der Schalter erkennt den Hinweis weiterhin.
    ausnahmeAendern(e, 0, (a) => { a.bisDatum = ""; }, HEUTE, b);
    expect(e.hinweise[0]).toMatchObject({ art: "geschlossen", text: "Weihnachtsferien am 24.12.2026.", bis: "2026-12-24" });
    ausnahmeAendern(e, 0, (a) => { a.geschlossen = false; a.von = "7.30"; a.bis = "12.00"; }, HEUTE, b);
    expect(e.hinweise[0]).toMatchObject({ art: "ferien", text: "Weihnachtsferien am 24.12.2026: geöffnet von 7.30 bis 12.00 Uhr." });
    expect(ferienBindung(e.hinweise, e.ausnahmen[0])).toEqual(b);
    expect(entwurfPruefen(e)).toBeNull();
  });
  it("ohne Verbindung ändert ein Eintrag keinen Hinweis", () => {
    const e = mit(tag("Betriebsferien", "2026-12-24", "2027-01-02"), [hinweis({ art: "ferien", text: "Sommerferien", bis: "2027-08-01" })]);
    ausnahmeAendern(e, 0, (a) => { a.bisDatum = "2027-01-05"; }, HEUTE, ferienBindung(e.hinweise, e.ausnahmen[0]));
    expect(e.hinweise[0]).toMatchObject({ text: "Sommerferien", bis: "2027-08-01" });
    expect(e.ausnahmen[0]?.bisDatum).toBe("2027-01-05");
  });
  it("selbst geschriebener Text bleibt stehen, der Zeitraum zieht trotzdem mit", () => {
    const e = mit(tag("Betriebsferien", "2026-12-24", "2027-01-02"));
    ferienHinweisSchalten(e, 0, true, HEUTE, null);
    e.hinweise[0]!.text = "Wir machen Pause und sind im neuen Jahr wieder für Sie da.";
    e.hinweise[0]!.form = "ecke";
    const b = ferienBindung(e.hinweise, e.ausnahmen[0]);
    expect(b).toEqual({ nr: 0, eigenerText: true });
    ausnahmeAendern(e, 0, (a) => { a.bisDatum = "2027-01-05"; }, HEUTE, b);
    expect(e.hinweise[0]).toMatchObject({ form: "ecke", text: "Wir machen Pause und sind im neuen Jahr wieder für Sie da.", bis: "2027-01-05" });
  });
  it("Datumsfeld beim Tippen kurz leer: Die Verbindung hält, danach stimmt der Hinweis wieder", () => {
    const e = mit(tag("Betriebsferien", "2026-12-24", "2027-01-02"));
    const b = ferienHinweisSchalten(e, 0, true, HEUTE, null);
    ausnahmeAendern(e, 0, (a) => { a.datum = ""; }, HEUTE, b);
    expect(e.hinweise[0]).toMatchObject({ text: "Betriebsferien vom 24.12.2026 bis 02.01.2027.", bis: "2027-01-02" });
    // Auch ein halb getipptes Jahr (0002) verstellt «Zeigen ab» nicht.
    ausnahmeAendern(e, 0, (a) => { a.datum = "0002-12-21"; a.bisDatum = ""; }, HEUTE, b);
    expect(e.hinweise[0]).toMatchObject({ von: HEUTE, bis: "2027-01-02" });
    ausnahmeAendern(e, 0, (a) => { a.datum = "2026-12-21"; a.bisDatum = "2027-01-02"; }, HEUTE, b);
    expect(e.hinweise[0]).toMatchObject({ text: "Betriebsferien vom 21.12.2026 bis 02.01.2027.", von: HEUTE, bis: "2027-01-02" });
    ausnahmeSchliessen(e, 0, b);
    expect(e.hinweise).toHaveLength(1);
  });
  it("Blatt schliessen ohne brauchbares Datum: Der Hinweis fällt weg, statt falsch stehen zu bleiben", () => {
    const e = mit(tag("Betriebsferien", "2026-12-24", "2027-01-02"), [hinweis({ text: "Bleibt" })]);
    const b = ferienHinweisSchalten(e, 0, true, HEUTE, null);
    ausnahmeAendern(e, 0, (a) => { a.datum = ""; a.bisDatum = ""; }, HEUTE, b);
    ausnahmeSchliessen(e, 0, b);
    expect(e.hinweise.map((h) => h.text)).toEqual(["Bleibt"]);
  });
  it("Eintrag entfernen: Sein Hinweis geht mit, fremde Hinweise bleiben", () => {
    const e = mit(tag("Betriebsferien", "2026-12-24", "2027-01-02"), [hinweis({ text: "Bleibt" })]);
    ferienHinweisSchalten(e, 0, true, HEUTE, null);
    ausnahmeEntfernen(e, 0);
    expect(e.ausnahmen).toEqual([]);
    expect(e.hinweise.map((h) => h.text)).toEqual(["Bleibt"]);
    const ohne = mit(tag("Auffahrt", "2027-05-06"), [hinweis({ text: "Bleibt" })]);
    ausnahmeEntfernen(ohne, 0);
    expect(ohne.hinweise).toHaveLength(1);
  });
  it("im Bereich «Hinweise» umgestellt (Art oder «Zeigen bis»): Die Verbindung ist gelöst, der Schalter steht auf aus", () => {
    const e = mit(tag("Betriebsferien", "2026-12-24", "2027-01-02"));
    ferienHinweisSchalten(e, 0, true, HEUTE, null);
    e.hinweise[0]!.bis = "2026-12-31";
    expect(ferienBindung(e.hinweise, e.ausnahmen[0])).toBeNull();
  });
});

describe("Übersicht und «Schnell erledigt»", () => {
  it("«Heute geschlossen»: findet einen Eintrag, der heute schon gilt, statt einen zweiten anzulegen", () => {
    expect(ausnahmeAm([], HEUTE)).toBe(-1);
    expect(ausnahmeAm([tag("Auffahrt", "2027-05-06"), tag("Geschlossen", HEUTE)], HEUTE)).toBe(1);
    expect(ausnahmeAm([tag("Betriebsferien", "2026-11-02", "2026-11-13")], HEUTE)).toBe(0);
    expect(ausnahmeAm([tag("Betriebsferien", "2026-11-02", "2026-11-06"), tag("", "")], HEUTE)).toBe(-1);
  });
  it("neuer Eintrag «Geschlossen» für heute ist ohne weitere Eingabe gültig", () => {
    const e = mit(tag("Geschlossen", HEUTE));
    expect(entwurfPruefen(e)).toBeNull();
    expect(texte(e)).toEqual(["Neuer Tag: Geschlossen (09.11.2026)"]);
  });
  it("Hinweise: was gerade gilt", () => {
    expect(hinweiseStand([], HEUTE)).toBe("keiner");
    expect(hinweiseStand([hinweis({ bis: "2026-11-20" })], HEUTE)).toBe("1 aktiv bis 20.11.2026");
    expect(hinweiseStand([hinweis({ bis: "2026-11-20" }), hinweis({ bis: "2026-11-09" })], HEUTE)).toBe("2 aktiv");
    expect(hinweiseStand([hinweis({ von: "1970-01-01", bis: "9999-12-31" })], HEUTE)).toBe("1 aktiv");
    expect(hinweiseStand([hinweis({ von: "2026-12-01", bis: "2026-12-24" })], HEUTE)).toBe("1 geplant ab 01.12.2026");
    expect(hinweiseStand([hinweis({ von: "2026-10-01", bis: "2026-11-08" })], HEUTE)).toBe("keiner");
  });
  it("nächste Ferien: der nächste Eintrag mit Datum", () => {
    expect(ferienStand([], HEUTE)).toBe("keine eingetragen");
    expect(ferienStand(alt.ausnahmen, HEUTE)).toBe("keine eingetragen");
    expect(ferienStand([{ name: "Betriebsferien", datum: "2026-12-24", bisDatum: "2027-01-02" }, { name: "Heiligabend", datum: "2026-12-23" }, { name: "Allerheiligen", datum: "2026-11-01" }], HEUTE)).toBe("Heiligabend, 23.12.2026");
    expect(ferienStand([{ name: "Betriebsferien", datum: "2026-12-24", bisDatum: "2027-01-02" }], HEUTE)).toBe("Betriebsferien, 24.12.2026 bis 02.01.2027");
    expect(ferienStand([{ name: "Betriebsferien", datum: "2026-11-02", bisDatum: "2026-11-13" }], HEUTE)).toBe("Betriebsferien, bis 13.11.2026");
    expect(ferienStand([{ name: "Geschlossen", datum: HEUTE }], HEUTE)).toBe("Geschlossen, heute");
  });
  it("Adressen aus der Umgebung: nur brauchbare, sonst fehlt die Zeile", () => {
    expect(websiteAdresse(undefined)).toBeNull();
    expect(websiteAdresse("")).toBeNull();
    expect(websiteAdresse("http://beispiel.example")).toBeNull();
    expect(websiteAdresse("javascript:alert(1)")).toBeNull();
    expect(websiteAdresse("https://nutzer:geheim@beispiel.example")).toBeNull();
    expect(websiteAdresse(" https://www.beispiel.example ")).toEqual({ adresse: "https://www.beispiel.example/", name: "beispiel.example" });
    expect(hilfeAdresse(undefined)).toBeNull();
    expect(hilfeAdresse("kein Mail")).toBeNull();
    expect(hilfeAdresse("a@b.example?subject=x")).toBeNull();
    expect(hilfeAdresse(" hilfe@beispiel.example ")).toBe("hilfe@beispiel.example");
  });
});
