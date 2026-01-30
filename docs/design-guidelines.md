# Profilio Design Guidelines

## 1. Color Palette

### Dark Mode (Default)

| Token               | Value       | Usage                        |
| -------------------- | ----------- | ---------------------------- |
| `--bg-primary`       | `#0a0a0f`   | Page background              |
| `--bg-secondary`     | `#12121a`   | Card backgrounds, sections   |
| `--bg-tertiary`      | `#1a1a2e`   | Elevated surfaces            |
| `--text-primary`     | `#f0f0f5`   | Headings, primary text       |
| `--text-secondary`   | `#a0a0b8`   | Body text, descriptions      |
| `--text-muted`       | `#6b6b80`   | Captions, meta text          |
| `--accent`           | `#10b981`   | Primary accent (emerald)     |
| `--accent-hover`     | `#34d399`   | Accent hover state           |
| `--accent-muted`     | `#10b98133` | Accent at 20% opacity        |
| `--glass-bg`         | `rgba(255,255,255,0.05)` | Glass card fill   |
| `--glass-bg-hover`   | `rgba(255,255,255,0.10)` | Glass hover fill  |
| `--glass-border`     | `rgba(255,255,255,0.08)` | Glass card border |
| `--glass-border-hover` | `rgba(255,255,255,0.15)` | Glass hover border |

### Light Mode

| Token               | Value       | Usage                        |
| -------------------- | ----------- | ---------------------------- |
| `--bg-primary`       | `#fafafa`   | Page background              |
| `--bg-secondary`     | `#ffffff`   | Card backgrounds             |
| `--bg-tertiary`      | `#f0f0f5`   | Elevated surfaces            |
| `--text-primary`     | `#1a1a2e`   | Headings, primary text       |
| `--text-secondary`   | `#4a4a5e`   | Body text                    |
| `--text-muted`       | `#8888a0`   | Captions, meta               |
| `--accent`           | `#10b981`   | Same emerald accent          |
| `--accent-hover`     | `#059669`   | Darker on light bg           |
| `--glass-bg`         | `rgba(255,255,255,0.70)` | Glass fill        |
| `--glass-bg-hover`   | `rgba(255,255,255,0.85)` | Glass hover       |
| `--glass-border`     | `rgba(0,0,0,0.08)`      | Glass border      |
| `--glass-border-hover` | `rgba(0,0,0,0.12)`    | Glass hover border |

---

## 2. Typography

**Fonts** (Google Fonts, Vietnamese charset enabled):
- **Headings**: Space Grotesk (600 semi-bold, 700 bold)
- **Body**: Space Grotesk (400 regular, 500 medium)
- **Code/Mono**: JetBrains Mono (400 regular, 500 medium)

### Type Scale

| Level    | Size (desktop) | Size (mobile) | Weight | Line Height | Letter Spacing |
| -------- | -------------- | ------------- | ------ | ----------- | -------------- |
| `h1`     | 4rem (64px)    | 2.5rem (40px) | 700    | 1.1         | -0.02em        |
| `h2`     | 2.5rem (40px)  | 1.75rem (28px)| 600    | 1.2         | -0.01em        |
| `h3`     | 1.5rem (24px)  | 1.25rem (20px)| 600    | 1.3         | 0              |
| `h4`     | 1.125rem (18px)| 1rem (16px)   | 600    | 1.4         | 0              |
| `body`   | 1rem (16px)    | 1rem (16px)   | 400    | 1.6         | 0              |
| `small`  | 0.875rem (14px)| 0.875rem      | 400    | 1.5         | 0.01em         |
| `code`   | 0.875rem (14px)| 0.8125rem     | 400    | 1.5         | 0              |
| `caption`| 0.75rem (12px) | 0.75rem       | 500    | 1.4         | 0.03em         |

---

## 3. Spacing System

Base unit: 4px. Use multiples.

| Token  | Value  | Usage                       |
| ------ | ------ | --------------------------- |
| `xs`   | 4px    | Tight inner padding         |
| `sm`   | 8px    | Badge padding, small gaps   |
| `md`   | 16px   | Card inner padding, gaps    |
| `lg`   | 24px   | Section inner padding       |
| `xl`   | 32px   | Card padding                |
| `2xl`  | 48px   | Section gaps                |
| `3xl`  | 64px   | Section vertical padding    |
| `4xl`  | 96px   | Major section spacing       |
| `5xl`  | 128px  | Hero padding                |

---

## 4. Border Radius

| Token       | Value  | Usage                    |
| ----------- | ------ | ------------------------ |
| `--r-sm`    | 6px    | Badges, pills, tags      |
| `--r-md`    | 12px   | Buttons, inputs          |
| `--r-lg`    | 16px   | Cards                    |
| `--r-xl`    | 24px   | Large cards, hero elements |
| `--r-full`  | 9999px | Circles, avatars         |

---

## 5. Shadows and Glow Effects

### Shadows (Dark Mode)
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
--shadow-md: 0 4px 12px rgba(0,0,0,0.4);
--shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
```

### Shadows (Light Mode)
```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
--shadow-md: 0 4px 12px rgba(0,0,0,0.1);
--shadow-lg: 0 8px 32px rgba(0,0,0,0.12);
```

### Glow Effects
```css
/* Accent glow on hover */
--glow-accent: 0 0 20px rgba(16,185,129,0.3);
--glow-accent-strong: 0 0 40px rgba(16,185,129,0.4);

/* Card subtle glow */
--glow-card: 0 0 0 1px rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.3);
```

---

## 6. Glass Card Styles

### Base Glass Card
```css
.glass-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--r-lg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
  transform: translateY(-2px);
  box-shadow: var(--glow-card);
}
```

### Glass Navbar
```css
.glass-nav {
  background: rgba(10,10,15,0.8);
  border-bottom: 1px solid var(--glass-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
```

---

## 7. Button Styles

### Primary Button
```css
.btn-primary {
  background: var(--accent);
  color: #ffffff;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 0.9375rem;
  padding: 12px 28px;
  border-radius: var(--r-md);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--glow-accent);
}
```

### Secondary Button (Ghost with border)
```css
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  font-size: 0.9375rem;
  padding: 12px 28px;
  border-radius: var(--r-md);
  border: 1px solid var(--glass-border);
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-muted);
}
```

### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  font-weight: 500;
  padding: 8px 16px;
  border-radius: var(--r-md);
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}
.btn-ghost:hover {
  color: var(--accent);
}
```

---

## 8. Animation Specs

### Transitions
| Property         | Duration | Easing                           |
| ---------------- | -------- | -------------------------------- |
| Color/bg         | 200ms    | `ease`                           |
| Transform        | 300ms    | `cubic-bezier(0.4, 0, 0.2, 1)`  |
| Opacity          | 400ms    | `ease-out`                       |
| Layout (height)  | 350ms    | `cubic-bezier(0.4, 0, 0.2, 1)`  |

### Scroll Reveal
- **Trigger offset**: element enters viewport at 85% scroll position
- **Initial state**: `opacity: 0; transform: translateY(24px)`
- **Final state**: `opacity: 1; transform: translateY(0)`
- **Duration**: 600ms
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo)
- **Stagger**: 100ms between sibling elements

### Hero Gradient Orbs
```css
@keyframes orb-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}
/* Duration: 20s | Easing: ease-in-out | Iteration: infinite */
```

### Hover Effects
- **Card lift**: `translateY(-2px)` over 300ms
- **Button lift**: `translateY(-1px)` over 200ms
- **Scale pop**: `scale(1.02)` over 200ms
- **Glow**: box-shadow fade-in over 300ms

### Counter Animation
- Duration: 2000ms
- Easing: `ease-out`
- Trigger: on scroll into view (IntersectionObserver)

---

## 9. Component Patterns

### SectionHeading
```
[caption - mono, accent, uppercase, tracked]
[h2 - Space Grotesk 600]
[optional description - text-secondary]
```
- Caption uses JetBrains Mono, `--accent` color, `text-transform: uppercase`, `letter-spacing: 0.1em`, `font-size: 0.75rem`
- Bottom margin: 48px to section content

### BentoCard
- Glass card base
- Variable grid spans (1x1, 2x1, 1x2)
- Padding: 32px
- Min-height varies by content

### GlassCard
- Standard glass styling from section 6
- Padding: 24px-32px
- Optional accent top-border: `border-top: 2px solid var(--accent)`

### NavLink
- `font-size: 0.875rem`
- `font-weight: 500`
- Color: `--text-secondary` default, `--accent` on hover/active
- Transition: color 200ms ease
- Active indicator: small dot or underline in accent color

### SkillPill
```css
.skill-pill {
  display: inline-block;
  padding: 6px 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8125rem;
  color: var(--accent);
  background: var(--accent-muted);
  border-radius: var(--r-sm);
  border: 1px solid rgba(16,185,129,0.2);
}
```

### TimelineItem
- Left border: 2px solid `--glass-border`
- Active/current: border changes to `--accent`
- Circle dot at top: 12px, `--accent` fill
- Content: glass card to the right

### MetricCard
- Glass card
- Large number: h2 size, `--accent` color
- Label below: small text, `--text-secondary`
- Icon above: 24px, `--accent` color

---

## 10. Responsive Breakpoints

| Name     | Min Width | Columns (grid) | Container Max |
| -------- | --------- | --------------- | ------------- |
| Mobile   | 0px       | 1               | 100%          |
| Tablet   | 768px     | 2               | 720px         |
| Desktop  | 1024px    | 3               | 960px         |
| Wide     | 1280px    | 4 (bento)       | 1200px        |

### Container
```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
@media (max-width: 768px) {
  .container { padding: 0 16px; }
}
```

---

## 11. Z-Index Scale

| Layer       | Value |
| ----------- | ----- |
| Background  | 0     |
| Content     | 1     |
| Cards       | 10    |
| Navbar      | 100   |
| Overlay     | 200   |
| Modal       | 300   |
| Toast       | 400   |

---

## 12. Accessibility

- Minimum contrast ratio: 4.5:1 (normal text), 3:1 (large text)
- Focus ring: `outline: 2px solid var(--accent); outline-offset: 2px`
- Touch targets: minimum 44x44px
- Respect `prefers-reduced-motion`: disable transforms and animations
- Respect `prefers-color-scheme`: auto-detect initial theme
- All interactive elements keyboard-accessible
- Semantic HTML landmarks (`nav`, `main`, `section`, `footer`)
