---
title: "Profilio - Developer Portfolio Website"
description: "Next.js 15 portfolio with bento grid, glassmorphism, dark theme, Framer Motion animations"
status: pending
priority: P1
effort: 16h
branch: main
tags: [nextjs, portfolio, react19, tailwindv4, framer-motion]
created: 2026-01-30
---

# Profilio - Implementation Plan

Single-page portfolio for a Senior Full-Stack Engineer. Dark theme primary, bento grid layout, glassmorphism, smooth animations. Target: PageSpeed 90+, Vercel deploy-ready.

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript 5
- Tailwind CSS v4 (CSS-first config)
- `motion` package (Framer Motion React 19 compatible)
- Fonts: Space Grotesk (headings) + JetBrains Mono (code/accents)
- Vercel deployment

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Project Setup | 2h | pending | [phase-01](./phase-01-project-setup.md) |
| 2 | Layout & Shared Components | 2.5h | pending | [phase-02](./phase-02-layout-and-components.md) |
| 3 | Hero & About Sections | 2.5h | pending | [phase-03](./phase-03-hero-and-about.md) |
| 4 | Skills & Experience Sections | 3h | pending | [phase-04](./phase-04-skills-and-experience.md) |
| 5 | Achievements, Education & Contact | 2h | pending | [phase-05](./phase-05-achievements-and-education.md) |
| 6 | SEO & Performance | 2h | pending | [phase-06](./phase-06-seo-and-performance.md) |
| 7 | Testing & Polish | 2h | pending | [phase-07](./phase-07-testing-and-polish.md) |

## Architecture Overview

```
profilio/
├── app/
│   ├── layout.tsx           # Root layout, fonts, theme provider
│   ├── page.tsx             # Single-page: all sections composed
│   ├── globals.css          # Tailwind v4 import + custom properties
│   └── icon.svg             # Favicon
├── components/
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── about.tsx
│   │   ├── skills.tsx
│   │   ├── experience.tsx
│   │   ├── achievements.tsx
│   │   ├── education.tsx
│   │   └── contact.tsx
│   ├── ui/
│   │   ├── bento-card.tsx
│   │   ├── glass-card.tsx
│   │   ├── section-heading.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── scroll-reveal.tsx
│   │   └── animated-counter.tsx
│   └── providers/
│       └── theme-provider.tsx
├── lib/
│   ├── data.ts              # CV content as typed constants
│   ├── constants.ts         # Site metadata, nav links
│   └── utils.ts             # cn() helper, misc utilities
├── public/
│   ├── og-image.jpg
│   └── resume.pdf
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## Key Decisions

1. **Single page** - All sections on one page (no routing needed for portfolio)
2. **`motion` package** - Use `motion/react` import for React 19 compatibility
3. **CSS-first Tailwind v4** - No `tailwind.config.js`, use `@theme` in CSS
4. **Data separation** - All CV content in `lib/data.ts` for easy updates
5. **Server Components default** - Only `"use client"` for interactive bits (navbar, theme toggle, animations)
6. **Color palette** - Dark slate base (#0a0a0f) + emerald accent (#10b981) + glass overlays

## Research References

- [Tech Setup Research](../reports/researcher-260130-0902-nextjs15-portfolio-setup.md)
- [Design Trends Research](../reports/research-260130-0859-portfolio-trends.md)
