import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  reduced: boolean;
  /** fires the instant the last character lands, before the settle tail */
  onTypingComplete?: () => void;
  /** fires after the settle tail — matches typewriterDuration(text, reduced) */
  onDone?: () => void;
  className?: string;
  cursorClassName?: string;
}

export const TYPEWRITER_CHAR_MS = 26;
/** matches the tail delay TypewriterQuote already used after the last character */
const TYPEWRITER_TAIL_MS = 900;

/** total time (ms) a given string takes to type out at the standard cadence,
 * including the settle tail — lets callers await completion without a
 * component round-trip (e.g. a guided-sequence timeline) */
export function typewriterDuration(text: string, reduced: boolean) {
  return reduced ? 500 : text.length * TYPEWRITER_CHAR_MS + TYPEWRITER_TAIL_MS;
}

/** Character-by-character reveal with a blinking cursor — the same cadence
 * used by the intro's quote, reused for any caption that should type itself in. */
export function Typewriter({ text, reduced, onTypingComplete, onDone, className, cursorClassName }: TypewriterProps) {
  const [count, setCount] = useState(reduced ? text.length : 0);

  useEffect(() => {
    setCount(reduced ? text.length : 0);
    if (reduced) {
      onTypingComplete?.();
      const t = setTimeout(() => onDone?.(), 500);
      return () => clearTimeout(t);
    }

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) {
        clearInterval(interval);
        onTypingComplete?.();
        setTimeout(() => onDone?.(), TYPEWRITER_TAIL_MS);
      }
    }, TYPEWRITER_CHAR_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reduced]);

  const typingDone = count >= text.length;

  return (
    <span className={className}>
      {text.slice(0, count)}
      {!typingDone && <span className={cursorClassName} aria-hidden="true" />}
    </span>
  );
}
