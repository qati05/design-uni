// Sicherheits-Header des Cockpits an einem Ort, damit proxy.ts und die Tests dieselbe Quelle nutzen.
// Bild-Speicher in img-src, damit das Cockpit die Fotos des Betriebs zeigen kann. Der Browser spricht sonst nur mit dem Cockpit selbst.

export type Header = { key: string; value: string };

/** Herkunft (https://host) einer Adresse, sonst nichts. Für img-src: der Bild-Speicher mit den Fotos des Betriebs. */
export function bildOrigin(adresse: string | undefined): string[] {
  if (!adresse) return [];
  try { const u = new URL(adresse); return u.protocol === "https:" ? [`https://${u.host}`] : []; } catch { return []; }
}

export function baueCsp(nonce: string, opt: { entwicklung?: boolean; bildSpeicher?: string } = {}): string {
  // Nur «next dev»: Impeccable Live lädt seinen Helfer von localhost:8400 und setzt Varianten-Styles ein. Der gebaute Betrieb bleibt streng.
  const impeccableLive = "http://localhost:8400";
  const connect = ["'self'", ...(opt.entwicklung ? [impeccableLive] : [])];
  const skripte = opt.entwicklung
    ? ["'self'", "'unsafe-inline'", "'unsafe-eval'", impeccableLive]
    : ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"];
  return [
    "default-src 'self'",
    `script-src ${skripte.join(" ")}`,
    opt.entwicklung ? "style-src 'self' 'unsafe-inline'" : `style-src 'self' 'nonce-${nonce}'`,
    `img-src ${["'self'", "data:", "blob:", ...bildOrigin(opt.bildSpeicher)].join(" ")}`,
    "font-src 'self'",
    `connect-src ${connect.join(" ")}`,
    "manifest-src 'self'",
    "worker-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

export const PERMISSIONS_POLICY = [
  "accelerometer=()",
  "camera=()",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "payment=()",
  "usb=()",
  "browsing-topics=()",
].join(", ");

/** Header ohne CSP. Die CSP braucht pro Anfrage eine Nonce und kommt aus dem Proxy. */
export function sicherheitsHeader(): Header[] {
  return [
    { key: "Cache-Control", value: "no-store" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
    { key: "Referrer-Policy", value: "no-referrer" },
    { key: "Permissions-Policy", value: PERMISSIONS_POLICY },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
}
