# Baseline: Hard Query Current State

**Type**: Baseline  
**Date**: 2025-12-19  
**Status**: ✅ Complete  
**Type**: Baseline Documentation (no variant)  
**Related ADR**: [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)

## Abstract

Documents the current behaviour of the 4-way hybrid search system on the 30 hard ground truth queries (15 lessons + 15 units). This establishes a baseline before experimental changes.

---

## 1. Purpose

### 1.1 Why This Baseline

Before running A/B experiments, we need to understand:

- Which hard queries currently succeed vs fail
- What the failure modes are (wrong results, no results, buried results)
- Per-category performance breakdown
- Specific queries that are priorities for improvement

### 1.2 What This Is NOT

This is **not** an A/B experiment. There is no variant being tested.
This is documentation of the current production system's behaviour.

---

## 2. Configuration

### 2.1 System Under Test

```typescript
// Production 4-way RRF (content-type-aware)
{
  index: 'oak_lessons' | 'oak_unit_rollup',
  retrievers: {
    bm25Content: true,   // lesson_content fields
    bm25Structure: true, // lesson_structure, lesson_title
    elserContent: true,  // lesson_content_semantic
    elserStructure: true // lesson_structure_semantic
  },
  fusion: 'rrf',
  lessonBm25: {
    fuzziness: 'AUTO',
    minimum_should_match: '75%'
  }
}
```

### 2.2 Test Dataset

| Dataset | Count | Source |
|---------|-------|--------|
| Lesson hard queries | 15 | `hard-queries.ts` |
| Unit hard queries | 15 | `units/hard-queries.ts` |

### 2.3 Environment

- **ES Instance**: Elastic Cloud Serverless (europe-west1)
- **Index**: `oak_lessons`, `oak_unit_rollup`
- **Date**: 2025-12-19
- **Index Version**: v2025-12-18-144954

---

## 3. Results

### 3.1 Overall Metrics

| Metric | Lessons | Units | Target | Status |
|--------|---------|-------|--------|--------|
| Hard Query MRR | 0.367 | 0.811 | ≥0.50 | ❌ Lessons below |
| Not in top 10 rate | 53.3% | 0.0% | 0% | ❌ Lessons issue |
| Avg latency | 388ms | 198ms | ≤1500ms | ✅ Within budget |

### 3.2 Per-Category Breakdown

#### Lesson Hard Queries

| Category | Count | MRR | Status | Notes |
|----------|-------|-----|--------|-------|
| Naturalistic | 3 | 0.333 | ⚠️ Acceptable | 2/3 not in top 10 |
| Misspelling | 3 | 0.833 | ✅ Excellent | Fuzzy matching working |
| Synonym | 3 | 0.167 | ❌ Poor | ELSER not bridging vocabulary |
| Multi-concept | 2 | 0.250 | ❌ Poor | Cross-topic intersection weak |
| Colloquial | 2 | 0.000 | ❌ Very Poor | Informal language fails completely |
| Intent-based | 2 | 0.500 | ✅ Good | 1/2 succeeds |

#### Unit Hard Queries

| Category | Count | MRR | Status | Notes |
|----------|-------|-----|--------|-------|
| Naturalistic | 1 | 0.500 | ✅ Good | Unit structure aids matching |
| Misspelling | 3 | 0.833 | ✅ Excellent | Consistent with lessons |
| Synonym | 2 | 1.000 | ✅ Perfect | Unit summaries contain synonyms |
| Multi-concept | 3 | 0.778 | ✅ Good | Unit scope captures intersections |
| Colloquial | 2 | 0.750 | ✅ Good | Unit descriptions more informal |
| Intent-based | 4 | 0.833 | ✅ Excellent | Unit metadata aligns with intent |

### 3.3 Query-by-Query Analysis

#### Lesson Hard Queries

##### Naturalistic Queries (Priority: High)

| Query | Expected | Rank | MRR | Notes |
|-------|----------|------|-----|-------|
| teach my students about solving for x | solving-simple-linear-equations | N/A | 0.000 | ELSER fails to bridge "solving for x" → "linear equations" |
| lesson on working out missing angles in shapes | angles-in-polygons-investigating-exterior-angles | N/A | 0.000 | Descriptive language not matched |
| what to teach before quadratic formula | solving-quadratic-equations-by-factorising | 1 | 1.000 | Curriculum sequencing well-indexed |

##### Misspelling Queries (Priority: Critical)

| Query | Expected | Rank | MRR | Notes |
|-------|----------|------|-----|-------|
| simulatneous equasions substitution method | solving-simultaneous-linear-equations-by-substitution | 1 | 1.000 | ✅ Fuzzy matching succeeds |
| circel theorms tangent | the-angle-between-a-tangent-and-a-radius-is-90-degrees | 2 | 0.500 | ✅ Recovered despite severe misspellings |
| standerd form multiplying dividing | multiplying-numbers-in-standard-form | 1 | 1.000 | ✅ Edit distance 1 handled well |

##### Synonym Queries (Priority: High)

| Query | Expected | Rank | MRR | Notes |
|-------|----------|------|-----|-------|
| finding the gradient of a straight line | finding-the-gradient-of-a-line | N/A | 0.000 | "straight line" = "linear" not bridged |
| rules for powers and indices | checking-and-securing-understanding-of-index-laws-with-numerical-bases | N/A | 0.000 | "rules" = "laws" not bridged |
| how to rearrange formulas | changing-the-subject-of-a-formula-to-an-embedded-subject | 2 | 0.500 | Partial success |

##### Multi-concept Queries (Priority: Medium)

| Query | Expected | Rank | MRR | Notes |
|-------|----------|------|-----|-------|
| combining algebra with graphs | solving-simultaneous-equations-graphically | N/A | 0.000 | Cross-topic intersection not found |
| probability with tree diagrams and fractions | constructing-tree-diagrams-for-combined-probabilities | 2 | 0.500 | Partial success |

##### Colloquial Queries (Priority: Medium)

| Query | Expected | Rank | MRR | Notes |
|-------|----------|------|-----|-------|
| that sohcahtoa stuff for triangles | applying-trigonometric-ratios-in-context | N/A | 0.000 | "that...stuff" noise + acronym fails |
| the bit where you complete the square | completing-the-square | N/A | 0.000 | "the bit where" noise filtering fails |

##### Intent-based Queries (Priority: Exploratory)

| Query | Expected | Rank | MRR | Notes |
|-------|----------|------|-----|-------|
| challenging extension work for able mathematicians | problem-solving-with-functions-and-proof | 1 | 1.000 | ✅ "challenging" + "problem-solving" aligns |
| visual introduction to vectors for beginners | introduction-to-vectors | N/A | 0.000 | "visual", "beginners" qualifiers not matched |

#### Unit Hard Queries

| Query | Category | Expected | Rank | MRR | Notes |
|-------|----------|----------|------|-----|-------|
| help with year 10 algebra homework | intent-based | algebraic-manipulation | 1 | 1.000 | ✅ |
| what comes before GCSE trigonometry | naturalistic | right-angled-trigonometry | 2 | 0.500 | |
| struggling students need foundation probability | intent-based | conditional-probability | 1 | 1.000 | ✅ |
| simultanous equasions | misspelling | simultaneous-equations-2-variables | 2 | 0.500 | |
| trigonomatry sohcahtoa | misspelling | right-angled-trigonometry | 1 | 1.000 | ✅ |
| quadradic graphs and roots | misspelling | non-linear-graphs | 1 | 1.000 | ✅ |
| working out unknown angles | synonym | angles | 1 | 1.000 | ✅ |
| making x the subject | synonym | algebraic-manipulation | 1 | 1.000 | ✅ |
| number patterns and nth term | multi-concept | further-sequences | 1 | 1.000 | ✅ |
| graphs and algebra together | multi-concept | linear-graphs | 3 | 0.333 | |
| statistics for comparing data sets | multi-concept | comparisons-of-numerical-summaries-of-data | 1 | 1.000 | ✅ |
| that thing with triangles and squares | colloquial | right-angled-trigonometry | 2 | 0.500 | |
| the circle rules with tangents and chords | colloquial | circle-theorems | 1 | 1.000 | ✅ |
| prepare students for higher tier exam board questions | intent-based | functions-and-proof | 3 | 0.333 | |
| real world applications of percentages | intent-based | percentages | 1 | 1.000 | ✅ |

---

## 4. Failure Analysis

### 4.1 Common Failure Patterns

| Pattern | Affected Queries | Root Cause | Potential Fix |
|---------|-----------------|------------|---------------|
| Vocabulary gap | "solving for x", "straight line", "rules for powers" | ELSER trained on formal curriculum terminology, not teacher/student language variations | Query expansion (E-002), LLM synonym injection |
| Colloquial noise | "that sohcahtoa stuff", "the bit where" | BM25 min_should_match treats noise words equally; ELSER doesn't filter filler phrases | Pre-processing to remove filler phrases before search |
| Synonym bridging | "rearrange formulas" → "changing the subject", "gradient of straight line" → "gradient of line" | ELSER semantic similarity insufficient for domain-specific synonym pairs | Curriculum-specific synonym expansion at query time |
| Intent without topic | "visual introduction for beginners" | Qualifiers like "visual", "beginners" have no lexical match in lesson content | NL→DSL extraction to convert intent to filters |
| Cross-topic intersection | "combining algebra with graphs" | RRF fusion may rank single-topic matches higher than cross-topic intersections | Boost for multi-match results, or query restructuring |

### 4.2 Priority Ranking

Based on impact and fixability:

| Priority | Category | Current MRR | Gap to Target | Fixability | Recommended Approach |
|----------|----------|-------------|---------------|------------|---------------------|
| 1 | Colloquial | 0.000 | 0.50 | Medium | Pre-processing + reranking |
| 2 | Synonym | 0.167 | 0.33 | High | Query expansion (E-002) |
| 3 | Multi-concept | 0.250 | 0.25 | Medium | Reranking (E-001) |
| 4 | Naturalistic | 0.333 | 0.17 | High | Query expansion (E-002) |

### 4.3 Key Insight: Lesson vs Unit Disparity

The stark difference between Lesson MRR (0.367) and Unit MRR (0.811) reveals:

1. **Unit summaries are more information-dense**: Unit descriptions contain curriculum terminology, learning objectives, and outcomes in structured form
2. **Lesson content is transcript-heavy**: Lesson `lesson_content` contains video transcripts which are verbose and may dilute semantic signal
3. **Unit rollup aggregation helps**: The unit rollup index aggregates lesson data, creating richer semantic representations

**Implication**: Lesson search may benefit from:

- Semantic reranking (E-001) to re-score based on query-result relevance
- Query expansion to inject formal terminology before search

---

## 5. Next Steps

This baseline informs the following experiments:

| Experiment | Target Category | Hypothesis | Priority |
|------------|-----------------|------------|----------|
| E-001 (Semantic Reranking) | All hard queries | Cross-encoder reranking improves ranking quality | High |
| E-002 (Query Expansion) | Synonym, Naturalistic | LLM expansion bridges vocabulary gap | Medium |
| E-003 (Linear Retriever) | Multi-concept | Weight tuning improves ELSER contribution | Medium |
| E-004 (Phonetic) | Misspelling | Already working (0.833), deprioritise | Low |

**Recommendation**: Start with E-001 (Semantic Reranking) as it addresses multiple failure patterns without query modification complexity.

---

## Appendix A: Ground Truth Queries

### Lesson Hard Queries

```typescript
export const HARD_QUERIES: readonly GroundTruthQuery[] = [
  // NATURALISTIC
  { query: 'teach my students about solving for x', category: 'naturalistic', priority: 'high' },
  { query: 'lesson on working out missing angles in shapes', category: 'naturalistic', priority: 'high' },
  { query: 'what to teach before quadratic formula', category: 'naturalistic', priority: 'high' },
  
  // MISSPELLING
  { query: 'simulatneous equasions substitution method', category: 'misspelling', priority: 'critical' },
  { query: 'circel theorms tangent', category: 'misspelling', priority: 'critical' },
  { query: 'standerd form multiplying dividing', category: 'misspelling', priority: 'critical' },
  
  // SYNONYM
  { query: 'finding the gradient of a straight line', category: 'synonym', priority: 'high' },
  { query: 'rules for powers and indices', category: 'synonym', priority: 'high' },
  { query: 'how to rearrange formulas', category: 'synonym', priority: 'high' },
  
  // MULTI-CONCEPT
  { query: 'combining algebra with graphs', category: 'multi-concept', priority: 'medium' },
  { query: 'probability with tree diagrams and fractions', category: 'multi-concept', priority: 'medium' },
  
  // COLLOQUIAL
  { query: 'that sohcahtoa stuff for triangles', category: 'colloquial', priority: 'medium' },
  { query: 'the bit where you complete the square', category: 'colloquial', priority: 'medium' },
  
  // INTENT-BASED
  { query: 'challenging extension work for able mathematicians', category: 'intent-based', priority: 'exploratory' },
  { query: 'visual introduction to vectors for beginners', category: 'intent-based', priority: 'exploratory' },
];
```

### Unit Hard Queries

```typescript
export const UNIT_HARD_QUERIES: readonly UnitGroundTruthQuery[] = [
  { query: 'help with year 10 algebra homework' },
  { query: 'what comes before GCSE trigonometry' },
  { query: 'struggling students need foundation probability' },
  { query: 'simultanous equasions' },
  { query: 'trigonomatry sohcahtoa' },
  { query: 'quadradic graphs and roots' },
  { query: 'working out unknown angles' },
  { query: 'making x the subject' },
  { query: 'number patterns and nth term' },
  { query: 'graphs and algebra together' },
  { query: 'statistics for comparing data sets' },
  { query: 'that thing with triangles and squares' },
  { query: 'the circle rules with tangents and chords' },
  { query: 'prepare students for higher tier exam board questions' },
  { query: 'real world applications of percentages' },
];
```

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-18 | Initial baseline document created |
| 2025-12-19 | Complete baseline results populated from run-baseline.ts |
