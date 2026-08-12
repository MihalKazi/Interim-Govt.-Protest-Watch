import raw from "@/protests.json";
import researchedAdditions from "@/protests-additions.json";

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
const additions = researchedAdditions as unknown as Protest[];
const allRecords = [...data.records, ...additions];

export const meta: Meta = {
  ...data.meta,
  title: `${allRecords.length} Greater Dhaka protest records`,
  scope: "Greater Dhaka",
  period: "8 Aug 2024 - 17 Feb 2026",
  total: allRecords.length,
  linked: allRecords.filter((record) => Boolean(record.url)).length,
  unverified: allRecords.filter((record) => !record.verified).length,
  note:
    "Publicly reported records only. Dates and locations are source-verified; coordinates are approximate landmarks.",
};

const DAY_PRECISE_RE = /^\d{1,2} [A-Za-z]{3} \d{4}$/;

// pilot: verified records with an exact day only — drops unverified and
// month-only-dated records from the whole site, not just the calendar.
export const records: Protest[] = allRecords.filter(
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

  return `${r.event} took place at ${venue} on ${r.date}.`;
}

const FOLLOW_UP_THREADS: Record<number, string> = {
  470: "Hindu minority-rights protests",
  6: "Hindu minority-rights protests",
  21: "Hindu minority-rights protests",
  25: "Hindu minority-rights protests",

  450: "Resistance Week and anti-Hasina mobilisation",
  451: "Resistance Week and anti-Hasina mobilisation",
  471: "Resistance Week and anti-Hasina mobilisation",
  554: "Resistance Week and anti-Hasina mobilisation",
  654: "Resistance Week and anti-Hasina mobilisation",

  463: "Flood and India water-aggression protests",
  464: "Flood and India water-aggression protests",
  465: "Flood and India water-aggression protests",
  466: "Flood and India water-aggression protests",
  467: "Flood and India water-aggression protests",
  448: "Flood and India water-aggression protests",
  478: "Flood and India water-aggression protests",

  301: "Job-seeker hiring protests around industrial zones",
  305: "Job-seeker hiring protests around industrial zones",

  477: "RMG and industrial worker unrest",
  302: "RMG and industrial worker unrest",
  304: "RMG and industrial worker unrest",
  306: "RMG and industrial worker unrest",
  307: "RMG and industrial worker unrest",
  308: "RMG and industrial worker unrest",
  309: "RMG and industrial worker unrest",
  310: "RMG and industrial worker unrest",
  312: "RMG and industrial worker unrest",
  313: "RMG and industrial worker unrest",
  314: "RMG and industrial worker unrest",
  315: "RMG and industrial worker unrest",
  316: "RMG and industrial worker unrest",
  317: "RMG and industrial worker unrest",
  318: "RMG and industrial worker unrest",
  319: "RMG and industrial worker unrest",
  320: "RMG and industrial worker unrest",
  440: "RMG and industrial worker unrest",
  322: "RMG and industrial worker unrest",
  500: "RMG and industrial worker unrest",
  323: "RMG and industrial worker unrest",
  324: "RMG and industrial worker unrest",
  325: "RMG and industrial worker unrest",
  326: "RMG and industrial worker unrest",
  327: "RMG and industrial worker unrest",
  328: "RMG and industrial worker unrest",
  329: "RMG and industrial worker unrest",
  331: "RMG and industrial worker unrest",
  332: "RMG and industrial worker unrest",
  334: "RMG and industrial worker unrest",
  337: "RMG and industrial worker unrest",
  342: "RMG and industrial worker unrest",

  311: "Beximco Industrial Park wage protests",
  321: "Beximco Industrial Park wage protests",
  330: "Beximco Industrial Park wage protests",
  520: "Beximco Industrial Park wage protests",
  345: "Beximco Industrial Park wage protests",

  479: "Government-job age-limit movement",
  51: "Government-job age-limit movement",
  497: "Government-job age-limit movement",
  494: "Government-job age-limit movement",
  583: "Government-job age-limit movement",
  598: "Government-job age-limit movement",

  482: "CHT and Khagrachhari solidarity protests",
  483: "CHT and Khagrachhari solidarity protests",
  485: "CHT and Khagrachhari solidarity protests",

  486: "Prophet Muhammad remarks protest wave",
  487: "Prophet Muhammad remarks protest wave",
  488: "Prophet Muhammad remarks protest wave",
  489: "Prophet Muhammad remarks protest wave",

  492: "Seven-college separate-university movement",
  498: "Seven-college separate-university movement",
  88: "Seven-college separate-university movement",
  90: "Seven-college separate-university movement",
  514: "Seven-college separate-university movement",

  11: "HSC exam and result protests",
  78: "HSC exam and result protests",
  84: "HSC exam and result protests",

  107: "Titumir College university-status movement",
  521: "Titumir College university-status movement",
  346: "Titumir College university-status movement",
  350: "Titumir College university-status movement",

  120: "Battery-run rickshaw restrictions protests",
  121: "Battery-run rickshaw restrictions protests",
  511: "Battery-run rickshaw restrictions protests",
  513: "Battery-run rickshaw restrictions protests",
  516: "Battery-run rickshaw restrictions protests",

  517: "Saiful Islam Alif killing protests",
  518: "Saiful Islam Alif killing protests",

  522: "Agartala mission attack protests",
  523: "Agartala mission attack protests",
  524: "Agartala mission attack protests",
  535: "Agartala mission attack protests",
  536: "Agartala mission attack protests",

  526: "Postgraduate trainee doctors' allowance movement",
  333: "Postgraduate trainee doctors' allowance movement",

  529: "July proclamation and March for Unity",

  525: "Panthakunja Park tree-protection protest",
  530: "Panthakunja Park tree-protection protest",

  538: "Dismissed BDR reinstatement movement",
  336: "Dismissed BDR reinstatement movement",
  568: "Dismissed BDR reinstatement movement",
  374: "Dismissed BDR reinstatement movement",

  541: "Indigenous textbook-graffiti protests",
  542: "Indigenous textbook-graffiti protests",
  543: "Indigenous textbook-graffiti protests",
  553: "Indigenous textbook-graffiti protests",

  544: "Medical admission quota protests",
  340: "Medical admission quota protests",

  539: "Dismissed police personnel reinstatement protests",
  348: "Dismissed police personnel reinstatement protests",

  548: "Seven-college separate-university movement",

  349: "July uprising injured compensation protests",
  570: "July uprising injured compensation protests",
  560: "July uprising injured compensation protests",
  154: "July uprising injured compensation protests",
  563: "July uprising injured compensation protests",
  382: "July uprising injured compensation protests",
  186: "July uprising injured compensation protests",
  645: "July uprising injured compensation protests",
  647: "July uprising injured compensation protests",
  649: "July uprising injured compensation protests",

  149: "Primary teacher recruitment protests",
  567: "Primary teacher recruitment protests",
  557: "Primary teacher recruitment protests",
  558: "Primary teacher recruitment protests",
  634: "Primary teacher recruitment protests",

  555: "MATS student sit-in movement",
  556: "MATS student sit-in movement",

  353: "RMG and industrial worker unrest",
  355: "RMG and industrial worker unrest",
  356: "RMG and industrial worker unrest",
  357: "RMG and industrial worker unrest",
  359: "RMG and industrial worker unrest",
  360: "RMG and industrial worker unrest",
  361: "RMG and industrial worker unrest",
  363: "RMG and industrial worker unrest",
  364: "RMG and industrial worker unrest",
  365: "RMG and industrial worker unrest",
  366: "RMG and industrial worker unrest",
  439: "RMG and industrial worker unrest",
  368: "RMG and industrial worker unrest",
  369: "RMG and industrial worker unrest",
  370: "RMG and industrial worker unrest",
  371: "RMG and industrial worker unrest",
  372: "RMG and industrial worker unrest",
  373: "RMG and industrial worker unrest",
  580: "RMG and industrial worker unrest",
  378: "RMG and industrial worker unrest",
  379: "RMG and industrial worker unrest",
  591: "RMG and industrial worker unrest",
  595: "RMG and industrial worker unrest",
  599: "RMG and industrial worker unrest",
  383: "RMG and industrial worker unrest",
  386: "RMG and industrial worker unrest",
  391: "RMG and industrial worker unrest",
  392: "RMG and industrial worker unrest",
  393: "RMG and industrial worker unrest",

  354: "CNG autorickshaw road-blockade protests",

  441: "Women's safety protests",
  569: "Women's safety protests",
  566: "Women's safety protests",
  561: "Women's safety protests",
  157: "Women's safety protests",
  161: "Women's safety protests",
  162: "Women's safety protests",
  572: "Women's safety protests",
  573: "Women's safety protests",
  575: "Women's safety protests",
  576: "Women's safety protests",
  602: "Women's safety protests",

  559: "Jamaat-e-Islami protest marches",
  564: "Jamaat-e-Islami protest marches",

  565: "KUET attack campus solidarity protests",
  594: "KUET attack campus solidarity protests",
  597: "KUET attack campus solidarity protests",

  165: "Non-government primary teacher nationalisation protests",

  169: "DU Hindu student religion-remarks protest",

  577: "Awami League ban demand protests",
  579: "Awami League ban demand protests",
  177: "Awami League ban demand protests",
  179: "Awami League ban demand protests",
  181: "Awami League ban demand protests",
  183: "Awami League ban demand protests",
  380: "Awami League ban demand protests",
  381: "Awami League ban demand protests",
  442: "Awami League ban demand protests",
  655: "Awami League ban demand protests",
  656: "Awami League ban demand protests",
  657: "Awami League ban demand protests",
  658: "Awami League ban demand protests",
  659: "Awami League ban demand protests",

  245: "MPO teacher allowance and nationalisation protests",
  675: "MPO teacher allowance and nationalisation protests",
  676: "MPO teacher allowance and nationalisation protests",

  269: "Primary teacher pay-scale protests",
  274: "Primary teacher pay-scale protests",
  281: "Primary teacher pay-scale protests",

  673: "Seven-college Dhaka Central University movement",
  674: "Seven-college Dhaka Central University movement",
  689: "Seven-college Dhaka Central University movement",

  257: "July Charter and PR election-demand protests",
  678: "July Charter and PR election-demand protests",
  682: "July Charter and PR election-demand protests",

  679: "ISKCON ban demand student protests",
  680: "ISKCON ban demand student protests",

  586: "Banned Awami League flash processions",
  620: "Banned Awami League flash processions",
  665: "Banned Awami League flash processions",
  671: "Banned Awami League flash processions",
  672: "Banned Awami League flash processions",

  683: "Awami League lockdown resistance",
  686: "Awami League lockdown resistance",
  687: "Awami League lockdown resistance",
  684: "Dhanmondi 32 anti-Hasina verdict mobilisation",

  418: "Sharif Osman Hadi justice protests",
  419: "Sharif Osman Hadi justice protests",
  420: "Sharif Osman Hadi justice protests",
  421: "Sharif Osman Hadi justice protests",
  422: "Sharif Osman Hadi justice protests",
  423: "Sharif Osman Hadi justice protests",
  424: "Sharif Osman Hadi justice protests",
  690: "Sharif Osman Hadi justice protests",
  692: "Sharif Osman Hadi justice protests",
  694: "Sharif Osman Hadi justice protests",
  695: "Sharif Osman Hadi justice protests",
  699: "Sharif Osman Hadi justice protests",
  700: "Sharif Osman Hadi justice protests",
  702: "Sharif Osman Hadi justice protests",
  435: "Sharif Osman Hadi justice protests",
  704: "Sharif Osman Hadi justice protests",
  705: "Sharif Osman Hadi justice protests",
  706: "Sharif Osman Hadi justice protests",

  578: "Palestine and Gaza solidarity protests",
  581: "Palestine and Gaza solidarity protests",
  584: "Palestine and Gaza solidarity protests",
  585: "Palestine and Gaza solidarity protests",
  375: "Palestine and Gaza solidarity protests",
  588: "Palestine and Gaza solidarity protests",
  632: "Palestine and Gaza solidarity protests",
  633: "Palestine and Gaza solidarity protests",

  376: "Polytechnic student six-point movement",
  173: "Polytechnic student six-point movement",
  589: "Polytechnic student six-point movement",
  590: "Polytechnic student six-point movement",

  190: "Jagannath University allowance and campus-funding protests",
  191: "Jagannath University allowance and campus-funding protests",
  603: "Jagannath University allowance and campus-funding protests",

  601: "Ishraque Hossain DSCC mayoral oath protests",
  604: "Ishraque Hossain DSCC mayoral oath protests",
  387: "Ishraque Hossain DSCC mayoral oath protests",
  605: "Ishraque Hossain DSCC mayoral oath protests",
  606: "Ishraque Hossain DSCC mayoral oath protests",
  388: "Ishraque Hossain DSCC mayoral oath protests",
  203: "Ishraque Hossain DSCC mayoral oath protests",
  611: "Ishraque Hossain DSCC mayoral oath protests",
  207: "Ishraque Hossain DSCC mayoral oath protests",
  618: "Ishraque Hossain DSCC mayoral oath protests",
  619: "Ishraque Hossain DSCC mayoral oath protests",
  626: "Ishraque Hossain DSCC mayoral oath protests",

  608: "Secretariat staff Government Service ordinance protests",
  610: "Secretariat staff Government Service ordinance protests",
  630: "Secretariat staff Government Service ordinance protests",
  621: "Secretariat staff Government Service ordinance protests",
  622: "Secretariat staff Government Service ordinance protests",

  625: "NBR reform and strike movement",
  627: "NBR reform and strike movement",

  635: "UN human rights office opposition rallies",
  641: "UN human rights office opposition rallies",

  639: "Milestone school crash justice protests",
  640: "Milestone school crash justice protests",

  636: "Lal Chand killing justice protests",
  643: "Lal Chand killing justice protests",

  638: "Gopalganj NCP attack protest wave",
  644: "Gopalganj NCP attack protest wave",

  223: "Dhaka Central University ordinance protests",

  228: "Engineering student three-point movement",

  237: "Nur attack protest wave",
  398: "Nur attack protest wave",
};

export function followUpThread(r: Protest): string | null {
  return FOLLOW_UP_THREADS[r.n] ?? null;
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
