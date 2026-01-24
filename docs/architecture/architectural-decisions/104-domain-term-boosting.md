# ADR-104: Domain Term Boosting Strategy

**Status**: Proposed (Deferred to Level 3)  
**Date**: 2026-01-23  
**Context**: Solution for domain-specific vocabulary mismatch and fuzzy matching false positives

## Context

### The Core Problem: Educational Vocabulary Has Specialised Meaning

Educational curriculum uses vocabulary with domain-specific meanings that differ from general usage. ELSER (and other semantic embedding models) are trained on general text corpora and may produce incorrect matches when applied to specialised educational content.

**Examples of domain-specific meaning shifts:**

| Term         | General Meaning           | Educational Curriculum Meaning       |
| ------------ | ------------------------- | ------------------------------------ |
| "cell"       | Mobile phone, prison room | Biological cell structure            |
| "table"      | Furniture                 | Multiplication table, data table     |
| "power"      | Electricity, strength     | Mathematical exponents (powers of 2) |
| "expression" | Facial emotion, utterance | Algebraic expression                 |
| "subject"    | Topic, person             | School subject (maths, science)      |
| "root"       | Plant part, origin        | Square root, roots of equations      |

When a teacher searches for "power rules", they mean **index laws in mathematics**, not general content about electricity or authority. A general-purpose semantic model may rank lessons about "electrical power" or "power dynamics" alongside or above lessons about "laws of indices".

### Secondary Problem: Fuzzy Matching False Positives

[ADR-103](103-fuzzy-matching-limitations.md) documents how fuzzy matching compounds this issue: "magnits" fuzzy-matches both "magnets" (intended) and "magnification" (unrelated) because edit distance is blind to domain relevance.

| Query     | Intended Match          | False Positive            | Why                       |
| --------- | ----------------------- | ------------------------- | ------------------------- |
| "magnits" | magnets, electromagnets | magnification, microscopy | Shared "magni-" prefix    |
| "plints"  | plants                  | points, prints            | Common character patterns |

### Why Current Approaches Are Insufficient

| Approach                      | Limitation                                                                 |
| ----------------------------- | -------------------------------------------------------------------------- |
| ELSER alone                   | Trained on general text; doesn't understand curriculum-specific vocabulary |
| Reduce fuzziness              | Loses valid typo recovery                                                  |
| Increase minimum_should_match | Hurts multi-term queries (see ADR-102)                                     |
| Add synonyms                  | Only works for known term variations, not semantic context                 |

## Decision

### Proposed: Domain Term Boosting

Add a boosting layer that prioritises matches on **curriculum-specific vocabulary** over general dictionary words. This addresses both:

1. **Semantic model limitations**: ELSER doesn't understand that "power" in a maths context means exponents
2. **Fuzzy matching false positives**: "magnits" should preferentially match curriculum term "magnets" over general word "magnify"

### Concept

The curriculum contains a finite vocabulary of domain-specific terms (magnets, photosynthesis, quadratics, etc.). When these terms appear in queries or fuzzy-match to query terms, they should receive preferential scoring.

```text
Query: "electrisity and magnits"

Without domain boosting:
  - "magnits" fuzzy-matches "magnify" (score: 0.8)
  - "magnits" fuzzy-matches "magnets" (score: 0.8)
  Both score equally → microscopy lessons compete with electromagnet lessons

With domain boosting:
  - "magnets" is in curriculum vocabulary → boost × 2.0
  - "magnify" is general vocabulary → no boost
  - Electromagnet lessons rank higher
```

**The key insight**: We have complete knowledge of our curriculum vocabulary. Unlike general search engines, we know exactly which terms are meaningful in our domain. We can use this knowledge to disambiguate.

### Implementation Options

#### Option A: Query-Time Field Boosting (Recommended)

Boost matches on curated curriculum terms at query time:

```typescript
// Pseudocode
const curriculumTerms = ['magnets', 'electromagnets', 'circuits', ...];

function buildBoostedQuery(query: string) {
  const tokens = tokenize(query);
  const boostedTokens = tokens.map(token => {
    const corrected = fuzzyMatchCurriculumTerm(token, curriculumTerms);
    return corrected ? { term: corrected, boost: 2.0 } : { term: token, boost: 1.0 };
  });
  return buildQuery(boostedTokens);
}
```

#### Option B: Index-Time Curriculum Field

Add a `curriculum_terms` field containing only curriculum vocabulary, with higher boost:

```json
{
  "lesson_structure": "Introduction to magnets and electromagnets",
  "curriculum_terms": ["magnets", "electromagnets", "magnetic field"]
}
```

Query boosts `curriculum_terms` matches over `lesson_structure` matches.

#### Option C: Elasticsearch Query Rules

Use Elasticsearch's query rules feature to apply contextual boosting:

```json
{
  "rule_id": "curriculum_boosting",
  "type": "pinned",
  "criteria": [{ "type": "fuzzy", "metadata": "query_string", "values": ["magnets"] }],
  "actions": { "boost": { "boost": 2.0 } }
}
```

### Recommendation

**Option A** is recommended because:

1. No re-indexing required
2. Curriculum terms already exist in synonym system
3. Can be implemented incrementally
4. Query-time flexibility for experimentation

### Deferred to Level 3

This work is deferred to Level 3 (Modern ES Features) because:

1. Level 1 (Fundamentals) work is not yet exhausted
2. Requires experimentation with boost values
3. Current workaround (synonyms + ELSER) provides partial recovery
4. Ground truth review must complete first to provide valid measurements

## Consequences

### Positive

1. **Compensates for general-purpose embeddings**: ELSER is trained on general text; domain boosting adds the curriculum-specific context it lacks
2. **Targeted fuzzy correction**: Resolves false positives by preferring domain terms over general vocabulary
3. **Preserves fuzzy benefits**: Typo recovery still works
4. **Leverages existing knowledge**: We already have curriculum vocabulary in the synonym system
5. **Measurable**: Can A/B test with imprecise-input ground truths

### Negative

1. **Vocabulary maintenance**: Curriculum term list must be kept current
2. **Query-time complexity**: Adds processing before search
3. **Tuning required**: Boost values need experimentation to balance against BM25/ELSER scores

### Neutral

1. **Complements rather than replaces ELSER**: ELSER still provides semantic understanding; boosting adds domain awareness
2. **Builds on existing infrastructure**: Synonym system already has much of the vocabulary

## Implementation Plan

When Level 3 work begins:

1. Extract curriculum vocabulary from synonym files
2. Implement query-time term correction/boosting
3. A/B test with imprecise-input ground truths
4. Tune boost values based on metrics
5. Document in GROUND-TRUTH-GUIDE.md

## Success Criteria

| Metric                        | Current                            | Target             |
| ----------------------------- | ---------------------------------- | ------------------ |
| imprecise-input MRR (Science) | 0.611 (primary), 0.800 (secondary) | > 0.80             |
| Control vs typo query gap     | 0.800 difference                   | < 0.200 difference |

## Related Decisions

- [ADR-103: Fuzzy Matching Limitations](103-fuzzy-matching-limitations.md) — Problem documentation
- [ADR-102: Conditional minimum_should_match](102-conditional-minimum-should-match.md) — Related tuning
- [ADR-063: SDK Domain Synonyms](063-sdk-domain-synonyms-source-of-truth.md) — Vocabulary source
- [ADR-082: Fundamentals-First Strategy](082-fundamentals-first-search-strategy.md) — Level system

## References

- [Elasticsearch Function Score Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html)
- [Elasticsearch Query Rules](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-using-query-rules.html)
- [modern-es-features.md](../../../.agent/plans/semantic-search/post-sdk/search-quality/modern-es-features.md) — Level 3 planning
