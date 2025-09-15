# Semantic Search UI — Continuation Prompt (living context)

_Last updated: 2025‑09‑14 (Europe/London)_

Purpose: Fast handover for the UI track of the Search app. Focuses on theming,
Oak Components integration, accessibility, and page structure. Companion to the
`semantic-search-ui-plan.md`.

---

## TL;DR (UI state)

- App: Next.js App Router with Styled Components SSR; clean server/client boundary.
- Theming: ADR‑045 Bridge adopted. SSR cookie → `<html data-theme>`; client persists cookie + localStorage.
- Tokens + typing: `app/ui/themes/{tokens,light,dark,types}` exposed via Bridge as `theme.app`; typed DefaultTheme via augmentation.
- Theme: `oakDefaultTheme` light + derived dark at semantic layer; toggle in header via `ThemeSelect` updates context and HTML attribute; Bridge recomputes tokens and CSS vars by mode.
- Layout: tabs removed; Structured and NL forms shown side‑by‑side.
- Header: moved styling into client file `app/ui/client/HeaderStyles.tsx`; layout remains server.
- Inline styles: migrated in forms/results to styled‑components using `theme.app` tokens; ESLint forbids `style` prop.
- Tests: theming unit/integration green; SSR cookie mapping test stabilized with scoped mocks.

---

## Immediate next tasks (ordered)

1. Implement Theme Bridge provider (raw→semantic mapping, CSS var emission, typed `theme.app`) [DONE].
2. Migrate inline styles in Structured/NL forms and results to tokens/styled‑components. [DONE]
3. Validate dark theme visuals; ensure AA contrast; add focus outlines per tokens.
4. Begin Oak Components refactor (inputs/selects/buttons/header) with a11y semantics.
5. Add component tests for submit/error/results flows; introduce a11y + contrast checks (axe + contrast matrix). Add Bridge assertions: CSS vars and `theme.app` values change on toggle [DONE].

---

## Files of interest (UI)

- Layout/nav: `app/layout.tsx` (server), `app/ui/client/HeaderStyles.tsx` (client),
  `app/ui/client/ThemeSelect.tsx` (client), `app/lib/Providers.tsx` (client provider).
- Page shell: `app/page.tsx` (server) + `app/ui/client/SearchPageClient.tsx` (client container).
- Forms: `app/ui/StructuredSearch.tsx`, `app/ui/NaturalSearch.tsx`,
  `app/ui/structured-fields.tsx`, `app/ui/fields.tsx`.
- Results: `app/ui/SearchResults.tsx` (safe React rendering for highlights; no `dangerouslySetInnerHTML`).
- Theme infra: `app/lib/theme/{ThemeContext.tsx,theme-utils.ts}` plus Bridge files (`ColorModeContext.tsx`, `ThemeBridgeProvider.tsx`, `ThemeCssVars.tsx`, optional `HtmlThemeAttribute.tsx`). Bridge composes mode‑specific tokens via `createLightTheme`/`createDarkTheme` and emits corresponding CSS vars.

---

## Decisions & invariants (UI)

- SSR‑first theming with ADR‑045 Bridge: server sets initial `<html data-theme>`; no pre‑hydration scripts.
- Theme tokens source: Oak tokens first; app‑specific only if needed, exposed via Bridge as `theme.app`.
- Accessibility: WCAG 2.2 AA; visible focus; reduced motion respected.
- Testing: no network I/O; stub/fake fetch where required.

---

## Handy commands

- Dev: `pnpm -C apps/oak-open-curriculum-semantic-search dev`
- Tests (workspace): `pnpm -C apps/oak-open-curriculum-semantic-search test`
- Root gates: `pnpm make && pnpm qg`

### Dev & E2E (Playwright MCP)

- The Playwright MCP server can drive the Next app in dev:
  - Run the Next dev server so backend logs are visible in the terminal.
  - In parallel, run Playwright via MCP to exercise the client (navigation, form submit, theme toggle).
  - Observe server logs while tests interact with the UI for quick feedback. Stub external calls to avoid real network I/O.

---

## Short next steps checklist

[x] Tokens scaffold exists and exported
[x] Server/client boundary established for layout/header
[x] Tabs removed; side‑by‑side layout implemented
[x] ThemeSelect present in header; provider under `Providers`
[x] Bridge provider implemented; `theme.app` available at runtime
[x] Bridge mode toggling updates CSS vars and `theme.app` tokens
[x] Inline styles migrated to themed styled‑components (forms/results)
[ ] Dark theme visuals verified for contrast AA
[ ] Forms/header migrated to Oak Components
[x] Highlights sanitized or safely rendered (safe React rendering)
[ ] Component tests for main flows; a11y + contrast checks added
