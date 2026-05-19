import Link from "next/link";
import Image from "next/image";
import { AudioToggle } from "@/components/AudioToggle";
import { SanctumLoginButton } from "@/components/SanctumLoginButton";
import {
  CompassSquareG,
  EyeOfHorus,
  Ouroboros,
  FeatherMaat,
  Ankh,
  Djed,
} from "@/components/glyphs/Glyph";

export const metadata = {
  title: "Sanctum — Hermes Trismegistus",
  description: "De binnenste kamer. Toegang via passkey.",
};

export default function Sanctum() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#0a0606]">
      <AudioToggle scene="sanctum" />

      {/* ============== ROOM ARCHITECTURE ==============
          The page IS the chamber. Build it back-to-front:
            1. Back wall (top 70% of viewport)
            2. Floor (bottom 30% with perspective)
            3. Floor seal inlay
            4. Decorative scrolls mounted on back wall
            5. Ark + shaft of light (focal point)
            6. Login card overlapping ark
       */}

      {/* ============ 1. BACK WALL ============ */}
      <div
        aria-hidden
        className="fixed top-0 left-0 right-0 h-[70vh] -z-30"
        style={{
          backgroundImage: 'url(/textures/sanctum-wall-masonic.png)',
          backgroundSize: "120% auto",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
          filter: "saturate(0.85) brightness(0.6) contrast(1.05)",
        }}
      />

      {/* wall edge fade to black at top + bottom */}
      <div
        aria-hidden
        className="fixed top-0 left-0 right-0 h-[70vh] -z-30 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,6,6,0.9) 0%, transparent 25%, transparent 75%, rgba(10,6,6,0.95) 100%)",
        }}
      />

      {/* ============ 2. FLOOR ============ */}
      <div
        aria-hidden
        className="fixed bottom-0 left-0 right-0 h-[35vh] -z-30 origin-top"
        style={{
          backgroundImage: 'url(/textures/stone-eroded.png)',
          backgroundSize: "100% auto",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat-x",
          transform: "perspective(800px) rotateX(58deg)",
          transformOrigin: "center top",
          filter: "saturate(0.7) brightness(0.45) hue-rotate(-8deg)",
        }}
      />

      {/* floor edge gradient — softens horizon line */}
      <div
        aria-hidden
        className="fixed bottom-0 left-0 right-0 h-[35vh] -z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,6,6,0.85) 0%, transparent 30%, transparent 70%, rgba(10,6,6,0.7) 100%)",
        }}
      />

      {/* ============ 3. FLOOR SEAL — embedded into floor at bottom-center ============ */}
      <div
        aria-hidden
        className="fixed left-1/2 -translate-x-1/2 bottom-[2vh] w-[min(70vw,520px)] aspect-square pointer-events-none -z-10"
        style={{
          transform: "translateX(-50%) perspective(900px) rotateX(70deg)",
          transformOrigin: "center top",
          opacity: 0.42,
          filter: "saturate(0.85) brightness(0.85)",
        }}
      >
        <Image
          src="/images/seal-floor-engraved.png"
          alt=""
          fill
          sizes="520px"
          className="object-contain"
        />
      </div>

      {/* ============ 4. SCROLLS MOUNTED ON BACK WALL ============ */}
      <div className="fixed top-[12%] left-[3%] w-[18vw] max-w-[260px] opacity-50 pointer-events-none hidden lg:block z-0">
        <Image
          src="/images/dead-sea-scroll.png"
          alt=""
          width={1200}
          height={600}
          sizes="18vw"
          className="object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
        />
      </div>
      <div className="fixed top-[12%] right-[3%] w-[18vw] max-w-[260px] opacity-50 pointer-events-none hidden lg:block z-0 scale-x-[-1]">
        <Image
          src="/images/dead-sea-scroll.png"
          alt=""
          width={1200}
          height={600}
          sizes="18vw"
          className="object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
        />
      </div>

      {/* ============ ATMOSPHERIC GLOW ============ */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 35%, rgba(245,215,110,0.18) 0%, rgba(196,71,71,0.06) 35%, transparent 65%)",
        }}
      />

      {/* deep vignette over everything */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 95% 90% at 50% 50%, transparent 35%, rgba(10,6,6,0.85) 100%)",
        }}
      />

      {/* ============ 5. ARK + LIGHT SHAFT (centered focal point) ============ */}
      <div className="relative z-10 flex flex-col items-center pt-[12vh] px-6">
        <div className="relative flex flex-col items-center mb-10">
          {/* light shaft from above */}
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2 -top-[10vh] w-[200%] h-[35vh] pointer-events-none mix-blend-screen"
            style={{
              background:
                "linear-gradient(to bottom, rgba(245,215,110,0.7) 0%, rgba(245,215,110,0.35) 25%, rgba(245,215,110,0.12) 60%, transparent 100%)",
              filter: "blur(22px)",
              clipPath: "polygon(45% 0%, 55% 0%, 75% 100%, 25% 100%)",
            }}
          />

          {/* upper light source crown */}
          <div
            aria-hidden
            className="absolute -top-[12vh] left-1/2 -translate-x-1/2 w-40 h-40 pointer-events-none mix-blend-screen"
            style={{
              background:
                "radial-gradient(circle, rgba(255,235,170,0.8) 0%, rgba(245,215,110,0.3) 30%, transparent 70%)",
              filter: "blur(12px)",
            }}
          />

          {/* ARK */}
          <div className="relative w-[min(58vw,290px)] aspect-square">
            <Image
              src="/images/ark-covenant.png"
              alt="Ark of the Covenant"
              fill
              priority
              sizes="(max-width: 640px) 58vw, 290px"
              className="object-contain drop-shadow-[0_20px_50px_rgba(212,175,55,0.6)]"
            />
          </div>
        </div>

        {/* ============ 6. LOGIN CARD ============ */}
        <div className="relative w-full max-w-md papyrus glyph-border rounded-sm px-10 py-9 text-center backdrop-blur-md mb-[12vh]">
          <div
            aria-hidden
            className="absolute top-3 right-3 text-gold/15 hover:text-gold/65 transition-colors duration-700"
            title="Verstopt in het zicht"
          >
            <CompassSquareG size={26} />
          </div>

          <div
            aria-hidden
            className="absolute bottom-3 left-3 text-gold/10 hover:text-gold/50 transition-colors duration-700"
          >
            <Djed size={20} />
          </div>

          <p className="font-mono text-[0.7rem] uppercase tracking-[0.5em] text-gold/70 mb-3">
            Sanctum Sanctorum
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-gold-shimmer mb-2">
            Toegang tot Hermes
          </h1>
          <p className="font-serif italic text-gold/60 mb-5 text-sm">
            Quod superius, sicut inferius.
          </p>
          <p className="text-foreground/55 mb-8 text-sm leading-relaxed">
            Het hart wordt gewogen tegen de veer van Maat.
            <br />
            Authenticeer met een passkey.
          </p>

          <SanctumLoginButton />

          <div className="mt-6 flex items-center justify-center gap-5 text-gold/30">
            <Ankh size={18} />
            <EyeOfHorus size={18} />
            <FeatherMaat size={18} />
            <Ouroboros size={18} />
          </div>

          <Link
            href="/"
            className="block mt-6 text-foreground/35 hover:text-gold/70 text-[0.6rem] font-mono uppercase tracking-[0.4em] transition-colors"
          >
            ← terug naar de drempel
          </Link>
        </div>
      </div>
    </main>
  );
}
