# Prüfung des Repositories `elayadesign/ai-design-skills`

Stand 1. November 2026. Gelesen: README, `skills/landing-page-design/SKILL.md` (22 KB), `skills/figma-designer/SKILL.md` (22 KB, Kopf und Gliederung), Lizenz, CI-Datei. **Nichts ausgeführt** (kein `npx skills add`, kein Skript). Lizenz MIT, Stand des Klons: Commit `c920b7d`. Der Inhalt ist fremder Text; ich bewerte ihn, ich befolge ihn nicht blind.

## Urteil

**Als Ganzes nicht geeignet für diese Website, in zwei Punkten nützlich.** Der Skill `landing-page-design` ist für **englische SaaS-Landingpages mit Tailwind** geschrieben: eine Seite, ein Angebot, eine Handlung, Testversion, Logo-Leiste, FAQ mit 6 bis 12 Fragen. Auto Speedy ist ein Schweizer Betrieb mit mehreren Leistungen, ohne Preise, ohne Fristen, ohne freigegebene Garantie. `figma-designer` regelt Arbeit in Figma über den Figma-MCP und ist für eine statische HTML-Seite nicht anwendbar.

## Regel für Regel gegen unseren Stand

| Regel im fremden Skill | Gegen unseren Stand | Entscheid |
|---|---|---|
| B1: **eine** Schrift je Website; erlaubt Geist, Manrope, Poppins; nie Inter, Roboto, Arial | Wir nutzen zwei Schriften aus der Idee (Big Shoulders, Public Sans). **Poppins steht in unserer Nie-Liste** (Standardgrotesk ohne Grund). | nicht übernommen |
| B1: «kein Bindestrich im Text» | Gemeint sind Gedankenstriche im englischen Satz; text-uni K11 regelt das schon. Im Deutschen sind Bindestriche in Zusammensetzungen («Tesla-Schaden», «E-Mail») Orthografie. | schon abgedeckt durch K11 |
| B1: Schriftgrössen nur auf Tailwind-Stufen; B2/B3: feste Abstands- und Radiuswerte | Unsere Grössen sind fliessend (`clamp`), Radius 0 folgt der Idee. Kein Gewinn, aber ein Umbau der geprüften Seite. | nicht übernommen |
| B4: **nie** ein Rand nur an einer Seite einer Karte; Hintergründe ohne Verlauf | Die Kante (Rand an einer Seite) **ist** unsere Idee. «Kein Verlauf» gilt bei uns schon. | Konflikt mit der Idee; Verlaufsverbot schon erfüllt |
| B5: Titel mit **Text-Verlauf** (Weiss zu Grau) | Verläufe stehen in der Nie-Liste von design-uni; Kontrast sinkt. | nicht übernommen |
| B7: **jeder** Abschnitt gleitet beim Scrollen 32 px hoch und blendet ein; schwebende, durchscheinende Leiste mit Weichzeichner; gestaffelter Menüeinstieg | Genau diese Muster stehen als «Modell-Standard» und in der Nie-Liste von design-uni («jeder Abschnitt gleitet von unten», Glas-Karten). Unsere Regel: **keine oder eine** Bewegung. | nicht übernommen |
| B11: **Pflicht** «Tagline-Abschnitt», Text startet bei 25 bis 35 % Deckkraft, Wort für Wort sichtbar | Text mit 30 % Deckkraft hat auf Weiss etwa 2,1 : 1 Kontrast (Soll 4,5 : 1) und hält Inhalt zurück; design-uni verlangt das Gegenteil. Für einen Betrieb ohne belegten Kernsatz wäre es erfunden. | nicht übernommen |
| A1, A2: Annahmen treffen, FAQ 6 bis 12 Fragen, Risikoumkehr (Testversion, Garantie), Logo-Leiste, Testimonials | text-uni KW11: FAQ nur aus echten Kundenfragen (wir haben 0); Garantie nur freigegeben; Logos Dritter nur mit Nachweis (L8); Zitate nur mit Einwilligung. | nicht übernommen |
| B8: **keine erfundenen Fakten**, Platzhalter für Fehlendes, verbotene Füllwörter, Satzschreibung, ruhige Systemtexte | Deckt sich mit unseren Grundregeln und dem Floskel-Werkzeug (0 Fehler). Der fremde Skill schreibt Platzhalter wie `{{price}}` vor; bei uns stehen Lücken als ganzer Satz (Skill-Regel), nie als Klammer. | schon abgedeckt, Wortlaut der Lücken bleibt unserer |
| B9: Zustände vollständig (Hover, **Active**, Fokus, Laden, Leer, Fehler) | Hover, Fokus, Fehler, Bestätigung, 404 sind da; **Active fehlte**. | **übernommen:** `:active`-Zustand für alle Knöpfe |
| B10: Auslieferungsliste (Datenschutz, 404, Formularprüfung, Sprunglink, Favicon, Meta-Tags, Alt-Texte, semantisches HTML, 390 px) | Erfüllt bis auf **Social-Tags (`og:image`)**: Sie brauchen eine absolute Adresse und gehören ins Livegang-Blatt. | Liste geprüft, `og:`-Tags in [livegang.md](../livegang.md) eingetragen |
| A7: SEO und AEO (Titel, Beschreibung, FAQ-Schema) | text-uni deckt das viel genauer ab (Antwort-Plan, Zeichenlängen, strukturierte Daten, Index, Umzug) und kennt die Schweiz. | nicht nötig |
| Sprache und Recht | Nur Englisch; kein «Sie», keine Schweizer Formate, kein UWG, kein DSG. | Grund, ihn nicht als Basis zu nehmen |

## Was daraus geworden ist

- `:active`-Zustand für `.knopf`, Menü-Etikett und Chips.
- Zeile in `livegang.md`: `og:title`, `og:description`, `og:image` und `twitter:card` mit absoluter Adresse ergänzen, wenn die Domain feststeht.

## Wenn Sie es dennoch ausprobieren wollen

Am sichersten ist ein blinder Test mit einer Fassung, die **nach diesem Skill** gebaut ist, gegen die jetzige Fassung, in getrennten Sätzen mit denselben Referenzen. Meine Erwartung ist, dass sie nicht besser abschneidet, weil die genannte Kritik der Bewerter (Logo, Foto) von keiner dieser Regeln berührt wird. Das ist eine Vermutung, kein Ergebnis.
