"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* IaaS Platform → Interconnected cubes (infrastructure cluster) */
function InfraCluster() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.3;
      group.current.rotation.x += delta * 0.1;
    }
  });

  const mat = <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.5} />;
  const positions: [number, number, number][] = [
    [0, 0, 0],
    [0.9, 0.5, 0.3],
    [-0.7, 0.6, -0.4],
    [0.3, -0.8, 0.5],
    [-0.5, -0.4, -0.6],
  ];

  return (
    <group ref={group}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          {mat}
        </mesh>
      ))}
      {/* Connection lines between nodes */}
      {positions.slice(1).map((pos, i) => {
        const start = new THREE.Vector3(...positions[0]);
        const end = new THREE.Vector3(...pos);
        const mid = start.clone().lerp(end, 0.5);
        const dir = end.clone().sub(start);
        const len = dir.length();
        return (
          <mesh key={`line-${i}`} position={[mid.x, mid.y, mid.z]}>
            <cylinderGeometry args={[0.008, 0.008, len, 4]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

/* BI Financial API → Stacked data discs (database/analytics) */
function DataStack() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={group}>
      {[0.6, 0.2, -0.2, -0.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[0.7 - i * 0.05, 0.7 - i * 0.05, 0.15, 24]} />
          <meshBasicMaterial
            color={i === 0 ? "#10b981" : "#6366f1"}
            wireframe
            transparent
            opacity={0.4 - i * 0.05}
          />
        </mesh>
      ))}
      {/* Data pulse ring */}
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.01, 8, 32]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

/* DataCentral & Landing Pages → Globe with grid (web/global) */
function WebGlobe() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.25;
      group.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.75, 24, 24]} />
        <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.15} />
      </mesh>
      {/* Latitude rings */}
      {[-0.35, 0, 0.35].map((y, i) => {
        const r = Math.sqrt(0.75 * 0.75 - y * y);
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.008, 8, 32]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.4} />
          </mesh>
        );
      })}
      {/* Orbiting dot */}
      <mesh position={[0.9, 0, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
    </group>
  );
}

function ProjectScene({ index }: { index: number }) {
  const scenes = [InfraCluster, DataStack, WebGlobe];
  const SceneComponent = scenes[index] || InfraCluster;
  return (
    <>
      <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.3}>
        <SceneComponent />
      </Float>
      <ambientLight intensity={0.6} />
    </>
  );
}

export function ProjectIcon3D({ index }: { index: number }) {
  return (
    <div className="h-28 w-28 shrink-0 sm:h-32 sm:w-32" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ProjectScene index={index} />
      </Canvas>
    </div>
  );
}
