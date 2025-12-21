import { useState, useEffect } from "react";
import "../styles/loading-animation.css";

export default function LoadingAnimation() {
  const [isLoading, setIsLoading] = useState(true);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    // Minimum loading time for smooth animation
    const minLoadTime = 1500;
    const startTime = Date.now();

    const handleLoad = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      setTimeout(() => {
        setIsHiding(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 600); // Match the fade-out animation duration
      }, remainingTime);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`loading-screen ${isHiding ? 'hiding' : ''}`}>
      <div className="loading-content">
        <div className="loading-logo">
          <span className="loading-m loading-m-1">M</span>
          <span className="loading-m loading-m-2">M</span>
          <span className="loading-slash">/</span>
        </div>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
        <p className="loading-text">Loading Portfolio...</p>
      </div>
      <div className="loading-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="loading-particle"
            style={{
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
              '--delay': `${Math.random() * 2}s`,
              '--duration': `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
