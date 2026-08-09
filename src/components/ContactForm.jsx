"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Button from "./ui/button";

const initialForm = { name: "", email: "", message: "", company: "" };

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Couldn't send your message. Please try again.");
        return;
      }

      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
      setErrorMessage("Couldn't reach the server. Please try again, or email directly.");
    }
  };

  return (
    <div>
      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 rounded-2xl border border-pine/25 bg-pine/5 px-6 py-8 max-w-lg"
        >
          <CheckCircle2 className="w-5 h-5 text-pine shrink-0 mt-0.5" />
          <div>
            <p className="text-ink">Message sent — thanks for reaching out.</p>
            <p className="text-ink-soft text-sm mt-1">I&apos;ll get back to you as soon as I can.</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-4 font-mono text-xs tracking-wide text-pine hover:text-pine-deep underline underline-offset-4 transition-colors"
            >
              send another message
            </button>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          {/* Honeypot — hidden from real visitors, bots tend to fill every field */}
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange("company")}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="font-mono text-xs tracking-wide text-ink-soft">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange("name")}
                className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-ink placeholder:text-ink-soft/40 outline-none transition-colors focus:border-pine"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="font-mono text-xs tracking-wide text-ink-soft">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange("email")}
                className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-ink placeholder:text-ink-soft/40 outline-none transition-colors focus:border-pine"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="font-mono text-xs tracking-wide text-ink-soft">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={4}
              maxLength={5000}
              value={form.message}
              onChange={handleChange("message")}
              className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-ink placeholder:text-ink-soft/40 outline-none transition-colors focus:border-pine resize-none"
              placeholder="What's on your mind?"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-amber">{errorMessage}</p>
          )}

          <Button type="submit" variant="default" loading={status === "submitting"}>
            {status === "submitting" ? "Sending…" : "Send message"}
          </Button>
        </form>
      )}
    </div>
  );
}
