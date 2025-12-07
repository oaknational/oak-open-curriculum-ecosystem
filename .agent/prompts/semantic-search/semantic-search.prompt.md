# Semantic Search Continuation Prompt

Use this prompt to continue semantic search implementation work in a fresh session with no prior context.

## What is This System?

The Oak Open Curriculum Semantic Search is a Next.js application providing hybrid search (semantic + lexical) across Oak's curriculum data using Elasticsearch Serverless. It combines:

- **Semantic search**: ELSER sparse embeddings for meaning-based retrieval
- **Lexical search**: Traditional keyword + synonym matching
- **RRF fusion**: Combines both approaches for optimal results
- **Faceted navigation**: Filter by subject, key stage, year, category
- **Type-ahead suggestions**: Context-aware completion with per-index contexts

**Current State**: ES Serverless deployed and operational. Type system fully compliant with official ES client types. **CURRENT BLOCKING ISSUE**: `sequence_facets` mapping mismatch needs remediation. See "Current Blocking Issue" section below.

## Foundation Documents (MUST READ FIRST)

Before any work, read and internalize:

1. `.agent/directives-and-memory/rules.md` - Cardinal rule, code design, quality gates
2. `.agent/directives-and-memory/testing-strategy.md` - TDD at all levels
3. `.agent/directives-and-memory/schema-first-execution.md` - Schema-first mandate
4. `.agent/directives-and-memory/AGENT.md` - Agent directives

**Key Principles**:

- **Schema-First**: All types, schemas, validators flow from OpenAPI schema via `pnpm type-gen`
- **Quality Gates**: All gate issues are BLOCKING—no exceptions
- **TDD**: Red → Green → Refactor at all levels (unit, integration, E2E)
- **No Type Shortcuts**: No `as`, `any`, `!`, `Record<string, unknown>`, `Object.*`
- **Logging**: Use `@oaknational/mcp-logger`, never `console`
- **No Disabling**: Never use `eslint-disable` comments—forbidden
- **Completion Contexts**: Per-index contexts enforced (ADR-068)
- **Complexity**: Functions ≤8 complexity, files ≤250 lines

**Re-read foundation documents regularly during work.**

---

## Recent Major Milestones 🎉

### API Rate Limiting & Monitoring COMPLETE (2025-12-07)

**Problem Solved**: Discovered and resolved API rate limiting issues blocking systematic ingestion.

**What Was Fixed**:

- ✅ Implemented comprehensive rate limit tracking middleware
- ✅ Added singleton client pattern to ensure shared rate limiting state
- ✅ Created real-time monitoring with warnings at 75% and 90% quota usage
- ✅ Discovered Oak API has **1000 requests/hour limit** via `get-rate-limit` endpoint
- ✅ Test ingestion (Art KS1) completed: 159 requests, 0 failures, 2.08 req/sec
- ✅ All 867 SDK tests passing with fake timers (no real delays in tests)

**Impact**: Full ingestion now viable but takes **17-24 hours** due to API rate limit (not our throttling). Need to contact API team for higher limit or run overnight.

**Documentation**: See ADR-070, `.agent/analysis/api-rate-limit-investigation.md`, `.agent/plans/semantic-search/api-rate-limit-resolution-plan.md`

### Mapping Remediation COMPLETE (2025-12-06)

**Problem Solved**: Fourth and FINAL occurrence of mapping sync error eliminated through architectural consolidation.

**What Was Fixed**:

- ✅ All 7 search indexes now flow from **single source of truth** (SDK field definitions)
- ✅ `oak_sequence_facets` mapping mismatch resolved (`key_stage` → `key_stages` array)
- ✅ Eliminated ad-hoc ES mappings and document interfaces
- ✅ Generated Zod schemas and TypeScript types from field definitions
- ✅ Created comprehensive SDK and app documentation
- ✅ Successfully tested with English KS2 ingestion (348 documents)
- ✅ All 10 quality gates passing

**Impact**: **IMPOSSIBLE for mapping/data mismatch going forward** - schema changes in SDK field definitions automatically propagate to ES mappings, Zod schemas, and TypeScript types via `pnpm type-gen`.

**Systematic Ingestion Tools Created** (2025-12-06):

- ✅ `scripts/ingest-all-combinations.ts` - Processes all 340 combinations (17 subjects × 4 keystages × 5 indexes)
- ✅ `scripts/check-progress.ts` - Monitors ingestion progress and ES state
- ✅ Progress tracking with resume capability (`.ingest-progress.json`)
- ✅ Can safely interrupt (Ctrl+C) and resume from checkpoint
- ✅ Tracks success/failure per combination for iterative bug fixing

**Current Elasticsearch State** (2025-12-06):

- ✅ English KS2 fully ingested: 89 lessons, 129 units, 129 unit_rollup, 1 sequence_facet
- ⏳ Remaining: 339 combinations awaiting ingestion

**Ready for**: Full live ingestion of all 340 combinations

---

## Recent Improvements ✅

### Systematic Ingestion Tools (2025-12-06)

**Complete Solution for Full Data Ingestion**:

- ✅ Created `scripts/ingest-all-combinations.ts` - processes all 340 combinations
- ✅ Progress tracking with `.ingest-progress.json` (persistent state)
- ✅ Resume capability - safely interrupt and resume from checkpoint
- ✅ Created `scripts/check-progress.ts` - monitors ES state and progress
- ✅ Added `pnpm ingest:all` and `pnpm ingest:progress` commands
- ✅ Documented in `scripts/README-INGEST-ALL.md` and ADR-069

**Developer Experience**:

- Can interrupt at any time (Ctrl+C) without losing progress
- Discover bugs → fix → resume seamlessly
- Clear visibility of successes and failures
- Estimated 3-11 hours for all combinations

### Type System Architecture Upgrade (2025-12-06)

**All Record<string, unknown> Eliminated** - Complete architectural cleanup:

- ✅ Replaced ad-hoc ES types with official `@elastic/elasticsearch` estypes
- ✅ Added `@elastic/elasticsearch` as dev dependency to oak-curriculum-sdk
- ✅ All ES types now re-export from official client library
- ✅ Added `'long'` to EsFieldMapping type union for ES numeric fields
- ✅ Properly typed ZeroHitDoc usage in search hit structures
- ✅ Fixed Result type discriminated union handling throughout

**Code Quality Improvements**:

- ✅ Refactored `createErrorFromException` (complexity 17→8)
- ✅ Extracted helper functions (isEsError, isMappingException, etc.)
- ✅ Refactored `runIngestion` (62→50 lines, 23→20 statements)
- ✅ Fixed template literal expressions with explicit String() conversions
- ✅ Removed unnecessary conditional checks in Result library tests

**Build & Test Fixes**:

- ✅ Fixed field-definitions.js import paths
- ✅ Updated ES mapping generator test for oak-zero-hit-telemetry.ts
- ✅ Added missing IngestionResult import after refactoring
- ✅ All 1,310+ tests passing across entire monorepo

**Quality Gates - ALL PASSING** ✅:

- ✅ type-gen, build, type-check, lint:fix, format:root, markdownlint:root
- ✅ test (1,310+ tests), test:e2e (185 tests), test:e2e:built
- ✅ smoke:dev:stub

### Generator Drift Fixed (2025-12-06)

The generator vs generated drift issue has been **RESOLVED**. All changes now properly flow from generator templates following schema-first principles.

**Completed**:

- ✅ Updated `generate-search-index.ts` to emit per-index completion schemas
- ✅ Removed deprecated `SearchCompletionSuggestPayload*` exports from generators
- ✅ Removed all forbidden `eslint-disable` comments
- ✅ Added comprehensive unit tests for generator output
- ✅ All quality gates passing

### Type Safety Cleanup (2025-12-06)

**19 lint errors resolved**:

- ✅ Eliminated all type assertions (`as`), type shortcuts (`any`, `Record<string, unknown>`)
- ✅ Used proper openapi3-ts library types throughout
- ✅ Extracted complex functions into pure functions (complexity ≤8)
- ✅ Created `response-augmentation-helpers.ts` for path/ID extraction
- ✅ Files under 250 lines

### CLI Enhancement (2025-12-06)

- ✅ Added `--index` filter for selective ingestion (e.g., `--index lessons`)
- ✅ Reduces unnecessary data uploads during development
- ✅ Extracted filtering/metrics logic to separate modules

### Ingestion Progress Logging (2025-12-06)

**Bulk Upload Phase Visibility** - Added real-time progress feedback:

- ✅ Added progress logging to `dispatchBulk` with start/end messages
- ✅ Shows document count, estimated size, and duration for bulk uploads
- ✅ Refactored `dispatchBulk` to use `BulkTransport` interface for easier testing
- ✅ Created `createMockBulkTransport` helper for unit testing
- ✅ Added 7 new unit tests proving progress logging works
- ✅ Eliminates silent 30-60 second gaps during ingestion

**Why This Matters**: Users can now see when ES bulk upload starts and completes, preventing confusion about whether the process is hanging or progressing.

**Example Output**:

```json
{"SeverityText":"INFO","Body":"Dispatching bulk operations to Elasticsearch","Attributes":{"totalOperations":150,"phase":"bulk_upload_start"}}
{"SeverityText":"INFO","Body":"Bulk upload completed","Attributes":{"totalOperations":150,"durationSeconds":"2.5","phase":"bulk_upload_end"}}
```

**Files Changed**:

- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/sandbox-harness-ops.ts`
- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/sandbox-harness.ts`
- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/sandbox-harness-ops.unit.test.ts`

### Schema-First Ingestion (2025-12-06)

**Result<T,E> Error Handling**:

- ✅ Created `packages/libs/result` library for functional error handling
- ✅ Refactored `index-meta.ts` to use `Result<T,E>` pattern
- ✅ Fail-fast behavior with detailed ES errors in ingestion pipeline

**Field Definitions Organization**:

- ✅ Reorganized field definitions into domain-focused modules:
  - `field-definitions/curriculum.ts` - Educational content indexes
  - `field-definitions/observability.ts` - System behavior indexes (meta, zero-hit)
  - `field-definitions/types.ts` - Shared types
- ✅ Added boolean zodType support throughout generators
- ✅ Moved `oak_meta` index to schema-first (IndexMetaDoc, OAK_META_MAPPING)
- ✅ Moved `oak_zero_hit_telemetry` index to schema-first (ZeroHitDoc, OAK_ZERO_HIT_MAPPING)
- ✅ Replaced generic `UnknownRecord` with official ES client types

**Analysis**: See `.agent/analysis/semantic-search-compliance-and-ingestion-discovery.md` and `.agent/plans/semantic-search/schema-first_completion_*.plan.md`

---

## What's Been Completed

### Infrastructure ✅

- Elasticsearch Serverless deployed and operational
- Six indexes created: `oak_lessons`, `oak_units`, `oak_unit_rollup`, `oak_sequences`, `oak_sequence_facets`, `oak_meta`
- Synonym set `oak-syns` with 68 rules deployed
- ELSER sparse embeddings configured (`semantic_text` fields)
- Split analyzers for Serverless (`oak_text_index`, `oak_text_search`)

### SDK & Type Generation ✅

- Schema-first architecture: all types flow from OpenAPI via `pnpm type-gen`
- Unified field definitions: Zod schemas + ES mappings from single source
- Per-index completion context schemas (ADR-068)
- 13 generated search modules in SDK
- Response augmentation: automatic `canonicalUrl` injection

### Code Quality ✅

- All console statements replaced with `@oaknational/mcp-logger`
- Verbose flag controls log level (DEBUG/INFO)
- 19 type safety lint errors fixed
- No type shortcuts, all functions ≤8 complexity
- Generator drift resolved

### Features ✅

- Hybrid search with RRF (semantic + lexical)
- Three search endpoints: structured, natural language, suggestions
- Faceted navigation with subject/key stage/year filters
- CLI tools for ES setup, status, and ingestion
- `--index` filter for selective ingestion

## Current Elasticsearch State

**Last verified**: 2025-12-06 via `pnpm ingest:progress`

| Index                 | Docs | Status                                        |
| --------------------- | ---- | --------------------------------------------- |
| `oak_lessons`         | 89   | ✅ English KS2 lessons                        |
| `oak_units`           | 129  | ✅ English KS2 units                          |
| `oak_unit_rollup`     | 129  | ✅ English KS2 unit rollups                   |
| `oak_sequence_facets` | 1    | ✅ English KS2 sequence facet                 |
| `oak_sequences`       | 0    | ⏳ English KS2 creates no top-level sequences |
| `oak_meta`            | 1    | ✅ Tracking ingestion metadata (v2025-12-06)  |

**Synonym Set**: `oak-syns` with 68 rules ✅

**Ingestion Coverage**: 1 of 340 combinations complete (English × KS2 × all indexes)

**Systematic Ingestion Progress**: Use `pnpm ingest:progress` to check current state

---

## Quick Reference

### Elasticsearch Serverless

- **Kibana**: <https://poc-open-curriculum-api-search-dd21a1.kb.europe-west1.gcp.elastic.cloud>
- **Cluster**: `poc-open-curriculum-api-search-dd21a1.es.europe-west1.gcp.elastic.cloud:443`

### CLI Commands

All commands run from `apps/oak-open-curriculum-semantic-search`:

```bash
# ===== SYSTEMATIC INGESTION (RECOMMENDED) =====
# Ingest all 340 combinations with progress tracking
pnpm ingest:all                    # Start/resume systematic ingestion
pnpm ingest:all --resume           # Explicitly resume from checkpoint
pnpm ingest:all --reset            # Clear progress and start fresh
pnpm ingest:all --dry-run          # Preview without ingesting
pnpm ingest:progress               # Check current state and progress

# ===== MANUAL INGESTION (FOR TESTING) =====
# Single subject/keystage ingestion
pnpm es:ingest-live --subject maths --keystage ks2 --verbose
pnpm es:ingest-live --subject english --keystage ks3 --index lessons --verbose

# Full ingestion (all subjects, all keystages) - USE WITH CAUTION
pnpm es:ingest-live --verbose

# ===== ELASTICSEARCH MANAGEMENT =====
# Check Elasticsearch status and document counts
pnpm es:status

# Reset all indexes (destructive)
npx tsx src/lib/elasticsearch/setup/cli.ts reset

# Reset specific index
npx tsx src/lib/elasticsearch/setup/cli.ts reset --index sequence_facets

# ===== DEVELOPMENT TOOLS =====
# Enable Redis caching for faster repeated runs
pnpm redis:up
SDK_CACHE_ENABLED=true pnpm es:ingest-live --subject maths --dry-run

# Dry run (preview without uploading)
pnpm es:ingest-live --subject maths --dry-run --verbose
```

**Environment Variables**:

- `ELASTICSEARCH_URL` - ES cluster endpoint (from `.env`)
- `ELASTICSEARCH_API_KEY` - API key for authentication
- `SDK_CACHE_ENABLED=true` - Enable Redis caching (optional)
- `OAK_API_KEY` - Oak curriculum API key

### Quality Gates

```bash
# From repo root, all must pass
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix
pnpm format:root && pnpm markdownlint:root
pnpm test && pnpm test:e2e && pnpm test:e2e:built
pnpm test:ui && pnpm smoke:dev:stub
```

---

## Immediate Next Steps

### Step 1: Address API Rate Limit ⚠️

**Current Situation**: Oak API has **1000 requests/hour limit**, discovered 2025-12-07.

**Impact**: Full ingestion of 340 combinations requires 17,000-68,000 requests = **17-24 hours minimum**

**Three Options**:

1. **Request API Rate Limit Increase** ⭐ RECOMMENDED
   - Contact Oak API team with usage data (see `.agent/analysis/api-rate-limit-investigation.md`)
   - Request 5,000-10,000 req/hour for bulk operations
   - Would reduce ingestion time to 3-4 hours

2. **Run Overnight Local Ingestion**
   - Execute `pnpm ingest:all` and let run for 20-24 hours
   - Safe to interrupt and resume with Ctrl+C
   - Progress tracked in `.ingest-progress.json`
   - Real-time monitoring shows quota usage

3. **Future: Migrate to Vercel Function**
   - Design incremental ingestion (one combination per hour)
   - Queue-based architecture
   - Automated re-ingestion on schedule
   - See `.agent/plans/semantic-search/api-rate-limit-resolution-plan.md`

### Step 2: Run Systematic Full Ingestion

**Prerequisites**: ✅ All blocking issues resolved, SDK ready

```bash
cd apps/oak-open-curriculum-semantic-search

# Check current state
pnpm ingest:progress

# Start systematic ingestion (all 340 combinations)
pnpm ingest:all

# Monitor in another terminal
watch -n 30 'pnpm ingest:progress'

# Or preview what would be ingested
pnpm ingest:all --dry-run
```

**What This Does**:

- Processes all 17 subjects × 4 keystages × 5 indexes = 340 combinations
- Tracks progress in `.ingest-progress.json`
- Can be safely interrupted (Ctrl+C) and resumed with `pnpm ingest:all --resume`
- **Realistic time**: 17-24 hours due to API rate limit (not our code)
- Individual failures don't stop the entire process
- Real-time monitoring logs quota usage every 30s

**Progress Tracking & Monitoring**:

```bash
# Monitor ingestion progress (ES state + progress file)
pnpm ingest:progress

# Monitor continuously (every 30 seconds)
watch -n 30 'pnpm ingest:progress'

# View detailed progress file
cat .ingest-progress.json

# Resume after interruption or bug fix
pnpm ingest:all --resume

# Reset and start fresh
pnpm ingest:all --reset
```

**Rate Limit Monitoring** (automatic during ingestion):

- Logs API quota status every 30 seconds
- Warns at 75% quota usage
- Critical warning at 90% quota usage
- Shows: requests/sec, quota remaining, reset time
- Example: `{"requests":{"count":159,"rate":"2.08/sec"},"rateLimit":{"remaining":329,"limit":1000}}`

### Step 2: Alternative - Manual Selective Ingestion

For targeted testing or specific subjects:

```bash
# Single subject/keystage
pnpm es:ingest-live --subject maths --keystage ks2 --verbose

# Single subject, all keystages
pnpm es:ingest-live --subject history --verbose

# Specific index only
pnpm es:ingest-live --subject english --keystage ks3 --index lessons --verbose

# Dry run to preview
pnpm es:ingest-live --subject science --dry-run --verbose
```

### Step 3: After Full Ingestion - Next Phase Work

Once all 340 combinations are ingested:

- **Phase 2**: Threads & Enhanced Filtering (programme factors, content guidance)
- **Phase 3**: Reference Indices (subjects, key stages, years catalogs)
- **Phase 4**: Static Ontology Index (RAG-ready knowledge graph)
- **Phase 5**: Instance Knowledge Graph (curriculum relationships)

See `.agent/plans/semantic-search/semantic-search-overview.md` for detailed roadmap

---

## Key Concepts

### Per-Index Completion Contexts (ADR-068)

Elasticsearch completion suggester contexts vary by index:

| Index                 | Contexts                             |
| --------------------- | ------------------------------------ |
| `oak_lessons`         | `subject`, `key_stage`, `phase`      |
| `oak_units`           | `subject`, `key_stage`, `phase`      |
| `oak_unit_rollup`     | `subject`, `key_stage`, `phase`      |
| `oak_sequences`       | `subject`, `phase`                   |
| `oak_sequence_facets` | `subject`, `phase`                   |
| `oak_threads`         | `subject`, `phase` (NOT `key_stage`) |

**Why?** Threads span multiple key stages, so filtering by key stage makes no sense.

**Implementation**: Single source of truth in `completion-contexts.ts`, enforced via generated Zod schemas and ES mappings.

### Unified Field Definitions Architecture

All field definitions flow from a single source, organized by domain:

```text
field-definitions/
├── types.ts (ZodFieldType, FieldDefinition)
├── curriculum.ts (lessons, units, sequences, threads)
├── observability.ts (meta, zero-hit telemetry)
└── index.ts (barrel export)
    ↓
├── zod-schema-generator.ts → Zod Schemas
└── es-mapping-from-fields.ts → ES Mappings (+ es-field-overrides.ts)
```

This prevents Zod/ES mapping drift that caused `strict_dynamic_mapping_exception`.

### Schema-First Mandate

**Never edit generated files directly.** Always update generators:

✅ **Edit These** (Generator Templates):

```
packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/
├── generate-search-index.ts          # Main generator
├── generate-search-index-docs.ts     # Doc schema generator
├── completion-contexts.ts            # Per-index context definitions
├── field-definitions/                # Domain-organized field definitions
│   ├── curriculum.ts
│   ├── observability.ts
│   └── types.ts
└── es-field-overrides.ts             # ES-specific overrides
```

❌ **Don't Edit These** (Generated Output):

```
packages/sdks/oak-curriculum-sdk/src/types/generated/search/
├── index.ts                          # Auto-generated barrel
├── index-documents.ts                # Auto-generated schemas
└── es-mappings/                      # Auto-generated mappings
```

After editing generators: `pnpm type-gen` → `pnpm build` → verify quality gates.

### Public API Boundaries

**NEVER import from internal paths.** Always use public API entry points defined in `package.json` exports:

✅ **Use These Public APIs**:

- `@oaknational/oak-curriculum-sdk` - Core API (`src/index.ts`)
- `@oaknational/oak-curriculum-sdk/public/search` - Search types (`src/public/search.ts`)
- `@oaknational/oak-curriculum-sdk/public/mcp-tools` - MCP tools (`src/public/mcp-tools.ts`)

❌ **Never Deep-Link Past Public Boundaries**:

```typescript
// ❌ FORBIDDEN - violates boundary discipline
import { X } from '@oaknational/oak-curriculum-sdk/types/generated/search/es-types.js';

// ✅ CORRECT - use public API
import { X } from '@oaknational/oak-curriculum-sdk/public/search.js';
```

If a type is needed but not exported, **add it to the appropriate public entry point first**.

---

## Future Roadmap (What Comes Next)

After re-ingestion, the semantic search system continues with these phases:

### Phase 2: Threads & Enhanced Filtering

- Thread search scope and filtering
- Programme factors, unit types, tier filtering
- Content guidance structure
- See: Search UI and Service plans

### Phase 3: Reference Indices

- Searchable subject catalogue (`oak_subjects`)
- Key stage index (`oak_key_stages`)
- Year group index (`oak_years`)
- See: `.agent/plans/semantic-search/reference-indices-plan.md`

### Phase 4: Static Ontology Index (RAG)

- `oak_ontology` index from ontology + knowledge graph data
- RAG-ready ontology for context injection
- See: `.agent/plans/semantic-search/entity-discovery-pipeline.md`

### Phase 5: Instance Knowledge Graph

- `oak_curriculum_graph` - actual curriculum graph
- `oak_entities` - extracted curriculum entities
- Graph relationships for navigation

### Phase 6: Graph RAG Integration

- Multi-hop reasoning combining graph + RAG
- See: `.agent/research/elasticsearch/ai/graph-rag-integration-vision.md`

### Phase 7: MCP Connectivity

- Enhanced MCP search tool with graph modes
- Graph-aware curriculum exploration

### Phase 8: OpenAI App Widget

- Search widget with graph visualizations
- Teacher-facing semantic search interface

## Documentation Links

| Topic                               | Location                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------------------- |
| **Planning Hub**                    | `.agent/plans/semantic-search/index.md` ⭐ START HERE                                       |
| Phase roadmap                       | `.agent/plans/semantic-search/semantic-search-overview.md`                                  |
| **API rate limit resolution**       | `.agent/plans/semantic-search/api-rate-limit-resolution-plan.md` ⭐ CURRENT                 |
| Mapping remediation (COMPLETED)     | `.agent/plans/semantic-search/mapping-remediation.md`                                       |
| Reference indices plan              | `.agent/plans/semantic-search/reference-indices-plan.md`                                    |
| Entity discovery pipeline           | `.agent/plans/semantic-search/entity-discovery-pipeline.md`                                 |
| Graph RAG vision                    | `.agent/research/elasticsearch/ai/graph-rag-integration-vision.md`                          |
| Systematic ingestion guide          | `apps/oak-open-curriculum-semantic-search/scripts/README-INGEST-ALL.md`                     |
| SDK caching                         | `apps/oak-open-curriculum-semantic-search/docs/SDK-CACHING.md`                              |
| **API rate limit investigation**    | `.agent/analysis/api-rate-limit-investigation.md` ⭐ NEW                                    |
| **Vercel migration considerations** | `.agent/analysis/vercel-ingestion-migration-considerations.md` ⭐ NEW                       |
| Discovery analysis                  | `.agent/analysis/semantic-search-compliance-and-ingestion-discovery.md`                     |
| ADR-067 (ES mappings)               | `docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md`     |
| ADR-068 (completion contexts)       | `docs/architecture/architectural-decisions/068-per-index-completion-context-enforcement.md` |
| ADR-069 (systematic ingestion)      | `docs/architecture/architectural-decisions/069-systematic-ingestion-progress-tracking.md`   |
| **ADR-070 (rate limiting/retry)**   | `docs/architecture/architectural-decisions/070-sdk-rate-limiting-and-retry.md` ⭐ NEW       |

---

## Pre-Ingestion Checklist ✅

Before starting full ingestion, verify all systems are ready:

### 1. Environment Variables

Verify `.env.local` in `apps/oak-open-curriculum-semantic-search`:

```bash
# Required for Elasticsearch
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here

# Required for Oak API
OAK_API_KEY=your_oak_api_key_here

# Optional but recommended for speed
SDK_CACHE_ENABLED=true  # Enables Redis caching
```

### 2. Infrastructure Status

```bash
cd apps/oak-open-curriculum-semantic-search

# Check Elasticsearch is reachable
pnpm es:status

# (Optional) Start Redis for caching
pnpm redis:up
pnpm redis:status  # Verify Redis is running
```

### 3. Verify Quality Gates Pass

```bash
# From repo root
pnpm type-gen && pnpm build && pnpm type-check
pnpm lint:fix && pnpm format:root && pnpm markdownlint:root
pnpm test  # Should show 319+ tests passing
```

### 4. Check Current State

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm ingest:progress

# Expected output:
# - Elasticsearch shows 348 docs (English KS2)
# - Progress file either doesn't exist or shows 1/340 complete
```

### 5. Test Single Combination (Optional)

```bash
# Verify ingestion works with a small subject
pnpm es:ingest-live --subject history --keystage ks3 --verbose

# Should complete in ~60 seconds with no errors
```

### 6. Ready to Start

```bash
# Start systematic ingestion (can be interrupted safely)
pnpm ingest:all

# Monitor progress in another terminal
pnpm ingest:progress
```

**Estimated Time**: 3-11 hours for all 340 combinations (can run overnight)

**Safe to Interrupt**: Press Ctrl+C at any time, progress is saved automatically

---

## Verification & Troubleshooting

### Verify System is Working

```bash
# 1. Check quality gates (from repo root)
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix
pnpm test  # Should pass 1,310+ tests

# 2. Check Elasticsearch status
cd apps/oak-open-curriculum-semantic-search
pnpm es:status  # Should show index stats

# 3. Try a dry-run ingestion
pnpm es:ingest-live --subject maths --keystage ks1 --dry-run --verbose
# Should show what would be uploaded without errors

# 4. View Kibana (requires login)
# https://poc-open-curriculum-api-search-dd21a1.kb.europe-west1.gcp.elastic.cloud
```

### Common Issues

| Problem                            | Solution                                                        |
| ---------------------------------- | --------------------------------------------------------------- |
| `strict_dynamic_mapping_exception` | Field missing from ES mapping. Check `field-definitions.ts`     |
| Generator/generated drift          | Update generators, never edit generated files. Run `type-gen`   |
| Lint errors after `type-gen`       | Generators likely emit bad code. Fix generator templates        |
| `console` statements               | Replace with `@oaknational/mcp-logger`. See `src/lib/logger.ts` |
| Completion context mismatch        | Check `completion-contexts.ts`. See ADR-068                     |
| Port conflict in smoke tests       | Kill process using port 3333 or use `--port`                    |
| Tests failing                      | Run quality gates one at a time to isolate issue                |

### ES Serverless Gotchas

| Issue                                   | Solution                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `_cluster/health` fails                 | Use `/` or `/_cat/indices?v` instead                                      |
| `synonym_graph` at index time           | Split analyzers: `oak_text_index` (no synonyms), `oak_text_search` (with) |
| `optional: true` on completion contexts | Not supported—remove from definitions                                     |
| `number_of_shards/replicas`             | Not supported in Serverless—omit from mappings                            |
| `highlight.max_analyzed_offset`         | Not supported in Serverless—omit                                          |
