import type { Metadata } from "next";
import { records, months } from "@/lib/data";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About",
  description: "Method, verification, and limits of the Interim Govt. Protest Watch archive.",
};

export default function AboutPage() {
  const linked = records.filter((r) => r.verified).length;
  const unverified = records.length - linked;
  const monthOnly = records.filter((r) => !/^\d{1,2}\s/.test(r.date)).length;
  const noDemand = records.filter((r) => !r.demand).length;

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
              This is a chronological record of {records.length} protests reported in Dhaka
              across {months.length} months, from August 2024 to December 2025. Each
              record is one reported event: a date, a title, and where available, what was
              demanded, where it happened, and a link to the original report.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-accent font-medium mb-3">
              A count of records, not a census of movements
            </h2>
            <p>
              {records.length} is a count of recorded events in this dataset, not a claim
              that exactly {records.length} distinct movements happened. Some events span
              multiple days or locations and may appear as separate records; some protests
              were never reported and are not in this archive at all. Treat the number as a
              floor, not a census.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-accent font-medium mb-3">
              Verification — {linked} linked, {unverified} unverified
            </h2>
            <p>
              {linked} records link directly to the article they were sourced from.{" "}
              {unverified} records have a publication name attached but no surviving link —
              usually because the original article moved or was taken down after the
              record was collected. Those are marked <span className="text-amber">unverified</span>{" "}
              throughout the site, in text, not colour alone. An unverified record still
              names its source; it is never presented as a citation.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-accent font-medium mb-3">
              Month-only dates — {monthOnly} records
            </h2>
            <p>
              {monthOnly} records could only be dated to a month, not a day, in the
              original reporting. Those are shown as e.g. &ldquo;Aug 2024&rdquo; and nothing
              more. No day is ever invented to fill the gap.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-accent font-medium mb-3">
              Missing detail — {noDemand} records with no description
            </h2>
            <p>
              {noDemand} records carry a title but no further description, because none was
              recoverable from the source reporting. Those records show the title alone.
              An empty field here means the information was not available, not that
              nothing happened.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-accent font-medium mb-3">
              Corrections
            </h2>
            <p>
              This archive is compiled from public reporting and will contain errors. If a
              record is wrong, missing its link, or misattributed, note the record number
              (the <span className="font-sans">#n</span> in its URL) and the correction, and
              send it through whatever contact channel accompanies this site&rsquo;s
              publication.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
