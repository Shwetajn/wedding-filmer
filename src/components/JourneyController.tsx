import { useEffect, useRef } from "react";
import type { ChapterData } from "../types";
import type { FocusTarget } from "../hooks/useCanvasEngine";

type FocusOn = (
  target: FocusTarget,
  duration?: number,
  options?: { ease?: [number, number, number, number]; settle?: boolean }
) => Promise<void>;

interface JourneyControllerProps {
  active: boolean;
  chapters: ChapterData[];
  focusOn: FocusOn;
  setJourneyStopper: (fn: (() => void) | null) => void;
  onDone: () => void;
}

const JOURNEY_EASE: [number, number, number, number] = [0.45, 0.05, 0.15, 1];

const WAIT = (ms: number, cancelledRef: { current: boolean }) =>
  new Promise<void>((resolve) => {
    const t = setTimeout(resolve, ms);
    const check = setInterval(() => {
      if (cancelledRef.current) {
        clearTimeout(t);
        clearInterval(check);
        resolve();
      }
    }, 80);
  });

export function JourneyController({ active, chapters, focusOn, setJourneyStopper, onDone }: JourneyControllerProps) {
  const cancelled = useRef(false);

  useEffect(() => {
    if (!active) return;
    cancelled.current = false;
    setJourneyStopper(() => {
      cancelled.current = true;
    });

    const run = async () => {
      for (const chapter of chapters) {
        if (cancelled.current) break;
        await focusOn({ x: chapter.position.x, y: chapter.position.y, scale: 0.82 }, 1.9, {
          ease: JOURNEY_EASE,
          settle: true,
        });
        if (cancelled.current) break;
        await WAIT(1300, cancelled);

        if (!cancelled.current && (chapter.id === "chapter-01" || chapter.id === "chapter-02")) {
          const hero = chapter.hero;
          await focusOn(
            { x: hero.x + hero.width / 2, y: hero.y + hero.height / 2, scale: 1.15 },
            1.6,
            { ease: JOURNEY_EASE, settle: true }
          );
          if (cancelled.current) break;
          await WAIT(1600, cancelled);
        }
      }
      if (!cancelled.current) {
        onDone();
      }
      setJourneyStopper(null);
    };

    run();

    return () => {
      cancelled.current = true;
      setJourneyStopper(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return null;
}
