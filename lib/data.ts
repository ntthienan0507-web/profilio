export type {
  SkillCategory,
  Experience,
  Achievement,
  Education,
  Hobby,
  Stat,
  SiteConfig,
  NavLink,
  PortfolioContent,
} from "./types";

import type {
  SkillCategory,
  Experience,
  Achievement,
  Education as EducationType,
  Hobby,
  Stat,
  SiteConfig,
  NavLink,
  PortfolioContent,
} from "./types";

export const defaultSiteConfig: SiteConfig = {
  name: "[YOUR FULL NAME]",
  title: "Senior Full-Stack Engineer | Platform & Data Architect",
  description:
    "Portfolio of a Senior Full-Stack Engineer specializing in Go, Ruby, TypeScript, and Cloud Infrastructure.",
  url: "https://profilio.vercel.app",
  ogImage: "/og-image.jpg",
  links: {
    github: "https://github.com/[USERNAME]",
    linkedin: "https://linkedin.com/in/[USERNAME]",
    email: "[EMAIL]",
  },
};

export const defaultNavLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

export const skills: SkillCategory[] = [
  {
    category: "Languages",
    skills: ["Go 1.24", "Ruby 3.2", "TypeScript 5", "SQL", "Bash"],
  },
  {
    category: "Frameworks",
    skills: ["Gin", "GORM", "SQLC", "Next.js", "React 18", "Rails 7.1", "Strapi CMS"],
  },
  {
    category: "Infrastructure",
    skills: ["Kubernetes", "Docker", "VMware vSphere", "OpenNebula", "GitLab CI"],
  },
  {
    category: "Management",
    skills: ["Jira", "Confluence", "Requirement Analysis", "Backlog Grooming"],
  },
  {
    category: "Storage & Data",
    skills: ["PostgreSQL", "Redis", "InfluxDB", "AWS S3", "MinIO"],
  },
  {
    category: "Observability",
    skills: ["Elastic APM", "ELK Stack", "Grafana", "NetBox", "Observium"],
  },
  {
    category: "Methodologies",
    skills: ["SOLID", "Clean Architecture", "TDD", "SEO Strategy", "RBAC"],
  },
];

export const experiences: Experience[] = [
  {
    title: "IaaS Platform",
    subtitle: "Infrastructure-as-a-Service for automated cloud resource orchestration",
    company: "VNETWORK",
    period: "2022 – Present",
    tech: ["Ruby on Rails", "Kubernetes", "Docker", "RBS/Steep"],
    metrics: [
      { value: "13", label: "Microservices" },
      { value: "133+", label: "API Endpoints" },
      { value: "50+", label: "Job Classes" },
    ],
    bullets: [
      "Architected API gateway managing 13 microservices with RSA-encrypted JWT and versioned routing.",
      "Developed 50+ background job classes automating cluster provisioning and scaling via CRDs.",
      "Implemented RBS/Steep type safety for mission-critical infrastructure operations.",
    ],
    architectureDiagram: `graph TB
  Client([Client Apps]):::client --> GW[API Gateway<br/>JWT + Versioned Routing]:::gateway

  subgraph Services[Microservices Cluster]
    direction TB
    GW --> Auth[Auth Service<br/>RSA JWT]:::service
    GW --> VM[VM Service]:::service
    GW --> K8s[K8s Service]:::service
    GW --> Net[Network Service]:::service
    GW --> Store[Storage Service]:::service
    GW --> Bill[Billing Service]:::service
  end

  subgraph Workers[Background Workers]
    direction TB
    Queue[(Job Queue<br/>50+ Classes)]:::queue
    Prov[Cluster Provisioner]:::worker
    Scale[Auto Scaler]:::worker
    Queue --> Prov
    Queue --> Scale
  end

  Services --> Queue
  K8s --> CRD[Kubernetes CRDs]:::infra
  Prov --> CRD
  Scale --> CRD
  Store --> S3[(Object Storage)]:::storage
  Bill --> DB[(PostgreSQL)]:::storage
  Auth --> Redis[(Redis Cache)]:::storage

  classDef client fill:#10b981,stroke:#059669,color:#fff
  classDef gateway fill:#1a1a2e,stroke:#10b981,color:#f0f0f5
  classDef service fill:#12121a,stroke:#10b981,color:#a0a0b8
  classDef worker fill:#12121a,stroke:#34d399,color:#a0a0b8
  classDef queue fill:#1a1a2e,stroke:#10b981,color:#10b981
  classDef infra fill:#0a0a0f,stroke:#10b981,color:#10b981
  classDef storage fill:#1a1a2e,stroke:#6b6b80,color:#a0a0b8`,
  },
  {
    title: "BI Financial API",
    subtitle: "High-performance analytics engine for real-time financial reporting",
    company: "VNETWORK",
    period: "2021 – 2022",
    tech: ["Go", "PostgreSQL", "Elastic APM", "Cron"],
    metrics: [
      { value: "85+", label: "Endpoints" },
      { value: "<1s", label: "P95 Latency" },
      { value: "100%", label: "Data Accuracy" },
    ],
    bullets: [
      "Designed algorithms for Revenue Recognition, Allocation, and Balance Sheet calculations.",
      "Built 85+ endpoints handling large-scale datasets with PostgreSQL optimization and Elastic APM.",
      "Engineered robust Cron scheduling for multi-source data sync and high-volume Excel exports.",
    ],
    architectureDiagram: `graph TB
  Clients([Dashboard & Reports]):::client --> API[Go API Server<br/>85+ Endpoints]:::gateway

  subgraph Core[Core Engine]
    direction TB
    API --> Rev[Revenue Recognition]:::service
    API --> Alloc[Allocation Engine]:::service
    API --> BS[Balance Sheet Calc]:::service
    API --> Export[Excel Exporter]:::service
  end

  subgraph Data[Data Pipeline]
    direction TB
    Cron[Cron Scheduler]:::worker --> Sync[Multi-Source Sync]:::worker
    Sync --> Transform[Data Transform]:::worker
  end

  subgraph Observe[Observability]
    direction TB
    APM[Elastic APM<br/>P95 &lt; 1s]:::monitor
    Logs[ELK Stack]:::monitor
  end

  Core --> DB[(PostgreSQL<br/>Optimized Queries)]:::storage
  Data --> DB
  API --> APM
  API --> Logs
  Cron --> Export

  classDef client fill:#10b981,stroke:#059669,color:#fff
  classDef gateway fill:#1a1a2e,stroke:#10b981,color:#f0f0f5
  classDef service fill:#12121a,stroke:#10b981,color:#a0a0b8
  classDef worker fill:#12121a,stroke:#34d399,color:#a0a0b8
  classDef monitor fill:#1a1a2e,stroke:#6b6b80,color:#a0a0b8
  classDef storage fill:#1a1a2e,stroke:#6b6b80,color:#a0a0b8`,
  },
  {
    title: "DataCentral & Landing Pages",
    subtitle: "Centralized data platform with high-performance web properties",
    company: "VNETWORK",
    period: "2020 – 2021",
    tech: ["Go", "Next.js", "Keycloak", "PostgreSQL"],
    metrics: [
      { value: "100+", label: "DB Tables" },
      { value: "90+", label: "PageSpeed" },
      { value: "45+", label: "Domains" },
    ],
    bullets: [
      "Analyzed requirements and designed DB schemas for 100+ tables, translating into actionable tickets.",
      "Built high-performance platforms with Next.js (App Router) + ISR achieving PageSpeed 90+.",
      "Integrated centralized Keycloak SSO with fine-grained RBAC for a modular system of 45+ domains.",
    ],
    architectureDiagram: `graph TB
  Users([Users<br/>45+ Domains]):::client --> CDN[CDN / Edge]:::gateway
  CDN --> Next[Next.js App Router<br/>ISR + SSR]:::gateway

  subgraph Frontend[Web Platform]
    direction TB
    Next --> Pages[Landing Pages<br/>PageSpeed 90+]:::service
    Next --> Portal[Data Portal]:::service
    Next --> Admin[Admin Panel]:::service
  end

  subgraph Auth[Authentication]
    direction TB
    KC[Keycloak SSO]:::worker --> RBAC[Fine-grained RBAC]:::worker
  end

  subgraph Backend[Go Backend]
    direction TB
    API[Go REST API]:::service
    API --> Schema[100+ DB Tables]:::service
  end

  Frontend --> KC
  Frontend --> API
  API --> DB[(PostgreSQL)]:::storage
  KC --> DB
  API --> Cache[(Redis)]:::storage

  classDef client fill:#10b981,stroke:#059669,color:#fff
  classDef gateway fill:#1a1a2e,stroke:#10b981,color:#f0f0f5
  classDef service fill:#12121a,stroke:#10b981,color:#a0a0b8
  classDef worker fill:#12121a,stroke:#34d399,color:#a0a0b8
  classDef storage fill:#1a1a2e,stroke:#6b6b80,color:#a0a0b8`,
  },
];

export const achievements: Achievement[] = [
  { icon: "zap", metric: "80%", label: "Cloud Infra Automated" },
  { icon: "bar-chart", metric: "85+", label: "API Endpoints Built" },
  { icon: "clock", metric: "<1s", label: "P95 Latency" },
  { icon: "award", metric: "90+", label: "PageSpeed Score" },
];

export const education: EducationType = {
  degree: "Bachelor of Information Technology",
  school: "[University Name]",
  period: "2016 – 2020",
};

export const aboutText =
  "A results-oriented full-stack engineer with 4+ years of experience designing and building enterprise cloud platforms, financial APIs, and data-driven web applications. Passionate about clean architecture, infrastructure as code, and developer experience. Specialized in navigating Agile/Scrum environments and bridging complex business requirements with architectural excellence.";

export const stats: Stat[] = [
  { value: 4, suffix: "+", label: "Years Experience" },
  { value: 3, suffix: "", label: "Major Projects" },
  { value: 80, suffix: "%", label: "Infra Automated" },
];

export const hobbies: Hobby[] = [
  { icon: "code", label: "Open Source", description: "Contributing to OSS projects & building dev tools" },
  { icon: "gamepad", label: "Gaming", description: "Strategy & RPG games for problem-solving fun" },
  { icon: "music", label: "Music", description: "Listening to lo-fi & chill beats while coding" },
  { icon: "book", label: "Reading", description: "Tech blogs, system design papers & manga" },
  { icon: "coffee", label: "Coffee", description: "Exploring specialty coffee & brewing methods" },
  { icon: "globe", label: "Travel", description: "Discovering new cultures & street food" },
];

export const defaultContent: PortfolioContent = {
  siteConfig: defaultSiteConfig,
  navLinks: defaultNavLinks,
  aboutText,
  stats,
  skills,
  experiences,
  achievements,
  education,
  hobbies,
};
