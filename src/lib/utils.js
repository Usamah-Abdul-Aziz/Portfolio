import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Loose, case-insensitive match between a skill label (e.g. "React & Next.js")
 * and a project tag (e.g. "React"). Deliberately simple — no hand-maintained
 * mapping table to keep in sync as skills/projects change.
 */
export function skillMatchesTag(skillLabel, tag) {
  const s = skillLabel.toLowerCase();
  const t = tag.toLowerCase();
  return s.includes(t) || t.includes(s);
}

export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
