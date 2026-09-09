import { motion, AnimatePresence } from "motion/react";
import type { PhotoMeta } from "../types";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { Tape } from "./Tape";
import { Pin } from "./Pin";
import { unit } from "../utils/seed";

interface PhotoFrameProps {
  photo: PhotoMeta;
  active: boolean;
  focused?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const FRAME_PADDING: Record<PhotoMeta["frame"], string> = {
  polaroid: "9px 9px 32px",
  taped: "0px",
  contact: "5px",
  film: "5px 5px",
  plain: "4px",
};

const FRAME_SHADOW: Record<PhotoMeta["frame"], string> = {
  polaroid: "var(--shadow-photo-deep)",
  taped: "var(--shadow-photo-soft)",
  contact: "var(--shadow-photo)",
  film: "var(--shadow-photo)",
  plain: "var(--shadow-photo-soft)",
};

function tapeCountFor(photo: PhotoMeta): number {
  if (photo.frame !== "taped") return 0;
  const u = unit(photo.id);
  if (u < 0.16) return 0;
  if (u < 0.62) return 1;
  return 2;
}

export function PhotoFrame({ photo, active, focused, onHoverStart, onHoverEnd, onClick, style, className }: PhotoFrameProps) {
  const rotation = photo.rotation ?? 0;
  const tapes = tapeCountFor(photo);

  return (
    <motion.button
      type="button"
      className={`photo-frame photo-frame--${photo.frame} ${className ?? ""}`}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onClick={onClick}
      aria-label={photo.note ?? `photograph${photo.date ? `, ${photo.date}` : ""}`}
      style={{
        position: "absolute",
        left: photo.x,
        top: photo.y,
        width: photo.width,
        height: photo.height,
        padding: FRAME_PADDING[photo.frame],
        background:
          photo.frame === "polaroid" || photo.frame === "plain"
            ? "#f7f4ea"
            : photo.frame === "contact" || photo.frame === "film"
              ? "#1a1815"
              : "transparent",
        border: "none",
        cursor: "pointer",
        transformOrigin: "center center",
        boxShadow: focused ? "var(--shadow-photo-lifted)" : FRAME_SHADOW[photo.frame],
        zIndex: focused ? 30 : 1,
        ...style,
      }}
      initial={{ opacity: 0, rotate: rotation, y: 5 }}
      animate={{
        opacity: 1,
        rotate: focused ? 0 : rotation,
        y: 0,
        scale: focused ? 1.08 : 1,
      }}
      whileHover={{ scale: focused ? 1.08 : 1.015, boxShadow: "var(--shadow-photo-lifted)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{ position: "relative", width: "100%", height: photo.frame === "polaroid" ? "calc(100% - 23px)" : "100%", overflow: "hidden" }}>
        {photo.src ? (
          <img
            src={photo.src}
            alt={photo.note ?? ""}
            draggable={false}
            className="photo-frame__image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: active ? "grayscale(0) saturate(1.05) contrast(1.02)" : "grayscale(1) saturate(0.15) contrast(0.98)",
              transition: "filter 0.55s var(--ease-editorial)",
            }}
          />
        ) : (
          <PhotoPlaceholder
            variant={photo.variant!}
            className="photo-frame__image"
            style={{
              filter: active ? "grayscale(0) saturate(1.05) contrast(1.02)" : "grayscale(0.94) saturate(0.15) contrast(0.98)",
              opacity: active ? 1 : 0.76,
              transition: "filter 0.55s var(--ease-editorial), opacity 0.55s var(--ease-editorial)",
            }}
          />
        )}

        {photo.frame === "film" && (
          <>
            <div className="film-sprockets film-sprockets--top" />
            <div className="film-sprockets film-sprockets--bottom" />
            <div className="film-grain" />
          </>
        )}
        {photo.frame === "contact" && <div className="contact-ticks" />}

        {(photo.date || photo.location || photo.index) && (
          <div className="photo-meta">
            {photo.index && <span className="photo-meta__index">{photo.index}</span>}
            {photo.date && <span className="photo-meta__date">{photo.date}</span>}
            {photo.location && <span className="photo-meta__location">{photo.location}</span>}
          </div>
        )}
      </div>

      {photo.frame === "polaroid" && photo.note && <span className="photo-note">{photo.note}</span>}

      {photo.pin ? (
        <Pin color={photo.pin} />
      ) : (
        <>
          {tapes >= 1 && <Tape seed={photo.id} position={tapes === 2 ? "top-left" : "top"} />}
          {tapes === 2 && <Tape seed={photo.id + "b"} position="top-right" />}
        </>
      )}

      <AnimatePresence>
        {focused && (
          <motion.span
            aria-hidden="true"
            className="focus-brackets"
            initial={{ opacity: 0, scale: 1.14 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <i />
            <i />
            <i />
            <i />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
