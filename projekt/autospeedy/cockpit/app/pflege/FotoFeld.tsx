"use client";

import { useState } from "react";
import { fotoAnzeige } from "@/lib/pflege";

/** Porträt wählen (Handy: Kamera oder Fotos). Der Browser schneidet es quadratisch zu und verkleinert auf 640 px. */
export function FotoFeld({ name, foto, person }: { name: string; foto?: string; person: string }) {
  const [vorschau, setVorschau] = useState(foto ? fotoAnzeige(foto) : "");
  const [meldung, setMeldung] = useState("");
  async function gewaehlt(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget, f = input.files?.[0];
    setMeldung("");
    if (!f) return;
    try {
      const bild = await createImageBitmap(f);
      const s = Math.min(bild.width, bild.height), z = Math.min(640, s);
      const c = document.createElement("canvas"); c.width = z; c.height = z;
      c.getContext("2d")!.drawImage(bild, (bild.width - s) / 2, (bild.height - s) / 2, s, s, 0, 0, z, z);
      const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/webp", 0.82));
      if (!blob) throw new Error("kein Bild");
      const dt = new DataTransfer(); dt.items.add(new File([blob], "foto.webp", { type: blob.type || "image/webp" }));
      input.files = dt.files;
      setVorschau(URL.createObjectURL(blob));
    } catch { input.value = ""; setMeldung("Dieses Bild lässt sich nicht lesen. Bitte ein JPG oder PNG wählen."); }
  }
  return (
    <div className="fotofeld">
      {vorschau ? <img src={vorschau} width={72} height={72} alt={`Foto ${person}`} /> : <span className="fotofeld__leer" aria-hidden="true">kein Foto</span>}
      <input type="hidden" name={`${name}.foto`} value={foto ?? ""} />
      <label className="knopf leise klein">{foto ? "Foto ändern" : "Foto hinzufügen"}<input type="file" name={`${name}.fotoneu`} accept="image/jpeg,image/png,image/webp,image/heic" onChange={gewaehlt} className="unsichtbar" /></label>
      {foto ? <label className="schalter"><input type="checkbox" name={`${name}.fotoweg`} /> Foto entfernen</label> : null}
      {meldung ? <span className="meldung-text" role="alert">{meldung}</span> : null}
    </div>
  );
}
