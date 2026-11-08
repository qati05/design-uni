# Taste und Abnahme: zeigen, nicht behaupten

## Art Direction muss aus dem Geschäft entstehen
Vor jedem Design: Wer kommt hierher, mit welcher Unsicherheit, und welche nächste Handlung muss klar sein? Ein Bestattungsunternehmen, eine Autowerkstatt und ein Kulturfestival brauchen nicht dieselbe «Premium»-Hero.

Jede Richtung benennt konkrete Schriften (Rollen, Gewichte, Lesbarkeit, Lizenz/Quelle), Raster und maximale Textbreite, Abstandsskala mit Dichtebegründung, Farbrollen samt Kontrast, Bildmotiv/Beschnitt und eine bewusste Eigenheit. Nicht «modern, clean, hochwertig», sondern sichtbare Entscheidungen. Desktop-Komposition und mobile Reihenfolge gemeinsam planen. Texte sollen Angebot, Region, Nutzen und nächste Handlung erklären; kein «Wir revolutionieren Ihre digitale Zukunft» als Inhaltsersatz.

Referenzen: URL, konkrete Beobachtung, Übertragungsgrund, was ausdrücklich nicht übernommen wird. Keine kopierten Layouts/Logos/Claims. Assets mit Herkunft, Lizenz, Nutzungsumfang und Freigabestatus erfassen. Fehlende Originalbilder als Platzhalter kennzeichnen; keine erfundenen Mitarbeiter, Referenzen oder Kundenlogos. Ungeklärte Nutzungsrechte blockieren die Veröffentlichung, nicht unbedingt eine klar bezeichnete interne Studie.

## Slop-Warnzeichen — kontextbezogen beurteilen
- Austauschbare Hero-Aussage, die auch bei fünf Konkurrenten stehen könnte.
- Drei Featurekarten ohne inhaltlichen Grund; identische Rundungen, Icons und Abstände überall.
- Riesige Leerräume, die den wichtigen nächsten Schritt auf Mobile verdrängen.
- Dekorative Glows, Verläufe, Glasflächen oder Animationen ohne Marken-/Nutzerzweck.
- Stockbilder, die dem realen Angebot widersprechen; fiktive Kennzahlen als Vertrauenstrick.
- Unruhige Typohierarchie, generische Illustrationen oder Effekte, die Inhalte verdecken.

Das sind Prüfhinweise, keine pauschalen Verbote. Karten können Vergleich erleichtern, ein Verlauf kann zur Marke gehören, bekannte Muster können gerade richtig sein. Zu jedem Kritikpunkt echten Screenshot/Ausschnitt, konkrete Nutzerfolge und eine prüfbare Verbesserung liefern. Nicht nach Laune alles neu gestalten. Ein klarer primärer CTA, echte Inhalte und eine eigenständige Bild-/Typohierarchie sind wichtiger als Extravaganz.

## Browser-Belegpaket pro integrierter Fassung
QA notiert URL, Version/Arbeitsstand, Datum mit Europe/Zurich-Label, Browser, Viewport und Testbedingungen. Mindestens: 390×844 Mobile und 1440×900 Desktop; zusätzlich 320 px Breite für Überlauf/Reflow und eine Zwischenbreite nach Layoutbedarf. Screenshots: erster Viewport, ganze Kernseite, geöffnete Navigation und kritische Formularzustände. Bilder tatsächlich ansehen, nicht allein Dateiexistenz prüfen. Layout zwischen Breakpoints ebenfalls testen.

Kritiker prüft zuerst ohne Selbsterklärung des Designers: Was wird angeboten? Wem? Welche nächste Handlung ist sichtbar? Danach Abgleich mit Briefing und Designvertrag. Unabhängigkeit bedeutet andere Agentinstanz ohne Umsetzungstätigkeit, nicht objektive Unfehlbarkeit. Kritiker kann Screenshots und Testbelege lesen; QA muss echte Flows separat selbst ausführen.

## Funktion und Zugänglichkeit
- Hauptreise vom Einstieg bis Kontakt/Buchung/Kaufvorbereitung; Navigation, CTA-Ziele, Rückweg, Telefonlinks und 404. Keine echte Bestellung oder Nachricht absenden.
- Formulare: Labels, Pflichtfelder, verständliche Validierung, Fokus auf Fehler, loading, Erfolg, Server-/Netzwerkfehler, Doppelklickschutz; mit lokalen Mocks oder freigegebener Testumgebung. Mock-Erfolg ist kein Nachweis realer Zustellung.
- Reale lange Namen/Texte, fehlende Bilder, leere Daten, langsame Verbindung; keine personenbezogenen Echtdaten verwenden.
- Tastatur: Tabreihenfolge, sichtbarer Fokus, erreichbare Controls, Escape/Focus-Trap/Focus-Rückgabe bei Dialogen; kein verdeckter Fokus.
- Semantik, Überschriften, zugängliche Namen, Bildalternativen, Zoom/Reflow; Kontrast Ziel WCAG AA (4.5:1 Normaltext, 3:1 grosser Text bzw. relevante UI-Grenzen). Automatischer Scan ersetzt keine manuelle Prüfung und beweist keine vollständige WCAG-Konformität.
- Motion mit Zweck, prefers-reduced-motion respektieren; kein unvermeidbares Autoplay, Layoutspringen oder scrollgebundener Bedienzwang.

## Technik und Performance
Vorhandene Lint-/Typ-/Build-/Testbefehle tatsächlich ausführen, Exitcode und relevante Ausgabe notieren. Browserkonsole und fehlgeschlagene Requests prüfen. Keine alleinige Abnahme durch erfolgreichen Build.

Früh einen Projektbudget-Vorschlag freigeben: Für eine einfache Marketingseite beispielsweise initial übertragenes JS ≤200 kB gzip, erster Viewport inklusive Bildern ≤1 MB; Stack und Inhalte können begründete Anpassungen verlangen. Nutzerziele: LCP ≤2.5 s, CLS ≤0.1, INP ≤200 ms am 75. Perzentil **echter Felddaten**, falls vorhanden. Ein lokaler Lighthouse-Lauf ist Laborevidenz, kein Beweis dieser Feldwerte. Ohne Felddaten «nicht gemessen» melden; Labormetriken unter dokumentiertem Gerät/Netz messen, keine Scores erfinden. Auffällige Labormessungen untersuchen, Abweichungen offen erklären.

## Befund und Release-Gate
`ID | P0–P3 | Seite/Viewport/Zustand | Beobachtung | Nutzerfolge | Screenshot/Log/Repro | Owner | Abnahmekriterium | Reteststatus`
P0: Sicherheits-/Datenrisiko; P1: Kernreise oder wesentliche Bedienbarkeit kaputt; P2: erhebliche Design-/Qualitätsabweichung; P3: begrenzte Politur. P0/P1 müssen gelöst und nachgetestet sein. P2 einzeln beheben oder explizit vom Entscheider akzeptieren lassen; P3 transparent listen. Ein fehlender Pflichttest ist BLOCKED, keine angenommene Erfüllung. Keine Durchschnittsnote darf Blocker überdecken. Prüfliste ist kein Rechts- oder Sicherheitszertifikat.
