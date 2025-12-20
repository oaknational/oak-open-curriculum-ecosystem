# ADR-082: Fundamentals-First Search Strategy

**Status**: ACCEPTED  
**Date**: 2025-12-19  
**Decision Makers**: Development Team  
**Related**: [ADR-081](081-search-approach-evaluation-framework.md), [ADR-076](076-elser-only-embedding-strategy.md), [ADR-063](063-sdk-domain-synonyms-source-of-truth.md)

## Context

The Oak semantic search system has rich data assets:

- **Textual**: Lesson transcripts, curated summaries, titles
- **Metadata**: Keywords, learning points, misconceptions, teacher tips
- **Relationships**: Lesson→Unit, Unit→Thread, Thread→Subject
- **Curriculum Structure**: Key stages, tiers, exam boards, pathways

Despite these assets, experiment E-001 (Semantic Reranking) demonstrated a **-16.8% regression** when applying AI-based cross-encoder reranking. Analysis revealed that:

1. The generic cross-encoder lacks curriculum domain knowledge
2. Our hard query failures are primarily vocabulary gaps (synonym coverage)
3. Document relationships (Unit→Lesson) are indexed but not exploited for relevance
4. Traditional search techniques (synonyms, phrases, noise filtering) are incomplete

## Problem Statement

How do we prioritise search improvements to:

1. **Maximise value** from existing data before adding complexity
2. **Build solid foundations** that AI can amplify, not replace
3. **Avoid premature optimisation** with AI that doesn't understand our domain
4. **Systematically improve** through measurable, incremental changes

## Decision

**We adopt a tiered "Fundamentals-First" strategy where traditional search techniques must be exhausted before AI enhancement is considered.**

### 1. The Search Excellence Pyramid

```text
                           ┌─────────────────┐
                           │   PHENOMENAL    │  ← Tier 4: AI Enhancement
                           │   (E-00x series)│     Reranking, RAG, Query Expansion
                           │                 │     ONLY after lower tiers mastered
                       ┌───┴─────────────────┴───┐
                       │       EXCELLENT         │  ← Tier 3: Modern ES Features
                       │   (F-003, F-004, F-005) │     RRF optimisation, Linear, MLT
                       │                         │     Requires Tier 2 complete
                   ┌───┴─────────────────────────┴───┐
                   │           VERY GOOD             │  ← Tier 2: Document Relationships
                   │       (F-002, F-006, F-007)     │     Cross-referencing, joins
                   │                                 │     Requires Tier 1 complete
               ┌───┴─────────────────────────────────┴───┐
               │              GOOD                       │  ← Tier 1: Search Fundamentals
               │          (F-001, F-008, F-009)          │     Synonyms, phrases, noise
               │                                         │     ← CURRENT PRIORITY
               └─────────────────────────────────────────┘
```

### 2. Tier Definitions and Experiments

#### Tier 1: Search Fundamentals (CRITICAL)

Non-AI techniques with decades of proven value.

| Experiment | Technique                      | Expected Impact                          |
| ---------- | ------------------------------ | ---------------------------------------- |
| **F-001**  | Comprehensive synonym coverage | 5/8 lesson failures are vocabulary gaps  |
| **F-008**  | Noise phrase filtering         | Colloquial queries diluted by filler     |
| **F-009**  | Phrase query enhancement       | Multi-word terms matched as bag-of-words |

**Entry Criteria**: None — this is the foundation.  
**Exit Criteria**: Hard query MRR ≥0.45; no regression on standard queries.

#### Tier 2: Document Relationships (HIGH)

Exploit the rich structure we already have.

| Experiment | Technique                   | Expected Impact                   |
| ---------- | --------------------------- | --------------------------------- |
| **F-002**  | Unit→Lesson cross-reference | Lessons boosted by unit relevance |
| **F-006**  | Thread-based relevance      | Curriculum progression context    |
| **F-007**  | More Like This              | Related content discovery         |

**Entry Criteria**: Tier 1 exit criteria met.  
**Exit Criteria**: Hard query MRR ≥0.55; cross-reference demonstrably improves ranking.

#### Tier 3: Modern ES Features (MEDIUM)

Advanced search techniques that don't require AI.

| Experiment | Technique                  | Expected Impact                      |
| ---------- | -------------------------- | ------------------------------------ |
| **F-003**  | RRF parameter optimisation | Fine-tune rank_constant, window_size |
| **F-004**  | Linear Retriever           | ELSER weighting for hard queries     |
| **F-005**  | Field boosting refinement  | Pedagogical field emphasis           |

**Entry Criteria**: Tier 2 exit criteria met.  
**Exit Criteria**: Hard query MRR ≥0.60; parameters evidence-based.

#### Tier 4: AI Enhancement (DEFERRED)

Only pursue when Tiers 1-3 show diminishing returns.

| Experiment | Technique                    | Expected Impact                       |
| ---------- | ---------------------------- | ------------------------------------- |
| **E-002**  | LLM query expansion          | Vocabulary gaps bridged automatically |
| **E-003**  | LLM reranking (domain-aware) | Curriculum-aware relevance judgement  |
| **E-00x**  | RAG                          | Answer synthesis, not just ranking    |

**Entry Criteria**: Tiers 1-3 complete; MRR plateau demonstrated.  
**Exit Criteria**: Hard query MRR ≥0.75; latency acceptable.

### 3. What "Excellent Search" Looks Like at Each Tier

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                 SEARCH EXCELLENCE BY TIER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TIER 1: GOOD (MRR 0.45+)                                                   │
│  ═══════════════════════                                                    │
│  Query: "solving for x"                                                     │
│  → Synonym: "solving for x" → "linear equations"                            │
│  → Result: Correct lesson, rank 1-2                                         │
│                                                                             │
│  TIER 2: VERY GOOD (MRR 0.55+)                                              │
│  ═════════════════════════════                                              │
│  Query: "quadratic equations"                                               │
│  → Match unit: "Solving Quadratic Equations"                                │
│  → Boost lessons: ["quadratic-formula", "factorising-quadratics", ...]     │
│  → Result: Lessons from best unit at top                                    │
│                                                                             │
│  TIER 3: EXCELLENT (MRR 0.65+)                                              │
│  ═════════════════════════════                                              │
│  Query: "trigonometry for higher tier"                                      │
│  → ELSER weighted 1.5x in Linear Retriever                                  │
│  → Thread context: "Trigonometry" progression                               │
│  → Result: Coherent learning path, tier-appropriate                         │
│                                                                             │
│  TIER 4: PHENOMENAL (MRR 0.80+)                                             │
│  ════════════════════════════════                                           │
│  Query: "how is trigonometry taught across KS3 and KS4?"                    │
│  → Query expansion: "trigonometry progression year 7 to year 11"            │
│  → LLM reranker: understand pedagogical sequence                            │
│  → RAG synthesis: narrative answer with lesson citations                    │
│  → Result: Insightful answer, not just a list                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4. Core Principles

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FUNDAMENTALS-FIRST PRINCIPLES                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PRINCIPLE 1: EXHAUST SIMPLE BEFORE COMPLEX                                 │
│  ─────────────────────────────────────────────                              │
│  • Synonym coverage before query expansion                                  │
│  • Phrase matching before semantic understanding                            │
│  • Cross-referencing before knowledge graphs                                │
│                                                                             │
│  PRINCIPLE 2: MEASURE BEFORE CHANGING                                       │
│  ─────────────────────────────────────────────                              │
│  • Baseline every change                                                    │
│  • Per-query analysis, not just aggregate MRR                               │
│  • Understand WHY something fails before fixing                             │
│                                                                             │
│  PRINCIPLE 3: USE WHAT WE HAVE                                              │
│  ─────────────────────────────────────────────                              │
│  • Rich metadata is indexed but not exploited                               │
│  • Relationships exist but aren't used for relevance                        │
│  • Curriculum structure is valuable signal                                  │
│                                                                             │
│  PRINCIPLE 4: AI IS A MULTIPLIER, NOT A FOUNDATION                          │
│  ─────────────────────────────────────────────────                          │
│  • AI on weak fundamentals = amplified weakness                             │
│  • AI on strong fundamentals = excellence                                   │
│  • Generic AI (E-001) failed; curriculum-aware AI may succeed               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5. Decision Criteria for Tier Advancement

| From → To           | Requirement                                                      |
| ------------------- | ---------------------------------------------------------------- |
| **Start → Tier 1**  | Automatic — this is the foundation                               |
| **Tier 1 → Tier 2** | Hard query MRR ≥0.45 AND Tier 1 experiments complete             |
| **Tier 2 → Tier 3** | Hard query MRR ≥0.55 AND Tier 2 experiments complete             |
| **Tier 3 → Tier 4** | MRR plateau demonstrated (≤5% improvement in last 3 experiments) |

### 6. What We're Using vs Not Using

| Asset                        | Currently Used?    | Tier to Address |
| ---------------------------- | ------------------ | --------------- |
| Lesson transcripts           | ✅ Yes             | —               |
| Curated summaries            | ✅ Yes             | —               |
| Keywords                     | ✅ Yes (boosted)   | —               |
| Keyword descriptions         | ⚠️ In summary only | Tier 1          |
| Misconceptions               | ⚠️ Not boosted     | Tier 3          |
| **Lesson→Unit relationship** | ❌ Not used        | **Tier 2**      |
| **Unit→Thread relationship** | ❌ Not used        | **Tier 2**      |
| **Thread progression**       | ❌ Not used        | **Tier 2**      |
| Prior knowledge              | ❌ In summary only | Tier 2          |

## Rationale

### Why Fundamentals First?

1. **E-001 Proved AI Isn't Magic**: A -16.8% regression shows that AI without domain understanding is harmful
2. **Vocabulary Gaps are Tractable**: 5/8 lesson failures can be fixed with synonyms — no AI required
3. **Rich Data Underutilised**: We have Unit→Lesson relationships we don't use for ranking
4. **Curriculum Is Domain Knowledge**: We shouldn't expect generic models to understand pedagogy

### Why Not Skip to AI?

```text
BAD PATH                              GOOD PATH
────────                              ─────────
Weak fundamentals                     Strong fundamentals
       │                                     │
       ▼                                     ▼
Generic AI (E-001)                    Complete Tier 1-3
       │                                     │
       ▼                                     ▼
-16.8% regression ❌                  MRR 0.65+ ✓
       │                                     │
       ▼                                     ▼
More AI to fix AI?                    Domain-aware AI
       │                                     │
       ▼                                     ▼
Complexity spiral                     MRR 0.80+ ✓
```

### Why This Order?

1. **Synonyms (F-001)**: Highest ROI, lowest risk, fixes most failures
2. **Cross-reference (F-002)**: Exploits existing data we've already indexed
3. **RRF tuning (F-003)**: Optimisation, not foundation — must come later
4. **AI (E-00x)**: Only when fundamentals can't improve further

## Consequences

### Positive

1. **Disciplined improvement**: No premature AI complexity
2. **Measurable progress**: Clear tier advancement criteria
3. **Value from existing data**: Relationships and metadata exploited
4. **AI readiness**: When we add AI, it amplifies a strong foundation
5. **Lower complexity**: Fewer moving parts, easier debugging

### Negative

1. **Slower time to "AI features"**: Tier 4 is intentionally deferred
2. **Requires vocabulary work**: Synonym curation is manual effort
3. **May discover limits**: Fundamentals may not reach target MRR

### Mitigations

- Synonym work guided by failure analysis (B-001 data)
- Each tier has measurable exit criteria
- AI is available as escape hatch if fundamentals plateau

## Implementation

### Experiment Tracking

All experiments tracked in: `.agent/evaluations/experiments/EXPERIMENT-PRIORITIES.md`

### Current Status (2025-12-19)

| Tier  | Status            | Notes                                           |
| ----- | ----------------- | ----------------------------------------------- |
| **1** | ⚠️ Incomplete     | Synonyms partial (68 rules), no phrase matching |
| **2** | ❌ Not Started    | Cross-referencing not exploited                 |
| **3** | ⚠️ Partial        | RRF working, Linear not tested                  |
| **4** | ❌ E-001 Rejected | Premature — fundamentals not mastered           |

### Immediate Next Steps

1. **F-001**: Add 50+ curriculum synonyms targeting hard query failures
2. **F-008**: Implement noise phrase filtering for colloquial queries
3. **F-009**: Add phrase matching for multi-word curriculum terms

## Related Documents

- [ADR-081: Search Approach Evaluation Framework](081-search-approach-evaluation-framework.md) — Metrics and harness
- [ADR-076: ELSER-Only Embedding Strategy](076-elser-only-embedding-strategy.md) — Why sparse, not dense
- [ADR-063: SDK Domain Synonyms Source of Truth](063-sdk-domain-synonyms-source-of-truth.md) — Synonym management
- [E-001 Experiment](../../.agent/evaluations/experiments/E-001-semantic-reranking.experiment.md) — Why AI reranking failed
- [B-001 Baseline](../../.agent/evaluations/experiments/B-001-hard-query-baseline.experiment.md) — Hard query failure analysis
- [Experiment Priorities](../../.agent/evaluations/experiments/EXPERIMENT-PRIORITIES.md) — Detailed experiment tracker

## References

- [Elasticsearch Search Relevance Optimizations](https://www.elastic.co/docs/solutions/search/full-text/search-relevance)
- [Elasticsearch Synonyms](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-synonym-tokenfilter.html)
- [Terms Lookup Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html#query-dsl-terms-lookup)
- [More Like This Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html)
