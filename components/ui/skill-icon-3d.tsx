"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* Each category gets a unique spinning 3D shape */
function CategoryShape({ category }: { category: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.4;
    ref.current.rotation.x += delta * 0.15;
  });

  const mat = (
    <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.6} />
  );

  switch (category) {
    case "Languages":
      // Code brackets → octahedron
      return (
        <mesh ref={ref}>
          <octahedronGeometry args={[0.8, 0]} />
          {mat}
        </mesh>
      );
    case "Frameworks":
      // Building blocks → box
      return (
        <mesh ref={ref}>
          <boxGeometry args={[1, 1, 1]} />
          {mat}
        </mesh>
      );
    case "Infrastructure":
      // Cloud/server → icosahedron (complex polyhedron)
      return (
        <mesh ref={ref}>
          <icosahedronGeometry args={[0.8, 0]} />
          {mat}
        </mesh>
      );
    case "Management":
      // Organization → torus knot
      return (
        <mesh ref={ref}>
          <torusKnotGeometry args={[0.5, 0.15, 64, 8, 2, 3]} />
          {mat}
        </mesh>
      );
    case "Storage & Data":
      // Database → cylinder
      return (
        <mesh ref={ref}>
          <cylinderGeometry args={[0.6, 0.6, 0.8, 6]} />
          {mat}
        </mesh>
      );
    case "Observability":
      // Monitoring → torus (ring/radar)
      return (
        <mesh ref={ref}>
          <torusGeometry args={[0.6, 0.2, 8, 16]} />
          {mat}
        </mesh>
      );
    case "Methodologies":
      // Process/flow → dodecahedron
      return (
        <mesh ref={ref}>
          <dodecahedronGeometry args={[0.75, 0]} />
          {mat}
        </mesh>
      );
    default:
      return (
        <mesh ref={ref}>
          <sphereGeometry args={[0.7, 16, 16]} />
          {mat}
        </mesh>
      );
  }
}

export function SkillIcon3D({ category }: { category: string }) {
  return (
    <div className="h-16 w-16" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
          <CategoryShape category={category} />
        </Float>
        <ambientLight intensity={0.8} />
      </Canvas>
    </div>
  );
}
