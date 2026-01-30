# Phase 03 - Hero & About Sections

- **Plan:** [plan.md](./plan.md)
- **Prev:** [Phase 02 - Layout & Components](./phase-02-layout-and-components.md)
- **Next:** [Phase 04 - Skills & Experience](./phase-04-skills-and-experience.md)

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-30 |
| Priority | P1 |
| Status | pending |
| Effort | 2.5h |

## Key Insights

- Hero is first impression; needs animated background + strong typography
- Animated gradient mesh or particle background (CSS only, no canvas for perf)
- About section uses bento grid layout with stats cards
- Both sections above the fold or near it - use `priority` on images

## Requirements

- Hero: full-viewport, name, title, tagline, CTA buttons, animated background
- About: brief intro paragraph, key stats in bento grid (4 years exp, 3 projects, 200+ endpoints, etc.)
- Both sections fully responsive
- Scroll-down indicator on hero

## Architecture

### Hero Layout

```
┌─────────────────────────────────────┐
│         [Animated BG Mesh]          │
│                                     │
│   [YOUR FULL NAME]                  │
│   Senior Full-Stack Engineer        │
│   Platform & Data Architect         │
│                                     │
│   Brief tagline about expertise     │
│                                     │
│   [View Work ↓]  [Get in Touch]    │
│                                     │
│         ↓ scroll indicator          │
└─────────────────────────────────────┘
```

### About Bento Layout

```
┌──────────────┬──────────┬──────────┐
│              │  4+      │  3       │
│  About text  │  Years   │  Major   │
│  paragraph   │  Exp     │  Projects│
│              ├──────────┼──────────┤
│              │  200+    │  80%     │
│              │  API     │  Infra   │
│              │  Endpts  │  Automated│
└──────────────┴──────────┴──────────┘
```

## Related Files

| File | Purpose |
|------|---------|
| `components/sections/hero.tsx` | Hero section |
| `components/sections/about.tsx` | About section with bento stats |
| `app/page.tsx` | Compose sections |

## Implementation Steps

### Step 1: Hero Section

`components/sections/hero.tsx` ("use client" for animations):

**Animated Background:**
- CSS gradient mesh using multiple radial gradients
- Animate with `motion` - slow shifting positions
- Colors: accent green + deep purple/blue blobs on dark background
- Use `position: absolute`, `z-index: 0`, with content above at `z-index: 1`

```css
/* Animated gradient orbs */
.hero-bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
}
```

Animate 2-3 gradient orbs with `motion.div`:
```tsx
<motion.div
  className="hero-bg-orb bg-emerald-500 w-96 h-96"
  animate={{
    x: [0, 100, -50, 0],
    y: [0, -80, 60, 0],
  }}
  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
/>
```

**Content:**
- Name: `text-5xl md:text-7xl font-heading font-bold`
- Title: `text-xl md:text-2xl text-muted`
- Tagline: 1-2 lines, `text-lg text-muted`
- CTA buttons:
  - Primary: "View My Work" - scrolls to `#experience`, accent bg
  - Secondary: "Get in Touch" - scrolls to `#contact`, outline style
- Staggered entrance animation (name -> title -> tagline -> buttons)

```tsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}
```

**Scroll Indicator:**
- Animated chevron/arrow at bottom center
- `motion.div` with `animate={{ y: [0, 8, 0] }}` loop
- Clicking scrolls to `#about`

### Step 2: About Section

`components/sections/about.tsx`:

**Layout:** Bento grid
- Left column (span 2): Glass card with intro paragraph
- Right column: 2x2 grid of stat cards

**Intro Text:**
- 2-3 sentences about expertise, experience, passion
- Pull from `lib/data.ts` objective field
- Highlight keywords with accent color `<span>`

**Stats Cards** (use AnimatedCounter):
```ts
const stats = [
  { value: 4, suffix: '+', label: 'Years Experience' },
  { value: 3, label: 'Major Projects' },
  { value: 200, suffix: '+', label: 'API Endpoints Built' },
  { value: 80, suffix: '%', label: 'Infra Automated' },
]
```

Each stat card:
- BentoCard with hover glow effect
- Large number (AnimatedCounter) in accent color
- Label in muted text below
- JetBrains Mono for numbers

**Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <GlassCard className="md:col-span-2 md:row-span-2">
    {/* intro text */}
  </GlassCard>
  {stats.map(stat => (
    <BentoCard key={stat.label}>
      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
      <p>{stat.label}</p>
    </BentoCard>
  ))}
</div>
```

### Step 3: Compose in Page

`app/page.tsx`:
```tsx
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
// ... other sections

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      {/* ... remaining sections */}
    </>
  )
}
```

### Step 4: Section Container Pattern

Each section follows a consistent pattern:
```tsx
<section id="about" className="py-20 md:py-32 px-4 max-w-6xl mx-auto">
  <ScrollReveal>
    <SectionHeading title="About Me" subtitle="Get to know me" />
  </ScrollReveal>
  {/* content */}
</section>
```

## Todo

- [ ] Create hero animated gradient background (CSS + motion)
- [ ] Build hero content with staggered entrance animation
- [ ] Add CTA buttons with hover effects
- [ ] Add scroll-down indicator
- [ ] Create about section bento grid layout
- [ ] Integrate AnimatedCounter for stats
- [ ] Wire hero + about into page.tsx
- [ ] Test responsive layout (mobile, tablet, desktop)
- [ ] Test animations (entrance, scroll reveal, counters)

## Success Criteria

- Hero fills viewport, gradient orbs animate smoothly
- Text entrance animation staggers correctly
- CTA buttons scroll to correct sections
- About stats count up when scrolled into view
- Bento grid collapses to single column on mobile
- No layout shift during animations

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Gradient orbs cause jank | Medium | Use `will-change: transform`, limit to 2-3 orbs |
| AnimatedCounter fires early | Low | Use `useInView` with `once: true` |
| Hero too tall on small screens | Low | Use `min-h-screen` not `h-screen`, allow scroll |

## Security Considerations

- No user input in this phase
- Placeholder text only, no PII in codebase

## Next Steps

Proceed to [Phase 04 - Skills & Experience](./phase-04-skills-and-experience.md)
