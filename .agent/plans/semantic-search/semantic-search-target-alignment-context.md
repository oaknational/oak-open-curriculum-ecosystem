# Semantic Search Target Alignment – Context Snapshot

_Last updated: 2025-09-25 (zero-hit persistence shipped)_

## Current focus

- Execute the definitive semantic search architecture: four Elasticsearch indices, SDK-enriched ingestion, server-side RRF, suggestion/type-ahead endpoints, and observability.
- Phase 1 (demonstration baseline) is in-flight: server-side RRF is live, sequence facet docs ingest, and we now have suggestion + zero-hit telemetry ready for UI wiring.
- Phase 2 (content depth) and Phase 3 (ontology & observability showcase) are captured in the target alignment plan for staged follow-up once Phase 1 is signed off.

## Progress checkpoints

- ✅ **Elasticsearch scaffolding** – mapping templates regenerated for `oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_sequences`; `scripts/setup.sh` provisions all indices with definitive analysers/completion contexts.
- ✅ **Environment validation** – `src/lib/env.ts` now enforces `SEARCH_INDEX_VERSION`, zero-hit webhook defaults, `LOG_LEVEL`, and AI provider rules; covered by `env.unit.test.ts`.
- ✅ **Search types** – SDK search index interfaces prefixed (`SearchLessonsIndexDoc`, etc.), enriched with canonical URL fields, lesson-planning metadata placeholders, suggestion payload definitions. Semantic-search app updated to consume new types.
- ✅ **Schema guards** – Added Zod-backed guards (`isLessonSummary`, `isUnitSummary`, `isSubjectSequences`) so enriched summary responses flow through a single schema-derived type.
- ✅ **Adapter extensions** – SDK adapter now fetches lesson/unit summaries and subject sequences using the new guards and passes canonical URLs/lesson-planning data straight through.
- ✅ **Sanity tooling** – `scripts/check-search-canonical-urls.ts` verifies canonical URL helpers resolve to live resources.
- ✅ **Type generation** – ran `pnpm type-gen` to regenerate SDK OpenAPI/Zod artefacts after schema/guard updates.
- ✅ **Indexing transforms** – `index-oak.ts` now delegates to pure helpers in `lib/indexing/document-transforms.ts`, covering lessons, units, and rollups with dedicated unit tests.
- ✅ **Rollup rebuild** – API route now uses the shared transforms, enforces lesson-planning snippets, and raises errors when upstream data is missing.
- ✅ **RRF integration** – Server API routes now call the shared `rank.rrf` builders, remove the legacy `rrfFuse` helper, and surface totals/highlights/aggregations.
- ✅ **Contract tests** – Added structured route integration tests and `elastic-http` unit tests covering rank, aggregations, and timed-out propagation.
- ✅ **Doc generation** – Typedoc configuration updated so both the SDK and semantic-search workspaces regenerate documentation without warnings.
- ✅ **Suggestion endpoint** – `/api/search/suggest` ships completion + fallback queries with caching, validation, and integration coverage.
- ✅ **Zero-hit telemetry** – Structured searches emit zero-hit logs and optional webhook payloads via a shared helper.
- ✅ **OpenAPI refresh** – Schemas and path registration now include sequences, facets, suggestions, and zero-hit metadata.
- ✅ **Search facet exports** – Search facet types and Zod validators now emit named exports from the SDK generator, satisfying eslint rules and keeping `pnpm check` green.
- ✅ **UI styling catalogue** – Recorded all bespoke styling surfaces in `.agent/plans/semantic-search/ui-styling-catalogue.md` to drive Oak Component migrations.
- ✅ **Facet & results migration** – Search facets and results now render with Oak Components/theme tokens (no bespoke `styled-components`), validated by `pnpm -C apps/oak-open-curriculum-semantic-search test`.
- ✅ **Theme switching** – Defined light/dark `AppTheme` variants from `OakTheme`, updated the ThemeProvider to swap them, and moved the theme selector to Oak radio controls.
- ✅ **Form migration** – Structured and natural search forms now use Oak form/radio components with shared field helpers.
- ✅ **UI shell refresh** – Header/navigation, search layout shell, tab toggles, and the theme selector all run on Oak layout/typography tokens with bespoke styles removed.
- ✅ **Admin console migration** – `/admin` now uses Oak layout, typography, and button primitives with stream output rendered via Oak tokens (no styled-components).
- ✅ **API docs shell** – `/api/docs` is now delivered with Oak layout/typography containers and an Oak-bordered Redoc frame, removing bespoke styled wrappers.
- ✅ **Admin/docs regression tests** – Added integration coverage for `/admin` and `/api/docs` to verify Oak component wiring and streaming/embed behaviour.
- ✅ **Structured UI metadata** – Hybrid search page now surfaces totals, took/timed-out flags, facet counts, and suggestion chips derived from SDK schemas with accompanying tests.
- ✅ **Follow-up wiring** – Scope toggles, programme facets, and suggestion chips all replay structured searches with typed payload builders (`useStructuredFollowUp`, `facet-search`, `suggestion-search`) plus integration/unit coverage.
- ✅ **Zero-hit telemetry surface** – Added in-memory event store + API routes, Oak-themed dashboard (`app/ui/admin/ZeroHitDashboard*.tsx`), and unit/integration tests covering refresh, grouping, and webhook ingestion.
- ✅ **Quality gates (post-Step 39)** – `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`, and `pnpm check` all pass after the latest UI/controller updates.
- ✅ **Phase 1 self-review** – Captured outcomes, residual risks, and recommendations in `.agent/plans/semantic-search/phase-1-self-review.md`.
- ✅ **Sandbox harness design** – Documented fixture layout, CLI orchestration, index targeting helper, tests, and manual drill steps in `apps/oak-open-curriculum-semantic-search/docs/sandbox-ingestion-harness.md`.
- ✅ **Sandbox index targeting** – Added env-driven index target selection, rewired ingestion/search modules, and covered the helpers with unit tests (`search-index-target.unit.test.ts`).
- ✅ **Sandbox ingestion harness** – Implemented fixture-backed Oak client + CLI (`scripts/sandbox/ingest.ts`), rewrote bulk operations via `search-index-target.ts`, and added unit coverage for dry-run vs live `_bulk` requests (`sandbox-harness.unit.test.ts`).
- ✅ **Sandbox harness refactor** – Split fixture parsing and bulk helpers into dedicated modules, tightened type guards, and cleared lint/max-lines constraints ahead of telemetry persistence work.
- ✅ **Zero-hit persistence** – Implemented Serverless-backed writes with automatic ILM provisioning, index-missing fallbacks, retention-aware env toggles, CLI purge support, documentation, and Vitest coverage across persistence/search paths.
- ✅ **Sequence facet instrumentation** – Sandbox harness now wraps `buildIndexBulkOps` with per-sequence metrics (fetch/extraction timings, unit counts, inclusion state) and returns them with each dry-run/ingest summary, alongside CLI path fixes for fixtures.
- ✅ **Hybrid search coverage** – Added `runHybridSearch` unit tests to prove scope routing, pagination normalisation, and facet enrichment behaviour end-to-end.
- ✅ **UI theming remediation** – Styled-components registry now avoids client-side sheet reuse and theme sync no longer stalls; integration tests confirm `data-theme` updates flow through the Oak bridge.

## In progress / blockers

- `oak_sequence_facets` ingestion/caching needs optimisation and a documented operational runbook to stay responsive during UI adoption (instrumentation now exposes per-sequence timings; remaining work focuses on batching/invalidation policy and admin surfacing).
- 2025-09-26 ingestion audit: sandbox harness dry-run (fixture dataset) required explicit `--fixture ./fixtures/sandbox` flag because the CLI currently double-nests `apps/…` when resolving the default path. Env bootstrap demanded dummy ES/Oak keys even for dry runs, confirming the helpers always touch `env()` before transport rewiring. Instrumenting `buildIndexBulkOps` with the fixture client showed a single `_bulk` payload (10 operations → 5 documents) with exactly one sequence facet document, while request counts highlighted fully sequential calls (`getSequenceUnits` invoked once per sequence, no concurrency or caching beyond the per-subject map). `esBulk` still posts the entire operation array without chunking/retries/logging, and no cache invalidation hook (`revalidateTag`) currently runs after ingestion.
- Admin console lacks index health telemetry (document counts, last-run timestamps, index version), limiting visibility during bootstrap/update operations.
- Zero-hit webhook consumer hardening: follow-up work will explore Elasticsearch-backed persistence beyond in-memory storage once ingestion is stabilised.
- 2025-09-26 coverage reflection: Expanded unit suites now cover hybrid search routing and sequence facet instrumentation, yet real Elasticsearch integration tests and UI regression coverage remain open; the work stays on Phase 1’s critical path until ingestion batching and UI remediation are complete.

## Next actions (see plan for GO cadence)

1. Optimise `oak_sequence_facets` ingestion/caching using insights from the sandbox run and capture the operational runbook.
2. Enrich the admin console with index health details and verified controls.
3. Refresh semantic-search documentation and onboarding packs, then rerun the end-to-end quality gates before Phase 1 hand-off.

## Constraints & reminders

- **Data flow** is linear: OpenAPI schema → SDK schema (derive canonical URLs et al.) → SDK → search ingestion; no runtime fallbacks or recomputation.
- **Fail fast**: if a required field is missing, fix the schema generation rather than patching downstream.
- **GO cadence**: every ACTION → REVIEW pair with grounding every third item; quality gates (`pnpm lint`, `pnpm test`, `pnpm build`, `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`) after major changes.
- **Elasticsearch**: all interactions (scripts, sandbox drills, telemetry persistence) must target Elasticsearch Serverless via the `@elastic/elasticsearch` TypeScript client—no alternative HTTP adapters.
- **Testing**: continue expanding unit/integration coverage for ingestion transforms, query builders, and observability hooks as features land.

Keep this context file updated after each major milestone so the team can recover momentum quickly if the conversation resets.

## Next Steps (short outlook)

- Harden zero-hit telemetry persistence so dashboards survive process restarts.
- Complete ingestion polish for sequence facets ahead of Phase 2 indexing work.
- Add admin surface telemetry for index health prior to the Phase 1 hand-off.
