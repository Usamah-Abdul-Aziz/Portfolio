"use client";

import { motion } from "framer-motion";
import { skillGroups, certifications, projects } from "@/lib/data";
import { skillMatchesTag, cn } from "@/lib/utils";
import { useFilter } from "./FilterContext";

function isFilterable(item) {
  return projects.some((p) => p.tags.some((t) => skillMatchesTag(item, t)));
}

export default function Skills() {
  const { activeSkill, toggleSkill } = useFilter();

  return (
    <section id="skills" className="px-6 py-24 border-t border-line/60">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-16">
        <div>
          <div className="flex items-baseline justify-between gap-3 mb-8">
            <p className="font-mono text-xs tracking-widest uppercase text-ink-soft">
              Skills
            </p>
            <p className="font-mono text-[10px] tracking-wide text-ink-soft/50 hidden sm:block">
              click a skill to see related work
            </p>
          </div>
          <div className="space-y-8">
            {skillGroups.map((g, i) => (
              <motion.div
                key={g.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <h3 className="font-display text-lg text-pine-deep mb-2">
                  {g.label}
                </h3>
                <p className="text-ink-soft leading-relaxed">
                  {g.items.map((item, idx) => {
                    const filterable = isFilterable(item);
                    const active = activeSkill === item;
                    return (
                      <span key={item}>
                        {filterable ? (
                          <button
                            type="button"
                            onClick={() => toggleSkill(item)}
                            aria-pressed={active}
                            className={cn(
                              "underline decoration-dotted underline-offset-4 transition-colors cursor-pointer",
                              active
                                ? "text-pine-deep decoration-solid font-medium"
                                : "hover:text-pine decoration-ink-soft/30 hover:decoration-pine"
                            )}
                          >
                            {item}
                          </button>
                        ) : (
                          item
                        )}
                        {idx < g.items.length - 1 && " · "}
                      </span>
                    );
                  })}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-ink-soft mb-8">
            Certifications
          </p>
          <motion.ul
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {certifications.map((c) => (
              <li
                key={c}
                className="text-ink-soft leading-relaxed border-b border-line/50 pb-3"
              >
                {c}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
