import { polaroidFrame } from "../../data/mainCanvasLayout";

interface PolaroidCardProps {
  x: number;
  y: number;
  width: number;
  height: number;
  /** frame image is desaturated slightly per Paper's exact filter */
  frameFilter?: string;
  children: React.ReactNode;
}

/** the reusable polaroid-card shell (frame texture + drop shadow, baked into the asset) */
export function PolaroidCard({ x, y, width, height, frameFilter, children }: PolaroidCardProps) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width, height, overflow: "clip", boxSizing: "border-box" }}>
      <img
        src={polaroidFrame}
        alt=""
        style={{ position: "absolute", left: 0, top: 0, width, height, objectFit: "cover", filter: frameFilter }}
      />
      {children}
    </div>
  );
}
