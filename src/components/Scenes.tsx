"use client";

import { Stars } from "./Stars";
import { GoldDust } from "./GoldDust";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/**
 * Ambient cosmic environment. No hero geometry — the hero is HTML (the seal PNG).
 * The canvas only provides depth/atmosphere across all sections.
 */
export function Scenes() {
  const tilt = useRef<THREE.Group>(null!);
  const progress = useScrollProgress();

  useFrame(() => {
    if (tilt.current) {
      // very subtle parallax tilt as user scrolls
      const p = progress.current;
      tilt.current.rotation.y = THREE.MathUtils.lerp(tilt.current.rotation.y, p * 0.4, 0.05);
      tilt.current.rotation.x = THREE.MathUtils.lerp(tilt.current.rotation.x, p * 0.15, 0.05);
    }
  });

  return (
    <group ref={tilt}>
      <Stars />
      <GoldDust count={600} />
    </group>
  );
}
