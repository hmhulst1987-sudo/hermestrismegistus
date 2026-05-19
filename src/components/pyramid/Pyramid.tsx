"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { TextureLoader, RepeatWrapping, SRGBColorSpace } from "three";

/**
 * Stepped Egyptian-style pyramid built from instanced sandstone blocks.
 *
 * It generates a solid pyramid with perfectly stacked blocks.
 * Inside, it carves a grand entrance tunnel on the +X face leading to 
 * an internal chamber, creating a dramatic finish when the camera dives in.
 */

const BASE_SIZE = 16;          // bottom layer is 16x16 blocks
const LAYER_COUNT = 16;        // 16 stepped layers tapering to 1x1
const BLOCK_SIZE = 0.8;        // world units per block
const BLOCK_HEIGHT = 0.6;      // height per layer

type BlockData = {
  position: THREE.Vector3;
  spawn: THREE.Vector3;
  buildOrder: number;
  variant: number;
  rot: number;
  scale: number;
};

function generatePyramidBlocks(): BlockData[] {
  const blocks: BlockData[] = [];
  let order = 0;

  for (let layer = 0; layer < LAYER_COUNT; layer++) {
    const sideBlocks = BASE_SIZE - layer; // Shrink by exactly 1 block per side
    const offset = ((sideBlocks - 1) * BLOCK_SIZE) / 2;
    const y = layer * BLOCK_HEIGHT;

    for (let ix = 0; ix < sideBlocks; ix++) {
      for (let iz = 0; iz < sideBlocks; iz++) {
        const x = ix * BLOCK_SIZE - offset;
        const z = iz * BLOCK_SIZE - offset;

        // Central chamber (inner empty space)
        const inChamber = Math.abs(x) < 1.8 && Math.abs(z) < 1.8 && layer < 5;
        
        // Entrance tunnel on the +X face
        const inTunnel = x >= 1.5 && Math.abs(z) < 0.9 && layer < 4;

        if (inChamber || inTunnel) continue;

        blocks.push({
          position: new THREE.Vector3(x, y, z),
          spawn: new THREE.Vector3(
            x + (Math.random() - 0.5) * 10,
            y + 20 + Math.random() * 10,
            z + (Math.random() - 0.5) * 10
          ),
          buildOrder: order++,
          variant: Math.floor(Math.random() * 3),
          rot: (Math.random() - 0.5) * 0.08,
          scale: 0.98 + Math.random() * 0.02,
        });
      }
    }
  }

  // Sort blocks primarily by layer (y) so the base is built first, with some local randomness
  blocks.sort((a, b) => {
    const aScore = a.position.y * 10 + Math.random() * 5;
    const bScore = b.position.y * 10 + Math.random() * 5;
    return aScore - bScore;
  });

  // Reassign sequential build orders
  blocks.forEach((b, i) => {
    b.buildOrder = i;
  });

  return blocks;
}

export type PyramidHandle = {
  setProgress: (p: number) => void;
  getApex: () => THREE.Vector3;
  getEntrance: () => THREE.Vector3;
};

export function Pyramid({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  const [texSmooth, texGlyph, texEroded] = useLoader(TextureLoader, [
    "/textures/stone-smooth.png",
    "/textures/stone-hieroglyph.png",
    "/textures/stone-eroded.png",
  ]);

  for (const t of [texSmooth, texGlyph, texEroded]) {
    t.colorSpace = SRGBColorSpace;
    t.wrapS = RepeatWrapping;
    t.wrapT = RepeatWrapping;
    t.anisotropy = 8;
  }

  const blocks = useMemo(() => generatePyramidBlocks(), []);
  const total = blocks.length;

  const grouped = useMemo(() => {
    const out: BlockData[][] = [[], [], []];
    blocks.forEach((b) => out[b.variant].push(b));
    return out;
  }, [blocks]);

  const meshRefs = useRef<(THREE.InstancedMesh | null)[]>([null, null, null]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const ANIM_WINDOW = 300; // Large window for raining blocks effect

  useFrame(() => {
    const p = progressRef.current ?? 0;
    const visibleCount = p * (total + ANIM_WINDOW);

    for (let v = 0; v < 3; v++) {
      const mesh = meshRefs.current[v];
      if (!mesh) continue;
      const list = grouped[v];

      for (let i = 0; i < list.length; i++) {
        const b = list[i];
        const localProgress = THREE.MathUtils.clamp(
          (visibleCount - b.buildOrder) / ANIM_WINDOW,
          0,
          1
        );

        let s = 0;
        if (localProgress > 0) {
          const t = 1 - Math.pow(1 - localProgress, 3);
          const px = THREE.MathUtils.lerp(b.spawn.x, b.position.x, t);
          const py = THREE.MathUtils.lerp(b.spawn.y, b.position.y, t);
          const pz = THREE.MathUtils.lerp(b.spawn.z, b.position.z, t);

          const tilt = (1 - t) * 0.5;
          dummy.position.set(px, py, pz);
          dummy.rotation.set(tilt * 0.3, b.rot * t + tilt * 0.15, tilt * 0.2);
          s = b.scale * (0.4 + 0.6 * t);
        } else {
          dummy.position.set(0, 0, 0);
        }
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  const apexY = (LAYER_COUNT - 1) * BLOCK_HEIGHT + BLOCK_HEIGHT;

  return (
    <group ref={groupRef} position={[0, -apexY / 2, 0]}>
      {grouped.map((list, v) => (
        <instancedMesh
          key={v}
          ref={(el) => {
            meshRefs.current[v] = el;
          }}
          args={[undefined, undefined, list.length]}
          castShadow
          receiveShadow
          frustumCulled={false}
        >
          <boxGeometry args={[BLOCK_SIZE, BLOCK_HEIGHT, BLOCK_SIZE]} />
          <meshStandardMaterial
            map={[texSmooth, texGlyph, texEroded][v]}
            color="#e2c894"
            roughness={0.9}
            metalness={0.05}
          />
        </instancedMesh>
      ))}
    </group>
  );
}

export const PYRAMID_APEX_Y = (LAYER_COUNT - 1) * BLOCK_HEIGHT + BLOCK_HEIGHT;
export const PYRAMID_APEX_Y_LOCAL = PYRAMID_APEX_Y / 2;

