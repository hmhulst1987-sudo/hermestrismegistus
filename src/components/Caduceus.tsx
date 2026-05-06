"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/**
 * Placeholder Caduceus — staff with two helical snakes + wings.
 * Replace later with proper glTF model.
 */
export function Caduceus() {
  const group = useRef<THREE.Group>(null!);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.15;
  });

  // build helical snake points
  const snake = (offset: number) => {
    const pts: THREE.Vector3[] = [];
    const turns = 4;
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2 * turns + offset;
      pts.push(new THREE.Vector3(Math.cos(angle) * 0.35, t * 3 - 1.5, Math.sin(angle) * 0.35));
    }
    return new THREE.CatmullRomCurve3(pts);
  };

  return (
    <group ref={group}>
      {/* central staff */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 3, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
      </mesh>

      {/* two helical snakes */}
      <mesh>
        <tubeGeometry args={[snake(0), 200, 0.04, 12, false]} />
        <meshStandardMaterial color="#2fa28a" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh>
        <tubeGeometry args={[snake(Math.PI), 200, 0.04, 12, false]} />
        <meshStandardMaterial color="#2fa28a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* wings (stylized planes) */}
      <mesh position={[0.4, 1.5, 0]} rotation={[0, 0, -0.3]}>
        <planeGeometry args={[0.8, 0.3]} />
        <meshStandardMaterial color="#f5d76e" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.4, 1.5, 0]} rotation={[0, 0, 0.3]}>
        <planeGeometry args={[0.8, 0.3]} />
        <meshStandardMaterial color="#f5d76e" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} transparent opacity={0.85} />
      </mesh>

      {/* orb on top */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#f5d76e" emissive="#d4af37" emissiveIntensity={0.6} metalness={1} roughness={0.1} />
      </mesh>
    </group>
  );
}
