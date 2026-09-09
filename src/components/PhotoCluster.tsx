import type { PhotoMeta, VideoMeta } from "../types";
import { PhotoFrame } from "./PhotoFrame";
import { VideoFrame } from "./VideoFrame";

interface PhotoClusterProps {
  hero: PhotoMeta;
  photos: PhotoMeta[];
  videos?: VideoMeta[];
  activeId: string;
  focusedId: string | null;
  onHover: (id: string) => void;
  onHoverEnd?: () => void;
  onSelect: (photo: PhotoMeta) => void;
}

export function PhotoCluster({ hero, photos, videos = [], activeId, focusedId, onHover, onHoverEnd, onSelect }: PhotoClusterProps) {
  return (
    <>
      {videos.map((video) => (
        <VideoFrame key={video.id} video={video} active={activeId === video.id} onHoverStart={() => onHover(video.id)} />
      ))}
      {photos.map((photo) => (
        <PhotoFrame
          key={photo.id}
          photo={photo}
          active={activeId === photo.id}
          focused={focusedId === photo.id}
          onHoverStart={() => onHover(photo.id)}
          onHoverEnd={onHoverEnd}
          onClick={() => onSelect(photo)}
        />
      ))}
      <PhotoFrame
        photo={hero}
        active={activeId === hero.id}
        focused={focusedId === hero.id}
        onHoverStart={() => onHover(hero.id)}
        onHoverEnd={onHoverEnd}
        onClick={() => onSelect(hero)}
        style={{ zIndex: focusedId === hero.id ? 30 : 5 }}
      />
    </>
  );
}
