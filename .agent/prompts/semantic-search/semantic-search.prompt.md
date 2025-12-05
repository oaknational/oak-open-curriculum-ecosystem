# Semantic Search Continuation Prompt

Elasticsearch Serverless deployment is here: <https://poc-open-curriculum-api-search-dd21a1.kb.europe-west1.gcp.elastic.cloud/app/elasticsearch/getting_started>

Use this prompt to continue semantic search implementation work in a fresh chat.

## Foundation Documents (MUST READ FIRST)

Before any work, read and internalise these documents:

1. `.agent/directives-and-memory/rules.md` - Cardinal rule, code design principles, quality gates
2. `.agent/directives-and-memory/testing-strategy.md` - TDD at all levels, test type definitions
3. `.agent/directives-and-memory/schema-first-execution.md` - Schema-first architecture mandate
4. `.agent/directives-and-memory/AGENT.md` - Agent directives and development commands

**Key Principle**: All types, schemas, and validators MUST flow from the OpenAPI schema via `pnpm type-gen`. No runtime schema definitions. All quality gate issues are BLOCKING regardless of location, context, or cause.

## Current State Summary (2025-12-05)

### Completed ✅

| Component                | Status      | Notes                                                                                            |
| ------------------------ | ----------- | ------------------------------------------------------------------------------------------------ |
| Schema-first migration   | ✅ COMPLETE | 13 SDK modules generated at type-gen time                                                        |
| MCP tool generation      | ✅ COMPLETE | 26 tools with full type safety                                                                   |
| ES Serverless deployment | ✅ COMPLETE | Cluster operational at `poc-open-curriculum-api-search-dd21a1.es.europe-west1.gcp.elastic.cloud` |
| Live data ingestion      | ✅ COMPLETE | Full curriculum for maths, english, science, history, geography (all key stages)                 |
| Index metadata           | ✅ COMPLETE | `oak_meta` stores version, timestamps, doc counts automatically                                  |
| Response augmentation    | ✅ COMPLETE | SDK middleware adds `canonicalUrl` to all API responses                                          |
| TypeScript CLI tools     | ✅ COMPLETE | `pnpm es:setup`, `pnpm es:status`, `pnpm es:ingest-live`                                         |
| Build system optimised   | ✅ COMPLETE | Turbo caching enabled, task dependencies fixed (ADR 065)                                         |

### Active Issue 🚨

| Issue                    | Status         | Notes                                                                                         |
| ------------------------ | -------------- | --------------------------------------------------------------------------------------------- |
| `smoke:dev:stub` failing | ⚠️ INVESTIGATE | "Successful tool call must not be flagged as error" - appears to be MCP response format issue |

Most quality gates pass. Smoke test failure needs investigation before Phase 2 can proceed.

### Next Priority

1. **Phase 2: Thread filtering and facets** - Add thread-based search scope and filtering
2. **Programme factors** - Add KS4 tier, exam board, pathway filtering
3. **MCP semantic search tool** - Expose via MCP protocol

---

## Index Inventory

**Active Indexes** (mappings in `src/lib/elasticsearch/definitions/`):

| Index                 | Mapping File               | Purpose                                   |
| --------------------- | -------------------------- | ----------------------------------------- |
| `oak_lessons`         | `oak-lessons.json`         | Lesson documents with semantic embeddings |
| `oak_units`           | `oak-units.json`           | Basic unit metadata                       |
| `oak_unit_rollup`     | `oak-unit-rollup.json`     | Aggregated unit text for semantic search  |
| `oak_sequences`       | `oak-sequences.json`       | Programme sequence documents              |
| `oak_sequence_facets` | `oak-sequence-facets.json` | Sequence facet navigation                 |
| `oak_meta`            | `oak-meta.json`            | Index version and ingestion metadata      |
| `oak_zero_hit_events` | Code-defined (lazy)        | Telemetry for zero-result queries         |

**Future Indexes** (Phase 2-3):

| Index                    | Priority | Purpose                                |
| ------------------------ | -------- | -------------------------------------- |
| `oak_threads`            | HIGH     | Thread-centric search scope            |
| `oak_ontology`           | HIGH     | Domain knowledge RAG                   |
| `oak_lesson_transcripts` | HIGH     | Chunked transcripts for deep retrieval |
| `oak_content_guidance`   | HIGH     | Safeguarding/content warnings          |

---

## SDK Data Imports (Single Source of Truth)

The search app imports domain data from the SDK:

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

---

## Environment Configuration

### Required Environment Variables

**File**: `apps/oak-open-curriculum-semantic-search/.env.local` (create from `.env.example`)

```bash
# Elasticsearch Serverless
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here

# Oak Curriculum SDK
OAK_API_KEY=your_oak_api_key_here

# Search Service
SEARCH_API_KEY=your_search_api_key_here
SEARCH_INDEX_TARGET=primary  # or sandbox

# Dev Server
SEMANTIC_SEARCH_PORT=3003  # Defaults to 3003 to avoid conflicts

# AI Provider (optional)
AI_PROVIDER=openai  # or 'none' to disable NL search
OPENAI_API_KEY=your_openai_api_key_here
```

### CLI Commands

```bash
# Setup and Status
pnpm es:setup          # Create indexes and synonyms
pnpm es:status         # Show connection, version, index info

# Ingestion
pnpm es:ingest-live              # Ingest all common subjects
pnpm es:ingest-live --dry-run    # Preview without writing
pnpm es:ingest-live --subject maths --keystage ks2  # Specific filters

# Development
pnpm dev               # Start dev server on configured port
```

---

## Key Files Reference

### Search Schema Generator

```text
packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-search-index-docs.ts
```

### Generated Search Schemas (13 modules)

```text
packages/sdks/oak-curriculum-sdk/src/types/generated/search/
├── facets.ts               # Search facet types
├── fixtures.ts             # Test fixture builders
├── index-documents.ts      # ES document schemas (includes thread fields)
├── index.ts                # Barrel exports
├── natural-requests.ts     # Natural language search requests
├── parsed-query.ts         # Query parser output types
├── requests.ts             # Structured search requests
├── responses.lessons.ts    # Lesson search responses
├── responses.multi.ts      # Multi-scope composition
├── responses.sequences.ts  # Sequence search responses
├── responses.units.ts      # Unit search responses
├── scopes.ts               # Search scope enumerations
└── suggestions.ts          # Suggestion contracts
```

### Elasticsearch Setup CLI

```text
apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/setup/
├── cli.ts           # Main CLI entry point
├── index.ts         # Setup logic (create indexes, synonyms)
├── ingest-live.ts   # Live SDK data ingestion
└── load-app-env.ts  # Environment loading helper
```

### Index Metadata

```text
apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/index-meta.ts
```

Functions: `readIndexMeta()`, `writeIndexMeta()`, `getIndexVersion()`, `generateVersionFromTimestamp()`

---

## Known Gotchas (ES Serverless Compatibility)

| Issue                                   | Solution                                                                                       |
| --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `_cluster/health` fails                 | ES Serverless doesn't support it. Use root `/` or `/_cat/indices?v`                            |
| `highlight.max_analyzed_offset` fails   | Not supported in Serverless. Remove from mappings                                              |
| `synonym_graph` filter at index time    | Prohibited. Split analyzers: `oak_text_index` (no synonyms), `oak_text_search` (with synonyms) |
| `optional: true` on completion contexts | Not supported. Remove from context definitions                                                 |
| `number_of_shards/replicas` settings    | Not supported in Serverless. Remove from mappings                                              |
| Env vars not loading in CLI             | Use `loadAppEnv()` helper with `override: true` for dotenv                                     |
| Port 3000 conflicts                     | Use `SEMANTIC_SEARCH_PORT=3003` (default)                                                      |

---

## Quality Gates (MUST RUN AFTER EACH CHANGE)

```bash
# From repo root, one at a time, all must pass
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix        # or `pnpm lint` for verification without fixes
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**Shorthand commands**:

- `pnpm make` - Build, lint:fix, format (for development)
- `pnpm qg` - Full quality gate verification (for CI)
- `pnpm check` - Clean rebuild + full QG (thorough verification)

**CRITICAL**: All quality gate issues are BLOCKING regardless of location, context, or cause. There is no such thing as an acceptable failure. There is no such thing as "someone else's problem".

**Build System**: See `docs/development/build-system.md` and ADR 065 for Turbo task dependencies.

---

## TDD Workflow Reminder

1. **RED**: Write failing test first
2. **GREEN**: Write minimal code to make test pass
3. **REFACTOR**: Clean up while keeping tests green

**Testing Strategy**:

- **Unit tests** (`.unit.test.ts`): Pure functions, no IO, no mocks
- **Integration tests** (`.integration.test.ts`): Code integration, simple mocks injected as arguments
- **E2E tests** (`.e2e.test.ts`): Running system, File System/STDIO IO only (NO network)
- **Smoke tests** (`.smoke.test.ts`): Running system with ALL IO types including network

---

## Pending Todos by Phase

### Phase 2: Core Ontology - Threads and Programme Factors

| Todo ID               | Description                                   | Status  |
| --------------------- | --------------------------------------------- | ------- |
| phase-1-thread-filter | Add thread filtering and facets to search     | pending |
| phase-1-programme     | Add programme factor fields and KS4 filtering | pending |

### Phase 3: Ontology Enrichment

| Todo ID            | Description                                             | Status  |
| ------------------ | ------------------------------------------------------- | ------- |
| phase-2-unit-type  | Implement unit type classification                      | pending |
| phase-2-guidance   | Add structured content guidance with supervision levels | pending |
| phase-2-components | Add lesson component availability flags                 | pending |

### Phase 4: RAG and Ontology Index

| Todo ID                | Description                                    | Status  |
| ---------------------- | ---------------------------------------------- | ------- |
| phase-3-ontology-index | Create ontology index for domain knowledge RAG | pending |

### Phase 5: MCP Connectivity

| Todo ID              | Description                                | Status  |
| -------------------- | ------------------------------------------ | ------- |
| phase-4-mcp-semantic | Add aggregated semantic-search MCP tool    | pending |
| phase-4-search-mode  | Add mode parameter to existing search tool | pending |

### Phase 6: OpenAI App Widget

| Todo ID                   | Description                              | Status  |
| ------------------------- | ---------------------------------------- | ------- |
| phase-5-search-renderer   | Enhance widget search renderer           | pending |
| phase-5-standalone-widget | Create standalone semantic search widget | pending |

---

## Architecture Alignment

### Cardinal Rule

> ALL static data structures, types, type guards, Zod schemas, and validators MUST flow from the Open Curriculum OpenAPI schema in the SDK, generated at build/compile time. Running `pnpm type-gen` MUST be sufficient to align all workspaces with schema changes.

### Schema-First Execution

> The definitive source of truth for all data shapes is the OpenAPI schema. Types, validators, and runtime behaviour MUST derive from this schema at compile time.

### Testing Strategy

- E2E tests CAN trigger File System and STDIO IO but **NOT network IO**
- Smoke tests CAN trigger all IO types including network
- No complex mocks - simple fakes injected as arguments
- Each test must prove something useful about the product code

---

## Plan Documents

For detailed implementation plans, see:

- `.agent/plans/semantic-search/semantic-search-overview.md` - High-level strategy and phases
- `.agent/plans/semantic-search/search-service/schema-first-ontology-implementation.md` - Backend implementation
- `.agent/plans/semantic-search/search-ui/frontend-implementation.md` - Frontend implementation
- `.agent/plans/semantic-search/search-generator-spec.md` - Generated SDK artifacts

### Reference Documentation

- `.agent/reference-docs/elasticsearch/README.md` - ES documentation index
- `.agent/reference-docs/elasticsearch/elastic-search-serverless-docs.md` - Serverless concepts
- `.agent/reference-docs/elasticsearch/elastic-cloud-serverless-api-usage.md` - API examples

### Research

- `.agent/research/elasticsearch/semantic-search-plans-review.md`
- `.agent/research/elasticsearch/expanded-architecture-analysis.md`
- `.agent/research/elasticsearch/ontology-implementation-gaps.md`

---

## Success Metrics

| Phase | Metric              | Target                     | Status                    |
| ----- | ------------------- | -------------------------- | ------------------------- |
| 0     | ES connection       | Successful                 | ✅ COMPLETE               |
| 0     | Live ingestion      | Full curriculum data       | ✅ COMPLETE               |
| 0     | Index metadata      | Automatic version tracking | ✅ COMPLETE               |
| 1     | Thread search       | Returns results            | pending                   |
| 1     | Programme filtering | KS4 filters work           | pending                   |
| 2     | Unit classification | 100% coverage              | pending                   |
| 2     | Component filtering | All 8 flags                | pending                   |
| 3     | Ontology RAG        | Answers domain questions   | pending                   |
| 4     | MCP semantic-search | Tool functional            | pending                   |
| 5     | Widget tests        | 100% pass rate             | pending                   |
| All   | Quality gates       | All pass                   | ⚠️ smoke:dev:stub failing |

---

## Immediate Next Steps

1. **Fix smoke:dev:stub failure** (BLOCKING):
   - Investigate "Successful tool call must not be flagged as error"
   - Check MCP server response format in `extractToolPayload()`
   - Ensure all quality gates pass before proceeding

2. **Continue Phase 2 - Thread Filter (RED phase)**:
   - Write failing tests for thread filtering and facets
   - Define expected behaviour for thread-based search scope

3. **Programme Factor Implementation**:
   - Add tier, exam board, pathway fields to schemas
   - Implement KS4-specific filtering

4. **Run quality gates** after each change - all must pass

---

## Version History

- 2025-12-05: Build system optimised - Turbo caching enabled, task dependencies fixed (ADR 065)
- 2025-12-05: Added lint:fix task to all workspaces
- 2025-12-05: Identified smoke:dev:stub failure (MCP response format issue)
- 2025-12-04: Consolidated from `semantic-search-implementation.prompt.md` and `elasticsearch-serverless-deployment.prompt.md`
- 2025-12-04: Live curriculum data ingestion COMPLETE
- 2025-12-04: Index metadata tracking (`oak_meta`) COMPLETE
- 2025-12-04: Response augmentation middleware COMPLETE
- 2025-12-04: TypeScript CLI tools for ES setup/status/ingestion COMPLETE
- 2025-12-04: Dev server port configuration added
