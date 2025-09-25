# Semantic Search Phase 2 & 3 Roadmap

All follow-on phases inherit the ontology definitions from `docs/architecture/curriculum-ontology.md` (node IDs, relationships, schema references, provenance) and reuse the definitive hybrid query practices established in Phase 1.

## Phase 2 – Content Depth Expansion

Objective: enrich search with pedagogical context, resources, and optional prior knowledge signals, demonstrating the full power of `semantic_text` indices.

- **Indices**
  - `oak_lesson_planning`: denormalised lesson/unit planning metadata (key learning points, misconceptions, teacher tips, accessibility notes, canonical URLs) with semantic embeddings.
  - `oak_lesson_transcripts`: chunked transcripts with timing metadata and long-form embeddings.
  - `oak_content_guidance`: safeguarding tags, supervision levels, accessibility notices, prior knowledge relationships. Add prior knowledge (`priorKnowledgeRequirements`) and National Curriculum (`nationalCurriculumContent`) filters/boosting once ingestion proves reliable.
  - `oak_assets`: downloadable/viewable resources with attribution, asset type, accessibility metadata, and completion contexts for suggestions.
  - `oak_assessments`: quiz stem/distractor/objective data for assessment discovery.
- **Features**
  - Augment search responses with optional blocks (planning snippets, transcript excerpts, guidance highlights, resource suggestions) behind feature flags.
  - Extend filters to include safeguarding/accessibility categories; evaluate prior knowledge graph traversal.
  - UI surfaces richer content cards, Oak Component tabs, and contextual guidance callouts with responsive layouts and a11y coverage.
- **Ingestion**
  - Design inference-aware pipelines per index: chunking heuristics, embedding jobs, nightly delta strategies, logging of ontology node IDs.
  - Establish cost monitoring (Elastic inference + storage) and alerting.
- **Documentation**
  - Publish index specs (mappings, chunking strategy, example docs) and query recipes in `apps/oak-open-curriculum-semantic-search/docs/`.
- **Exit Criteria**
  - Planning/transcript/resource indices populated with validated documents and passing ingestion regression tests.
  - Feature-flagged UI sections expose extended content cards without performance regressions.
  - Observability captures ingestion cost/latency metrics and alerts on anomalies.

## Phase 3 – Ontology & Observability Showcase

Objective: surface ontology metadata end-to-end, power advanced suggestions, and deliver observability artefacts that highlight system capabilities.

- **Indices**
  - `oak_ontology_static`: curated ontology metadata (entities, relationships, schema refs) for fast lookup by search responses and MCP tooling.
- **Features**
  - Search results embed `_nodeId`, `_nodeType`, `_schemaRefs`, `_ontologyRefs`, `_provenance` for each hit.
  - Suggestion/type-ahead endpoints span all indices, leveraging completion contexts and facet rollups.
  - Zero-hit webhooks emit ontology-rich payloads; dashboards display zero-hit trends by ontology node.
  - Admin UI presents ontology drill-downs, zero-hit dashboards, and observability widgets sourced from telemetry endpoints.
- **Tooling & Documentation**
  - Provide MCP resources (`mcp://oak/ontology/v1.json`, JSON-LD/Mermaid exports) and update docs with observability walkthroughs.
- **Exit Criteria**
  - Ontology metadata appears in search responses and MCP resources validated by contract tests.
  - Suggestion endpoints leverage ontology indices with proven zero-hit recovery flows.
  - Admin observability UI surfaces dashboards meeting Success Metrics thresholds.

## Implementation Guidance (all phases)

- **Mappings & Pipelines**: define index templates with `semantic_text` fields, lexical analysers, completion contexts, and provenance keywords; reuse the Elasticsearch TypeScript SDK for all ingestion and inference calls.
- **Chunking Strategy**: keep chunk length/overlap consistent for transcripts and planning text so embeddings remain high-quality and RRF weighting stable.
- **Provenance & Ontology Metadata**: enforce ontology-driven identifiers (`Lesson:slug`, etc.) and include MCP metadata placeholders (`ontology.nodesReturned`, `schemaRefs`, `provenanceRequired`) in both stored docs and API responses.
- **Testing & Observability**: add ingestion unit/integration tests, monitor inference latency and shard usage, and maintain zero-hit diagnostics.
- **Versioning**: tie index rollouts to `SEARCH_INDEX_VERSION`, documenting alias swap procedures and rollback steps.

### Typography Enhancements (themes backlog)

| Element                  | Typeface                                             | Weight                     | Size (Desktop) | Size (Mobile) | Line Height |
| ------------------------ | ---------------------------------------------------- | -------------------------- | -------------- | ------------- | ----------- |
| H1 (Hero headline)       | Lexend                                               | Bold                       | 48–56 px       | 32–36 px      | 1.1–1.2     |
| H2 (Section heading)     | Lexend                                               | SemiBold                   | 32 px          | 24 px         | 1.25        |
| H3 (Subheading)          | Lexend                                               | Medium                     | 24 px          | 20 px         | 1.3         |
| Body / Paragraph         | Lexend                                               | Regular                    | 18 px          | 16 px         | 1.5–1.6     |
| Small / UI / Captions    | Lexend                                               | Regular                    | 14–16 px       | 14 px         | 1.4         |
| Hero strapline / tagline | Secondary display face (e.g. Work Sans, Public Sans) | Regular / Medium           | 20–22 px       | 18 px         | 1.4–1.5     |
| Pull quotes / highlights | Secondary display face                               | Bold Italic (if available) | 22–24 px       | 18–20 px      | 1.4         |

Notes:

- Lexend remains the backbone for headings, body copy, and UI elements to preserve brand readability.
- Secondary display faces are reserved for straplines, pull quotes, and highlights to add personality without diluting recognition.
- Weight and size scaling should reinforce hierarchy (dominant H1, structured H2, readable body text).
- Line heights stay tight on large headers (≈1.1–1.2) and generous for copy (≈1.5–1.6) to optimise legibility.
