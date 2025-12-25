import { useEffect, useRef } from "react";

export default function RotatingCube() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, hovering: false });
  const velRef = useRef({ x: 0.004, y: 0.003 });
  const baseSpeedRef = useRef(0.006);
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let rotationX = 0;
    let rotationY = 0;

    const isSmall = window.innerWidth < 768;
    const rawDPR = window.devicePixelRatio || 1;
    const DPR = Math.min(rawDPR, isSmall ? 1.2 : rawDPR);

    const setupCanvas = () => {
      const displaySize = Math.min(window.innerWidth * 0.85, 900);
      const internal = Math.round(displaySize * DPR);

      canvas.width = internal;
      canvas.height = internal;
      canvas.style.width = `${displaySize}px`;
      canvas.style.height = `${displaySize}px`;
    };

    setupCanvas();

    const width = () => canvas.width;
    const height = () => canvas.height;

    const center = () => ({
      x: width() / 2,
      y: height() / 2,
    });

    const vertices = [
      // outer
      [-1, -1, -1],[1, -1, -1],[1, 1, -1],[-1, 1, -1],
      [-1, -1, 1],[1, -1, 1],[1, 1, 1],[-1, 1, 1],
      // mid
      [-0.75,-0.75,-0.75],[0.75,-0.75,-0.75],[0.75,0.75,-0.75],[-0.75,0.75,-0.75],
      [-0.75,-0.75,0.75],[0.75,-0.75,0.75],[0.75,0.75,0.75],[-0.75,0.75,0.75],
      // inner
      [-0.5,-0.5,-0.5],[0.5,-0.5,-0.5],[0.5,0.5,-0.5],[-0.5,0.5,-0.5],
      [-0.5,-0.5,0.5],[0.5,-0.5,0.5],[0.5,0.5,0.5],[-0.5,0.5,0.5],
      // core
      [0,0,0]
    ];

    const edges = [];
    for (let i = 0; i < vertices.length - 1; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        edges.push([i, j]);
      }
    }

    const rotateX = ([x, y, z], a) => {
      const c = Math.cos(a), s = Math.sin(a);
      return [x, y * c - z * s, y * s + z * c];
    };

    const rotateY = ([x, y, z], a) => {
      const c = Math.cos(a), s = Math.sin(a);
      return [x * c + z * s, y, -x * s + z * c];
    };

    const project = ([x, y, z]) => {
      const scale = (width() * 0.55) / (z + 4);
      const { x: cx, y: cy } = center();
      return [cx + x * scale, cy + y * scale, z];
    };

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) baseSpeedRef.current = 0.002;

    const targetFPS = isSmall ? 40 : 60;
    const minFrame = 1000 / targetFPS;
    let last = performance.now();

    const io = new IntersectionObserver(
      ([e]) => (runningRef.current = e.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(canvas);

    const animate = (now) => {
      animationId = requestAnimationFrame(animate);
      if (!runningRef.current) return;

      const dt = now - last;
      if (dt < minFrame) return;
      last = now;

      ctx.clearRect(0, 0, width(), height());

      rotationX += velRef.current.x;
      rotationY += velRef.current.y;

      if (mouseRef.current.hovering) {
        const dx = Math.max(-1, Math.min(1, mouseRef.current.x));
        const dy = Math.max(-1, Math.min(1, mouseRef.current.y));
        const len = Math.hypot(dx, dy) || 1;

        const tx = (dx / len) * baseSpeedRef.current;
        const ty = (dy / len) * baseSpeedRef.current;

        velRef.current.x += (tx - velRef.current.x) * 0.06;
        velRef.current.y += (ty - velRef.current.y) * 0.06;
      }

      const projected = vertices.map(v =>
        project(rotateY(rotateX(v, rotationX), rotationY))
      );

      edges.forEach(([a, b]) => {
        const p1 = projected[a];
        const p2 = projected[b];
        const depth = (p1[2] + p2[2]) * 0.5;
        const alpha = Math.min(0.9, Math.max(0.08, 0.5 + depth / 8));

        ctx.strokeStyle = `rgba(93,165,254,${alpha})`;
        ctx.lineWidth = DPR < 1.5 ? 1 : 1.5;
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
      });
    };

    animationId = requestAnimationFrame(animate);

    const onMove = e => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      mouseRef.current.y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseenter", () => (mouseRef.current.hovering = true));
    canvas.addEventListener("mouseleave", () => (mouseRef.current.hovering = false));
    window.addEventListener("resize", setupCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      io.disconnect();
      window.removeEventListener("resize", setupCanvas);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}
