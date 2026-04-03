---
name: components
description: Review and enforce React Native component architecture standards. Use when building, reviewing, or refactoring UI components.
allowed-tools: Read Grep Glob
---

# Component Architecture — Pure, Focused, Small

## Rules

### Components contain only JSX and props
No logic, state, effects, or data fetches inside components. Components are presentation-only.

### Keep components small
**~100 lines max.** If a component grows beyond this, split it.

### Single Responsibility Principle
Each component does one thing. Avoid components that combine multiple domains or can be described with "And" (e.g. `FormAndValidation`, `ListAndFilter`).

### Props are the only interface
All data flows in via props. No direct store access, no service calls inside components.

### No side effects in components
All `useEffect`, `useState`, async logic, and derived state belong in a custom hook — not in the component body.
