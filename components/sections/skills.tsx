"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { skills } from "@/lib/data";
import { TechIcon } from "@/components/ui/tech-icons";
import { SkillCardBg } from "@/components/ui/skill-card-bg";

/* Category icon map */
const categoryIcons: Record<string, React.ReactNode> = {
  Languages: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Frameworks: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  Infrastructure: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><circle cx="6" cy="6" r="1" fill="currentColor" /><circle cx="6" cy="18" r="1" fill="currentColor" />
    </svg>
  ),
  Management: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  "Storage & Data": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Observability: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Methodologies: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

/* Deterministic scattered offsets — avoids hydration mismatch */
const scatterOffsets = [
  { x: 200, y: -120, rotate: 15 },
  { x: -180, y: 80, rotate: -18 },
  { x: 140, y: 130, rotate: 10 },
  { x: -220, y: -60, rotate: -14 },
  { x: 170, y: 100, rotate: 20 },
  { x: -130, y: -140, rotate: -11 },
  { x: 90, y: 110, rotate: 16 },
];

/* Intermediate "floating" keyframe — cards drift through this mid-point */
const floatMid = [
  { x: -40, y: 30, rotate: -4 },
  { x: 50, y: -20, rotate: 6 },
  { x: -30, y: -40, rotate: -3 },
  { x: 60, y: 25, rotate: 5 },
  { x: -50, y: -15, rotate: -5 },
  { x: 35, y: 35, rotate: 4 },
  { x: -25, y: -30, rotate: -3 },
];

function SkillCard({ category, items, index, isInView }: { category: string; items: string[]; index: number; isInView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const scatter = scatterOffsets[index % scatterOffsets.length];
  const mid = floatMid[index % floatMid.length];

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, x: scatter.x, y: scatter.y, rotate: scatter.rotate, scale: 0.8 }}
      animate={
        isInView
          ? {
              opacity: [0, 0.6, 0.85, 1],
              x: [scatter.x, mid.x * 1.2, mid.x * -0.5, 0],
              y: [scatter.y, mid.y * 1.2, mid.y * -0.5, 0],
              rotate: [scatter.rotate, mid.rotate, mid.rotate * -0.3, 0],
              scale: [0.8, 0.9, 0.95, 1],
            }
          : { opacity: 0, x: scatter.x, y: scatter.y, rotate: scatter.rotate, scale: 0.8 }
      }
      transition={{
        duration: 2.2,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
        times: [0, 0.35, 0.7, 1],
      }}
      className="group relative h-full rounded-2xl p-px"
    >
      {/* Animated gradient border on hover */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background: "conic-gradient(from 0deg, #10b981, #6366f1, #10b981)",
        }}
      />
      {/* Static border */}
      <div
        className="absolute inset-0 rounded-2xl border border-[var(--glass-border)] transition-opacity duration-500"
        style={{ opacity: hovered ? 0 : 1 }}
      />

      {/* Card inner */}
      <div className="relative h-full rounded-[calc(1rem-1px)] bg-[var(--glass-bg)] p-5 backdrop-blur-xl">
        {/* Hover glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[calc(1rem-1px)] transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            background: "radial-gradient(600px circle at 50% 0%, rgba(16,185,129,0.06), transparent 60%)",
          }}
        />

        {/* Category-specific animated illustration bg */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          {hovered && <SkillCardBg category={category} />}
        </div>

        {/* Category header */}
        <div className="relative mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent/20">
              {categoryIcons[category]}
            </span>
            <h3 className="text-base font-semibold uppercase tracking-wider">
              {category}
            </h3>
          </div>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent">
            {items.length}
          </span>
        </div>

        {/* Skill pills */}
        <div className="relative flex flex-wrap gap-2">
          {items.map((skill, si) => (
            <motion.span
              key={skill}
              initial={false}
              animate={{ scale: hovered ? 1.02 : 1 }}
              transition={{ duration: 0.2, delay: si * 0.03 }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--glass-border)] bg-[var(--bg)] px-3 py-1.5 font-mono text-sm text-[var(--text-secondary)] transition-all duration-200 hover:border-accent/40 hover:text-accent hover:shadow-[0_0_12px_rgba(16,185,129,0.1)]"
            >
              <TechIcon name={skill} />
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Skills() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="bg-bg2 py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <ScrollReveal>
          <SectionHeading caption="// tech stack" title="Skills & Expertise" />
        </ScrollReveal>

        <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((cat, i) => (
            <SkillCard
              key={cat.category}
              category={cat.category}
              items={cat.skills}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
