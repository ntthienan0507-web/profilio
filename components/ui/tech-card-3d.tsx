"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const TechCardBgScene = dynamic(
  () => import("@/components/ui/tech-card-bg-scene").then((m) => m.TechCardBgScene),
  { ssr: false }
);

interface TechCard3DProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt angle in degrees (default: 12) */
  maxTilt?: number;
  /** Show glowing border on hover (default: true) */
  glowBorder?: boolean;
}

export function TechCard3D({
  children,
  className,
  maxTilt = 12,
  glowBorder = true,
}: TechCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      /* Normalize mouse position to -1..1 */
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setTilt({
        rotateX: -y * maxTilt, // tilt up/down
        rotateY: x * maxTilt,  // tilt left/right
      });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  return (
    <div
      className="group"
      style={{ perspective: "800px" }}
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 backdrop-blur-xl",
          "transition-[border-color,background,box-shadow] duration-300",
          className
        )}
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: hovered
            ? "transform 0.1s ease-out, border-color 0.3s, background 0.3s, box-shadow 0.3s"
            : "transform 0.5s ease-out, border-color 0.3s, background 0.3s, box-shadow 0.3s",
          transformStyle: "preserve-3d",
          ...(hovered && glowBorder
            ? {
                borderColor: "var(--glass-border-hover)",
                background: "var(--glass-bg-hover)",
                boxShadow: "var(--glow-accent)",
              }
            : {}),
        }}
      >
        {/* Technical background layer — sits behind card content via translateZ */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            transform: "translateZ(-1px)",
          }}
        >
          {hovered && (
            <Suspense fallback={null}>
              <TechCardBgScene />
            </Suspense>
          )}
        </div>

        {/* Corner accents — small L-shaped brackets at corners */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          {/* Top-left */}
          <span className="absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-[var(--accent)] opacity-60" />
          {/* Top-right */}
          <span className="absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 border-[var(--accent)] opacity-60" />
          {/* Bottom-left */}
          <span className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-[var(--accent)] opacity-60" />
          {/* Bottom-right */}
          <span className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-[var(--accent)] opacity-60" />
        </div>

        {/* Card content — always on top */}
        <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
