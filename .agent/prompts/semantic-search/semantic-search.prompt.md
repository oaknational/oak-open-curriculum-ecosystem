# Semantic Search — Ground Truth & Quality

**Last Updated**: 2026-02-09

---

## Index Coverage

| Index | Documents | GTs | Status |
|-------|-----------|-----|--------|
| `oak_lessons` | 12,833 | 30 | ✅ Done |
| `oak_units` | 1,665 | 2 | ✅ Done |
| `oak_threads` | 164 | 1 | ✅ Done |
| `oak_sequences` | 30 | 1 | ✅ Done |

**Protocol**: [Ground Truth Protocol](/apps/oak-open-curriculum-semantic-search/docs/ground-truths/ground-truth-protocol.md) (all indexes)

**Completed**: [Multi-Index Ground Truths Plan](../../plans/semantic-search/active/multi-index-ground-truths.md)

---

## Lessons (Complete)

**Baseline Metrics**: MRR=0.983, NDCG=0.955, P@3=0.778, R@10=1.000

```bash
cd apps/oak-open-curriculum-semantic-search

# Run benchmark
pnpm benchmark:lessons --all
pnpm benchmark:lessons -s maths -p secondary --review

# Test a query
pnpm tsx src/lib/search-quality/test-query-lessons.ts "expanding brackets" maths ks3
```

---

## Units, Threads, Sequences (Complete)

**Baseline Metrics**:

| Index | MRR | NDCG@10 | P@3 | R@10 |
|-------|-----|---------|-----|------|
| Units | 1.000 | 0.926 | 0.833 | 1.000 |
| Threads | 1.000 | 1.000 | 0.333 | 1.000 |
| Sequences | 1.000 | 1.000 | 0.333 | 1.000 |

```bash
cd apps/oak-open-curriculum-semantic-search

# Run benchmarks
pnpm benchmark:units --all
pnpm benchmark:threads --all
pnpm benchmark:sequences --all

# Test queries
pnpm tsx src/lib/search-quality/test-query-units.ts "fractions year 5" maths ks2
pnpm tsx src/lib/search-quality/test-query-threads.ts "algebra progression" maths
pnpm tsx src/lib/search-quality/test-query-sequences.ts "secondary maths" maths
```

### What Each Index Contains

| Index | Content | Search Use Case |
|-------|---------|-----------------|
| **Units** | Lesson collections with descriptions | "fractions year 5", "algebra KS3" |
| **Threads** | Curriculum progressions | "multiplication progression", "algebra strand" |
| **Sequences** | Subject-phase programmes | May be filter rather than search target |

---

## Mandatory Reading

Before any ground truth work:

1. **[ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md)** — Known-Answer-First methodology
2. **[Semantic Search Architecture](../../directives-and-memory/semantic-search-architecture.md)** — Structure is the foundation, bulk data is the source of truth, STOP if you can't follow protocol

> **Protocol**: All index protocols are consolidated into a single document at [ground-truth-protocol.md](/apps/oak-open-curriculum-semantic-search/docs/ground-truths/ground-truth-protocol.md).

---

## The Value We Provide

Teachers use our search to find curriculum content. Ground truths test:

> **"If a teacher searches for X, do they get useful results?"**

We test **our system** — with **our data**, **our retrievers**, and **our configuration** — not Elasticsearch in isolation.

---

## Key Principles

1. **Known-Answer-First** — Start from curriculum content, work backward to queries
2. **Test via RRF** — Never use raw Elasticsearch queries
3. **One index at a time** — Each index has different search characteristics
4. **Realistic queries** — What would a teacher actually type?

---

## GT Quality Status

All ground truth quality work is complete:

- **Lesson queries redesigned** — All 30 queries use realistic teacher vocabulary. See [ADR-106 refinement](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md#refinement-title-echoing-circularity-2026-02-09).
- **Protocol consolidated** — Single document at [ground-truth-protocol.md](/apps/oak-open-curriculum-semantic-search/docs/ground-truths/ground-truth-protocol.md).
- **Lesson GT infrastructure renamed** — `LessonGroundTruth`, `LESSON_GROUND_TRUTHS`, lesson-specific benchmark/test scripts.
- **Non-lesson GTs investigated** — Unit GTs expanded. Threads and sequences confirmed as mechanism checks (too few documents for ranking discrimination).

Priority now shifts to application improvement — see the [roadmap](../../plans/semantic-search/roadmap.md).

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [Multi-Index Plan](../../plans/semantic-search/active/multi-index-ground-truths.md) | Ground truth coverage across indexes |
| [ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) | Methodology |
| [queries-redesigned.md](/apps/oak-open-curriculum-semantic-search/docs/ground-truths/queries-redesigned.md) | Lessons coverage |
| [expansion-plan.md](../../plans/semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md) | Lessons expansion |
