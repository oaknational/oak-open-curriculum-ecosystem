# Semantic Search UX Snagging Resolution Plan

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

1. **Restructure directories**: move current `app/ui/client` assets into `app/ui/global`, `app/ui/search`, `app/ui/ops`, and `app/ui/shared` as outlined in `snagging-system-foundations.md`. Provide barrels (`index.ts`) per area.
2. **Introduce layout primitives**: extract the existing `PageContainer`, control grids, and spacing helpers into reusable `ResponsiveGrid`, `Cluster`, `PageContainer`, and `spacing` utilities with unit tests for token resolution.
3. **Organise remaining files**: move any files remaining in the root of `app/ui/` other than the README and the index.ts file into the appropriate subdirectories.
4. **Fixture context**: scaffold `FixtureModeContext` under `global/Fixture`, exposing hooks for later header/menu work; add integration tests verifying initial state from cookies/env mocks.
5. **Documentation**: replace `app/ui/client/README.md` with a layering guide covering directories, TDD expectations, and where tests live.
6. **Testing**: for each extracted helper, add Vitest unit or integration tests (no IO, simple fakes). Update existing test imports to the new path structure.

### Type Safety

1. **Catalogue alias usage**: inventory every type alias defined under `app/ui`, `app/api`, and search fixture helpers, recording the canonical SDK type each alias wraps.
   - ✅ Completed 2025-02-14: alias map captured and referenced during refactors.
2. **Refactor to SDK types**: update `structured-search.*`, natural-search helpers, fixtures, and API routes to import `SearchStructuredRequest`, `HybridResponse`, `SuggestionItem`, etc. directly from the SDK, removing intermediate alias modules (e.g. `structured-search.shared.ts`).
   - ✅ Structured & natural UI, API handlers, and fixtures now import SDK models directly; alias shim removed.
3. **Clarify request/response helpers**: separate request-body builders from response parsing; ensure all response schemas are applied at the point of use rather than abstracted through aliases.
   - ✅ Request builders / parsing logic split into focussed helpers with schemas applied at call sites.
   - ✅ Search API fixture helpers extracted into `app/api/search/fixture-responses.ts`, keeping the service module lean.
   - ✅ Search fixtures relocated to `app/lib/search-fixtures` so API/server code no longer depends on UI directories; tests updated and lint/type checks pass for the shared module.
4. **Fix `parseSearchRequest` contract**: return `SafeParseReturnType<unknown, SearchStructuredRequest>` (or equivalent) and streamline downstream handling in `route.ts` to rely on the parsed data.
   - ✅ API route + service updated to consume typed payloads end-to-end.
5. **Publish ESLint rule**: add a custom lint rule discouraging exported aliases that just re-export another type, wire it into the shared config, and provide actionable messaging.
   - 🔄 Rule scaffolding & integration complete; refining logic to allow internal aliases while flagging exported “forwarder” aliases.
6. **Backfill tests**: add unit tests for refactored helpers (e.g. `search-service`), and ensure lint/test suites confirm the absence of legacy alias modules.
   - 🔄 Additional coverage added for request parsing/suggestions; continue expanding around new helpers.
7. **Document expectations**: update the UI README (and relevant architecture docs) with guidance that all types must originate from the SDK and exported alias indirections are discouraged.

## Workstream 2 – Navigation & Header Polish

1. **Header grid**: rebuild the header using `ResponsiveGrid` with areas `logo`, `nav`, `utilities`. Ensure utilities wrap beneath nav and left-align on < `md`.
2. **Navigation semantics**: centralise nav items in `useNavItems()` (fix “Homes” → “Home”), add the Oak icon link, and confirm skip links remain first in DOM order.
3. **Theme selector refinements**: adjust styling for AA contrast, focus indicators, and stacked presentation.
4. **Fixture mode menu**: introduce a header-level select/menu wired to `FixtureModeContext` and the existing server action. Include integration tests mocking the context and verifying dispatch + aria labelling.
5. **Testing**: add RTL integration tests covering responsive classnames (using container width queries) and header keyboard navigation. Update Playwright smoke to capture header interactions on desktop and mobile.

## Workstream 3 – Landing Page Rework

1. **Hero layout**: use `HeroLayout` (built on `ResponsiveGrid`) to centre the hero up to ~70ch, keeping single-line heading typography and responsive stacking.
2. **Primary CTAs**: add Oak primary buttons for structured/natural search plus supportive links; ensure focus order matches visual layout.
3. **Copy differentiation**: refine subtitle vs body copy to convey guidance vs exploration; align with “surface intent first”.
4. **CTA cards**: convert to full-card `<Link>` components with motion-safe hover glow (guarded by `prefers-reduced-motion`) and upgraded focus outlines.
5. **Testing**: add RTL snapshot-style assertions for layout tokens and CTA presence, plus Playwright visual baselines (light/dark, mobile/desktop) capturing hero + cards.

## Workstream 4 – Search Surfaces (Structured & Natural)

1. **Fixture messaging**: swap the banner for a compact pill near the hero showing `Using fixture scenario: …`, fed by `FixtureModeContext`.
2. **Priority layout**: adopt a two-column grid (≥ `lg`) separating controls/support from results so results stay visible above the fold. Ensure small screens stack hero → controls → results with limited gaps.
3. **Controls clarity**: simplify `SearchPageControlsGrid`, add headings, and align inputs vertically using spacing tokens.
4. **Results prominence**: wrap `SearchResults` in `ResultsContainer` with sticky summary, accent borders, and motion-safe hover cues.
5. **Secondary content**: move suggestions/facets into a side panel on wide screens and accordion stack on mobile.
6. **Skeleton/loading states**: implement `ResultsSkeleton` and `SummarySkeleton` respecting reduced-motion preferences.
7. **Testing**: extend unit tests for new layout utilities, add RTL integration tests ensuring fixture pills update on context change, and refresh Playwright flows for structured/natural paths (including reduced-motion snapshots).

## Workstream 5 – Natural Language Fixtures Reliability

1. **Route guard ordering**: update `/api/search/nl` to resolve fixture mode before `llmEnabled()`, covering fixtures when LLM is off.
2. **Error messaging**: refine `parseResponse` to surface fixture-triggered errors distinctly in UI copy.
3. **Testing**: create integration tests for all fixture modes (fixtures, empty, error, live) asserting response schema; add RTL test verifying UI banner text for simulated errors.

## Workstream 6 – Admin Page Redesign

1. **Information architecture**: apply `OperationsBlueprint` with sections (`Overview`, `Quick Actions`, `Jobs`, `Telemetry`) based on the new layout primitives.
2. **Action panels**: convert job controls into cards with descriptive copy, status chips, and collapsible log output (auto-scroll with sticky headers).
3. **Telemetry separation**: host zero-hit telemetry in its own section with summary chips at the top; integrate fixture notice pill.
4. **Responsive grid**: align with search tokens for consistent wrapping and optional sticky quick links.
5. **Testing**: add integration tests for job card state transitions (using simple stream fakes) and Playwright coverage for the redesigned admin flow, including dark mode.

## Workstream 7 – Status Page Redesign

1. **Status summary**: introduce `StatusSummaryCard` with severity icon, timestamp, and tone legend above the grid.
2. **Service cards**: standardise height, add optional links, and utilise accent colours consistent with tone tokens.
3. **Alert treatment**: refresh fatal alert styling with stronger contrast, actionable next steps, and optional dismissal when not critical.
4. **Diagnostics enhancements**: list health endpoints, docs, and last deploy metadata using shared `OpsCard` primitives.
5. **Testing**: update integration tests for `status-helpers` to match new copy, add RTL checks for summary card announcements, and refresh Playwright snapshots.

## Workstream 8 – Cross-cutting Validation & Evidence

1. **TDD workflow**: run unit/integration tests (`pnpm test --filter "ui"` segment) after each workstream; document failures and fixes in commit messages.
2. **Playwright evidence**: rebaseline journeys (landing, structured, natural, admin, status) in light/dark and mobile/desktop profiles, including reduced-motion mode.
3. **Accessibility audit**: execute axe + manual keyboard sweeps per surface and log findings in `snagging.md` with remediation notes.
4. **Documentation updates**: refresh `semantic-search-responsive-layout-architecture.md`, `semantic-search-phase-1-ux-plan.md`, and relevant READMEs after each workstream.
5. **Release readiness**: maintain a checklist of UX acceptance criteria, test artefacts, and screenshots to support later Elasticsearch integration.

## Process & Tracking

- Execute workstreams sequentially where dependencies exist (architecture → header → search → ops).
- Record progress and evidence in `snagging.md`, linking to screenshots and logs.
- Keep change sets focussed (one workstream per PR) to support rapid review and maintain creative flow.
- Before handing off to back-end integration, review this plan against completed evidence to confirm readiness.
