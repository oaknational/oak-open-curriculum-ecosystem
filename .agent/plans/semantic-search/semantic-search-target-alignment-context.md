# Semantic Search Target Alignment – Context Snapshot

_Last updated: 2025-03-18_

## Current focus

- Execute the definitive semantic search architecture: four Elasticsearch indices, SDK-enriched ingestion, server-side RRF, suggestion/type-ahead endpoints, and observability.
- Work now shifts to enriching the SDK schema/adapter outputs so the ingestion pipeline can emit full lesson/unit/sequence documents without recomputing derived data.

## Progress checkpoints

- ✅ **Elasticsearch scaffolding** – mapping templates regenerated for `oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_sequences`; `scripts/setup.sh` provisions all indices with definitive analysers/completion contexts.
- ✅ **Environment validation** – `src/lib/env.ts` now enforces `SEARCH_INDEX_VERSION`, zero-hit webhook defaults, `LOG_LEVEL`, and AI provider rules; covered by `env.unit.test.ts`.
- ✅ **Search types** – SDK search index interfaces prefixed (`SearchLessonsIndexDoc`, etc.), enriched with canonical URL fields, lesson-planning metadata placeholders, suggestion payload definitions. Semantic-search app updated to consume new types.
- ✅ **Schema guards** – Added Zod-backed guards (`isLessonSummary`, `isUnitSummary`, `isSubjectSequences`) so enriched summary responses flow through a single schema-derived type.
- ✅ **Adapter extensions (partial)** – SDK adapter now fetches lesson/unit summaries and subject sequences using the new guards; ready to feed canonical URLs and planning metadata into ingestion.
- ✅ **Sanity tooling** – `scripts/check-search-canonical-urls.ts` verifies canonical URL helpers resolve to live resources.
- ✅ **Type generation** – ran `pnpm type-gen` to regenerate SDK OpenAPI/Zod artefacts after schema/guard updates.

## In progress / blockers

- `src/lib/index-oak.ts` now assembles enriched unit/lesson documents (canonical URLs, planning metadata); however the refactor currently fails lint/type checks (`max-lines-per-function`, complexity limits, and `unknown` typing) that must be resolved before the build passes.
- `app/api/rebuild-rollup/route.ts` consumes the enriched unit docs but still depends on the updated ingestion output; further adjustments may be needed once lesson documents are finalised.

## Next actions (see plan for GO cadence)

1. Regenerate the SDK schema so derived fields (canonical URLs, planning metadata, suggestion payload inputs) flow directly from the OpenAPI → SDK transformation.
2. Update adapters to pass through those enriched fields without recomputing them.
3. Rebuild the ingestion pipeline using only SDK-provided data, introducing batching/backoff, structured logging, and enriched documents.
4. Redesign rollup flow, then move on to server-side RRF queries, API expansion, suggestion endpoints, and observability.

## Constraints & reminders

- **Data flow** is linear: OpenAPI schema → SDK schema (derive canonical URLs et al.) → SDK → search ingestion; no runtime fallbacks or recomputation.
- **Fail fast**: if a required field is missing, fix the schema generation rather than patching downstream.
- **GO cadence**: every ACTION → REVIEW pair with grounding every third item; quality gates (`pnpm lint`, `pnpm test`, `pnpm build`, `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`) after major changes.
- **Testing**: continue expanding unit/integration coverage for ingestion transforms, query builders, and observability hooks as features land.

Keep this context file updated after each major milestone so the team can recover momentum quickly if the conversation resets.

## Next Steps (short outlook)

- Regenerate SDK schema with enriched search fields (lesson planning metadata, suggestion payload inputs) flowing from OpenAPI → SDK transformation.
- Update adapters to consume those enriched fields and feed the indexing pipeline.
- Rebuild ingestion pipelines (lessons/units/sequences/rollups) using only SDK-provided data with batching/backoff and structured logging.
- Redesign rollup flow, then move on to server-side RRF, API expansions, suggestion endpoints, and observability.
