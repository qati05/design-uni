import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppAnmelden } from "./_teile/AppAnmelden";

// Jede Seite pro Anfrage gerendert (Nonce-CSP, keine Daten statisch abgelegt). Wie medaur.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Auto Speedy Cockpit", description: "Website pflegen: Öffnungszeiten, Feiertage, Hinweise und Team. Nur für Auto Speedy.", robots: { index: false, follow: false }, applicationName: "Cockpit", appleWebApp: { capable: true, title: "Cockpit", statusBarStyle: "default" }, icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#ffffff" };

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="de-CH">
      <body>
        {process.env.COCKPIT_DEMO === "1" ? <p className="demo-band">Demo: Änderungen bleiben auf diesem Rechner, kein echter Mailversand, die echte Website bleibt unverändert.</p> : null}
        {children}
        <AppAnmelden />
      </body>
    </html>
  );
}
