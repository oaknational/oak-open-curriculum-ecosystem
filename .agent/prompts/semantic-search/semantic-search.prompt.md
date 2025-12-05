# Semantic Search Continuation Prompt

Use this prompt to continue semantic search implementation work in a fresh chat.

## Foundation Documents (MUST READ FIRST)

Before any work, read and internalise these documents:

1. `.agent/directives-and-memory/rules.md` - Cardinal rule, code design principles, quality gates
2. `.agent/directives-and-memory/testing-strategy.md` - TDD at all levels, test type definitions
3. `.agent/directives-and-memory/schema-first-execution.md` - Schema-first architecture mandate
4. `.agent/directives-and-memory/AGENT.md` - Agent directives and development commands

**Key Principles**:

- All types, schemas, and validators MUST flow from the OpenAPI schema via `pnpm type-gen`. No runtime schema definitions.
- All quality gate issues are BLOCKING regardless of location, context, or cause.
- TDD at all levels: Write tests FIRST (Red → Green → Refactor).
- No type assertions (`as`, `any`, `!`), no type shortcuts. Use type guards.

---

## Elasticsearch Serverless Deployment

**Kibana UI**: <https://poc-open-curriculum-api-search-dd21a1.kb.europe-west1.gcp.elastic.cloud/app/elasticsearch/getting_started>

**Cluster Endpoint**: `https://poc-open-curriculum-api-search-dd21a1.es.europe-west1.gcp.elastic.cloud:443`

### Inference Endpoints (Auto-Configured)

ES Serverless provides preconfigured inference endpoints. The `semantic_text` field type automatically uses ELSER:

| Endpoint                               | Type             | Usage                                       |
| -------------------------------------- | ---------------- | ------------------------------------------- |
| `.elser-2-elastic`                     | sparse_embedding | **AUTO-ASSIGNED** to `semantic_text` fields |
| `.elser-2-elasticsearch`               | sparse_embedding | ML Nodes fallback                           |
| `.multilingual-e5-small-elasticsearch` | text_embedding   | Dense embeddings (alternative)              |
| `.rerank-v1-elasticsearch`             | rerank           | Result re-ranking (tech preview)            |

---

## Current State Summary (2025-12-05)

### Completed ✅

| Component                | Status      | Notes                                                            |
| ------------------------ | ----------- | ---------------------------------------------------------------- |
| Schema-first migration   | ✅ COMPLETE | 13 SDK modules generated at type-gen time                        |
| MCP tool generation      | ✅ COMPLETE | 26 tools with full type safety                                   |
| ES Serverless deployment | ✅ COMPLETE | Cluster operational, indexes created, synonyms deployed          |
| Index mappings verified  | ✅ COMPLETE | All mappings match local JSON definitions in ES UI               |
| Analyzer configuration   | ✅ COMPLETE | Split analyzers working (ES Serverless compatible)               |
| Synonym set deployed     | ✅ COMPLETE | `oak-syns` with 68 rules from SDK `buildElasticsearchSynonyms()` |
| Response augmentation    | ✅ COMPLETE | SDK middleware adds `canonicalUrl` to all API responses          |
| TypeScript CLI tools     | ✅ COMPLETE | `pnpm es:setup`, `pnpm es:status`, `pnpm es:ingest-live`         |
| Build system optimised   | ✅ COMPLETE | Turbo caching enabled, task dependencies fixed (ADR 065)         |
| Quality gates passing    | ✅ COMPLETE | All gates pass including `smoke:dev:stub`                        |
| SDK response caching     | ✅ COMPLETE | Optional Redis caching with 404 fallbacks for 100% hit rate      |

### Current Priority: Real Data Ingestion

| Task                    | Status         | Notes                                                 |
| ----------------------- | -------------- | ----------------------------------------------------- |
| Clear test/fake data    | ✅ DONE        | Indexes recreated with 0 docs                         |
| History KS2 test ingest | ✅ DONE        | 153 docs, 226 cached items, 100% cache hits on rerun  |
| Ingest real Maths data  | ⏳ IN PROGRESS | Run `pnpm es:ingest-live --subject maths --verbose`   |
| Validate search results | ⏳ PENDING     | Test queries in ES Playground after ingestion         |
| Phase 2: Threads        | ⏳ PENDING     | Add thread filtering and facets after data validation |

### Decision: Data First, Additional Indexes Later

**Approach confirmed:**

1. Use current index structure as-is
2. Clear fake data, ingest real Maths curriculum (all key stages)
3. Validate search quality with real data
4. Add additional indexes (threads, ontology) in Phase 2-3

---

## SDK Response Caching (Development Optimisation)

Optional Redis-based caching speeds up repeated ingestion runs during development.

**See**: `apps/oak-open-curriculum-semantic-search/docs/SDK-CACHING.md` for full documentation.

### Quick Start

```bash
cd apps/oak-open-curriculum-semantic-search

# Start Redis (persistent storage)
pnpm redis:up

# Enable caching in .env.local
echo "SDK_CACHE_ENABLED=true" >> .env.local

# First run: cache miss (normal speed)
pnpm es:ingest-live --subject maths --dry-run --verbose

# Second run: cache hit (10-20x faster!)
pnpm es:ingest-live --subject maths --dry-run --verbose

# Clear cache when needed
pnpm es:ingest-live --subject maths --clear-cache --dry-run
```

### Cache Configuration

| Variable              | Default                  | Description          |
| --------------------- | ------------------------ | -------------------- |
| `SDK_CACHE_ENABLED`   | `false`                  | Enable/disable cache |
| `SDK_CACHE_REDIS_URL` | `redis://localhost:6379` | Redis connection URL |
| `SDK_CACHE_TTL_DAYS`  | `7`                      | Cache TTL in days    |

### 404 Fallback Caching

Transcripts are optional (lessons without video return 404). The cache stores empty fallbacks for 404s, enabling 100% cache hit rates on subsequent runs:

- **First run**: Fetches from API, caches both successes AND 404 fallbacks
- **Second run**: 100% cache hits (e.g., 226 hits, 0 misses, ~4s vs ~70s)

**Architecture**: See [ADR-066](docs/architecture/architectural-decisions/066-sdk-response-caching.md)

---

## Index Inventory

### Active Indexes (mappings in `src/lib/elasticsearch/definitions/`)

| Index                 | Mapping File               | Purpose                                   | Semantic Field    |
| --------------------- | -------------------------- | ----------------------------------------- | ----------------- |
| `oak_lessons`         | `oak-lessons.json`         | Lesson documents with semantic embeddings | `lesson_semantic` |
| `oak_unit_rollup`     | `oak-unit-rollup.json`     | Aggregated unit text for semantic search  | `unit_semantic`   |
| `oak_units`           | `oak-units.json`           | Basic unit metadata                       | -                 |
| `oak_sequences`       | `oak-sequences.json`       | Programme sequence documents              | -                 |
| `oak_sequence_facets` | `oak-sequence-facets.json` | Sequence facet navigation                 | -                 |
| `oak_meta`            | `oak-meta.json`            | Index version and ingestion metadata      | -                 |

### Future Indexes (Phase 2-3)

| Index                    | Priority | Purpose                                |
| ------------------------ | -------- | -------------------------------------- |
| `oak_threads`            | HIGH     | Thread-centric search scope            |
| `oak_ontology`           | HIGH     | Domain knowledge RAG                   |
| `oak_lesson_transcripts` | HIGH     | Chunked transcripts for deep retrieval |
| `oak_content_guidance`   | HIGH     | Safeguarding/content warnings          |

---

## MCP Dev Server for Content Exploration

The MCP server runs locally and can be used to explore curriculum content before ingestion:

```bash
cd apps/oak-curriculum-mcp-streamable-http
pnpm dev
# Server at http://localhost:3333/mcp
```

**Key tools for understanding indexable content:**

| Tool                             | Purpose                 |
| -------------------------------- | ----------------------- |
| `get-subjects`                   | List all subjects       |
| `get-subjects-sequences`         | Sequences for a subject |
| `get-sequences-units`            | Units in a sequence     |
| `get-key-stages-subject-lessons` | Lessons by KS+subject   |
| `get-lessons-summary`            | Lesson detail           |
| `get-lessons-transcript`         | Lesson transcripts      |
| `get-units-summary`              | Unit detail             |
| `get-threads`                    | All curriculum threads  |
| `get-threads-units`              | Units within a thread   |

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

# SDK Response Caching (optional, for development)
SDK_CACHE_ENABLED=false    # Set to 'true' to enable
SDK_CACHE_REDIS_URL=redis://localhost:6379
SDK_CACHE_TTL_DAYS=7

# AI Provider (optional)
AI_PROVIDER=openai  # or 'none' to disable NL search
OPENAI_API_KEY=your_openai_api_key_here
```

### CLI Commands

```bash
cd apps/oak-open-curriculum-semantic-search

# Setup and Status
pnpm es:setup          # Create indexes and synonyms (clears existing data)
pnpm es:status         # Show connection, version, index info

# Ingestion
pnpm es:ingest-live                              # Ingest all common subjects
pnpm es:ingest-live --dry-run                    # Preview without writing
pnpm es:ingest-live --subject maths --verbose    # Maths only, verbose output
pnpm es:ingest-live --subject maths --keystage ks2  # Specific filters
pnpm es:ingest-live --clear-cache                # Clear SDK cache before run

# Caching (requires Redis)
pnpm redis:up                                    # Start Redis for caching
pnpm redis:down                                  # Stop Redis (keeps data)
pnpm redis:reset                                 # Stop Redis, delete cache
pnpm redis:status                                # Check Redis status

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

### Index Definitions

```text
apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/definitions/
├── index.ts              # Index configuration exports
├── oak-lessons.json      # Lesson index mapping
├── oak-units.json        # Unit index mapping
├── oak-unit-rollup.json  # Unit rollup mapping
├── oak-sequences.json    # Sequence mapping
├── oak-sequence-facets.json  # Sequence facets mapping
└── oak-meta.json         # Metadata index mapping
```

### SDK Caching

```text
apps/oak-open-curriculum-semantic-search/
├── docker-compose.yml                        # Redis container for caching
├── docs/SDK-CACHING.md                       # User documentation
└── src/adapters/
    ├── oak-adapter-cached.ts                 # Cached SDK client implementation
    └── oak-adapter-cached.unit.test.ts       # Unit tests for pure functions
```

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
| Missing lesson transcripts (404)        | Handled gracefully - 404s cached as empty fallbacks for 100% cache hit rate                    |

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

**CRITICAL**: All quality gate issues are BLOCKING regardless of location, context, or cause.

---

## Immediate Next Steps

### Step 1: Complete Maths Ingestion

```bash
cd apps/oak-open-curriculum-semantic-search

# Optional: Enable caching for faster re-runs
pnpm redis:up
# Add SDK_CACHE_ENABLED=true to .env.local

# Ingest real Maths curriculum data
pnpm es:ingest-live --subject maths --verbose

# Verify in ES UI or via status
pnpm es:status
```

### Step 2: Validate Search Quality

1. Use ES Kibana Playground to test semantic queries
2. Verify `semantic_text` fields return relevant results
3. Test synonym expansion (e.g., "fractions" should match "fraction" content)

### Step 3: Phase 2 - Thread Filtering (After validation)

1. Write failing tests for thread filtering
2. Add thread fields to search requests/responses
3. Implement thread-based facets

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

## Architectural Decision Records

Relevant ADRs for semantic search:

| ADR                                                                                             | Title                   | Description                                       |
| ----------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------- |
| [ADR-063](docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) | SDK Domain Synonyms     | SDK as single source of truth for domain synonyms |
| [ADR-064](docs/architecture/architectural-decisions/064-elasticsearch-mapping-organization.md)  | ES Mapping Organization | Elasticsearch index mapping organization          |
| [ADR-065](docs/architecture/architectural-decisions/065-turbo-task-dependencies.md)             | Turbo Task Dependencies | Build system optimisation                         |
| [ADR-066](docs/architecture/architectural-decisions/066-sdk-response-caching.md)                | SDK Response Caching    | Optional Redis caching for development            |

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

---

## Version History

- 2025-12-05: 404 fallback caching - transcript 404s cached for 100% hit rate (226 hits, 0 misses)
- 2025-12-05: SDK response caching implemented (ADR 066) - Redis-based, optional, 7-day TTL
- 2025-12-05: History KS2 test ingestion successful - 153 docs, 226 cached items
- 2025-12-05: ES UI review complete - verified mappings, analyzers, synonyms, inference endpoints
- 2025-12-05: Decision: Real data first, additional indexes later
- 2025-12-05: All quality gates passing (including smoke:dev:stub)
- 2025-12-05: Build system optimised - Turbo caching enabled, task dependencies fixed (ADR 065)
- 2025-12-04: Live curriculum data ingestion COMPLETE (test data)
- 2025-12-04: Index metadata tracking (`oak_meta`) COMPLETE
- 2025-12-04: Response augmentation middleware COMPLETE
- 2025-12-04: TypeScript CLI tools for ES setup/status/ingestion COMPLETE
