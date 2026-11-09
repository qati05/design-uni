import path from "node:path";
import type { NextConfig } from "next";

// Gemeinsame Regeln für Website und Cockpit liegen in ../gemeinsam: darum ist der Projektordner die Wurzel für Turbopack.
// Teamfotos gehen über das Pflege-Formular (Server Action). Der Browser verkleinert sie vorher; 8 MB reicht für mehrere.
// «Website pflegen» ist jetzt die Startseite; alte Lesezeichen auf /pflege führen dorthin.
const config: NextConfig = {
  turbopack: { root: path.join(import.meta.dirname, "..") },
  experimental: { serverActions: { bodySizeLimit: "8mb" } },
  async redirects() {
    return [{ source: "/pflege", destination: "/", permanent: true }];
  },
};
export default config;
