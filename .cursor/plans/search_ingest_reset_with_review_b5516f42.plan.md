---
name: Search Ingest Reset with Review
overview: Phase 0 review of all plans and data, then implement pattern-aware curriculum traversal, reset Elasticsearch, perform complete verified ingestion, and extract SDK/CLI for MCP integration.
todos:
  - id: phase0-plans
    content: Audit all plans in .agent/plans/semantic-search/ for accuracy and relevance
    status: completed
  - id: phase0-code
    content: Review ingestion code architecture to understand current capabilities and gaps
    status: completed
  - id: phase0-bulk
    content: Verify bulk download data (30 files, lesson counts, structure)
    status: completed
  - id: phase0-api
    content: Verify API structure via MCP tools for each pattern type
    status: completed
  - id: phase0-es
    content: Document current Elasticsearch state (indices, counts, gaps)
    status: completed
  - id: phase0-update
    content: Update all plan documents with verified findings
    status: completed
  - id: phase1-patterns
    content: Implement static pattern configuration for 68 subject x keystage combinations
    status: completed
  - id: phase1-traversal
    content: Implement pattern-aware traversal in ingestion code
    status: completed
  - id: phase1-validation
    content: Add contract validation for pattern detection
    status: completed
  - id: phase1-gates
    content: Run all quality gates after Phase 1
    status: completed
  - id: phase2-adapter-refactor
    content: Refactor oak-adapter.ts - extract caching to sdk-cache/, reduce complexity
    status: completed
  - id: phase2-gates-pre
    content: Run all quality gates after adapter refactoring
    status: completed
  - id: phase2-api-efficiency
    content: Implement efficient API traversal - use bulk assets endpoint to check video availability
    status: completed
  - id: phase2-reset
    content: Reset Elasticsearch (delete indices, recreate mappings)
    status: pending
  - id: phase2-cache-validation
    content: Verify caching still works after refactoring (new CacheOperations interface)
    status: pending
  - id: phase2-es-upsert
    content: Validate ES upserting - only index if doc doesn't exist
    status: pending
  - id: phase2-ingest
    content: Run full curriculum ingestion (all 17 subjects)
    status: pending
  - id: phase2-gates
    content: Run all quality gates after Phase 2
    status: pending
  - id: phase3-counts
    content: Verify per-subject counts against bulk, API, and ES
    status: pending
  - id: phase3-patterns
    content: Verify pattern-specific data (tiers, exam boards, exam subjects)
    status: pending
  - id: phase3-baseline
    content: Establish new search quality baseline metrics
    status: pending
  - id: phase3-docs
    content: Update current-state.md and roadmap.md with verified data
    status: pending
  - id: phase3-gates
    content: Run all quality gates after Phase 3
    status: pending
  - id: phase4-sdk
    content: Extract Search SDK to packages/libs/search-sdk/
    status: pending
  - id: phase4-cli
    content: Build CLI workspace at apps/search-cli/
    status: pending
  - id: phase4-mcp
    content: Wire SDK into MCP server for semantic search tool
    status: pending
  - id: phase4-gates
    content: Run all quality gates after Phase 4
    status: pending
---

# Complete Search Ingest Reset and SDK Extraction

## Problem Statement

The current ingestion pipeline uses a single traversal strategy that fails for complex curriculum patterns. The documented metrics and ES state are stale. A thorough review followed by clean-slate implementation is required.---

## ✅ Phase 0: Thorough Review and Plan Validation — COMPLETE

All plan documents audited and updated. Bulk download data verified (30 files, ~12,316 unique lessons). API structure verified via MCP tools. ES state documented.---

## ✅ Phase 1: Pattern-Aware Ingestion Implementation — COMPLETE

### Implemented Files

| File | Purpose || ----------------------------------------------- | ----------------------------------------------------- || `src/lib/indexing/curriculum-pattern-config.ts` | Static config for 68 subject × key stage combinations || `src/lib/indexing/pattern-aware-fetcher.ts` | Pattern-aware data fetching || `src/lib/indexing/sequence-unit-extraction.ts` | Complex unit extraction || `src/lib/indexing/pattern-config-validator.ts` | Startup validation || `src/lib/indexing/bulk-action-factory.ts` | Incremental vs force mode |

### All 7 Patterns Implemented

| Pattern | Subjects || --------------------- | --------------------- || `simple-flat` | All KS1-KS3, some KS4 || `tier-variants` | Maths KS4 || `exam-subject-split` | Science KS4 || `exam-board-variants` | 12 subjects KS4 || `unit-options` | 6 subjects KS4 || `no-ks4` | Cooking-nutrition || `empty` | Edge cases |---

## 🔄 Phase 2: ES Reset and Complete Ingestion — IN PROGRESS

### ✅ 2.1 Adapter Refactoring — COMPLETE (2025-12-29)

Reduced `oak-adapter.ts` from 593 lines to 197 lines using TDD:| New File | Purpose | Lines || ---------------------------- | ------------------------------------------- | ----- || `sdk-cache/cache-wrapper.ts` | `withCache`, `withCacheAndNegative` with DI | 248 || `sdk-api-methods.ts` | API method factories | 143 || `sdk-client-factory.ts` | Client creation helpers | 141 |All 22 adapter tests passing. All 11 quality gates passing.**Key change**: Caching now uses `CacheOperations` interface for dependency injection.

### 📋 2.2 Reset Elasticsearch — PENDING

**Action Required**: Delete all `oak_*` indices and recreate with current mappings.

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup --reset
```



### 📋 2.3 Cache Validation — PENDING (Re-verification Required)

**Why re-verification needed**: The adapter refactoring introduced a new `CacheOperations` interface that abstracts Redis. Need to verify:

1. **Redis connection** still works via `createRedisClient()`
2. **Cache reads** work via new `withCache()` wrapper
3. **Cache writes** work with TTL jitter
4. **Negative caching** works via `withCacheAndNegative()` for 404s
5. **`--bypass-cache` flag** still works
6. **`--ignore-cached-404` flag** still works

**Verification Commands**:

```bash
# Check Redis connection and cache status
cd apps/oak-open-curriculum-semantic-search

# Test with cache enabled (should use Redis)
pnpm es:ingest-live --subject maths --keystage ks1 --verbose --dry-run

# Test with cache bypassed
pnpm es:ingest-live --subject maths --keystage ks1 --verbose --bypass-cache --dry-run

# Test ignoring cached 404s
pnpm es:ingest-live --subject maths --keystage ks1 --verbose --ignore-cached-404 --dry-run
```



### 📋 2.4 ES Upsert Validation — PENDING

Verify incremental mode (ES `create` action) still works:

- Default mode should fail if doc exists
- `--force` flag should use ES `index` action (overwrite)

### 📋 2.5 Full Curriculum Ingestion — PENDING

**Command**:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:ingest-live --all --verbose
```

**Expected**: ~12,316 unique lessons across 17 subjects.---

## Phase 3: Deep Verification — PENDING

### 3.1 Per-Subject Count Verification

Compare counts from three independent sources:

1. Bulk download reference (local JSON)
2. Live API queries (via OOC MCP tools)
3. ES aggregation queries

Acceptable variance: ±3 lessons per subject.

### 3.2 Pattern-Specific Verification

| Pattern | Verification || ------------- | ------------------------------------------------ || Tier variants | Maths: Both tiers indexed with correct `tiers[]` || Exam subjects | Science: All 4 exam subjects present || Exam boards | Correct aggregation across AQA/Edexcel/OCR || Unit options | Lessons with multiple unit associations |

### 3.3 Search Quality Baseline

Establish new baselines with `pnpm eval:per-category` and `pnpm eval:diagnostic`.Update [current-state.md](.agent/plans/semantic-search/current-state.md).---

## Phase 4: SDK/CLI Extraction — PENDING

Only after Phase 3 complete with all quality gates passing.

### 4.1 Extract Search SDK

Move to `packages/libs/search-sdk/`:

- Retrieval services (RRF query builders)
- Admin services (setup, ingestion)
- Observability services (zero-hit logging)
- Dependency injection pattern

### 4.2 Build CLI Workspace

Create `apps/search-cli/`:

- Commands: `setup`, `ingest`, `verify`, `status`
- Consumes SDK

### 4.3 MCP Integration

Wire SDK into Express MCP server for semantic search tool.---

## Quality Gates (After Each Phase)

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

All gates must pass before proceeding.---

## Foundation Documents (Re-read at Each Phase)

1. [rules.md](.agent/directives-and-memory/rules.md)
2. [testing-strategy.md](.agent/directives-and-memory/testing-strategy.md)
3. [schema-first-execution.md](.agent/directives-and-memory/schema-first-execution.md)

---

## Success Criteria