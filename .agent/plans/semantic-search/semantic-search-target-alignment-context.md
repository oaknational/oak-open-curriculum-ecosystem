# Semantic Search Target Alignment – Context Snapshot

_Last updated: 2025-03-21_

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

## In progress / blockers

- Front-end search flows still only use `results`, ignoring totals, sequence facets, and suggestions; UI work required before enabling new metadata publicly.
- UI components continue to rely on ad-hoc styling; migrate to Oak Components + semantic tokens for cards, dropdowns, facets, and admin panels.
- Zero-hit logs exist, but dashboards/webhook consumers are not yet wired to surface the data to operators.
- Need to finalise ingestion + UI wiring for `oak_sequence_facets` to unlock audience filters end-to-end.

## Next actions (see plan for GO cadence)

1. Wire UI/server actions to trigger follow-up searches when facets or filters change, exposing totals/facets/suggestions.
2. Migrate UI surfaces to Oak Components + semantic tokens, retiring ad-hoc styling in search and admin panels.
3. Document and prototype observability flows (dashboards/webhook consumer) for the zero-hit telemetry payloads.
4. Finalise ingestion + caching strategy for `oak_sequence_facets` so UI filtering remains responsive.
5. Begin drafting ingestion pipeline designs for Phase 2 indices (lesson planning, transcripts, guidance, assets, assessments) so infrastructure decisions are ready once Phase 1 ships.

## Constraints & reminders

- **Data flow** is linear: OpenAPI schema → SDK schema (derive canonical URLs et al.) → SDK → search ingestion; no runtime fallbacks or recomputation.
- **Fail fast**: if a required field is missing, fix the schema generation rather than patching downstream.
- **GO cadence**: every ACTION → REVIEW pair with grounding every third item; quality gates (`pnpm lint`, `pnpm test`, `pnpm build`, `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`) after major changes.
- **Testing**: continue expanding unit/integration coverage for ingestion transforms, query builders, and observability hooks as features land.

Keep this context file updated after each major milestone so the team can recover momentum quickly if the conversation resets.

## Next Steps (short outlook)

- Integrate the new suggestion + facet responses into the client experience and ensure caching/tagging still works with expanded payloads.
- Stand up zero-hit dashboards/alerts consuming the new webhook/log payloads.
- Complete ingestion polish for sequence facets ahead of Phase 2 indexing work.
