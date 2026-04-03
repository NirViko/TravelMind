---
name: comments
description: Review and enforce commenting and documentation standards. Use when writing or reviewing code comments, JSDoc, or inline documentation.
allowed-tools: Read Grep Glob
---

# Comments & Documentation — Explain Why, Not What

## Rules

### Explain *why*, not *what*
The code already shows *what* it does. Comments must explain *why* a decision was made.

**Bad:**
```ts
// increment counter
counter++;
```

**Good:**
```ts
// Must start at 1 because the API uses 1-based pagination
counter++;
```

### Avoid obvious or trivial comments
If the code is self-explanatory, do not add a comment. Noise is worse than silence.

### Document non-obvious business rules
If a value, condition, or workaround comes from a business requirement or external constraint, document it.

### Document workarounds with a reference
```ts
// Workaround: react-native-maps fires onPress twice on Android (RNM#1234)
```

### Keep comments up to date
Outdated comments are actively harmful. If you change the code, update or remove the comment.

### Prefer self-documenting code over comments
Rename variables and functions to make comments unnecessary before adding one.
