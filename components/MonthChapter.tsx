"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import type { Protest } from "@/lib/data";
import RecordRow, { type ViewMode } from "./RecordRow";
import { monthAnchor } from "./MonthStrip";

const INITIAL_VISIBLE_GRID = 6;
const INITIAL_VISIBLE_LIST = 10;

export default function MonthChapter({
  month,
  records,
  isPeak,
  view,
}: {
  month: string;
  records: Protest[];
  isPeak: boolean;
  view: ViewMode;
}) {
  const [expanded, setExpanded] = useState(false);
  const initialVisible = view === "grid" ? INITIAL_VISIBLE_GRID : INITIAL_VISIBLE_LIST;
  const visible = expanded ? records : records.slice(0, initialVisible);
  const remaining = records.length - visible.length;

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 84px", "end 84px"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
  });

  return (
    <section
      ref={sectionRef}
      id={monthAnchor(month)}
      className="scroll-mt-24 mt-2"
    >
      <h2 className="sticky top-21 z-10 bg-paper/95 backdrop-blur-md pt-4 pb-3 border-b-2 border-ink/80 relative">
        <span className="font-serif text-3xl sm:text-4xl font-medium">
          {month}
        </span>
        <span className="ml-3 font-sans text-sm text-ink-muted align-middle">
          {isPeak
            ? `${records.length} records — the month's peak`
            : `${records.length} record${records.length === 1 ? "" : "s"}`}
        </span>
        <motion.span
          className="absolute left-0 -bottom-0.5 h-0.5 bg-accent origin-left"
          style={{ scaleX: progress, width: "100%" }}
        />
      </h2>

      <ul
        className={
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4"
            : "py-1"
        }
      >
        <AnimatePresence initial={false}>
          {visible.map((r, i) => (
            <RecordRow key={r.n} r={r} view={view} index={i} />
          ))}
        </AnimatePresence>
      </ul>

      {remaining > 0 && (
        <div className="flex justify-center pb-6">
          <button
            onClick={() => setExpanded(true)}
            className="font-sans text-sm text-accent border border-rule hover:border-accent px-4 py-2 rounded-full transition-colors"
          >
            + {remaining} more in {month}
          </button>
        </div>
      )}
    </section>
  );
}
