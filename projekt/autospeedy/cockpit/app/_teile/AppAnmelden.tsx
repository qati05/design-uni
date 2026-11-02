"use client";

import { useEffect } from "react";

/** Meldet den Service Worker an (Installierbarkeit, Offline-Seite). */
export function AppAnmelden() {
  useEffect(() => {
    if ("serviceWorker" in navigator && window.isSecureContext) navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
  }, []);
  return null;
}
