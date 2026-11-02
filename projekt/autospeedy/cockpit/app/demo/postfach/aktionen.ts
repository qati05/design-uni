"use server";

import { revalidatePath } from "next/cache";
import { speicher } from "@/lib/demo-speicher";
import { DEMO_VERSAND_GEHEIMNIS } from "@/lib/backend.demo.server";
import { versandLaufen } from "@/lib/versand.server";

/** Nur Demo: Uhr um 24 Stunden vorstellen und den Versand laufen lassen, wie es der Zeitplan im Betrieb tut. */
export async function vorspulen() {
  if (process.env.COCKPIT_DEMO !== "1") return;
  speicher().zeitVersatz += 24 * 3600e3;
  await versandLaufen(DEMO_VERSAND_GEHEIMNIS());
  revalidatePath("/demo/postfach");
}
