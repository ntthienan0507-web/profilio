# Phase 04 - Skills & Experience Sections

- **Plan:** [plan.md](./plan.md)
- **Prev:** [Phase 03 - Hero & About](./phase-03-hero-and-about.md)
- **Next:** [Phase 05 - Achievements, Education & Contact](./phase-05-achievements-and-education.md)

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-30 |
| Priority | P1 |
| Status | pending |
| Effort | 3h |

## Key Insights

- Skills use bento grid with category grouping (Languages, Frameworks, Infra, etc.)
- Experience is a vertical timeline with alternating cards
- Each experience card has project name, description, and bullet points
- Visual tech icons enhance the skills section appeal

## Requirements

- Skills: categorized grid showing all technologies from CV
- Experience: timeline layout with 3 project cards + company info
- Scroll-reveal animations on all elements
- Hover effects on skill items and experience cards

## Architecture

### Skills Data Structure

```ts
// lib/data.ts
interface SkillCategory {
  name: string
  icon: string  // emoji or inline SVG
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    name: 'Languages',
    icon: '{ }',
    skills: ['Go 1.24', 'Ruby 3.2', 'TypeScript 5', 'SQL', 'Bash']
  },
  {
    name: 'Frameworks',
    icon: '< />',
    skills: ['Gin', 'GORM', 'SQLC', 'Next.js', 'React 18', 'Rails 7.1', 'Strapi CMS']
  },
  {
    name: 'Infrastructure',
    icon: '[ ]',
    skills: ['Kubernetes', 'Docker', 'VMware vSphere', 'OpenNebula', 'GitLab CI']
  },
  {
    name: 'Storage & Data',
    icon: 'db',
    skills: ['PostgreSQL', 'Redis', 'InfluxDB', 'AWS S3', 'MinIO']
  },
  {
    name: 'Observability',
    icon: '>>',
    skills: ['Elastic APM', 'ELK Stack', 'Grafana', 'NetBox', 'Observium']
  },
  {
    name: 'Management',
    icon: '##',
    skills: ['Jira', 'Confluence', 'Agile/Scrum']
  },
  {
    name: 'Methodologies',
    icon: '**',
    skills: ['SOLID', 'Clean Architecture', 'TDD', 'SEO Strategy', 'RBAC']
  }
]
```

### Experience Data Structure

```ts
interface Experience {
  id: number
  title: string
  company: string
  period: string
  description: string
  bullets: string[]
  techStack: string[]
}

export const experiences: Experience[] = [
  {
    id: 1,
    title: 'Service Management & Infrastructure Controller',
    company: 'VNETWORK',
    period: 'Jan 2020 - Present',
    description: 'IaaS platform for automated cloud resource orchestration.',
    bullets: [
      'Architected API gateway managing 13 microservices and 133+ endpoints with RSA-encrypted JWT',
      'Developed 50+ background job classes for K8s cluster provisioning via CRDs',
      'Implemented RBS/Steep for type-safe Ruby in infrastructure operations',
      'Managed sprints and delivery via Jira'
    ],
    techStack: ['Ruby', 'Rails 7.1', 'Kubernetes', 'Docker', 'PostgreSQL', 'Redis']
  },
  // ... 2 more projects
]
```

### Skills Grid Layout

```
┌──────────┬──────────┬──────────┐
│Languages │Frameworks│  Infra   │
│          │          │          │
├──────────┼──────────┼──────────┤
│Storage   │Observ.  │Management│
│          │          │          │
├──────────┴──────────┴──────────┤
│        Methodologies           │
└────────────────────────────────┘
```

### Experience Timeline Layout

```
        ┌─────────────────┐
  ●─────│  Project 1      │
  │     │  IaaS Platform  │
  │     └─────────────────┘
  │     ┌─────────────────┐
  ●─────│  Project 2      │
  │     │  BI Financial   │
  │     └─────────────────┘
  │     ┌─────────────────┐
  ●─────│  Project 3      │
        │  DataCentral    │
        └─────────────────┘
```

## Related Files

| File | Purpose |
|------|---------|
| `components/sections/skills.tsx` | Skills bento grid |
| `components/sections/experience.tsx` | Experience timeline |
| `lib/data.ts` | Skills + experience data |

## Implementation Steps

### Step 1: Skills Section

`components/sections/skills.tsx` ("use client" for hover effects):

**Grid Layout:**
- `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- Last row (Methodologies) spans full width: `lg:col-span-3`

**Skill Category Card:**
- GlassCard wrapper
- Category icon in accent color (JetBrains Mono font)
- Category name as subheading
- Skills as pill/tag badges inside card:

```tsx
<div className="flex flex-wrap gap-2">
  {category.skills.map(skill => (
    <span
      key={skill}
      className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10
                 hover:bg-accent/20 hover:border-accent/40 transition-colors"
    >
      {skill}
    </span>
  ))}
</div>
```

**Animation:**
- Staggered scroll-reveal per card
- Skill pills fade in with slight delay

### Step 2: Experience Section

`components/sections/experience.tsx` ("use client"):

**Timeline Structure:**
- Company header at top: "VNETWORK | Senior Full-Stack Engineer | Jan 2020 - Present"
- Vertical line (2px, accent gradient) on left side
- Timeline dots (circles) at each project node
- Cards expand from timeline

**Timeline CSS:**
```tsx
<div className="relative pl-8 md:pl-12">
  {/* Vertical line */}
  <div className="absolute left-3 md:left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent" />

  {experiences.map((exp, i) => (
    <div key={exp.id} className="relative mb-12 last:mb-0">
      {/* Timeline dot */}
      <div className="absolute -left-5 md:-left-7 w-4 h-4 rounded-full bg-accent border-4 border-background" />

      {/* Card */}
      <ScrollReveal delay={i * 0.15}>
        <GlassCard>
          <h3 className="text-xl font-heading font-semibold">{exp.title}</h3>
          <p className="text-sm text-muted mt-1">{exp.description}</p>
          <ul className="mt-4 space-y-2">
            {exp.bullets.map(bullet => (
              <li key={bullet} className="text-sm text-foreground/80 flex gap-2">
                <span className="text-accent mt-1">&#9656;</span>
                {bullet}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 mt-4">
            {exp.techStack.map(tech => (
              <span key={tech} className="text-xs px-2 py-0.5 rounded bg-accent/10 text-accent">
                {tech}
              </span>
            ))}
          </div>
        </GlassCard>
      </ScrollReveal>
    </div>
  ))}
</div>
```

### Step 3: Experience Company Header

Above the timeline:
```tsx
<div className="mb-8">
  <h3 className="text-2xl font-heading font-bold">VNETWORK</h3>
  <p className="text-muted">Senior Full-Stack Engineer &middot; Jan 2020 - Present (4 Years)</p>
</div>
```

### Step 4: Hover Interactions

- Experience cards: subtle scale + border glow on hover
- Tech stack pills: accent highlight on hover
- Timeline dots: pulse animation on scroll reveal

```tsx
<motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
  <GlassCard>{/* ... */}</GlassCard>
</motion.div>
```

## Todo

- [ ] Add skillCategories data to lib/data.ts
- [ ] Add experiences data to lib/data.ts
- [ ] Build Skills section with bento grid
- [ ] Build skill pill/tag components
- [ ] Build Experience timeline layout
- [ ] Build experience card component
- [ ] Add staggered scroll-reveal animations
- [ ] Add hover effects (scale, glow)
- [ ] Test responsive layout at all breakpoints
- [ ] Verify all CV content accurately represented

## Success Criteria

- All 7 skill categories render with correct skills
- Skills pills have hover effects
- Timeline renders with connected line and dots
- All 3 experience cards show correct project info
- Tech stack tags display under each project
- Animations trigger on scroll, not on page load
- Mobile: single column, timeline on left edge

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Too many skill pills cluttering | Medium | Limit visible, or use compact layout on mobile |
| Timeline alignment on mobile | Medium | Simplify to left-aligned on all screens |
| Long bullet text wrapping | Low | Set max-width, use `text-sm` |

## Security Considerations

- All data is static, no external API calls
- Company name and project details are public CV info

## Next Steps

Proceed to [Phase 05 - Achievements, Education & Contact](./phase-05-achievements-and-education.md)
