# Search Service (Backend) Plans

Planning documentation for the semantic search backend: API routes, Elasticsearch indices, ingestion pipelines, and schema architecture.

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

### Search Architecture

**Indices** (Current):

- `oak_lessons` - Individual lesson documents with transcripts
- `oak_units` - Unit documents with lesson references
- `oak_unit_rollup` - Aggregated unit text for semantic search
- `oak_sequences` - Sequence documents with metadata
- `oak_sequence_facets` - Facet enrichment for navigation

**Planned Additions**:

- `oak_threads` - Thread documents with unit rollups (NEW)
- Thread/programme fields embedded in existing indices

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

Following `docs/agent-guidance/testing-strategy.md`:

- **Unit tests** (`.unit.test.ts`): Pure functions, schema generators, query builders
- **Integration tests** (`.integration.test.ts`): API routes with mocked Elasticsearch, ingestion with mocked SDK
- **E2E tests** (`.e2e.test.ts`): Full system with real Elasticsearch sandbox

## Quality Gates

All work must pass:

```bash
pnpm type-gen      # Generate types from schema
pnpm format        # Format code
pnpm type-check    # TypeScript validation
pnpm lint          # ESLint + architectural rules
pnpm test          # Unit + integration
pnpm build         # Production build
pnpm test:e2e      # E2E tests (manual, sandbox)
```

## Related Plans

- [High-level overview](../semantic-search-overview.md)
- [Search UI plans](../search-ui/index.md)
- [Curriculum ontology](../../../docs/architecture/curriculum-ontology.md)

## Historical Context

Completed and superseded plans → [../archive/](../archive/)
