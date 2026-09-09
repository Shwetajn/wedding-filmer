import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PaperBackground } from "./PaperBackground";
import { TypewriterQuote } from "./TypewriterQuote";
import { CameraAsset } from "./CameraAsset";
import { RedPaper } from "./RedPaper";
import { PastedPapers } from "./PastedPapers";
import type { IntroPhase } from "./phases";
import paperBg from "../../assets/intro/paper-bg.png";
import cameraImg from "../../assets/intro/camera.png";
import redScrap from "../../assets/intro/red-scrap.png";

interface IntroSequenceProps {
  /** fired once the two paper sheets have appeared — safe to mount what's next underneath */
  onCovered: () => void;
  /** fired once the paper has finished opening and the intro can be unmounted */
  onComplete: () => void;
}

// Brief pause of bare paper after the quote fades out, before the camera
// begins pasting in — replaces what used to be an instant cut.
const QUOTE_TO_CAMERA_GAP_MS = 450;

// Camera paste-in takes 0.7s and the star twinkle takes 1s, both starting the
// moment phase flips to "camera" — 1000ms is the floor here, since going
// lower would cut the star twinkle off before it finishes (it must play out
// untouched). This is trimmed as far down as that floor allows.
const CAMERA_AND_STAR_HOLD_MS = 1080;

const REDUCED_HOLD_MS = 120;

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      // decode() (where available) makes sure the image is fully decoded
      // off the critical path, not just fetched — this is what prevents a
      // stall later when the browser paints it for the first time.
      if (typeof img.decode === "function") {
        img.decode().then(() => resolve()).catch(() => resolve());
      } else {
        resolve();
      }
    };
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function IntroSequence({ onCovered, onComplete }: IntroSequenceProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [phase, setPhase] = useState<IntroPhase>("paper");
  const [ready, setReady] = useState(false);
  // Once the shutter has fully closed over the scene, the paper background
  // and camera behind it have nothing left to show and must stop rendering
  // immediately — waiting for onComplete/introDone leaves them mounted (and
  // stacked above CanvasWorld) for the entire open animation.
  const [covered, setCovered] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([preload(paperBg), preload(cameraImg), preload(redScrap)]).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    timers.current.push(setTimeout(() => setPhase("quote"), 400));
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [ready]);

  const schedule = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, prefersReducedMotion ? REDUCED_HOLD_MS : ms));
  };

  const handleQuoteDone = () => {
    schedule(() => {
      setPhase("camera");
      schedule(() => setPhase("papers"), CAMERA_AND_STAR_HOLD_MS);
    }, QUOTE_TO_CAMERA_GAP_MS);
  };

  const handlePapersComplete = () => {
    setPhase("done");
    onComplete();
  };

  const handleCovered = () => {
    setCovered(true);
    onCovered();
  };

  if (!ready) {
    return <div className="intro-sequence intro-sequence--loading" style={{ backgroundImage: `url(${paperBg})` }} />;
  }

  return (
    <>
      {!covered && (
        <div className="intro-sequence" data-intro-phase={phase}>
          <PaperBackground />
          <RedPaper />

          <AnimatePresence>
            {phase === "quote" && (
              <motion.div key="quote" exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}>
                <TypewriterQuote reduced={prefersReducedMotion} onDone={handleQuoteDone} />
              </motion.div>
            )}
          </AnimatePresence>

          {(phase === "camera" || phase === "papers" || phase === "done") && (
            <div className="intro-camera-stage">
              <CameraAsset phase={phase} reduced={prefersReducedMotion} />
            </div>
          )}
        </div>
      )}

      {(phase === "papers" || phase === "done") && (
        <PastedPapers reduced={prefersReducedMotion} onClosed={handleCovered} onComplete={handlePapersComplete} />
      )}
    </>
  );
}
