# Search Service (Backend) Plans

Planning documentation for the semantic search backend: API routes, Elasticsearch indices, ingestion pipelines, and schema architecture.

## Status

- **Phase 1 (Schema-First Migration)**: ✅ COMPLETE
- **ES Deployment**: ✅ COMPLETE - Serverless deployed with live curriculum data
- **Index Metadata**: ✅ COMPLETE - `oak_meta` for automatic version tracking
- **Phase 2+ (Ontology Integration)**: ⏳ Ready to start

## Scope

This directory contains plans for:

- **API Routes**: Next.js App Router endpoints (`/api/search`, `/api/search/nl`, `/api/search/suggest`)
- **Elasticsearch Integration**: Index creation, mappings, bulk ingestion, RRF queries
- **Data Pipelines**: Ingestion from Oak Curriculum SDK, document transforms, rollup aggregation
- **Schema Architecture**: Migration to type-gen, schema-first implementation
- **Observability**: Zero-hit telemetry, performance monitoring, error tracking

## Out of Scope

Frontend components, UI themes, client-state management → see [../search-ui/](../search-ui/)

## Current Implementation Plan

- [Schema-First Ontology Implementation](./schema-first-ontology-implementation.md) - Comprehensive migration and ontology integration plan

## Key Concepts

### Schema-First Architecture

The search service follows the repository's cardinal rule: all types and schemas **MUST** flow from the OpenAPI schema at type-gen time. Currently, the search app has runtime-defined schemas that violate this principle. The implementation plan details the migration strategy.

### Ontology Integration

The search indices will be enhanced with ontology metadata to enable:

- **Thread filtering**: Vertical progression pathways (e.g., "geometry-and-measure")
- **Programme factor filtering**: Tier, exam board, pathway, exam subject
- **Unit type classification**: Simple, variants, optionality
- **Structured content guidance**: Four categories with supervision levels
- **Lesson component availability**: Boolean flags for worksheets, videos, quizzes, etc.

### Lesson Components (OPTIONAL)

**Critical Design Consideration**: Not all lessons have all components.

| Component            | Availability | Search Implications                                            |
| -------------------- | ------------ | -------------------------------------------------------------- |
| Curriculum info      | Always       | Always indexed                                                 |
| Slide deck           | Optional     | May be null                                                    |
| Video                | Optional     | Not all lessons have video                                     |
| Transcript           | Optional     | Only if video exists - `oak_lesson_transcripts` will be sparse |
| Starter quiz         | Optional     | May be null                                                    |
| Exit quiz            | Optional     | May be null                                                    |
| Worksheet            | Optional     | May be null                                                    |
| Additional materials | Optional     | May be null                                                    |

**Index Design**: Component availability should be indexed as boolean flags to enable filtering (e.g., "show only lessons with quizzes").

### Search Architecture

**Current Indexes** (mappings in `src/lib/elasticsearch/definitions/`):

| Index                 | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| `oak_lessons`         | Lesson documents with transcripts and semantic embeddings |
| `oak_units`           | Unit documents with lesson references                     |
| `oak_unit_rollup`     | Aggregated unit text for semantic search                  |
| `oak_sequences`       | Sequence documents with metadata                          |
| `oak_sequence_facets` | Facet enrichment for navigation                           |
| `oak_meta`            | Index version and ingestion metadata (automatic tracking) |
| `oak_zero_hit_events` | Telemetry (lazy creation with ILM)                        |

**Future Indexes** (Phase 2-3):

| Index                    | Priority | Purpose                                                   |
| ------------------------ | -------- | --------------------------------------------------------- |
| `oak_threads`            | HIGH     | Thread-centric search (progression tracking)              |
| `oak_ontology`           | HIGH     | Domain knowledge RAG                                      |
| `oak_lesson_transcripts` | HIGH     | Chunked transcripts for deep retrieval                    |
| `oak_content_guidance`   | HIGH     | Safeguarding/content warnings (filtering)                 |
| `oak_lesson_planning`    | MEDIUM   | Pedagogical context (key learning points, misconceptions) |
| `oak_assets`             | MEDIUM   | Resource discovery (worksheets, slides, videos)           |

**SDK Data Imports** (Single Source of Truth):

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

- Synonyms managed exclusively in SDK's `ontologyData.synonyms`
- Static `synonyms.json` was **deleted** - ES synonyms generated dynamically
- ES index mappings in `src/lib/elasticsearch/definitions/` (not `scripts/`)
- `scripts/generate-synonyms.ts` calls SDK to generate ES synonym payload

### API Patterns

**Structured Search** (`POST /api/search`):

- Scope: `lessons`, `units`, `sequences`, `all`
- Filters: Subject, key stage, year, category, thread, tier, exam board
- Returns: Hybrid results (RRF), aggregations, facets

**Natural Language Search** (`POST /api/search/nl`):

- Query parser: OpenAI GPT-4 extracts intent/filters
- Delegates to structured search with parsed parameters

**Suggestions** (`POST /api/search/suggest`):

- Type-ahead completion across scopes
- Context-aware suggestions with facet counts

## Technology Stack

- **Next.js 15**: App Router with server actions
- **Elasticsearch**: Serverless for semantic + lexical search
- **Oak Curriculum SDK**: Type-safe API client with generated types
- **Zod**: Runtime validation (will be generated at type-gen time)
- **TypeScript**: Strict mode, no type assertions

## Testing Strategy

Following `.agent/directives/testing-strategy.md`:

- **Unit tests** (`.unit.test.ts`): Pure functions, schema generators, query builders
- **Integration tests** (`.integration.test.ts`): API routes with mocked Elasticsearch, ingestion with mocked SDK
- **E2E tests** (`.e2e.test.ts`): Full system with real Elasticsearch sandbox

## Quality Gates

All work must pass:

```bash
pnpm type-gen           # Generate types from schema
pnpm build              # Production build
pnpm type-check         # TypeScript validation
pnpm lint:fix           # ESLint with auto-fix (or pnpm lint for verify)
pnpm format:root        # Format code
pnpm markdownlint:root  # Lint markdown
pnpm test               # Unit + integration
pnpm test:e2e           # E2E tests
pnpm test:e2e:built     # E2E tests on built artifacts
pnpm test:ui            # UI tests (Playwright)
pnpm smoke:dev:stub     # Smoke tests (stubbed)
```

## Related Plans

- [High-level overview](../semantic-search-overview.md)
- [Search UI plans](../search-ui/index.md)
- [Curriculum ontology](../../../docs/architecture/curriculum-ontology.md)

## Historical Context

Completed and superseded plans → [../archive/](../archive/)
