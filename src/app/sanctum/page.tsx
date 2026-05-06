import Link from "next/link";
import Image from "next/image";
import { AudioToggle } from "@/components/AudioToggle";
import { CompassSquareG, EyeOfHorus, Ouroboros, FeatherMaat } from "@/components/glyphs/Glyph";

export const metadata = {
  title: "Sanctum — Hermes Trismegistus",
  description: "De binnenste kamer. Toegang via passkey.",
};

export default function Sanctum() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#0a0604]">
      <AudioToggle scene="sanctum" />

      {/* ============== AMBIENT BACKDROP ==============
          Layered: stone wall texture (back) + masonic relief overlay + radial torchlight */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/textures/sanctum-wall-masonic.png)',
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.55,
          filter: "saturate(0.85) brightness(0.55)",
        }}
      />
      {/* radial torch glow from below */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 110%, rgba(212,175,55,0.35) 0%, rgba(196,71,71,0.12) 30%, transparent 65%)",
        }}
      />
      {/* vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(5,4,2,0.85) 100%)",
        }}
      />

      {/* ============== DEAD SEA SCROLLS — left + right walls ============== */}
      <div className="absolute top-[10%] left-[2%] w-[28vw] max-w-[420px] opacity-50 mix-blend-screen pointer-events-none hidden md:block">
        <Image
          src="/images/dead-sea-scroll.png"
          alt=""
          width={1200}
          height={600}
          sizes="28vw"
          className="object-contain drop-shadow-[0_0_40px_rgba(212,175,55,0.2)]"
        />
      </div>
      <div className="absolute top-[55%] right-[2%] w-[26vw] max-w-[400px] opacity-45 mix-blend-screen pointer-events-none hidden md:block scale-x-[-1]">
        <Image
          src="/images/dead-sea-scroll.png"
          alt=""
          width={1200}
          height={600}
          sizes="26vw"
          className="object-contain drop-shadow-[0_0_40px_rgba(212,175,55,0.2)]"
        />
      </div>

      {/* ============== CENTRAL ALTAR + LOGIN ============== */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">
        {/* Ark of the Covenant — the altar */}
        <div className="relative w-[min(85vw,440px)] aspect-square mb-8">
          {/* shaft of light from above */}
          <div
            aria-hidden
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[120%] h-32 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(245,215,110,0.45) 0%, transparent 100%)",
              filter: "blur(8px)",
              clipPath: "polygon(45% 0%, 55% 0%, 70% 100%, 30% 100%)",
            }}
          />
          <Image
            src="/images/ark-covenant.png"
            alt="Ark of the Covenant — altar of Hermes"
            fill
            priority
            sizes="(max-width: 640px) 85vw, 440px"
            className="object-contain drop-shadow-[0_0_60px_rgba(212,175,55,0.45)]"
          />
        </div>

        {/* Login card — papyrus surface, restrained Anthropic-clean */}
        <div className="relative w-full max-w-md papyrus glyph-border rounded-sm p-10 text-center backdrop-blur-md">
          {/* hidden compass+square+G mark — reveals on hover */}
          <div
            aria-hidden
            className="absolute top-3 right-3 text-gold/15 hover:text-gold/60 transition-colors duration-700"
            title="Verstopt in het zicht"
          >
            <CompassSquareG size={28} />
          </div>

          <p className="font-mono text-[0.7rem] uppercase tracking-[0.5em] text-gold/70 mb-3">
            Sanctum Sanctorum
          </p>
          <h1 className="font-display text-3xl font-semibold text-gold-shimmer mb-3">
            Toegang tot Hermes
          </h1>
          <p className="font-serif italic text-gold/60 mb-2 text-sm">
            Quod superius, sicut inferius.
          </p>
          <p className="text-foreground/55 mb-10 text-sm leading-relaxed">
            Het hart wordt gewogen tegen de veer van Maat. Authenticeer met
            een passkey — geen wachtwoorden, geen sleutels, alleen jij.
          </p>

          {/* placeholder login — WebAuthn integration later */}
          <button
            type="button"
            disabled
            className="w-full px-6 py-4 border border-gold/40 text-gold/55 font-mono text-sm tracking-[0.3em] uppercase cursor-not-allowed hover:border-gold/60 transition-colors"
            aria-label="Passkey login — coming soon"
          >
            Passkey · binnenkort
          </button>

          <div className="mt-8 flex items-center justify-center gap-6 text-gold/30">
            <EyeOfHorus size={20} />
            <FeatherMaat size={20} />
            <Ouroboros size={20} />
          </div>

          <Link
            href="/"
            className="block mt-8 text-foreground/35 hover:text-gold/70 text-[0.65rem] font-mono uppercase tracking-[0.4em] transition-colors"
          >
            ← terug naar de drempel
          </Link>
        </div>

        {/* ============== HERMES SEAL ON FLOOR ============== */}
        <div className="relative w-[min(60vw,260px)] aspect-square mt-10 opacity-65 pointer-events-none">
          <Image
            src="/images/seal-floor-engraved.png"
            alt="Hermes Trismegistus seal — engraved in the chamber floor"
            fill
            sizes="260px"
            style={{ transform: "perspective(800px) rotateX(60deg)" }}
            className="object-contain drop-shadow-[0_0_40px_rgba(212,175,55,0.3)]"
          />
        </div>
      </div>
    </main>
  );
}
