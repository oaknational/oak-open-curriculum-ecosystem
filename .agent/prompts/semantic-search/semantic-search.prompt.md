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
- **No console statements** - Use `@oaknational/mcp-logger` throughout. ESLint should block console usage.

**Re-read foundation documents regularly during work to maintain alignment.**

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
| Analyzer configuration   | ✅ COMPLETE | Split analyzers working (ES Serverless compatible)               |
| Synonym set deployed     | ✅ COMPLETE | `oak-syns` with 68 rules from SDK `buildElasticsearchSynonyms()` |
| Response augmentation    | ✅ COMPLETE | SDK middleware adds `canonicalUrl` to all API responses          |
| TypeScript CLI tools     | ✅ COMPLETE | `pnpm es:setup`, `pnpm es:status`, `pnpm es:ingest-live`         |
| Build system optimised   | ✅ COMPLETE | Turbo caching enabled, task dependencies fixed (ADR 065)         |
| Quality gates passing    | ✅ COMPLETE | All gates pass including `smoke:dev:stub`                        |
| SDK response caching     | ✅ COMPLETE | Optional Redis caching with 404 fallbacks for 100% hit rate      |
| ES mappings generated    | ✅ COMPLETE | Mappings generated from SDK at type-gen time (ADR 067)           |
| Reset CLI command        | ✅ COMPLETE | `npx tsx cli.ts reset` deletes and recreates indexes             |

### Current Priority: Real Data Ingestion

| Task                    | Status     | Notes                                                                |
| ----------------------- | ---------- | -------------------------------------------------------------------- |
| Clear test/fake data    | ✅ DONE    | Indexes recreated with 0 docs                                        |
| History KS2 test ingest | ✅ DONE    | 153 docs, 226 cached items, 100% cache hits on rerun                 |
| Ingest real Maths data  | 🚧 BLOCKED | Bulk indexing errors due to Zod/ES mapping mismatch - see Challenges |
| Validate search results | ⏳ PENDING | Test queries in ES Playground after ingestion                        |
| Phase 2: Threads        | ⏳ PENDING | Add thread filtering and facets after data validation                |

### Expanded Roadmap (Phases 4-8)

After resolving blocking issues and completing Phases 2-3, the roadmap expands to include:

| Phase | Focus                       | Key Deliverables                                                   |
| ----- | --------------------------- | ------------------------------------------------------------------ |
| 4     | Static Ontology + RAG       | `oak_ontology` index, RAG pipeline, `ask-curriculum` tool          |
| 5     | Instance Knowledge Graph    | `oak_curriculum_graph`, entity discovery pipeline, graph traversal |
| 6     | Graph RAG                   | Multi-hop reasoning, `find-connections` tool, Mermaid diagrams     |
| 7     | Enhanced MCP + Search Modes | `mode` parameter, graph reranking, entity highlighting             |
| 8     | OpenAI App Widget           | Graph exploration widget, enhanced renderer                        |

See [Pending Todos by Phase](#pending-todos-by-phase) for detailed task breakdown.

### Critical Challenges 🚨

#### 1. Zod Schema / ES Mapping Field Mismatch

**Problem**: The SDK generates two parallel sets of field definitions that have drifted:

- **Zod schemas** define document structure
  - Generator: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-search-index-docs.ts`
  - Output: `packages/sdks/oak-curriculum-sdk/src/types/generated/search/index-documents.ts`

- **ES mappings** define Elasticsearch field types
  - Generators: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-mapping-generators*.ts`
  - Overrides: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-field-overrides.ts`
  - Output: `packages/sdks/oak-curriculum-sdk/src/types/generated/search/es-mappings/*.ts`

**Symptom**: Bulk indexing fails with `strict_dynamic_mapping_exception`:

```
mapping set to strict, dynamic introduction of [unit_title] within [_doc] is not allowed
```

**Root Cause**: Both generators are hand-coded with different field lists. Fields like `unit_title`, `lesson_ids`, `unit_topics`, `title_suggest` exist in Zod schemas but were missing from ES mappings.

**Indexes Affected**: Primarily `oak_units`, but all indexes should be audited for alignment.

**Temporary Fix Applied**: The `oak_units` mapping was manually updated to add missing fields, but the underlying architecture issue (parallel field lists) remains.

**Solution Required**: See [Architectural Alignment](#architectural-alignment-zod--es-mappings) below.

#### 2. Console Statements Instead of Logger

**Problem**: The ingestion CLI and related code uses `console.log/error` directly instead of `@oaknational/mcp-logger`. This:

- Violates project standards (ESLint should block console usage)
- Makes verbose/debug mode ineffective
- Produces inconsistent log output

**Files with console usage** (68 instances across 11 files):

- `src/lib/elasticsearch/setup/cli.ts`
- `src/lib/elasticsearch/setup/index.ts`
- `src/lib/elasticsearch/setup/ingest-*.ts`
- `src/lib/index-oak*.ts`
- `src/lib/indexing/*.ts`

**Solution Required**: Replace all console statements with proper logger calls. The logger is already configured in `src/lib/logger.ts` with child loggers for different modules.

#### 3. Verbose Flag Not Controlling Log Level

**Problem**: The `--verbose` flag is passed through but doesn't control the logger's minimum severity. Progress during bulk operations is not visible because:

- Console statements aren't going through the logger
- Logger is hardcoded to INFO level, ignoring verbose flag
- Debug-level progress messages aren't emitted

### Architectural Alignment: Zod ↔ ES Mappings

**Cardinal Rule Reminder**: All static data structures MUST flow from the OpenAPI schema via `pnpm type-gen`.

**Current Architecture Problem**:

```text
OpenAPI Schema
    ↓ (type-gen)
Zod Index Document Schemas ──┐
                             ├── DIVERGED (different field lists)
ES Mapping Generators ───────┘
```

**Required Architecture**:

```text
Field Definitions (single source)
    ↓
├── Zod Schemas (generated)
└── ES Mappings (generated, with ES-specific overrides)
```

**Recommended Approach** (TDD - test first):

1. **Create shared field definition data structure** that defines:
   - Field name
   - Zod type (for schema generation)
   - ES type override (for mapping generation, optional)
   - Whether field is optional

2. **Generate Zod schemas FROM field definitions** - not hand-coded

3. **Generate ES mappings FROM field definitions** - applying ES-specific overrides where needed (e.g., `semantic_text`, `completion` with contexts)

4. **Ensure parity** - same field list produces both outputs

**Important Distinction**: Search index documents are **derived/aggregated** structures, not direct API mirrors. They include:

- Fields from multiple API endpoints
- Computed fields (`rollup_text`, `lesson_semantic`)
- Denormalized data for search performance

So the fields come from search requirements, but Zod and ES mappings MUST stay synchronised.

### Decision: Data First, Additional Indexes Later

**Approach confirmed:**

1. Fix Zod/ES mapping alignment first
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

### Active Indexes (mappings generated in SDK at type-gen time)

| Index                 | SDK Export                    | Purpose                                   | Semantic Field    |
| --------------------- | ----------------------------- | ----------------------------------------- | ----------------- |
| `oak_lessons`         | `OAK_LESSONS_MAPPING`         | Lesson documents with semantic embeddings | `lesson_semantic` |
| `oak_unit_rollup`     | `OAK_UNIT_ROLLUP_MAPPING`     | Aggregated unit text for semantic search  | `unit_semantic`   |
| `oak_units`           | `OAK_UNITS_MAPPING`           | Basic unit metadata                       | -                 |
| `oak_sequences`       | `OAK_SEQUENCES_MAPPING`       | Programme sequence documents              | -                 |
| `oak_sequence_facets` | `OAK_SEQUENCE_FACETS_MAPPING` | Sequence facet navigation                 | -                 |
| `oak_meta`            | `OAK_META_MAPPING`            | Index version and ingestion metadata      | -                 |

**Note**: ES mappings are generated at `pnpm type-gen` time from SDK Zod schemas + field overrides. See [ADR-067](docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md).

### Future Indexes (Phase 2-6)

| Index                    | Phase | Priority | Purpose                                         |
| ------------------------ | ----- | -------- | ----------------------------------------------- |
| `oak_threads`            | 2     | HIGH     | Thread-centric search scope                     |
| `oak_content_guidance`   | 3     | HIGH     | Safeguarding/content warnings                   |
| `oak_ontology`           | 4     | HIGH     | Combined static ontology + KG for RAG grounding |
| `oak_lesson_transcripts` | 4     | HIGH     | Chunked transcripts for deep retrieval          |
| `oak_curriculum_graph`   | 5     | HIGH     | Instance-level knowledge graph (triples)        |
| `oak_entities`           | 5     | HIGH     | Canonical entity records for disambiguation     |

**Graph & RAG Vision**: See [graph-rag-integration-vision.md](../../research/elasticsearch/ai/graph-rag-integration-vision.md) for comprehensive architecture.

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
- ES index mappings generated at type-gen time in SDK (`packages/sdks/oak-curriculum-sdk/src/types/generated/search/es-mappings/`)

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

### ES Mapping Generator (SDK)

```text
packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/
├── es-field-config.ts              # Core types, Zod→ES mapping functions
├── es-field-overrides.ts           # ES-specific field configurations (source)
├── es-mapping-utils.ts             # Code generation utilities
├── es-mapping-generators.ts        # Primary index generators
├── es-mapping-generators-minimal.ts # Simple index generators
└── generate-es-mappings.ts         # Generator entry point
```

### Generated ES Mappings (SDK Output)

```text
packages/sdks/oak-curriculum-sdk/src/types/generated/search/es-mappings/
├── index.ts                        # Barrel exports
├── oak-lessons.ts                  # Lessons index mapping
├── oak-units.ts                    # Units index mapping
├── oak-unit-rollup.ts              # Unit rollup mapping
├── oak-sequences.ts                # Sequences mapping
├── oak-sequence-facets.ts          # Sequence facets mapping
└── oak-meta.ts                     # Metadata mapping
```

### Search App ES Setup (Consumer)

```text
apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/
├── definitions/
│   └── index.ts                    # Documentation only (JSON files deleted)
└── setup/
    └── index.ts                    # Imports mappings from SDK
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

### Step 0: Fix Architectural Issues (BLOCKING)

Before any data ingestion can succeed, fix these architectural issues:

#### A. Unify Field Definitions (TDD)

1. **Write failing unit tests** for field definition data structure
2. Create shared field definitions in `type-gen/typegen/search/`
3. Refactor Zod schema generator to consume field definitions
4. Refactor ES mapping generator to consume same field definitions
5. Run `pnpm type-gen` - both outputs should have identical field sets
6. Run full quality gates

#### B. Replace Console with Logger (TDD)

1. **Check ESLint config** - ensure `no-console` rule is enabled
2. Replace all console statements in ingestion code with logger calls:

```typescript
// ❌ WRONG - violates project standards
console.log(`[${timestamp}] Processing subject: ${subject}`);

// ✅ CORRECT - use the configured logger
import { sandboxLogger } from '../logger.js';
sandboxLogger.info('Processing subject', { subject });
```

3. Make `--verbose` flag control logger level:

```typescript
// In logger.ts or CLI setup
const level = args.verbose ? 'DEBUG' : 'INFO';
```

4. Add progress logging during bulk operations:

```typescript
sandboxLogger.debug('Bulk operation progress', {
  processed: currentCount,
  total: totalCount,
  percentage: Math.round((currentCount / totalCount) * 100),
});
```

#### C. Verify Fixes

After completing A and B, verify the fixes work:

```bash
# 1. Run type-gen to regenerate both Zod schemas and ES mappings
pnpm type-gen

# 2. Compare field lists - they should match
# Check SearchUnitsIndexDocSchema fields vs OAK_UNITS_MAPPING properties

# 3. Run quality gates
pnpm build && pnpm type-check && pnpm lint:fix && pnpm test

# 4. Reset ES indexes and test ingestion
cd apps/oak-open-curriculum-semantic-search
npx tsx src/lib/elasticsearch/setup/cli.ts reset
pnpm es:ingest-live --subject maths --keystage ks1 --verbose

# 5. Verify no strict_dynamic_mapping_exception errors
# Check ES status shows expected document counts
pnpm es:status
```

### Step 1: Complete Maths Ingestion

After fixing architectural issues:

```bash
cd apps/oak-open-curriculum-semantic-search

# Reset indexes with new mappings
npx tsx src/lib/elasticsearch/setup/cli.ts reset

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
| phase-2-thread-filter | Add thread filtering and facets to search     | pending |
| phase-2-programme     | Add programme factor fields and KS4 filtering | pending |

### Phase 3: Ontology Enrichment

| Todo ID            | Description                                             | Status  |
| ------------------ | ------------------------------------------------------- | ------- |
| phase-3-unit-type  | Implement unit type classification                      | pending |
| phase-3-guidance   | Add structured content guidance with supervision levels | pending |
| phase-3-components | Add lesson component availability flags                 | pending |

### Phase 4: Static Ontology Index & RAG Foundation

| Todo ID                   | Description                                                 | Status  |
| ------------------------- | ----------------------------------------------------------- | ------- |
| phase-4-ontology-schema   | Design `oak_ontology` schema combining ontology + KG data   | pending |
| phase-4-ontology-generate | Generate ontology docs from `ontologyData` + `conceptGraph` | pending |
| phase-4-transcripts       | Lesson transcript chunking and indexing                     | pending |
| phase-4-openai-inference  | Configure OpenAI inference endpoint via ES Inference API    | pending |
| phase-4-rag-pipeline      | Implement RAG pipeline (retrieve → assemble → generate)     | pending |
| phase-4-ask-curriculum    | Add `ask-curriculum` MCP tool for RAG queries               | pending |

### Phase 5: Instance-Level Knowledge Graph

See [entity-discovery-pipeline.md](../plans/semantic-search/entity-discovery-pipeline.md) for multi-step extraction process.

| Todo ID                  | Description                                                | Status  |
| ------------------------ | ---------------------------------------------------------- | ------- |
| phase-5-graph-schema     | Design `oak_curriculum_graph` triple schema                | pending |
| phase-5-entity-schema    | Design `oak_entities` entity schema with graph metrics     | pending |
| phase-5-explicit-extract | Implement explicit entity extraction during ingestion      | pending |
| phase-5-ner-pipeline     | Implement post-ingestion NER pipeline for transcripts      | pending |
| phase-5-cooccurrence     | Implement co-occurrence mining using ES Graph API          | pending |
| phase-5-disambiguation   | Implement entity disambiguation and canonical linking      | pending |
| phase-5-graph-traversal  | Implement graph traversal functions (neighbourhood, paths) | pending |
| phase-5-explore-graph    | Add `explore-graph` MCP tool for graph navigation          | pending |

### Phase 6: Graph RAG

| Todo ID                  | Description                                              | Status  |
| ------------------------ | -------------------------------------------------------- | ------- |
| phase-6-entity-detection | Implement entity detection in user queries               | pending |
| phase-6-path-finding     | Implement path finding between detected entities         | pending |
| phase-6-subgraph-serial  | Implement subgraph serialisation to text context         | pending |
| phase-6-graph-rag-integ  | Integrate graph context with RAG pipeline                | pending |
| phase-6-mermaid          | Add Mermaid visualisation generation for graph responses | pending |
| phase-6-find-connections | Add `find-connections` MCP tool for Graph RAG queries    | pending |

### Phase 7: MCP Connectivity & Enhanced Search

| Todo ID                  | Description                                                    | Status  |
| ------------------------ | -------------------------------------------------------------- | ------- |
| phase-7-mcp-semantic     | Add aggregated semantic-search MCP tool with graph options     | pending |
| phase-7-search-modes     | Add mode parameter (`basic`/`semantic`/`graph-enhanced`/`rag`) | pending |
| phase-7-graph-rerank     | Add graph-based result reranking option                        | pending |
| phase-7-entity-highlight | Add entity highlighting in search results                      | pending |
| phase-7-related-concepts | Add related concepts suggestions from graph                    | pending |

### Phase 8: OpenAI App Widget

| Todo ID                   | Description                                                | Status  |
| ------------------------- | ---------------------------------------------------------- | ------- |
| phase-8-search-renderer   | Enhance widget search renderer with entity badges          | pending |
| phase-8-graph-widget      | Create graph exploration widget with Mermaid visualisation | pending |
| phase-8-standalone-widget | Create standalone semantic search widget                   | pending |

---

## Architectural Decision Records

Relevant ADRs for semantic search:

| ADR                                                                                              | Title                     | Description                                       |
| ------------------------------------------------------------------------------------------------ | ------------------------- | ------------------------------------------------- |
| [ADR-063](docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md)  | SDK Domain Synonyms       | SDK as single source of truth for domain synonyms |
| [ADR-064](docs/architecture/architectural-decisions/064-elasticsearch-mapping-organization.md)   | ES Mapping Organization   | Superseded by ADR-067                             |
| [ADR-065](docs/architecture/architectural-decisions/065-turbo-task-dependencies.md)              | Turbo Task Dependencies   | Build system optimisation                         |
| [ADR-066](docs/architecture/architectural-decisions/066-sdk-response-caching.md)                 | SDK Response Caching      | Optional Redis caching for development            |
| [ADR-067](docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md) | SDK-Generated ES Mappings | ES mappings generated at type-gen time            |

---

## Plan Documents

For detailed implementation plans, see:

- `.agent/plans/semantic-search/index.md` - Navigation hub for all semantic search planning
- `.agent/plans/semantic-search/semantic-search-overview.md` - High-level strategy and phases
- `.agent/plans/semantic-search/search-generator-spec.md` - Generated SDK artifacts + new index schemas
- `.agent/plans/semantic-search/entity-discovery-pipeline.md` - Multi-step entity extraction (explicit vs. discovered)
- `.agent/plans/semantic-search/search-service/schema-first-ontology-implementation.md` - Backend implementation
- `.agent/plans/semantic-search/search-ui/frontend-implementation.md` - Frontend implementation

### Graph & RAG Research

- `.agent/research/elasticsearch/ai/graph-rag-integration-vision.md` - Comprehensive Graph + RAG + Graph RAG strategy
- `.agent/research/elasticsearch/ai/elasticsearch_serverless_ai_kg_detailed.md` - ES AI capabilities
- `.agent/research/elasticsearch/ai/Constructing and Leveraging a Knowledge Graph in Elasticsearch for Search Relevance.docx.md` - KG construction patterns

### Reference Documentation

- `.agent/reference-docs/elasticsearch/README.md` - ES documentation index
- `.agent/reference-docs/elasticsearch/elastic-search-serverless-docs.md` - Serverless concepts
- `.agent/reference-docs/elasticsearch/elastic-cloud-serverless-api-usage.md` - API examples

---

## Version History

- 2025-12-05: **Graph RAG Integration** - Expanded phases 4-8 to include static ontology index, instance-level knowledge graph, Graph RAG, and enhanced MCP tools. Added entity discovery pipeline documentation.
- 2025-12-05: **BLOCKING** Discovered Zod/ES mapping field mismatch causing bulk indexing failures
- 2025-12-05: **BLOCKING** Identified console statement usage instead of proper logger
- 2025-12-05: Added `reset` CLI command to delete and recreate indexes
- 2025-12-05: Fixed units mapping to include missing fields (unit_title, lesson_ids, etc.)
- 2025-12-05: Added bulk error reporting to surface indexing failures
- 2025-12-05: ES mappings generated from SDK (ADR 067) - deleted static JSON files, thread fields added
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
