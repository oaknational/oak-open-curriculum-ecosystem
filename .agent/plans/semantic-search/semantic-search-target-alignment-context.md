# Semantic Search Target Alignment – Context Snapshot

_Last updated: 2025-03-21_

## Current focus

- Execute the definitive semantic search architecture: four Elasticsearch indices, SDK-enriched ingestion, server-side RRF, suggestion/type-ahead endpoints, and observability.
- With server-side RRF now live and returning enriched payloads, focus shifts to documenting the contract, exposing facets in the UI, and delivering suggestion + zero-hit telemetry flows.

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

## In progress / blockers

- OpenAPI + TypeDoc outputs do not yet reflect the richer search responses; consumers lack updated documentation.
- Suggestion/type-ahead endpoints and zero-hit logging are still outstanding, so observability is limited.
- Front-end search flows still only use `results`, ignoring totals/facets; UI work required before enabling new metadata publicly.

## Next actions (see plan for GO cadence)

1. Regenerate OpenAPI + TypeDoc artefacts for the enriched search payloads and share diffs with consumers.
2. Implement suggestion/type-ahead endpoints and structured zero-hit logging aligned with the definitive guide.
3. Update UI/server actions to consume facets/totals/sequences, then rerun quality gates and doc-gen.

## Constraints & reminders

- **Data flow** is linear: OpenAPI schema → SDK schema (derive canonical URLs et al.) → SDK → search ingestion; no runtime fallbacks or recomputation.
- **Fail fast**: if a required field is missing, fix the schema generation rather than patching downstream.
- **GO cadence**: every ACTION → REVIEW pair with grounding every third item; quality gates (`pnpm lint`, `pnpm test`, `pnpm build`, `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`) after major changes.
- **Testing**: continue expanding unit/integration coverage for ingestion transforms, query builders, and observability hooks as features land.

Keep this context file updated after each major milestone so the team can recover momentum quickly if the conversation resets.

## Next Steps (short outlook)

- Regenerate OpenAPI/TypeDoc to reflect the enriched search contract.
- Ship suggestion/type-ahead endpoints and zero-hit telemetry with unit coverage.
- Update UI flows to surface facets/totals and ensure caching/tagging still works with expanded payloads.
