# Code Standards

Coding conventions for the Profilio project.

## File Naming

- **Components**: PascalCase (e.g., `HeroSection.tsx`, `GlassCard.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`, `constants.ts`)
- **CSS**: kebab-case (e.g., `globals.css`)

## Component Structure

### Server Components (default)

```tsx
import { SomeComponent } from "@/components/ui/some-component";

export function MySection() {
  return (
    <section>
      {/* content */}
    </section>
  );
}
```

### Client Components

```tsx
"use client";

import { useState } from "react";
import { motion } from "motion/react";

export function InteractiveComponent() {
  const [state, setState] = useState(false);

  return (
    <motion.div>
      {/* interactive content */}
    </motion.div>
  );
}
```

**Rule**: Add `"use client"` directive only when needed (hooks, events, motion).

## TypeScript Conventions

### Interfaces

- **Export** interfaces used across files
- **PascalCase** naming
- Define in `lib/data.ts` or component file

```ts
export interface SkillCategory {
  category: string;
  skills: string[];
}
```

### Props

```tsx
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  // ...
}
```

### Type Imports

```ts
import type { Metadata } from "next";
```

Use `type` keyword for type-only imports.

## Styling

### Tailwind Classes

- **Inline classes** in JSX (no separate CSS modules)
- Use `cn()` utility for conditional classes:

```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  hover && "hover-classes",
  className
)} />
```

### CSS Variables

- Define in `globals.css`
- Access via `var(--name)` or Tailwind token

```tsx
// Direct var
<div className="bg-[var(--glass-bg)]" />

// Tailwind token (after @theme inline mapping)
<div className="bg-glass-bg" />
```

### Responsive Design

```tsx
<div className="px-6 md:px-12 lg:px-16">
  {/* mobile-first breakpoints */}
</div>
```

Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)

## Animation

### motion (Framer Motion)

```tsx
import { motion } from "motion/react";

// Entrance animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {children}
</motion.div>

// Scroll animation
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, margin: "-100px" }}
>
  {children}
</motion.div>
```

**Best practices**:
- Use `ScrollReveal` wrapper for scroll animations
- `viewport={{ once: true }}` to prevent re-triggering
- Cubic bezier easing: `[0.16, 1, 0.3, 1]`

### CSS Animations

For performance-critical animations (e.g., gradient orbs):

```tsx
<style jsx>{`
  @keyframes orb-float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
  }
`}</style>
```

## Data Management

### Static Data

Define in `lib/data.ts` with TypeScript interfaces:

```ts
export interface Experience {
  title: string;
  company: string;
  period: string;
  // ...
}

export const experiences: Experience[] = [
  { title: "...", company: "...", period: "..." },
];
```

### Constants

Site-wide config in `lib/constants.ts`:

```ts
export const siteConfig = {
  name: "Name",
  url: "https://...",
  // ...
};
```

## Import Paths

Use `@/*` alias (maps to project root):

```ts
import { cn } from "@/lib/utils";
import { Hero } from "@/components/sections/hero";
import { siteConfig } from "@/lib/constants";
```

**No relative imports** like `../../lib/utils`.

## Component Organization

### Section Components

```tsx
// components/sections/example.tsx
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function Example() {
  return (
    <section id="example" className="py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeading
          title="Section Title"
          subtitle="Optional subtitle"
        />
        <ScrollReveal>
          {/* content */}
        </ScrollReveal>
      </div>
    </section>
  );
}
```

**Pattern**:
- `id` for anchor links
- Container: `max-w-[1200px] mx-auto px-6`
- Vertical padding: `py-24`

### UI Components

Keep reusable, stateless:

```tsx
// components/ui/example.tsx
import { cn } from "@/lib/utils";

interface ExampleProps {
  variant?: "default" | "accent";
  className?: string;
}

export function Example({ variant = "default", className }: ExampleProps) {
  return (
    <div className={cn(
      "base-classes",
      variant === "accent" && "accent-classes",
      className
    )} />
  );
}
```

## Accessibility

- **Semantic HTML**: `<nav>`, `<section>`, `<footer>`
- **aria-label** on icon buttons:

```tsx
<button aria-label="Toggle menu">
  <MenuIcon />
</button>
```

- **prefers-reduced-motion**: Handled in `globals.css`

## Comments

Use sparingly. Code should be self-documenting via:

- Descriptive variable names
- TypeScript types
- Component structure

Add comments for:

```tsx
// Prevent FOUC: set theme before React hydrates
<script dangerouslySetInnerHTML={{ __html: `...` }} />
```

## Formatting

- **Indentation**: 2 spaces
- **Quotes**: Double quotes for JSX attributes, either for JS
- **Semicolons**: Consistent usage (present in codebase)
- **Line length**: ~80-100 chars (flexible)

## Git Conventions

- **Commits**: Descriptive, imperative mood ("Add feature", not "Added feature")
- **Branches**: `feature/name`, `fix/name`

## Performance Guidelines

- Prefer Server Components (no `"use client"` unless needed)
- Use `next/font` for font optimization
- Lazy load heavy components if needed (not required for this project)
- Optimize images with `next/image` (when images added)
