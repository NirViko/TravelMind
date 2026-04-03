---
name: accessibility
description: Review and enforce accessibility (a11y) standards for React Native. Use when building interactive elements, modals, navigation, or reviewing UI for accessibility compliance.
allowed-tools: Read Grep Glob
---

# Accessibility (a11y) — Inclusive by Default

## Rules

### All interactive elements have `accessibilityLabel`
Every `TouchableOpacity`, `Pressable`, and custom button must have a clear, descriptive `accessibilityLabel`.

```tsx
<TouchableOpacity accessibilityLabel="Go back to home screen">
  <Icon name="arrow-left" />
</TouchableOpacity>
```

### Manage focus for modals and navigation
When a modal opens, focus must move to the modal. When it closes, focus returns to the triggering element. Use `accessibilityViewIsModal` and `setNativeProps`.

### Color contrast ≥ 4.5:1
All text must meet WCAG AA contrast ratio against its background. Use a contrast checker before shipping.

### Touch targets ≥ 44×44pt
Every interactive element must meet the minimum touch target size. Use `minWidth`/`minHeight` or `hitSlop` if needed.

### Use semantic `accessibilityRole`
```tsx
<TouchableOpacity accessibilityRole="button">
<View accessibilityRole="header">
<TextInput accessibilityRole="search">
```

### Test with VoiceOver (iOS) and TalkBack (Android)
Before shipping any screen, navigate it using only the screen reader. Verify all elements are reachable and readable.

### Do not rely on color alone to convey meaning
Use icons, labels, or patterns alongside color for status, errors, and highlights.
