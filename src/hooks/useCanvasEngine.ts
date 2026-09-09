import { useCallback, useRef } from "react";
import { animate, useMotionValue } from "motion/react";
import { MAX_SCALE, MIN_SCALE, WORLD_HEIGHT, WORLD_WIDTH } from "../data/world";

export interface FocusTarget {
  x: number;
  y: number;
  scale?: number;
}

export function useCanvasEngine(onInterupt?: () => void) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const lastMid = useRef<{ x: number; y: number } | null>(null);
  const lastDist = useRef<number | null>(null);
  const activeAnimations = useRef<ReturnType<typeof animate>[]>([]);

  const stopJourney = useRef<(() => void) | null>(null);

  const clamp = useCallback((nx: number, ny: number, ns: number) => {
    const el = containerRef.current;
    const vw = el?.clientWidth ?? window.innerWidth;
    const vh = el?.clientHeight ?? window.innerHeight;

    const contentW = WORLD_WIDTH * ns;
    const contentH = WORLD_HEIGHT * ns;

    let clampedX = nx;
    let clampedY = ny;

    if (contentW <= vw) {
      clampedX = (vw - contentW) / 2;
    } else {
      const minX = vw - contentW;
      const maxX = 0;
      clampedX = Math.min(maxX, Math.max(minX, nx));
    }

    if (contentH <= vh) {
      clampedY = (vh - contentH) / 2;
    } else {
      const minY = vh - contentH;
      const maxY = 0;
      clampedY = Math.min(maxY, Math.max(minY, ny));
    }

    return { x: clampedX, y: clampedY };
  }, []);

  const stopAnimations = useCallback(() => {
    activeAnimations.current.forEach((a) => a.stop());
    activeAnimations.current = [];
  }, []);

  const interrupt = useCallback(() => {
    // a manual pan/zoom always wins over whatever the camera was doing on its own —
    // kill the in-flight motion-value animations first so they stop fighting the user's input
    stopAnimations();
    if (stopJourney.current) {
      stopJourney.current();
      stopJourney.current = null;
      onInterupt?.();
    }
  }, [onInterupt, stopAnimations]);

  const setJourneyStopper = useCallback((fn: (() => void) | null) => {
    stopJourney.current = fn;
  }, []);

  const panBy = useCallback(
    (dx: number, dy: number) => {
      const s = scale.get();
      const { x: cx, y: cy } = clamp(x.get() + dx, y.get() + dy, s);
      x.set(cx);
      y.set(cy);
    },
    [x, y, scale, clamp]
  );

  const zoomAt = useCallback(
    (clientX: number, clientY: number, factor: number) => {
      const el = containerRef.current;
      const rect = el?.getBoundingClientRect();
      const px = clientX - (rect?.left ?? 0);
      const py = clientY - (rect?.top ?? 0);

      const curScale = scale.get();
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, curScale * factor));
      const actualFactor = newScale / curScale;

      const worldX = (px - x.get()) / curScale;
      const worldY = (py - y.get()) / curScale;

      const newX = px - worldX * curScale * actualFactor;
      const newY = py - worldY * curScale * actualFactor;

      const { x: cx, y: cy } = clamp(newX, newY, newScale);
      scale.set(newScale);
      x.set(cx);
      y.set(cy);
    },
    [x, y, scale, clamp]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      interrupt();
      const factor = Math.exp(-e.deltaY * 0.0016);
      zoomAt(e.clientX, e.clientY, factor);
    },
    [zoomAt, interrupt]
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values());
      lastDist.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      lastMid.current = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
    }
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pointers.current.has(e.pointerId)) return;
      const prev = pointers.current.get(e.pointerId)!;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.current.size === 2) {
        const pts = Array.from(pointers.current.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
        interrupt();
        if (lastDist.current) {
          const factor = dist / lastDist.current;
          zoomAt(mid.x, mid.y, factor);
        }
        lastDist.current = dist;
        lastMid.current = mid;
        return;
      }

      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        interrupt();
        panBy(dx, dy);
      }
    },
    [panBy, zoomAt, interrupt]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) {
      lastDist.current = null;
      lastMid.current = null;
    }
  }, []);

  const focusOn = useCallback(
    (
      target: FocusTarget,
      duration = 1.4,
      options?: { ease?: [number, number, number, number]; settle?: boolean }
    ): Promise<void> => {
      const el = containerRef.current;
      const vw = el?.clientWidth ?? window.innerWidth;
      const vh = el?.clientHeight ?? window.innerHeight;
      const targetScale = target.scale ?? scale.get();
      const ease = options?.ease ?? [0.22, 1, 0.36, 1];

      const rawX = vw / 2 - target.x * targetScale;
      const rawY = vh / 2 - target.y * targetScale;
      const { x: nx, y: ny } = clamp(rawX, rawY, targetScale);

      return new Promise((resolve) => {
        stopAnimations();
        const a1 = animate(x, nx, { duration, ease });
        const a2 = animate(y, ny, { duration, ease });
        const a3 = animate(scale, targetScale, { duration, ease });
        activeAnimations.current = [a1, a2, a3];
        a1.then(() => {
          if (!options?.settle) {
            resolve();
            return;
          }
          // a small camera settle — a lens easing to rest, not a hard stop
          const overshoot = targetScale * 1.01;
          const s1 = animate(scale, overshoot, { duration: 0.16, ease: "easeOut" });
          activeAnimations.current = [s1];
          s1.then(() => {
            const s2 = animate(scale, targetScale, { duration: 0.32, ease: [0.34, 1.2, 0.64, 1] });
            activeAnimations.current = [s2];
            s2.then(() => resolve());
          });
        });
      });
    },
    [x, y, scale, clamp, stopAnimations]
  );

  return {
    x,
    y,
    scale,
    containerRef,
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    focusOn,
    stopAnimations,
    setJourneyStopper,
    clamp,
  };
}
