# ADR-102: Conditional minimum_should_match for BM25 Queries

**Status**: Accepted  
**Date**: 2026-01-23  
**Context**: Search quality improvement for multi-term queries

## Context

The BM25 component of our hybrid search uses `minimum_should_match` to control how many query terms must match for a document to be considered. The original configuration used a flat percentage:

```typescript
minimum_should_match: '75%';
```

This was problematic for 2-term cross-topic queries. With 2 terms, 75% rounds to 2, requiring **both terms** to match. This excluded specialized lessons that are highly relevant to one term but don't mention the other.

### Example: "electricity and magnets"

- A lesson about electromagnets (mentions both) would rank highly
- A lesson specifically about electrical circuits (mentions only electricity) would be excluded
- A lesson specifically about magnetic fields (mentions only magnets) would be excluded

For cross-topic queries, the specialized lessons may be more relevant than generalist lessons that happen to mention both terms.

### Analysis of the Problem

During Science GT review, we discovered:

1. **"electrisity and magnits"** — Expected specialized lessons (`electrical-appliances`, `magnetic-and-non-magnetic-materials`) were excluded because they don't mention both terms
2. **"plants and animals"** — Similar issue with cross-topic content

## Decision

Change `minimum_should_match` from `'75%'` to `'2<65%'` for lesson BM25 queries.

### Elasticsearch Conditional Syntax

The `2<65%` syntax means:

- If query has ≤2 terms: all terms required (same as before)
- If query has >2 terms: 65% required (more lenient)

| Terms | Previous (75%) | With `2<65%` | Change         |
| ----- | -------------- | ------------ | -------------- |
| 2     | 2 required     | 2 required   | Neutral        |
| 3     | 3 required     | 2 required   | +1 flexibility |
| 4     | 3 required     | 3 required   | Neutral        |
| 5     | 4 required     | 4 required   | Neutral        |

### Implementation

Location: `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-helpers.ts`

```typescript
// Before
minimum_should_match: '75%';

// After
minimum_should_match: '2<65%';
```

## Consequences

### Positive

1. **Strictly better for 3-term queries** — Allows 1 term to be missing, improving recall for queries like "carbon cycle in ecosystems"
2. **Neutral for 2-term queries** — No change in behavior for the most common query length
3. **No precision loss** — Same strictness maintained for short queries
4. **Incremental improvement** — Low-risk change that can be further tuned

### Negative

1. **Does not fix 2-term cross-topic queries** — "electricity and magnets" still requires both terms. This requires a more aggressive approach (e.g., `1<65%` or domain term boosting)
2. **May need further tuning** — The 65% threshold was chosen based on analysis but may need adjustment based on benchmark results

### Known Limitations

The following issues remain and are deferred to **domain term boosting** (documented in `modern-es-features.md`):

- 2-term cross-topic queries still require both terms
- Fuzzy matching false positives (e.g., "magnits" → "magnification") are not addressed by this change

## Alternatives Considered

| Option               | Pros                         | Cons                                                            |
| -------------------- | ---------------------------- | --------------------------------------------------------------- |
| `50%` (flat)         | More lenient                 | Would only require 1/2 terms for 2-term queries, too permissive |
| `2<50%`              | More aggressive for >2 terms | May hurt precision                                              |
| `-1`                 | Allow 1 missing term always  | Would allow single-term matches for 2-term queries              |
| Domain term boosting | Long-term solution           | Requires more implementation work                               |

## References

- [Elasticsearch minimum_should_match documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-minimum-should-match.html)
- [modern-es-features.md](../../.agent/plans/semantic-search/post-sdk/search-quality/modern-es-features.md) — Level 3 search quality plan
- [ADR-099: Transcript-Aware RRF Normalisation](099-transcript-aware-rrf-normalisation.md) — Related RRF architecture
