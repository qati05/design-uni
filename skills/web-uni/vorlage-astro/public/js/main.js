/* Vorlage: Öffnungsstatus aus dem Datenblock «betrieb-daten» (kommt aus content/betrieb.json, eine Quelle).
   Alles Wesentliche steht auch ohne dieses Skript im HTML. Keine Cookies, nichts im Speicher des Geräts, keine fremden Hosts. */
(function () {
  "use strict";
  var el = document.getElementById("betrieb-daten"), daten = null;
  try { if (el) daten = JSON.parse(el.textContent); } catch (e) {}
  if (!daten || !daten.zeiten) return;
  var TAGE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  var uhr = function (m) { var h = Math.floor(m / 60), r = m % 60; return h + "." + (r < 10 ? "0" : "") + r + " Uhr"; };
  function zuerich(d) {
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Zurich", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }), t = {};
    f.formatToParts(d).forEach(function (p) { t[p.type] = p.value; });
    return { tag: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[t.weekday], min: parseInt(t.hour, 10) * 60 + parseInt(t.minute, 10) };
  }
  function status(jetzt) {
    var z = zuerich(jetzt), f = daten.zeiten[z.tag] || [], i, j, d, g;
    for (i = 0; i < f.length; i++) if (z.min >= f[i][0] && z.min < f[i][1]) return "Laut Öffnungszeiten jetzt geöffnet bis " + uhr(f[i][1]) + ".";
    for (j = 0; j <= 7; j++) { d = (z.tag + j) % 7; g = daten.zeiten[d] || [];
      for (i = 0; i < g.length; i++) if (j > 0 || g[i][0] > z.min) return "Laut Öffnungszeiten jetzt geschlossen. Wieder offen " + (j === 0 ? "heute ab " : "am " + TAGE[d] + " ab ") + uhr(g[i][0]) + "."; }
    return "Laut Öffnungszeiten jetzt geschlossen.";
  }
  var teile = document.querySelectorAll("[data-status]"), i;
  for (i = 0; i < teile.length; i++) teile[i].textContent = status(new Date());
  window.__vorlage = { status: status };
})();
