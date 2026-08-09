"use client";

import { motion } from "framer-motion";
import Spine from "./Spine";
import Button from "./ui/button";
import { useFilter } from "./FilterContext";

export default function Hero() {
  const { openContact } = useFilter();
  return (
    <section
      id="top"
      className="relative pt-36 pb-24 px-6 max-w-5xl mx-auto overflow-hidden"
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-mono text-xs tracking-[0.2em] uppercase text-pine mb-6"
      >
        Usamah Abdul Aziz — Informatics Engineering, UNTIRTA
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-display text-[2.5rem] sm:text-6xl leading-[1.08] max-w-3xl text-ink"
      >
        Aligning business ideas with code that{" "}
        <em className="italic text-pine">actually works.</em>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-6 max-w-xl text-ink-soft text-lg leading-relaxed"
      >
        I&apos;m Aziz — I&apos;ve been a developer, project manager, and business
        analyst on the same project. Currently looking for a software
        engineer role, while staying open to freelance work.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-9 flex flex-wrap items-center gap-4"
      >
        <Button
          type="button"
          variant="default"
          onClick={() => {
            document
              .getElementById("projects")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          View Projects
        </Button>
        <button
          type="button"
          onClick={openContact}
          className="inline-flex items-center justify-center rounded-full border border-ink/20 h-11 px-6 text-sm font-medium hover:border-pine hover:text-pine transition-colors"
        >
          Contact Me
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="mt-16 -mx-6 sm:mx-0 lg:hidden"
      >
        <Spine className="w-full h-auto opacity-90" />
      </motion.div>
    </section>
  );
}
