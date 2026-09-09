import { motion } from "motion/react";
import { useMemo } from "react";
import cameraImg from "../../assets/intro/camera.png";
import { YellowGraphic } from "./YellowGraphic";
import type { IntroPhase } from "./phases";

interface CameraAssetProps {
  phase: IntroPhase;
  reduced: boolean;
}

const REST_ROTATE = -0.8;

/** The camera is a physical sticker being pasted onto the paper — picked up,
 * placed, tiny rotation correction, pressed down, settled. It never zooms
 * and never grows beyond its placed size. */
export function CameraAsset({ phase, reduced }: CameraAssetProps) {
  const restTarget = useMemo(
    () => ({ opacity: 1, rotate: REST_ROTATE, scale: 1, x: 0, y: 0 }),
    []
  );

  const pasteKeyframes = useMemo(
    () => ({
      opacity: [0, 1, 1, 1, 1],
      x: [-16, -16, 3, -1.5, 0],
      y: [-22, -22, 3, -1.5, 0],
      rotate: [-8, -8, 1.6, -0.5, REST_ROTATE],
      scale: [1.035, 1.035, 0.985, 1.008, 1],
    }),
    []
  );

  const started = phase !== "paper" && phase !== "quote";

  return (
    <motion.div
      className="intro-camera-asset"
      initial={reduced ? restTarget : { opacity: 0, x: -16, y: -22, rotate: -8, scale: 1.035 }}
      animate={started ? (reduced ? restTarget : pasteKeyframes) : { opacity: 0 }}
      transition={
        reduced
          ? { duration: 0.35 }
          : { duration: 0.7, times: [0, 0.16, 0.58, 0.8, 1], ease: "easeOut" }
      }
    >
      <img src={cameraImg} alt="" className="intro-camera-asset__img" draggable={false} />
      <YellowGraphic active={!reduced && phase === "camera"} />
    </motion.div>
  );
}
