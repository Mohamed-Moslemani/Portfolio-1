import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/intro.css";

/* First-visit intro: the m.m wordmark "reconstructs" from a partial voxel grid,
   the red dot floods the screen, and the flood lifts to reveal the site.
   Once per session, skippable (any key or click), off under reduced motion.
   The page renders underneath the whole time; nothing waits on this. */

const SEEN_KEY = "mm-intro-seen";

// 5×5 pixel glyphs. "m", gap, ".", gap, "m" → 13 columns.
const M = ["XXXX.", "X.X.X", "X.X.X", "X.X.X", "X.X.X"];
const ROWS = 5;
const COLS = 13;
const DOT = { r: 4, c: 6 };

const CELLS = (() => {
  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let on = false;
      if (c < 5) on = M[r][c] === "X";
      else if (c >= 8) on = M[r][c - 8] === "X";
      const dot = r === DOT.r && c === DOT.c;
      if (on || dot) cells.push({ r, c, dot });
    }
  }
  // Deterministic scatter order (golden-ratio hash), dot always last.
  const body = cells.filter((x) => !x.dot);
  body.forEach((x, i) => (x.order = ((i * 0.618034 + x.r * 0.37) % 1) * body.length));
  body.sort((a, b) => a.order - b.order).forEach((x, i) => (x.order = i));
  const dot = cells.find((x) => x.dot);
  dot.order = body.length;
  return [...body, dot];
})();

const STAGES = ["ingest", "train", "eval", "serve"];

// ms from mount
const T = { fill: 150, flood: 1150, lift: 1600, done: 2200 };

const shouldPlay = () => {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return true;
  }
};

export default function Intro() {
  const [phase, setPhase] = useState(() => (shouldPlay() ? "ghost" : "off"));
  const [stage, setStage] = useState(0);
  const dotRef = useRef(null);
  const rootRef = useRef(null);
  const timers = useRef([]);

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout);
    const root = document.documentElement;
    root.classList.remove("intro-playing");
    // Let the hero entrance finish, then drop the class so revisits to "/"
    // don't replay it.
    setTimeout(() => root.classList.remove("intro-reveal"), 1200);
    setPhase("off");
  }, []);

  const skip = useCallback(() => {
    timers.current.forEach(clearTimeout);
    setPhase("lift");
    document.documentElement.classList.add("intro-reveal");
    timers.current = [setTimeout(finish, 500)];
  }, [finish]);

  useEffect(() => {
    if (phase === "off") return;
    // Mount-time only: schedule the whole timeline once.
    const root = document.documentElement;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode: intro may replay, harmless */
    }
    root.classList.add("intro-playing");

    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
    at(T.fill, () => setPhase("fill"));
    STAGES.forEach((_, i) => at(T.fill + i * 240, () => setStage(i)));
    at(T.flood, () => {
      const r = dotRef.current?.getBoundingClientRect();
      if (r && rootRef.current) {
        rootRef.current.style.setProperty("--fx", `${r.left + r.width / 2}px`);
        rootRef.current.style.setProperty("--fy", `${r.top + r.height / 2}px`);
      }
      setPhase("flood");
    });
    at(T.lift, () => {
      setPhase("lift");
      root.classList.add("intro-reveal");
    });
    at(T.done, finish);

    const onKey = () => skip();
    window.addEventListener("keydown", onKey, { once: true });
    const pending = timers.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      pending.forEach(clearTimeout);
      root.classList.remove("intro-playing");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "off") return null;

  return (
    <div
      ref={rootRef}
      className={`intro is-${phase}`}
      aria-hidden="true"
      onPointerDown={skip}
    >
      <div className="intro-stage">
        <p className="intro-top eyebrow">
          <span>Mohamed Moslemani</span>
          <span>AI systems engineer</span>
        </p>

        <div
          className="intro-grid"
          style={{ "--cols": COLS, "--rows": ROWS }}
        >
          {CELLS.map((cell) => (
            <span
              key={`${cell.r}-${cell.c}`}
              ref={cell.dot ? dotRef : undefined}
              className={`intro-cell${cell.dot ? " is-dot" : ""}`}
              style={{
                gridRow: cell.r + 1,
                gridColumn: cell.c + 1,
                "--i": cell.order,
              }}
            />
          ))}
        </div>

        <div className="intro-bottom eyebrow">
          <ol className="intro-stages">
            {STAGES.map((s, i) => (
              <li key={s} className={i <= stage && phase !== "ghost" ? "is-on" : ""}>
                {s}
                {i < STAGES.length - 1 && <span className="intro-arrow">→</span>}
              </li>
            ))}
          </ol>
          <span className="intro-skip">Press any key to skip</span>
        </div>
      </div>

      <div className="intro-flood" />
    </div>
  );
}
