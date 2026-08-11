"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MonthCount {
  month: string;
  count: number;
}

function monthAnchor(month: string) {
  return `month-${month.replace(/\s+/g, "-")}`;
}

function shortMonth(month: string) {
  return month.split(" ")[0];
}

export default function MonthStrip({ data }: { data: MonthCount[] }) {
  const max = Math.max(...data.map((d) => d.count));
  const [hovered, setHovered] = useState<string | null>(null);

  const peakSet = useMemo(() => {
    const top = [...data].sort((a, b) => b.count - a.count).slice(0, 3);
    return new Set(top.map((d) => d.month));
  }, [data]);

  const jump = (month: string) => {
    const el = document.getElementById(monthAnchor(month));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-0 z-20 bg-paper/95 backdrop-blur-md border-b border-rule">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-end gap-1 sm:gap-1.5 h-20 pt-6 pb-1">
          {data.map((d, i) => {
            const isPeak = peakSet.has(d.month);
            const pct = Math.max((d.count / max) * 100, 3);
            return (
              <button
                key={d.month}
                onClick={() => jump(d.month)}
                onMouseEnter={() => setHovered(d.month)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(d.month)}
                onBlur={() => setHovered(null)}
                className="group relative flex-1 h-full flex flex-col justify-end focus-visible:outline-none"
                aria-label={`${d.count} records in ${d.month}, jump to month`}
              >
                <AnimatePresence>
                  {hovered === d.month && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.12 }}
                      className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full z-10 whitespace-nowrap rounded-md bg-ink text-paper text-[11px] font-sans font-medium px-2 py-1 shadow-lg pointer-events-none"
                    >
                      {d.month} · {d.count}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute inset-x-0 bottom-0 top-0 rounded-t-[3px] bg-ink/[0.035]" />

                <motion.span
                  className="relative block w-full rounded-t-[3px] origin-bottom transition-[filter] duration-150 group-hover:brightness-110"
                  style={{
                    height: `${pct}%`,
                    minHeight: 3,
                    background: isPeak
                      ? "linear-gradient(180deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 78%, black) 100%)"
                      : "linear-gradient(180deg, color-mix(in srgb, var(--accent) 55%, var(--paper)) 0%, color-mix(in srgb, var(--accent) 40%, var(--paper)) 100%)",
                    boxShadow: isPeak
                      ? "0 2px 10px color-mix(in srgb, var(--accent) 45%, transparent)"
                      : "none",
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(i * 0.012, 0.4),
                    ease: "easeOut",
                  }}
                />
              </button>
            );
          })}
        </div>
        <div className="flex gap-1 sm:gap-1.5 pb-1.5">
          {data.map((d) => (
            <span
              key={d.month}
              className={`flex-1 text-center font-sans text-[9px] uppercase tracking-wide truncate ${
                peakSet.has(d.month) ? "text-ink font-semibold" : "text-ink-muted"
              }`}
            >
              {shortMonth(d.month)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export { monthAnchor };
