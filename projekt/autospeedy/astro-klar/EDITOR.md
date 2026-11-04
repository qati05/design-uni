# Editor `/admin/` einrichten (Auto Speedy)

Der Editor läuft ganz auf den Konten von Auto Speedy. Keine Datenbank, kein Cockpit, keine laufenden Kosten.
Diese Anleitung nennt nur **Namen** von Einstellungen – nie Werte. Schlüssel kommen ausschliesslich in die
verschlüsselten Umgebungsvariablen von Cloudflare Pages, nie ins Git.

## 1. GitHub

- Ein **privates Repo** von Auto Speedy enthält diese Website (Ordner `astro-klar`, geteilte Inhalte in `astro`).
- **Fine-grained Personal Access Token**, eingeschränkt auf genau dieses Repo, nur Berechtigung **Contents: Read and write**
  (nichts weiter). Ablauf setzen und rechtzeitig erneuern.
- Der Editor schreibt per Contents-API nur zwei Dinge: die Pflege-Datei `src/daten/site.json` und Teamfotos
  `public/bilder/team/<name>.jpg`. Alles andere ist durch eine Allowlist gesperrt (`gemeinsam/github.js`).

## 2. Cloudflare Pages – Umgebungsvariablen

In den Projekteinstellungen von Cloudflare Pages (Production **und** Preview) setzen, als *Secret*:

| Name | Zweck |
|---|---|
| `GITHUB_TOKEN` | der Fine-grained Token von oben (nur in der Function, nie im Browser) |
| `GITHUB_REPO` | `owner/name` des Repos |
| `GITHUB_ZWEIG` | Zweig, in den gespeichert wird (meist der Produktionszweig) |
| `GITHUB_SITE_PFAD` | optional; Pfad von `site.json` im Repo (Vorgabe `src/daten/site.json`) |
| `ACCESS_TEAM` | Teamname der Cloudflare-Zero-Trust-Organisation (oder die ganze `…cloudflareaccess.com`-Domain) |
| `ACCESS_AUD` | Application Audience (AUD) der Access-Anwendung (siehe Schritt 3) |
| `ERLAUBTE_HERKUNFT` | optional; die eigene Domain für die Origin-Prüfung beim Speichern |

Kein Wert steht in dieser Datei, im Code oder in einem Log. Nach dem Speichern baut Pages automatisch neu
(Commit → Build → live in etwa 1 bis 2 Minuten).

## 3. Cloudflare Access (Login)

- In **Zero Trust → Access → Applications** eine **Self-hosted**-Anwendung anlegen, die `…/admin/*` **und**
  `…/api/admin/*` abdeckt (zwei Pfade oder ein Wildcard, je nach Setup).
- **Policy**: nur freigegebene Mailadressen von Auto Speedy; Login mit **Einmal-Code per E-Mail** (One-time PIN),
  kein Passwort.
- Die **Application Audience (AUD)** dieser Anwendung als `ACCESS_AUD` eintragen (Schritt 2). Access setzt bei jedem
  Aufruf den Header `Cf-Access-Jwt-Assertion`; die Functions prüfen Signatur, `iss`, `aud` und `exp`
  (`gemeinsam/access.js`). Ohne gültiges Token antwortet jede `/api/admin/*`-Funktion mit 401.
- Zur Sicherheit gilt auf `/admin/*` eine eigene, enge CSP (`script-src 'self'; connect-src 'self';
  frame-ancestors 'none'`) und `noindex` (gesetzt in `_headers` beim Build).

## 4. Täglicher Neubau (Hinweis-Zeiträume)

Hinweise erscheinen nur mit `von ≤ heute ≤ bis` (Zeitzone Europe/Zurich). Damit Start und Ende ohne Speichern greifen:

- In Cloudflare Pages einen **Deploy Hook** anlegen (nur der Name ist nötig; die URL bleibt geheim).
- Einen **Cron Trigger** (Worker oder Scheduled) um **00:05** einrichten, der den Deploy Hook auslöst – ein Neubau pro Tag.
- Fällt der Neubau einmal aus, blendet `klar.js` abgelaufene Hinweise zusätzlich im Browser aus (Fallback).

## 5. Fallback

Der frühere Sveltia-CMS-Weg (`astro/bau/editor.mjs`) bleibt als Notweg bestehen (Standard aus, `EDITOR_AKTIV`),
braucht aber ein GitHub-Login. Der Weg über `/admin/` ist der empfohlene.
