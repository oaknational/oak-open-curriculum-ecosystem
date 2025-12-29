---
name: Search Ingest Reset with Review
overview: Phase 0 review of all plans and data, then implement pattern-aware curriculum traversal, reset Elasticsearch, perform complete verified ingestion, and extract SDK/CLI for MCP integration.
todos:
  - id: phase0-plans
    content: Audit all plans in .agent/plans/semantic-search/ for accuracy and relevance
    status: pending
  - id: phase0-code
    content: Review ingestion code architecture to understand current capabilities and gaps
    status: pending
  - id: phase0-bulk
    content: Verify bulk download data (30 files, lesson counts, structure)
    status: pending
  - id: phase0-api
    content: Verify API structure via MCP tools for each pattern type
    status: pending
  - id: phase0-es
    content: Document current Elasticsearch state (indices, counts, gaps)
    status: pending
  - id: phase0-update
    content: Update all plan documents with verified findings
    status: pending
  - id: phase1-patterns
    content: Implement static pattern configuration for 68 subject x keystage combinations
    status: pending
  - id: phase1-traversal
    content: Implement pattern-aware traversal in ingestion code
    status: pending
  - id: phase1-validation
    content: Add contract validation for pattern detection
    status: pending
  - id: phase1-gates
    content: Run all quality gates after Phase 1
    status: pending
  - id: phase2-reset
    content: Reset Elasticsearch (delete indices, recreate mappings)
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

## Phase 0: Thorough Review and Plan Validation

**Principle**: Assume nothing, verify everything.

### 0.1 Review Existing Plans

Audit all files in `.agent/plans/semantic-search/`:

- [roadmap.md](.agent/plans/semantic-search/roadmap.md) - Is the milestone order correct?
- [current-state.md](.agent/plans/semantic-search/current-state.md) - What is actually stale?
- [search-acceptance-criteria.md](.agent/plans/semantic-search/search-acceptance-criteria.md) - Still valid?
- `active/` subdirectory - Which plans are actually active vs blocked?
- `planned/` subdirectory - Are these still relevant?

Cross-reference with archive at `.agent/plans/archive/semantic-search-archive-dec25/` for context.

### 0.2 Review Code Architecture

Audit key ingestion code:

- [index-batch-generator.ts](apps/oak-open-curriculum-semantic-search/src/lib/index-batch-generator.ts)
- [index-batch-helpers.ts](apps/oak-open-curriculum-semantic-search/src/lib/index-batch-helpers.ts)
- [ks4-context-builder.ts](apps/oak-open-curriculum-semantic-search/src/lib/indexing/ks4-context-builder.ts)
- [fetch-all-lessons.ts](apps/oak-open-curriculum-semantic-search/src/lib/indexing/fetch-all-lessons.ts)

Questions to answer:

- Does the code already handle any patterns correctly?
- What's working vs what's broken?
- Where does pattern-aware logic need to be added?

### 0.3 Verify Bulk Download Data

Audit `reference/bulk_download_data/`:

- Confirm all 30 files present (17 subjects x primary/secondary, minus exceptions)
- Verify lesson counts match [curriculum-structure-analysis.md](.agent/analysis/curriculum-structure-analysis.md)
- Confirm RSHE-PSHE has no bulk file (API only)
- Document any discrepancies

### 0.4 Verify API Structure via MCP Tools

Use OOC MCP tools to confirm documented patterns:

- `get-subjects` - Verify 17 subjects with correct sequences
- `get-sequences-units` for each pattern type:
- `maths-secondary` year 10 - Confirm `tiers[]` structure
- `science-secondary-aqa` year 10 - Confirm `examSubjects[]` structure
- `english-secondary-aqa` year 10 - Confirm `unitOptions[]` structure
- Verify Science KS4 returns empty via `get-key-stages-subject-lessons`

### 0.5 Document Current ES State

Query Elasticsearch directly to understand current state:

- Which indices exist?
- Document counts per subject/keystage
- What data is present vs missing?

### 0.6 Update Plans with Findings

Update all plan documents with verified information:

- Mark stale sections explicitly
- Correct any outdated metrics
- Update roadmap milestones if needed
- Ensure all plans reference correct file paths

---

## Phase 1: Pattern-Aware Ingestion Implementation

### 1.1 Implement Static Pattern Configuration

Create static configuration for all 68 subject x key stage combinations based on [ADR-080](docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md).**Key patterns**:| Pattern | Subjects | Traversal ||---------|----------|-----------|| simple-flat | All KS1-KS3, some KS4 | `/key-stages/{ks}/subject/{subject}/lessons` || tier-variants | Maths KS4 | `sequences/{seq}/units` with `tiers[]` || exam-subject-split | Science KS4 | `examSubjects[] -> tiers[]` || exam-board-variants | 12 subjects KS4 | Multiple sequence slugs || unit-options | 6 subjects KS4 | Handle `unitOptions[]` || no-ks4 | Cooking-nutrition | Skip KS4 |

### 1.2 Implement Pattern-Aware Traversal

Modify ingestion code to:

1. Detect pattern from static config
2. Route to appropriate traversal function
3. Validate response matches expected pattern
4. Aggregate metadata correctly

### 1.3 Add Contract Validation

Implement startup validation that samples each unique pattern.---

## Phase 2: ES Reset and Complete Ingestion

### 2.1 Reset Elasticsearch

Delete all existing indices and recreate with current mappings.

### 2.2 Full Curriculum Ingestion

Ingest all 17 subjects across all key stages.Expected: ~12,316 unique lessons, ~400+ units.---

## Phase 3: Deep Verification

### 3.1 Per-Subject Count Verification

Compare counts from three independent sources:

1. Bulk download reference (local JSON)
2. Live API queries (via OOC MCP tools)
3. ES aggregation queries

Acceptable variance: +/- 3 lessons per subject.

### 3.2 Pattern-Specific Verification

| Pattern | Verification ||---------|-------------|| Tier variants | Maths: Both tiers indexed with correct `tiers[]` || Exam subjects | Science: All 4 exam subjects present || Exam boards | Correct aggregation across AQA/Edexcel/OCR || Unit options | Lessons with multiple unit associations |

### 3.3 Search Quality Baseline

Establish new baselines with `pnpm eval:per-category` and `pnpm eval:diagnostic`.Update [current-state.md](.agent/plans/semantic-search/current-state.md).---

## Phase 4: SDK/CLI Extraction

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

| Criterion | Target ||-----------|--------|| Plans reviewed and updated | All in `.agent/plans/semantic-search/` || Lessons indexed | ~12,316 || Subjects complete | 17/17 || Pattern coverage | All 7 patterns || Verification sources agree | Bulk, API, ES || Quality gates | All pass || SDK extracted | Retrieval + Admin + Observability |
