# Semantic Search High-Level Overview

Last updated: 2025-12-04

## Executive Summary

The Oak Open Curriculum Semantic Search is a proof-of-concept Next.js application providing hybrid search (semantic + lexical) across Oak's curriculum data. The system uses Elasticsearch Serverless with RRF (Reciprocal Rank Fusion) to deliver comprehensive search, faceted navigation, and intelligent suggestions for teachers and educators.

**Current Status**: ES Serverless DEPLOYED with live curriculum data ingested. Index metadata tracking (`oak_meta`) in place. Ready for Phase 2 ontology integration.

## Current State Snapshot

### Completed Work ✅

- **Schema-first migration**: All search schemas now generated via `pnpm type-gen` from OpenAPI schema
- **SDK exports**: 13 generated modules under `packages/sdks/oak-curriculum-sdk/src/types/generated/search/`
- **MCP tool generation**: 26 tools with full type safety
- **Elasticsearch Serverless deployed** (2025-12-04): ES cluster operational with indexes and synonyms
- **Six Elasticsearch indices**: lessons, units, unit_rollup, sequences, sequence_facets, **plus `oak_meta` for version tracking**
- **Live data ingestion complete**: Full curriculum data ingested via SDK for common subjects across all key stages
- **Automatic index versioning**: `oak_meta` index stores version, timestamp, doc counts, and ingestion metadata
- **Synonym set deployed**: `oak-syns` with 68 SDK-generated synonyms
- **Response augmentation middleware**: SDK client automatically adds `canonicalUrl` to API responses
- **Three search endpoints**:
  - `POST /api/search` - Structured search with scopes (lessons, units, sequences, all)
  - `POST /api/search/nl` - Natural language search with OpenAI query parsing
  - `POST /api/search/suggest` - Type-ahead suggestions with facet context
- **Hybrid search**: RRF combining semantic embeddings + lexical matching
- **Faceted navigation**: Subject, key stage, year, category filters
- **UI**: Next.js 15 App Router with Oak Components design system
- **Observability**: Zero-hit telemetry tracking empty result scenarios
- **Fixture testing**: Development mode with mock data for UI testing
- **TypeScript CLI tools**: ES setup and status via `pnpm es:setup` and `pnpm es:status`

### Critical Blockers 🚨

None - ES deployment and live ingestion complete. Ready for ontology integration.

### Next Steps

1. **Continue Phase 2 - Thread Filter**: Add thread filtering and facets to search (phase-1-thread-filter)
2. **Programme Factors**: Add KS4 filtering by tier, exam board, pathway
3. **MCP Semantic Search Tool**: Expose semantic search via MCP

### Remaining Gaps

1. **Missing ontology fields**: Threads, programme factors, unit types, content guidance structure not in indices
2. **Limited filtering**: Cannot filter by thread, tier, exam board, or unit characteristics
3. **No thread search scope**: Threads are a primary navigation concept but not searchable

### Architecture Principles

**Cardinal Rule**: All static data structures, types, type guards, Zod schemas, and validators MUST flow from the Open Curriculum OpenAPI schema in the SDK, generated at build/compile time. Running `pnpm type-gen` MUST be sufficient to bring all workspaces into alignment with schema changes.

**Schema-First Execution**: No runtime type assertions or ad-hoc narrowing. All types are generated at type-gen time from the OpenAPI schema, with compile-time validation ensuring type safety.

**Ontology-Driven**: Search indices and queries are structured around the curriculum ontology (programmes, threads, units, lessons) with explicit relationships and metadata.

## Overall Goals and Priorities

### Priority 0: ES Deployment ✅ COMPLETE

**Objective**: Provision Elasticsearch Serverless and run initial ingestion.

**Status**: COMPLETE (as of 2025-12-04)

**Completed Deliverables**:

- ✅ ES Serverless project created via Elastic Cloud (`poc-open-curriculum-api-search-dd21a1.es.europe-west1.gcp.elastic.cloud`)
- ✅ API keys generated and configured with manage + search privileges
- ✅ All 6 indexes created (`oak_lessons`, `oak_units`, `oak_unit_rollup`, `oak_sequences`, `oak_sequence_facets`, `oak_meta`)
- ✅ Synonym set `oak-syns` created with 68 SDK-generated synonyms
- ✅ Live curriculum data ingested via SDK for maths, english, science, history, geography across all key stages
- ✅ Index metadata tracking (`oak_meta`) stores version, timestamps, doc counts, and ingestion duration
- ✅ Search queries return real results from ES
- ✅ TypeScript CLI for setup (`pnpm es:setup`) and status (`pnpm es:status`)
- ✅ Live ingestion CLI (`pnpm es:ingest-live`) with subject/key-stage filtering

### Priority 1: Schema-First Migration ✅ COMPLETE

**Objective**: Migrate all search schemas from runtime to type-gen, following the cardinal rule.

**Status**: COMPLETE (as of 2025-12-04)

**Completed Deliverables**:

- ✅ All Zod schemas generated in SDK at `packages/sdks/oak-curriculum-sdk/src/types/generated/search/`
- ✅ 13 generated modules: facets, fixtures, index-documents, natural-requests, parsed-query, requests, responses (lessons/units/sequences/multi), scopes, suggestions
- ✅ Search app imports all types from SDK
- ✅ `pnpm type-gen && pnpm build` succeeds with no type errors
- ✅ All existing functionality preserved

### Priority 2: Ontology Integration

**Objective**: Add comprehensive ontology fields to search indices.

**Status**: NOT STARTED (blocked on ES deployment)

**Success Criteria**:

- Thread search scope operational with `oak_threads` index
- Thread and programme factor fields in all indices
- Unit type classification (simple, variant, optionality)
- Structured content guidance with supervision levels
- Lesson component availability flags

### Priority 3: MCP Connectivity and Widget

**Objective**: Expose semantic search via MCP tools and OpenAI App widget.

**Status**: NOT STARTED (blocked on ES deployment)

**Success Criteria**:

- `semantic-search` aggregated tool available via MCP
- `search` tool enhanced with `mode: 'semantic'` parameter
- Standalone semantic search widget in OpenAI App
- Enhanced search result renderer for rich display

### Priority 4: Testing and Observability

**Objective**: Comprehensive test coverage and production-ready observability.

**Success Criteria**:

- Unit tests for all generators, transforms, query builders
- Integration tests for API routes with mocked dependencies
- E2E tests for full search flows
- Sentry integration for error tracking (optional)
- Performance monitoring for Elasticsearch queries

## Relationship to MCP Integration

**Current Status**: MCP tool generation is COMPLETE. Semantic search MCP tool awaits ES deployment.

**Planned Architecture** (Ready for implementation):

1. **Aggregated semantic-search tool**: New tool in SDK calling semantic search app API
2. **Enhanced search tool**: Add `mode: 'basic' | 'semantic'` parameter to existing `search` tool
3. **OpenAI App widget**: Interactive semantic search widget in ChatGPT
4. **Enhanced search renderer**: Rich display of semantic search results with facets, threads, programme factors

**Implementation Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-semantic-search/`

**Rationale**: Maintains schema-first architecture; enables evolution without manual code changes; ensures semantic search follows same patterns as other MCP tools.

## Timeline and Milestones

### Phase 0: ES Deployment ✅ COMPLETE

**Duration**: Completed 2025-12-04 (multiple sessions)

**Completed Tasks**:

1. ✅ Provisioned ES Serverless project via Elastic Cloud
2. ✅ Generated API keys with manage + search privileges
3. ✅ Created all 6 indexes from existing mappings (with Serverless compatibility fixes)
4. ✅ Created `oak-syns` synonym set from SDK ontology (68 synonyms)
5. ✅ Live SDK ingestion completed for common subjects (maths, english, science, history, geography)
6. ✅ Validated search queries return real results
7. ✅ Index metadata (`oak_meta`) tracks version and ingestion details automatically
8. ✅ TypeScript CLI tools for setup, status, and live ingestion

**Exit Criteria Met**:

- ✅ ES Serverless project operational at `poc-open-curriculum-api-search-dd21a1.es.europe-west1.gcp.elastic.cloud`
- ✅ API keys configured in `.env.local`
- ✅ All indexes created: `oak_lessons`, `oak_units`, `oak_unit_rollup`, `oak_sequences`, `oak_sequence_facets`, `oak_meta`
- ✅ Live curriculum data ingested
- ✅ Quality gates pass

### Phase 1: Schema-First Migration ✅ COMPLETE

**Duration**: 6-8 weeks (started 2025-11-11, completed 2025-12-04)

**Completed Deliverables**:

- ✅ Type-gen schema generation - 13 modules generated
- ✅ Search app migration - All imports from SDK
- ✅ All schemas generated at type-gen time
- ✅ Quality gates pass
- ✅ Documentation updated

### Phase 2: Core Ontology - Threads and Programme Factors

**Duration**: 3-4 weeks
**Prerequisites**: Phase 0 complete

**Features**:

- Thread index and embedded thread fields
- Thread search scope with `oak_threads` index
- Programme factor fields (tier, exam board, pathway)
- Thread and factor filtering

**Exit Criteria**:

- Thread search scope operational
- Programme factor filtering for KS4
- E2E tests validate filtering combinations
- Quality gates pass

### Phase 3: Ontology Enrichment

**Duration**: 2-3 weeks
**Prerequisites**: Phase 2 complete

**Features**:

- Unit type classification and filtering
- Structured content guidance with categories
- Lesson component availability filters
- Enhanced facets with thread coverage

**Exit Criteria**:

- Filter by unit type, supervision level, available components
- Facets show thread coverage and unit classifications
- Quality gates pass

### Phase 4: RAG and Ontology Index

**Duration**: 2-3 weeks
**Prerequisites**: Phase 2 complete (can run parallel to Phase 3)

**Features**:

- `oak_ontology` index for domain knowledge RAG
- Index ontology-data.ts and knowledge-graph-data.ts
- Knowledge graph edge index for relationship queries

**Exit Criteria**:

- Ontology documents indexed and searchable
- RAG pattern functional
- Quality gates pass

### Phase 5: MCP Connectivity

**Duration**: 2-3 weeks
**Prerequisites**: Phases 2-4 substantially complete

**Features**:

- Aggregated `semantic-search` MCP tool
- Enhanced `search` tool with `mode` parameter
- Graceful degradation when semantic unavailable

**Exit Criteria**:

- MCP clients can search curriculum via semantic search
- Tools validated by contract tests
- Quality gates pass

### Phase 6: OpenAI App Widget

**Duration**: 2-3 weeks
**Prerequisites**: Phase 5 complete

**Features**:

- Standalone semantic search widget in ChatGPT
- Enhanced search result renderer
- "Search Curriculum" CTA button
- Widget preview server for testing

**Exit Criteria**:

- Widget functional in ChatGPT
- All features testable via preview server
- Quality gates pass

### Phase 7: Semantic Search App UI Updates

**Duration**: 2-3 weeks
**Prerequisites**: Phases 2-3 complete

**Features**:

- Thread UI (filters, scope, badges)
- Programme factor UI (tier, exam board dropdowns)
- Ontology enrichment UI (unit types, guidance, components)

**Exit Criteria**:

- Playwright E2E tests pass
- Accessibility audit passes
- Quality gates pass

## Dependencies and Blockers

### Completed Dependencies ✅

- Curriculum ontology documentation (`docs/architecture/curriculum-ontology.md`)
- Cardinal rule architecture defined (`.agent/directives-and-memory/rules.md`)
- Schema-first execution patterns (`.agent/directives-and-memory/schema-first-execution.md`)
- Testing strategy documented (`.agent/directives-and-memory/testing-strategy.md`)
- SDK type-gen infrastructure for search schemas (COMPLETE)
- MCP tool generation (COMPLETE - 26 tools)
- Aggregated tools architecture (COMPLETE - search, fetch, ontology, knowledge-graph)
- Thread schema generation - `SearchThreadIndexDocSchema` with embedded fields (COMPLETE)
- SDK synonym export utilities - `buildElasticsearchSynonyms()`, `buildSynonymLookup()` (COMPLETE)

### Active Dependencies

- **Elasticsearch Serverless**: ✅ Deployed and operational with live data
- **OpenAI API**: For natural language query parsing (AVAILABLE)
- **Full curriculum data**: ✅ Ingested for common subjects

### Recent Architectural Changes (2025-12-04)

- **Synonym consolidation**: Domain synonyms now managed in SDK's `ontologyData.synonyms`
- **Mapping files relocated**: ES index mappings moved to `src/lib/elasticsearch/definitions/`
- **Dynamic synonym generation**: `scripts/generate-synonyms.ts` calls SDK at runtime
- **E2E test correction**: Moved network-calling E2E test to smoke tests (E2E cannot access network per testing-strategy.md)
- **Index metadata**: New `oak_meta` index stores version, timestamps, doc counts, ingestion duration automatically
- **Response augmentation middleware**: SDK client now automatically adds `canonicalUrl` to all API responses
- **Dev server port**: Configurable via `SEMANTIC_SEARCH_PORT` env var (defaults to 3003 to avoid conflicts)
- **TypeScript CLI tools**: ES setup/status now via TypeScript CLI with proper env loading

### Future Dependencies

- **Sentry project**: Error monitoring (OPTIONAL)

## Risk Register

### Technical Risks

1. **Schema migration complexity** (Medium)
   - Mitigation: Phased migration, maintain parallel schemas during transition
   - Validation: Comprehensive test suite, fixture coverage

2. **Elasticsearch performance with ontology fields** (Low-Medium)
   - Mitigation: Index optimization, field type selection, query profiling
   - Validation: Performance tests, load testing in sandbox

3. **Type-gen generator complexity** (Medium)
   - Mitigation: TDD approach, incremental generator development, unit tests
   - Validation: Generated code must match runtime schemas exactly

### Operational Risks

1. **Breaking changes during migration** (Medium)
   - Mitigation: Comprehensive E2E tests, fixture coverage matrix
   - Rollback: Maintain runtime schemas until cutover validated

2. **Development velocity during refactor** (Low)
   - Mitigation: Clear phase boundaries, well-defined sessions
   - Communication: Regular status updates, documented progress

## Quality Gates and Validation

All work must pass the following gates in sequence:

```bash
pnpm type-gen           # Generate types from schema
pnpm build              # Production build
pnpm type-check         # TypeScript validation
pnpm lint:fix           # ESLint with auto-fix (or `pnpm lint` for verify-only)
pnpm format:root        # Format code
pnpm markdownlint:root  # Lint markdown
pnpm test               # Unit + integration tests
pnpm test:e2e           # E2E tests
pnpm test:e2e:built     # E2E tests on built artifacts
pnpm test:ui            # UI tests (Playwright)
pnpm smoke:dev:stub     # Smoke tests (stubbed)
```

**Shorthand commands**:

- `pnpm make` - Build, lint:fix, format (development workflow)
- `pnpm qg` - Full quality gate verification (CI workflow)
- `pnpm check` - Clean rebuild + full QG (thorough verification)

**Build System Documentation**: See `docs/development/build-system.md` and `docs/architecture/architectural-decisions/065-turbo-task-dependencies.md` for Turbo caching and task dependency details.

**Note**: After each code fix, the full quality gate sequence must be run from the beginning to prevent hidden regressions.

## Related Documentation

### Plans

- [Semantic Search Plans Index](./index.md)
- [Search Service Implementation](./search-service/schema-first-ontology-implementation.md)
- [Search UI Implementation](./search-ui/frontend-implementation.md)
- [Generator Specification](./search-generator-spec.md) - Documents generated artifacts

### Archive (Historical Reference)

- [Schema Migration Map](./archive/superseded/search-migration-map.md) - Migration complete
- [Schema Inventory](./archive/superseded/search-schema-inventory.md) - Schemas now generated

### Research

- [Semantic Search Plans Review](./../research/elasticsearch/semantic-search-plans-review.md)
- [Expanded Architecture Analysis](./../research/elasticsearch/expanded-architecture-analysis.md)
- [Ontology Implementation Gaps](./../research/elasticsearch/ontology-implementation-gaps.md)

### Architecture

- [Curriculum Ontology](../../docs/architecture/curriculum-ontology.md)
- [OpenAPI Pipeline](../../docs/architecture/openapi-pipeline.md)

### Guidance

- [Testing Strategy](../../.agent/directives-and-memory/testing-strategy.md)
- [Schema-First Execution](../../.agent/directives-and-memory/schema-first-execution.md)
- [Cardinal Rule](../../.agent/directives-and-memory/rules.md)

### Application

- [Semantic Search App README](../../../apps/oak-open-curriculum-semantic-search/README.md)

## Version History

- 2025-12-05: **ES UI verification complete** - Verified mappings, analyzers, synonyms, inference endpoints match local code
- 2025-12-05: **All quality gates passing** - smoke:dev:stub and all other gates now pass
- 2025-12-05: **Build system optimised** - Turbo caching enabled, task dependencies fixed (ADR 065, build-system.md)
- 2025-12-05: **lint:fix task added** - Explicit lint with auto-fix in all workspaces
- 2025-12-04: **Live curriculum data ingestion COMPLETE** - Full SDK data ingested for maths, english, science, history, geography across all key stages
- 2025-12-04: **Index metadata tracking** - New `oak_meta` index automatically tracks version, timestamps, doc counts, ingestion duration
- 2025-12-04: **Response augmentation middleware** - SDK client automatically adds `canonicalUrl` to API responses
- 2025-12-04: **TypeScript CLI tools** - ES setup, status, and live ingestion via TypeScript CLI with proper env loading
- 2025-12-04: **Dev server port configuration** - `SEMANTIC_SEARCH_PORT` env var (defaults to 3003)
- 2025-12-04: **Phase 0 ES Deployment COMPLETE** - Elasticsearch Serverless deployed, indexes created, synonyms configured
- 2025-12-04: Applied ES Serverless compatibility fixes to index mappings (removed `highlight.max_analyzed_offset`, split `oak_text` analyzer into index/search variants for synonym_graph filter)
- 2025-12-04: Added synonym consolidation, mapping relocation, thread schema completion to dependencies
- 2025-12-04: Fixed quality gates to match actual repository commands
- 2025-12-04: Updated to reflect schema-first migration COMPLETE; added ES deployment as blocking priority
- 2025-12-04: Moved obsolete schema docs to archive; updated phase timeline
- 2025-11-11: Created from consolidation of high-level-plan.md, context.md, search-migration-map.md
- 2025-11-11: Integrated schema-first migration planning
- 2025-11-11: Added ontology integration timeline
