"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ContactForm from "./ContactForm";
import { useFilter } from "./FilterContext";

export default function ContactModal() {
  const { contactOpen, closeContact } = useFilter();

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && contactOpen) closeContact();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [contactOpen, closeContact]);

  useEffect(() => {
    if (!contactOpen) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById("name")?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [contactOpen]);

  return (
    <AnimatePresence>
      {contactOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={closeContact}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Contact form"
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 320, damping: 26, mass: 0.9 },
            }}
            exit={{
              opacity: 0,
              y: 14,
              scale: 0.96,
              transition: { duration: 0.16, ease: "easeIn" },
            }}
            className="relative w-full max-w-lg bg-paper-2 text-ink border border-line/70 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={closeContact}
              aria-label="Close"
              className="absolute top-4 right-4 text-ink-soft/60 hover:text-pine transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <p className="font-mono text-xs tracking-widest uppercase text-pine mb-3">
              Contact
            </p>
            <p className="font-display text-2xl text-ink mb-1">Let&apos;s talk.</p>
            <p className="text-ink-soft text-sm mb-6">
              Fill this in and I&apos;ll get back to you as soon as I can.
            </p>

            <ContactForm />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
