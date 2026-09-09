import { useState } from "react";
import { motion } from "motion/react";
import { Typewriter } from "../Typewriter";

interface TypewriterQuoteProps {
  reduced: boolean;
  onDone: () => void;
}

const LINE_1 = "“Photography is 5% skill, 5% gear";
const LINE_2 = "and 90% being there.”";
const FULL = `${LINE_1}\n${LINE_2}`;
const ATTRIBUTION = "— Joseph Radhik";

export function TypewriterQuote({ reduced, onDone }: TypewriterQuoteProps) {
  const [showAttribution, setShowAttribution] = useState(reduced);

  return (
    <div className="intro-quote">
      <p className="intro-quote__text">
        <Typewriter
          text={FULL}
          reduced={reduced}
          onTypingComplete={() => setTimeout(() => setShowAttribution(true), 220)}
          onDone={onDone}
          cursorClassName="intro-quote__cursor"
        />
      </p>
      <motion.p
        className="intro-quote__attribution"
        initial={{ opacity: 0 }}
        animate={{ opacity: showAttribution ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {ATTRIBUTION}
      </motion.p>
    </div>
  );
}
