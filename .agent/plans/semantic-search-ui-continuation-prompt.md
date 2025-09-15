# Semantic Search UI — Continuation Prompt (living context)

_Last updated: 2025‑09‑14 (Europe/London)_

Purpose: Fast handover for the UI track of the Search app. Focuses on theming,
Oak Components integration, accessibility, and page structure. Companion to the
`semantic-search-ui-plan.md`.

---

## TL;DR (UI state)

- App: Next.js App Router, Styled Components SSR, `ThemeContext` in place.
- Theming: SSR cookie → `<html data-theme-mode>`; client persists cookie + localStorage.
- Tokens + typing: `app/ui/themes/{tokens,light,dark,types}` added; typed DefaultTheme via
  `types/styled.d.ts`.
- Current theme: `oakDefaultTheme` light + derived dark palette; switching via context pending UI polish.
- Tabs: refactored to themed styled‑components; no inline styles.
- Inline styles: remain in header, page shell, forms, results, API docs page.
- Tests: theming unit/integration; UI flow tests pending.

---

## Immediate next tasks (ordered)

1. Replace inline styles in `app/layout.tsx` with themed styled‑components.
2. Replace inline styles in `app/page.tsx`, `ThemeSelect.tsx`, forms, results, admin, API docs.
3. Validate dark theme visuals; ensure contrast AA; hook theme toggle styling where needed.
4. Begin Oak Components refactor for inputs/selects/buttons/tabs/header.
5. Add component tests for submit/error/results flows; add a11y checks (axe).

---

## Files of interest (UI)

- Layout/nav: `app/layout.tsx`, `app/ui/ThemeSelect.tsx`.
- Page shell: `app/page.tsx`, `app/ui/SearchTabHeader.tsx`.
- Forms: `app/ui/StructuredSearch.tsx`, `app/ui/NaturalSearch.tsx`,
  `app/ui/structured-fields.tsx`, `app/ui/fields.tsx`.
- Results: `app/ui/SearchResults.tsx` (uses `dangerouslySetInnerHTML` for highlights).
- Theme infra: `app/lib/theme/{ThemeContext.tsx,theme-utils.ts}`.

---

## Decisions & invariants (UI)

- SSR‑first theming: server cookie sets initial mode; no pre‑hydration scripts.
- Theme tokens source: Oak tokens first; add app‑specific only if needed.
- Accessibility: WCAG 2.2 AA; visible focus; reduced motion respected.
- Testing: no network I/O; stub/fake fetch where required.

---

## Handy commands

- Dev: `pnpm -C apps/oak-open-curriculum-semantic-search dev`
- Tests (workspace): `pnpm -C apps/oak-open-curriculum-semantic-search test`
- Root gates: `pnpm make && pnpm qg`

---

## Short next steps checklist

[x] Tokens scaffold exists and exported
[] Inline styles migrated to themed styled‑components
[] Dark theme visuals verified for contrast AA
[] Forms/tabs/header use Oak Components
[] Highlights sanitized or safely rendered
[] Component tests for main flows; a11y checks added
