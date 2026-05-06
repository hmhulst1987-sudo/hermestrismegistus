import { Scene3D } from "@/components/Scene3D";
import { Scenes } from "@/components/Scenes";
import { Section } from "@/components/sections/Section";
import Link from "next/link";

const principles = [
  { name: "Mentalisme", line: "Het Al is geest; het universum is mentaal." },
  { name: "Correspondentie", line: "Zo boven, zo beneden; zo binnen, zo buiten." },
  { name: "Vibratie", line: "Niets rust; alles beweegt; alles trilt." },
  { name: "Polariteit", line: "Alles is dubbel; tegenpolen zijn identiek van aard." },
  { name: "Ritme", line: "Alles vloeit, in en uit; alles heeft zijn getij." },
  { name: "Oorzaak en gevolg", line: "Elke oorzaak heeft haar gevolg; toeval is naam voor onbekende wet." },
  { name: "Gender", line: "Mannelijk en vrouwelijk in alles; op elk vlak." },
];

export default function Home() {
  return (
    <>
      <Scene3D>
        <Scenes />
      </Scene3D>

      <main className="relative">
        {/* 1. HERO */}
        <Section id="hero" eyebrow="Hermes Trismegistus" title="As above, so below">
          <p className="font-mono text-sm text-foreground/60">
            Pixelpiraterij × Hermetiek
          </p>
          <p className="mt-8 text-foreground/50 text-sm">↓ scroll ↓</p>
        </Section>

        {/* 2. EMERALD TABLET */}
        <Section
          id="tablet"
          eyebrow="Tabula Smaragdina"
          title="De Smaragden Tafel"
        >
          <p>
            Verum, sine mendacio, certum et verissimum.
          </p>
          <p className="text-foreground/60">
            Wat boven is, is gelijk aan wat beneden is — om het wonder van het Ene te volbrengen.
          </p>
        </Section>

        {/* 3. SEVEN PRINCIPLES */}
        <Section id="principles" eyebrow="Kybalion" title="De zeven principes">
          <ul className="grid gap-4 md:grid-cols-2 text-left">
            {principles.map((p, i) => (
              <li
                key={p.name}
                className="glyph-border rounded-sm p-5 backdrop-blur-sm bg-ink/40"
              >
                <p className="font-mono text-xs text-gold/70 mb-2">
                  {String(i + 1).padStart(2, "0")} · {p.name.toUpperCase()}
                </p>
                <p className="text-foreground/80">{p.line}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* 4. ALCHEMICAL LAB — pixelpiraterij showcase */}
        <Section id="lab" eyebrow="Opus Magnum" title="Het laboratorium">
          <p>Reageerbuizen vol projecten. Elk een transmutatie van idee naar materie.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="glyph-border aspect-[3/4] rounded-sm bg-ink/60 flex items-end p-4"
              >
                <p className="font-mono text-xs text-gold/60">PROJECT_{String(n).padStart(2, "0")}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 5. TRANSMUTATION */}
        <Section id="transmutation" eyebrow="Solve et Coagula" title="Transmutatie">
          <p>Lood naar goud. Code naar ervaring. Stilte naar stem.</p>
        </Section>

        {/* 6. OUROBOROS */}
        <Section id="ouroboros" eyebrow="Ouroboros" title="De cirkel sluit">
          <p>De slang verteert zichzelf. Einde wordt begin.</p>
        </Section>

        {/* 7. SANCTUM — login gate */}
        <Section id="sanctum" eyebrow="Sanctum Sanctorum" title="Betreed de kamer">
          <p className="text-foreground/70">
            Voorbij deze drempel spreekt Hermes. Toegang via passkey.
          </p>
          <Link
            href="/sanctum"
            className="inline-block mt-10 px-8 py-4 border border-gold/60 text-gold hover:bg-gold hover:text-ink transition-colors font-mono text-sm tracking-[0.3em] uppercase"
          >
            Inloggen
          </Link>
        </Section>
      </main>
    </>
  );
}
