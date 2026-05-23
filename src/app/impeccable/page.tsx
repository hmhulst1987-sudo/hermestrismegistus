import Link from "next/link";
import { AudioToggle } from "@/components/AudioToggle";
import {
  Ouroboros,
  Ankh,
  EyeOfHorus,
  FlowerOfLife,
  CompassSquareG,
} from "@/components/glyphs/Glyph";

export const metadata = {
  title: "Tabula Smaragdina — Hermes Trismegistus",
  description:
    "De Emerald Tablet — veertien verzen van Hermes Trismegistus over de impeccabele correspondentie tussen het Bovenste en het Onderste.",
};

/**
 * /impeccable — Tabula Smaragdina (Emerald Tablet)
 *
 * De foundational tekst van het Hermetisme. Toegeschreven aan Hermes
 * Trismegistus. Veertien verzen die de onbreekbare wet beschrijven
 * dat het Boven en Beneden één zijn.
 *
 * "Quod est inferius est sicut quod est superius."
 * Wat beneden is, is gelijk aan wat boven is.
 *
 * Het epitheton "impeccable" hier verwijst naar de mathematische
 * volmaaktheid van die correspondentie — niets dat boven gebeurt,
 * dat niet exact zijn weerklank vindt in het onderste. Een perfecte
 * symmetrie, een vlekkeloze waarheid.
 */

type Verse = {
  num: string;
  latin: string;
  dutch: string;
};

const VERSES: Verse[] = [
  {
    num: "I",
    latin: "Verum, sine mendacio, certum et verissimum.",
    dutch: "Waar, zonder leugen, zeker en allerwaarachtigst.",
  },
  {
    num: "II",
    latin:
      "Quod est inferius est sicut quod est superius, et quod est superius est sicut quod est inferius, ad perpetranda miracula rei unius.",
    dutch:
      "Wat beneden is, is gelijk aan wat boven is, en wat boven is, is gelijk aan wat beneden is — om de wonderen van het Ene te volbrengen.",
  },
  {
    num: "III",
    latin:
      "Et sicut omnes res fuerunt ab uno, meditatione unius, sic omnes res natae fuerunt ab hac una re, adaptatione.",
    dutch:
      "En zoals alle dingen ontstaan zijn uit het Ene, door de overweging van het Ene, zo zijn alle dingen geboren uit dit Ene, door aanpassing.",
  },
  {
    num: "IV",
    latin: "Pater eius est Sol, mater eius Luna.",
    dutch: "Zijn vader is de Zon, zijn moeder de Maan.",
  },
  {
    num: "V",
    latin: "Portavit illud ventus in ventre suo.",
    dutch: "De Wind heeft het in zijn buik gedragen.",
  },
  {
    num: "VI",
    latin: "Nutrix eius terra est.",
    dutch: "Zijn voedster is de Aarde.",
  },
  {
    num: "VII",
    latin: "Pater omnis Telesmi totius mundi est hic.",
    dutch: "De vader van alle vervolmaking van de hele wereld is hier.",
  },
  {
    num: "VIII",
    latin:
      "Virtus eius integra est, si versa fuerit in terram. Separabis terram ab igne, subtile a spisso, suaviter cum magno ingenio.",
    dutch:
      "Zijn kracht is volkomen, indien tot aarde teruggekeerd. Scheid de aarde van het vuur, het subtiele van het grove — zacht, met grote zorg.",
  },
  {
    num: "IX",
    latin:
      "Ascendit a terra in coelum, iterumque descendit in terram, et recipit vim superiorum et inferiorum.",
    dutch:
      "Hij stijgt van de Aarde naar de Hemel, en daalt weer neer op de Aarde, en ontvangt de kracht van het Boven en het Beneden.",
  },
  {
    num: "X",
    latin:
      "Sic habebis gloriam totius mundi. Ideo fugiet a te omnis obscuritas.",
    dutch:
      "Zo zult ge de glorie van de hele wereld bezitten. Daarom zal alle duisternis van u vlieden.",
  },
  {
    num: "XI",
    latin:
      "Haec est totius fortitudinis fortitudo fortis, quia vincet omnem rem subtilem omnemque solidam penetrabit.",
    dutch:
      "Dit is de sterkte van alle sterkte, want het overwint elk subtiel ding en doordringt elk vast ding.",
  },
  {
    num: "XII",
    latin: "Sic mundus creatus est.",
    dutch: "Zo is de wereld geschapen.",
  },
  {
    num: "XIII",
    latin: "Hinc erunt adaptationes mirabiles, quarum modus hic est.",
    dutch:
      "Hieruit zullen wonderbaarlijke aanpassingen voortkomen, waarvan dit de wijze is.",
  },
  {
    num: "XIV",
    latin:
      "Itaque vocatus sum Hermes Trismegistus, habens tres partes Philosophiae totius mundi.",
    dutch:
      "Daarom word ik Hermes Trismegistus genoemd, die de drie delen van de Filosofie van de hele wereld bezit.",
  },
];

export default function Impeccable() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#050402] text-foreground/85">
      <AudioToggle scene="sanctum" />

      {/* ============ ATMOSPHERE LAYERS ============ */}
      <div
        aria-hidden
        className="fixed inset-0 -z-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(28, 70, 50, 0.18) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(201, 169, 97, 0.05) 0%, transparent 60%), #050402",
        }}
      />
      <div className="fixed inset-0 glyph-grid opacity-20 pointer-events-none -z-20" />

      {/* faint hieroglyphic flourishes — top-left + bottom-right */}
      <div aria-hidden className="fixed top-12 left-8 text-gold/10 -z-10">
        <FlowerOfLife size={140} />
      </div>
      <div aria-hidden className="fixed bottom-12 right-8 text-gold/10 -z-10">
        <CompassSquareG size={120} />
      </div>

      {/* ============ HEADER ============ */}
      <header className="relative z-40 flex items-center justify-between px-8 py-6 border-b border-gold/15">
        <Link
          href="/"
          className="flex items-center gap-3 text-gold/70 hover:text-gold transition-colors"
        >
          <Ouroboros size={28} />
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.32em]">
            terug naar de tempel
          </span>
        </Link>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.32em] text-gold/40">
          tabula smaragdina · veertien verzen
        </span>
      </header>

      {/* ============ INTRO ============ */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-10">
        <div className="text-emerald-400/30 mb-8">
          <EyeOfHorus size={56} />
        </div>

        <p className="font-mono text-[0.7rem] uppercase tracking-[0.5em] text-gold/70 mb-4">
          tabula smaragdina
        </p>
        <h1
          className="font-display text-5xl md:text-7xl font-semibold mb-6 leading-[1.05] max-w-4xl"
          style={{
            background:
              "linear-gradient(180deg, #e8c878 0%, #c9a961 45%, #7d4f1e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          De Smaragden Tafel
        </h1>
        <p className="font-serif italic text-foreground/55 text-base md:text-lg max-w-2xl leading-relaxed mb-6">
          Veertien verzen, gegrift in een tafel van smaragd, gevonden in de
          handen van Hermes Trismegistus in een Egyptische tombe. De grondtekst
          van het Hermetisme — de wet van de <em>onfeilbare</em> overeenkomst
          tussen Hemel en Aarde.
        </p>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.4em] text-emerald-500/40">
          quod superius · sicut inferius
        </p>
      </section>

      {/* ============ THE TABLET ============ */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <div
          className="relative px-8 md:px-14 py-14 md:py-20"
          style={{
            background:
              "linear-gradient(160deg, rgba(28, 70, 50, 0.18) 0%, rgba(10, 20, 14, 0.92) 50%, rgba(28, 70, 50, 0.12) 100%)",
            border: "1px solid rgba(201, 169, 97, 0.18)",
            boxShadow:
              "0 0 60px rgba(28, 70, 50, 0.15), inset 0 0 80px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* corner ornaments */}
          <span
            aria-hidden
            className="absolute top-3 left-3 w-4 h-4"
            style={{
              borderTop: "1px solid rgba(201,169,97,0.5)",
              borderLeft: "1px solid rgba(201,169,97,0.5)",
            }}
          />
          <span
            aria-hidden
            className="absolute top-3 right-3 w-4 h-4"
            style={{
              borderTop: "1px solid rgba(201,169,97,0.5)",
              borderRight: "1px solid rgba(201,169,97,0.5)",
            }}
          />
          <span
            aria-hidden
            className="absolute bottom-3 left-3 w-4 h-4"
            style={{
              borderBottom: "1px solid rgba(201,169,97,0.5)",
              borderLeft: "1px solid rgba(201,169,97,0.5)",
            }}
          />
          <span
            aria-hidden
            className="absolute bottom-3 right-3 w-4 h-4"
            style={{
              borderBottom: "1px solid rgba(201,169,97,0.5)",
              borderRight: "1px solid rgba(201,169,97,0.5)",
            }}
          />

          <div className="flex justify-center mb-14 text-gold/40">
            <Ankh size={32} />
          </div>

          <ol className="space-y-10 list-none">
            {VERSES.map((v) => (
              <li key={v.num} className="grid grid-cols-[auto_1fr] gap-x-6 md:gap-x-8">
                <span
                  aria-hidden
                  className="font-mono text-gold/55 text-xs tracking-[0.32em] pt-1 select-none"
                  style={{ minWidth: "2.5rem" }}
                >
                  {v.num}
                </span>
                <div>
                  <p className="font-serif italic text-gold/85 text-lg md:text-xl leading-relaxed mb-2">
                    {v.latin}
                  </p>
                  <p className="font-serif text-foreground/55 text-sm md:text-base leading-relaxed">
                    {v.dutch}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex justify-center mt-14 text-gold/40">
            <Ankh size={32} />
          </div>
        </div>
      </section>

      {/* ============ EPILOGUE ============ */}
      <section className="relative z-10 max-w-2xl mx-auto px-6 pt-8 pb-24 text-center">
        <div className="text-gold/25 flex justify-center mb-6">
          <FlowerOfLife size={64} />
        </div>
        <p className="font-serif italic text-foreground/45 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          De tafel was van smaragd. De woorden waren gegrift in het Phoenicisch.
          Wie de drie delen — de fysieke, de mentale, de spirituele — als één
          ziet, draagt het epitheton <em>Trismegistus</em>: drievoudig groot.
        </p>
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.4em] text-gold/30 mt-10">
          {`> finis tabulae smaragdinae <`}
        </p>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative z-10 px-8 py-6 border-t border-gold/10 flex items-baseline justify-between font-mono text-[0.55rem] uppercase tracking-[0.32em] text-gold/30">
        <span>quod superius · sicut inferius</span>
        <Link href="/sanctum" className="hover:text-gold transition-colors">
          → sanctum
        </Link>
      </footer>
    </main>
  );
}
