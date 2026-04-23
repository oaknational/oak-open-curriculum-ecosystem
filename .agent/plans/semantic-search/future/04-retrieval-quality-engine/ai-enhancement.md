# AI Enhancement — DESTINATION

**Boundary**: retrieval-quality-engine  
**Legacy Stream Label**: search-quality  
**Level**: 4  
**Status**: ⏸️ Blocked by Level 3  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-01-03  
**Last Updated**: 2026-01-17

---

## This Is Not Optional

**AI Enhancement is the destination, not a "nice to have".**

Some query types CANNOT be solved by Levels 1-3. Without AI:

| Query | Issue | Why AI Required |
|-------|-------|-----------------|
| "challenging extension work for able mathematicians" | Intent-based | No metadata for difficulty/audience |
| "visual introduction to vectors for beginners" | Intent-based | No teaching style metadata |
| "that thing with triangles and squares" | Colloquial | Entity resolution beyond synonyms |
| "what comes before GCSE trigonometry" | Progression | Curriculum sequence + NL understanding |
| "help struggling students with fractions" | Pedagogical | Remediation intent |

**These query shapes currently underperform in legacy benchmark slices (often 0.000 MRR).** They will not improve reliably without Level 4 capabilities.

---

## Entry Criteria

Level 4 begins when (per [ADR-082](../../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)):

1. ✅ Level 1 approaches exhausted (complete; validated GT re-baselining handled in Level 3 Stage 0)
2. ⏸️ Level 2 exhausted (document relationships)
3. ⏸️ Level 3 exhausted (semantic reranking, query rules, definitions)
4. ⏸️ ≤5% MRR improvement in last 3 experiments (plateau demonstrated)
5. ⏸️ Specific gaps documented that require AI

**This is "when we reach Level 4" not "if we decide to do Level 4".**

---

## Problem Statement

Certain query types cannot be solved by retrieval alone. They require **intent understanding**:

| Query | Current MRR | Issue |
|-------|-------------|-------|
| "challenging extension work for able mathematicians" | 0.000 | No difficulty metadata |
| "visual introduction to vectors for beginners" | 0.000 | No teaching style metadata |
| "that thing with triangles and squares" | 0.000 | Needs entity resolution |
| "what comes before GCSE trigonometry" | N/A | Needs curriculum + NL |
| "help struggling students with fractions" | N/A | Needs pedagogical intent |

**Current retrieval limitations**:

- BM25 cannot map colloquial language to curriculum vocabulary
- ELSER has semantic understanding but not pedagogical intent
- Synonyms cannot capture fuzzy intent ("visual" → "diagram", "video", "animation")
- Filters cannot be inferred from natural language

---

## Architecture: LLM Pre-processor

```text
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
                        │  (BM25 + ELSER + RRF + reranking)       │
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

## Implementation Considerations

### LLM Selection

| Option         | Latency | Cost | Quality   |
| -------------- | ------- | ---- | --------- |
| GPT-4          | ~1-2s   | High | Excellent |
| GPT-3.5-turbo  | ~300ms  | Low  | Good      |
| Claude Haiku   | ~200ms  | Low  | Good      |
| Local (Llama)  | ~100ms  | None | Moderate  |

**Recommendation**: Start with GPT-3.5-turbo for balance, measure quality degradation.

### Latency Budget

Per [operations/governance.md](../07-runtime-governance-and-operations/governance.md):

| Stage | Budget |
|-------|--------|
| LLM preprocessing | 300ms |
| Total with LLM | ~580ms |

LLM preprocessing is **optional under load** — graceful degradation means original query passes through unchanged.

### Caching

```typescript
// Cache key: hash(normalized_query)
// TTL: 24 hours (curriculum vocabulary stable)
// Expected hit rate: >80% for common queries
```

### Fallback

If LLM pre-processing fails:

1. Log error
2. Pass original query to search unchanged
3. Return results (degraded but functional)

---

## Acceptance Criteria

- [ ] Colloquial queries resolve to curriculum terms (MRR ≥ 0.70)
- [ ] Intent extraction works for preparation/review/extension/remediation
- [ ] Filter extraction captures subject/keyStage from natural language
- [ ] Latency overhead < 500ms (p95)
- [ ] Graceful degradation when LLM unavailable
- [ ] Caching reduces LLM calls by > 80% for repeated queries

---

## Ground Truth Queries (Candidates)

These queries should improve after implementation:

Ground truths must be authored via
[ground-truth-expansion-plan.md](../09-evaluation-and-evidence/ground-truth-expansion-plan.md)
to preserve methodology and benchmark comparability.

| Query                                            | Current MRR | Target MRR |
| ------------------------------------------------ | ----------- | ---------- |
| "challenging extension work for able mathematicians" | 0.000     | ≥ 0.80     |
| "visual introduction to vectors for beginners"   | 0.000       | ≥ 0.70     |
| "that thing with triangles and squares"          | 0.000       | ≥ 0.90     |
| "what comes before GCSE trigonometry"            | N/A         | ≥ 0.80     |
| "help struggling students with fractions"        | N/A         | ≥ 0.70     |

---

## Checklist

- [ ] Design LLM prompt for query preprocessing
- [ ] Implement PreprocessedQuery schema
- [ ] Add caching layer
- [ ] Implement fallback logic
- [ ] Add ground truths for intent-based queries
- [ ] Benchmark intent-based query MRR
- [ ] Document latency impact
- [ ] Create ADR for Level 4 architecture

---

## Timeline Expectation

Based on the roadmap dependency chain:

```text
Now:       Ground Truth Review (Phase 1)
           ↓
Next:      SDK Extraction (Phase 2)
           ↓
Then:      Foundations + Tiers 2-3
           ↓
Finally:   TIER 4 (this plan)
```

**Level 4 is not far away — it's the natural end of the quality journey.**

---

## Related Documents

| Document                                                                                      | Purpose              |
| --------------------------------------------------------------------------------------------- | -------------------- |
| [../roadmap.md](../../roadmap.md)                                                                | Master plan          |
| [ADR-082](../../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first   |
| [../../search-acceptance-criteria.md](../../search-acceptance-criteria.md)                    | Level 4 entry criteria |
| [operations/governance.md](../07-runtime-governance-and-operations/governance.md)                                       | Latency budgets, fallbacks |
| [search-decision-model.md](../05-query-policy-and-sdk-contracts/search-decision-model.md)                                          | Query shape taxonomy |
| [ground-truth-expansion-plan.md](../09-evaluation-and-evidence/ground-truth-expansion-plan.md) | Ground-truth/evidence authority |
