import { useEffect, useRef } from 'react';

export function useScrollHide(threshold = 10) {
  const [isVisible, setIsVisible] = useRef(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);

      if (scrollDelta < threshold) return;

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible.current = false;
      } else {
        setIsVisible.current = true;
      }

      lastScrollY.current = currentScrollY;
      window.dispatchEvent(new CustomEvent('scroll-hide-change', { detail: { isVisible: setIsVisible.current } }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isVisible;
}
