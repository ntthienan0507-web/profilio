# Phase 07 - Testing & Polish

- **Plan:** [plan.md](./plan.md)
- **Prev:** [Phase 06 - SEO & Performance](./phase-06-seo-and-performance.md)

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-01-30 |
| Priority | P2 |
| Status | pending |
| Effort | 2h |

## Key Insights

- Lighthouse audit is the primary quality gate (90+ all categories)
- Cross-browser testing: Chrome, Firefox, Safari, mobile Safari
- Accessibility: keyboard navigation, screen reader, reduced motion
- Final polish: micro-interactions, spacing consistency, copy review

## Requirements

- Lighthouse 90+ (Performance, Accessibility, Best Practices, SEO)
- Cross-browser compatible (Chrome, Firefox, Safari)
- Responsive: 320px to 2560px
- Keyboard navigable (tab order, focus styles)
- `prefers-reduced-motion` support
- Clean build with zero warnings
- Vercel deployment successful

## Architecture

### Testing Strategy

No test framework (YAGNI for a static portfolio). Testing is manual + Lighthouse.

```
Testing Checklist:
├── Lighthouse Audit (Chrome DevTools)
├── Responsive Testing (DevTools device mode)
├── Cross-browser (Chrome, Firefox, Safari)
├── Keyboard Navigation
├── Screen Reader (VoiceOver on macOS)
├── Reduced Motion
├── Dark/Light Theme
├── Social Share Preview (OG tags)
└── Vercel Deploy Preview
```

## Related Files

| File | Purpose |
|------|---------|
| All components | Polish pass |
| `app/globals.css` | Final CSS cleanup |
| `next.config.ts` | Build optimization |
| `package.json` | Build scripts |

## Implementation Steps

### Step 1: Lighthouse Audit

Run Lighthouse in Chrome DevTools (Incognito mode):
1. Performance: Target 90+
   - Check LCP < 2.5s
   - Check CLS < 0.1
   - Check INP < 200ms
2. Accessibility: Target 95+
   - All images have alt text
   - Color contrast ratios pass WCAG AA
   - Heading hierarchy correct (h1 > h2 > h3)
3. Best Practices: Target 95+
   - No console errors
   - HTTPS (Vercel handles this)
   - Security headers present
4. SEO: Target 100
   - Meta tags present
   - Sitemap accessible
   - robots.txt accessible

### Step 2: Fix Performance Issues

Common fixes:
- **Large LCP:** Ensure hero loads fast; preload critical assets
- **CLS:** Set explicit dimensions on all dynamic content
- **Unused JS:** Check bundle analyzer, remove unused imports
- **Render blocking:** Ensure fonts use `display: swap` (already handled)

Bundle analysis:
```bash
npx @next/bundle-analyzer
# or
ANALYZE=true npm run build
```

### Step 3: Accessibility Polish

**Focus styles:**
```css
/* globals.css */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}
```

**Reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Also handle in ScrollReveal component:
```tsx
const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

if (prefersReducedMotion) {
  return <div className={className}>{children}</div>
}
```

**Semantic HTML check:**
- `<nav>` for navigation
- `<main>` for main content
- `<section>` with `aria-labelledby` for each section
- `<footer>` for footer
- Skip-to-content link (hidden, visible on focus)

**Skip to content:**
```tsx
// In layout.tsx, before Navbar
<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-background focus:rounded-lg">
  Skip to content
</a>
```

### Step 4: Responsive Polish

Test at breakpoints:
- 320px (small mobile)
- 375px (iPhone SE)
- 390px (iPhone 14)
- 768px (tablet)
- 1024px (laptop)
- 1280px (desktop)
- 1920px+ (large screen)

Check:
- [ ] Hero text doesn't overflow on 320px
- [ ] Bento grid stacks properly on mobile
- [ ] Timeline is readable on mobile
- [ ] Nav menu works on mobile
- [ ] No horizontal scroll at any breakpoint
- [ ] Touch targets >= 44x44px

### Step 5: Cross-Browser Testing

- **Chrome:** Primary (dev/test browser)
- **Firefox:** Check glassmorphism `backdrop-filter` support
- **Safari:** Check `backdrop-filter` (webkit prefix may be needed)
  ```css
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  ```
- **Mobile Safari:** Check scroll behavior, fixed positioning

### Step 6: Dark/Light Theme Polish

- Verify all text readable in both themes
- Check glass effects in light mode (adjust opacity)
- Ensure accent color works in both modes
- Check form elements, scrollbar, selection colors

### Step 7: Copy & Content Review

- All placeholder tokens present: `[YOUR FULL NAME]`, `[EMAIL]`, `[USERNAME]`, `[University Name]`
- No typos in static content
- Consistent tone throughout
- All links have descriptive text

### Step 8: Build & Deploy

```bash
# Clean build
npm run build

# Check for warnings/errors
# Verify output:
# - Static pages generated
# - No build warnings
# - Bundle size reasonable

# Deploy to Vercel
vercel --prod
# or push to GitHub (auto-deploy)
```

### Step 9: Post-Deploy Verification

- [ ] Live URL loads correctly
- [ ] HTTPS active
- [ ] OG tags work (test: https://www.opengraph.xyz/)
- [ ] Lighthouse on live URL (90+ all)
- [ ] Mobile test on real device
- [ ] /sitemap.xml accessible
- [ ] /robots.txt accessible

## Todo

- [ ] Run Lighthouse audit
- [ ] Fix any performance issues (LCP, CLS, INP)
- [ ] Add focus-visible styles
- [ ] Add prefers-reduced-motion support
- [ ] Add skip-to-content link
- [ ] Verify semantic HTML structure
- [ ] Test at all responsive breakpoints
- [ ] Cross-browser test (Chrome, Firefox, Safari)
- [ ] Review dark/light theme in both modes
- [ ] Content/copy review for placeholders
- [ ] Clean build with zero warnings
- [ ] Deploy to Vercel
- [ ] Post-deploy verification checklist

## Success Criteria

- Lighthouse: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 100
- Zero build warnings
- No horizontal scroll at any viewport
- Keyboard navigation works end-to-end
- Reduced motion respected
- Both themes fully functional
- Vercel deploy successful
- OG image displays correctly when shared

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Lighthouse perf < 90 | High | Profile, lazy load, reduce client JS |
| Safari backdrop-filter issues | Medium | Add webkit prefix, fallback solid bg |
| Mobile layout breaks | Medium | Test early, mobile-first approach |
| Build errors on Vercel | Low | Test `npm run build` locally first |

## Security Considerations

- Verify no secrets in build output
- Security headers active on Vercel
- No exposed API keys or personal data in source

## Completion

This is the final phase. After successful deployment:
1. Update plan.md status to `completed`
2. Document any known issues or future enhancements
3. Share live URL
