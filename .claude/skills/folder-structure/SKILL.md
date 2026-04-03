---
name: folder-structure
description: Review and enforce the project folder structure and feature-based organization. Use when creating new features, components, hooks, or deciding where to place a file.
allowed-tools: Read Grep Glob
---

# Folder Structure — Feature-Based, Co-located

## Structure

```
src/
  features/
    auth/
      components/
      hooks/
      types/
      tests/
    travel/
      components/
      hooks/
      types/
      tests/
    profile/
      components/
      hooks/
      types/
      tests/
  shared/
    components/   ← reusable UI primitives only
    hooks/
    theme/
      tokens.ts
```

## Rules

### Feature-based, not generic
Group files by **feature domain**, not by file type. `features/auth/` contains everything related to auth — components, hooks, types, and tests together.

### Components, hooks, types, and tests live together
Never scatter a feature's files across unrelated folders. Co-location makes the codebase easier to navigate and delete.

### `shared/` is for truly reusable code only
A component or hook belongs in `shared/` only if it is used by **two or more** unrelated features. Do not dump things in `shared/` as a default.

### `theme/tokens.ts` is the single source of design truth
All colors, spacing values, font sizes, and radii are defined here. No hardcoded design values anywhere else.

### New feature = new folder under `features/`
Do not add feature-specific code to `shared/`. Create a proper feature folder with the full structure.

### Tests live next to the code they test
`useAuth.test.ts` lives in `features/auth/hooks/` — not in a top-level `__tests__/` folder.
