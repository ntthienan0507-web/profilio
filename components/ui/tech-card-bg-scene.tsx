"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Helper: create a THREE.Line from a flat vertex array ── */
function makeLine(verts: number[], color: string, opacity: number) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  return new THREE.Line(geo, mat);
}

/* ── Grid lines (horizontal + vertical) ── */
function TechGrid() {
  const groupRef = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    const result: THREE.Line[] = [];
    const cols = 10;
    const rows = 6;
    const w = 5;
    const h = 3.2;

    for (let i = 0; i <= cols; i++) {
      const x = (i / cols - 0.5) * w;
      result.push(makeLine([x, -h / 2, 0, x, h / 2, 0], "#10b981", 0.15));
    }
    for (let j = 0; j <= rows; j++) {
      const y = (j / rows - 0.5) * h;
      result.push(makeLine([-w / 2, y, 0, w / 2, y, 0], "#10b981", 0.15));
    }
    return result;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    lines.forEach((line, i) => {
      const mat = line.material as THREE.LineBasicMaterial;
      mat.opacity = 0.12 + Math.sin(t * 1.2 + i * 0.3) * 0.06;
    });
  });

  useEffect(() => {
    return () => {
      lines.forEach((l) => { l.geometry.dispose(); (l.material as THREE.Material).dispose(); });
    };
  }, [lines]);

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}

/* ── Circuit trace paths ── */
function CircuitTraces() {
  const traces = useMemo(() => {
    const paths = [
      /* Trace 1 — L-shape top-right */
      [1.0, 1.2, 0.01, 1.0, 0.6, 0.01, 1.8, 0.6, 0.01],
      /* Trace 2 — step bottom-left */
      [-1.8, -0.8, 0.01, -1.0, -0.8, 0.01, -1.0, -1.2, 0.01, -0.4, -1.2, 0.01],
      /* Trace 3 — horizontal mid */
      [-0.6, 0.2, 0.01, 0.3, 0.2, 0.01, 0.3, 0.8, 0.01],
      /* Trace 4 — diagonal-ish bottom right */
      [0.6, -0.4, 0.01, 1.2, -0.4, 0.01, 1.2, -1.0, 0.01, 1.8, -1.0, 0.01],
      /* Trace 5 — top left connector */
      [-2.0, 1.0, 0.01, -1.4, 1.0, 0.01, -1.4, 0.4, 0.01],
    ];
    return paths.map((p) => makeLine(p, "#34d399", 0.35));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    traces.forEach((line, i) => {
      const mat = line.material as THREE.LineBasicMaterial;
      mat.opacity = 0.25 + Math.sin(t * 2.0 + i * 1.4) * 0.2;
    });
  });

  useEffect(() => {
    return () => {
      traces.forEach((l) => { l.geometry.dispose(); (l.material as THREE.Material).dispose(); });
    };
  }, [traces]);

  return (
    <group>
      {traces.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}

/* ── Junction nodes (dots at circuit intersections) ── */
function JunctionNodes() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    return new Float32Array([
      1.0, 1.2, 0.02,   1.0, 0.6, 0.02,   1.8, 0.6, 0.02,
      -1.8, -0.8, 0.02,  -1.0, -0.8, 0.02,  -1.0, -1.2, 0.02,
      -0.4, -1.2, 0.02,  0.3, 0.2, 0.02,    0.3, 0.8, 0.02,
      1.2, -0.4, 0.02,   1.8, -1.0, 0.02,   -2.0, 1.0, 0.02,
      -1.4, 0.4, 0.02,
    ]);
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    const t = clock.getElapsedTime();
    mat.opacity = 0.5 + Math.sin(t * 3) * 0.3;
  });

  useEffect(() => {
    return () => { geometry.dispose(); };
  }, [geometry]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial color="#10b981" size={0.06} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ── Glowing border frame ── */
function GlowFrame() {
  const line = useMemo(() => {
    const w = 4.6;
    const h = 2.9;
    return makeLine([
      -w / 2, -h / 2, 0.01,
      w / 2, -h / 2, 0.01,
      w / 2, h / 2, 0.01,
      -w / 2, h / 2, 0.01,
      -w / 2, -h / 2, 0.01,
    ], "#10b981", 0.25);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mat = line.material as THREE.LineBasicMaterial;
    mat.opacity = 0.2 + Math.sin(t * 1.5) * 0.1;
  });

  useEffect(() => {
    return () => { line.geometry.dispose(); (line.material as THREE.Material).dispose(); };
  }, [line]);

  return <primitive object={line} />;
}

/* ── Scanline effect (moving horizontal line) ── */
function Scanline() {
  const line = useMemo(() => {
    const w = 4.6;
    return makeLine([-w / 2, 0, 0.02, w / 2, 0, 0.02], "#34d399", 0.15);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const y = ((t * 0.4) % 1) * 2.9 - 1.45;
    line.position.y = y;
  });

  useEffect(() => {
    return () => { line.geometry.dispose(); (line.material as THREE.Material).dispose(); };
  }, [line]);

  return <primitive object={line} />;
}

/* ── Main scene export ── */
export function TechCardBgScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      style={{ background: "transparent" }}
    >
      <TechGrid />
      <CircuitTraces />
      <JunctionNodes />
      <GlowFrame />
      <Scanline />
    </Canvas>
  );
}
