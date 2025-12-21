import { useEffect, useRef } from "react";

export default function NeuralNetworkMesh() {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const connectionDistance = Math.max(width, height) * 0.25;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initNodes = (count) => {
      nodesRef.current = new Array(count).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: 0,
        baseY: 0,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2.5 + 1.5,
        pulse: Math.random() * Math.PI * 2,
        activity: Math.random() * 0.5,
      }));

      // Store base positions for drift
      nodesRef.current.forEach((n) => {
        n.baseX = n.x;
        n.baseY = n.y;
      });
    };

    const distSq = (x1, y1, x2, y2) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      return dx * dx + dy * dy;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle radial gradient background
      const grd = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.2
      );
      grd.addColorStop(0, "rgba(59, 130, 246, 0.03)");
      grd.addColorStop(1, "rgba(30, 58, 138, 0.08)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      const connectionDistSq = connectionDistance * connectionDistance;

      // Update nodes
      nodesRef.current.forEach((node, i) => {
        if (!reduceMotion) {
          // Gentle drift
          node.x += node.vx * 0.1;
          node.y += node.vy * 0.1;

          // Wrap around
          if (node.x < -20) node.x = width + 20;
          if (node.x > width + 20) node.x = -20;
          if (node.y < -20) node.y = height + 20;
          if (node.y > height + 20) node.y = -20;

          // Gentle attraction to mouse
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const d = Math.hypot(dx, dy);
          if (d < 300 && d > 1) {
            node.vx += (dx / d) * 0.02;
            node.vy += (dy / d) * 0.02;
            node.activity = 0.8;
          }

          // Damping
          node.vx *= 0.98;
          node.vy *= 0.98;

          // Activity decay
          node.activity *= 0.95;
        }

        // Pulse animation
        if (!reduceMotion) {
          node.pulse += 0.03;
        }
      });

      // Draw connections
      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const n1 = nodesRef.current[i];
          const n2 = nodesRef.current[j];
          const d = distSq(n1.x, n1.y, n2.x, n2.y);

          if (d < connectionDistSq) {
            const dist = Math.sqrt(d);
            const opacity = Math.max(
              (1 - dist / connectionDistance) *
                (0.2 + (n1.activity + n2.activity) * 0.3),
              0
            );

            const gradient = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
            const color1 = `rgba(93, 165, 254, ${opacity})`;
            const color2 = `rgba(147, 197, 253, ${opacity * 0.6})`;
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1 + opacity * 1.5;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodesRef.current.forEach((node) => {
        // Glow effect for active nodes
        if (node.activity > 0.2) {
          const glowSize = node.r * 3 + node.activity * 4;
          const glowGrad = ctx.createRadialGradient(
            node.x,
            node.y,
            0,
            node.x,
            node.y,
            glowSize
          );
          glowGrad.addColorStop(0, `rgba(147, 197, 253, ${node.activity * 0.4})`);
          glowGrad.addColorStop(1, "rgba(147, 197, 253, 0)");
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
          ctx.fill();
        }

        // Pulse radius
        const pulseAmount = Math.sin(node.pulse) * 0.5 + 0.5;
        const r = node.r + pulseAmount * 0.8;

        // Node gradient
        const nodeGrad = ctx.createRadialGradient(
          node.x - node.r / 3,
          node.y - node.r / 3,
          0,
          node.x,
          node.y,
          r
        );
        nodeGrad.addColorStop(0, `rgba(219, 234, 254, ${0.9 + node.activity})`);
        nodeGrad.addColorStop(1, `rgba(93, 165, 254, ${0.7 + node.activity * 0.3})`);

        ctx.fillStyle = nodeGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Core bright spot
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + node.activity * 0.4})`;
        ctx.beginPath();
        ctx.arc(node.x - node.r / 4, node.y - node.r / 4, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!reduceMotion) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const onResize = () => {
      resize();
      initNodes(Math.floor((width * height) / 12000)); // density
      if (reduceMotion) animate();
    };

    const init = () => {
      resize();
      initNodes(Math.floor((width * height) / 12000));
      if (reduceMotion) {
        animate();
      } else {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX / dpr;
      mouseRef.current.y = e.clientY / dpr;
    };

    init();
    window.addEventListener("resize", onResize);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="neural-network-mesh"
      aria-hidden="true"
    />
  );
}
