// Astro-Integration: schreibt nach dem Bau robots.txt, sitemap.xml und _headers, prüft die internen Links
// und ob die Rechtsseiten Inhalt haben (Stufe nach bau/daten.mjs: im Gerüst HINWEIS, in der Abgabe FEHLER).
// Schalter: «vorschau» in bau.json. Die Regeln für Vorschau und robots.txt besitzt text-uni (TP7/TI8, TI10); die Vorlage setzt sie um.
//   vorschau true:  noindex per X-Robots-Tag (_headers) und Meta; robots.txt sperrt nichts (zusammenspiel Entscheid 4, text-uni TI8); keine Sitemap.
//   vorschau false: robots.txt nach text-uni TI1 bis TI6, Sitemap nach TI11 und TI12, canonical je Seite (S28, im Layout).
// _headers hat das Format von Cloudflare Pages. Auf einem anderen Hoster setzt man dieselben Kopfzeilen dort (web-uni referenzen/betrieb.md).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const KI_TRAINING = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot"]; // Liste aus text-uni TI5

function htmlDateien(dir, basis = dir, aus = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) htmlDateien(p, basis, aus);
    else if (e.name.endsWith(".html")) aus.push(path.relative(basis, p).split(path.sep).join("/"));
  }
  return aus;
}

// Adresse einer Datei: index.html -> /, kontakt/index.html -> /kontakt/
const adresseVon = (datei) => "/" + datei.replace(/index\.html$/, "");

// Volle Content-Security-Policy, nur wenn eine Linie sie einschaltet: dateien({ csp: true }).
// Voraussetzung: kein ausführbares Inline-Skript und keine onclick-Attribute (JSON-LD ist Daten und bleibt erlaubt).
// Fremde Herkünfte kommen nur aus der Konfiguration: Turnstile, absolute Formular-/Zähl-Endpunkte, AutoScout-Widget.
const herkunft = (u) => { try { return /^https:\/\//.test(u || "") ? new URL(u).origin : null; } catch { return null; } };
export function cspZeile({ bau, betrieb }) {
  // Turnstile (challenges.cloudflare.com) nur in die CSP, wenn ein Sitekey gesetzt ist; sonst gar nicht (BAUPLAN 4.3).
  const ts = process.env.TURNSTILE_SITEKEY ? "https://challenges.cloudflare.com" : null;
  const verbinden = [process.env.FORMULAR_ENDPUNKT || bau.formularEndpunkt, process.env.ZAEHL_ENDPUNKT || bau.zaehlEndpunkt].map(herkunft).filter(Boolean);
  const widget = herkunft(betrieb?.occasionen?.widget?.src);
  const liste = (...xs) => [...new Set(xs.filter(Boolean))].join(" ");
  const rahmen = liste(ts, widget); // Turnstile und/oder AutoScout-Widget; sonst nichts einbetten
  return [
    "default-src 'self'",
    `script-src ${liste("'self'", ts, widget)}`,
    "style-src 'self' 'unsafe-inline'", // style="--dauer" im Partnerband und Turnstile
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${liste("'self'", ts, ...verbinden)}`,
    `frame-src ${rahmen || "'none'"}`,
    "form-action 'self' mailto:",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
  ].join("; ");
}

export default function dateien({ csp = false } = {}) {
  return {
    name: "vorlage-dateien",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const { bau, betrieb, vorschau, RECHTSSEITEN, meldeSpaeter } = await import("./daten.mjs");
        const ziel = fileURLToPath(dir);
        const seiten = htmlDateien(ziel);

        // TI24: interne Links ohne Weiterleitung. Erlaubt: /pfad/ mit Schrägstrich, Dateien mit Endung, Anker.
        const schlecht = [];
        for (const s of seiten) {
          const html = fs.readFileSync(path.join(ziel, s), "utf8");
          for (const m of html.matchAll(/href="([^"]*)"/g)) {
            const u = m[1];
            if (/^(https?:|mailto:|tel:|#|data:)/.test(u)) continue;
            const ohne = u.split(/[?#]/)[0];
            if (/\.html$/.test(ohne)) schlecht.push(`${s}: ${u} (Endung .html leitet weiter)`);
            else if (!ohne.startsWith("/")) schlecht.push(`${s}: ${u} (relativ; Links beginnen mit /)`);
            else if (!/\/$/.test(ohne) && !/\.[a-z0-9]+$/i.test(ohne)) schlecht.push(`${s}: ${u} (ohne Schrägstrich am Ende leitet weiter)`);
            else if (/\/$/.test(ohne) && !fs.existsSync(path.join(ziel, ohne, "index.html"))) schlecht.push(`${s}: ${u} (Seite fehlt)`);
            else if (!/\/$/.test(ohne) && !fs.existsSync(path.join(ziel, ohne))) schlecht.push(`${s}: ${u} (Datei fehlt)`);
          }
        }
        if (schlecht.length) throw new Error("Interne Links mit Weiterleitung oder ohne Ziel (text-uni TI24):\n  " + schlecht.join("\n  "));

        // Rechtsseiten: Inhalt in <main> ausser der h1. Wortlaut von text-uni (Schritt 10), Datenliste von web-uni (betrieb.md Teil 6).
        for (const name of RECHTSSEITEN) {
          const datei = path.join(ziel, name, "index.html");
          if (!fs.existsSync(datei)) { meldeSpaeter(`Rechtsseite /${name}/ fehlt`); continue; }
          const main = (fs.readFileSync(datei, "utf8").match(/<main[^>]*>([\s\S]*?)<\/main>/) || [, ""])[1];
          const text = main.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          if (!text) meldeSpaeter(`Rechtsseite /${name}/ hat keinen Inhalt (Wortlaut text-uni, Abfolge Schritt 13)`);
        }

        const kopf = [
          "/*",
          ...(vorschau ? ["  X-Robots-Tag: noindex"] : ["  Strict-Transport-Security: max-age=31536000"]),
          "  X-Content-Type-Options: nosniff",
          "  Referrer-Policy: strict-origin-when-cross-origin",
          `  Content-Security-Policy: ${csp ? cspZeile({ bau, betrieb }) : "frame-ancestors 'none'"}`,
          "  Permissions-Policy: camera=(), microphone=(), geolocation=()",
        ];
        // Editor /admin/ (Linie Klar, BAUPLAN 4.1): eigene, enge CSP. Eigenes Vanilla-JS aus 'self', keine Fremdhosts,
        // keine Einbettung. noindex und no-store. «! Content-Security-Policy» ersetzt (nicht ergänzt) die allgemeine Zeile.
        if (csp) kopf.push(
          "", "/admin/*",
          "  ! Content-Security-Policy",
          "  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'",
          "  X-Robots-Tag: noindex",
          "  Cache-Control: no-store",
        );
        // Druckvorlage /bewerten/druck/ (BAUPLAN 4.6): noindex, auch im Livegang (nur zum Ausdrucken, nicht für den Index).
        if (fs.existsSync(path.join(ziel, "bewerten", "druck", "index.html"))) kopf.push("", "/bewerten/druck/*", "  X-Robots-Tag: noindex");
        // TI10: Die Hauptadresse <projekt>.pages.dev bleibt auch nach dem Livegang ausserhalb des Index.
        if (!vorschau && bau.pagesProjekt) kopf.push("", `https://${bau.pagesProjekt}.pages.dev/*`, "  X-Robots-Tag: noindex");
        fs.writeFileSync(path.join(ziel, "_headers"), kopf.join("\n") + "\n");

        if (vorschau) {
          fs.writeFileSync(path.join(ziel, "robots.txt"),
            "# Vorschau. noindex steht im Meta-Tag und in X-Robots-Tag; robots.txt sperrt nichts, sonst liest Google das noindex nicht (text-uni TI8).\nUser-agent: *\nDisallow:\n");
          fs.rmSync(path.join(ziel, "sitemap.xml"), { force: true });
          return;
        }

        const ki = bau.kiTraining.entscheid;
        const robots = [
          `# Entscheid KI-Training: ${ki} (${bau.kiTraining.datum})`,
          `# Crawler-Liste geprüft: ${bau.crawlerListeGeprueft}`,
          "User-agent: *",
          "Disallow:",
          "",
          ...(ki === "gesperrt" ? [...KI_TRAINING.map((n) => `User-agent: ${n}`), "Disallow: /", ""] : []),
          `Sitemap: ${bau.adresse}/sitemap.xml`,
        ];
        fs.writeFileSync(path.join(ziel, "robots.txt"), robots.join("\n") + "\n");

        // TI12: nur indexierbare Seiten (404 nie, TI17; Editor /admin/ ist noindex und bleibt aus der Sitemap); ohne lastmod (TI13).
        const adressen = seiten.filter((s) => s !== "404.html" && !s.startsWith("admin/") && s !== "bewerten/druck/index.html").map(adresseVon).sort();
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...adressen.map((a) => `  <url><loc>${bau.adresse}${a}</loc></url>`),
          "</urlset>",
        ];
        fs.writeFileSync(path.join(ziel, "sitemap.xml"), xml.join("\n") + "\n");
      },
    },
  };
}
