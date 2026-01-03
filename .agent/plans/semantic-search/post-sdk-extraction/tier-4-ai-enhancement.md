# Tier 4: AI Enhancement

**Status**: 📋 DEFERRED — Requires Tiers 1-3 exhausted
**Priority**: LOW until prerequisites met
**Parent**: [README.md](README.md) | [../roadmap.md](../roadmap.md)
**Created**: 2026-01-03 (Extracted from conversational-search.md and reranking analysis)

---

## Overview

Tier 4 adds AI/LLM capabilities to search when traditional approaches are exhausted. This includes query understanding, intent classification, and semantic reranking.

**Entry Criteria** (per [ADR-082: Fundamentals-First Strategy](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)):

1. Tiers 1-3 are exhausted (all checklists complete)
2. Aggregate MRR plateau demonstrated (≤5% improvement × 3 experiments)
3. Specific category gaps remain that cannot be addressed by traditional means
4. Cost/benefit analysis completed

---

## Problem Statement

Certain query types cannot be solved by retrieval alone. They require **intent understanding**:

| Query                                            | Issue        | Required Understanding               |
| ------------------------------------------------ | ------------ | ------------------------------------ |
| "challenging extension work for able mathematicians" | Intent-based | Difficulty level, pedagogical intent |
| "visual introduction to vectors for beginners"   | Intent-based | Content format, difficulty level     |
| "that thing with triangles and squares"          | Colloquial   | Entity resolution (Pythagorean theorem) |
| "what comes before GCSE trigonometry"            | Progression  | Curriculum sequence awareness        |
| "help struggling students with fractions"        | Pedagogical  | Remediation intent                   |

**Current retrieval limitations**:

- BM25 cannot map colloquial language to curriculum vocabulary
- ELSER has semantic understanding but not pedagogical intent
- Synonyms cannot capture fuzzy intent ("visual" → "diagram", "video", "animation")
- Filters cannot be inferred from natural language

---

## Architecture: LLM Pre-processor

```
                        ┌─────────────────────────────────────────┐
                        │         LLM Pre-processor               │
User Query ─────────────│                                         │
"help struggling        │  1. Extract intent (remediation)        │
 students with          │  2. Extract filters (KS2-KS3)          │
 fractions"             │  3. Reformulate query ("fractions       │
                        │     misconceptions", "fractions basics") │
                        │  4. Add pedagogical hints                │
                        └───────────────┬─────────────────────────┘
                                        │
                                        ▼
                        ┌─────────────────────────────────────────┐
                        │        Structured Query                 │
                        │  {                                       │
                        │    text: "fractions misconceptions",    │
                        │    filters: { keyStage: ["ks2","ks3"] },│
                        │    intent: "remediation",               │
                        │    boost: { misconceptions: 2.0 }       │
                        │  }                                       │
                        └───────────────┬─────────────────────────┘
                                        │
                                        ▼
                        ┌─────────────────────────────────────────┐
                        │        Search SDK Pipeline              │
                        │  (BM25 + ELSER + RRF + synonyms)        │
                        └───────────────┬─────────────────────────┘
                                        │
                                        ▼
                              Ranked Results
```

---

## LLM Pre-processor Output Schema

```typescript
interface PreprocessedQuery {
  /** Reformulated search text(s) */
  readonly searchTerms: readonly string[];
  
  /** Extracted filters */
  readonly filters: {
    readonly subject?: readonly SubjectSlug[];
    readonly keyStage?: readonly KeyStageSlug[];
    readonly tier?: readonly TierSlug[];
    readonly examBoard?: readonly ExamBoardSlug[];
  };
  
  /** Detected intent */
  readonly intent?: 
    | 'preparation'      // Getting ready for a topic
    | 'review'          // Revisiting learned material
    | 'extension'       // Advanced/challenging content
    | 'remediation'     // Helping struggling students
    | 'introduction'    // First exposure to topic
    | 'progression';    // What comes next/before
  
  /** Field boosting hints */
  readonly boosts?: {
    readonly misconceptions?: number;
    readonly keyLearningPoints?: number;
    readonly teacherTips?: number;
  };
  
  /** Original query preserved */
  readonly originalQuery: string;
}
```

---

## Semantic Reranking

### Status: DEFERRED

Per [SEMANTIC-RERANKING-REASSESSMENT.md](../../../analysis/SEMANTIC-RERANKING-REASSESSMENT.md):

The previous rejection of semantic reranking was based on invalid ground truth data (15% invalid slugs). However, the decision to defer remains valid because:

1. **Fundamentals-First**: Tiers 1-3 are not yet exhausted
2. **Cost/Benefit**: Reranking adds latency without guaranteed benefit
3. **Simpler Alternatives**: Query reformulation may be more effective

### When to Revisit

Revisit reranking ONLY when:

1. Tiers 1-3 are exhausted (all checklists complete)
2. Specific query categories show plateau
3. LLM pre-processing alone is insufficient

---

## Implementation Considerations

### LLM Selection

| Option         | Latency | Cost | Quality   |
| -------------- | ------- | ---- | --------- |
| GPT-4          | ~1-2s   | High | Excellent |
| GPT-3.5-turbo  | ~300ms  | Low  | Good      |
| Claude Haiku   | ~200ms  | Low  | Good      |
| Local (Llama)  | ~100ms  | None | Moderate  |

**Recommendation**: Start with GPT-3.5-turbo for balance, measure quality degradation.

### Caching

Pre-processed queries should be cached:

```typescript
// Cache key: hash(normalized_query)
// TTL: 24 hours (curriculum vocabulary stable)
```

### Fallback

If LLM pre-processing fails:

1. Log error
2. Pass original query to search unchanged
3. Return results (degraded but functional)

---

## Acceptance Criteria

- [ ] Colloquial queries resolve to curriculum terms
- [ ] Intent extraction works for preparation/review/extension/remediation
- [ ] Filter extraction captures subject/keyStage from natural language
- [ ] Latency overhead < 500ms (p95)
- [ ] Graceful degradation when LLM unavailable
- [ ] Caching reduces LLM calls by > 80% for repeated queries

---

## Ground Truth Queries (Candidates)

These queries should improve after implementation:

| Query                                            | Current MRR | Expected MRR |
| ------------------------------------------------ | ----------- | ------------ |
| "challenging extension work for able mathematicians" | 0.000     | ≥ 0.80       |
| "visual introduction to vectors for beginners"   | 0.000       | ≥ 0.70       |
| "that thing with triangles and squares"          | 0.000       | ≥ 0.90       |
| "what comes before GCSE trigonometry"            | N/A         | ≥ 0.80       |

---

## Related Documents

| Document                                                                                      | Purpose              |
| --------------------------------------------------------------------------------------------- | -------------------- |
| [../roadmap.md](../roadmap.md)                                                                | Master plan          |
| [ADR-082](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first   |
| [../../../analysis/SEMANTIC-RERANKING-REASSESSMENT.md](../../../analysis/SEMANTIC-RERANKING-REASSESSMENT.md) | Reranking analysis |
| [../search-acceptance-criteria.md](../search-acceptance-criteria.md)                          | Tier 4 entry criteria |

