---
name: defensive-ui
description: Review and enforce defensive UI and async state handling standards. Use when building screens, reviewing data-fetching flows, or handling errors.
allowed-tools: Read Grep Glob
---

# Defensive UI / Async States — Never Ship Silent Failures

## Rules

### Always handle loading, error, and success states
Every async operation (API call, data fetch, mutation) must render a meaningful UI for all three states. No partial handling.

### Never ship silent failures
If an operation fails, the user must know. No swallowed errors, no empty screens without explanation.

### Use `ErrorBoundary` at the screen level
Wrap every screen with an `ErrorBoundary` to catch unexpected render errors and show a fallback UI.

### Show skeleton or placeholder during loading
Avoid blank screens. Use skeleton loaders or shimmer placeholders to communicate that content is loading.

### Empty states are designed, not accidental
Every list or data view must have an intentional empty state — with a message and, where appropriate, a call to action.

### Validate API responses before rendering
Never assume the API returned valid data. Check for nulls, missing fields, and unexpected shapes before accessing them.

### Retry and recovery
Where possible, give the user a way to retry a failed action. Don't leave them stuck on an error screen.
