"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Hero with the user's hermes-seal as centerpiece.
 * - Subtle float animation (idle breathing)
 * - Mouse parallax (gentle 3D feel)
 * - Scroll fade + lift instead of jarring 3D motion
 */
export function Hero() {
  const sealRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const seal = sealRef.current;
    const section = sectionRef.current;
    if (!seal || !section) return;

    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    };

    const tick = () => {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      // scroll-driven fade + lift
      const r = section.getBoundingClientRect();
      const out = Math.min(1, Math.max(0, -r.top / window.innerHeight));
      const lift = out * -120;
      const fade = 1 - out;
      seal.style.transform = `translate3d(${cx * 18}px, ${cy * 12 + lift}px, 0) rotateY(${cx * 8}deg) rotateX(${-cy * 6}deg)`;
      seal.style.opacity = String(fade);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24"
    >
      {/* radial glow behind seal */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.05) 30%, transparent 60%)",
        }}
      />

      {/* the seal */}
      <div
        ref={sealRef}
        className="relative will-change-transform"
        style={{ animation: "sealFloat 6s ease-in-out infinite" }}
      >
        <div className="relative w-[min(78vw,520px)] aspect-[3/4]">
          <Image
            src="/images/hermes-seal-transarant.png"
            alt="Hermes Trismegistus seal — Quod superius, sicut inferius"
            fill
            priority
            sizes="(max-width: 640px) 78vw, 520px"
            className="object-contain drop-shadow-[0_0_60px_rgba(212,175,55,0.35)]"
          />
        </div>
      </div>

      {/* tagline below */}
      <div className="relative z-10 mt-10 text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.5em] text-gold/70 mb-3">
          Hermes Trismegistus
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gold-shimmer">
          As above, so below
        </h1>
        <p className="mt-6 text-foreground/50 text-xs font-mono tracking-[0.3em] uppercase">
          ↓ scroll ↓
        </p>
      </div>

      <style>{`
        @keyframes sealFloat {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -10px; }
        }
      `}</style>
    </section>
  );
}
