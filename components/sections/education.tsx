import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { education } from "@/lib/data";

export function Education() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <ScrollReveal>
          <SectionHeading caption="// education" title="Academic Background" />
        </ScrollReveal>

        <ScrollReveal>
          <GlassCard className="max-w-[600px]">
            <h3 className="text-lg font-semibold">{education.degree}</h3>
            <p className="mt-1 text-[var(--text-secondary)]">{education.school}</p>
            <p className="mt-2 font-mono text-sm text-accent">{education.period}</p>
          </GlassCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
