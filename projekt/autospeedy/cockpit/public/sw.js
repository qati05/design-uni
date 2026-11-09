// Service Worker des Cockpits: nur damit es als App installierbar ist und ohne Netz eine klare Seite zeigt.
// Bewusst KEIN Zwischenspeicher für Seiten: die Pflege zeigt immer den aktuellen Stand der Website (Cache-Control: no-store).
const SCHALE = "cockpit-schale-2";
const DATEIEN = ["/offline.html", "/icon-192.png", "/bilder/logo-96.webp"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(SCHALE).then((c) => c.addAll(DATEIEN)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((n) => n !== SCHALE).map((n) => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return; // alles andere geht direkt ans Netz
  e.respondWith(fetch(e.request).catch(() => caches.match("/offline.html")));
});
