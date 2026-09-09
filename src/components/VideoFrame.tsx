import { motion } from "motion/react";
import type { VideoMeta } from "../types";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

interface VideoFrameProps {
  video: VideoMeta;
  active: boolean;
  onHoverStart?: () => void;
}

export function VideoFrame({ video, active, onHoverStart }: VideoFrameProps) {
  return (
    <motion.div
      className="photo-frame photo-frame--film"
      onHoverStart={onHoverStart}
      tabIndex={0}
      role="group"
      aria-label={video.label ?? "video placeholder"}
      style={{
        position: "absolute",
        left: video.x,
        top: video.y,
        width: video.width,
        height: video.height,
        padding: "5px",
        background: "#1a1815",
        boxShadow: "var(--shadow-photo)",
      }}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0, rotate: video.rotation ?? 0 }}
      whileHover={{ scale: 1.02, boxShadow: "var(--shadow-photo-lifted)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
        <PhotoPlaceholder
          variant={video.variant}
          style={{
            filter: active ? "grayscale(0) saturate(1.05)" : "grayscale(0.94) saturate(0.15)",
            opacity: active ? 1 : 0.76,
            transition: "filter 0.55s var(--ease-editorial), opacity 0.55s var(--ease-editorial)",
          }}
        />
        <div className="film-grain" />
        <div className="film-sprockets film-sprockets--top" />
        <div className="film-sprockets film-sprockets--bottom" />
        <div className="video-frame__play" aria-hidden="true" />
        <span className="video-frame__rec">REC</span>
        {video.label && <span className="video-frame__label">{video.label}</span>}
      </div>
    </motion.div>
  );
}
