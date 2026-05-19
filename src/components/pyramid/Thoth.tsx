"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { PYRAMID_APEX_Y } from "./Pyramid";

/**
 * Procedural Thoth — divine architect, ibis-headed, holding the was-staff.
 *
 * Built from primitives (no PNG, no GLTF) so it always renders cleanly,
 * scales with the scene, and can be tweaked in code. Reads as a hieratic
 * silhouette rather than a photoreal figure — fits the symbolic register
 * of the build sequence better than a cut-out portrait.
 *
 * Composition (top to bottom):
 *   - subtle additive halo behind head
 *   - ibis head: dark sphere + long curved beak (TubeGeometry over Bezier)
 *   - linen-robe body: tall narrow cone, gold band at hips
 *   - was-staff in right hand: shaft + ankh loop on top
 *
 * Behaviour:
 *   p<0.05      hidden
 *   0.05→0.18   fades in, settles into stance
 *   0.18→0.80   present, slow sway + slight head tilt toward apex
 *   0.80→0.92   fades out as camera prepares to dive entrance
 */
export function Thoth({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const headRef = useRef<THREE.Group>(null!);

  // beak as a TubeGeometry along a quadratic Bezier — long, down-curved ibis profile
  const beakGeom = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.45, -0.05, 0),
      new THREE.Vector3(0.85, -0.32, 0)
    );
    return new THREE.TubeGeometry(curve, 24, 0.045, 10, false);
  }, []);

  // ankh loop on top of staff — torus stretched into oval, with crossbar + stem
  // (built as separate mesh group below for clarity)

  // master opacity per material — set via traversal each frame
  const opacityRef = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    const p = progressRef.current ?? 0;

    const fadeIn = THREE.MathUtils.smoothstep(p, 0.05, 0.18);
    const fadeOut = 1 - THREE.MathUtils.smoothstep(p, 0.80, 0.92);
    const alpha = fadeIn * fadeOut;
    opacityRef.current = alpha;

    // apply opacity to every mesh material in the group
    groupRef.current.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mat = (obj as THREE.Mesh).material as THREE.Material & {
          opacity?: number;
        };
        if (mat && "opacity" in mat) {
          mat.opacity = alpha * (mat.userData.baseOpacity ?? 1);
          mat.transparent = true;
        }
      }
    });

    // subtle sway
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = (-PYRAMID_APEX_Y / 2) + Math.sin(t * 0.5) * 0.04;
    groupRef.current.rotation.y = -0.25 + Math.sin(t * 0.3) * 0.03;

    // head tracks pyramid apex subtly — tilts up slowly as build rises
    if (headRef.current) {
      const lookUp = THREE.MathUtils.lerp(-0.1, -0.32, p);
      headRef.current.rotation.x = lookUp + Math.sin(t * 0.6) * 0.02;
    }

    // halo pulse
    if (haloRef.current) {
      const pulse = 0.35 + Math.sin(t * 1.2) * 0.08;
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = alpha * pulse;
    }
  });

  // colors
  const LINEN = "#e8d8a8";
  const GOLD = "#d4a83a";
  const SKIN_DARK = "#2a1a10";
  const BEAK_LIGHT = "#f0e6c8";

  return (
    <group ref={groupRef} position={[-9, -PYRAMID_APEX_Y / 2, 1.5]}>
      {/* ROBE — tall tapered cone, narrower at top */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <coneGeometry args={[0.85, 3.4, 24, 1, true]} />
        <meshStandardMaterial
          color={LINEN}
          roughness={0.85}
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* gold belt at hips */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <torusGeometry args={[0.55, 0.08, 12, 32]} />
        <meshStandardMaterial color={GOLD} roughness={0.3} metalness={0.85} />
      </mesh>

      {/* gold pectoral collar at shoulders */}
      <mesh position={[0, 3.25, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.32, 0.06, 10, 28]} />
        <meshStandardMaterial color={GOLD} roughness={0.3} metalness={0.85} />
      </mesh>

      {/* shoulders — flattened sphere */}
      <mesh position={[0, 3.4, 0]} scale={[0.55, 0.22, 0.4]} castShadow>
        <sphereGeometry args={[1, 18, 14]} />
        <meshStandardMaterial color={LINEN} roughness={0.85} />
      </mesh>

      {/* neck */}
      <mesh position={[0, 3.6, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.13, 0.18, 12]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.7} />
      </mesh>

      {/* HEAD GROUP — ibis */}
      <group ref={headRef} position={[0, 3.85, 0]}>
        {/* skull — small dark sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.22, 20, 16]} />
          <meshStandardMaterial color={SKIN_DARK} roughness={0.6} />
        </mesh>

        {/* ibis beak — curved tube extending forward+down */}
        <mesh
          geometry={beakGeom}
          position={[0.05, -0.02, 0]}
          rotation={[0, 0, 0]}
          castShadow
        >
          <meshStandardMaterial color={BEAK_LIGHT} roughness={0.5} />
        </mesh>

        {/* eye dot — small emissive sphere on side of head */}
        <mesh position={[0.12, 0.06, 0.16]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial
            color="#ffd76a"
            emissive="#ffaa1a"
            emissiveIntensity={2}
          />
        </mesh>

        {/* halo — additive disc behind head */}
        <mesh ref={haloRef} position={[0, 0, -0.4]}>
          <circleGeometry args={[0.95, 32]} />
          <meshBasicMaterial
            color="#f5d76e"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* WAS-STAFF — held in right hand, ankh on top */}
      <group position={[0.65, 1.6, 0]} rotation={[0, 0, -0.05]}>
        {/* shaft */}
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.045, 4.6, 10]} />
          <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.8} />
        </mesh>
        {/* ankh loop */}
        <mesh position={[0, 2.55, 0]}>
          <torusGeometry args={[0.18, 0.045, 10, 28]} />
          <meshStandardMaterial color={GOLD} roughness={0.3} metalness={0.85} />
        </mesh>
        {/* ankh crossbar */}
        <mesh position={[0, 2.32, 0]}>
          <boxGeometry args={[0.42, 0.05, 0.05]} />
          <meshStandardMaterial color={GOLD} roughness={0.3} metalness={0.85} />
        </mesh>
      </group>
    </group>
  );
}
