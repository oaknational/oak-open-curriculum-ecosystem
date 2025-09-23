# Semantic Search Target Alignment Plan

## Intent

Deliver the hybrid search app so that it matches the definitive architecture: server-side RRF queries over enriched Elasticsearch Serverless indices, fully populated via the SDK with canonical URLs and lesson-planning data, plus the supporting admin flows, suggestion endpoints, and observability. All ingestion and search orchestration runs inside Next.js App Router API routes deployed on Vercel, so every step must remain compatible with that runtime (Node 18/20 edge constraints, streaming limits, invocation timeouts).

## Current State Summary

- Elasticsearch setup scripts have been updated to provision all four indices (`oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_sequences`) with the definitive analysers, normalisers, completion contexts, and highlight offsets.
- Environment validation now enforces `SEARCH_INDEX_VERSION`, optional zero-hit webhook/LOG_LEVEL defaults, and the new requirements are covered by unit tests. SDK adapters expose additional summary endpoints but still need to emit the enriched payloads into the ingestion pipeline.
- Indexing pipeline still generates minimal documents (no semantic_text payloads, no metadata arrays, no completion data) and offers no batching/backoff strategy aligned with production needs.
- Rollup rebuild pulls lesson transcripts directly, truncates naively, and omits semantic fields, URLs, and suggestion payloads.
- Search logic issues multiple requests per scope and fuses results client-side via custom RRF; it ignores lesson-planning data, does not return facets, and has no sequences support.
- API surface (structured + NL) exposes only lessons/units, lacks facet toggles, no suggestion/type-ahead endpoints, and returns sparse payloads without canonical URLs.
- Test suite covers only legacy behaviours; observability for zero-hit queries or bulk failures is missing.

## Progress to Date

- Regenerated Elasticsearch mapping templates and setup script so all indices match the definitive schema (including completion contexts, highlight offsets, canonical URL fields, semantic_text fields).
- Expanded runtime env validation (`SEARCH_INDEX_VERSION`, zero-hit webhook, LOG_LEVEL, AI provider checks) with a dedicated unit test suite.
- Prefixed and enriched all SDK search index types (`SearchLessonsIndexDoc`, etc.) so downstream code imports a single, unambiguous set of search-specific interfaces.
- Added schema-derived summary/sequences guards (`isLessonSummary`, `isUnitSummary`, `isSubjectSequences`) and extended the SDK adapter to consume them.
- Added `scripts/check-search-canonical-urls.ts` to verify canonical URL helpers resolve to live teachers-site pages.
- Successfully regenerated the SDK type artifacts (`pnpm type-gen`), producing up-to-date OpenAPI/Zod outputs after the latest schema adjustments.

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

1. ACTION: Update the SDK schema generation (original → SDK) so canonical URLs, lesson-planning data, suggestion payload inputs, and other derived fields surface directly in the SDK; regenerate the SDK artefacts.
2. REVIEW: Verify the regenerated SDK outputs include every required search field; fail fast and fix the generation if anything is missing.
3. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
4. ACTION: Extend the SDK adapter layer so all enriched SDK responses (lesson/unit summaries, sequence data) are passed through unchanged using the new schema-derived guards (canonical URLs, lesson-planning data, suggestion payload contexts, sequence relationships).
5. REVIEW: Self-review adapter outputs to ensure they forward only SDK-provided data without recomputing derived values.
6. GROUNDING: read GO.md and follow all instructions.
7. ACTION: Rebuild the indexing pipeline to emit enriched lesson, unit, rollup, and sequence documents (using the enriched SDK data) with resilient batching/backoff and structured logging.
8. REVIEW: Self-review indexing outputs and bulk logic against the definitive guide requirements.
9. GROUNDING: read GO.md and follow all instructions.
10. ACTION: Redesign the rollup rebuild flow to assemble lesson-planning snippets, populate unit_semantic, attach canonical URLs, and write completion payloads.
11. REVIEW: Self-review rollup generation logic and resulting unit_rollup documents.
12. GROUNDING: read GO.md and follow all instructions.
13. ACTION: Replace client-side fusion with server-side rank.rrf queries for lessons, units, and sequences, including highlights, filters, and facet hooks.
14. REVIEW: Self-review the new ES query bodies to ensure parity with the definitive guide.
15. GROUNDING: read GO.md and follow all instructions.
16. ACTION: Expand structured query/types and API responses (structured + NL) to cover sequences, optional facets, canonical URLs, and enriched result payloads.
17. REVIEW: Self-review API contracts and NL parsing logic for the new scopes and parameters.
18. GROUNDING: read GO.md and follow all instructions.
19. ACTION: Update the OpenAPI generator, `/api/openapi.json`, TypeDoc outputs, and documentation routes so the published contract reflects the expanded endpoints and payloads.
20. REVIEW: Self-review OpenAPI/TypeDoc artefacts and ensure regenerated docs match the definitive guide.
21. GROUNDING: read GO.md and follow all instructions.
22. ACTION: Implement suggestion and type-ahead endpoints plus zero-hit logging and facet toggles consistent with the guide.
23. REVIEW: Self-review the suggestion/type-ahead flows and logging instrumentation.
24. GROUNDING: read GO.md and follow all instructions.
25. ACTION: Strengthen the automated test suite and remove obsolete client-side RRF helpers, covering indexing transforms, query builders, and admin flows.
26. REVIEW: Self-review test coverage and ensure new behaviours are asserted via TDD.
27. GROUNDING: read GO.md and follow all instructions.
28. QUALITY-GATE: Run `pnpm lint` within the workspace and address any violations.
29. REVIEW: Capture lint results and note follow-up actions for any failures.
30. GROUNDING: read GO.md and follow all instructions.
31. QUALITY-GATE: Run `pnpm test` (including relevant integration/unit suites) and resolve failures.
32. REVIEW: Summarise test outcomes and required fixes.
33. GROUNDING: read GO.md and follow all instructions.
34. QUALITY-GATE: Run `pnpm build` (or equivalent pipeline) to ensure production readiness.
35. REVIEW: Confirm build output and log any remediation steps.
36. GROUNDING: read GO.md and follow all instructions.
37. QUALITY-GATE: Run `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen` to refresh OpenAPI/TypeDoc artefacts.
38. REVIEW: Document doc-gen results and address discrepancies.
39. GROUNDING: read GO.md and follow all instructions.
40. ACTION: Compile a final self-review summarising completed milestones, outstanding risks, and recommended follow-up actions.
41. REVIEW: Record/share the summary to preserve continuity.
