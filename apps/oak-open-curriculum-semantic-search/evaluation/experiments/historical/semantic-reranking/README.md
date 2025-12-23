# Semantic Reranking Experiment (B.2)

**Status**: ❌ REJECTED  
**Date**: 2025-12-19  
**Outcome**: -16.8% regression on lesson MRR

## Hypothesis

Cross-encoder semantic reranking will improve hard query MRR by ≥15%.

## Implementation

This directory contains the rejected semantic reranking experiment that tested using a generic cross-encoder model (`cross-encoder/ms-marco-MiniLM-L-6-v2`) to rerank search results.

### Files

- `experiment-runner.ts` - Orchestrates the reranking experiment
- `query-builders.ts` - Query construction for reranking
- `query-builders.unit.test.ts` - Tests for query builders
- `result-analysis.ts` - Analysis of reranking results
- `result-analysis.unit.test.ts` - Tests for analysis
- `types.ts` - Type definitions
- `index.ts` - Barrel exports

## Results

| Metric          | Before | After | Delta      |
| --------------- | ------ | ----- | ---------- |
| Lesson Hard MRR | 0.367  | 0.305 | **-16.8%** |

## Key Findings

1. **Generic AI models lack curriculum domain knowledge**: The cross-encoder didn't understand curriculum-specific vocabulary and relationships.

2. **AI on weak fundamentals amplifies weakness**: Without strong baseline search (synonyms, phrase matching), adding AI made things worse.

3. **Need fundamentals first**: This experiment led to [ADR-082: Fundamentals-First Strategy](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md).

## Decision

❌ **REJECTED** - The experiment was reverted and a strategic pivot was made to focus on search fundamentals before applying AI enhancement.

## What This Taught Us

> "We should be able to do an excellent job with traditional methods, and an amazing job with non-AI recent search methods, and a phenomenal job once we take that already optimised approach and add AI into the mix."
>
> — ADR-082

**Strategic insight**: AI enhancement should be Tier 4 (only after mastering Tiers 1-3):

1. **Tier 1**: Search Fundamentals (synonyms, phrase matching, noise filtering)
2. **Tier 2**: Document Relationships (unit↔lesson cross-reference)
3. **Tier 3**: Modern ES Features (RRF tuning, Linear Retriever)
4. **Tier 4**: AI Enhancement (only when fundamentals plateau)

## Related Documentation

- [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) - Strategic pivot resulting from this experiment
- [semantic-reranking.experiment.md](../../../.agent/evaluations/experiments/semantic-reranking.experiment.md) - Full experiment writeup
- [EXPERIMENT-LOG.md](../../../.agent/evaluations/EXPERIMENT-LOG.md) - Chronological experiment history

## Future Consideration

AI-powered reranking may be revisited in Tier 4 once search fundamentals are mastered, potentially with:

- Curriculum-specific fine-tuning
- Domain-aware embedding models
- Hybrid scoring with strong baseline

But only after:

- Hard query MRR ≥0.50 (Tier 1 exit)
- Cross-reference working (Tier 2)
- RRF optimized (Tier 3)
- Plateau demonstrated (≤5% improvement in last 3 experiments)
