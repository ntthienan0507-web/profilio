export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Experience {
  title: string;
  subtitle: string;
  company: string;
  period: string;
  tech: string[];
  metrics: { value: string; label: string }[];
  bullets: string[];
}

export interface Achievement {
  icon: string;
  metric: string;
  label: string;
}

export interface Education {
  degree: string;
  school: string;
  period: string;
}

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
  },
];

export const achievements: Achievement[] = [
  { icon: "zap", metric: "80%", label: "Cloud Infra Automated" },
  { icon: "bar-chart", metric: "85+", label: "API Endpoints Built" },
  { icon: "clock", metric: "<1s", label: "P95 Latency" },
  { icon: "award", metric: "90+", label: "PageSpeed Score" },
];

export const education: Education = {
  degree: "Bachelor of Information Technology",
  school: "[University Name]",
  period: "2016 – 2020",
};

export const aboutText =
  "A results-oriented full-stack engineer with 4+ years of experience designing and building enterprise cloud platforms, financial APIs, and data-driven web applications. Passionate about clean architecture, infrastructure as code, and developer experience. Specialized in navigating Agile/Scrum environments and bridging complex business requirements with architectural excellence.";

export const stats = [
  { value: 4, suffix: "+", label: "Years Experience" },
  { value: 3, suffix: "", label: "Major Projects" },
  { value: 80, suffix: "%", label: "Infra Automated" },
];

export interface Hobby {
  icon: string;
  label: string;
  description: string;
}

export const hobbies: Hobby[] = [
  { icon: "code", label: "Open Source", description: "Contributing to OSS projects & building dev tools" },
  { icon: "gamepad", label: "Gaming", description: "Strategy & RPG games for problem-solving fun" },
  { icon: "music", label: "Music", description: "Listening to lo-fi & chill beats while coding" },
  { icon: "book", label: "Reading", description: "Tech blogs, system design papers & manga" },
  { icon: "coffee", label: "Coffee", description: "Exploring specialty coffee & brewing methods" },
  { icon: "globe", label: "Travel", description: "Discovering new cultures & street food" },
];
