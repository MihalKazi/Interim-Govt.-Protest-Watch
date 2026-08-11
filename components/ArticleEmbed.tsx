"use client";

import { motion } from "framer-motion";

function NewsIllustration() {
  return (
    <svg
      aria-hidden="true"
      width="180"
      height="150"
      viewBox="0 0 180 150"
      className="drop-shadow-[0_6px_16px_rgba(28,26,22,0.12)]"
    >
      <g transform="translate(18 6) rotate(-6)">
        <rect x="0" y="0" width="118" height="132" rx="3" fill="var(--rule)" />
      </g>
      <g transform="translate(34 0) rotate(4)">
        <rect
          x="0"
          y="0"
          width="118"
          height="132"
          rx="3"
          fill="var(--paper)"
          stroke="var(--ink)"
          strokeWidth="2"
        />
        <rect x="12" y="14" width="60" height="8" fill="var(--ink)" />
        <rect x="12" y="28" width="94" height="3" fill="var(--rule)" />
        <rect x="12" y="35" width="94" height="3" fill="var(--rule)" />
        <rect x="12" y="42" width="70" height="3" fill="var(--rule)" />
        <rect x="12" y="55" width="42" height="34" fill="var(--rule)" />
        <rect x="60" y="55" width="46" height="3" fill="var(--rule)" />
        <rect x="60" y="62" width="46" height="3" fill="var(--rule)" />
        <rect x="60" y="69" width="46" height="3" fill="var(--rule)" />
        <rect x="60" y="76" width="30" height="3" fill="var(--rule)" />
        <rect x="12" y="97" width="94" height="3" fill="var(--rule)" />
        <rect x="12" y="104" width="94" height="3" fill="var(--rule)" />
        <rect x="12" y="111" width="60" height="3" fill="var(--rule)" />
      </g>
      <g transform="translate(93 90)">
        <circle cx="0" cy="0" r="26" fill="var(--accent)" />
        <path
          d="M-9 0h16m0 0-6-6m6 6-6 6"
          stroke="var(--paper)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

export default function ArticleEmbed({
  url,
  source,
}: {
  url: string;
  source: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
      className="mt-10"
    >
      <p className="font-sans text-xs uppercase tracking-wide text-ink-muted mb-2">
        Source article
      </p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center gap-5 w-full rounded-lg border border-rule bg-ink/2 px-8 py-10 text-center transition-all duration-200 hover:border-ink/25 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(28,26,22,0.10)]"
      >
        <NewsIllustration />

        <div>
          <p className="font-serif text-lg sm:text-xl leading-snug mb-1.5">
            Published by {source}, not us
          </p>
          <p className="font-sans text-sm text-ink-muted max-w-sm">
            Publishers don&rsquo;t let their articles live anywhere but home.
            The full story is one click away.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 text-sm font-sans font-medium px-4 py-2 rounded-full bg-accent text-paper transition-transform group-hover:scale-105">
          Read on {source}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>
    </motion.div>
  );
}
