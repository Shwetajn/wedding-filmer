// Literal ground-truth port of the Paper "Main Canvas" artboard (4794x2961).
// Every coordinate below was read directly from Paper via get_jsx — do not
// eyeball-adjust; if the source design changes, re-derive from Paper instead
// of hand-tweaking values here.
import polaroidFrame from "../assets/main-canvas/polaroid-frame.png";
import heroInstagram from "../assets/main-canvas/hero-instagram.jpg";
import splitTop from "../assets/main-canvas/split-top.jpg";
import splitBottom from "../assets/main-canvas/split-bottom.jpg";
import photoC from "../assets/main-canvas/photo-c.jpg";
import photoD from "../assets/main-canvas/photo-d.jpg";
import photoE from "../assets/main-canvas/photo-e.jpg";
import paperTexture from "../assets/main-canvas/paper-texture.png";

export const MAIN_CANVAS_WIDTH = 4794;
export const MAIN_CANVAS_HEIGHT = 2961;

export { polaroidFrame, paperTexture };

/** the canvas-root background: a portrait texture image rotated -90deg to
 * cover the full landscape artboard — replicated verbatim from Paper's own
 * CSS transform rather than pre-rotating the asset, so it stays pixel-exact */
export const backgroundTexture = {
  width: 2961,
  height: 4794,
  left: 0,
  top: 2961,
  rotate: -90,
};

export interface StopTitle {
  id: string;
  x: number;
  y: number;
  index: string;
  label: string;
}

export const stopTitles: StopTitle[] = [
  { id: "s1", x: 440, y: 946, index: "01", label: "WHERE IT ALL STARTED" },
  { id: "s2", x: 2403, y: 205, index: "02", label: "I KEPT LOOKING" },
  { id: "s3", x: 3836, y: 974, index: "03", label: "MAKING THINGS MOVE" },
  { id: "s4", x: 2586, y: 2247, index: "04", label: "ONE LITTLE EXPERIMENT" },
];

export interface ScribbleDoodle {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export const scribbleDoodles: ScribbleDoodle[] = [
  { x: 433, y: 1130, width: 102.38, height: 178.5, rotation: 0 },
  { x: 2185, y: 391, width: 102.38, height: 178.5, rotation: 0 },
  { x: 2615, y: 507, width: 102.38, height: 178.5, rotation: 0 },
  { x: 2579, y: 2431, width: 102.38, height: 178.5, rotation: 0 },
  { x: 3829, y: 1158, width: 102.38, height: 178.5, rotation: 0 },
  { x: 373, y: 1253, width: 102.38, height: 178.5, rotation: 45 },
  { x: 2154, y: 575, width: 129.21, height: 178.5, rotation: 45 },
  { x: 3769, y: 1281, width: 102.38, height: 178.5, rotation: 45 },
];

export interface HandCutout {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export const handCutouts: HandCutout[] = [
  { x: 852, y: 992, width: 68.44, height: 118.63, rotation: 30 },
  { x: 2657, y: 613, width: 68.44, height: 118.63, rotation: 30 },
  { x: 2998, y: 2293, width: 68.44, height: 118.63, rotation: 30 },
  { x: 4248, y: 1020, width: 68.44, height: 118.63, rotation: 30 },
];

/** the large "hero" polaroid, identical frame + photo reused at all 4 stops */
export interface PolaroidLarge {
  x: number;
  y: number;
}
export const polaroidsLarge: PolaroidLarge[] = [
  { x: 521, y: 1082 },
  { x: 2273, y: 343 },
  { x: 3917, y: 1110 },
  { x: 2667, y: 2383 },
];
export const POLAROID_LARGE_W = 347.41;
export const POLAROID_LARGE_H = 418.52;
export { heroInstagram };

/** small polaroid split into two stacked half-photos */
export interface PolaroidSplit {
  x: number;
  y: number;
}
export const polaroidsSplit: PolaroidSplit[] = [
  { x: 881, y: 958 },
  { x: 2633, y: 219 },
  { x: 4277, y: 986 },
  { x: 3027, y: 2259 },
];
export { splitTop, splitBottom };

export interface SmallPolaroid {
  x: number;
  y: number;
}
export const POLAROID_SMALL_W = 202.62;
export const POLAROID_SMALL_H = 248.11;

/** cropped-tight photo on a letterboxed #DFD9DB mat */
export const polaroidsC: SmallPolaroid[] = [
  { x: 237, y: 1109 },
  { x: 1989, y: 370 },
  { x: 3633, y: 1137 },
];
export { photoC };

/** cover-fit photo, no mat color visible */
export const polaroidsD: SmallPolaroid[] = [
  { x: 305, y: 1391 },
  { x: 2702, y: 494 },
  { x: 2046, y: 713 },
  { x: 3701, y: 1419 },
];
export { photoD };

export const polaroidsE: SmallPolaroid[] = [
  { x: 639, y: 813 },
  { x: 2155, y: 74 },
  { x: 2785, y: 2114 },
  { x: 4035, y: 841 },
];
export { photoE };

export interface ContentBlock {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}

export const contentBlocks: ContentBlock[] = [
  {
    id: "cb1",
    x: 882,
    y: 1226,
    width: 335.56,
    height: 211.07,
    text: "I joined Qaafila through anchoring, but somewhere along the way I started documenting everything around it too — the people, the performances, the chaos backstage, and the little moments between events.",
  },
  {
    id: "cb2",
    x: 2299,
    y: 777,
    width: 335.56,
    height: 163,
    text: "Even when there wasn't an event to document, I kept taking pictures. People, places, light, little details — anything that made me stop for a second.",
  },
  {
    id: "cb3",
    x: 4278,
    y: 1254,
    width: 335.56,
    height: 211.07,
    text: "Somewhere along the way, still images weren't enough. I started making reels for Qaafila, creating visual material for Awaaz, and experimenting with video and editing whenever I had something worth putting together.",
  },
  {
    id: "cb4",
    x: 3028,
    y: 2527,
    width: 335.56,
    height: 160,
    text: "No studio. No elaborate setup. Just an iPhone, available light and a day worth remembering.\nI wanted to see what I could create with what I already had.",
  },
];

/** stop2's bottom-left bracket sits lower than the standard formula (Paper source anomaly, preserved as-is) */
export const CONTENT_BLOCK_BL_OVERRIDE: Record<string, number> = { cb2: 988.059 };

export interface Annotation {
  text: string;
  x: number;
  y: number;
  rotation?: number;
  color: string;
}

export const annotations: Annotation[] = [
  { text: "THIS WAS THE BEGINNING", x: 577, y: 774, rotation: 0.39, color: "#854C14" },
  { text: "THERE WAS ALWAYS SOMETHING TO CAPTURE", x: 929, y: 922, color: "#854C14" },
  { text: "DID SOME CRAZY MULTITASKING ", x: 273, y: 1645, color: "#96453A" },
  { text: "some moments don't need a reason", x: 1909, y: 335, color: "#854C14" },
  { text: "This caught my eye", x: 1987, y: 964, color: "#854C14" },
  { text: "NEVER SAW SOMETHING MORE BEAUTIFUL THAN THIS", x: 2675, y: 186, color: "#854C14" },
  { text: "JUST BECAUSE", x: 2843, y: 742, color: "#854C14" },
];

export const headline = {
  x: 2076,
  y: 1322,
  width: 922,
};

export const aboutBlock = {
  x: 1084,
  y: 1964,
  width: 556,
  quote: "I've been photographing things for w while. \n\nNow i want to learn how to tell those stories differently.",
  name: "Shweta Jain",
  roles: ["Product Designer", "Photographer at heart.", "Learning to become a cinematographer one day."],
};

export interface ConnectorFragment {
  /** the SVG element's own box, in artboard-local px, before rotation */
  left: number;
  top: number;
  width: number;
  height: number;
  /** viewBox exactly as Paper stores it — some fragments have a non-zero min-x/min-y */
  viewBox: string;
  rotate: number;
  d: string;
}

/** Re-synced from Paper: the connector doodle is now 4 separate rotated dashed
 * fragments (the user broke the single line into pieces and rotated/moved
 * each one) rather than one continuous path. Each fragment's left/top/rotate
 * is copied verbatim from Paper's own CSS (translate values become left/top
 * since these fragments have no separate translate — rotation pivots on the
 * box's own top-left corner, i.e. transform-origin 0% 0%). */
export const connectorFragments: ConnectorFragment[] = [
  {
    left: 791,
    top: 78,
    width: 1296,
    height: 1042,
    viewBox: "0 0 1296 1042",
    rotate: 0,
    d: "M297 1010C409.674 959.973 466.011 1076.703 597.463 926.622C691.358 826.568 616.243 743.189 747.695 693.162C860.368 651.473 822.811 559.757 954.263 534.743C1095.106 509.73 1029.379 426.352 1189 393",
  },
  {
    left: 2340,
    top: 1588,
    width: 983,
    height: 1042,
    viewBox: "313 0 983 1042",
    rotate: 54.2,
    d: "M538.271 1010C623.733 959.973 666.464 1076.703 766.168 926.622C837.386 826.568 780.413 743.189 880.117 693.162C965.578 651.473 937.092 559.757 1036.797 534.743C1143.624 509.73 1093.771 426.352 1214.842 393",
  },
  {
    left: 3535.001,
    top: 24,
    width: 1162,
    height: 1042,
    viewBox: "0 0 1162 1042",
    rotate: 60,
    d: "M266.292 1010C367.316 959.973 417.828 1076.703 535.688 926.622C619.875 826.568 552.527 743.189 670.387 693.162C771.41 651.473 737.737 559.757 855.597 534.743C981.878 509.73 922.946 426.352 1066.063 393",
  },
  {
    left: 4679.893,
    top: 2674.982,
    width: 1303,
    height: 1238,
    viewBox: "-31.894 0.026 1303 1238",
    rotate: 175.17,
    d: "M90.393 1168.946C232.877 1100.756 304.12 1259.865 470.35 1055.297C589.088 918.919 494.1 805.27 660.331 737.08C802.814 680.256 755.32 555.243 921.551 521.148C1099.658 487.054 1016.54 373.406 1218.393 327.946",
  },
];
