"use server";

import { revalidatePath } from "next/cache";
import { holeBackend } from "@/lib/backend.server";
import type { PflegeStand, VerlaufEintrag } from "@/lib/backend";
import { log } from "@/lib/log";
import { fehlendeFotosEntfernen, fotosEinsetzen, fotosErlaubt, neueFotos, pflegeFehler, pflegeSchema, speicherFotos, zeitenZeile, type BereichId, type Daten, type Pflege } from "@/lib/pflege";
import { FOTO_MAX, fotoTyp } from "@/lib/foto";

export type Antwort = { ok: boolean; meldung: string; bereich?: BereichId; stand?: PflegeStand; verlauf?: VerlaufEintrag[] };
export type StandAntwort = { ok: boolean; meldung: string; daten?: Pflege; zeit?: string };

const KONFLIKT = "Inzwischen hat jemand anderes veröffentlicht. Bitte die Seite neu laden und die Änderung nochmals machen.";

// Ablauf: Version prüfen, neue Fotos in den Bild-Speicher, Daten prüfen, site.json ins Repo schreiben (der Commit baut die
// Website neu), danach nicht mehr gebrauchte Fotos wirklich löschen. Scheitert ein Schritt vor dem Speichern, werden die eben
// hochgeladenen Fotos wieder gelöscht: es bleibt nichts liegen, das niemand mehr sieht.
// Im Formular: «sha» (gelesene Version), «daten» (JSON in der Form von site.json, neue Fotos als «neu:<kennung>»), «foto:<kennung>» (Dateien).
export async function veroeffentlichen(form: FormData): Promise<Antwort> {
  const b = holeBackend();
  const s = await b.sitzung();
  if (!s || !s.mitglied) { log({ aktion: "pflege", status: "abgelehnt" }); return { ok: false, meldung: "Bitte neu anmelden." }; }
  const alt = await b.pflegeLesen();
  if (!alt) return { ok: false, meldung: "Die Website ist gerade nicht erreichbar. Nichts veröffentlicht. Bitte später nochmals versuchen." };
  if (String(form.get("sha") ?? "") !== alt.sha) return { ok: false, meldung: KONFLIKT };

  const text = form.get("daten");
  let roh: unknown = null;
  try { roh = typeof text === "string" && text.length <= 200_000 ? JSON.parse(text) : null; } catch { roh = null; }
  if (!roh || typeof roh !== "object" || Array.isArray(roh)) return { ok: false, meldung: "Die Eingaben sind nicht lesbar. Bitte die Seite neu laden." };
  const daten = roh as Record<string, unknown>;
  // Die Notiz des Studios in der Datei bleibt, wie sie ist.
  delete daten._hinweis;
  if (alt.daten._hinweis) daten._hinweis = alt.daten._hinweis;

  const neu: string[] = [];
  const aufraeumen = async () => { for (const u of neu) await b.bildLoeschen(u); };
  const stellen = neueFotos(daten);
  if (stellen.length > 30) return { ok: false, meldung: "Zu viele neue Fotos auf einmal. Bitte zuerst veröffentlichen und dann weitermachen." };
  const adressen = new Map<string, string>();
  for (const { platzhalter, ordner } of stellen) {
    const v = form.get(`foto:${platzhalter.slice(4)}`);
    let fehler = "";
    if (!v || typeof v === "string" || v.size === 0) fehler = "Ein Foto fehlt. Bitte das Foto nochmals wählen.";
    else if (v.size > FOTO_MAX) fehler = "Ein Foto ist zu gross (höchstens 1,5 MB).";
    const bytes = !fehler && v && typeof v !== "string" ? new Uint8Array(await v.arrayBuffer()) : null;
    const typ = bytes ? fotoTyp(bytes) : null;
    if (!fehler && !typ) fehler = "Bitte ein Foto als JPG, PNG oder WebP wählen.";
    const url = !fehler && bytes && typ ? await b.bildSpeichern(bytes, typ, ordner) : null;
    if (!fehler && !url) fehler = "Foto hochladen hat nicht geklappt. Bitte nochmals versuchen.";
    if (fehler || !url) { await aufraeumen(); return { ok: false, meldung: fehler }; }
    neu.push(url);
    adressen.set(platzhalter, url);
  }
  fotosEinsetzen(daten, adressen);

  const r = pflegeSchema.safeParse(daten);
  if (!r.success) { await aufraeumen(); return { ok: false, ...pflegeFehler(r.error, daten as unknown as Daten) }; }
  if (!fotosErlaubt(r.data, alt.daten, neu)) { await aufraeumen(); log({ aktion: "pflege", status: "foto_fremd" }); return { ok: false, meldung: "Ein Foto ist ungültig. Bitte die Seite neu laden." }; }

  const ergebnis = await b.pflegeSpeichern(r.data, alt.sha);
  await b.audit({ aktion: "pflege", ergebnis: ergebnis === "ok" ? "ok" : "fehler" }).catch(() => log({ aktion: "pflege", status: "audit_fehler" }));
  log({ aktion: "pflege", status: ergebnis });
  if (ergebnis === "unklar") {
    // Keine Antwort von GitHub: vielleicht doch gespeichert. Fotos behalten (lieber ein übriges Bild als ein kaputtes auf der Website).
    return { ok: false, meldung: "Keine Antwort von der Website. Bitte die Seite in einer Minute neu laden und prüfen, ob die Änderung da ist." };
  }
  if (ergebnis !== "ok") {
    await aufraeumen();
    return { ok: false, meldung: ergebnis === "konflikt" ? KONFLIKT
      : ergebnis === "nicht_eingerichtet" ? "Die Website ist noch nicht mit dem Cockpit verbunden. Bitte das Studio informieren."
      : "Veröffentlichen hat nicht geklappt. Nichts geändert. Bitte nochmals versuchen; klappt es wieder nicht, bitte das Studio informieren." };
  }

  // Erst jetzt, nach erfolgreichem Speichern: Bilder, die nicht mehr vorkommen, wirklich löschen.
  const bleibt = new Set(speicherFotos(r.data));
  let nichtGeloescht = 0;
  for (const u of speicherFotos(alt.daten)) if (!bleibt.has(u) && !(await b.bildLoeschen(u))) nichtGeloescht++;
  if (nichtGeloescht) { log({ aktion: "foto_loeschen", status: "fehler" }); await b.audit({ aktion: "foto_loeschen", ergebnis: "fehler" }).catch(() => {}); }
  revalidatePath("/");
  const [stand, verlauf] = await Promise.all([b.pflegeLesen(), b.verlauf()]);
  return {
    ok: true,
    meldung: `Veröffentlicht. Die Website ist in etwa 2 Minuten aktuell. Heute: ${zeitenZeile(r.data) || "geschlossen"}.`
      + (nichtGeloescht ? " Ein altes Foto liess sich nicht löschen. Bitte das Studio informieren." : "")
      + (b.art === "demo" ? " (Demo: Im Betrieb baut sich die Website jetzt neu.)" : ""),
    ...(stand ? { stand } : {}), verlauf,
  };
}

/** Lädt einen früheren Stand aus dem Verlauf, zum Ansehen und erneuten Veröffentlichen. Ändert selbst nichts an der Website. */
export async function standLaden(id: string): Promise<StandAntwort> {
  const b = holeBackend();
  const s = await b.sitzung();
  if (!s || !s.mitglied) return { ok: false, meldung: "Bitte neu anmelden." };
  if (typeof id !== "string" || !/^[0-9a-f]{40}$/.test(id)) return { ok: false, meldung: "Dieser Stand ist nicht bekannt." };
  const [verlauf, heute] = await Promise.all([b.verlauf(), b.pflegeLesen()]);
  const eintrag = verlauf.find((v) => v.id === id);
  if (!eintrag || !heute) return { ok: false, meldung: "Dieser Stand lässt sich gerade nicht laden. Bitte später nochmals versuchen." };
  const alt = await b.pflegeVersion(id);
  if (!alt) return { ok: false, meldung: "Dieser Stand lässt sich nicht mehr laden." };
  const { daten, fehlen } = fehlendeFotosEntfernen(alt, heute.daten);
  return {
    ok: true, daten, zeit: eintrag.zeit,
    meldung: fehlen ? `${fehlen === 1 ? "Ein Foto" : `${fehlen} Fotos`} aus diesem Stand gibt es nicht mehr. Der Rest ist geladen.` : "Stand geladen.",
  };
}
