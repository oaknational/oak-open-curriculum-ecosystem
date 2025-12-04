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
- **ES setup documentation**: Created at `apps/oak-open-curriculum-semantic-search/docs/ES_SERVERLESS_SETUP.md`
- **Thread index schemas**: `SearchThreadIndexDocSchema` with all fields, thread fields embedded in lessons/units/rollup schemas, type guards generated
- **Quality gates**: All 11 gates pass

### Critical Blockers 🚨

- **ES Serverless NOT provisioned**: All testing is against fixtures only
- **No data ingested**: Index mappings defined but no real data

### Index Inventory

**Current Indexes** (mappings in `src/lib/elasticsearch/definitions/`):

| Index                 | Mapping File                  | Status    |
| --------------------- | ----------------------------- | --------- |
| `oak_lessons`         | ✅ `oak-lessons.json`         | Active    |
| `oak_unit_rollup`     | ✅ `oak-unit-rollup.json`     | Active    |
| `oak_units`           | ✅ `oak-units.json`           | Active    |
| `oak_sequences`       | ✅ `oak-sequences.json`       | Active    |
| `oak_sequence_facets` | ✅ `oak-sequence-facets.json` | Active    |
| `oak_zero_hit_events` | Code-defined (lazy)           | Telemetry |

**Future Indexes** (Phase 2-3):

| Index                    | Priority | Purpose                                   |
| ------------------------ | -------- | ----------------------------------------- |
| `oak_threads`            | HIGH     | Thread-centric search scope               |
| `oak_ontology`           | HIGH     | Domain knowledge RAG                      |
| `oak_lesson_transcripts` | HIGH     | Chunked transcripts for deep retrieval    |
| `oak_content_guidance`   | HIGH     | Safeguarding/content warnings (filtering) |
| `oak_lesson_planning`    | MEDIUM   | Pedagogical context search                |
| `oak_assets`             | MEDIUM   | Resource discovery                        |

See `elasticsearch-serverless-deployment.prompt.md` (same directory) for deployment guide.

### SDK Data Imports (Single Source of Truth)

The search app should import domain data from the SDK:

```typescript
import {
  ontologyData, // Curriculum domain model, synonyms
  conceptGraph, // Knowledge graph structure
  buildElasticsearchSynonyms, // ES synonym set object
  buildSynonymLookup, // Term → canonical map
  serialiseElasticsearchSynonyms, // JSON string for ES API
} from '@oaknational/oak-curriculum-sdk/public/mcp-tools';
```

**Key imports**:

- `ontologyData.synonyms` → All domain synonyms (subjects, key stages, topics)
- `ontologyData.curriculumStructure` → Validate keyStage/subject slugs
- `conceptGraph.concepts` → Build ontology index documents
- `conceptGraph.edges` → Knowledge graph traversal
- `buildElasticsearchSynonyms()` → Returns `{ synonyms_set: ElasticsearchSynonymEntry[] }`
- `serialiseElasticsearchSynonyms()` → JSON string for ES `_synonyms` API

### Architecture Corrections

**E2E Test Removal**: The ES connection test was **removed** from `tests/e2e/` because it made network calls to Elasticsearch. Per the testing strategy:

- **E2E tests**: CAN trigger File System and STDIO IO but **NOT network IO**
- **Smoke tests**: CAN trigger all IO types including network

When ES Serverless is provisioned, a proper **smoke test** should be created in `smoke-tests/` directory.

**Synonym Consolidation**: Domain synonyms are now managed in the SDK as the single source of truth:

- SDK location: `ontologyData.synonyms` in `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- Export utilities: `packages/sdks/oak-curriculum-sdk/src/mcp/synonym-export.ts`
- ES synonyms generator: `apps/oak-open-curriculum-semantic-search/scripts/generate-synonyms.ts`
- Static `synonyms.json` was **deleted** - synonyms are now generated dynamically

**Mapping Files Relocation**: ES index mappings moved from `scripts/mappings/` to `src/lib/elasticsearch/definitions/` for proper code organization.

**SDK Build Entry Point**: `src/mcp/synonym-export.ts` must be in `tsup.config.ts` entry array for runtime JS to compile.

### Work In Progress

**Phase 1.1: Thread Index Implementation** - COMPLETE (GREEN phase)

All tests passing in `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-search-modules.unit.test.ts`:

- `emits thread index document schema with required fields` ✅
- `emits thread fields embedded in lesson index schema` ✅
- `emits thread fields embedded in unit index schema` ✅
- `emits thread fields embedded in unit rollup schema` ✅
- `exports thread schema in docs module` ✅

**Next Step**: Continue with phase-1-thread-filter (write tests first - RED phase).

## Pending Todos

### Phase 0: ES Deployment (BLOCKING)

| Todo ID        | Description                                             | Status  |
| -------------- | ------------------------------------------------------- | ------- |
| phase-0-es     | Provision ES Serverless instance and configure API keys | pending |
| phase-0-ingest | Create indexes and run initial ingestion with real data | pending |

**Note**: These require manual infrastructure work via Elastic Cloud console. See `apps/oak-open-curriculum-semantic-search/docs/ES_SERVERLESS_SETUP.md`.

### Phase 1: Core Ontology - Threads and Programme Factors

| Todo ID               | Description                                                      | Status   |
| --------------------- | ---------------------------------------------------------------- | -------- |
| phase-1-threads       | Implement thread index, embedded fields, and thread search scope | COMPLETE |
| phase-1-thread-filter | Add thread filtering and facets to search                        | pending  |
| phase-1-programme     | Add programme factor fields and KS4 filtering                    | pending  |

**Acceptance Criteria for phase-1-threads** (ALL MET ✅):

- `SearchThreadIndexDocSchema` generated at type-gen time ✅
- Thread fields (`thread_slugs`, `thread_titles`) in `SearchLessonsIndexDoc`, `SearchUnitsIndexDoc`, `SearchUnitRollupDoc` ✅
- Type guard `isSearchThreadIndexDoc` generated ✅
- Doc re-exports include thread schema ✅
- Quality gates pass ✅

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

```text
packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-search-index-docs.ts
```

This file generates the index document schemas. Currently needs thread schema additions.

### Generated Search Schemas

```text
packages/sdks/oak-curriculum-sdk/src/types/generated/search/index-documents.ts
```

Output of the generator - check this to see current state.

### Unit Tests (GREEN - all passing)

```text
packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-search-modules.unit.test.ts
```

Contains tests for thread index (all passing).

### Plan Documentation

```text
.agent/plans/semantic-search/semantic-search-overview.md
.agent/plans/semantic-search/index.md
```

### Research Documents

```text
.agent/research/elasticsearch/semantic-search-plans-review.md
.agent/research/elasticsearch/expanded-architecture-analysis.md
.agent/research/elasticsearch/ontology-implementation-gaps.md
```

## Known Gotchas

| Issue                              | Solution                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------- |
| SDK exports not found at runtime   | Ensure new files are added to `packages/sdks/oak-curriculum-sdk/tsup.config.ts` entry array |
| `typeSafeEntries` returns `never`  | Don't iterate dynamically over union keys; process each group explicitly                    |
| E2E tests fail with network errors | E2E tests CANNOT access network - use smoke tests for ES connectivity                       |
| Mapping files not found            | Mappings are in `src/lib/elasticsearch/definitions/`, NOT `scripts/mappings/`               |
| Synonyms file not found            | Static `synonyms.json` was deleted - synonyms generate from SDK at runtime                  |

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

Current state: Thread index COMPLETE, ready for phase-1-thread-filter

## Immediate Next Steps

1. **Start phase-1-thread-filter (RED phase)**:
   - Write failing tests for thread filtering and facets
   - Define expected behaviour for thread-based search scope

2. **Run quality gates** after each change

3. **When ES is provisioned (Phase 0)**:
   - Create `smoke-tests/` directory in semantic search app
   - Add ES connection smoke test (NOT E2E - smoke tests CAN access network)

## Lesson Components (OPTIONAL)

**Critical**: Not all lessons have all components. Code must handle missing components gracefully.

| Component            | Availability   | Notes                      |
| -------------------- | -------------- | -------------------------- |
| Curriculum info      | Always present | Lesson metadata            |
| Slide deck           | Optional       | Presentation slides        |
| Video                | Optional       | Not all lessons have video |
| Transcript           | Optional       | Only if video exists       |
| Starter quiz         | Optional       | Prior knowledge assessment |
| Exit quiz            | Optional       | Learning assessment        |
| Worksheet            | Optional       | Practice tasks             |
| Additional materials | Optional       | Supplementary resources    |

**Implications for Search Indexes**:

- `oak_lesson_transcripts` index will NOT contain all lessons
- Component availability flags should be indexed for filtering
- Queries should not assume all lessons have transcripts/quizzes

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

```text
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
