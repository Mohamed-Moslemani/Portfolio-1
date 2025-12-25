import Section from "../components/Section";
import { useTyping } from "../hooks/useTyping";
import RotatingCube from "../components/RotatingCube";
import FloatingElements from "../components/FloatingElements";

export default function Home() {
  const typedText = useTyping(
    [
    "decision optimization systems",
    "end-to-end ML infrastructure",
    "large-scale AI architectures"
    ],
    80,
    1500
  );

  return (
    <Section>
      <FloatingElements />
      <div className="home" role="region" aria-label="Home section">
        <div className="home-content">
          <div className="home-text">
            <h1 className="home-title">
              I design{" "}
              <span className="typing gradient-text" aria-live="polite">{typedText}</span>
              <br />
            </h1>

            <p className="home-subtitle">
              Engineer · Data Scientist · Computational Science MSc
            </p>

            <div className="home-tags" role="list" aria-label="Core competencies">
              <span role="listitem">Agentic Systems</span>
              <span role="listitem">Applied ML</span>
              <span role="listitem">Systems Design</span>
              <span role="listitem">Research</span>
            </div>

            <div className="home-cta">
              <a href="#work" className="btn btn-primary" aria-label="View my work portfolio">View My Work</a>
              <a href="#contact" className="btn btn-secondary" aria-label="Get in touch with me">Get In Touch</a>
            </div>
          </div>
          <div className="home-cube" aria-label="Interactive 3D cube visualization" role="img">
            <RotatingCube />
          </div>
        </div>
      </div>
    </Section>
  );
}
