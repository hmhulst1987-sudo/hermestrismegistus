import { Scene3D } from "@/components/Scene3D";
import { Scenes } from "@/components/Scenes";
import { AudioToggle } from "@/components/AudioToggle";
import { Ankh, EyeOfHorus, FeatherMaat, FlowerOfLife, Ouroboros } from "@/components/glyphs/Glyph";
import Link from "next/link";

const principles = [
  { name: "Mentalisme", line: "Het Al is geest." },
  { name: "Correspondentie", line: "Zo boven, zo beneden." },
  { name: "Vibratie", line: "Niets rust; alles trilt." },
  { name: "Polariteit", line: "Tegenpolen zijn één." },
  { name: "Ritme", line: "Alles vloeit, in en uit." },
  { name: "Oorzaak", line: "Toeval is naam voor onbekende wet." },
  { name: "Gender", line: "Mannelijk en vrouwelijk in alles." },
];

export default function Home() {
  return (
    <>
      <Scene3D>
        <Scenes />
      </Scene3D>

      <AudioToggle scene="ambient" />

      <main className="relative z-10">
        {/* ============= 1. INTRO (1 vh) ============= */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
          <div className="relative">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.5em] text-gold/70 mb-6">
              Hermes Trismegistus
            </p>
            <h1 className="font-display text-4xl md:text-7xl font-semibold tracking-tight text-gold-shimmer leading-[1.05]">
              As above,
              <br />
              so below.
            </h1>
            <p className="mt-8 font-serif text-base md:text-lg text-foreground/60 italic max-w-md mx-auto">
              In den beginne was de Maat.
              <br />
              <span className="text-gold/60 not-italic font-mono text-xs tracking-[0.3em] uppercase mt-3 block">
                Quod superius, sicut inferius
              </span>
            </p>

            <div className="mt-12 flex items-center justify-center gap-8 text-gold/40">
              <Ankh size={28} />
              <EyeOfHorus size={28} />
              <FeatherMaat size={28} />
            </div>

            <p className="mt-16 font-mono text-[0.65rem] uppercase tracking-[0.4em] text-foreground/40 animate-pulse">
              ↓ daal af ↓
            </p>
          </div>
        </section>

        {/* ============= 2. PYRAMID BUILD (6 vh, no own bg, canvas drives visual) =============
            Inside this section the user scrolls and the 3D pyramid behind builds itself.
            We overlay narrative panels at specific scroll percentages by stacking
            sub-sections each ~viewport-tall with sticky-positioned text. */}
        <section className="relative">
          {/* ~p=0.05 — foundation laid */}
          <PyramidBeat
            eyebrow="I · Fundamentum"
            title="De vier hoekstenen"
            body={
              <>
                Thoth daalt af. Hij meet de aarde met passer en koord. Vier
                stenen klikken in zand — west, oost, zuid, noord. Wat boven is
                begint hier beneden.
              </>
            }
            side="left"
          />

          {/* ~p=0.25 — base courses rising */}
          <PyramidBeat
            eyebrow="II · Tabula Smaragdina"
            title="Verum, sine mendacio"
            body={
              <>
                <em className="text-gold/70 not-italic">
                  Wat beneden is, is gelijk aan wat boven is, om het wonder van
                  het Ene te volbrengen.
                </em>
              </>
            }
            side="right"
          />

          {/* ~p=0.40 — middle section, principles */}
          <PyramidBeat
            eyebrow="III · Kybalion"
            title="De zeven principes"
            body={
              <ul className="grid grid-cols-1 gap-2 mt-6 max-w-md text-sm">
                {principles.map((p, i) => (
                  <li
                    key={p.name}
                    className="flex gap-3 items-baseline border-b border-gold/15 py-2"
                  >
                    <span className="font-mono text-gold/50 text-[0.65rem] tracking-[0.2em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-gold/80 uppercase tracking-wider text-xs w-32">
                      {p.name}
                    </span>
                    <span className="text-foreground/65 italic">{p.line}</span>
                  </li>
                ))}
              </ul>
            }
            side="left"
          />

          {/* ~p=0.60 — upper terraces */}
          <PyramidBeat
            eyebrow="IV · Solve et Coagula"
            title="Transmutatie"
            body={
              <>
                Lood naar goud. Code naar ervaring. Stilte naar stem. De ibis
                noteert elk getal, elke trilling.
              </>
            }
            side="right"
          />

          {/* ~p=0.78 — capstone descending */}
          <PyramidBeat
            eyebrow="V · Capstone"
            title="Het oog daalt"
            body={
              <>
                Driehoek wordt heel. Zon wordt as. Wat verspreid was, keert
                terug naar het Ene punt.
              </>
            }
            side="center"
          />

          {/* ~p=0.95 — diving into pyramid */}
          <PyramidBeat
            eyebrow="VI · Sanctum"
            title="De poort opent"
            body={
              <>
                Door de noordzijde, voorbij steen en licht. Het hart wordt
                gewogen tegen een veer.
              </>
            }
            side="center"
            withGlyph={<Ouroboros size={64} />}
          />
        </section>

        {/* ============= 3. OUTRO + LOGIN ENTRY (1.5 vh) ============= */}
        <section className="min-h-[120vh] flex flex-col items-center justify-center px-6 text-center relative">
          <div className="papyrus glyph-border rounded-sm p-12 max-w-lg backdrop-blur-md relative overflow-hidden">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-gold/30">
              <FlowerOfLife size={120} />
            </div>

            <p className="font-mono text-[0.7rem] uppercase tracking-[0.5em] text-gold/70 mb-4">
              Sanctum Sanctorum
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-gold-shimmer mb-6">
              Betreed de kamer
            </h2>
            <p className="text-foreground/70 mb-10 leading-relaxed">
              Voorbij deze drempel spreekt Hermes. Toegang via passkey —
              herkend door alles, gedragen door niemand.
            </p>
            <Link
              href="/sanctum"
              className="inline-block px-10 py-4 border border-gold/60 text-gold hover:bg-gold hover:text-ink transition-all font-mono text-sm tracking-[0.3em] uppercase"
            >
              Inloggen
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

/**
 * One scroll beat overlaying the pinned pyramid canvas.
 * Each beat is one viewport-tall, content sticky-positioned inside.
 */
function PyramidBeat({
  eyebrow,
  title,
  body,
  side,
  withGlyph,
}: {
  eyebrow: string;
  title: string;
  body: React.ReactNode;
  side: "left" | "right" | "center";
  withGlyph?: React.ReactNode;
}) {
  const align =
    side === "left"
      ? "md:items-start md:text-left md:pl-[8%]"
      : side === "right"
      ? "md:items-end md:text-right md:pr-[8%]"
      : "items-center text-center";

  return (
    <div className="min-h-screen flex items-center px-6">
      <div
        className={`papyrus glyph-border rounded-sm p-8 md:p-10 max-w-md backdrop-blur-md ${
          side === "right" ? "ml-auto" : side === "center" ? "mx-auto" : ""
        } ${align} flex flex-col gap-3`}
      >
        {withGlyph && <div className="text-gold/60 mb-2">{withGlyph}</div>}
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.4em] text-gold/70">
          {eyebrow}
        </p>
        <h3 className="font-display text-2xl md:text-3xl font-semibold text-gold-shimmer leading-tight">
          {title}
        </h3>
        <div className="text-foreground/75 leading-relaxed text-base mt-2">
          {body}
        </div>
      </div>
    </div>
  );
}
