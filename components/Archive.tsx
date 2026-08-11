"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Protest } from "@/lib/data";
import { groupByMonth } from "@/lib/data";
import { shortLabel, colorFor } from "@/lib/categories";
import MonthStrip from "./MonthStrip";
import MonthChapter from "./MonthChapter";
import type { ViewMode } from "./RecordRow";

interface Props {
  records: Protest[];
  categories: string[];
  monthCounts: { month: string; count: number }[];
}

export default function Archive({ records, categories, monthCounts }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const initialCats = useMemo(
    () => new Set((params.get("cat") ?? "").split(",").filter(Boolean)),
    [params],
  );
  const [selectedCats, setSelectedCats] = useState<Set<string>>(initialCats);
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "grid";
    const stored = localStorage.getItem("archive-view");
    return stored === "list" || stored === "grid" ? stored : "grid";
  });

  const setViewPersist = useCallback((v: ViewMode) => {
    setView(v);
    localStorage.setItem("archive-view", v);
  }, []);

  useEffect(() => {
    const sp = new URLSearchParams();
    if (selectedCats.size) sp.set("cat", Array.from(selectedCats).join(","));
    if (query) sp.set("q", query);
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCats, query]);

  const toggleCat = useCallback((cat: string) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
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

  const groups = useMemo(() => groupByMonth(filtered), [filtered]);
  const hasFilters = selectedCats.size > 0 || query.length > 0;

  const peakMonths = useMemo(() => {
    const top = [...monthCounts].sort((a, b) => b.count - a.count).slice(0, 3);
    return new Set(top.map((m) => m.month));
  }, [monthCounts]);

  return (
    <>
      <MonthStrip data={monthCounts} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 border-b border-rule">
        <div className="flex flex-wrap items-center gap-2 mb-4">
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
                    : {
                        backgroundColor: `${c}14`,
                        borderColor: `${c}40`,
                        color: c,
                      }
                }
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                  style={{ backgroundColor: active ? "var(--paper)" : c }}
                />
                {shortLabel(cat)}
              </motion.button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, demand, venue…"
            aria-label="Search records"
            className="flex-1 min-w-56 bg-transparent border-b border-rule focus-visible:border-accent px-1 py-2 text-sm font-sans placeholder:text-ink-muted focus-visible:outline-none transition-colors"
          />

          <span className="text-sm font-sans text-ink-muted tabular-nums ml-auto">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.strong
                key={filtered.length}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="text-ink font-medium inline-block"
              >
                {filtered.length}
              </motion.strong>
            </AnimatePresence>{" "}
            of {records.length}
          </span>

          <div className="flex items-center border border-rule rounded-full p-0.5">
            <button
              onClick={() => setViewPersist("list")}
              aria-pressed={view === "list"}
              aria-label="List view"
              title="List view"
              className={`p-1.5 rounded-full transition-colors ${
                view === "list" ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 4h10M3 8h10M3 12h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewPersist("grid")}
              aria-pressed={view === "grid"}
              aria-label="Grid view"
              title="Grid view"
              className={`p-1.5 rounded-full transition-colors ${
                view === "grid" ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
                <rect x="9" y="2.5" width="4.5" height="4.5" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
                <rect x="2.5" y="9" width="4.5" height="4.5" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
                <rect x="9" y="9" width="4.5" height="4.5" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          </div>

          {hasFilters && (
            <button
              onClick={() => {
                setSelectedCats(new Set());
                setQuery("");
              }}
              className="text-sm font-sans text-accent hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {groups.length === 0 && (
          <p className="py-16 text-center text-ink-muted font-sans">
            No records match. Try clearing a filter.
          </p>
        )}

        {groups.map((g) => (
          <MonthChapter
            key={g.month}
            month={g.month}
            records={g.records}
            isPeak={peakMonths.has(g.month) && !hasFilters}
            view={view}
          />
        ))}
      </div>
    </>
  );
}
