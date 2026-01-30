# Phase 01 - Project Setup

- **Plan:** [plan.md](./plan.md)
- **Next:** [Phase 02 - Layout & Components](./phase-02-layout-and-components.md)

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-30 |
| Priority | P1 |
| Status | pending |
| Effort | 2h |

## Key Insights

- Next.js 15 uses React 19 by default; Turbopack is default bundler
- Tailwind v4 uses CSS-first config (`@import "tailwindcss"` + `@theme` block)
- Use `motion` package (not `framer-motion`) for React 19 compat
- `next/font` self-hosts Google Fonts at build time (zero CLS)

## Requirements

- Initialize Next.js 15 project with TypeScript, App Router, Tailwind v4
- Configure fonts: Space Grotesk (headings) + JetBrains Mono (code)
- Set up project folder structure
- Install all dependencies
- Configure dark theme CSS custom properties

## Architecture

### Dependencies

```json
{
  "dependencies": {
    "next": "^15.1",
    "react": "^19.0",
    "react-dom": "^19.0",
    "motion": "^12.0",
    "clsx": "^2.1",
    "tailwind-merge": "^3.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0",
    "tailwindcss": "^4.0",
    "typescript": "^5.7",
    "@types/react": "^19.0",
    "@types/react-dom": "^19.0"
  }
}
```

### Font Setup

```tsx
// app/layout.tsx
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})
```

### Tailwind v4 CSS Config

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --font-heading: var(--font-heading);
  --font-mono: var(--font-mono);

  --color-background: #0a0a0f;
  --color-foreground: #e4e4e7;
  --color-muted: #71717a;
  --color-accent: #10b981;
  --color-accent-hover: #34d399;
  --color-card: rgba(255, 255, 255, 0.05);
  --color-card-border: rgba(255, 255, 255, 0.1);
  --color-glass: rgba(255, 255, 255, 0.03);
}
```

## Related Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies |
| `next.config.ts` | Next.js config (image formats, etc) |
| `postcss.config.mjs` | Tailwind v4 PostCSS plugin |
| `tsconfig.json` | TypeScript (auto-generated, add path aliases) |
| `app/globals.css` | Tailwind import + theme tokens |
| `app/layout.tsx` | Root layout with fonts |
| `lib/utils.ts` | `cn()` helper |
| `lib/constants.ts` | Site metadata constants |
| `lib/data.ts` | CV data as typed objects |

## Implementation Steps

### Step 1: Initialize Project

```bash
npx create-next-app@latest profilio --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack
```

Note: If `create-next-app` doesn't support Tailwind v4 by default, install manually:
```bash
npm install tailwindcss @tailwindcss/postcss
```

### Step 2: Install Additional Dependencies

```bash
npm install motion clsx tailwind-merge
```

### Step 3: Configure PostCSS

Create `postcss.config.mjs`:
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

### Step 4: Configure Next.js

Create `next.config.ts`:
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
```

### Step 5: Set Up globals.css

Replace default with Tailwind v4 CSS-first config (see Architecture section above). Include:
- `@import "tailwindcss"`
- `@theme` block with color tokens
- Dark/light theme CSS variables using `@media (prefers-color-scheme)`
- Light mode overrides via `.light` class on `<html>`

Additional custom styles:
```css
/* Glassmorphism utility */
.glass {
  background: var(--color-glass);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-card-border);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar (dark theme) */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--color-background); }
::-webkit-scrollbar-thumb { background: var(--color-muted); border-radius: 3px; }
```

### Step 6: Set Up Root Layout with Fonts

See Font Setup in Architecture section. Apply font variables to `<html>` element.

### Step 7: Create Utility Functions

`lib/utils.ts`:
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Step 8: Create Constants

`lib/constants.ts`:
```ts
export const siteConfig = {
  name: '[YOUR FULL NAME]',
  title: 'Senior Full-Stack Engineer | Platform & Data Architect',
  description: 'Portfolio of [YOUR FULL NAME] - Senior Full-Stack Engineer specializing in Go, Ruby, TypeScript, and Cloud Infrastructure.',
  url: 'https://profilio.vercel.app',
  ogImage: '/og-image.jpg',
  links: {
    github: 'https://github.com/[USERNAME]',
    linkedin: 'https://linkedin.com/in/[USERNAME]',
    email: '[EMAIL]',
  },
}

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
]
```

### Step 9: Create CV Data File

`lib/data.ts` - Extract all CV content from MY-SKILLED.md into typed TypeScript objects:
- `skills` array grouped by category
- `experiences` array with project details
- `achievements` array
- `education` object

### Step 10: Create Folder Structure

```bash
mkdir -p components/{layout,sections,ui,providers}
mkdir -p lib
mkdir -p public
```

## Todo

- [ ] Init Next.js 15 project
- [ ] Install motion, clsx, tailwind-merge
- [ ] Configure postcss.config.mjs for Tailwind v4
- [ ] Configure next.config.ts (image formats)
- [ ] Set up globals.css with theme tokens
- [ ] Set up root layout with fonts
- [ ] Create lib/utils.ts (cn helper)
- [ ] Create lib/constants.ts (site config)
- [ ] Create lib/data.ts (CV content)
- [ ] Create folder structure
- [ ] Verify dev server runs without errors

## Success Criteria

- `npm run dev` starts without errors
- Fonts load correctly (Space Grotesk, JetBrains Mono)
- Tailwind v4 classes apply correctly
- Dark background (#0a0a0f) renders
- TypeScript compiles without errors

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tailwind v4 breaking changes | Medium | Pin version, check migration guide |
| `motion` package API differences | Low | Use `motion/react` import path |
| Font loading flash | Low | `next/font` handles this; use `display: 'swap'` |

## Security Considerations

- No sensitive data in client code
- Placeholder tokens for personal info (no real emails/phones in repo)

## Next Steps

Proceed to [Phase 02 - Layout & Components](./phase-02-layout-and-components.md)
