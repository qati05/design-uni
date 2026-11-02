import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

// Jede Seite pro Anfrage gerendert (Nonce-CSP, keine Daten statisch abgelegt). Wie medaur.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Auto Speedy Cockpit", description: "Schadenmeldungen bearbeiten. Nur für Auto Speedy.", robots: { index: false, follow: false } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f3f5f6" };

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="de-CH">
      <body>
        {process.env.COCKPIT_DEMO === "1" ? <p className="demo-band">Demo: Beispieldaten, kein echter Mailversand, nichts verlässt diesen Rechner.</p> : null}
        {children}
      </body>
    </html>
  );
}
