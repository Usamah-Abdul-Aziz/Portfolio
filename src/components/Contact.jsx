"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section
      id="contact"
      className="px-6 py-24 border-t border-line/60 bg-pine text-paper"
    >
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl sm:text-4xl leading-snug max-w-lg"
        >
          Open to software engineer roles and new project collaborations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
        >
          <a
            href="mailto:ikmal.usamah@gmail.com"
            className="font-mono text-sm tracking-wide underline underline-offset-4 decoration-amber hover:text-amber-soft transition-colors"
          >
            ikmal.usamah@gmail.com
          </a>
          <a
            href="tel:+6281284062693"
            className="font-mono text-sm tracking-wide underline underline-offset-4 decoration-amber hover:text-amber-soft transition-colors"
          >
            +62 812-8406-2693
          </a>
          <a
            href="https://linkedin.com/in/usamah-abdul-aziz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm tracking-wide underline underline-offset-4 decoration-amber hover:text-amber-soft transition-colors"
          >
            linkedin.com/in/usamah-abdul-aziz
          </a>
        </motion.div>

        <p className="font-mono text-xs text-paper/60 mt-16">
          Banten, Indonesia — © {new Date().getFullYear()} Usamah Abdul Aziz. All rights reserved.
        </p>
      </div>
    </section>
  );
}
