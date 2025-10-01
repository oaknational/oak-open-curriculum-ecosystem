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

## Current State Snapshot (2025-10-06)

- ✅ Semantic tokens and layout wrappers remain consistent across Search, Admin, Docs, and Status shells.
- ✅ Deterministic fixture sources cover core subject combinations; references and builders stay aligned with generated SDK types.
- ✅ Fixture toggle logic is centralised in `resolveFixtureToggleVisibility`, and Playwright coverage now exercises fixtures ↔ live transitions.
- ✅ Search surfaces pass `pnpm make`; the toggle resolver refactor keeps lint/type-check/build/doc-gen green.
- ⚠️ Unit and integration tests now cover fixture toggle success/empty/error flows, with API routes refactored for variant handling; RTL and Playwright coverage still required to prove accessibility and layout resilience across breakpoints.
- ⚠️ Admin console lacks telemetry history, operator feedback, and deterministic fixtures for Playwright verification.
- ⚠️ Status page remains functionally complete but lacks tone/failure handling tests and resilience improvements.
- ⚠️ Hero copy and science pathways require additional narrative polish once higher priorities land.

### Recent Progress

- 2025-10-06 11:40: Expanded fixture-mode support (success/empty/error), added unit/integration coverage, and refactored search routes/toggle helpers; `pnpm make` and `pnpm qg` now pass with deterministic fixture fallbacks.
- 2025-10-06 08:15: Added `resolveFixtureToggleVisibility`, documented `NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE`, and refreshed Playwright fixture workflow; `pnpm make` confirmed green post-change.
- 2025-09-30 22:42: Resolved Next.js build error in `/status` by converting the page to a Server Component and delegating rendering to StatusClient.
- 2025-09-30: Completed fixture-mode resolver integration across server actions and API routes with supporting tests and documentation.
- 2025-09-29: Search hero and layout refinements ensured stacking rules and overflow behaviour remain stable at `bp-lg` and above.

### Priority Order (Phase 1 UX)

1. **Fixture toggle + search layout validation** – Use TDD to prove the toggle renders, persists, and drives deterministic behaviour for successful, empty, and error responses while keeping layout/a11y intact.
2. **Admin telemetry and operator workflows** – Add telemetry history, operator messaging, and deterministic fixtures with comprehensive testing (unit → integration → RTL → Playwright).
3. **Status page hardening** – Implement tone/failure logic and full coverage before sign-off.
4. **Secondary polish** – Hero copy/layout refinements, documentation tidy-up, and remaining backlog once the higher priorities are complete.

### Detailed Task Breakdown (2025-10-05)

**Search scope helpers adoption**

- ✅ Replaced literal scope unions across SDK validators, OpenAPI schemas, fixtures, services, and UI loops with the generated helpers; added `search-scopes` module for shared constants.
- ✅ Updated integration/unit suites to exercise the new helpers and confirmed `pnpm -C apps/oak-open-curriculum-semantic-search type-check` remains clean.

**Fixture usage verification**

- ✅ Added deterministic end-to-end coverage: Playwright toggle scenario, RTL assertions, and API suites verify cookie-driven fixture mode.
- ✅ 2025-10-06: Added failing → passing unit/integration tests for fixture toggle success/empty/error states, introduced coverage matrix, and refactored toggle/fixture helpers to rely on SDK imports.

**Admin console resilience**

- ⚙️ Partial: added pre-flight validation for missing Elasticsearch env vars and stream outcome summaries, plus `useStream` now surfaces success/error metadata. Still to do – richer telemetry integration and persistent history of runs per action.

**Status surface delivery**

- ✅ Implemented Oak-branded `/status` page fetching `/healthz`, with responsive cards and header navigation update following canonical Next.js Server/Client Component pattern.
- ✅ Fixed Next.js build error (commit 066c2d6): converted status page from Client to Server Component by removing `'use client'` directive, delegating UI to StatusClient, and keeping data fetching (headers() API) in server-side page.tsx.
- ✅ Resolved TypeDoc validation warning by exporting ScopeResultMap with @internal JSDoc tag.
- ✅ Installed Playwright browsers (Chromium 140, Firefox 141, Webkit 26) and added test-results to markdownlintignore.
- ✅ Quality gate status: `pnpm make` passing (format, type-check, lint, build, doc-gen); full `pnpm qg` rerun pending after documentation and toggle updates settle.
- ❌ **Missing test coverage**: Status page components lack unit/integration/Playwright tests (violates TDD principle from rules.md).
- 🔄 Follow-up: add comprehensive test coverage (StatusClient, status-helpers.ts, page.tsx), tighten card tone logic for flaky API responses, capture Playwright artefacts at xs/lg breakpoints.

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
- Hide the control in production builds by setting `NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE=false` and documenting the expected environments where it remains enabled.

## Verification Strategy

- **Testing hierarchy:** Always start with unit tests, then integration tests, then React Testing Library, then broader E2E, and finally Playwright if the behaviour requires a browser. Every change must follow TDD.
- **Fixture toggle focus:**
  - Unit: extend `fixture-toggle.unit.test.ts`, search controller reducers, and helper utilities to cover success, empty, and error payload permutations plus cookie persistence.
  - Integration: enhance `searchAction`/`/api/search` suites to exercise toggle-driven branching (fixtures vs live) and error propagation without network flake.
  - RTL: update `SearchPageClient` tests to assert layout, aria announcements, and messaging for success/error states with the toggle visible.
  - Playwright: expand `fixture-toggle.spec.ts` and responsive suites to capture fixtures/live toggles across breakpoints, including screenshots and axe artefacts.
- **Admin workflow:**
  - Unit: build pure telemetry/history helpers with failing tests first.
  - Integration/RTL: cover admin page actions for ingest/index with mock data and deterministic fixtures.
  - Playwright: validate workflows and accessibility at key breakpoints once logic is in place.
- **Status page:**
  - Unit: add helper tests for tone/contract.
  - Integration: cover server data fetching via `headers()` and fallback states.
  - Playwright: confirm responsive layout, tone, and axe compliance.
- **Quality gates:** Run `pnpm make` after significant milestones and `pnpm qg` frequently (under two minutes) to capture evidence for fixture toggle, admin, and status updates.

## Breakpoint Strategy

- Maintain the existing breakpoint ramp (`bp-xs`, `bp-sm`, `bp-md`, `bp-lg`, `bp-xl`, `bp-xxl`) and validate hero, controls, results, and secondary panels at each width.
- Ensure fixture content exercises line wrapping, multi-column grids, and overflow guards at `bp-lg` and `bp-xxl` once richer data lands.
- Continue to attach Playwright artefacts (screenshots + axe JSON) for xs/md/lg/xxl to catch regressions introduced by fixture/toggle refactors.

## Todo (GO cadence)

1. REMINDER: UseBritish spelling.
2. ACTION: Extend fixture toggle coverage to RTL by drafting failing tests for success/empty/error messaging and announcements.
3. REVIEW: Confirm RTL assertions prove accessibility outcomes without over-specifying implementation.
4. ACTION: Expand Playwright specs with failing scenarios for toggle modes across breakpoints, including axe and screenshot artefacts.
5. REVIEW: Ensure failures isolate missing UX behaviour rather than test harness gaps.
6. GROUNDING: read GO.md and follow all instructions.
7. ACTION: Implement any UI/layout updates required to satisfy the new RTL tests while keeping tokens consistent.
8. REVIEW: Verify RTL suite passes and visual regressions remain acceptable.
9. QUALITY-GATE: Run `pnpm qg`, archiving artefacts that demonstrate fixture toggle behaviour (success/empty/error).
10. ACTION: Define admin telemetry/history requirements and draft failing unit/integration/RTL/Playwright tests (in priority order) before implementation.
11. REVIEW: Cross-check the admin test matrix with stakeholders and documentation to ensure completeness.
12. GROUNDING: read GO.md and follow all instructions.
13. ACTION: Implement admin telemetry/history features iteratively to satisfy the new tests, ensuring deterministic fixtures for UI/Playwright coverage.
14. REVIEW: Assess the admin UI for accessibility, observability clarity, and adherence to Oak tokens.
15. QUALITY-GATE: Run `pnpm qg`, capturing artefacts for updated admin workflows and verifying stability.
16. ACTION: Draft failing status page helper/unit/integration tests covering tone logic, failure messaging, and partial data cases.
17. REVIEW: Verify status coverage matches plan expectations and avoids redundant assertions.
18. GROUNDING: read GO.md and follow all instructions.
19. ACTION: Implement status page tone/failure updates and any remaining hero copy/layout refinements using deterministic fixtures.
20. REVIEW: Validate the updated surfaces against accessibility requirements and UX acceptance criteria.
21. QUALITY-GATE: Run `pnpm qg` once more to capture final evidence for Phase 1 UX completion.
