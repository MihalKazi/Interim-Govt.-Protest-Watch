"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Protest } from "@/lib/data";
import { colorFor, shortLabel } from "@/lib/categories";

export type ViewMode = "grid" | "list";

export default function RecordRow({
  r,
  view,
  index = 0,
}: {
  r: Protest;
  view: ViewMode;
  index?: number;
}) {
  const venue =
    r.venue === "Dhaka (venue not specified)" ? null : r.venue;
  const cat = colorFor(r.cat);
  const delay = Math.min((index % 3) * 0.06, 0.18);

  if (view === "list") {
    return (
      <motion.li
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: Math.min(index * 0.03, 0.24), ease: "easeOut" }}
        className="my-2"
      >
        <Link
          href={`/record/${r.n}`}
          className="group relative flex items-stretch gap-4 sm:gap-5 rounded-lg border border-rule bg-paper pl-4 pr-4 sm:pr-6 py-3 overflow-hidden shadow-[0_1px_2px_rgba(28,26,22,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_10px_24px_rgba(28,26,22,0.10)]"
        >
          <span
            className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-200 group-hover:w-1.5"
            style={{ backgroundColor: cat }}
          />

          <span className="w-16 sm:w-20 shrink-0 font-sans text-[11px] sm:text-xs text-ink-muted tabular-nums pt-0.5">
            {r.date}
          </span>

          <span className="flex-1 min-w-0">
            <span className="block font-serif text-base sm:text-lg leading-snug group-hover:text-accent transition-colors">
              {r.event}
            </span>
            <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs">
              <span
                className="inline-flex items-center gap-1.5 font-medium"
                style={{ color: cat }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: cat }}
                />
                {shortLabel(r.cat)}
              </span>
              <span className="text-ink-muted">
                {venue ?? <span className="italic">Venue not recorded</span>}
              </span>
              {r.verified ? (
                <span className="text-ink-muted">{r.source || r.domain}</span>
              ) : r.source ? (
                <span className="text-amber font-medium">
                  {r.source} · unverified
                </span>
              ) : (
                <span className="text-amber font-medium">unverified</span>
              )}
            </span>
          </span>
        </Link>
      </motion.li>
    );
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
    >
      <Link
        href={`/record/${r.n}`}
        className="group relative flex flex-col h-full rounded-lg border border-rule bg-paper overflow-hidden shadow-[0_1px_2px_rgba(28,26,22,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_14px_28px_rgba(28,26,22,0.12)]"
      >
        <span
          className="block h-1 w-full transition-all duration-200"
          style={{ backgroundColor: cat }}
        />

        <span className="flex flex-col flex-1 px-4 pt-3.5 pb-4">
          <span className="flex items-center justify-between mb-2.5">
            <span
              className="inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: cat }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: cat }}
              />
              {shortLabel(r.cat)}
            </span>
            <span className="font-sans text-[11px] text-ink-muted tabular-nums">
              {r.date}
            </span>
          </span>

          <span className="block font-serif text-lg leading-snug group-hover:text-accent transition-colors mb-3">
            {r.event}
          </span>

          <span className="mt-auto flex flex-col gap-1 font-sans text-xs pt-2 border-t border-rule/70">
            <span className="text-ink-muted truncate">
              {venue ?? <span className="italic">Venue not recorded</span>}
            </span>
            {r.verified ? (
              <span className="text-ink-muted truncate">
                {r.source || r.domain}
              </span>
            ) : r.source ? (
              <span className="text-amber font-medium truncate">
                {r.source} · unverified
              </span>
            ) : (
              <span className="text-amber font-medium">unverified</span>
            )}
          </span>
        </span>
      </Link>
    </motion.li>
  );
}
