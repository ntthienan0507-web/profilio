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
  name: "Nguyễn Quốc Chung",
  title: "Senior Full-Stack Engineer | Platform & Data Architect",
  description:
    "Portfolio of a Senior Full-Stack Engineer specializing in Go, Ruby, TypeScript, and Cloud Infrastructure.",
  url: "https://nqc.netlify.app",
  ogImage: "/og-image.jpg",
  links: {
    github: "https://github.com/ntthienan0507-web",
    linkedin:
      "https://www.linkedin.com/in/qu%E1%BB%91c-chung-nguy%E1%BB%85n-39a09936a",
    email: "nguyenquocchung511@gmail.com",
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
    skills: [
      "Gin",
      "GORM",
      "SQLC",
      "Next.js",
      "React 18",
      "Rails 7.1",
      "Strapi CMS",
    ],
  },
  {
    category: "Infrastructure",
    skills: [
      "Kubernetes",
      "Docker",
      "VMware vSphere",
      "OpenNebula",
      "GitLab CI",
    ],
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
    subtitle:
      "Infrastructure-as-a-Service for automated cloud resource orchestration",
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
    architectureDiagram: {
      nodes: [
        { id: "client", label: "Client Apps", x: 50, y: 5, type: "client" },
        {
          id: "gw",
          label: "API Gateway",
          sublabel: "JWT + Versioned Routing",
          x: 50,
          y: 20,
          type: "gateway",
        },
        {
          id: "auth",
          label: "Auth Service",
          sublabel: "RSA JWT",
          x: 15,
          y: 38,
          type: "service",
        },
        { id: "vm", label: "VM Service", x: 35, y: 38, type: "service" },
        { id: "k8s", label: "K8s Service", x: 55, y: 38, type: "service" },
        { id: "net", label: "Network Service", x: 75, y: 38, type: "service" },
        {
          id: "store",
          label: "Storage Service",
          x: 20,
          y: 55,
          type: "service",
        },
        { id: "bill", label: "Billing Service", x: 45, y: 55, type: "service" },
        {
          id: "queue",
          label: "Job Queue",
          sublabel: "50+ Classes",
          x: 75,
          y: 58,
          type: "worker",
        },
        { id: "prov", label: "Provisioner", x: 65, y: 75, type: "worker" },
        { id: "scale", label: "Auto Scaler", x: 85, y: 75, type: "worker" },
        { id: "crd", label: "K8s CRDs", x: 75, y: 92, type: "gateway" },
        { id: "s3", label: "Object Storage", x: 10, y: 75, type: "storage" },
        { id: "db", label: "PostgreSQL", x: 35, y: 75, type: "storage" },
        { id: "redis", label: "Redis Cache", x: 15, y: 92, type: "storage" },
      ],
      edges: [
        { from: "client", to: "gw", animated: true },
        { from: "gw", to: "auth" },
        { from: "gw", to: "vm" },
        { from: "gw", to: "k8s" },
        { from: "gw", to: "net" },
        { from: "k8s", to: "queue", animated: true },
        { from: "bill", to: "queue" },
        { from: "queue", to: "prov", animated: true },
        { from: "queue", to: "scale", animated: true },
        { from: "prov", to: "crd", animated: true },
        { from: "scale", to: "crd" },
        { from: "store", to: "s3" },
        { from: "bill", to: "db" },
        { from: "auth", to: "redis" },
      ],
      groups: [
        {
          label: "Microservices",
          nodeIds: ["auth", "vm", "k8s", "net", "store", "bill"],
        },
        { label: "Workers", nodeIds: ["queue", "prov", "scale"] },
      ],
    },
  },
  {
    title: "BI Financial API",
    subtitle:
      "High-performance analytics engine for real-time financial reporting",
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
    architectureDiagram: {
      nodes: [
        {
          id: "dash",
          label: "Dashboard & Reports",
          x: 50,
          y: 5,
          type: "client",
        },
        {
          id: "api",
          label: "Go API Server",
          sublabel: "85+ Endpoints",
          x: 50,
          y: 22,
          type: "gateway",
        },
        {
          id: "rev",
          label: "Revenue Recognition",
          x: 18,
          y: 42,
          type: "service",
        },
        {
          id: "alloc",
          label: "Allocation Engine",
          x: 42,
          y: 42,
          type: "service",
        },
        { id: "bs", label: "Balance Sheet", x: 66, y: 42, type: "service" },
        {
          id: "export",
          label: "Excel Exporter",
          x: 88,
          y: 42,
          type: "service",
        },
        { id: "cron", label: "Cron Scheduler", x: 18, y: 68, type: "worker" },
        {
          id: "sync",
          label: "Multi-Source Sync",
          x: 42,
          y: 68,
          type: "worker",
        },
        {
          id: "transform",
          label: "Data Transform",
          x: 42,
          y: 85,
          type: "worker",
        },
        {
          id: "apm",
          label: "Elastic APM",
          sublabel: "P95 < 1s",
          x: 78,
          y: 68,
          type: "monitor",
        },
        { id: "elk", label: "ELK Stack", x: 78, y: 85, type: "monitor" },
        {
          id: "db",
          label: "PostgreSQL",
          sublabel: "Optimized Queries",
          x: 50,
          y: 95,
          type: "storage",
        },
      ],
      edges: [
        { from: "dash", to: "api", animated: true },
        { from: "api", to: "rev" },
        { from: "api", to: "alloc" },
        { from: "api", to: "bs" },
        { from: "api", to: "export" },
        { from: "cron", to: "sync", animated: true },
        { from: "sync", to: "transform", animated: true },
        { from: "transform", to: "db", animated: true },
        { from: "api", to: "apm" },
        { from: "api", to: "elk" },
        { from: "rev", to: "db" },
        { from: "alloc", to: "db" },
        { from: "cron", to: "export" },
      ],
      groups: [
        { label: "Core Engine", nodeIds: ["rev", "alloc", "bs", "export"] },
        { label: "Data Pipeline", nodeIds: ["cron", "sync", "transform"] },
        { label: "Observability", nodeIds: ["apm", "elk"] },
      ],
    },
  },
  {
    title: "DataCentral & Landing Pages",
    subtitle: "Centralized data platform with high-performance web properties",
    company: "VNETWORK",
    period: "2020 – 2021",
    tech: ["Go", "Next.js", "Keycloak", "PostgreSQL"],
    metrics: [
      { value: "1500+", label: "RESTful APIs" },
      { value: "<200ms", label: "P95 Latency" },
      { value: "100+", label: "DB Tables" },
      { value: "90+", label: "PageSpeed" },
      { value: "45+", label: "Domains" },
    ],
    bullets: [
      "Architected & Developed a massive backend ecosystem comprising 1500+ RESTful APIs for internal CRM and ERP modules using Go (Gin, SQLC), achieving a p95 latency of <200ms even under high concurrent loads.",
      "Analyzed requirements and designed DB schemas for 100+ tables, translating into actionable tickets.",
      "Built high-performance platforms with Next.js (App Router) + ISR achieving PageSpeed 90+.",
      "Integrated centralized Keycloak SSO with fine-grained RBAC for a modular system of 45+ domains.",
    ],
    architectureDiagram: {
      nodes: [
        {
          id: "users",
          label: "Users",
          sublabel: "45+ Domains",
          x: 50,
          y: 5,
          type: "client",
        },
        { id: "cdn", label: "CDN / Edge", x: 50, y: 20, type: "gateway" },
        {
          id: "next",
          label: "Next.js",
          sublabel: "ISR + SSR",
          x: 50,
          y: 35,
          type: "gateway",
        },
        {
          id: "pages",
          label: "Landing Pages",
          sublabel: "PageSpeed 90+",
          x: 18,
          y: 52,
          type: "service",
        },
        { id: "portal", label: "Data Portal", x: 42, y: 52, type: "service" },
        { id: "admin", label: "Admin Panel", x: 66, y: 52, type: "service" },
        { id: "kc", label: "Keycloak SSO", x: 22, y: 72, type: "worker" },
        {
          id: "rbac",
          label: "Fine-grained RBAC",
          x: 22,
          y: 88,
          type: "worker",
        },
        { id: "goapi", label: "Go REST API", x: 60, y: 72, type: "service" },
        {
          id: "schema",
          label: "100+ DB Tables",
          x: 60,
          y: 88,
          type: "service",
        },
        { id: "db", label: "PostgreSQL", x: 40, y: 95, type: "storage" },
        { id: "cache", label: "Redis", x: 80, y: 88, type: "storage" },
      ],
      edges: [
        { from: "users", to: "cdn", animated: true },
        { from: "cdn", to: "next", animated: true },
        { from: "next", to: "pages" },
        { from: "next", to: "portal" },
        { from: "next", to: "admin" },
        { from: "portal", to: "kc" },
        { from: "portal", to: "goapi", animated: true },
        { from: "kc", to: "rbac" },
        { from: "goapi", to: "schema" },
        { from: "schema", to: "db", animated: true },
        { from: "kc", to: "db" },
        { from: "goapi", to: "cache" },
      ],
      groups: [
        { label: "Web Platform", nodeIds: ["pages", "portal", "admin"] },
        { label: "Authentication", nodeIds: ["kc", "rbac"] },
        { label: "Go Backend", nodeIds: ["goapi", "schema"] },
      ],
    },
  },
];

export const achievements: Achievement[] = [
  { icon: "zap", metric: "80%", label: "Cloud Infra Automated" },
  { icon: "bar-chart", metric: "1500+", label: "API Endpoints Built" },
  { icon: "clock", metric: "<1s", label: "P95 Latency" },
  { icon: "award", metric: "90+", label: "PageSpeed Score" },
];

export const education: EducationType = {
  degree: "Bachelor of Information Technology",
  school: "Hutech University",
  period: "2017 – 2021",
};

export const aboutText =
  "A results-oriented full-stack engineer with 4+ years of experience designing and building enterprise cloud platforms, financial APIs, and data-driven web applications. Passionate about clean architecture, infrastructure as code, and developer experience. Specialized in navigating Agile/Scrum environments and bridging complex business requirements with architectural excellence.";

export const stats: Stat[] = [
  { value: 4, suffix: "+", label: "Years Experience" },
  { value: 3, suffix: "", label: "Major Projects" },
  { value: 80, suffix: "%", label: "Infra Automated" },
];

export const hobbies: Hobby[] = [
  {
    icon: "code",
    label: "Open Source",
    description: "Contributing to OSS projects & building dev tools",
  },
  {
    icon: "gamepad",
    label: "Gaming",
    description: "Strategy & RPG games for problem-solving fun",
  },
  {
    icon: "music",
    label: "Music",
    description: "Listening to lo-fi & chill beats while coding",
  },
  {
    icon: "book",
    label: "Reading",
    description: "Tech blogs, system design papers & manga",
  },
  {
    icon: "coffee",
    label: "Coffee",
    description: "Exploring specialty coffee & brewing methods",
  },
  {
    icon: "globe",
    label: "Travel",
    description: "Discovering new cultures & street food",
  },
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
