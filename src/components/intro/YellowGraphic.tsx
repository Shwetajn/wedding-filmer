import { motion } from "motion/react";
import cameraImg from "../../assets/intro/camera.png";

// precise bounding box of the yellow spark within camera.png, found by pixel sampling
// (left, top, right, bottom) as percentages — used purely to isolate the existing
// artwork for its own accent animation, never to redraw or recolor it.
const BOX = { top: 2, right: 19, bottom: 42, left: 48 };

interface YellowGraphicProps {
  active: boolean;
}

/** Isolates the existing yellow spark (already baked into camera.png) via clip-path so it can
 * get its own tiny editorial "twingle" while the rest of the camera stays still. */
export function YellowGraphic({ active }: YellowGraphicProps) {
  return (
    <motion.div
      aria-hidden="true"
      className="intro-yellow-graphic"
      style={{
        backgroundImage: `url(${cameraImg})`,
        clipPath: `inset(${BOX.top}% ${BOX.right}% ${BOX.bottom}% ${BOX.left}%)`,
        transformOrigin: "64.5% 30%",
      }}
      initial={{ opacity: 1, scale: 1, filter: "brightness(1)" }}
      animate={
        active
          ? {
              filter: ["brightness(1)", "brightness(1)", "brightness(1.4)", "brightness(1)", "brightness(1.22)", "brightness(1)"],
              scale: [1, 1, 1.05, 1, 1.03, 1],
              rotate: [0, 0, 1.5, 0, -1, 0],
            }
          : { filter: "brightness(1)", scale: 1, rotate: 0 }
      }
      transition={{ duration: 1, times: [0, 0.32, 0.5, 0.66, 0.82, 1], ease: "easeOut" }}
    />
  );
}
