import { useState } from "react";
import { IntroSequence } from "./components/intro/IntroSequence";
import { FirstCanvas } from "./components/intro/FirstCanvas";
import { CanvasWorld } from "./components/CanvasWorld";

type Stage = "intro" | "first" | "canvas";

export default function App() {
  const [stage, setStage] = useState<Stage>("intro");
  const [showFirst, setShowFirst] = useState(false);

  return (
    <div className="app-root">
      {stage === "canvas" && <CanvasWorld />}
      {showFirst && stage !== "canvas" && <FirstCanvas onProceed={() => setStage("canvas")} />}
      {stage === "intro" && (
        <IntroSequence onCovered={() => setShowFirst(true)} onComplete={() => setStage("first")} />
      )}
    </div>
  );
}
