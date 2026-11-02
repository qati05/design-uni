# technik.md (Entwurf, web-uni WP2)

**Wahl:** Klasse B, Astro 7.4.1, statische Ausgabe, Gerüst aus `skills/web-uni/vorlage-astro`. Hoster: Cloudflare Pages als Vorschlag der Vorlage, **nichts eingerichtet, nichts live.**

**Weil-Sätze**
1. Organisation: Öffnungszeiten, Telefon und Anschrift stehen an einer Stelle (`betrieb.json`) und erscheinen überall gleich, ein Wert, kein Abgleich von Hand.
2. Funktion: Die Seite braucht keine Konten, keinen Shop, keine Buchung; Schadenmeldung geht ohne Server als E-Mail (Klasse C wäre unnötig, +133 KB JS im Spike).
3. Wunsch «hell und übersichtlich»: kein Zwang zu Bewegung oder 3D, also keine Klasse E.

**Gegenentwurf:** Der Betrieb hat heute eine **Wix**-Seite (Klasse D, `generator: Wix.com`). Wer sie pflegt, ist unbekannt (★ Pflege: Lücke). Bleibt der Betrieb bei Wix, geht das als Entscheid des Betriebs dem Hausentscheid vor; Gestaltung und Texte sind dann nur eingeschränkt umsetzbar.

**Einfachster Weg:** Klasse A, handgeschriebenes HTML. Verliert die einzelne Datenquelle und die Bauprüfungen.

**Pflege (Lücke):** Astro hat kein CMS `[nicht gebaut]`. Wer ändert die Öffnungszeiten? Ohne Antwort ist es ein Kostenpunkt (web-uni Grundregel 10).

**Kosten (Entwurf, nicht freigegeben):** nicht berechnet. Budget und Frist des Betriebs unbekannt.

**Formular:** kein Server-Endpunkt. Das Formular übergibt an das E-Mail-Programm; der Text sagt das ehrlich und behauptet kein «gesendet».

**Gemessen:** Bau mit `npm run build` (Stufe `geruest`): 0 FEHLER, 9 HINWEIS (fehlende Beschreibungen und Rechtsseiten). Lighthouse, WP5-Prüflauf, `pruefen.cjs`: **nicht gelaufen.**
