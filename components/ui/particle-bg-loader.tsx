"use client";

import dynamic from "next/dynamic";

const ParticleBg = dynamic(
  () => import("@/components/ui/particle-bg").then((m) => m.ParticleBg),
  { ssr: false }
);

export function ParticleBgLoader() {
  return <ParticleBg />;
}
