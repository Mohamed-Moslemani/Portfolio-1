/* Source: public/resume.pdf (Mohamed_Moslemani_CV.pdf, 2026-09-05) and the
   previous site copy. No client names or confidential detail. */

export const experience = [
  {
    role: "AI/ML Engineer · Data Tech Lead",
    company: "Strategy&",
    org: "PwC Network",
    location: "Beirut · On-site",
    period: "Jan 2026 – Present",
    current: true,
    summary:
      "Data Tech Lead for a team of five: I set technical direction, review designs and code, and own delivery of the team's data and AI workstreams.",
    contributions: [
      "Lead forecasting models for multiple business KPIs, primarily revenue, used for planning and decision support",
      "Designed and delivered an end-to-end agentic AI system (LangGraph, FastAPI), exposed as an internal service that automates workflows across several departments",
      "Own and maintain 12 production Databricks ETL pipelines, with operational and observability data in Grafana and Prometheus",
      "Ship containerized services on Kubernetes through Azure DevOps CI/CD, secured with Azure Entra ID; LLM workloads traced and evaluated with Langfuse",
    ],
    stack: "Python · LangGraph · Langfuse · FastAPI · PyTorch · scikit-learn · Databricks · MS SQL Server · Azure DevOps · Entra ID · Docker · Kubernetes · Grafana · Prometheus",
  },
  {
    role: "AI Technical Consultant",
    company: "QuanTech",
    org: "Midis Group · IBM Partner",
    location: "Beirut · On-site",
    period: "Oct 2025 – Jan 2026",
    summary:
      "Designed and implemented agentic AI systems for financial institutions, focusing on reliability and real-world constraints.",
    highlights: [
      "Agentic system for financial use cases for a banking client, built on LangChain and fast-agent and served through FastAPI",
      "Credit card fraud detection using supervised machine learning",
      "Enterprise ML solutions on IBM watsonx, deployed on Red Hat OpenShift and published through WSO2 API Manager",
    ],
    stack: "Python · LangChain · Langfuse · fast-agent · FastAPI · scikit-learn · IBM watsonx · OpenShift · WSO2 API Manager · Docker · Linux",
    caseStudy: "work-fraud",
  },
  {
    role: "Data Scientist",
    company: "800Storage",
    location: "Dubai · Remote",
    period: "Feb 2024 – Jul 2025",
    summary:
      "Built production-grade ML systems spanning computer vision, analytics pipelines, and LLM optimization.",
    highlights: [
      "Real-time facial identification from CCTV feeds",
      "93% accurate volume estimation model",
      "40% increase in sales conversions via LLM fine-tuning",
      "Automated data cleaning, transformation, analysis, and visualization pipelines, replacing manual reporting",
    ],
    stack: "Python · Java Spring Boot · Docker · Kubernetes · AWS · Redis · Linux",
    caseStudy: "work-vision",
  },
  {
    role: "Data Intern",
    company: "UNICEF",
    location: "Lebanon · On-site",
    period: "Sep 2023 – Feb 2024",
    summary:
      "Data validation, auditing, and analytics for large-scale humanitarian and educational projects.",
    highlights: [
      "Validated and audited geospatial and operational data across 20+ project sites",
      "Automated data cleaning, validation, and visualization workflows in Python and Pandas",
    ],
  },
];

export const education = [
  {
    degree: "MSc in Computational Science",
    track: "Machine Learning Track",
    school: "American University of Beirut",
    short: "AUB",
    date: "2024 – 2026",
    status: "In progress",
    role: "Research",
    note: "Thesis (in progress): distribution shift, and how models trained on one data distribution generalize to different test distributions.",
    highlights: [
      "Graduate Fellowship and Assistantship Program – Full merit scholarship",
      "TA: CMPS 262 Data Science in R and Python, CMPS 208 Business for Computing",
    ],
    coursework: [
      "Statistical Learning",
      "Large Language Models",
      "Reinforcement Learning",
      "Non-linear Optimization",
      "Algorithmic Graph Theory",
      "Partial Differential Equations",
      "AI in Industry",
    ],
  },
  {
    degree: "Graduate Diploma in AI and Data Science",
    school: "American University of Beirut",
    short: "AUB",
    date: "2023 – 2024",
    role: "Method",
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
    short: "BAU",
    date: "2020 – 2023",
    role: "Foundation",
    highlights: [
      "Top Student of the Department (2022–2023)",
      "Faculty of Science Representative in university council (2022–2023)",
    ],
    coursework: [
      "Linear Algebra",
      "Multivariate Calculus",
      "Complex Analysis",
      "Quantum Mechanics I & II",
      "Solid State Physics",
      "Electronics",
      "Java for Computing",
    ],
  },
];
