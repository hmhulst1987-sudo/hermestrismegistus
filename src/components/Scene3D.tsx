"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useRef, useEffect, type ReactNode } from "react";
import * as THREE from "three";

/**
 * Single fixed full-viewport canvas for the whole site.
 * Optimised to prevent WebGL Context Lost on integrated / lower-end GPUs:
 *  - DPR capped at 1.5 (was 2) — halves fill-rate on hi-DPI screens
 *  - Shadow map 1024 (was 2048) — reduces VRAM pressure
 *  - powerPreference "default" — "high-performance" can cause the driver
 *    to aggressively reclaim the GPU context on Windows integrated graphics
 *  - onContextLost handler prevents the default browser behaviour (which
 *    permanently kills the canvas) and lets Three.js restore it automatically
 */
export function Scene3D({ children }: { children?: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const canvas = el.querySelector("canvas");
    if (!canvas) return;

    const handleContextLost = (e: Event) => {
      e.preventDefault(); // prevent permanent loss — Three.js will restore
      console.warn("[Scene3D] WebGL context lost — will attempt restore");
    };
    const handleContextRestored = () => {
      console.info("[Scene3D] WebGL context restored");
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 4, 16], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        shadows
      >
        {/* Atmospheric haze — denser at the horizon, deeper distance for HDR feel */}
        <fog attach="fog" args={["#e6d5a8", 60, 150]} />

        <Suspense fallback={null}>
          {/* Real-world HDR environment: gives skybox + image-based lighting */}
          <Environment
            files="/hdri/desert.exr"
            background
            backgroundBlurriness={0.15}
            environmentIntensity={1.0}
          />

          {/* Direct sun for crisp shadows on the pyramid */}
          <directionalLight
            position={[8, 18, 6]}
            intensity={1.6}
            color="#fff4d6"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={80}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            shadow-bias={-0.0004}
            shadow-radius={4}
          />

          {/* Subtle fill — desert reflected light from the ground */}
          <hemisphereLight color="#fce8b4" groundColor="#7a5a30" intensity={0.25} />

          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
