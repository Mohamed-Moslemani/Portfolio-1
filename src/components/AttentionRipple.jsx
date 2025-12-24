import { useEffect } from 'react';

export default function AttentionRipple({ parentRef }) {
  useEffect(() => {
    if (!parentRef?.current) return;
    const parent = parentRef.current;

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      parent.classList.add('reduced-motion');
      return;
    }

    const handleMove = (e) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      parent.style.setProperty('--r-x', `${x}px`);
      parent.style.setProperty('--r-y', `${y}px`);
      parent.style.setProperty('--r-opacity', '1');
    };

    const handleLeave = () => {
      parent.style.setProperty('--r-opacity', '0');
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('scroll', handleLeave, { passive: true });
    parent.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('scroll', handleLeave);
      parent.removeEventListener('mouseleave', handleLeave);
    };
  }, [parentRef]);

  return null;
}
