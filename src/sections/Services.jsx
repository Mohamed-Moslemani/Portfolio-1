import { services, stack } from "../data/work";
import { useReveal } from "../hooks/useReveal";

export default function Services() {
  const ref = useReveal();

  return (
    <section id="services" className="services" ref={ref} aria-labelledby="services-title">
      <div className="wrap">
        <div className="section-head eyebrow">
          <span>02 / Services</span>
          <span>End-to-end AI consulting, from strategy to production and beyond.</span>
        </div>

        <div className="statement">
          <h2 id="services-title" className="statement-title" data-reveal>
            An impressive demo is easy. <em>A system people can rely on</em> takes engineering.
          </h2>
          <p className="statement-note" data-reveal>
            Four ways I work with teams: shaping what to build, building it, fitting it into the
            infrastructure you already run, and keeping it healthy after launch.
          </p>
        </div>

        <ol className="service-list">
          {services.map((s, i) => (
            <li key={s.title} className="service" data-reveal>
              <span className="service-num eyebrow">{String(i + 1).padStart(2, "0")}</span>
              <div className="service-head">
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
              <dl className="service-body">
                <div>
                  <dt className="eyebrow">Problem</dt>
                  <dd>{s.problem}</dd>
                </div>
                <div>
                  <dt className="eyebrow">What I deliver</dt>
                  <dd>
                    <ul className="dash-list">
                      {s.focus.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Outcome</dt>
                  <dd>{s.outcome}</dd>
                </div>
              </dl>
              <div className="service-meta">
                <p className="mono" aria-label={`Process: ${s.pipeline.join(", then ")}`}>
                  {s.pipeline.join(" → ")}
                </p>
                <p className="mono service-tools">{s.stack.join(" · ")}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="stack-line" data-reveal>
          <span className="eyebrow">Working stack</span>
          <span className="mono">{stack.join(" · ")}</span>
        </p>
      </div>
    </section>
  );
}
