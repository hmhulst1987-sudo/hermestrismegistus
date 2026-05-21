"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Pyramid, PYRAMID_APEX_Y } from "./Pyramid";

// How many world units the pyramid sits lower than the mathematical centre.
// Increase to sink it further into the ground, decrease to raise it.
const PYRAMID_DROP = 2.5;
import { Capstone } from "./Capstone";
import { DesertGround } from "./DesertGround";
import { DesertSky } from "./DesertSky";
import { NightSky } from "./NightSky";
import { DistantPyramids } from "./DistantPyramids";
import { Image as DreiImage } from "@react-three/drei";

/**
 * Full pyramid scene composition.
 * Camera orbits + dollies based on scroll progress (0..1).
 */
export function PyramidScene({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  return (
    <group>
      {/* Sky now comes from HDR Environment in Scene3D — procedurals disabled.
          NightSky still adds stars overlay near apex transition. */}
      {/* <DesertSky progressRef={progressRef} /> */}
      <NightSky progressRef={progressRef} />

      {/* Khafre + Menkaure on the horizon */}
      <DistantPyramids />

      <DesertGround />
      <group position={[0, -PYRAMID_DROP, 0]}>
        <Pyramid progressRef={progressRef} />
        <Capstone progressRef={progressRef} apexY={PYRAMID_APEX_Y / 2 + 0.1} />
        <InnerChamber progressRef={progressRef} />
      </group>
      <CameraRig progressRef={progressRef} />
    </group>
  );
}

function InnerChamber({ progressRef }: { progressRef: React.RefObject<number> }) {
  const FLOOR_WORLD_Y = -(PYRAMID_APEX_Y / 2);
  const groupRef = useRef<THREE.Group>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const arkRef = useRef<THREE.Mesh>(null!);
  const sealRef = useRef<THREE.Mesh>(null!);
  const scrollLRef = useRef<THREE.Mesh>(null!);
  const scrollRRef = useRef<THREE.Mesh>(null!);

  // Fade chamber in only as the camera approaches the tunnel (p > 0.85)
  useFrame(() => {
    const p = progressRef.current ?? 0;
    const fade = THREE.MathUtils.clamp((p - 0.85) / 0.10, 0, 1);
    const visible = fade > 0.001;
    if (groupRef.current) groupRef.current.visible = visible;
    if (lightRef.current) lightRef.current.intensity = fade * 0.8;
    const setOp = (m: THREE.Mesh | null, base: number) => {
      if (!m) return;
      const mat = m.material as THREE.MeshBasicMaterial | THREE.MeshStandardMaterial;
      if (mat) {
        mat.transparent = true;
        mat.opacity = fade * base;
      }
    };
    setOp(arkRef.current, 1.0);
    setOp(sealRef.current, 0.6);
    setOp(scrollLRef.current, 0.8);
    setOp(scrollRRef.current, 0.8);
  });

  return (
    <group ref={groupRef} position={[0, FLOOR_WORLD_Y + 0.5, 0]} visible={false}>
      <pointLight ref={lightRef} position={[0, 1.5, 0]} intensity={0} color="#f5d76e" distance={5} />

      <DreiImage
        ref={sealRef}
        url="/images/seal-floor-engraved.png"
        transparent
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1.5, 1.5]}
        opacity={0}
      />

      <DreiImage
        ref={arkRef}
        url="/images/ark-covenant.png"
        transparent
        position={[0, 0.6, 0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[1.2, 1.2]}
        opacity={0}
      />

      <DreiImage
        ref={scrollLRef}
        url="/images/dead-sea-scroll.png"
        transparent
        position={[0, 1.2, -1.6]}
        rotation={[0, 0, 0]}
        scale={[1.0, 0.5]}
        opacity={0}
      />
      <DreiImage
        ref={scrollRRef}
        url="/images/dead-sea-scroll.png"
        transparent
        position={[0, 1.2, 1.6]}
        rotation={[0, Math.PI, 0]}
        scale={[-1.0, 0.5]}
        opacity={0}
      />
    </group>
  );
}

function CameraRig({ progressRef }: { progressRef: React.RefObject<number> }) {
  const targetVec = useRef(new THREE.Vector3(0, 0, 0));

  const APEX_WORLD_Y = PYRAMID_APEX_Y / 2 - PYRAMID_DROP;
  const FLOOR_WORLD_Y = -(PYRAMID_APEX_Y / 2) - PYRAMID_DROP;
  const MID_WORLD_Y = -PYRAMID_DROP;

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    const cam = state.camera;

    // orbit angle 0 → ~96° around pyramid
    const angle = THREE.MathUtils.lerp(-0.4, 1.6, p);

    let dist = 30;
    if (p < 0.15) dist = THREE.MathUtils.lerp(45, 30, p / 0.15);
    else if (p < 0.5) dist = THREE.MathUtils.lerp(30, 22, (p - 0.15) / 0.35);
    else if (p < 0.82) dist = THREE.MathUtils.lerp(22, 35, (p - 0.5) / 0.32);
    else if (p < 0.92) dist = THREE.MathUtils.lerp(35, 18, (p - 0.82) / 0.10); 
    else dist = THREE.MathUtils.lerp(18, 4.5, (p - 0.92) / 0.08); // dive deep into the tunnel, but stay back enough to see it

    // camera height rises subtly as pyramid grows, then dives down to the entrance
    let height = THREE.MathUtils.lerp(MID_WORLD_Y - 0.5, APEX_WORLD_Y + 1, Math.min(1, p / 0.82));
    if (p > 0.92) {
        const dive = (p - 0.92) / 0.08;
        // smooth step down to the ground level entrance
        const ease = dive * dive * (3 - 2 * dive); 
        height = THREE.MathUtils.lerp(height, FLOOR_WORLD_Y + 1.2, ease); // slightly higher than 0.5 so we look slightly down
    }

    const x = Math.sin(angle) * dist;
    const z = Math.cos(angle) * dist;

    cam.position.set(x, height, z);

    // look-target starts low, goes up with pyramid, then drops to look inside the tunnel
    let lookY = THREE.MathUtils.lerp(FLOOR_WORLD_Y * 0.3, APEX_WORLD_Y * 0.9, Math.min(1, p / 0.82));
    if (p > 0.92) {
      const dive = (p - 0.92) / 0.08;
      const ease = dive * dive * (3 - 2 * dive);
      lookY = THREE.MathUtils.lerp(lookY, FLOOR_WORLD_Y + 0.5, ease);
    }
    
    // As we dive, shift the look target slightly into the pyramid to stare down the hallway
    targetVec.current.set(0, lookY, 0);

    cam.lookAt(targetVec.current);
  });

  return null;
}
