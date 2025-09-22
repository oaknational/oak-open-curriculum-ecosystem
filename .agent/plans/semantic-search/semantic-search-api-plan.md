# Semantic Search API Plan (Service mechanics, OpenAPI, MCP)

Role: Define and sequence the back-end work required to deliver the definitive semantic search architecture. This plan governs Elasticsearch mappings, ingestion, query execution, API routes, OpenAPI/MCP surfacing, observability, and regression coverage. It must always reflect `.agent/plans/semantic-search/semantic-search-target-alignment-plan.md` and follow the GO.md cadence (ACTION → REVIEW with self-review).

Document relationships

- Target alignment blueprint: `semantic-search-target-alignment-plan.md`
- UI plan: `semantic-search-ui-plan.md`
- Documentation & onboarding plan: `semantic-search-documentation-plan.md`
- Caching plan: `semantic-search-caching-plan.md`
- Context document: `semantic-search-api-context.md`
- Archived source: `archive/semantic-search-service-plan.md`

---

## Scope

- Deliver the four-index Elasticsearch Serverless topology (`oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_sequences`) with enriched mappings (synonyms, completion contexts, semantic_text, canonical URLs, teacher metadata, highlight offsets).
- Provide resilient ingestion (lessons/units/sequences, rollup rebuild) driven by the Oak Curriculum SDK with batching, retries, and deterministic payloads.
- Implement server-side RRF query builders for lessons, units, and sequences, optional facets, structured highlights, and deterministic formatting.
- Expose public APIs: `POST /api/search`, `POST /api/search/nl`, `POST /api/search/suggest` (or equivalent), plus admin/status endpoints guarded by `SEARCH_API_KEY`.
- Maintain OpenAPI schema, MCP tools/resources/prompts, and regression coverage aligned with repository rules and testing strategy.

Out of scope: UI rendering, front-end caching, and SDK type generation (handled in their respective plans) — but API changes must signal the dependencies.

---

## Objectives

1. Regenerate Elasticsearch settings/mappings per definitive guide, including the `oak_sequences` index and completion contexts.
2. Extend environment validation to support both `OAK_API_KEY` and `OAK_API_BEARER`, index version tagging, observability targets, and AI provider selection.
3. Rebuild ingestion/rollup flows for resilient bulk indexing with enriched payloads and canonical URLs.
4. Replace legacy client-side fusion with server-side RRF queries for all scopes; add facets and highlight handling consistent with mappings.
5. Add suggestion/type-ahead endpoints plus zero-hit logging, bulk error telemetry, and progress status APIs.
6. Refresh OpenAPI, MCP tooling, documentation hooks, and regression tests; remove obsolete helpers.
7. Enforce GO.md workflow, TDD per `docs/agent-guidance/testing-strategy.md`, and repository rules throughout execution.

---

## Alignment Status

### Foundations already in place

- Next.js API routes exist for structured/NL search, indexing, rollup rebuild, and SDK parity.
- Baseline Elasticsearch setup scripts create synonyms, analysers, and the original three indices.
- Initial hybrid search (lessons/units) implemented with BM25 + semantic fusion.
- Quality gates pass on the pre-alignment branch.

### Gaps to close

- Mappings/settings are missing completion contexts, highlight offsets, and `oak_sequences` definitions.
- Environment validation lacks `OAK_API_BEARER`, index versioning, observability config, and AI provider safeguards.
- Ingestion pipeline does not emit enriched metadata, canonical URLs, or semantic payloads for sequences, nor does it provide resilient batching/backoff.
- Rollup rebuild omits teacher-centric snippets and canonical URLs, and does not trigger cache/tag invalidation.
- Query builders still rely on client-side fusion; sequences scope is absent; facets/highlights/filters need parity with the definitive guide.
- Suggestion/type-ahead endpoints and status telemetry do not exist; zero-hit logging is absent.
- OpenAPI/MCP artefacts, docs, and tests are stale relative to the target architecture.

### Risks & mitigation pointers

- **SDK coverage**: If enriched data is missing upstream, raise issues immediately; do not implement workarounds that violate the Cardinal Rule.
- **Elasticsearch limits**: Validate `semantic_text` support in Serverless tier before rollout; monitor mapping changes with aliases.
- **Operational cost**: Resilient ingestion must avoid repeated full reindexing; structure tasks to allow incremental reruns.

---

## Workstreams

1. **Elasticsearch configuration**
   - Update `scripts/elastic-setup` and related templates for four indices, synonyms, analysers, normalisers, highlight offsets, completion contexts.
   - Add integration tests (where feasible) or contract assertions to ensure mappings match the definitive guide.

2. **Environment validation & SDK adapters**
   - Enhance `src/lib/env.ts` to validate API credentials, index version tag, logging targets, and AI provider.
   - Update SDK adapters to surface teacher metadata, canonical URLs, sequences, and provenance fields. Tests must cover validation and adapter transformations.

3. **Ingestion & rollup pipeline**
   - Rebuild `index-oak` orchestration with resilient batching (≈250 docs), exponential backoff, progress logging, and resume capability.
   - Emit enriched lesson/unit/sequence documents, semantic_text payloads, completion inputs, canonical URLs, and teacher metadata arrays.
   - Redesign rollup generation (snippets, canonical URLs, semantic copy); trigger cache/tag invalidation and alias swaps.

4. **Server-side query builders**
   - Implement RRF builders for lessons, units, sequences with lexical + semantic clauses, filters, facets, and highlights per definitive guide.
   - Refactor `POST /api/search` and `POST /api/search/nl` to use the shared builders; remove client-side fusion helpers; ensure NL route deterministically maps to structured payloads.
   - Add deterministic caching/versioning keyed by `SEARCH_INDEX_VERSION` (see caching plan).

5. **Suggestion & status endpoints**
   - Implement `POST /api/search/suggest` (or equivalent) for completion/context results and `POST /api/search/typeahead` if required for `search_as_you_type`.
   - Add `/api/index-oak/status` (or similar) returning processed counts, last batch, errors, and current index version.
   - Instrument zero-hit logging and bulk-error telemetry via structured logger/webhook.

6. **Contracts, docs, MCP**
   - Regenerate OpenAPI schemas (non-admin endpoints only) and ensure `/api/openapi.json` + `/api/docs` stay in sync.
   - Update MCP tool/resource/prompt generation to include new surfaces and exclude guarded endpoints by default.
   - Coordinate with documentation plan to refresh authored docs and README.

7. **Regression coverage & quality gates**
   - Add unit tests for env validation, ingestion transforms, query builders, and suggestion handlers.
   - Add integration tests (Vitest with fixtures or ES test doubles) for RRF payloads and ingestion retry logic.
   - Ensure `pnpm format`, `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm build`, and workspace `doc-gen` run cleanly; record outcomes in review log per GO.md.

---

## Implementation Plan (GO cadence aligned)

Each `ACTION:` below must be performed using TDD wherever code is involved, followed immediately by a self-review (`REVIEW:`). Every third task is the GO grounding step.

1. **ACTION**: Refresh Elasticsearch setup scripts and mappings/templates to match the definitive guide (four indices, analysers, normalisers, completion contexts, highlight offsets).  
   **REVIEW**: Compare generated mappings against the guide; confirm scripts satisfy repository rules (no hard-coded secrets, British spelling in comments).
2. **GROUNDING**: Read GO.md and reaffirm ACTION/REVIEW cadence, referencing `.agent/directives-and-memory/rules.md` and `docs/agent-guidance/testing-strategy.md`.
3. **ACTION**: Extend `src/lib/env.ts` and related tests to cover `OAK_API_KEY`/`OAK_API_BEARER`, `SEARCH_INDEX_VERSION`, observability config, and AI provider safeguards.  
   **REVIEW**: Run relevant unit tests; confirm validation rejects invalid combinations and follows rules.
4. **ACTION**: Update SDK adapters and types to surface canonical URLs, teacher metadata, sequences.  
   **REVIEW**: Self-review adapters against SDK outputs and definitive guide requirements.
5. **GROUNDING**: Read GO.md.
6. **ACTION**: Rebuild ingestion pipeline (lessons/units/sequences) with resilient batching/backoff, enriched payloads, and structured logging.  
   **REVIEW**: Validate against fixtures; log decisions in Review Log; ensure retries and idempotency are covered by tests.
7. **ACTION**: Redesign rollup generation (snippets, canonical URLs, semantic copy) and alias/tag invalidation path.  
   **REVIEW**: Confirm snippet quality, highlight readiness, and cache invalidation steps.
8. **GROUNDING**: Read GO.md.
9. **ACTION**: Implement server-side RRF builders for lessons, units, sequences and refactor `/api/search`.  
   **REVIEW**: Verify queries match the definitive guide; run tests for filters, facets, and highlights.
10. **ACTION**: Update `/api/search/nl` to transform NL queries deterministically and reuse structured path; ensure graceful fallback when LLM disabled.  
    **REVIEW**: Confirm behaviour with tests (LLM enabled/disabled) and document in README/docs.
11. **GROUNDING**: Read GO.md.
12. **ACTION**: Add suggestion/type-ahead endpoint(s) and admin status route with zero-hit logging instrumentation.  
    **REVIEW**: Check responses, contexts, logging; tests assert telemetry triggers.
13. **ACTION**: Regenerate OpenAPI schema, refresh MCP tooling, and update API docs/README references.  
    **REVIEW**: Ensure generated artefacts match code; document any manual follow-up.
14. **GROUNDING**: Read GO.md.
15. **ACTION**: Expand regression test suite (unit/integration) and remove obsolete client-side fusion helpers.  
    **REVIEW**: Run `pnpm test`; capture results; ensure dead code removed.
16. **QUALITY-GATE**: Run `pnpm format`, `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`.  
    **REVIEW**: Record outcomes and remediate failures immediately.

_(Additional GO grounding steps or ACTION/REVIEW pairs should be inserted as needed for sub-tasks; the numbering above provides the minimal backbone.)_

---

## Acceptance Criteria

- Elasticsearch Serverless hosts four indices with mappings/settings identical to the definitive guide.
- Environment validation enforces credentials, index versioning, logging, and AI provider safety, with comprehensive tests.
- Ingestion pipeline produces enriched, canonical, teacher-focused documents with resilient retries, logging, and alias management.
- Rollup rebuild emits high-quality snippets, copies to semantic fields, and triggers cache/tag invalidation.
- `/api/search` executes server-side RRF queries for lessons, units, sequences; `/api/search/nl` reuses the structured path; suggestion/type-ahead and status endpoints function as specified.
- Zero-hit logging and bulk error telemetry operational; admin status reports progress and failures.
- OpenAPI, MCP tooling, README, and authored docs reflect the new surfaces; TypeDoc/OpenAPI generation runs without warnings.
- Regression tests cover env validation, ingestion transforms, query builders, suggestions, and observability logic; obsolete helpers removed.
- All quality gates pass; outcomes documented via GO.md review log.

---

## References

- `.agent/directives-and-memory/rules.md`
- `docs/agent-guidance/testing-strategy.md`
- `.agent/plans/semantic-search/semantic-search-target-alignment-plan.md`
- `.agent/plans/semantic-search/semantic-search-alignment-refresh-plan.md`
- `apps/oak-open-curriculum-semantic-search/docs/oak-curriculum-hybrid-search-definitive-guide.md`
- Elasticsearch Serverless documentation on `semantic_text`, completion, and rank fusion.
