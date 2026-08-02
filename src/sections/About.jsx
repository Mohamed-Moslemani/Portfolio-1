import { useState } from "react";
import Section from "../components/Section";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

/* Emoji icons were the loudest "personal blog" tell on the page. The copy is
   unchanged; each card is now indexed in mono instead. */
const interests = [
  { title: "Football", description: "Simply put, I love the beautiful game." },
  { title: "Farming", description: "I enjoy seeing things grow." },
  { title: "Anime", description: "My favorite genre." },
  {
    title: "Research",
    description: "I am a person that likes to think, research gives that to me.",
  },
  {
    title: "Gym & Sports",
    description: "Currently working on building strength and endurance.",
  },
  { title: "Music", description: "My favorite remains the Lumineers." },
  { title: "Cosmos", description: "The universe reminds me of how small I am." },
  { title: "Love", description: "It's the only thing that I take seriously in life." },
  {
    title: "Motorcycle Riding",
    description: "It's my way to let go and be free.",
  },
];

export default function About() {
  const scrollRef = useScrollAnimation();
  const [activeInterest, setActiveInterest] = useState(0);

  return (
    <Section>
      <div
        id="about"
        ref={scrollRef}
        className="about"
        role="region"
        aria-label="About section"
      >
        <header className="section-head">
          <span className="label">05 — About</span>
          <h2>About Me</h2>
          <p className="section-sub">The person behind the systems.</p>
        </header>

        <p className="about-name-note dim">
          Also spelled Mohamad Meselmani, Mohammad Meselmany, or Mohammad Meslmany,
          different transliterations, same person.
        </p>

        <div className="about-narrative">
          <p className="narrative-text">
            I’m an <span className="text-accent">AI Consultant &amp; Engineer</span>{" "}
            currently at Strategy&amp; (PwC), where I help enterprises turn AI
            ambitions into production systems that actually work.
          </p>

          <p className="narrative-text">
            My approach is simple:{" "}
            <span className="text-accent">understand the problem deeply</span>, design
            the right architecture, build it end-to-end, and make sure it keeps
            running. No hype, no over-promising. Just systems that deliver.
          </p>

          <p className="narrative-text">
            I’ve built fraud detection systems for banks, computer vision pipelines
            processing live CCTV feeds, and LLM solutions that drove a 40% increase in
            sales. Whether you’re a startup exploring AI or an enterprise scaling it —
            <span className="text-accent"> I can help</span>.
          </p>
        </div>

        <div className="interests-container">
          <h3 className="interests-title">What I Care About</h3>

          <div className="interests-grid" role="list" aria-label="Personal interests">
            {interests.map((interest, index) => (
              <div
                key={interest.title}
                className={`interest-card${
                  activeInterest === index ? " active" : ""
                }`}
                onMouseEnter={() => setActiveInterest(index)}
                onFocus={() => setActiveInterest(index)}
                tabIndex={0}
                role="listitem"
                aria-label={`${interest.title}: ${interest.description}`}
              >
                <span className="interest-index mono" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h4 className="interest-title">{interest.title}</h4>
                <p className="interest-description dim">{interest.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-philosophy">
          <div className="philosophy-card">
            <span className="label">Philosophy</span>
            <p>
              I believe rigor beats hype. Depth beats speed. And meaningful work comes
              from thinking honestly, accepting constraints, and choosing hard paths on
              purpose.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
