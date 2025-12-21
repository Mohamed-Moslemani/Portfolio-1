import { useEffect } from 'react';
import '../styles/custom-cursor.css';

export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.createElement('div');
    const cursorBorder = document.createElement('div');

    cursor.className = 'custom-cursor';
    cursorBorder.className = 'custom-cursor-border';

    document.body.appendChild(cursor);
    document.body.appendChild(cursorBorder);

    const moveCursor = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';

      cursorBorder.style.left = e.clientX + 'px';
      cursorBorder.style.top = e.clientY + 'px';
    };

    const hoverElements = () => {
      const interactive = document.querySelectorAll('a, button, .interactive');
      
      interactive.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('active');
          cursorBorder.classList.add('active');
        });

        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('active');
          cursorBorder.classList.remove('active');
        });
      });
    };

    document.addEventListener('mousemove', moveCursor);
    hoverElements();

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      cursor.remove();
      cursorBorder.remove();
    };
  }, []);

  return null;
}
