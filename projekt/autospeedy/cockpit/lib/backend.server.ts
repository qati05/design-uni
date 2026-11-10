import "server-only";
import { istDemo, type Backend } from "./backend";
import { demoBackend } from "./backend.demo.server";
import { cloudflareBackend } from "./backend.cloudflare.server";

export function holeBackend(): Backend {
  return istDemo() ? demoBackend : cloudflareBackend;
}
