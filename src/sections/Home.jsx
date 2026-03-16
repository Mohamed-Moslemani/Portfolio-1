import Section from "../components/Section";
import { useTyping } from "../hooks/useTyping";
import headshot from "../assets/headshot.png";

export default function Home() {
  const typedText = useTyping(
    [
      "AI systems that deliver results",
      "production-ready ML pipelines",
      "intelligent solutions that scale",
    ],
    80,
    1500
  );

  return (
    <Section>
      <div className="home" role="region" aria-label="Home section">
        <div className="home-content">
          <div className="home-text">
            <p className="home-greeting">Hi, I'm Mohamed</p>
            <h1 className="home-title">
              I build{" "}
              <span className="typing gradient-text" aria-live="polite">{typedText}</span>
            </h1>

            <p className="home-subtitle">
              AI Consultant & Engineer · Strategy& (PwC) · MSc Computational Science
            </p>

            <div className="home-tags" role="list" aria-label="Core competencies">
              <span role="listitem">AI Strategy</span>
              <span role="listitem">End-to-End ML Systems</span>
              <span role="listitem">System Architecture</span>
              <span role="listitem">LLM Integration</span>
            </div>

            <div className="home-cta">
              <a href="https://calendly.com/moslemanomohamed" target="_blank" rel="noreferrer" className="btn btn-primary" aria-label="Book a consultation">Book a Consultation</a>
              <a href="#services" className="btn btn-secondary" aria-label="View my services">View Services</a>
            </div>
          </div>
          <div className="home-headshot" aria-label="Mohamed Moslemani" role="img">
            <img src={headshot} alt="Mohamed Moslemani" className="headshot-img" />
          </div>
        </div>

        <div className="trust-strip" role="region" aria-label="Key achievements">
          <div className="trust-item">
            <span className="trust-number">10+</span>
            <span className="trust-label">Projects Delivered</span>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <span className="trust-number">3+</span>
            <span className="trust-label">Enterprise Clients</span>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <span className="trust-number">4</span>
            <span className="trust-label">Industries Served</span>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <span className="trust-number">Strategy&</span>
            <span className="trust-label">PwC Network</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
