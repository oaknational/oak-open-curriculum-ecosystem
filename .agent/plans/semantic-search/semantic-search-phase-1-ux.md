# Semantic Search Phase 1 – UX Plan

## Programme Vision

- Deliver a hybrid search experience that expresses Oak’s brand, accessibility standards, and clarity of purpose across devices.
- Ensure Semantic Search UI assets, tokens, and patterns can be lifted into other Oak products without bespoke overrides.
- Ship UX work with the same rigour as functionality by leaning on TDD, visual regression, accessibility checks, and deterministic data.

## Phase Focus – UX Alignment

Phase 1 keeps the design system aligned with product intent by:

- Repairing responsive layout behaviour from 320 px phones up to ultra-wide desktops.
- Re-establishing Oak’s typographic, spacing, and surface hierarchy across Search, Admin, Docs, and Health shells.
- Replacing developer-centric error states with empathetic, observable messaging.
- Consolidating deterministic fixtures and a runtime toggle so designers and automated tests can validate UX without live infrastructure.

## Current State Snapshot (2025-09-30)

- ✅ Semantic tokens map colours, spacing, typography, and brand palette and flow through shared layout wrappers.
- ✅ Search hero + controls now respect container width and maintain stacking rules below `bp-lg` following the `HeroHeadingCluster` fix.
- ✅ Deterministic fixture sources captured for KS2 maths, KS4 maths, KS3 history, KS3 art, and KS4 science with enriched cross-scope suggestions routed through shared builders.
- ✅ Fixture reference notes and module outline (`fixtures/REFERENCE.md`, `app/ui/search-fixtures/README.md`) stay aligned with SDK-derived types and now underpin all search flows.
- ✅ Shared fixture-mode resolver enforces env → query → cookie precedence across `searchAction`, `/api/search`, `/api/search/suggest`, and `/api/search/nl`, keeping SDK-backed fixtures deterministic while preserving zero-hit logging and polite developer toggle announcements.
- ✅ Stdio MCP server package now satisfies lint/complexity requirements after extracting tool response helpers and tightening unit tests.
- ✅ SDK response validation is now split into curriculum and search modules, each generated from schema types with focused helpers; the curriculum registry now lives in `curriculumZodSchemas` with exported name/definition guards for downstream safety.
- ✅ Search app lint/type-check now pass after refactoring the client layout and fixture builders; repo-level doc generation still fails on existing TypeDoc warnings in the SDK, so `pnpm make` halts at the doc step. The curriculum schema rename + wrappers will remove the last manual assertions before tackling the warning set.
- ⚠️ Facet copy and science pathways still need broader narrative coverage before we lock responsive artefacts.
- ⚠️ Status page shell remains unimplemented; `/healthz` still serves JSON-only responses.
- ⚠️ Playwright responsive suites must be updated to exercise the fixture toggle (cookie workflow + accessibility artefacts) for on/off states.

### Recent Progress

- 2025-09-30: Implemented the shared fixture-mode resolver and developer toggle across server action + API routes, with unit/integration coverage verifying env/query/cookie precedence and deterministic fixture payloads.
- 2025-09-30: Consolidated fixture source snapshots (KS2 maths, KS4 maths, KS3 history, KS3 art) with manual suggestions reflecting lesson/unit/programme navigation paths; captured KS4 science sequences exposing `ks4Options` for future pathway scenarios.
- 2025-09-30: Authored `fixtures/REFERENCE.md` to document provenance and schema alignment, plus `app/ui/search-fixtures/README.md` outlining data modules and builder responsibilities.
- 2025-09-30: MCP stdio server tool responses now return the SDK `CallToolResult`, and search SDK validation helpers infer schema output types to remove manual assertions.
- 2025-10-02: Initiated the curriculum schema registry rename (`curriculumZodSchemas`) and drafted domain-specific parsing helpers so validation modules consume generated schema names directly.
- 2025-10-03: Regenerated curriculum schemas, promoted the registry to `curriculumZodSchemas`, updated validation/search tooling to consume registry exports, and introduced parse helpers that expose precise `SchemaRegistry`, `SchemaName`, and `SchemaDefinition` types.
- 2025-09-30: Search API routes and suggestion handler now share schema-derived helpers; multi-scope fixture builders/tests rebuilt around generated response factories to enforce single sources of truth.
- 2025-10-01: Search page client split into layout + toggle components, clearing max-lines violations and keeping fixture-mode UX isolated for reuse.
- 2025-09-29: Search hero heading now wraps using `HeroHeadingCluster`, preventing overflow within the hero card.
- 2025-09-29: Playwright responsive suite continues to gate Search/Admin/Docs layouts at bp-xs/md/lg/xxl using the existing structured fixture.
- 2025-09-28: `SearchResults.unit.test.tsx` and integration coverage updated for multi-scope payloads (`mode` + `multiBuckets`).

- **Deterministic fixtures:** Expand science-led facets, bucket meta, and suggestion narratives so fixture-on screenshots tell a complete story across phases; finish splitting the multi- and single-scope builders so they satisfy lint complexity/line limits.
- **Status page UX:** Design and implement the Oak-branded status page that consumes `/healthz` data, including accessibility hooks and responsive layout.
- **Playwright coverage:** Update responsive suites to drive the fixture toggle, capture accessibility artefacts for on/off states, and document the workflow for contributors once lint/type-check gates are green.
- **Type safety cleanup:** Update integration tests to use `NextResponse` helpers (or equivalent) so cookie handling is typed, and finish the curriculum schema registry rename + wrappers so validation code references generated types directly before re-running gates.
- **Documentation pipeline:** Investigate the SDK Typedoc warnings (schema exports referenced but omitted) so `pnpm doc-gen` stops failing the `pnpm make` pipeline.
- **Hero polish:** Revisit hero copy clamp and accent styling once fixtures and status page land.

## Deterministic Fixture Strategy (2025-09-30)

### Goals

- Provide rich, realistic fixtures that let designers validate Search UX offline, unlock deterministic automated tests, and document expected UI states.
- Eliminate duplicated fixture logic by funnelling all consumers through a single module with typed builders derived from the SDK.
- Cover positive, mixed, and empty states across lessons, units, sequences, facets, suggestions, and summary metadata.

### Data Source

- Base content on the KS2 Maths samples fetched via the Oak Curriculum SDK (`tmp/search-fixture-source.json`).
- Augment with additional programme/phase entries where necessary to demonstrate cross-key-stage behaviour (e.g. KS3 sequences, secondary phases) while preserving brand tone.
- Normalise suggestion payloads manually (API suggestions endpoint currently returns `null`; craft representative entries covering lessons, units, and sequences).

### Implementation Outline

1. Populate `app/ui/search-fixtures/data/` with static exports derived from the curated JSON snapshots (KS2 maths, KS4 maths, KS3 history, KS3 art, KS4 science with `ks4Options`).
2. Encode fixtures using compile-time generated schemas/types from the SDK (`SearchFacetsSchema`, `SequenceFacetSchema`, `SearchLessonsIndexDoc`, etc.) so UI and API boundaries validate identical payload shapes. Audit remaining custom Zod definitions and plan their migration into the SDK type generation pipeline.
3. Implement builder helpers (single-scope, multi-scope, empty, timed-out) that accept overrides for totals, timings, highlights, suggestion lists, and cache metadata (`version`, `ttlSeconds`).
4. Compose suggestions that showcase varied scope labels (lesson, unit, programme), subject slugs, key stages, context metadata—including `ks4OptionSlug` and sequence identifiers—and highlight the navigation copy used in cards.
5. Enrich fixture datasets with representative facet/aggregation payloads for sequence filtering while documenting provenance in `search-fixtures/README.md`.
6. Replace existing imports in `structured-search.actions.ts`, Playwright mocks, and future Storybook stories with the shared fixture builders once the runtime toggle resolver is in place, validating inbound/outbound data with the shared Zod schema. Deprecate `app/ui/__fixtures__/search-structured.ts` afterwards.

### Fixture Coverage Targets

- **Lessons:** Minimum six records spanning Year 3 fractions and Year 5 decimals with highlight sentences to exercise bullet rendering.
- **Units:** At least three units per key stage/phase to validate summary metadata and card grids.
- **Sequences:** Primary and secondary sequences with key stage arrays, years, and phase titles for hero context copy.
- **Facets:** Populate `SearchFacets.sequences` with key stage labels, years, unit/lesson counts, and slug combinations referenced in CTA buttons.
- **Suggestions:** Five suggestions covering lesson, unit, and sequence scopes with distinct labels and optional context metadata.
- **Meta:** Provide totals, `took`, and `timedOut` variations for both single and multi scope to drive summary copy.

## Runtime Toggle and UX Validation

### Requirements

- Honour `SEMANTIC_SEARCH_USE_FIXTURES` env default while allowing runtime overrides via query string (`?fixtures=on|off`) and a signed cookie (`semantic-search-fixtures`).
- Ensure structured search, natural-language search, and `/api/search/suggest` all read from a single resolver to determine fixture mode.
- Offer a developer-facing UI toggle (visible in dev/admin contexts) that calls a server action to flip the cookie and soft-refresh the page.
- Guarantee Playwright runs exercise the same toggle path without bespoke route intercepts.

### Architecture

- Implement `resolveFixtureMode({ cookies, searchParams, env })` as a pure utility with unit coverage proving precedence: query string → cookie → env → default `off`.
- Add `setFixtureModeCookie(mode)` server action to persist the selection (HttpOnly, short-lived) while respecting Next.js caching.
- Update `searchAction`, `/api/search`, `/api/search/nl`, `/api/search/suggest`, and `useSearchController` call sites to branch through the resolver and return shared fixtures when enabled.
- Modify Playwright `globalSetup` to set the cookie instead of intercepting fetches; expose helpers in tests to switch modes mid-run when needed.

### UX Surface

- Mount a small pill toggle (e.g. top-right dev ribbon) that renders the active mode, uses Oak secondary button styling, and respects keyboard navigation.
- Provide an accessible description (`aria-live="polite"`) when the mode flips so screen readers announce the data source change.
- Hide the control in production builds by feature gating on `process.env.NODE_ENV !== 'production'` and an optional `ENABLE_FIXTURE_TOGGLE` flag.

## Verification Strategy

- **Unit tests:**
  - `resolveFixtureMode.unit.test.ts` covering precedence and invalid inputs.
  - Fixture builder tests asserting schema safeParse success and immutability (deep freeze to prevent accidental mutation).
- **Integration tests:**
  - `structured-search.actions.integration.test.ts` verifying fixture/live parity and multi-scope bucket assembly.
  - Tests for `/api/search` and `/api/search/nl` to ensure fixture mode short-circuits external fetches while still logging zero-hit metrics when appropriate.
- **Playwright:**
  - Update `Search page responsive regressions` to rely on cookie toggle instead of route mocks and capture both fixture-on and fixture-off snapshots (fixture-off limited smoke to avoid flaky live results).
  - Add scenarios for the developer toggle UI (visibility, keyboard toggle, aria announcements).
- **Quality gates:**
  - Run targeted `pnpm test --filter "Search"`, `pnpm -C apps/oak-open-curriculum-semantic-search test:ui --grep "Search"`, and `pnpm lint` during development.
  - Execute `pnpm qg` prior to merge, ensuring logs capture fixture mode states used in tests.

## Breakpoint Strategy

- Maintain the existing breakpoint ramp (`bp-xs`, `bp-sm`, `bp-md`, `bp-lg`, `bp-xl`, `bp-xxl`) and validate hero, controls, results, and secondary panels at each width.
- Ensure fixture content exercises line wrapping, multi-column grids, and overflow guards at `bp-lg` and `bp-xxl` once richer data lands.
- Continue to attach Playwright artefacts (screenshots + axe JSON) for xs/md/lg/xxl to catch regressions introduced by fixture/toggle refactors.

## Todo (GO cadence)

1. REMINDER: UseBritish spelling.
2. ACTION [DONE 2025-10-05]: Inspect generated `curriculumZodSchemas.ts` to confirm exported registry guards and schema naming align with expectations (registry exports + guards validated).
3. REVIEW [DONE 2025-10-05]: Summarise any schema export gaps that require regeneration or follow-up fixes (no gaps identified; current registry matches OpenAPI surface).
4. ACTION [DONE 2025-10-05]: Trace SDK consumers (validation, response map, search guards, MCP tooling, docs) to ensure they now import the renamed curriculum exports exclusively (legacy identifiers not detected).
5. REVIEW [DONE 2025-10-05]: Record any lingering references to legacy schema identifiers for remediation (none found).
6. GROUNDING [DONE 2025-10-05]: read GO.md and follow all instructions.
7. ACTION [DONE 2025-10-05]: Refresh UX plan, context snapshot, and continuation prompt with the curriculum schema rename outcomes and downstream adoption guidance (this update applied across plan/context/prompt files).
8. REVIEW [DONE 2025-10-05]: Proofread documentation updates for clarity and British spelling while checking linked artefacts.
9. QUALITY-GATE [DONE 2025-10-05]: Run `pnpm type-gen` and inspect generated files for unintended diffs after the rename stabilisation (command completed cleanly; no generated changes observed).
10. ACTION [DONE 2025-10-05]: Execute `pnpm -C packages/sdks/oak-curriculum-sdk test` to cover curriculum/search validation suites and confirm helper behaviour (Vitest suite passed; canonical URL warnings remain expected).
11. REVIEW [DONE 2025-10-05]: Capture test outcomes, noting regressions or flaky cases for follow-up (no regressions detected; warnings stem from fixture canonical URL gaps already tracked).
12. GROUNDING [DONE 2025-10-05]: read GO.md and follow all instructions (reaffirmed plan focus on parse helper split before wider UX implementation).
13. ACTION [OPEN]: Replace the generic `parseWithSchema` helper with domain-specific curriculum/search parsing functions that infer types directly from generated schemas.
14. REVIEW [OPEN]: Verify all curriculum/search validators now consume the specialised helpers and retain strict `z.infer` outputs without `unknown`.
15. QUALITY-GATE [OPEN]: Run `pnpm -C packages/sdks/oak-curriculum-sdk type-check` to confirm the validation layer compiles cleanly.
16. ACTION [DONE 2025-10-03]: Generate search scope constants/types/guard via type-gen so validation code depends on a single compile-time source of truth (generated `search/scopes.ts` present).
17. REVIEW [INCOMPLETE]: Remove overloads/magic strings from `search-response-validators.ts`, using the generated scope map instead (map still embeds literal scope strings; needs refactor).
18. GROUNDING [PENDING]: read GO.md and follow all instructions.
19. ACTION [PENDING]: Re-run `pnpm doc-gen` ensuring regenerated docs flow from updated helpers without manual edits to `_typedoc_src`.
20. REVIEW [PENDING]: Confirm doc artefacts reflect the new helpers and no generated sources are manually touched.
21. QUALITY-GATE [BLOCKED BY 19-20]: Run `pnpm make` followed by `pnpm qg` once documentation and validation layers are stable.
22. ACTION [PENDING]: Update contributor guidance and validation usage docs to highlight the new parsing helpers and generated search scope utilities.
23. REVIEW [PENDING]: Share follow-up recommendations with UX and functionality streams based on validation findings.
24. GROUNDING [PENDING]: read GO.md and follow all instructions.
25. ACTION [PENDING]: Define the Oak status page UX contract (layout, content blocks, accessibility) for a minimal but polished release.
26. REVIEW [PENDING]: Cross-check the status page blueprint with architecture guidance and document references for implementation.
27. ACTION [PENDING]: Implement the minimal status page shell and wire it to live health signals with snapshot/axe coverage.
28. REVIEW [PENDING]: Run Playwright + axe for the status page across target breakpoints and record artefacts in the plan.
29. QUALITY-GATE [PENDING]: Add status page coverage to `pnpm -C apps/oak-open-curriculum-semantic-search test:ui` and confirm green runs.
30. GROUNDING [PENDING]: read GO.md and follow all instructions.
31. ACTION [PENDING]: Map admin workflows for managing Elastic indexes, rollups, ingest jobs, and re-index scheduling within the UX plan.
32. REVIEW [PENDING]: Validate admin control requirements with engineering stakeholders and capture dependencies or blockers.
33. ACTION [PENDING]: Implement admin UI controls for index creation, data ingestion toggles, and feedback surfaces tied to backend orchestration.
34. REVIEW [PENDING]: Ensure admin flows expose progress/error states, updating Playwright/axe artefacts where needed.
35. QUALITY-GATE [PENDING]: Extend targeted test suites (`pnpm -C apps/oak-open-curriculum-semantic-search test`, relevant Playwright specs) to cover new admin workflows.
36. GROUNDING [PENDING]: read GO.md and follow all instructions.
