"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { PYRAMID_APEX_Y } from "./Pyramid";

/**
 * Wind-blown sand particles swirling around the pyramid during construction.
 *
 * THREE.Points with a single circular sprite material — cheap, looks
 * convincing as drifting dust. Particles spawn in a cylindrical shell
 * around the pyramid (radius 6..18, height ground..mid-pyramid), drift
 * along +X (wind direction) with a curl/swirl term, and recycle when
 * they exit the shell on the leeward side.
 *
 * Density envelope follows build progress:
 *   p < 0.05            : silent
 *   0.05 → 0.20         : storm builds
 *   0.20 → 0.55         : peak — full chaos under construction
 *   0.55 → 0.78         : winds down as build completes
 *   p > 0.78            : silent (clear air for capstone descent)
 */
const COUNT = 900;
const INNER_R = 5.5;
const OUTER_R = 19;
const HEIGHT_BAND = 12; // vertical extent

function makeSpriteTex(): THREE.Texture {
  // soft round alpha sprite, generated to a 64x64 canvas
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.4, "rgba(255,255,255,0.5)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function Sandstorm({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  const pointsRef = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.PointsMaterial>(null!);

  // pre-generate per-particle state held in plain Float32Arrays
  const { positions, velocities, sizes, sprite } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const groundY = -PYRAMID_APEX_Y / 2;

    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = INNER_R + Math.random() * (OUTER_R - INNER_R);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = groundY + Math.random() * HEIGHT_BAND;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // mostly horizontal drift (+x), slight upward bias, small z noise
      velocities[i * 3] = 0.6 + Math.random() * 0.8;
      velocities[i * 3 + 1] = 0.05 + Math.random() * 0.15;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      sizes[i] = 0.12 + Math.random() * 0.18;
    }
    return { positions, velocities, sizes, sprite: makeSpriteTex() };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !matRef.current) return;
    const p = progressRef.current ?? 0;

    // density envelope 0..1
    const rampUp = THREE.MathUtils.smoothstep(p, 0.05, 0.20);
    const rampDown = 1 - THREE.MathUtils.smoothstep(p, 0.55, 0.78);
    const env = rampUp * rampDown;

    // peak opacity ~0.35 — dust, not fog
    matRef.current.opacity = env * 0.38;

    // skip the integrator entirely when invisible — saves cost on first/last scroll
    if (env < 0.01) return;

    const geom = pointsRef.current.geometry as THREE.BufferGeometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const groundY = -PYRAMID_APEX_Y / 2;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < COUNT; i++) {
      const idx = i * 3;
      let x = arr[idx];
      let y = arr[idx + 1];
      let z = arr[idx + 2];

      // base velocity + curl term (sin/cos based) for swirling feel
      const curl = 0.6;
      const vx = velocities[idx] + Math.sin(t * 0.4 + i * 0.13) * curl;
      const vy = velocities[idx + 1] + Math.sin(t * 0.7 + i * 0.21) * 0.2;
      const vz = velocities[idx + 2] + Math.cos(t * 0.5 + i * 0.17) * curl;

      x += vx * delta;
      y += vy * delta;
      z += vz * delta;

      // recycle if particle blew past leeward bound or floated too high
      const r = Math.hypot(x, z);
      if (r > OUTER_R + 4 || y > groundY + HEIGHT_BAND + 2) {
        const angle = Math.PI + Math.random() * Math.PI; // upwind hemisphere (x<0)
        const nr = INNER_R + Math.random() * (OUTER_R - INNER_R);
        x = Math.cos(angle) * nr;
        z = Math.sin(angle) * nr;
        y = groundY + Math.random() * HEIGHT_BAND;
      }

      arr[idx] = x;
      arr[idx + 1] = y;
      arr[idx + 2] = z;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        map={sprite}
        size={0.35}
        sizeAttenuation
        color="#d8b97a"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
