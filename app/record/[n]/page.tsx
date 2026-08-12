import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  records,
  getRecord,
  getAdjacent,
  recordSummary,
  followUpThread,
} from "@/lib/data";
import { shortLabel, colorFor } from "@/lib/categories";
import SiteHeader from "@/components/SiteHeader";
import { Reveal, RevealGroup } from "@/components/RecordReveal";
import ArticleEmbed from "@/components/ArticleEmbed";

export function generateStaticParams() {
  return records.map((r) => ({ n: String(r.n) }));
}

function parseN(n: string): number | null {
  const v = Number(n);
  return Number.isInteger(v) ? v : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>;
}): Promise<Metadata> {
  const { n } = await params;
  const id = parseN(n);
  const r = id !== null ? getRecord(id) : undefined;
  if (!r) return { title: "Record not found" };

  const description = r.demand || `${r.event} - ${r.date}, ${r.venue}.`;

  return {
    title: r.event,
    description,
    openGraph: {
      title: r.event,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: r.event,
      description,
    },
  };
}

export default async function RecordPage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const id = parseN(n);
  const r = id !== null ? getRecord(id) : undefined;
  if (!r) notFound();

  const { prev, next } = getAdjacent(r.n);
  const venue = r.venue === "Dhaka (venue not specified)" ? null : r.venue;
  const summary = recordSummary(r);
  const thread = followUpThread(r);

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 w-full flex-1">
        <Link
          href="/"
          className="text-sm font-sans text-ink-muted hover:text-accent transition-colors"
        >
          Back to archive
        </Link>

        <RevealGroup>
          <Reveal
            as="p"
            className="mt-10 font-sans text-xs tracking-[0.2em] uppercase text-accent font-medium"
          >
            {r.date}
          </Reveal>

          <Reveal
            as="h1"
            className="font-serif text-3xl sm:text-5xl font-medium leading-tight mt-2 mb-6"
          >
            {r.event}
          </Reveal>

          <Reveal
            as="div"
            className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-8 font-sans text-sm text-ink-muted"
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: colorFor(r.cat) }}
            />
            <span>{shortLabel(r.cat)}</span>
            {venue && (
              <>
                <span className="text-ink-muted/45">/</span>
                <span>{venue}</span>
              </>
            )}
          </Reveal>

          <Reveal
            as="div"
            className="mb-8 rounded-md border border-rule bg-[color-mix(in_srgb,var(--paper)_68%,white)] px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.5)_inset]"
          >
            <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.18em] text-amber">
              Summary
            </p>
            <p className="font-serif text-base leading-relaxed">{summary}</p>
          </Reveal>

          {r.demand && (
            <Reveal as="div" className="mb-10 max-w-prose">
              <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.18em] text-amber">
                Demand
              </p>
              <p className="font-serif text-lg sm:text-xl leading-relaxed">
                {r.demand}
              </p>
            </Reveal>
          )}

          {thread && (
            <Reveal as="div" className="mb-10 max-w-prose">
              <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.18em] text-amber">
                Follow-up thread
              </p>
              <p className="font-sans text-sm text-ink-muted">{thread}</p>
            </Reveal>
          )}

          <Reveal
            as="dl"
            className="grid grid-cols-1 gap-6 border-t border-rule pt-6 font-sans text-sm"
          >
            <div>
              <dt className="text-ink-muted uppercase text-xs tracking-wide mb-1">
                Venue
              </dt>
              <dd>
                {venue ?? (
                  <span className="italic text-ink-muted">
                    Venue not recorded
                  </span>
                )}
              </dd>
            </div>

            {(!r.verified || !r.url) && (
              <div>
                <dt className="text-ink-muted uppercase text-xs tracking-wide mb-1">
                  Source
                </dt>
                <dd>
                  <span className="text-amber font-medium">
                    {r.source ? `${r.source} / ` : ""}unverified - no article
                    on file
                  </span>
                </dd>
              </div>
            )}
          </Reveal>

          {r.verified && r.url && (
            <ArticleEmbed url={r.url} source={r.source || r.domain || "Source"} />
          )}

          <Reveal
            as="nav"
            className="flex items-center justify-between mt-16 pt-6 border-t border-rule font-sans text-sm"
          >
            {prev ? (
              <Link
                href={`/record/${prev.n}`}
                className="hover:text-accent max-w-[45%]"
              >
                Previous: {prev.event}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/record/${next.n}`}
                className="hover:text-accent max-w-[45%] text-right ml-auto"
              >
                Next: {next.event}
              </Link>
            ) : (
              <span />
            )}
          </Reveal>
        </RevealGroup>
      </main>
    </div>
  );
}
