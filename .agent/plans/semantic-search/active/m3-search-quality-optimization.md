# Milestone 3: Search Quality Optimization

**Status**: 📋 Ready to start
**Priority**: HIGH — Foundation for all future search work
**Parent**: [../roadmap.md](../roadmap.md)
**Created**: 2025-12-27
**Updated**: 2026-01-03

---

## Overview

This milestone establishes comprehensive search quality measurement and optimization across the full curriculum, not just KS4 Maths.

**Prerequisites**: ✅ All met

- Full curriculum indexed (16,414 documents) ✅
- DRY/SRP refactoring complete ✅
- Data completeness resolved ✅

**Exit Criteria**: Search quality validated across full curriculum with measurable MRR by subject and category.

---

## Phase 1: Comprehensive Ground Truths

### Current State

Ground truth covers **KS4 Maths only**:

- 40 standard queries (topic-based)
- 15 hard queries (6 categories)
- 18 diagnostic queries (9 synonym + 9 multi-concept)

**Total**: 73 queries for 1 subject, 1 key stage.

### Gap Analysis

| Dimension         | Current       | Required      |
| ----------------- | ------------- | ------------- |
| Subjects          | 1 (Maths)     | 17            |
| Key Stages        | 1 (KS4)       | 4             |
| Document coverage | ~2K lessons   | 12,833 lessons |

### Required Ground Truths

Create ground truth queries for:

| Subject Group | Subjects                            | Priority |
| ------------- | ----------------------------------- | -------- |
| Core          | English, Maths, Science             | HIGH     |
| Humanities    | History, Geography, RE              | MEDIUM   |
| Languages     | French, Spanish, German             | MEDIUM   |
| Arts/Tech     | Art, Music, Computing, D&T          | LOWER    |
| Other         | PE, Citizenship, RSHE, Cooking      | LOWER    |

**Per-subject minimum**:

- 10 standard queries (topic-based)
- 5 hard queries (naturalistic, synonym, multi-concept)
- All slugs validated via API

### Query Categories (Preserve Existing)

| Category     | Description             | Priority    |
| ------------ | ----------------------- | ----------- |
| naturalistic | Teacher/student language | high        |
| misspelling  | Typos, mobile errors    | critical    |
| synonym      | Alternative terminology | high        |
| multi-concept| Topic intersections     | medium      |
| colloquial   | Informal language       | medium      |
| intent-based | Pedagogical purpose     | exploratory |

### User Story Groupings

Group benchmarks by user intent:

| User Story               | Example Queries                     |
| ------------------------ | ----------------------------------- |
| **Teacher planning**     | "KS2 fractions introduction"        |
| **Student revision**     | "GCSE biology cell division"        |
| **Curriculum navigation**| "what comes before quadratics"      |
| **Resource discovery**   | "worksheets for photosynthesis"     |

---

## Phase 2: Baseline Benchmarks

### Before ANY Changes

Establish comprehensive baselines:

```bash
cd apps/oak-open-curriculum-semantic-search

# Current benchmarks (KS4 Maths only)
pnpm eval:per-category
pnpm eval:diagnostic

# Full metrics (lessons + units)
pnpm tsx evaluation/analysis/full-metrics-breakdown.ts
```

### Document Results

Record in [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md):

- Per-category MRR
- Per-subject MRR (once ground truths exist)
- Per-user-story MRR

---

## Phase 3: Synonym Audit

### Goal

Remove low-value noise, add high-impact synonyms based on **measured impact**, not arbitrary counts.

### Current Synonyms

163 curated synonyms across 13 files:

| File           | Count | Focus                          |
| -------------- | ----- | ------------------------------ |
| `maths.ts`     | ~140  | KS4 vocabulary                 |
| `science.ts`   | ~20   | Biology, Chemistry, Physics    |
| `english.ts`   | ~10   | Grammar, literature            |
| `education.ts` | ~25   | Pedagogical terms              |
| Others         | ~30   | Key stages, subjects, exam boards |

### Two Vocabulary Mechanisms

**1. ES Synonym Expansion** (single-word tokens):

```text
Query: "trig" → Tokenized → Synonym filter → ["trig", "trigonometry"]
```

**2. Phrase Detection + Boosting** (multi-word terms):

```text
Query: "straight line graphs" → Phrase detection → Match_phrase boost
```

See [ADR-084: Phrase Query Boosting](../../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md).

### Audit Process

1. **Identify weak synonyms** — High frequency but low precision (e.g., "difference" for subtraction)
2. **Identify missing synonyms** — High-frequency terms without coverage
3. **Subject-specific gaps** — Synonyms for non-Maths subjects
4. **Measure impact** — Before/after MRR for each change

### Decision Process

For each candidate synonym:

1. Is it a **true synonym** (same meaning, not just related)?
2. Would users **actually search** with this term?
3. Does it **harm precision** (match irrelevant results)?
4. Is it **subject-scoped** correctly?

---

## Phase 4: ES Tuning Evaluation

### Context: Phase 3e Results

Previous ES-native enhancements achieved +29% on hard queries:

| Configuration                | Hard MRR  | Hard NDCG | Std MRR | Std NDCG |
| ---------------------------- | --------- | --------- | ------- | -------- |
| Baseline (before 3e)         | 0.250     | 0.212     | 0.931   | 0.749    |
| After 3e.1+3e.2+3e.6         | **0.323** | 0.240     | 0.938   | 0.746    |

### Implemented (Phase A — No Reindex)

| Task | Description                                              | Status      |
| ---- | -------------------------------------------------------- | ----------- |
| 3e.1 | Enhanced fuzzy (`AUTO:3,6`, `prefix_length: 1`)          | ✅ Complete |
| 3e.2 | Phrase prefix boost (secondary match at 0.5 boost)       | ✅ Complete |
| 3e.6 | `minimum_should_match: '75%'`                            | ✅ Complete |

### Reverted (Phase B — Caused Regression)

| Task | Description              | Status                            |
| ---- | ------------------------ | --------------------------------- |
| 3e.3 | Stemming + stop words    | ❌ Reverted — caused -6.8% regression |

### Deferred (Evaluate After Ground Truth Expansion)

| Task | Description                   | Status      |
| ---- | ----------------------------- | ----------- |
| 3e.4 | Phonetic matching (`double_metaphone`) | 📋 Deferred |
| 3e.5 | `search_as_you_type` fields   | 📋 Deferred |

### Key Learnings

1. **Query-time enhancements are low-risk** — No reindex required, easy to A/B test
2. **Stemming can harm naturalistic queries** — Stop word removal removes important context
3. **BM25 zero-hit rate is a canary** — >30% indicates over-aggressive filtering
4. **Measure every change** — Without ablation, we wouldn't know 3e.3 regressed

### Files Modified

| File                                      | Purpose                    |
| ----------------------------------------- | -------------------------- |
| `src/lib/hybrid-search/rrf-query-helpers.ts` | BM25 retriever configuration |

---

## Phase 5: Measure and Iterate

### Experiment Protocol

For **every change**:

1. **Design** — Document hypothesis in experiment file
2. **Baseline** — Run benchmarks, record in EXPERIMENT-LOG
3. **Implement** — Make the change
4. **Measure** — Run benchmarks again
5. **Analyse** — Compare per-category, per-subject, per-user-story
6. **Decide** — Accept if improvement, reject if regression

### Success Criteria

**NOT arbitrary numbers**. Success is:

- Measurable MRR improvement
- No category regression
- Coverage across subjects (not just Maths)

---

## Implementation Tasks

| Task                         | Description                | Status |
| ---------------------------- | -------------------------- | ------ |
| Create subject ground truths | 10+ queries per subject    | 📋     |
| Validate all new slugs       | API integration test       | 📋     |
| Establish baselines          | Per-subject, per-category  | 📋     |
| Audit existing synonyms      | Identify weak entries      | 📋     |
| Evaluate deferred ES tasks   | 3e.4, 3e.5 with full GT    | 📋     |
| Add subject-specific synonyms| Based on analysis          | 📋     |
| Measure and document         | EXPERIMENT-LOG             | 📋     |

---

## Next Step After M3

Once M3 is complete, proceed to [Bulk Data Analysis](../pre-sdk-extraction/bulk-data-analysis.md) which mines the curriculum data to address remaining quality gaps.

---

## Related Documents

### Technical Documentation

| Document                                                                                          | Purpose                |
| ------------------------------------------------------------------------------------------------- | ---------------------- |
| [IR-METRICS.md](../../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md)          | MRR, NDCG@10 definitions |
| [QUERYING.md](../../../../apps/oak-open-curriculum-semantic-search/docs/QUERYING.md)              | Hybrid search query details |
| [SYNONYMS.md](../../../../apps/oak-open-curriculum-semantic-search/docs/SYNONYMS.md)              | Synonym expansion strategy |
| [DIAGNOSTIC-QUERIES.md](../../../../apps/oak-open-curriculum-semantic-search/docs/DIAGNOSTIC-QUERIES.md) | Diagnostic query categories |

### Planning Documents

| Document                                                                                      | Purpose              |
| --------------------------------------------------------------------------------------------- | -------------------- |
| [../roadmap.md](../roadmap.md)                                                                | Master roadmap       |
| [../search-acceptance-criteria.md](../search-acceptance-criteria.md)                          | Tier definitions     |
| [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md)                                   | Experiment history   |

### ADRs

| Document                                                                                      | Purpose              |
| --------------------------------------------------------------------------------------------- | -------------------- |
| [ADR-082](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first strategy |
| [ADR-084](../../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md) | Phrase boosting      |

### Archive

| Document                                                                                      | Purpose              |
| --------------------------------------------------------------------------------------------- | -------------------- |
| [four-retriever-implementation.md](../archive/completed/four-retriever-implementation.md)     | Phase 3.0-3d archive |

---

## Foundation Documents

Before starting work, re-read:

1. [rules.md](../../../directives-and-memory/rules.md) — TDD, quality gates, no type shortcuts
2. [testing-strategy.md](../../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

