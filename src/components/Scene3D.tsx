"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Suspense, type ReactNode } from "react";

/**
 * Single fixed full-viewport canvas for the whole site.
 * All 3D scenes mount inside via children. One WebGL context = stable perf.
 *
 * Lighting designed for warm Egyptian dusk: amber sun + cool sky fill +
 * lapis-tinted shadow. Procedural environment via Lightformers (no CDN).
 */
export function Scene3D({ children }: { children?: ReactNode }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 4, 16], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        shadows
      >
        <color attach="background" args={["#0d0a06"]} />
        <fog attach="fog" args={["#0d0a06", 18, 50]} />

        <Suspense fallback={null}>
          {/* procedural Egyptian-dusk env for PBR reflections */}
          <Environment resolution={256} environmentIntensity={0.55} background={false}>
            <Lightformer form="rect" intensity={5} color="#ffd27a" scale={[8, 4, 1]} position={[8, 6, 4]} target={[0, 0, 0]} />
            <Lightformer form="rect" intensity={2} color="#c44747" scale={[6, 3, 1]} position={[-6, 2, 4]} target={[0, 0, 0]} />
            <Lightformer form="rect" intensity={1.5} color="#1c4f8c" scale={[8, 4, 1]} position={[0, 6, -8]} target={[0, 0, 0]} />
            <Lightformer form="rect" intensity={0.8} color="#8b6f3a" scale={[10, 3, 1]} position={[0, -4, 6]} target={[0, 0, 0]} />
          </Environment>

          {/* warm amber key from upper-right (Egyptian sun) */}
          <directionalLight
            position={[8, 12, 6]}
            intensity={1.6}
            color="#ffd27a"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-camera-left={-12}
            shadow-camera-right={12}
            shadow-camera-top={12}
            shadow-camera-bottom={-12}
            shadow-bias={-0.0005}
          />

          {/* cool fill from sky (lapis tint in shadow) */}
          <directionalLight position={[-6, 8, -4]} intensity={0.4} color="#6b8aaf" />

          {/* warm bounce from sand */}
          <hemisphereLight color="#ffd27a" groundColor="#5c4724" intensity={0.5} />

          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
