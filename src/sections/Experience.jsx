import Section from "../components/Section";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import LazyImage from "../components/LazyImage";
import { experience } from "../data/experience";

export default function Experience() {
  const ref = useScrollAnimation();

  return (
    <Section>
      <div id="experience" ref={ref} role="region" aria-label="Professional experience section">
        <div className="experience-header-section">
          <h2>Experience</h2>
          <p className="experience-subtitle">Where I've made an impact</p>
        </div>

        <div className="experience-timeline" role="list">
          {experience.map((item, index) => (
            <div key={index} className="experience-card" style={{ '--card-index': index }} role="listitem">
              <div className="experience-timeline-dot"></div>
              
              <div className="experience-card-inner">
                <div className="experience-top">
                  <div className="experience-logo">
                    <LazyImage
                      src={item.logo}
                      alt={item.company}
                      className="experience-logo-img"
                    />
                  </div>
                  <div className="experience-meta">
                    <span className="experience-period">{item.period}</span>
                    <span className="experience-location">📍 {item.location}</span>
                  </div>
                </div>

                <div className="experience-content">
                  <div className="experience-title-group">
                    <h3 className="experience-company">{item.company}</h3>
                    {item.org && <span className="experience-org">{item.org}</span>}
                  </div>
                  
                  <p className="experience-role">{item.role}</p>
                  <p className="experience-summary">{item.summary}</p>

                  {item.highlights && (
                    <ul className="experience-highlights">
                      {item.highlights.map((h, i) => (
                        <li key={i}>
                          <span className="highlight-dot"></span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
