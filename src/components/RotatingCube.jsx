import { useEffect, useRef } from 'react';

export default function RotatingCube() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, hovering: false });
  const velRef = useRef({ x: 0.004, y: 0.003 });
  const baseSpeedRef = useRef(0.006);
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let rotationX = 0;
    let rotationY = 0;

    // Adaptive sizing / DPR for performance
    const isSmall = window.innerWidth < 768;
    const rawDPR = window.devicePixelRatio || 1;
    const DPR = Math.min(rawDPR, isSmall ? 1.2 : Math.max(1, rawDPR));
    const DISPLAY_SIZE = Math.min(window.innerWidth * 0.85, 900);
    const INTERNAL = Math.round(DISPLAY_SIZE * DPR);
    canvas.width = INTERNAL;
    canvas.height = INTERNAL;
    canvas.style.width = `${DISPLAY_SIZE}px`;
    canvas.style.height = `${DISPLAY_SIZE}px`;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // 3D cube vertices with multiple nested layers and more complexity
    const vertices = [
      // Outer cube
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
      // Mid-outer cube (0.75)
      [-0.75, -0.75, -0.75],
      [0.75, -0.75, -0.75],
      [0.75, 0.75, -0.75],
      [-0.75, 0.75, -0.75],
      [-0.75, -0.75, 0.75],
      [0.75, -0.75, 0.75],
      [0.75, 0.75, 0.75],
      [-0.75, 0.75, 0.75],
      // Mid cube (0.5)
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
      [0.5, 0.5, -0.5],
      [-0.5, 0.5, -0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5],
      [-0.5, 0.5, 0.5],
      // Inner cube (0.25)
      [-0.25, -0.25, -0.25],
      [0.25, -0.25, -0.25],
      [0.25, 0.25, -0.25],
      [-0.25, 0.25, -0.25],
      [-0.25, -0.25, 0.25],
      [0.25, -0.25, 0.25],
      [0.25, 0.25, 0.25],
      [-0.25, 0.25, 0.25],
      // Center octahedron points
      [0, 0, 0],
      [1.2, 0, 0],
      [-1.2, 0, 0],
      [0, 1.2, 0],
      [0, -1.2, 0],
      [0, 0, 1.2],
      [0, 0, -1.2],
      // Face centers (additional structure)
      [0, 0, -1],
      [0, 0, 1],
      [-1, 0, 0],
      [1, 0, 0],
      [0, -1, 0],
      [0, 1, 0],
    ];

    // Extended edges with many more connections for geometric complexity
    const edges = [
      // Outer cube back face
      [0, 1], [1, 2], [2, 3], [3, 0],
      // Outer cube front face
      [4, 5], [5, 6], [6, 7], [7, 4],
      // Outer cube connecting edges
      [0, 4], [1, 5], [2, 6], [3, 7],
      // Outer cube diagonals
      [0, 2], [1, 3], [4, 6], [5, 7],
      [0, 5], [1, 4], [2, 7], [3, 6],
      
      // Mid-outer cube back face
      [8, 9], [9, 10], [10, 11], [11, 8],
      // Mid-outer cube front face
      [12, 13], [13, 14], [14, 15], [15, 12],
      // Mid-outer cube connecting edges
      [8, 12], [9, 13], [10, 14], [11, 15],
      // Mid-outer cube diagonals
      [8, 10], [9, 11], [12, 14], [13, 15],
      
      // Mid cube back face
      [16, 17], [17, 18], [18, 19], [19, 16],
      // Mid cube front face
      [20, 21], [21, 22], [22, 23], [23, 20],
      // Mid cube connecting edges
      [16, 20], [17, 21], [18, 22], [19, 23],
      // Mid cube diagonals
      [16, 18], [17, 19], [20, 22], [21, 23],
      
      // Inner cube back face
      [24, 25], [25, 26], [26, 27], [27, 24],
      // Inner cube front face
      [28, 29], [29, 30], [30, 31], [31, 28],
      // Inner cube connecting edges
      [24, 28], [25, 29], [26, 30], [27, 31],
      // Inner cube diagonals
      [24, 26], [25, 27], [28, 30], [29, 31],
      
      // Connections between cube layers
      [0, 8], [1, 9], [2, 10], [3, 11],
      [4, 12], [5, 13], [6, 14], [7, 15],
      [8, 16], [9, 17], [10, 18], [11, 19],
      [12, 20], [13, 21], [14, 22], [15, 23],
      [16, 24], [17, 25], [18, 26], [19, 27],
      [20, 28], [21, 29], [22, 30], [23, 31],
      
      // Octahedron connections (center)
      [32, 33], [32, 34], [32, 35], [32, 36], [32, 37], [32, 38],
      [33, 35], [33, 36], [34, 35], [34, 36],
      [37, 35], [37, 36], [38, 35], [38, 36],
      
      // Face center connections (radial)
      [39, 0], [39, 1], [39, 2], [39, 3],
      [39, 8], [39, 16], [39, 24],
      [40, 4], [40, 5], [40, 6], [40, 7],
      [40, 12], [40, 20], [40, 28],
      [41, 0], [41, 3], [41, 4], [41, 7],
      [42, 1], [42, 2], [42, 5], [42, 6],
      [43, 0], [43, 1], [43, 4], [43, 5],
      [44, 2], [44, 3], [44, 6], [44, 7],
      
      // Cross-layer diagonals for extra complexity
      [0, 18], [1, 19], [2, 20], [3, 21],
      [4, 26], [5, 27], [6, 28], [7, 29],
      [8, 22], [9, 23], [10, 24], [11, 25],
    ];

    const rotateX = (point, angle) => {
      const [x, y, z] = point;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [x, y * cos - z * sin, y * sin + z * cos];
    };

    const rotateY = (point, angle) => {
      const [x, y, z] = point;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [x * cos + z * sin, y, -x * sin + z * cos];
    };

    const project = (point) => {
      const scale = (width * 0.55) / (point[2] + 4);
      return [
        centerX + point[0] * scale,
        centerY + point[1] * scale,
        point[2],
        scale,
      ];
    };

    const drawNetwork = (projectedVertices) => {
      // Network visualization removed
    };


    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      baseSpeedRef.current = 0.002;
      // reduce visual complexity when user requests reduced motion
    }

    // Frame capping for smoother perceived performance
    const targetFPS = isSmall ? 40 : 60;
    const minFrameTime = 1000 / targetFPS;
    let lastFrameTime = performance.now();

    // Pause animation when canvas is not visible (saves CPU)
    runningRef.current = true;
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      runningRef.current = e.isIntersecting;
    }, { threshold: 0.1 });
    io.observe(canvas);

    const animate = (now) => {
      animationId = requestAnimationFrame(animate);
      if (!runningRef.current) return; // skip rendering when offscreen
      const dt = now - lastFrameTime;
      if (dt < minFrameTime) return; // throttle
      lastFrameTime = now;

      ctx.clearRect(0, 0, width, height);

      // Always rotate with current velocity
      rotationX += velRef.current.x;
      rotationY += velRef.current.y;

      // If hovering, gently steer velocity toward mouse-driven direction while keeping speed
      if (mouseRef.current.hovering) {
        const dirX = mouseRef.current.x;
        const dirY = mouseRef.current.y;
        const len = Math.hypot(dirX, dirY) || 1;
        const nx = dirX / len;
        const ny = dirY / len;
        const targetX = nx * baseSpeedRef.current;
        const targetY = ny * baseSpeedRef.current;
        // Lerp velocity toward target for smooth influence
        velRef.current.x = velRef.current.x + (targetX - velRef.current.x) * 0.06;
        velRef.current.y = velRef.current.y + (targetY - velRef.current.y) * 0.06;
      } else {
        // When not hovering, slowly normalize velocity magnitude to base speed
        const vlen = Math.hypot(velRef.current.x, velRef.current.y) || 1;
        const vx = velRef.current.x / vlen;
        const vy = velRef.current.y / vlen;
        const targetX = vx * baseSpeedRef.current;
        const targetY = vy * baseSpeedRef.current;
        velRef.current.x = velRef.current.x + (targetX - velRef.current.x) * 0.02;
        velRef.current.y = velRef.current.y + (targetY - velRef.current.y) * 0.02;
      }

      // Transform vertices
      let rotatedVertices = vertices.map((vertex) => {
        let point = [...vertex];
        point = rotateX(point, rotationX);
        point = rotateY(point, rotationY);
        return point;
      });

      // Project to 2D
      const projectedVertices = rotatedVertices.map(project);

      // Sort edges by depth (painters algorithm)
      const edgesWithDepth = edges.map((edge) => ({
        edge,
        depth: (projectedVertices[edge[0]][2] + projectedVertices[edge[1]][2]) / 2,
      }));

      edgesWithDepth.sort((a, b) => a.depth - b.depth);

      // Draw network
      drawNetwork(projectedVertices);

      // Draw edges
      edgesWithDepth.forEach(({ edge }) => {
        const [start, end] = edge;
        const p1 = projectedVertices[start];
        const p2 = projectedVertices[end];
        // avoid drawing very faint/hidden edges to reduce GPU work
        const alpha = 0.5 + ((p1[2] + p2[2]) / 8);
        if (alpha < 0.08) return;
        ctx.strokeStyle = `rgba(93, 165, 254, ${Math.min(alpha, 0.9)})`;
        ctx.lineWidth = DPR < 1.5 ? 1 : 1.5;
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
      });

      // Draw vertices (skip some on small screens)
      const vertexRadius = DPR < 1.5 ? 2 : 3;
      for (let i = 0; i < projectedVertices.length; i++) {
        const p = projectedVertices[i];
        const depthFactor = (p[2] + 1) / 2;
        const alpha = 0.4 + depthFactor * 0.6;
        if (alpha < 0.2 && isSmall) continue; // skip faint small points on mobile
        ctx.fillStyle = `rgba(147, 197, 253, ${Math.min(alpha, 0.95)})`;
        ctx.beginPath();
        ctx.arc(p[0], p[1], vertexRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // animationId is managed by outer requestAnimationFrame loop
    };

    animationId = requestAnimationFrame(animate);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // direction based on position relative to center, normalized to [-1,1]
      mouseRef.current.x = (e.clientX - cx) / (rect.width / 2);
      mouseRef.current.y = (e.clientY - cy) / (rect.height / 2);
    };

    const handleEnter = () => {
      mouseRef.current.hovering = true;
    };
    const handleLeave = () => {
      mouseRef.current.hovering = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleEnter);
    canvas.addEventListener('mouseleave', handleLeave);

    // Visibility change: pause animations when tab hidden
    const onVisibility = () => {
      runningRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleEnter);
      canvas.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={1100}
      height={1100}
      style={{
        display: 'block',
      }}
    />
  );
}
