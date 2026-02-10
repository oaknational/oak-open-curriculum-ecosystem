# 045: Hybrid theming Bridge for Oak Components (CSS variables + semantic tokens)

Date: 2025-09-15

## Status

Superseded — Next.js UI layer removed

> The entire Next.js UI layer, including React, styled-components, Oak Components, and all
> referenced code (`app/lib/theme/*`, `app/lib/Providers.tsx`, `app/layout.tsx`), was removed in
> February 2026. The semantic search workspace is now a pure TypeScript library with no UI surface.
> Supporting documentation (`docs/oak-components-theming.md`) has also been deleted. This decision
> is no longer applicable to the current codebase but is preserved below for historical context.

## Context

We are integrating Oak Components into the Semantic Search app (Next.js App Router, React 19, styled-components). The UI requires:

- SSR-first theming with zero flicker (pre-hydration script allowed when deterministic)
- A clean server/client boundary that plays well with streaming
- Light/dark mode with instant switching and minimal re-render
- Typed, semantic tokens that app components can rely on (e.g., `theme.app.*`)
- A migration path from inline styles to tokenised, accessible components

Current state and constraints:

- We set an SSR cookie and reflect it as `<html data-theme-mode>`; the client persists cookie + localStorage and subscribes to system preference. Tests cover SSR hints and preference updates.
- A deterministic pre-hydration script (documented in `app/layout.tsx`) now mirrors the ThemeContext resolution rules so SSR markup always matches the resolved colour mode before hydration.
- We extended the Oak theme with semantic layout tokens (`theme.app`) via `semanticThemeSpec` and emit CSS variables through `ThemeBridgeProvider`. New responsive guidance lives in `.agent/plans/semantic-search/semantic-search-responsive-layout-architecture.md`.

We need a robust approach that guarantees the presence of semantic/app tokens at runtime, decouples Oak raw tokens from app semantics, and enables instant colour-mode switching while coexisting with the pre-hydration bridge.

## Decision

Adopt a layered “Bridge” theming architecture:

1. Provider composition
   - `ThemeContextProvider` (exposes Oak semantic theme + OakGlobalStyle) → `ColorModeProvider` → `ThemeBridgeProvider` (wraps styled-components ThemeProvider).
   - `Providers` (`app/lib/Providers.tsx`) orchestrates the chain and injects `ThemeWrapper` plus DOM `data-theme` attributes used by the pre-hydration script.
   - The Bridge is responsible for mapping Oak raw tokens to a typed semantic theme that includes `theme.app` tokens consumed by our components.

2. CSS variables + global style emission
   - The Bridge emits a minimal `<style id="app-theme-vars">…</style>` element plus a `<style id="app-theme-global">…</style>` block that applies semantic background/foreground colours. Both are rendered declaratively (safe for SSR + streaming) and update when the colour mode changes.
   - Mode switching is achieved by toggling data attributes on `<html>`/`#app-theme-root` (e.g., `data-theme="dark"`), avoiding component tree remounts.

3. Typed semantic theme
   - The styled-components ThemeProvider exposes a typed semantic theme that includes `app` tokens (spacing, radii, colors, layout sizes) and any necessary Oak-derived mappings.
   - Only the Bridge layer references Oak raw tokens. App code uses semantic tokens exclusively.

4. SSR-first mode initialisation with deterministic pre-hydration script

- The server reads the cookie and sets `<html data-theme="light|dark">`, passes `initialMode` to `Providers`, and always injects the pre-hydration script that mirrors ThemeContext resolution. This ensures DOM attributes match the resolved mode before hydration.
- The script is now a permanent part of the bridge until the component library offers a dual-theme static snapshot; removing it would reintroduce flicker and hydration mismatches.

5. Responsive tokens & testing guardrails
   - Ensure only one `styled-components` version exists. Add tests that verify:
     - `theme.app` (including layout/breakpoint tokens) is present and typed
     - CSS variable style tag and global style tag are emitted
     - AA contrast for key pairs (text/background, focus, error)
     - Axe a11y checks pass for core pages
     - Breakpoint variables (`--app-bp-*`) resolve to expected values (see responsive layout architecture plan)

## Rationale

- Performance and UX: CSS variables enable instant mode switching with minimal re-render and no layout thrash. Declarative style emission works with streaming SSR.
- Stability: A semantic layer shields app code from raw token churn in Oak Components; upgrades are localised to the mapping.
- Developer experience: A typed semantic theme (`theme.app`) improves clarity and prevents raw token leaks. Centralising token mapping reduces inconsistency and drift.
- Accessibility: Centralised tokens make it straightforward to validate contrast and focus styles and to respect `prefers-reduced-motion`.

## Consequences

Positive:

- Predictable, tested provider composition; instant and flicker-free mode switch
- Single place to evolve dark palette and semantic token names
- App components can assume `theme.app` exists at runtime

Trade-offs:

- Additional Bridge layer to maintain
- Initial work to migrate inline styles and component atoms to consume semantic tokens

## Alternatives considered

1. Direct `OakThemeProvider` only, no Bridge
   - Simpler initially, but app components either depend on raw tokens or repeatedly compose ad-hoc mappings. Harder to enforce semantic naming and a11y guarantees.

2. JS theme only (no CSS variables)
   - Works but induces more re-render work on mode switches and can be more brittle with streaming SSR.

3. Imperative pre-hydration scripts to set `className`
   - Increases hydration mismatch risk and complexity. A declarative provider + SSR attribute is safer and more testable.

- Providers (order): `ThemeContextProvider` → `ColorModeProvider` → `ThemeBridgeProvider` (internally wraps styled-components ThemeProvider via `Providers`)
- Bridge responsibilities:
  - Map raw Oak tokens to semantic tokens
  - Emit a single CSS variable sheet for the active mode
  - Provide a typed semantic theme object, including `app` tokens
- Mode switching:
  - Toggle `<html data-theme="light|dark">` via a tiny client hook; SSR sets initial attribute

Suggested files (illustrative):

- `app/lib/theme/ThemeContext.tsx`
- `app/lib/theme/ColorModeContext.tsx`
- `app/lib/theme/ThemeCssVars.tsx`
- `app/lib/theme/ThemeBridgeProvider.tsx`
- `app/lib/theme/HtmlThemeAttribute.tsx` (keeps DOM `data-theme` in sync with active mode)

## Acceptance criteria

1. `theme.app` is present and typed in all styled-components consumers
2. A single `<style id="app-theme-vars">` is emitted and updated correctly on mode changes
3. Mode switching updates an HTML attribute/class without full provider remounts
4. AA contrast (≥ 4.5) for primary text/background and focus/error states
5. Axe checks pass on the main pages/components
6. Exactly one `styled-components` version in the lockfile
7. No raw Oak tokens referenced outside the Bridge

## Migration plan (aligns to UI milestones)

- M0 — Audit and unify styling
  - Inventory inline styles and replace with semantic tokens

- M1 — Adopt Bridge and dark mode
  - Introduce Bridge provider; ensure `theme.app` at runtime; implement CSS variable emission and HTML attribute toggle

- M2 — Replace primitives with Oak Components
  - Use Oak inputs/buttons/layout primitives; preserve accessibility semantics

- M3 — Sanitize highlights
  - Server-side sanitisation or safe render allowlist for `dangerouslySetInnerHTML`

- M4 — Tests & checks
  - Component flow tests, contrast matrix, axe checks; guard single styled-components version

## Risks and mitigations

- Dual `styled-components` versions → guard in CI (`npm ls styled-components`) and align peer ranges
- Missing `theme.app` at runtime → unit tests and type augmentation for DefaultTheme
- Drift between raw and semantic tokens → central Bridge mapping + coverage tests

## References

- Guide: `apps/oak-open-curriculum-semantic-search/docs/oak-components-theming.md`
- Plan: `.agent/plans/semantic-search/semantic-search-responsive-layout-architecture.md`
- Plan: `.agent/plans/semantic-search/semantic-theme-inventory.md`
- Code: `apps/oak-open-curriculum-semantic-search/app/lib/theme/ThemeContext.tsx`, `app/lib/Providers.tsx`, `app/lib/theme/ThemeBridgeProvider.tsx`, `app/layout.tsx`
- Related ADR: `044-nl-delegates-to-structured-search-and-caching-ownership.md`
