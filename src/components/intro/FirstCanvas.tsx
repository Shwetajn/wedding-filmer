import mainCanvasBg from "../../assets/intro/main-canvas.png";

interface FirstCanvasProps {
  onProceed: () => void;
}

/** The main canvas, revealed directly as the paper sheets open — no transition
 * of its own, the paper opening is the only motion into this view. */
export function FirstCanvas({ onProceed }: FirstCanvasProps) {
  return (
    <div className="first-canvas" style={{ backgroundImage: `url(${mainCanvasBg})` }}>
      <div className="first-canvas__content">
        <h1 className="first-canvas__hi">
          Hi there.
          <br />
          I am Shweta Jain
        </h1>
        <button type="button" className="first-canvas__cta" onClick={onProceed}>
          Follow my journey <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
