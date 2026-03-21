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
      description: "Barça heart, German soul,the beautiful game never gets old.",
      color: "#2dd4bf"
    },
    {
      title: "Nature",
      icon: "🌿",
      description: "Nothing clears the mind like wide-open skies and quiet trails.",
      color: "#34d399"
    },
    {
      title: "Farming",
      icon: "🌾",
      description: "Hands in the dirt, sun on my back, the peace in growing things.",
      color: "#a78bfa"
    },
    {
      title: "Research",
      icon: "🔬",
      description: "Digging into papers and chasing questions no one's answered yet.",
      color: "#f472b6"
    },
    {
      title: "Tech",
      icon: "💻",
      description: "From tinkering with code to shipping real products,  I'm always building.",
      color: "#fbbf24"
    },
    {
      title: "Gym & Sports",
      icon: "🏋️",
      description: "A good cardio session fixes everything.",
      color: "#fb7185"
    },
    {
      title: "Music",
      icon: "🎵",

      description: "Radiohead for the depths, The Lumineers for the light.",
      color: "#c084fc"
    },
    {
      title: "Cosmos",
      icon: "🌌",
      description: "The universe is incomprehensibly vast, and that's the best part.",
      color: "#818cf8"
    },
    {
      title: "Gaming",
      icon: "🎮",
      description: "Fifa forever, Horizon Zero Dawn and Forbidden West.",
      color: "#fbbf24"
    },
    {
      title: "Love",
      icon: "❤️",
      description: "Connecting deeply with people and ideas.",
      color: "#f472b6"
    },
    
    {
      title: "Motorcycle Riding",
      icon: "🏍️",
      description: "The thrill of the open road and the freedom of two wheels.",
      color: "#fbbf24"
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
            The person behind the systems.
          </p>
        </div>

        <div className="about-narrative">
          <p className="narrative-text">
            I’m an <span className="text-accent">AI Consultant & Engineer</span> currently
            at Strategy& (PwC), where I help enterprises turn AI ambitions into
            production systems that actually work.
          </p>

          <p className="narrative-text">
            My approach is simple: <span className="text-accent">understand the problem deeply</span>,
            design the right architecture, build it end-to-end, and make sure it keeps running.
            No hype, no over-promising. Just systems that deliver.
          </p>

          <p className="narrative-text">
            I’ve built fraud detection systems for banks, computer vision pipelines
            processing live CCTV feeds, and LLM solutions that drove a 40% increase in sales.
            Whether you’re a startup exploring AI or an enterprise scaling it —
            <span className="text-accent">I can help</span>.
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
