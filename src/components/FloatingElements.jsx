import { useEffect, useRef } from 'react';
import '../styles/floating-elements.css';

export default function FloatingElements() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createFloatingElement = () => {
      const element = document.createElement('div');
      element.className = 'floating-element';
      element.style.left = Math.random() * 100 + '%';
      element.style.animationDuration = (Math.random() * 3 + 4) + 's';
      element.style.animationDelay = Math.random() * 2 + 's';
      element.style.opacity = Math.random() * 0.5 + 0.3;
      
      container.appendChild(element);

      setTimeout(() => {
        element.remove();
      }, 8000);
    };

    const interval = setInterval(createFloatingElement, 500);

    return () => clearInterval(interval);
  }, []);

  return <div ref={containerRef} className="floating-elements-container" />;
}
