import { useEffect, useRef } from "react";

export default function FloatingParticles() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = (count) => {
      particlesRef.current = new Array(count).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.8 + 0.6,
        o: Math.random() * 0.5 + 0.2,
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);
      // soft gradient overlay
      const grd = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 1.4);
      grd.addColorStop(0, 'rgba(147, 197, 253, 0.05)');
      grd.addColorStop(1, 'rgba(59, 130, 246, 0.02)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      // draw particles
      for (const p of particlesRef.current) {
        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;
        }
        // wrap around
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(147, 197, 253, ${p.o})`;
        ctx.fill();
      }

      if (!reduceMotion) rafRef.current = requestAnimationFrame(step);
    };

    const onResize = () => {
      resize();
      initParticles(Math.floor((width * height) / 18000)); // density-based count
      if (reduceMotion) step();
    };

    const init = () => {
      resize();
      initParticles(Math.floor((width * height) / 18000));
      if (reduceMotion) {
        step();
      } else {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    init();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion]);

  return (
    <canvas ref={canvasRef} className="floating-particles" aria-hidden="true" />
  );
}
