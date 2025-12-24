import { useEffect, useState } from "react";

export function useTyping(words, speed = 100, pause = 1200) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState("typing"); 
  // phases: typing | pausing | deleting

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout;

    if (phase === "typing") {
      timeout = setTimeout(() => {
        const nextChar = currentWord.slice(0, charIndex + 1);
        setText(nextChar);
        setCharIndex(charIndex + 1);

        if (charIndex + 1 === currentWord.length) {
          setPhase("pausing");
        } 
      }, speed);
    }

    if (phase === "pausing") {
      timeout = setTimeout(() => {
        setPhase("deleting");
      }, pause);
    }

    if (phase === "deleting") {
      timeout = setTimeout(() => {
        const nextChar = currentWord.slice(0, charIndex - 1);
        setText(nextChar);
        setCharIndex(charIndex - 1);

        if (charIndex - 1 === 0) {
          setPhase("typing");
          setWordIndex((wordIndex + 1) % words.length);
        }
      }, speed / 2);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, phase, wordIndex, words, speed, pause]);

  return text;
}
