import { useEffect, useRef } from "react";
import "../styles/attention-field.css";

/**
 * Page substrate: a slowly-evolving attention matrix.
 *
 * Replaces the previous drifting-stars canvas. Same cost profile, but the
 * motion means something — a query row sweeps the field and the columns it
 * attends to brighten, which is the actual shape of the work.
 */
export default function AttentionField() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const CELL = 26; // px, including gutter
    const GAP = 5;
    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;

    // Read the signal colour from the token layer so the canvas follows theme.
    const readAccent = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim();
      const hex = raw.startsWith("#") ? raw.slice(1) : "2dd4bf";
      const full =
        hex.length === 3
          ? hex
              .split("")
              .map((c) => c + c)
              .join("")
          : hex;
      const n = parseInt(full, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    let rgb = readAccent();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
    };

    /* Smooth pseudo-random scalar field. Three incommensurate sinusoids read
       as organic without needing a noise implementation. */
    const field = (x, y, t) =>
      (Math.sin(x * 0.29 + t * 0.21) * Math.cos(y * 0.23 - t * 0.16) +
        Math.sin((x + y) * 0.17 - t * 0.11) +
        Math.cos(x * 0.11 - y * 0.19 + t * 0.07)) /
      3;

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height);

      /* Query row sweeps top to bottom on a slow cycle. It starts a third of
         the way down so the first paint isn't a hard band under the navbar. */
      const period = 18;
      const phase = (t / period + 0.35) % 1;
      const queryRow = phase * rows;

      const size = CELL - GAP;

      for (let r = 0; r < rows; r++) {
        const rowDist = Math.abs(r - queryRow);
        // Attention envelope: soft peak on the query row, gradual falloff.
        const attend = Math.exp(-(rowDist * rowDist) / 16);

        for (let c = 0; c < cols; c++) {
          const f = (field(c, r, t) + 1) / 2; // → 0..1

          // Sparsify: most weights are ~0, a few dominate. This is what makes
          // it read as a weight matrix instead of a uniform dot grid.
          let a = Math.pow(f, 4.2) * 0.38;
          a += attend * Math.pow(f, 2.2) * 0.42;

          if (a < 0.012) continue;

          ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a.toFixed(3)})`;
          ctx.fillRect(c * CELL, r * CELL, size, size);
        }
      }
    };

    let last = 0;
    const loop = (ms) => {
      rafRef.current = requestAnimationFrame(loop);
      if (!runningRef.current) return;
      if (ms - last < 40) return; // ~25fps is plenty for motion this slow
      last = ms;
      draw(ms / 1000);
    };

    const onVisibility = () => {
      runningRef.current = !document.hidden;
    };

    const onThemeChange = () => {
      rgb = readAccent();
      if (reduced) draw(0);
    };

    resize();
    draw(0);

    if (!reduced) {
      rafRef.current = requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="attention-field" aria-hidden="true" />;
}
