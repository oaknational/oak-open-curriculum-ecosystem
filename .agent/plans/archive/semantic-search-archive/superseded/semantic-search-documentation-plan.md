# Semantic Search Documentation & Onboarding Plan

Role: Define the documentation work required to keep the semantic search workspace authoritative and aligned with the definitive architecture in `semantic-search-target-alignment-plan.md`. This covers authored Markdown, README content, TypeDoc/OpenAPI artefacts, onboarding flows, and operational runbooks.

Document relationships

- API implementation plan: `semantic-search-api-plan.md`
- UI plan: `semantic-search-ui-plan.md`
- Caching/runtime plan: `semantic-search-caching-plan.md`
- Context document: `semantic-search-api-context.md`
- Alignment roadmap: `semantic-search-alignment-refresh-plan.md`
- Archived reference: `archive/semantic-search-service-plan.md`

---

## Scope

- All authored documents under `apps/oak-open-curriculum-semantic-search/docs/` (excluding generated `docs/api/**`).
- Workspace README (`apps/oak-open-curriculum-semantic-search/README.md`).
- Cross-workspace onboarding references (root README as needed) and MCP tooling notes.
- Documentation updates triggered by API surface changes (structured/NL search, suggestions, admin/status, observability).

Out of scope: code implementation itself (covered by other plans), but every code change that affects APIs or behaviour must be reflected here.

---

## Objectives

1. Teach the definitive four-index architecture, enriched documents, canonical URLs, and server-side RRF queries.
2. Document environment setup covering `OAK_API_KEY`/`OAK_API_BEARER`, `SEARCH_INDEX_VERSION`, observability settings, and quality gate expectations.
3. Provide operational guidance for resilient ingestion, rollup rebuild, cache/tag invalidation, zero-hit logging, and suggestion endpoints.
4. Maintain zero-warning TypeDoc/OpenAPI generation and ensure authored docs stay synchronised with generated contracts.
5. Deliver onboarding that gets a new contributor from clone → indexed → verified queries (structured, NL, suggestions) in ≤15 minutes following GO.md cadence.

---

## Current status

- Existing docs pre-date the alignment plan: sequences, suggestion endpoints, observability, and index versioning are missing or outdated.
- Workspace README lists only legacy endpoints and lacks quality gate instructions.
- TypeDoc and doc-gen pipelines run, but curated content needs refreshing post-alignment.
- MCP documentation for semantic search tools/resources is minimal and does not reflect the expanded API.

---

## Deliverables

1. **ARCHITECTURE.md** – Update diagrams and prose to cover four indices, enriched mappings (completion contexts, canonical URLs, lesson-planning data arrays), server-side RRF, suggestion endpoints, and observability hooks.
2. **SETUP.md** – Document full environment matrix (`ELASTICSEARCH_*`, `OAK_API_*`, `SEARCH_API_KEY`, `SEARCH_INDEX_VERSION`, observability endpoints, AI provider options), alignment-era setup scripts, and post-setup quality gates.
3. **INDEXING.md** – Describe resilient batching, retry/backoff strategy, canonical URLs, semantic_text payloads, suggestion payload generation, alias management, and logging expectations.
4. **ROLLUP.md** – Explain enriched snippet selection, lesson-planning metadata, canonical URL inclusion, semantic copy, and cache/tag invalidation after rebuilds.
5. **QUERYING.md** – Provide canonical JSON bodies for lessons/units/sequences RRF queries, facets, highlights, suggestions/type-ahead, and document zero-hit instrumentation.
6. **SDK-ENDPOINTS.md** – Clarify parity routes, data returned (including canonical URLs), and how they support regression checks vs enriched indices.
7. **docs/README.md** – Signpost all refreshed docs, explain authored vs generated outputs, and outline documentation quality gates.
8. **Workspace README** – Present expanded endpoint list (structured/NL/suggest/status/admin), quick start aligned with alignment plan, observability checklist, and quality gates.
9. **MCP documentation** – Summarise available tools/resources/prompts, tie them to OpenAPI, and note authentication requirements.
10. **TypeDoc/OpenAPI validation** – Ensure doc generation scripts run without warnings; record outcomes in review log.

---

## Tasks (follow GO.md cadence)

1. ACTION: Inventory doc updates implied by each alignment workstream (mappings, env, ingestion, queries, suggestions, observability).  
   REVIEW: Self-review inventory; ensure every deliverable above has coverage.
2. GROUNDING: Read GO.md.
3. ACTION: Update ARCHITECTURE.md, SETUP.md, and docs/README.md.  
   REVIEW: Confirm alignment with target plan and British spelling.
4. ACTION: Refresh INDEXING.md, ROLLUP.md, QUERYING.md to cover resilient ingestion, snippets, RRF, facets, suggestions, and logging.  
   REVIEW: Verify examples/tests align with API plan.
5. GROUNDING: Read GO.md.
6. ACTION: Update SDK-ENDPOINTS.md and MCP documentation to reference enriched payloads and authentication, signalling regression uses.  
   REVIEW: Check parity routes description and MCP linkage.
7. ACTION: Revise workspace README with expanded endpoints, quick start, observability, and quality gates.  
   REVIEW: Ensure onboarding flow meets ≤15 minute goal.
8. GROUNDING: Read GO.md.
9. QUALITY-GATE: Run `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen` and `pnpm qg` after documentation changes.  
   REVIEW: Capture outcomes; remediate failures immediately.

_(Insert additional ACTION/REVIEW/GROUNDING pairs if documentation scope grows.)_

---

## Acceptance criteria

- All authored docs and README reflect the definitive architecture, enriched data, suggestion endpoints, zero-hit logging, and operational guardrails.
- Environment and onboarding guides include full variable matrix, index version tagging, observability instructions, and quality gate reminders.
- Documentation changes are executed via GO.md cadence with self-reviews recorded in the alignment refresh plan.
- TypeDoc/doc-gen runs finish with zero warnings; outputs align with updated prose.
- MCP tooling docs reference generated OpenAPI artefacts and clarify authentication constraints.

---

## References

- `.agent/directives/rules.md`
- `.agent/directives/testing-strategy.md`
- `.agent/plans/semantic-search/semantic-search-target-alignment-plan.md`
- `.agent/plans/semantic-search/semantic-search-api-plan.md`
- `.agent/plans/semantic-search/semantic-search-alignment-refresh-plan.md`
- `apps/oak-open-curriculum-semantic-search/docs/oak-curriculum-hybrid-search-definitive-guide.md`
