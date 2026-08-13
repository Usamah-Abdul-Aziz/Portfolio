"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { sampleCatmullRom, samplesToPath } from "@/lib/curve";

gsap.registerPlugin(ScrollTrigger);

/**
 * The thread that runs the page — xl screens only (1280px+). It needs a
 * genuinely empty margin to sit in once it's thin, and content is
 * max-w-5xl (1024px): at the lg breakpoint (1024px) that margin can be
 * ~0px, which is exactly what caused it to drift over body text. xl+
 * guarantees a real margin.
 *
 * One path, not two. Near the top it swings wide across the Hero content
 * column (taking over the role the old standalone Hero wave used to
 * play); past a transition zone tied to Hero's own measured height, it
 * settles into a slim line at a fixed pixel offset from the true left
 * edge of the viewport — not a fraction of the content width, so it
 * can't drift back into text regardless of how wide the margin actually
 * is. Only the wide Hero portion scales with content width; the thin
 * portion is deliberately absolute and small.
 */

function heroTexture(fh) {
  return (
    0.6 * Math.sin(fh * Math.PI * 2 * 2.3 + 0.5) +
    0.4 * Math.sin(fh * Math.PI * 2 * 4.6 + 2.0)
  );
}

// One slow, gentle wave — deliberately calmer than earlier versions,
// which layered three frequencies and read as jittery over a tall page.
function thinTexture(y) {
  return Math.sin((y / 520) * Math.PI * 2 + 0.6);
}

function smoothstep(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

const THIN_BASE_PX = 40; // fixed px from the container's left edge
const THIN_AMP_PX = 10;
const WIDE_BASE_FRAC = 0.5; // fraction of content width
const WIDE_AMP_FRAC = 0.22;

function envelope(y, heroEndY, safeEndY) {
  // Widen shortly before Hero ends, peak exactly at the Hero/About seam,
  // and be fully back to thin by safeEndY (measured against where About's
  // actual body text starts, with a margin — not a guessed multiplier).
  // The two earlier versions of this both assumed more empty space below
  // Hero than actually exists (~97px in practice), so the tail of the
  // transition kept landing on the About paragraph.
  const span = Math.max(60, safeEndY - heroEndY);
  const bumpStart = heroEndY - span * 0.9;
  const bumpInEnd = heroEndY;
  const bumpOutStart = heroEndY + span * 0.15;
  const bumpEnd = safeEndY;

  if (y <= bumpStart || y >= bumpEnd) return { wideness: 0 };
  if (y >= bumpInEnd && y <= bumpOutStart) return { wideness: 1 };
  if (y < bumpInEnd) {
    return { wideness: smoothstep((y - bumpStart) / (bumpInEnd - bumpStart)) };
  }
  return { wideness: 1 - smoothstep((y - bumpOutStart) / (bumpEnd - bumpOutStart)) };
}

function buildPoints({ totalHeight, heroEndY, safeEndY, width }, sampleCount = 220) {
  const points = [];
  for (let i = 0; i <= sampleCount; i++) {
    const f = i / sampleCount;
    const y = f * totalHeight;

    const { wideness } = envelope(y, heroEndY, safeEndY);
    const fh = Math.min(1, y / heroEndY);

    const thinX = THIN_BASE_PX + THIN_AMP_PX * thinTexture(y);
    const wideX = (WIDE_BASE_FRAC + WIDE_AMP_FRAC * heroTexture(fh)) * width;

    points.push({ x: thinX + (wideX - thinX) * wideness, y });
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
      const about = document.getElementById("about");
      if (!contact || !hero) return;
      const contactTop = contact.getBoundingClientRect().top + window.scrollY;
      const heroRect = hero.getBoundingClientRect();
      const heroHeight = heroRect.height;

      // Where About's actual body copy starts — the bump must fully
      // resolve back to thin before this, with a margin. Falls back to a
      // fixed offset past Hero if for some reason the paragraph isn't
      // found, so this never throws.
      const aboutPara = about?.querySelector("p");
      const safeEndY = aboutPara
        ? aboutPara.getBoundingClientRect().top + window.scrollY - 24
        : heroHeight + 120;

      // Fixed, small, always-safe left offset — xl+ guarantees enough
      // margin for this regardless of exact viewport width.
      const left = 40;
      const width = heroRect.right - left;

      const next = {
        contactTop: Math.round(contactTop),
        heroEndY: Math.round(heroHeight),
        safeEndY: Math.round(safeEndY),
        left,
        width: Math.round(width),
      };

      const prev = lastGeom.current;
      const changed =
        !prev ||
        Math.abs(prev.contactTop - next.contactTop) > 2 ||
        Math.abs(prev.heroEndY - next.heroEndY) > 2 ||
        Math.abs(prev.safeEndY - next.safeEndY) > 2 ||
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
            safeEndY: geom.safeEndY,
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
      className="hidden xl:block absolute top-0 pointer-events-none"
      style={{ left: geom.left, width: geom.width, height: geom.contactTop }}
      aria-hidden="true"
    >
      <svg
        width={geom.width}
        height={geom.contactTop}
        viewBox={`0 0 ${geom.width} ${geom.contactTop}`}
        className="opacity-[0.55]"
      >
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="var(--color-pine)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
