"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Folder, X } from "lucide-react";
import { projects } from "@/lib/data";
import { skillMatchesTag, slugify, cn } from "@/lib/utils";
import { useFilter } from "./FilterContext";

const GithubIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 6.003 0c2.291-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.795 24 17.295 24 12c0-6.63-5.373-12-12-12Z" />
  </svg>
);

export default function Projects() {
  const { activeSkill, clearSkill, highlightedProjectId } = useFilter();

  const isMatch = (p) =>
    !activeSkill || p.tags.some((t) => skillMatchesTag(activeSkill, t));

  return (
    <section id="projects" className="px-6 py-24 border-t border-line/60">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-12">
          <p className="font-mono text-xs tracking-widest uppercase text-ink-soft">
            Projects
          </p>
          {activeSkill && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={clearSkill}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-amber bg-amber/10 hover:bg-amber/20 rounded-full pl-3 pr-2 py-1.5 transition-colors"
            >
              related to &ldquo;{activeSkill}&rdquo;
              <X className="w-3 h-3" />
            </motion.button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((p, i) => {
            const match = isMatch(p);
            const id = `project-${slugify(p.title)}`;
            const isHighlighted = highlightedProjectId === id;
            const isFilterMatch = Boolean(activeSkill) && match;

            return (
              <motion.article
                key={p.title}
                id={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                className={cn(
                  "group rounded-2xl border bg-paper-2 overflow-hidden transition-all duration-300",
                  match ? "opacity-100 scale-100" : "opacity-40 scale-[0.98]",
                  isHighlighted
                    ? "border-pine ring-2 ring-pine/40"
                    : isFilterMatch
                    ? "border-amber ring-2 ring-amber/50"
                    : "border-line/70 hover:border-pine/60 hover:-translate-y-0.5"
                )}
              >
                <div className="relative h-44 bg-gradient-to-br from-pine/15 to-amber/15 border-b border-line/60 overflow-hidden">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={`${p.title} preview`}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Folder className="w-8 h-8 text-pine/50" strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-display text-xl text-ink leading-snug">
                      {p.title}
                    </h3>
                    <span className="font-mono text-[11px] text-ink-soft/70 whitespace-nowrap pt-1.5">
                      {p.period}
                    </span>
                  </div>
                  <p className="text-ink-soft leading-relaxed">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[11px] tracking-wide text-amber bg-amber/10 rounded-full px-2.5 py-1"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {(p.github || p.demo) && (
                    <div className="flex items-center gap-4 mt-5 pt-4 border-t border-line/50">
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-pine transition-colors"
                        >
                          <GithubIcon className="w-4 h-4" /> Code
                        </a>
                      )}
                      {p.demo && (
                        <a
                          href={p.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-pine transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" /> Live site
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
