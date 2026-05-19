"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useEffect, type ReactNode } from "react";

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
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "default",
          toneMappingExposure: 1.0,
        }}
        shadows
      >
        {/* Pale limestone haze */}
        <fog attach="fog" args={["#ddd4b0", 45, 110]} />

        <Suspense fallback={null}>
          {/* Egyptian noon sun */}
          <directionalLight
            position={[6, 16, 5]}
            intensity={2.2}
            color="#fff8e8"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.5}
            shadow-camera-far={80}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            shadow-bias={-0.0004}
          />

          {/* Sky bounce */}
          <hemisphereLight color="#5888cc" groundColor="#c8a860" intensity={0.45} />

          {/* Minimal ambient */}
          <ambientLight intensity={0.10} />

          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
