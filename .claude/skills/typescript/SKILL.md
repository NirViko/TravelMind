---
name: typescript
description: Review and enforce TypeScript standards. Use when writing types, reviewing interfaces, or catching unsafe type usage.
allowed-tools: Read Grep Glob
---

# TypeScript & Typing — Types as Documentation

## Rules

### No `any` unless truly unavoidable
Every use of `any` is a bug waiting to happen. Use `unknown` + type guards, generics, or proper interfaces instead.

### No type assertions without justification
Avoid `as SomeType` unless you have verified the shape at runtime. Document why with a comment when unavoidable.

### All props and interfaces explicitly typed
No implicit types. Every function parameter, return value, and component prop must have an explicit type.

### Strict mode enabled
`tsconfig.json` must have `"strict": true`. Never disable strict checks to silence errors.

### Types serve as documentation
A well-named interface eliminates the need for comments. Prefer `UserProfile` over `{ name: string; age: number }` inline.

### Avoid `object`, `Function`, `{}` as types
These are too broad to be useful. Use specific interfaces or generics.

### Co-locate types with their feature
Types for a feature live in `features/<name>/types/` — not in a single global `types.ts` dump.
