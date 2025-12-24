import { useState } from "react";
import Section from "../components/Section";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function About() {
  const scrollRef = useScrollAnimation();
  const [activeInterest, setActiveInterest] = useState(0);

  const interests = [
    {
      title: "Football",
      icon: "⚽",
      description: "Teamwork, strategy, and endless unpredictability.",
      color: "#60a5fa"
    },
    {
      title: "Nature",
      icon: "🌿",
      description: "Grounding perspectives, fresh air, and wide-open spaces.",
      color: "#34d399"
    },
    {
      title: "Farming",
      icon: "🌾",
      description: "Patience, growth cycles, and love for the land.",
      color: "#a78bfa"
    },
    {
      title: "Research",
      icon: "🔬",
      description: "Curiosity-driven exploration and evidence-based insights.",
      color: "#f472b6"
    },
    {
      title: "Tech",
      icon: "💻",
      description: "Building systems that scale and adapt.",
      color: "#fbbf24"
    },
    {
      title: "Gym & Sports",
      icon: "🏋️",
      description: "Physical challenge fuels mental resilience.",
      color: "#fb7185"
    },
    {
      title: "Music",
      icon: "🎵",
      description: "Rhythm, emotion, and creative expression.",
      color: "#c084fc"
    },
    {
      title: "Love",
      icon: "❤️",
      description: "Connecting deeply with people and ideas.",
      color: "#f472b6"
    }
  ];

  return (
    <Section>
      <div
        id="about"
        ref={scrollRef}
        className="about"
        role="region"
        aria-label="About section"
      >
        <div className="about-header">
          <h2>About Me</h2>
          <p className="about-intro">
            Beyond work and titles.
          </p>
        </div>

        <div className="about-narrative">
          <p className="narrative-text">
            I’m driven by <span className="text-accent">curiosity</span> that never fills up.
            it's my puller into machine learning models, complex systems,
            and endless questions about how things work.
          </p>

          <p className="narrative-text">
            I care about <span className="text-accent">how things work</span> when they scale,
            when they fail, and when assumptions collapse.
            Comfort dulls me.
          </p>

          <p className="narrative-text">
            Balance matters alot to me.
            I alternate between building demanding systems
            and deliberately stepping away into nature, music, or physical strain.
          </p>
        </div>

        <div className="interests-container">
          <h3 className="interests-title">What I Care About</h3>

          <div
            className="interests-grid"
            role="list"
            aria-label="Personal interests"
          >
            {interests.map((interest, index) => (
              <div
                key={index}
                className={`interest-card ${
                  activeInterest === index ? "active" : ""
                }`}
                onMouseEnter={() => setActiveInterest(index)}
                onFocus={() => setActiveInterest(index)}
                tabIndex={0}
                role="listitem"
                aria-label={`${interest.title}: ${interest.description}`}
                style={{ "--card-color": interest.color }}
              >
                <div className="interest-icon">{interest.icon}</div>
                <h4 className="interest-title">{interest.title}</h4>
                <p className="interest-description">
                  {interest.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-philosophy">
          <div className="philosophy-card">
            <h3>Philosophy</h3>
            <p>
              I believe rigor beats hype.
              Depth beats speed.
              And meaningful work comes from thinking honestly,
              accepting constraints, and choosing hard paths on purpose.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
