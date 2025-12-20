# Semantic Search Current State

**Last Updated**: 2025-12-20  
**Measured Against**: Maths KS4 (vertical slice)

This is THE authoritative source for current system metrics. All other documents reference this file.

---

## Current Metrics

### Overall Performance

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Standard Query MRR | 0.931 | ≥0.92 | ✅ Met |
| Lesson Hard Query MRR | 0.380 | ≥0.50 | ❌ Gap: 32% |
| Unit Hard Query MRR | 0.844 | ≥0.50 | ✅ Met |
| Zero-hit Rate | 0% | 0% | ✅ Met |
| p95 Latency | ~450ms | ≤1500ms | ✅ Within budget |

### Per-Category Breakdown (Lesson Hard Queries)

| Category | MRR | Status | Notes |
|----------|-----|--------|-------|
| Misspelling | 0.833 | ✅ Excellent | Fuzzy matching working well |
| Intent-based | 0.500 | ✅ Good | 1/2 succeeds |
| Naturalistic | 0.333 | ⚠️ Acceptable | Noise phrases dilute signal |
| Multi-concept | 0.250 | ❌ Poor | Cross-reference missing |
| Synonym | 0.167 | ❌ Poor | Vocabulary gaps remain |
| Colloquial | 0.000 | ❌ Very Poor | Noise + vocabulary |

---

## Index Status

Expected document counts for Maths KS4:

| Index | Expected Count |
|-------|----------------|
| `oak_lessons` | ~314 |
| `oak_units` | ~36 |
| `oak_unit_rollup` | ~244 |
| `oak_threads` | ~201 |
| `oak_sequences` | ~2 |

Verify with: `pnpm es:status` (from `apps/oak-open-curriculum-semantic-search`)

---

## Current Tier Status

Per [ADR-082: Fundamentals-First Strategy](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md):

| Tier | Name | Status | Exit Criteria |
|------|------|--------|---------------|
| **1** | Search Fundamentals | 🔄 In Progress | MRR ≥0.45 |
| **2** | Document Relationships | 📋 Pending | MRR ≥0.55 |
| **3** | Modern ES Features | 📋 Pending | MRR ≥0.60 |
| **4** | AI Enhancement | ⏸️ Deferred | Tiers 1-3 plateau |

---

## Known Issues

### S-001: Ingestion Gap — Lessons Available in API Not Indexed

**Status**: 🔴 OPEN  
**Priority**: High  
**Discovered**: 2025-12-19

Lessons present in the bulk download and available via direct API calls are not appearing in search results.

**Example**: Query "completing the square" with `keyStage: "ks4"` — lesson `solving-quadratic-equations-by-completing-the-square` not found despite being available upstream.

**Likely root cause**: One of:
1. SDK ingestion logic filtering out lessons incorrectly
2. Silent failures during bulk ingestion not being retried
3. Pagination handling missing pages of data

**Impact**: Search quality degraded, MRR metrics artificially lowered.

**Investigation steps**:
- [ ] Review ingestion scripts for Maths KS4 data
- [ ] Check SDK's bulk data fetching and pagination logic
- [ ] Compare count of lessons in API vs count indexed in Elasticsearch

---

## Historical Context

For the full history of experiments and their impact on these metrics, see:

- **[EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)** — Chronological experiment history
- **[EXPERIMENT-PRIORITIES.md](../../evaluations/experiments/EXPERIMENT-PRIORITIES.md)** — Strategic roadmap

---

## How to Update This Document

When metrics change (after an experiment or system change):

1. Run the relevant smoke tests to measure new values
2. Update the metrics tables above
3. Update the "Last Updated" date
4. Add an entry to [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)

```bash
# Measure current metrics
cd apps/oak-open-curriculum-semantic-search
pnpm vitest run -c vitest.smoke.config.ts hard-query-baseline
```

