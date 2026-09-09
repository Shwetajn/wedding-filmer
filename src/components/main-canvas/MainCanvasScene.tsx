import {
  stopTitles,
  scribbleDoodles,
  handCutouts,
  polaroidsLarge,
  POLAROID_LARGE_W,
  POLAROID_LARGE_H,
  heroImages,
  heroFit,
  polaroidsSplit,
  splitTopImages,
  splitBottomImages,
  polaroidsC,
  photoC,
  cTopImages,
  cBottomImages,
  polaroidsD,
  dImages,
  polaroidsE,
  photoE,
  eTopImages,
  eBottomImages,
  POLAROID_SMALL_W,
  POLAROID_SMALL_H,
  contentBlocks,
  CONTENT_BLOCK_BL_OVERRIDE,
  annotations,
  headline,
  aboutBlock,
  connectorFragments,
  TRANSITION_FRAGMENT_INDICES,
  ABOUT_CONNECTOR_FRAGMENT_INDEX,
  backgroundTexture,
  paperTexture,
  MAIN_CANVAS_WIDTH,
  MAIN_CANVAS_HEIGHT,
  GUIDED_TRANSITION_S,
} from "../../data/mainCanvasLayout";
import scribbleDoodleSrc from "../../assets/main-canvas/scribble-doodle.png";
import handCutoutSrc from "../../assets/main-canvas/hand-cutout.png";
import { PolaroidCard } from "./PolaroidCard";
import { CornerBracket } from "./CornerBracket";
import { Typewriter } from "../Typewriter";
import { useState } from "react";
import { motion } from "motion/react";

const FRAME_FILTER = "brightness(92%) contrast(77%) saturate(25%)";
// same grey<->color language as PhotoFrame's existing active/inactive treatment
const PHOTO_COLOR = "grayscale(0) saturate(1.05) contrast(1.02)";
const PHOTO_GREY = "grayscale(1) saturate(0.15) contrast(0.98)";
const PHOTO_FILTER_TRANSITION = "filter 0.55s var(--ease-editorial)";

interface MainCanvasSceneProps {
  reduced: boolean;
  /** stop index whose heading (number+title) is visible; null = none typing right now */
  headingStopIndex: number | null;
  /** stop indices whose heading has started (typing live or already finished) */
  headingRevealed: boolean[];
  /** stop index (0-3) whose hero is in full color and other stops stay grey; null = none revealed yet */
  revealedStops: boolean[];
  /** stop index currently typing its caption; already-revealed stops show their full caption statically */
  captionStopIndex: number | null;
  /** stop indices whose caption container is allowed to render at all (typing live or already finished) */
  captionRevealed: boolean[];
  /** connectorFragments array-index currently mid draw-in animation */
  drawingFragment: number | null;
  /** connectorFragments array-index that have finished drawing and now render statically */
  drawnFragments: boolean[];
  /** whether the bottom-left "about" block is visible at all */
  aboutRevealed: boolean;
  /** whether the about block's quote is actively typing right now */
  aboutTyping: boolean;
  onFollowJourney: () => void;
}

/** Pixel-exact port of the Paper "Main Canvas" artboard. Every element below is
 * positioned via the literal x/y read from Paper — this component itself does
 * not pan or zoom; it is meant to be mounted once inside the single transformed
 * world container so pan/zoom stays a transform on that container, never a
 * per-element recomputation. */
export function MainCanvasScene({
  reduced,
  headingStopIndex,
  headingRevealed,
  revealedStops,
  captionStopIndex,
  captionRevealed,
  drawingFragment,
  drawnFragments,
  aboutRevealed,
  aboutTyping,
  onFollowJourney,
}: MainCanvasSceneProps) {
  // Types in on mount — the Main Canvas is already centered on this block the
  // instant the paper finishes opening, so this is the first thing the user
  // sees animate. "Follow My Journey" only fades in once it's done typing.
  const [headlineStage, setHeadlineStage] = useState<"line1" | "line2" | "done">("line1");
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: MAIN_CANVAS_WIDTH, height: MAIN_CANVAS_HEIGHT }}>
      <div
        style={{
          position: "absolute",
          left: backgroundTexture.left,
          top: backgroundTexture.top,
          width: backgroundTexture.width,
          height: backgroundTexture.height,
          backgroundImage: `url(${paperTexture})`,
          backgroundPosition: "50%",
          backgroundSize: "cover",
          transformOrigin: "0% 0%",
          transform: `rotate(${backgroundTexture.rotate}deg)`,
        }}
      />

      {stopTitles.map((t, i) =>
        headingRevealed[i] ? (
          <div key={t.id} style={{ position: "absolute", left: t.x, top: t.y, width: 191.25, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 11.19 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 41.96,
                paddingBottom: 4.48,
                borderBottom: "1.67848px solid #1A1A1A",
              }}
            >
              <div style={{ color: "#1A1A1A", fontFamily: '"Satoshi", system-ui, sans-serif', fontWeight: 700, fontSize: 27, lineHeight: "34.8754px" }}>
                {t.index}
              </div>
            </div>
            <div style={{ color: "#900000", fontFamily: '"Satoshi", system-ui, sans-serif', fontWeight: 500, fontSize: 27, lineHeight: "34.8754px", width: 191.25 }}>
              {i === headingStopIndex ? <Typewriter text={t.label} reduced={reduced} /> : t.label}
            </div>
          </div>
        ) : null
      )}

      {scribbleDoodles.map((d, i) => (
        <img
          key={i}
          src={scribbleDoodleSrc}
          alt=""
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: d.width,
            height: d.height,
            transformOrigin: "0% 0%",
            transform: d.rotation ? `rotate(${d.rotation}deg)` : undefined,
          }}
        />
      ))}

      {polaroidsLarge.map((p, i) => (
        <PolaroidCard key={i} x={p.x} y={p.y} width={POLAROID_LARGE_W} height={POLAROID_LARGE_H} frameFilter={FRAME_FILTER}>
          <div style={{ position: "absolute", left: 26.52, top: 27.74, width: 294.8, height: 364.04, overflow: "clip" }}>
            <img
              src={heroImages[i]}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: heroFit[i],
                filter: revealedStops[i] ? PHOTO_COLOR : PHOTO_GREY,
                transition: PHOTO_FILTER_TRANSITION,
              }}
            />
          </div>
        </PolaroidCard>
      ))}

      {polaroidsSplit.map((p, i) => (
        <PolaroidCard key={i} x={p.x} y={p.y} width={POLAROID_SMALL_W} height={POLAROID_SMALL_H} frameFilter={FRAME_FILTER}>
          <div style={{ position: "absolute", left: 13.63, top: 15.81, width: 174.98, height: 220.16, overflow: "clip" }}>
            <img src={splitTopImages[i]} alt="" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "50%", objectFit: "cover", filter: PHOTO_GREY }} />
            <img src={splitBottomImages[i]} alt="" style={{ position: "absolute", left: 0, top: "50%", width: "100%", height: "50%", objectFit: "cover", filter: PHOTO_GREY }} />
          </div>
        </PolaroidCard>
      ))}

      {polaroidsC.map((p, i) => (
        <PolaroidCard key={i} x={p.x} y={p.y} width={POLAROID_SMALL_W} height={POLAROID_SMALL_H} frameFilter={FRAME_FILTER}>
          <div style={{ position: "absolute", left: 13.57, top: 15.8, width: 175.26, height: 216.24, background: "#DFD9DB", overflow: "clip" }}>
            {cTopImages[i] ? (
              <>
                <img src={cTopImages[i]!} alt="" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "50%", objectFit: "cover", filter: PHOTO_GREY }} />
                <img src={cBottomImages[i]!} alt="" style={{ position: "absolute", left: 0, top: "50%", width: "100%", height: "50%", objectFit: "cover", filter: PHOTO_GREY }} />
              </>
            ) : (
              <img src={photoC} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: PHOTO_GREY }} />
            )}
          </div>
        </PolaroidCard>
      ))}

      {polaroidsD.map((p, i) => (
        <PolaroidCard key={i} x={p.x} y={p.y} width={POLAROID_SMALL_W} height={POLAROID_SMALL_H} frameFilter={FRAME_FILTER}>
          <div style={{ position: "absolute", left: 13.6, top: 15.85, width: 175.03, height: 216.14, overflow: "clip" }}>
            <img src={dImages[i]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: PHOTO_GREY }} />
          </div>
        </PolaroidCard>
      ))}

      {polaroidsE.map((p, i) => (
        <PolaroidCard key={i} x={p.x} y={p.y} width={POLAROID_SMALL_W} height={POLAROID_SMALL_H} frameFilter={FRAME_FILTER}>
          <div style={{ position: "absolute", left: 13.6, top: 15.85, width: 175.03, height: 216.14, overflow: "clip" }}>
            {eTopImages[i] ? (
              <>
                <img src={eTopImages[i]!} alt="" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "50%", objectFit: "cover", filter: PHOTO_GREY }} />
                <img src={eBottomImages[i]!} alt="" style={{ position: "absolute", left: 0, top: "50%", width: "100%", height: "50%", objectFit: "cover", filter: PHOTO_GREY }} />
              </>
            ) : (
              <img src={photoE} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: PHOTO_GREY }} />
            )}
          </div>
        </PolaroidCard>
      ))}

      {contentBlocks.map((b, i) => {
        const blOverrideY = CONTENT_BLOCK_BL_OVERRIDE[b.id];
        // gated on captionRevealed (set the instant this stop's caption phase
        // starts), NOT revealedStops (set earlier, at highlight) — otherwise
        // the full caption text pops in during the highlight beat, then gets
        // reset to empty and re-typed once captionStopIndex actually arrives.
        const revealed = captionRevealed[i];
        const textStyle: React.CSSProperties = {
          position: "absolute",
          left: 23.5,
          top: 20.14,
          width: 298.91,
          color: "#900000",
          fontFamily: '"Satoshi", system-ui, sans-serif',
          fontWeight: 500,
          fontSize: 18.6,
          lineHeight: "24px",
          whiteSpace: "pre-wrap",
        };
        return (
          <div key={b.id} style={{ position: "absolute", left: b.x, top: b.y, width: b.width, height: b.height }}>
            {revealed &&
              (i === captionStopIndex ? (
                <div style={textStyle}>
                  <Typewriter text={b.text} reduced={reduced} />
                </div>
              ) : (
                <div style={textStyle}>{b.text}</div>
              ))}
            <CornerBracket corner="tr" x={b.width - 23.57} y={0} />
            <CornerBracket corner="br" x={b.width - 23.57} y={b.height - 20.142} />
            <CornerBracket corner="tl" x={23.57} y={20.14} />
            <CornerBracket corner="bl" x={23.57} y={blOverrideY !== undefined ? blOverrideY - b.y : b.height} />
          </div>
        );
      })}

      {handCutouts.map((h, i) => (
        <img
          key={i}
          src={handCutoutSrc}
          alt=""
          style={{
            position: "absolute",
            left: h.x,
            top: h.y,
            width: h.width,
            height: h.height,
            transformOrigin: "0% 0%",
            transform: h.rotation ? `rotate(${h.rotation}deg)` : undefined,
          }}
        />
      ))}

      {annotations.map((a, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: a.x,
            top: a.y,
            color: a.color,
            fontFamily: '"Caveat", system-ui, sans-serif',
            fontWeight: 500,
            fontSize: 18.6,
            lineHeight: "24px",
            textTransform: "lowercase",
            width: 298.91,
            transformOrigin: "0% 0%",
            transform: a.rotation ? `rotate(${a.rotation}deg)` : undefined,
          }}
        >
          {a.text}
        </div>
      ))}

      {/* central headline + CTA — typewriter, then the CTA fades in once done */}
      <div style={{ position: "absolute", left: headline.x, top: headline.y, width: headline.width, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ color: "#1A1A1A", fontFamily: '"Bebas Neue", system-ui, sans-serif', fontSize: 173, lineHeight: "208px", textAlign: "center" }}>
            {headlineStage === "line1" ? (
              <Typewriter text="Hi There," reduced={reduced} cursorClassName="main-canvas-typewriter-cursor" onTypingComplete={() => setHeadlineStage("line2")} />
            ) : (
              "Hi There,"
            )}
          </div>
          {headlineStage !== "line1" && (
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div style={{ color: "#1A1A1A", fontFamily: '"Bebas Neue", system-ui, sans-serif', fontSize: 173, lineHeight: "208px" }}>I am</div>
              <div style={{ borderBottom: "4px solid #7A0000" }}>
                <div style={{ color: "#1A1A1A", fontFamily: '"Bebas Neue", system-ui, sans-serif', fontSize: 173, lineHeight: "208px" }}>
                  {headlineStage === "line2" ? (
                    <Typewriter text={" Shweta Jain"} reduced={reduced} cursorClassName="main-canvas-typewriter-cursor" onDone={() => setHeadlineStage("done")} />
                  ) : (
                    <>&nbsp;Shweta Jain</>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <motion.button
          type="button"
          className="main-canvas-journey-cta"
          onClick={onFollowJourney}
          initial={{ opacity: 0 }}
          animate={{ opacity: headlineStage === "done" ? 1 : 0 }}
          transition={{ duration: reduced ? 0.15 : 0.5, ease: "easeOut" }}
          style={{ pointerEvents: headlineStage === "done" ? "auto" : "none" }}
        >
          Follow My Journey <span className="main-canvas-journey-cta__arrow" aria-hidden="true">→</span>
        </motion.button>
      </div>

      {/* bottom-left about block — the guided story's final beat: hidden until
          the connector segment from stop 04 arrives, then its quote types in
          the same way each stop's caption does. */}
      {aboutRevealed && (
        <div style={{ position: "absolute", left: aboutBlock.x, top: aboutBlock.y, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 23 }}>
          <div style={{ paddingBottom: 36, borderBottom: "1px solid rgba(0,0,0,0.5)" }}>
            <div style={{ width: aboutBlock.width, color: "#2A1C19", fontFamily: '"Satoshi", system-ui, sans-serif', fontWeight: 500, fontStyle: "italic", fontSize: 42, lineHeight: "52px", whiteSpace: "pre-wrap" }}>
              {aboutTyping ? (
                <Typewriter text={aboutBlock.quote} reduced={reduced} cursorClassName="main-canvas-typewriter-cursor" />
              ) : (
                aboutBlock.quote
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 23 }}>
            <div style={{ width: aboutBlock.width, color: "#111111", fontFamily: '"Satoshi", system-ui, sans-serif', fontWeight: 500, fontSize: 42, lineHeight: "52px" }}>
              {aboutBlock.name}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
              {aboutBlock.roles.map((r, i) => (
                <div key={i} style={{ color: "#111111", fontFamily: '"Satoshi", system-ui, sans-serif', fontStyle: "italic", fontSize: 24, lineHeight: "30px" }}>
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* connector doodle — routed on top, matching Paper's stacking order.
          All 4 fragments are part of the guided draw-in sequence: 0/2/3 sit
          between two stops, fragment 1 sits between stop 04 and the about
          block (see TRANSITION_FRAGMENT_INDICES / ABOUT_CONNECTOR_FRAGMENT_INDEX). */}
      {connectorFragments.map((f, i) => {
        const isTransition = TRANSITION_FRAGMENT_INDICES.includes(i) || i === ABOUT_CONNECTOR_FRAGMENT_INDEX;
        const drawn = !isTransition || drawnFragments[i];
        const drawingNow = isTransition && drawingFragment === i;

        if (!drawn && !drawingNow) return null;

        // pathLength=100 normalizes dash math to a fixed unit length
        // regardless of this fragment's actual geometry, so the same "1 4"
        // dotted pattern stays constant the whole time — only
        // strokeDashoffset animates (100 -> 0), revealing dots progressively
        // along the path. This must never render as a solid stroke that
        // later swaps to dotted.
        return (
          <svg
            key={i}
            width={f.width}
            height={f.height}
            viewBox={f.viewBox}
            style={{
              position: "absolute",
              left: f.left,
              top: f.top,
              overflow: "visible",
              transformOrigin: "0% 0%",
              transform: f.rotate ? `rotate(${f.rotate}deg)` : undefined,
            }}
          >
            <path
              d={f.d}
              pathLength={100}
              fill="none"
              stroke="#161412"
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.78}
              className={drawingNow ? "connector-drawing" : undefined}
              style={{
                strokeDasharray: "1 4",
                strokeDashoffset: drawn ? 0 : 100,
                ...(drawingNow ? { "--connector-draw-duration": `${reduced ? 0.2 : GUIDED_TRANSITION_S}s` } : {}),
              } as React.CSSProperties}
            />
          </svg>
        );
      })}
    </div>
  );
}
