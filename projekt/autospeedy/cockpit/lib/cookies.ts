// Sitzungs-Cookies: httpOnly, Secure, SameSite=Lax, ca. 30 Tage. Der Browser-Code sieht das Refresh-Token nie.
export const SITZUNG_SEKUNDEN = 60 * 60 * 24 * 30;

export type CookieOptionen = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none" | boolean;
  path?: string;
  maxAge?: number;
  expires?: Date;
  domain?: string;
};

export function sicher(): boolean {
  // Nur `next dev` auf http://localhost darf ohne Secure arbeiten.
  return process.env.NODE_ENV === "production";
}

export const COOKIE_GRUNDLAGE: CookieOptionen = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  maxAge: SITZUNG_SEKUNDEN,
};

/** Härtet die Optionen, die @supabase/ssr beim Setzen mitgibt. Löschungen (maxAge 0) bleiben Löschungen. */
export function haerte(optionen: CookieOptionen | undefined): CookieOptionen {
  const o: CookieOptionen = { ...(optionen ?? {}) };
  const loeschen = o.maxAge === 0 || (o.expires instanceof Date && o.expires.getTime() <= Date.now());
  delete o.domain;
  return {
    ...o,
    httpOnly: true,
    secure: sicher(),
    sameSite: "lax",
    path: "/",
    maxAge: loeschen ? 0 : Math.min(o.maxAge ?? SITZUNG_SEKUNDEN, SITZUNG_SEKUNDEN),
  };
}
