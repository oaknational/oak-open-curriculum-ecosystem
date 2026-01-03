# Diagnostic Query Suite

**Last Updated**: 2026-01-03

**Purpose**: Fine-grained failure mode analysis for synonym and multi-concept queries.

**Status**: 18 diagnostic queries added (9 synonym + 9 multi-concept)

---

## Why Diagnostic Queries?

The hard query baseline shows:

- **Synonym category MRR: 0.167** (only 1 of 3 queries succeeds)
- **Multi-concept category MRR: 0.083** (both queries fail)

But we don't know **WHY**. The aggregate category MRR hides important patterns:

- Are single-word synonyms working but phrase synonyms failing?
- Does synonym position matter (start/middle/end of query)?
- Are both concepts in multi-concept queries being matched?
- Is scoring favoring single-concept matches over multi-concept?

**Diagnostic queries isolate these variables** so we can target improvements precisely.

---

## Synonym Diagnostics (9 queries)

### What We're Testing

| Pattern                     | Example                        | Purpose                                |
| --------------------------- | ------------------------------ | -------------------------------------- |
| Single-word synonyms        | "trig ratios"                  | Baseline: Are simple synonyms working? |
| Phrase at START             | "straight line equations"      | Does position affect matching?         |
| Phrase at END               | "equations for straight lines" | Compare with START position            |
| Phrase in MIDDLE            | "finding straight line slope"  | Hardest case for phrase matching       |
| Multiple synonyms           | "rules for index laws"         | Does synonym density help/hurt?        |
| Multi-word curriculum terms | "circle rules tangent"         | Do compound terms need phrase boost?   |
| Spoken formulas             | "y equals mx plus c"           | Formula recognition effectiveness      |

### Expected Insights

1. **If single-word synonyms work but phrases fail**:
   → Need phrase matching boost (B.5 solution)

2. **If phrase position matters**:
   → BM25 scoring may not handle phrase order well

3. **If synonym density hurts**:
   → Synonym expansion may be too aggressive (diluting signal)

4. **If multi-word terms fail**:
   → Need curriculum-aware phrase detection

---

## Multi-Concept Diagnostics (9 queries)

### What We're Testing

| Pattern                   | Example                                   | Purpose                               |
| ------------------------- | ----------------------------------------- | ------------------------------------- |
| Explicit AND              | "algebra and graphs"                      | Baseline: Are both concepts required? |
| Implicit intersection     | "quadratics with graphs"                  | Natural language AND                  |
| Concept + Method          | "equations using substitution"            | Method-specific matching              |
| Three concepts            | "probability and fractions with diagrams" | Concept density scoring               |
| Single concept (baseline) | "graphs"                                  | Comparison point                      |
| Four concepts (extreme)   | "linear graphs algebra substitution"      | Extreme density test                  |
| Abstract intersection     | "geometry and algebra together"           | Semantic bridging                     |

### Expected Insights

1. **If 2-concept queries work but 3+ fail**:
   → BM25 scoring dilutes with too many terms

2. **If concept+method queries work**:
   → Method terms are well-indexed (lesson structure field)

3. **If single-concept scores higher than multi-concept**:
   → Need concept-aware scoring (favor documents matching ALL concepts)

4. **If abstract intersections fail**:
   → ELSER not bridging semantic gaps well

---

## Running Diagnostic Analysis

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm tsx scripts/analyze-diagnostic-queries.ts
```

### Output Format

```text
=================================================================
SYNONYM DIAGNOSTIC ANALYSIS
=================================================================

### Single-word synonym
Count: 2 | MRR: 0.833 | Success: 100% | Not in top 10: 0
  ✅ "trig ratios" - Rank 1 (MRR: 1.000)
  ✅ "factorise quadratics" - Rank 2 (MRR: 0.500)

### Phrase synonym at START
Count: 1 | MRR: 0.333 | Success: 0% | Not in top 10: 0
  ⚠️ "straight line equations" - Rank 4 (MRR: 0.333)
     Top 3: finding-the-gradient-of-a-line, ...

...
```

---

## Using Results to Guide B.5

Based on diagnostic results, prioritize fixes:

1. **If phrase synonyms fail consistently**:
   - Add phrase matching boost for curriculum terms
   - Consider `match_phrase` or `span_near` queries

2. **If multi-concept scoring is poor**:
   - Adjust `minimum_should_match` for multi-concept queries
   - Add concept count as a scoring signal
   - Consider coordinated retrieval

3. **If specific patterns succeed**:
   - Document what's working well
   - Avoid "fixing" what already works

---

## Diagnostic vs Hard vs Standard Queries

| Type           | Count | Purpose                              |
| -------------- | ----- | ------------------------------------ |
| **Standard**   | 40    | Baseline performance (topic names)   |
| **Hard**       | 15    | Challenge system (6 categories)      |
| **Diagnostic** | 18    | Isolate failure modes (2 categories) |

**Flow**:

1. Standard queries → Validate basic functionality
2. Hard queries → Identify weak categories (synonym, multi-concept)
3. Diagnostic queries → Understand WHY those categories fail
4. Implement fixes → Re-run diagnostics to validate improvement

---

## Adding New Diagnostic Queries

When adding diagnostics:

1. **Isolate one variable**: Don't test multiple things at once
2. **Include baseline**: Add a known-good query for comparison
3. **Document hypothesis**: What pattern are you testing?
4. **Expected relevance**: Define what "success" looks like

Example:

```typescript
{
  query: 'test pattern here',
  category: 'synonym' | 'multi-concept',
  priority: 'high',
  description: 'Pattern name: what variable you're testing. Hypothesis.',
  expectedRelevance: {
    'expected-lesson-slug': 3,  // Must match
    'also-good-lesson-slug': 2, // Should match
  },
}
```

---

## Related ADRs

| ADR                                                                                                       | Topic                                |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Search Approach Evaluation Framework |
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)   | Fundamentals-First Search Strategy   |
| [ADR-084](../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md)                | Phrase Query Boosting                |
