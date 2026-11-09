"use server";

import { redirect } from "next/navigation";
import { holeBackend } from "@/lib/backend.server";

export async function abmelden() {
  await holeBackend().abmelden();
  redirect("/login");
}
