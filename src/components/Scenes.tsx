"use client";

import { useRef } from "react";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { useFrame } from "@react-three/fiber";
import { PyramidScene } from "./pyramid/PyramidScene";
import { GoldDust } from "./GoldDust";

/**
 * Scroll-driven orchestrator.
 * Maps overall page scroll progress to a build-progress for the pyramid.
 *
 * Page layout (in screen-heights):
 *   0      → 1.0  : Hero / intro (camera idle distant)
 *   1.0    → 7.0  : Pinned pyramid build (6 viewport heights drive p=0..1)
 *   7.0    → 8.5  : Outro before sanctum link
 *
 * pyramidProgress = clamp((overallScroll - 1.0) / 6.0, 0, 1)
 */
export function Scenes() {
  const overall = useScrollProgress();
  const pyramidP = useRef(0);

  // we lazily compute the section-relative progress each frame
  useFrame(() => {
    const totalH = document.documentElement.scrollHeight - window.innerHeight;
    if (totalH <= 0) {
      pyramidP.current = 0;
      return;
    }
    const scrollY = overall.current * totalH;
    const startY = window.innerHeight * 1.0;
    const endY = window.innerHeight * 7.0;
    pyramidP.current = Math.max(0, Math.min(1, (scrollY - startY) / (endY - startY)));
  });

  return (
    <group>
      <GoldDust count={500} />
      <PyramidScene progressRef={pyramidP} />
    </group>
  );
}
