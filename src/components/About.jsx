"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="px-6 py-24 border-t border-line/60">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-[120px_1fr] gap-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-xs tracking-widest uppercase text-ink-soft"
        >
          About
        </motion.p>

        <div className="grid sm:grid-cols-[160px_1fr] gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative w-32 sm:w-40 aspect-[472/709] rounded-2xl overflow-hidden"
          >
            <Image
              src="/profile.jpg"
              alt="Usamah Abdul Aziz"
              fill
              sizes="160px"
              className="object-cover"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl space-y-5 text-ink-soft text-[1.05rem] leading-relaxed"
          >
            <p>
              I&apos;m a self-starter with a hard-working streak — an Informatics
              Engineering student at{" "}
              <span className="text-ink">
                Universitas Sultan Ageng Tirtayasa
              </span>
              , Banten, who&apos;s happiest being hands-on with a project from
              idea to deployment. Over the past few years I&apos;ve moved across
              roles — full-stack developer, business analyst, project
              manager — often within the same project.
            </p>
            <p>
              I pick up new topics quickly, which is how I&apos;ve ended up
              working across web development, mobile apps, machine
              learning, and data analytics. Whatever the role, I try to
              bring the same things to the table: leadership, problem
              solving, and clear communication, whether I&apos;m working solo
              or coordinating a team.
            </p>
            <p>
              Outside of building things, I tutor high school students in
              Math and Physics and help lead my faculty&apos;s student association.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
