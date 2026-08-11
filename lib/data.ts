import raw from "@/protests.json";

export interface Protest {
  n: number;
  date: string;
  month: string;
  event: string;
  cat: string;
  demand: string;
  source: string;
  url: string | null;
  domain: string;
  verified: boolean;
  venue: string;
  lat: number;
  lng: number;
  geo_precision: "city" | "approx-landmark" | string;
}

export interface Meta {
  title: string;
  scope: string;
  period: string;
  total: number;
  linked: number;
  unverified: number;
  note: string;
}

interface RawData {
  meta: Meta;
  records: Protest[];
}

const data = raw as unknown as RawData;

export const meta: Meta = data.meta;

const DAY_PRECISE_RE = /^\d{1,2} [A-Za-z]{3} \d{4}$/;

// pilot: verified records with an exact day only — drops unverified and
// month-only-dated records from the whole site, not just the calendar.
export const records: Protest[] = data.records.filter(
  (r) => r.verified && DAY_PRECISE_RE.test(r.date),
);

export const categories: string[] = Array.from(
  new Set(records.map((r) => r.cat)),
).sort();

export interface MonthGroup {
  month: string;
  records: Protest[];
}

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// month strings are always "MMM YYYY"; build chronological order from data itself,
// keyed by first appearance since records already arrive sorted by n / date.
function monthSortKey(month: string): number {
  const [mon, year] = month.split(" ");
  const idx = MONTH_NAMES.indexOf(mon);
  return Number(year) * 12 + idx;
}

export const months: string[] = Array.from(
  new Set(records.map((r) => r.month)),
).sort((a, b) => monthSortKey(a) - monthSortKey(b));

export function groupByMonth(list: Protest[]): MonthGroup[] {
  const map = new Map<string, Protest[]>();
  for (const r of list) {
    const arr = map.get(r.month);
    if (arr) arr.push(r);
    else map.set(r.month, [r]);
  }
  return months
    .filter((m) => map.has(m))
    .map((m) => ({ month: m, records: map.get(m)! }));
}

export const monthCounts: { month: string; count: number }[] = months.map(
  (m) => ({
    month: m,
    count: records.filter((r) => r.month === m).length,
  }),
);

export function getRecord(n: number): Protest | undefined {
  return records.find((r) => r.n === n);
}

export function recordSummary(r: Protest): string {
  const venue =
    r.venue === "Dhaka (venue not specified)" ? "an unspecified venue" : r.venue;
  const demand = r.demand.trim();
  const demandSentence = demand
    ? ` The reported demand was ${demand.charAt(0).toLowerCase()}${demand.slice(1)}`
    : "";

  return `${r.event} took place at ${venue} on ${r.date}.${demandSentence}`;
}

// exact-day match: "10 Aug 2024". Month-only records ("Aug 2024") pin to day 1.
const DAY_PRECISE = /^(\d{1,2}) ([A-Za-z]{3}) (\d{4})$/;

export function recordDay(r: Protest): { day: number; precise: boolean } {
  const m = r.date.match(DAY_PRECISE);
  if (m) return { day: Number(m[1]), precise: true };
  return { day: 1, precise: false };
}

export interface CalendarDay {
  day: number;
  weekday: number; // 0=Sun
  records: Protest[];
  undatedCount: number;
}

export function daysInMonth(month: string): number {
  const [mon, year] = month.split(" ");
  const idx = MONTH_NAMES.indexOf(mon);
  return new Date(Number(year), idx + 1, 0).getDate();
}

export function buildCalendarMonth(
  records: Protest[],
  month: string,
): CalendarDay[] {
  const [mon, year] = month.split(" ");
  const idx = MONTH_NAMES.indexOf(mon);
  const total = daysInMonth(month);
  const byDay = new Map<number, Protest[]>();
  let undatedCount = 0;
  for (const r of records) {
    if (r.month !== month) continue;
    const { day, precise } = recordDay(r);
    if (!precise) undatedCount++;
    const arr = byDay.get(day);
    if (arr) arr.push(r);
    else byDay.set(day, [r]);
  }
  const out: CalendarDay[] = [];
  for (let d = 1; d <= total; d++) {
    out.push({
      day: d,
      weekday: new Date(Number(year), idx, d).getDay(),
      records: byDay.get(d) ?? [],
      undatedCount: d === 1 ? undatedCount : 0,
    });
  }
  return out;
}

export function getAdjacent(n: number): {
  prev: Protest | undefined;
  next: Protest | undefined;
} {
  const idx = records.findIndex((r) => r.n === n);
  return {
    prev: idx > 0 ? records[idx - 1] : undefined,
    next: idx >= 0 && idx < records.length - 1 ? records[idx + 1] : undefined,
  };
}
