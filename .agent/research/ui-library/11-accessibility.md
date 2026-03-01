# 11. Accessibility Strategy

## Foundation: Ark UI (Zag.js) handles the hard parts

Ark UI's state machines provide correct implementations of:

- **Focus trapping** in dialogs and popovers
- **Roving tabindex** in radio groups, tabs, and menu bars
- **Keyboard navigation** (Arrow, Enter, Space, Escape, Home, End)
- **ARIA attributes** (role, aria-expanded, aria-selected, aria-controls, aria-labelledby, etc.)
- **Screen reader announcements** for dynamic content changes
- **Scroll locking** when modals are open
- **Focus return** when dialogs close

Because these behaviours are encoded as state machines, they're exhaustive — every state transition sets the correct ARIA attributes. This is architecturally more reliable than hand-authored a11y code.

## Cross-design-system requirements

Both Oak and Zinc must meet:

- **WCAG 2.2 AA** colour contrast for all text/background combinations
- **Minimum touch target size** of 44x44px on interactive elements
- **`:focus-visible`** on all interactive elements, using the design system's focus ring token
- **`@media (prefers-reduced-motion: reduce)`** respected in all transitions and animations
- **Semantic HTML** — headings use h1–h6, lists use ul/ol, forms use label+input
- **No ARIA-only interactivity** — all interactive elements are natively focusable

## Library-provided a11y components

- **`VisuallyHidden`** — screen-reader-only content, visually hidden but accessible
- **Focus ring styling** — via `--ds-shadow-focus` token, applied by recipes on `:focus-visible`

## A11y testing strategy

### Automated (CI)

- **axe-core** integrated into Vitest — runs accessibility checks on rendered components
- **Storybook addon-a11y** — automated checks during development, per-story
- Tests run under **both design systems** to catch contrast issues in either token set

### Manual (periodic)

- Keyboard navigation walkthrough for all interactive components
- Screen reader testing (VoiceOver on macOS, NVDA on Windows)
- Zoom and text-scaling testing (200% zoom, large text)
- Reduced motion testing
- High contrast mode testing

### Colour contrast validation

The token validation step (in `core`) can include a contrast check:

```typescript
// Verify that all semantic text/background pairs meet WCAG AA
// e.g. textPrimary on bgPrimary, btnPrimaryText on btnPrimaryBg
export function validateContrast(tokens: DesignSystemTokens): ContrastResult[];
```

This catches contrast issues at build time, before they reach Storybook or production.
