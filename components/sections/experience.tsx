"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { experiences, type Experience } from "@/lib/data";

const ProjectIcon3D = dynamic(
  () => import("@/components/ui/project-icon-3d").then((m) => m.ProjectIcon3D),
  { ssr: false }
);

function ProjectCard({ exp, index }: { exp: Experience; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--glass-border-hover)] hover:bg-[var(--glass-bg-hover)] hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]"
    >
      {/* Accent gradient top */}
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-accent/40 via-accent/10 to-transparent transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

      {/* Header: 3D icon + title + period */}
      <div className="flex items-start gap-4 sm:gap-6">
        <Suspense fallback={<div className="h-28 w-28 shrink-0 sm:h-32 sm:w-32" />}>
          <ProjectIcon3D index={index} />
        </Suspense>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-accent">{exp.period}</span>
            <span className="text-xs text-[var(--text-muted)]">&middot;</span>
            <span className="text-xs text-[var(--text-muted)]">{exp.company}</span>
          </div>
          <h3 className="mb-1 text-xl font-semibold">{exp.title}</h3>
          <p className="text-sm text-[var(--text-muted)]">{exp.subtitle}</p>
        </div>
      </div>

      {/* Metrics row */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {exp.metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2.5 text-center transition-colors duration-300 group-hover:border-accent/25"
          >
            <div className="text-lg font-bold text-accent">{m.value}</div>
            <div className="text-xs text-[var(--text-muted)]">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Tech stack */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {exp.tech.map((t) => (
          <span
            key={t}
            className="rounded-md border border-accent/20 bg-[var(--accent-muted)] px-2.5 py-1 font-mono text-xs text-accent"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Expandable detail preview — CSS grid trick for smooth height animation */}
      <motion.div
        initial={false}
        animate={{
          gridTemplateRows: hovered ? "1fr" : "0fr",
          opacity: hovered ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ display: "grid" }}
      >
        <div className="overflow-hidden">
          {/* Divider */}
          <div className="mt-4 h-px bg-gradient-to-r from-accent/30 via-accent/10 to-transparent" />

          {/* Bullets */}
          <ul className="mt-4 space-y-2">
            {exp.bullets.map((bullet, j) => (
              <motion.li
                key={j}
                className="flex gap-2.5 text-sm text-[var(--text-secondary)]"
                initial={false}
                animate={{
                  opacity: hovered ? 1 : 0,
                  x: hovered ? 0 : -12,
                }}
                transition={{ duration: 0.25, delay: hovered ? 0.1 + j * 0.08 : 0 }}
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                <span>{bullet}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* "Hover for details" hint */}
      <div
        className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[var(--text-muted)] transition-opacity duration-200"
        style={{ opacity: hovered ? 0 : 0.5 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="7 13 12 18 17 13" />
          <polyline points="7 6 12 11 17 6" />
        </svg>
        Hover for details
      </div>
    </motion.div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <ScrollReveal>
          <SectionHeading caption="// experience" title="Project Highlights" />
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative border-l-2 border-[var(--glass-border)] pl-8">
          {experiences.map((exp, i) => (
            <ScrollReveal
              key={exp.title}
              delay={0.1 * i}
              className="relative mb-14 last:mb-0"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[calc(2rem+7px)] top-2 h-3 w-3 rounded-full bg-accent shadow-[0_0_0_4px_var(--bg),0_0_12px_rgba(16,185,129,0.4)]" />

              <ProjectCard exp={exp} index={i} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
