interface PinProps {
  color?: "red" | "blue";
}

/** A small physical pushpin — an alternative to tape for attaching a print to the board. */
export function Pin({ color = "red" }: PinProps) {
  const fill = color === "red" ? "#a8382d" : "var(--muted-blue)";
  return (
    <span className="pin" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="7" r="5.4" fill={fill} />
        <circle cx="6.3" cy="5.2" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="8" cy="7" r="5.4" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="0.6" />
      </svg>
    </span>
  );
}
