import Section from "../components/Section";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { services, work } from "../data/work";

export default function Work() {
  const ref = useScrollAnimation();

  return (
    <Section>
      <div id="services" ref={ref} role="region" aria-label="Services section">
        <h2>Services</h2>
        <p className="services-subtitle">End-to-end AI consulting, from strategy to production and beyond.</p>

        <div className="services-grid" role="list">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card"
              style={{ '--item-index': index }}
              role="listitem"
              tabIndex={0}
              aria-label={`${service.title} service`}
            >
              <h3>{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <ul className="service-details">
                {service.focus.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div id="work" role="region" aria-label="Case studies section" className="case-studies-section">
        <h2>Case Studies</h2>
        <p className="services-subtitle">Real results from real engagements.</p>

        <div className="work-list" role="list">
          {work.map((item, index) => (
            <div
              key={index}
              className="work-item"
              style={{ '--item-index': index }}
              role="listitem"
              tabIndex={0}
              aria-label={`${item.title} case study`}
            >
              <div className="work-item-header">
                <h3>{item.title}</h3>
              </div>
              <p className="work-description">{item.description}</p>
              <div className="work-focus" role="list" aria-label="Key outcomes">
                {item.focus.map((point, i) => (
                  <span key={i} className="work-focus-tag">{point}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
