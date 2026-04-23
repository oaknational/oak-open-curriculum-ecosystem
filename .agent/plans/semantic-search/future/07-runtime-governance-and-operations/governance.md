# Governance

**Boundary**: runtime-governance-and-operations  
**Legacy Stream Label**: operations  
**Status**: 📋 Pending  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-01-17  
**Research**: [documentation-gap-analysis.md](../../../../research/elasticsearch/oak-data/documentation-gap-analysis.md) (Gaps F, G, H, I)

---

## Overview

This document defines **how the search system operates safely and evolves responsibly**. Without explicit operational constraints, the system will work but be:

- Fragile under load
- Hard to debug
- Prone to silent degradation
- Difficult to evolve

---

## 1. Latency Budgets

### Target Latencies

| Metric | Target | Notes |
|--------|--------|-------|
| **p50** | ≤ 200ms | Median response time |
| **p95** | ≤ 500ms | Tail latency |
| **p99** | ≤ 1000ms | Worst case (with reranking) |

### Per-Stage Budgets

| Stage | Budget | Optional? |
|-------|--------|-----------|
| Query parsing + preprocessing | 10ms | No |
| BM25 retrieval | 30ms | No |
| ELSER retrieval | 80ms | No |
| RRF fusion | 10ms | No |
| Semantic reranking | 150ms | **Yes** |
| LLM preprocessing (Level 4) | 300ms | **Yes** |

**Total without optional stages**: ~130ms  
**Total with all stages**: ~580ms

### Latency Monitoring

```typescript
interface SearchTiming {
  total_ms: number;
  stages: {
    parse_ms: number;
    bm25_ms: number;
    elser_ms: number;
    rrf_ms: number;
    rerank_ms?: number;
    llm_ms?: number;
  };
}
```

**Log all search timings for observability.**

---

## 2. Failure Modes & Fallbacks

### Failure Scenarios

| Failure | Detection | Fallback | Alert? |
|---------|-----------|----------|--------|
| **ELSER inference timeout** | p95 > 200ms | Use BM25 only | Yes |
| **Reranker failure** | HTTP 5xx or timeout | Skip reranking, return RRF results | Yes |
| **Synonym set missing** | Analyzer error | Use base analyzer | Yes |
| **LLM preprocessing failure** | HTTP error or timeout | Pass original query unchanged | Yes |
| **ES cluster unavailable** | Connection refused | Return error (no fallback) | Critical |

### Graceful Degradation Ladder

When under pressure, shed stages in this order:

```text
1. LLM preprocessing (if enabled)     ← Drop first
2. Semantic reranking                 ← Drop second
3. ELSER retrieval                    ← Drop third (BM25-only mode)
4. Error response                     ← Last resort
```

### Fallback Implementation

```typescript
async function searchWithFallbacks(query: SearchQuery): Promise<SearchResult> {
  const timing: SearchTiming = { total_ms: 0, stages: {} };
  
  try {
    // Stage 1: LLM preprocessing (optional, Level 4)
    const preprocessed = await withTimeout(
      preprocessQuery(query),
      300,
      () => query // Fallback: original query
    );
    
    // Stage 2: Core retrieval (required)
    const candidates = await retrieveCandidates(preprocessed);
    
    // Stage 3: Reranking (optional)
    const reranked = await withTimeout(
      rerankCandidates(candidates),
      150,
      () => candidates // Fallback: skip reranking
    );
    
    return { results: reranked, timing, degraded: false };
    
  } catch (error) {
    logFailure(error);
    return { results: [], timing, degraded: true, error: error.message };
  }
}
```

---

## 3. Versioning Strategy

### Asset Classes

| Asset | Versioning | Storage |
|-------|------------|---------|
| **Synonym sets** | Semver (e.g., `oak-syns-v2.3.0`) | Elasticsearch Synonyms API |
| **Query rules** | Semver (e.g., `definition-rules-v1.0.0`) | Elasticsearch Query Rules API |
| **Retriever profiles** | Named + versioned | TypeScript code |
| **Ground truths** | Git versioned | Repository |
| **Benchmark baselines** | Timestamped | `baselines.json` |

### Synonym Set Versioning

```typescript
// Synonym set naming convention
const synonymSetId = `oak-syns-${major}.${minor}.${patch}`;

// Example: oak-syns-2.3.0
// - Major: Breaking changes (removed synonyms)
// - Minor: New synonyms added
// - Patch: Corrections to existing synonyms
```

### Rollback Procedure

1. Identify regression via benchmark
2. Restore previous version of affected asset
3. Re-run benchmark to confirm fix
4. Document incident in [EXPERIMENT-LOG.md](../../../../evaluations/EXPERIMENT-LOG.md)

---

## 4. Rollout Strategy

### Stages

| Stage | Scope | Duration | Gate |
|-------|-------|----------|------|
| **Development** | Local + tests | Until passing | All quality gates |
| **Staging** | Staging ES cluster | 24 hours | Benchmark ≥ baseline |
| **Canary** | 5% production traffic | 48 hours | No regressions |
| **Production** | 100% traffic | Ongoing | Monitoring stable |

### Canary Criteria

Move from canary to production when:

- [ ] p95 latency within budget
- [ ] Error rate < 0.1%
- [ ] MRR ≥ baseline (no regression)
- [ ] No critical alerts for 48 hours

### Rollback Triggers

Automatic rollback if:

- Error rate > 1%
- p95 latency > 2× budget
- Critical alert fires

---

## 5. Ownership Model

### Asset Ownership

| Asset Class | Owner | Approval Required |
|-------------|-------|-------------------|
| **Synonym corpus** | Search team | Review by curriculum SME for sensitive subjects |
| **Query rules** | Search team | PR review |
| **Retriever profiles** | Search team | PR review + benchmark |
| **Ground truths** | Search team | PR review |
| **Mining outputs** | Search team | Human review before promotion |
| **Sensitive vocabulary** (RE, RSHE) | Search team + Curriculum team | Dual approval |

### Review Requirements

| Change Type | Review Level |
|-------------|--------------|
| New synonym (non-sensitive) | 1 reviewer |
| New synonym (sensitive subject) | 2 reviewers + curriculum SME |
| Query rule change | 1 reviewer + benchmark |
| Retriever profile change | 2 reviewers + benchmark |
| Ground truth change | 1 reviewer |

---

## 6. Deprecation Policy

### Deprecation Timeline

| Phase | Duration | Action |
|-------|----------|--------|
| **Announced** | T+0 | Document deprecated status |
| **Warning** | T+30 days | Log warnings when deprecated feature used |
| **Removal** | T+90 days | Feature removed |

### What Gets Deprecated

- Old synonym set versions (after new version stable)
- Superseded retriever profiles
- Legacy query patterns
- Experimental features that didn't pan out

### Never Deprecate

- Ground truth queries (historical record)
- Benchmark baselines (comparison reference)
- ADRs (architectural record)

---

## 7. Monitoring & Alerting

### Key Metrics

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| p95 latency | < 500ms | 500-1000ms | > 1000ms |
| Error rate | < 0.1% | 0.1-1% | > 1% |
| ELSER timeout rate | < 1% | 1-5% | > 5% |
| Reranker failure rate | < 1% | 1-5% | > 5% |

### Required Logging

Every search request logs:

```typescript
interface SearchLog {
  timestamp: string;
  query_hash: string; // Anonymised
  timing: SearchTiming;
  degraded: boolean;
  stages_skipped: string[];
  result_count: number;
  filters_applied: string[];
}
```

---

## Checklist

- [ ] Define latency budgets and monitoring
- [ ] Implement fallback logic for each stage
- [ ] Set up versioning for synonym sets
- [ ] Set up versioning for query rules
- [ ] Document ownership model
- [ ] Configure alerting thresholds
- [ ] Create rollout checklist
- [ ] Document deprecation process

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [documentation-gap-analysis.md](../../../../research/elasticsearch/oak-data/documentation-gap-analysis.md) | Research gaps F, G, H, I |
| [search-decision-model.md](../05-query-policy-and-sdk-contracts/search-decision-model.md) | How decisions are made |
| [../roadmap.md](../../roadmap.md) | Master roadmap |
