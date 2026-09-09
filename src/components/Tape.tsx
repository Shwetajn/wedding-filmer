import { jitter, unit } from "../utils/seed";

interface TapeProps {
  seed: string;
  position: "top" | "top-left" | "top-right";
}

/** A physical-feeling strip of masking tape — irregular edges, slight rotation, translucent. */
export function Tape({ seed, position }: TapeProps) {
  const rot = jitter(seed + position, 4.5);
  const wobble = unit(seed + position + "w");
  const width = 46 + wobble * 20;
  const leftOffsets: Record<string, string> = {
    top: "50%",
    "top-left": `${22 + wobble * 8}%`,
    "top-right": `${68 + wobble * 8}%`,
  };

  return (
    <span
      className="tape-strip"
      aria-hidden="true"
      style={{
        left: leftOffsets[position],
        width,
        transform: `translateX(-50%) rotate(${rot}deg)`,
        opacity: 0.72 + wobble * 0.16,
      }}
    />
  );
}
