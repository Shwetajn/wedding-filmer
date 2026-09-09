import { useState } from "react";
import { motion } from "motion/react";
import paperBg from "../../assets/intro/paper-bg.png";

interface PastedPapersProps {
  reduced: boolean;
  /** fired once the two sheets have fully met in the center and covered the scene */
  onClosed: () => void;
  /** fired once the sheets have finished opening apart */
  onComplete: () => void;
}

const EASE: [number, number, number, number] = [0.5, 0, 0.2, 1];
// Panels travel their own full height (100%) so they genuinely start off-screen
// above/below, then ease down/up into place with a small settle overshoot.
const CLOSE_TRANSITION = { duration: 0.85, times: [0, 0.7, 1], ease: EASE };
const HOLD_MS = 450;
const OPEN_TRANSITION = { duration: 0.8, times: [0, 1], ease: EASE };

/** Two physical sheets of the same paper come down from fully off-screen, meet
 * and hold for a beat once fully closed, then part like a pair of doors — the
 * paper itself is the transition into the next canvas. The close/open split
 * is driven by the panels' own animation-complete signal (not a guessed
 * timeout) so whatever is swapped in underneath is never exposed early. */
export function PastedPapers({ reduced, onClosed, onComplete }: PastedPapersProps) {
  const [stage, setStage] = useState<"closing" | "open">("closing");

  const handleClosed = () => {
    onClosed();
    setTimeout(() => {
      setStage("open");
    }, reduced ? 0 : HOLD_MS);
  };

  if (reduced) {
    return (
      <motion.div
        className="intro-shutter-reduced"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        onAnimationStart={onClosed}
        onAnimationComplete={onComplete}
      />
    );
  }

  return (
    <div className="intro-shutter">
      <motion.div
        className="intro-shutter__panel intro-shutter__panel--top"
        style={{ backgroundImage: `url(${paperBg})` }}
        initial={{ y: "-100%", rotate: -2.6 }}
        animate={
          stage === "closing"
            ? { y: ["-100%", "3%", "0%"], rotate: [-2.6, 0.6, -0.3] }
            : { y: ["0%", "-101%"], rotate: [-0.3, -1.8] }
        }
        transition={stage === "closing" ? CLOSE_TRANSITION : OPEN_TRANSITION}
        onAnimationComplete={() => {
          (stage === "closing" ? handleClosed : onComplete)();
        }}
      />
      <motion.div
        className="intro-shutter__panel intro-shutter__panel--bottom"
        style={{ backgroundImage: `url(${paperBg})` }}
        initial={{ y: "100%", rotate: 2.2 }}
        animate={
          stage === "closing"
            ? { y: ["100%", "-3%", "0%"], rotate: [2.2, -0.5, 0.3] }
            : { y: ["0%", "101%"], rotate: [0.3, 1.6] }
        }
        transition={stage === "closing" ? CLOSE_TRANSITION : OPEN_TRANSITION}
      />
    </div>
  );
}
