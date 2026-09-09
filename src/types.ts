export type FrameStyle = "polaroid" | "taped" | "contact" | "film" | "plain";

export type PlaceholderVariant =
  | "portrait-a"
  | "portrait-b"
  | "crowd"
  | "stage"
  | "backstage"
  | "detail"
  | "architecture"
  | "nature"
  | "light"
  | "gallery"
  | "street"
  | "banner"
  | "reel"
  | "intimate"
  | "hands"
  | "quiet"
  | "horizon"
  | "flash"
  | "mic"
  | "filmlight";

export interface PhotoMeta {
  id: string;
  /** placeholder art-directed composition — omit when `src` is given for a real photograph */
  variant?: PlaceholderVariant;
  /** a real photograph to render instead of the abstract placeholder */
  src?: string;
  frame: FrameStyle;
  rotation?: number;
  date?: string;
  location?: string;
  note?: string;
  index?: string;
  width: number;
  height: number;
  x: number;
  y: number;
  scale?: number;
  pin?: "red" | "blue";
}

export interface VideoMeta {
  id: string;
  variant: PlaceholderVariant;
  frame: "film" | "plain";
  rotation?: number;
  label?: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface DoodleMeta {
  id?: string;
  kind: "circle" | "underline" | "scribble" | "cross" | "arrow" | "star" | "loop" | "connector" | "hand-rock";
  x: number;
  y: number;
  width?: number;
  rotation?: number;
  color?: "ink" | "blue" | "red";
}

export interface TitleEmphasis {
  word: string;
  mark?: "circle" | "underline";
  color?: "red" | "blue";
}

export interface PaperScrap {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation?: number;
  kind?: "note" | "index" | "arrow";
}

export interface ChapterData {
  id: string;
  index: string;
  title: string;
  titleEmphasis?: TitleEmphasis;
  subtitle: string;
  position: { x: number; y: number };
  doodles?: DoodleMeta[];
  annotations?: {
    text: string;
    x: number;
    y: number;
    rotation?: number;
    tone?: "blue" | "ink" | "red";
    behind?: boolean;
  }[];
  paperScraps?: PaperScrap[];
  hero: PhotoMeta;
  photos: PhotoMeta[];
  videos?: VideoMeta[];
  story: string;
  secondaryNote?: string;
  quiet?: boolean;
}
