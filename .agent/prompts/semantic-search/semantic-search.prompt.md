# Semantic Search Continuation Prompt

Use this prompt to continue semantic search implementation work in a fresh session with no prior context.

---

## 🚀 Quick Start for New Session

**You are here**: Ready to implement hybrid field strategy for Maths KS4 ingestion

**Immediate action**: Implement 37 new fields across 5 ES indexes using TDD

**Time estimate**: 2-4 hours

**Critical reads FIRST**:

1. `.agent/directives-and-memory/rules.md` - TDD, quality gates, no type shortcuts
2. `.agent/plans/semantic-search/hybrid-field-strategy.md` - Complete implementation plan with TDD examples
3. `.agent/plans/semantic-search/maths-ks4-vertical-slice.md` - Strategic context

**What's ready**:

- ✅ All 10 quality gates passing
- ✅ SDK rate limiting implemented (5 req/sec, exponential backoff)
- ✅ ES Serverless deployed with 6 indexes
- ✅ Field definitions architecture (single source of truth)
- ✅ Full transcripts already uploaded (no sampling)

**What you'll do**:

1. Write tests FIRST for extraction functions (RED)
2. Add 37 fields to SDK field definitions
3. Run `pnpm type-gen` to generate schemas
4. Implement extraction functions (GREEN)
5. Update ingestion logic (integration tests)
6. Run quality gates (all must pass)
7. Ingest Maths KS4 with hybrid schema

**Files you'll modify**:

- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts`
- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transforms.ts`
- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transforms.unit.test.ts`

---

## What is This System?

The Oak Open Curriculum Semantic Search is a Next.js application providing hybrid search (semantic + lexical) across Oak's curriculum data using Elasticsearch Serverless. It combines:

- **Semantic search**: ELSER sparse embeddings for meaning-based retrieval
- **Lexical search**: Traditional keyword + synonym matching
- **RRF fusion**: Combines both approaches for optimal results
- **Faceted navigation**: Filter by subject, key stage, year, category
- **Type-ahead suggestions**: Context-aware completion with per-index contexts

**Current State**: ES Serverless deployed and operational. Type system fully compliant with official ES client types. SDK rate limiting and monitoring implemented. **CURRENT FOCUS**: Maths KS4 vertical slice for impressive demo.

## Foundation Documents (MUST READ FIRST)

Before any work, read and internalize:

1. `.agent/directives-and-memory/rules.md` - Cardinal rule, code design, quality gates
2. `.agent/directives-and-memory/testing-strategy.md` - TDD at all levels
3. `.agent/directives-and-memory/schema-first-execution.md` - Schema-first mandate
4. `.agent/directives-and-memory/AGENT.md` - Agent directives

**Key Principles** (from foundation documents):

- **Schema-First** (schema-first-execution.md): ALL types, Zod schemas, ES mappings flow from field definitions via `pnpm type-gen`. Never edit generated files. Update generators only.
- **TDD ALWAYS** (testing-strategy.md): Write tests FIRST at ALL levels. Red (prove it fails) → Green (make it pass) → Refactor (improve while staying green). No exceptions.
- **Quality Gates** (rules.md): All gate issues are BLOCKING—no exceptions. Never disable checks, never work around them.
- **No Type Shortcuts** (rules.md): No `as`, `any`, `!`, `Record<string, unknown>`, `Object.*`, `Reflect.*` - they disable the type system.
- **Preserve Type Information** (rules.md): Never widen types. Keep literal types literal. Every `: string` or `: number` destroys type information irreversibly.
- **Logging**: Use `@oaknational/mcp-logger`, never `console`
- **No Disabling**: Never use `eslint-disable` comments—forbidden
- **Completion Contexts**: Per-index contexts enforced (ADR-068)
- **Complexity**: Functions ≤8 complexity, files ≤250 lines
- **Test Types** (testing-strategy.md):
  - **Unit test** (`*.unit.test.ts`): Single PURE function, NO IO, NO side effects, NO mocks
  - **Integration test** (`*.integration.test.ts`): Code units working together (IMPORTED, not running system), NO IO, SIMPLE mocks as arguments
  - **E2E test** (`*.e2e.test.ts`): Running system in separate process, CAN trigger FS/STDIO, NOT network

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

### Recent Technical Improvements (Archived Details)

For complete historical context, see:

- **Mapping Remediation**: `.agent/plans/semantic-search/archive/mapping-remediation.md`
- **Type System Upgrade**: Consolidated into ADR-067
- **CLI Enhancements**: Documented in `scripts/README-INGEST-ALL.md`
- **Progress Logging**: Part of systematic ingestion (ADR-069)
- **Field Definitions**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/README.md`

---

## System Capabilities

### Infrastructure ✅

- Elasticsearch Serverless deployed with 6 indexes
- ELSER sparse embeddings for semantic search
- Synonym set `oak-syns` with 68 rules
- Redis caching for SDK (optional, 7-day TTL)
- Rate limiting and monitoring (1000 req/hour API limit)

### Features ✅

- **Hybrid search**: ELSER semantic + lexical with RRF fusion
- **Three endpoints**: Structured, natural language, suggestions
- **Faceted navigation**: Filter by subject, key stage, year, category
- **Type-ahead**: Context-aware completion
- **SDK rate limiting**: 5 req/sec with exponential backoff retry (ADR-070)
- **Real-time monitoring**: API quota tracking with 75%/90% warnings

### Architecture ✅

- **Schema-first**: All types flow from OpenAPI via `pnpm type-gen`
- **Unified field definitions**: Zod + ES mappings from single source (ADR-067)
- **Per-index completion contexts**: Enforced at type-gen time (ADR-068)
- **Systematic ingestion**: Progress tracking with resume capability (ADR-069)
- **Quality gates**: All passing (1,310+ tests)

## Current Elasticsearch State

**Strategy**: Focus on **Maths KS4 vertical slice** before full ingestion

**Last verified**: 2025-12-06 via `pnpm ingest:progress`

| Index                 | Docs | Status                                       |
| --------------------- | ---- | -------------------------------------------- |
| `oak_lessons`         | 89   | ✅ English KS2 lessons (test data)           |
| `oak_units`           | 129  | ✅ English KS2 units (test data)             |
| `oak_unit_rollup`     | 129  | ✅ English KS2 unit rollups (test data)      |
| `oak_sequence_facets` | 1    | ✅ English KS2 sequence facet (test data)    |
| `oak_sequences`       | 0    | ⏳ English KS2 has no sequences              |
| `oak_meta`            | 1    | ✅ Tracking ingestion metadata (v2025-12-06) |

**Next**: Ingest **Maths KS4** (~100-200 more docs) for production demo

**Synonym Set**: `oak-syns` with 68 rules ✅

**Check Current State**: Use `pnpm es:status` to see document counts

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

## Implementation Readiness Status

### ✅ Complete & Ready

- SDK rate limiting (5 req/sec, exponential backoff)
- Rate limit monitoring (warnings at 75%/90%)
- Singleton client pattern (shared state)
- All quality gates passing (1,310+ tests)
- ES Serverless deployed with 6 indexes
- Field definitions architecture (single source of truth)
- Data completeness confirmed (full transcripts uploaded)

### 🎯 Next: Hybrid Field Implementation

- Add 20 Phase 2 fields to 5 existing indexes
- Update field definitions in SDK
- Implement extraction functions (TDD)
- Run `pnpm type-gen` to generate schemas
- Ingest Maths KS4 with hybrid schema

### 📋 Deferred to Later Phases

- Phase 4: AI/Graph fields (13 fields) - see `phase-4-deferred-fields.md`
- New indexes: `oak_threads`, `oak_ontology`, `oak_curriculum_graph`, etc.

---

## Immediate Next Steps

### Current Strategy: Maths KS4 Vertical Slice ⭐

**Context**: Oak API has **1000 requests/hour limit** (discovered 2025-12-07). Full ingestion of 340 combinations would take 17-24 hours. Instead, we're focusing on **Maths KS4** as a complete vertical slice to demonstrate all capabilities.

**Why Maths KS4?**

- Maximum complexity (tiers, pathways, sequences)
- High value to teachers (exam preparation)
- Tests all features with manageable scope
- ~100-200 requests = **10-20 minutes** to ingest

**See**: `.agent/plans/semantic-search/maths-ks4-vertical-slice.md` for complete plan

### Step 1: Implement Hybrid Field Strategy

**Goal**: Add 20 high-confidence Phase 2 fields NOW to avoid re-uploads

**Context**: We're adding fields that are already in API responses or easily derived. This eliminates the need to re-upload Maths KS4 data in Phase 2.

**Current Schema** (Phase 1):

- `oak_lessons`: 21 fields
- `oak_units`: 16 fields
- `oak_unit_rollup`: 18 fields
- `oak_sequences`: 14 fields
- `oak_sequence_facets`: 13 fields

**Adding** (Hybrid Strategy):

- `oak_lessons`: +8 fields → 29 total
- `oak_units`: +8 fields → 24 total
- `oak_unit_rollup`: +10 fields → 28 total
- `oak_sequences`: +6 fields → 20 total
- `oak_sequence_facets`: +5 fields → 18 total

**Key Fields to Add**:

- `tier`, `exam_board`, `pathway` (from API programme factors)
- `difficulty_level`, `estimated_duration_minutes` (computed)
- `resource_types`, `prerequisite_lesson_ids`, `related_lesson_ids` (lessons)
- `unit_type`, `assessment_included`, `prerequisite_unit_ids` (units)
- `combined_misconceptions`, `combined_keywords` (rollups)
- `threads_covered` (sequences)
- `tiers_available`, `exam_boards_available`, `pathways_available`, `threads_available` (facets)

**Data Completeness**: ✅ We already upload **full, untruncated transcripts** to `transcript_text`. No sampling. The `extractPassage()` utility is only for error messages.

**Foundation Alignment**:

- ✅ **Schema-First**: All fields defined in `field-definitions.ts`, generated via `pnpm type-gen`
- ✅ **TDD**: Write tests FIRST (Red → Green → Refactor) for all extraction functions
- ✅ **No Type Shortcuts**: Use proper type guards, no `as`, `any`, `!`, or `Record<string, unknown>`

**See**: `.agent/plans/semantic-search/hybrid-field-strategy.md` for complete implementation plan

**Tasks** (TDD at each step):

1. **RED**: Write unit tests for extraction functions (tier, difficulty, resources)
2. Update field definitions in SDK (`curriculum.ts`)
3. Run `pnpm type-gen` to generate schemas
4. **GREEN**: Implement extraction functions to pass tests
5. **RED**: Write integration tests for document transforms
6. Update ingestion logic to use extraction functions
7. **GREEN**: All tests pass
8. Run quality gates (type-check, lint, format, test)
9. **REFACTOR**: Improve extraction logic if needed
10. Ingest Maths KS4 with hybrid schema (full transcripts included)

### Step 2: Ingest Maths KS4

**Goal**: Populate all 5 content indexes with Maths KS4 data (29-33 fields per index)

```bash
cd apps/oak-open-curriculum-semantic-search

# Check current state
pnpm es:status

# Ingest Maths KS4 across all indexes (with hybrid fields)
pnpm es:ingest-live --subject maths --keystage ks4 --verbose

# Check results
pnpm es:status
```

**Expected Results** (with hybrid fields):

- ~50-100 lessons (**29 fields each**: 21 original + 8 hybrid)
- ~15-25 units (**24 fields**: 16 original + 8 hybrid)
- ~15-25 unit rollups (**28 fields**: 18 original + 10 hybrid)
- ~2-4 sequences (**20 fields**: 14 original + 6 hybrid)
- ~1 sequence facet (**18 fields**: 13 original + 5 hybrid)
- **Time**: 10-20 minutes
- **API cost**: 100-200 requests
- **New fields**: `tier`, `exam_board`, `pathway`, `difficulty_level`, `resource_types`, etc.

**Field Population Expectations**:

- `tier`: >80% coverage (from API programme factors)
- `exam_board`: >60% coverage (may be 'generic' for some)
- `resource_types`: >90% coverage (derived from lesson components)
- `prerequisite_lesson_ids`: 0% (empty, populated in Phase 2)
- `related_lesson_ids`: 0% (empty, populated in Phase 2)

**Rate Limit Monitoring** (automatic during ingestion):

- Logs API quota status every 30 seconds
- Warns at 75% and 90% quota usage
- Shows: requests/sec, quota remaining, reset time

### Step 2: Validate Maths KS4 Completeness

**Check what was ingested**:

```bash
# Check document counts
pnpm es:status

# Test searches
# - Structured: "trigonometry" in Maths KS4
# - Natural language: "How do I teach Pythagoras theorem?"
# - Facets: Filter by tier (Foundation vs Higher)
# - Suggestions: Type "trig" → should autocomplete
```

**Verify**:

- ✅ All 5 indexes have Maths KS4 data
- ✅ Search returns relevant results
- ✅ Facets work for tier filtering
- ✅ Sequences exist (Foundation, Higher)
- ✅ No mapping errors

### Step 3: Expand Maths KS4 Features

**Next phases** (see maths-ks4-vertical-slice.md):

- **Phase 2**: Add thread support and enhanced metadata
- **Phase 3**: Create reference indices (topics, tiers)
- **Phase 4**: Build ontology for RAG features
- **Phase 5**: Implement advanced search capabilities

### Alternative: Full Ingestion (If Needed Later)

**For comprehensive coverage** (17-24 hours):

```bash
# Start systematic ingestion (all 340 combinations)
pnpm ingest:all

# Monitor in another terminal
watch -n 30 'pnpm ingest:progress'

# Safe to interrupt and resume
# Press Ctrl+C, then: pnpm ingest:all --resume
```

See `.agent/plans/semantic-search/api-rate-limit-resolution-plan.md` for full strategy

---

## Key Architectural Concepts

### Schema-First Type Generation (ADR-067)

**Cardinal Rule**: All types, Zod schemas, and ES mappings flow from field definitions via `pnpm type-gen`.

**Never edit generated files.** Update generators in:

- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/`

**After changes**: `pnpm type-gen` → `pnpm build` → verify quality gates

### Public API Boundaries

**Use only public exports** from `@oaknational/oak-curriculum-sdk`:

- Core: `@oaknational/oak-curriculum-sdk`
- Search: `.../public/search`
- MCP: `.../public/mcp-tools`

❌ Never import from `types/generated/` or internal paths

### Per-Index Completion Contexts (ADR-068)

Completion contexts defined per index in `completion-contexts.ts`:

- Lessons/Units/Unit Rollup: `subject`, `key_stage`, `phase`
- Sequences/Sequence Facets: `subject`, `phase` (no key_stage)
- Threads: `subject`, `phase` (threads span keystages)

### Rate Limiting & Retry (ADR-070)

- **API Limit**: 1000 requests/hour
- **SDK Config**: 5 req/sec with 5-attempt exponential backoff
- **Monitoring**: Real-time quota tracking with warnings
- **Singleton**: Shared rate limiting state across app

---

## Development Roadmap

**Current**: Implementing **Maths KS4 vertical slice** with all features

See `.agent/plans/semantic-search/maths-ks4-vertical-slice.md` for complete roadmap including:

- **Phase 1**: Core Maths KS4 ingestion (current)
- **Phase 2**: Enhanced metadata & threads
- **Phase 3**: Reference indices (topics, tiers)
- **Phase 4**: Ontology & RAG integration
- **Phase 5**: Advanced search features

**After Maths KS4 Complete**:

- Expand to other KS4 subjects (Science, English)
- Add other Maths keystages (KS3, KS2)
- Gradually scale to full curriculum
- Migrate to Vercel functions for automation

## Documentation Links

| Topic                            | Location                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------- |
| **Planning Hub**                 | `.agent/plans/semantic-search/index.md` ⭐ START HERE                                       |
| **Maths KS4 Vertical Slice**     | `.agent/plans/semantic-search/maths-ks4-vertical-slice.md` ⭐⭐ CURRENT FOCUS               |
| **Hybrid Field Strategy**        | `.agent/plans/semantic-search/hybrid-field-strategy.md` ⭐ PHASE 1-2 IMPLEMENTATION         |
| **Phase 4 Deferred Fields**      | `.agent/plans/semantic-search/phase-4-deferred-fields.md` 📋 AI/GRAPH FIELDS LATER          |
| **Data Completeness Policy**     | `.agent/plans/semantic-search/data-completeness-policy.md` ✅ WHAT WE UPLOAD IN FULL        |
| Phase roadmap                    | `.agent/plans/semantic-search/semantic-search-overview.md`                                  |
| API rate limit resolution        | `.agent/plans/semantic-search/api-rate-limit-resolution-plan.md`                            |
| Reference indices plan           | `.agent/plans/semantic-search/reference-indices-plan.md`                                    |
| Entity discovery pipeline        | `.agent/plans/semantic-search/entity-discovery-pipeline.md`                                 |
| Graph RAG vision                 | `.agent/research/elasticsearch/ai/graph-rag-integration-vision.md`                          |
| Systematic ingestion guide       | `apps/oak-open-curriculum-semantic-search/scripts/README-INGEST-ALL.md`                     |
| SDK caching                      | `apps/oak-open-curriculum-semantic-search/docs/SDK-CACHING.md`                              |
| Comprehensive field requirements | `.agent/analysis/comprehensive-field-requirements-maths-ks4.md`                             |
| API rate limit investigation     | `.agent/analysis/api-rate-limit-investigation.md`                                           |
| Vercel migration considerations  | `.agent/analysis/vercel-ingestion-migration-considerations.md`                              |
| Discovery analysis               | `.agent/analysis/semantic-search-compliance-and-ingestion-discovery.md`                     |
| ADR-067 (ES mappings)            | `docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md`     |
| ADR-068 (completion contexts)    | `docs/architecture/architectural-decisions/068-per-index-completion-context-enforcement.md` |
| ADR-069 (systematic ingestion)   | `docs/architecture/architectural-decisions/069-systematic-ingestion-progress-tracking.md`   |
| ADR-070 (rate limiting/retry)    | `docs/architecture/architectural-decisions/070-sdk-rate-limiting-and-retry.md`              |

---

## Quick Start: Ingesting Maths KS4

**Prerequisites**: `.env.local` configured with `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`, `OAK_API_KEY`

```bash
cd apps/oak-open-curriculum-semantic-search

# 1. Check ES is reachable
pnpm es:status

# 2. (Optional) Start Redis for caching
pnpm redis:up

# 3. Ingest Maths KS4
pnpm es:ingest-live --subject maths --keystage ks4 --verbose

# 4. Verify results
pnpm es:status
```

**Time**: 10-20 minutes | **API cost**: ~100-200 requests

**Quality Gates** (from repo root): `pnpm type-gen && pnpm build && pnpm type-check && pnpm test`

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
