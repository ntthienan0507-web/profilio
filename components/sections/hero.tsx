"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import type { SiteConfig } from "@/lib/types";

const HeroGlobe = dynamic(
  () => import("@/components/ui/hero-globe").then((m) => m.HeroGlobe),
  { ssr: false }
);

export function Hero({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* 3D Globe background */}
      <Suspense fallback={null}>
        <HeroGlobe />
      </Suspense>

      {/* Subtle gradient glow behind globe */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-4 font-mono text-xs uppercase tracking-[0.1em] text-accent"
        >
          // welcome
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-4 text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.1] tracking-tight"
        >
          {siteConfig.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-10 max-w-[600px] text-[clamp(1rem,2vw,1.25rem)] text-[var(--text-secondary)]"
        >
          {siteConfig.title}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#experience"
            className="rounded-xl bg-accent px-7 py-3.5 text-[0.9375rem] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] hover:shadow-[var(--glow-accent)]"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-xl border border-[var(--glass-border)] bg-transparent px-7 py-3.5 text-[0.9375rem] font-medium text-[var(--text-primary)] transition-all hover:border-accent hover:bg-[var(--accent-muted)] hover:text-accent"
          >
            Get In Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
