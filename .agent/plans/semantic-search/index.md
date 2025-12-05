# Semantic Search Plans

Navigation hub for all semantic search planning documentation.

## Current Priority

**ES deployment COMPLETE. BLOCKING issues discovered during data ingestion.**

### Blocking Issues 🚨

1. **Zod/ES Mapping Mismatch** - Field definitions have diverged between Zod schemas and ES mappings, causing bulk indexing failures
2. **Console Usage** - Ingestion code uses console statements instead of `@oaknational/mcp-logger`

### Immediate Next Step

Fix architectural issues before data ingestion can proceed. See [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) for details.

For continuation work, use:

- **Continuation Prompt**: `.agent/prompts/semantic-search/semantic-search.prompt.md`

---

## Overview

The semantic search system provides powerful search capabilities across Oak's curriculum data, integrating with Elasticsearch Serverless for hybrid search (semantic + lexical), faceted navigation, and intelligent suggestions.

---

## Status Summary

| Phase                        | Status      | Notes                                                      |
| ---------------------------- | ----------- | ---------------------------------------------------------- |
| Schema-First Migration       | ✅ COMPLETE | All schemas generated via `pnpm type-gen`                  |
| Thread Schema Generation     | ✅ COMPLETE | Thread index and embedded fields in SDK                    |
| SDK Synonym Export           | ✅ COMPLETE | 68 rules deployed to ES as `oak-syns`                      |
| ES Serverless Deployment     | ✅ COMPLETE | Indexes created, mappings verified, ELSER configured       |
| Quality Gates                | ✅ COMPLETE | All gates passing including `smoke:dev:stub`               |
| SDK Response Caching         | ✅ COMPLETE | Redis caching with 404 fallbacks, 100% hit rate            |
| **Zod/ES Mapping Alignment** | 🚨 BLOCKED  | Field definitions diverged - needs unified source of truth |
| **Logging Standardisation**  | 🚨 BLOCKED  | Console statements must be replaced with proper logger     |
| Real Data Ingestion          | ⏳ BLOCKED  | Waiting on mapping alignment fix                           |
| Ontology Integration         | ⏳ PENDING  | Phase 2-3 - after data validation                          |
| Static Ontology Index (RAG)  | ⏳ PLANNED  | Phase 4 - `oak_ontology` from ontology + KG data           |
| Instance Knowledge Graph     | ⏳ PLANNED  | Phase 5 - `oak_curriculum_graph` + `oak_entities`          |
| Graph RAG                    | ⏳ PLANNED  | Phase 6 - multi-hop reasoning combining graph + RAG        |
| MCP Connectivity             | ⏳ PENDING  | Phase 7 - enhanced search with graph modes                 |
| OpenAI App Widget            | ⏳ PENDING  | Phase 8 - with graph visualisations                        |

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

### Cardinal Rule Compliance ⚠️

All static data structures, types, type guards, Zod schemas, and validators **MUST** flow from the Open Curriculum OpenAPI schema via type-gen.

**Status**: PARTIAL - Zod schemas generated but ES mappings have diverged.

**Issue Discovered (2025-12-05)**: The SDK generates two parallel sets of field definitions:

1. **Zod schemas** (`generate-search-index-docs.ts`) - defines document structure
2. **ES mappings** (`es-mapping-generators*.ts`) - defines Elasticsearch field types

These have different field lists, causing bulk indexing failures. Both should derive from a single field definition source.

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

### Phase 1.5: Real Data (CURRENT - BLOCKED)

**Blocking Issues**:

- [ ] Fix Zod/ES mapping alignment (unified field definitions)
- [ ] Replace console statements with proper logger
- [ ] Make --verbose flag control log level

**After fixes**:

- [ ] Clear test/fake data
- [ ] Ingest Maths curriculum (all key stages)
- [ ] Validate search quality in ES Playground
- [ ] Test semantic and keyword search

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

### Blocking Issues (Must Fix First)

- **Zod/ES Mapping Alignment** - Create unified field definitions
- **Logging Standardisation** - Replace console with logger

After these are fixed, ready for real data ingestion and Phase 2.

---

## Navigation

For detailed implementation plans:

- Backend work → [search-service/index.md](./search-service/index.md)
- Frontend work → [search-ui/index.md](./search-ui/index.md)
- Historical context → [archive/](./archive/)
