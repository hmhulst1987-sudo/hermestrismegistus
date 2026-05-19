"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FeatherMaat } from "./glyphs/Glyph";

export function SanctumLoginButton() {
  const [status, setStatus] = useState<"idle" | "weighing" | "accepted">("idle");
  const router = useRouter();

  const handleLogin = () => {
    setStatus("weighing");
    
    // Simulate the weighing of the heart
    setTimeout(() => {
      setStatus("accepted");
      
      // Redirect to the inner sanctum (dashboard)
      setTimeout(() => {
        router.push("/sanctum/dashboard");
      }, 1500);
    }, 2500);
  };

  if (status === "weighing") {
    return (
      <div className="w-full px-6 py-4 border border-gold/60 text-gold font-mono text-xs tracking-[0.35em] uppercase flex flex-col items-center justify-center gap-3 bg-gold/5">
        <div className="animate-pulse flex items-center gap-4">
          <span className="opacity-50">Cor</span>
          <FeatherMaat size={20} className="animate-bounce" />
          <span className="opacity-50">Maat</span>
        </div>
        <span className="text-[0.55rem] text-gold/60">Hart wordt gewogen...</span>
      </div>
    );
  }

  if (status === "accepted") {
    return (
      <div className="w-full px-6 py-4 border border-turquoise/60 text-turquoise font-mono text-xs tracking-[0.35em] uppercase flex flex-col items-center justify-center bg-turquoise/10 transition-colors duration-1000">
        <span className="animate-pulse">Equilibrium Bereikt</span>
        <span className="text-[0.55rem] text-turquoise/60 mt-1">Poort opent...</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="w-full relative px-6 py-4 border border-gold/40 text-gold/80 font-mono text-xs tracking-[0.35em] uppercase hover:bg-gold/10 hover:border-gold hover:text-gold transition-all duration-500 overflow-hidden group"
      aria-label="Passkey login"
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gold/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
      <span className="relative z-10">Bied Passkey Aan</span>
    </button>
  );
}
