# Phase 02 - Layout & Shared Components

- **Plan:** [plan.md](./plan.md)
- **Prev:** [Phase 01 - Project Setup](./phase-01-project-setup.md)
- **Next:** [Phase 03 - Hero & About](./phase-03-hero-and-about.md)

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-30 |
| Priority | P1 |
| Status | pending |
| Effort | 2.5h |

## Key Insights

- Navbar should be sticky, glassmorphism background on scroll
- Theme toggle needs `next-themes` or manual implementation (prefer manual for fewer deps)
- Footer is minimal - social links + copyright
- Shared UI components (bento-card, glass-card, scroll-reveal) reused across sections

## Requirements

- Sticky navbar with smooth scroll navigation + glassmorphism on scroll
- Dark/light theme toggle with localStorage persistence
- Reusable UI components: BentoCard, GlassCard, SectionHeading, ScrollReveal
- Footer with social links
- Mobile hamburger menu

## Architecture

### Component Tree

```
<ThemeProvider>
  <html className={fonts}>
    <body>
      <Navbar />
      <main>
        {children}  <!-- page.tsx sections -->
      </main>
      <Footer />
    </body>
  </html>
</ThemeProvider>
```

### Theme Strategy

Manual implementation (no `next-themes` dependency):
1. `ThemeProvider` client component manages state + localStorage
2. Applies `.dark` / `.light` class on `<html>`
3. Default: dark. Reads `localStorage` on mount, falls back to `prefers-color-scheme`
4. Tailwind v4 dark mode via CSS: `@variant dark (&:where(.dark, .dark *));`

## Related Files

| File | Purpose |
|------|---------|
| `components/providers/theme-provider.tsx` | Theme context + localStorage |
| `components/layout/navbar.tsx` | Sticky nav, mobile menu, theme toggle |
| `components/layout/footer.tsx` | Social links, copyright |
| `components/ui/theme-toggle.tsx` | Sun/moon icon toggle button |
| `components/ui/bento-card.tsx` | Bento grid card wrapper |
| `components/ui/glass-card.tsx` | Glassmorphism card |
| `components/ui/section-heading.tsx` | Section title + subtitle |
| `components/ui/scroll-reveal.tsx` | Motion wrapper for scroll animations |
| `components/ui/animated-counter.tsx` | Number counter animation |
| `app/layout.tsx` | Updated with providers + layout components |

## Implementation Steps

### Step 1: Theme Provider

`components/providers/theme-provider.tsx` ("use client"):
- Create `ThemeContext` with `theme` and `toggleTheme`
- On mount: read `localStorage.getItem('theme')` or `prefers-color-scheme`
- On toggle: update state, localStorage, and `<html>` className
- Wrap children with context provider
- Add `suppressHydrationWarning` to `<html>` in layout

### Step 2: Theme Toggle Button

`components/ui/theme-toggle.tsx` ("use client"):
- Sun icon (dark mode active) / Moon icon (light mode active)
- Use inline SVG icons (no icon library needed)
- Smooth rotation animation with `motion`
- `aria-label="Toggle theme"`

### Step 3: Navbar

`components/layout/navbar.tsx` ("use client"):
- Fixed top, full width, z-50
- Glassmorphism background: transparent initially, glass effect on scroll (track `scrollY > 50`)
- Left: Logo/Name text
- Center/Right: Nav links (desktop), each link scrolls to section
- Right: Theme toggle + mobile menu button
- Mobile: Slide-down menu with `AnimatePresence`
- Active section highlighting (optional, use IntersectionObserver)

```tsx
// Scroll detection
const [scrolled, setScrolled] = useState(false)
useEffect(() => {
  const handler = () => setScrolled(window.scrollY > 50)
  window.addEventListener('scroll', handler)
  return () => window.removeEventListener('scroll', handler)
}, [])
```

### Step 4: Footer

`components/layout/footer.tsx` (Server Component):
- Minimal design: horizontal line separator
- Row: social icon links (GitHub, LinkedIn, Email)
- Copyright text: `"[YEAR] [YOUR FULL NAME]. All rights reserved."`
- Use inline SVG for social icons

### Step 5: BentoCard

`components/ui/bento-card.tsx`:
- Props: `className`, `children`, optional `colSpan`, `rowSpan`
- Dark card background with subtle border
- Hover effect: slight border glow (accent color)
- Use `cn()` for class merging
- Grid span via Tailwind classes

```tsx
interface BentoCardProps {
  children: React.ReactNode
  className?: string
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2
}
```

### Step 6: GlassCard

`components/ui/glass-card.tsx`:
- Similar to BentoCard but with glassmorphism
- `backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl`
- Hover: `bg-white/10` transition

### Step 7: SectionHeading

`components/ui/section-heading.tsx`:
- Props: `title`, `subtitle?`, `align?`
- Accent-colored dash/line above title
- Title in Space Grotesk (font-heading)
- Subtitle in muted color

### Step 8: ScrollReveal

`components/ui/scroll-reveal.tsx` ("use client"):
- Wrapper using `motion.div` with `whileInView`
- Props: `children`, `direction?` (up/down/left/right), `delay?`, `className?`
- Default: fade up with 0.5s duration
- `viewport={{ once: true, margin: "-100px" }}`
- Respect `prefers-reduced-motion`

```tsx
'use client'
import { motion } from 'motion/react'

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  className?: string
}
```

### Step 9: AnimatedCounter

`components/ui/animated-counter.tsx` ("use client"):
- Props: `target: number`, `suffix?: string`, `duration?: number`
- Count from 0 to target when in view
- Use `motion` `useMotionValue` + `useTransform` + `useInView`

### Step 10: Update Root Layout

Wire everything together in `app/layout.tsx`:
- Wrap with `<ThemeProvider>`
- Include `<Navbar />` and `<Footer />`
- Apply font variables + dark class

### Step 11: Add Light Mode CSS Overrides

In `globals.css`, add light theme variables:
```css
.light {
  --color-background: #fafafa;
  --color-foreground: #18181b;
  --color-muted: #a1a1aa;
  --color-card: rgba(0, 0, 0, 0.03);
  --color-card-border: rgba(0, 0, 0, 0.08);
  --color-glass: rgba(255, 255, 255, 0.7);
}
```

## Todo

- [ ] Create ThemeProvider with localStorage persistence
- [ ] Create ThemeToggle with sun/moon icons
- [ ] Build Navbar (sticky, glass, mobile menu)
- [ ] Build Footer (social links, copyright)
- [ ] Create BentoCard component
- [ ] Create GlassCard component
- [ ] Create SectionHeading component
- [ ] Create ScrollReveal motion wrapper
- [ ] Create AnimatedCounter component
- [ ] Update root layout with providers
- [ ] Add light mode CSS variables
- [ ] Test theme toggle persistence across reload

## Success Criteria

- Navbar sticks to top, glass effect appears on scroll
- Theme toggle switches dark/light, persists on refresh
- Mobile menu opens/closes with animation
- ScrollReveal animates elements on scroll
- All shared components render correctly in isolation

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Theme flash on load (FOUC) | Medium | Add inline script in `<head>` to set class before React hydrates |
| Glassmorphism perf on mobile | Low | Use `will-change: backdrop-filter` sparingly |
| ScrollReveal jank | Low | Use `transform`/`opacity` only (GPU accelerated) |

## Security Considerations

- No external scripts loaded
- Social links use `rel="noopener noreferrer"` for external links

## Next Steps

Proceed to [Phase 03 - Hero & About](./phase-03-hero-and-about.md)
