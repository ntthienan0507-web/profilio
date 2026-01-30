"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { skills } from "@/lib/data";
import { TechIcon } from "@/components/ui/tech-icons";
import { SkillCardBg } from "@/components/ui/skill-card-bg";
import { useTilt } from "@/lib/use-tilt";

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

function SkillCard({ category, items, index, isInView }: { category: string; items: string[]; index: number; isInView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const tilt = useTilt({ maxTilt: 10 });

  return (
    <div style={{ perspective: "800px" }}>
      <motion.div
        ref={tilt.ref}
        onHoverStart={() => { setHovered(true); tilt.onMouseEnter(); }}
        onHoverEnd={() => { setHovered(false); tilt.onMouseLeave(); }}
        onMouseMove={tilt.onMouseMove}
        initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(8px)" }}
        animate={
          isInView
            ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
            : { opacity: 0, y: 40, scale: 0.95, filter: "blur(8px)" }
        }
        transition={{
          duration: 0.7,
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={tilt.style}
        className="group relative h-full rounded-2xl p-px"
      >
        {/* Animated gradient border on hover */}
        <div
          className="absolute inset-0 rounded-2xl transition-opacity duration-500"
          style={{
            opacity: hovered ? 0.6 : 0,
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
          {/* Corner bracket accents — always visible */}
          <div className="pointer-events-none absolute inset-0 rounded-[calc(1rem-1px)]">
            <span className="absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-accent opacity-60" />
            <span className="absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 border-accent opacity-60" />
            <span className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-accent opacity-60" />
            <span className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-accent opacity-60" />
          </div>

          {/* Hover glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[calc(1rem-1px)] transition-opacity duration-500"
            style={{
              opacity: hovered ? 1 : 0,
              background: "radial-gradient(600px circle at 50% 0%, rgba(16,185,129,0.06), transparent 60%)",
            }}
          />

          {/* Category-specific animated illustration bg — always visible */}
          <div className="pointer-events-none absolute inset-0">
            <SkillCardBg category={category} />
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
    </div>
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
