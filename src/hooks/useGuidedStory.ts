import { useCallback, useRef, useState } from "react";
import { chapters } from "../data/chapters";
import { stopTitles, TRANSITION_FRAGMENT_INDICES, GUIDED_TRANSITION_S } from "../data/mainCanvasLayout";
import { typewriterDuration } from "../components/Typewriter";
import type { FocusTarget } from "./useCanvasEngine";

type FocusOn = (
  target: FocusTarget,
  duration?: number,
  options?: { ease?: [number, number, number, number]; settle?: boolean }
) => Promise<void>;

interface UseGuidedStoryArgs {
  focusOn: FocusOn;
  setJourneyStopper: (fn: (() => void) | null) => void;
  reduced: boolean;
}

const EASE: [number, number, number, number] = [0.45, 0.05, 0.15, 1];
const STOP_SCALE = 1;
// Deliberate hold once a stop's caption finishes typing, before the connector
// starts drawing to the next stop. Was originally 10s; trimmed to 2.5s after
// testing read as too long.
const PAUSE_MS = 2500;
// The hero photo's own CSS filter transition (see PHOTO_FILTER_TRANSITION in
// MainCanvasScene) is 0.55s — the caption typing must not start until that
// visual highlight has actually finished, with zero gap after.
const HIGHLIGHT_MS = 550;
const STOP_COUNT = 4;

function cancellableWait(ms: number, cancelledRef: { current: boolean }) {
  return new Promise<void>((resolve) => {
    const t = setTimeout(resolve, ms);
    const check = setInterval(() => {
      if (cancelledRef.current) {
        clearTimeout(t);
        clearInterval(check);
        resolve();
      }
    }, 80);
  });
}

/** Drives the guided story. For each stop 01->04, once the camera has arrived:
 * the stop's heading types in, then (with zero gap) its hero highlights into
 * color while the rest of its cluster stays grey, then (with zero gap) its
 * caption types out, then a short pause. The connector segment to the next
 * stop then draws in at the same time the camera pans there, so both finish
 * together. Ends after stop 04 with no more segments to draw, leaving the
 * user free to pan/zoom manually. Fully interruptible via the same
 * setJourneyStopper wire useCanvasEngine already uses for manual-drag
 * interrupts. */
export function useGuidedStory({ focusOn, setJourneyStopper, reduced }: UseGuidedStoryArgs) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [activeStopIndex, setActiveStopIndex] = useState<number | null>(null);
  const [headingStopIndex, setHeadingStopIndex] = useState<number | null>(null);
  const [headingRevealed, setHeadingRevealed] = useState<boolean[]>(() => Array(STOP_COUNT).fill(false));
  const [captionStopIndex, setCaptionStopIndex] = useState<number | null>(null);
  const [revealedStops, setRevealedStops] = useState<boolean[]>(() => Array(STOP_COUNT).fill(false));
  const [drawingFragment, setDrawingFragment] = useState<number | null>(null);
  const [drawnFragments, setDrawnFragments] = useState<boolean[]>(() => Array(STOP_COUNT).fill(false));

  const stepRef = useRef(0);
  const cancelledRef = useRef(false);

  const durMul = reduced ? 0.2 : 1;
  const waitMul = reduced ? 0.15 : 1;

  const run = useCallback(
    (fromStop: number) => {
      cancelledRef.current = false;
      setIsRunning(true);
      setHasStarted(true);
      setJourneyStopper(() => {
        cancelledRef.current = true;
        setIsRunning(false);
      });

      (async () => {
        for (let i = fromStop; i < STOP_COUNT; i++) {
          if (cancelledRef.current) {
            stepRef.current = i;
            return;
          }
          stepRef.current = i;
          const chapter = chapters[i];

          // 1. camera arrival — only a standalone pan for the very first stop
          // of this run; for every later stop the arrival already happened
          // concurrently with the previous stop's connector draw (below).
          if (i === fromStop) {
            await focusOn({ x: chapter.position.x, y: chapter.position.y, scale: STOP_SCALE }, GUIDED_TRANSITION_S * durMul, {
              ease: EASE,
              settle: true,
            });
            if (cancelledRef.current) return;
          }

          // 2. heading typewriter (stop number + title)
          setHeadingStopIndex(i);
          setHeadingRevealed((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
          await cancellableWait(typewriterDuration(stopTitles[i].label, reduced), cancelledRef);
          if (cancelledRef.current) return;
          setHeadingStopIndex(null);

          // 3. highlight + desaturate — starts the instant the heading is
          // done, hero pops to color while the rest of the cluster stays grey
          setActiveStopIndex(i);
          setRevealedStops((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
          await cancellableWait(HIGHLIGHT_MS * durMul, cancelledRef);
          if (cancelledRef.current) return;

          // 4. typewriter caption — starts the instant the highlight is done
          setCaptionStopIndex(i);
          await cancellableWait(typewriterDuration(chapter.story, reduced), cancelledRef);
          if (cancelledRef.current) return;

          // 5. a deliberate pause once typing finishes
          await cancellableWait(PAUSE_MS * waitMul, cancelledRef);
          if (cancelledRef.current) return;

          // 6. connector segment draws in WHILE the camera pans to the next
          // stop — simultaneous, same duration, so they land together (none
          // after stop 04).
          if (i < STOP_COUNT - 1) {
            const fragIdx = TRANSITION_FRAGMENT_INDICES[i];
            const next = chapters[i + 1];
            setDrawingFragment(fragIdx);
            await Promise.all([
              focusOn({ x: next.position.x, y: next.position.y, scale: STOP_SCALE }, GUIDED_TRANSITION_S * durMul, {
                ease: EASE,
              }),
              cancellableWait(GUIDED_TRANSITION_S * durMul * 1000, cancelledRef),
            ]);
            if (cancelledRef.current) return;
            setDrawnFragments((prev) => {
              const next2 = [...prev];
              next2[fragIdx] = true;
              return next2;
            });
            setDrawingFragment(null);
          }
        }

        if (cancelledRef.current) return;
        stepRef.current = STOP_COUNT;
        setIsFinished(true);
        setIsRunning(false);
        setJourneyStopper(null);
      })();
    },
    [focusOn, setJourneyStopper, durMul, waitMul, reduced]
  );

  const start = useCallback(() => {
    stepRef.current = 0;
    setIsFinished(false);
    setRevealedStops(Array(STOP_COUNT).fill(false));
    setHeadingRevealed(Array(STOP_COUNT).fill(false));
    setDrawnFragments(Array(STOP_COUNT).fill(false));
    setActiveStopIndex(null);
    setHeadingStopIndex(null);
    setCaptionStopIndex(null);
    run(0);
  }, [run]);

  const resume = useCallback(() => {
    run(stepRef.current);
  }, [run]);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    setIsRunning(false);
    setJourneyStopper(null);
  }, [setJourneyStopper]);

  const canResume = hasStarted && !isRunning && !isFinished;

  return {
    start,
    resume,
    stop,
    isRunning,
    hasStarted,
    isFinished,
    canResume,
    activeStopIndex,
    headingStopIndex,
    headingRevealed,
    captionStopIndex,
    revealedStops,
    drawingFragment,
    drawnFragments,
  };
}
