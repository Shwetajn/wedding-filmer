import { motion, AnimatePresence } from "motion/react";

interface JourneyPillProps {
  mode: "end" | "continue";
  onClick: () => void;
}

export function JourneyPill({ mode, onClick }: JourneyPillProps) {
  return (
    <AnimatePresence>
      <motion.button
        key={mode}
        type="button"
        className="journey-pill"
        onClick={onClick}
        initial={{ opacity: 0, x: 16, y: "-50%" }}
        animate={{ opacity: 1, x: 0, y: "-50%" }}
        exit={{ opacity: 0, x: 16, y: "-50%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {mode === "end" ? "End journey" : "Continue journey"}
      </motion.button>
    </AnimatePresence>
  );
}
