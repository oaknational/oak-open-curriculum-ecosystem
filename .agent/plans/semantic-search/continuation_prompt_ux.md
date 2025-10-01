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

## Current Snapshot (2025-09-30 22:45)

- Semantic tokens, theme bridge, and shared layout wrappers are in place across Search, Admin, Docs, and the new Status shell; responsive Playwright checks for search/admin remain green.
- The literal-scope audit is complete: search app, SDK validators, OpenAPI schemas, fixtures, query parser, and observability layers all rely on the generated scope helpers.
- Fixture mode now has end-to-end evidence (Playwright toggle scenario, RTL assertion, integration tests for query/cookie precedence) and the header toggle drives user feedback.
- `/status` serves an Oak-branded snapshot derived from `/healthz`, with hero summary, responsive cards, diagnostics link, and updated navigation. Implemented following canonical Next.js Server/Client Component pattern.
- Quality gates: `pnpm make` passes (TypeDoc fixed with @internal tag); `pnpm qg` blocked by 2 Playwright fixture toggle tests that need investigation.
- Playwright browsers installed; test-results added to markdownlintignore to prevent generated artefacts from blocking commits.

## Immediate Priorities

1. **Investigate Playwright fixture toggle test failures** – 2 tests in `tests/visual/fixture-toggle.spec.ts` expecting "Search data: Fixtures" text are failing. Tests look for fixture toggle UI controlled by `showFixtureToggle = process.env.NODE_ENV !== 'production'`. Determine if this is environment-specific, visibility logic issue, timing/rendering problem, or test expectation mismatch.

2. **Add status page test coverage (TDD violation remediation)** – Status page structure complete but lacks tests:
   - Unit tests: `StatusClient.unit.test.tsx` (component rendering, props handling, card states)
   - Unit tests: `status-helpers.unit.test.ts` (buildStatusCards, resolveToneColor, isHealthPayload)
   - Integration tests: `page.integration.test.tsx` (server component data fetching with headers())
   - Playwright: responsive coverage at xs/lg breakpoints with accessibility checks

3. **Status page enhancements** – Tighten card tone logic for flaky/partial `/healthz` responses, ensure failure modes render clear messaging, document expected health payload contract.

4. **Admin console polish** – Add telemetry wiring/history, capture Playwright artefacts for enriched outputs, document operator guidance for success/failure states.

5. **Hero copy/layout refinement** – Revisit search hero using deterministic fixtures, verify structured/natural panels remain visible above fold at xl/xxl, note backlog-ready adjustments.

6. **Track documentation tidy-up** – Clean up Markdown documentation output, TypeDoc HTML generation, once core Phase 1 UX items complete.

## Verification Checklist

- Unit/integration: `pnpm -C apps/oak-open-curriculum-semantic-search test ...SearchResults.unit.test.tsx`, `...StructuredSearchClient.integration.test.tsx`, `...page.integration.test.tsx`, plus new Health/Search tests as added; update the integration suites (`app/api/search/*/route.integration.test.ts`, `app/ui/client/SearchPageClient.integration.test.tsx`) to rely on `NextResponse` so cookie assertions type-check, then re-run them alongside the fixture-mode unit coverage.
- 2025-09-30 22:42: `pnpm make` fully passes after status page Server/Client boundary fix and TypeDoc export resolution. `pnpm qg` has 2 pre-existing fixture toggle test failures requiring investigation.

## Recent Learnings (2025-09-30)

**Status Page Build Fix** – Initial implementation incorrectly marked page as Client Component (`'use client'`) while using server-only `headers()` API, causing Next.js build failure. Lesson: Always verify Server/Client boundary requirements before implementing. Solution followed canonical pattern: Server Component fetches data with server-only APIs, passes serializable props to Client Component for rendering. Pattern documented in existing `/app/page.tsx`. Future work: follow TDD (write tests first per rules.md).

**TypeDoc Validation** – Internal helper types referenced by exported types must be exported with `@internal` tag when `treatValidationWarningsAsErrors: true`. Export with JSDoc marker satisfies validation while documenting implementation detail status.

**Playwright Artefacts** – Generated test result files block commits unless excluded from markdownlint. Added `**/test-results/**` to `.markdownlintignore` to prevent this common friction point.

## Cadence Overview

- Keep the todo list in GO format: `REMINDER` → paired `ACTION`/`REVIEW` items → regular `QUALITY-GATE` entries → sixth task always the grounding reminder.
- Default to British spelling in copy, comments, attachments, and commit messages.
- **Follow TDD**: Write tests first (rules.md requirement) to avoid architectural mistakes and ensure comprehensive coverage from the start.

## Upcoming Work (Plan alignment)

### ACTION 1 – Audit Search hero, controls, and results (`bp-xs` → `bp-md`)

- At 360 px reconfirm DOM order + gap rhythm; ensure the new tabpanel containers do not introduce extra spacing or focus regressions.
- Verify hero copy clamp expectations at `bp-lg`; compare computed `max-inline-size` with the architecture guidance (`max-inline-size ≤ 45ch`) and record any residual overshoot for ACTION 7.
- Note remaining token gaps (inline padding, column min-width guards) needed to finish the hero/responsive polish.

### REVIEW 2 – Capture audit evidence

- Summarise findings directly in this document (brief bullets) so ACTION 3 can start with concrete deltas.
- Document any new token requirements for the theme spec before implementation begins.

### ACTION 3 – Prototype Search layout adjustments

- Prototype token-driven fixes locally (temporary branches or component-level experiments are fine). Focus on:
  - Ensuring `ControlsGrid` collapses to a single column below `bp-md` using `grid-template-areas` + clamp-friendly column definitions.
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
