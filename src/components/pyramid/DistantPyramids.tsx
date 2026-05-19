"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { PYRAMID_APEX_Y } from "./Pyramid";

/**
 * Khafre + Menkaure silhouettes on the Giza horizon.
 *
 * The Giza plateau has three main pyramids. Our central pyramid represents
 * Khufu (the Great). Khafre and Menkaure sit south-west at increasing
 * distance. Their silhouettes give scale and immediately read as Egypt —
 * nothing else on earth looks like three pyramids on a flat desert horizon.
 *
 * Geometry: simple 4-sided pyramid shapes (custom BufferGeometry, 5 verts
 * per pyramid). No textures. Rendered in a muted dark limestone colour
 * that the scene fog will push toward the horizon haze colour.
 */

const GROUND_Y = -PYRAMID_APEX_Y / 2;

type PyramidDef = {
  x: number;
  z: number;
  width: number;
  height: number;
};

const DISTANT: PyramidDef[] = [
  // Khafre — slightly taller than Menkaure, south-west of Khufu
  { x: 38, z: -52, width: 14, height: 9.2 },
  // Menkaure — smallest of the three Giza pyramids
  { x: 70, z: -78, width: 9, height: 5.4 },
];

function makePyramidGeom(w: number, h: number): THREE.BufferGeometry {
  const hw = w / 2;
  // 5 vertices: 4 base corners + 1 apex
  const positions = new Float32Array([
    // base
    -hw, 0,  hw,  // 0 front-left
     hw, 0,  hw,  // 1 front-right
     hw, 0, -hw,  // 2 back-right
    -hw, 0, -hw,  // 3 back-left
    // apex
      0, h,   0,  // 4
  ]);

  // 4 triangular faces (ignore base — camera never sees it)
  const indices = new Uint16Array([
    4, 0, 1,  // front
    4, 1, 2,  // right
    4, 2, 3,  // back
    4, 3, 0,  // left
  ]);

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(new THREE.BufferAttribute(indices, 1));
  g.computeVertexNormals();
  return g;
}

export function DistantPyramids() {
  const geoms = useMemo(
    () => DISTANT.map((d) => makePyramidGeom(d.width, d.height)),
    []
  );

  return (
    <group>
      {DISTANT.map((def, i) => (
        <mesh
          key={i}
          geometry={geoms[i]}
          position={[def.x, GROUND_Y, def.z]}
          castShadow={false}
          receiveShadow={false}
        >
          {/* Dark warm limestone — fog will blend them into the horizon haze */}
          <meshStandardMaterial
            color="#6a5c3e"
            roughness={1}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}
