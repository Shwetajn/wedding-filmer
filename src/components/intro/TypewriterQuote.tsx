import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface TypewriterQuoteProps {
  reduced: boolean;
  onDone: () => void;
}

const LINE_1 = "“Photography is 5% skill, 5% gear";
const LINE_2 = "and 90% being there.”";
const FULL = `${LINE_1}\n${LINE_2}`;
const ATTRIBUTION = "— Joseph Radhik";

const CHAR_MS = 26;

export function TypewriterQuote({ reduced, onDone }: TypewriterQuoteProps) {
  const [count, setCount] = useState(reduced ? FULL.length : 0);
  const [showAttribution, setShowAttribution] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= FULL.length) {
        clearInterval(interval);
        setTimeout(() => setShowAttribution(true), 220);
        setTimeout(onDone, 900);
      }
    }, CHAR_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const typed = FULL.slice(0, count);
  const typingDone = count >= FULL.length;

  return (
    <div className="intro-quote">
      <p className="intro-quote__text">
        {typed}
        {!typingDone && <span className="intro-quote__cursor" aria-hidden="true" />}
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
