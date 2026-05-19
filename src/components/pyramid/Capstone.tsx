"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { TextureLoader, SRGBColorSpace } from "three";

/**
 * Gold capstone with all-seeing eye.
 * Adjusted size to perfectly crown the top layer of blocks.
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

  const geom = useMemo(() => {
    const size = 0.42; // half-width at base (fits exactly onto the 0.8x0.8 top block)
    const height = 0.6; // height of the capstone

    const apex = [0, height / 2, 0];
    const v0 = [-size, -height / 2, size];
    const v1 = [size, -height / 2, size];
    const v2 = [size, -height / 2, -size];
    const v3 = [-size, -height / 2, -size];

    const faces = [
      [v0, v1, apex], // front
      [v1, v2, apex], // right
      [v2, v3, apex], // back
      [v3, v0, apex], // left
    ];

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];

    faces.forEach(([a, b, c]) => {
      const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2];
      const bx = c[0] - a[0], by = c[1] - a[1], bz = c[2] - a[2];
      const nx = ay * bz - az * by;
      const ny = az * bx - ax * bz;
      const nz = ax * by - ay * bx;
      const len = Math.hypot(nx, ny, nz);
      const n = [nx / len, ny / len, nz / len];

      positions.push(...a, ...b, ...c);
      normals.push(...n, ...n, ...n);
      uvs.push(0, 0, 1, 0, 0.5, 1);
    });

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    return g;
  }, []);

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    const land = THREE.MathUtils.clamp((p - 0.82) / 0.18, 0, 1);
    const ease = 1 - Math.pow(1 - land, 3);

    const hoverY = apexY + 3;
    const finalY = apexY + 0.3; // Correct height offset to rest on the block
    const y = THREE.MathUtils.lerp(hoverY, finalY, ease);

    const scale = THREE.MathUtils.lerp(1.0, 1.0, ease);

    if (groupRef.current) {
      groupRef.current.position.y = y;
      groupRef.current.scale.setScalar(scale);

      const sway = (1 - ease) * 0.2;
      groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * sway;
      groupRef.current.rotation.y = state.clock.elapsedTime * (0.4 - ease * 0.35);
    }

    if (haloRef.current) {
      const haloIntensity = 0.25 + Math.sin(state.clock.elapsedTime * 1.5) * 0.08 + ease * 0.5;
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity = haloIntensity;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={haloRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshBasicMaterial
          color="#f5d76e"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh geometry={geom} castShadow>
        <meshStandardMaterial
          map={tex}
          color="#ffd700"
          metalness={0.4}
          roughness={0.5}
          emissive="#6b4f10"
          emissiveMap={tex}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}
