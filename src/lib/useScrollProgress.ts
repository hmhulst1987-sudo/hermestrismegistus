"use client";

import { useEffect, useRef } from "react";

/**
 * Returns a ref containing 0..1 page scroll progress, updated via rAF.
 * Use inside R3F where state changes shouldn't re-render React tree.
 */
export function useScrollProgress() {
  const ref = useRef(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current = max > 0 ? window.scrollY / max : 0;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return ref;
}
