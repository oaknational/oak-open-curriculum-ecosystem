# Design Token Governance

> **Origin**: opal-connection-site, 2026-03-28
> **Source evidence**: CSS custom property design system (`src/styles/tokens.css`)
>   with palette, spacing, type scale, typography, and structural tokens
> **Status**: Transferable pattern for UI projects with design systems

## The Problem

Design systems start as a handful of colour variables and grow into a contract
between design intent and implementation. Without governance, tokens drift:
hardcoded values appear alongside token references, semantic tokens diverge from
their palette sources, and theme-aware properties break when new modes are added.

The Practice Core has strong governance for code (type safety, TDD, reviewer
scrutiny) but no vocabulary for design-system governance. The same rigour should
apply.

## The Pattern

### Tokens are the source of truth

All visual properties — colour, spacing, typography, radii, shadows — are
defined as CSS custom properties (or equivalent) in a single token file. No
component may hardcode a value that a token provides.

### Three token tiers

1. **Palette tokens**: raw values with no semantic meaning.
   `--navy-900: #0f1729`
2. **Semantic tokens**: map palette values to purposes, scoped to themes.
   `--bg: var(--navy-950)` (dark), `--bg: var(--cloud-50)` (light)
3. **Component tokens**: map semantic tokens to specific component needs.
   `--button-primary-bg: var(--teal-600)`

Each tier references only the tier above it. Components never reach into palette
tokens directly.

### Theme correctness requires explicit proof

Semantic tokens change between themes. Every theme must be tested for:

- Colour contrast (WCAG AA minimum)
- Text readability against backgrounds
- Interactive element visibility (focus rings, borders, hover states)
- Accent colour luminance (a bright accent that works on dark backgrounds may
  fail on light backgrounds, and vice versa)

### Render-blocking delivery

In dev environments with async module loading (Vite, Webpack dev server), token
files loaded as standard imports may flash unstyled content. Tokens should be
delivered render-blocking — via inline `<style>` injection, `<link>` in `<head>`,
or framework-specific mechanisms.

## How It Works Here

- Token file: `src/styles/tokens.css` — palette (19 values), spacing (10-step
  scale), type scale (6 steps with responsive clamp), typography (families,
  weights, line-heights, letter-spacing), structural (radii, content-width)
- Semantic mapping: `src/layouts/Layout.astro` maps palette to semantic tokens
  per theme via `[data-theme]` selectors
- Component tokens: `--button-primary-bg` / `--button-primary-text` for
  theme-aware button contrast
- Delivery: tokens imported as `?raw` and injected via `<style set:html>` for
  render-blocking in Astro/Vite dev mode
- Proof: Playwright WCAG AA tests for both light and dark themes

## When to Adopt

Any project that defines visual properties shared across components. The
specific token format (CSS custom properties, SCSS variables, JS theme objects,
design-token JSON) varies by stack, but the governance principles are universal.

## Anti-Patterns

- Defining tokens but allowing hardcoded overrides in components
- Sharing palette tokens directly in components (skipping semantic mapping)
- Testing only one theme for contrast and readability
- Loading tokens asynchronously in development, hiding FOUC that users see
  on slow connections
- Treating the token file as "just CSS" rather than a contract with the same
  change-management discipline as a public API
