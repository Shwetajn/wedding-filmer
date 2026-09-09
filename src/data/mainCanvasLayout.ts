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

export const MAIN_CANVAS_WIDTH = 4794;
export const MAIN_CANVAS_HEIGHT = 2961;

export { polaroidFrame };

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

export const connectorPathD =
  "M 300 1000 C 420 940, 480 1080, 620 900 C 720 780, 640 680, 780 620 C 900 570, 860 460, 1000 430 C 1150 400, 1080 300, 1250 260 C 1450 210, 1500 320, 1650 180 C 1800 40, 1900 140, 2050 90 C 2220 30, 2350 130, 2500 100 C 2680 65, 2760 180, 2920 190 C 3120 200, 3200 320, 3380 420 C 3560 520, 3620 650, 3780 780 C 3950 910, 4080 1020, 4150 1220 C 4220 1420, 4120 1520, 4080 1700 C 4040 1880, 4150 1950, 4000 2080 C 3820 2230, 3700 2100, 3550 2230 C 3400 2360, 3300 2260, 3150 2320 C 2980 2390, 2900 2300, 2750 2340";
