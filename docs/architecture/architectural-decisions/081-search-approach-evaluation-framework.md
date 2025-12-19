# ADR-081: Search Approach Evaluation Framework

**Status**: ACCEPTED  
**Date**: 2025-12-18  
**Decision Makers**: Development Team  
**Related**: [ADR-072](072-three-way-hybrid-search-architecture.md), [ADR-075](075-dense-vector-removal.md), [ADR-076](076-elser-only-embedding-strategy.md)

## Context

The Oak semantic search system has evolved through multiple architectural iterations:

1. **Phase 1**: BM25 only (baseline)
2. **Phase 2**: Two-way hybrid (BM25 + ELSER)
3. **Phase 2.5**: Three-way hybrid (BM25 + ELSER + E5) — reverted
4. **Phase 3**: Four-way hybrid (BM25 + ELSER on Content + Structure)
5. **Phase 3e**: Content-type-aware BM25 tuning

Each phase required systematic evaluation to determine whether changes improved search relevance. We need a documented framework for evaluating future search approaches, including:

- **Retriever fusion strategies** (RRF vs Linear Retriever)
- **Query pre-processing techniques** (LLM expansion, NL→DSL, phonetic)
- **Reranking strategies** (cross-encoder semantic reranking)
- **Query classification and routing**

## Problem Statement

How do we systematically evaluate and compare search approaches to ensure:

1. **Measurable improvement** in search relevance for target query types
2. **No regression** for query types that already work well
3. **Acceptable latency** for the target use case
4. **Reproducible results** that can be independently verified
5. **Clear decision criteria** for adopting or rejecting changes

## Decision

**We adopt a structured evaluation framework with defined metrics, test harnesses, and decision criteria for all search architecture changes.**

### 1. Evaluation Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SEARCH EVALUATION FRAMEWORK                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │  Ground Truth   │    │   Test Harness  │    │    Metrics      │         │
│  │    Queries      │───►│   (Ablation)    │───►│   Calculator    │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│         │                       │                       │                   │
│         │                       │                       ▼                   │
│         │               ┌───────┴───────┐       ┌─────────────────┐         │
│         │               │               │       │   Decision      │         │
│         │               ▼               ▼       │   Matrix        │         │
│         │         ┌─────────┐     ┌─────────┐   └────────┬────────┘         │
│         │         │ Control │     │ Variant │            │                  │
│         │         │ (Prod)  │     │ (Test)  │            ▼                  │
│         │         └────┬────┘     └────┬────┘   ┌─────────────────┐         │
│         │              │               │        │   Accept /      │         │
│         │              ▼               ▼        │   Reject        │         │
│         │         ┌─────────────────────────┐   └─────────────────┘         │
│         │         │    ES Serverless        │                               │
│         │         │    (4-way hybrid)       │                               │
│         │         └─────────────────────────┘                               │
│         │                                                                   │
│  ┌──────┴──────────────────────────────────────────────────────────┐        │
│  │                    QUERY CATEGORIES                              │        │
│  ├──────────────┬────────────┬────────────┬────────────┬───────────┤        │
│  │  Standard    │ Naturalistic│ Misspelling│ Colloquial │ Intent   │        │
│  │  (topic)     │  (teacher)  │  (typos)   │ (informal) │  (pure)  │        │
│  │              │             │            │            │          │        │
│  │  Priority:   │  Priority:  │ Priority:  │ Priority:  │ Priority:│        │
│  │  baseline    │  high       │ critical   │ medium     │ explore  │        │
│  └──────────────┴────────────┴────────────┴────────────┴───────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2. Metrics Definition

#### Primary Metrics

| Metric                         | Formula                       | Interpretation                                  |
| ------------------------------ | ----------------------------- | ----------------------------------------------- |
| **MRR** (Mean Reciprocal Rank) | `1/N × Σ(1/rank_i)`           | Average of 1/position of first relevant result  |
| **NDCG@10**                    | Normalised DCG                | Quality of ranking considering graded relevance |
| **Zero-Hit Rate**              | `count(no_results) / total`   | Queries returning no results                    |
| **p95 Latency**                | 95th percentile response time | Tail latency for worst 5% of queries            |

#### MRR Interpretation Scale

```text
┌─────────────────────────────────────────────────────────────────┐
│                     MRR INTERPRETATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1.00 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Perfect   │
│                                                                 │
│  0.80 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  Excellent          │
│       "Found it immediately" - 1st or 2nd result                │
│                                                                 │
│  0.50 ━━━━━━━━━━━━━━━━━━━━━━━━━━━  Good ◄── TARGET              │
│       "Found it quickly" - top 2-3 results                      │
│                                                                 │
│  0.367━━━━━━━━━━━━━━━━━━  Acceptable ◄── CURRENT (hard)         │
│       "Had to look around" - scrolling required                 │
│                                                                 │
│  0.25 ━━━━━━━━━━━━━  Poor                                       │
│       "Frustrating" - correct result buried                     │
│                                                                 │
│  0.00 ━━━  Very Poor                                            │
│       "Gave up" - teacher leaves frustrated                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Metric Targets by Query Category

| Category         | Current MRR | Target MRR | Acceptable Latency | Priority    |
| ---------------- | ----------- | ---------- | ------------------ | ----------- |
| Standard (topic) | 0.931       | ≥0.92      | ≤500ms             | Baseline    |
| Naturalistic     | ~0.40       | ≥0.50      | ≤1500ms            | High        |
| Misspelling      | ~0.30       | ≥0.45      | ≤1500ms            | Critical    |
| Multi-concept    | ~0.35       | ≥0.45      | ≤1500ms            | Medium      |
| Colloquial       | ~0.35       | ≥0.45      | ≤1500ms            | Medium      |
| Intent-based     | ~0.25       | ≥0.40      | ≤2000ms            | Exploratory |

### 3. Test Harness Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                     ABLATION TEST HARNESS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Ground Truth ───► Configurable Query Builder ───► ES Search   │
│                           │                             │       │
│                    ┌──────┴──────┐                      │       │
│                    │  Config     │                      │       │
│                    │  Matrix     │                      │       │
│                    └──────┬──────┘                      │       │
│                           │                             │       │
│         ┌─────────────────┼─────────────────┐           │       │
│         ▼                 ▼                 ▼           │       │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐       │       │
│  │  Control   │   │  Variant A │   │  Variant B │       │       │
│  │  (prod)    │   │  (rerank)  │   │  (expand)  │       │       │
│  └─────┬──────┘   └─────┬──────┘   └─────┬──────┘       │       │
│        │                │                │              │       │
│        └────────────────┴────────────────┘              │       │
│                         │                               │       │
│                         ▼                               │       │
│                  ┌─────────────┐                        │       │
│                  │  Metrics    │◄────────────────────────       │
│                  │  Comparison │                                │
│                  └──────┬──────┘                                │
│                         │                                       │
│                         ▼                                       │
│                  ┌─────────────┐                                │
│                  │  Report     │                                │
│                  │  Generator  │                                │
│                  └─────────────┘                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Ablation Configuration

```typescript
interface AblationConfig {
  name: string;
  description: string;

  // Retriever configuration
  retrievers: {
    bm25Content: boolean;
    bm25Structure: boolean;
    elserContent: boolean;
    elserStructure: boolean;
    phonetic?: boolean; // Optional 5th retriever
  };

  // Fusion strategy
  fusion: 'rrf' | 'linear';
  weights?: {
    bm25Content: number;
    bm25Structure: number;
    elserContent: number;
    elserStructure: number;
    phonetic?: number;
  };

  // Pre-processing
  preProcessing?: {
    queryExpansion: boolean;
    nlToDsl: boolean;
    classification: boolean;
  };

  // Post-processing
  postProcessing?: {
    reranking: boolean;
    rerankWindowSize: number;
  };
}
```

### 4. Retriever Fusion Comparison

```text
┌─────────────────────────────────────────────────────────────────┐
│               RRF vs LINEAR RETRIEVER COMPARISON                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────┐    ┌─────────────────────────┐     │
│  │          RRF            │    │    LINEAR RETRIEVER     │     │
│  ├─────────────────────────┤    ├─────────────────────────┤     │
│  │                         │    │                         │     │
│  │  score = Σ 1/(k+rank)   │    │  score = Σ w×norm(s)   │     │
│  │                         │    │                         │     │
│  │  • Rank-based only      │    │  • Score-aware          │     │
│  │  • No weight tuning     │    │  • Configurable weights │     │
│  │  • Self-normalising     │    │  • Explicit normaliser  │     │
│  │  • Simple setup         │    │  • Fine-grained control │     │
│  │                         │    │                         │     │
│  │  Best for:              │    │  Best for:              │     │
│  │  • Quick hybrid setup   │    │  • Tuned relevance      │     │
│  │  • Unknown score dist.  │    │  • Query-type weights   │     │
│  │  • Equal retriever imp. │    │  • A/B testing weights  │     │
│  │                         │    │                         │     │
│  │  Version: ES 8.14+      │    │  Version: ES 8.18+/9.0  │     │
│  └─────────────────────────┘    └─────────────────────────┘     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 RECOMMENDATION MATRIX                     │   │
│  ├────────────────┬─────────────┬───────────────────────────┤   │
│  │ Scenario       │ Recommended │ Rationale                 │   │
│  ├────────────────┼─────────────┼───────────────────────────┤   │
│  │ Initial hybrid │ RRF         │ Simpler, proven           │   │
│  │ Query-specific │ Linear      │ Per-type weighting        │   │
│  │ A/B testing    │ Linear      │ Measurable weight impact  │   │
│  │ Latency-first  │ Either      │ Same performance          │   │
│  └────────────────┴─────────────┴───────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5. Pre-Processing Pipeline Evaluation

```text
┌─────────────────────────────────────────────────────────────────┐
│              PRE-PROCESSING EVALUATION CRITERIA                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User Query ──► Query Classification ──► Pre-Processing         │
│                                              │                  │
│         ┌────────────────────────────────────┼──────────────┐   │
│         │                                    │              │   │
│         ▼                                    ▼              ▼   │
│  ┌────────────┐                    ┌────────────┐   ┌──────────┐│
│  │   TOPIC    │                    │  NATURAL   │   │ MISSPELL ││
│  │            │                    │            │   │          ││
│  │ No change  │                    │  Expand    │   │ Phonetic ││
│  │            │                    │  via LLM   │   │ enhance  ││
│  └─────┬──────┘                    └─────┬──────┘   └────┬─────┘│
│        │                                 │               │      │
│        │    ┌────────────────────────────┤               │      │
│        │    │                            │               │      │
│        │    ▼                            ▼               │      │
│        │  ┌────────────┐          ┌────────────┐         │      │
│        │  │   INTENT   │          │  COLLOQUIAL│         │      │
│        │  │            │          │            │         │      │
│        │  │  NL→DSL    │          │  Expand    │         │      │
│        │  │  extract   │          │  via LLM   │         │      │
│        │  │  filters   │          │            │         │      │
│        │  └─────┬──────┘          └─────┬──────┘         │      │
│        │        │                       │                │      │
│        └────────┴───────────────────────┴────────────────┘      │
│                              │                                   │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │ STANDARD HYBRID │  ◄── All paths converge  │
│                    │  (4-way RRF)    │                          │
│                    └─────────────────┘                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    EVALUATION CRITERIA                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Pre-Processing    │ Measure                │ Target            │
│  ─────────────────┼───────────────────────┼─────────────────── │
│  Query Expansion  │ Naturalistic MRR Δ    │ ≥+20%              │
│  NL→DSL           │ Intent MRR Δ          │ ≥+30%              │
│  Phonetic         │ Misspelling MRR Δ     │ ≥+25%              │
│  Classification   │ Accuracy on labelled  │ ≥80%               │
│  (all)            │ Latency overhead      │ ≤200ms             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6. Decision Criteria Matrix

| Change Type                | Accept If                                                    | Reject If                              |
| -------------------------- | ------------------------------------------------------------ | -------------------------------------- |
| **Retriever addition**     | Target MRR ≥threshold AND standard MRR ≥0.92 AND p95 ≤budget | Any regression >2% on standard queries |
| **Fusion strategy change** | Overall MRR improvement ≥5%                                  | Hard query MRR regresses               |
| **Pre-processing step**    | Target category MRR ≥+20% AND overhead ≤200ms                | Standard query regression >1%          |
| **Reranking**              | Hard query MRR ≥+15%                                         | p95 latency >2000ms                    |
| **Field/boost tuning**     | Any MRR improvement without regression                       | Any regression anywhere                |

### 7. Experiment Documentation Template

Every experiment must document:

```markdown
## Experiment: [Name]

**Date**: YYYY-MM-DD
**Hypothesis**: [What we expect to happen]
**Variant**: [Configuration changes from control]

### Configuration

- Control: [Production config]
- Variant: [Test config with specific changes]

### Results

| Metric       | Control | Variant | Delta | Significant? |
| ------------ | ------- | ------- | ----- | ------------ |
| Standard MRR | x.xxx   | x.xxx   | +x.x% | Yes/No       |
| Hard MRR     | x.xxx   | x.xxx   | +x.x% | Yes/No       |
| p95 Latency  | xxxms   | xxxms   | +xxx% | —            |

### Per-Category Breakdown

| Category     | Control | Variant | Delta |
| ------------ | ------- | ------- | ----- |
| Naturalistic | x.xxx   | x.xxx   | +x.x% |
| Misspelling  | x.xxx   | x.xxx   | +x.x% |
| ...          | ...     | ...     | ...   |

### Decision

**Accept/Reject**: [Decision with rationale]

### Follow-up

- [Next experiment or implementation task]
```

> **Full template**: See [`.agent/evaluations/experiments/template-for-search-experiments.md`](../../.agent/evaluations/experiments/template-for-search-experiments.md)

## Consequences

### Positive

1. **Reproducible evaluations**: Any team member can run the same tests
2. **Clear decision criteria**: No ambiguity about accept/reject
3. **Historical record**: ADRs document what was tried and why
4. **Regression prevention**: Standard query baseline protected
5. **Structured experimentation**: Systematic approach to improvements

### Negative

1. **Overhead**: Requires documentation for every change
2. **Ground truth maintenance**: Test queries must be curated
3. **Test infrastructure**: Ablation harness needs maintenance

### Mitigations

- Ground truth queries reviewed quarterly
- Ablation tests run in CI/CD for protected branches
- Templates reduce documentation burden

## Implementation

### Current Implementation

```text
apps/oak-open-curriculum-semantic-search/src/lib/search-quality/
├── ground-truth/
│   ├── types.ts              # GroundTruthQuery interface
│   ├── hard-queries.ts       # 15 hard query test cases
│   ├── standard-queries.ts   # Topic-based baseline queries
│   └── index.ts              # Exports
├── metrics.ts                # MRR, NDCG calculation
└── metrics.unit.test.ts      # Metric calculation tests

smoke-tests/
├── four-retriever-ablation.smoke.test.ts  # Production config evaluation
└── bm25-config-ablation.smoke.test.ts     # BM25 parameter sweeps

.agent/evaluations/
├── experiments/
│   ├── template-for-experiments.md           # Generic experiment template
│   └── template-for-search-experiments.md    # Search-specific template
└── guidance/
    └── search-experiment-guidance.md         # Practical how-to guide
```

### Future Implementation (TODO)

When implementing query classification and pre-processing:

1. **Create ADR-082**: Query Classification and Routing Architecture
2. **Extend ground truth**: Add classification labels to all queries
3. **Extend harness**: Support pre-processing pipeline variants
4. **Add metrics**: Classification accuracy, per-category routing

## Related Documents

- [Research: Hard Query Optimization](../../.agent/research/search-query-optimization-research.md)
- [ADR-072: Three-Way Hybrid Search](072-three-way-hybrid-search-architecture.md) (superseded)
- [ADR-075: Dense Vector Removal](075-dense-vector-removal.md)
- [Phase 3 Plan](../../.agent/plans/semantic-search/phase-3-multi-index-and-fields.md)

## References

- [Elasticsearch RRF](https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html)
- [Elasticsearch Linear Retriever](https://www.elastic.co/search-labs/blog/linear-retriever-hybrid-search)
- [Semantic Reranking](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html)
- [MRR Definition](https://en.wikipedia.org/wiki/Mean_reciprocal_rank)
- [NDCG Definition](https://en.wikipedia.org/wiki/Discounted_cumulative_gain)
