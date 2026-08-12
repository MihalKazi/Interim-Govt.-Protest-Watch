"use client";

import type { Protest } from "@/lib/data";
import { followUpThread, recordSummary } from "@/lib/data";
import { shortLabel, colorFor } from "@/lib/categories";
import { Reveal, RevealGroup } from "./RecordReveal";
import ArticleEmbed from "./ArticleEmbed";

export default function RecordDetail({ r }: { r: Protest }) {
  const venue = r.venue === "Dhaka (venue not specified)" ? null : r.venue;
  const summary = recordSummary(r);
  const thread = followUpThread(r);

  return (
    <RevealGroup>
      <Reveal
        as="p"
        className="font-sans text-xs tracking-[0.2em] uppercase text-accent font-medium"
      >
        {r.date}
      </Reveal>

      <Reveal
        as="h1"
        className="font-serif text-2xl sm:text-3xl font-medium leading-tight mt-2 mb-4"
      >
        {r.event}
      </Reveal>

      <Reveal
        as="div"
        className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 font-sans text-sm text-ink-muted"
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
        className="mb-6 rounded-md border border-rule bg-[color-mix(in_srgb,var(--paper)_68%,white)] px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.5)_inset]"
      >
        <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.18em] text-amber">
          Summary
        </p>
        <p className="font-serif text-base leading-relaxed">{summary}</p>
      </Reveal>

      {r.demand && (
        <Reveal as="div" className="mb-8">
          <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.18em] text-amber">
            Demand
          </p>
          <p className="font-serif text-base sm:text-lg leading-relaxed">
            {r.demand}
          </p>
        </Reveal>
      )}

      {thread && (
        <Reveal as="div" className="mb-8">
          <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.18em] text-amber">
            Follow-up thread
          </p>
          <p className="font-sans text-sm text-ink-muted">{thread}</p>
        </Reveal>
      )}

      <Reveal
        as="dl"
        className="grid grid-cols-1 gap-5 border-t border-rule pt-5 font-sans text-sm"
      >
        <div>
          <dt className="text-ink-muted uppercase text-xs tracking-wide mb-1">
            Venue
          </dt>
          <dd>
            {venue ?? (
              <span className="italic text-ink-muted">Venue not recorded</span>
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
                {r.source ? `${r.source} / ` : ""}unverified - no article on
                file
              </span>
            </dd>
          </div>
        )}
      </Reveal>

      {r.verified && r.url && (
        <ArticleEmbed url={r.url} source={r.source || r.domain || "Source"} />
      )}
    </RevealGroup>
  );
}
