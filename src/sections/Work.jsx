import { work, moreProjects } from "../data/work";
import { useReveal } from "../hooks/useReveal";

const STORY = [
  ["problem", "Problem & context"],
  ["role", "My contribution"],
  ["system", "System built"],
  ["result", "Result"],
];

/* Fixed 7×7 silhouette. 1 = present in the partial input, 2 = missing from
   the input and filled by completion. Illustrative only. */
const VOXELS = [
  "0011100",
  "0112210",
  "1112221",
  "1111221",
  "1111111",
  "0110110",
  "0110110",
];

function VoxelSchematic() {
  const cell = 14;
  const gap = 3;
  const size = VOXELS.length * (cell + gap) - gap;
  const grid = (showMissing) =>
    VOXELS.flatMap((row, y) =>
      [...row].map((v, x) => {
        if (v === "0") return null;
        const missing = v === "2";
        return (
          <rect
            key={`${x}-${y}`}
            x={x * (cell + gap)}
            y={y * (cell + gap)}
            width={cell}
            height={cell}
            className={missing ? (showMissing ? "vx vx-fill" : "vx vx-gap") : "vx"}
          />
        );
      })
    );

  return (
    <figure className="voxel-figure">
      <svg
        viewBox={`0 0 ${size * 2 + 60} ${size}`}
        role="img"
        aria-label="Schematic: a voxel shape with missing cells, then the same shape with the missing cells completed"
      >
        <g>{grid(false)}</g>
        <path
          d={`M${size + 14} ${size / 2}h30m-7-6 7 6-7 6`}
          className="vx-arrow"
          fill="none"
        />
        <g transform={`translate(${size + 60} 0)`}>{grid(true)}</g>
      </svg>
      <figcaption className="eyebrow">
        Schematic, not model output: partial input → completed voxel shape
      </figcaption>
    </figure>
  );
}

function CaseStudy({ item, index }) {
  return (
    <article id={item.id} className={`case case--${item.layout}`} data-reveal>
      <header className="case-head">
        <p className="case-num eyebrow">
          {String(index + 1).padStart(2, "0")} /
        </p>
        <p className="case-meta eyebrow">
          {item.domain} · {item.org}
          {item.period ? ` · ${item.period}` : ""}
        </p>
        <h3 className="case-title">
          <span className="case-kicker">{item.title}</span>
          <span className="case-headline">
            {item.headline[0]}
            <br />
            <em>{item.headline[1]}</em>
          </span>
        </h3>
      </header>

      {item.layout === "research" && <VoxelSchematic />}

      <dl className="case-story">
        {STORY.map(([key, label]) => (
          <div key={key} className={`case-story-${key}`}>
            <dt className="eyebrow">{label}</dt>
            <dd>{item[key]}</dd>
          </div>
        ))}
      </dl>

      <footer className="case-foot">
        <p className="case-stack">
          <span className="eyebrow">Technologies</span>
          <span className="mono">{item.stack.join(" · ")}</span>
        </p>
        {item.layout === "research" ? (
          <a href="#education" className="case-link link-under">
            Research overview in Education →
          </a>
        ) : (
          <a href="#experience" className="case-link link-under">
            Role details in Experience →
          </a>
        )}
      </footer>
    </article>
  );
}

export default function Work() {
  const ref = useReveal();

  return (
    <section id="work" className="work block-ink" ref={ref} aria-labelledby="work-title">
      <div className="wrap">
        <div className="section-head eyebrow">
          <span>03 / Selected work</span>
          <span>Case studies and research</span>
        </div>

        <div className="work-intro">
          <h2 id="work-title" className="section-title" data-reveal>
            Proof
            <br />
            of work<span className="dot">.</span>
          </h2>
          <p data-reveal>
            Enterprise AI, computer vision, and research. Each case states the problem, what I
            did, what was built, and what can be said about the result.
          </p>
        </div>

        <div className="case-list">
          {work.map((item, i) => (
            <CaseStudy key={item.id} item={item} index={i} />
          ))}
        </div>

        <div className="more-projects" aria-labelledby="more-projects-title">
          <h3 id="more-projects-title" className="eyebrow">More projects &amp; research</h3>
          <ul>
            {moreProjects.map((p) => (
              <li key={p.title} className="more-project" data-reveal>
                <p className="eyebrow more-project-kind">{p.kind}</p>
                <h4>{p.title}</h4>
                <p className="more-project-summary">{p.summary}</p>
                {p.links.length > 0 && (
                  <p className="more-project-links">
                    {p.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="link-under">
                        {l.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ))}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
