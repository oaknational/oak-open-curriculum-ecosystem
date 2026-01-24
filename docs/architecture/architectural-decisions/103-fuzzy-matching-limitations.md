# ADR-103: Fuzzy Matching Limitations and Workarounds

**Status**: Accepted  
**Date**: 2026-01-23  
**Context**: Search quality improvement during Science GT review

## Context

Elasticsearch BM25 queries use `fuzziness: AUTO` to handle typos. During Science ground truth evaluation (2026-01-23), we discovered specific limitations in how fuzzy matching operates.

### Fuzzy Matching Behaviour

Elasticsearch fuzzy matching uses Levenshtein edit distance:

| Term Length | Max Edit Distance (AUTO) |
| ----------- | ------------------------ |
| 0-2 chars   | 0 (exact match only)     |
| 3-5 chars   | 1 edit                   |
| 6+ chars    | 2 edits                  |

### Problem 1: False Positives from Shared Prefixes

Query term "magnits" (intended: magnets) fuzzy-matches "magnify" and "magnification":

| Term          | Edit Distance from "magnits" | Matched? |
| ------------- | ---------------------------- | -------- |
| magnets       | 1 (i→e)                      | ✓        |
| magnify       | 2 (i→i, ts→fy)               | ✓        |
| magnification | 2 (shared "magni-" prefix)   | ✓        |

**Result**: Searching for "electrisity and magnits" returned microscopy lessons (about magnification) alongside electromagnet lessons.

### Problem 2: Tokenization vs Character Edits

Fuzzy matching operates **within tokens**, not across word boundaries:

| Query Term     | Curriculum Term | Fuzzy Match? | Why                                  |
| -------------- | --------------- | ------------ | ------------------------------------ |
| multiplikation | multiplication  | ✓            | Character edit within same token     |
| timetables     | times table     | ✗            | Different tokenization (1 word vs 2) |
| timestables    | times table     | ✗            | Same issue                           |

**Result**: Compound word mismatches require synonyms, not fuzzy matching.

### Evidence

Control queries confirmed the issue:

| Query                                | MRR   | Issue                 |
| ------------------------------------ | ----- | --------------------- |
| "electricity and magnets" (no typos) | 1.000 | Works perfectly       |
| "electrisity and magnits" (typos)    | 0.200 | Fuzzy false positives |

## Decision

### 1. Document Limitations (This ADR)

Fuzzy matching has inherent limitations that cannot be fixed by threshold tuning:

- **Shared prefix false positives**: Words sharing prefixes may fuzzy-match unexpectedly
- **Tokenization boundaries**: Compound words need synonyms, not fuzziness
- **Short queries amplify issues**: With `minimum_should_match`, fuzzy false positives in 2-term queries significantly dilute relevance

### 2. Workaround: Synonyms for Compound Words

For known compound word variations, add synonyms:

```typescript
// packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/maths.ts
'times-table': ['timetables', 'timestables', 'time tables']
```

### 3. Future Solution: Domain Term Boosting

See [ADR-104](104-domain-term-boosting.md) for the proposed solution: boost matches on curriculum vocabulary to outweigh fuzzy false positives.

## Consequences

### Positive

1. **Clear documentation**: Team understands fuzzy matching boundaries
2. **Correct expectations**: GT reviewers know what fuzzy matching can/cannot do
3. **Targeted solutions**: Compound words get synonyms; false positives need boosting

### Negative

1. **No quick fix for false positives**: "magnits" → "magnification" requires Level 3 work
2. **Synonym maintenance**: Compound word variations must be added manually

### Neutral

1. **Fuzzy matching still valuable**: Works well for character-level typos within words
2. **ELSER compensates**: Semantic embeddings often recover from typos that fuzzy misses

## Implementation

No code changes required. This ADR documents architectural understanding.

**Affected ground truths**: imprecise-input queries that test compound words should be re-categorised or have synonyms added.

## Related Decisions

- [ADR-102: Conditional minimum_should_match](102-conditional-minimum-should-match.md) — Query tuning
- [ADR-104: Domain Term Boosting](104-domain-term-boosting.md) — Future solution (proposed)
- [ADR-063: SDK Domain Synonyms](063-sdk-domain-synonyms-source-of-truth.md) — Synonym system
- [ADR-076: ELSER-Only Embedding](076-elser-only-embedding-strategy.md) — Semantic recovery

## References

- [Elasticsearch Fuzziness](https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html#fuzziness)
- [GROUND-TRUTH-GUIDE.md](../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) — imprecise-input category guidance
