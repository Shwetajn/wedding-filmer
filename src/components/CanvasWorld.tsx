import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { chapters } from "../data/chapters";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../data/world";
import { useCanvasEngine } from "../hooks/useCanvasEngine";
import { useJourney } from "../hooks/useJourney";
import { Chapter } from "./Chapter";
import { Chapter1 } from "./Chapter1";
import { FinalChapter } from "./FinalChapter";
import { CanvasControls } from "./CanvasControls";
import { JourneyPill } from "./JourneyPill";
import mainCanvasBg from "../assets/intro/main-canvas.png";

const ENTRY_POINT = chapters[0].position;
const STOP1_SCALE = 0.62;
const ENTRY_SCALE = 1.7;

export function CanvasWorld() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const engine = useCanvasEngine();
  const { x, y, scale, containerRef, handleWheel, handlePointerDown, handlePointerMove, handlePointerUp, focusOn, setJourneyStopper } = engine;

  const [zoomedOut, setZoomedOut] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const journey = useJourney({ chapters, focusOn, setJourneyStopper, reduced: prefersReducedMotion });

  useEffect(() => {
    // resting pose the guided pan starts from — already framing stop 1, just tighter
    const el = containerRef.current;
    const vw = el?.clientWidth ?? window.innerWidth;
    const vh = el?.clientHeight ?? window.innerHeight;
    const initialScale = prefersReducedMotion ? STOP1_SCALE : ENTRY_SCALE;
    scale.set(initialScale);
    x.set(vw / 2 - ENTRY_POINT.x * initialScale);
    y.set(vh / 2 - ENTRY_POINT.y * initialScale);
    setZoomedOut(true);
    journey.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFirstInteraction = () => {
    if (showHint) setShowHint(false);
  };

  return (
    <div
      ref={containerRef}
      className="canvas-viewport"
      onWheel={handleWheel}
      onPointerDown={(e) => {
        handleFirstInteraction();
        handlePointerDown(e);
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="canvas-world__photo" style={{ backgroundImage: `url(${mainCanvasBg})` }} />
      <div className="canvas-world__paper" />

      <motion.div
        className="canvas-world"
        style={{
          position: "absolute",
          width: WORLD_WIDTH,
          height: WORLD_HEIGHT,
          x,
          y,
          scale,
          transformOrigin: "0 0",
        }}
      >
        <motion.div
          animate={{ opacity: zoomedOut ? 1 : 0 }}
          transition={{ duration: 1.4 }}
          style={{ pointerEvents: zoomedOut ? "auto" : "none" }}
        >
          <Chapter1
            chapter={chapters[0]}
            heroRevealed={journey.heroRevealed}
            heroFocusing={journey.heroFocusing}
            playDoodleDraw={journey.playDoodleDraw}
          />
          {chapters.slice(1, 4).map((chapter) => (
            <Chapter key={chapter.id} chapter={chapter} />
          ))}
          <FinalChapter chapter={chapters[4]} />
        </motion.div>
      </motion.div>

      {zoomedOut && <CanvasControls scale={scale} showHint={showHint} onReplayJourney={() => journey.start()} />}

      {journey.isRunning && <JourneyPill mode="end" onClick={() => journey.stop()} />}
      {journey.canResume && <JourneyPill mode="continue" onClick={() => journey.resume()} />}
    </div>
  );
}
