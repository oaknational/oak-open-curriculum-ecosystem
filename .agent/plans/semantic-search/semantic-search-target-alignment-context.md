# Semantic Search Target Alignment – Context Snapshot

_Last updated: 2025-03-20_

## Current focus

- Execute the definitive semantic search architecture: four Elasticsearch indices, SDK-enriched ingestion, server-side RRF, suggestion/type-ahead endpoints, and observability.
- With the ingestion helpers now refactored into pure transforms and the rollup rebuild route consuming them, focus shifts to downstream API/query changes.

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
- ✅ **Doc generation** – Typedoc configuration updated so both the SDK and semantic-search workspaces regenerate documentation without warnings.

## In progress / blockers

- Search API routes and query builders still operate on client-side fusion and have not yet incorporated sequences, facets, or the enriched payloads.
- API responses do not yet surface the enriched rollup documents nor expose lesson-planning metadata downstream.

## Next actions (see plan for GO cadence)

1. Replace client-side fusion with server-side rank.rrf queries, adding sequences and facets.
2. Expand API responses (structured + NL + suggestion) to surface the enriched documents and add observability hooks.
3. Regenerate OpenAPI/TypeDoc artefacts and run full quality gates once the ingestion/query layers stabilise.

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
