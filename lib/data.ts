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

export const records: Protest[] = data.records;

export const categories: string[] = Array.from(
  new Set(records.map((r) => r.cat)),
).sort();

export interface MonthGroup {
  month: string;
  records: Protest[];
}

// month strings are always "MMM YYYY"; build chronological order from data itself,
// keyed by first appearance since records already arrive sorted by n / date.
function monthSortKey(month: string): number {
  const [mon, year] = month.split(" ");
  const idx = [
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
  ].indexOf(mon);
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
