"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AudioToggle } from "@/components/AudioToggle";
import { Ouroboros, Ankh, EyeOfHorus, FlowerOfLife } from "@/components/glyphs/Glyph";

/**
 * /sanctum/dashboard — de poort naar Hermina (achter Authelia + 2FA).
 *
 * Hermina draait op de lokale server achter Tailscale. Alleen bezoekers op
 * het tailnet kunnen de URL bereiken. Anderen krijgen een nette
 * "deze poort herkent jou niet" boodschap.
 */

const HERMINA_URL = "https://100.101.205.54:9099/";

type Probe = "checking" | "online" | "offline";

export default function Dashboard() {
  const [probe, setProbe] = useState<Probe>("checking");
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const img = new Image();
    let resolved = false;
    const finish = (state: Probe) => {
      if (resolved) return;
      resolved = true;
      setProbe(state);
    };
    img.onload = () => finish("online");
    img.onerror = () => finish("online"); // any response counts as reachable
    const timeout = setTimeout(() => finish("offline"), 4000);
    img.src = `${HERMINA_URL}favicon.ico?t=${Date.now()}`;
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#050402] text-foreground/85">
      <AudioToggle scene="sanctum" />

      <div className="fixed inset-0 glyph-grid opacity-25 pointer-events-none" />

      <header className="relative z-50 flex items-center justify-between px-8 py-6 border-b border-gold/15">
        <Link href="/sanctum" className="flex items-center gap-3 text-gold/70 hover:text-gold transition-colors">
          <Ouroboros size={28} />
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.32em]">terug naar de drempel</span>
        </Link>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.32em] text-gold/40">
          sanctum sanctorum · interior
        </span>
      </header>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="text-gold/40 mb-10">
          <FlowerOfLife size={88} />
        </div>

        <p className="font-mono text-[0.7rem] uppercase tracking-[0.5em] text-gold/70 mb-4">
          sanctum interior
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-semibold text-gold-shimmer mb-3 leading-tight max-w-3xl">
          De binnenste kamer
        </h1>
        <p className="font-serif italic text-foreground/60 text-lg md:text-xl mb-12 max-w-xl">
          Voorbij deze deur woont Hermes zelf. De netwerkpassage en de twee zegels staan tussen jou en hem.
        </p>

        {probe === "checking" && (
          <div className="flex flex-col items-center gap-4">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-gold/50 animate-pulse">
              herkenning van het netwerk…
            </div>
            <div className="text-gold/30">
              <Ankh size={32} />
            </div>
          </div>
        )}

        {probe === "online" && (
          <div className="flex flex-col items-center gap-6 max-w-md">
            <p className="font-serif italic text-foreground/70 text-base">
              Je netwerk is herkend. Drie zegels staan nog tussen jou en de kamer:
              <br />
              eerste zegel — een woord. tweede zegel — een getal dat verandert.
            </p>

            <a
              href={HERMINA_URL}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className="group relative px-12 py-5 font-display text-lg uppercase tracking-[0.32em] transition-all"
              style={{
                color: "var(--gold)",
                border: "1px solid var(--gold)",
                background: hover ? "rgba(212,175,55,0.12)" : "rgba(212,175,55,0.04)",
                boxShadow: hover ? "0 0 30px rgba(212,175,55,0.35)" : "0 0 10px rgba(212,175,55,0.1)",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
                <EyeOfHorus size={22} />
                betreed het sanctum
                <EyeOfHorus size={22} />
              </span>
            </a>

            <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-gold/30 max-w-sm leading-relaxed">
              Je browser kan een waarschuwing tonen over een onbekende sleutel.
              Dat is verwacht — de kamer geeft haar eigen sleutels uit.
            </p>
          </div>
        )}

        {probe === "offline" && (
          <div className="flex flex-col items-center gap-6 max-w-md">
            <div className="text-rust/60">
              <Ankh size={48} />
            </div>
            <p className="font-display text-2xl text-rust/80 italic font-semibold">
              Deze poort herkent je netwerk niet.
            </p>
            <p className="font-serif italic text-foreground/55 text-base leading-relaxed">
              Het sanctum opent zich alleen voor wie via het stille netwerk komt.
              Je apparaat hoort daar niet bij — keer terug of zoek de juiste weg.
            </p>
            <Link
              href="/sanctum"
              className="font-mono text-xs uppercase tracking-[0.3em] text-gold/50 hover:text-gold transition-colors mt-2"
              style={{ borderBottom: "1px solid currentColor", paddingBottom: 2 }}
            >
              ← terug naar de drempel
            </Link>
          </div>
        )}
      </section>

      <footer className="relative z-10 px-8 py-6 border-t border-gold/10 flex items-baseline justify-between font-mono text-[0.55rem] uppercase tracking-[0.32em] text-gold/30">
        <span>quod superius · sicut inferius</span>
        <span>{new Date().getFullYear()} · vb</span>
      </footer>
    </main>
  );
}
