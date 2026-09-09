import type { PlaceholderVariant } from "../types";

interface Composition {
  bg: string;
  shapes: React.ReactNode;
  grainStrength?: number;
}

/**
 * Each variant is an art-directed abstract composition standing in for a
 * real photograph — duotone-leaning gradients, soft bokeh, silhouettes and
 * grain, never a literal icon. Swap <img> in later without touching layout
 * (see PhotoFrame).
 */
function getComposition(variant: PlaceholderVariant): Composition {
  switch (variant) {
    case "crowd":
      return {
        bg: "linear-gradient(178deg, #1f1c18 0%, #3c3830 45%, #5c564a 100%)",
        grainStrength: 0.16,
        shapes: (
          <>
            <ellipse cx="78" cy="14" rx="30" ry="20" fill="rgba(255,214,150,0.16)" style={{ filter: "blur(6px)" }} />
            {Array.from({ length: 11 }).map((_, i) => (
              <ellipse key={i} cx={2 + i * 9.2} cy={82 + (i % 3) * 3.5} rx={4.6} ry={9} fill="rgba(10,9,7,0.62)" />
            ))}
            <rect x="0" y="90" width="100" height="10" fill="rgba(8,7,6,0.5)" />
          </>
        ),
      };
    case "stage":
      return {
        bg: "radial-gradient(120% 90% at 50% 14%, #7a5a34 0%, #2c2318 46%, #14100c 100%)",
        grainStrength: 0.14,
        shapes: (
          <>
            <ellipse cx="50" cy="16" rx="20" ry="14" fill="rgba(255,224,170,0.28)" style={{ filter: "blur(5px)" }} />
            <polygon points="0,100 18,36 38,100" fill="rgba(0,0,0,0.4)" />
            <polygon points="58,100 82,26 100,100" fill="rgba(0,0,0,0.34)" />
          </>
        ),
      };
    case "backstage":
      return {
        bg: "linear-gradient(158deg, #17140f 0%, #332c22 65%, #46392a 100%)",
        grainStrength: 0.18,
        shapes: (
          <>
            <rect x="6" y="24" width="26" height="66" fill="rgba(0,0,0,0.4)" />
            <ellipse cx="74" cy="40" rx="17" ry="15" fill="rgba(255,205,150,0.22)" style={{ filter: "blur(4px)" }} />
            <rect x="0" y="0" width="100" height="6" fill="rgba(0,0,0,0.3)" />
          </>
        ),
      };
    case "flash":
      return {
        bg: "radial-gradient(65% 55% at 50% 42%, #fdf7e8 0%, #cbb888 30%, #382c1e 70%, #16110b 100%)",
        grainStrength: 0.22,
        shapes: <ellipse cx="50" cy="40" rx="10" ry="10" fill="rgba(255,255,255,0.85)" style={{ filter: "blur(3px)" }} />,
      };
    case "mic":
      return {
        bg: "linear-gradient(200deg, #26221c 0%, #100e0b 80%)",
        grainStrength: 0.15,
        shapes: (
          <>
            <rect x="46" y="10" width="8" height="50" rx="4" fill="rgba(210,204,190,0.5)" />
            <circle cx="50" cy="10" r="9" fill="rgba(210,204,190,0.6)" />
            <ellipse cx="50" cy="10" rx="9" ry="9" fill="rgba(255,235,190,0.18)" style={{ filter: "blur(4px)" }} />
            <rect x="48" y="60" width="4" height="34" fill="rgba(150,144,132,0.4)" />
          </>
        ),
      };
    case "portrait-a":
    case "portrait-b":
      return {
        bg: "linear-gradient(155deg, #d9cdb2 0%, #a68f6c 55%, #4d4030 100%)",
        grainStrength: 0.12,
        shapes: (
          <>
            <ellipse cx="52" cy="62" rx="24" ry="32" fill="rgba(35,28,18,0.3)" />
            <ellipse cx="52" cy="28" rx="13" ry="15" fill="rgba(35,28,18,0.24)" />
          </>
        ),
      };
    case "hands":
    case "intimate":
      return {
        bg: "linear-gradient(150deg, #e6d3ad 0%, #b8935f 55%, #5c4128 100%)",
        grainStrength: 0.12,
        shapes: <ellipse cx="54" cy="58" rx="28" ry="30" fill="rgba(60,40,20,0.22)" style={{ filter: "blur(1px)" }} />,
      };
    case "quiet":
      return {
        bg: "linear-gradient(180deg, #ece2cd 0%, #cbb996 100%)",
        grainStrength: 0.08,
        shapes: <ellipse cx="50" cy="66" rx="28" ry="18" fill="rgba(90,68,40,0.16)" style={{ filter: "blur(2px)" }} />,
      };
    case "architecture":
      return {
        bg: "linear-gradient(195deg, #414c5e 0%, #20242c 68%)",
        grainStrength: 0.1,
        shapes: (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1={i * 22} y1="100" x2={i * 22 + 9} y2="6" stroke="rgba(230,224,210,0.22)" strokeWidth="1.2" />
            ))}
            <rect x="0" y="0" width="100" height="30" fill="rgba(255,255,255,0.04)" />
          </>
        ),
      };
    case "nature":
      return {
        bg: "linear-gradient(180deg, #cdd6c3 0%, #7d8d68 55%, #33401f 100%)",
        grainStrength: 0.09,
        shapes: <path d="M0,68 Q25,38 50,60 T100,48 V100 H0 Z" fill="rgba(18,24,12,0.32)" />,
      };
    case "light":
      return {
        bg: "radial-gradient(65% 55% at 68% 26%, #fff7e0 0%, #e2c887 32%, #5c4a2c 70%, #2a2115 100%)",
        grainStrength: 0.1,
        shapes: <circle cx="68" cy="26" r="9" fill="rgba(255,252,240,0.7)" style={{ filter: "blur(2px)" }} />,
      };
    case "gallery":
      return {
        bg: "linear-gradient(172deg, #e9e3d3 0%, #b2a68f 100%)",
        grainStrength: 0.07,
        shapes: (
          <>
            <rect x="16" y="20" width="26" height="36" fill="rgba(35,30,20,0.18)" />
            <rect x="54" y="32" width="30" height="24" fill="rgba(35,30,20,0.14)" />
          </>
        ),
      };
    case "street":
      return {
        bg: "linear-gradient(190deg, #47443a 0%, #201e19 100%)",
        grainStrength: 0.14,
        shapes: <path d="M0,88 L45,52 L100,88 Z" fill="rgba(0,0,0,0.38)" />,
      };
    case "banner":
      return {
        bg: "linear-gradient(122deg, #263449 0%, #141b28 100%)",
        grainStrength: 0.12,
        shapes: (
          <>
            <rect x="0" y="38" width="100" height="3.5" fill="rgba(224,218,200,0.35)" />
            <rect x="0" y="50" width="66" height="3.5" fill="rgba(224,218,200,0.2)" />
          </>
        ),
      };
    case "reel":
    case "filmlight":
      return {
        bg: "linear-gradient(198deg, #181712 0%, #38332a 100%)",
        grainStrength: 0.2,
        shapes: (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <rect key={i} x={-10 + i * 30} y="0" width="14" height="100" fill="rgba(255,232,190,0.06)" transform={`skewX(-10)`} />
            ))}
          </>
        ),
      };
    case "horizon":
      return {
        bg: "linear-gradient(180deg, #e2e5df 0%, #b9c2c4 44%, #47586a 46%, #1b2430 100%)",
        grainStrength: 0.06,
        shapes: <circle cx="72" cy="38" r="8" fill="rgba(255,250,235,0.5)" style={{ filter: "blur(1.5px)" }} />,
      };
    case "detail":
      return {
        bg: "linear-gradient(160deg, #c7bfa8 0%, #756c54 100%)",
        grainStrength: 0.1,
        shapes: <rect x="30" y="30" width="40" height="40" fill="rgba(30,26,18,0.16)" />,
      };
    default:
      return { bg: "linear-gradient(160deg,#cfc7b4,#8b8270)", shapes: null, grainStrength: 0.08 };
  }
}

interface PhotoPlaceholderProps {
  variant: PlaceholderVariant;
  className?: string;
  style?: React.CSSProperties;
}

export function PhotoPlaceholder({ variant, className, style }: PhotoPlaceholderProps) {
  const { bg, shapes, grainStrength = 0.1 } = getComposition(variant);

  return (
    <div className={className} style={{ position: "absolute", inset: 0, overflow: "hidden", background: bg, ...style }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true">
        {shapes}
      </svg>
      <div aria-hidden="true" className="photo-grain" style={{ opacity: grainStrength }} />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 22px rgba(0,0,0,0.32), inset 0 0 3px rgba(0,0,0,0.2)",
          mixBlendMode: "multiply",
          opacity: 0.5,
        }}
      />
    </div>
  );
}
