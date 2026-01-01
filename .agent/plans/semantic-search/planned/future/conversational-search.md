# Milestone 12: Conversational Search (LLM Pre-processing)

**Status**: 📋 PENDING — Tier 4 (deferred until Tiers 1-3 exhausted)
**Created**: 2025-12-31
**Dependencies**: Milestones 1-11
**Parent**: [roadmap.md](../../roadmap.md)

---

## Problem Statement

Certain query types cannot be solved by retrieval alone. They require **intent understanding**:

| Query | Issue | Required Understanding |
|-------|-------|------------------------|
| "challenging extension work for able mathematicians" | Intent-based | Difficulty level, pedagogical intent |
| "visual introduction to vectors for beginners" | Intent-based | Content format, difficulty level |
| "that thing with triangles and squares" | Colloquial | Entity resolution (Pythagorean theorem) |
| "what comes before GCSE trigonometry" | Progression | Curriculum sequence awareness |
| "help struggling students with fractions" | Pedagogical | Remediation intent |

**Current retrieval limitations**:

- BM25 cannot map colloquial language to curriculum vocabulary
- ELSER has some semantic understanding but not pedagogical intent
- Synonyms cannot capture fuzzy intent ("visual" → "diagram", "video", "animation")
- Filters cannot be inferred from natural language

---

## Architecture

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
                        │        Existing Search Pipeline         │
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

## Why Tier 4

Per [ADR-082: Fundamentals-First Strategy](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md):

| Tier | Name | Focus |
|------|------|-------|
| 1 | Search Fundamentals | ✅ EXHAUSTED — Fuzzy, synonyms, basic retrieval |
| 2 | Document Relationships | Threads, progressions, cross-references |
| 3 | Modern ES Features | ELSER tuning, RRF optimization, field boosting |
| **4** | **AI Enhancement** | **LLM pre-processing (this milestone)** |

**Rationale**: LLM calls add latency and cost. Fundamentals must be maximized first.

---

## Implementation Considerations

### LLM Selection

| Option | Latency | Cost | Quality |
|--------|---------|------|---------|
| GPT-4 | ~1-2s | High | Excellent |
| GPT-3.5-turbo | ~300ms | Low | Good |
| Claude Haiku | ~200ms | Low | Good |
| Local (Llama) | ~100ms | None | Moderate |

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

These queries should be moved from "hard" to "solved" after implementation:

| Query | Current MRR | Expected MRR |
|-------|-------------|--------------|
| "challenging extension work for able mathematicians" | 0.000 | ≥ 0.80 |
| "visual introduction to vectors for beginners" | 0.000 | ≥ 0.70 |
| "that thing with triangles and squares" | 0.000 | ≥ 0.90 |
| "what comes before GCSE trigonometry" | N/A | ≥ 0.80 |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [roadmap.md](../../roadmap.md) | Master plan |
| [ADR-082](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first justification |
| [entity-extraction.md](entity-extraction.md) | Related future work |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-31 | Initial specification | Agent |


