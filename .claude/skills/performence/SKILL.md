---
name: performence
description: Review and enforce React Native performance standards. Use when optimizing components, reviewing renders, or identifying performance bottlenecks.
allowed-tools: Read Grep Glob
---

# Performance — Measure First, Optimize Intentionally

## Rules

### Do not use `useMemo`, `useCallback`, or `React.memo` by default

Only introduce them when a real performance issue has been identified and measured.

### Always profile before optimizing

Use tools like **React DevTools Profiler** or **Flipper** to validate bottlenecks before making changes.

### Keep the JavaScript thread light

Avoid expensive computations, large loops, or synchronous blocking operations during render.

### Offload heavy work when necessary

Move intensive tasks to native modules, background threads, or workers.

### Understand the frame budget

**60 FPS = 16ms per frame.** Any work exceeding this will cause dropped frames and visible jank.

### Minimize unnecessary re-renders

Structure components and state to avoid cascading updates.

### Prefer flat and predictable component trees

Deep or complex trees increase reconciliation cost and slow down React's diffing algorithm.
