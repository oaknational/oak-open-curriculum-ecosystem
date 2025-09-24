# Semantic Search Target Alignment Plan

## Intent

Deliver the hybrid search app so that it matches the definitive architecture: server-side RRF queries over enriched Elasticsearch Serverless indices, fully populated via the SDK with canonical URLs and lesson-planning data, plus the supporting admin flows, suggestion endpoints, and observability. All ingestion and search orchestration runs inside Next.js App Router API routes deployed on Vercel, so every step must remain compatible with that runtime (Node 18/20 edge constraints, streaming limits, invocation timeouts). This plan now subsumes the semantic search index enhancement roadmap and grounds ontology requirements in `docs/architecture/curriculum-ontology.md`.

## Current State Summary

- Elasticsearch setup scripts have been updated to provision all four indices (`oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_sequences`) with the definitive analysers, normalisers, completion contexts, and highlight offsets.
- Environment validation now enforces `SEARCH_INDEX_VERSION`, optional zero-hit webhook/LOG_LEVEL defaults, and the new requirements are covered by unit tests. SDK adapters expose additional summary endpoints but still need to emit the enriched payloads into the ingestion pipeline.
- Rollup rebuild now emits lesson-planning snippets drawn from SDK summaries; remaining work is to propagate enriched rollups into API responses and downstream queries.
- Search runtime now issues server-side `rank.rrf` requests for lessons, units, and sequences, returning highlights, totals, and optional aggregations.
- Structured, NL, and suggestion API routes validate facets/phase filters, emit enriched payload envelopes, and now share cached responses with zero-hit logging hooks. Front-end flows still consume only the legacy `results` array and need upgrading.
- Test suite covers the new helper behaviour, and zero-hit logging now records scope, filters, and index version; observability dashboards and UI surfacing of these events remain outstanding.

## Progress to Date

- Regenerated Elasticsearch mapping templates and setup script so all indices match the definitive schema (including completion contexts, highlight offsets, canonical URL fields, semantic_text fields).
- Expanded runtime env validation (`SEARCH_INDEX_VERSION`, zero-hit webhook, LOG_LEVEL, AI provider checks) with a dedicated unit test suite.
- Prefixed and enriched all SDK search index types (`SearchLessonsIndexDoc`, etc.) so downstream code imports a single, unambiguous set of search-specific interfaces.
- Added schema-derived summary/sequences guards (`isLessonSummary`, `isUnitSummary`, `isSubjectSequences`) and extended the SDK adapter to consume them.
- Added `scripts/check-search-canonical-urls.ts` to verify canonical URL helpers resolve to live teachers-site pages.
- Successfully regenerated the SDK type artifacts (`pnpm type-gen`), producing up-to-date OpenAPI/Zod outputs after the latest schema adjustments.
- Refactored indexing pipeline into pure helpers with unit coverage, replacing ad-hoc transforms in `index-oak.ts` and removing lint/type violations.
- Rebuild route now consumes the shared transforms, generates structured lesson-planning snippets, and relies solely on SDK data.
- Added RRF query builder module and unit tests covering the canonical Elasticsearch request bodies for lessons, units, and sequences.
- Integrated the server-side RRF builders into the live search routes, removed the legacy `rrfFuse` helper, and added integration tests for the structured endpoint contract.
- Refactored `elastic-http.ts` to handle rank/aggregations/from safely with dedicated unit coverage.

- Updated Typedoc configuration and regenerated SDK + semantic-search documentation without warnings.
- Implemented `/api/search/suggest` with cached completion + fallback queries, dedicated logging, and integration coverage.
- Added zero-hit telemetry helper invoked from structured search, including optional webhook dispatch and unit tests.

## Target Outcomes

1. Single-request, server-side RRF searches for lessons, units, and sequences that honour the definitive query bodies (lexical + semantic, highlights, filters, optional facets).
2. Elasticsearch indices constructed by scripts that match the documented settings, including synonyms, analysers, completion contexts, and highlight limits.
3. Robust indexing & rollup flows that ingest enriched SDK data (lesson-planning data, canonical URLs, snippets) and populate all required fields, including suggestion payloads and semantic text inputs.
4. API routes (structured, NL, suggestion/type-ahead, admin) that expose the new scopes safely, validate via generated types, and emit the enriched responses.
5. Comprehensive tests and logging to detect bulk/indexing errors, zero-hit searches, and ensure regression coverage for new behaviours.

## Risks & Considerations

- SDK must already expose the necessary lesson-planning data and canonical URLs; otherwise we need upstream changes.
- Server-side RRF requires Elasticsearch Serverless tier that supports `semantic_text` and rank fusion; verify cluster version/features before rollout.
- Expanded documents increase payload size; monitor ES indexing throughput and query latency during rollout.
- Next.js API routes on Vercel have memory/runtime ceilings; keep ingestion helpers pure/pipelined so they fit within per-invocation limits or split work into batched calls.
- Quality gates may surface latent issues in unrelated workspaces due to shared SDK changes; coordinate with owning teams.
- Nightly rebuilds must remain efficient; each index addition needs clear incremental update strategies, shard sizing, and inference cost monitoring.

## Roadmap Phases

All phases inherit the ontology definitions from `docs/architecture/curriculum-ontology.md` (node IDs, relationships, schema references, provenance) and reuse the definitive hybrid query practices.

### Phase 1 – Demonstration Baseline

Objective: showcase a complete hybrid search experience with first-class filtering and facets while keeping the implementation lean.

- **Indices**
  - Continue using `oak_lessons`, `oak_units`, `oak_unit_rollup`, and `oak_sequences` as the core search indices.
  - Introduce `oak_sequence_facets` to store condensed hierarchy metadata (subject → sequence → unit → year/key stage counts) plus suggestion seeds. This index enables subject, programme (sequence), unit, key stage, and year filtering without overloading the primary indices.
- **Features**
  - Structured/NL endpoints expose filters for subject, key stage, year, sequence (programme), and unit, returning facet buckets sourced from `oak_sequence_facets`.
  - Responses include totals, pagination metadata, and optional aggregation blocks.
  - UI/server actions consume the enriched responses and render facets.
  - Zero-hit logging captures scope, filters, and `SEARCH_INDEX_VERSION`.
- **Ingestion**
  - Create a shared ingestion harness (backfill + nightly) that draws solely on SDK data; ensure it can materialise `oak_sequence_facets` efficiently.
  - Document operational runbooks and backoff strategies.

### Phase 2 – Content Depth Expansion

Objective: enrich search with pedagogical context, resources, and optional prior knowledge signals, demonstrating the full power of `semantic_text` indices.

- **Indices**
  - `oak_lesson_planning`: denormalised lesson/unit planning metadata (key learning points, misconceptions, teacher tips, accessibility notes, canonical URLs) with semantic embeddings.
  - `oak_lesson_transcripts`: chunked transcripts with timing metadata and long-form embeddings.
  - `oak_content_guidance`: safeguarding tags, supervision levels, accessibility notices, prior knowledge relationships. Add prior knowledge (priorKnowledgeRequirements) and National Curriculum (nationalCurriculumContent) filters/boosting once ingestion proves reliable.
  - `oak_assets`: downloadable/viewable resources with attribution, asset type, accessibility metadata, and completion contexts for suggestions.
  - `oak_assessments`: quiz stem/distractor/objective data for assessment discovery.
- **Features**
  - Augment search responses with optional blocks (planning snippets, transcript excerpts, guidance highlights, resource suggestions) behind feature flags.
  - Extend filters to include safeguarding/accessibility categories; evaluate prior knowledge graph traversal.
- **Ingestion**
  - Design inference-aware pipelines per index: chunking heuristics, embedding jobs, nightly delta strategies, logging of ontology node IDs.
  - Establish cost monitoring (Elastic inference + storage) and alerting.
- **Documentation**
  - Publish index specs (mappings, chunking strategy, example docs) and query recipes in `apps/oak-open-curriculum-semantic-search/docs/`.

### Phase 3 – Ontology & Observability Showcase

Objective: surface ontology metadata end-to-end, power advanced suggestions, and deliver observability artefacts that highlight system capabilities.

- **Indices**
  - `oak_ontology_static`: curated ontology metadata (entities, relationships, schema refs) for fast lookup by search responses and MCP tooling.
- **Features**
  - Search results embed `_nodeId`, `_nodeType`, `_schemaRefs`, `_ontologyRefs`, `_provenance` for each hit.
  - Suggestion/type-ahead endpoints span all indices, leveraging completion contexts and facet rollups.
  - Zero-hit webhooks emit ontology-rich payloads; dashboards display zero-hit trends by ontology node.
- **Tooling & Documentation**
  - Provide MCP resources (`mcp://oak/ontology/v1.json`, JSON-LD/Mermaid exports) and update docs with observability walkthroughs.

## Implementation Guidance (all phases)

- **Mappings & Pipelines**: define index templates with `semantic_text` fields, lexical analysers, completion contexts, and provenance keywords; reuse the Elasticsearch TypeScript SDK for all ingestion and inference calls.
- **Chunking Strategy**: keep chunk length/overlap consistent for transcripts and planning text so embeddings remain high-quality and RRF weighting stable.
- **Provenance & Ontology Metadata**: enforce ontology-driven identifiers (`Lesson:slug`, etc.) and include MCP metadata placeholders (`ontology.nodesReturned`, `schemaRefs`, `provenanceRequired`) in both stored docs and API responses.
- **Testing & Observability**: add ingestion unit/integration tests, monitor inference latency and shard usage, and maintain zero-hit diagnostics.
- **Versioning**: tie index rollouts to `SEARCH_INDEX_VERSION`, documenting alias swap procedures and rollback steps.

## Outstanding Todo (GO cadence)

We continue to follow GO cadence (ACTION → REVIEW with grounding every third item). Tasks below emphasise Phase 1 completion before Phase 2/3 preparation.

1. ACTION: Wire UI interactions so selecting sequence/unit facets and filters triggers structured follow-up searches with the new payload metadata.
2. REVIEW: Verify facet-driven searches behave correctly across scopes and record remaining UX gaps.
3. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
4. ACTION: Design and document zero-hit observability outputs (dashboards/webhook consumers) using the new structured log format.
5. REVIEW: Confirm proposed observability flows cover required metrics and alerting paths.
6. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
7. ACTION: Update client surfaces to expose suggestion/type-ahead responses, including caching and analytics hooks.
8. REVIEW: Assess suggestion UX and note follow-on experiments.
9. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
10. ACTION: Draft ingestion pipeline designs for Phase 2 indices (lesson planning, transcripts, guidance, assets, assessments) covering chunking, inference, nightly deltas, and shard sizing.
11. REVIEW: Validate pipeline designs against performance/cost goals and ontology metadata requirements.
12. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
13. ACTION: Implement observational dashboards and webhook verification for zero-hit telemetry enriched with ontology data.
14. REVIEW: Check logs/dashboards for clarity and actionable metrics.
15. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
16. QUALITY-GATE: Run `pnpm lint` after completing the above changes and resolve any violations.
17. REVIEW: Capture lint outcomes and remediation notes.
18. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
19. QUALITY-GATE: Run `pnpm test` (unit/integration) to ensure coverage of new features.
20. REVIEW: Summarise test results and fixes applied.
21. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
22. QUALITY-GATE: Run `pnpm build` to confirm production readiness.
23. REVIEW: Document build outcomes and follow-up actions.
24. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
25. QUALITY-GATE: Run `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen` post-integration.
26. REVIEW: Record doc-gen results and remaining documentation tasks.
27. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
28. ACTION: Compile a final self-review covering completed milestones, residual risks, and recommended enhancements for future phases.
29. REVIEW: Share the summary to maintain continuity.
