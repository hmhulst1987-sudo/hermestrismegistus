"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { TextureLoader, SRGBColorSpace } from "three";

/**
 * Thoth as a billboarded sprite at the side of the pyramid scene.
 * Side-writing pose — represents the divine architect recording the build.
 * Subtle bob + slight x-drift as user scrolls.
 */
export function Thoth({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const tex = useLoader(TextureLoader, "/images/thoth-side-writing.png");
  tex.colorSpace = SRGBColorSpace;

  // image aspect ~16:9 (1600x900) but content fills left third
  // use a wide plane so character occupies left of frame, transparent rest doesn't matter
  const W = 7;
  const H = (W * 900) / 1600;

  useFrame((state) => {
    if (!ref.current) return;
    const p = progressRef.current ?? 0;
    // fade in from p=0.05, hold, fade out from p=0.85
    const fadeIn = THREE.MathUtils.smoothstep(p, 0.05, 0.18);
    const fadeOut = 1 - THREE.MathUtils.smoothstep(p, 0.82, 0.95);
    const alpha = fadeIn * fadeOut;
    (ref.current.material as THREE.MeshBasicMaterial).opacity = alpha * 0.95;

    // gentle bob
    const t = state.clock.elapsedTime;
    ref.current.position.y = -1 + Math.sin(t * 0.6) * 0.08;
    // slight rotation toward pyramid
    ref.current.rotation.y = -0.15 + Math.sin(t * 0.4) * 0.04;
  });

  return (
    <mesh ref={ref} position={[-7, -1, 2]} rotation={[0, -0.15, 0]}>
      <planeGeometry args={[W, H]} />
      <meshBasicMaterial
        map={tex}
        transparent
        alphaTest={0.02}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
