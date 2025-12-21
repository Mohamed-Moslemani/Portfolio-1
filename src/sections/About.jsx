import { useEffect, useRef, useState } from "react";
import Section from "../components/Section";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function About() {
  const scrollRef = useScrollAnimation();
  const [activeInterest, setActiveInterest] = useState(0);

  const interests = [
    {
      title: "Football",
      icon: "⚽",
      description: "On the pitch or watching the beautiful game.",
      color: "#60a5fa"
    },
    {
      title: "Nature",
      icon: "🌿",
      description: "Finding peace and clarity in forests, mountains, and open spaces.",
      color: "#34d399"
    },
    {
      title: "Farming",
      icon: "🌾",
      description: "Growing food and connecting with the earth.",
      color: "#a78bfa"
    },
    {
      title: "Research",
      icon: "🔬",
      description: "Deep diving into problems, exploring the unknown, pushing boundaries.",
      color: "#f472b6"
    },
    {
      title: "Tech",
      icon: "💻",
      description: "Building systems that solve real problems and scale impact.",
      color: "#fbbf24"
    },
    {
      title: "Gym & Sports",
      icon: "🏋️",
      description: "Discipline, growth, and the joy of physical challenge.",
      color: "#fb7185"
    },
    {
      title: "Music",
      icon: "🎵",
      description: "Where emotions are expressed and shared.",
      color: "#c084fc"
    },
    {
      title: "Love",
      icon: "❤️",
      description: "Where it will find you, if you let it.",
      color: "#f472b6"
    }
  ];

  return (
    <Section>
      <div id="about" ref={scrollRef} className="about" role="region" aria-label="About section">
        <div className="about-header">
          <h2>About Me</h2>
          <p className="about-intro">
            Beyond code and research, Who am I?
          </p>
        </div>

        <div className="about-narrative">
          <p className="narrative-text">
            I'm driven by <span className="text-accent">curiosity</span> and a desire to understand how things work, whether it's a machine learning algorithm, a football formation, or how crops grow in soil. I believe in <span className="text-accent">balance</span>: building intelligent systems by day, and finding peace in nature by evening.
          </p>

          <p className="narrative-text">
            <span className="text-accent">Peacefulness</span> is something I actively seek. Whether it's through music, time in nature, or the flow of problem-solving, I seek clarity in a complex world. And at my core, I'm a big believer in <span className="text-accent">love</span>—genuine human connection, kindness, and empathy are what make life meaningful.
          </p>
        </div>

        <div className="interests-container">
          <h3 className="interests-title">What I'm Passionate About</h3>
          
          <div className="interests-grid" role="list" aria-label="Personal interests">
            {interests.map((interest, index) => (
              <div
                key={index}
                className={`interest-card ${activeInterest === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveInterest(index)}
                onFocus={() => setActiveInterest(index)}
                tabIndex={0}
                role="listitem"
                aria-label={`${interest.title}: ${interest.description}`}
                style={{ '--card-color': interest.color }}
              >
                <div className="interest-icon">{interest.icon}</div>
                <h4 className="interest-title">{interest.title}</h4>
                <p className="interest-description">{interest.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-philosophy">
          <div className="philosophy-card">
            <h3>My Philosophy</h3>
            <p>
              Life is about finding harmony between ambition and peace, between pushing limits and accepting what is. I believe work should be meaningful, relationships should be genuine, and every day is an opportunity to learn and grow.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
