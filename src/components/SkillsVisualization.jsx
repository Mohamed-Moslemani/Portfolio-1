import { useEffect, useRef, useState } from "react";
import "../styles/skills-visualization.css";

export default function SkillsVisualization() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  const skills = [
    { name: "Python", level: 95, category: "Programming" },
    { name: "Machine Learning", level: 90, category: "AI/ML" },
    { name: "React", level: 85, category: "Frontend" },
    { name: "Data Science", level: 92, category: "AI/ML" },
    { name: "JavaScript", level: 88, category: "Programming" },
    { name: "SQL", level: 87, category: "Data" },
    { name: "TensorFlow/PyTorch", level: 85, category: "AI/ML" },
    { name: "Node.js", level: 82, category: "Backend" },
    { name: "Research", level: 94, category: "Core" },
    { name: "Problem Solving", level: 96, category: "Core" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`skills-visualization ${isVisible ? 'visible' : ''}`}>
      <h3 className="skills-title">Technical Expertise</h3>
      
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div 
            key={index} 
            className="skill-item"
            style={{ animationDelay: `${index * 0.1}s` }}
            role="group"
            aria-label={`${skill.name} skill`}
          >
            <div className="skill-header">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-level" aria-label={`${skill.level} percent proficiency`}>
                {skill.level}%
              </span>
            </div>
            <div className="skill-bar-container" role="progressbar" aria-valuenow={skill.level} aria-valuemin="0" aria-valuemax="100">
              <div 
                className="skill-bar" 
                style={{ 
                  '--skill-width': `${skill.level}%`,
                  '--skill-delay': `${index * 0.1}s`
                }}
              >
                <div className="skill-glow"></div>
              </div>
            </div>
            <span className="skill-category">{skill.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
