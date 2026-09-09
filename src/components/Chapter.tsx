import { useState } from "react";
import type { ChapterData, PhotoMeta } from "../types";
import { PhotoCluster } from "./PhotoCluster";
import { PhotoStory } from "./PhotoStory";
import { Annotation } from "./Annotation";
import { PaperScrap } from "./PaperScrap";
import { ChapterTitle } from "./ChapterTitle";
import { Doodle } from "./Doodle";

interface ChapterProps {
  chapter: ChapterData;
  registerRef?: (el: HTMLDivElement | null) => void;
}

export function Chapter({ chapter, registerRef }: ChapterProps) {
  const [activeId, setActiveId] = useState(chapter.hero.id);
  const [focused, setFocused] = useState<PhotoMeta | null>(null);

  const handleSelect = (photo: PhotoMeta) => {
    setActiveId(photo.id);
    setFocused((prev) => (prev?.id === photo.id ? null : photo));
  };

  return (
    <div ref={registerRef} data-chapter-id={chapter.id}>
      <div
        className="chapter-label"
        style={{
          position: "absolute",
          left: chapter.position.x - 360,
          top: chapter.position.y - 340,
          width: 340,
          textAlign: "right",
          pointerEvents: "none",
        }}
      >
        <span className="chapter-label__index">{chapter.index}</span>
        <ChapterTitle title={chapter.title} emphasis={chapter.titleEmphasis} />
        {chapter.subtitle && <p className="chapter-label__subtitle">{chapter.subtitle}</p>}
      </div>

      {chapter.doodles?.map((doodle, i) => (
        <Doodle key={i} {...doodle} seed={`${chapter.id}-doodle-${i}`} />
      ))}

      {chapter.paperScraps?.map((scrap) => (
        <PaperScrap key={scrap.id} scrap={scrap} />
      ))}

      {chapter.annotations?.map((a, i) => (
        <Annotation key={i} text={a.text} x={a.x} y={a.y} rotation={a.rotation} tone={a.tone} behind={a.behind} />
      ))}

      <PhotoCluster
        hero={chapter.hero}
        photos={chapter.photos}
        videos={chapter.videos}
        activeId={activeId}
        focusedId={focused?.id ?? null}
        onHover={setActiveId}
        onSelect={handleSelect}
      />

      <PhotoStory photo={focused} text={chapter.story} secondaryNote={chapter.secondaryNote} onClose={() => setFocused(null)} />
    </div>
  );
}
