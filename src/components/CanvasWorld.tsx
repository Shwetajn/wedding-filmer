import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../data/world";
import { headline } from "../data/mainCanvasLayout";
import { useCanvasEngine } from "../hooks/useCanvasEngine";
import { useGuidedStory } from "../hooks/useGuidedStory";
import { CanvasControls } from "./CanvasControls";
import { JourneyPill } from "./JourneyPill";
import { MainCanvasScene } from "./main-canvas/MainCanvasScene";

// the resting pose: centered on the "HI THERE, I AM SHWETA JAIN / Follow My
// Journey" block, framed prominently — not the full zoomed-out overview
const ENTRY_POINT = { x: headline.x + headline.width / 2, y: headline.y + headline.height / 2 };
const ENTRY_SCALE = 1;

export function CanvasWorld() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const engine = useCanvasEngine();
  const { x, y, scale, containerRef, handleWheel, handlePointerDown, handlePointerMove, handlePointerUp, focusOn, setJourneyStopper } = engine;

  const [zoomedOut, setZoomedOut] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const guidedStory = useGuidedStory({ focusOn, setJourneyStopper, reduced: prefersReducedMotion });

  useEffect(() => {
    // land directly on the centered headline — the paper opening is the only
    // motion into this view, the guided story only starts on explicit request
    const el = containerRef.current;
    const vw = el?.clientWidth ?? window.innerWidth;
    const vh = el?.clientHeight ?? window.innerHeight;
    scale.set(ENTRY_SCALE);
    x.set(vw / 2 - ENTRY_POINT.x * ENTRY_SCALE);
    y.set(vh / 2 - ENTRY_POINT.y * ENTRY_SCALE);
    setZoomedOut(true);
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
          <MainCanvasScene
            reduced={prefersReducedMotion}
            headingStopIndex={guidedStory.headingStopIndex}
            headingRevealed={guidedStory.headingRevealed}
            revealedStops={guidedStory.revealedStops}
            captionStopIndex={guidedStory.captionStopIndex}
            captionRevealed={guidedStory.captionRevealed}
            drawingFragment={guidedStory.drawingFragment}
            drawnFragments={guidedStory.drawnFragments}
            aboutRevealed={guidedStory.aboutRevealed}
            aboutTyping={guidedStory.aboutTyping}
            onFollowJourney={() => guidedStory.start()}
          />
        </motion.div>
      </motion.div>

      {zoomedOut && <CanvasControls scale={scale} showHint={showHint} onReplayJourney={() => guidedStory.start()} />}

      {guidedStory.isRunning && <JourneyPill mode="end" onClick={() => guidedStory.stop()} />}
      {guidedStory.canResume && <JourneyPill mode="continue" onClick={() => guidedStory.resume()} />}
    </div>
  );
}
