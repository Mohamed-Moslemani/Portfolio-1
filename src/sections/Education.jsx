import Section from "../components/Section";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import LazyImage from "../components/LazyImage";
import aubLogo from "../assets/logos/31-Aug-The-American-University-of-Beirut-reveals-its-new-logo-that-reaffirms-its-identity-and-role-in-the-region-680x460.png";
import bauLogo from "../assets/logos/bau.png";

const education = [
  {
    degree: "MSc in Computational Science",
    track: "Machine Learning Track",
    school: "American University of Beirut",
    logo: aubLogo,
    date: "Expected 2026",
    highlights: [
      "Graduate Fellowship and Assistantship Program \u2013 Full merit scholarship",
      "TA: CMPS 262 Data Science in R and Python, CMPS 208 Business for Computing",
    ],
    coursework: [
      "Statistical Learning",
      "Topics in AI: LLMs",
      "AI in Industry",
      "Reinforcement Learning",
      "Algorithmic Graph Theory",
      "Partial Differential Equations",
    ],
  },
  {
    degree: "Graduate Diploma in AI and Data Science",
    school: "American University of Beirut",
    logo: aubLogo,
    date: "2024",
    coursework: [
      "Data Science",
      "Machine Learning",
      "Deep Learning",
      "Business Analytics",
      "Arabic NLP",
    ],
  },
  {
    degree: "Bachelor of Science in Physics",
    school: "Beirut Arab University",
    logo: bauLogo,
    date: "2023",
    highlights: [
      "Top Student of the Department (2022\u20132023)",
      "Faculty of Science Representative in university council (2022\u20132023)",
    ],
  },
];

export default function Education() {
  const ref = useScrollAnimation();

  return (
    <Section>
      <div id="education" ref={ref} role="region" aria-label="Education section">
        <div className="education-header-section">
          <h2>Education</h2>
          <p className="education-subtitle">From physics fundamentals to cutting-edge AI research.</p>
        </div>

        <div className="education-timeline" role="list">
          {education.map((item, index) => (
            <div key={index} className="education-card" style={{ "--card-index": index }} role="listitem">
              <div className="education-timeline-dot"></div>

              <div className="education-card-inner">
                <div className="education-top">
                  <div className="education-logo">
                    <LazyImage
                      src={item.logo}
                      alt={item.school}
                      className="education-logo-img"
                    />
                  </div>
                  <div className="education-meta">
                    <span className="education-period">{item.date}</span>
                  </div>
                </div>

                <div className="education-content">
                  <div className="education-title-group">
                    <h3 className="education-degree">{item.degree}</h3>
                    {item.track && <span className="education-track">{item.track}</span>}
                  </div>

                  <p className="education-school">{item.school}</p>

                  {item.highlights && (
                    <ul className="education-highlights">
                      {item.highlights.map((h, i) => (
                        <li key={i}>
                          <span className="highlight-dot"></span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.coursework && (
                    <div className="education-coursework">
                      {item.coursework.map((c, i) => (
                        <span key={i} className="coursework-tag">{c}</span>
                      ))}
                    </div>
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
