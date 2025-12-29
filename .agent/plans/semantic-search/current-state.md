# Semantic Search Current State

**Last Updated**: 2025-12-28  
**Measured Against**: Maths KS4 (vertical slice)  
**Ground Truth Status**: ✅ Corrected and Verified

This is THE authoritative source for current system metrics.

---

## Current Metrics (Verified 2025-12-24)

### Overall Performance

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Lesson Hard MRR | **0.614** | ≥0.45 | ✅ EXCEEDS target by 36% |
| Unit Hard Query MRR | 0.806 | ≥0.50 | ✅ Met |
| Lesson Std Query MRR | 0.963 | ≥0.92 | ✅ Met |
| Unit Std Query MRR | 0.988 | ≥0.92 | ✅ Met |
| Zero-hit Rate | 0% | 0% | ✅ Met |
| p95 Latency | ~450ms | ≤1500ms | ✅ Met |

### Per-Category Breakdown (Lesson Hard Queries)

| Category | MRR | Status |
|----------|-----|--------|
| misspelling | 0.833 | ✅ Excellent |
| naturalistic | 0.722 | ✅ Good |
| multi-concept | 0.625 | ✅ Good |
| synonym | 0.611 | ✅ Good |
| colloquial | 0.500 | ✅ Good |
| intent-based | 0.229 | ⚠️ Exception (Tier 4 problem) |

---

## Tier Status

| Tier | Name | Status | Exit Criteria |
|------|------|--------|---------------|
| **1** | Search Fundamentals | ✅ **EXHAUSTED** | MRR 0.614 ≥ 0.45, all approaches verified |
| **2** | Document Relationships | 🔓 Ready | MRR ≥0.55 — Can proceed |
| **3** | Modern ES Features | 📋 Blocked | MRR ≥0.60 — Waiting for Tier 2 |
| **4** | AI Enhancement | ⏸️ Deferred | Only after Tiers 1-3 exhausted |

**See**: [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)

---

## Quality Gate Status

**✅ ALL QUALITY GATES PASS** (verified 2025-12-23)

| Gate | Status |
|------|--------|
| `pnpm type-gen` | ✅ Pass |
| `pnpm build` | ✅ Pass |
| `pnpm type-check` | ✅ Pass |
| `pnpm lint:fix` | ✅ Pass |
| `pnpm format:root` | ✅ Pass |
| `pnpm markdownlint:root` | ✅ Pass |
| `pnpm test` | ✅ Pass |
| `pnpm test:e2e` | ✅ Pass |
| `pnpm test:e2e:built` | ✅ Pass |
| `pnpm test:ui` | ✅ Pass |
| `pnpm smoke:dev:stub` | ✅ Pass |

---

## Index Status

**Last Ingestion**: 2025-12-22 18:47:08 UTC

| Index | Live Docs | Status |
|-------|-----------|--------|
| `oak_lessons` | 436 | ✅ Complete (Maths KS4) |
| `oak_units` | 36 | ✅ All lesson_counts correct |
| `oak_unit_rollup` | 36 | ✅ All lesson_counts correct |
| `oak_threads` | 201 | ✅ Complete |
| `oak_sequences` | 2 | ✅ Complete |

**Note**: Currently Maths KS4 only (~27% of full curriculum). Multi-subject ingestion pending.

---

## Ground Truth Status

| Ground Truth | Queries | Status |
|--------------|---------|--------|
| Lesson standard | 40 | ✅ All exist |
| Lesson hard | 15 | ✅ Corrected |
| Lesson diagnostic | 18 | ✅ Corrected |
| Unit standard | Multiple | ✅ All exist |
| Unit hard | Multiple | ✅ All exist |
| Sequence standard | 24 | ✅ Created |
| Sequence hard | 17 | ✅ Created |

**Validation**: `pnpm tsx evaluation/validation/validate-ground-truth.ts`

---

## Implementation Status

| Feature | Status | Verified |
|---------|--------|----------|
| B.4 Noise Filtering | ✅ Implemented | ✅ Contributing to 0.614 |
| B.5 Phrase Boosting | ✅ Implemented | ✅ Contributing to 0.614 |
| Synonyms (163 entries) | ✅ Deployed | ✅ All queries succeed |
| Four-retriever hybrid | ✅ Implemented | ✅ Ablation study complete |

---

## Related Documents

- **[roadmap.md](roadmap.md)** — Linear execution path
- **[EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)** — Chronological history
- **[ground-truth-corrections.md](../../evaluations/ground-truth-corrections.md)** — 63 slug corrections
- **[archive/completed/](archive/completed/)** — Completed work summaries
