import { motion } from "motion/react";
import {
  stopTitles,
  scribbleDoodles,
  handCutouts,
  polaroidsLarge,
  POLAROID_LARGE_W,
  POLAROID_LARGE_H,
  heroInstagram,
  polaroidsSplit,
  splitTop,
  splitBottom,
  polaroidsC,
  photoC,
  polaroidsD,
  photoD,
  polaroidsE,
  photoE,
  POLAROID_SMALL_W,
  POLAROID_SMALL_H,
  contentBlocks,
  CONTENT_BLOCK_BL_OVERRIDE,
  annotations,
  headline,
  aboutBlock,
  connectorFragments,
  TRANSITION_FRAGMENT_INDICES,
  backgroundTexture,
  paperTexture,
  MAIN_CANVAS_WIDTH,
  MAIN_CANVAS_HEIGHT,
} from "../../data/mainCanvasLayout";
import scribbleDoodleSrc from "../../assets/main-canvas/scribble-doodle.png";
import handCutoutSrc from "../../assets/main-canvas/hand-cutout.png";
import { PolaroidCard } from "./PolaroidCard";
import { CornerBracket } from "./CornerBracket";
import { Typewriter } from "../Typewriter";

const FRAME_FILTER = "brightness(92%) contrast(77%) saturate(25%)";
// same grey<->color language as PhotoFrame's existing active/inactive treatment
const PHOTO_COLOR = "grayscale(0) saturate(1.05) contrast(1.02)";
const PHOTO_GREY = "grayscale(1) saturate(0.15) contrast(0.98)";
const PHOTO_FILTER_TRANSITION = "filter 0.55s var(--ease-editorial)";
const DRAW_DURATION_S = 1.3;

interface MainCanvasSceneProps {
  reduced: boolean;
  /** stop index (0-3) whose hero is in full color and other stops stay grey; null = none revealed yet */
  revealedStops: boolean[];
  /** stop index currently typing its caption; already-revealed stops show their full caption statically */
  captionStopIndex: number | null;
  /** connectorFragments array-index currently mid draw-in animation */
  drawingFragment: number | null;
  /** connectorFragments array-index that have finished drawing and now render statically */
  drawnFragments: boolean[];
  onFollowJourney: () => void;
}

/** Pixel-exact port of the Paper "Main Canvas" artboard. Every element below is
 * positioned via the literal x/y read from Paper — this component itself does
 * not pan or zoom; it is meant to be mounted once inside the single transformed
 * world container so pan/zoom stays a transform on that container, never a
 * per-element recomputation. */
export function MainCanvasScene({
  reduced,
  revealedStops,
  captionStopIndex,
  drawingFragment,
  drawnFragments,
  onFollowJourney,
}: MainCanvasSceneProps) {
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

      {stopTitles.map((t) => (
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
            {t.label}
          </div>
        </div>
      ))}

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
              src={heroInstagram}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
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
            <img src={splitTop} alt="" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "50%", objectFit: "cover", filter: PHOTO_GREY }} />
            <img src={splitBottom} alt="" style={{ position: "absolute", left: 0, top: "50%", width: "100%", height: "50%", objectFit: "cover", filter: PHOTO_GREY }} />
          </div>
        </PolaroidCard>
      ))}

      {polaroidsC.map((p, i) => (
        <PolaroidCard key={i} x={p.x} y={p.y} width={POLAROID_SMALL_W} height={POLAROID_SMALL_H} frameFilter={FRAME_FILTER}>
          <div style={{ position: "absolute", left: 13.57, top: 15.8, width: 175.26, height: 216.24, background: "#DFD9DB", overflow: "clip" }}>
            <img src={photoC} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: PHOTO_GREY }} />
          </div>
        </PolaroidCard>
      ))}

      {polaroidsD.map((p, i) => (
        <PolaroidCard key={i} x={p.x} y={p.y} width={POLAROID_SMALL_W} height={POLAROID_SMALL_H} frameFilter={FRAME_FILTER}>
          <div style={{ position: "absolute", left: 13.6, top: 15.85, width: 175.03, height: 216.14, overflow: "clip" }}>
            <img src={photoD} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: PHOTO_GREY }} />
          </div>
        </PolaroidCard>
      ))}

      {polaroidsE.map((p, i) => (
        <PolaroidCard key={i} x={p.x} y={p.y} width={POLAROID_SMALL_W} height={POLAROID_SMALL_H} frameFilter={FRAME_FILTER}>
          <div style={{ position: "absolute", left: 13.6, top: 15.85, width: 175.03, height: 216.14, overflow: "clip" }}>
            <img src={photoE} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: PHOTO_GREY }} />
          </div>
        </PolaroidCard>
      ))}

      {contentBlocks.map((b, i) => {
        const blOverrideY = CONTENT_BLOCK_BL_OVERRIDE[b.id];
        const revealed = revealedStops[i];
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

      {/* central headline + CTA */}
      <div style={{ position: "absolute", left: headline.x, top: headline.y, width: headline.width, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ color: "#1A1A1A", fontFamily: '"Bebas Neue", system-ui, sans-serif', fontSize: 173, lineHeight: "208px", textAlign: "center" }}>
            Hi There,
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={{ color: "#1A1A1A", fontFamily: '"Bebas Neue", system-ui, sans-serif', fontSize: 173, lineHeight: "208px" }}>I am</div>
            <div style={{ borderBottom: "4px solid #7A0000" }}>
              <div style={{ color: "#1A1A1A", fontFamily: '"Bebas Neue", system-ui, sans-serif', fontSize: 173, lineHeight: "208px" }}>
                &nbsp;Shweta Jain
              </div>
            </div>
          </div>
        </div>
        <button type="button" className="main-canvas-journey-cta" onClick={onFollowJourney}>
          Follow My Journey <span className="main-canvas-journey-cta__arrow" aria-hidden="true">→</span>
        </button>
      </div>

      {/* bottom-left about block */}
      <div style={{ position: "absolute", left: aboutBlock.x, top: aboutBlock.y, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 23 }}>
        <div style={{ paddingBottom: 36, borderBottom: "1px solid rgba(0,0,0,0.5)" }}>
          <div style={{ width: aboutBlock.width, color: "#2A1C19", fontFamily: '"Satoshi", system-ui, sans-serif', fontWeight: 500, fontStyle: "italic", fontSize: 42, lineHeight: "52px", whiteSpace: "pre-wrap" }}>
            {aboutBlock.quote}
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

      {/* connector doodle — routed on top, matching Paper's stacking order.
          Fragment 1 is a static isolated mark; fragments 0/2/3 sit between two
          stops and only draw themselves in once the guided story reaches that
          transition (see TRANSITION_FRAGMENT_INDICES). */}
      {connectorFragments.map((f, i) => {
        const isTransition = TRANSITION_FRAGMENT_INDICES.includes(i);
        const drawn = !isTransition || drawnFragments[i];
        const drawingNow = isTransition && drawingFragment === i;

        if (!drawn && !drawingNow) return null;

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
            {drawn ? (
              <path
                d={f.d}
                fill="none"
                stroke="#161412"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray="1 7"
                opacity={0.78}
              />
            ) : (
              <motion.path
                d={f.d}
                fill="none"
                stroke="#161412"
                strokeWidth={2.5}
                strokeLinecap="round"
                opacity={0.78}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduced ? 0.2 : DRAW_DURATION_S, ease: "linear" }}
              />
            )}
          </svg>
        );
      })}
    </div>
  );
}
