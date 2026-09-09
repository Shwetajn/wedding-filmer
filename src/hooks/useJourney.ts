import { useCallback, useMemo, useRef, useState } from "react";
import type { ChapterData } from "../types";
import type { FocusTarget } from "./useCanvasEngine";

type FocusOn = (
  target: FocusTarget,
  duration?: number,
  options?: { ease?: [number, number, number, number]; settle?: boolean }
) => Promise<void>;

interface UseJourneyArgs {
  chapters: ChapterData[];
  focusOn: FocusOn;
  setJourneyStopper: (fn: (() => void) | null) => void;
  reduced: boolean;
}

const EASE: [number, number, number, number] = [0.45, 0.05, 0.15, 1];
const STOP1_SCALE = 0.62;
const HERO_SCALE = 1.4;
const CHAPTER_SCALE = 0.82;

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

/** Drives the guided intro: one deliberate eased pan into Stop 1, a grey hold,
 * a zoom into the hero specifically (the rest of the board recedes) while it
 * reveals color, its doodle drawing itself in, a deliberate pan into Stop 2,
 * then the existing per-chapter loop for whatever comes after. Fully
 * interruptible (drag/wheel) and resumable step-by-step via `resume`. */
export function useJourney({ chapters, focusOn, setJourneyStopper, reduced }: UseJourneyArgs) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [heroFocusing, setHeroFocusing] = useState(false);
  const [playDoodleDraw, setPlayDoodleDraw] = useState(false);

  const stepIndexRef = useRef(0);
  const cancelledRef = useRef(false);

  const durMul = reduced ? 0.2 : 1;
  const waitMul = reduced ? 0.15 : 1;

  const chapter1 = chapters[0];
  const chapter2 = chapters[1];

  const steps = useMemo(() => {
    const list: (() => Promise<void>)[] = [];

    // step 0 — one deliberate eased move into Stop 1's framing
    list.push(async () => {
      await focusOn({ x: chapter1.position.x, y: chapter1.position.y, scale: STOP1_SCALE }, 1.4 * durMul, { ease: EASE });
    });

    // step 1 — grey hold, then zoom into the hero specifically while it reveals color
    list.push(async () => {
      await cancellableWait(450 * waitMul, cancelledRef);
      if (cancelledRef.current) return;
      setHeroRevealed(true);
      setHeroFocusing(true);
      const heroCenter = { x: chapter1.hero.x + chapter1.hero.width / 2, y: chapter1.hero.y + chapter1.hero.height / 2 };
      await focusOn({ ...heroCenter, scale: HERO_SCALE }, 1.3 * durMul, { ease: EASE, settle: true });
    });

    // step 2 — the hero's doodle draws itself in
    list.push(async () => {
      if (cancelledRef.current) return;
      setPlayDoodleDraw(true);
      await cancellableWait(1200 * waitMul, cancelledRef);
    });

    // step 3 — one deliberate eased move into Stop 2
    list.push(async () => {
      setHeroFocusing(false);
      if (!chapter2) return;
      await focusOn({ x: chapter2.position.x, y: chapter2.position.y, scale: CHAPTER_SCALE }, 1.4 * durMul, { ease: EASE });
    });

    // step 4 — Stop 2's own existing behavior (unchanged): a beat, then its own hero zoom
    if (chapter2) {
      list.push(async () => {
        await cancellableWait(1300 * waitMul, cancelledRef);
        if (cancelledRef.current) return;
        const hero2Center = { x: chapter2.hero.x + chapter2.hero.width / 2, y: chapter2.hero.y + chapter2.hero.height / 2 };
        await focusOn({ ...hero2Center, scale: 1.15 }, 1.6 * durMul, { ease: EASE, settle: true });
        if (cancelledRef.current) return;
        await cancellableWait(1600 * waitMul, cancelledRef);
      });
    }

    // remaining stops — the existing generic per-chapter loop, unchanged
    for (const chapter of chapters.slice(2)) {
      list.push(async () => {
        await focusOn({ x: chapter.position.x, y: chapter.position.y, scale: CHAPTER_SCALE }, 1.9 * durMul, { ease: EASE, settle: true });
        if (cancelledRef.current) return;
        await cancellableWait(1300 * waitMul, cancelledRef);
      });
    }

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters, focusOn, durMul, waitMul]);

  const run = useCallback(
    (fromIndex: number) => {
      cancelledRef.current = false;
      setIsRunning(true);
      setHasStarted(true);
      setJourneyStopper(() => {
        cancelledRef.current = true;
        setIsRunning(false);
      });

      (async () => {
        for (let i = fromIndex; i < steps.length; i++) {
          if (cancelledRef.current) {
            stepIndexRef.current = i;
            return;
          }
          stepIndexRef.current = i;
          await steps[i]();
        }
        if (cancelledRef.current) return;
        stepIndexRef.current = steps.length;
        setIsFinished(true);
        setIsRunning(false);
        setJourneyStopper(null);
      })();
    },
    [steps, setJourneyStopper]
  );

  const start = useCallback(() => {
    stepIndexRef.current = 0;
    setIsFinished(false);
    run(0);
  }, [run]);

  const resume = useCallback(() => {
    run(stepIndexRef.current);
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
    heroRevealed,
    heroFocusing,
    playDoodleDraw,
  };
}
