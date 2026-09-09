import { useCallback, useRef, useState } from "react";
import { chapters } from "../data/chapters";
import { stopTitles, aboutBlock, aboutFocus, TRANSITION_FRAGMENT_INDICES, ABOUT_CONNECTOR_FRAGMENT_INDEX, GUIDED_TRANSITION_S } from "../data/mainCanvasLayout";
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

/** Drives the guided story as a flat list of discrete, individually-resumable
 * steps (arrive / type heading / highlight / type caption / pause / draw+pan
 * to next — repeated per stop, then one final transition + caption for the
 * "about" block). Progress is tracked at step granularity, not stop
 * granularity: interrupting mid-stop and resuming continues from that exact
 * step — never replays a stop's already-finished heading/highlight/caption,
 * and never re-arrives at a stop the camera already reached. This is what
 * makes "Continue Journey" pick up smoothly from wherever the camera
 * actually is, instead of snapping back to the start of the current stop. */
export function useGuidedStory({ focusOn, setJourneyStopper, reduced }: UseGuidedStoryArgs) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [activeStopIndex, setActiveStopIndex] = useState<number | null>(null);
  const [headingStopIndex, setHeadingStopIndex] = useState<number | null>(null);
  const [headingRevealed, setHeadingRevealed] = useState<boolean[]>(() => Array(STOP_COUNT).fill(false));
  const [captionStopIndex, setCaptionStopIndex] = useState<number | null>(null);
  // gates when a stop's caption container is allowed to render at all — set
  // true at the exact moment captionStopIndex is set to that stop, so the
  // Typewriter always mounts at count=0 first (no full-text "pop" before it).
  const [captionRevealed, setCaptionRevealed] = useState<boolean[]>(() => Array(STOP_COUNT).fill(false));
  const [revealedStops, setRevealedStops] = useState<boolean[]>(() => Array(STOP_COUNT).fill(false));
  const [drawingFragment, setDrawingFragment] = useState<number | null>(null);
  const [drawnFragments, setDrawnFragments] = useState<boolean[]>(() => Array(4).fill(false));
  const [aboutRevealed, setAboutRevealed] = useState(false);
  const [aboutTyping, setAboutTyping] = useState(false);

  const cursorRef = useRef(0);
  const cancelledRef = useRef(false);

  const durMul = reduced ? 0.2 : 1;
  const waitMul = reduced ? 0.15 : 1;

  const setFragment = useCallback((idx: number, next: boolean) => {
    setDrawnFragments((prev) => {
      const copy = [...prev];
      copy[idx] = next;
      return copy;
    });
  }, []);

  const setBoolAt = useCallback((setter: (fn: (prev: boolean[]) => boolean[]) => void, idx: number) => {
    setter((prev) => {
      const copy = [...prev];
      copy[idx] = true;
      return copy;
    });
  }, []);

  // Each step below is self-contained and re-runnable from scratch: if
  // interrupted mid-step, resuming re-invokes the SAME step (not the whole
  // stop), which is at worst a short re-wait or a connector segment
  // redrawing from its start — never a jump back to an earlier stop.
  const buildSteps = useCallback((): Array<() => Promise<void>> => {
    const steps: Array<() => Promise<void>> = [];

    const arrive = (target: FocusTarget, settle = true) => () =>
      focusOn(target, GUIDED_TRANSITION_S * durMul, { ease: EASE, settle });

    const typeHeading = (i: number) => async () => {
      setHeadingStopIndex(i);
      setBoolAt(setHeadingRevealed, i);
      await cancellableWait(typewriterDuration(stopTitles[i].label, reduced), cancelledRef);
      if (!cancelledRef.current) setHeadingStopIndex(null);
    };

    const highlight = (i: number) => async () => {
      setActiveStopIndex(i);
      setBoolAt(setRevealedStops, i);
      await cancellableWait(HIGHLIGHT_MS * durMul, cancelledRef);
    };

    const typeCaption = (i: number) => async () => {
      setCaptionStopIndex(i);
      setBoolAt(setCaptionRevealed, i);
      await cancellableWait(typewriterDuration(chapters[i].story, reduced), cancelledRef);
    };

    const pause = () => () => cancellableWait(PAUSE_MS * waitMul, cancelledRef);

    const transitionTo = (target: FocusTarget, fragIdx: number) => async () => {
      setDrawingFragment(fragIdx);
      await Promise.all([
        focusOn(target, GUIDED_TRANSITION_S * durMul, { ease: EASE }),
        cancellableWait(GUIDED_TRANSITION_S * durMul * 1000, cancelledRef),
      ]);
      if (!cancelledRef.current) {
        setFragment(fragIdx, true);
        setDrawingFragment(null);
      }
    };

    const typeAbout = () => async () => {
      setAboutRevealed(true);
      setAboutTyping(true);
      await cancellableWait(typewriterDuration(aboutBlock.quote, reduced), cancelledRef);
      if (!cancelledRef.current) setAboutTyping(false);
    };

    steps.push(arrive({ x: chapters[0].position.x, y: chapters[0].position.y, scale: STOP_SCALE }));
    for (let i = 0; i < STOP_COUNT; i++) {
      steps.push(typeHeading(i));
      steps.push(highlight(i));
      steps.push(typeCaption(i));
      steps.push(pause());
      if (i < STOP_COUNT - 1) {
        steps.push(transitionTo({ x: chapters[i + 1].position.x, y: chapters[i + 1].position.y, scale: STOP_SCALE }, TRANSITION_FRAGMENT_INDICES[i]));
      }
    }
    steps.push(transitionTo({ x: aboutFocus.x, y: aboutFocus.y, scale: STOP_SCALE }, ABOUT_CONNECTOR_FRAGMENT_INDEX));
    steps.push(typeAbout());

    return steps;
  }, [focusOn, durMul, waitMul, reduced, setBoolAt, setFragment]);

  const run = useCallback(
    (fromIndex: number) => {
      cancelledRef.current = false;
      setIsRunning(true);
      setHasStarted(true);
      setJourneyStopper(() => {
        cancelledRef.current = true;
        setIsRunning(false);
      });

      const steps = buildSteps();

      (async () => {
        for (let idx = fromIndex; idx < steps.length; idx++) {
          if (cancelledRef.current) return;
          await steps[idx]();
          if (cancelledRef.current) {
            cursorRef.current = idx;
            return;
          }
          cursorRef.current = idx + 1;
        }

        setIsFinished(true);
        setIsRunning(false);
        setJourneyStopper(null);
      })();
    },
    [buildSteps, setJourneyStopper]
  );

  const start = useCallback(() => {
    cursorRef.current = 0;
    setIsFinished(false);
    setRevealedStops(Array(STOP_COUNT).fill(false));
    setHeadingRevealed(Array(STOP_COUNT).fill(false));
    setCaptionRevealed(Array(STOP_COUNT).fill(false));
    setDrawnFragments(Array(4).fill(false));
    setActiveStopIndex(null);
    setHeadingStopIndex(null);
    setCaptionStopIndex(null);
    setAboutRevealed(false);
    setAboutTyping(false);
    run(0);
  }, [run]);

  const resume = useCallback(() => {
    run(cursorRef.current);
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
    captionRevealed,
    revealedStops,
    drawingFragment,
    drawnFragments,
    aboutRevealed,
    aboutTyping,
  };
}
