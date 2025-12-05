# Semantic Search Plans

Navigation hub for all semantic search planning documentation.

## Current Priority

**ES deployment COMPLETE. All quality gates passing.** Ready to ingest real data.

### Immediate Next Step

Ingest real curriculum data (Maths, all key stages) to validate search quality before Phase 2.

For continuation work, use:

- **Continuation Prompt**: `.agent/prompts/semantic-search/semantic-search.prompt.md`

---

## Overview

The semantic search system provides powerful search capabilities across Oak's curriculum data, integrating with Elasticsearch Serverless for hybrid search (semantic + lexical), faceted navigation, and intelligent suggestions.

---

## Status Summary

| Phase                    | Status      | Notes                                                |
| ------------------------ | ----------- | ---------------------------------------------------- |
| Schema-First Migration   | ✅ COMPLETE | All schemas generated via `pnpm type-gen`            |
| Thread Schema Generation | ✅ COMPLETE | Thread index and embedded fields in SDK              |
| SDK Synonym Export       | ✅ COMPLETE | 68 rules deployed to ES as `oak-syns`                |
| ES Serverless Deployment | ✅ COMPLETE | Indexes created, mappings verified, ELSER configured |
| Quality Gates            | ✅ COMPLETE | All gates passing including `smoke:dev:stub`         |
| Real Data Ingestion      | ⏳ NEXT     | Clear test data, ingest Maths curriculum             |
| Ontology Integration     | ⏳ PENDING  | Phase 2 - after data validation                      |
| MCP Connectivity         | ⏳ PENDING  | Phase 5 - blocked on ontology integration            |
| OpenAI App Widget        | ⏳ PENDING  | Phase 6 - blocked on MCP connectivity                |

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

### Archive

- **archive/superseded/** - Completed/obsolete documents
- **archive/completed/** - Historical plans and resolved issues

---

## Architecture Context

### Cardinal Rule Compliance ✅

All static data structures, types, type guards, Zod schemas, and validators **MUST** flow from the Open Curriculum OpenAPI schema via type-gen.

**Status**: COMPLETE - All search schemas generated at `packages/sdks/oak-curriculum-sdk/src/types/generated/search/`

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

Mappings in `apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/definitions/`:

| Index                 | Purpose                                   | Semantic Field    |
| --------------------- | ----------------------------------------- | ----------------- |
| `oak_lessons`         | Lesson documents with semantic embeddings | `lesson_semantic` |
| `oak_unit_rollup`     | Aggregated unit text for semantic search  | `unit_semantic`   |
| `oak_units`           | Basic unit metadata                       | -                 |
| `oak_sequences`       | Programme sequence documents              | -                 |
| `oak_sequence_facets` | Sequence facet navigation data            | -                 |
| `oak_meta`            | Index version and ingestion metadata      | -                 |
| `oak_zero_hit_events` | Telemetry (lazy creation)                 | -                 |

### Future Indexes (Phase 2-3)

| Index                    | Priority | Purpose                                   |
| ------------------------ | -------- | ----------------------------------------- |
| `oak_threads`            | HIGH     | Thread-centric search scope               |
| `oak_ontology`           | HIGH     | Domain knowledge RAG                      |
| `oak_lesson_transcripts` | HIGH     | Chunked transcripts for deep retrieval    |
| `oak_content_guidance`   | HIGH     | Safeguarding/content warnings (filtering) |
| `oak_lesson_planning`    | MEDIUM   | Pedagogical context search                |
| `oak_assets`             | MEDIUM   | Resource discovery                        |

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
- ES index mappings live in `src/lib/elasticsearch/definitions/` (not `scripts/`)

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

### Phase 1.5: Real Data (CURRENT)

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

### Phase 4: RAG and Deep Search

- [ ] Create ontology index for domain knowledge
- [ ] Lesson transcript chunking and indexing

### Phase 5: MCP Connectivity

- [ ] Aggregated `semantic-search` MCP tool
- [ ] Enhanced `search` tool with `mode` parameter

### Phase 6: OpenAI App Widget

- [ ] Enhanced search renderer
- [ ] Standalone semantic search widget

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

### No Blocking Dependencies

All dependencies complete. Ready for real data ingestion and Phase 2.

---

## Navigation

For detailed implementation plans:

- Backend work → [search-service/index.md](./search-service/index.md)
- Frontend work → [search-ui/index.md](./search-ui/index.md)
- Historical context → [archive/](./archive/)
