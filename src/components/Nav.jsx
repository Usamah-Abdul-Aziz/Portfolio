"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { useFilter } from "./FilterContext";

// Drop your CV PDF at /public/cv/usamah-abdul-aziz-cv.pdf — that maps
// directly to this path. Swap the filename here if you name it differently.
const CV_PATH = "/cv/usamah-abdul-aziz-cv.pdf";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [skipCloseAnim, setSkipCloseAnim] = useState(false);
  const { openPalette, openContact } = useFilter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu automatically if the viewport grows past the
  // breakpoint where the full nav is shown instead.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = () => setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  // Closing the mobile menu normally plays a ~0.2s height/opacity exit
  // animation. If a scrollIntoView() is kicked off in that same instant,
  // the two animations race and the scroll silently gets cancelled —
  // this is what broke section links from the mobile menu. Section
  // links close the menu *instantly* (no exit animation) instead, so
  // there's nothing to race. The Search/Contact buttons don't scroll
  // immediately (they open a modal), so they keep the normal animated
  // close.
  const scrollToSection = (href) => (e) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    // Two separate renders on purpose: AnimatePresence captures the exit
    // transition from the element's last render *before* it's removed.
    // Flipping both flags in the same batch would remove the menu using
    // the still-animated (0.22s) transition, which is exactly what races
    // the scroll and cancels it. Committing skipCloseAnim first lets the
    // menu re-render with the instant transition while still present;
    // only then does menuOpen flip to false.
    setSkipCloseAnim(true);
    requestAnimationFrame(() => setMenuOpen(false));
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "bg-paper/90 backdrop-blur border-b border-line/60"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <a
          href="#top"
          onClick={scrollToSection("#top")}
          className="font-mono text-xs tracking-widest uppercase text-ink-soft hover:text-pine transition-colors"
        >
          Usamah A.A.
        </a>
        <ul className="hidden sm:flex items-center gap-7">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={scrollToSection(l.href)}
                className="font-mono text-xs tracking-wide uppercase text-ink-soft hover:text-pine transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openPalette}
            title="Quick navigate"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft border border-ink/20 rounded-full px-3 py-1.5 hover:border-pine hover:text-pine transition-colors"
          >
            <span className="normal-case tracking-normal">Search</span>
            <kbd className="font-mono text-[10px] normal-case border border-ink/20 rounded px-1 py-0.5 leading-none">
              ⌘K
            </kbd>
          </button>
          <a
            href={CV_PATH}
            download
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft border border-ink/20 rounded-full px-3.5 py-1.5 hover:border-pine hover:text-pine transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            CV
          </a>
          <button
            type="button"
            onClick={openContact}
            className="hidden sm:inline-flex font-mono text-xs tracking-wide uppercase border border-ink/20 rounded-full px-4 py-1.5 hover:border-pine hover:text-pine transition-colors"
          >
            Contact
          </button>
          <button
            type="button"
            onClick={() => {
              setSkipCloseAnim(false);
              setMenuOpen((o) => !o);
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="sm:hidden inline-flex items-center justify-center w-9 h-9 -mr-1.5 text-ink-soft hover:text-pine transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: skipCloseAnim ? 0 : 0.22, ease: "easeOut" }}
            className="sm:hidden overflow-hidden border-t border-line/60 bg-paper"
          >
            <ul className="px-6 py-4 space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={scrollToSection(l.href)}
                    className="block py-2.5 font-mono text-sm uppercase tracking-wide text-ink-soft hover:text-pine transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 px-6 pb-5 pt-1">
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  openPalette();
                }}
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft border border-ink/20 rounded-full px-3.5 py-2 hover:border-pine hover:text-pine transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  openContact();
                }}
                className="flex-1 font-mono text-xs uppercase tracking-wide text-center border border-ink/20 rounded-full px-3.5 py-2 hover:border-pine hover:text-pine transition-colors"
              >
                Contact
              </button>
            </div>
            <div className="px-6 pb-6">
              <a
                href={CV_PATH}
                download
                onClick={closeMenu}
                className="flex items-center justify-center gap-1.5 font-mono text-xs uppercase tracking-wide text-center border border-ink/20 rounded-full px-3.5 py-2.5 hover:border-pine hover:text-pine transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download CV
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
