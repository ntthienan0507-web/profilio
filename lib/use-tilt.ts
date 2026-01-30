"use client";

import { useCallback, useRef, useState } from "react";

interface TiltState {
  rotateX: number;
  rotateY: number;
}

interface UseTiltOptions {
  maxTilt?: number;
}

/** Tracks mouse position over a card and returns CSS-ready tilt angles */
export function useTilt({ maxTilt = 12 }: UseTiltOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setTilt({ rotateX: -y * maxTilt, rotateY: x * maxTilt });
    },
    [maxTilt]
  );

  const onMouseEnter = useCallback(() => setHovered(true), []);

  const onMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  const style: React.CSSProperties = {
    transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
    transition: hovered
      ? "transform 0.1s ease-out"
      : "transform 0.5s ease-out",
    transformStyle: "preserve-3d",
  };

  return { ref, hovered, tilt, style, onMouseMove, onMouseEnter, onMouseLeave };
}
