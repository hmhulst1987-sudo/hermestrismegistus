"use client";

import { Caduceus } from "./Caduceus";
import { Stars } from "./Stars";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/**
 * Master 3D timeline driven by global scroll progress (0..1).
 * Scenes appear/disappear by lerping group positions and visibility windows.
 */
export function Scenes() {
  const heroRef = useRef<THREE.Group>(null!);
  const progress = useScrollProgress();

  useFrame(() => {
    if (heroRef.current) {
      // hero zooms forward and fades as user scrolls past first viewport
      const p = progress.current;
      const t = Math.min(1, p * 7); // hero owns first 1/7 of page
      heroRef.current.position.z = THREE.MathUtils.lerp(0, 5, t);
      heroRef.current.rotation.x = THREE.MathUtils.lerp(0, -0.4, t);
      heroRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.6, t));
    }
  });

  return (
    <>
      <Stars />
      <group ref={heroRef}>
        <Caduceus />
      </group>
    </>
  );
}
