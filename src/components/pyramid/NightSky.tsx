"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Star field for the night portion of the build sequence.
 *
 * Sky color/day-night gradient is now handled by <DesertSky>, so this
 * component is purely the stars layer: a Points-on-hemisphere that
 * fades in late (p > 0.6) so they don't bleed into the daylight scene.
 *
 * Stars sit on a sphere of radius 95 (just inside DesertSky's dome at
 * 450) with depthWrite=false so they don't break sorting against the
 * pyramid / particles.
 */
const STAR_RADIUS = 95;
const STAR_COUNT = 1400;

export function NightSky({
  progressRef,
}: {
  progressRef: React.RefObject<number>;
}) {
  const starMatRef = useRef<THREE.PointsMaterial>(null!);
  const starPointsRef = useRef<THREE.Points>(null!);

  const { starPositions, starSizes, starColors } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const colors = new Float32Array(STAR_COUNT * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
      // marsaglia uniform on sphere, then keep upper hemisphere
      let x: number, y: number, z: number;
      do {
        let u: number, v: number, s: number;
        do {
          u = Math.random() * 2 - 1;
          v = Math.random() * 2 - 1;
          s = u * u + v * v;
        } while (s >= 1);
        const f = 2 * Math.sqrt(1 - s);
        x = u * f;
        y = 1 - 2 * s;
        z = v * f;
      } while (y < -0.05);

      pos[i * 3] = x * STAR_RADIUS;
      pos[i * 3 + 1] = y * STAR_RADIUS;
      pos[i * 3 + 2] = z * STAR_RADIUS;

      const r = Math.random();
      sizes[i] = r < 0.93 ? 0.4 + Math.random() * 0.3 : 0.9 + Math.random() * 0.6;

      const tint = Math.random();
      if (tint < 0.7) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
      } else if (tint < 0.88) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.92; colors[i * 3 + 2] = 0.78;
      } else {
        colors[i * 3] = 0.82; colors[i * 3 + 1] = 0.88; colors[i * 3 + 2] = 1;
      }
    }
    return { starPositions: pos, starSizes: sizes, starColors: colors };
  }, []);

  const starSprite = useMemo(() => {
    const size = 64;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.25, "rgba(255,255,255,0.85)");
    grad.addColorStop(0.6, "rgba(255,255,255,0.2)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    // stars fade in late so they don't appear over daylight sky
    const night = THREE.MathUtils.smoothstep(p, 0.62, 0.95);

    if (starMatRef.current) starMatRef.current.opacity = night;
    if (starPointsRef.current) {
      starPointsRef.current.rotation.y = state.clock.elapsedTime * 0.005;
    }
  });

  return (
    <points ref={starPointsRef} renderOrder={-1} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        <bufferAttribute attach="attributes-size" args={[starSizes, 1]} />
        <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={starMatRef}
        map={starSprite}
        size={0.7}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
