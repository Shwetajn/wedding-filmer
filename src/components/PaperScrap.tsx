import type { PaperScrap as PaperScrapData } from "../types";
import { jitter } from "../utils/seed";

interface PaperScrapProps {
  scrap: PaperScrapData;
}

/** A small torn slip of paper resting on the canvas — a caption, index mark or arrow. Never a UI card. */
export function PaperScrap({ scrap }: PaperScrapProps) {
  const rotation = scrap.rotation ?? jitter(scrap.id, 3);
  const isHand = scrap.kind !== "index";

  return (
    <div
      className={`paper-scrap paper-scrap--${scrap.kind ?? "note"}`}
      aria-hidden="true"
      style={{
        position: "absolute",
        left: scrap.x,
        top: scrap.y,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <span style={{ fontFamily: isHand ? "var(--font-hand)" : "var(--font-mono)" }}>{scrap.text}</span>
    </div>
  );
}
