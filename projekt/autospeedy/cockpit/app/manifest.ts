import type { MetadataRoute } from "next";

// Installierbar auf Handy und Computer («Zum Home-Bildschirm» / «App installieren»): dieselbe Web-App, kein App Store.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Auto Speedy Cockpit",
    short_name: "Cockpit",
    description: "Schadenmeldungen, Rückrufe, Zahlen und Website-Pflege für Auto Speedy.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fbfaf8",
    theme_color: "#ffffff",
    lang: "de-CH",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
