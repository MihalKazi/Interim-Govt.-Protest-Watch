"use client";

import { motion } from "framer-motion";
import CountUp from "./CountUp";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Hero({
  scope,
  period,
  total,
  months,
  categories,
}: {
  scope: string;
  period: string;
  total: number;
  months: number;
  categories: number;
}) {
  return (
    <motion.header
      className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-10 w-full"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.09 } } }}
    >
      <motion.p
        variants={fadeUp}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-4 font-medium"
      >
        {scope} · {period}
      </motion.p>
      <motion.h1
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="font-serif text-5xl sm:text-7xl font-medium leading-[1.02] mb-12 max-w-3xl text-balance"
      >
        Every recorded protest, one by one.
      </motion.h1>

      <motion.dl
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="grid grid-cols-3 gap-x-6 gap-y-8 max-w-2xl border-t border-rule pt-6"
      >
        <div>
          <dd className="font-serif text-4xl sm:text-5xl tabular-nums leading-none mb-2">
            <CountUp value={total} />
          </dd>
          <dt className="text-xs font-sans text-ink-muted uppercase tracking-wide">
            Records
          </dt>
        </div>
        <div>
          <dd className="font-serif text-4xl sm:text-5xl tabular-nums leading-none mb-2">
            <CountUp value={months} />
          </dd>
          <dt className="text-xs font-sans text-ink-muted uppercase tracking-wide">
            Months
          </dt>
        </div>
        <div>
          <dd className="font-serif text-4xl sm:text-5xl tabular-nums leading-none mb-2">
            <CountUp value={categories} />
          </dd>
          <dt className="text-xs font-sans text-ink-muted uppercase tracking-wide">
            Categories
          </dt>
        </div>
      </motion.dl>
    </motion.header>
  );
}
