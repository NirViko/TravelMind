---
name: hooks
description: Review and enforce custom hook standards for state management and business logic. Use when building or reviewing hooks, state, or async logic.
allowed-tools: Read Grep Glob
---

# Custom Hooks & State Management — Logic Lives in Hooks

## Rules

### All logic lives in hooks
State, side effects, async operations, derived state, and event handlers all belong in a `useFeature.ts` hook — not in the component.

### Name hooks after the feature
`useAuth`, `useTravelPlan`, `useSearchForm` — not `useLogic` or `useHelper`.

### Hooks are independently testable
A hook must be fully testable without rendering any UI. If it can't be, the separation is wrong.

### Hooks own all async logic
Data fetching, mutations, loading/error states, and retry logic all live in the hook.

### One hook per feature
Avoid monolithic hooks that manage multiple unrelated concerns. Split by domain.

### Derived state is computed in the hook
Don't push transformation logic into the component. The hook returns ready-to-use values.
