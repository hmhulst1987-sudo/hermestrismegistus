import Link from "next/link";

export const metadata = { title: "Sanctum — Hermes Trismegistus" };

export default function Sanctum() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-ink">
      <div className="max-w-md w-full glyph-border rounded-sm p-10 bg-background/60 backdrop-blur-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-gold/70 mb-6">
          Sanctum Sanctorum
        </p>
        <h1 className="text-3xl font-semibold text-gold-shimmer mb-8">
          Toegang tot Hermes
        </h1>
        <p className="text-foreground/70 mb-10 text-sm">
          Authenticeer met een passkey. Geen wachtwoorden.
        </p>

        <button
          type="button"
          disabled
          className="w-full px-6 py-4 border border-gold/40 text-gold/50 font-mono text-sm tracking-[0.3em] uppercase cursor-not-allowed"
        >
          Passkey (binnenkort)
        </button>

        <Link
          href="/"
          className="inline-block mt-8 text-foreground/40 hover:text-gold/70 text-xs font-mono uppercase tracking-widest"
        >
          ← terug
        </Link>
      </div>
    </main>
  );
}
