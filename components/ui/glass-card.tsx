"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const CardBgScene = dynamic(
  () => import("@/components/ui/card-bg-scene").then((m) => m.CardBgScene),
  { ssr: false }
);

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  /** Disable the Three.js hover background (e.g. if the card already has its own 3D) */
  noThreeBg?: boolean;
}

export function GlassCard({ children, className, hover = true, noThreeBg = false }: GlassCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 backdrop-blur-xl transition-all duration-300",
        hover && "hover:-translate-y-0.5 hover:border-[var(--glass-border-hover)] hover:bg-[var(--glass-bg-hover)]",
        className
      )}
    >
      {/* Three.js particle background — fades in on hover */}
      {!noThreeBg && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          {hovered && (
            <Suspense fallback={null}>
              <CardBgScene />
            </Suspense>
          )}
        </div>
      )}

      {/* Card content — always above the bg */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
