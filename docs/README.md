# Profilio - Portfolio Website

Modern portfolio website built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Runtime**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Animation**: motion 12.29.2 (Framer Motion for React 19)
- **Utilities**: clsx, tailwind-merge

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Project Structure

```
profilio/
├── app/
│   ├── layout.tsx          # Root layout with fonts, theme, metadata
│   ├── page.tsx            # Home page with all sections
│   ├── globals.css         # Global styles, CSS variables, theme tokens
│   ├── sitemap.ts          # SEO sitemap
│   └── robots.ts           # SEO robots.txt
├── components/
│   ├── layout/
│   │   ├── navbar.tsx      # Fixed navbar with mobile menu, theme toggle
│   │   └── footer.tsx      # Footer with social links
│   ├── providers/
│   │   └── theme-provider.tsx  # Dark/light theme context
│   ├── sections/
│   │   ├── hero.tsx        # Hero section with animated gradient orbs
│   │   ├── about.tsx       # About section with stats
│   │   ├── skills.tsx      # Categorized skills grid
│   │   ├── experience.tsx  # Work experience timeline
│   │   ├── achievements.tsx # Key metrics
│   │   ├── education.tsx   # Education background
│   │   └── contact.tsx     # Contact form/links
│   └── ui/
│       ├── glass-card.tsx      # Glassmorphism card component
│       ├── scroll-reveal.tsx   # Scroll animation wrapper
│       ├── animated-counter.tsx # Number counter animation
│       ├── theme-toggle.tsx    # Dark/light mode toggle button
│       └── section-heading.tsx # Consistent section headers
├── lib/
│   ├── data.ts             # Portfolio data (skills, experience, etc.)
│   ├── constants.ts        # Site config, nav links
│   └── utils.ts            # cn() utility for class merging
└── docs/
    ├── README.md           # This file
    ├── codebase-summary.md # Architecture overview
    ├── code-standards.md   # Coding conventions
    └── design-guidelines.md # Design system reference
```

## Features

### Design System

- **Dark mode default** with light mode toggle
- **Glassmorphism** cards with backdrop blur
- **Emerald accent** (#10b981) throughout
- **Typography**: Space Grotesk (headings), JetBrains Mono (code)
- **CSS Variables** for theme switching in `globals.css`
- **Responsive** breakpoints via Tailwind

### Performance

- Next.js App Router with React Server Components
- Optimized fonts with `next/font/google` (display: swap)
- SEO: sitemap, robots.txt, JSON-LD schema
- FOUC prevention: inline script sets theme before hydration

### Animation

- `motion` (Framer Motion) for:
  - Hero entrance animations
  - Scroll-triggered reveals (`whileInView`)
  - Mobile menu transitions
  - Animated gradient orbs
- Respects `prefers-reduced-motion`

## Customization

### Update Content

Edit `/lib/data.ts` and `/lib/constants.ts`:

```ts
// lib/constants.ts
export const siteConfig = {
  name: "[YOUR FULL NAME]",
  title: "Senior Full-Stack Engineer | Platform & Data Architect",
  url: "https://profilio.vercel.app",
  links: {
    github: "https://github.com/[USERNAME]",
    linkedin: "https://linkedin.com/in/[USERNAME]",
    email: "[EMAIL]",
  },
};
```

### Theme Colors

Modify CSS variables in `/app/globals.css`:

```css
:root {
  --accent: #10b981;        /* emerald-500 */
  --accent-hover: #34d399;  /* emerald-400 */
  /* ... */
}
```

### Sections

Add/remove sections in `/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      {/* Add new section */}
    </>
  );
}
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or push to GitHub and import in Vercel dashboard.

### Other Platforms

Build output is in `.next/`. Supports any Node.js hosting:

- Netlify
- Railway
- Render
- AWS/GCP/Azure

## Environment Variables

None required for basic deployment. Add these if needed:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Update `lib/constants.ts` accordingly.

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2017+ features required
- CSS Grid, CSS Variables, backdrop-filter support needed

## License

MIT (adjust as needed)
