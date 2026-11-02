import type { NextConfig } from "next";

// Teamfotos gehen über das Pflege-Formular (Server Action). Der Browser verkleinert sie vorher; 8 MB reicht für mehrere.
const config: NextConfig = { experimental: { serverActions: { bodySizeLimit: "8mb" } } };
export default config;
