import headshot from "../assets/headshot.png";
import { useReveal } from "../hooks/useReveal";

/* Personal interests: copy unchanged from the previous site. */
const interests = [
  { title: "Football", description: "Simply put, I love the beautiful game." },
  { title: "Farming", description: "I enjoy seeing things grow." },
  { title: "Anime", description: "My favorite genre." },
  { title: "Research", description: "I am a person that likes to think, research gives that to me." },
  { title: "Gym & Sports", description: "Currently working on building strength and endurance." },
  { title: "Music", description: "My favorite remains the Lumineers." },
  { title: "Cosmos", description: "The universe reminds me of how small I am." },
  { title: "Love", description: "It's the only thing that I take seriously in life." },
  { title: "Motorcycle Riding", description: "It's my way to let go and be free." },
];

export default function About() {
  const ref = useReveal();

  return (
    <section id="about" className="about" ref={ref} aria-labelledby="about-title">
      <div className="wrap">
        <div className="section-head eyebrow">
          <span>05 / About</span>
          <span>The person behind the systems</span>
        </div>

        <div className="about-grid">
          <div className="about-left">
            <h2 id="about-title" className="section-title" data-reveal>
              Physics
              <br />
              first. Then
              <br />
              systems<span className="dot">.</span>
            </h2>
            <figure className="about-portrait" data-reveal>
              <span className="about-portrait-frame">
              <img
                src={headshot}
                alt="Portrait of Mohamed Moslemani"
                width="380"
                height="380"
                loading="lazy"
                decoding="async"
              />
              </span>
              <figcaption className="eyebrow">Mohamed Moslemani · Beirut</figcaption>
            </figure>
          </div>

          <div className="about-copy" data-reveal>
            <p>
              I studied physics at Beirut Arab University and finished as the department's top
              student. Physics trains one habit above all: reduce a system to what actually
              governs it, and write down the assumptions before trusting a result.
            </p>
            <p>
              That habit carried into computational science at AUB, where my graduate research
              looks at distribution shift, models meeting data that no longer resembles what
              they were trained on. It is the problem production systems face every day,
              stated formally.
            </p>
            <p>
              In industry I have built computer vision and LLM systems for a storage and logistics
              company, an agentic system and fraud detection model for a banking client, and, at Strategy&amp;,
              where I am Data Tech Lead, forecasting models, agentic automation, and production
              data pipelines. The domain changes. The
              method doesn't: define the failure modes, measure honestly, and ship the smallest
              system that holds up.
            </p>
          </div>
        </div>

        <blockquote className="philosophy" data-reveal>
          <p>
            I believe rigor beats hype. Depth beats speed. And meaningful work comes from thinking
            honestly, accepting constraints, and choosing hard paths on purpose.
          </p>
          <footer className="eyebrow">Philosophy</footer>
        </blockquote>

        <div className="interests" data-reveal>
          <h3 className="eyebrow">Outside work</h3>
          <ul>
            {interests.map((it, i) => (
              <li key={it.title}>
                <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                <strong>{it.title}</strong>
                <span>{it.description}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="about-name-note">
          Also spelled Mohamad Meselmani, Mohammad Meselmany, or Mohammad Meslmany: different
          transliterations, same person.
        </p>
      </div>
    </section>
  );
}
