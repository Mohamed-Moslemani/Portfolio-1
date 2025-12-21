import { useEffect, useRef } from 'react';

export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);
  const {
    threshold = 0.3,
    rootMargin = '0px',
  } = options;

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return ref;
};
