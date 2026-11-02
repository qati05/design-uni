/* Öffnungsstatus aus dem Datenblock «betrieb-daten» (Zeiten aus betrieb.json, Wortlaut aus texte.json; eine Quelle).
   Ohne dieses Skript bleibt der Satz aus texte.json stehen. Keine Cookies, nichts im Speicher des Geräts, keine fremden Hosts.
   Feiertage und Betriebsferien kennt das Skript nicht [nicht gebaut]. */
(function () {
  "use strict";
  var el = document.getElementById("betrieb-daten"), daten = null;
  try { if (el) daten = JSON.parse(el.textContent); } catch (e) {}
  if (!daten || !daten.zeiten || !daten.status) return;
  var sprache = document.documentElement.lang || "de-CH", s = daten.status;
  var tagName = function (d) { return new Intl.DateTimeFormat(sprache, { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 0, 4 + d))); };
  var uhr = function (m) { var h = Math.floor(m / 60), r = m % 60; return h + "." + (r < 10 ? "0" : "") + r; };
  function zuerich(d) {
    var f = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Zurich", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }), t = {};
    f.formatToParts(d).forEach(function (p) { t[p.type] = p.value; });
    return { tag: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[t.weekday], min: parseInt(t.hour, 10) * 60 + parseInt(t.minute, 10) };
  }
  function status(jetzt) {
    var z = zuerich(jetzt), f = daten.zeiten[z.tag] || [], i, j, d, g;
    for (i = 0; i < f.length; i++) if (z.min >= f[i][0] && z.min < f[i][1]) return s.offen.replace("{bis}", uhr(f[i][1]));
    for (j = 0; j <= 7; j++) { d = (z.tag + j) % 7; g = daten.zeiten[d] || [];
      for (i = 0; i < g.length; i++) if (j > 0 || g[i][0] > z.min) return j === 0 ? s.zuHeute.replace("{ab}", uhr(g[i][0])) : s.zuTag.replace("{tag}", tagName(d)).replace("{ab}", uhr(g[i][0])); }
    return s.zu;
  }
  var teile = document.querySelectorAll("[data-status]"), i;
  for (i = 0; i < teile.length; i++) teile[i].textContent = status(new Date());
  window.__vorlage = { status: status };
})();
