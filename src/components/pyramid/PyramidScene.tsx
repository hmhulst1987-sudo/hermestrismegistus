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
      {/* Procedural Egyptian sky — no CDN fetch, instant render */}
      <DesertSky progressRef={progressRef} />
      <NightSky progressRef={progressRef} />

      {/* Khafre + Menkaure on the horizon */}
      <DistantPyramids />

      <DesertGround />
      <group position={[0, -PYRAMID_DROP, 0]}>
        <Pyramid progressRef={progressRef} />
        <Capstone progressRef={progressRef} apexY={PYRAMID_APEX_Y / 2 + 0.1} />
        <InnerChamber />
      </group>
      <CameraRig progressRef={progressRef} />
    </group>
  );
}

function InnerChamber() {
  const FLOOR_WORLD_Y = -(PYRAMID_APEX_Y / 2);
  
  // Create an atmospheric light in the center of the chamber
  return (
    <group position={[0, FLOOR_WORLD_Y + 0.5, 0]}>
      {/* Dim point light illuminating the ark */}
      <pointLight position={[0, 1.5, 0]} intensity={0.8} color="#f5d76e" distance={5} />
      
      {/* Floor seal */}
      <DreiImage
        url="/images/seal-floor-engraved.png"
        transparent
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1.5, 1.5]}
        opacity={0.6}
      />
      
      {/* The Ark of the Covenant */}
      <DreiImage
        url="/images/ark-covenant.png"
        transparent
        position={[0, 0.6, 0]}
        rotation={[0, Math.PI / 2, 0]} // Face the +X axis (camera)
        scale={[1.2, 1.2]}
      />
      
      {/* Dead Sea Scrolls on walls (left and right from camera perspective) */}
      {/* Camera is looking down -X, so left is -Z and right is +Z */}
      <DreiImage
        url="/images/dead-sea-scroll.png"
        transparent
        position={[0, 1.2, -1.6]} // Left wall
        rotation={[0, 0, 0]} // Faces +Z, so it faces inward
        scale={[1.0, 0.5]}
        opacity={0.8}
      />
      <DreiImage
        url="/images/dead-sea-scroll.png"
        transparent
        position={[0, 1.2, 1.6]} // Right wall
        rotation={[0, Math.PI, 0]} // Faces -Z, so it faces inward
        scale={[-1.0, 0.5]} // flipped horizontally
        opacity={0.8}
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
