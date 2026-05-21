"use client";

import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader, RepeatWrapping, SRGBColorSpace } from "three";
import { PYRAMID_APEX_Y } from "./Pyramid";

/**
 * Giza horizon silhouettes — Khafre, Menkaure, and a small queen's pyramid
 * cluster. Now built from layered stepped courses with sandstone texture,
 * proper scale, and ambient sandstone color so fog can blend them into the
 * HDR sky horizon.
 *
 * Each pyramid is composed of stacked thin frustum slices (so it reads as
 * "constructed of stone courses" not "cardboard cone"), but the top is a
 * smooth pyramid cap.
 */

const GROUND_Y = -PYRAMID_APEX_Y / 2;

type PyramidDef = {
  x: number;
  z: number;
  width: number;
  height: number;
  rotY?: number;
  isQueens?: boolean;
};

const DISTANT: PyramidDef[] = [
  // Khafre — taller, with original limestone cap conceit
  { x: 36, z: -54, width: 22, height: 18 },
  // Menkaure — smaller, southwest further
  { x: 70, z: -84, width: 14, height: 11 },
  // A queen's pyramid cluster — three small ones at angles
  { x: 84, z: -72, width: 4, height: 3.2, isQueens: true },
  { x: 80, z: -66, width: 3.5, height: 2.8, isQueens: true },
  { x: 76, z: -62, width: 3, height: 2.4, isQueens: true },
];

/**
 * Build a stepped pyramid as a stack of thin cones (frustum slices).
 * Each slice is a frustum (4-sided truncated pyramid) so the silhouette
 * is unmistakably Egyptian even from far away. 28 courses gives nice
 * stepped sandstone-block detail when viewed close, blends to smooth from
 * far due to atmospheric perspective + fog.
 */
function makeSteppedPyramidGeom(w: number, h: number, courses = 28, seed = 1): THREE.BufferGeometry {
  const hw = w / 2;
  const positions: number[] = [];
  const indices: number[] = [];
  const uvs: number[] = [];
  const colors: number[] = [];

  // Simple deterministic noise per course for weathering darkness variation
  const noise = (i: number) => {
    const s = Math.sin(i * 12.97 + seed * 31.13) * 43758.5453;
    return s - Math.floor(s);
  };

  for (let c = 0; c < courses; c++) {
    const t0 = c / courses;
    const t1 = (c + 1) / courses;
    const y0 = t0 * h;
    const y1 = t1 * h;
    const r0 = hw * (1 - t0);
    const r1 = hw * (1 - t1);

    // weathering: top courses slightly more eroded (darker, less saturated)
    const erosion = 0.85 + noise(c) * 0.18; // 0.85..1.03
    const topErosion = 0.9 + 0.1 * (1 - t0); // bottom slightly warmer than top
    const tint = erosion * topErosion;

    const idx = positions.length / 3;
    positions.push(
      -r0, y0,  r0,   r0, y0,  r0,   r0, y0, -r0,  -r0, y0, -r0,
      -r1, y1,  r1,   r1, y1,  r1,   r1, y1, -r1,  -r1, y1, -r1,
    );
    uvs.push(0, t0, 1, t0, 2, t0, 3, t0, 0, t1, 1, t1, 2, t1, 3, t1);

    // 8 vertex colors per course — each weathered tint
    for (let v = 0; v < 8; v++) {
      colors.push(tint, tint * 0.98, tint * 0.95);
    }

    const a = idx;
    const b = idx + 1;
    const cc = idx + 2;
    const d = idx + 3;
    const a2 = idx + 4;
    const b2 = idx + 5;
    const c2 = idx + 6;
    const d2 = idx + 7;
    indices.push(
      a, b, b2,  a, b2, a2,
      b, cc, c2, b, c2, b2,
      cc, d, d2, cc, d2, c2,
      d, a, a2,  d, a2, d2,
    );
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

export function DistantPyramids() {
  const sandstone = useLoader(TextureLoader, "/textures/stone-sandstone.png");
  sandstone.colorSpace = SRGBColorSpace;
  sandstone.wrapS = RepeatWrapping;
  sandstone.wrapT = RepeatWrapping;
  sandstone.anisotropy = 8;

  const geoms = useMemo(
    () => DISTANT.map((d, i) => makeSteppedPyramidGeom(d.width, d.height, d.isQueens ? 12 : 28, i + 1)),
    []
  );

  return (
    <group>
      {DISTANT.map((def, i) => (
        <mesh
          key={i}
          geometry={geoms[i]}
          position={[def.x, GROUND_Y, def.z]}
          rotation={[0, def.rotY ?? 0, 0]}
          castShadow={false}
          receiveShadow
        >
          <meshStandardMaterial
            map={sandstone}
            color={def.isQueens ? "#a8895a" : "#b89a68"}
            roughness={0.95}
            metalness={0.02}
            envMapIntensity={0.5}
            vertexColors
          />
        </mesh>
      ))}

      {/* Subtle sphinx-shape silhouette — recessed in middle ground */}
      <mesh
        position={[24, GROUND_Y + 0.5, -22]}
        rotation={[0, -0.5, 0]}
      >
        <boxGeometry args={[3.5, 1.4, 1.6]} />
        <meshStandardMaterial color="#9f8458" roughness={0.95} envMapIntensity={0.4} />
      </mesh>
    </group>
  );
}
