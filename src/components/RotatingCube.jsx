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

    // AI Neural Network - Icosahedron-based structure with connected nodes
    const phi = (1 + Math.sqrt(5)) / 2;
    const vertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
      // Additional nodes for neural network effect
      [0, 0, 0], // center
      [0.5, 0.5, 0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5],
      [0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5],
    ];

    // Normalize and scale vertices
    const normalizeVertices = (verts) => {
      return verts.map(v => {
        const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
        const scale = len > 1.5 ? 1 / len : 1;
        return [v[0]*scale, v[1]*scale, v[2]*scale];
      });
    };

    const normalizedVertices = normalizeVertices(vertices);

    // Create edges connecting nearby nodes
    const edges = [];
    for (let i = 0; i < normalizedVertices.length; i++) {
      for (let j = i + 1; j < normalizedVertices.length; j++) {
        const v1 = normalizedVertices[i];
        const v2 = normalizedVertices[j];
        const dist = Math.sqrt(
          (v1[0]-v2[0])**2 + (v1[1]-v2[1])**2 + (v1[2]-v2[2])**2
        );
        // Connect nodes that are close to each other
        if (dist < 1.8 && dist > 0.01) {
          edges.push([i, j, dist]);
        }
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

    const rotateZ = ([x, y, z], a) => {
      const c = Math.cos(a), s = Math.sin(a);
      return [x * c - y * s, x * s + y * c, z];
    };

    const project = ([x, y, z]) => {
      const scale = (width() * 0.55) / (z + 3.5);
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
      const rotationZ = rotationY * 0.3; // Add Z rotation for more dynamic movement

      if (mouseRef.current.hovering) {
        const dx = Math.max(-1, Math.min(1, mouseRef.current.x));
        const dy = Math.max(-1, Math.min(1, mouseRef.current.y));
        const len = Math.hypot(dx, dy) || 1;

        const tx = (dx / len) * baseSpeedRef.current;
        const ty = (dy / len) * baseSpeedRef.current;

        velRef.current.x += (tx - velRef.current.x) * 0.06;
        velRef.current.y += (ty - velRef.current.y) * 0.06;
      }

      const projected = normalizedVertices.map(v =>
        project(rotateZ(rotateY(rotateX(v, rotationX), rotationY), rotationZ))
      );

      // Draw edges first (background)
      edges.forEach(([a, b, distance]) => {
        const p1 = projected[a];
        const p2 = projected[b];
        const depth = (p1[2] + p2[2]) * 0.5;
        const alpha = Math.min(0.7, Math.max(0.1, 0.4 + depth / 6));
        const distanceFactor = 1 - (distance / 1.8);
        const glow = distanceFactor * 0.3;

        ctx.strokeStyle = `rgba(93,165,254,${alpha})`;
        ctx.lineWidth = DPR < 1.5 ? 0.8 : 1.2;
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();

        // Add subtle glow
        if (glow > 0.1) {
          ctx.strokeStyle = `rgba(147,197,253,${glow * alpha})`;
          ctx.lineWidth = DPR < 1.5 ? 3 : 4;
          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.stroke();
        }
      });

      // Draw nodes (vertices) on top
      projected.forEach((p, idx) => {
        const depth = p[2];
        const nodeSize = DPR < 1.5 ? 2 : 2.5;
        const alpha = Math.min(1, Math.max(0.4, 0.6 + depth / 6));

        // Outer glow
        ctx.fillStyle = `rgba(93,165,254,${alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(p[0], p[1], nodeSize * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Core node
        ctx.fillStyle = `rgba(147,197,253,${alpha})`;
        ctx.beginPath();
        ctx.arc(p[0], p[1], nodeSize, 0, Math.PI * 2);
        ctx.fill();

        // Bright center
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(p[0], p[1], nodeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
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
