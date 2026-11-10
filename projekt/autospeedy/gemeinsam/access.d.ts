/** Prüft den Ausweis von Cloudflare Access (Kopf «Cf-Access-Jwt-Assertion»). Mail-Adresse oder null. */
export function access(request: { headers: { get(name: string): string | null } }, env: { ACCESS_TEAM?: string; ACCESS_AUD?: string }): Promise<string | null>;
/** Nur für Tests: den Schlüssel-Zwischenspeicher leeren. */
export function _speicherLeeren(): void;
