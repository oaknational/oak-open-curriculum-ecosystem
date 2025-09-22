# Semantic Search UI Plan (Design, theming, Oak Components, observability)

Role: Deliver an Oak-quality UI for the semantic search workspace that showcases the definitive back-end architecture (structured/NL search, suggestions, admin tooling, observability). This plan builds on theming work already in place and aligns UI surfaces with `semantic-search-target-alignment-plan.md`.

Document relationships

- API plan: `semantic-search-api-plan.md`
- Documentation plan: `semantic-search-documentation-plan.md`
- Caching plan: `semantic-search-caching-plan.md`
- Alignment roadmap: `semantic-search-alignment-refresh-plan.md`
- UI continuation prompt: `semantic-search-ui-continuation-prompt.md`
- Archived source: `archive/semantic-search-service-plan.md`

---

## Scope

- Next.js App Router pages: `/` (search demo), `/admin` (ingestion + rollup status), auxiliary routes (docs, health).
- UI components for structured search, natural language search, sequences scope, facets, suggestion/type-ahead, zero-hit feedback, and admin telemetry.
- Theming and design system integration using Oak Components with the ADR-045 bridge.
- Accessibility (WCAG 2.2 AA), localisation readiness (British spelling), observability surfaces, and UI testing.

Out of scope: back-end logic (covered in API plan), but UI must consume the updated APIs and reflect observability outcomes.

---

## Current state snapshot

- Hybrid theming bridge implemented; light/dark themes exist; inline styles largely migrated to semantic tokens for core forms/results.
- Structured and NL forms render side-by-side; admin page skeleton exists but lacks streaming progress and observability panels.
- Sequences scope not yet surfaced in the UI; facets and suggestion dropdowns are absent.
- Oak Components adoption incomplete (inputs/buttons/selects still custom in places).
- Zero-hit logging feedback, index version indicators, and cache status messages missing.
- UI tests cover theming and basic form interactions only; no coverage for sequences, suggestions, or admin flows.

---

## Objectives

1. Showcase all three scopes (lessons, units, sequences) with enriched metadata, canonical URLs, highlights, and facets.
2. Provide suggestion/type-ahead controls with accessible dropdowns, keyboard navigation, and cache status messaging.
3. Equip the admin page with ingestion progress, last batch details, zero-hit telemetry, and index version indicators sourced from `/api/index-oak/status`.
4. Complete Oak Components migration, ensuring consistent theming, responsive layout, and AA contrast.
5. Deliver a11y, unit, and integration tests for search flows, suggestions, sequences, admin telemetry, and theme switching.
6. Adhere to GO.md cadence with self-reviews; update continuation prompt after major milestones.

---

## Non-negotiable requirements

- All components consume `theme.app` tokens; no raw hex codes or inline styles.
- No `dangerouslySetInnerHTML`; highlights rendered via sanitised React elements.
- Accessible, keyboard-navigable suggestion lists and facet controls; conform to WAI-ARIA practices.
- Admin dashboard surfaces must fail fast with descriptive errors when status endpoint unavailable.
- Observability UI must not pollute logs unnecessarily; rely on back-end telemetry but expose summaries.
- UI tests must avoid real network calls; use mocked fetchers passed via providers.

---

## Workstreams

1. **Scope surfacing & layouts**
   - Introduce sequences tab/section with cards highlighting canonical URLs, years, categories.
   - Rework layout to support facet columns and responsive stacking (desktop vs mobile).

2. **Suggestions & facets**
   - Add suggestion input with debounced calls to `/api/search/suggest`, accessible dropdown, and selection handoff to structured search.
   - Implement facet chips/toggles using Oak Components; ensure filters map to structured payloads.

3. **Admin telemetry UI**
   - Render progress bars, counters, last error summaries, and index version from status endpoint.
   - Provide controls to trigger ingestion/rollup with optimistic UI and error feedback.

4. **Oak Components migration**
   - Replace bespoke controls with Oak components (Inputs, Selects, Buttons, Tabs, Notifications).
   - Ensure design tokens cover new components (facet chips, status banners, suggestion lists).

5. **Observability & zero-hit feedback**
   - Surface zero-hit alerts inline with search results, referencing recent queries and recommended actions.
   - Provide log trace links or summary modal for debugging.

6. **Testing & accessibility**
   - Expand Vitest/Playwright suites: search flows (lessons/units/sequences), suggestions, facets, admin status.
   - Add axe-based a11y checks and visual regression tests for light/dark themes.

---

## Milestones (sequenced with GO cadence)

- **M0 — Alignment groundwork**: Confirm theming bridge, Providers, and responsive layout handle new sections. Update continuation prompt.
- **M1 — Scope expansion & facets**: Introduce sequences, facets, canonical URL rendering. Tests for scope selection and facet toggles.
- **M2 — Suggestions & Oak Components**: Suggestion dropdown, Oak controls for all forms/buttons. Keyboard navigation + tests.
- **M3 — Admin telemetry & observability**: Status dashboard, zero-hit panels, ingestion triggers with feedback, logging indicators.
- **M4 — Testing & accessibility hardening**: Comprehensive component tests, Playwright flows, axe/contrast checks, documentation updates.

Each milestone requires GO.md ACTION/REVIEW pairs, grounding every third task, and recorded self-reviews in the alignment refresh plan.

---

## Acceptance criteria

- `/` renders lessons, units, and sequences with accurate metadata, highlights, canonical URLs, and facet controls; suggestion dropdown is keyboard-accessible and integrated.
- `/admin` displays ingestion status, zero-hit metrics, index version, and triggers with error handling.
- Oak Components power all interactive elements; theming tokens cover facet chips, suggestion dropdown, status banners, and admin metrics.
- UI conveys cache/version state and instructs users when results may be stale (ties into caching plan).
- Unit/integration/a11y tests cover all new features; test suites run without network I/O.
- Documentation (`docs/QUERYING.md`, `docs/SETUP.md`, README) is updated in lockstep with UI changes via documentation plan.

---

## Workflow & references

- Follow GO.md for every change (ACTION → REVIEW, regular grounding).
- Reference `.agent/directives-and-memory/rules.md`, `docs/agent-guidance/testing-strategy.md`, and `semantic-search-target-alignment-plan.md` before planning features.
- Coordinate with caching and documentation plans to ensure UI hints match back-end behaviour.
- Keep `semantic-search-ui-continuation-prompt.md` updated after each milestone to reflect current state and next steps.

---

## Dev & E2E workflow (Playwright MCP)

- Run Next.js dev server and use the Playwright MCP server for scripted UI flows (search, suggestions, admin actions).
- Capture server logs alongside tests to validate telemetry events (zero hits, ingestion progress).
- Use mocked fetch adapters in tests to avoid real network calls and to simulate status changes deterministically.
