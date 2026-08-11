"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { CalendarDay } from "@/lib/data";
import { colorFor } from "@/lib/categories";
import { DATE_CARD_PHOTOS } from "@/lib/protestPhotos";

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
      <div className="grid grid-cols-7 shrink-0 mb-2 border-y border-rule bg-[color-mix(in_srgb,var(--paper)_76%,white)] shadow-[0_1px_0_rgba(255,255,255,0.7)_inset]">
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
          <div
            key={`blank-${i}`}
            aria-hidden="true"
            className="rounded-md border border-dashed border-[color-mix(in_srgb,var(--ink-muted)_68%,var(--rule))] bg-[color-mix(in_srgb,var(--paper)_54%,white)] opacity-60 shadow-[0_1px_0_rgba(255,255,255,0.55)_inset]"
          />
        ))}

        {days.map((d) => {
          const count = d.records.length;
          const hasRecords = count > 0;
          const dateKey = `${d.day} ${month}`;
          const photo = DATE_CARD_PHOTOS[dateKey];
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
              } group relative rounded-md border flex flex-col items-stretch justify-between p-1.5 transition-all duration-200 overflow-hidden shadow-[0_1px_0_rgba(255,255,255,0.55)_inset,0_0_0_1px_rgba(28,26,22,0.04),0_3px_9px_rgba(28,26,22,0.05)] ${
                hasRecords
                  ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,255,255,0.55)_inset,0_8px_16px_rgba(28,26,22,0.1)]"
                  : "cursor-default opacity-82"
              } ${
                isSelected
                  ? "border-accent shadow-[0_1px_0_rgba(255,255,255,0.65)_inset,0_12px_28px_rgba(37,75,61,0.3)] ring-1 ring-accent/45"
                  : hasRecords
                    ? "border-[color-mix(in_srgb,var(--accent)_72%,var(--ink))]"
                    : "border-[color-mix(in_srgb,var(--ink-muted)_72%,var(--rule))]"
              }`}
              style={{
                backgroundColor: hasRecords
                  ? `color-mix(in srgb, var(--accent) ${8 + intensity * 22}%, #fbf7ef)`
                  : `color-mix(in srgb, var(--paper) 44%, white)`,
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

              {hasRecords && photo && (
                <>
                  <Image
                    src={photo.src}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 640px) 14vw, 10vw"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-68 saturate-[0.9] sepia-[0.06] transition duration-200 group-hover:opacity-78"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,241,232,0.08),rgba(247,241,232,0.36)_58%,rgba(247,241,232,0.62))]"
                  />
                  <span className="sr-only">{photo.alt}</span>
                </>
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
                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-sm border font-sans shadow-[1px_1px_0_rgba(28,26,22,0.08)] ${
                  hasRecords
                    ? "border-[color-mix(in_srgb,var(--accent)_70%,var(--ink))] bg-[color-mix(in_srgb,var(--paper)_88%,white)] text-accent"
                    : "border-[color-mix(in_srgb,var(--ink-muted)_54%,var(--rule))] bg-[color-mix(in_srgb,var(--paper)_72%,white)] text-[color-mix(in_srgb,var(--ink)_58%,var(--ink-muted))]"
                }`}
              >
                <span className="font-serif text-base leading-none tabular-nums">
                  {d.day}
                </span>
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
