# Foundational Ground Truths

**Status**: ✅ Phase 1 Complete  
**Total**: 30 ground truths (one per subject-phase pair)  
**Completed**: 2026-02-05

---

## Summary

Phase 1 of the ground truth redesign is complete. 30 foundational ground truths are:

- **Integrated with the benchmark** (`pnpm benchmark:lessons --all`)
- **Producing excellent metrics** (MRR=1.000, NDCG=0.989)
- **Testing actual search value** (4-way RRF, not raw ES)

### Baseline Metrics

| Metric        | Value | Rating    |
| ------------- | ----- | --------- |
| MRR           | 1.000 | Excellent |
| NDCG@10       | 0.989 | Excellent |
| P@3           | 0.956 | Excellent |
| R@10          | 1.000 | Excellent |
| Zero-hit rate | 0.000 | Excellent |

---

## Coverage Matrix

| Subject             | Primary | Secondary | Notes             |
| ------------------- | ------- | --------- | ----------------- |
| maths               | ✅      | ✅        |                   |
| science             | ✅      | ✅        |                   |
| english             | ✅      | ✅        |                   |
| history             | ✅      | ✅        |                   |
| geography           | ✅      | ✅        |                   |
| computing           | ✅      | ✅        |                   |
| art                 | ✅      | ✅        |                   |
| music               | ✅      | ✅        |                   |
| design-technology   | ✅      | ✅        |                   |
| physical-education  | ✅      | ✅        |                   |
| religious-education | ✅      | ✅        |                   |
| french              | ✅      | ✅        |                   |
| german              | N/A     | ✅        | No primary        |
| spanish             | ✅      | ✅        |                   |
| citizenship         | N/A     | ✅        | No primary        |
| cooking-nutrition   | ✅      | ✅        |                   |
| physics             | N/A     | —         | KS4 only (future) |
| chemistry           | N/A     | —         | KS4 only (future) |
| biology             | N/A     | —         | KS4 only (future) |
| combined-science    | N/A     | —         | KS4 only (future) |

**Legend**: ✅ = Complete | — = Future | N/A = Not applicable

---

## Running the Benchmark

```bash
cd apps/oak-open-curriculum-semantic-search

# All ground truths
pnpm benchmark:lessons --all

# Single subject-phase
pnpm benchmark:lessons -s maths -p secondary

# Review mode (detailed per-query output)
pnpm benchmark:lessons -s maths -p secondary --review
```

---

## Ground Truth Entries

All entries are defined in TypeScript at:

```text
src/lib/search-quality/ground-truth/entries/
```

Each entry follows the `LessonGroundTruth` type:

```typescript
export const MATHS_SECONDARY: LessonGroundTruth = {
  subject: 'maths',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'dividing fractions using reciprocals',
  expectedRelevance: {
    'dividing-a-fraction-by-a-fraction': 3,
    'dividing-with-decimals': 2,
    'checking-and-securing-dividing-a-fraction-by-a-whole-number': 2,
  },
  description:
    'Lesson teaches dividing fractions by fractions using diagrams and the reciprocal method.',
} as const;
```

---

## Methodology

Ground truths follow the **Known-Answer-First** methodology:

1. Start from curriculum content (find a lesson)
2. Design a realistic query to find that content
3. Test via actual search (4-way RRF)
4. Capture actual results with relevance scores

See [ADR-106: Known-Answer-First Ground Truth Methodology](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) for the full decision record.

---

## Future Work

Phase 2 expansion opportunities are documented in:
[ground-truth-expansion-plan.md](/.agent/plans/semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md)

The archived 120-query system is preserved at:
`src/lib/search-quality/ground-truth-archive/`

---

## Related Documents

| Document                                                                                                          | Purpose              |
| ----------------------------------------------------------------------------------------------------------------- | -------------------- |
| [ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md)          | Methodology decision |
| [ground-truth-protocol.md](/.agent/prompts/semantic-search/ground-truth-protocol.md)                              | The protocol         |
| [ground-truth/README.md](/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/README.md) | Code documentation   |
| [expansion-plan.md](/.agent/plans/semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md)         | Future work          |
