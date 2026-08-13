"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { projects } from "@/lib/data";
import { slugify, cn } from "@/lib/utils";
import { useFilter } from "./FilterContext";

const NAV_COMMANDS = [
  { id: "top", group: "Navigate", label: "Go to top", hint: "Home", selector: "#top" },
  { id: "about", group: "Navigate", label: "About", hint: "Who I am", selector: "#about" },
  { id: "experience", group: "Navigate", label: "Experience", hint: "Work & organizations", selector: "#experience" },
  { id: "skills", group: "Navigate", label: "Skills", hint: "Stack & certifications", selector: "#skills" },
  { id: "projects", group: "Navigate", label: "Projects", hint: "Selected work", selector: "#projects" },
  { id: "contact", group: "Navigate", label: "Contact", hint: "Send a message" },
];

const LINK_COMMANDS = [
  { id: "email", group: "Links", label: "Send an email", hint: "ikmal.usamah@gmail.com", href: "mailto:ikmal.usamah@gmail.com" },
  { id: "phone", group: "Links", label: "Call", hint: "+62 812-8406-2693", href: "tel:+6281284062693" },
  { id: "linkedin", group: "Links", label: "Open LinkedIn", hint: "linkedin.com/in/usamah-abdul-aziz", href: "https://linkedin.com/in/usamah-abdul-aziz" },
  { id: "github", group: "Links", label: "Open GitHub", hint: "github.com/Usamah-Abdul-Aziz", href: "https://github.com/Usamah-Abdul-Aziz" },
  { id: "cv", group: "Links", label: "Download CV", hint: "PDF", href: "/cv/usamah-abdul-aziz-cv.pdf" },
];

export default function CommandPalette() {
  const { paletteOpen, togglePalette, closePalette, highlightProject, openContact } = useFilter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const navCommands = useMemo(
    () =>
      NAV_COMMANDS.map((c) =>
        c.id === "contact" ? { ...c, action: openContact } : c
      ),
    [openContact]
  );

  const projectCommands = useMemo(
    () =>
      projects.map((p) => ({
        id: `cmd-project-${slugify(p.title)}`,
        group: "Projects",
        label: p.title,
        hint: p.tags.join(" · "),
        projectId: `project-${slugify(p.title)}`,
      })),
    []
  );

  const allCommands = useMemo(
    () => [...navCommands, ...projectCommands, ...LINK_COMMANDS],
    [navCommands, projectCommands]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCommands;
    return allCommands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.hint?.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q)
    );
  }, [query, allCommands]);

  const close = useCallback(() => {
    closePalette();
    setQuery("");
    setActiveIndex(0);
  }, [closePalette]);

  const runCommand = useCallback(
    (cmd) => {
      if (!cmd) return;
      if (cmd.action) {
        cmd.action();
      } else if (cmd.selector) {
        document.querySelector(cmd.selector)?.scrollIntoView({ behavior: "smooth" });
      } else if (cmd.projectId) {
        document
          .getElementById(cmd.projectId)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        highlightProject(cmd.projectId);
      } else if (cmd.href) {
        if (cmd.href.startsWith("mailto:") || cmd.href.startsWith("tel:")) {
          window.location.href = cmd.href;
        } else {
          window.open(cmd.href, "_blank", "noopener,noreferrer");
        }
      }
      close();
    },
    [close, highlightProject]
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      const isModK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isModK) {
        e.preventDefault();
        togglePalette();
        return;
      }
      if (e.key === "Escape" && paletteOpen) {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [paletteOpen, togglePalette, close]);

  useEffect(() => {
    if (paletteOpen) {
      const frame = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
  }, [paletteOpen]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setActiveIndex(0);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(filtered[activeIndex]);
    }
  };

  const groups = useMemo(() => {
    const map = new Map();
    filtered.forEach((c) => {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group).push(c);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <AnimatePresence>
      {paletteOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-24 sm:pt-32 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={close} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-md bg-paper-2 border border-line/70 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-line/60">
              <Search className="w-4 h-4 text-ink-soft/60 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleInputKeyDown}
                placeholder="Jump to a section, project, or link…"
                className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-ink-soft/50"
              />
              <kbd className="font-mono text-[10px] text-ink-soft/50 border border-line/60 rounded px-1.5 py-0.5">
                esc
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-ink-soft/60">No matches.</p>
              )}
              {groups.map(([groupName, items]) => (
                <div key={groupName} className="px-2 py-1">
                  <p className="px-2 py-1 font-mono text-[10px] tracking-widest uppercase text-ink-soft/40">
                    {groupName}
                  </p>
                  {items.map((cmd) => {
                    const flatIndex = filtered.indexOf(cmd);
                    const isActive = flatIndex === activeIndex;
                    return (
                      <button
                        key={cmd.id}
                        type="button"
                        onMouseEnter={() => setActiveIndex(flatIndex)}
                        onClick={() => runCommand(cmd)}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                          isActive ? "bg-pine/10 text-pine-deep" : "text-ink hover:bg-ink/5"
                        )}
                      >
                        <span className="text-sm truncate">{cmd.label}</span>
                        <span className="flex items-center gap-2 shrink-0">
                          {cmd.hint && (
                            <span className="font-mono text-[11px] text-ink-soft/50 truncate max-w-[9rem]">
                              {cmd.hint}
                            </span>
                          )}
                          <ArrowRight
                            className={cn(
                              "w-3.5 h-3.5 transition-opacity",
                              isActive ? "opacity-70" : "opacity-0"
                            )}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
