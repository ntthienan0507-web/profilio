import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import type { SiteConfig } from "@/lib/types";

export function Contact({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <section id="contact" className="bg-bg2 py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <ScrollReveal>
          <SectionHeading caption="// get in touch" title="Contact" />
        </ScrollReveal>

        <ScrollReveal>
          <p className="mb-6 max-w-[500px] text-[var(--text-secondary)]">
            Interested in working together? Feel free to reach out via email or connect on social platforms.
          </p>
        </ScrollReveal>

        <div className="flex flex-wrap gap-4">
          <ScrollReveal delay={0.1}>
            <a href={`mailto:${siteConfig.links.email}`}>
              <GlassCard className="flex items-center gap-3 !p-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <span className="text-sm text-[var(--text-secondary)]">{siteConfig.links.email}</span>
              </GlassCard>
            </a>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
              <GlassCard className="flex items-center gap-3 !p-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                </svg>
                <span className="text-sm text-[var(--text-secondary)]">GitHub</span>
              </GlassCard>
            </a>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer">
              <GlassCard className="flex items-center gap-3 !p-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
                  <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                <span className="text-sm text-[var(--text-secondary)]">LinkedIn</span>
              </GlassCard>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
