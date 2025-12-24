import { useEffect, useRef } from 'react';

export default function AIConnectome({ size = 320, maxNodes = 28 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const obsRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let mounted = true;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // devicePixelRatio cap to avoid heavy rendering
    const DPR = Math.min(window.devicePixelRatio || 1, 1.75);

    const w = size;
    const h = size;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(DPR, DPR);

    const center = { x: w / 2, y: h / 2 };

    // generate nodes on a soft ring with jitter
    const nodes = [];
    for (let i = 0; i < maxNodes; i++) {
      const angle = (i / maxNodes) * Math.PI * 2;
      const r = (w * 0.35) + (Math.random() - 0.5) * (w * 0.06);
      const x = center.x + Math.cos(angle) * r + (Math.random() - 0.5) * 8;
      const y = center.y + Math.sin(angle) * r + (Math.random() - 0.5) * 8;
      nodes.push({ x, y, phase: Math.random() * Math.PI * 2, pulse: 0 });
    }

    // connect nodes to nearest neighbors
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.hypot(dx, dy);
        if (d < w * 0.28) edges.push([i, j, d]);
      }
    }

    // pulses: objects with position along edge list (i->j) moving
    const pulses = [];

    let lastTime = performance.now();
    let fpsCap = 30;

    function step(now) {
      if (!mounted) return;
      const dt = now - lastTime;
      if (dt < 1000 / fpsCap) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      lastTime = now;

      // clear
      ctx.clearRect(0, 0, w, h);

      // subtle background vignette
      const g = ctx.createRadialGradient(center.x, center.y, w * 0.1, center.x, center.y, w * 0.8);
      g.addColorStop(0, 'rgba(10,12,20,0.0)');
      g.addColorStop(1, 'rgba(10,12,20,0.18)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // update node pulses
      nodes.forEach((n) => {
        // natural breathing
        n.phase += dt * 0.002;
        n.pulse *= 0.92;
      });

      // spawn occasional pulses
      if (!prefersReduced && Math.random() < 0.06) {
        const e = edges[Math.floor(Math.random() * edges.length)];
        if (e) pulses.push({ edge: e, t: 0, speed: 0.012 + Math.random() * 0.018 });
      }

      // draw edges
      edges.forEach(([i, j, d]) => {
        const a = nodes[i];
        const b = nodes[j];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        // base alpha modulated by distance
        const alpha = 0.09 + (1 - d / (w * 0.28)) * 0.14;
        ctx.strokeStyle = `rgba(120,140,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // update and render pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.t += (dt * pulse.speed);
        const [i, j, d] = pulse.edge;
        const a = nodes[i];
        const b = nodes[j];
        const px = a.x + (b.x - a.x) * pulse.t;
        const py = a.y + (b.y - a.y) * pulse.t;

        // draw glow
        ctx.beginPath();
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 18);
        grad.addColorStop(0, 'rgba(140,180,255,0.95)');
        grad.addColorStop(0.25, 'rgba(120,160,255,0.5)');
        grad.addColorStop(1, 'rgba(120,160,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(px - 18, py - 18, 36, 36);

        if (pulse.t > 1) pulses.splice(p, 1);
      }

      // draw nodes
      nodes.forEach((n) => {
        const b = 4 + Math.sin(n.phase) * 1.2 + n.pulse * 4;
        ctx.beginPath();
        ctx.arc(n.x, n.y, b, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180,200,255,0.95)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, b + 1, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(120,140,255,0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      rafRef.current = requestAnimationFrame(step);
    }

    // IntersectionObserver to pause when offscreen
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (!e.isIntersecting) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      } else {
        lastTime = performance.now();
        rafRef.current = requestAnimationFrame(step);
      }
    }, { threshold: 0.1 });
    obsRef.current = io;
    io.observe(canvas);

    // start unless reduced motion
    if (!prefersReduced) rafRef.current = requestAnimationFrame(step);

    return () => {
      mounted = false;
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [size, maxNodes]);

  return (
    <div className="ai-connectome" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
