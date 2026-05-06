"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, type ReactNode } from "react";

/**
 * Single fixed full-viewport canvas. Scenes mount inside via portals/groups,
 * driven by ScrollTrigger. One canvas = one WebGL context = stable perf.
 */
export function Scene3D({ children }: { children?: ReactNode }) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={2} color="#f5d76e" />
          <pointLight position={[-5, -3, -5]} intensity={1} color="#2fa28a" />
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
