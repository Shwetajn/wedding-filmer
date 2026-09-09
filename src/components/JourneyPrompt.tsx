import { motion } from "motion/react";

interface JourneyPromptProps {
  onFollow: () => void;
  onDismiss: () => void;
}

export function JourneyPrompt({ onFollow, onDismiss }: JourneyPromptProps) {
  return (
    <motion.div
      className="journey-prompt"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
      role="dialog"
      aria-label="journey invitation"
    >
      <p className="journey-prompt__line">There's a story here.</p>
      <p className="journey-prompt__line journey-prompt__line--soft">
        You can explore freely — or follow the path I left for you.
      </p>
      <div className="journey-prompt__actions">
        <button type="button" className="journey-prompt__cta" onClick={onFollow}>
          Follow the journey →
        </button>
        <button type="button" className="journey-prompt__dismiss" onClick={onDismiss}>
          I'll wander
        </button>
      </div>
    </motion.div>
  );
}
