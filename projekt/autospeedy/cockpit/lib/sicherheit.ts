// Übernommen aus qati05/medaur cockpit-app/lib/sicherheit.ts (unverändert bis auf diese Zeile).
// damit proxy.ts, next.config.ts und die Tests dieselbe Quelle nutzen.

export type Header = { key: string; value: string };

/** Origins für connect-src aus NEXT_PUBLIC_SUPABASE_URL: https und wss derselben Herkunft. */
export function supabaseOrigins(supabaseUrl: string | undefined): string[] {
  if (!supabaseUrl) return [];
  let url: URL;
  try {
    url = new URL(supabaseUrl);
  } catch {
    return [];
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return [];
  const host = url.host;
  return url.protocol === "https:" ? [`https://${host}`, `wss://${host}`] : [`http://${host}`, `ws://${host}`];
}

export function baueCsp(nonce: string, opt: { supabaseUrl?: string; entwicklung?: boolean } = {}): string {
  const connect = ["'self'", ...supabaseOrigins(opt.supabaseUrl)];
  const skripte = ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"];
  if (opt.entwicklung) skripte.push("'unsafe-eval'");
  return [
    "default-src 'self'",
    `script-src ${skripte.join(" ")}`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: blob:",
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
