import { useEffect } from "react";
import "../styles/custom-cursor.css";

export default function CustomCursor() {
  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = document.createElement("div");
    const border = document.createElement("div");

    cursor.className = "custom-cursor";
    border.className = "custom-cursor-border";

    document.body.appendChild(cursor);
    document.body.appendChild(border);

    let x = 0;
    let y = 0;
    let raf = null;

    const render = () => {
    cursor.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
    border.style.transform = `translate3d(${x - 15}px, ${y - 15}px, 0)`;
  };


    const move = (e) => {
      x = e.clientX;
      y = e.clientY;

      if (!raf) {
        raf = requestAnimationFrame(render);
      }
    };

    const onHover = (e) => {
      const isInteractive = e.target.closest(
        "a, button, .interactive"
      );

      cursor.classList.toggle("active", !!isInteractive);
      border.classList.toggle("active", !!isInteractive);
    };

    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", onHover);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onHover);
      cursor.remove();
      border.remove();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
