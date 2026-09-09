import { useCallback, useRef, useState } from "react";
import { chapters } from "../data/chapters";
import { TRANSITION_FRAGMENT_INDICES } from "../data/mainCanvasLayout";
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
const PAUSE_MS = 10000;
const DRAW_MS = 1300;
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

/** Drives the guided story: for each stop 01->04, pan+zoom in, highlight the
 * hero into color while its cluster stays grey, type its caption, hold 10s,
 * then draw the connector segment to the next stop before panning there.
 * Ends after stop 04 with no more segments to draw, leaving the user free to
 * pan/zoom manually. Fully interruptible via the same setJourneyStopper wire
 * useCanvasEngine already uses for manual-drag interrupts. */
export function useGuidedStory({ focusOn, setJourneyStopper, reduced }: UseGuidedStoryArgs) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [activeStopIndex, setActiveStopIndex] = useState<number | null>(null);
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

          // 1. camera arrives at the stop's framing
          await focusOn({ x: chapter.position.x, y: chapter.position.y, scale: STOP_SCALE }, 1.4 * durMul, {
            ease: EASE,
            settle: true,
          });
          if (cancelledRef.current) return;

          // 2. highlight + desaturate — hero pops to color, cluster stays grey
          setActiveStopIndex(i);
          setRevealedStops((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
          await cancellableWait(300 * waitMul, cancelledRef);
          if (cancelledRef.current) return;

          // 3. typewriter caption
          setCaptionStopIndex(i);
          await cancellableWait(typewriterDuration(chapter.story, reduced), cancelledRef);
          if (cancelledRef.current) return;

          // 4. a deliberate 10s hold once typing finishes
          await cancellableWait(PAUSE_MS * waitMul, cancelledRef);
          if (cancelledRef.current) return;

          // 5. draw the connector segment to the next stop (none after 04)
          if (i < STOP_COUNT - 1) {
            const fragIdx = TRANSITION_FRAGMENT_INDICES[i];
            setDrawingFragment(fragIdx);
            await cancellableWait(DRAW_MS * durMul, cancelledRef);
            if (cancelledRef.current) return;
            setDrawnFragments((prev) => {
              const next = [...prev];
              next[fragIdx] = true;
              return next;
            });
            setDrawingFragment(null);
          }
          // 6. loop — next iteration's focusOn pans to the next stop
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
    setDrawnFragments(Array(STOP_COUNT).fill(false));
    setActiveStopIndex(null);
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
    captionStopIndex,
    revealedStops,
    drawingFragment,
    drawnFragments,
  };
}
