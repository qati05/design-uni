import type { MetadataRoute } from "next";

// Installierbar auf Handy und Computer («Zum Home-Bildschirm» / «App installieren»): dieselbe Web-App, kein App Store.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Auto Speedy Cockpit",
    short_name: "Cockpit",
    description: "Website pflegen für Auto Speedy: Öffnungszeiten, Feiertage, Hinweise und Team.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    // Grund des Cockpits (DESIGN.md «grund»): Startbild und Leiste oben haben die Farbe der Seite.
    background_color: "#f2f2f7",
    theme_color: "#f2f2f7",
    lang: "de-CH",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
