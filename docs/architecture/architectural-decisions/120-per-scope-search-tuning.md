# ADR-120: Per-Scope Search Tuning Parameters

**Status**: Accepted
**Date**: 2026-02-23
**Related**: [ADR-099 (Transcript-Aware RRF Normalisation)](099-transcript-aware-rrf-normalisation.md), [ADR-103 (Fuzzy Match Limitations)](103-fuzzy-match-limitations.md)

## Context

The Oak search system serves four Elasticsearch indices — lessons (~12,800 docs), units (~1,665 docs), threads (~164 docs), and sequences (~30 docs) — using Reciprocal Rank Fusion (RRF) to combine lexical (BM25) and semantic (ELSER) retrievers.

Initial implementation used uniform BM25 fuzziness (`AUTO:3,6` for units, `AUTO` for threads/sequences) and no post-RRF score filtering for any scope except lessons. Benchmark testing revealed two problems:

1. **Fuzzy match pollution on short words**: `AUTO:3,6` permits edit distance 1 on 3-character words, causing false matches (e.g. "app" matching "apple" queries). Lessons already used `AUTO:6,9` which defers fuzziness until words reach 6+ characters.

2. **Volume problem**: For common short queries, Elasticsearch returns thousands of results including a long tail of near-zero-scoring ELSER-only matches. These dilute result quality when returned to consumers.

## Decision

### Fuzziness

- **Lessons and units** (4-way RRF, large indices): Use `AUTO:6,9` with `prefix_length: 1` and `fuzzy_transpositions: true`. This defers edit-distance fuzzy matching to words of 6+ characters, preventing false matches on short curriculum terms.

- **Threads and sequences** (2-way RRF, small indices): Retain `AUTO`. With only ~164 and ~30 documents respectively, and BM25 matching only on short structured titles, fuzzy-match pollution is not a practical concern. Tightening fuzziness here would only reduce recall without measurable precision gain.

### Post-RRF Score Filtering

- **Lessons and units** (4-way RRF): Apply `filterByMinScore` with `DEFAULT_MIN_SCORE = 0.02`. With `rank_constant=60`, a document ranked #1 in 2 of 4 retrievers scores `2/61 ≈ 0.033`, which passes the threshold. The value 0.02 filters out the ELSER-only near-zero tail while preserving legitimate 2-retriever matches. These two constants are mathematically coupled — changing `rank_constant` requires recalibrating `DEFAULT_MIN_SCORE`.

- **Threads and sequences** (2-way RRF): No score filtering. The maximum possible 2-way RRF score with `rank_constant=40` is `2/41 ≈ 0.049`. Any meaningful threshold would eliminate legitimate results (e.g. the correct "mountain" thread result scores only 0.024).

### Result Total Semantics

`SearchResultMeta.total` is defined as `results.length` for all four scopes — the count of results actually returned to the consumer. For lessons/units this is the post-score-filter count; for threads/sequences this equals the ES hit count (no filtering). This is not the ES total-matching-documents count.

## Consequences

- **Positive**: Consistent fuzziness across the two 4-way RRF scopes; eliminated fuzzy pollution for short words in unit search. Score filtering removes thousands of irrelevant results from lesson and unit queries.
- **Positive**: Documented rationale prevents future engineers from "unifying" parameters without understanding the per-scope constraints.
- **Negative**: Two distinct tuning profiles must be maintained. Changes to one scope's parameters should prompt review of the other scopes.
- **Negative**: `total` does not represent corpus-wide matching count, so pagination-style "X of Y" UX cannot be built from this field alone.

## Evidence

Validated via `pnpm benchmark:lessons --all`, `pnpm benchmark:units --all`, `pnpm benchmark:threads --all`, `pnpm benchmark:sequences --all` against ground truth queries. Key results:

- "apple" query: R@10 improved from 0.67 to 1.00 after `DEFAULT_MIN_SCORE` recalibration from 0.04 to 0.02.
- Unit fuzziness alignment (`AUTO:3,6` → `AUTO:6,9`) eliminated false fuzzy matches without recall regression.
- Thread and sequence benchmarks showed no regression when retaining `AUTO` fuzziness and no score filtering.
