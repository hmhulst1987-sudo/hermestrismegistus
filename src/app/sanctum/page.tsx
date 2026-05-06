import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Sanctum — Hermes Trismegistus" };

export default function Sanctum() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-ink relative overflow-hidden">
      {/* faint radial backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,175,55,0.07) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-md w-full glyph-border rounded-sm p-10 bg-background/70 backdrop-blur-md text-center">
        {/* hermetic seal */}
        <div className="relative w-44 h-56 mx-auto mb-8">
          <Image
            src="/images/hermes-seal-transarant.png"
            alt="Hermes Trismegistus seal — Quod superius, sicut inferius"
            fill
            priority
            sizes="176px"
            className="object-contain drop-shadow-[0_0_28px_rgba(212,175,55,0.35)]"
          />
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.4em] text-gold/70 mb-3">
          Sanctum Sanctorum
        </p>
        <h1 className="text-3xl font-semibold text-gold-shimmer mb-4">
          Toegang tot Hermes
        </h1>
        <p className="text-foreground/60 mb-10 text-sm leading-relaxed">
          <span className="block italic font-mono text-gold/60 mb-2">
            Quod superius, sicut inferius
          </span>
          Authenticeer met een passkey. Geen wachtwoorden, geen sleutels —
          alleen jij.
        </p>

        <button
          type="button"
          disabled
          className="w-full px-6 py-4 border border-gold/40 text-gold/50 font-mono text-sm tracking-[0.3em] uppercase cursor-not-allowed hover:border-gold/60 transition-colors"
        >
          Passkey (binnenkort)
        </button>

        <Link
          href="/"
          className="inline-block mt-8 text-foreground/40 hover:text-gold/70 text-xs font-mono uppercase tracking-widest transition-colors"
        >
          ← terug naar de drempel
        </Link>
      </div>
    </main>
  );
}
