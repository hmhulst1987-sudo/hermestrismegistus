"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Pyramid, PYRAMID_APEX_Y } from "./Pyramid";
import { Capstone } from "./Capstone";
import { Thoth } from "./Thoth";

/**
 * Full pyramid scene composition.
 * Camera orbits + dollies based on scroll progress (0..1).
 *
 * Camera curve:
 *   p=0    : far back, slightly above ground, looking up at empty desert
 *   p=0.15 : starts orbiting around the rising base
 *   p=0.50 : circling at mid-pyramid height
 *   p=0.85 : pulling back so capstone descent is visible
 *   p=0.95 : begins flight forward into north entrance
 *   p=1.0  : camera inside, transitions to /sanctum
 */
export function PyramidScene({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  return (
    <group>
      <Pyramid progressRef={progressRef} />
      <Capstone progressRef={progressRef} apexY={PYRAMID_APEX_Y / 2 + 0.1} />
      <Thoth progressRef={progressRef} />
      <CameraRig progressRef={progressRef} />
    </group>
  );
}

function CameraRig({ progressRef }: { progressRef: React.RefObject<number> }) {
  const targetVec = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    const cam = state.camera;

    // orbit angle increases with progress (0 → ~PI*0.7)
    const angle = THREE.MathUtils.lerp(-0.4, 1.6, p);

    // distance: start far, mid, then pull back, then dive in
    let dist = 16;
    if (p < 0.15) dist = THREE.MathUtils.lerp(20, 14, p / 0.15);
    else if (p < 0.5) dist = THREE.MathUtils.lerp(14, 10, (p - 0.15) / 0.35);
    else if (p < 0.85) dist = THREE.MathUtils.lerp(10, 12, (p - 0.5) / 0.35);
    else if (p < 0.95) dist = THREE.MathUtils.lerp(12, 8, (p - 0.85) / 0.1);
    else dist = THREE.MathUtils.lerp(8, 1.5, (p - 0.95) / 0.05); // dive

    // camera height: lifts as pyramid grows
    const height = THREE.MathUtils.lerp(2, 4, Math.min(1, p * 1.3));

    const x = Math.sin(angle) * dist;
    const z = Math.cos(angle) * dist;

    cam.position.set(x, height, z);

    // look-at target shifts up toward apex as build progresses
    const lookY = THREE.MathUtils.lerp(0, PYRAMID_APEX_Y / 2, Math.min(1, p * 1.2));
    targetVec.current.set(0, lookY, 0);

    // during dive, narrow look toward the entrance
    if (p > 0.92) {
      const dive = (p - 0.92) / 0.08;
      targetVec.current.lerp(new THREE.Vector3(0, 1.2, 0), dive);
    }

    cam.lookAt(targetVec.current);
  });

  return null;
}
