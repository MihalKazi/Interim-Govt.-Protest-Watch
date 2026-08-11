"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function RevealGroup({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({
  children,
  as: Tag = "div",
  className,
}: {
  children: ReactNode;
  as?: "div" | "p" | "h1" | "nav" | "dl";
  className?: string;
}) {
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
      }}
    >
      {children}
    </MotionTag>
  );
}
