import { Glyphs, type GlyphName } from "@/components/glyphs/Glyph";

export const metadata = { title: "Glyphs — Preview" };

export default function GlyphsPreview() {
  const names = Object.keys(Glyphs) as GlyphName[];
  return (
    <main className="min-h-screen bg-ink p-12">
      <h1 className="text-gold-shimmer text-3xl mb-8">Glyph Library</h1>
      <p className="text-foreground/60 text-sm font-mono mb-12 max-w-xl">
        Procedural SVG icons. currentColor inherits from text-* class. Resize via size prop.
        Use these as accents, drift particles, hover triggers, and ritual decoration.
      </p>

      {/* size + color matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {names.map((name) => {
          const Icon = Glyphs[name];
          return (
            <div
              key={name}
              className="glyph-border p-6 bg-background/40 flex flex-col items-center gap-4 rounded-sm"
            >
              <div className="text-gold">
                <Icon size={56} />
              </div>
              <p className="font-mono text-[0.65rem] tracking-[0.2em] text-foreground/60 uppercase">
                {name}
              </p>
            </div>
          );
        })}
      </div>

      {/* size scale demo */}
      <h2 className="text-gold-shimmer text-xl mt-16 mb-6">Size scale (Ankh)</h2>
      <div className="flex items-end gap-6 text-gold">
        {[16, 24, 32, 48, 72, 96].map((s) => {
          const Icon = Glyphs.ankh;
          return (
            <div key={s} className="flex flex-col items-center gap-2">
              <Icon size={s} />
              <span className="font-mono text-[0.6rem] text-foreground/50">{s}px</span>
            </div>
          );
        })}
      </div>

      {/* color variations */}
      <h2 className="text-gold-shimmer text-xl mt-16 mb-6">Color variants</h2>
      <div className="flex items-center gap-8">
        <span className="text-gold"><Glyphs.ouroboros size={64} /></span>
        <span className="text-gold-bright"><Glyphs.ouroboros size={64} /></span>
        <span className="text-emerald-bright"><Glyphs.ouroboros size={64} /></span>
        <span className="text-foreground/40"><Glyphs.ouroboros size={64} /></span>
        <span style={{ color: "#c44747" }}><Glyphs.ouroboros size={64} /></span>
      </div>
    </main>
  );
}
