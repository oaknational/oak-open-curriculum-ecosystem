---
name: Semantic Search Ingestion
overview: Complete full curriculum ingestion (~12,316 lessons) and deep verification. Consolidates remaining work from legacy plans. Phase 4 (SDK extraction) deferred for later reassessment.
todos:
  - id: consolidate-plans
    content: Delete legacy .cursor/plans/ files after plan approval
    status: completed
  - id: phase2-ingest
    content: "Run full curriculum ingestion: pnpm es:ingest-live --all --verbose"
    status: pending
  - id: phase2-gates
    content: Run all 11 quality gates after ingestion
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
    content: Run all 11 quality gates after Phase 3
    status: pending
---

# Semantic Search: Full Ingestion and Verification

## Impact Statement

Enable teachers and educators to find curriculum content by meaning across the complete Oak curriculum (~12,316 lessons, 17 subjects, all key stages).---

## Pre-Flight: Consolidate Legacy Plans

Before execution, consolidate remaining work and delete legacy `.cursor/plans/` files:

1. This plan captures all pending TODOs from:

- [cache_categorization_enhancement_dc74f980.plan.md](.cursor/plans/cache_categorization_enhancement_dc74f980.plan.md) — **COMPLETE** (no pending work)
- [search_ingest_reset_with_review_b5516f42.plan.md](.cursor/plans/search_ingest_reset_with_review_b5516f42.plan.md) — Pending work captured below

2. After plan approval, delete both legacy plan files

---

## Phase 2.6: Full Curriculum Ingestion

**Goal**: Index complete curriculum into Elasticsearch**Command**:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:ingest-live --all --verbose
```

**Expected outcome**: ~12,316 unique lessons across 17 subjects indexed.**Monitoring**: Run with `--verbose` to observe per-subject progress and any errors.**Quality gates after ingestion**:

```bash
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix && pnpm format:root && pnpm markdownlint:root && pnpm test && pnpm test:e2e && pnpm test:e2e:built && pnpm test:ui && pnpm smoke:dev:stub
```

---

## Phase 3: Deep Verification

### 3.1 Per-Subject Count Verification

Compare lesson counts from three independent sources:| Source | Method ||--------|--------|| Bulk download | Count from `reference/bulk_download_data/` JSON files || Live API | Query via OOC MCP tools (`get-key-stages-subject-lessons`) || Elasticsearch | Aggregation query on `oak_lessons` index |Acceptable variance: +/-3 lessons per subject.

### 3.2 Pattern-Specific Verification

| Pattern | Verification ||---------|-------------|| Tier variants | Maths KS4: Both foundation/higher tiers indexed with correct `tiers[]` || Exam subjects | Science KS4: All 4 exam subjects (biology, chemistry, physics, combined-science) present || Exam boards | Correct aggregation across AQA/Edexcel/OCR where applicable || Unit options | Lessons with multiple unit associations correctly linked |

### 3.3 Search Quality Baseline

Run evaluation scripts to establish new metrics:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category
pnpm eval:diagnostic
```



### 3.4 Documentation Update

Update:

- [current-state.md](.agent/plans/semantic-search/current-state.md) — Verified counts and metrics
- [roadmap.md](.agent/plans/semantic-search/roadmap.md) — Mark phases complete

**Quality gates after Phase 3**:

```bash
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix && pnpm format:root && pnpm markdownlint:root && pnpm test && pnpm test:e2e && pnpm test:e2e:built && pnpm test:ui && pnpm smoke:dev:stub
```

---

## Deferred: Phase 4 (SDK/CLI Extraction)

**Status**: Deferred for reassessment after Phase 3 complete.**Rationale**: First Question — "Could it be simpler?" Focus on proving the search feature works end-to-end before architectural extraction.**Future scope** (pending reassessment):

- Extract Search SDK to `packages/libs/search-sdk/`
- Build CLI workspace at `apps/search-cli/`
- MCP integration (target server to be clarified)

---

## Foundation Document Checkpoints

Re-read at each phase transition:

1. [rules.md](.agent/directives-and-memory/rules.md) — First Question, Cardinal Rule
2. [testing-strategy.md](.agent/directives-and-memory/testing-strategy.md) — TDD at all levels
3. [schema-first-execution.md](.agent/directives-and-memory/schema-first-execution.md) — Generator is source of truth

---

## Success Criteria

- [ ] Full curriculum indexed (~12,316 lessons)
- [ ] Per-subject counts verified within +/-3 variance
- [ ] Pattern-specific data verified (tiers, exam boards, exam subjects)
- [ ] Search quality baseline established