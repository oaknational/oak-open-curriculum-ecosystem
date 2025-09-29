# Semantic Search UX – Continuation Prompt

## Reference Pack

- THE PLAN: `.agent/plans/semantic-search/semantic-search-phase-1-ux.md`
- THE CONTEXT: `.agent/plans/semantic-search/semantic-search-phase-1-ux-context.md`
- This jump start document: `.agent/plans/semantic-search/continuation_prompt_ux.md`
- Theme inventory (reviewed 2025-09-26): `.agent/plans/semantic-search/semantic-theme-inventory.md`
- Theme specification (reviewed 2025-09-26): `.agent/plans/semantic-search/semantic-theme-spec.md`
- Oak Components application challenges and potential improvements plan: `.agent/plans/semantic-search/oak-components-application-and-improvement-plan.md`
- Storybook reference: <https://components.thenational.academy/?path=/docs/introduction--docs>
- Next.js + Styled Components playbook: `.agent/reference-docs/ui/styled-components-in-nextjs.md`

All work must continue to align with `GO.md`, `.agent/directives-and-memory/AGENT.md`, `.agent/directives-and-memory/rules.md`, and `docs/agent-guidance/testing-strategy.md`. Maintain the GO cadence (every ACTION immediately followed by REVIEW, with the sixth task reserved for **GROUNDING: read GO.md and follow all instructions**). Always state “REMINDER: UseBritish spelling” in the todo list.

## Current Snapshot (2025-10-01)

- Semantic tokens, theme bridge, and shared layout wrappers are in place across Search, Admin, and Docs; responsive Playwright checks at `bp-xs`/`bp-md`/`bp-lg`/`bp-xxl` now run without guards.
- Structured and natural search forms are scope-aware and render via `HeroControlsCluster`; additional hero polish (45 ch clamp, accent styling) remains paused until fixtures and the status page work are complete.
- Fixture source datasets (KS2 maths, KS4 maths, KS3 history, KS3 art, KS4 science with populated `ks4Options`) now live in `fixtures/fetched-data/` with reference notes in `fixtures/REFERENCE.md`; the builders are implemented and call the SDK’s generated `createSearch*Response` helpers so UI, API routes, and tests all validate against the same schema set.
- Shared fixture-mode resolver honours env → query → cookie precedence across `searchAction`, `/api/search`, `/api/search/suggest`, and `/api/search/nl`, keeping zero-hit logging intact and pairing with the developer toggle’s polite announcements.
- `/healthz` intentionally remains a JSON API endpoint; user-facing health information will move to a new status page with Oak UI styling.
- Search API routes now share schema-derived helpers (fixture short-circuit + cached query normaliser), and multi-scope fixture builders/tests rely on the generated `createSearch*Response` factories.
- Curriculum schema artefacts now regenerate into `curriculumZodSchemas`; next actions include splitting the generic parse helper into curriculum/search-specific functions, generating search scope constants, and updating validators to consume the new utilities.
- Latest `pnpm make` stops during `doc-gen` because Typedoc raises warnings for generated search schemas; search app lint/type-check gates are now green after splitting the client and refactoring fixture builders, and the curriculum schema rename plus parse helpers are in place awaiting documentation sign-off.

## Immediate Priorities

1. Split the generic parse helper into curriculum/search-specific functions backed by generated schemas, regenerate docs, and ensure the search scope type flows from type-gen constants.
2. Verify the generated `curriculumZodSchemas` registry (exports, guards, schema names) and ensure every SDK consumer uses the new helpers end-to-end.
3. Resolve the SDK Typedoc warnings (schema const exports) so `pnpm make`/`pnpm qg` can complete without manual intervention.
4. Once documentation builds succeed, rerun `pnpm make`/`pnpm qg` and capture the new baseline before updating Playwright + contributor docs with the fixture toggle workflow.
5. Review search-result copy/layout now that schema-backed fixtures are authoritative, then shortlist presentation tweaks for the next implementation slice and feed them into the UX backlog.

## Verification Checklist

- Unit/integration: `pnpm -C apps/oak-open-curriculum-semantic-search test ...SearchResults.unit.test.tsx`, `...StructuredSearchClient.integration.test.tsx`, `...page.integration.test.tsx`, plus new Health/Search tests as added; update the integration suites (`app/api/search/*/route.integration.test.ts`, `app/ui/client/SearchPageClient.integration.test.tsx`) to rely on `NextResponse` so cookie assertions type-check, then re-run them alongside the fixture-mode unit coverage.
- Playwright responsive suites: `pnpm -C apps/oak-open-curriculum-semantic-search test:ui --grep "Search page responsive regressions"`, `... --grep "Admin page responsive regressions"`, `... --grep "Docs page responsive regressions"`; confirm the Search run captures the fixture-backed scenarios and remains useful by flagging regressions, and add coverage for the forthcoming status page once work lands.
- Full gate before commit: `pnpm qg`.
- 2025-09-29: API docs Redoc theme now resolves Oak UI tokens to hex via `resolveUiColor`; integration tests assert the generated palette matches resolved colours.
- 2025-09-29: Admin shell clamps to the semantic container width, clears inherited hashes on mount, and gains Playwright regression guards across lg/md/xxl viewports.
- 2025-09-29: `pnpm qg` now passes end-to-end after the API docs/admin fixes; attach latest run logs for any regressions.

## Cadence Overview

- Keep the todo list in GO format: `REMINDER` → paired `ACTION`/`REVIEW` items → regular `QUALITY-GATE` entries → sixth task always the grounding reminder.
- Use Playwright MCP for breakpoint evidence at 360 px, 800 px, and 1 200 px before and after layout changes. Attach artefacts to the relevant REVIEW steps.
- Default to British spelling in copy, comments, attachments, and commit messages.

## Upcoming Work (Plan alignment)

### ACTION 1 – Audit Search hero, controls, and results (`bp-xs` → `bp-md`)

- Inspect `apps/oak-open-curriculum-semantic-search/app/ui/client/SearchPageClient.styles.ts` (`PageContainer`, `ControlsGrid`, `SecondaryGrid`, `HeroCard`) alongside `SearchResults.tsx` with the new fixtures turned on.
- At 360 px reconfirm DOM order + gap rhythm; ensure the new tabpanel containers do not introduce extra spacing or focus regressions.
- Verify hero copy clamp expectations at `bp-lg`; compare computed `max-inline-size` with the architecture guidance (`max-inline-size ≤ 45ch`) and record any residual overshoot for ACTION 7.
- Note remaining token gaps (inline padding, column min-width guards) needed to finish the hero/responsive polish.

### REVIEW 2 – Capture audit evidence

- Attach Playwright MCP snapshots (`search-controls-bp-xs`, `search-hero-bp-lg`) and axe JSON to the plan, confirming search regressions remain green with fixtures and highlighting any outstanding hero clamp deltas.
- Summarise findings directly in this document (brief bullets) so ACTION 3 can start with concrete deltas.

### ACTION 3 – Prototype Search layout adjustments

- Prototype token-driven fixes locally (temporary branches or component-level experiments are fine). Focus on:
  - Ensuring `ControlsGrid` collapses to a single column below `bp-md` using `grid-template-areas` + clamp-friendly column definitions.
  - Allowing the hero to occupy full width on phones while reserving space for optional secondary media at `bp-lg` via a `display: grid` switch guarded by `@media (min-width: var(--app-bp-lg))`.
  - Validating that `SecondaryGrid` and `SearchResults` pick up `--app-layout-secondary-column-min-width` and `--app-gap-grid` consistently.
- Keep prototypes token-first (no hard-coded pixel values) and list any new token requirements for the theme spec before implementation begins.

### REVIEW 4 – Validate prototypes

- Run the Next.js dev server (`pnpm dev`, logs to `/tmp/semantic-dev.log`) and inspect breakpoints in-browser plus through Playwright MCP.
- Confirm the prototypes satisfy axe checks, preserve DOM order, and avoid reintroducing hydration mismatches.
- Decide which adjustments graduate directly into product code and which need refinement before ACTION 7.

### ACTION 5 – Outline Health shell UX requirements

- Draft the Oak UI shell contract for the new status page: navigation placement, hero/summary stack, card treatments, error messaging, and how Accept headers might toggle JSON vs UI, while keeping `/healthz` as JSON-only.
- Identify dependencies on functionality (e.g. telemetry payload shape, status enums) and record them so the functionality stream can unblock UX promptly.
- Reference Admin layout wrappers as the likely base (`apps/oak-open-curriculum-semantic-search/app/admin/ui`), noting any shared components to extract.
- Map current JSON fields (`status`, `details`) to proposed UI atoms (badges, tables, accordions) and flag any missing semantics that functionality needs to expose for an accessible summary card.
- Plan test hooks up-front: `data-testid` anchors for Playwright assertions, axe landmarks (`main`, `aside`, `role="status"`), and a strategy for toggling between JSON and UI responses without breaking caching.

### REVIEW 6 – Sanity-check Health outline

- Ensure the outline covers responsive expectations (`bp-xs` stacking → `bp-md` two-column grid) and accessibility hooks (landmarks, role assignments).
- Validate terminology with the plan/context docs before handing over to implementation.

### ACTION 7–10 – Implement and harden Search responsive updates

- Convert the validated prototypes into production changes: update `SearchPageClient.styles.ts`, adjust component structure if necessary, and realign tokens in `semanticThemeSpec` if new clamps are required.
- Update Playwright assertions in `apps/oak-open-curriculum-semantic-search/tests/visual/responsive-baseline.spec.ts`: replace the `splitColumns` helper or assert against `gridTemplateAreas` so the `bp-xs` test becomes authoritative, then remove the `test.fail()` guards for Search once the CSS is fixed.
- Refresh snapshots through Playwright MCP, commit artefacts where applicable, and ensure hero clamps are verified at `bp-lg`.
- Run `pnpm -C apps/oak-open-curriculum-semantic-search test:ui` before shipping; confirm zero axe violations.

## Quality Gates & Evidence

- Queue the quality-gate sequence (`pnpm format`, `pnpm lint`, `pnpm type-check`, `pnpm -C apps/oak-open-curriculum-semantic-search test`, `pnpm -C apps/oak-open-curriculum-semantic-search test:ui`) once implementation stabilises; record outcomes in the REVIEW artefacts.
- Keep Playwright attachments (screenshots + axe JSON) for each breakpoint as part of the REVIEW steps to ease regression tracking.
- Document any token changes in `semantic-theme-spec.md` and update the responsive architecture doc so the knowledge base stays current.
- Latest run (2025-09-27): `pnpm -C apps/oak-open-curriculum-semantic-search test:ui --grep "Search page responsive regressions"` and the full `pnpm qg` suite both passed after updating integration tests for the new panel theming.
- 2025-09-27 refresh: `pnpm make` now clears the lint threshold (after trimming `SearchHero`) and the latest `pnpm qg` run passed format/type/lint/test/smoke gates.

## Open Follow-ups

- Decide how the status page is linked (navigation vs support surfaces) while `/healthz` stays JSON-only; align with functionality once the plan is agreed.
- Confirm whether additional semantic tokens (e.g. `layout.inlinePadding.narrow`) are needed to handle extreme mobile cases after the Search audit.
- Revisit Storybook once responsive updates land to ensure Oak Components coverage captures the new layouts.
- Extend Playwright fixtures with populated search results/facets (in addition to zero-hit cases) so responsive screenshots communicate the real layout; document the toggle workflow for contributors.
- Validate the wide-view hero/control balance (forms above the fold at `bp-lg+`) and adjust `HeroControlsCluster` track ratios if the controls continue to slip beneath the hero copy.
