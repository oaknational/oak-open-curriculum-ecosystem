# Semantic Search Target Alignment Plan

## Intent

Deliver the hybrid search app so that it matches the definitive architecture: server-side RRF queries over enriched Elasticsearch Serverless indices, fully populated via the SDK with canonical URLs and teacher-centric metadata, plus the supporting admin flows, suggestion endpoints, and observability.

## Current State Summary

- Elasticsearch setup scripts lack the required analysers, normalisers, completion contexts, highlight offsets, and the `oak_sequences` index. Mappings omit key fields (`title_suggest`, URLs, unit_topics, etc.).
- Environment handling only supports `OAK_API_KEY`; SDK adapters expose limited data (no sequences, no teacher metadata, no canonical URLs).
- Indexing pipeline generates minimal documents (no semantic_text payloads, no metadata arrays, no completion data) and offers no batching/backoff strategy aligned with production needs.
- Rollup rebuild pulls lesson transcripts directly, truncates naively, and omits semantic fields, URLs, and suggestion payloads.
- Search logic issues multiple requests per scope and fuses results client-side via custom RRF; it ignores teacher metadata, does not return facets, and has no sequences support.
- API surface (structured + NL) exposes only lessons/units, lacks facet toggles, no suggestion/type-ahead endpoints, and returns sparse payloads without canonical URLs.
- Test suite covers only legacy behaviours; observability for zero-hit queries or bulk failures is missing.

## Target Outcomes

1. Single-request, server-side RRF searches for lessons, units, and sequences that honour the definitive query bodies (lexical + semantic, highlights, filters, optional facets).
2. Elasticsearch indices constructed by scripts that match the documented settings, including synonyms, analysers, completion contexts, and highlight limits.
3. Robust indexing & rollup flows that ingest enriched SDK data (teacher metadata, canonical URLs, snippets) and populate all required fields, including suggestion payloads and semantic text inputs.
4. API routes (structured, NL, suggestion/type-ahead, admin) that expose the new scopes safely, validate via generated types, and emit the enriched responses.
5. Comprehensive tests and logging to detect bulk/indexing errors, zero-hit searches, and ensure regression coverage for new behaviours.

## Risks & Considerations

- SDK must already expose the necessary teacher metadata and canonical URLs; otherwise we need upstream changes.
- Server-side RRF requires Elasticsearch Serverless tier that supports `semantic_text` and rank fusion; verify cluster version/features before rollout.
- Expanded documents increase payload size; monitor ES indexing throughput and query latency during rollout.
- Quality gates may surface latent issues in unrelated workspaces due to shared SDK changes; coordinate with owning teams.

## Todo List

1. ACTION: Update Elasticsearch setup and mappings to match the definitive guide (oak_text analyser, oak_lower normaliser, highlight offsets, completion contexts, new oak_sequences index).
2. REVIEW: Self-review mapping and setup changes against the definitive guide before coding continues.
3. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
4. ACTION: Extend env validation and SDK adapter to handle OAK_API_KEY/OAK_API_BEARER and expose enriched curriculum data (teacher metadata, canonical URLs, sequences).
5. REVIEW: Self-review env and adapter updates for completeness and alignment with generated SDK types.
6. GROUNDING: read GO.md and follow all instructions.
7. ACTION: Rebuild the indexing pipeline to emit enriched lesson, unit, rollup stub, and sequence documents (including semantic_text payloads, metadata arrays, suggestion inputs, canonical URLs) with resilient bulk batching.
8. REVIEW: Self-review indexing outputs and bulk logic against the definitive guide requirements.
9. GROUNDING: read GO.md and follow all instructions.
10. ACTION: Redesign the rollup rebuild flow to assemble teacher-focused snippets, populate unit_semantic, attach URLs, and write completion payloads.
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
