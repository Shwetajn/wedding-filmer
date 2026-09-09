import { motion } from "motion/react";
import { jitter } from "../utils/seed";

export type DoodleKind = "circle" | "underline" | "scribble" | "cross" | "arrow" | "star" | "loop" | "connector" | "hand-rock";

interface DoodleProps {
  id?: string;
  kind: DoodleKind;
  x: number;
  y: number;
  width?: number;
  rotation?: number;
  color?: "ink" | "blue" | "red";
  seed?: string;
  /** play a one-time hand-drawn stroke reveal instead of rendering static */
  draw?: boolean;
  onDrawComplete?: () => void;
}

const STROKE: Record<string, string> = {
  ink: "var(--charcoal)",
  blue: "var(--accent-blue)",
  red: "var(--accent-red)",
};

/** A small library of rough, hand-drawn editorial marks — never the same path twice. */
function paths(kind: DoodleKind, seed: string): { viewBox: string; d: string[] } {
  const j = (n: number) => jitter(seed + n, 3);
  switch (kind) {
    case "circle":
      return {
        viewBox: "0 0 120 60",
        d: [
          `M ${14 + j(1)} ${34 + j(2)} C ${10 + j(3)} ${14}, ${40} ${4 + j(4)}, ${62} ${6} C ${92} ${8}, ${112 + j(5)} ${22}, ${104} ${42} C ${96} ${58}, ${52} ${58 + j(6)}, ${28} ${48} C ${16} ${43}, ${13} ${38}, ${18} ${33}`,
        ],
      };
    case "underline":
      return {
        viewBox: "0 0 140 20",
        d: [`M 3 ${10 + j(1)} C ${35 + j(2)} ${4}, ${90 - j(3)} ${16}, ${136} ${8 + j(4)}`],
      };
    case "scribble":
      return {
        viewBox: "0 0 90 60",
        d: [
          `M 6 40 C 20 10, 30 50, 42 20 C 50 2, 58 30, 48 44 C 42 52, 62 52, 70 34 C 76 20, 66 10, 78 8 C 84 7, 88 14, 84 20`,
        ],
      };
    case "cross":
      return {
        viewBox: "0 0 26 26",
        d: [`M 2 2 L 24 24`, `M 24 3 L 2 23`],
      };
    case "arrow":
      return {
        viewBox: "0 0 70 30",
        d: [`M 2 ${16 + j(1)} C 20 ${10}, 40 ${20}, 58 ${13}`, `M 46 6 C 52 9, 58 11, 58 13 C 58 15, 51 18, 45 21`],
      };
    case "star":
      return {
        viewBox: "0 0 40 40",
        d: [
          "M 20 3 L 24 16 L 37 16 L 26 24 L 30 37 L 20 29 L 10 37 L 14 24 L 3 16 L 16 16 Z",
        ],
      };
    case "loop":
      return {
        viewBox: "0 0 60 40",
        d: [
          `M 4 30 C 4 10, 24 6, 26 20 C 28 32, 12 34, 16 22 C 20 10, 40 6, 44 20 C 47 30, 38 34, 34 26`,
        ],
      };
    case "connector":
      return {
        viewBox: "0 0 200 120",
        d: [`M 4 ${100 + j(1)} C ${50} ${20}, ${120} ${110}, ${196} ${10 + j(2)}`],
      };
    case "hand-rock":
      // a loose "rock on" hand gesture — fist with index + pinky raised, thumb out
      return {
        viewBox: "0 0 70 90",
        d: [
          `M 24 88 C 14 86, 9 78, 9 66 L 9 46 C 9 42, 12 39, 16 39 C 19 39, 21 41, 22 44
           L 22 30 C 22 26, 25 23, 29 23 C 33 23, 36 26, 36 30 L 36 22 C 36 18, 39 15, 43 15
           C 47 15, 50 18, 50 22 L 50 30 C 50 26, 53 23, 57 23 C 61 23, 64 26, 64 30 L 64 60
           C 64 76, 53 88, 38 88 Z`,
          `M 22 30 L 21 12 C 21 7, 25 3, 30 4 C 34 5, 36 9, 35 13 L 34 30`,
          `M 50 30 L 52 10 C 52 5, 57 2, 61 4 C 65 6, 66 11, 64 15 L 62 30`,
          `M 9 50 C 4 48, -1 44, -3 38`,
        ],
      };
    default:
      return { viewBox: "0 0 10 10", d: [] };
  }
}

export function Doodle({ id, kind, x, y, width = 80, rotation = 0, color = "ink", seed, draw, onDrawComplete }: DoodleProps) {
  const s = seed ?? `${kind}-${x}-${y}`;
  const { viewBox, d } = paths(kind, s);
  const [, , vw, vh] = viewBox.split(" ").map(Number);
  const stroke = STROKE[color];
  const strokeWidth = kind === "cross" || kind === "underline" ? 1.6 : kind === "hand-rock" ? 2.2 : 2;
  const dashed = kind === "connector";

  return (
    <svg
      aria-hidden="true"
      data-doodle-id={id}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height: (width * vh) / vw,
        transform: `rotate(${rotation}deg)`,
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 0,
      }}
      viewBox={viewBox}
      fill="none"
    >
      {d.map((path, i) => {
        // draw === false: waiting for its cue, not drawn yet — render nothing
        if (draw === false) return null;
        // draw === true: play the one-time hand-drawn stroke reveal
        if (draw === true) {
          return (
            <motion.path
              key={i}
              d={path}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={0.85}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: i * 0.12 }}
              onAnimationComplete={i === d.length - 1 ? onDrawComplete : undefined}
            />
          );
        }
        // draw === undefined: already drawn / not a guided doodle — render static
        return (
          <path
            key={i}
            d={path}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.75}
            strokeDasharray={dashed ? "1 7" : undefined}
          />
        );
      })}
    </svg>
  );
}
