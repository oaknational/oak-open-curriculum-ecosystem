# Pattern-Aware Ingestion

**Status**: ✅ COMPLETE
**Priority**: Was High — Now DONE
**Parent**: [roadmap.md](../roadmap.md) (Milestone 2)
**Created**: 2025-12-24
**Completed**: 2025-12-29

---

## Summary

All 7 curriculum structural patterns are now implemented and tested. The ingestion pipeline can traverse any subject × key stage combination.

---

## Implementation

### Files Created

| File                                            | Purpose                                               |
| ----------------------------------------------- | ----------------------------------------------------- |
| `src/lib/indexing/curriculum-pattern-config.ts` | Static config for 68 subject × key stage combinations |
| `src/lib/indexing/pattern-aware-fetcher.ts`     | Pattern-aware data fetching                           |
| `src/lib/indexing/sequence-unit-extraction.ts`  | Complex unit extraction for tier/exam patterns        |
| `src/lib/indexing/pattern-config-validator.ts`  | Startup validation of pattern config                  |
| `src/lib/indexing/bulk-action-factory.ts`       | Incremental vs force mode handling                    |

### All 7 Patterns

| Pattern               | Description                          | Subjects                      |
| --------------------- | ------------------------------------ | ----------------------------- |
| `simple-flat`         | Direct units endpoint                | All KS1-KS3, some KS4         |
| `tier-variants`       | Foundation/Higher tiers              | Maths KS4                     |
| `exam-subject-split`  | Biology/Chemistry/Physics/Combined   | Science KS4                   |
| `exam-board-variants` | AQA/Edexcel/OCR variants             | 12 subjects at KS4            |
| `unit-options`        | Multiple unit choices per slot       | 6 subjects at KS4             |
| `no-ks4`              | No KS4 content available             | Cooking-nutrition             |
| `empty`               | Edge case handling                   | Fallback for unknown subjects |

### Pattern Coverage

68 subject × key stage combinations are covered:

- **17 subjects** (all Oak curriculum subjects)
- **4 key stages** (KS1, KS2, KS3, KS4)
- **Per-combination pattern** assigned in static config

---

## Why This Was Needed

### The Problem

The original ingestion used a single traversal strategy:

```text
Subject → Units endpoint → Lessons
```

This **failed for 40% of KS4** subjects because:

1. **Science KS4** has 4 exam subjects (biology, chemistry, physics, combined-science)
2. **Maths KS4** has 2 tiers (foundation, higher)
3. **12 subjects at KS4** have exam board variants (AQA, Edexcel, OCR)

### The Solution

Pattern-aware traversal that uses the correct API path for each pattern:

| Pattern               | API Path                                              |
| --------------------- | ----------------------------------------------------- |
| `simple-flat`         | `/keystages/{ks}/subjects/{subject}/units`            |
| `tier-variants`       | `/sequences/{subject}-secondary-{tier}/units`         |
| `exam-subject-split`  | `/subjects/{subject}/sequences` → per-exam-subject    |
| `exam-board-variants` | `/subjects/{subject}/sequences` → per-exam-board      |
| `unit-options`        | Standard path, but deduplicates unit options          |

---

## Related Documents

- [ADR-080](../../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md) — Curriculum denormalisation strategy
- [curriculum-structure-analysis.md](../../../analysis/curriculum-structure-analysis.md) — 7 patterns documented
- [curriculum-traversal-strategy.md](../../curriculum-traversal-strategy.md) — API traversal patterns
- [complete-data-indexing.md](./complete-data-indexing.md) — Ingestion plan (uses this pattern config)

---

## Next Steps

This milestone is complete. Next:

1. **Reset ES** — Fresh indices after adapter refactoring
2. **Verify caching** — New `CacheOperations` interface
3. **Run ingestion** — `pnpm es:ingest-live --all --verbose`

See [complete-data-indexing.md](./complete-data-indexing.md) for details.
