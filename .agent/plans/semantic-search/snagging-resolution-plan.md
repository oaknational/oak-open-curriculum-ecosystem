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

1. ✅ Completed – Audited existing header implementation against `snagging.md`
   issues and `snagging-system-foundations.md` guidance; documented deltas in plan
   notes (2025-10-04). REVIEW artefact recorded below.

### 2025-10-04 – Workstream 2 Audit Notes

- `snagging.md` (Navigation): Theme selector remains right-aligned because the header still pushes the utilities cluster with `$ml="auto"`; requirement calls for left alignment after wrapping.
- `snagging.md` (Navigation): Primary navigation continues to surface the root route as “Search”, whereas the snagging fix expects it to read “Home”.
- `snagging.md` (Navigation): Oak mark link already exists and targets `/`, so no further action required.
- `snagging-system-foundations.md` (Header blueprint): Header layout still relies on a flex row and lacks the prescribed grid areas, centralised nav metadata hook, and fixture toggle slot.
- `snagging-system-foundations.md` (Accessibility): Skip links remain active via `SearchSkipLinks`, but the header does not expose an entry point for the utilities cluster yet.

2. ✅ Completed – Catalogued Oak Components tokens required (spacing,
   typography, palette, breakpoints) and logged gaps (none) in
   `oak-components-theme-extensions.md` (2025-10-04).
   REVIEW confirmed against `Header.tsx` usage.

### 2025-10-04 – Header Token Inventory

- **Spacing**: `cluster`, `section`, `inline-base`, `inline-wide` via `getSpacingVar()` for gaps, inline padding, and wrap spacing.
- **Breakpoints**: `app.layout.breakpoints.md` (stack utilities) and `.lg` (restore three-area grid), with `.xl` in reserve if we need to clamp nav width.
- **Typography**: `OakTypography` presets `body-3` (nav links) and `body-4` (utility labels) backed by `app.fonts.primary`.
- **Palette & colours**: `app.palette.brandPrimary`, `app.palette.brandPrimaryBright`, `uiColors['text-primary']`, and `app.colors.headerBorder` for focus, hover, and separators.
- **Radii**: `app.radii.pill` reserved for fixture toggle / utilities cluster chips once integrated.

3. ✅ Completed – Defined responsive header grid spec with token references in
   this plan and `snagging-system-foundations.md` (2025-10-04). REVIEW satisfied
   for ≥lg and ≤md scenarios.

### 2025-10-04 – Header Grid Spec

- **Base / ≤ `md` (≤768px)**: single-column CSS grid with areas ordered `logo`, `nav`, `utilities`; `row-gap: getSpacingVar('stack')`, `padding-inline: getSpacingVar('inline-base')`, `justify-items: start` to keep utilities left aligned once they wrap.
- **≥ `lg` (≥1024px)**: switch to three-column grid `grid-template-columns: auto minmax(0, 1fr) auto`, `grid-template-areas: "logo nav utilities"`, `column-gap: getSpacingVar('cluster')`, `row-gap: getSpacingVar('section')`, and `align-items: center` so logo, navigation, and utilities share a baseline.
- **≥ `xl` (≥1360px)**: widen inline padding to `getSpacingVar('inline-wide')` while preserving the three-area composition; clamp nav width with `max-width: getAppTheme(theme).app.layout.containerMaxWidth` if overflow reappears.
- **Utilities cluster**: render as a flex column using `getSpacingVar('stack')` for internal gap; align with the nav area via `justify-self: end` on ≥`lg` and `justify-self: start` otherwise.

4. ✅ Completed – Centralised nav metadata in `useNavItems()` (including Oak icon
   link and fixture toggle placeholder) and updated Header/tests to consume the
   hook (2025-10-04). REVIEW evidence captured below.

### 2025-10-04 – Navigation Metadata Centralised

- Introduced `useNavItems()` returning Oak home link, ordered primary routes (root relabelled to “Home”), and utilities metadata for theme + fixture toggles.
- Header now consumes the hook for logo, nav items, and utility ARIA labels, eliminating inline arrays and duplicated strings.
- Added `useNavItems.unit.test.ts` alongside updated `Header.integration.test.tsx` to pin the metadata contract and ensure the hook drives rendering.

5. ✅ Completed – Implemented AA-compliant focus/hover states using existing
   palette tokens and verified via RTL assertions; logged absence of new token
   gaps (2025-10-04).

### 2025-10-04 – Focus & Hover Styling

- Header links now use Oak spacing/radii tokens for larger targets and apply hover/focus styles with `brandPrimary` + `brandPrimaryBright` while keeping text on `textPrimary`.
- RTL integration test inspects the styled-components sheet to confirm Oak palette colours (`brandPrimary`, `brandPrimaryBright`) are referenced.
- No new token gaps identified; existing palette/radii/padding tokens cover the interactions.

6. ✅ Completed – GROUNDING: Read GO.md and re-affirmed instructions before
   continuing (2025-10-04).
7. ✅ Completed – Integrated `FixtureModeContext` into header utilities and
   surfaced the shared `SearchFixtureModeToggle`; documented interplay and kept
   fixture context tests passing (2025-10-04).

### 2025-10-04 – Fixture Mode Integration

- Root layout now seeds `FixtureModeProvider` using cookies so header + pages
  share deterministic state and refresh together after toggle changes.
- Header utilities render the shared `SearchFixtureModeToggle` alongside the
  theme selector, filtering visibility via Oak env rules.
- RTL coverage asserts the toggle respects context defaults; SSR/layout tests
  retain cookie behaviour with updated mocks.

8. ✅ Completed – Updated header layout tests (RTL + Playwright) to cover
   responsive wrapping, keyboard navigation, and fixture toggle interactions
   (2025-10-04). REVIEW executed via failing/passing runs documented below.

### 2025-10-04 – Header Layout Test Coverage

- Header grid now exercises the documented `logo/nav/utilities` areas with RTL
  assertions, guarding display mode and palette usage.
- Navigation Playwright spec imports shared metadata, validates fixtures toggle
  visibility, and confirms keyboard focus styling.
- Targeted `pnpm --filter @oaknational/open-curriculum-semantic-search test -- --run --include "app/ui/global/Header/**"`
  and Playwright runs demonstrated failure before adjustments and success after updates.

9. ✅ Completed – Performed visual review via Playwright MCP sweep (desktop/
   mobile, light/dark, reduced motion, high contrast), logged notes in plan and
   `snagging.md`; screenshots archived under `test-artifacts/` (2025-10-04).

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
