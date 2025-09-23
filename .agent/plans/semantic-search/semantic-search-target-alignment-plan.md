# Semantic Search Target Alignment Plan

## Intent

Deliver the hybrid search app so that it matches the definitive architecture: server-side RRF queries over enriched Elasticsearch Serverless indices, fully populated via the SDK with canonical URLs and lesson-planning data, plus the supporting admin flows, suggestion endpoints, and observability. All ingestion and search orchestration runs inside Next.js App Router API routes deployed on Vercel, so every step must remain compatible with that runtime (Node 18/20 edge constraints, streaming limits, invocation timeouts).

## Current State Summary

- Elasticsearch setup scripts have been updated to provision all four indices (`oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_sequences`) with the definitive analysers, normalisers, completion contexts, and highlight offsets.
- Environment validation now enforces `SEARCH_INDEX_VERSION`, optional zero-hit webhook/LOG_LEVEL defaults, and the new requirements are covered by unit tests. SDK adapters expose additional summary endpoints but still need to emit the enriched payloads into the ingestion pipeline.
- Rollup rebuild now emits lesson-planning snippets drawn from SDK summaries; remaining work is to propagate enriched rollups into API responses and downstream queries.
- Search runtime now issues server-side `rank.rrf` requests for lessons, units, and sequences, returning highlights, totals, and optional aggregations.
- Structured and NL API routes validate facets/phase filters and emit enriched payload envelopes. Front-end flows still consume only the legacy `results` array and need upgrading.
- Test suite covers the new helper behaviour, but observability for zero-hit queries, doc generation, and suggestion endpoints remains outstanding.

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

## Outstanding Todo (GO cadence)

1. ACTION: Regenerate OpenAPI + TypeDoc outputs to capture the enriched search responses and facet flags.
2. REVIEW: Inspect generated artefacts for accuracy against the definitive query guide.
3. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
4. ACTION: Implement suggestion and type-ahead endpoints plus zero-hit logging that records scope, filters, and index version.
5. REVIEW: Self-review suggestion/type-ahead flows and logging instrumentation.
6. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
7. ACTION: Update the front-end search flows (server actions + UI) to consume totals, aggregations, and sequences, enabling facet toggles.
8. REVIEW: Self-review UI/API integration to ensure new metadata is rendered and backwards compatibility is handled.
9. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
10. ACTION: Extend observability by wiring structured zero-hit events and verifying webhook behaviour.
11. REVIEW: Self-review logging output and failure paths for clarity and completeness.
12. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
13. QUALITY-GATE: Run `pnpm lint` after the above changes and address any violations.
14. REVIEW: Capture lint outcomes and remediation notes.
15. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
16. QUALITY-GATE: Run `pnpm test` (unit/integration) to ensure coverage of new flows.
17. REVIEW: Summarise test results and fixes applied.
18. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
19. QUALITY-GATE: Run `pnpm build` to confirm Vercel-ready output.
20. REVIEW: Document build outcomes and follow-up work.
21. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
22. QUALITY-GATE: Run `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen` post-integration.
23. REVIEW: Record doc-gen results and remaining documentation tasks.
24. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
25. ACTION: Compile a final self-review covering completed milestones, residual risks, and recommended enhancements.
26. REVIEW: Share the summary to maintain continuity.
