import type { ChapterData } from "../types";
import { heroInstagram, POLAROID_LARGE_W, POLAROID_LARGE_H } from "./mainCanvasLayout";

// Stops 01-04 are now rendered literally by <MainCanvasScene> (a pixel-exact
// port of the Paper "Main Canvas" artboard) instead of the doodle/placeholder
// system below. `position` and `hero` are kept here — computed from that same
// Paper data — because useJourney/JourneyController still steer the camera
// off these two fields; the old doodles/photos/annotations arrays for these
// four are no longer rendered anywhere and are intentionally omitted.
export const chapters: ChapterData[] = [
  {
    id: "chapter-01",
    index: "01",
    title: "WHERE IT ALL STARTED",
    subtitle: "Qaafila · 2021—2024 · Anchoring Society",
    // bounding-box center of stop 1's cluster on the Paper artboard
    position: { x: 658, y: 1237 },
    hero: {
      id: "c1-hero",
      src: heroInstagram,
      frame: "plain",
      width: POLAROID_LARGE_W,
      height: POLAROID_LARGE_H,
      x: 521,
      y: 1082,
    },
    photos: [],
    story:
      "I joined Qaafila through anchoring, but somewhere along the way I started documenting everything around it too — the people, the performances, the chaos backstage, and the little moments between events.",
  },
  {
    id: "chapter-02",
    index: "02",
    title: "I KEPT LOOKING",
    subtitle: "Personal photography",
    position: { x: 2407, y: 517 },
    hero: {
      id: "c2-hero",
      src: heroInstagram,
      frame: "plain",
      width: POLAROID_LARGE_W,
      height: POLAROID_LARGE_H,
      x: 2273,
      y: 343,
    },
    photos: [],
    story:
      "Even when there wasn't an event to document, I kept taking pictures. People, places, light, little details — anything that made me stop for a second.",
  },
  {
    id: "chapter-03",
    index: "03",
    title: "MAKING THINGS MOVE",
    subtitle: "Qaafila reels · Awaaz · visual production",
    position: { x: 4124, y: 1254 },
    hero: {
      id: "c3-hero",
      src: heroInstagram,
      frame: "plain",
      width: POLAROID_LARGE_W,
      height: POLAROID_LARGE_H,
      x: 3917,
      y: 1110,
    },
    photos: [],
    story:
      "Somewhere along the way, still images weren't enough. I started making reels for Qaafila, creating visual material for Awaaz, and experimenting with video and editing whenever I had something worth putting together.",
  },
  {
    id: "chapter-04",
    index: "04",
    title: "ONE LITTLE EXPERIMENT",
    subtitle: "A small personal shoot, shot on iPhone",
    position: { x: 2972, y: 2458 },
    hero: {
      id: "c4-hero",
      src: heroInstagram,
      frame: "plain",
      width: POLAROID_LARGE_W,
      height: POLAROID_LARGE_H,
      x: 2667,
      y: 2383,
    },
    photos: [],
    story: "No studio. No elaborate setup. Just an iPhone, available light and a day worth remembering.",
  },
  {
    id: "chapter-05",
    index: "05",
    title: "Where I'm Going",
    subtitle: "",
    // repositioned below the Paper artboard (2961px tall) — this closing
    // chapter isn't part of the Main Canvas design, so it lives just past it
    position: { x: 2500, y: 3495 },
    quiet: true,
    hero: {
      id: "c5-hero",
      variant: "horizon",
      frame: "plain",
      rotation: 0,
      width: 300,
      height: 390,
      x: 2350,
      y: 3300,
    },
    photos: [],
    story: "I've been photographing things for a while.\n\nNow I want to learn how to tell those stories differently.",
  },
];

export const originQuote = {
  text: "Photography is 5% skill, 5% gear and 90% being there.",
  attribution: "Joseph Radhik",
};
