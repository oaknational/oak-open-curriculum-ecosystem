# Semantic Search Plans

Navigation hub for all semantic search planning documentation.

## Current Priority

**Ready for Next Phase** - All blocking issues resolved!

### Recently Resolved ✅ (2025-12-06)

1. ✅ **Type System Architecture** - Eliminated all `Record<string, unknown>` using official ES client types
2. ✅ **Quality Gates** - All 10 gates passing (type-gen → smoke:dev:stub)
3. ✅ **ES Type Safety** - Replaced ad-hoc ES types with `@elastic/elasticsearch` estypes
4. ✅ **Code Quality** - Reduced complexity (createErrorFromException 17→8, runIngestion 62→50 lines)
5. ✅ **Build System** - Fixed all build issues, 1,303+ tests passing
6. ✅ **Generator Drift** - Generators now properly emit per-index completion schemas
7. ✅ **Type Safety** - 19 lint errors fixed, no type shortcuts, complexity ≤8
8. ✅ **CLI Enhancement** - Added `--index` filter for selective ingestion
9. ✅ **Deprecated Exports** - Removed `SearchCompletionSuggestPayload*` compatibility layer
10. ✅ **Forbidden eslint-disable** - All removed, quality gates passing
11. ✅ **Smoke Test UX** - Enhanced port conflict error messages
12. ✅ **Zod/ES Mapping Mismatch** - Unified field definitions architecture
13. ✅ **Console Usage** - Replaced with `@oaknational/mcp-logger`
14. ✅ **Verbose Flag** - Controls logger level (DEBUG/INFO)

### Elasticsearch State (Verified 2025-12-06)

| Index             | Docs | Notes                         |
| ----------------- | ---- | ----------------------------- |
| `oak_unit_rollup` | 105  | Maths KS1 data                |
| `oak_units`       | 37   | Unit metadata                 |
| `oak_lessons`     | 0    | Failed with mapping exception |

**142 documents indexed** - unit-level ingestion succeeded, lesson ingestion failed.

### Next Steps

**All blocking issues resolved!** Choose your path:

1. **Resume Full Ingestion** - Reset and re-ingest with fixed completion contexts
2. **Selective Ingestion** - Use `--index lessons` to re-ingest only lessons
3. **Continue Roadmap** - Move to next phase (reference indices, ontology integration)

For continuation work, use:

- **Continuation Prompt**: `.agent/prompts/semantic-search/semantic-search.prompt.md`
- **Discovery Analysis**: `.agent/analysis/semantic-search-compliance-and-ingestion-discovery.md`
- **Phase Roadmap**: `.agent/plans/semantic-search/semantic-search-overview.md`

---

## Overview

The semantic search system provides powerful search capabilities across Oak's curriculum data, integrating with Elasticsearch Serverless for hybrid search (semantic + lexical), faceted navigation, and intelligent suggestions.

---

## Status Summary

| Phase                        | Status      | Notes                                                 |
| ---------------------------- | ----------- | ----------------------------------------------------- |
| Schema-First Migration       | ✅ COMPLETE | All schemas generated via `pnpm type-gen`             |
| Thread Schema Generation     | ✅ COMPLETE | Thread index and embedded fields in SDK               |
| SDK Synonym Export           | ✅ COMPLETE | 68 rules deployed to ES as `oak-syns`                 |
| ES Serverless Deployment     | ✅ COMPLETE | Indexes created, mappings verified, ELSER configured  |
| SDK Response Caching         | ✅ COMPLETE | Redis caching with 404 fallbacks, 100% hit rate       |
| **Zod/ES Mapping Alignment** | ✅ COMPLETE | Unified field definitions architecture implemented    |
| **Logging Standardisation**  | ✅ COMPLETE | Console replaced with `@oaknational/mcp-logger`       |
| **Verbose Flag**             | ✅ COMPLETE | `--verbose` controls logger level (DEBUG/INFO)        |
| **Generator Drift Fix**      | ✅ COMPLETE | Per-index completion schemas, deprecated exports gone |
| **Type Safety Cleanup**      | ✅ COMPLETE | 19 lint errors fixed, no type shortcuts, complexity≤8 |
| **CLI --index Filter**       | ✅ COMPLETE | Selective ingestion by index kind (e.g., lessons)     |
| **ES Type Architecture**     | ✅ COMPLETE | Official @elastic/elasticsearch estypes throughout    |
| **Quality Gates**            | ✅ PASSING  | All 10 gates green (1,303+ tests), ready for next    |
| Real Data Ingestion          | ⏳ READY    | 142 docs indexed; ready to re-ingest with fixes       |
| Reference Indices            | ⏳ PLANNED  | Phase 3 - subjects, key stages, years (see plan)      |
| Ontology Integration         | ⏳ PENDING  | Phase 2-3 - after data validation                     |
| Static Ontology Index (RAG)  | ⏳ PLANNED  | Phase 4 - `oak_ontology` from ontology + KG data      |
| Instance Knowledge Graph     | ⏳ PLANNED  | Phase 5 - `oak_curriculum_graph` + `oak_entities`     |
| Graph RAG                    | ⏳ PLANNED  | Phase 6 - multi-hop reasoning combining graph + RAG   |
| MCP Connectivity             | ⏳ PENDING  | Phase 7 - enhanced search with graph modes            |
| OpenAI App Widget            | ⏳ PENDING  | Phase 8 - with graph visualisations                   |

---

## Elasticsearch Serverless Details

### Deployment

- **Kibana**: <https://poc-open-curriculum-api-search-dd21a1.kb.europe-west1.gcp.elastic.cloud>
- **Cluster**: `poc-open-curriculum-api-search-dd21a1.es.europe-west1.gcp.elastic.cloud:443`
- **Region**: GCP europe-west1

### Inference Endpoints (Auto-Configured)

| Endpoint                               | Type             | Notes                                       |
| -------------------------------------- | ---------------- | ------------------------------------------- |
| `.elser-2-elastic`                     | sparse_embedding | **AUTO-ASSIGNED** to `semantic_text` fields |
| `.elser-2-elasticsearch`               | sparse_embedding | ML Nodes fallback                           |
| `.multilingual-e5-small-elasticsearch` | text_embedding   | Dense embeddings option                     |
| `.rerank-v1-elasticsearch`             | rerank           | Result re-ranking (tech preview)            |

### Verified Configuration

- ✅ All 6 index mappings match local JSON definitions
- ✅ Split analyzers deployed (`oak_text_index`, `oak_text_search`)
- ✅ Synonyms at search-time only (ES Serverless compatible)
- ✅ `semantic_text` fields automatically use ELSER

---

## Quick Links

- [High-Level Overview](./semantic-search-overview.md) - Strategy, phases, dependencies
- [Reference Indices Plan](./reference-indices-plan.md) - **NEW** Phase 3: subjects, key stages, years
- [Search Service (Backend)](./search-service/index.md) - API routes, Elasticsearch, ingestion
- [Search UI (Frontend)](./search-ui/index.md) - React components, theme, testing
- [Entity Discovery Pipeline](./entity-discovery-pipeline.md) - Multi-step entity extraction process
- [Graph RAG Integration Vision](../../research/elasticsearch/ai/graph-rag-integration-vision.md) - Strategic vision for Graph + RAG

---

## Key Documents

### Active Planning

- **semantic-search-overview.md** - High-level strategy, MCP integration, phase timeline
- **search-service/** - Backend implementation (API, Elasticsearch, ingestion)
- **search-ui/** - Frontend implementation (components, theme, UX)

### Reference (Complete)

- **search-generator-spec.md** - Documents generated SDK artifacts (13 modules) - ✅ IMPLEMENTATION COMPLETE

### Elasticsearch Reference

- `.agent/reference-docs/elasticsearch/README.md` - ES documentation index
- `.agent/reference-docs/elasticsearch/elastic-search-serverless-docs.md` - Serverless concepts
- `.agent/reference-docs/elasticsearch/elastic-cloud-serverless-api-usage.md` - API examples
- `.agent/reference-docs/elasticsearch/elasticsearch-serverless-openapi-source.json` - API spec

### Research

- [Semantic Search Plans Review](../../research/elasticsearch/semantic-search-plans-review.md)
- [Expanded Architecture Analysis](../../research/elasticsearch/expanded-architecture-analysis.md)
- [Ontology Implementation Gaps](../../research/elasticsearch/ontology-implementation-gaps.md)
- [Graph RAG Integration Vision](../../research/elasticsearch/ai/graph-rag-integration-vision.md) - Comprehensive Graph + RAG + Graph RAG strategy
- [ES AI Capabilities](../../research/elasticsearch/ai/elasticsearch_serverless_ai_kg_detailed.md) - Elasticsearch AI features
- [Knowledge Graph Construction](../../research/elasticsearch/ai/Constructing%20and%20Leveraging%20a%20Knowledge%20Graph%20in%20Elasticsearch%20for%20Search%20Relevance.docx.md)

### Archive

- **archive/superseded/** - Completed/obsolete documents
- **archive/completed/** - Historical plans and resolved issues

---

## Architecture Context

### Cardinal Rule Compliance ✅

All static data structures, types, type guards, Zod schemas, and validators **MUST** flow from the Open Curriculum OpenAPI schema via type-gen.

**Status**: COMPLETE - Unified field definitions architecture implemented (2025-12-05).

**Solution Implemented**:

```text
field-definitions.ts (IndexFieldDefinitions)
    ↓
├── zod-schema-generator.ts → Zod Schemas
└── es-mapping-from-fields.ts → ES Mappings (+ es-field-overrides.ts)
```

Key files in `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/`:

- `field-definitions.ts` - Single source of truth for index fields
- `zod-schema-generator.ts` - Generates Zod from field definitions
- `es-mapping-from-fields.ts` - Generates ES mappings from field definitions
- `field-alignment.unit.test.ts` - Proves Zod/ES fields match

### Logging Standards

**All code MUST use `@oaknational/mcp-logger`**, never console statements.

```typescript
// ❌ WRONG - violates project standards
console.log('Processing...');
console.error('Failed:', error);

// ✅ CORRECT - use configured loggers
import { sandboxLogger } from '../logger.js';
sandboxLogger.info('Processing', { subject, keyStage });
sandboxLogger.error('Failed', { error: error.message });
```

**Logger instances** (from `src/lib/logger.ts`):

- `searchLogger` - Hybrid search orchestration
- `suggestLogger` - Suggestion/type-ahead flows
- `sandboxLogger` - Ingestion and harness operations
- `cacheLogger` - SDK response caching

**Verbose mode** should control logger level (DEBUG vs INFO).

### Generated Artifacts (13 modules)

- `facets.ts` - Search facet types
- `fixtures.ts` - Test fixture builders
- `index-documents.ts` - Elasticsearch document schemas
- `index.ts` - Barrel exports
- `natural-requests.ts` - Natural language search requests
- `parsed-query.ts` - Query parser output types
- `requests.ts` - Structured search requests
- `responses.lessons.ts` - Lesson search responses
- `responses.multi.ts` - Multi-scope responses
- `responses.sequences.ts` - Sequence search responses
- `responses.units.ts` - Unit search responses
- `scopes.ts` - Search scope enumerations
- `suggestions.ts` - Suggestion contracts

---

## Index Inventory

### Current Indexes (Active)

Mappings generated at SDK type-gen time: `packages/sdks/oak-curriculum-sdk/src/types/generated/search/es-mappings/`

| Index                 | Purpose                                   | Semantic Field    |
| --------------------- | ----------------------------------------- | ----------------- |
| `oak_lessons`         | Lesson documents with semantic embeddings | `lesson_semantic` |
| `oak_unit_rollup`     | Aggregated unit text for semantic search  | `unit_semantic`   |
| `oak_units`           | Basic unit metadata                       | -                 |
| `oak_sequences`       | Programme sequence documents              | -                 |
| `oak_sequence_facets` | Sequence facet navigation data            | -                 |
| `oak_meta`            | Index version and ingestion metadata      | -                 |
| `oak_zero_hit_events` | Telemetry (lazy creation)                 | -                 |

### Future Indexes (Phase 2-6)

| Index                    | Phase | Priority | Purpose                                         |
| ------------------------ | ----- | -------- | ----------------------------------------------- |
| `oak_threads`            | 2     | HIGH     | Thread-centric search scope                     |
| `oak_ontology`           | 4     | HIGH     | Combined static ontology + KG for RAG grounding |
| `oak_curriculum_graph`   | 5     | HIGH     | Instance-level knowledge graph (triples)        |
| `oak_entities`           | 5     | HIGH     | Canonical entity records for disambiguation     |
| `oak_lesson_transcripts` | 4     | HIGH     | Chunked transcripts for deep retrieval          |
| `oak_content_guidance`   | 3     | HIGH     | Safeguarding/content warnings (filtering)       |
| `oak_lesson_planning`    | 3     | MEDIUM   | Pedagogical context search                      |
| `oak_assets`             | 3     | MEDIUM   | Resource discovery                              |

### Graph & RAG Index Details

See [Graph RAG Integration Vision](../../research/elasticsearch/ai/graph-rag-integration-vision.md) for detailed architecture.

| Index                  | Schema Source                                               | Entity Discovery                                            |
| ---------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| `oak_ontology`         | Static: `ontology-data.ts` + `knowledge-graph-data.ts`      | N/A (authored content)                                      |
| `oak_curriculum_graph` | Dynamic: Extracted from curriculum API + NER on transcripts | Multi-step pipeline                                         |
| `oak_entities`         | Hybrid: Explicit from ontology + Discovered from content    | [Entity Discovery Pipeline](./entity-discovery-pipeline.md) |

---

## SDK Data Imports (Single Source of Truth)

Domain data is imported from SDK:

```typescript
import {
  ontologyData, // Curriculum domain model, synonyms
  conceptGraph, // Knowledge graph structure
  buildElasticsearchSynonyms, // ES synonym set object
  buildSynonymLookup, // Term → canonical map
  serialiseElasticsearchSynonyms, // JSON string for ES API
} from '@oaknational/oak-curriculum-sdk/public/mcp-tools';
```

**Key facts**:

- Synonyms managed exclusively in `ontologyData.synonyms` (SDK)
- Static `synonyms.json` was **deleted** - ES synonyms generated dynamically
- ES index mappings generated at SDK type-gen time (not in search app)

---

## MCP Dev Server for Content Exploration

Use the local MCP server to explore curriculum content before ingestion:

```bash
cd apps/oak-curriculum-mcp-streamable-http
pnpm dev
# Server at http://localhost:3333/mcp
```

Useful tools: `get-subjects`, `get-subjects-sequences`, `get-sequences-units`, `get-key-stages-subject-lessons`, `get-threads`, `get-threads-units`

---

## Phase Roadmap

### Phase 1: Foundation ✅ COMPLETE

- [x] Schema-first migration
- [x] ES Serverless deployment
- [x] Index creation and mapping
- [x] Synonym deployment (68 rules)
- [x] CLI tools (`es:setup`, `es:status`, `es:ingest-live`)

### Phase 1.5: Real Data (CURRENT - READY FOR RE-INGESTION)

**Completed Fixes** ✅:

- [x] Fix Zod/ES mapping alignment (unified field definitions)
- [x] Replace console statements with proper logger
- [x] Make --verbose flag control log level
- [x] **Generator drift** - Updated generators, not generated files
- [x] Update `generate-search-index.ts` to emit per-index completion schemas
- [x] Remove deprecated `SearchCompletionSuggestPayload*` from generators
- [x] Remove forbidden `eslint-disable` comments
- [x] **Type system architecture** - Replaced ad-hoc ES types with official estypes
- [x] **All quality gates passing** - 10/10 gates green, 1,303+ tests passing

**Current Ingestion State** (verified 2025-12-06):

- `oak_unit_rollup`: 105 docs (Maths KS1)
- `oak_units`: 37 docs
- `oak_lessons`: 0 docs (failed with `strict_dynamic_mapping_exception` - now fixed)

**Ready for Next Steps**:

- [ ] Reset indexes and complete Maths ingestion with fixed completion contexts
- [ ] Validate search quality in ES Playground
- [ ] Expand to additional subjects/key stages

### Phase 2: Core Ontology

- [ ] Thread filtering and facets
- [ ] Programme factor fields (tier, exam board, pathway)
- [ ] KS4-specific filtering

### Phase 3: Ontology Enrichment

- [ ] Unit type classification
- [ ] Content guidance with supervision levels
- [ ] Lesson component availability flags

### Phase 4: Static Ontology Index & RAG Foundation

**New Index**: `oak_ontology` — combined static domain knowledge for RAG grounding.

- [ ] Design `oak_ontology` schema (see [search-generator-spec.md](./search-generator-spec.md#oak_ontology-index-schema))
- [ ] Generate ontology documents from `ontologyData` + `conceptGraph`
- [ ] Index with semantic embeddings (`description_semantic`)
- [ ] Lesson transcript chunking and indexing (`oak_lesson_transcripts`)
- [ ] Implement basic RAG pipeline (retrieve → assemble → generate)
- [ ] Add `ask-curriculum` MCP tool for RAG queries

**Deliverable**: Searchable ontology + transcripts enabling RAG for curriculum questions.

### Phase 5: Instance-Level Knowledge Graph

**New Indexes**: `oak_curriculum_graph` (triples) + `oak_entities` (canonical entities)

See [Entity Discovery Pipeline](./entity-discovery-pipeline.md) for multi-step extraction process.

**Explicit Entity Extraction** (at ingestion time):

- [ ] Extract hierarchical relationships from API structure (lesson→unit→sequence→subject)
- [ ] Extract keyword and misconception relationships from lesson metadata
- [ ] Extract thread linkages from unit data

**Discovered Entity Extraction** (post-ingestion pipeline):

- [ ] NER on transcripts (historical figures, scientific terms, mathematical concepts)
- [ ] Co-occurrence mining using ES Graph API (`significant_terms`)
- [ ] Entity disambiguation and canonical linking

**Graph Infrastructure**:

- [ ] Design `oak_curriculum_graph` triple schema
- [ ] Design `oak_entities` entity schema with graph metrics
- [ ] Implement graph traversal functions (neighbourhood, path finding)
- [ ] Add `explore-graph` MCP tool for graph navigation

**Deliverable**: Queryable instance-level knowledge graph with explicit + discovered entities.

### Phase 6: Graph RAG

Combines Phase 4 (RAG) + Phase 5 (Knowledge Graph) for multi-hop reasoning.

- [ ] Implement entity detection in user queries
- [ ] Implement path finding between detected entities
- [ ] Implement subgraph serialisation to text context
- [ ] Integrate graph context with RAG pipeline
- [ ] Add Mermaid visualisation generation for graph responses
- [ ] Add `find-connections` MCP tool for Graph RAG queries

**Deliverable**: Graph RAG enabling "How is X connected to Y?" curriculum questions.

### Phase 7: MCP Connectivity & Enhanced Search

- [ ] Aggregated `semantic-search` MCP tool with graph enhancement
- [ ] Enhanced `search` tool with `mode` parameter (`basic` | `semantic` | `graph-enhanced` | `rag`)
- [ ] Graph-based result reranking option
- [ ] Entity highlighting in search results
- [ ] Related concepts suggestions from graph

### Phase 8: OpenAI App Widget

- [ ] Enhanced search renderer with graph visualisations
- [ ] Standalone semantic search widget
- [ ] Graph exploration widget

---

## Success Metrics (Phases 4-6)

Target metrics for Graph + RAG capabilities (from [Graph RAG Integration Vision](../../research/elasticsearch/ai/graph-rag-integration-vision.md)):

| Metric                   | Baseline      | Target                          | Measurement        |
| ------------------------ | ------------- | ------------------------------- | ------------------ |
| **Search Relevance**     | BM25 baseline | +20% MRR with graph enhancement | Labelled query set |
| **RAG Answer Quality**   | N/A           | 80% factual accuracy            | Human evaluation   |
| **Graph Coverage**       | 0 triples     | 10K+ triples from curriculum    | Index stats        |
| **Connection Discovery** | Manual        | <2s response for 3-hop queries  | API latency        |
| **Entity Coverage**      | 0             | All explicit + 80% NER entities | Index stats        |

---

## Dependencies

### Complete ✅

- Curriculum ontology: `docs/architecture/curriculum-ontology.md`
- Schema-first execution: `.agent/directives-and-memory/schema-first-execution.md`
- Testing strategy: `.agent/directives-and-memory/testing-strategy.md`
- Cardinal rule: `.agent/directives-and-memory/rules.md`
- SDK type-gen infrastructure
- Thread schema generation
- SDK synonym export utilities

### Previously Blocking (Resolved) ✅

- ✅ **Zod/ES Mapping Alignment** - Unified field definitions implemented
- ✅ **Logging Standardisation** - Console replaced with logger
- ✅ **Verbose Flag** - Now controls log level

### Currently Blocking ❌

- ❌ **Generator Drift** - Previous work edited generated files instead of generators
  - Generators must be updated to emit per-index completion schemas
  - Deprecated exports must be removed from generators
  - `eslint-disable` comments must be removed (forbidden per rules.md)
  - See `.agent/analysis/semantic-search-compliance-and-ingestion-discovery.md`

---

## Navigation

For detailed implementation plans:

- Backend work → [search-service/index.md](./search-service/index.md)
- Frontend work → [search-ui/index.md](./search-ui/index.md)
- Historical context → [archive/](./archive/)
