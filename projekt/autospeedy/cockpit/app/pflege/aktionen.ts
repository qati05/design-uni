"use server";

import { revalidatePath } from "next/cache";
import { holeBackend } from "@/lib/backend.server";
import { log } from "@/lib/log";
import { fotosErlaubt, pflegeAusFormular, pflegeFehler, speicherFotos, zeitenZeile } from "@/lib/pflege";
import { FOTO_MAX, fotoTyp } from "@/lib/foto";

export type PflegeZustand = { ok?: boolean; meldung?: string };

// Ablauf: Version prüfen, neue Fotos in den Bild-Speicher, Formular prüfen, site.json ins Repo schreiben (der Commit baut die
// Website neu), danach entfernte Fotos wirklich löschen. Scheitert ein Schritt vor dem Speichern, werden die eben
// hochgeladenen Fotos wieder gelöscht: es bleibt nichts liegen, das niemand mehr sieht.
export async function pflegeSpeichern(_v: PflegeZustand, form: FormData): Promise<PflegeZustand> {
  const b = holeBackend();
  const s = await b.sitzung();
  if (!s || s.aal !== "aal2" || !s.mitglied) { log({ aktion: "pflege", status: "abgelehnt" }); return { meldung: "Bitte neu anmelden." }; }
  const alt = await b.pflegeLesen();
  if (!alt) return { meldung: "Die Website ist gerade nicht erreichbar. Nichts gespeichert. Bitte später nochmals versuchen." };
  const sha = String(form.get("sha") ?? "");
  if (sha !== alt.sha) return { meldung: "Inzwischen hat jemand anderes gespeichert. Bitte die Seite neu laden und die Änderung nochmals machen." };

  const neu: string[] = [];
  const aufraeumen = async () => { for (const u of neu) await b.teamFotoLoeschen(u); };
  for (const [k, v] of [...form.entries()]) {
    const m = /^team\.(\d{1,2})\.p\.(\d{1,2})\.fotoneu$/.exec(k);
    if (!m || typeof v === "string" || v.size === 0) continue;
    let fehler = "";
    if (v.size > FOTO_MAX) fehler = "Ein Foto ist zu gross (höchstens 1,5 MB).";
    const bytes = fehler ? null : new Uint8Array(await v.arrayBuffer());
    const typ = bytes ? fotoTyp(bytes) : null;
    if (!fehler && !typ) fehler = "Bitte ein Foto als JPG, PNG oder WebP wählen.";
    const url = !fehler && bytes && typ ? await b.teamFotoSpeichern(bytes, typ) : null;
    if (!fehler && !url) fehler = "Foto hochladen hat nicht geklappt. Bitte nochmals versuchen.";
    if (fehler) { await aufraeumen(); return { meldung: fehler }; }
    neu.push(url!);
    form.set(`team.${m[1]}.p.${m[2]}.foto`, url!);
    form.delete(`team.${m[1]}.p.${m[2]}.fotoweg`);
  }

  const r = pflegeAusFormular(form, alt.daten);
  if (!r.success) { await aufraeumen(); return { meldung: pflegeFehler(r.error) }; }
  if (!fotosErlaubt(r.data, alt.daten, neu)) { await aufraeumen(); log({ aktion: "pflege", status: "foto_fremd" }); return { meldung: "Ein Foto ist ungültig. Bitte die Seite neu laden." }; }

  const ergebnis = await b.pflegeSpeichern(r.data, sha);
  await b.audit({ aktion: "pflege", ergebnis: ergebnis === "ok" ? "ok" : "fehler" }).catch(() => log({ aktion: "pflege", status: "audit_fehler" }));
  log({ aktion: "pflege", status: ergebnis });
  if (ergebnis !== "ok") {
    await aufraeumen();
    return { meldung: ergebnis === "konflikt" ? "Inzwischen hat jemand anderes gespeichert. Bitte die Seite neu laden und die Änderung nochmals machen."
      : ergebnis === "nicht_eingerichtet" ? "Die Website ist noch nicht mit dem Cockpit verbunden. Bitte das Studio informieren."
      : "Speichern hat nicht geklappt. Nichts geändert. Bitte nochmals versuchen; klappt es wieder nicht, bitte das Studio informieren." };
  }

  // Erst jetzt, nach erfolgreichem Speichern: Fotos, die nicht mehr vorkommen, wirklich löschen.
  const bleibt = new Set(speicherFotos(r.data));
  let nichtGeloescht = 0;
  for (const u of speicherFotos(alt.daten)) if (!bleibt.has(u) && !(await b.teamFotoLoeschen(u))) nichtGeloescht++;
  if (nichtGeloescht) { log({ aktion: "foto_loeschen", status: "fehler" }); await b.audit({ aktion: "foto_loeschen", ergebnis: "fehler" }).catch(() => {}); }
  revalidatePath("/pflege");
  return {
    ok: true,
    meldung: `Gespeichert. Die Website ist in etwa 2 Minuten aktuell: «${zeitenZeile(r.data)}».`
      + (nichtGeloescht ? " Ein altes Foto liess sich nicht löschen. Bitte das Studio informieren." : "")
      + (b.art === "demo" ? " (Demo: Im Betrieb baut sich die Website jetzt neu.)" : ""),
  };
}
