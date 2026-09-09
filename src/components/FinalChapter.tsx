import { motion } from "motion/react";
import type { ChapterData } from "../types";
import { PhotoFrame } from "./PhotoFrame";
import { ContactLinks } from "./ContactLinks";

interface FinalChapterProps {
  chapter: ChapterData;
  registerRef?: (el: HTMLDivElement | null) => void;
}

export function FinalChapter({ chapter, registerRef }: FinalChapterProps) {
  return (
    <div ref={registerRef} data-chapter-id={chapter.id}>
      <PhotoFrame photo={chapter.hero} active onClick={() => {}} />

      <motion.div
        className="final-chapter"
        style={{
          position: "absolute",
          left: chapter.position.x - 460,
          top: chapter.position.y - 60,
          width: 380,
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1 }}
      >
        {chapter.story.split("\n\n").map((line, i) => (
          <p key={i} className={i === 0 ? "final-chapter__line" : "final-chapter__line final-chapter__line--emphasis"}>
            {line}
          </p>
        ))}

        <div className="final-chapter__signature">
          <h2>Shweta Jain</h2>
          <p>
            Product Designer.
            <br />
            Photographer at heart.
            <br />
            Learning to become a filmmaker.
          </p>
        </div>

        <ContactLinks />
      </motion.div>
    </div>
  );
}
