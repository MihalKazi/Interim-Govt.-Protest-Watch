"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Protest } from "@/lib/data";
import { buildCalendarMonth } from "@/lib/data";
import { shortLabel, colorFor } from "@/lib/categories";
import CalendarGrid from "./CalendarGrid";
import DayPanel from "./DayPanel";

interface Props {
  records: Protest[];
  categories: string[];
  months: string[];
  monthCounts: { month: string; count: number }[];
}

const FILTER_LABELS: Record<string, string> = {
  "Education & Students": "Education",
  "Job Seekers": "Jobs",
  Other: "Other",
  "Professional & Institutional": "Professional",
  "Social & Political": "Social",
  "Transport & Communication": "Transport",
};

export default function CalendarApp({
  records,
  categories,
  months,
  monthCounts,
}: Props) {
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [monthIndex, setMonthIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [tearOrigin, setTearOrigin] = useState<DOMRect | null>(null);
  const [panelRect, setPanelRect] = useState<DOMRect | null>(null);
  const [tearKey, setTearKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const month = months[monthIndex];

  const toggleCat = useCallback((cat: string) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
    setSelectedDay(null);
    setTearOrigin(null);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((r) => {
      if (selectedCats.size && !selectedCats.has(r.cat)) return false;
      if (q) {
        const hay = `${r.event} ${r.demand} ${r.venue}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [records, selectedCats, query]);

  const days = useMemo(
    () => buildCalendarMonth(filtered, month),
    [filtered, month],
  );

  const monthMax = useMemo(
    () => Math.max(1, ...days.map((d) => d.records.length)),
    [days],
  );

  const monthTotal = useMemo(
    () => days.reduce((sum, d) => sum + d.records.length, 0),
    [days],
  );

  const dayRecords = useMemo(
    () => (selectedDay ? days.find((d) => d.day === selectedDay)?.records ?? [] : []),
    [days, selectedDay],
  );

  const hasFilters = selectedCats.size > 0 || query.length > 0;
  const rawMonthCount = monthCounts.find((m) => m.month === month)?.count ?? 0;

  const goto = (delta: number) => {
    setMonthIndex((i) => Math.min(Math.max(i + delta, 0), months.length - 1));
    setSelectedDay(null);
    setTearOrigin(null);
  };

  return (
    <div className="flex flex-col sm:flex-row flex-1 min-h-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--paper)_72%,white),var(--paper))]">
    <div className="flex-1 min-h-0 flex flex-col px-4 sm:px-6 pb-4">
      <div className="flex items-center gap-2 mb-2 pt-3 shrink-0">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-rule/80 bg-paper/60 px-3 py-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="shrink-0 text-ink-muted"
          >
            <path
              d="m11.2 11.2 2.3 2.3M12.2 7A5.2 5.2 0 1 1 1.8 7a5.2 5.2 0 0 1 10.4 0Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedDay(null);
            setTearOrigin(null);
          }}
          placeholder="Search records..."
          aria-label="Search records"
          className="min-w-0 flex-1 bg-transparent text-sm font-sans placeholder:text-ink-muted focus-visible:outline-none"
        />
        </div>
        <button
          onClick={() => setShowFilters((show) => !show)}
          aria-expanded={showFilters}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-sans font-medium transition-colors ${
            showFilters || selectedCats.size
              ? "border-accent bg-accent text-paper"
              : "border-rule bg-paper/70 text-ink-muted hover:border-accent hover:text-accent"
          }`}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2 4h12M4.5 8h7M6.5 12h3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Filters
          {selectedCats.size > 0 && (
            <span className="rounded-full bg-paper/20 px-1.5 text-[10px]">
              {selectedCats.size}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {(showFilters || selectedCats.size > 0) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="mb-2 -mx-4 sm:-mx-6 overflow-hidden px-4 sm:px-6 shrink-0"
          >
      <div className="overflow-x-auto">
        <div className="flex w-max min-w-full items-center gap-2 pb-1">
          <motion.button
            onClick={() => {
              setSelectedCats(new Set());
              setSelectedDay(null);
              setTearOrigin(null);
            }}
            aria-pressed={selectedCats.size === 0}
            whileTap={{ scale: 0.94 }}
            className={`text-xs font-sans px-3 py-1.5 border rounded-full font-medium transition-colors ${
              selectedCats.size === 0
                ? "border-accent bg-accent text-paper"
                : "border-rule bg-paper/70 text-ink-muted hover:border-accent hover:text-accent"
            }`}
          >
            All
          </motion.button>
        {categories.map((cat) => {
          const active = selectedCats.has(cat);
          const c = colorFor(cat);
          return (
            <motion.button
              key={cat}
              onClick={() => toggleCat(cat)}
              aria-pressed={active}
              whileTap={{ scale: 0.92 }}
              animate={{ scale: active ? 1.05 : 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="text-xs font-sans px-3 py-1.5 border rounded-full font-medium transition-colors"
              style={
                active
                  ? { backgroundColor: c, borderColor: c, color: "var(--paper)" }
                  : { backgroundColor: `${c}14`, borderColor: `${c}40`, color: c }
              }
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                style={{ backgroundColor: active ? "var(--paper)" : c }}
              />
              {FILTER_LABELS[cat] ?? shortLabel(cat)}
            </motion.button>
          );
        })}
          {hasFilters && (
            <button
              onClick={() => {
                setSelectedCats(new Set());
                setQuery("");
                setSelectedDay(null);
                setTearOrigin(null);
              }}
              className="text-xs font-sans px-3 py-1.5 border border-rule rounded-full font-medium text-ink-muted bg-paper/70 hover:border-accent hover:text-accent transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-center justify-between mb-1 shrink-0 border-b border-rule px-1 py-1.5">
        <button
          onClick={() => goto(-1)}
          disabled={monthIndex === 0}
          aria-label="Previous month"
          className="relative z-10 p-2 rounded-full border border-rule bg-paper/70 hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={month}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 text-center px-6"
          >
            <h2 className="font-serif text-3xl sm:text-4xl font-medium leading-none">{month}</h2>
            <p className="font-sans text-xs text-ink-muted mt-0.5">
              {hasFilters
                ? `${monthTotal} of ${rawMonthCount} record${rawMonthCount === 1 ? "" : "s"} shown`
                : `${rawMonthCount} record${rawMonthCount === 1 ? "" : "s"}`}
            </p>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => goto(1)}
          disabled={monthIndex === months.length - 1}
          aria-label="Next month"
          className="relative z-10 p-2 rounded-full border border-rule bg-paper/70 hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-1 mb-2 shrink-0">
        {months.map((m, i) => (
          <button
            key={m}
            onClick={() => {
              setMonthIndex(i);
              setSelectedDay(null);
              setTearOrigin(null);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              i === monthIndex ? "bg-accent w-5" : "bg-rule hover:bg-ink-muted"
            }`}
            aria-label={`Jump to ${m}`}
            title={m}
          />
        ))}
      </div>

      {monthTotal === 0 ? (
        <p className="flex-1 flex items-center justify-center text-ink-muted font-sans">
          No records match in {month}. Try clearing a filter or another month.
        </p>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={month}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-h-0"
          >
            <CalendarGrid
              month={month}
              days={days}
              max={monthMax}
              selectedDay={selectedDay}
              onSelectDay={(day, origin) => {
                setSelectedDay(day);
                setTearOrigin(origin);
                setTearKey((key) => key + 1);
              }}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>

    <DayPanel
      month={month}
      day={selectedDay}
      records={dayRecords}
      tearOrigin={tearOrigin}
      tearKey={tearKey}
      onPanelMeasure={setPanelRect}
    />
    <AnimatePresence>
      {selectedDay !== null && tearOrigin && panelRect && (
        <>
          <motion.div
            key={`rip-shadow-${tearKey}`}
            aria-hidden="true"
            className="fixed z-40 pointer-events-none bg-ink/20 blur-[1px]"
            initial={{
              left: tearOrigin.right - 3,
              top: tearOrigin.top + tearOrigin.height / 2,
              width: 10,
              height: 0,
              opacity: 0,
            }}
            animate={{
              top: tearOrigin.top - 2,
              height: tearOrigin.height + 4,
              opacity: [0, 0.65, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{
              clipPath:
                "polygon(0% 0%, 100% 6%, 35% 13%, 90% 22%, 28% 31%, 100% 42%, 34% 51%, 88% 62%, 25% 72%, 96% 83%, 30% 92%, 100% 100%, 0% 100%)",
            }}
          />

          <motion.div
            key={`flying-page-${tearKey}`}
            aria-hidden="true"
            className="fixed z-50 pointer-events-none bg-paper border border-rule shadow-[0_18px_45px_rgba(28,26,22,0.28)]"
            initial={{
              left: tearOrigin.left,
              top: tearOrigin.top,
              width: tearOrigin.width,
              height: tearOrigin.height,
              opacity: 0,
              rotate: 0,
              rotateY: -62,
              skewY: 0,
              borderRadius: 8,
            }}
            animate={{
              left: [
                tearOrigin.left,
                tearOrigin.left + 14,
                panelRect.left + panelRect.width * 0.44,
                panelRect.left,
              ],
              top: [
                tearOrigin.top,
                tearOrigin.top - 8,
                tearOrigin.top + tearOrigin.height * 0.15,
                panelRect.top,
              ],
              width: [
                tearOrigin.width,
                tearOrigin.width * 1.18,
                tearOrigin.width * 1.18,
                panelRect.width,
              ],
              height: [
                tearOrigin.height,
                tearOrigin.height * 1.08,
                tearOrigin.height * 1.08,
                panelRect.height,
              ],
              opacity: [0, 1, 1, 0],
              rotate: [0, -7, 5, 2, 0],
              rotateY: [-62, -28, -10, 0],
              skewY: [0, -4, 2, 0, 0],
              borderRadius: [8, 7, 7, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              delay: 0.12,
              left: { duration: 1.05, times: [0, 0.18, 0.68, 1], ease: "easeInOut" },
              top: { duration: 1.05, times: [0, 0.18, 0.68, 1], ease: "easeInOut" },
              width: { duration: 1.05, times: [0, 0.18, 0.68, 1], ease: "easeInOut" },
              height: { duration: 1.05, times: [0, 0.18, 0.68, 1], ease: "easeInOut" },
              opacity: { duration: 1.16, times: [0, 0.1, 0.88, 1] },
              rotate: { duration: 1.05, ease: "easeOut" },
              rotateY: { duration: 0.82, times: [0, 0.32, 0.7, 1], ease: "easeOut" },
              skewY: { duration: 0.44, ease: "easeOut" },
              borderRadius: { duration: 0.62, ease: "easeOut" },
            }}
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              perspective: 900,
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 92%, 5% 86%, 0% 80%, 6% 73%, 0% 66%, 5% 59%, 0% 52%, 7% 45%, 0% 38%, 5% 31%, 0% 24%, 6% 17%, 0% 10%)",
            }}
          >
            <motion.div
              className="absolute inset-y-0 right-0 w-10 bg-[linear-gradient(90deg,transparent,rgba(28,26,22,0.18))]"
              initial={{ opacity: 0.8, x: -8 }}
              animate={{ opacity: [0.8, 0.45, 0], x: [0, 8, 16] }}
              transition={{ delay: 0.12, duration: 1.05, ease: "easeOut" }}
            />
            <motion.div
              className="absolute right-0 top-0 h-12 w-12 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(207,193,170,0.28)_55%,rgba(28,26,22,0.12))] shadow-[-4px_5px_12px_rgba(28,26,22,0.16)]"
              initial={{ opacity: 0, scale: 0.2, rotate: 0 }}
              animate={{ opacity: [0, 1, 0.2], scale: [0.2, 1, 1.4], rotate: [0, -10, -22] }}
              transition={{ delay: 0.12, duration: 0.75, ease: "easeOut" }}
              style={{ clipPath: "polygon(100% 0%, 100% 100%, 0% 0%)" }}
            />
            <div className="absolute inset-y-0 left-0 w-5 bg-ink/7" />
            <div className="absolute inset-3 border border-rule/60" />
            <div className="absolute left-4 top-4 h-3 w-10 rounded-full bg-accent/20" />
            <div className="absolute left-4 right-4 top-12 h-px bg-rule/80" />
            <div className="absolute left-4 right-8 top-[4.5rem] h-px bg-rule/60" />
            <div className="absolute left-4 right-14 top-24 h-px bg-rule/50" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </div>
  );
}
