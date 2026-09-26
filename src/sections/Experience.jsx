import { experience } from "../data/experience";
import { useReveal } from "../hooks/useReveal";

function RoleBody({ item }) {
  const points = [...(item.highlights || []), ...(item.contributions || [])];
  return (
    <>
      <p className="role-summary">{item.summary}</p>
      {points.length > 0 && (
        <ul className="dash-list role-points">
          {points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      {item.stack && <p className="role-stack mono">{item.stack}</p>}
    </>
  );
}

export default function Experience() {
  const ref = useReveal();
  const [current, ...past] = experience;

  return (
    <section id="experience" className="experience" ref={ref} aria-labelledby="experience-title">
      <div className="wrap">
        <div className="section-head eyebrow">
          <span>01 / Experience</span>
          <span>Where I've made an impact</span>
        </div>
        <h2 id="experience-title" className="section-title" data-reveal>
          Career<span className="dot">.</span>
        </h2>
      </div>

      <article className="now block-red" data-reveal aria-labelledby="role-now">
        <div className="wrap now-grid">
          <div className="now-head">
            <p className="eyebrow">Now · {current.period}</p>
            <h3 id="role-now" className="now-company">
              {current.company}
            </h3>
            <p className="now-role">
              {current.role} · {current.org}
              <br />
              <span className="eyebrow">{current.location}</span>
            </p>
          </div>
          <div className="now-body">
            <RoleBody item={current} />
          </div>
        </div>
      </article>

      <div className="wrap">
        <ol className="timeline" aria-label="Previous roles">
          {past.map((item) => (
            <li key={item.company} className="timeline-row" data-reveal>
              <p className="timeline-date eyebrow">{item.period}</p>
              <div className="timeline-head">
                <h3>{item.company}</h3>
                <p>
                  {item.role}
                  {item.org ? ` · ${item.org}` : ""}
                </p>
                <p className="eyebrow timeline-loc">{item.location}</p>
              </div>
              <div className="timeline-body">
                <RoleBody item={item} />
                {item.caseStudy && (
                  <a href={`#${item.caseStudy}`} className="case-link link-under">
                    Read the case study →
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
        <p className="experience-note">
          Work described here is my own account. No client names or confidential details are
          shared, and nothing on this site is endorsed by current or former employers.
        </p>
      </div>
    </section>
  );
}
