import { useState } from "react";
import { IntroSequence } from "./components/intro/IntroSequence";
import { CanvasWorld } from "./components/CanvasWorld";

export default function App() {
  // Main Canvas mounts as soon as the papers are fully closed (covered), so
  // it's sitting ready underneath the moment they pull apart — the paper
  // opening is the only motion into this view, never a blank/late-mounted gap.
  const [showCanvas, setShowCanvas] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="app-root">
      {showCanvas && <CanvasWorld />}
      {!introDone && <IntroSequence onCovered={() => setShowCanvas(true)} onComplete={() => setIntroDone(true)} />}
    </div>
  );
}
