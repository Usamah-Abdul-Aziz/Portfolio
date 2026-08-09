"use client";

import { useEffect, useRef, useState } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import gsap from "gsap";

/**
 * Site-wide smooth scroll, driven by GSAP's own ticker so it stays in
 * perfect sync with the ScrollTrigger-based Thread (see Thread.jsx) —
 * two separate RAF loops fighting each other is what makes scroll-linked
 * effects feel janky instead of connected.
 */
export default function SmoothScroll({ children }) {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const lenisRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setEnabled(!mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, [enabled]);

  if (!enabled) return children;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ lerp: 0.1, duration: 1.2, smoothWheel: true, autoRaf: false }}
    >
      {children}
    </ReactLenis>
  );
}
