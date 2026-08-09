"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { sampleCatmullRom, samplesToPath } from "@/lib/curve";

gsap.registerPlugin(ScrollTrigger);

/**
 * The thread that runs the page — desktop only (no safe margin for it on
 * mobile, where the Hero keeps its own standalone wave instead, see
 * Hero.jsx + Spine.jsx).
 *
 * This is ONE path, not two. Near the top it swings wide across the Hero
 * content column (taking over the role the old standalone Hero wave used
 * to play); past a smooth transition zone tied to the Hero section's own
 * measured height, it settles into a slim line hugging the left gutter
 * for the rest of the page, down to where the Contact section begins.
 *
 * Coordinates are built directly in real pixels with a 1:1 viewBox (no
 * non-uniform scaling, no vector-effect trick) — an earlier version used
 * an abstract 0-100 unit system stretched ~12x horizontally, which made
 * the browser's dash-pattern (stroke-dasharray/offset, used for the
 * scroll-driven reveal) render incorrectly at some points along the path.
 * Plain 1:1 pixel coordinates sidestep that entirely.
 */

function heroTexture(fh) {
  return (
    0.6 * Math.sin(fh * Math.PI * 2 * 2.3 + 0.5) +
    0.4 * Math.sin(fh * Math.PI * 2 * 4.6 + 2.0)
  );
}

function thinTexture(y) {
  return (
    0.55 * Math.sin((y / 340) * Math.PI * 2 + 0.8) +
    0.28 * Math.sin((y / 130) * Math.PI * 2 + 2.4) +
    0.17 * Math.sin((y / 61) * Math.PI * 2 + 4.1)
  );
}

function smoothstep(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/**
 * Thin -> wide bump -> thin. The "wide" window is deliberately placed
 * around Hero's own bottom padding and the very top of the About section
 * (past the headline/paragraph text), not across the whole Hero height —
 * so the lively wave moment sits in genuinely empty space rather than
 * behind body copy. base/amp are fractions of container width (0-1).
 */
function envelope(y, heroEndY) {
  const THIN = { base: 0.08, amp: 0.03 };
  const WIDE = { base: 0.5, amp: 0.22 };

  const bumpStart = heroEndY * 0.88;
  const bumpInEnd = heroEndY * 1.02;
  const bumpOutStart = heroEndY * 1.35;
  const bumpEnd = heroEndY * 1.65;

  if (y <= bumpStart || y >= bumpEnd) {
    return { base: THIN.base, amp: THIN.amp, wideness: 0 };
  }
  if (y >= bumpInEnd && y <= bumpOutStart) {
    return { base: WIDE.base, amp: WIDE.amp, wideness: 1 };
  }
  if (y < bumpInEnd) {
    const t = smoothstep((y - bumpStart) / (bumpInEnd - bumpStart));
    return {
      base: THIN.base + (WIDE.base - THIN.base) * t,
      amp: THIN.amp + (WIDE.amp - THIN.amp) * t,
      wideness: t,
    };
  }
  const t = smoothstep((y - bumpOutStart) / (bumpEnd - bumpOutStart));
  return {
    base: WIDE.base + (THIN.base - WIDE.base) * t,
    amp: WIDE.amp + (THIN.amp - WIDE.amp) * t,
    wideness: 1 - t,
  };
}

function buildPoints({ totalHeight, heroEndY, width }, sampleCount = 220) {
  const points = [];
  for (let i = 0; i <= sampleCount; i++) {
    const f = i / sampleCount;
    const y = f * totalHeight;

    const { base, amp, wideness } = envelope(y, heroEndY);
    const fh = Math.min(1, y / (heroEndY * 1.65));
    const tex = heroTexture(fh) * wideness + thinTexture(y) * (1 - wideness);
    points.push({ x: (base + amp * tex) * width, y });
  }
  return points;
}

export default function Thread() {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const [geom, setGeom] = useState(null);
  const lastGeom = useRef(null);

  useEffect(() => {
    const measure = () => {
      const contact = document.getElementById("contact");
      const hero = document.getElementById("top");
      if (!contact || !hero) return;
      const contactTop = contact.getBoundingClientRect().top + window.scrollY;
      const heroRect = hero.getBoundingClientRect();
      const heroHeight = heroRect.height;
      const left = Math.min(32, heroRect.left);
      const width = heroRect.right - left;

      const next = {
        contactTop: Math.round(contactTop),
        heroEndY: Math.round(heroHeight),
        left,
        width,
      };

      const prev = lastGeom.current;
      const changed =
        !prev ||
        Math.abs(prev.contactTop - next.contactTop) > 2 ||
        Math.abs(prev.heroEndY - next.heroEndY) > 2 ||
        Math.abs(prev.left - next.left) > 2 ||
        Math.abs(prev.width - next.width) > 2;

      if (changed) {
        lastGeom.current = next;
        setGeom(next);
      }
    };
    measure();

    let raf = 0;
    const scheduleMeasure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(document.body);
    window.addEventListener("resize", scheduleMeasure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, []);

  const pathD = geom
    ? samplesToPath(
        sampleCatmullRom(
          buildPoints({
            totalHeight: geom.contactTop,
            heroEndY: geom.heroEndY,
            width: geom.width,
          }),
          3
        )
      )
    : "";

  useGSAP(
    () => {
      if (!pathRef.current || !geom) return;
      const contactEl = document.getElementById("contact");
      if (!contactEl) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      const length = pathRef.current.getTotalLength();
      const lead = Math.min(0.35, window.innerHeight / geom.contactTop);

      const updateDraw = (self) => {
        const drawn = Math.min(1, self.progress + lead);
        gsap.set(pathRef.current, { strokeDashoffset: length * (1 - drawn) });
      };

      gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });

      const st = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        endTrigger: contactEl,
        end: "top top",
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: updateDraw,
        onRefresh: updateDraw,
      });
      updateDraw(st);

      ScrollTrigger.refresh();
    },
    { dependencies: [geom], scope: containerRef, revertOnUpdate: true }
  );

  if (!geom) return null;

  return (
    <div
      ref={containerRef}
      className="hidden lg:block absolute top-0 pointer-events-none"
      style={{ left: geom.left, width: geom.width, height: geom.contactTop }}
      aria-hidden="true"
    >
      <svg
        width={geom.width}
        height={geom.contactTop}
        viewBox={`0 0 ${geom.width} ${geom.contactTop}`}
        className="opacity-[0.65]"
      >
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="var(--color-pine)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
