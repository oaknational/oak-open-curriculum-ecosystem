# Semantic Search — Session Entry Point

**Last Updated**: 2026-01-10
**Status**: ✅ **Category Consistency + Benchmark Output Complete** — All 5 categories required, per-category metrics displayed

---

## 🎯 Current State

### Completed Work (2026-01-10)

1. ✅ **Added `pedagogical-intent` queries to ALL 29 entries** — All 30 entries now have consistent category coverage with all 5 required categories.

2. ✅ **Updated benchmark output to show per-category metrics** — Benchmark runs now display per-category grid with MRR, NDCG@10, P@10, R@10, Zero%, and AvgMs for each category.

### Why This Matters

- **Category consistency**: Benchmarks are now comparable across subjects. All entries have the same category coverage.
- **Output granularity**: Per-category metrics reveal category-specific problems that aggregate metrics hide.

### Current State

| Aspect | Status | Notes |
|--------|--------|-------|
| Ground truths | ✅ ~500+ queries, 30 entries | All 5 categories required per entry |
| Benchmarks | ✅ All 6 metrics collected | Per-category breakdown in output |
| Validation | ✅ `pedagogical-intent` required | Min 1 per entry enforced |

---

## First Actions This Session

### 1. Read Foundation Documents

Before any work, re-read and commit to:

- [rules.md](../../directives-and-memory/rules.md) — First Question, TDD, no shortcuts
- [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — Test behaviour

### 2. Run Benchmarks

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm ground-truth:validate          # Must pass
pnpm benchmark --all                # Shows per-category grid
```

### 3. Record Results

Update `evaluation/baselines/baselines.json` with ALL measured metrics:

- MRR, NDCG@10, Precision@10, Recall@10, Zero-Hit Rate, p95 Latency
- Include per-category baselines

**Note**: Results are stored in `baselines.json`, NOT in the registry code. The registry (`entries.ts`) contains only ground truth queries.

Document full results in `.agent/evaluations/EXPERIMENT-LOG.md` with complete per-category metrics tables.

---

## Ground Truth Summary (Stage 3 Complete)

### Review Statistics (2026-01-09)

| Metric | Value |
|--------|-------|
| Total queries reviewed | 474 |
| Total slugs validated | 1,290 |
| Subject/phase entries | 30 |
| Issues found | 1 |
| Issues fixed | 1 |

### Issue Log

| Entry | Query | Issue | Resolution |
|-------|-------|-------|------------|
| maths/primary | times tables year 3 | Wrong category | cross-topic → precise-topic |

### Category Coverage Requirements

**ALL 5 categories are REQUIRED** for consistent cross-subject benchmarking:

| Category | Minimum | Status |
|----------|---------|--------|
| `precise-topic` | 4+ | ✅ All 30 entries pass |
| `natural-expression` | 2+ | ✅ All 30 entries pass |
| `imprecise-input` | 1+ | ✅ All 30 entries pass |
| `cross-topic` | 1+ | ✅ All 30 entries pass |
| `pedagogical-intent` | 1+ | ✅ All 30 entries pass |

All entries now have complete category coverage.

### Deep Verification (Sampling)

15 queries across maths and english verified against lesson summaries:

- Relevance scores match actual lesson content
- No obviously missing lessons in verified queries
- Vocabulary bridging works as intended (e.g., "rearrange formulas" → "changing the subject")

---

## Workspace

**App**: `apps/oak-open-curriculum-semantic-search/`

**Ground truths**: `src/lib/search-quality/ground-truth/{subject}/{phase}/`

**Bulk data**: `bulk-downloads/{subject}-{phase}.json`

**Registry**: `src/lib/search-quality/ground-truth/registry/`

---

## Key Documents

| Document | Purpose |
|----------|---------|
| [M3 Plan](../../plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md) | Full phase status, design rules |
| [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Three-stage validation discipline |
| [ADR-098](../../../docs/architecture/architectural-decisions/098-ground-truth-registry.md) | Ground truth registry design |
| [Stage 3 Review](../../reviews/stage-3-review-progress.md) | Qualitative review results |

---

## Commands

```bash
# Validation (should pass)
pnpm type-check               # Stage 1: Data integrity
pnpm ground-truth:validate    # Stage 2: Semantic rules (16 checks)
pnpm ground-truth:analyze     # Quality breakdown by entry

# Benchmarks (Phase 8)
pnpm benchmark --all          # Run all 30 entries
pnpm benchmark --subject maths --verbose  # Single subject with detail

# Quality gates (after changes)
cd /Users/jim/code/oak/oak-mcp-ecosystem
pnpm type-gen && pnpm build && pnpm type-check
pnpm lint:fix && pnpm format:root && pnpm markdownlint:root
pnpm test && pnpm test:e2e && pnpm test:e2e:built
pnpm test:ui && pnpm smoke:dev:stub
```

---

## Quality Gate Results (2026-01-09)

All gates passed:

| Gate | Status |
|------|--------|
| type-gen | ✓ PASS |
| build | ✓ PASS |
| type-check | ✓ PASS |
| lint:fix | ✓ PASS |
| format:root | ✓ PASS |
| markdownlint:root | ✓ PASS |
| test (1061 tests) | ✓ PASS |
| test:e2e | ✓ PASS |
| test:e2e:built | ✓ PASS |
| test:ui | ✓ PASS |
| smoke:dev:stub | ✓ PASS |
| ground-truth:validate | ✓ PASS |
