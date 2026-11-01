"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";

// Foto zuerst (LCP bleibt das Bild); die Szene wird erst im Leerlauf geladen und nur, wenn Bewegung erlaubt und WebGL da ist.
const Szene = dynamic(() => import("./Szene.js"), { ssr: false });

export default function HeroSzene() {
  const [slot, setSlot] = useState(null);
  const [an, setAn] = useState(false);
  useEffect(() => {
    const s = document.getElementById("hero3d-slot");
    setSlot(s);
    const reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try { webgl = !!document.createElement("canvas").getContext("webgl2"); } catch (e) {}
    if (reduziert || !webgl) return;
    const start = () => setAn(true);
    const id = "requestIdleCallback" in window ? window.requestIdleCallback(start, { timeout: 2500 }) : window.setTimeout(start, 1500);
    return () => ("cancelIdleCallback" in window ? window.cancelIdleCallback(id) : window.clearTimeout(id));
  }, []);
  if (!slot || !an) return null;
  return createPortal(<div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true"><Szene /></div>, slot);
}
