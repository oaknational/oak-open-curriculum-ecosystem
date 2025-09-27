# Semantic Search UX – Continuation Prompt

## Reference Pack

- This document: `.agent/plans/semantic-search/continuation_prompt_ux.md`
- Phase plan: `.agent/plans/semantic-search/semantic-search-phase-1-ux.md`
- Context snapshot: `.agent/plans/semantic-search/semantic-search-phase-1-ux-context.md`
- Theme inventory (reviewed 2025-09-26): `.agent/plans/semantic-search/semantic-theme-inventory.md`
- Theme specification (reviewed 2025-09-26): `.agent/plans/semantic-search/semantic-theme-spec.md`
- Oak Components application challenges and potential improvements plan: `.agent/plans/semantic-search/oak-components-application-and-improvement-plan.md`
- Storybook reference: <https://components.thenational.academy/?path=/docs/introduction--docs>
- Next.js + Styled Components playbook: `.agent/reference-docs/ui/styled-components-in-nextjs.md`

All work must continue to align with `GO.md`, `.agent/directives-and-memory/AGENT.md`, `.agent/directives-and-memory/rules.md`, and `docs/agent-guidance/testing-strategy.md`. Maintain the GO cadence (every ACTION immediately followed by REVIEW, with the sixth task reserved for **GROUNDING: read GO.md and follow all instructions**). Always state “REMINDER: UseBritish spelling” in the todo list.

## Orientation (2025-09-29)

- Semantic tokens, the bridge, and shared layout wrappers already power Admin and Docs; Playwright `bp-xxl` assertions now enforce those layouts without `test.fail()` guards.
- Search responsive assertions at `bp-xs`/`bp-md`/`bp-lg` now pass without guards: forms wrap `<form>` elements inside `tabpanel` containers, submit buttons use high-contrast brand colours, and Playwright fixtures supply deterministic results. Hero copy still overruns the 45 ch target at `bp-lg`, so the next pass will focus on clamping.
- Fresh 2025-09-27 audit via Playwright (post-fixture update) shows `ControlsGrid` stacks correctly at `bp-xs` and splits at `bp-md`; results grids now assert column counts via `gridTemplateColumns` parsing.
- Health remains an API-style response (`NextResponse.json` in `apps/oak-open-curriculum-semantic-search/app/healthz/route.ts`) with no Oak UI chrome. The responsive baseline records this as an expected failure pending UX shell work.
- Health shell outline in the plan pairs a hero status banner with a two-column card grid at `bp-md`, includes an accessible `role="status"` region for live updates, and anticipates Accept header toggling between JSON and UI without cache regressions.
- Playwright runs now enable `SEMANTIC_SEARCH_USE_FIXTURES` (plus `NEXT_DISABLE_DEV_ERRORS`) so structured search and suggestions return deterministic fixtures independent of Elasticsearch while keeping the dev overlay quiet.
- Browser theme colours resolve from semantic tokens (`app/layout.meta.unit.test.ts` guards), keeping light/dark polish intact.
- Theme selector contrast in dark mode is now guarded: radios resolve semantic tokens to Oak hex values so unselected outlines read `rgb(228, 228, 228)` and selected states stay `rgb(255, 255, 255)` with a dedicated integration test.
- 2025-09-27 audit: hero and controls remain vertically stacked at `bp-lg`, leaving the search forms below the fold; control cards use `surfaceRaised`/`borderSubtle` which blends into the mint background, and at ≤360 px radio groups and selects overflow their panels due to missing `min-inline-size: 0` guards.
- 2025-09-27 implementation: added a `HeroControlsCluster` grid so hero + controls align horizontally from `bp-lg`, rethemed panels to `surfaceCard` with brand borders, and added wrapping/min-inline safeguards so radio groups and selects stay within their cards on ≤360 px viewports.
- Structured search now exposes the Phase filter and natural search scopes default to “Auto”, letting the backend infer scope unless the user explicitly picks Units/Lessons/Sequences.
- Structured search integration harness now asserts the Phase selector options via a themed mock form; keep fixtures representative for screenshot runs.
- Structured "All content" searches fan out across lessons/units/sequences; deterministic fixtures mirror this bucketed response, but we still need to enrich card/facet data so Playwright screenshots feel populated.
- 2025-09-28: Hero/controls cluster now stays stacked until `xl`, eliminating the 1 100 px overflow (Playwright guard in `tests/visual/responsive-baseline.spec.ts` now passes; artefacts in `test-results/responsive-baseline-Search-e065d-flow-the-viewport-at-1100px-Google-Chrome`).
- 2025-09-28 `pnpm make` run halted at type-check because `SearchResults.unit.test.tsx` still references the pre multi-scope props; update the test to pass `mode`/`multiBuckets` and add coverage for the bucketed render prior to rerunning the gate.
- 2025-09-28: `SearchResults.unit.test.tsx` now covers the multi-scope pathway (vitest run: `pnpm -C apps/oak-open-curriculum-semantic-search test app/ui/SearchResults.unit.test.tsx`), unblocking the next `pnpm make` attempt.
- 2025-09-28: `pnpm make` completes successfully post unit-test update.
- 2025-09-29: Full `pnpm qg` passes after correcting the markdownlint newline issue in the Health responsive baseline artefact; monitor Notion MCP E2E runs for future flakes.
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

- Draft the Oak UI shell contract that will wrap `healthz` once structured data lands: navigation placement, hero/summary stack, card treatments, error messaging, and how Accept headers might toggle JSON vs UI.
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

- Decide whether `/healthz` remains in navigation when JSON-only; align with functionality once the shell plan is agreed.
- Confirm whether additional semantic tokens (e.g. `layout.inlinePadding.narrow`) are needed to handle extreme mobile cases after the Search audit.
- Revisit Storybook once responsive updates land to ensure Oak Components coverage captures the new layouts.
- Extend Playwright fixtures with populated search results/facets (in addition to zero-hit cases) so responsive screenshots communicate the real layout; document the toggle workflow for contributors.
- Validate the wide-view hero/control balance (forms above the fold at `bp-lg+`) and adjust `HeroControlsCluster` track ratios if the controls continue to slip beneath the hero copy.
