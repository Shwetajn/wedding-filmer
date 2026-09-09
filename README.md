# Shweta Jain — A Visual Memory (V1)

An interactive creative portfolio: analog photography journal ×
editorial scrapbook × Y2K camera × cinematic storytelling, all living
inside one large draggable, zoomable canvas. Built with React,
TypeScript, Vite, and [Motion](https://motion.dev/docs/react).

## How to run

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173` (or the next free port).

## How to build

```bash
npm run build   # type-checks with tsc -b, then builds with Vite
npm run preview # serve the production build locally
```

## How to deploy

The build output in `dist/` is a static site — deploy it to any static
host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3 + CDN, etc.)
with no server-side requirements. No environment variables, database,
or backend are needed for V1.

## Experience flow

1. **`IntroCamera`** — a Y2K compact camera (pure SVG/CSS, no images),
   idle-animated, click/tap or keyboard-activate (`Tab` → `Enter`) to fire it.
2. **`ShutterTransition`** — an iris-style shutter opens outward,
   revealing the world underneath (skipped down to a quick fade under
   `prefers-reduced-motion`).
3. **`CanvasWorld`** — everything else lives here. It opens tightly
   framed on a printed quote, then zooms out to reveal the full canvas:
   dotted paper, chapters, photo clusters. A one-time `JourneyPrompt`
   invites the visitor to follow a guided path or wander freely.
4. **`JourneyController`** — when "Follow the journey" is chosen, the
   camera glides between chapters automatically. Dragging or
   pinch/wheel-zooming at any point interrupts it — the user is never
   locked in.

## Where things live

| What | File |
|---|---|
| Chapter copy, photo/video layout, positions | `src/data/chapters.ts` |
| World size, zoom limits | `src/data/world.ts` |
| Canvas pan/zoom engine (drag, wheel, pinch, focus-on) | `src/hooks/useCanvasEngine.ts` |
| Guided journey sequencing | `src/components/JourneyController.tsx` |
| Photo placeholder art (SVG/gradient compositions) | `src/components/PhotoPlaceholder.tsx` |
| Frame styles (polaroid/taped/contact/film/plain) | `src/components/PhotoFrame.tsx` |
| Hover-to-color / click-to-story cluster logic | `src/components/PhotoCluster.tsx`, `Chapter.tsx` |
| Design tokens (color, type, shadow) | `src/styles/tokens.css` |

### Replacing placeholder photographs

Every photo is described by a `PhotoMeta` object in
`src/data/chapters.ts` (`hero`, `photos[]`, and each chapter's
`videos[]`). To swap in a real photo:

1. Add the image file (e.g. to `public/photos/`).
2. In `PhotoFrame.tsx`, replace the `<PhotoPlaceholder variant={photo.variant} />`
   calls with `<img src={photo.src} />` when `photo.src` is present —
   the surrounding frame, rotation, shadow, hover/color, and click/story
   behavior all stay unchanged since they operate on the frame, not the
   image content.
3. You can keep `variant` as a fallback for any photo not yet
   delivered, so the piece never shows a broken image.

### Replacing video placeholders

`VideoFrame.tsx` renders the same way — swap its `PhotoPlaceholder` for
a real `<video>` or thumbnail `<img>` once footage exists, keeping the
film-frame chrome (sprockets, play triangle, label).

### Chapter copy

All chapter titles, subtitles, annotations, and story paragraphs are
plain data in `src/data/chapters.ts` (`ChapterData[]`) — no copy is
hard-coded into components.

### Canvas positions

`WORLD_WIDTH` / `WORLD_HEIGHT` (`src/data/world.ts`) define the
canvas's total size. Each chapter's `position: {x, y}` and each
photo's `x, y` are world coordinates (not screen pixels) — dragging
and zooming just move a viewport over this fixed-size world. To
rearrange the spatial composition, adjust these coordinates directly;
`JourneyController` reads the same `position`/`hero` values to know
where to move the camera.

## Contact links

`src/components/ContactLinks.tsx` currently points to placeholder
`href`s (`#` / a placeholder mailto). Replace with the real Instagram,
LinkedIn, and email addresses before shipping.

## What's implemented in V1

Camera + idle animation, shutter transition, printed quote with CTA,
zoom-out reveal, pan (mouse drag / touch), zoom (wheel / pinch),
one-time first-visit journey prompt, all five chapters with
data-driven photo clusters, hover-to-color / grayscale system,
click-to-story focus state, guided journey with interrupt-on-drag,
free exploration, responsive mobile layout, keyboard activation of the
camera, and `prefers-reduced-motion` support (shorter transitions, no
idle camera flicker, instant reveal).

Verified: production build (`npm run build`) is clean with no
TypeScript or bundling errors; smoke-tested end-to-end (camera →
shutter → quote → reveal → guided journey → ending) on desktop,
mobile viewport, keyboard-only input, and with reduced motion enabled
— no console errors in any pass.

## Known V1 gaps to revisit

- Real photography/video is not yet in — see "Replacing placeholder
  photographs" above.
- Contact links are placeholders.
- Pinch-zoom is implemented via raw pointer-event tracking (two active
  pointers), which covers the common case but hasn't been tested on a
  physical touch device — worth a hands-on pass before launch.
