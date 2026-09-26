import { education } from "../data/experience";
import { useReveal } from "../hooks/useReveal";

const chronological = [...education].reverse();

export default function Education() {
  const ref = useReveal();

  return (
    <section id="education" className="education" ref={ref} aria-labelledby="education-title">
      <div className="wrap">
        <div className="section-head eyebrow">
          <span>04 / Education &amp; research</span>
          <span>From physics fundamentals to AI research</span>
        </div>

        <div className="edu-intro">
          <h2 id="education-title" className="section-title" data-reveal>
            Foundations<span className="dot">.</span>
          </h2>
          <p data-reveal>
            Physics taught me to model a system before touching it. The AI diploma added the
            methods. The MSc turns both toward a question production keeps asking: what happens
            when the data changes?
          </p>
        </div>

        <ol className="edu-track">
          {chronological.map((e, i) => (
            <li key={e.degree} className="edu-step" data-reveal>
              <p className="edu-stage eyebrow">
                <span>{String(i + 1).padStart(2, "0")}</span> {e.role}
              </p>
              <p className="edu-date">{e.date}</p>
              <h3>
                {e.degree}
                {e.track && <span className="edu-track-name">{e.track}</span>}
              </h3>
              <p className="edu-school">
                {e.school}
                {e.status && <span className="edu-status eyebrow">{e.status}</span>}
              </p>
              {e.note && <p className="edu-note">{e.note}</p>}
              {e.highlights && (
                <ul className="dash-list edu-highlights">
                  {e.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
              {e.coursework && (
                <p className="edu-course">
                  <span className="eyebrow">Coursework</span>
                  {e.coursework.join(", ")}
                </p>
              )}
            </li>
          ))}
        </ol>

        <div className="research" data-reveal>
          <p className="eyebrow research-label">Research threads</p>
          <ul className="research-list">
            <li>
              <h3>Distribution shift</h3>
              <p>
                MSc research, AUB. How models behave when deployment data drifts from training
                data, a common cause of model degradation in production.
              </p>
            </li>
            <li>
              <h3>3D reconstruction with transformers</h3>
              <p>
                Voxel completion from partial or degraded inputs, compared against baseline 3D
                autoencoders.
              </p>
              <a href="#work-3d" className="case-link link-under">
                Read the case study →
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
