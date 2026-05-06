/**
 * Procedural hieroglyph + sacred-geometry icon set.
 *
 * - All in 64×64 viewBox.
 * - Single-color via currentColor — set via CSS color or Tailwind text-* class.
 * - Default fill="none" stroke-based for line-art consistency, or filled where it matters.
 * - Use: <Ankh size={32} className="text-gold/70" />
 */

import type { SVGProps } from "react";

type GlyphProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  /** stroke-width in viewBox units. default 2.5 */
  strokeWidth?: number;
};

function Base({
  size = 24,
  strokeWidth = 2.5,
  children,
  ...rest
}: GlyphProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Ankh — cross with looped top; symbol of life. */
export function Ankh(props: GlyphProps) {
  return (
    <Base {...props}>
      <ellipse cx="32" cy="20" rx="9" ry="11" />
      <line x1="32" y1="31" x2="32" y2="56" />
      <line x1="20" y1="38" x2="44" y2="38" />
    </Base>
  );
}

/** Eye of Horus — protection, royal power, good health. */
export function EyeOfHorus(props: GlyphProps) {
  return (
    <Base {...props}>
      {/* upper lid + brow arc */}
      <path d="M8 32 Q22 18 38 22 Q50 24 56 30" />
      {/* lower lid */}
      <path d="M8 32 Q24 44 40 38" />
      {/* iris */}
      <circle cx="30" cy="31" r="4" fill="currentColor" />
      {/* tear-drop falling */}
      <path d="M30 44 Q26 50 30 56 Q34 50 30 44 Z" fill="currentColor" />
      {/* curl tail */}
      <path d="M40 38 Q48 42 52 50" />
    </Base>
  );
}

/** Was scepter — power, dominion. Forked base, animal-head top. */
export function Was(props: GlyphProps) {
  return (
    <Base {...props}>
      {/* head (stylized canine snout) */}
      <path d="M28 8 Q32 4 36 8 L40 14 Q40 18 34 18 L28 18 Q22 18 22 14 Z" />
      <circle cx="32" cy="13" r="1.4" fill="currentColor" stroke="none" />
      {/* shaft */}
      <line x1="32" y1="18" x2="32" y2="50" />
      {/* forked base */}
      <line x1="32" y1="50" x2="24" y2="58" />
      <line x1="32" y1="50" x2="40" y2="58" />
    </Base>
  );
}

/** Djed pillar — stability, spine of Osiris. */
export function Djed(props: GlyphProps) {
  return (
    <Base {...props}>
      {/* central column */}
      <line x1="32" y1="6" x2="32" y2="58" />
      <line x1="26" y1="6" x2="38" y2="6" />
      <line x1="26" y1="58" x2="38" y2="58" />
      {/* four horizontal crossbars near top */}
      <line x1="20" y1="14" x2="44" y2="14" />
      <line x1="18" y1="20" x2="46" y2="20" />
      <line x1="18" y1="26" x2="46" y2="26" />
      <line x1="18" y1="32" x2="46" y2="32" />
    </Base>
  );
}

/** Scarab — Khepri, rebirth, sun's daily renewal. */
export function Scarab(props: GlyphProps) {
  return (
    <Base {...props}>
      {/* body */}
      <ellipse cx="32" cy="38" rx="13" ry="16" />
      {/* head */}
      <ellipse cx="32" cy="20" rx="6" ry="4" />
      {/* central seam */}
      <line x1="32" y1="24" x2="32" y2="54" />
      {/* legs left */}
      <path d="M19 28 L10 24" />
      <path d="M18 38 L8 38" />
      <path d="M19 48 L10 54" />
      {/* legs right */}
      <path d="M45 28 L54 24" />
      <path d="M46 38 L56 38" />
      <path d="M45 48 L54 54" />
    </Base>
  );
}

/** Feather of Maat — truth, balance, cosmic order. */
export function FeatherMaat(props: GlyphProps) {
  return (
    <Base {...props}>
      <path d="M32 4 Q44 16 44 36 Q44 52 32 60 Q20 52 20 36 Q20 16 32 4 Z" />
      <line x1="32" y1="6" x2="32" y2="60" />
      {/* barbs */}
      {Array.from({ length: 8 }).map((_, i) => {
        const y = 12 + i * 6;
        const w = 8 + i * 0.5;
        return <line key={i} x1={32 - w} y1={y} x2={32 + w} y2={y + 1} />;
      })}
    </Base>
  );
}

/** Ibis — Thoth's sacred bird; wisdom, scribe. */
export function Ibis(props: GlyphProps) {
  return (
    <Base {...props}>
      {/* body */}
      <path d="M14 36 Q22 30 38 32 Q50 34 50 42 Q50 50 38 50 L20 50 Q14 50 14 44 Z" />
      {/* neck */}
      <path d="M40 32 Q44 22 40 14" />
      {/* head */}
      <circle cx="40" cy="12" r="3" />
      {/* long curved beak */}
      <path d="M40 13 Q48 16 54 24" />
      {/* legs */}
      <line x1="26" y1="50" x2="26" y2="60" />
      <line x1="36" y1="50" x2="36" y2="60" />
      {/* feet */}
      <line x1="22" y1="60" x2="30" y2="60" />
      <line x1="32" y1="60" x2="40" y2="60" />
    </Base>
  );
}

/** Sun disk — Ra, divine illumination. */
export function SunDisk(props: GlyphProps) {
  return (
    <Base {...props}>
      <circle cx="32" cy="32" r="10" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const x1 = 32 + Math.cos(a) * 14;
        const y1 = 32 + Math.sin(a) * 14;
        const x2 = 32 + Math.cos(a) * 22;
        const y2 = 32 + Math.sin(a) * 22;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </Base>
  );
}

/** Pyramid — sacred geometry, ascension. */
export function Pyramid(props: GlyphProps) {
  return (
    <Base {...props}>
      {/* outline */}
      <path d="M8 54 L32 8 L56 54 Z" />
      {/* internal edge for 3D feel */}
      <line x1="32" y1="8" x2="32" y2="54" />
      {/* capstone separator */}
      <line x1="22" y1="26" x2="42" y2="26" />
      {/* base detail */}
      <line x1="8" y1="54" x2="56" y2="54" />
    </Base>
  );
}

/** Ouroboros — eternity, cycle, self-creation. */
export function Ouroboros(props: GlyphProps) {
  return (
    <Base {...props}>
      {/* body as near-circle */}
      <path d="M32 8 A24 24 0 1 1 16 50" />
      {/* head where it bites tail */}
      <path d="M16 50 L20 46 L24 50 L20 54 Z" fill="currentColor" />
      {/* eye */}
      <circle cx="20" cy="49" r="1" fill="#000" stroke="none" />
      {/* segment marks along body */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 1.8 - Math.PI / 2;
        const x = 32 + Math.cos(a) * 24;
        const y = 32 + Math.sin(a) * 24;
        return <circle key={i} cx={x} cy={y} r={1.5} fill="currentColor" stroke="none" />;
      })}
    </Base>
  );
}

/** Flower of Life — sacred geometry, all creation. */
export function FlowerOfLife(props: GlyphProps) {
  const r = 9;
  const cx = 32;
  const cy = 32;
  // 1 center + 6 around
  const centers: Array<[number, number]> = [[cx, cy]];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    centers.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  // outer ring of 6
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    centers.push([cx + Math.cos(a) * r * Math.sqrt(3), cy + Math.sin(a) * r * Math.sqrt(3)]);
  }
  return (
    <Base {...props} strokeWidth={1.6}>
      {centers.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={r} />
      ))}
      {/* enclosing circle */}
      <circle cx={cx} cy={cy} r={r * 3} />
    </Base>
  );
}

/** Vesica Piscis — divine intersection, womb of creation. */
export function VesicaPiscis(props: GlyphProps) {
  return (
    <Base {...props}>
      <circle cx="24" cy="32" r="16" />
      <circle cx="40" cy="32" r="16" />
      {/* central axis */}
      <line x1="32" y1="16" x2="32" y2="48" />
    </Base>
  );
}

/** Compass + Square + G — masonic, hidden architect symbol. */
export function CompassSquareG(props: GlyphProps) {
  return (
    <Base {...props}>
      {/* compass legs */}
      <path d="M32 8 L18 44 M32 8 L46 44" />
      {/* compass hinge */}
      <circle cx="32" cy="8" r="2" fill="currentColor" stroke="none" />
      {/* square (right angle ruler at bottom) */}
      <path d="M14 56 L14 44 L50 44 L50 56" />
      {/* G in center */}
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontSize="14"
        fontFamily="serif"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
      >
        G
      </text>
    </Base>
  );
}

/** Convenience map for dynamic lookup. */
export const Glyphs = {
  ankh: Ankh,
  "eye-of-horus": EyeOfHorus,
  was: Was,
  djed: Djed,
  scarab: Scarab,
  "feather-maat": FeatherMaat,
  ibis: Ibis,
  "sun-disk": SunDisk,
  pyramid: Pyramid,
  ouroboros: Ouroboros,
  "flower-of-life": FlowerOfLife,
  "vesica-piscis": VesicaPiscis,
  "compass-square-g": CompassSquareG,
} as const;

export type GlyphName = keyof typeof Glyphs;
