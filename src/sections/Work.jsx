import Section from "../components/Section";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { work } from "../data/work";

export default function Work() {
  const ref = useScrollAnimation();

  return (
    <Section>
      <div id="work" ref={ref} role="region" aria-label="Work portfolio section">
        <h2>Selected Work</h2>

        <div className="work-list" role="list">
          {work.map((item, index) => (
            <div 
              key={index} 
              className="work-item" 
              style={{ '--item-index': index }}
              role="listitem"
              tabIndex={0}
              aria-label={`${item.title} project`}
            >
              <div className="work-item-header">
                <h3>{item.title}</h3>
              </div>
              <p className="work-description">{item.description}</p>

              <div className="work-focus" role="list" aria-label="Project focus areas">
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
