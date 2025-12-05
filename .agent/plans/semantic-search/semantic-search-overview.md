# Semantic Search High-Level Overview

Last updated: 2025-12-05

## Executive Summary

The Oak Open Curriculum Semantic Search is a proof-of-concept Next.js application providing hybrid search (semantic + lexical) across Oak's curriculum data. The system uses Elasticsearch Serverless with RRF (Reciprocal Rank Fusion) to deliver comprehensive search, faceted navigation, and intelligent suggestions for teachers and educators.

**Current Status**: ES Serverless DEPLOYED. **BLOCKING ISSUES** discovered during data ingestion - Zod/ES mapping field mismatch and logging standardisation required before proceeding.

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
- **SDK response caching**: Optional Redis caching with 404 fallbacks for 100% hit rate (ADR 066)

### Critical Blockers 🚨

#### 1. Zod Schema / ES Mapping Field Mismatch

**Problem**: The SDK generates two parallel sets of field definitions that have diverged:

- **Zod schemas** (`generate-search-index-docs.ts`) define document structure
- **ES mappings** (`es-mapping-generators*.ts`) define Elasticsearch field types

**Symptom**: Bulk indexing fails with `strict_dynamic_mapping_exception`:

```
mapping set to strict, dynamic introduction of [unit_title] within [_doc] is not allowed
```

**Root Cause**: Both generators are hand-coded with different field lists. Fields like `unit_title`, `lesson_ids`, `unit_topics`, `title_suggest` exist in Zod schemas but were missing from ES mappings.

**Solution Required**: Create unified field definitions that both generators consume.

#### 2. Console Statements Instead of Logger

**Problem**: Ingestion CLI and related code uses `console.log/error` directly instead of `@oaknational/mcp-logger`. This violates project standards and makes verbose mode ineffective.

**Files affected** (68 console instances across 11 files):

- `src/lib/elasticsearch/setup/cli.ts`
- `src/lib/elasticsearch/setup/index.ts`
- `src/lib/elasticsearch/setup/ingest-*.ts`
- `src/lib/index-oak*.ts`
- `src/lib/indexing/*.ts`

**Solution Required**: Replace all console statements with logger calls from `src/lib/logger.ts`.

#### 3. Verbose Flag Not Controlling Log Level

**Problem**: The `--verbose` flag is passed through but doesn't control the logger's minimum severity.

### Next Steps (After Blockers Resolved)

1. **Fix mapping alignment** - Create unified field definitions for both generators
2. **Fix logging** - Replace console with logger, make verbose control log level
3. **Ingest data** - Re-run Maths curriculum ingestion
4. **Continue Phase 2** - Thread filtering and facets

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

**Status**: NOT STARTED (blocked on data ingestion)

**Success Criteria**:

- Thread search scope operational with `oak_threads` index
- Thread and programme factor fields in all indices
- Unit type classification (simple, variant, optionality)
- Structured content guidance with supervision levels
- Lesson component availability flags

### Priority 3: Graph + RAG Capabilities

**Objective**: Enable intelligent curriculum search with knowledge graph and retrieval-augmented generation.

**Status**: PLANNED (see [Graph RAG Integration Vision](../../research/elasticsearch/ai/graph-rag-integration-vision.md))

**Success Criteria**:

- `oak_ontology` index populated with static domain knowledge
- `oak_curriculum_graph` index with 10K+ curriculum triples
- `oak_entities` index with canonical entity records
- RAG pipeline functional for curriculum Q&A
- Graph RAG functional for connection queries
- Entity discovery pipeline operational

### Priority 4: MCP Connectivity and Widget

**Objective**: Expose semantic search via MCP tools and OpenAI App widget.

**Status**: NOT STARTED (blocked on ES deployment)

**Success Criteria**:

- `semantic-search` aggregated tool with graph enhancement options
- `search` tool enhanced with `mode` parameter (`basic` | `semantic` | `graph-enhanced` | `rag`)
- `explore-graph` tool for graph navigation
- `ask-curriculum` tool for RAG queries
- `find-connections` tool for Graph RAG
- Standalone semantic search widget in OpenAI App
- Graph exploration widget with visualisations

### Priority 5: Testing and Observability

**Objective**: Comprehensive test coverage and production-ready observability.

**Success Criteria**:

- Unit tests for all generators, transforms, query builders
- Integration tests for API routes with mocked dependencies
- Integration tests for graph traversal and RAG pipelines
- E2E tests for full search flows
- Sentry integration for error tracking (optional)
- Performance monitoring for Elasticsearch queries
- Graph traversal latency monitoring

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

### Phase 4: Static Ontology Index & RAG Foundation

**Duration**: 3-4 weeks
**Prerequisites**: Phase 2 complete (can run parallel to Phase 3)

**New Index**: `oak_ontology` — combined static domain knowledge for RAG grounding.

**Data Sources** (see [search-generator-spec.md](./search-generator-spec.md#oak_ontology-index-schema)):

- `ontology-data.ts` — Curriculum structure, key stages, phases, subjects, threads, workflows, synonyms
- `knowledge-graph-data.ts` — Concept TYPE relationships (~28 concepts, ~45 edges)

**Features**:

- Design `oak_ontology` index schema with semantic embeddings
- Generate ontology documents combining both static data sources
- Lesson transcript chunking and indexing (`oak_lesson_transcripts`)
- Configure OpenAI inference endpoint via ES Inference API
- Implement basic RAG pipeline (retrieve → assemble → generate)
- Add citation extraction and formatting
- Add `ask-curriculum` MCP tool for RAG queries

**Exit Criteria**:

- Ontology documents indexed and searchable via semantic queries
- RAG pipeline functional with grounded, cited answers
- Quality gates pass

### Phase 5: Instance-Level Knowledge Graph

**Duration**: 4-6 weeks
**Prerequisites**: Phase 4 complete, real curriculum data ingested

**New Indexes**:

- `oak_curriculum_graph` — Triple storage for curriculum relationships
- `oak_entities` — Canonical entity records with graph metrics

**Entity Discovery** (see [Entity Discovery Pipeline](./entity-discovery-pipeline.md)):

This is a **multi-step pipeline** because entity extraction happens at different times:

1. **Explicit Entities** (at ingestion time):
   - Hierarchical: lesson → unit → sequence → subject
   - Semantic: lesson → keywords, misconceptions
   - Taxonomic: unit → threads, categories
   - These come directly from API data structure

2. **Discovered Entities** (post-ingestion analysis):
   - NER on transcripts (historical figures, scientific terms, etc.)
   - Co-occurrence mining via ES Graph API
   - Entity disambiguation and canonical linking
   - Requires data to be indexed first, then analysed

**Features**:

- Design triple schema (source, relation, target, confidence, extraction_source)
- Design entity schema with graph metrics (in_degree, out_degree, centrality)
- Implement explicit extraction during ingestion pipeline
- Implement post-ingestion NER pipeline for transcripts
- Implement co-occurrence mining using `significant_terms` aggregation
- Implement graph traversal functions (getNeighbourhood, findConnections)
- Add `explore-graph` MCP tool for graph navigation

**Exit Criteria**:

- 10K+ triples extracted from curriculum data
- Entity disambiguation functional
- Graph traversal returns results in <2s
- Quality gates pass

### Phase 6: Graph RAG

**Duration**: 3-4 weeks
**Prerequisites**: Phases 4 + 5 complete

Combines RAG (Phase 4) with Knowledge Graph (Phase 5) for multi-hop reasoning.

**Architecture** (see [Graph RAG Integration Vision](../../research/elasticsearch/ai/graph-rag-integration-vision.md)):

```
Query: "What connects photosynthesis to respiration?"
    ↓
1. Entity Detection → [photosynthesis, respiration]
    ↓
2. Graph Traversal → Find paths between entities (up to 3 hops)
    ↓
3. Subgraph Extraction → Build relevant subgraph
    ↓
4. Context Assembly → Serialize graph + fetch document content
    ↓
5. LLM Generation → Answer with graph context
    ↓
6. Response → Answer + citations + Mermaid diagram
```

**Features**:

- Implement entity detection in user queries
- Implement bidirectional path finding between entities
- Implement subgraph serialisation to text context
- Integrate graph context with RAG pipeline
- Add Mermaid diagram generation for visualisation
- Add `find-connections` MCP tool for Graph RAG queries

**Exit Criteria**:

- "How is X connected to Y?" queries answered correctly
- Mermaid visualisations generated for paths
- Response includes citations to source documents
- Quality gates pass

### Phase 7: MCP Connectivity & Enhanced Search

**Duration**: 3-4 weeks
**Prerequisites**: Phases 4-6 substantially complete

**Features**:

- Aggregated `semantic-search` MCP tool with graph enhancement options
- Enhanced `search` tool with `mode` parameter:
  - `basic` — BM25 only
  - `semantic` — Hybrid (BM25 + ELSER)
  - `graph-enhanced` — Semantic + graph reranking
  - `rag` — Full RAG with LLM synthesis
- Graph-based result reranking (boost connected results)
- Entity highlighting in search results
- Related concepts suggestions from graph neighbourhood
- Graceful degradation when services unavailable

**Exit Criteria**:

- MCP clients can search curriculum via all modes
- Graph enhancement measurably improves relevance (target: +20% MRR)
- Tools validated by contract tests
- Quality gates pass

### Phase 8: OpenAI App Widget

**Duration**: 2-3 weeks
**Prerequisites**: Phase 7 complete

**Features**:

- Standalone semantic search widget in ChatGPT
- Enhanced search result renderer with entity badges
- Graph exploration widget with Mermaid visualisation
- "Search Curriculum" and "Explore Connections" CTA buttons
- Widget preview server for testing

**Exit Criteria**:

- Widget functional in ChatGPT
- Graph visualisations render correctly
- All features testable via preview server
- Quality gates pass

### Phase 9: Semantic Search App UI Updates

**Duration**: 2-3 weeks
**Prerequisites**: Phases 2-3 complete

**Features**:

- Thread UI (filters, scope, badges)
- Programme factor UI (tier, exam board dropdowns)
- Ontology enrichment UI (unit types, guidance, components)
- Graph exploration UI (entity links, related concepts)

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
- **OpenAI Inference Endpoint**: Required for RAG (Phase 4) - configure via ES Inference API
- **NER Model**: Required for entity discovery (Phase 5) - options: ES ML, OpenAI, rule-based hybrid
- **Lesson Transcripts**: Required for deep retrieval (Phase 4) and NER (Phase 5) - may need lazy fetching

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

4. **Graph traversal performance** (Medium) — *NEW for Phase 5-6*
   - Concern: Multi-hop queries can explode combinatorially
   - Mitigation: Limit hop depth (max 3), limit neighbours per hop (max 100), cache common subgraphs
   - Validation: Performance tests with real curriculum data

5. **NER extraction quality** (Medium) — *NEW for Phase 5*
   - Concern: Curriculum-specific entities may not be recognized by generic NER models
   - Mitigation: Start with rule-based for curriculum terms, add ML NER for transcripts
   - Validation: Sample-based manual accuracy assessment

6. **LLM cost management** (Low-Medium) — *NEW for Phase 4-6*
   - Concern: RAG queries involve LLM calls which have per-token costs
   - Mitigation: Add cost monitoring from day one, cache common query patterns
   - Validation: Cost tracking per query, budget alerts

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
- [Entity Discovery Pipeline](./entity-discovery-pipeline.md) - Multi-step entity extraction

### Archive (Historical Reference)

- [Schema Migration Map](./archive/superseded/search-migration-map.md) - Migration complete
- [Schema Inventory](./archive/superseded/search-schema-inventory.md) - Schemas now generated

### Research

- [Semantic Search Plans Review](./../research/elasticsearch/semantic-search-plans-review.md)
- [Expanded Architecture Analysis](./../research/elasticsearch/expanded-architecture-analysis.md)
- [Ontology Implementation Gaps](./../research/elasticsearch/ontology-implementation-gaps.md)
- [Graph RAG Integration Vision](./../research/elasticsearch/ai/graph-rag-integration-vision.md) - Comprehensive Graph + RAG strategy
- [ES AI Capabilities](./../research/elasticsearch/ai/elasticsearch_serverless_ai_kg_detailed.md)
- [Knowledge Graph in ES](./../research/elasticsearch/ai/Constructing%20and%20Leveraging%20a%20Knowledge%20Graph%20in%20Elasticsearch%20for%20Search%20Relevance.docx.md)

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

- 2025-12-05: **Graph RAG Integration Vision** - Added Phases 4-6 for static ontology index, instance-level knowledge graph, and Graph RAG. Created entity-discovery-pipeline.md for multi-step extraction. Added schema definitions for `oak_ontology`, `oak_curriculum_graph`, and `oak_entities` indexes.
- 2025-12-05: **🚨 BLOCKING: Zod/ES mapping mismatch** - Field definitions diverged, causing bulk indexing failures
- 2025-12-05: **🚨 BLOCKING: Console usage** - Ingestion code uses console instead of proper logger
- 2025-12-05: **Reset CLI command added** - `npx tsx cli.ts reset` deletes and recreates indexes
- 2025-12-05: **Bulk error reporting** - dispatchBulk now captures and reports indexing failures
- 2025-12-05: **Units mapping fixed** - Added missing fields (unit_title, lesson_ids, unit_topics, title_suggest)
- 2025-12-05: **SDK response caching complete** - 404 fallback caching for 100% cache hit rates (ADR 066)
- 2025-12-05: **History KS2 test ingestion** - 153 docs, 226 cached items, 100% cache hits on rerun
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
