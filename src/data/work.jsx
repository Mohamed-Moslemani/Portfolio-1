/* Services and case studies. Claims are sourced from the previous site copy
   or public/resume.pdf (Mohamed_Moslemani_CV.pdf, 2026-09-05). Where they
   disagree, the CV wording is used. */

export const services = [
  {
    title: "AI Strategy & Architecture",
    description:
      "From concept to blueprint. I help businesses define their AI roadmap, select the right technologies, and design system architectures that scale.",
    problem:
      "An AI ambition without a scoped use case, a target architecture, or a cost model.",
    outcome:
      "A roadmap and an architecture your team can build against, with trade-offs and running costs written down before code.",
    focus: [
      "AI readiness assessment and opportunity mapping",
      "End-to-end system architecture design",
      "Technology stack selection and vendor evaluation",
      "Scalability and cost optimization planning",
    ],
    pipeline: ["discovery", "assessment", "blueprint", "roadmap"],
    stack: ["Architecture review", "TCO modelling", "Vendor eval"],
  },
  {
    title: "AI System Development",
    description:
      "Full-cycle development of production-ready AI/ML systems, from data pipelines to deployed models serving real users.",
    problem:
      "A model that works in a notebook or a demo, but not behind an API with real users and real data.",
    outcome:
      "A served model or LLM workflow with defined interfaces, evaluation, and a path to retraining.",
    focus: [
      "Custom ML model development and training",
      "LLM integration, fine-tuning, and agentic workflows",
      "Computer vision and NLP solutions",
      "API development and model serving as microservices",
    ],
    pipeline: ["data", "train", "eval", "serve"],
    stack: ["PyTorch", "LangGraph", "FastAPI", "vLLM"],
  },
  {
    title: "Platform & System Integration",
    description:
      "Seamlessly embed AI capabilities into your existing infrastructure. No rip-and-replace, just intelligent augmentation.",
    problem:
      "New AI capability that has to live inside existing systems, data platforms, and deployment processes.",
    outcome:
      "Pipelines and services that run on the infrastructure you already operate, deployed through CI/CD.",
    focus: [
      "Integration with existing enterprise systems",
      "Databricks and Spark ETL pipeline design and orchestration",
      "Containers as a service and microservice architecture on Kubernetes",
      "Cloud infrastructure setup (AWS, GCP, Azure) and CI/CD for ML (MLOps)",
    ],
    pipeline: ["ingest", "databricks", "feature store", "k8s", "api"],
    stack: ["Databricks", "Spark", "Airflow", "Kubernetes", "Terraform"],
  },
  {
    title: "Maintenance & Optimization",
    description:
      "AI systems need continuous care. I provide ongoing monitoring, performance optimization, and model retraining.",
    problem:
      "Models degrade as data drifts, and infrastructure cost grows quietly after launch.",
    outcome:
      "Monitoring, drift checks, and retraining on a schedule, so degradation is visible and handled rather than discovered by users.",
    focus: [
      "Model performance monitoring and drift detection",
      "System reliability and uptime optimization",
      "Cost reduction and resource efficiency",
      "Iterative model improvement and retraining",
    ],
    pipeline: ["monitor", "detect drift", "retrain", "ship"],
    stack: ["MLflow", "Prometheus", "Grafana", "Evidently"],
  },
];

export const work = [
  {
    id: "work-fraud",
    layout: "split",
    title: "Agentic AI for Financial Fraud Detection",
    headline: ["Fraud signals,", "faster decisions."],
    domain: "Financial services",
    org: "QuanTech · IBM partner",
    period: "Oct 2025 – Jan 2026",
    problem:
      "A banking client, working with QuanTech (an IBM partner), needed an agentic system for financial use cases and a way to flag fraudulent credit card transactions.",
    role:
      "As AI technical consultant, I implemented the agentic system and built the fraud detection model.",
    system:
      "An agentic system built on LangChain and fast-agent and served through FastAPI, alongside a supervised machine learning model that flags fraudulent card transactions. Delivered on IBM watsonx, deployed on Red Hat OpenShift, and published through WSO2 API Manager.",
    result:
      "Implemented for the client as part of QuanTech's engagement. No performance metrics are published.",
    stack: [
      "Agentic orchestration",
      "Supervised ML",
      "LangChain",
      "fast-agent",
      "Langfuse",
      "FastAPI",
      "scikit-learn",
      "IBM watsonx",
      "OpenShift",
      "WSO2 API Manager",
    ],
  },
  {
    id: "work-vision",
    layout: "stacked",
    title: "Computer Vision & LLM Systems for Enterprise",
    headline: ["Seeing what", "the camera knows."],
    domain: "Logistics & retail",
    org: "800Storage · Dubai, remote",
    period: "Feb 2024 – Jul 2025",
    problem:
      "A storage and logistics business wanted to automate operational work: recognizing personnel from CCTV, estimating stored volume, and supporting sales.",
    role:
      "As data scientist, I engineered the facial identification system, developed the volume estimation model, fine-tuned the sales LLM, and built the analysis pipelines behind them.",
    system:
      "Real-time facial identification on live CCTV feeds using embedding and classification workflows; a volume estimation model; LLMs fine-tuned for sales tasks; automated cleaning, transformation, and reporting pipelines.",
    result:
      "The volume estimation model reached 93% accuracy, and sales conversions rose 40% after the LLM fine-tuning work.",
    stack: [
      "PyTorch",
      "OpenCV",
      "LLM fine-tuning",
      "Real-time inference",
      "Docker",
      "Kubernetes",
      "AWS",
      "Redis",
    ],
  },
  {
    id: "work-3d",
    layout: "research",
    title: "3D Reconstruction with Transformer Architectures",
    headline: ["Reconstructing", "what's missing."],
    domain: "Research",
    org: "Independent research",
    problem:
      "3D objects often arrive partial or degraded and must be completed before they are usable. The comparison point was baseline 3D autoencoder models.",
    role:
      "I designed and implemented the architecture and the voxel completion pipeline.",
    system:
      "A transformer-based model that completes voxelized 3D objects from partial or degraded inputs, operating directly on raw STL mesh data.",
    result:
      "High-fidelity reconstructions that generalized better than baseline 3D autoencoder models.",
    stack: ["Transformers", "Voxel grids", "STL meshes", "Generative 3D"],
  },
];

/* Further projects and research, listed compactly under the case studies. */
export const moreProjects = [
  {
    title: "DocFlows",
    kind: "Personal project · Platform",
    summary:
      "Enterprise document workflow automation. A distributed platform built on microservices, asynchronous task queues, and workflow orchestration, with OCR and computer vision pipelines for extraction, schema validation, and error recovery across document formats. Runs with Docker, CI/CD, centralized logging, distributed tracing, and metrics-based monitoring.",
    links: [
      { label: "docflows.com", href: "https://docflows.com" },
      { label: "GitHub", href: "https://github.com/Mohamed-Moslemani/MainProjectRepo" },
    ],
  },
  {
    title: "Cancer type classification on X-ray images",
    kind: "Project · Medical imaging",
    summary:
      "Multiclass cancer classifier trained with few-shot transfer learning on a limited X-ray dataset, combining InceptionV3 and ResNet50 backbones with a custom dense head in a reproducible TensorFlow/Keras pipeline.",
    links: [
      { label: "GitHub", href: "https://github.com/Mohamed-Moslemani/cancer-multiclass-classification" },
    ],
  },
  {
    title: "Fourier and non-Fourier heat conduction",
    kind: "Research · Numerical simulation",
    summary:
      "Numerical simulations benchmarking classical Fourier conduction against Green–Naghdi non-Fourier models under transient conditions, addressing the infinite propagation speed paradox.",
    links: [],
  },
];

/* Platform and tooling used day to day. Shown once, in the services section,
   rather than as a hero ticker. */
export const stack = [
  "Python",
  "PyTorch",
  "Databricks",
  "Spark",
  "Airflow",
  "Kubernetes",
  "Docker",
  "FastAPI",
  "LangGraph",
  "Postgres",
  "AWS",
  "Azure",
  "Grafana",
  "Prometheus",
  "Terraform",
];
