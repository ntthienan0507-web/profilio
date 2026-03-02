export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ArchNode {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  type: "client" | "gateway" | "service" | "worker" | "storage" | "monitor";
}

export interface ArchEdge {
  from: string;
  to: string;
  animated?: boolean;
}

export interface ArchGroup {
  label: string;
  nodeIds: string[];
}

export interface ArchDiagramData {
  nodes: ArchNode[];
  edges: ArchEdge[];
  groups?: ArchGroup[];
}

export interface Experience {
  title: string;
  subtitle: string;
  company: string;
  period: string;
  tech: string[];
  metrics: { value: string; label: string }[];
  bullets: string[];
  architectureDiagram?: ArchDiagramData;
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

export interface Hobby {
  icon: string;
  label: string;
  description: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export interface NavLink {
  label: string;
  href: string;
}

export interface PortfolioContent {
  siteConfig: SiteConfig;
  navLinks: NavLink[];
  aboutText: string;
  stats: Stat[];
  skills: SkillCategory[];
  experiences: Experience[];
  achievements: Achievement[];
  education: Education;
  hobbies: Hobby[];
}
