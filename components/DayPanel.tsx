"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Protest } from "@/lib/data";
import { colorFor, shortLabel } from "@/lib/categories";
import RecordDetail from "./RecordDetail";
import TornEdge from "./TornEdge";

export default function DayPanel({
  month,
  day,
  records,
  tearOrigin,
  tearKey,
  onPanelMeasure,
}: {
  month: string;
  day: number | null;
  records: Protest[];
  tearOrigin: DOMRect | null;
  tearKey: number;
  onPanelMeasure?: (rect: DOMRect) => void;
}) {
  const [openRecord, setOpenRecord] = useState<Protest | null>(null);
  const [recordOrigin, setRecordOrigin] = useState<DOMRect | null>(null);
  const [recordTarget, setRecordTarget] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [isRecordRevealed, setIsRecordRevealed] = useState(false);
  const [isRevealed, setIsRevealed] = useState(true);
  const panelRef = useRef<HTMLElement | null>(null);
  const [panelRect, setPanelRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    setOpenRecord(null);
    setRecordOrigin(null);
    setRecordTarget(null);
    setIsRecordRevealed(false);
  }, [day]);

  useEffect(() => {
    if (!openRecord) return;

    setIsRecordRevealed(false);
    const reveal = window.setTimeout(() => setIsRecordRevealed(true), 620);
    return () => window.clearTimeout(reveal);
  }, [openRecord]);

  useEffect(() => {
    if (day === null) {
      setIsRevealed(true);
      return;
    }

    setIsRevealed(false);
    const reveal = window.setTimeout(() => setIsRevealed(true), 1220);
    return () => window.clearTimeout(reveal);
  }, [day, tearKey]);

  useLayoutEffect(() => {
    if (!panelRef.current) return;

    const measure = () => {
      const rect = panelRef.current?.getBoundingClientRect() ?? null;
      setPanelRect(rect);
      if (rect) onPanelMeasure?.(rect);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const hasUndated = records.some((r) => !/^\d{1,2} /.test(r.date));
  const tearStart =
    tearOrigin && panelRect
      ? {
          x: tearOrigin.right - panelRect.left - 10,
          y: tearOrigin.top + tearOrigin.height / 2 - panelRect.top - panelRect.height / 2,
        }
      : { x: -90, y: 0 };

  return (
    <aside
      ref={panelRef}
      className={`${
        day === null ? "hidden sm:block" : "block"
      } w-full sm:w-88 shrink-0 h-[42vh] sm:h-full overflow-y-auto overflow-x-hidden shadow-[0_-14px_28px_rgba(28,26,22,0.05)] sm:shadow-[-14px_0_28px_rgba(28,26,22,0.04)] transition-colors duration-200 ${
        day === null || isRevealed
          ? "border-t sm:border-t-0 sm:border-l border-rule bg-paper"
          : "border-t sm:border-t-0 sm:border-l border-transparent bg-transparent"
      }`}
    >
      {day === null ? (
        <div className="flex flex-col items-center justify-center h-full px-8 text-center">
          <div className="mb-3 h-12 w-9 rotate-[-4deg] border border-rule bg-paper shadow-[6px_6px_0_rgba(47,74,60,0.06)]" />
          <p className="font-serif text-lg text-ink-muted mb-1.5">
            Select a day
          </p>
          <p className="font-sans text-sm text-ink-muted/70">
            Click any day with records to see what happened.
          </p>
        </div>
      ) : isRevealed ? (
        <motion.div
          key={`tear-${day}-${tearKey}`}
          className="flex h-full min-h-full"
          initial={{
            x: tearStart.x,
            y: tearStart.y,
            rotate: -6,
            scaleX: 0.18,
            scaleY: 0.24,
            opacity: 0,
          }}
          animate={{
            x: 0,
            y: 0,
            rotate: [-6, 3, -1, 0],
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
          }}
          transition={{
            delay: 0,
            x: { type: "spring", stiffness: 180, damping: 26 },
            y: { type: "spring", stiffness: 180, damping: 28 },
            scaleX: { duration: 0.42, ease: "easeOut" },
            scaleY: { duration: 0.42, ease: "easeOut" },
            rotate: { duration: 0.58, times: [0, 0.55, 0.8, 1], ease: "easeOut" },
            opacity: { duration: 0.22 },
          }}
          style={{ transformOrigin: "left center" }}
        >
          <TornEdge orientation="left" />
          <div className="flex-1 min-w-0">
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18 }}
            >
              <div className="sticky top-0 bg-paper/95 backdrop-blur-md border-b border-rule px-5 py-4 z-10 shadow-[0_8px_18px_rgba(28,26,22,0.04)]">
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-amber">
                  Day dossier
                </p>
                <h3 className="font-serif text-2xl leading-tight">
                  {month.split(" ")[0]} {day}, {month.split(" ")[1]}
                </h3>
                <p className="font-sans text-xs text-ink-muted mt-0.5">
                  {records.length} record{records.length === 1 ? "" : "s"}
                  {hasUndated && day === 1
                    ? " - some undated, pinned to month start"
                    : ""}
                </p>
              </div>

              <ul className="px-3 py-3">
                {records.map((r) => {
                  const c = colorFor(r.cat);
                  const venue =
                    r.venue === "Dhaka (venue not specified)" ? null : r.venue;
                  return (
                    <li key={r.n} className="my-1.5">
                      <button
                        onClick={(event) => {
                          const origin = event.currentTarget.getBoundingClientRect();
                          const width = Math.min(window.innerWidth - 32, 768);
                          const height = Math.min(window.innerHeight * 0.86, 620);
                          setRecordOrigin(origin);
                          setRecordTarget({
                            left: (window.innerWidth - width) / 2,
                            top: (window.innerHeight - height) / 2,
                            width,
                            height,
                          });
                          setOpenRecord(r);
                        }}
                        className="group relative flex flex-col w-full text-left rounded-md border border-rule bg-[color-mix(in_srgb,var(--paper)_78%,white)] pl-4 pr-3 py-3 overflow-hidden shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_4px_14px_rgba(28,26,22,0.05)] transition-all duration-150 hover:border-ink/25 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(28,26,22,0.09)]"
                      >
                        <span
                          className="absolute left-0 top-0 bottom-0 w-1"
                          style={{ backgroundColor: c }}
                        />
                        <span className="font-serif text-base leading-snug group-hover:text-accent transition-colors">
                          {r.event}
                        </span>
                        <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-xs">
                          <span
                            className="inline-flex items-center gap-1 font-medium"
                            style={{ color: c }}
                          >
                            <span
                              className="inline-block w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: c }}
                            />
                            {shortLabel(r.cat)}
                          </span>
                          <span className="text-ink-muted truncate">
                            {venue ?? <span className="italic">Venue not recorded</span>}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <div className="h-full" aria-hidden="true" />
      )}

      <AnimatePresence>
        {openRecord && recordOrigin && recordTarget && !isRecordRevealed && (
          <motion.div
            key={`record-flight-${openRecord.n}`}
            aria-hidden="true"
            className="fixed z-50 pointer-events-none rounded-md border border-rule bg-paper shadow-[0_18px_48px_rgba(28,26,22,0.24)]"
            initial={{
              left: recordOrigin.left,
              top: recordOrigin.top,
              width: recordOrigin.width,
              height: recordOrigin.height,
              opacity: 0.95,
              rotate: -1,
              scale: 1,
            }}
            animate={{
              left: recordTarget.left + (recordTarget.width - recordOrigin.width) / 2,
              top: recordTarget.top + 24,
              width: recordOrigin.width,
              height: recordOrigin.height,
              opacity: [0.95, 1, 0],
              rotate: [-1, 1.5, 0],
              scale: [1, 1.03, 0.98],
            }}
            exit={{ opacity: 0 }}
            transition={{
              left: { duration: 0.62, ease: "easeInOut" },
              top: { duration: 0.62, ease: "easeInOut" },
              width: { duration: 0.62, ease: "easeInOut" },
              height: { duration: 0.62, ease: "easeInOut" },
              opacity: { duration: 0.66, times: [0, 0.82, 1] },
              rotate: { duration: 0.62, ease: "easeOut" },
              scale: { duration: 0.62, ease: "easeOut" },
            }}
          >
            <div className="absolute inset-x-0 top-0 h-9 border-b border-rule bg-[color-mix(in_srgb,var(--paper)_82%,white)]" />
            <div className="absolute left-5 right-8 top-16 h-1.5 rounded-full bg-accent/14" />
            <div className="absolute left-5 right-5 top-24 h-px bg-rule/70" />
            <div className="absolute left-5 right-12 top-32 h-px bg-rule/55" />
          </motion.div>
        )}

        {openRecord && isRecordRevealed && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/24 px-4 py-6 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ perspective: 1200 }}
            onClick={() => setOpenRecord(null)}
          >
            <motion.article
              className="relative max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-md border border-rule bg-paper shadow-[0_24px_70px_rgba(28,26,22,0.28)]"
              initial={{
                opacity: 0,
                y: -16,
                rotateX: -74,
                rotate: -0.8,
                scaleY: 0.18,
                scaleX: 0.92,
              }}
              animate={{
                opacity: 1,
                y: 0,
                rotateX: 0,
                rotate: 0,
                scaleY: 1,
                scaleX: 1,
              }}
              exit={{
                opacity: 0,
                y: 10,
                rotateX: -24,
                scaleY: 0.88,
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
                mass: 0.9,
              }}
              style={{
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(28,26,22,0.14),transparent)]"
                initial={{ opacity: 0.65 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-rule bg-paper/95 px-5 py-3 backdrop-blur-md">
                <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-amber">
                  Archive record
                </span>
                <button
                  onClick={() => setOpenRecord(null)}
                  aria-label="Close record"
                  className="grid h-8 w-8 place-items-center rounded-full border border-rule bg-paper text-ink-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="m4 4 8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="px-5 py-6 sm:px-7">
                <RecordDetail r={openRecord} />
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
