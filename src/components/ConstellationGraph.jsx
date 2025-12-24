import { useEffect, useRef } from "react";

export default function ConstellationGraph() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const animationRef = useRef(null);
  const lastFrameRef = useRef(0);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const connectionDistance = Math.max(width, height) * 0.18;
    const connectionDistSq = connectionDistance * connectionDistance;

    let backgroundGradient = null;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      backgroundGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.3
      );
      backgroundGradient.addColorStop(0, "rgba(59, 130, 246, 0.02)");
      backgroundGradient.addColorStop(1, "rgba(30, 58, 138, 0.04)");
    };

    const initStars = () => {
      const count = 28;
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.35 + 0.65,
        brightness: Math.random() * 0.35 + 0.55,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = backgroundGradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < starsRef.current.length; i++) {
        const s1 = starsRef.current[i];

        for (let j = i + 1; j < starsRef.current.length; j++) {
          const s2 = starsRef.current[j];
          const dx = s2.x - s1.x;
          const dy = s2.y - s1.y;
          const d = dx * dx + dy * dy;

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

      starsRef.current.forEach((s) => {
        ctx.fillStyle = `rgba(219, 234, 254, ${s.brightness})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${s.brightness * 0.55})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const update = () => {
      starsRef.current.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0 || s.x > width) s.vx *= -1;
        if (s.y < 0 || s.y > height) s.vy *= -1;
      });
    };

    const loop = (t) => {
      if (!visibleRef.current || prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(loop);
        return;
      }

      if (t - lastFrameRef.current > 32) {
        update();
        draw();
        lastFrameRef.current = t;
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    resize();
    initStars();
    draw();

    observer.observe(canvas);
    window.addEventListener("resize", resize);
    animationRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      cancelAnimationFrame(animationRef.current);
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
