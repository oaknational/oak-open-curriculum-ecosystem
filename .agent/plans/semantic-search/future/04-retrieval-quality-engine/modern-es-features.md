# Modern ES Features — HIGHEST ROI

**Boundary**: retrieval-quality-engine  
**Legacy Stream Label**: search-quality  
**Level**: 3  
**Status**: 📋 Pending — After SDK extraction and MCP integration  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-01-03  
**Last Updated**: 2026-02-10  
**Research**: [elasticsearch-approaches.md](../../../../research/elasticsearch/oak-data/elasticsearch-approaches.md)

---

## Overview

This plan applies ES-native features to maximize retrieval quality. **These are the highest-ROI changes** per research recommendations. Semantic reranking and query rules are NOT AI features — they are Elastic-native capabilities.

This plan also includes re-evaluation of Level 1 fundamentals (Stage 0) and MFL-specific investigation, since these are tuning work that belongs in this boundary.

**Prerequisite**: SDK extraction and MCP integration should complete first. [Document Relationships](document-relationships.md) is part of the same enhancements boundary.

**Exit Criteria** (from [search-acceptance-criteria.md](../../search-acceptance-criteria.md)):

| Criterion          | Target | Current | Status             |
| ------------------ | ------ | ------- | ------------------ |
| Aggregate MRR (legacy 120-query baseline, 2026-01-13) | ≥ 0.60 | 0.513 | 🟡 Historical baseline only — Stage 0 re-baseline required |
| Level 2 exhausted  | Complete | Pending | ⏸️ Blocked by Level 2 |

---

## Stage 0: Fundamentals Re-evaluation

Level 1 approaches (synonyms, phrase boosting, noise filtering) were evaluated against the original ground truth system (120 queries, 4 categories per subject-phase), which was superseded by [ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md). The approaches remain in production and are not in question, but their measured impact needs re-baselining against the validated known-answer-first ground truths.

**Before any new search experiments**, run the current configuration against the full ground truth suite to establish a true baseline:

- [ ] Run `pnpm --filter @oaknational/search-cli benchmark:lessons -- --all` and record results as the validated baseline
- [ ] Run `pnpm --filter @oaknational/search-cli benchmark:units -- --all`, `pnpm --filter @oaknational/search-cli benchmark:threads -- --all`, `pnpm --filter @oaknational/search-cli benchmark:sequences -- --all`
- [ ] Investigate MFL performance (see [mfl-multilingual-embeddings.md](mfl-multilingual-embeddings.md) for current 2026-01-13 baselines) — metadata is extensive and should support better results with existing BM25 + ELSER approaches before considering multilingual embeddings
- [ ] Document baseline in `apps/oak-search-cli/evaluation/baselines/baselines.json`

---

## Standard Approaches Checklist

All items must be attempted and documented before this level can be declared "exhausted":

### 🔴 HIGHEST Priority

- [ ] **Semantic reranking** (`text_similarity_reranker`) — Research #1 recommendation
- [ ] **Query rules** (rule retriever for deterministic intent) — Research #2 recommendation
- [ ] **Definition retrieval** — See [definition-retrieval.md](definition-retrieval.md)
- [ ] **Negative controls** — Subject/phase mismatch penalties

### 🟡 MEDIUM Priority

- [ ] RRF k-parameter tuning experiments
- [ ] Per-field boost weight optimisation
- [ ] Query-time synonym expansion (vs index-time)
- [ ] Relationship channel (dedicated field + retriever)
- [ ] kNN vector search evaluation
- [ ] **Fuzziness tuning** — Reduce false positives from AUTO edit distance
- [x] **minimum_should_match tuning** — ✅ IMPLEMENTED (2026-01-23): Changed from `75%` to `2<65%`
- [ ] **Domain term boosting** — Boost matches on curriculum vocabulary (HIGHEST priority for fuzzy false positives)

---

## 🔴 HIGHEST: Semantic Reranking

### What It Is

The `text_similarity_reranker` is an **Elastic-native retriever** that provides two-stage semantic reranking:

```
Stage 1: RRF fusion (current architecture)
         ↓
Stage 2: text_similarity_reranker (re-scores top-K)
```

### Why It Matters

From research ([elasticsearch-approaches.md](../../../../research/elasticsearch/oak-data/elasticsearch-approaches.md)):

- Works on top of existing RRF without replacing it
- Jina AI models (`jina-reranker-v2-base-multilingual`) available in ES Serverless
- Typical improvement: 5-15% MRR lift on educational content
- Often the biggest "it understands me" improvement for NL queries

### Implementation Pattern

```json
{
  "retriever": {
    "text_similarity_reranker": {
      "retriever": {
        "rrf": {
          "retrievers": [
            { "standard": { "query": { "match": { "lesson_structure": "fractions for beginners" } } } },
            { "standard": { "query": { "semantic": { "field": "lesson_structure_semantic", "query": "fractions for beginners" } } } }
          ]
        }
      },
      "field": "lesson_structure",
      "inference_id": "jina-reranker",
      "inference_text": "fractions for beginners",
      "rank_window_size": 50
    }
  }
}
```

### Experiment Design

1. **Baseline**: Current RRF without reranking
2. **Test**: Add `text_similarity_reranker` with various `rank_window_size` values [25, 50, 100]
3. **Measure**: MRR per category, latency
4. **Document**: [EXPERIMENT-LOG.md](../../../../evaluations/EXPERIMENT-LOG.md)

**References**:
- [Semantic reranking](https://www.elastic.co/docs/solutions/search/ranking/semantic-reranking)
- [`text_similarity_reranker` retriever](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever)

---

## 🔴 HIGHEST: Query Rules

### What It Is

The Rule Retriever applies deterministic rules for specific query patterns:

- **Definition queries**: "what is a coefficient?" → boost glossary/definition content
- **Navigational queries**: "Year 5 fractions" → apply year filter automatically
- **Pinning**: Specific queries → guaranteed results

Policy authority note: query-shape semantics, confidence gating, and allowed
actions are defined in
[search-decision-model.md](../05-query-policy-and-sdk-contracts/search-decision-model.md).
This plan owns the Elasticsearch mechanics and performance tuning only.

### Why It Matters

From research ([elasticsearch-approaches.md](../../../../research/elasticsearch/oak-data/elasticsearch-approaches.md)):

- Deterministic, predictable behaviour for known query patterns
- No LLM cost or latency for intent handling
- **Must be outermost retriever layer**

### Implementation Pattern

```json
{
  "retriever": {
    "rule": {
      "match_criteria": [
        { "type": "contains", "metadata": "query", "contains": "what is" }
      ],
      "ruleset_ids": ["definition-queries"],
      "retriever": {
        "text_similarity_reranker": {
          "retriever": { "rrf": { "..." } }
        }
      }
    }
  }
}
```

### Rule Categories to Implement (Derived from Policy Boundary)

| Category | Retrieval-Side Action |
|----------|-----------------------|
| Definition | Route to `definition_first` profile |
| Navigation | Apply pre-filtered profile (`filtered_standard`) |
| Pedagogical / exploration cases | Use designated profile from decision model |
| Pinning / exclusions | Enforce deterministic ranking or blocking |

**References**:
- [Rule retriever](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rule-retriever)
- [Semantic search + Query rules](https://www.elastic.co/search-labs/blog/semantic-search-query-rules)

---

## 🔴 HIGHEST: Negative Controls

### The Problem

Current search only **boosts** relevant results. It doesn't **penalise** irrelevant ones.

Without negative controls:
- Ambiguous queries drift toward overly broad results
- Sensitive domains risk over-recall
- Subject/phase mismatches go unpenalised

### Implementation: Subject Mismatch Penalty

```json
{
  "query": {
    "bool": {
      "must": [{ "/* main query */" }],
      "must_not": [
        { "/* exclusion rules */" }
      ],
      "should": [
        { "term": { "subject_slug": { "value": "maths", "boost": 1.5 } } }
      ],
      "negative_boost": {
        "query": { "/* subject mismatch */" },
        "negative_boost": 0.5
      }
    }
  }
}
```

### Negative Control Categories

| Control | Trigger | Action |
|---------|---------|--------|
| Subject mismatch | Query implies subject X, result is subject Y | Demote by 0.5 |
| Phase mismatch | Query implies KS3, result is KS4 | Demote by 0.7 |
| Sensitivity filter | Query + sensitive subject | Apply stricter relevance threshold |
| Known bad match | Specific query + specific doc | Exclude |

### When to Demote vs Exclude

| Severity | Action | Example |
|----------|--------|---------|
| Wrong subject | Demote | "maths fractions" matching English lesson |
| Wrong phase | Demote | "KS2 photosynthesis" matching KS4 content |
| Dangerous mismatch | Exclude | Sensitive content in wrong context |

---

## 🟡 MEDIUM: Fuzziness Tuning

### The Problem

`fuzziness: AUTO` applies edit distance based on term length:
- 0 edits for 1-2 char terms
- 1 edit for 3-5 char terms
- **2 edits for 6+ char terms**

For educational content, this causes false positives when typos look like different valid terms:

| Query Term | Intended | Fuzzy Match | Edit Distance |
|------------|----------|-------------|---------------|
| "magnits" | magnets | magnify/magnification | 2 |
| "electrisity" | electricity | (correct) | 2 |

**Real example**: Query "electrisity and magnits" returns microscopy lessons (#1-3) because "magnits" fuzzy-matches "magnification" (both share "magni-" prefix, edit distance = 2).

### Elasticsearch Best Practices

From ES documentation:
- 80% of human misspellings have edit distance of 1
- Edit distance 2 is "overly permissive" for long words
- **Recommendation**: Use `fuzziness: 1` instead of `AUTO` for better precision

### Mitigation Options

| Option | Pros | Cons |
|--------|------|------|
| `fuzziness: 1` | Eliminates 2-edit false positives | Misses legitimate 2-edit typos |
| `prefix_length: 3` | Keeps initial chars fixed | Doesn't help if prefix matches |
| Explicit typo synonyms | Precise control | Requires curation |
| Domain term boosting | Boosts curriculum vocab | Doesn't block false positives |

### Experiment Design

1. **Baseline**: Current `fuzziness: AUTO`
2. **Test A**: `fuzziness: 1` (fixed)
3. **Test B**: `fuzziness: AUTO` with `prefix_length: 3`
4. **Test C**: Combine with domain term boosting
5. **Measure**: MRR for imprecise-input category specifically

**Note**: AUTO thresholds (3 and 6 char boundaries) are hard-coded in ES and cannot be configured.

---

## 🟡 MEDIUM: minimum_should_match Tuning

### The Problem

Current configuration uses `minimum_should_match: '2<65%'` for BM25 lesson queries. For 2-term queries, this still requires **both terms to match**.

This breaks cross-topic queries:

| Query | Terms | Required | Problem |
|-------|-------|----------|---------|
| "electricity and magnets" | 2 | Both | Specialized lessons matching only one term are excluded |
| "plants and animals" | 2 | Both | Cross-topic lessons penalized |

**Real example**: Lessons about "electromagnets" (which heavily mention BOTH terms) rank higher than lessons specifically about "electricity" or "magnets" individually — even when those individual lessons are more relevant.

### Elasticsearch Best Practices

From ES documentation, several formats are available:

```
// Fixed: all terms required
"minimum_should_match": "100%"

// Flexible: allow some terms to be missing
"minimum_should_match": "50%"

// Conditional: scale with query size
"minimum_should_match": "2<50%"  // ≤2 terms: all required; >2 terms: 50% required

// Multiple conditions
"minimum_should_match": "2<-25% 9<-3"
```

### Implemented Configuration (2026-01-23)

**Implemented: `2<65%`**

This conditional expression means:
- ≤2 terms: all required (same as previous)
- >2 terms: 65% required (more lenient than previous 75%)

| Terms | Previous (75%) | With `2<65%` | Change |
|-------|----------------|--------------|--------|
| 2 | 2 required | 2 required | Neutral |
| 3 | 3 required | 2 required | **+1 term flexibility** |
| 4 | 3 required | 3 required | Neutral |
| 5 | 4 required | 4 required | Neutral |

**Rationale**: `2<65%` is strictly better for 3-term queries while being neutral for 2-term queries. It doesn't make anything worse and helps queries like "carbon cycle in ecosystems" (3 terms → only 2 required).

**Location**: `apps/oak-search-cli/src/lib/hybrid-search/rrf-query-helpers.ts:257`

```typescript
// Previous
minimum_should_match: '75%'

// Implemented (2026-01-23)
minimum_should_match: '2<65%'
```

### Alternative Options

```typescript
// Option A: Lower threshold (may reduce precision)
minimum_should_match: '50%'

// Option B: More aggressive conditional
minimum_should_match: '2<50%'  // ≤2 terms: all; >2 terms: half

// Option C: Allow 1 missing term always
minimum_should_match: '-1'
```

### Experiment Design

1. **Baseline**: Current `2<65%`
2. **Test A**: `2<70%` (slightly stricter for >2-term queries)
3. **Test B**: `2<60%` (more lenient for >2-term queries)
4. **Test C**: `50%` (flat reduction)
5. **Test D**: `-1` (allow 1 missing term)
6. **Measure**: Aggregate MRR, cross-topic MRR, precision@3 trade-off

### Trade-offs

| Threshold | 2-term | 3-term | Precision | Notes |
|-----------|--------|--------|-----------|-------|
| **2<65%** | Both required | 2/3 required | High | **Current** |
| 2<70% | Both required | 3/3 required | Higher | Stricter on longer queries |
| 2<60% | Both required | 2/3 required | Medium-High | More tolerant of term mismatch |
| 50% | 1/2 required | 2/3 required | Medium | More aggressive |
| -1 | 1 can miss | 1 can miss | Medium | Simple rule |

### Note on 2-term Cross-Topic Queries

The `2<65%` configuration does NOT help 2-term cross-topic queries like "electricity and magnets" — these still require both terms. Fixing this requires either:
1. Using `1<65%` or `50%` (more aggressive, may hurt precision)
2. **Domain term boosting** (preferred long-term solution) — boost curriculum vocabulary so specialized lessons rank higher even when matching only one term

---

## 🟡 MEDIUM: Domain Term Boosting

### The Problem

Fuzzy matching treats all terms equally. When a typo happens to match a valid but unrelated scientific term, there's no signal to prefer curriculum-specific vocabulary.

### Solution: Boost Known Curriculum Terms

Add a dedicated retriever or scoring function that boosts matches on curriculum vocabulary:

```json
{
  "function_score": {
    "query": { "/* main query */" },
    "functions": [
      {
        "filter": { "terms": { "keywords": ["magnets", "electricity", "electromagnets"] } },
        "weight": 1.5
      }
    ],
    "boost_mode": "multiply"
  }
}
```

### Implementation Options

| Approach | Complexity | Effectiveness |
|----------|------------|---------------|
| Terms boost in query | Low | Medium - requires known term lists |
| Dedicated `curriculum_terms` field | Medium | High - can use synonyms |
| Query rules for known patterns | Medium | High - deterministic |
| ELSER semantic disambiguation | Low | Variable - may already help |

### Vocabulary Sources

The curriculum SDK already contains structured vocabulary:
- Lesson keywords (from API)
- Unit titles
- Subject-specific synonyms
- Thread names

These can be indexed into a dedicated field for boosting.

### Experiment Design

1. **Index**: Add `curriculum_terms` field populated from keywords
2. **Query**: Add boost for matches on this field
3. **Measure**: Impact on false positive rate for imprecise-input queries

---

## 🟡 MEDIUM: RRF Parameter Tuning

### Current Configuration

```typescript
const rrfConfig = {
  rank: {
    rrf: {
      rank_constant: 60, // Default, not tuned
      window_size: 100,
    },
  },
};
```

### Experiment Design

| k Value | Expected Behaviour                    |
| ------- | ------------------------------------- |
| k=1     | Winner-takes-all, first rank dominates |
| k=60    | Default, balanced fusion              |
| k=100+  | More weight to lower-ranked results   |

**Protocol**:
1. Baseline with k=60
2. Test k values: [20, 40, 60, 80, 100]
3. Measure MRR per category
4. Select optimal k

---

## 🟡 MEDIUM: Field Boost Optimisation

### Current Boosts

```typescript
const fields = [
  'title^3',
  'lesson_description^2',
  'key_learning_points^2',
  'transcript_sentences^1',
];
```

> **Note**: The `lesson_title^3` boost applies in each BM25 retriever. With all four lesson retrievers active (two BM25, two ELSER), the title boost in BM25 may be excessive — a lesson matching the title in both BM25 retrievers gets double the boost effect. This is a key tuning candidate.

### Optimisation Approach

1. **Ablation study**: Remove each boost, measure impact
2. **Sensitivity analysis**: Test boost values [1, 2, 3, 4, 5]
3. **Title boost specifically**: Test reducing `title^3` to `title^2` or `title^1.5` given the 4-retriever architecture
4. **Per-query-type optimisation**: Different boosts for different intent

---

## 🟡 MEDIUM: Relationship Channel

### From Research

Instead of encoding relationships as synonyms, create a dedicated channel:

1. Index relationship terms into `related_terms` field
2. Add retriever targeting that field
3. Fuse via RRF
4. Let reranking decide ordering

This captures domain adjacency without polluting equivalence logic.

---

## Evaluation Requirements

For each Level 3 experiment:

1. **Design**: Create experiment file with hypothesis
2. **Baseline**: Run `pnpm --filter @oaknational/search-cli benchmark`
3. **Implement**: Make the configuration change
4. **Measure**: Run benchmark again
5. **Analyse**: Per-category breakdown
6. **Record**: [EXPERIMENT-LOG.md](../../../../evaluations/EXPERIMENT-LOG.md)

Ground-truth additions and methodology should be managed via
[ground-truth-expansion-plan.md](../09-evaluation-and-evidence/ground-truth-expansion-plan.md).

---

## Success Criteria

Level 3 is "exhausted" when:

1. All checklist items attempted and documented
2. No further MRR improvement possible from ES-native changes
3. ≤5% aggregate MRR improvement across 3 consecutive experiments

At this point, Level 4 (AI Enhancement) begins.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [elasticsearch-approaches.md](../../../../research/elasticsearch/oak-data/elasticsearch-approaches.md) | Detailed ES patterns |
| [uses-of-structured-domain-knowledge.md](../../../../research/elasticsearch/oak-data/uses-of-structured-domain-knowledge.md) | All vocabulary levers |
| [definition-retrieval.md](definition-retrieval.md) | Definition capability |
| [search-decision-model.md](../05-query-policy-and-sdk-contracts/search-decision-model.md) | Query shape taxonomy |
| [ground-truth-expansion-plan.md](../09-evaluation-and-evidence/ground-truth-expansion-plan.md) | Ground-truth/evidence authority |
| [../../search-acceptance-criteria.md](../../search-acceptance-criteria.md) | Level 3 checklist |
| [ADR-082](../../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first |
