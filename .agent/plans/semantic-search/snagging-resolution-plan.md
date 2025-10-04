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

1. ACTION: Audit existing header implementation against `snagging.md` issues and
   `snagging-system-foundations.md` guidance; document deltas in plan notes.
   REVIEW: Summarise identified gaps plus relevant issue IDs in plan change log.

### 2025-10-04 – Workstream 2 Audit Notes

- `snagging.md` (Navigation): Theme selector remains right-aligned because the header still pushes the utilities cluster with `$ml="auto"`; requirement calls for left alignment after wrapping.
- `snagging.md` (Navigation): Primary navigation continues to surface the root route as “Search”, whereas the snagging fix expects it to read “Home”.
- `snagging.md` (Navigation): Oak mark link already exists and targets `/`, so no further action required.
- `snagging-system-foundations.md` (Header blueprint): Header layout still relies on a flex row and lacks the prescribed grid areas, centralised nav metadata hook, and fixture toggle slot.
- `snagging-system-foundations.md` (Accessibility): Skip links remain active via `SearchSkipLinks`, but the header does not expose an entry point for the utilities cluster yet.

2. ACTION: Catalogue Oak Components tokens required (spacing, typography,
   palette, breakpoints) and note any missing values in
   `oak-components-theme-extensions.md`.
   REVIEW: Verify token list matches usage in `Header.tsx` and shared layout
   helpers.

### 2025-10-04 – Header Token Inventory

- **Spacing**: `cluster`, `section`, `inline-base`, `inline-wide` via `getSpacingVar()` for gaps, inline padding, and wrap spacing.
- **Breakpoints**: `app.layout.breakpoints.md` (stack utilities) and `.lg` (restore three-area grid), with `.xl` in reserve if we need to clamp nav width.
- **Typography**: `OakTypography` presets `body-3` (nav links) and `body-4` (utility labels) backed by `app.fonts.primary`.
- **Palette & colours**: `app.palette.brandPrimary`, `app.palette.brandPrimaryBright`, `uiColors['text-primary']`, and `app.colors.headerBorder` for focus, hover, and separators.
- **Radii**: `app.radii.pill` reserved for fixture toggle / utilities cluster chips once integrated.

3. ACTION: Define responsive grid spec for the header using
   `getSpacingVar()` spacing tokens and `getAppTheme(theme).app.layout.*`
   breakpoints; capture spec in this plan and foundations doc.
   REVIEW: Ensure grid spec covers logo/nav/utilities for ≥lg and stacked layout
   ≤md with explicit token references.

### 2025-10-04 – Header Grid Spec

- **Base / ≤ `md` (≤768px)**: single-column CSS grid with areas ordered `logo`, `nav`, `utilities`; `row-gap: getSpacingVar('stack')`, `padding-inline: getSpacingVar('inline-base')`, `justify-items: start` to keep utilities left aligned once they wrap.
- **≥ `lg` (≥1024px)**: switch to three-column grid `grid-template-columns: auto minmax(0, 1fr) auto`, `grid-template-areas: "logo nav utilities"`, `column-gap: getSpacingVar('cluster')`, `row-gap: getSpacingVar('section')`, and `align-items: center` so logo, navigation, and utilities share a baseline.
- **≥ `xl` (≥1360px)**: widen inline padding to `getSpacingVar('inline-wide')` while preserving the three-area composition; clamp nav width with `max-width: getAppTheme(theme).app.layout.containerMaxWidth` if overflow reappears.
- **Utilities cluster**: render as a flex column using `getSpacingVar('stack')` for internal gap; align with the nav area via `justify-self: end` on ≥`lg` and `justify-self: start` otherwise.

4. ACTION: Centralise nav metadata in `useNavItems()` (including Oak icon link,
   fixtures toggle placeholder) and wire labels/ARIA from snagging issues.
   REVIEW: Confirm resulting hook feeds Header + tests without duplicated
   strings.

### 2025-10-04 – Navigation Metadata Centralised

- Introduced `useNavItems()` returning Oak home link, ordered primary routes (root relabelled to “Home”), and utilities metadata for theme + fixture toggles.
- Header now consumes the hook for logo, nav items, and utility ARIA labels, eliminating inline arrays and duplicated strings.
- Added `useNavItems.unit.test.ts` alongside updated `Header.integration.test.tsx` to pin the metadata contract and ensure the hook drives rendering.

5. ACTION: Implement AA-compliant focus/hover states using existing palette
   tokens (`brandPrimaryBright`, `text-primary`) and log any missing token gaps
   for Oak Components follow-up.
   REVIEW: Check computed styles via RTL assertions to ensure token usage only.

### 2025-10-04 – Focus & Hover Styling

- Header links now use Oak spacing/radii tokens for larger targets and apply hover/focus styles with `brandPrimary` + `brandPrimaryBright` while keeping text on `textPrimary`.
- RTL integration test inspects the styled-components sheet to confirm Oak palette colours (`brandPrimary`, `brandPrimaryBright`) are referenced.
- No new token gaps identified; existing palette/radii/padding tokens cover the interactions.

6. GROUNDING: Read GO.md and follow all instructions before continuing.
7. ACTION: Integrate `FixtureModeContext` state into header utilities while
   sharing toggle UI with `global/Fixture` components; document interplay here.
   REVIEW: Validate by writing integration notes + verifying context tests
   remain green.
8. ACTION: Update header layout tests (RTL + Playwright) to cover responsive
   wrapping, keyboard navigation, and fixture toggle interactions.
   REVIEW: Confirm new tests fail pre-change and pass post-change.
9. ACTION: Perform visual review via Playwright MCP (desktop/mobile,
   light/dark/reduced motion) logging observations in `snagging.md` and
   capturing screenshots.
   REVIEW: Ensure evidence artefacts stored under `test-artifacts/` and linked
   from the plan.
10. QUALITY-GATE: Run targeted `pnpm test --filter header` (or equivalent) to
    confirm unit/integration coverage before broader suites.
11. ACTION: Refresh documentation—`app/ui/README.md`, architecture doc, and this
    plan—with the new navigation structure, token usage, and outstanding Oak
    component extension requests.
    REVIEW: Cross-check docs reference same token names and component entry
    points.
12. ACTION: Raise follow-up entries in
    `.agent/plans/semantic-search/oak-components-theme-extensions.md` for any
    token or component enhancements discovered during implementation.
    REVIEW: Confirm entries include rationale, affected tokens, and proposed
    API.
13. QUALITY-GATE: Run full UI quality gate (`pnpm test:ui`) once header work is
    complete to ensure journeys remain stable.
14. QUALITY-GATE: Conclude with full repo checks (`pnpm qg`) prior to PR to
    guarantee regression-free delivery.

## Workstream 3 – Landing Page Rework

1. **Hero layout**: use `HeroLayout` (built on `ResponsiveGrid`) to centre the hero up to ~70ch, keeping single-line heading typography and responsive stacking.
2. **Primary CTAs**: add Oak primary buttons for structured/natural search plus supportive links; ensure focus order matches visual layout.
3. **Copy differentiation**: refine subtitle vs body copy to convey guidance vs exploration; align with “surface intent first”.
4. **CTA cards**: convert to full-card `<Link>` components with motion-safe hover glow (guarded by `prefers-reduced-motion`) and upgraded focus outlines.
5. **Testing**: add RTL snapshot-style assertions for layout tokens and CTA presence, plus Playwright visual baselines (light/dark, mobile/desktop) capturing hero + cards.
6. **Visual review**: run manual/Playwright MCP inspection (desktop/mobile, light/dark, reduced motion) noting deviations in `snagging.md` with supporting screenshots.

## Workstream 4 – Search Surfaces (Structured & Natural)

1. **Fixture messaging**: swap the banner for a compact pill near the hero showing `Using fixture scenario: …`, fed by `FixtureModeContext`.
2. **Priority layout**: adopt a two-column grid (≥ `lg`) separating controls/support from results so results stay visible above the fold. Ensure small screens stack hero → controls → results with limited gaps.
3. **Controls clarity**: simplify `SearchPageControlsGrid`, add headings, and align inputs vertically using spacing tokens.
4. **Results prominence**: wrap `SearchResults` in `ResultsContainer` with sticky summary, accent borders, and motion-safe hover cues.
5. **Secondary content**: move suggestions/facets into a side panel on wide screens and accordion stack on mobile.
6. **Skeleton/loading states**: implement `ResultsSkeleton` and `SummarySkeleton` respecting reduced-motion preferences.
7. **Testing**: extend unit tests for new layout utilities, add RTL integration tests ensuring fixture pills update on context change, and refresh Playwright flows for structured/natural paths (including reduced-motion snapshots).
8. **Visual review**: run Playwright MCP walkthrough for structured/natural search across breakpoints/modes, capturing screenshots and notes in `snagging.md`.

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
