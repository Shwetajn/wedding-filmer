type Corner = "tr" | "br" | "tl" | "bl";

interface CornerBracketProps {
  x: number;
  y: number;
  corner: Corner;
}

const PATH = "M0.000 0.000C0.000 0.000 23.569 0.000 23.569 0.000C23.569 0.000 23.569 20.142 23.569 20.142";
const SIZE = 23.57;
const HEIGHT = 20.142;

const FLIP_Y = `translate(0 ${HEIGHT}) scale(1 -1)`;

/** the small hand-drawn L corner mark framing each stop's story text — one base
 * path mirrored/rotated per corner, matching Paper's exact composition */
export function CornerBracket({ x, y, corner }: CornerBracketProps) {
  const rotate180 = corner === "tl" || corner === "bl";
  const flipY = corner === "br" || corner === "tl";

  const path = <path d={PATH} vectorEffect="non-scaling-stroke" fill="none" stroke="#000000" strokeWidth={1.119} />;

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${HEIGHT}`}
      width={SIZE}
      height={HEIGHT}
      style={{
        position: "absolute",
        left: x,
        top: y,
        overflow: "visible",
        rotate: rotate180 ? "180deg" : undefined,
        transformOrigin: rotate180 ? "0% 0%" : undefined,
      }}
    >
      {flipY ? <g transform={FLIP_Y}>{path}</g> : path}
    </svg>
  );
}
