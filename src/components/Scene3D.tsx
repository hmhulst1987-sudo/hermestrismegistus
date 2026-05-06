"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Suspense, type ReactNode } from "react";

/**
 * Single fixed full-viewport canvas. Scenes mount inside via portals/groups,
 * driven by ScrollTrigger. One canvas = one WebGL context = stable perf.
 */
export function Scene3D({ children }: { children?: ReactNode }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 8, 30]} />
        <Suspense fallback={null}>
          {/* Procedural environment for PBR reflections — no CDN fetch */}
          <Environment resolution={256} environmentIntensity={0.7} background={false}>
            <color attach="background" args={["#0a0608"]} />
            {/* Warm key from upper-right */}
            <Lightformer
              form="rect"
              intensity={6}
              color="#ffd27a"
              scale={[6, 4, 1]}
              position={[5, 4, 3]}
              target={[0, 0, 0]}
            />
            {/* Soft fill from upper-left */}
            <Lightformer
              form="rect"
              intensity={2.5}
              color="#f5d76e"
              scale={[5, 5, 1]}
              position={[-5, 3, 2]}
              target={[0, 0, 0]}
            />
            {/* Bottom rim */}
            <Lightformer
              form="rect"
              intensity={1.2}
              color="#a17a1f"
              scale={[6, 2, 1]}
              position={[0, -4, 3]}
              target={[0, 0, 0]}
            />
            {/* Back rim for edge highlight */}
            <Lightformer
              form="ring"
              intensity={3}
              color="#fff2c0"
              scale={3}
              position={[0, 1, -4]}
              target={[0, 0, 0]}
            />
          </Environment>
          <ambientLight intensity={0.25} />
          <directionalLight position={[5, 6, 4]} intensity={1.4} color="#f5d76e" />
          <directionalLight position={[-4, -2, 3]} intensity={0.6} color="#ffd27a" />
          <pointLight position={[0, 2, 3]} intensity={3} color="#fff2c0" distance={10} />
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
