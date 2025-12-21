import { useState, useEffect, useRef } from 'react';

const AMBIENT_SOUND_KEY = 'ambient-sound-enabled';

export function useAmbientSound() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(AMBIENT_SOUND_KEY) === 'true';
    setIsEnabled(saved);
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio('/ambient-loop.mp3');
      audio.loop = true;
      audio.volume = 0.2;
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    if (isEnabled && !isPlaying) {
      audio.play().catch(() => {
        // Autoplay blocked, user will click toggle
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else if (!isEnabled && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [isEnabled, isPlaying]);

  const toggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem(AMBIENT_SOUND_KEY, newState);
  };

  return { isEnabled, toggle };
}
