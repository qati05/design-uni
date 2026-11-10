# Formulare einrichten (Schadenmeldung und Rückruf)

Die Formulare senden erst, wenn die Website bei Cloudflare Pages aus dem Repository gebaut wird. Der Ordner `functions/api/`
wird dabei mit ausgeliefert. Wer nur den gebauten Ordner `dist` hochlädt, hat keine Formulare.

**Regel:** Schlüssel und Passwörter trägt der Auftraggeber selbst im Dashboard von Cloudflare ein (Typ «Secret»).
Sie gehören nie in einen Chat und nie ins Repository.

**Stand:** Der Code und die Tests laufen. Gegen die echten Dienste (Brevo, Turnstile, KV) lief noch nichts.

## Einstellungen in Cloudflare Pages

| Name | Wann | Wozu |
|---|---|---|
| `FORMULAR_ENDPUNKT` = `/api/schaden` | Bau | Schaltet das Senden ein. Der Rückruf nutzt daneben `/api/rueckruf`. |
| `SCHADEN_AN` | Laufzeit | Empfänger der Meldungen. `RUECKRUF_AN` (freiwillig) für Rückruf-Bitten. |
| `MAIL_WEG_BETRIEB` = `brevo` | Laufzeit | Pflicht bei Pages: Der Vorgabe-Weg «cloudflare» (send_email) geht dort nicht. |
| `BREVO_SCHLUESSEL` | Laufzeit, Secret | Schlüssel des Maildienstes. |
| `MAIL_ABSENDER`, `MAIL_ABSENDER_NAME` | Laufzeit | Absender-Adresse (bei Brevo bestätigt) und Name. |
| `ERLAUBTE_HERKUNFT` | Laufzeit | Adresse der Website, z. B. `https://autospeedy-test.pages.dev`. Andere Herkunft: 403. |
| `FORMULAR_HMAC` | Laufzeit, Secret | Langer Zufallswert für die Zeitfalle (Formular frühestens nach 4 Sekunden). |
| `TURNSTILE_SITEKEY` | Bau und Laufzeit | Zeigt das Turnstile-Feld im Formular. |
| `TURNSTILE_SECRET` | Laufzeit, Secret | Der Server prüft damit jedes Turnstile-Token bei Cloudflare. |
| `DROSSEL_KV` | Binding (KV-Namespace) | Höchstens 6 Sendungen in 10 Minuten je Absender. Gespeichert wird nur ein Prüfwert, er verfällt nach 20 Minuten. |

## Was der Schutz macht (gemeinsam/schutz.js)

1. Herkunft, Format und Grösse prüfen, Honigtopf, Zeitfalle.
2. Drossel über `DROSSEL_KV`. Das Rate-Limiting-Binding `DROSSEL` gibt es nur bei Workers, nicht bei Pages.
3. Turnstile: Mit `TURNSTILE_SECRET` muss jedes Formular ein gültiges Token mitbringen, sonst 403.
4. Bestätigungsmail an die Kundschaft: nur nach bestandener Turnstile-Prüfung, ohne Namen und ohne Text aus dem Formular.
   Ohne Turnstile geht keine Mail an eine eingegebene Adresse, und die Seite verspricht auch keine Bestätigung.

## Sperre beim echten Start (bau.json «vorschau» false)

Die Formulare antworten mit 503 und zeigen die Telefonnummer, solange eines davon fehlt:
`ERLAUBTE_HERKUNFT`, `FORMULAR_HMAC`, und dazu `TURNSTILE_SECRET` oder `DROSSEL_KV`. Ebenso, wenn `TURNSTILE_SITEKEY`
gesetzt ist, aber `TURNSTILE_SECRET` fehlt (sichtbares Turnstile ohne Prüfung). In der Test-Version gilt die Sperre nicht.
