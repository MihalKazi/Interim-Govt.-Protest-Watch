import type { Metadata } from "next";
import { records, months } from "@/lib/data";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About",
  description: "Method, verification, and limits of the Interim Protest Calendar.",
};

export default function AboutPage() {
  const linked = records.filter((record) => Boolean(record.url)).length;
  const noDemand = records.filter((record) => !record.demand).length;

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 w-full flex-1">
        <h1 className="font-serif text-4xl sm:text-5xl font-medium mb-12">
          About this archive
        </h1>

        <div className="space-y-10 font-serif text-lg leading-relaxed divide-y divide-rule [&>section]:pt-10 [&>section:first-child]:pt-0">
          <section>
            <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-accent font-medium mb-3">
              What this is
            </h2>
            <p>
              This is a chronological record of {records.length} source-verified protests
              reported across Greater Dhaka during the interim government, from 8 August
              2024 through 17 February 2026. The calendar spans {months.length} months.
              Each record has an exact date, a location, and a source link.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-accent font-medium mb-3">
              Records, not a census
            </h2>
            <p>
              {records.length} is a count of archived records, not a claim that exactly{" "}
              {records.length} distinct movements happened. A continuing protest may
              appear on more than one date, while simultaneous protests at different
              locations remain separate. Unreported or undiscoverable events cannot appear
              here. Treat this as a documented floor, not a complete census.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-accent font-medium mb-3">
              Verification - {linked} source-linked records
            </h2>
            <p>
              Every visible record links to the report used to verify it. Month-only dates
              and records without a surviving source link are excluded from the calendar.
              Locations are transcribed from reporting; map coordinates are approximate
              landmarks, not exact protest boundaries.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-accent font-medium mb-3">
              Missing detail - {noDemand} records with no demand summary
            </h2>
            <p>
              Some reports establish that a protest happened but do not preserve a clear
              demand. Those records show the event title and source without inventing
              missing detail.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-accent font-medium mb-3">
              Corrections
            </h2>
            <p>
              This archive is compiled from public reporting and will contain gaps or
              errors. Corrections should identify the record number shown in its URL and
              include a supporting source.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
