# Semantic Search UI — Continuation Prompt (living context)

_Last updated: 2025‑03‑16 (Europe/London)_

Purpose: Provide fast handover for the UI track aligned with the definitive semantic search architecture. Companion to `semantic-search-ui-plan.md`; always follow GO.md with self-reviews.

---

## TL;DR (UI state)

- App: Next.js App Router + Styled Components SSR; ADR-045 Theme Bridge active; light/dark themes stable with tokens under `theme.app`.
- Layout: Structured, Natural Language, and Admin pages exist; sequences scope, facets, suggestion dropdown, and admin telemetry panels are pending.
- Theming: Tokens cover core surfaces; upcoming components (facet chips, suggestion list, admin tiles) require new semantic tokens per the style audit.
- Tests: Theming unit/integration green; basic search form tests exist; no coverage yet for sequences, suggestions, facets, or admin status.

---

## Immediate next tasks (ordered, continue via GO cadence)

1. Verify dark theme contrast and focus outlines across current surfaces. Introduce token updates if needed.  
   REVIEW: Record results and token changes in the alignment refresh plan.
2. Surface sequences scope in the UI (cards, metadata, canonical URLs) and ensure responsive layout.  
   REVIEW: Update docs and tests for sequences.
3. Implement suggestion/type-ahead dropdown (accessible, keyboard navigable) wired to `/api/search/suggest`; add cache/version hints.  
   REVIEW: Confirm caching notes align with caching plan.
4. Add facet controls (chips or panel) using Oak Components; ensure selections map to structured query payloads.  
   REVIEW: Test filters/facets; update docs accordingly.
5. Enhance `/admin` with ingestion progress, zero-hit alerts, index version badge, and controls for ingestion/rollup.  
   REVIEW: Ensure telemetry surfaced matches API status output.
6. Complete Oak Components migration (forms, buttons, dropdowns); remove bespoke styling.  
   REVIEW: Verify accessibility and token usage.
7. Expand tests: Vitest for component behaviour, Playwright (via MCP) for search/suggestion/admin flows, axe-based a11y checks.  
   REVIEW: Capture gate results; note gaps.
8. Keep documentation in sync with UI changes via `semantic-search-documentation-plan.md` (update README, QUERYING, ARCHITECTURE snippets).

_(Remember GROUNDING after every two ACTION/REVIEW pairs as per GO.md.)_

---

## Files of interest

- Layout & providers: `app/layout.tsx`, `app/lib/Providers.tsx`, `app/ui/client/HeaderStyles.tsx`, `ThemeSelect.tsx`.
- Search UI: `app/ui/StructuredSearch.tsx`, `NaturalSearch.tsx`, `SearchResults.tsx`, `SequencesResults.tsx` (to add), `FacetControls.tsx` (to add), `SuggestionList.tsx` (to add).
- Admin UI: `app/admin/page.tsx`, forthcoming components (`StatusPanel`, `ZeroHitPanel`, `VersionBadge`).
- Theme tokens: `app/ui/themes/{tokens.ts, light.ts, dark.ts, types.ts}`.
- Shared hooks/utils: `app/lib/theme`, `src/lib/queries` (for payload integration), `src/lib/logging` (for telemetry hints).

---

## Decisions & invariants

- Self-review only: no sub-agent calls; log reviews in the alignment refresh plan.
- UI must surface canonical URLs, lesson-planning data, zero-hit feedback, and cache status in line with API outputs.
- Accessibility first: keyboard navigation, focus states, reduced motion, screen-reader labelling.
- Tests must stub network calls; suggestion and admin panels rely on injected fetchers/mocks.

---

## Commands & resources

- Dev server: `pnpm -C apps/oak-open-curriculum-semantic-search dev`
- Tests: `pnpm -C apps/oak-open-curriculum-semantic-search test`
- Quality gates: `pnpm make && pnpm qg`
- Playwright MCP: drive sequences/suggestion/admin flows while monitoring server logs.
- Docs: update via `semantic-search-documentation-plan.md`; regenerate with `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`.

---

## Checklist snapshot

[ ] Dark theme AA contrast verified for new surfaces
[ ] Sequences scope UI implemented with canonical URLs
[ ] Suggestion dropdown accessible & wired to `/api/search/suggest`
[ ] Facet controls implemented using Oak Components tokens
[ ] Admin telemetry dashboard reflects status endpoint (progress, zero hits, index version)
[ ] Oak Components migration complete (forms/buttons/dropdowns)
[ ] Component + Playwright + axe tests covering sequences/suggestions/admin flows
[ ] Documentation updated (README, QUERYING, ARCHITECTURE) after each major UI change

Keep iterating through GO.md tasks, logging reviews and grounding steps in the refresh plan. EOF
