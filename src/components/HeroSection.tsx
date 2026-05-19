"use client";

import { useEffect, useRef, useState } from "react";
import { Ankh, EyeOfHorus, FeatherMaat } from "@/components/glyphs/Glyph";

/**
 * Hero section — "The Unopened Tomb"
 *
 * Design principles (from PRODUCT.md):
 *   - Withhold to reveal: nothing is announced, everything is earned
 *   - Silence: 3D scene does 90% of the work, text is a whisper
 *   - Every element is load-bearing or a clue
 *
 * The three glyphs bottom-right are puzzle Layer 1.
 * Correct sequence: Ankh (life) → Eye (sight) → Feather (truth)
 * = "Through life, gain sight; through sight, find truth."
 * Reward: a whisper revealing where Layer 2 begins.
 *
 * No gradient text (absolute ban). All gold is solid oklch().
 * prefers-reduced-motion collapses typewriter to instant reveal.
 */

const LINE_ONE = "As above,";
const LINE_TWO = "so below.";
const CHAR_DELAY = 55; // ms per character
const REVEAL_DELAY = 1800; // ms before typing starts

// Puzzle: correct click order = Ankh(1) → Eye(2) → Feather(3)
const CORRECT_SEQUENCE = [1, 2, 3] as const;

export function HeroSection() {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [subVisible, setSubVisible] = useState(false);
  const [whisper, setWhisper] = useState<string | null>(null);
  const [whisperVisible, setWhisperVisible] = useState(false);
  const clickSequence = useRef<number[]>([]);
  const whisperTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    if (prefersReducedMotion) {
      setLine1(LINE_ONE);
      setLine2(LINE_TWO);
      setSubVisible(true);
      return;
    }

    let cancelled = false;
    const startDelay = setTimeout(() => {
      let i = 0;
      const typeInterval = setInterval(() => {
        if (cancelled) { clearInterval(typeInterval); return; }
        i++;
        if (i <= LINE_ONE.length) {
          setLine1(LINE_ONE.slice(0, i));
        } else {
          const j = i - LINE_ONE.length - 1;
          if (j <= LINE_TWO.length) setLine2(LINE_TWO.slice(0, j));
        }
        if (i >= LINE_ONE.length + LINE_TWO.length + 1) {
          clearInterval(typeInterval);
          setTimeout(() => { if (!cancelled) setSubVisible(true); }, 400);
        }
      }, CHAR_DELAY);
    }, REVEAL_DELAY);

    return () => {
      cancelled = true;
      clearTimeout(startDelay);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleGlyphClick(glyphId: number) {
    const next = [...clickSequence.current, glyphId];
    clickSequence.current = next;

    const isCorrectSoFar = next.every((v, i) => v === CORRECT_SEQUENCE[i]);
    if (!isCorrectSoFar) {
      // Wrong order — reset silently, no error shown
      clickSequence.current = [];
      return;
    }

    if (next.length === CORRECT_SEQUENCE.length) {
      // Sequence complete — reveal first clue
      clickSequence.current = [];
      showWhisper("De eerste sleutel ligt verborgen in de negende laag.");
    }
  }

  function showWhisper(message: string) {
    if (whisperTimer.current) clearTimeout(whisperTimer.current);
    setWhisper(message);
    setWhisperVisible(true);
    whisperTimer.current = setTimeout(() => {
      setWhisperVisible(false);
      setTimeout(() => setWhisper(null), 1000);
    }, 5000);
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden">

      {/* Radial edge vignette — darkens corners only, keeps centre transparent */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 90% at 50% 45%, transparent 55%, oklch(5% 0.008 60 / 0.72) 100%)",
        }}
      />

      {/* Bottom gradient — ensures text legibility against light sandy horizon */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 50%, oklch(5% 0.008 60 / 0.6) 85%, oklch(5% 0.008 60 / 0.88) 100%)",
        }}
      />

      {/* Whisper — appears at top centre when puzzle Layer 1 is solved */}
      <div
        aria-live="polite"
        className="absolute top-0 left-0 right-0 z-30 flex justify-center pt-6 pointer-events-none"
        style={{
          opacity: whisperVisible ? 1 : 0,
          transition: "opacity 1000ms ease-in-out",
        }}
      >
        {whisper && (
          <p
            className="font-mono text-[0.6rem] uppercase tracking-[0.45em]"
            style={{ color: "oklch(72% 0.10 80 / 0.7)" }}
          >
            {whisper}
          </p>
        )}
      </div>

      {/* Top identity — watermark level, not an announcement */}
      <div className="relative z-10 flex items-center justify-center pt-9 pointer-events-none">
        <p
          className="font-mono text-[0.58rem] uppercase"
          style={{
            letterSpacing: "0.65em",
            color: "oklch(72% 0.08 80 / 0.30)",
          }}
        >
          Hermes Trismegistus
        </p>
      </div>

      {/* Main content — anchored bottom-left */}
      <div className="relative z-10 flex justify-between items-end px-9 md:px-14 pb-11 md:pb-14">

        {/* Headline block */}
        <div className="max-w-3xl">
          {/* Eyebrow — visible only once subtitle appears */}
          <p
            className="font-mono text-[0.56rem] uppercase mb-5 transition-opacity duration-700"
            style={{
              letterSpacing: "0.42em",
              color: "oklch(72% 0.08 80 / 0.38)",
              opacity: subVisible ? 1 : 0,
            }}
          >
            I · Principium
          </p>

          {/* Headline — typewriter reveal, solid gold (no gradient) */}
          <h1
            className="font-display font-semibold leading-[0.92] tracking-[-0.025em]"
            style={{
              fontSize: "clamp(3rem, 8.5vw, 7rem)",
              color: "oklch(72% 0.12 80)",
              minHeight: "2.1em", // reserves space before text arrives
            }}
          >
            {line1 || " "}
            <br />
            {line2 || " "}
            {/* Blinking cursor during typewriter */}
            {!subVisible && (line1 || line2) && (
              <span
                style={{
                  display: "inline-block",
                  width: "0.05em",
                  height: "0.85em",
                  backgroundColor: "oklch(72% 0.12 80 / 0.6)",
                  marginLeft: "0.08em",
                  verticalAlign: "middle",
                  animation: "blink 0.9s step-end infinite",
                }}
              />
            )}
          </h1>

          {/* Sub-text — fades in after typewriter completes */}
          <div
            className="mt-6 transition-opacity duration-1000"
            style={{ opacity: subVisible ? 1 : 0 }}
          >
            <p
              className="font-serif italic leading-relaxed"
              style={{
                fontSize: "clamp(0.9rem, 1.6vw, 1.1rem)",
                color: "oklch(82% 0.05 80 / 0.55)",
              }}
            >
              In den beginne was de Maat.
            </p>
            <p
              className="font-mono mt-2"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.38em",
                color: "oklch(72% 0.08 80 / 0.28)",
              }}
            >
              Quod superius · sicut inferius
            </p>
          </div>
        </div>

        {/* Puzzle glyphs — bottom-right, barely visible watermarks */}
        {/* These look like texture / decoration. They are Layer 1 of the puzzle. */}
        {/* Correct order: Ankh → Eye → Feather */}
        <div
          className="flex flex-col gap-5 items-center pb-1"
          title=""
          aria-label="Decoratieve symbolen"
        >
          {(
            [
              { id: 1, Glyph: Ankh,       label: "Ankh"         },
              { id: 2, Glyph: EyeOfHorus, label: "Eye of Horus" },
              { id: 3, Glyph: FeatherMaat,label: "Feather"      },
            ] as const
          ).map(({ id, Glyph, label }) => (
            <button
              key={id}
              type="button"
              aria-label={label}
              onClick={() => handleGlyphClick(id)}
              className="transition-all duration-500 hover:scale-110 focus:outline-none"
              style={{
                color: "oklch(72% 0.09 80 / 0.22)",
                background: "none",
                border: "none",
                padding: "4px",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(72% 0.09 80 / 0.42)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "oklch(72% 0.09 80 / 0.22)";
              }}
            >
              <Glyph size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Blink keyframe */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
