import "server-only";
import { istDemo, type Backend } from "./backend";
import { demoBackend } from "./backend.demo.server";
import { supabaseBackend } from "./backend.supabase.server";

export function holeBackend(): Backend {
  return istDemo() ? demoBackend : supabaseBackend;
}
