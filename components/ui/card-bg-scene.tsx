"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COLS = 12;
const ROWS = 8;
const COUNT = COLS * ROWS;

/* Floating particle grid — subtle animated background for glass cards */
function ParticleGrid() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        const idx = (i * ROWS + j) * 3;
        pos[idx] = (i / (COLS - 1) - 0.5) * 4;
        pos[idx + 1] = (j / (ROWS - 1) - 0.5) * 2.5;
        pos[idx + 2] = 0;
      }
    }
    return pos;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const t = clock.getElapsedTime();

    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        const idx = i * ROWS + j;
        const baseX = (i / (COLS - 1) - 0.5) * 4;
        const baseY = (j / (ROWS - 1) - 0.5) * 2.5;
        posAttr.setZ(idx, Math.sin(baseX * 1.5 + t * 0.8) * Math.cos(baseY * 1.5 + t * 0.6) * 0.15);
      }
    }
    posAttr.needsUpdate = true;
  });

  /* Dispose on unmount */
  useEffect(() => {
    return () => { geometry.dispose(); };
  }, [geometry]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#10b981"
        size={0.03}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export function CardBgScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ParticleGrid />
    </Canvas>
  );
}
