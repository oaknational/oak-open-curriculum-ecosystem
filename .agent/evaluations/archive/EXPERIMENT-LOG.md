# Experiment Log

Record of search experiments and their impact.

**Last Updated**: 2026-01-11

---

## Critical Understanding (2026-01-11)

### What Ground Truth Metrics Actually Measure

| What We Thought | What We're Actually Measuring |
|-----------------|------------------------------|
| "Does search help teachers find useful content?" | "Did search return the exact slugs we arbitrarily wrote down?" |

**~60% of ground truths are broken or suboptimal.** Search often returns BETTER results than expected slugs.

See: [Audit Report](audits/ground-truth-audit-2026-01.md)

### Measurement Scope Disclaimer

**All future experiment entries must include:**

> **Measurement Scope**: Ground truth metrics measure expected slug position, not user satisfaction. A query may receive low MRR while search returns useful results.

---

## Current System State

**Status**: Phase 1 — Pruning & Curation in progress

| Metric | Current | Target |
|--------|---------|--------|
| Ground truth entries | 30 | 28 |
| Total queries | ~480 | 112 |
| Queries per category | Variable | 1 |
| AI-curated | 0% | 100% |

**Reliable metrics not available until Phase 1 complete.**

---

## Log Entries

### 2026-01-11: Ground Truth Audit

**Context**: Comprehensive audit of ground truth system

**Key Findings**:

| Finding | Implication |
|---------|-------------|
| ~60% of ground truths broken or suboptimal | Metrics are unreliable |
| Zero-hit rate (18.6%) measures ground truth quality | "Search failures" are often ground truth failures |
| Search returns BETTER results than expected slugs | Ground truths may be wrong, not search |

**Decision**: Keep current system, aggressively prune to 120 queries (1 per subject-phase-category), AI-curate all queries.

**Full report**: [audits/ground-truth-audit-2026-01.md](audits/ground-truth-audit-2026-01.md)

---

## How to Add an Entry

After running an experiment:

```markdown
### YYYY-MM-DD: [Descriptive Name]

**Context**: Why this experiment was run

**Method**: `pnpm benchmark --subject X --phase Y`

**Results**:

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| MRR | X.XXX | X.XXX | +X% |
| NDCG@10 | X.XXX | X.XXX | +X% |
| Zero-Hit % | X.X% | X.X% | -X% |

**Decision**: ✅ ACCEPTED / ❌ REJECTED

**Key insight**: One paragraph explaining the most important learning
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [Prompt](../prompts/semantic-search/semantic-search.prompt.md) | Session entry |
| [Current State](../plans/semantic-search/current-state.md) | System metrics |
| [M3 Plan](../plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md) | Ground truth restructure |
