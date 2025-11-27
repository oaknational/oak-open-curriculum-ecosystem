# Semantic Search High-Level Overview

Last updated: 2025-11-11

## Executive Summary

The Oak Open Curriculum Semantic Search is a proof-of-concept Next.js application providing hybrid search (semantic + lexical) across Oak's curriculum data. The system uses Elasticsearch Serverless with RRF (Reciprocal Rank Fusion) to deliver comprehensive search, faceted navigation, and intelligent suggestions for teachers and educators.

**Current Status**: Transitioning from runtime schema definitions to schema-first architecture with integrated curriculum ontology support.

## Current State Snapshot

### What Works Today

- **Five Elasticsearch indices**: lessons, units, unit_rollup, sequences, sequence_facets
- **Three search endpoints**:
  - `POST /api/search` - Structured search with scopes (lessons, units, sequences, all)
  - `POST /api/search/nl` - Natural language search with OpenAI query parsing
  - `POST /api/search/suggest` - Type-ahead suggestions with facet context
- **Hybrid search**: RRF combining semantic embeddings + lexical matching
- **Faceted navigation**: Subject, key stage, year, category filters
- **UI**: Next.js 15 App Router with Oak Components design system
- **Observability**: Zero-hit telemetry tracking empty result scenarios
- **Fixture testing**: Development mode with mock data for UI testing

### Known Gaps

1. **Schema architecture violation**: Search app defines schemas at runtime, violating the cardinal rule (all types must flow from OpenAPI schema via `pnpm type-gen`)
2. **Missing ontology fields**: Threads, programme factors, unit types, content guidance structure not in indices
3. **Limited filtering**: Cannot filter by thread, tier, exam board, or unit characteristics
4. **Manual schema duplication**: Zod schemas hand-written in app, SDK, and API routes
5. **No thread search scope**: Threads are a primary navigation concept but not searchable

### Architecture Principles

**Cardinal Rule**: All static data structures, types, type guards, Zod schemas, and validators MUST flow from the Open Curriculum OpenAPI schema in the SDK, generated at build/compile time. Running `pnpm type-gen` MUST be sufficient to bring all workspaces into alignment with schema changes.

**Schema-First Execution**: No runtime type assertions or ad-hoc narrowing. All types are generated at type-gen time from the OpenAPI schema, with compile-time validation ensuring type safety.

**Ontology-Driven**: Search indices and queries are structured around the curriculum ontology (programmes, threads, units, lessons) with explicit relationships and metadata.

## Overall Goals and Priorities

### Priority 1: Schema-First Migration (Current Focus)

**Objective**: Migrate all search schemas from runtime to type-gen, following the cardinal rule.

**Success Criteria**:

- All Zod schemas generated in SDK at `packages/sdks/oak-curriculum-sdk/src/types/generated/search/`
- Search app imports all types from SDK, zero runtime schema definitions
- `pnpm type-gen && pnpm build` succeeds with no type errors
- All existing functionality preserved

### Priority 2: Ontology Integration (Concurrent with P1)

**Objective**: Add comprehensive ontology fields to search indices.

**Success Criteria**:

- Thread search scope operational with `oak_threads` index
- Thread and programme factor fields in all indices
- Unit type classification (simple, variant, optionality)
- Structured content guidance with supervision levels
- Lesson component availability flags

### Priority 3: Testing and Observability

**Objective**: Comprehensive test coverage and production-ready observability.

**Success Criteria**:

- Unit tests for all generators, transforms, query builders
- Integration tests for API routes with mocked dependencies
- E2E tests for full search flows
- Sentry integration for error tracking (optional)
- Performance monitoring for Elasticsearch queries

## Relationship to MCP Integration

**Current Status**: Deferred until ontology and schema-first architecture complete.

**Planned Architecture** (Post Phase 1):

1. **Type-gen time generation**: Semantic search endpoints integrated into MCP `search` tool via type-gen configuration
2. **Prerequisite**: Aggregated tools (`search`, `fetch`) moved from runtime to type-gen (see curriculum-ontology-resource-plan.md Sprint 0)
3. **Configuration-driven**: Add semantic search API endpoints to aggregated tool config; generator composes curriculum + semantic APIs
4. **Generated at build time**: `pnpm type-gen` produces complete `search` tool with semantic search integration
5. **Runtime plumbing**: MCP servers import generated tools with zero hand-written composition

**Rationale**: Maintains schema-first architecture; enables evolution without manual code changes; ensures semantic search follows same patterns as other MCP tools.

## Timeline and Milestones

### Phase 1: Schema-First Migration + Core Ontology (Current)

**Duration**: 6-8 weeks (started 2025-11-11)

**Sprints**:

1. **Type-gen schema generation** (2 weeks)
   - Create search schema generators in SDK
   - Generate request/response schemas, facets, fixtures
   - Unit tests for generators

2. **Search app migration** (2 weeks)
   - Replace runtime schemas with SDK imports
   - Remove duplicate Zod definitions
   - Update API routes to use generated types

3. **Thread and programme factors** (2 weeks)
   - Add thread index and thread fields to documents
   - Add programme factor fields (tier, exam board, pathway, etc.)
   - Implement thread and factor filtering

4. **Validation and refinement** (1-2 weeks)
   - Full quality gate runs
   - E2E testing with new fields
   - Documentation updates

**Exit Criteria**:

- ✅ All schemas generated at type-gen time
- ✅ Thread filtering operational
- ✅ Programme factor filtering operational
- ✅ Quality gates pass
- ✅ Documentation updated

### Phase 2: Ontology Enrichment (Future)

**Duration**: 3-4 weeks

**Features**:

- Unit type classification and filtering
- Structured content guidance with categories
- Lesson component availability filters
- Enhanced facets with thread coverage

**Exit Criteria**:

- Filter by unit type, supervision level, available components
- Facets show thread coverage and unit classifications
- Documentation covers all ontology fields

### Phase 3: Content Depth Expansion (Future)

**Duration**: 4-6 weeks

**Features**:

- Additional indices: lesson_planning, transcripts, content_guidance, assets, assessments
- Richer search responses with augmented content
- Feature-flagged UI enhancements
- Inference-aware ingestion pipelines

**Exit Criteria**:

- Extended indices populated and searchable
- UI showcases richer content cards
- Cost monitoring and alerting operational

### Phase 4: MCP Integration (Future)

**Duration**: 2-3 weeks (depends on aggregated tools refactor)

**Features**:

- Type-gen time MCP tool generation
- Semantic search integrated into MCP `search` tool
- E2E tests with stubbed responses

**Exit Criteria**:

- MCP clients can search curriculum via semantic search
- Generated tools validated by contract tests
- Documentation complete

## Dependencies and Blockers

### Completed Dependencies ✅

- Curriculum ontology documentation (`docs/architecture/curriculum-ontology.md`)
- Cardinal rule architecture defined (`.agent/directives-and-memory/rules.md`)
- Schema-first execution patterns (`.agent/directives-and-memory/schema-first-execution.md`)
- Testing strategy documented (`.agent/directives-and-memory/testing-strategy.md`)

### Active Dependencies

- **SDK type-gen infrastructure**: Must support search schema generation (IN PROGRESS)
- **Elasticsearch sandbox**: Development environment for index testing (AVAILABLE)
- **OpenAI API**: For natural language query parsing (AVAILABLE)

### Future Dependencies

- **Aggregated tools refactor**: Prerequisite for MCP integration (PLANNED)
- **Production Elasticsearch cluster**: Serverless deployment (TBD)
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
pnpm i                                                    # Install dependencies
pnpm type-gen                                            # Generate types from schema
pnpm build                                               # Production build
pnpm type-check                                          # TypeScript validation
pnpm lint -- --fix                                       # ESLint + architectural rules
pnpm -F @oaknational/oak-curriculum-sdk docs:all        # Generate SDK docs
pnpm format                                              # Format code
pnpm markdownlint                                        # Lint markdown
pnpm test                                                # Unit + integration tests
pnpm test:e2e                                            # E2E tests (manual)
```

**Note**: After each code fix, the full quality gate sequence must be run from the beginning to prevent hidden regressions.

## Related Documentation

### Plans

- [Semantic Search Plans Index](./index.md)
- [Search Service Implementation](./search-service/schema-first-ontology-implementation.md)
- [Search UI Implementation](./search-ui/frontend-implementation.md)
- [Schema Migration Map](./search-migration-map.md)
- [Schema Inventory](./search-schema-inventory.md)
- [Generator Specification](./search-generator-spec.md)

### Architecture

- [Curriculum Ontology](../../docs/architecture/curriculum-ontology.md)
- [OpenAPI Pipeline](../../docs/architecture/openapi-pipeline.md)

### Guidance

- [Testing Strategy](../../.agent/directives-and-memory/testing-strategy.md)
- [Schema-First Execution](../../directives-and-memory/schema-first-execution.md)
- [Cardinal Rule](../../directives-and-memory/rules.md)

### Application

- [Semantic Search App README](../../../apps/oak-open-curriculum-semantic-search/README.md)

## Version History

- 2025-11-11: Created from consolidation of high-level-plan.md, context.md, search-migration-map.md
- 2025-11-11: Integrated schema-first migration planning
- 2025-11-11: Added ontology integration timeline
