import { useLazyLoad } from '../hooks/useLazyLoad';
import '../styles/lazy-image.css';

export default function LazyImage({ src, alt, className = '', ...props }) {
  const { ref, isVisible } = useLazyLoad();

  return (
    <div ref={ref} className={`lazy-image-container ${className}`}>
      {isVisible ? (
        <img
          src={src}
          alt={alt}
          className="lazy-image loaded"
          loading="lazy"
          {...props}
        />
      ) : (
        <div className="lazy-image-placeholder">
          <div className="lazy-image-spinner"></div>
        </div>
      )}
    </div>
  );
}
