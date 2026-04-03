---
name: style
description: Review and enforce design consistency, UX quality, and visual system standards. Use when building UI components, reviewing screens, or making design decisions.
allowed-tools: Read Grep Glob
---

# Design — Consistency, System Thinking, and UX Quality

## Rules

### Avoid default UI styles
Never rely on out-of-the-box component styles (colors, shadows, border radius). Always apply a deliberate design system.

### Use design tokens consistently
Centralize spacing, typography, colors, and radii in a `theme/tokens.ts` file. No hardcoded values inside components.

### Follow a real design system
Base UI decisions on established systems (Material 3, Apple HIG, or high-quality products like Stripe, Linear, Vercel).

### Maintain a consistent spacing scale
Use a fixed scale: `4 / 8 / 12 / 16 / 24 / 32 / 48`. Avoid arbitrary spacing values.

### Respect touch target guidelines
Interactive elements must be at least **44×44pt** for usability and accessibility.

### Design for clarity and hierarchy
Use typography, spacing, and color to create a clear visual hierarchy — not just layout.

### Avoid visual noise
Reduce unnecessary borders, shadows, and decorations. Prefer clean, intentional UI.

### Ensure visual consistency across screens
Similar elements should look and behave the same everywhere in the app.

### Design for all states
Every UI element must account for **loading**, **empty**, **error**, and **success** states.

### Support accessibility in design
Maintain color contrast (≥ 4.5:1), readable font sizes, and clear visual affordances.
