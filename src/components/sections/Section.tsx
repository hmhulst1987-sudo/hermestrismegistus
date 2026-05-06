import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  children,
  align = "center",
}: {
  id: string;
  eyebrow?: string;
  title?: string;
  children?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <section
      id={id}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24"
      data-scene={id}
    >
      <div
        className={`relative z-10 max-w-3xl ${
          align === "center" ? "text-center" : "text-left"
        }`}
      >
        {eyebrow && (
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-gold/70">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="mb-8 text-4xl md:text-6xl font-semibold tracking-tight text-gold-shimmer">
            {title}
          </h2>
        )}
        <div className="text-foreground/80 leading-relaxed text-lg space-y-4">
          {children}
        </div>
      </div>
    </section>
  );
}
