import { useState } from "react";
import type { ChapterData, PhotoMeta } from "../types";
import { PhotoFrame } from "./PhotoFrame";
import { Annotation } from "./Annotation";
import { PaperScrap } from "./PaperScrap";
import { Doodle } from "./Doodle";

interface Chapter1Props {
  chapter: ChapterData;
  registerRef?: (el: HTMLDivElement | null) => void;
  /** false while the guided intro is holding the hero grey before its zoom-in reveal */
  heroRevealed?: boolean;
  /** true while the camera is zoomed into the hero — recedes everything else */
  heroFocusing?: boolean;
  /** true to play the one-time stroke-draw animation on the hero's doodle */
  playDoodleDraw?: boolean;
  onDoodleDrawComplete?: () => void;
}

/** connecting hand-drawn line + its corner-bracket accents, traced from the
 * source composition and simply rescaled — same loose, wobbly feel. */
const CONNECTOR_PATH =
  "M692.4 1789.5 C692.4 1789.5, 850.0 1928.8, 920.9 1900.1 C1072.9 1838.6, 939.8 1777.0, 1407.4 1630.9";

const BRACKETS: { x1: number; y1: number; x2: number; y2: number; x3: number; y3: number }[] = [
  { x1: 1148.5, y1: 1541.6, x2: 1169.7, y2: 1541.6, x3: 1169.7, y3: 1559.8 },
  { x1: 1148.5, y1: 1732.2, x2: 1169.7, y2: 1732.2, x3: 1169.7, y3: 1714.0 },
  { x1: 888.1, y1: 1541.6, x2: 866.8, y2: 1541.6, x3: 866.8, y3: 1559.8 },
  { x1: 888.1, y1: 1732.2, x2: 866.8, y2: 1732.2, x3: 866.8, y3: 1714.0 },
];

/** Stop 1 / Chapter 1 — the one bespoke chapter laid out to match the
 * provided composition: one highlighted photograph, four supporting
 * photographs, a live title/story pair set in Bebas Neue / Satoshi, and the
 * existing doodles/annotations. Also drives the guided-intro choreography:
 * hero starts grey, the camera zooms into it while it reveals color and the
 * rest of the board recedes, then its doodle draws itself in. */
export function Chapter1({
  chapter,
  registerRef,
  heroRevealed = true,
  heroFocusing = false,
  playDoodleDraw = false,
  onDoodleDrawComplete,
}: Chapter1Props) {
  const [activeId, setActiveId] = useState(chapter.hero.id);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  // once the hand doodle has played its draw-in once, it just stays static —
  // this also covers a standalone visit where heroRevealed is true from the start
  const [handDoodleDrawn, setHandDoodleDrawn] = useState(heroRevealed);

  const handleSelect = (photo: PhotoMeta) => {
    setFocusedId((prev) => (prev === photo.id ? null : photo.id));
  };

  const handleHandDoodleComplete = () => {
    setHandDoodleDrawn(true);
    onDoodleDrawComplete?.();
  };

  const heroActive = heroRevealed && activeId === chapter.hero.id;
  const handDoodleDrawState = handDoodleDrawn ? undefined : playDoodleDraw;

  return (
    <div ref={registerRef} data-chapter-id={chapter.id}>
      <div
        className="stop1-recede"
        style={{
          opacity: heroFocusing ? 0.4 : 1,
          filter: heroFocusing ? "blur(2px)" : "none",
          transition: "opacity 1.1s var(--ease-editorial), filter 1.1s var(--ease-editorial)",
        }}
      >
        <div className="stop1-title" style={{ position: "absolute", left: 468, top: 1289, pointerEvents: "none" }}>
          <span className="stop1-title__index">{chapter.index}</span>
          <h2 className="stop1-title__heading">
            Where It All
            <br />
            <span className="stop1-title__heading--accent">Started</span>
          </h2>
        </div>

        <svg
          aria-hidden="true"
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none", zIndex: 0 }}
          width="1"
          height="1"
        >
          <path
            d={CONNECTOR_PATH}
            fill="none"
            stroke="var(--charcoal)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="2 9"
            opacity={0.7}
          />
          {BRACKETS.map((b, i) => (
            <path
              key={i}
              d={`M${b.x1} ${b.y1} L${b.x2} ${b.y2} L${b.x3} ${b.y3}`}
              fill="none"
              stroke="var(--ink)"
              strokeWidth="1.6"
              opacity={0.55}
            />
          ))}
        </svg>

        <div className="stop1-story" style={{ position: "absolute", left: 867, top: 1542, width: 303 }}>
          <p className="stop1-story__text">{chapter.story}</p>
        </div>

        {chapter.doodles?.map((doodle, i) =>
          doodle.id === "c1-hero-doodle" ? null : <Doodle key={i} {...doodle} seed={`${chapter.id}-doodle-${i}`} />
        )}

        {chapter.paperScraps?.map((scrap) => (
          <PaperScrap key={scrap.id} scrap={scrap} />
        ))}

        {chapter.annotations?.map((a, i) => (
          <Annotation key={i} text={a.text} x={a.x} y={a.y} rotation={a.rotation} tone={a.tone} behind={a.behind} />
        ))}

        {chapter.photos.map((photo) => (
          <PhotoFrame
            key={photo.id}
            photo={photo}
            active={activeId === photo.id}
            focused={focusedId === photo.id}
            onHoverStart={() => setActiveId(photo.id)}
            onHoverEnd={() => setActiveId(chapter.hero.id)}
            onClick={() => handleSelect(photo)}
          />
        ))}
      </div>

      <PhotoFrame
        photo={chapter.hero}
        active={heroActive}
        focused={focusedId === chapter.hero.id}
        onHoverStart={() => setActiveId(chapter.hero.id)}
        onHoverEnd={() => setActiveId(chapter.hero.id)}
        onClick={() => handleSelect(chapter.hero)}
        style={{ zIndex: focusedId === chapter.hero.id ? 30 : 6 }}
      />

      {chapter.doodles?.map((doodle, i) =>
        doodle.id === "c1-hero-doodle" ? (
          <Doodle
            key={i}
            {...doodle}
            seed={`${chapter.id}-doodle-${i}`}
            draw={handDoodleDrawState}
            onDrawComplete={handleHandDoodleComplete}
          />
        ) : null
      )}
    </div>
  );
}
