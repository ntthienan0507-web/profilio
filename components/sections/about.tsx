"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { CyberAvatar } from "@/components/ui/cyber-avatar";
import type { Stat } from "@/lib/types";

const KEYWORDS = [
  "full-stack engineer",
  "4+ years",
  "enterprise cloud platforms",
  "financial APIs",
  "data-driven web applications",
  "clean architecture",
  "infrastructure as code",
  "developer experience",
  "Agile/Scrum",
  "architectural excellence",
];

function HighlightedText({ text }: { text: string }) {
  const sorted = [...KEYWORDS].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${sorted.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        const isKeyword = KEYWORDS.some((k) => k.toLowerCase() === part.toLowerCase());
        return isKeyword ? (
          <span key={i} className="text-accent font-medium">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

export function About({ aboutText, stats }: { aboutText: string; stats: Stat[] }) {
  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <ScrollReveal>
          <SectionHeading caption="// about me" title="Building robust platforms at scale" />
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {/* Avatar card */}
          <ScrollReveal className="md:col-span-1 lg:col-span-1">
            <GlassCard className="group flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 transition-transform duration-300 group-hover:scale-105">
                <CyberAvatar size={128} />
              </div>
              <div className="text-base font-semibold">Available for hire</div>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-accent">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Open to opportunities
              </div>
            </GlassCard>
          </ScrollReveal>

          {/* Intro text */}
          <ScrollReveal className="md:col-span-1 lg:col-span-2">
            <GlassCard className="h-full">
              <p className="text-[var(--text-secondary)] leading-relaxed">
                <HighlightedText text={aboutText} />
              </p>
            </GlassCard>
          </ScrollReveal>

          {/* Stat cards */}
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={0.1 * (i + 1)} className="md:col-span-1 lg:col-span-1">
              <GlassCard className="group h-full cursor-default text-center transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(16,185,129,0.15)]">
                <div className="text-[2.5rem] font-bold leading-none text-accent transition-transform duration-300 group-hover:scale-110">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-sm text-[var(--text-muted)] transition-colors duration-300 group-hover:text-[var(--text-secondary)]">
                  {stat.label}
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
