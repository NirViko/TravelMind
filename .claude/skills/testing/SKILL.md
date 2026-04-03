---
name: testing
description: Review and enforce unit testing standards for React Native components and hooks. Use when writing, reviewing, or improving tests.
allowed-tools: Read Grep Glob
---

# Unit Testing — Behavior, Not Implementation

## Rules

### Every component and hook has a test file
No component or hook ships without a corresponding `.test.tsx` or `.test.ts` file.

### Test behavior, not implementation
Test what the user sees and what the component does — not internal state or method calls.

### Use `@testing-library/react-native`
Prefer queries like `getByText`, `getByRole`, `getByLabelText`. Avoid `getByTestId` unless necessary.

### Cover all async states
Every async operation must be tested in **three states**: loading, error, and success.

### No mocking unless necessary
Avoid mocking internal modules. Mock only at system boundaries (API calls, native modules).

### Tests are readable
A test should read like a specification. Use descriptive `it('...')` strings that explain the expected behavior.

### Hooks are tested independently
Use `renderHook` from `@testing-library/react-native` to test hooks without any UI component.
