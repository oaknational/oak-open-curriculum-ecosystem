# Foundational Ground Truths

**Status**: ✅ Phase 1 Complete  
**Total**: 30 ground truths (one per subject-phase pair)  
**Last Updated**: 2026-02-05

---

## Overview

This directory contains the Foundational Ground Truths system for measuring semantic search quality. Each ground truth represents a realistic teacher query with expected results.

### The Goal

Answer: **"Does search help teachers find what they need?"**

### Methodology

Ground truths follow the **Known-Answer-First** approach:

1. Start from curriculum content (find a rich lesson)
2. Design a realistic query based on what the lesson teaches
3. Test via actual search (4-way RRF)
4. Capture top 3 results with relevance scores

See [ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) for the full methodology decision.

---

## File Structure

```text
ground-truth/
├── types.ts              # LessonGroundTruth type definition
├── index.ts              # Exports LESSON_GROUND_TRUTHS and accessors
├── index.unit.test.ts    # Unit tests for accessor functions
├── README.md             # This file
├── GROUND-TRUTH-GUIDE.md # Design principles
└── entries/              # 30 individual ground truth files
    ├── maths-secondary.ts
    ├── maths-primary.ts
    ├── english-secondary.ts
    └── ... (27 more)
```

---

## Running the Benchmark

```bash
cd apps/oak-search-cli

# All ground truths
pnpm benchmark:lessons --all

# Single subject-phase
pnpm benchmark:lessons -s maths -p secondary

# Review mode (detailed per-query output)
pnpm benchmark:lessons -s maths -p secondary --review
```

### Current Metrics (Phase 1 Baseline)

| Metric        | Value | Rating    |
| ------------- | ----- | --------- |
| MRR           | 1.000 | Excellent |
| NDCG@10       | 0.989 | Excellent |
| P@3           | 0.956 | Excellent |
| R@10          | 1.000 | Excellent |
| Zero-hit rate | 0.000 | Excellent |

---

## Entry Format

Each ground truth is a TypeScript file exporting a `LessonGroundTruth`:

```typescript
import type { LessonGroundTruth } from '../types';

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

### Relevance Scores

| Score | Meaning                                        |
| ----- | ---------------------------------------------- |
| 3     | Direct match — teaches exactly what query asks |
| 2     | Related — covers topic but not directly        |
| 1     | Tangential — mentions concept peripherally     |

---

## Adding a Ground Truth

1. Follow the protocol in [ground-truth-protocol.md](/.agent/prompts/semantic-search/ground-truth-protocol.md)
2. Create a file in `entries/` named `{subject}-{phase}.ts`
3. Export a `LessonGroundTruth` constant (e.g., `MATHS_SECONDARY`)
4. Add the export to `index.ts`
5. Run `pnpm benchmark:lessons -s {subject} -p {phase}` to validate
6. Update coverage in [queries-redesigned.md](/apps/oak-search-cli/docs/ground-truths/queries-redesigned.md)

---

## Testing Queries

Always test via the actual 4-way RRF search system:

```bash
pnpm tsx src/lib/search-quality/test-query-lessons.ts "your query" subject keyStage
```

**Never** use raw Elasticsearch queries — they bypass query preprocessing and RRF fusion.

---

## Future Work

Phase 2 expansion opportunities are documented in:
[ground-truth-expansion-plan.md](/.agent/plans/semantic-search/post-sdk/search-quality/ground-truth-expansion-plan.md)

Expansion includes:

- KS4 science variants (physics, chemistry, biology)
- Multiple queries per subject-phase
- Category diversity (natural-expression, typos, cross-topic)

---

## Archive

The previous 120-query, 4-category approach is preserved at:

```text
ground-truth-archive/
```

See [ground-truth-archive/README.md](../ground-truth-archive/README.md) for restoration instructions.

---

## Related Documents

| Document                                                                                                 | Purpose              |
| -------------------------------------------------------------------------------------------------------- | -------------------- |
| [ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) | Methodology decision |
| [ground-truth-protocol.md](/.agent/prompts/semantic-search/ground-truth-protocol.md)                     | Step-by-step process |
| [queries-redesigned.md](/apps/oak-search-cli/docs/ground-truths/queries-redesigned.md)                   | Coverage tracking    |
| [GROUND-TRUTH-GUIDE.md](./GROUND-TRUTH-GUIDE.md)                                                         | Design principles    |
