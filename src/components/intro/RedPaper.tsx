import redScrap from "../../assets/intro/red-scrap.png";

const REST_ROTATE = -1.6;

/** A physical scrap of paper already resting on the background, present from
 * the very first frame alongside the crumpled paper — no entrance animation. */
export function RedPaper() {
  return (
    <div className="intro-red-paper-stage" aria-hidden="true">
      <img
        src={redScrap}
        alt=""
        draggable={false}
        className="intro-red-paper__img"
        style={{ transform: `rotate(${REST_ROTATE}deg)` }}
      />
    </div>
  );
}
