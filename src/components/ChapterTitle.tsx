import type { TitleEmphasis } from "../types";
import { Doodle } from "./Doodle";

interface ChapterTitleProps {
  title: string;
  emphasis?: TitleEmphasis;
}

/** Renders a chapter title, wrapping one word (if given) in a red/blue accent with a small hand-drawn mark. */
export function ChapterTitle({ title, emphasis }: ChapterTitleProps) {
  if (!emphasis) return <h2 className="chapter-label__title">{title}</h2>;

  const words = title.split(" ");
  const idx = words.findIndex((w) => w.toLowerCase() === emphasis.word.toLowerCase());
  if (idx === -1) return <h2 className="chapter-label__title">{title}</h2>;

  const color = emphasis.color ?? "red";

  return (
    <h2 className="chapter-label__title">
      {words.slice(0, idx).join(" ")}
      {idx > 0 ? " " : ""}
      <span style={{ position: "relative", color: color === "red" ? "var(--accent-red)" : "var(--accent-blue)" }}>
        {words[idx]}
        {emphasis.mark && (
          <Doodle
            kind={emphasis.mark === "circle" ? "circle" : "underline"}
            x={emphasis.mark === "circle" ? -10 : -4}
            y={emphasis.mark === "circle" ? -14 : 34}
            width={words[idx].length * 19 + 24}
            color={color}
          />
        )}
      </span>
      {idx < words.length - 1 ? " " + words.slice(idx + 1).join(" ") : ""}
    </h2>
  );
}
