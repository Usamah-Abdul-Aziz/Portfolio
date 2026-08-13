"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { skillGroups, certifications, projects } from "@/lib/data";
import { skillMatchesTag, cn } from "@/lib/utils";
import { useFilter } from "./FilterContext";

function isFilterable(item) {
  return projects.some((p) => p.tags.some((t) => skillMatchesTag(item, t)));
}

const ISSUER_BADGE = {
  AWS: "text-amber border-amber/40 bg-amber/10",
  Cisco: "text-[#3E7CA6] border-[#3E7CA6]/35 bg-[#3E7CA6]/10",
  "Digital Talent Scholarship": "text-pine border-pine/35 bg-pine/10",
  "EF SET": "text-ink-soft border-ink-soft/30 bg-ink-soft/10",
};

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
            {certifications.map((c) => {
              const badgeClass =
                ISSUER_BADGE[c.issuer] || "text-ink-soft border-ink-soft/30 bg-ink-soft/10";
              const inner = (
                <>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-[10px] tracking-wide uppercase border rounded-full px-2 py-0.5",
                      badgeClass
                    )}
                  >
                    {c.issuer}
                  </span>
                  <span className="flex-1">{c.name}</span>
                  {c.url && (
                    <ExternalLink className="w-3.5 h-3.5 text-ink-soft/40 group-hover:text-pine transition-colors shrink-0" />
                  )}
                </>
              );

              return (
                <li key={c.name} className="border-b border-line/50 pb-3">
                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 text-ink-soft hover:text-pine transition-colors leading-relaxed"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-ink-soft leading-relaxed">
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
