# 045: Hybrid theming Bridge for Oak Components (CSS variables + semantic tokens)

Date: 2025-09-15

## Status

Accepted

## Context

We are integrating Oak Components into the Semantic Search app (Next.js App Router, React 19, styled-components). The UI requires:

- SSR-first theming with zero flicker and no pre-hydration scripts
- A clean server/client boundary that plays well with streaming
- Light/dark mode with instant switching and minimal re-render
- Typed, semantic tokens that app components can rely on (e.g., `theme.app.*`)
- A migration path from inline styles to tokenised, accessible components

Current state:

- We set an SSR cookie and reflect it as `<html data-theme-mode>`; the client persists cookie + localStorage and subscribes to system preference. Tests cover SSR hints and preference updates.
- We scaffolded `app/ui/themes/{tokens,light,dark,types}`; however, the runtime theme provided to styled-components does not yet guarantee `theme.app` tokens exist for all components. Mode switching occurs via context but without CSS variable emission.

We need a robust approach that guarantees the presence of semantic/app tokens at runtime, decouples Oak raw tokens from app semantics, and enables instant color-mode switching.

## Decision

Adopt a layered “Bridge” theming architecture:

1. Provider composition
   - `OakThemeProvider (oakDefaultTheme)` → `ColorModeProvider (initial from SSR cookie)` → `ThemeBridgeProvider` → `styled-components ThemeProvider`.
   - The Bridge is responsible for mapping Oak raw tokens to a typed semantic theme that includes `theme.app` tokens consumed by our components.

2. CSS variables emission
   - The Bridge emits a minimal `<style id="app-theme-vars">…</style>` element that defines CSS variables for light/dark. This is rendered declaratively (safe for SSR + streaming) and updates when the color mode changes.
   - Mode switching is achieved by toggling an HTML attribute/class on `<html>` (e.g., `data-theme="dark"`), avoiding component tree remounts.

3. Typed semantic theme
   - The styled-components ThemeProvider exposes a typed semantic theme that includes `app` tokens (spacing, radii, colors, layout sizes) and any necessary Oak-derived mappings.
   - Only the Bridge layer references Oak raw tokens. App code uses semantic tokens exclusively.

4. SSR-first mode initialisation
   - The server reads the cookie and sets `<html data-theme="light|dark">` (or a `data-theme-mode` hint if needed), and passes `initialMode` to `ColorModeProvider`. No imperative pre-hydration script is used.

5. Testing and guardrails
   - Ensure only one `styled-components` version exists. Add tests that verify:
     - `theme.app` is present and typed
     - CSS variable style tag is emitted
     - AA contrast for key pairs (text/background, focus, error)
     - Axe a11y checks pass for core pages

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

## Implementation sketch

- Providers (order): `OakThemeProvider` → `ColorModeProvider` → `ThemeBridgeProvider` (internally wraps styled-components ThemeProvider)
- Bridge responsibilities:
  - Map raw Oak tokens to semantic tokens
  - Emit a single CSS variable sheet for the active mode
  - Provide a typed semantic theme object, including `app` tokens
- Mode switching:
  - Toggle `<html data-theme="light|dark">` via a tiny client hook; SSR sets initial attribute

Suggested files (illustrative):

- `app/lib/theme/ColorModeContext.tsx`
- `app/lib/theme/ThemeCssVars.tsx`
- `app/lib/theme/ThemeBridgeProvider.tsx`
- `app/lib/theme/HtmlThemeAttribute.tsx` (optional, if global CSS relies on HTML attribute)

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

- Guide: `research/search-app/OAK_COMPONENTS_INTEGRATION_GUIDE_v2.md` (sections 2–15)
- Guide: `research/search-app/oak-components-guide.md`
- Plans: `.agent/plans/semantic-search-ui-plan.md`, `.agent/plans/semantic-search-ui-continuation-prompt.md`
- Code (current state): `apps/oak-open-curriculum-semantic-search/app/lib/theme/ThemeContext.tsx`, `app/layout.tsx`, `app/ui/**`
- Related ADR: `044-nl-delegates-to-structured-search-and-caching-ownership.md`
