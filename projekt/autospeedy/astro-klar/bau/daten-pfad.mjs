// Linie «Klar» liest die Inhalte der ersten Linie. Der Pfad wird hier gesetzt statt im npm-Skript
// («DATEN=… astro dev» laeuft unter Windows nicht). Ein ausdruecklich gesetztes DATEN (z. B. in Tests) geht vor.
process.env.DATEN = process.env.DATEN || "../astro/src/content";
