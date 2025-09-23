# Semantic Search Index Enhancements Plan

## Intent

Establish a structured roadmap for augmenting the semantic search stack with additional Elasticsearch Serverless indices, rollups, and supporting constructs that take advantage of the `semantic_text` hybrid search capabilities while staying compatible with the official Elasticsearch TypeScript SDK.

## Context and References

- Elastic Cloud Serverless deployment model: ensure data tiers, inference endpoints, and scaling policies align with index additions (<https://www.elastic.co/docs/deploy-manage/deploy/elastic-cloud/serverless>).
- Hybrid search with `semantic_text`: follow Elastic guidance for index mappings, inference field definitions, and reciprocal rank fusion (RRF) query patterns (<https://www.elastic.co/docs/solutions/search/hybrid-semantic-text>).
- Official Elasticsearch TypeScript SDK: use typed clients for ingestion pipeline, inference calls, and query orchestration (<https://www.npmjs.com/package/@elastic/elasticsearch>).
- Curriculum ontology and MCP tooling analysis: apply entity definitions, canonicalisation rules, provenance chains, and metadata categories captured in `docs/architecture/curriculum-ontology.md` and `.agent/plans/curriculum-tools-guidance-playbooks-plan.md`. Note that the mcp tooling plan has not been carried out, but the analysis and ontology are complete.

## Proposed Indices and Rollups

1. **Lesson Planning Rollup (`oak_lesson_planning`)**
   - Denormalise units → lessons to include key learning points, misconceptions, teacher tips, prior knowledge, and canonical URLs.
   - Store both lexical text and `semantic_text` embeddings to prioritise lesson relevance while keeping highlight payloads tight.
   - Preserve provenance metadata (`subjectSlug`, `sequenceSlug`, `unitSlug`, `lessonSlug`, canonical URLs) and accessibility guidance to match MCP requirements.

2. **Transcript Index (`oak_lesson_transcripts`)**
   - Capture VTT transcript segments with timing metadata and link to lesson IDs for precise snippet retrieval.
   - Configure inference to favour long-form embeddings; use pipeline transforms to chunk transcripts where necessary.
   - Support hybrid queries that blend transcript semantic matches with main lesson RRF scores.

3. **Guidance & Sensitivity Rollup (`oak_content_guidance`)**
   - Index content guidance areas, supervision levels, safeguarding tags, and accessibility notices per lesson.
   - Surface structured filters and zero-hit diagnostics; precompute facet counts keyed by ontology enumerations.

4. **Assets and Resources Index (`oak_assets`)**
   - Index downloadable/viewable resources with attribution, asset type, accessibility format, and optional transcript summaries.
   - Add completion contexts for suggestion endpoints (e.g., resource type, key stage, accessibility features).

5. **Assessment Index (`oak_assessments`)**
   - Embed quiz question stems, answers (with distractor flags), and targeted learning objectives.
   - Support queries like “find assessments similar to…” and future MCP commands for assessment discovery.

6. **Sequence / Facet Rollup (`oak_sequence_facets`)**
   - Maintain condensed hierarchy data (subject → sequence → unit → lesson counts, key stage/year coverage).
   - Provide rapid facet lookups and suggestion payload seeds without hitting primary indices.

7. **Ontology Metadata Index (`oak_ontology_static`)**
   - Store entity labels, schema references, path recipes, and canonicalisation rules.
   - Allow search responses to include consistent `ontology` sections immediately, easing MCP integration later.

## Implementation Guidance

- **Mappings and Pipelines**: Define index templates with `semantic_text` fields, lexical analyzers, completion contexts, and provenance keyword fields; reuse shared ingestion pipeline that calls Elastic inference APIs via the TypeScript SDK.
- **Chunking Strategy**: Apply consistent chunking (length, overlap, heuristics) for transcripts and long-form planning text so embeddings remain high quality and RRF scoring remains balanced.
- **Provenance & Metadata**: Enforce ontology-driven IDs (`Lesson:slug`, `Unit:slug`, etc.) and include MCP metadata placeholders (`ontology.nodesReturned`, `provenanceRequired`) in stored documents.
- **Testing & Observability**: Extend ingestion tests to cover new pipeline features, add health checks for inference latency, and capture metrics/alerts for index growth, shard pressure, and zero-hit causes.
- **Versioning**: Tie index names to `SEARCH_INDEX_VERSION` when rolling out breaking mapping changes; document migration steps in `apps/oak-open-curriculum-semantic-search/docs`.

## Integration with Existing Plans and Docs

- **Update `.agent/plans/semantic-search/semantic-search-target-alignment-plan.md`**
  - Add actions covering the creation of the new indices, shared ingestion pipeline, and RRF query updates to blend the additional scopes.
  - Extend quality gates to include template validation and ingestion dry-runs for each new index.
  - Reference ontology-driven metadata requirements, ensuring provenance and accessibility data remain first-class in all responses.

- **Coordinate with other search plans**
  - Cross-link ingestion milestones and hybrid query adjustments so rollups launch alongside API/Kibana dashboards.
  - Align suggestion/type-ahead tasks with the new completion contexts and sequence facet rollup.

- **Documentation updates in `apps/oak-open-curriculum-semantic-search/docs/`**
  - Add/update references describing each index: purpose, mappings, example documents, and query recipes (lexical + semantic + RRF weighting).
  - Document inference pipeline configuration, chunking strategy, and failure handling, including how to regenerate embeddings after ontology or content updates.
  - Publish guidance on integrating MCP metadata blocks within search responses, referencing the ontology index.

## Suggested Next Steps

1. Review storage and cost implications on Elastic Cloud Serverless for the proposed indices; adjust shard counts and ILM policies accordingly.
2. Draft additions to the semantic search target alignment plan reflecting new indices, pipeline work, and documentation deliverables.
