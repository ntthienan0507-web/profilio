# Phase 06 - SEO & Performance Optimization

- **Plan:** [plan.md](./plan.md)
- **Prev:** [Phase 05 - Achievements, Education & Contact](./phase-05-achievements-and-education.md)
- **Next:** [Phase 07 - Testing & Polish](./phase-07-testing-and-polish.md)

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-30 |
| Priority | P1 |
| Status | pending |
| Effort | 2h |

## Key Insights

- Next.js Metadata API handles `<head>` tags declaratively
- JSON-LD structured data improves rich snippet visibility
- Server Components reduce client JS bundle by default
- Single-page portfolio = simple SEO (one route to optimize)
- `next/font` already handles font optimization (Phase 01)

## Requirements

- Complete metadata (title, description, OG tags, Twitter cards)
- JSON-LD structured data (Person + WebSite schemas)
- Favicon + Apple touch icon
- Sitemap + robots.txt
- Image optimization config
- Lighthouse score 90+ (all categories)
- Bundle size monitoring

## Architecture

### SEO Files

```
app/
├── layout.tsx          # Base metadata
├── page.tsx            # Page-specific metadata
├── sitemap.ts          # Dynamic sitemap generation
├── robots.ts           # Robots.txt generation
├── manifest.ts         # Web app manifest (optional)
├── icon.svg            # Favicon
└── opengraph-image.jpg # Default OG image (or generate)
```

## Related Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Base metadata, JSON-LD script |
| `app/page.tsx` | Page metadata override |
| `app/sitemap.ts` | Sitemap generation |
| `app/robots.ts` | Robots.txt |
| `public/og-image.jpg` | Open Graph image |
| `next.config.ts` | Image optimization, headers |

## Implementation Steps

### Step 1: Base Metadata in Layout

`app/layout.tsx` - add metadata export:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://profilio.vercel.app'),
  title: {
    default: '[YOUR FULL NAME] | Senior Full-Stack Engineer',
    template: '%s | [YOUR FULL NAME]'
  },
  description: 'Portfolio of [YOUR FULL NAME] - Senior Full-Stack Engineer specializing in Go, Ruby, TypeScript, Kubernetes, and Cloud Infrastructure. 4+ years building scalable platforms.',
  keywords: ['full-stack engineer', 'Go developer', 'Ruby developer', 'TypeScript', 'Kubernetes', 'cloud infrastructure', 'portfolio'],
  authors: [{ name: '[YOUR FULL NAME]' }],
  creator: '[YOUR FULL NAME]',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://profilio.vercel.app',
    title: '[YOUR FULL NAME] | Senior Full-Stack Engineer',
    description: 'Senior Full-Stack Engineer specializing in scalable cloud platforms and financial systems.',
    siteName: '[YOUR FULL NAME] Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '[YOUR FULL NAME] - Senior Full-Stack Engineer',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '[YOUR FULL NAME] | Senior Full-Stack Engineer',
    description: 'Senior Full-Stack Engineer specializing in scalable cloud platforms.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

### Step 2: JSON-LD Structured Data

Add to `app/layout.tsx` body:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: '[YOUR FULL NAME]',
      jobTitle: 'Senior Full-Stack Engineer',
      description: 'Platform & Data Architect with 4+ years experience',
      url: 'https://profilio.vercel.app',
      sameAs: [
        'https://github.com/[USERNAME]',
        'https://linkedin.com/in/[USERNAME]',
      ],
      knowsAbout: ['Go', 'Ruby', 'TypeScript', 'Kubernetes', 'PostgreSQL', 'Cloud Infrastructure'],
      worksFor: {
        '@type': 'Organization',
        name: 'VNETWORK',
      },
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: '[University Name]',
      },
    }),
  }}
/>
```

Also add WebSite schema:
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "[YOUR FULL NAME] Portfolio",
  "url": "https://profilio.vercel.app"
}
```

### Step 3: Sitemap

`app/sitemap.ts`:
```ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://profilio.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
```

### Step 4: Robots.txt

`app/robots.ts`:
```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://profilio.vercel.app/sitemap.xml',
  }
}
```

### Step 5: Performance Optimizations

**next.config.ts additions:**
```ts
const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,  // if available
  },
}
```

**Component-level optimizations:**
1. Ensure all section components are Server Components except those with animations
2. Dynamic import for heavy client components:
   ```tsx
   import dynamic from 'next/dynamic'
   const ScrollReveal = dynamic(() => import('@/components/ui/scroll-reveal'), {
     ssr: false,
   })
   ```
3. Add `loading="lazy"` to below-fold images
4. Add `priority` to hero images/assets

**CSS optimizations:**
- Ensure no unused CSS (Tailwind v4 handles tree-shaking)
- Minimize custom CSS in globals.css
- Use CSS `content-visibility: auto` for below-fold sections:
  ```css
  section:not(:first-child) {
    content-visibility: auto;
    contain-intrinsic-size: auto 500px;
  }
  ```

### Step 6: Accessibility Headers

Add security + performance headers in `next.config.ts`:
```ts
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
      ],
    },
  ]
},
```

### Step 7: OG Image

Option A (simple): Create a static 1200x630 OG image in `/public/og-image.jpg`

Option B (dynamic): Use `next/og` ImageResponse:
```ts
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = '[YOUR FULL NAME] - Senior Full-Stack Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ /* dark bg, name, title styled */ }}>
        <h1>[YOUR FULL NAME]</h1>
        <p>Senior Full-Stack Engineer</p>
      </div>
    ),
    { ...size }
  )
}
```

Recommend Option A for simplicity; Option B as enhancement.

## Todo

- [ ] Add complete Metadata export to layout.tsx
- [ ] Add JSON-LD Person + WebSite schemas
- [ ] Create app/sitemap.ts
- [ ] Create app/robots.ts
- [ ] Create/add OG image (1200x630)
- [ ] Add favicon (app/icon.svg)
- [ ] Add security headers to next.config.ts
- [ ] Dynamic import for heavy client components
- [ ] Add content-visibility CSS for below-fold sections
- [ ] Verify metadata renders in HTML source

## Success Criteria

- `<title>`, `<meta description>`, OG tags present in HTML source
- JSON-LD script renders valid schema (test with Schema.org validator)
- `/sitemap.xml` returns valid sitemap
- `/robots.txt` returns valid robots
- OG image displays in social share preview tools
- No render-blocking resources
- Client JS bundle < 100KB (first load)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| OG image not showing on social platforms | Medium | Test with Twitter Card Validator, Facebook Debugger |
| JSON-LD validation errors | Low | Validate with Google Rich Results Test |
| Dynamic imports causing layout shift | Low | Use proper `ssr: false` + fallback |

## Security Considerations

- Security headers prevent clickjacking, XSS, MIME sniffing
- No sensitive data in metadata
- Placeholder URLs for personal links

## Next Steps

Proceed to [Phase 07 - Testing & Polish](./phase-07-testing-and-polish.md)
