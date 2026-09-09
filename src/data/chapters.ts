import type { ChapterData } from "../types";
import mainInstagram from "../assets/stop1/main-instagram.jpg";
import coupleSelfie from "../assets/stop1/couple-selfie.jpg";
import hallwayGroup from "../assets/stop1/hallway-group.jpg";
import qaafilaCollage from "../assets/stop1/qaafila-collage.jpg";
import womanMic from "../assets/stop1/woman-mic.jpg";

export const chapters: ChapterData[] = [
  {
    id: "chapter-01",
    index: "01",
    title: "Where It Started",
    titleEmphasis: { word: "Started", mark: "underline", color: "red" },
    subtitle: "Qaafila · 2021—2024 · Anchoring Society",
    position: { x: 720, y: 1500 },
    doodles: [
      { kind: "scribble", x: 700, y: 1130, width: 60, rotation: 6, color: "ink" },
      { kind: "hand-rock", x: 845, y: 1195, width: 55, rotation: -12, color: "ink" },
      { kind: "scribble", x: 470, y: 1500, width: 45, rotation: -8, color: "ink" },
      { kind: "cross", x: 545, y: 1720, width: 20, rotation: -6, color: "red" },
      { id: "c1-hero-doodle", kind: "scribble", x: 600, y: 1385, width: 55, rotation: -5, color: "ink" },
    ],
    annotations: [
      { text: "this was the beginning", x: 280, y: 1130, rotation: -2, tone: "ink" },
      { text: "backstage, always", x: 940, y: 1430, rotation: 1.5, tone: "blue" },
      { text: "keep this one →", x: 515, y: 1395, rotation: -1, tone: "red" },
      { text: "2022 — first season", x: 220, y: 1660, rotation: 2, tone: "ink", behind: true },
    ],
    paperScraps: [
      { id: "c1-scrap-1", text: "02", x: 255, y: 1415, rotation: -4, kind: "index" },
      { id: "c1-scrap-2", text: "flash always on hand", x: 980, y: 1155, rotation: 3, kind: "note" },
      { id: "c1-scrap-3", text: "17", x: 1120, y: 1290, rotation: 4, kind: "index" },
    ],
    hero: {
      id: "c1-hero",
      src: mainInstagram,
      frame: "plain",
      rotation: -1,
      width: 266,
      height: 329,
      x: 565,
      y: 1437,
    },
    photos: [
      { id: "c1-p-couple", src: coupleSelfie, frame: "plain", rotation: 2, width: 158, height: 195, x: 660, y: 1183, date: "2022" },
      { id: "c1-p-hallway", src: hallwayGroup, frame: "plain", rotation: -1.5, width: 210, height: 95, x: 950, y: 1230 },
      { id: "c1-p-qaafila", src: qaafilaCollage, frame: "plain", rotation: 1.5, width: 158, height: 195, x: 297, y: 1451 },
      { id: "c1-p-mic", src: womanMic, frame: "plain", rotation: -2, width: 158, height: 195, x: 358, y: 1706 },
    ],
    story:
      "I joined Qaafila through anchoring, but somewhere along the way I started documenting everything around it too — the people, the performances, the chaos backstage, and the little moments between events.",
  },
  {
    id: "chapter-02",
    index: "02",
    title: "I Kept Looking",
    subtitle: "Personal photography",
    position: { x: 2220, y: 460 },
    quiet: true,
    annotations: [{ text: "always looking", x: 1760, y: 300, rotation: -1.5, tone: "ink" }],
    hero: {
      id: "c2-hero",
      variant: "light",
      frame: "plain",
      rotation: -1,
      date: "2023",
      width: 360,
      height: 450,
      x: 2080,
      y: 240,
    },
    photos: [
      { id: "c2-p1", variant: "architecture", frame: "plain", rotation: -1.4, width: 240, height: 300, x: 1720, y: 520 },
      { id: "c2-p2", variant: "nature", frame: "plain", rotation: 1.2, width: 250, height: 320, x: 2480, y: 600 },
      { id: "c2-p3", variant: "gallery", frame: "plain", rotation: -1, width: 210, height: 260, x: 2760, y: 380 },
      { id: "c2-p4", variant: "detail", frame: "plain", rotation: 1.4, width: 190, height: 230, x: 1860, y: 250, pin: "red" },
    ],
    story:
      "Even when there wasn't an event to document, I kept taking pictures. People, places, light, little details — anything that made me stop for a second.",
  },
  {
    id: "chapter-03",
    index: "03",
    title: "Making Things Move",
    subtitle: "Qaafila reels · Awaaz · visual production",
    position: { x: 3380, y: 1280 },
    doodles: [{ kind: "cross", x: 3465, y: 995, width: 16, rotation: 4, color: "red" }],
    annotations: [
      { text: "AWAAZ, 2023", x: 3510, y: 1000, rotation: -1, tone: "blue" },
      { text: "still learning to cut", x: 3600, y: 1720, rotation: 1.5, tone: "ink" },
    ],
    hero: {
      id: "c3-hero",
      variant: "reel",
      frame: "film",
      rotation: -1,
      index: "M01",
      width: 420,
      height: 260,
      x: 3080,
      y: 1020,
    },
    photos: [
      { id: "c3-p1", variant: "banner", frame: "film", rotation: -1.2, width: 210, height: 270, x: 3220, y: 1300 },
      { id: "c3-p2", variant: "filmlight", frame: "film", rotation: 1.4, width: 230, height: 150, x: 3470, y: 1180 },
      { id: "c3-p3", variant: "banner", frame: "film", rotation: -1.5, width: 200, height: 260, x: 3620, y: 1400 },
    ],
    videos: [
      { id: "c3-v1", variant: "reel", frame: "film", rotation: 1, label: "qaafila reel", width: 260, height: 140, x: 3060, y: 1420 },
      { id: "c3-v2", variant: "banner", frame: "film", rotation: -1, label: "awaaz — event film", width: 260, height: 140, x: 3500, y: 1560 },
    ],
    story:
      "Somewhere along the way, still images weren't enough. I started making reels for Qaafila, creating visual material for Awaaz, and experimenting with video and editing whenever I had something worth putting together.",
    secondaryNote: "Also experimented with DaVinci Resolve and short-form video outside college.",
  },
  {
    id: "chapter-04",
    index: "04",
    title: "One Little Experiment",
    subtitle: "A small personal shoot, shot on iPhone",
    position: { x: 2950, y: 2260 },
    quiet: true,
    annotations: [{ text: "quiet, for once", x: 2620, y: 2140, rotation: -1.5, tone: "ink", behind: true }],
    hero: {
      id: "c4-hero",
      variant: "intimate",
      frame: "polaroid",
      rotation: -1,
      date: "2024",
      width: 340,
      height: 300,
      x: 2820,
      y: 2140,
    },
    photos: [
      { id: "c4-p1", variant: "hands", frame: "polaroid", rotation: 1.4, width: 190, height: 230, x: 2600, y: 2300 },
      { id: "c4-p2", variant: "quiet", frame: "polaroid", rotation: -1.2, width: 200, height: 230, x: 3090, y: 2380 },
      { id: "c4-p3", variant: "intimate", frame: "polaroid", rotation: 1, width: 180, height: 210, x: 3210, y: 2160 },
    ],
    story: "No studio. No elaborate setup. Just an iPhone, available light and a day worth remembering.",
  },
  {
    id: "chapter-05",
    index: "05",
    title: "Where I'm Going",
    subtitle: "",
    position: { x: 3660, y: 2740 },
    quiet: true,
    hero: {
      id: "c5-hero",
      variant: "horizon",
      frame: "plain",
      rotation: 0,
      width: 300,
      height: 390,
      x: 3560,
      y: 2600,
    },
    photos: [],
    story: "I've been photographing things for a while.\n\nNow I want to learn how to tell those stories differently.",
  },
];

export const originQuote = {
  text: "Photography is 5% skill, 5% gear and 90% being there.",
  attribution: "Joseph Radhik",
};
