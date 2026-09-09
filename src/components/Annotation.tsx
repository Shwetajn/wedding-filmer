interface AnnotationProps {
  text: string;
  x: number;
  y: number;
  rotation?: number;
  tone?: "blue" | "ink" | "red";
  behind?: boolean;
}

export function Annotation({ text, x, y, rotation = 0, tone = "blue", behind }: AnnotationProps) {
  const color = tone === "red" ? "var(--accent-red)" : tone === "ink" ? "var(--charcoal-soft)" : "var(--accent-blue)";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rotation}deg)`,
        fontFamily: "var(--font-hand)",
        fontSize: 19,
        color,
        opacity: behind ? 0.55 : 0.92,
        zIndex: behind ? 0 : 2,
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
}
