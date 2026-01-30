# Codebase Summary

Overview of Profilio's architecture, file structure, and data flow.

## Architecture

**Next.js 15 App Router** with React Server Components (RSC) pattern:

- **Server Components** (default): `app/layout.tsx`, `app/page.tsx`
- **Client Components** (`"use client"`): All interactive UI (navbar, theme, animations)
- **Data Layer**: Static TypeScript objects in `lib/data.ts` (no external API/DB)

## File Structure

### `/app` - Next.js App Router

| File | Purpose | Type |
|------|---------|------|
| `layout.tsx` | Root layout: fonts, ThemeProvider, Navbar, Footer | Server |
| `page.tsx` | Home page: imports/renders all sections | Server |
| `globals.css` | CSS variables, theme tokens, Tailwind imports | CSS |
| `sitemap.ts` | Dynamic sitemap generation | Server |
| `robots.ts` | Dynamic robots.txt | Server |

### `/components` - React Components

#### Layout (`components/layout/`)

- `navbar.tsx`: Fixed navbar, scroll-based blur, mobile menu, ThemeToggle
- `footer.tsx`: Social links, copyright

#### Providers (`components/providers/`)

- `theme-provider.tsx`: Theme context (dark/light), localStorage persistence

#### Sections (`components/sections/`)

All sections use `ScrollReveal` for entrance animations:

- `hero.tsx`: Name, title, CTA buttons, animated gradient orbs
- `about.tsx`: Bio text, animated stat counters
- `skills.tsx`: Grid of skill categories (Languages, Frameworks, etc.)
- `experience.tsx`: Timeline cards (GlassCard wrapper)
- `achievements.tsx`: 4 key metrics with icons
- `education.tsx`: Degree, school, period
- `contact.tsx`: Email/social links

#### UI (`components/ui/`)

Reusable primitives:

- `glass-card.tsx`: Glassmorphism card with hover state
- `scroll-reveal.tsx`: Wrapper for `motion` scroll animations
- `animated-counter.tsx`: Number counting animation (used in About stats)
- `theme-toggle.tsx`: Sun/moon icon toggle button
- `section-heading.tsx`: Consistent `<h2>` + subtitle pattern

### `/lib` - Utilities & Data

| File | Exports | Purpose |
|------|---------|---------|
| `data.ts` | `skills`, `experiences`, `achievements`, `education`, `aboutText`, `stats` | Portfolio content as typed objects |
| `constants.ts` | `siteConfig`, `navLinks` | Site metadata, navigation config |
| `utils.ts` | `cn()` | Merges Tailwind classes via `clsx` + `tailwind-merge` |

## Data Flow

```
lib/data.ts → components/sections/*.tsx → app/page.tsx → user
     ↓
  (TypeScript interfaces ensure type safety)
```

1. **Data defined** in `lib/data.ts` with TypeScript interfaces
2. **Sections import** and map over data (e.g., `skills.map()`, `experiences.map()`)
3. **Page assembles** sections in order
4. **Layout wraps** with theme, fonts, nav/footer

### Example Flow: Skills Section

```ts
// lib/data.ts
export interface SkillCategory {
  category: string;
  skills: string[];
}
export const skills: SkillCategory[] = [
  { category: "Languages", skills: ["Go 1.24", "Ruby 3.2", ...] },
  // ...
];

// components/sections/skills.tsx
import { skills } from "@/lib/data";
{skills.map(cat => <div>{cat.category}: {cat.skills.join(", ")}</div>)}

// app/page.tsx
import { Skills } from "@/components/sections/skills";
<Skills />
```

## Key Components

### GlassCard

Reusable glassmorphism container:

```tsx
<GlassCard hover={true}>
  {/* content */}
</GlassCard>
```

Props:
- `hover`: Enable hover lift effect (default: `true`)
- `className`: Additional Tailwind classes

### ScrollReveal

Entrance animation wrapper:

```tsx
<ScrollReveal direction="up" delay={0.1}>
  {/* content fades in on scroll */}
</ScrollReveal>
```

Props:
- `direction`: `"up"` | `"down"` | `"left"` | `"right"`
- `delay`: Delay in seconds
- Triggers once when 100px from viewport

### ThemeProvider

Context provider for dark/light mode:

```tsx
const { theme, toggleTheme } = useTheme();
```

- Reads `localStorage` on mount
- Falls back to `prefers-color-scheme`
- Sets `<html class="light">` for light mode

## Styling Approach

1. **CSS Variables** in `globals.css` (`:root` for dark, `.light` for light)
2. **Tailwind v4 `@theme inline`** maps CSS vars to Tailwind tokens
3. **Inline Tailwind** classes in JSX
4. **cn() utility** for conditional class merging

Example:

```tsx
// globals.css
:root {
  --accent: #10b981;
}

@theme inline {
  --color-accent: var(--accent);
}

// component
<div className="text-[var(--accent)]">Emerald text</div>
<div className="text-accent">Same via Tailwind token</div>
```

## Animation Strategy

- **Hero**: `motion.div` with `initial`/`animate` (entrance)
- **Sections**: `ScrollReveal` wrapper using `whileInView`
- **Navbar**: `AnimatePresence` for mobile menu height transition
- **Orbs**: CSS `@keyframes` for performance (GPU-accelerated)

Respects `prefers-reduced-motion` via global CSS rule.

## SEO Implementation

- **Metadata**: Defined in `layout.tsx` (OpenGraph, Twitter cards)
- **JSON-LD**: Person schema in `page.tsx`
- **Sitemap**: Auto-generated at `/sitemap.xml`
- **Robots**: Auto-generated at `/robots.txt`

## TypeScript Configuration

- **Strict mode** enabled
- **Path alias**: `@/*` maps to project root
- **JSX**: `react-jsx` (no need for React import)
- **Target**: ES2017

## Performance Optimizations

- Server Components for static content
- Font optimization with `next/font/google`
- `viewport={{ once: true }}` in ScrollReveal (animate once)
- Inline theme script prevents FOUC
- Passive scroll listeners
