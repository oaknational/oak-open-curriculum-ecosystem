# Multi-Index Ground Truths Plan

**Status**: ✅ Complete  
**Created**: 2026-02-05  
**Completed**: 2026-02-05  
**Priority**: Medium (post-lesson-GT foundation)

---

## Context

We have ground truths for all four searchable indexes. Lesson queries use realistic teacher vocabulary (see [ADR-106 refinement](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md#refinement-title-echoing-circularity-2026-02-09)).

| Index | Documents | GTs | Status | MRR |
|-------|-----------|-----|--------|-----|
| `oak_lessons` | 12,833 | 30 | ✅ Done | 0.983 |
| `oak_units` | 1,665 | 2 | ✅ Done | 1.000 |
| `oak_threads` | 164 | 1 | ✅ Done | 1.000 |
| `oak_sequences` | 30 | 1 | ✅ Done | 1.000 |

---

## Work Items

### Phase 1: Infrastructure ✅ Complete

#### 1.1 Create Index-Specific Test Scripts ✅

Created test query scripts for each index:

- `src/lib/search-quality/test-query-units.ts` ✅
- `src/lib/search-quality/test-query-threads.ts` ✅
- `src/lib/search-quality/test-query-sequences.ts` ✅

Each script:

- Targets the correct index (`oak_unit_rollup`, `oak_threads`, `oak_sequences`)
- Applies appropriate filters (subject, phase, key_stage as relevant)
- Runs through the RRF pipeline
- Outputs results with scores for ground truth design

#### 1.2 Extend Benchmark System ✅

Implemented **Option A** (separate runners):

- `pnpm benchmark:units --all`
- `pnpm benchmark:threads --all`
- `pnpm benchmark:sequences --all`

Created:

- `evaluation/analysis/benchmark-units.ts`
- `evaluation/analysis/benchmark-threads.ts`
- `evaluation/analysis/benchmark-sequences.ts`
- `evaluation/analysis/benchmark-query-runner-units.ts`
- `evaluation/analysis/benchmark-query-runner-threads.ts`
- `evaluation/analysis/benchmark-query-runner-sequences.ts`
- `evaluation/analysis/benchmark-adapters.ts` (extended)

---

### Phase 2: Unit Ground Truths ✅ Complete

**Protocol**: [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md#index-units)

#### 2.1 Primary Unit GT ✅

| Field | Value |
|-------|-------|
| Subject | Maths |
| Phase | Primary |
| Unit | `addition-and-subtraction-of-fractions` (Year 6) |
| Query | "adding fractions different denominators year 6" |
| Result | Position 1, MRR = 1.000 |

**Source**: `bulk-downloads/maths-primary.json`

#### 2.2 Secondary Unit GT ✅

| Field | Value |
|-------|-------|
| Subject | Science |
| Phase | Secondary |
| Unit | `forces` (Year 7) |
| Query | "forces balanced unbalanced year 7" |
| Result | Position 1, MRR = 1.000 |

**Source**: `bulk-downloads/science-secondary.json`

---

### Phase 3: Thread Ground Truth ✅ Complete

**Protocol**: [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md#index-threads)

| Field | Value |
|-------|-------|
| Subject | Maths |
| Thread | `algebra` (25 units, Year 6-11) |
| Query | "algebra equations progression" |
| Result | Position 1, MRR = 1.000 |

**Source**: Extracted from `bulk-downloads/maths-*.json` thread data

---

### Phase 4: Sequence Ground Truth ✅ Complete

**Protocol**: [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md#index-sequences)

| Field | Value |
|-------|-------|
| Subject | Maths |
| Phase | Secondary |
| Sequence | `maths-secondary` |
| Query | "secondary mathematics curriculum programme" |
| Result | Position 1, MRR = 1.000 |

**Source**: `bulk-downloads/maths-secondary.json`

---

## Directory Structure

```
src/lib/search-quality/
├── ground-truth/
│   ├── entries/              # Lesson GTs (existing)
│   │   ├── maths-primary.ts
│   │   └── ...
│   ├── units/                # Unit GTs (new)
│   │   └── entries/
│   │       ├── maths-primary.ts
│   │       └── science-secondary.ts
│   ├── threads/              # Thread GTs (new)
│   │   └── entries/
│   │       └── maths.ts
│   ├── sequences/            # Sequence GTs (new)
│   │   └── entries/
│   │       └── maths-secondary.ts
│   ├── types.ts              # Extended for all index types
│   └── index.ts              # Updated exports
├── test-query-lessons.ts     # Lessons (existing)
├── test-query-units.ts       # Units (new)
├── test-query-threads.ts     # Threads (new)
└── test-query-sequences.ts   # Sequences (new)
```

---

## Success Criteria

| Index | Target GTs | Success Metric | Actual Result |
|-------|------------|----------------|---------------|
| Units | 2 | MRR ≥ 0.8 | ✅ MRR = 1.000 |
| Threads | 1 | MRR = 1.0 (small index) | ✅ MRR = 1.000 |
| Sequences | 1 | MRR = 1.0 (tiny index) | ✅ MRR = 1.000 |

---

## Dependencies

- Lesson GTs complete (done)
- Understanding of search behaviour per index
- Access to bulk data for exploration

---

## Timeline

| Phase | Estimated | Status |
|-------|-----------|--------|
| Infrastructure | 5 hours | ✅ Complete |
| Unit GTs | 2 hours | ✅ Complete |
| Thread GT | 1 hour | ✅ Complete |
| Sequence GT | 0.5 hours | ✅ Complete |
| **Total** | **~8.5 hours** | **✅ Complete** |

---

## Completed Follow-Up Work

### Rename Lesson GT Infrastructure ✅

Lesson-specific names (`LessonGroundTruth`, `LESSON_GROUND_TRUTHS`, `benchmark-lessons.ts`, `test-query-lessons.ts`, `pnpm benchmark:lessons`), consistent with other index types. Shared types (`Phase`, `RelevanceScore`, `ExpectedRelevance`) consolidated into `ground-truth/types.ts`.

### Consolidate Protocol Documents ✅

Four separate protocol documents consolidated into [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md).

### Metric Depth and Query Quality ✅

**Lessons**: All 30 queries redesigned with realistic teacher vocabulary (see [ADR-106 refinement](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md#refinement-title-echoing-circularity-2026-02-09)). New baseline: MRR=0.983, NDCG=0.955, P@3=0.778, R@10=1.000.

**Units** (maths primary): Expanded `expectedRelevance` from 3 to 6 rated candidates. NDCG@10 baseline: 0.926.

**Threads and sequences**: Live investigation confirmed these GTs are mechanism checks, not ranking quality measures. Thread titles are broad strands producing 1:1 query-to-thread mappings. Sequences have only 30 docs. This is a genuine index characteristic.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) | Consolidated protocol (all indexes) |
| [ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) | Methodology |
