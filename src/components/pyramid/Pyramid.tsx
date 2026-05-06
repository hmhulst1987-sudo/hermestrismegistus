"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { TextureLoader, RepeatWrapping, SRGBColorSpace } from "three";

/**
 * Stepped Egyptian-style pyramid built from instanced sandstone blocks.
 *
 * Layered from base (BASE_SIZE × BASE_SIZE) up to capstone (1×1).
 * Each layer is a hollow ring (outer perimeter) so we don't waste blocks
 * on invisible interior — a smooth pyramid shell, not solid mass.
 *
 * Reveal driven by `progress` (0..1). At progress=p, we show the first
 * p × totalBlocks blocks in build-order (bottom layer first, then up).
 *
 * Blocks not yet revealed sit far above with random rotation, fade-in
 * and drop into final position via per-block GSAP-like spring evaluated
 * each frame from a shared scroll progress source.
 */

const BASE_SIZE = 14;          // bottom layer is 14x14 blocks (with hollow interior)
const LAYER_COUNT = 12;        // 12 stepped layers
const BLOCK_SIZE = 0.6;        // world units per block
const BLOCK_HEIGHT = 0.5;      // height per layer
const SHRINK_PER_LAYER = 1.2;  // each layer is 1.2 blocks smaller per side

type BlockData = {
  position: THREE.Vector3;
  /** spawn position high above with random offset */
  spawn: THREE.Vector3;
  /** unique block index for build-order */
  buildOrder: number;
  /** which texture variant (0|1|2) */
  variant: number;
  /** small per-block scale & rotation jitter */
  rot: number;
  scale: number;
};

function generatePyramidBlocks(): BlockData[] {
  const blocks: BlockData[] = [];
  let order = 0;

  for (let layer = 0; layer < LAYER_COUNT; layer++) {
    const sideBlocks = Math.max(1, Math.round(BASE_SIZE - layer * SHRINK_PER_LAYER));
    const offset = ((sideBlocks - 1) * BLOCK_SIZE) / 2;
    const y = layer * BLOCK_HEIGHT;

    // for top single block (capstone area) drop full square; for others, only perimeter
    const fillFull = sideBlocks <= 3;

    for (let ix = 0; ix < sideBlocks; ix++) {
      for (let iz = 0; iz < sideBlocks; iz++) {
        const onPerimeter =
          ix === 0 || iz === 0 || ix === sideBlocks - 1 || iz === sideBlocks - 1;
        if (!fillFull && !onPerimeter) continue;

        const x = ix * BLOCK_SIZE - offset;
        const z = iz * BLOCK_SIZE - offset;

        blocks.push({
          position: new THREE.Vector3(x, y, z),
          spawn: new THREE.Vector3(
            x + (Math.random() - 0.5) * 8,
            y + 18 + Math.random() * 6,
            z + (Math.random() - 0.5) * 8
          ),
          buildOrder: order++,
          variant: Math.floor(Math.random() * 3),
          rot: (Math.random() - 0.5) * 0.08,
          scale: 0.96 + Math.random() * 0.04,
        });
      }
    }
  }

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
  /** ref to current 0..1 build progress */
  progressRef: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  // load three stone texture variants
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

  // partition blocks per texture variant
  const grouped = useMemo(() => {
    const out: BlockData[][] = [[], [], []];
    blocks.forEach((b) => out[b.variant].push(b));
    return out;
  }, [blocks]);

  const meshRefs = useRef<(THREE.InstancedMesh | null)[]>([null, null, null]);

  // scratch matrix for per-frame instance updates
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const p = progressRef.current ?? 0;
    // how many blocks should be in their final placed state
    const visibleCount = p * total;

    for (let v = 0; v < 3; v++) {
      const mesh = meshRefs.current[v];
      if (!mesh) continue;
      const list = grouped[v];

      for (let i = 0; i < list.length; i++) {
        const b = list[i];
        const localProgress = THREE.MathUtils.clamp(
          visibleCount - b.buildOrder,
          0,
          1
        );

        // ease-out cubic landing
        const t = 1 - Math.pow(1 - localProgress, 3);

        const px = THREE.MathUtils.lerp(b.spawn.x, b.position.x, t);
        const py = THREE.MathUtils.lerp(b.spawn.y, b.position.y, t);
        const pz = THREE.MathUtils.lerp(b.spawn.z, b.position.z, t);

        const tilt = (1 - t) * 0.6;
        dummy.position.set(px, py, pz);
        dummy.rotation.set(tilt * 0.4, b.rot * t + tilt * 0.2, tilt * 0.3);
        const s = b.scale * (0.5 + 0.5 * t);
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  // pyramid total visual height
  const apexY = (LAYER_COUNT - 1) * BLOCK_HEIGHT + BLOCK_HEIGHT;

  return (
    <group ref={groupRef} position={[0, -apexY / 2, 0]}>
      {/* per-variant instanced meshes for performance */}
      {grouped.map((list, v) => (
        <instancedMesh
          key={v}
          ref={(el) => {
            meshRefs.current[v] = el;
          }}
          args={[undefined, undefined, list.length]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[BLOCK_SIZE, BLOCK_HEIGHT, BLOCK_SIZE]} />
          <meshStandardMaterial
            map={[texSmooth, texGlyph, texEroded][v]}
            color="#e2c894"
            roughness={0.85}
            metalness={0.05}
          />
        </instancedMesh>
      ))}

      {/* sand floor under pyramid */}
      <mesh
        position={[0, -0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[14, 64]} />
        <meshStandardMaterial color="#8b6f3a" roughness={1} />
      </mesh>
    </group>
  );
}

export const PYRAMID_APEX_Y = (LAYER_COUNT - 1) * BLOCK_HEIGHT + BLOCK_HEIGHT;
export const PYRAMID_APEX_Y_LOCAL = PYRAMID_APEX_Y / 2;
