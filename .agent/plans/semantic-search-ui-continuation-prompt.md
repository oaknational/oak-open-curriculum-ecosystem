# Semantic Search UI — Continuation Prompt (living context)

_Last updated: 2025‑09‑14 (Europe/London)_

Purpose: Fast handover for the UI track of the Search app. Focuses on theming,
Oak Components integration, accessibility, and page structure. Companion to the
`semantic-search-ui-plan.md`.

---

## TL;DR (UI state)

- App: Next.js App Router, Styled Components SSR, `ThemeContext` in place.
- Theming: SSR cookie → `<html data-theme-mode>`; client persists cookie + localStorage.
- Current theme: `oakDefaultTheme` only; dark variant pending.
- Inline styles: present in header, tabs, forms, results, and page shell.
- Tests: theming unit/integration; UI flow tests pending.

---

## Immediate next tasks (ordered)

1. Create `app/ui/themes/{tokens.ts,light.ts,dark.ts}` scaffolding.
2. Audit all UI for styling constants and move to tokens.
3. Replace inline styles with styled‑components consuming theme tokens.
4. Implement dark theme (adopt Oak’s if available; else derive palette overrides).
5. Wire `ThemeContext` to select light/dark; keep SSR cookie strategy.
6. Refactor inputs/selects/buttons/tabs/header to Oak Components or wrappers.
7. Add component tests for submit/error/results flows; add a11y checks (axe).

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

[] Tokens scaffold exists and exported
[] Inline styles migrated to themed styled‑components
[] Dark theme wired through `ThemeContext`
[] Forms/tabs/header use Oak Components
[] Highlights sanitized or safely rendered
[] Component tests for main flows; a11y checks added
