"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Floating audio toggle. Two crossfading loops:
 *   - ambient-bed (hero/build scenes)
 *   - sanctum-chamber (route /sanctum or scroll near end)
 *
 * Browsers block autoplay → starts muted, user clicks to unmute.
 */
export function AudioToggle({
  scene = "ambient",
}: {
  scene?: "ambient" | "sanctum";
}) {
  const [on, setOn] = useState(false);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const sanctumRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const ambient = new Audio("/audio/ambient-bed.mp3");
    const sanctum = new Audio("/audio/sanctum-chamber.mp3");
    [ambient, sanctum].forEach((a) => {
      a.loop = true;
      a.volume = 0;
      a.preload = "auto";
    });
    ambientRef.current = ambient;
    sanctumRef.current = sanctum;
    return () => {
      ambient.pause();
      sanctum.pause();
    };
  }, []);

  // crossfade based on `on` and `scene`
  useEffect(() => {
    const a = ambientRef.current;
    const s = sanctumRef.current;
    if (!a || !s) return;

    const aTarget = on && scene === "ambient" ? 0.35 : 0;
    const sTarget = on && scene === "sanctum" ? 0.45 : 0;

    if (on) {
      a.play().catch(() => {});
      s.play().catch(() => {});
    }

    const start = performance.now();
    const startA = a.volume;
    const startS = s.volume;
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / 1200);
      a.volume = startA + (aTarget - startA) * t;
      s.volume = startS + (sTarget - startS) * t;
      if (t < 1) raf = requestAnimationFrame(tick);
      else if (!on) {
        a.pause();
        s.pause();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, scene]);

  return (
    <button
      type="button"
      onClick={() => setOn((x) => !x)}
      aria-label={on ? "Mute" : "Unmute"}
      className="fixed left-6 bottom-6 z-50 w-12 h-12 rounded-full border border-gold/40 bg-ink/70 backdrop-blur text-gold/80 hover:text-gold-bright hover:border-gold transition-all flex items-center justify-center font-mono"
    >
      {on ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
