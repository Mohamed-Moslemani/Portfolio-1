const CALENDLY = "https://calendly.com/moslemanomohamed";

export default function Home() {
  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow">
          Mohamed Moslemani <span aria-hidden="true">/</span> AI Consultant &amp; Engineer
        </p>

        <h1 id="hero-title" className="hero-title">
          AI systems,
          <br />
          built for
          <br />
          <span className="accent">production.</span>
        </h1>

        <div className="hero-foot">
          <p className="hero-lede">
            I design, build, and maintain machine learning, LLM, and data systems, from the
            pipeline to the deployed service. Currently AI/ML Engineer at Strategy&amp; (PwC
            network), where I lead a team of five as Data Tech Lead; MSc in Computational Science at AUB.
          </p>
          <div className="hero-actions">
            <a href="#work" className="btn btn-solid">
              See selected work <span aria-hidden="true">↘</span>
            </a>
            <a href={CALENDLY} target="_blank" rel="noreferrer" className="btn btn-line">
              Book a consultation<span className="sr-only"> (opens Calendly in a new tab)</span>
            </a>
          </div>
        </div>
      </div>

      <aside className="hero-aside" aria-label="Current focus">
        <div className="hero-aside-top eyebrow">
          <span>
            Beirut
            <br />
            Working worldwide
          </span>
          <span>00 / Intro</span>
        </div>

        <div className="monogram" aria-hidden="true">
          <span className="monogram-orb" />
          <strong>MM</strong>
          <span className="monogram-corner">Systems / Research / Execution</span>
        </div>

        <dl className="hero-facts">
          <div>
            <dt className="eyebrow">Now</dt>
            <dd>AI/ML Engineer &amp; Data Tech Lead, Strategy&amp;</dd>
          </div>
          <div>
            <dt className="eyebrow">Focus</dt>
            <dd>Forecasting, agentic systems, data pipelines, computer vision</dd>
          </div>
          <div>
            <dt className="eyebrow">Research</dt>
            <dd>Distribution shift, 3D reconstruction</dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}
