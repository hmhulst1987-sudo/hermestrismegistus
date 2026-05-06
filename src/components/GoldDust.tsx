"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Slow-drifting gold particle field. Adds atmospheric depth across all scenes.
 * Particles slowly rise + spiral, recycle when out of bounds.
 */
export function GoldDust({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const { positions, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
      speeds[i] = 0.04 + Math.random() * 0.12;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, speeds, phases };
  }, [count]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      arr[ix + 1] += speeds[i] * dt;
      arr[ix + 0] += Math.sin(phases[i] + arr[ix + 1] * 0.3) * dt * 0.05;
      if (arr[ix + 1] > 9) {
        arr[ix + 1] = -9;
        arr[ix + 0] = (Math.random() - 0.5) * 18;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#f5d76e"
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
