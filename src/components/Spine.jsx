"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { sampleCatmullRom, samplesToPath } from "@/lib/curve";

/**
 * The site's connecting thread. A calm single wave in the Hero that
 * smoothly flattens and fades as it scrolls out of view — handing off,
 * in spirit, to the progress line that grows down the Experience
 * timeline below. No dragging required; it simply responds to scrolling,
 * the same way the rest of the page does.
 */

const POINTS = [
  { x: 0, y: 65 },
  { x: 110, y: 30 },
  { x: 220, y: 95 },
  { x: 330, y: 55 },
  { x: 440, y: 112 },
  { x: 550, y: 42 },
  { x: 660, y: 72 },
];

const SAMPLES = sampleCatmullRom(POINTS);
const PATH_D = samplesToPath(SAMPLES);

export default function Spine({ className = "" }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "start 0.15"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [1, 0.04]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.9, 0.5, 0.12]);
  const strokeWidth = useTransform(scrollYProgress, [0, 1], [2.5, 1.25]);

  return (
    <div ref={containerRef} className={className}>
      <svg viewBox="0 0 660 180" className="w-full h-auto" aria-hidden="true">
        <motion.g style={{ scaleY, originY: 0.5 }}>
          <motion.path
            d={PATH_D}
            fill="none"
            stroke="var(--color-pine)"
            strokeLinecap="round"
            style={{ opacity, strokeWidth }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
        </motion.g>
      </svg>
      <p className="font-mono text-[11px] tracking-wide text-ink-soft/60 mt-2 px-6 sm:px-0">
        one thread, start to finish.
      </p>
    </div>
  );
}
