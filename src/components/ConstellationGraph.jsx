import { useEffect, useRef } from "react";

export default function ConstellationGraph() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const animationRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const connectionDistance = Math.max(width, height) * 0.18;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initStars = () => {
      const count = 28;
      starsRef.current = new Array(count).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.35 + 0.65,
        brightness: Math.random() * 0.35 + 0.55,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
      }));
    };

    const distSq = (x1, y1, x2, y2) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      return dx * dx + dy * dy;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle background
      const grd = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.3
      );
      grd.addColorStop(0, "rgba(59, 130, 246, 0.02)");
      grd.addColorStop(1, "rgba(30, 58, 138, 0.04)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      const connectionDistSq = connectionDistance * connectionDistance;

      // Draw connections
      for (let i = 0; i < starsRef.current.length; i++) {
        for (let j = i + 1; j < starsRef.current.length; j++) {
          const s1 = starsRef.current[i];
          const s2 = starsRef.current[j];
          const d = distSq(s1.x, s1.y, s2.x, s2.y);

          if (d < connectionDistSq) {
            const dist = Math.sqrt(d);
            const opacity = (1 - dist / connectionDistance) * 0.12;

            ctx.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
            ctx.lineWidth = 0.45;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }
      }

      // Draw stars
      starsRef.current.forEach((star) => {
        ctx.fillStyle = `rgba(219, 234, 254, ${star.brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();

        // Small core highlight
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * 0.55})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const step = () => {
      draw();
      animationRef.current = requestAnimationFrame(step);
    };

    const onResize = () => {
      resize();
      initStars();
      draw();
    };

    const init = () => {
      resize();
      initStars();
      draw();
    };

    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    init();
    step();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="constellation-graph"
      aria-hidden="true"
    />
  );
}
