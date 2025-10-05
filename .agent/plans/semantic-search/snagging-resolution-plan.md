# Semantic Search UX Snagging Resolution Plan

## Visual Checks

Start the dev server with `pnpm dev > /tmp/semantic-dev.log 2>&1 &` so it runs in the background and the server logs are available for debugging at `/tmp/semantic-dev.log`. Then use the Playwright MCP server, which is already active, to examine the running app in the browser.

## Guiding Principles

- **Design for evolution**: build composable primitives under `app/ui/global`, `app/ui/search`, and `app/ui/ops` so surfaces can change without rewrites. Shared tokens, grids, and typography live in `app/ui/shared`.
- **Surface intent first**: every page leads with purpose, primary actions, and current state. Results appear above the fold; operations surfaces introduce health at a glance.
- **Responsive by default**: treat breakpoints and spacing tokens as first-class. Use the forthcoming `ResponsiveGrid`, `Cluster`, and `PageContainer` primitives instead of ad-hoc CSS.
- **Accessible interactions**: keep focus order logical, provide reduced-motion variants, and scope live regions to meaningful updates. Respect `prefers-reduced-motion` in hover and loading states.
- **Deterministic modes**: the fixture mode selector resides in the header; contextual notices summarise the active scenario without duplicating controls.
- **Test-driven delivery**: follow TDD. Prefer unit tests for pure utilities, integration tests for composed components/hooks, and Playwright for end-to-end visual and interaction checks. No complex mocks.

## Objectives

- Restore visual polish and information hierarchy across landing, search, admin, and status surfaces ahead of the Elasticsearch back-end work.
- Consolidate the UI architecture into the global/search/ops split with shared layout primitives, Fixture context, and documentation.
- Resolve blocking UX bugs (fixture placement, natural-language fixtures, navigation semantics) while uplifting accessibility, responsiveness, and motion handling.
- Capture deterministic evidence (tests, screenshots, logs) for each workstream in line with the testing strategy.

## Workstream 1 – UI Architecture & Organisation

**Status:** ✅ Complete. Directory reshaping, shared layout primitives, fixture context, and documentation are captured in `app/ui/README.md` and `docs/ARCHITECTURE.md`.

**Remaining actions:** None.

## Workstream 2 – Navigation & Header Polish

**Status:** ✅ Complete. Header grid, navigation metadata, and fixture toggle behaviour are recorded in `app/ui/README.md`, `docs/ARCHITECTURE.md`, and `snagging-system-foundations.md`; Playwright artefacts capture the validated journeys.

**Remaining actions:**

- Monitor Oak Components contrast improvements (tracked in `oak-components-theme-extensions.md`).
- Re-run header visual sweeps whenever downstream workstreams ship major UI changes.

## Workstream 3 – Landing Page Rework

**Status:** ✅ Complete. Landing hero, CTA treatment, and evidence are documented in `snagging.md` (2025-10-18) and supported by `tests/visual/landing.hero.spec.ts`.

**Remaining actions:** None – subsequent monitoring rolls into the cross-cutting evidence sweep.

## Workstream 4 – Search Surfaces (Structured & Natural)

**Status:** 🔄 In progress. Search layout, highlight clamping, and responsive evidence are complete (see `docs/ARCHITECTURE.md#search-secondary-accordion` and `snagging.md` entries dated 2025-10-22).

**Remaining actions:**

- Finalise skeleton loading polish (tone tokens, reduced-motion behaviour) and extend RTL/Playwright coverage to match.
- Instrument mobile support accordion toggles once the shared analytics client lands; capture panel id + open/closed state for funnel analysis.

## Workstream 5 – Natural Language Fixtures Reliability

**Status:** 🔜 Pending.

1. **Route guard ordering**: update `/api/search/nl` to resolve fixture mode before `llmEnabled()`, covering fixtures when LLM is off.
2. **Error messaging**: refine `parseResponse` to surface fixture-triggered errors distinctly in UI copy.
3. **Testing**: create integration tests for all fixture modes (fixtures, empty, error, live) asserting response schema; add RTL test verifying UI banner text for simulated errors.
4. **Visual review**: inspect natural-language flows via Playwright MCP, validating fixture messaging/alerts across modes and documenting artefacts in `snagging.md`.

## Workstream 6 – Admin Page Redesign

**Status:** 🔜 Pending.

1. **Information architecture**: apply `OperationsBlueprint` with sections (`Overview`, `Quick Actions`, `Jobs`, `Telemetry`) based on the new layout primitives.
2. **Action panels**: convert job controls into cards with descriptive copy, status chips, and collapsible log output (auto-scroll with sticky headers).
3. **Telemetry separation**: host zero-hit telemetry in its own section with summary chips at the top; integrate fixture notice pill.
4. **Responsive grid**: align with search tokens for consistent wrapping and optional sticky quick links.
5. **Testing**: add integration tests for job card state transitions (using simple stream fakes) and Playwright coverage for the redesigned admin flow, including dark mode.
6. **Visual review**: capture desktop/mobile, light/dark admin screenshots via Playwright MCP and log qualitative checks in `snagging.md`.

## Workstream 7 – Status Page Redesign

**Status:** 🔜 Pending.

1. **Status summary**: introduce `StatusSummaryCard` with severity icon, timestamp, and tone legend above the grid.
2. **Service cards**: standardise height, add optional links, and utilise accent colours consistent with tone tokens.
3. **Alert treatment**: refresh fatal alert styling with stronger contrast, actionable next steps, and optional dismissal when not critical.
4. **Diagnostics enhancements**: list health endpoints, docs, and last deploy metadata using shared `OpsCard` primitives.
5. **Testing**: update integration tests for `status-helpers` to match new copy, add RTL checks for summary card announcements, and refresh Playwright snapshots.
6. **Visual review**: run status page sweeps with Playwright MCP (all modes/breakpoints), saving screenshots and qualitative notes in `snagging.md`.

## Workstream 8 – Cross-cutting Validation & Evidence

**Status:** 🔁 Ongoing across remaining workstreams.

1. **TDD workflow**: run unit/integration tests (`pnpm test --filter "ui"` segment) after each workstream; document failures and fixes in commit messages.
2. **Playwright evidence**: re-baseline journeys (landing, structured, natural, admin, status) in light/dark and mobile/desktop profiles, including reduced-motion mode.
3. **Accessibility audit**: execute axe + manual keyboard sweeps per surface and log findings in `snagging.md` with remediation notes.
4. **Documentation updates**: refresh `semantic-search-responsive-layout-architecture.md`, `semantic-search-phase-1-ux-plan.md`, and relevant READMEs after each workstream.
5. **Release readiness**: maintain a checklist of UX acceptance criteria, test artefacts, and screenshots to support later Elasticsearch integration.

## Process & Tracking

- Execute workstreams sequentially where dependencies exist (architecture → header → search → ops).
- Record progress and evidence in `snagging.md`, linking to screenshots and logs.
- Keep change sets focussed (one workstream per PR) to support rapid review and maintain creative flow.
- Before handing off to back-end integration, review this plan against completed evidence to confirm readiness.
