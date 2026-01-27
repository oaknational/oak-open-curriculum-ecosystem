# Search Acceptance Criteria

**Last Updated**: 2026-01-26  
**Status**: 🔄 Ground Truth Strategy Revision  
**Purpose**: Defines what "exhausted" means for each level, success criteria for ground truths

---

## Ground Truth Purpose

> "In a full range of likely search scenarios for professional teachers, and a handful of failure modes, is our system providing the value to the user that they need and we intend?"

Ground truths answer this question. They are NOT tests of Elasticsearch — they test OUR value proposition.

---

## Ground Truth Categories

### Valid Categories

| Category | Purpose | Count |
|----------|---------|-------|
| `natural-query` | How teachers actually search | **Bulk** |
| `exact-term` | BM25 returns exact curriculum terms | **Few** |
| `typo-recovery` | Fuzzy matching recovers from typos | **Handful** |
| `curriculum-connection` | Genuine topic pairings (verified in data) | **Few if any** |
| `future-intent` | Features not yet built (excluded from stats) | **2-3** |

### Eliminated Categories

| Category | Why Eliminated |
|----------|----------------|
| `morphological-variation` | ES stemming handles it |
| `ambiguous-term` | Subject/phase filtering handles it |
| `difficulty-mismatch` | We enable teachers, not police them |
| `metadata-only` | Metadata IS the default, not special |

### Legacy Categories (Deprecated)

The following were used in the original GT structure and are no longer valid:

- `precise-topic` → replaced by `exact-term`
- `natural-expression` → replaced by `natural-query` (with stricter phrasing requirements)
- `imprecise-input` → replaced by `typo-recovery` (reduced count)
- `cross-topic` → replaced by `curriculum-connection` (only verified pairings)

---

## Query Design Requirements

### Natural-Query (Primary Category)

**Natural phrasing** — how a teacher would actually type it.

| Good | Bad |
|------|-----|
| "how bones and muscles move the body" | "bones muscles body movement" (clipped list) |
| "adding fractions with different denominators" | "fractions denominators adding" (clipped list) |
| "what affects reaction rate" | "French negation" (redundant subject) |

### Design Rules

| Rule | Requirement |
|------|-------------|
| Length | 3-7 words |
| Natural phrasing | NOT clipped term lists |
| No redundant subject | Don't say "French" when filtered to French |
| No meta-phrases | "lessons on", "teaching about" |
| No advice-seeking | "how to teach" |
| Verified in data | Every query grounded in bulk data |

---

## Search Quality Levels

Levels (from [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)) are sequential improvement stages:

| Level | Focus | Status |
|-------|-------|--------|
| **1** | Fundamentals (synonyms, phrase boosting) | ✅ Approaches complete |
| **2** | Document relationships | 📋 Pending |
| **3** | Modern ES features (semantic reranking, query rules) | 📋 Pending |
| **4** | AI enhancement (LLM preprocessing) | 📋 Pending — DESTINATION |

**Levels are sequential.** Exhaust lower levels before moving up.

**A level is "exhausted" when**: All approaches attempted, measured with **validated ground truths**, plateau demonstrated (≤5% improvement × 3 experiments).

---

## Metrics We Track

| Metric | Purpose | Primary Use |
|--------|---------|-------------|
| **MRR** | Finding first relevant result quickly | Main acceptance metric |
| **NDCG@10** | Overall ranking quality | Secondary quality metric |
| **Precision@10** | Proportion of relevant in top 10 | Noise detection |
| **Recall@10** | Proportion of relevant found | Completeness detection |
| **Zero-Hit Rate** | Queries returning nothing | Coverage gaps |
| **p95 Latency** | User experience | Performance budget |

> **Full definitions**: See [IR-METRICS.md](../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md)

---

## Per-Category Thresholds

| Threshold | MRR Value | Meaning |
|-----------|-----------|---------|
| **Critical** | < 0.25 | Blocks completion; requires investigation |
| **Investigation Required** | < 0.40 | Must analyse root cause |
| **Acceptable** | ≥ 0.40 | Good enough to proceed |
| **Good** | ≥ 0.60 | Solid performance |
| **Excellent** | ≥ 0.80 | Outstanding |

---

## Content-Weighted Distribution

Ground truth coverage should reflect teaching priority and content volume:

| Priority | Subjects | Coverage |
|----------|----------|----------|
| **Highest** | maths | Considerably more than any other |
| **High** | english, science | Significant coverage |
| **Medium** | PE, geography, history, MFL, RE, computing, citizenship | Moderate coverage |
| **Low** | art, music, DT, cooking | Minimal coverage |

### Total Target

~80-100 focused queries that answer the core question.

---

## Level 1: Search Fundamentals

### Exit Criteria

| Criterion | Target | Status |
|-----------|--------|--------|
| Standard approaches attempted | All checked | ✅ Complete |
| Ground truths validated | Revised strategy | 🔄 In Progress |
| Plateau demonstrated | ≤5% improvement × 3 | ⏸️ Blocked by GT |

### Standard Approaches Checklist

All items completed:

- [x] Single-word synonyms
- [x] Phrase synonyms
- [x] UK/US spelling variants
- [x] Abbreviation expansion
- [x] Technical vocabulary synonyms
- [x] Noise phrase filtering
- [x] Phrase query boosting
- [x] Stop word handling review
- [x] Bulk download data mined
- [x] Subject-specific vocabulary gaps identified

---

## Level 2: Document Relationships

### Exit Criteria

| Criterion | Target | Status |
|-----------|--------|--------|
| Level 1 exhausted | Complete | 🔓 Ready |

### Approaches Checklist

- [ ] Cross-reference boosting between lessons and units
- [ ] Prerequisite/successor relationship scoring
- [ ] Thread context integration
- [ ] Sequence context integration

---

## Level 3: Modern ES Features

**Priority**: 🔴 HIGHEST (research's top recommendations)  
**Plan**: [post-sdk/search-quality/modern-es-features.md](post-sdk/search-quality/modern-es-features.md)

### Approaches Checklist

- [ ] **Semantic reranking** (`text_similarity_reranker`)
- [ ] **Query rules** (rule retriever for deterministic intent)
- [ ] **Definition retrieval**
- [ ] **Negative controls** (subject/phase mismatch penalties)
- [ ] RRF k-parameter tuning
- [ ] Per-field boost weight optimisation

---

## Level 4: AI Enhancement — DESTINATION

**Priority**: Part of the journey (NOT optional)  
**Plan**: [post-sdk/search-quality/ai-enhancement.md](post-sdk/search-quality/ai-enhancement.md)

**Level 4 is the destination, not a "nice to have".** Some query types cannot be solved without AI.

### Approaches Checklist

- [ ] LLM query preprocessing (intent extraction, filter inference)
- [ ] Colloquial → curriculum term resolution
- [ ] Pedagogical intent classification
- [ ] Query reformulation for progression queries

---

## Verification Method

```bash
cd apps/oak-open-curriculum-semantic-search

pnpm benchmark --all                    # All subjects, all phases
pnpm benchmark --subject maths          # One subject
pnpm benchmark --phase secondary        # One phase
pnpm benchmark -s maths -p primary --review  # Per-query review
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ground-truth-redesign-plan.md](active/ground-truth-redesign-plan.md) | Current GT strategy |
| [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Metrics and decision criteria |
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Level system rationale |
| [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Data integrity |
| [current-state.md](current-state.md) | Current metrics |
