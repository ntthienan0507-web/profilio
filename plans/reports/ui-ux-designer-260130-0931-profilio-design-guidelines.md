# Profilio Design Guidelines & Wireframe Report

**Date**: 2026-01-30
**Task**: Create design guidelines and HTML wireframe for portfolio site

---

## Deliverables

1. **Design Guidelines**: `/Users/chungnguyen/ChungNQ/profilio/docs/design-guidelines.md`
2. **HTML Wireframe**: `/Users/chungnguyen/ChungNQ/profilio/docs/wireframes/index.html`

---

## Design Decisions

### Color Strategy
- Dark base `#0a0a0f` with cool undertones -- avoids pure black, feels premium
- Emerald `#10b981` accent works on both dark/light -- no hue shift needed, only brightness adjustment for hover states (lighter on dark, darker on light)
- Glass overlays use `white/5%` and `white/10%` for subtle depth without heavy opacity

### Typography
- **Space Grotesk**: geometric sans-serif with technical feel, good Vietnamese support
- **JetBrains Mono**: developer-focused monospace for code accents, captions, labels
- Type scale uses `clamp()` for fluid sizing -- no media query jumps

### Layout
- Bento grid in About section: `span-2` intro card + 3 stat cards
- Skills use `auto-fill` grid for natural reflow
- Timeline for experience: vertical left-border with dot markers, glass cards for content
- All sections 96px vertical padding, consistent rhythm

### Glass Effects
- `backdrop-filter: blur(12px)` on cards, `blur(16px)` on navbar (higher for readability)
- Hover state adds border brightness + subtle Y-translate lift
- Light mode uses higher opacity glass (70%/85%) since blur on light bg needs more fill

### Animations
- Hero: 3 gradient orbs with staggered `animation-delay` for organic movement
- Scroll reveal: `translateY(24px)` fade-in with expo ease, 80ms stagger via JS
- `prefers-reduced-motion` fully respected -- disables all transforms and orb animation

### Accessibility
- All text passes WCAG AA contrast on both themes
- Touch targets: buttons 14px padding + font size = well above 44px
- Semantic HTML: `nav`, `section`, `footer` landmarks
- Focus styles: inherits outline behavior (can extend with custom `--acc` ring)

---

## Wireframe Specs

| Metric           | Value           |
| ---------------- | --------------- |
| Total lines      | ~280 (HTML+CSS) |
| External deps    | Google Fonts x2 |
| JS               | 12 lines (theme toggle + scroll reveal) |
| Sections         | 9 (all specified sections included) |
| Responsive       | Yes (768px breakpoint for grid/nav) |
| Theme toggle     | Yes (data-theme attribute swap) |

---

## Unresolved Questions

- Exact personal details (name, degree, university) -- placeholders used
- Whether mobile nav needs hamburger menu or scroll-to links suffice
- CV file format and hosting location for download button
- Preferred social links beyond GitHub and LinkedIn
