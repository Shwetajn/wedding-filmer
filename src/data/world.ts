// Matches the Paper "Main Canvas" artboard (4794x2961) width exactly, with
// height trimmed to the deepest real content (the about block's connector
// fragment bottoms out around y=2910) plus a small margin — not the full
// 3900 previously reserved for a "closing chapter" block that isn't
// rendered anywhere in this app.
export const WORLD_WIDTH = 4794;
export const WORLD_HEIGHT = 3050;

export const ORIGIN = { x: WORLD_WIDTH / 2, y: 1560 };

export const MIN_SCALE = 0.35;
export const MAX_SCALE = 1.6;
export const DEFAULT_SCALE = 0.62;
