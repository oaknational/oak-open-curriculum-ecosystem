# Experimental Protocol for Search Quality Evaluation

**Last Updated**: 2026-01-03
**Status**: Active
**Purpose**: Canonical reference for how to design, execute, record, and learn from search experiments.

---

## Quick Reference

| Phase | Action | Documentation |
|-------|--------|---------------|
| **Design** | Form hypothesis, define success criteria | This document, Section 3 |
| **Execute** | Run experiment with proper controls | [search-experiment-guidance.md](./guidance/search-experiment-guidance.md) |
| **Record** | Document results using template | [template-for-search-experiments.md](./experiments/template-for-search-experiments.md) |
| **Log** | Add summary to experiment log | [EXPERIMENT-LOG.md](./EXPERIMENT-LOG.md) |
| **Update** | Update current-state.md if metrics change | [current-state.md](../plans/semantic-search/current-state.md) |
| **Codify** | Extract lasting value to ADRs/guides | [ADR README](../../docs/architecture/architectural-decisions/README.md) |

---

## 1. Why We Have This Protocol

### The Problem We're Solving

Search quality is multi-dimensional. A change that helps one user type may harm another. Without disciplined experimentation:

- We can't know if changes actually improved things
- We may discard working approaches based on bad data
- We may implement harmful changes based on misleading metrics

**Historical example**: The semantic reranking experiment (E-001) was rejected based on invalid ground truth. The decision may have been wrong. See [ground-truth-corrections.md](./ground-truth-corrections.md).

### What Impact We Care About

| Impact | Who Benefits | Proxy Metric |
|--------|--------------|--------------|
| Teachers find relevant lessons quickly | Teachers | MRR, latency |
| AI agents get accurate curriculum data | AI agents | Precision, recall |
| Search handles informal language | All users | Colloquial MRR |
| Search handles misspellings gracefully | All users | Misspelling MRR |
| Search understands curriculum vocabulary | Curriculum experts | Synonym MRR |

---

## 2. Core Principles

### 2.1 Fundamentals First

Before adding AI/complexity, exhaust traditional techniques. See [ADR-082: Fundamentals-First Search Strategy](../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md).

```text
Tier 1: Search Fundamentals    → Synonyms, phrases, noise filtering
Tier 2: Document Relationships → Unit→Lesson cross-reference
Tier 3: Modern ES Features     → RRF tuning, Linear Retriever
Tier 4: AI Enhancement         → Reranking, query expansion, RAG
```

### 2.2 Ground Truth Is Sacred

All experiments MUST use validated ground truth. See [ADR-085: Ground Truth Validation Discipline](../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md).

**Before any experiment**:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm tsx evaluation/validation/validate-ground-truth.ts
```

### 2.3 Measure Per-Category, Not Just Aggregate

Aggregate MRR hides important variation. Always report per-category metrics.

| ❌ Bad | ✅ Good |
|--------|---------|
| "MRR improved 5%" | "Naturalistic MRR +15%, Misspelling -2%" |

### 2.4 No Regressions

A change that improves hard queries but regresses standard queries is usually **rejected**. Protect the baseline.

---

## 3. Experiment Design

### 3.1 The First Question

Before any experiment, ask:

1. **What specific problem am I trying to solve?**
2. **Who is affected and how?**
3. **What metric will tell me if it worked?**
4. **How will I know if I've made things worse?**

### 3.2 Hypothesis Formation

A good hypothesis is:

- **Specific**: "Adding synonym X will improve query Y"
- **Falsifiable**: Can be proven wrong
- **Measurable**: Tied to a metric with a threshold

**Template**:

> "Adding [CHANGE] will improve [CATEGORY] MRR by ≥[THRESHOLD]% because [REASONING]."

**Example**:

> "Adding synonym 'solving for x' → 'linear equations' will improve synonym MRR by ≥10% because this phrase appears in 12% of naturalistic teacher queries."

### 3.3 Success Criteria

Define before running:

| Criterion | Threshold | Rationale |
|-----------|-----------|-----------|
| Target category MRR | ≥+X% | Primary improvement target |
| Standard query MRR | ≥0.92 (no regression) | Protect baseline |
| p95 Latency | ≤Xms | User experience constraint |

### 3.4 Control vs Variant

- **Control**: Current production configuration
- **Variant**: Exactly one change from control

**Never change multiple things at once.** If you need to test A and B, run two experiments: (Control vs A) then (A vs A+B).

---

## 4. Experiment Execution

### 4.1 Tools

| Tool | Best For | When to Use |
|------|----------|-------------|
| Kibana Playground | Quick iteration | Exploring hypotheses |
| Analysis scripts | Automated measurement | Baseline establishment |
| Smoke tests | Reproducible validation | Confirming winners |
| Experiments framework | Formal A/B | Architectural decisions |

### 4.2 Analysis Scripts

```bash
cd apps/oak-open-curriculum-semantic-search

# Cross-curriculum analysis (any subject)
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject maths --keyStage ks4
pnpm tsx evaluation/analysis/analyze-cross-curriculum.ts --subject french --keyStage ks3

# Legacy KS4 Maths analysis
pnpm eval:per-category    # Per-category MRR breakdown
pnpm eval:diagnostic      # Detailed pattern analysis
```

### 4.3 Experiment Workflow

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Hypothesis │────►│  Playground │────►│   Winner?   │
└─────────────┘     │  (iterate)  │     └──────┬──────┘
                    └─────────────┘            │
                                               ▼
                    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                    │   Codify    │◄────│  Document   │◄────│ Smoke Tests │
                    │  Learnings  │     │  (exp file) │     │ (validate)  │
                    └─────────────┘     └─────────────┘     └─────────────┘
```

---

## 5. Recording Results

### 5.1 Create Experiment File

Use the template: [template-for-search-experiments.md](./experiments/template-for-search-experiments.md)

File naming: `[topic].experiment.md` in `.agent/evaluations/experiments/`

### 5.2 Required Sections

1. **Abstract**: 2-3 sentences with decision
2. **Hypothesis**: What we expected
3. **Methodology**: Control, variant, test dataset
4. **Results**: Summary + per-category breakdown
5. **Discussion**: Interpretation, limitations
6. **Conclusion**: Accept/Reject with rationale

### 5.3 Log in EXPERIMENT-LOG.md

Add a summary entry to [EXPERIMENT-LOG.md](./EXPERIMENT-LOG.md):

```markdown
### [DATE] [EXPERIMENT-ID]: [Name]

**Result**: [ACCEPT/REJECT]
**Impact**: [Key metric change]
**Rationale**: [One sentence]

| Category | Before | After | Delta |
|----------|--------|-------|-------|
| ... | ... | ... | ... |
```

### 5.4 Update Current State

If metrics changed, update [current-state.md](../plans/semantic-search/current-state.md):

- Update MRR tables
- Update "Last Measured" dates
- Note the experiment that caused the change

---

## 6. Metrics Reference

### 6.1 Primary Metrics

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| **MRR** | 1/N × Σ(1/rank_i) | Average of 1/position of first relevant result |
| **NDCG@10** | Normalised DCG | Quality of ranking with graded relevance |
| **Zero-Hit Rate** | count(no_results) / total | Queries returning nothing |
| **p95 Latency** | 95th percentile | Tail latency |

### 6.2 MRR Interpretation Scale

```text
1.00  Perfect     — First result always correct
0.80  Excellent   — Usually in top 1-2
0.50  Good        — Usually in top 2-3 ← TARGET
0.40  Acceptable  — Top 3-4
0.25  Poor        — Scrolling required
<0.20 Very Poor   — "I can't find it"
```

### 6.3 Query Categories

| Category | Challenge | Example |
|----------|-----------|---------|
| Naturalistic | Pedagogical intent, informal | "teach my students about solving for x" |
| Misspelling | Typos | "fotosinthesis" |
| Synonym | Vocabulary gaps | "solving for x" instead of "linear equations" |
| Multi-concept | Cross-topic | "combining algebra with graphs" |
| Colloquial | Informal language | "the water cycle thing" |
| Intent-based | Pure intent, no topic | "challenging extension work" |

### 6.4 Per-Category Thresholds

See [search-acceptance-criteria.md](../plans/semantic-search/search-acceptance-criteria.md) for detailed thresholds.

| Category | Minimum MRR | Target MRR |
|----------|-------------|------------|
| Naturalistic | 0.45 | 0.60 |
| Misspelling | 0.45 | 0.70 |
| Synonym | 0.45 | 0.60 |
| Multi-concept | 0.40 | 0.55 |
| Colloquial | 0.40 | 0.55 |
| Intent-based | 0.30 | 0.45 |

---

## 7. Decision Rules

### 7.1 Accept If ALL True

- ✅ Target metric improved by threshold amount
- ✅ Standard query MRR stayed ≥0.92 (no regression)
- ✅ p95 latency stayed within budget

### 7.2 Reject If ANY True

- ❌ Standard query MRR dropped >2%
- ❌ Latency exceeded budget with no path to fix
- ❌ Improvement was <5% (noise, not signal)

### 7.3 Decision Matrix by Change Type

| Change | Required Improvement | Latency Budget | Reject If |
|--------|---------------------|----------------|-----------|
| Synonym addition | Any improvement | +0ms | Any regression |
| Field boosting | Any improvement | +0ms | Any regression |
| Reranking | Target MRR +15% | +500ms | p95 >2000ms |
| Query expansion | Target category +20% | +200ms | p95 >1500ms |
| Fusion weights | Overall MRR +5% | +0ms | Any regression |

---

## 8. Codifying Learnings

### 8.1 What Goes Where

| Content Type | Location | Example |
|--------------|----------|---------|
| What we decided TO DO | ADRs, operational guides | "Always run es:setup before ingest" |
| What we decided NOT TO DO | EXPERIMENT-LOG.md | "Generic rerankers don't work" |
| Why we decided | Experiment file | Full analysis and reasoning |
| Current best practice | NEW-SUBJECT-GUIDE.md | Step-by-step workflow |
| Current metrics | current-state.md | MRR tables |

### 8.2 Codification Checklist

After each experiment:

- [ ] Added entry to [EXPERIMENT-LOG.md](./EXPERIMENT-LOG.md)
- [ ] Updated [current-state.md](../plans/semantic-search/current-state.md) if metrics changed
- [ ] Created/updated ADR if architectural decision was made
- [ ] Updated operational guides if best practices emerged
- [ ] Updated [search-acceptance-criteria.md](../plans/semantic-search/search-acceptance-criteria.md) if thresholds changed

---

## 9. Known Limitations & Future Work

### 9.1 ELSER Multilingual Limitation

**CRITICAL**: ELSER is an English-language model. It cannot effectively process non-English content.

**Impact on MFL subjects** (French, Spanish, German):

| Subject | Baseline MRR | Root Cause |
|---------|--------------|------------|
| French | 0.194 | ELSER cannot semantically match French content |
| Spanish | 0.194 | ELSER cannot semantically match Spanish content |
| German | 0.200 | ELSER cannot semantically match German content |

**Potential solutions** (Tier 4/5 work):

1. Multilingual E5 embeddings for MFL content (requires dense vectors)
2. Query-time translation
3. MFL-specific BM25 boosting (bypass ELSER)
4. Multilingual ELSER when/if Elastic releases one

**See**: [ADR-076: ELSER-Only Embedding Strategy](../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) — explicitly notes "No cross-lingual support: English-only"

### 9.2 Intent-Based Query Gap

Intent-based queries (e.g., "challenging extension work") require metadata we don't have:

- Lesson type classification (intro/consolidation/extension)
- Teaching approach metadata (visual/practical/discussion-based)

**Current MRR**: 0.229 (exception granted)

**Path forward**: Requires upstream metadata enrichment or LLM classification.

---

## 10. Document Cross-References

### Governing ADRs

- [ADR-081: Search Approach Evaluation Framework](../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) — Metrics and harness architecture
- [ADR-082: Fundamentals-First Search Strategy](../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) — Tier prioritisation
- [ADR-085: Ground Truth Validation Discipline](../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) — Data integrity

### Operational Guides

- [search-experiment-guidance.md](./guidance/search-experiment-guidance.md) — Practical how-to
- [template-for-search-experiments.md](./experiments/template-for-search-experiments.md) — Experiment file template
- [NEW-SUBJECT-GUIDE.md](../../apps/oak-open-curriculum-semantic-search/docs/NEW-SUBJECT-GUIDE.md) — Adding new subjects

### Current State & Plans

- [current-state.md](../plans/semantic-search/current-state.md) — Authoritative metrics
- [search-acceptance-criteria.md](../plans/semantic-search/search-acceptance-criteria.md) — Targets and thresholds
- [roadmap.md](../plans/semantic-search/roadmap.md) — Strategic plan
- [EXPERIMENT-PRIORITIES.md](./experiments/EXPERIMENT-PRIORITIES.md) — What to try next

### Analysis Tools

- [evaluation/analysis/README.md](../../apps/oak-open-curriculum-semantic-search/evaluation/analysis/README.md) — Script documentation
- [evaluation/README.md](../../apps/oak-open-curriculum-semantic-search/evaluation/README.md) — Framework overview

---

## Change Log

| Date | Change |
|------|--------|
| 2026-01-03 | Created — consolidates experimental protocol from scattered docs |

