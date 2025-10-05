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

1. ✅ **Restructure directories**: `app/ui` now splits into `global/`, `search/`, `ops/`, `shared/`, with server/client entry points (`client.ts`, `index.ts`) to enforce boundaries.
2. ✅ **Introduce layout primitives**: `PageContainer`, `ResponsiveGrid`, `Cluster`, and spacing helpers live under `global/Layout` with targeted unit/integration coverage.
3. ✅ **Organise remaining files**: legacy root modules removed; documentation consolidated in `app/ui/README.md` and directories house their tests alongside code.
4. ✅ **Fixture context**: `global/Fixture/FixtureModeContext` provides hooks + integration tests for cookie bootstrap; clients consume via `app/ui/global/client`.
5. ✅ **Documentation**: `app/ui/README.md` and updated architecture notes emphasise SDK-derived types and layering guidance replacing the old client README.
6. ✅ **Testing**: layout primitives, fixture context, and the `no-export-trivial-type-aliases` lint rule ship with Vitest/RTL coverage; imports refreshed to new barrels across UI and API code.

**Remaining Workstream 1 actions**: none — directory refactor, primitives, documentation, and tests are in place. Future changes should extend the existing primitives/tests rather than add new surface-specific helpers.

## Workstream 2 – Navigation & Header Polish

### Summary (2025-10-18)

- Header now follows the documented grid (`logo/nav/utilities`) with Oak spacing tokens controlling wrap behaviour across breakpoints. Details live in `app/ui/README.md` and `snagging-system-foundations.md`.
- `useNavItems()` centralises logo, primary routes (root relabelled to “Home”), and utilities metadata; RTL + integration coverage guard the contract.
- Utilities cluster hosts the theme selector and `SearchFixtureModeToggle`, backed by `FixtureModeContext` so header, cookies, and page notices stay in sync.
- Focus/hover styling uses Oak palette tokens; visual sweeps (light/dark/reduced motion/high contrast) are logged in `snagging.md` and Playwright artefacts under `test-artifacts/`.
- Playwright fixture workflow (`tests/visual/fixture-toggle.spec.ts`) seeds deterministic cookies, drives the header radios, and asserts live/fixture summaries.
- Quality gates (`pnpm test:ui`, `pnpm qg`) pass as of 2025-10-18 after the fixture workflow refactor.

### Open follow-ups

- Track Oak Components high-contrast palette improvements in `oak-components-theme-extensions.md`.
- Re-run Playwright visual sweeps when Workstream 3+ changes land to keep evidence fresh.

### 2025-10-04 – Header & Surface Visual Review

| Mode                   | Surface                          | Findings                                                                                                                                                                 | Follow-up                                            |
| ---------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| Light                  | Header (desktop/mobile)          | Navigation grid aligns logo/nav/utilities per spec; fixture toggle stacks beneath theme selector ≤768px with consistent spacing tokens. Focus outlines meet AA contrast. | None.                                                |
| Dark                   | Header                           | Palette tokens maintain contrast (brandPrimaryBright outline, brandPrimary text). Logo mark remains legible; toggle retains oak radio styling.                           | None.                                                |
| Prefers reduced motion | Header + Search hero             | Hover underline animation relies on colour/focus only; no motion detected. Search cards still animate subtly—future Workstream 3 follow-up.                              | Track card motion adjustments during landing rework. |
| Prefers high contrast  | Header (forced-colors simulated) | Oak components fall back to browser outline; brand palette not exposed as forced-color tokens. Toggle radios fallback to default forced palette.                         | Log high-contrast token gaps for Oak Components.     |
| Light                  | Search (structured/natural)      | Fixture notice pill appears above hero, stays left-aligned on mobile. Results grid maintains breathing room.                                                             | Address hero CTA hierarchy in Workstream 3.          |
| Dark                   | Search                           | Typography remains legible; notice pill readable with existing palette.                                                                                                  | None.                                                |
| Light                  | Admin                            | Utilities cluster (fixture toggle + theme) accessible; panel grid still awaiting redesign.                                                                               | Covered by Workstream 6.                             |
| Light/Dark             | Status                           | Header integrates cleanly; overall page still needs tonal hierarchy improvements.                                                                                        | Workstream 7.                                        |

Key accessibility notes:

- **High contrast**: currently inherits browser defaults. Record palette/outline gaps in the Oak Components extension log.
- **Reduced motion**: header interactions respect reduced-motion; card animations require later refinement.
- **General design excellence**: header now presents balanced spacing, but downstream page layouts (landing, admin, status) still require the planned redesign workstreams.

10. ✅ Completed – Ran targeted header suites via `pnpm --filter @oaknational/open-curriculum-semantic-search test -- --run --include "app/ui/global/Header/**"` (2025-10-04).
11. ✅ Completed – Refreshed `app/ui/README.md` with the header grid/fixture
    context contract, updated `snagging-system-foundations.md` to mirror the
    implemented spacing tokens (`app.space.gap.{stack,cluster,section}`) and
    inline padding guards, and recorded this step within the plan
    (2025-10-18). REVIEW confirmed docs reference the shared
    `SearchFixtureModeToggle` + `useFixtureMode()` entry points.
12. ✅ Completed – Logged high-contrast palette gap in
    `.agent/plans/semantic-search/oak-components-theme-extensions.md`
    (2025-10-04).
13. QUALITY-GATE: Run full UI quality gate (`pnpm test:ui`) once header work is
    complete to ensure journeys remain stable.
    STATUS 2025-10-18 – Passed after refactoring
    `tests/visual/fixture-toggle.spec.ts` to seed fixture cookies via
    `modeToCookieValue`, assert header summaries, and drive in-app toggles when
    switching to live data. All 19 Playwright journeys now succeed with
    deterministic fixture coverage.
14. QUALITY-GATE: Conclude with full repo checks (`pnpm qg`) prior to PR to
    guarantee regression-free delivery.
    STATUS 2025-10-18 – Passed; full quality gate (format → type-check → lint →
    markdownlint → unit/integration → Playwright → e2e → smoke) completed with
    the updated fixture workflow.

## Workstream 3 – Landing Page Rework

### Summary (2025-10-18)

- Hero now centres content within a 70ch clamp, delivers distinct supporting copy, and surfaces primary entry buttons for structured and natural searches.
- Card links have been promoted to full-card anchors with motion-safe hover states (prefers-reduced-motion guards) and focus outlines.
- Landing integration test updated to assert hero messaging and new CTA semantics; Playwright coverage added via `tests/visual/landing.hero.spec.ts` with screenshot evidence attached to test artefacts.

### Next steps

- Monitor hero/card behaviour across responsive breakpoints during broader Workstream 3 layout changes and capture MCP evidence for desktop/mobile sweeps (tracked in `snagging.md`).

## Workstream 4 – Search Surfaces (Structured & Natural)

### Status (2025-10-18)

- Fixture messaging now renders as a compact pill (`Using fixture scenario: …`) sourced from `FixtureModeContext`; header remains the single point of control.
- Search + admin pages consume the context via `FixtureModeProvider`; integration and Playwright suites updated to assert the new messaging and absence of duplicate on-page radios.

### Next steps

- Rework hero/copy for structured + natural variants to emphasise intent and streamline supporting paragraphs.
- Adopt the planned two-column results-first grid (≥`lg`) so outcome summaries stay above the fold and secondary content relocates to side panels/accordions.
- Introduce motion-safe skeletons and sticky results summaries, updating RTL + Playwright coverage accordingly.

## Workstream 5 – Natural Language Fixtures Reliability

1. **Route guard ordering**: update `/api/search/nl` to resolve fixture mode before `llmEnabled()`, covering fixtures when LLM is off.
2. **Error messaging**: refine `parseResponse` to surface fixture-triggered errors distinctly in UI copy.
3. **Testing**: create integration tests for all fixture modes (fixtures, empty, error, live) asserting response schema; add RTL test verifying UI banner text for simulated errors.
4. **Visual review**: inspect natural-language flows via Playwright MCP, validating fixture messaging/alerts across modes and documenting artefacts in `snagging.md`.

## Workstream 6 – Admin Page Redesign

1. **Information architecture**: apply `OperationsBlueprint` with sections (`Overview`, `Quick Actions`, `Jobs`, `Telemetry`) based on the new layout primitives.
2. **Action panels**: convert job controls into cards with descriptive copy, status chips, and collapsible log output (auto-scroll with sticky headers).
3. **Telemetry separation**: host zero-hit telemetry in its own section with summary chips at the top; integrate fixture notice pill.
4. **Responsive grid**: align with search tokens for consistent wrapping and optional sticky quick links.
5. **Testing**: add integration tests for job card state transitions (using simple stream fakes) and Playwright coverage for the redesigned admin flow, including dark mode.
6. **Visual review**: capture desktop/mobile, light/dark admin screenshots via Playwright MCP and log qualitative checks in `snagging.md`.

## Workstream 7 – Status Page Redesign

1. **Status summary**: introduce `StatusSummaryCard` with severity icon, timestamp, and tone legend above the grid.
2. **Service cards**: standardise height, add optional links, and utilise accent colours consistent with tone tokens.
3. **Alert treatment**: refresh fatal alert styling with stronger contrast, actionable next steps, and optional dismissal when not critical.
4. **Diagnostics enhancements**: list health endpoints, docs, and last deploy metadata using shared `OpsCard` primitives.
5. **Testing**: update integration tests for `status-helpers` to match new copy, add RTL checks for summary card announcements, and refresh Playwright snapshots.
6. **Visual review**: run status page sweeps with Playwright MCP (all modes/breakpoints), saving screenshots and qualitative notes in `snagging.md`.

## Workstream 8 – Cross-cutting Validation & Evidence

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
