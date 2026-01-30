# Next.js 15 Portfolio Setup Research

Research Date: 2026-01-30
Status: Complete

## 1. Next.js 15 App Router

### Key Features
- **React 19 Support** - Full integration with React Server Components, Suspense/Streaming, Server Actions
- **Caching Changes** - GET Route Handlers + Client Router Cache now uncached by default
- **Performance** - Up to 76.7% faster local server startup, 96.3% faster Fast Refresh (Turbopack)
- **Build Optimization** - Eliminates redundant rendering, workers share fetch cache across pages

### Folder Structure Best Practices
```
app/
├── (routes)/
│   ├── page.tsx              # Homepage
│   ├── projects/
│   │   ├── page.tsx          # Projects listing
│   │   └── [slug]/page.tsx   # Project detail
│   ├── about/page.tsx
│   └── contact/page.tsx
├── components/               # Shared components
├── lib/                     # Utilities, helpers
└── layout.tsx               # Root layout
```

### Rendering Strategy
- Default to Server Components (no "use client")
- Mark as "use client" only for interactivity (state, events)
- Leverage Server Actions for forms, mutations
- Use `loading.tsx` for Suspense boundaries

## 2. Tailwind CSS v4

### New Features
- **5x faster** full builds, **100x faster** incremental builds
- Built on modern CSS: cascade layers, `@property`, `color-mix()`
- Zero config - auto content detection
- CSS-first configuration (no `tailwind.config.js` required)
- Design tokens available as CSS variables by default

### Setup (Next.js 15.2+)
```bash
npm install @tailwindcss/postcss
```

**postcss.config.mjs:**
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

**app/globals.css:**
```css
@import "tailwindcss";
```

No `tailwind.config.js` needed - auto-scans project.

## 3. Framer Motion

### ⚠️ Compatibility Issue
- **Framer Motion stable not compatible with React 19**
- Next.js 15 uses React 19 by default

### Workarounds
1. **Alpha version**: `"framer-motion": "12.0.0-alpha.2"` (reported working)
2. **Alternative import**: `import { motion } from "motion/react"`
3. **Downgrade React 18** (not recommended - stability issues)

### Animation Patterns (When Compatible)
- **Page transitions**: Wrap with `<AnimatePresence>` for exit animations
- **Scroll animations**: Use `useScroll` + `useTransform`
- **Layout animations**: `layout` prop for automatic layout transitions
- Mark animated components as `"use client"`

**Recommendation**: Monitor Framer Motion React 19 support or consider alternatives (CSS animations, Motion One).

## 4. Image Optimization

### Format Support
- **Default**: WebP only
- **Enable AVIF**: Configure `next.config.js`
```js
images: {
  formats: ['image/avif', 'image/webp']
}
```
- **Compression**: 40-70% from compression + 25-35% from format conversion
- Auto serves AVIF → WebP → JPEG based on browser `Accept` headers

### Best Practices
```tsx
import Image from 'next/image'

// 1. Always specify dimensions (prevent layout shift)
<Image src="/hero.jpg" width={1200} height={600} alt="..." />

// 2. Use priority for above-fold images
<Image src="/hero.jpg" priority width={1200} height={600} alt="..." />

// 3. Responsive sizing
<Image
  src="/hero.jpg"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="..."
/>

// 4. Blur placeholder
<Image
  src="/hero.jpg"
  placeholder="blur"
  blurDataURL="data:image/..."
  alt="..."
/>
```

### Caveats
- Both AVIF + WebP versions cached (increased storage)
- Images optimized at build time + on-demand

## 5. Metadata API

### Static Metadata
**app/page.tsx:**
```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio | Your Name',
  description: 'Full-stack developer portfolio',
  openGraph: {
    title: 'Portfolio',
    description: '...',
    images: ['/og-image.jpg']
  }
}
```

### Dynamic Metadata
**app/projects/[slug]/page.tsx:**
```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const project = await getProject(params.slug)

  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
    openGraph: {
      images: [project.image]
    }
  }
}
```

### SEO Best Practices
- Type-safe with TypeScript
- Hierarchical (child pages inherit + override)
- Add JSON-LD structured data for rich snippets
- Use canonical URLs to avoid duplicates
- Server Components deliver fully-rendered HTML to crawlers

## 6. Font Optimization

### Google Fonts Setup
**app/layout.tsx:**
```tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap'
})

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

**tailwind.config.js:**
```js
theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-inter)'],
      mono: ['var(--font-roboto-mono)']
    }
  }
}
```

### Best Practices
- **Use variable fonts** for performance + flexibility
- **Specify subsets** (e.g., `latin`) to reduce file size
- **Load once** - centralize in `layout.tsx`, import className elsewhere
- **Self-hosted** - fonts downloaded at build, served from same domain (no Google requests)
- **No layout shift** - automatic font optimization

## 7. Vercel Deployment

### Zero-Config Features
- Static pages + assets → Vercel CDN
- SSR pages + API routes → Isolated Serverless Functions
- Automatic infinite scaling

### Optimization Tips
1. **Enable Fluid Compute** (Project Settings) - auto-optimize functions for cost + performance
2. **Leverage Edge Runtime** for global low latency
3. **Use ISR** (Incremental Static Regeneration) for semi-dynamic content
4. **Monitor Web Vitals** via Vercel Analytics

### Build Performance
- Turbopack dev mode: 76.7% faster startup
- Static generation optimizations reduce redundant renders
- Shared fetch cache across pages

### Deployment Flow
```bash
git push origin main  # Auto-deploys from GitHub
# or
vercel --prod
```

Environment variables managed in Project Settings → Environment Variables.

## Summary Recommendations

**Immediate Actions:**
1. Init Next.js 15 with App Router
2. Install Tailwind v4 (CSS-first config)
3. Use `next/image` with AVIF+WebP formats
4. Centralize Google Fonts in `layout.tsx`
5. Deploy to Vercel with Fluid Compute enabled

**Deferred/Monitoring:**
- Hold Framer Motion until React 19 support confirmed (use alpha 12.0.0-alpha.2 or alternatives)

**Performance Checklist:**
- [ ] Use Server Components by default
- [ ] Add `priority` to hero images
- [ ] Specify image `sizes` for responsive layouts
- [ ] Enable AVIF format for max compression
- [ ] Use variable Google Fonts with subsets
- [ ] Implement `generateMetadata` for dynamic pages
- [ ] Add JSON-LD structured data for SEO
- [ ] Test with Vercel Analytics for Web Vitals

## Unresolved Questions
- Framer Motion stable React 19 release timeline
- Tailwind v4 custom plugin ecosystem maturity
- AVIF browser support % vs storage tradeoffs for portfolio use case

---

## Sources
- [Next.js 15 Official Docs](https://nextjs.org/blog/next-15)
- [Best Practices for Organizing Next.js 15](https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji)
- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [Moving from Tailwind 3 to Tailwind 4 in Next.js 15](https://www.9thco.com/labs/moving-from-tailwind-3-to-tailwind-4)
- [Framer Motion Next.js 15 Discussion](https://github.com/vercel/next.js/discussions/72228)
- [Next.js Image Optimization Guide](https://nextjs.org/docs/14/app/building-your-application/optimizing/images)
- [Next.js 15 SEO Guide](https://www.digitalapplied.com/blog/nextjs-seo-guide)
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts)
- [Vercel Next.js Deployment Docs](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Next.js 15 Performance Improvements](https://nextjs.org/blog/next-15)
