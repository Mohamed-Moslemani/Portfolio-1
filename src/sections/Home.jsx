import Section from "../components/Section";
import { useTyping } from "../hooks/useTyping";
import { stack } from "../data/work";
import headshot from "../assets/headshot.png";

/* Module scope, not an inline literal: a fresh array on every render would
   re-fire the typing effect's cleanup each pass. */
const PHRASES = [
  "AI systems that deliver results",
  "production-ready ML pipelines",
  "intelligent solutions that scale",
];

const SIGNALS = [
  { value: "3+", label: "Years in AI & ML" },
  { value: "10+", label: "Projects delivered" },
  { value: "3+", label: "Enterprise clients" },
  { value: "4", label: "Industries served" },
  { value: "Strategy&", label: "PwC network", wide: true },
];

export default function Home() {
  const typedText = useTyping(PHRASES, 80, 1500);

  return (
    <Section>
      <div className="home" role="region" aria-label="Home section">
        <div className="home-content">
          <div className="home-text">
            <p className="home-greeting label">Hi, I'm Mohamed</p>

            {/* Every phrase is rendered as a hidden ghost stacked in the same
                grid cell, so the heading box is always as tall as the tallest
                one. The line count can't change mid-animation, which is what
                used to shove the photo and everything below it around. */}
            <h1 className="home-title">
              {PHRASES.map((phrase) => (
                <span className="title-ghost" key={phrase} aria-hidden="true">
                  I build {phrase}
                </span>
              ))}

              <span className="title-live" aria-hidden="true">
                I build <span className="typing">{typedText}</span>
              </span>

              {/* Stable accessible name. The animated copy is hidden from
                  assistive tech — an aria-live region on a per-character
                  typewriter announces every keystroke. */}
              <span className="sr-only">I build {PHRASES[0]}</span>
            </h1>

            <p className="home-subtitle">
              AI Consultant &amp; Engineer · Strategy&amp; (PwC) · MSc Computational
              Science
            </p>

            <div className="home-tags" role="list" aria-label="Core competencies">
              <span role="listitem">AI Strategy</span>
              <span role="listitem">End-to-End ML Systems</span>
              <span role="listitem">System Architecture</span>
              <span role="listitem">LLM Integration</span>
            </div>

            <div className="home-cta">
              <a
                href="https://calendly.com/moslemanomohamed"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                aria-label="Book a consultation"
              >
                Book a Consultation
              </a>
              <a
                href="#services"
                className="btn btn-secondary"
                aria-label="View my services"
              >
                View Services
              </a>
            </div>
          </div>

          <div className="home-headshot">
            <img
              src={headshot}
              alt="Mohamed Moslemani"
              className="headshot-img"
              width="380"
              height="380"
            />
            <span className="headshot-frame" aria-hidden="true" />
          </div>
        </div>

        {/* Stack rail — the previous hero named no technology at all. */}
        <div className="stack-rail" aria-label="Working stack">
          <span className="stack-rail-key label">stack</span>
          <ul className="stack-rail-list" role="list">
            {stack.map((item) => (
              <li key={item} className="stack-chip mono">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <dl className="signal-strip" aria-label="Key figures">
          {SIGNALS.map((s) => (
            <div
              className={`signal${s.wide ? " signal-wide" : ""}`}
              key={s.label}
            >
              <dt className="signal-label label">{s.label}</dt>
              <dd className="signal-value num">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
