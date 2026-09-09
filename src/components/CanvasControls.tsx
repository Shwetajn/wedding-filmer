import { motion, AnimatePresence, type MotionValue, useTransform } from "motion/react";

interface CanvasControlsProps {
  scale: MotionValue<number>;
  showHint: boolean;
  onReplayJourney: () => void;
}

export function CanvasControls({ scale, showHint, onReplayJourney }: CanvasControlsProps) {
  const percent = useTransform(scale, (s) => `${Math.round(s * 100)}%`);

  return (
    <>
      <div className="canvas-controls" aria-hidden="true">
        <motion.span className="canvas-controls__zoom">{percent}</motion.span>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.p
            className="canvas-controls__hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            explore ↗
          </motion.p>
        )}
      </AnimatePresence>

      <button type="button" className="canvas-controls__replay" onClick={onReplayJourney}>
        follow the journey →
      </button>
    </>
  );
}
