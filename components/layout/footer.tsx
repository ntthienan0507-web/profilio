import type { SiteConfig } from "@/lib/types";
import { ViewCounter } from "@/components/ui/view-counter";

export function Footer({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <footer className="border-t border-[var(--glass-border)] py-8">
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Built with{" "}
          <span className="font-mono text-accent">Next.js</span>
          {" "}&middot; Designed with care
        </p>
        <div className="mt-3">
          <ViewCounter />
        </div>
      </div>
    </footer>
  );
}
