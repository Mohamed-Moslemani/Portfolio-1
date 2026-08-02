import Section from "../components/Section";
import PipelineDiagram from "../components/PipelineDiagram";
import MetricReadout from "../components/MetricReadout";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { services, work } from "../data/work";

export default function Work() {
  const ref = useScrollAnimation();

  return (
    <Section>
      <div id="services" ref={ref} role="region" aria-label="Services section">
        <header className="section-head">
          <span className="label">01 — Services</span>
          <h2>Services</h2>
          <p className="section-sub">
            End-to-end AI consulting, from strategy to production and beyond.
          </p>
        </header>

        <div className="services-grid" role="list">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="service-card panel"
              style={{ "--item-index": index }}
              role="listitem"
              tabIndex={0}
              aria-label={`${service.title} service`}
            >
              <span className="card-index mono" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3>{service.title}</h3>
              <p className="service-description dim">{service.description}</p>

              <PipelineDiagram stages={service.pipeline} />

              <ul className="service-details">
                {service.focus.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              <ul className="chip-row" role="list" aria-label="Tooling">
                {service.stack.map((tool) => (
                  <li key={tool} className="chip mono">
                    {tool}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <div
        id="work"
        role="region"
        aria-label="Case studies section"
        className="case-studies-section"
      >
        <header className="section-head">
          <span className="label">02 — Selected work</span>
          <h2>Case Studies and Research</h2>
          <p className="section-sub">Real results from real engagements.</p>
        </header>

        <div className="work-list" role="list">
          {work.map((item, index) => (
            <article
              key={item.title}
              className="work-item panel"
              style={{ "--item-index": index }}
              role="listitem"
              tabIndex={0}
              aria-label={`${item.title} case study`}
            >
              <div className="work-item-header">
                <span className="work-domain label">{item.domain}</span>
                <h3>{item.title}</h3>
              </div>

              <p className="work-description dim">{item.description}</p>

              <MetricReadout metrics={item.metrics} />

              <ul className="work-focus" role="list" aria-label="Key outcomes">
                {item.focus.map((point) => (
                  <li key={point} className="work-focus-item">
                    {point}
                  </li>
                ))}
              </ul>

              <ul className="chip-row" role="list" aria-label="Stack">
                {item.stack.map((tool) => (
                  <li key={tool} className="chip mono">
                    {tool}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
