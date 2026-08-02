export const services = [
  {
    title: "AI Strategy & Architecture",
    description:
      "From concept to blueprint. I help businesses define their AI roadmap, select the right technologies, and design system architectures that scale.",
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
    title: "Agentic AI for Financial Fraud Detection",
    description:
      "Designed and deployed agentic AI systems for a major financial institution, enabling real-time fraud detection on credit card transactions.",
    focus: [
      "Agentic AI architecture for autonomous decision-making",
      "Real-time transaction monitoring and anomaly detection",
      "Production deployment with IBM partnership",
    ],
    domain: "Financial services",
    stack: ["Agentic orchestration", "Streaming", "Anomaly detection", "IBM Cloud"],
    metrics: [],
  },
  {
    title: "Computer Vision & LLM Systems for Enterprise",
    description:
      "Built production ML systems including real-time facial identification from CCTV feeds, volume estimation models, and LLM-powered sales optimization.",
    focus: [
      "93% accurate volume estimation model",
      "40% increase in sales via LLM fine-tuning",
      "Real-time facial identification pipeline",
    ],
    domain: "Logistics & retail",
    stack: ["PyTorch", "OpenCV", "LLM fine-tuning", "Real-time inference"],
    metrics: [
      { label: "Volume est. accuracy", value: "93", unit: "%", ratio: 0.93 },
      { label: "Sales uplift", value: "+40", unit: "%" },
    ],
  },
  {
    title: "3D Reconstruction with Transformer Architectures",
    description:
      "Designed a transformer-based architecture for 3D voxel reconstruction from partial inputs, pushing the boundaries of generative 3D AI.",
    focus: [
      "Transformer-based voxel completion pipeline",
      "High-fidelity reconstructions outperforming baseline autoencoders",
      "End-to-end system for 3D shape restoration",
    ],
    domain: "Research",
    stack: ["Transformers", "Voxel grids", "Generative 3D"],
    metrics: [],
  },
];

/* Platform and tooling actually used day to day. Surfaced in the hero because
   the previous copy named no stack at all — a client scanning for Databricks
   or Kubernetes found nothing. */
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
  "Terraform",
];
