import { motion, AnimatePresence } from "motion/react";
import type { PhotoMeta } from "../types";

interface PhotoStoryProps {
  photo: PhotoMeta | null;
  text: string;
  secondaryNote?: string;
  onClose: () => void;
}

export function PhotoStory({ photo, text, secondaryNote, onClose }: PhotoStoryProps) {
  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="photo-story"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            left: photo.x + photo.width + 28,
            top: photo.y + 10,
            width: 240,
            zIndex: 31,
          }}
        >
          <p className="photo-story__text">{text}</p>
          {secondaryNote && <p className="photo-story__note">{secondaryNote}</p>}
          <button type="button" className="photo-story__close" onClick={onClose} aria-label="close story">
            close ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
