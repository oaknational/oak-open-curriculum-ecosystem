# Ground Truth System Audit - January 2026

**Status**: Complete  
**Started**: 2026-01-11  
**Completed**: 2026-01-11  
**Author**: AI Agent + Human Stakeholder

---

## Executive Summary

### The Problem

The ground truth system is fundamentally measuring the wrong thing:

| What We Thought | What We're Actually Measuring |
|-----------------|------------------------------|
| "Does search help teachers find useful content?" | "Did search return the exact slugs we arbitrarily wrote down?" |

**~60% of ground truths are broken or suboptimal.** The zero-hit rate (18.6%) is not a search failure rate—it's a ground truth quality indicator.

### The Decision

1. **Keep the current ground truth system** — it's not useless, just misunderstood
2. **Review categories** — ensure they test meaningful user behaviours
3. **Aggressively prune to 1 query per subject-phase-category** — 30 entries × 4 categories = **120 queries**
4. **Be explicit about what results tell us** — and what they don't
5. **Use AI-as-judge to curate** — at ground truth definition time

### Future Work

After the above is complete, consider a separate **AI-driven evaluation layer**:
- 60-120 queries (2-4 per subject-phase)
- AI evaluates "would a teacher find this useful?" rather than slug matching
- Manual execution during local development

---

## The Fundamental Insight

### Two Different Systems

| System | What It Contains | How We Access It |
|--------|------------------|------------------|
| **Oak Curriculum API** | Canonical curriculum data | MCP tools (`oak-local`) |
| **Our Elasticsearch Index** | Search-optimised copy | `hybrid-search` library |

**Ground truths were validated against the Oak API, but benchmarks run against our ES index.**

These systems are related but not identical:
- Our ES index has ~12,833 lessons
- Oak API has the same lessons but different access patterns
- Search behaviour differs between BM25+ELSER (ES) and API text search

### What Ground Truths Actually Measure

| Intended Measurement | Actual Measurement |
|----------------------|-------------------|
| "First relevant result is in position X" | "First result matching our arbitrary slugs is in position X" |
| "Search fails for 18.6% of queries" | "Our expected slugs don't appear in results for 18.6% of queries" |
| "MRR of 0.58 indicates moderate quality" | "MRR of 0.58 indicates expected slugs appear around position 2" |

**In many cases, search returns BETTER results than the expected slugs.**

---

## Evidence

### Zero-Hit Analysis Shows Search Working

From zero-hit investigation—queries diagnosed as "SEARCH_FAILURE" where search is actually working:

#### Example 1: "how voting works in elections" (citizenship/secondary)

| Expected Slugs | Actual Top Results |
|----------------|-------------------|
| `what-is-democracy` | `how-do-elections-work-in-different-countries` |
| `is-direct-democracy-better-than-representative-democracy` | `how-do-elections-in-the-uk-work` |
| | `how-do-elections-work` |

**Assessment**: Actual results literally answer "how voting works in elections". Expected slugs are about democracy theory.

**Verdict**: Search is correct. Ground truth is wrong.

#### Example 2: "number bonds to 10" (maths/primary)

| Expected Slugs | Actual Top Results |
|----------------|-------------------|
| `represent-addition-and-subtraction-facts-within-10` | `use-number-bonds-to-10-to-add-subtract-one-digit-and-two-digit-numbers` |
| `recall-one-and-two-more-or-less-than-numbers-to-ten` | `multiples-of-10-that-total-100` |

**Assessment**: Actual #1 result contains "number bonds to 10" in the title. Expected slugs don't mention number bonds.

**Verdict**: Search is correct. Ground truth is wrong.

#### Example 3: "sine cosine tangent ratios" (maths/secondary)

| Expected Slugs | Actual Top Results |
|----------------|-------------------|
| `checking-and-securing-understanding-of-sine-ratio-problems` | `checking-and-securing-understanding-of-trigonometric-ratios` |
| `checking-and-securing-understanding-of-cosine-problems` | `calculate-trigonometric-ratios-for-30-and-60` |
| `checking-and-securing-understanding-of-tangent-ratio-problems` | `applying-trigonometric-ratios-in-context` |

**Assessment**: Query asks about ALL THREE ratios. Expected slugs cover individual ratios. Actual results cover combined topic—MORE relevant.

**Verdict**: Search is better than expected. Ground truth is suboptimal.

### Quality Distribution

| Quality Level | Est. Count | % of ~480 | Characteristics |
|---------------|------------|-----------|-----------------|
| **Correct** | ~200 | 40% | Query matches lesson titles; precise-topic category |
| **Suboptimal** | ~150 | 30% | Related but not best results; search finds better |
| **Wrong** | ~150 | 30% | Expected slugs don't match query intent |

---

## What The Current System CAN Tell Us

With proper understanding, the current ground truth system provides value:

| Question | Answer Quality | Notes |
|----------|---------------|-------|
| "Did search change?" | ✅ Good | Metric changes indicate something changed |
| "Is search returning results?" | ✅ Good | Zero-hit rate shows complete failures |
| "Is performance acceptable?" | ✅ Good | p95 latency is valid |
| "Are we meeting user needs?" | ❌ Poor | Ground truths don't represent user needs |
| "Which changes improve quality?" | ⚠️ Partial | Only for queries with correct expected slugs |

### What It Cannot Tell Us

- Whether teachers would be satisfied with results
- Whether search quality is "good enough" for production
- Whether specific categories of queries (natural language, typos) are handled well
- Absolute quality benchmarks comparable to other systems

---

## Remediation Plan

### Phase 1: Aggressive Pruning (Current System)

**Target**: 30 subject-phase entries × 4 categories × 1 query = **120 queries**

| Category | Purpose | Min Queries Per Entry |
|----------|---------|----------------------|
| `precise-topic` | Curriculum-aligned search | 1 |
| `natural-expression` | Natural language search | 1 |
| `imprecise-input` | Error recovery | 1 |
| `cross-topic` | Topic intersection | 1 |

**Process for each query**:
1. Run actual search against ES index
2. Compare expected slugs to actual top 10 results
3. AI-as-judge: "Are expected slugs the BEST results for this query?"
4. KEEP if expected = actual best, FIX if expected ≠ actual best, DELETE if query is bad

**Explicit scope**: This system measures "does search return these specific lessons?" not "does search help teachers?"

### Phase 2: AI-Driven Evaluation (Future)

Separate system for answering "does search help teachers?"

**Parameters** (agreed with stakeholder):
- Query set: 60-120 queries (2-4 per subject-phase)
- Evaluation: AI judges usefulness of results
- Frequency: Manual, local development
- Executor: Human stakeholder

**Deferred** until Phase 1 is complete.

---

## Code Quality Findings

### Validation Code (Good Structure, Missing Semantic Check)

All 16 checks are valid but insufficient:

| Present | Missing |
|---------|---------|
| Structural integrity | Semantic relevance |
| Slug existence | Title similarity |
| Category coverage | Actual vs expected comparison |

**A ground truth can pass all 16 checks while having completely wrong expected slugs.**

### Benchmark Code (Excellent)

| Component | Assessment |
|-----------|------------|
| CLI entry | Clean DI pattern |
| Main logic | Well structured |
| Query runner | Pure functions, testable |
| Stats aggregation | Correct calculations |

**The benchmark infrastructure is well-designed. The problem is input data, not tooling.**

### Zero-Hit Investigation (Diagnosis Bug)

```typescript
// Current (broken): classifies everything as SEARCH_FAILURE
function diagnose(actual, expected) {
  const found = expected.filter((s) => actual.indexOf(s) >= 10);
  return found.length > 0 ? 'RANKING_ISSUE' : 'SEARCH_FAILURE';
}
```

Should also detect `GROUND_TRUTH_WRONG` when actual results are better than expected.

---

## Metrics Validity Summary

| Metric | Valid? | Notes |
|--------|--------|-------|
| MRR | Partial | Only for ~40% correct ground truths |
| NDCG@10 | Partial | Depends on expected slug correctness |
| Precision@k | Partial | Constrained by expected slug count |
| Recall@10 | Partial | Wrong if expected slugs are wrong |
| Zero-hit rate | Misleading | Measures ground truth quality, not search quality |
| p95 Latency | ✅ Valid | Independent of ground truth quality |

---

## Action Items

1. ✅ Document understanding (this document)
2. 🔲 Update M3 plan with new target (120 queries)
3. 🔲 Update GROUND-TRUTH-PROCESS.md with AI curation step
4. 🔲 Update EXPERIMENTAL-PROTOCOL.md with explicit measurement scope
5. 🔲 Execute Phase 1 pruning
6. 🔲 After Phase 1: Consider Phase 2 AI-driven system

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [M3 Plan](../../plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md) | Restructure specification |
| [GROUND-TRUTH-PROCESS.md](../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-PROCESS.md) | Creation process |
| [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Validation discipline |
| [ADR-098](../../../docs/architecture/architectural-decisions/098-ground-truth-registry.md) | Registry design |
