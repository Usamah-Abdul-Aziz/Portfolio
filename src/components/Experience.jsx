"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { professionalExperience, organizationalExperience, projects } from "@/lib/data";
import { skillMatchesTag, cn } from "@/lib/utils";
import { useFilter } from "./FilterContext";
import Counter from "./Counter";

const STATS = [
  { value: projects.length, suffix: "+", label: "Projects shipped" },
  {
    value: professionalExperience.length + organizationalExperience.length,
    suffix: "",
    label: "Roles & responsibilities",
  },
  { value: 2, suffix: "+", label: "Years building things" },
];

function Timeline({ items }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.4"],
  });
  const { activeSkill } = useFilter();

  return (
    <div ref={containerRef} className="relative">
      <div
        className="absolute left-[7px] top-2 bottom-2 w-px bg-line"
        aria-hidden="true"
      />
      <motion.div
        className="absolute left-[7px] top-2 bottom-2 w-px bg-pine origin-top"
        style={{ scaleY: scrollYProgress }}
        aria-hidden="true"
      />
      <ul className="space-y-10">
        {items.map((item, i) => {
          const match = !activeSkill || item.tags.some((t) => skillMatchesTag(activeSkill, t));
          const isFilterMatch = Boolean(activeSkill) && match;

          return (
            <motion.li
              key={item.role + item.period}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={cn(
                "relative pl-8 sm:grid sm:grid-cols-[160px_1fr] sm:gap-8 sm:pl-8 transition-opacity duration-300",
                match ? "opacity-100" : "opacity-40"
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 transition-colors duration-300",
                  isFilterMatch ? "bg-amber border-amber" : "bg-paper border-pine"
                )}
                aria-hidden="true"
              />
              <p className="font-mono text-xs text-amber tracking-wide mb-1 sm:mb-0">
                {item.period}
              </p>
              <div>
                <h3 className="font-display text-xl text-ink">{item.role}</h3>
                <p className="text-sm text-ink-soft/80 mb-2">{item.org}</p>
                <p className="text-ink-soft leading-relaxed max-w-2xl">
                  {item.detail}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[11px] tracking-wide text-pine-deep bg-pine/10 rounded-full px-2.5 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="px-6 py-24 border-t border-line/60">
      <div className="max-w-5xl mx-auto space-y-20">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 divide-x divide-line/60 border-y border-line/60 py-8"
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center px-2">
              <p className="font-display text-4xl sm:text-5xl text-pine-deep">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="font-mono text-[11px] sm:text-xs tracking-wide text-ink-soft/70 mt-2">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>

        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-ink-soft mb-12">
            Professional Experience
          </p>
          <Timeline items={professionalExperience} />
        </div>

        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-ink-soft mb-12">
            Organizational Experience
          </p>
          <Timeline items={organizationalExperience} />
        </div>
      </div>
    </section>
  );
}
