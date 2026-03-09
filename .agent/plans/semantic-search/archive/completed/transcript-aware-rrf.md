# Transcript-Aware RRF Score Normalisation

**Status**: ✅ Complete
**Priority**: CRITICAL — The RRF was architecturally broken (now fixed)
**Created**: 2026-01-12
**Updated**: 2026-01-13
**ADR**: [ADR-099](../../../../docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md)

---

## The Architectural Flaw

**This is not a hypothesis. This is not "something to discover". This is a known, documented, mathematical flaw in the current RRF implementation.**

### The Correct Mental Model

| Document Type | Retriever Coverage | Expected Treatment |
|---------------|-------------------|-------------------|
| Metadata-only | 2/4 retrievers (structure) | **BASELINE** — This is the default case |
| With transcript | 4/4 retrievers (structure + content) | **BONUS** — Additional retrieval paths |

### The Current (Broken) Behaviour

The 4-way RRF combines scores from:

| Retriever | Field | Documents with transcript | Documents without transcript |
|-----------|-------|---------------------------|------------------------------|
| BM25 content | `lesson_content` | ✅ Can match | ❌ Field omitted (ADR-095) |
| ELSER content | `lesson_content_semantic` | ✅ Can match | ❌ Field omitted (ADR-095) |
| BM25 structure | `lesson_structure` | ✅ Can match | ✅ Can match |
| ELSER structure | `lesson_structure_semantic` | ✅ Can match | ✅ Can match |

**RRF formula**: `score = Σ 1/(k + rank_i)` where k=60

**With k=60:**

| Document | Best possible score | Calculation |
|----------|---------------------|-------------|
| With transcript (rank #1 in all 4) | ~0.066 | 4 × 1/61 |
| Without transcript (rank #1 in both 2) | ~0.033 | 2 × 1/61 |

**A transcript-less document that ranks #1 in ALL applicable retrievers gets HALF the score of a transcript-having document.** This is wrong.

### Why This Matters

- **~19% of lessons** have no transcript (ADR-095)
- **MFL subjects** (French, German, Spanish) have ~0% transcript coverage
- **PE Primary** has ~0.6% transcript coverage
- These documents are **structurally disadvantaged** regardless of query relevance

---

## The Fix: Post-RRF Score Normalisation

Normalise RRF scores based on the number of applicable retrievers for each document.

### Implementation

```typescript
/**
 * Normalises RRF scores to account for transcript availability.
 *
 * Documents without transcripts can only appear in 2 of 4 retrievers
 * (structure-only). This function normalises scores so that a document
 * ranking #1 in all APPLICABLE retrievers gets the same normalised score,
 * regardless of how many retrievers apply to it.
 *
 * @param results - RRF search results with `has_transcript` in `_source`
 * @returns Results with normalised `_score` values, re-sorted by normalised score
 *
 * @example
 * // Document with transcript at rank #1 in all 4 retrievers: score = 4/61 ≈ 0.066
 * // Document without transcript at rank #1 in both 2 retrievers: score = 2/61 ≈ 0.033
 * // After normalisation: both get equivalent normalised scores
 *
 * @see ADR-094 has_transcript field
 * @see ADR-095 Missing transcript handling
 * @see ADR-099 Transcript-aware RRF normalisation (this fix)
 */
export function normaliseRrfScores<T extends RrfResultWithTranscript>(
  results: readonly T[],
): T[] {
  const TOTAL_RETRIEVERS = 4;
  const STRUCTURE_ONLY_RETRIEVERS = 2;

  const normalised = results.map((doc) => {
    const applicableRetrievers = doc._source.has_transcript
      ? TOTAL_RETRIEVERS
      : STRUCTURE_ONLY_RETRIEVERS;
    const normalisationFactor = TOTAL_RETRIEVERS / applicableRetrievers;

    return {
      ...doc,
      _score: doc._score * normalisationFactor,
    };
  });

  // Re-sort by normalised score (stable sort)
  return normalised.sort((a, b) => b._score - a._score);
}
```

### Where to Apply

After RRF results are returned, before presenting to the user:

| File | Change |
|------|--------|
| `src/lib/hybrid-search/lessons.ts` | Apply `normaliseRrfScores` after RRF query |
| `src/lib/hybrid-search/units.ts` | Apply `normaliseRrfScores` after RRF query (if applicable) |
| `src/lib/hybrid-search/rrf-score-normaliser.ts` | New file: pure normalisation function |
| `src/lib/hybrid-search/rrf-score-normaliser.unit.test.ts` | New file: unit tests |

---

## TDD Implementation Plan

### Phase 1: Unit Tests (RED)

Write tests FIRST that specify the desired behaviour:

```typescript
describe('normaliseRrfScores', () => {
  it('doubles score for documents without transcript', () => {
    const results = [
      { _id: '1', _score: 0.066, _source: { has_transcript: true } },
      { _id: '2', _score: 0.033, _source: { has_transcript: false } },
    ];
    const normalised = normaliseRrfScores(results);
    expect(normalised.find(r => r._id === '1')?._score).toBe(0.066);  // unchanged
    expect(normalised.find(r => r._id === '2')?._score).toBe(0.066);  // doubled
  });

  it('re-sorts by normalised score', () => {
    const results = [
      { _id: '1', _score: 0.050, _source: { has_transcript: true } },
      { _id: '2', _score: 0.030, _source: { has_transcript: false } },
    ];
    const normalised = normaliseRrfScores(results);
    // After normalisation: doc1=0.050, doc2=0.060
    expect(normalised[0]._id).toBe('2');  // now ranked first
    expect(normalised[1]._id).toBe('1');
  });

  it('preserves order when scores remain equal after normalisation', () => {
    // Stable sort test
  });

  it('handles empty results', () => {
    expect(normaliseRrfScores([])).toEqual([]);
  });

  it('handles all documents having transcripts', () => {
    // No change expected
  });

  it('handles all documents missing transcripts', () => {
    // All doubled, order preserved
  });
});
```

### Phase 2: Implementation (GREEN)

Implement `normaliseRrfScores` to make tests pass.

### Phase 3: Integration

Apply normalisation in the search pipeline.

### Phase 4: ADR

Document the decision in ADR-099.

---

## Acceptance Criteria

- [x] Unit tests written FIRST (TDD) — 17 tests in `rrf-score-normaliser.unit.test.ts`
- [x] `normaliseRrfScores` is a pure function with no side effects
- [x] Function has comprehensive TSDoc with examples
- [x] Applied after RRF query in lesson search — `lessons.ts`
- [x] Unit search does NOT need normalisation (units always have content fields)
- [x] ADR-099 created documenting the decision
- [x] Integration tests prove normalisation is correctly wired — 6 tests in `lessons.integration.test.ts`
- [x] Search functions refactored for DI per ADR-078
- [x] All quality gates pass

---

## Foundation Documents

**Re-read before implementation:**

1. [principles.md](../../../directives/principles.md) — TDD, no type shortcuts, fail fast
2. [testing-strategy.md](../../../directives/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../../directives/schema-first-execution.md) — Generator is source of truth

---

## Related ADRs

- [ADR-078: Dependency Injection for Testability](../../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md) — Pattern for injectable search functions
- [ADR-094: has_transcript Field](../../../../docs/architecture/architectural-decisions/094-has-transcript-field.md) — The field we use
- [ADR-095: Missing Transcript Handling](../../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md) — Why content fields are omitted
- [ADR-099: Transcript-Aware RRF Normalisation](../../../../docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md) — This fix
