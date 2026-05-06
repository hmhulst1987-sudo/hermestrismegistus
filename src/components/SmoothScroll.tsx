"use client";

import { ReactLenis } from "lenis/react";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // sync Lenis ↔ GSAP ScrollTrigger
    const update = (time: number) => {
      ScrollTrigger.update();
      // lenis raf is internal via ReactLenis; we just keep ST in sync via scroll event
      void time;
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
      onScroll={(lenis: Lenis) => {
        ScrollTrigger.update();
        void lenis;
      }}
    >
      {children}
    </ReactLenis>
  );
}
