# Semantic Search Implementation Continuation Prompt

Use this prompt to continue the semantic search implementation work in a fresh chat.

## Foundation Documents (MUST READ FIRST)

Before any work, read and internalize these documents:

1. `.agent/directives-and-memory/rules.md` - Cardinal rule and code design principles
2. `.agent/directives-and-memory/testing-strategy.md` - TDD at all levels
3. `.agent/directives-and-memory/schema-first-execution.md` - Schema-first architecture

**Key Principle**: All types, schemas, and validators MUST flow from the OpenAPI schema via `pnpm type-gen`. No runtime schema definitions.

## Current State Summary

### Completed ✅

- **Schema-first migration**: All 13 search schema modules generated in SDK
- **MCP tool generation**: 26 tools with full type safety
- **Plan documentation**: Updated to reflect current state, obsolete docs archived
- **E2E test for ES connection**: Written at `apps/oak-open-curriculum-semantic-search/tests/e2e/es-connection.e2e.test.ts`
- **ES setup documentation**: Created at `apps/oak-open-curriculum-semantic-search/docs/ES_SERVERLESS_SETUP.md`

### Critical Blockers 🚨

- **ES Serverless NOT provisioned**: All testing is against fixtures only
- **No data ingested**: Index mappings defined but no real data

### Work In Progress

**Phase 1.1: Thread Index Implementation** - Unit tests written (failing - RED phase)

Tests added to `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-search-modules.unit.test.ts`:

- `emits thread index document schema with required fields`
- `emits thread fields embedded in lesson index schema`
- `emits thread fields embedded in unit index schema`
- `emits thread fields embedded in unit rollup schema`
- `exports thread schema in docs module`

**Next Step**: Implement the generator changes in `generate-search-index-docs.ts` to make tests pass (GREEN phase).

## Pending Todos

### Phase 0: ES Deployment (BLOCKING)

| Todo ID        | Description                                             | Status  |
| -------------- | ------------------------------------------------------- | ------- |
| phase-0-es     | Provision ES Serverless instance and configure API keys | pending |
| phase-0-ingest | Create indexes and run initial ingestion with real data | pending |

**Note**: These require manual infrastructure work via Elastic Cloud console. See `apps/oak-open-curriculum-semantic-search/docs/ES_SERVERLESS_SETUP.md`.

### Phase 1: Core Ontology - Threads and Programme Factors

| Todo ID               | Description                                                      | Status      |
| --------------------- | ---------------------------------------------------------------- | ----------- |
| phase-1-threads       | Implement thread index, embedded fields, and thread search scope | in_progress |
| phase-1-thread-filter | Add thread filtering and facets to search                        | pending     |
| phase-1-programme     | Add programme factor fields and KS4 filtering                    | pending     |

**Acceptance Criteria for phase-1-threads**:

- `SearchThreadIndexDocSchema` generated at type-gen time
- Thread fields (`thread_slugs`, `thread_titles`) in `SearchLessonsIndexDoc`, `SearchUnitsIndexDoc`, `SearchUnitRollupDoc`
- Type guard `isSearchThreadIndexDoc` generated
- Doc re-exports include thread schema
- Quality gates pass

### Phase 2: Ontology Enrichment

| Todo ID            | Description                                                     | Status  |
| ------------------ | --------------------------------------------------------------- | ------- |
| phase-2-unit-type  | Implement unit type classification (simple/variant/optionality) | pending |
| phase-2-guidance   | Add structured content guidance with supervision levels         | pending |
| phase-2-components | Add lesson component availability flags                         | pending |

### Phase 3: RAG and Ontology Index

| Todo ID                | Description                                    | Status  |
| ---------------------- | ---------------------------------------------- | ------- |
| phase-3-ontology-index | Create ontology index for domain knowledge RAG | pending |

### Phase 4: MCP Connectivity

| Todo ID              | Description                                | Status  |
| -------------------- | ------------------------------------------ | ------- |
| phase-4-mcp-semantic | Add aggregated semantic-search MCP tool    | pending |
| phase-4-search-mode  | Add mode parameter to existing search tool | pending |

### Phase 5: OpenAI App Widget

| Todo ID                   | Description                                                  | Status  |
| ------------------------- | ------------------------------------------------------------ | ------- |
| phase-5-search-renderer   | Enhance widget search renderer for semantic search results   | pending |
| phase-5-standalone-widget | Create standalone semantic search widget with interactive UI | pending |
| phase-5-widget-cta        | Register widget resource and add Search Curriculum CTA       | pending |
| phase-5-widget-preview    | Update widget preview server for semantic search testing     | pending |

### Phase 6: Semantic Search App UI

| Todo ID              | Description                                                   | Status  |
| -------------------- | ------------------------------------------------------------- | ------- |
| phase-6-thread-ui    | Add thread UI to semantic search app (filters, scope, badges) | pending |
| phase-6-programme-ui | Add programme factor UI for KS4 (tier, exam board dropdowns)  | pending |
| phase-6-ontology-ui  | Add ontology enrichment UI (unit types, guidance, components) | pending |

## Key Files to Reference

### Search Schema Generator

```
packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-search-index-docs.ts
```

This file generates the index document schemas. Currently needs thread schema additions.

### Generated Search Schemas

```
packages/sdks/oak-curriculum-sdk/src/types/generated/search/index-documents.ts
```

Output of the generator - check this to see current state.

### Unit Tests (RED phase - failing)

```
packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-search-modules.unit.test.ts
```

Contains the failing tests for thread index that need to pass.

### ES Connection E2E Test

```
apps/oak-open-curriculum-semantic-search/tests/e2e/es-connection.e2e.test.ts
```

Ready to verify ES connection once provisioned.

### Plan Documentation

```
.agent/plans/semantic-search/semantic-search-overview.md
.agent/plans/semantic-search/index.md
```

### Research Documents

```
.agent/research/elasticsearch/semantic-search-plans-review.md
.agent/research/elasticsearch/expanded-architecture-analysis.md
.agent/research/elasticsearch/ontology-implementation-gaps.md
```

## Quality Gates (MUST RUN AFTER EACH CHANGE)

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint -- --fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

## TDD Workflow Reminder

1. **RED**: Write failing test first
2. **GREEN**: Write minimal code to make test pass
3. **REFACTOR**: Clean up while keeping tests green

Current state: RED phase for thread index (tests written, need implementation)

## Immediate Next Steps

1. **Complete phase-1-threads (GREEN phase)**:
   - Update `generate-search-index-docs.ts` to add:
     - `SearchThreadIndexDocSchema` with fields: `thread_slug`, `thread_title`, `unit_count`, `subject_slugs`, `thread_semantic`, `thread_url`, `title_suggest`
     - Thread fields in lesson schema: `thread_slugs`, `thread_titles`
     - Thread fields in unit/unit_rollup schemas: `thread_slugs`, `thread_titles`, `thread_orders`
   - Update doc re-exports

2. **Run quality gates** to verify changes

3. **Continue with phase-1-thread-filter** (write tests first - RED)

## Thread Data Structure Reference

From the API:

- Thread: `{ title: string, slug: string, canonicalUrl?: string }`
- Thread units: `{ unitTitle: string, unitSlug: string, unitOrder: number, canonicalUrl?: string }`

For search index:

- `thread_slug`: Primary identifier
- `thread_title`: Display name
- `unit_count`: Number of units in thread
- `subject_slugs`: Subjects this thread spans
- `thread_semantic`: Optional semantic text for embeddings
- `thread_url`: Canonical URL
- `title_suggest`: Completion suggester payload

## Widget Implementation Notes (Phase 5)

Two widgets to implement:

1. **Enhanced search renderer** - Rich display of semantic search results
2. **Standalone semantic search widget** - Interactive search UI within ChatGPT

Widget architecture files:

```
apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/search-renderer.ts
apps/oak-curriculum-mcp-streamable-http/src/widget-renderer-registry.ts
apps/oak-curriculum-mcp-streamable-http/src/widget-cta/registry.ts
```

The standalone widget will use `window.openai.callTool()` to invoke the `semantic-search` MCP tool.

## Success Metrics

| Phase | Metric              | Target                   |
| ----- | ------------------- | ------------------------ |
| 0     | ES connection       | Successful               |
| 0     | First ingestion     | >1000 documents          |
| 1     | Thread search       | Returns results          |
| 1     | Programme filtering | KS4 filters work         |
| 2     | Unit classification | 100% coverage            |
| 2     | Component filtering | All 8 flags              |
| 3     | Ontology RAG        | Answers domain questions |
| 4     | MCP semantic-search | Tool functional          |
| 5     | Widget tests        | 100% pass rate           |
| All   | Quality gates       | All pass                 |
