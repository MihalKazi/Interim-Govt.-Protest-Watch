import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { records, getRecord, getAdjacent } from "@/lib/data";
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

  const description = r.demand || `${r.event} — ${r.date}, ${r.venue}.`;

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
  const venue =
    r.venue === "Dhaka (venue not specified)" ? null : r.venue;

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-16 w-full flex-1">
        <Link
          href="/"
          className="text-sm font-sans text-ink-muted hover:text-accent transition-colors"
        >
          ← Archive
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
            className="flex items-center gap-2 mb-8 font-sans text-sm text-ink-muted"
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: colorFor(r.cat) }}
            />
            {shortLabel(r.cat)}
          </Reveal>

          {r.demand && (
            <Reveal
              as="p"
              className="font-serif text-lg sm:text-xl leading-relaxed mb-10 max-w-prose"
            >
              {r.demand}
            </Reveal>
          )}

          <Reveal
            as="dl"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-rule pt-6 font-sans text-sm"
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

            <div>
              <dt className="text-ink-muted uppercase text-xs tracking-wide mb-1">
                Source
              </dt>
              <dd>
                {r.verified && r.url ? (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {r.source || r.domain}
                    {r.domain && (
                      <span className="block text-xs text-ink-muted">
                        {r.domain}
                      </span>
                    )}
                  </a>
                ) : (
                  <span className="text-amber font-medium">
                    {r.source ? `${r.source} · ` : ""}unverified — no article
                    on file
                  </span>
                )}
              </dd>
            </div>
          </Reveal>

          {r.verified && r.url && (
            <ArticleEmbed url={r.url} source={r.source || r.domain || "Source"} />
          )}

          <Reveal
            as="nav"
            className="flex items-center justify-between mt-16 pt-6 border-t border-rule font-sans text-sm"
          >
            {prev ? (
              <Link href={`/record/${prev.n}`} className="hover:text-accent max-w-[45%]">
                ← {prev.event}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/record/${next.n}`}
                className="hover:text-accent max-w-[45%] text-right ml-auto"
              >
                {next.event} →
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
