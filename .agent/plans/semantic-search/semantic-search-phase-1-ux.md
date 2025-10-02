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
- ✅ Unit, integration, RTL, and Playwright suites now cover fixture toggle success/empty/error flows, and API routes/toggle helpers surface deterministic messaging across breakpoints.
- ✅ Zero-hit observability fixtures now flow from the SDK type-gen pipeline with Zod validation and integration coverage, eliminating bespoke app-level builders for that surface.
- ✅ Admin stream fixtures now originate from the SDK type-gen pipeline; Next.js admin routes consume the generated helpers, replacing bespoke builders while keeping zero/empty/error behaviour deterministic.
- ⚠️ Admin console lacks telemetry history, operator feedback, and deterministic fixtures for Playwright verification.
- ⚠️ Status page remains functionally complete but lacks tone/failure handling tests and resilience improvements.
- ⚠️ Formal UX review (fixtures enabled) pending — designers must walk through success/empty/error flows and capture feedback.
- ⚠️ Hero copy and science pathways require additional narrative polish once higher priorities land.

### Recent Progress

- 2025-10-08 08:35: Resolved the structured search "Maximum update depth exceeded" regression by stabilising controller error handling, simplifying panel callbacks, and adding regression integration tests for `StructuredSearchClient` and `SearchPageClient`; Playwright fixture runs now complete without React warnings.
- 2025-10-06 15:10: Generated SDK-backed admin stream fixtures (type-gen + Zod schemas), wired the semantic search app to consume them, and re-ran `pnpm make` to confirm the SDK build and lint pipelines stay green.
- 2025-10-06 13:55: Generated SDK-backed zero-hit telemetry fixtures (type-gen + Zod schemas) and proved integration coverage for observability routes; confirmed `pnpm make`/`pnpm qg` green while noting admin stream fixtures still rely on handwritten data.
- 2025-10-06 12:35: Extended Playwright fixture toggle workflow to assert deterministic notices plus empty/error messaging, and taught `searchAction` to forward fixture modes via query parameters with new helper coverage.
- 2025-10-06 11:40: Expanded fixture-mode support (success/empty/error), added unit/integration coverage, and refactored search routes/toggle helpers; `pnpm make` and `pnpm qg` now pass with deterministic fixture fallbacks.
- 2025-10-06 08:15: Added `resolveFixtureToggleVisibility`, documented `NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE`, and refreshed Playwright fixture workflow; `pnpm make` confirmed green post-change.
- 2025-09-30 22:42: Resolved Next.js build error in `/status` by converting the page to a Server Component and delegating rendering to StatusClient.
- 2025-09-30: Completed fixture-mode resolver integration across server actions and API routes with supporting tests and documentation.
- 2025-09-29: Search hero and layout refinements ensured stacking rules and overflow behaviour remain stable at `bp-lg` and above.

### Priority Order (Phase 1 UX)

1. **Search UX remediation** – Resolve the structured flow regression, refine fixture capture/artefacts, and complete the remaining UX polish (hero tweaks, panel simplifications, error/empty messaging) while keeping accessibility and responsiveness intact.
2. **Admin telemetry and operator workflows** – Add telemetry history, operator messaging, and deterministic fixtures with comprehensive testing (unit → integration → RTL → Playwright).
3. **Status page hardening** – Implement tone/failure logic and full coverage before sign-off.
4. **Secondary polish** – Hero copy/layout refinements, documentation tidy-up, and remaining backlog once the higher priorities are complete.

### Detailed Task Breakdown (2025-10-05)

- ✅ 2025-10-07: Search and Admin surfaces now render fixture scenario radio toggles (success/empty/error) with integration + Playwright evidence; cookie persistence verified across modes.
- ✅ 2025-10-07: Dedicated `/structured_search` and `/natural_language_search` routes now highlight the relevant form above the fold with skip links; hero copy condenses outside the default path.
- ✅ 2025-10-07: Initial search state now shows instructional guidance instead of premature empty results; unit coverage proves the idle message.
- ✅ 2025-10-07: Captured deterministic artefacts (xs/md/lg/xl) for search + admin via `scripts/capture-search-artifacts.mjs`; see `test-artifacts/artifact-summary.json` for layout metrics.
- ✅ 2025-10-08: Cleared the `Maximum update depth exceeded` regression in the structured flow, re-ran targeted integration suites, and captured fixture-mode Playwright runs confirming the fix.
- ✅ 2025-10-08: Logged root cause, mitigation, and console trace evidence for the structured regression in the GO cadence.
- ACTION: Auto-trigger fixture queries during capture so success/empty scenarios include rendered results; adjust `scripts/capture-search-artifacts.mjs` to submit structured searches post-load and regenerate artefacts.
- REVIEW: Re-capture artefacts once scripted queries run, validating hero height, form order, idle messaging, and admin notices across breakpoints; log findings with screenshots + axe output in the GO cadence.
- ACTION: Reduce the `/search` hero vertical footprint so structured controls appear above the fold at `bp-md`; trim body copy and adjust padding tokens before the next capture.
- REVIEW: Conduct our joint review of `/structured_search` + `/natural_language_search` variants—confirm condensed hero treatment, CTA copy, and skip-link wording; record decisions and any token follow-ups.
- ACTION: Simplify the natural language panel to a multiline textarea that surfaces derived structured parameters alongside results, keeping filters de-duplicated.
- REVIEW: Confirm the derived parameter presentation meets our expectations and document accessibility notes.
- ACTION: Harden structured search error handling so the 503 fixture emits an explicit banner, `aria-live` announcement, and retry CTA without showing stale data.
- REVIEW: Capture RTL and Playwright assertions for the banner, narration, and retry flow; include screen reader notes where possible.
- ACTION: Enrich empty result states with query/filter context plus suggestion actions that guide teachers forward.
- REVIEW: Record sign-off with artefacts demonstrating the refreshed empty state at key breakpoints.
- ACTION: Improve the fixture status banner’s keyboard-visible pressed state and refine copy tone for the search/admin notices.
- REVIEW: Validate focus outlines, pressed-state transitions, and tone via a keyboard-only audit; document outcomes.
- ACTION: Update UX documentation and screenshots to reflect instructional idle copy, variant routes, and fixture scenarios, linking to regenerated artefacts.
- REVIEW: Ensure Playwright suites continue to cover idle/error messaging and the admin notices after documentation updates.

**Search scope helpers adoption**

- ✅ Replaced literal scope unions across SDK validators, OpenAPI schemas, fixtures, services, and UI loops with the generated helpers; added `search-scopes` module for shared constants.
- ✅ Updated integration/unit suites to exercise the new helpers and confirmed `pnpm -C apps/oak-open-curriculum-semantic-search type-check` remains clean.

**Fixture usage verification**

- ✅ Added deterministic end-to-end coverage: Playwright toggle scenario, RTL assertions, and API suites verify cookie-driven fixture mode.
- ✅ 2025-10-06: Added failing → passing unit/integration tests for fixture toggle success/empty/error states, introduced coverage matrix, and refactored toggle/fixture helpers to rely on SDK imports.
- ✅ 2025-10-06: Reinforced Playwright coverage for fixture notices plus empty/error responses and added helper utilities so server actions preserve fixture overrides when hitting internal APIs.

**Admin console resilience**

- ⚙️ Partial: added pre-flight validation for missing Elasticsearch env vars, stream outcome summaries, zero-hit fixtures via the SDK, and SDK-generated admin stream fixtures for success/empty/error states. Still to do – richer telemetry integration, persistent history of runs per action, and operator-facing messaging/tests.

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

1. REMINDER: use British spelling.
2. ACTION: Export updated Playwright artefacts for fixture success/empty/error scenarios at xs/md/lg/xxl once chromium run stabilises.
3. REVIEW: Confirm the artefacts demonstrate deterministic notices, empty messaging, and outage cues without introducing layout regressions.
4. ACTION: Conduct the UX review (fixtures enabled) across success/empty/error modes, noting layout, copy, and accessibility observations.
5. REVIEW: Capture UX findings in the plan and adjust follow-up tasks accordingly.
6. ACTION: Draft failing admin telemetry and stream-fixture generation specs (unit/integration) to define history, operator messaging, and compile-time fixture requirements ahead of implementation.
7. REVIEW: Validate the telemetry + fixture test plan with documentation expectations before touching product code.
8. GROUNDING: read GO.md and follow all instructions.
9. ACTION: Extend admin integration/RTL specs to assert SDK-backed stream fixtures across success/empty/error modes.
10. REVIEW: Confirm tests exercise the generated fixtures end-to-end and highlight any telemetry gaps.
11. QUALITY-GATE: Run `pnpm qg`, archiving artefacts that demonstrate the new fixtures in use.
12. ACTION: Define admin telemetry/history requirements and draft failing unit/integration/RTL/Playwright tests (in priority order) before implementation, ensuring fixtures originate from the SDK type-gen pipeline.
13. REVIEW: Cross-check the admin test matrix and fixture-generation scope with stakeholders and documentation to ensure completeness.
14. GROUNDING: read GO.md and follow all instructions.
15. ACTION: Implement remaining admin telemetry/history features iteratively to satisfy the new tests, ensuring deterministic fixtures for UI/Playwright coverage.
16. REVIEW: Assess the admin UI for accessibility, observability clarity, and adherence to Oak tokens.
17. QUALITY-GATE: Run `pnpm qg`, capturing artefacts for updated admin workflows and verifying stability.
18. ACTION: Draft failing status page helper/unit/integration tests covering tone logic, failure messaging, and partial data cases.
19. REVIEW: Verify status coverage matches plan expectations and avoids redundant assertions.
20. GROUNDING: read GO.md and follow all instructions.
21. ACTION: Implement status page tone/failure updates and any remaining hero copy/layout refinements using deterministic fixtures.
22. REVIEW: Validate the updated surfaces against accessibility requirements and UX acceptance criteria.
23. QUALITY-GATE: Run `pnpm qg` once more to capture final evidence for Phase 1 UX completion.
