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
- ✅ Deterministic fixture sources captured for KS2 maths, KS4 maths, KS3 history, and KS3 art with enriched cross-scope suggestions ready for builder modelling.
- ✅ Fixture reference notes and module outline drafted (`fixtures/REFERENCE.md`, `app/ui/search-fixtures/README.md`), aligning upcoming implementation with SDK-derived types.
- ⚠️ Natural-language flow and `/api/search` live-path bypass the fixture toggle, forcing live calls for NL validation.
- ⚠️ Facet content, bucket meta, and builder outputs still need to be centralised; fixtures remain duplicated across server actions until the new module lands.
- ⚠️ Status page shell remains unimplemented; `/healthz` still serves JSON-only responses.

### Recent Progress

- 2025-09-30: Consolidated fixture source snapshots (KS2 maths, KS4 maths, KS3 history, KS3 art) with manual suggestions reflecting lesson/unit/programme navigation paths.
- 2025-09-30: Authored `fixtures/REFERENCE.md` to document provenance and schema alignment, plus `app/ui/search-fixtures/README.md` outlining data modules and builder responsibilities.
- 2025-09-29: Search hero heading now wraps using `HeroHeadingCluster`, preventing overflow within the hero card.
- 2025-09-29: Playwright responsive suite continues to gate Search/Admin/Docs layouts at bp-xs/md/lg/xxl using the existing structured fixture.
- 2025-09-28: `SearchResults.unit.test.tsx` and integration coverage updated for multi-scope payloads (`mode` + `multiBuckets`).

### Outstanding Audit Notes

- **Deterministic fixtures:** Replace ad-hoc fixtures with a single typed source that covers lessons, units, sequences, multi-bucket totals, facets, suggestions, empty states, and edge-cases (timed-out, zero results).
- **Runtime toggle:** Provide an environment/query/cookie-driven toggle so Search UX can hot-switch between live data and fixtures, covering structured, natural, and suggestion flows.
- **Status page UX:** Design and implement the Oak-branded status page that consumes `/healthz` data, including accessibility hooks and responsive layout.
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

1. Populate `app/ui/search-fixtures/data/` with static exports derived from the curated JSON snapshots (KS2 maths, KS4 maths, KS3 history, KS3 art).
2. Encode fixtures using types from `SearchFacetsSchema`, `SequenceFacetSchema`, and `SearchLessonsIndexDoc` to stay aligned with the SDK.
3. Implement builder helpers (single-scope, multi-scope, empty, timed-out) that accept overrides for totals, timings, highlights, and suggestion lists.
4. Compose suggestions that showcase varied scope labels (lesson, unit, programme), subject slugs, key stages, context metadata, and highlight the navigation copy used in cards.
5. Document fixture provenance and regeneration steps in `search-fixtures/README.md` and ensure the data modules remain thin wrappers over SDK-derived shapes.
6. Replace existing imports in `structured-search.actions.ts`, Playwright mocks, and future Storybook stories with the shared fixture builders.

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

1. ✅ REMINDER: UseBritish spelling.
2. ACTION: Consolidate KS2/KS3 fixture reference data from `tmp/search-fixture-source.json` into working notes.
3. REVIEW: Summarise dataset coverage and highlight remaining gaps (e.g. suggestions, timed-out states).
4. ACTION: Design the `app/ui/search-fixtures` module structure, naming, and builder signatures.
5. REVIEW: Validate the module design against SDK types and repo architecture rules.
6. GROUNDING: read GO.md and follow all instructions.
7. ACTION: Draft fixture builder implementations covering single-scope, multi-scope, empty, and timed-out payloads.
8. REVIEW: Run Zod `safeParse` prototypes against builder outputs to confirm structural fidelity.
9. ACTION: Map adoption plan for structured actions, API routes, controllers, and Playwright suites to consume the new fixtures.
10. REVIEW: Confirm the adoption map covers suggestions, multi-buckets, and natural search flows.
11. QUALITY-GATE: Define the targeted unit, integration, and Playwright suites that must run during fixture rollout.
12. GROUNDING: read GO.md and follow all instructions.
13. ACTION: Implement the fixture mode resolver utility (env → query → cookie) with unit coverage.
14. REVIEW: Evaluate resolver behaviour against edge cases (invalid modes, missing cookies) and document findings.
15. ACTION: Thread fixture mode through `searchAction`, `/api/search`, and `/api/search/suggest`, replacing ad-hoc fixture logic.
16. REVIEW: Add integration tests ensuring fixture/live branches behave consistently and log zero-hit events appropriately.
17. QUALITY-GATE: Update Playwright configuration to set the fixture cookie and enumerate viewport baselines affected by the change.
18. GROUNDING: read GO.md and follow all instructions.
19. ACTION: Extend natural-language helper and `/api/search/nl` route to honour fixture mode and reuse shared builders.
20. REVIEW: Confirm NL paths emit deterministic results and suggestions while maintaining error handling.
21. ACTION: Build the developer-facing fixture toggle UI control and associated server action for cookie mutation.
22. REVIEW: Check accessibility (focus order, announcements) and document usage guidance for designers.
23. QUALITY-GATE: Schedule combined `pnpm test`, `pnpm lint`, and `pnpm -C apps/oak-open-curriculum-semantic-search test:ui --grep "Search"` runs for fixture/toggle branches.
24. GROUNDING: read GO.md and follow all instructions.
25. ACTION: Refresh continuation + context docs with fixture/toggle outcomes, instructions, and artefact links.
26. REVIEW: Proofread documentation for clarity, British spelling, and up-to-date references.
27. ACTION: Stage code + docs, capturing `git status` for the fixture/toggle change set.
28. REVIEW: Verify staging matches intentions and note any follow-up clean-up.
29. QUALITY-GATE: Execute `pnpm qg` before final review.
30. GROUNDING: read GO.md and follow all instructions.
31. ACTION: Draft the conventional commit message capturing fixture consolidation and toggle delivery.
32. REVIEW: Validate commit message scope, tense, and formatting.
33. ACTION: Run `git commit` (no `--no-verify`).
34. REVIEW: Confirm the working tree is clean and summarise release notes for hand-off.
