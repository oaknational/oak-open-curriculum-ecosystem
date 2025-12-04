# Semantic Search Plans

Navigation hub for all semantic search planning documentation.

## ⚠️ Current Priority

**ES Deployment is the BLOCKING priority.** For continuation work, use:

- **Continuation Prompt**: `.agent/prompts/semantic-search/semantic-search-implementation.prompt.md`
- **Deployment Guide**: `.agent/prompts/semantic-search/elasticsearch-serverless-deployment.prompt.md`

## Overview

The semantic search system provides powerful search capabilities across Oak's curriculum data, integrating with Elasticsearch for hybrid search (semantic + lexical), faceted navigation, and intelligent suggestions. This planning directory documents the architecture, implementation strategy, and ongoing work.

## Status Summary

| Phase                    | Status      | Notes                                         |
| ------------------------ | ----------- | --------------------------------------------- |
| Schema-First Migration   | ✅ COMPLETE | All schemas generated via `pnpm type-gen`     |
| Thread Schema Generation | ✅ COMPLETE | Thread index and embedded fields in SDK       |
| SDK Synonym Export       | ✅ COMPLETE | Single source of truth for domain synonyms    |
| ES Deployment            | 🚨 BLOCKING | Not provisioned; all testing against fixtures |
| Ontology Integration     | ⏳ PENDING  | Blocked on ES deployment                      |
| MCP Connectivity         | ⏳ PENDING  | Blocked on ES deployment                      |
| OpenAI App Widget        | ⏳ PENDING  | Blocked on MCP connectivity                   |

## Quick Links

- [High-Level Overview](./semantic-search-overview.md) - Strategy, phases, dependencies
- [Search Service (Backend)](./search-service/index.md) - API routes, Elasticsearch, ingestion
- [Search UI (Frontend)](./search-ui/index.md) - React components, theme, testing

## Key Documents

### Active Planning

- **semantic-search-overview.md** - High-level strategy, MCP integration, phase timeline
- **search-service/** - Backend implementation (API, Elasticsearch, ingestion)
- **search-ui/** - Frontend implementation (components, theme, UX)

### Reference (Complete)

- **search-generator-spec.md** - Documents generated SDK artifacts (13 modules) - ✅ IMPLEMENTATION COMPLETE

### Research

- [Semantic Search Plans Review](../research/elasticsearch/semantic-search-plans-review.md)
- [Expanded Architecture Analysis](../research/elasticsearch/expanded-architecture-analysis.md)
- [Ontology Implementation Gaps](../research/elasticsearch/ontology-implementation-gaps.md)

### Archive

- **archive/superseded/** - Completed/obsolete documents including:
  - `search-schema-inventory.md` - Runtime schemas (now generated)
  - `search-migration-map.md` - Migration sequence (complete)
- **archive/completed/** - Historical plans and resolved issues

## Architecture Context

### Cardinal Rule Compliance ✅

All static data structures, types, type guards, Zod schemas, and validators **MUST** flow from the Open Curriculum OpenAPI schema via type-gen. Running `pnpm type-gen` must be sufficient to align all workspaces with schema changes.

**Status**: COMPLETE - All search schemas now generated at `packages/sdks/oak-curriculum-sdk/src/types/generated/search/`

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

### Ontology Integration

The semantic search implementation is guided by the comprehensive curriculum ontology documented in `docs/architecture/curriculum-ontology.md`, which defines:

- **Core entities**: Programme, Unit, Lesson, Thread, Sequence, Subject
- **Relationships**: Hierarchical and cross-cutting connections
- **Enumerated fields**: Phase, KeyStage, Year, Tier, ExamBoard, ContentGuidance
- **Official Oak API alignment**: Definitions from official glossary and ontology diagrams

### MCP Integration

Semantic search will integrate with MCP via:

- Aggregated `semantic-search` tool in SDK
- Enhanced `search` tool with `mode: 'basic' | 'semantic'`
- OpenAI App widget for interactive search
- Type-safe schemas from generated artifacts

### Index Inventory

**Current Indexes** (mappings in `src/lib/elasticsearch/definitions/`):

| Index                 | Purpose                                   | Status |
| --------------------- | ----------------------------------------- | ------ |
| `oak_lessons`         | Lesson documents with semantic embeddings | Active |
| `oak_unit_rollup`     | Unit aggregated content for search        | Active |
| `oak_units`           | Basic unit metadata                       | Active |
| `oak_sequences`       | Programme sequence documents              | Active |
| `oak_sequence_facets` | Sequence facet navigation data            | Active |
| `oak_zero_hit_events` | Telemetry (lazy creation)                 | Active |

**Future Indexes** (Phase 2-3):

| Index                    | Priority | Purpose                                   |
| ------------------------ | -------- | ----------------------------------------- |
| `oak_threads`            | HIGH     | Thread-centric search scope               |
| `oak_ontology`           | HIGH     | Domain knowledge RAG                      |
| `oak_lesson_transcripts` | HIGH     | Chunked transcripts for deep retrieval    |
| `oak_content_guidance`   | HIGH     | Safeguarding/content warnings (filtering) |
| `oak_lesson_planning`    | MEDIUM   | Pedagogical context search                |
| `oak_assets`             | MEDIUM   | Resource discovery                        |

### SDK Data Imports (Single Source of Truth)

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
- `scripts/generate-synonyms.ts` calls SDK to generate ES synonym payload

## Dependencies

### Complete ✅

- Curriculum ontology: `docs/architecture/curriculum-ontology.md`
- Schema-first execution: `.agent/directives-and-memory/schema-first-execution.md`
- Testing strategy: `.agent/directives-and-memory/testing-strategy.md`
- Cardinal rule: `.agent/directives-and-memory/rules.md`
- SDK type-gen infrastructure for search schemas
- Thread schema generation (Phase 1.1)
- SDK synonym export utilities

### Blocking 🚨

- **Elasticsearch Serverless**: NOT PROVISIONED - see deployment prompt

## Navigation

For detailed implementation plans:

- Backend work → [search-service/index.md](./search-service/index.md)
- Frontend work → [search-ui/index.md](./search-ui/index.md)
- Historical context → [archive/](./archive/)
