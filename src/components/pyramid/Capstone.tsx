"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { TextureLoader, SRGBColorSpace } from "three";

/**
 * Gold capstone with all-seeing eye. Lands in final 10% of build progress.
 * Renders as textured plane facing camera (billboarded) for best PNG fidelity.
 *
 * Below ~0.9 progress: hovers above pyramid, slowly rotating, faint glow.
 * 0.9 → 1.0: descends, scales down, settles on apex with bloom flash.
 */
export function Capstone({
  progressRef,
  apexY,
}: {
  progressRef: React.RefObject<number>;
  apexY: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);

  const tex = useLoader(TextureLoader, "/images/capstone-eye.png");
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    const land = THREE.MathUtils.clamp((p - 0.85) / 0.15, 0, 1);
    const ease = 1 - Math.pow(1 - land, 3);

    // hover height drops as land progresses
    const hoverY = apexY + 4;
    const finalY = apexY - 0.1;
    const y = THREE.MathUtils.lerp(hoverY, finalY, ease);

    // scale grows slightly on landing
    const scale = THREE.MathUtils.lerp(1.5, 1.2, ease);

    if (groupRef.current) {
      groupRef.current.position.y = y;
      groupRef.current.scale.setScalar(scale);

      // gentle hover sway before landing
      const sway = (1 - ease) * 0.15;
      groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * sway;
      groupRef.current.rotation.y = state.clock.elapsedTime * (0.3 - ease * 0.25);
    }

    if (haloRef.current) {
      const haloIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1 + ease * 0.6;
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity = haloIntensity;
    }
  });

  return (
    <group ref={groupRef}>
      {/* glow halo behind */}
      <mesh ref={haloRef} position={[0, 0, -0.05]}>
        <circleGeometry args={[2.4, 32]} />
        <meshBasicMaterial color="#f5d76e" transparent opacity={0.4} depthWrite={false} />
      </mesh>

      {/* the capstone PNG, billboarded */}
      <mesh>
        <planeGeometry args={[2.2, 2.2]} />
        <meshStandardMaterial
          map={tex}
          transparent
          alphaTest={0.05}
          side={THREE.DoubleSide}
          metalness={0.3}
          roughness={0.4}
          emissive="#d4af37"
          emissiveMap={tex}
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  );
}
