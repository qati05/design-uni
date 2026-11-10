# entscheide.md

## Entscheide des Betriebs (aus dem Auftrag des Studios, 02.11.2026, «vom Studio wörtlich festgehalten»)
1. **Schadenmeldung immer möglich:** Ein CTA für die Schadenmeldung ist jederzeit erreichbar. → Umsetzung: «Schaden melden» im Kopf auf jeder Seite (Handy: Leiste unten); Entscheid 6 «Knopf überall» für diesen einen Knopf damit beantwortet.
2. **Tesla-Besitzer finden sich schnell zurecht.** → Umsetzung: eigener Einstieg auf dem ersten Bildschirm, der das Formular mit «Tesla» vorwählt. Inhalt der Tesla-Seite offen (F14). Zulassung als Tesla Approved Body Shop bestätigt durch Roni 09.11.2026 (F14); der genaue Tesla-Ablauf bleibt offen.
3. **Hell und übersichtlich**, informativ. → heller Grund, Haarlinien, wenig Farben, keine Bewegung.
4. **Vorbild greco-car.ch:** Wirkung und Techniken lernen, nichts kopieren.

## Hausentscheide des Studios
- Stack: Astro, statische Ausgabe (web-uni, Standard, 02.11.2026).
- Vorschau mit `noindex`, nichts live, nichts gemergt, Arbeit nur auf `claude/autospeedy-bau`.
- Anrede «Sie» `[Annahme]` (Vorgabe text-uni CH4), vom Betrieb zu bestätigen.

## Offen, vom Studio oder Betrieb zu entscheiden
- Wer gibt frei? (★) · Hauptaktion bestätigt? (Auftrag nennt «Schadenmeldung», Anruf ist Zweitaktion) · Foto-Rechte · Logo-Datei · Bewegung ja/nein (vorerst nein, «hell, übersichtlich»).

## Studio, 02.11.2026 (zweite Rückmeldung)
- Logo statt Name oben links; ganze Vorschau; Tesla Approved Body Shop bestätigt; bessere Bildwahl.
- Gestaltung «aggressiver, wie ein Yin und Yang» → Richtung B (richtung.md). Spannung zu Wunsch 3 «hell» im Gespräch mit dem Betrieb klären.
- Studio, 02.11.2026: Kontrast nicht Schwarz-Weiss und nicht Navy-Flächen, sondern Farbverlauf Richtung Lackierung, Weiss und Babyblau → Richtung D (richtung.md).
- Studio, 02.11.2026: Schadenmeldung vereinfachen, «in drei Tipps» (Art, Fotos, Kontakt); alle drei Wege (Website, WhatsApp, E-Mail). Der Schadenplan ist nicht mehr Pflicht, sondern freiwillig in Schritt 1 («Stelle am Auto genauer zeigen»); auf der Startseite ersetzt durch den Schnellstart mit sieben Schadenarten.
- **Zur Freigabe durch das Studio (Abweichung vom Hausentscheid «3 bis 5 Felder»):** sichtbar sind fünf Felder (Art, Fotos, Name, Telefon, Bemerkung) plus das Häkchen «Es ist ein Tesla» (Wunsch 2) und die zugeklappte, freiwillige Stellenwahl. Pflicht sind nur drei (Art, Name, Telefon). Grund: Tesla schnell erkennbar und Stelle für Genauigkeit, ohne Pflicht.
- Studio, 02.11.2026: E-Mail-Weg in der Schadenmeldung entfernt; Website und WhatsApp bleiben, mailto nur noch ohne JavaScript.
- Studio, 02.11.2026: **Auto Speedy nutzt WhatsApp** (Auskunft des Studios). Der WhatsApp-Weg bleibt; offen ist nur, ob es die Mobilnummer 076 615 44 41 von der Website ist (Lücke auf «Schaden melden»).
- Studio, 02.11.2026: **Einfacheres Login, möglichst keine weiteren Apps** (der Betrieb ist nicht technikaffin). Umsetzung: Code per Mail, dann Fingerabdruck oder Gesicht des eigenen Handys oder Laptops (Passkey als zweiter Faktor, Supabase MFA «webauthn»); keine Authenticator-App mehr. Nach dem Login 30 Tage angemeldet pro Gerät. Ersatzweg: ein zweites Gerät (Handy und Computer); sind alle weg, setzt das Studio zurück.
- Studio, 02.11.2026: **Ein Cockpit für alles, eine App auf Handy und Computer.** Die Pflege (Zeiten, Ferien, Hinweis, Team) wandert vom Git-Editor (Decap, /admin/) ins Cockpit; Decap ist entfernt. Das Cockpit ist installierbar (Web-App, Symbol auf dem Startbildschirm), kein App Store.
- Studio, 02.11.2026 (offen, nach dem Gespräch): **Team-Fotos im Cockpit hochladen** (Pflege «Team»), nur mit Einverständnis der Person; und **Auftrag per Klick in der Hinweis-Mail bestätigen**, damit die Bitte um Bewertung automatisch ausgelöst wird. Heute: «Bewertung erbitten» ist ein Knopf im Cockpit bei Status «Erledigt» und öffnet eine vorbereitete WhatsApp-Nachricht; nichts geht automatisch.
- Studio, 02.11.2026: **Team wie auf der bisherigen Website**: pro Person Porträt, Rolle, Name, bei der Administration die Mail. Fotos im Cockpit hinzufügen, ändern, entfernen (Handy: Kamera oder Fotos; der Browser verkleinert). Der Website-Bau lädt die Fotos herunter und liefert sie selbst aus.
- Studio, 03.11.2026: **Zweite Linie «Klar»** (clean, Tesla-artig) als Alternative zur Linie «Lack»; gleiche Inhalte, Bilder, Formular-Logik und gleicher Empfang (Cockpit). Ordner `astro-klar/`.
- Studio, 03.11.2026: **Tesla-Modell im Formular** zum Antippen (Model 3, Y, S, X, anderes), nur bei «Es ist ein Tesla»; in Mail und Cockpit sichtbar.
- Studio, 03.11.2026: Prüfung mit den Skills, **je 1 blinder Bewerter statt 6**, um Kosten zu sparen. Ergebnisse sind darum nur ein grober Vorfilter (vorschau/klar/PRUEFBERICHT.md).
- Roni, 04.11.2026: **Die aktuelle Teamseite von autospeedy.ch darf verwendet werden.** Namen, Rollen, Porträts und Mail-Adressen werden auf der Seite Team gezeigt, gegliedert wie dort.
- Roni, 08.11.2026: **Anmeldung im Cockpit nur mit Code per Mail.** Fingerabdruck ist dem Kunden zu viel; ersetzt den Entscheid vom 02.11.2026 für Konten der Betriebe. Danach 30 Tage angemeldet pro Gerät. Studio-Konten (Zugriff auf alle Betriebe, CSV-Export) behalten den zweiten Faktor.
- Roni, 08.11.2026: **Öffnungszeiten Mo bis Fr einheitlich 7.30 bis 12.00 und 13.15 bis 17.30 Uhr** (Wunsch des Betriebs).
- Roni, 08.11.2026: **Es bleibt die Linie Klar**, mit fast weissem Grund, klarem Beige und eigenem Foto im Hero. Die Variante mit Himmel und Graffiti ist verworfen.
- Roni, 10.11.2026: **Cockpit ohne Supabase, Anmeldung über Cloudflare** («es soll wirklich simple to manage sein»). Cloudflare Access steht vor dem Cockpit (Code per Mail, eine Liste erlaubter Adressen). Keine Datenbank mehr; es bleiben zwei Konten, Cloudflare und GitHub, und sie gehören dem Kunden (Roni macht dort keine Pflege). Ersetzt die Supabase-Anmeldung vom 08.11.2026; der Code per Mail bleibt.
