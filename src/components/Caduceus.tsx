"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Procedural Caduceus modeled after the Walburg Pers "Hermes Trismegistus" cover.
 * All gold. PBR materials rely on Environment HDRI in Scene3D for proper reflections.
 *
 * Layout (group local space, scale 1):
 *   y in [-1.0 .. 1.0]   total height ~2.0
 *   wings span x ±1.4    above the snake heads at y≈0.85
 *   orb at top at y≈1.05
 */

const GOLD_DEEP = "#a17a1f";
const GOLD = "#d4af37";
const GOLD_BRIGHT = "#f5d76e";

function snakeCurve(phase: number, turns = 3, height = 1.5, yOffset = -0.1): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const segs = 240;
  const radius = 0.18;
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const angle = t * Math.PI * 2 * turns + phase;
    pts.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        t * height - height / 2 + yOffset,
        Math.sin(angle) * radius
      )
    );
  }
  return new THREE.CatmullRomCurve3(pts);
}

function featherShape(length: number, width: number): THREE.Shape {
  // single feather: pointed tip at -length, root at 0, gentle curve
  const s = new THREE.Shape();
  const w = width / 2;
  s.moveTo(0, -w);
  s.quadraticCurveTo(-length * 0.45, -w * 1.1, -length, 0);
  s.quadraticCurveTo(-length * 0.45, w * 1.1, 0, w);
  s.lineTo(0, -w);
  return s;
}

export function Caduceus() {
  const group = useRef<THREE.Group>(null!);

  // ============= materials =============
  const goldMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: GOLD,
        metalness: 1,
        roughness: 0.22,
        clearcoat: 0.5,
        clearcoatRoughness: 0.15,
        envMapIntensity: 1.4,
      }),
    []
  );

  const goldBrightMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: GOLD_BRIGHT,
        metalness: 1,
        roughness: 0.16,
        clearcoat: 0.7,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.6,
        emissive: GOLD_DEEP,
        emissiveIntensity: 0.08,
      }),
    []
  );

  // ============= geometries =============
  const snakeA = useMemo(() => snakeCurve(0), []);
  const snakeB = useMemo(() => snakeCurve(Math.PI), []);

  // single feather geometry (re-used many times)
  // shorter, fatter feathers — angel-wing style, not eagle-fan
  const featherGeoms = useMemo(() => {
    const lengths = [0.78, 0.72, 0.64, 0.55, 0.46, 0.36];
    const widths = [0.16, 0.16, 0.15, 0.14, 0.12, 0.1];
    return lengths.map((len, i) => {
      const g = new THREE.ExtrudeGeometry(featherShape(len, widths[i]), {
        depth: 0.045,
        bevelEnabled: true,
        bevelThickness: 0.014,
        bevelSize: 0.014,
        bevelSegments: 2,
      });
      g.translate(0, 0, -0.022);
      return g;
    });
  }, []);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.18;
  });

  // wing fan: 6 feathers per side, strong upward curl matching angel-wing reference
  // outer feathers nearly vertical, inner feathers near horizontal
  const featherFan = (side: 1 | -1) =>
    featherGeoms.map((geom, i) => {
      const t = i / (featherGeoms.length - 1); // 0 root (inner) .. 1 outer
      // angle from horizontal: 0.1 rad inner → 1.25 rad (~72°) outer = strong upward curl
      const angle = THREE.MathUtils.lerp(0.1, 1.25, t) * side;
      // forward stagger so feathers don't z-fight
      const z = -i * 0.014;
      // tighter root cluster — feathers radiate from compact base near the staff
      const x = side * (0.05 + t * 0.02);
      const y = i * 0.012;
      return (
        <mesh
          key={i}
          geometry={geom}
          material={goldBrightMat}
          position={[x, y, z]}
          rotation={[0, side === 1 ? Math.PI : 0, angle]}
          castShadow
        />
      );
    });

  return (
    <group ref={group} position={[0, 0.15, 0]} scale={0.85}>
      {/* ============== STAFF ============== */}
      <mesh material={goldMat} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2.0, 32]} />
      </mesh>

      {/* bottom finial */}
      <mesh position={[0, -1.06, 0]} material={goldBrightMat}>
        <sphereGeometry args={[0.075, 24, 24]} />
      </mesh>
      <mesh position={[0, -0.99, 0]} material={goldMat}>
        <cylinderGeometry args={[0.052, 0.06, 0.08, 16]} />
      </mesh>

      {/* top collar (where wings attach) */}
      <mesh position={[0, 0.78, 0]} material={goldBrightMat}>
        <cylinderGeometry args={[0.075, 0.075, 0.05, 24]} />
      </mesh>
      <mesh position={[0, 0.84, 0]} material={goldMat}>
        <cylinderGeometry args={[0.062, 0.082, 0.04, 24]} />
      </mesh>

      {/* ============== SNAKES ============== */}
      <mesh material={goldMat} castShadow>
        <tubeGeometry args={[snakeA, 260, 0.038, 16, false]} />
      </mesh>
      <mesh material={goldMat} castShadow>
        <tubeGeometry args={[snakeB, 260, 0.038, 16, false]} />
      </mesh>

      <SnakeHead curve={snakeA} mat={goldBrightMat} />
      <SnakeHead curve={snakeB} mat={goldBrightMat} />

      {/* ============== WINGS ============== */}
      <group position={[0, 0.88, 0]}>
        {featherFan(-1)}
        {featherFan(1)}
      </group>

      {/* ============== ORB + HALO ============== */}
      <mesh position={[0, 1.02, 0]} material={goldBrightMat} castShadow>
        <sphereGeometry args={[0.085, 32, 32]} />
      </mesh>
      <mesh position={[0, 1.02, -0.001]}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh position={[0, 1.02, -0.002]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.06} depthWrite={false} />
      </mesh>
    </group>
  );
}

function SnakeHead({
  curve,
  mat,
}: {
  curve: THREE.CatmullRomCurve3;
  mat: THREE.Material;
}) {
  const { pos, quat } = useMemo(() => {
    const p = curve.getPoint(0.985);
    const t = curve.getTangent(0.985).normalize();
    // tilt head slightly toward center (inward)
    const inward = new THREE.Vector3(-p.x, 0, -p.z).normalize().multiplyScalar(0.4);
    t.add(inward).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(up, t);
    return { pos: p, quat: q };
  }, [curve]);

  return (
    <group position={pos} quaternion={quat}>
      <mesh material={mat} position={[0, 0.05, 0]}>
        <coneGeometry args={[0.055, 0.13, 14]} />
      </mesh>
      {/* eye sockets */}
      <mesh position={[0.028, 0.06, 0.04]}>
        <sphereGeometry args={[0.009, 10, 10]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[-0.028, 0.06, 0.04]}>
        <sphereGeometry args={[0.009, 10, 10]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
      {/* tongue forked tip */}
      <mesh position={[0, 0.13, 0.02]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.008, 0.04, 6]} />
        <meshStandardMaterial color="#7a1f1f" />
      </mesh>
    </group>
  );
}
