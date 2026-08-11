# Build brief — 300 Protests: a map-free archive

Save this in the project root as `BUILD_PROMPT.md` with `protests.json` beside it, then
in Claude Code run:

> Read BUILD_PROMPT.md and protests.json. Plan the build and show me the plan and the
> file tree before writing any code. Then build Phase 1 only and stop.

This is a **new, separate site**. It has no map. Do not carry over anything from the
existing Bangladesh Protest Monitor prototype.

---

## 1. The idea

300 protests happened in Dhaka in the sixteen months after August 2024. This site's whole
job is to make that number feel like 300 real events instead of a spreadsheet row count.

Without a map, **time is the spine**. The site is a chronological archive, read top to
bottom, from August 2024 to December 2025.

The design idea: **density as the message.** 300 records, shown as 300 marks, is itself the
argument. Do not hide the volume behind pagination and a search box. Let the visitor
scroll through all of it and feel the months where protest was constant.

## 2. The data — `protests.json`

`meta` plus `records` (300 items). Fields you will use:

| Field | Notes |
|---|---|
| `n` | 1–300, the record's permanent id |
| `date` | Display string. **97 records are month-only**, e.g. `Aug 2024` |
| `month` | Always `MMM YYYY`. Use this for grouping — never parse `date` yourself |
| `event` | Short title. Always present. This is the headline of every record |
| `cat` | One of 7 categories |
| `demand` | What happened / was demanded. **Empty for 83 records** |
| `source` | Publication name. Empty for 7 records |
| `url` | Article link, or `null` |
| `domain` | For display under the link |
| `verified` | `true` = has a link (213). `false` = no link (87) |
| `venue` | Landmark name, or "Dhaka (venue not specified)" for 177 records |

Ignore `lat`, `lng`, `geo_precision`. There is no map.

**Honesty rules — these are not negotiable:**

- A record with `verified: false` has a publication name but **no article**. Render the
  name as plain muted text with an explicit "unverified" label. Never as a link, never
  styled like a citation.
- Never print a fabricated day. Show `date` exactly as given; a month-only record says
  `Aug 2024` and nothing more.
- Empty `demand` is normal, not broken. Render the title alone. No "no description
  available" placeholder — that is noise, not information.
- `venue` of "Dhaka (venue not specified)" renders as a muted "Venue not recorded", not as
  a location.
- 300 records is a count of recorded events, not a claim that exactly 300 movements
  happened. That sentence goes on the About page.

Build one `lib/data.ts` that loads, types (`Protest`), groups by month, and sorts. No
component parses a date string.

## 3. Stack

- Next.js (App Router) + TypeScript + Tailwind
- Static export. No database, no CMS, no API. The JSON is the source of truth
- No component library, no chart library unless the monthly bar chart genuinely needs one
  (it does not — it is divs)
- No map library

## 4. Structure

**`/` — The archive.** One page, the whole dataset, in order.

- **Opening.** The title, the period, and the four numbers: 300 records, 16 months,
  7 categories, 213 linked / 87 unverified. Large type. No hero image, no gradient,
  no "Explore" button.
- **The month strip.** A slim bar chart of records per month across the sixteen months,
  sticky at the top as you scroll. It doubles as navigation — click a month, jump to it.
  The peaks (Oct 2024 = 42, Nov 2024 = 38, Sep 2024 = 35) should be immediately visible.
- **The records.** Grouped under month headings, in order. Each record is a tight row:
  date, title, category mark, venue, source. Rows, not cards — this is an index, not a
  feed. The month heading is sticky while its records are on screen.
- **Filters.** Category, verified-only, and free-text search over title, demand, and
  venue. Filters live in the URL so a view can be shared. Show a live count, e.g.
  "68 of 300". Filtering should feel instant — no loading state, no page change.

**`/record/[n]`** — One record, given room. Title large, full demand text, date, venue,
category, and the source link or the unverified notice. Previous / next navigation through
the archive. Proper Open Graph tags so a shared link looks considered.

**`/about`** — Method, the 213/87 split, the month-only dates, why some records have no
description, the "not exactly 300 movements" note, and how to send a correction.

## 5. Design direction

Aim for a printed archive or a museum wall, not a web app. A visitor should feel someone
set this, not that a framework generated it.

- **Type does the work.** One serif with real character for titles, dates, and numbers —
  something with weight, not a default system serif. One quiet sans for UI and metadata.
  The scale should be wide: a month heading can be very large, a source line very small.
  That contrast is most of the design.
- **Colour: paper and ink.** A warm off-white ground, near-black text. One deep accent
  used sparingly. One amber reserved exclusively for the unverified state. The seven
  categories get muted, desaturated marks — small dots or a thin left rule, never seven
  loud pills.
- **Rules, not boxes.** Hairline horizontal rules separate records. No card shadows, no
  rounded containers, no borders on everything.
- **Space.** Generous margins, a comfortable measure for reading. Let the page breathe
  between months.
- **Motion.** Almost none. A quiet fade as rows enter, a fast filter transition. Nothing
  bouncy, nothing that delays reading.
- **Dark mode.** Ink and paper inverted, warm not blue-grey.

Things that would make this a failure: a centred hero with a gradient, three feature cards,
a "Get Started" button, emoji as icons, every record in a rounded shadowed card, a rainbow
category palette, an animated counter that ticks up to 300.

## 6. Non-negotiables

- Responsive at 375px, 768px, 1440px. On mobile the row becomes two lines, not a card.
- 300 rows must scroll smoothly. Virtualise only if it actually stutters — measure first.
- Keyboard usable throughout, visible focus rings, AA contrast.
- Never signal "unverified" with colour alone — always pair it with the word.
- External links get `rel="noopener noreferrer"` and open in a new tab.
- No fake data, no placeholder text, no lorem ipsum anywhere.

## 7. Build order — stop after each phase and show me

1. **Phase 1** — Project setup, types, `lib/data.ts`, the opening numbers, the month strip,
   and the record list with working filters and search. This proves the data layer and the
   core reading experience. No record detail page yet, no about page yet.
2. **Phase 2** — `/record/[n]` detail page with prev/next navigation and Open Graph tags.
3. **Phase 3** — `/about` page, dark mode, metadata, accessibility pass, polish.

## 8. Done means

`npm run build` passes clean, no console errors, all 300 records reachable, every filter
combination gives a sensible screen, and the unverified status is impossible to miss on
any record it applies to.
