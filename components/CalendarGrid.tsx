"use client";

import { motion } from "framer-motion";
import type { CalendarDay } from "@/lib/data";
import { colorFor } from "@/lib/categories";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarGrid({
  month,
  days,
  max,
  selectedDay,
  onSelectDay,
}: {
  month: string;
  days: CalendarDay[];
  max: number;
  selectedDay: number | null;
  onSelectDay: (day: number, origin: DOMRect) => void;
}) {
  const leadBlanks = days.length ? days[0].weekday : 0;

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full">
      <div className="grid grid-cols-7 shrink-0 mb-2 border-b border-rule/70 bg-paper/40">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="text-center font-sans text-[10px] uppercase tracking-[0.08em] text-ink-muted py-1.5"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 flex-1 min-h-0 auto-rows-fr">
        {Array.from({ length: leadBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {days.map((d) => {
          const count = d.records.length;
          const hasRecords = count > 0;
          const intensity = max > 0 ? Math.min(count / max, 1) : 0;
          const isSelected = selectedDay === d.day;
          const cats = Array.from(new Set(d.records.map((r) => r.cat))).slice(
            0,
            4,
          );

          return (
            <motion.button
              key={d.day}
              onClick={(event) =>
                hasRecords &&
                onSelectDay(d.day, event.currentTarget.getBoundingClientRect())
              }
              disabled={!hasRecords}
              whileTap={hasRecords ? { scale: 0.94 } : undefined}
              aria-label={
                hasRecords
                  ? `${count} record${count === 1 ? "" : "s"} on ${month.split(" ")[0]} ${d.day}`
                  : `No records on ${month.split(" ")[0]} ${d.day}`
              }
              className={`archive-day ${
                hasRecords ? "" : "archive-day-empty"
              } group relative rounded-md border flex flex-col items-stretch justify-between p-2 transition-all duration-200 overflow-hidden shadow-[0_1px_0_rgba(255,255,255,0.45)_inset,0_3px_9px_rgba(28,26,22,0.04)] ${
                hasRecords
                  ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,255,255,0.55)_inset,0_8px_16px_rgba(28,26,22,0.1)]"
                  : "cursor-default opacity-70"
              } ${
                isSelected
                  ? "border-accent shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_12px_28px_rgba(37,75,61,0.3)] ring-1 ring-accent/35"
                  : hasRecords
                    ? "border-accent/24"
                    : "border-rule/65"
              }`}
              style={{
                backgroundColor: hasRecords
                  ? `color-mix(in srgb, var(--accent) ${8 + intensity * 22}%, #fbf7ef)`
                  : `color-mix(in srgb, var(--paper) 42%, white)`,
              }}
            >
              {hasRecords && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 bottom-0 w-1 opacity-80"
                  style={{
                    background: `linear-gradient(${cats
                      .map((c, i) => `${colorFor(c)} ${i * 25}% ${(i + 1) * 25}%`)
                      .join(", ")})`,
                  }}
                />
              )}

              {isSelected && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-y-0 right-0 w-5 bg-paper shadow-[-4px_0_12px_rgba(28,26,22,0.22)] z-10"
                  initial={{ opacity: 0, x: 7, scaleY: 0.7 }}
                  animate={{ opacity: 1, x: 0, scaleY: 1 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  style={{
                    clipPath:
                      "polygon(100% 0%, 100% 100%, 42% 100%, 78% 91%, 34% 82%, 75% 73%, 40% 64%, 82% 55%, 35% 46%, 72% 37%, 42% 28%, 80% 19%, 37% 10%, 72% 0%)",
                  }}
                />
              )}

              <span
                className={`relative z-10 self-start font-serif text-lg sm:text-xl leading-none tabular-nums ${
                  hasRecords ? "font-semibold text-ink" : "text-ink-muted/60"
                }`}
              >
                {d.day}
              </span>

              {hasRecords && (
                <span className="relative z-10 flex items-end justify-between gap-2">
                  <span className="flex items-center gap-0.5">
                    {cats.map((c) => (
                      <span
                        key={c}
                        className="inline-block h-2 w-2 rounded-full border border-paper/80 shadow-[0_1px_2px_rgba(28,26,22,0.18)]"
                        style={{ backgroundColor: colorFor(c) }}
                      />
                    ))}
                  </span>
                  <span className="archive-day-stamp rounded-sm border border-accent/35 bg-paper/70 px-1 sm:px-1.5 py-0.5 text-[8px] font-bold text-accent shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]">
                    {count}
                    <span className="hidden sm:inline">
                      {" "}
                      file{count === 1 ? "" : "s"}
                    </span>
                  </span>
                </span>
              )}

              {d.undatedCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-amber text-paper text-[8px] font-sans font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center"
                  title={`${d.undatedCount} record${d.undatedCount === 1 ? "" : "s"} with no exact date this month, pinned here`}
                >
                  +
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
