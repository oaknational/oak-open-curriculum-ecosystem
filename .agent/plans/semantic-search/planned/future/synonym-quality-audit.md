# Milestone 3: Search Quality Optimization

**Status**: 📋 Ready to start
**Priority**: HIGH
**Parent**: [roadmap.md](../../roadmap.md)
**Created**: 2025-12-27
**Updated**: 2026-01-02

---

## Overview

This milestone combines synonym audit, bulk download data analysis, and comprehensive benchmarking into a unified search quality optimization effort.

**Prerequisites**: ✅ All met
- Full curriculum indexed (16,414 documents) ✅
- DRY/SRP refactoring complete ✅
- Data completeness resolved ✅

---

## Phase 1: Comprehensive Ground Truths

### Current State

Ground truth covers **KS4 Maths only**:
- 40 standard queries (topic-based)
- 15 hard queries (6 categories)
- 18 diagnostic queries (9 synonym + 9 multi-concept)

**Total**: 73 queries for 1 subject, 1 key stage.

### Gap Analysis

| Dimension | Current | Required |
|-----------|---------|----------|
| Subjects | 1 (Maths) | 17 |
| Key Stages | 1 (KS4) | 4 |
| Document coverage | ~2K lessons | 12,833 lessons |

### Required Ground Truths

Create ground truth queries for:

| Subject Group | Subjects | Priority |
|---------------|----------|----------|
| Core | English, Maths, Science | HIGH |
| Humanities | History, Geography, RE | MEDIUM |
| Languages | French, Spanish, German | MEDIUM |
| Arts/Tech | Art, Music, Computing, D&T | LOWER |
| Other | PE, Citizenship, RSHE, Cooking | LOWER |

**Per-subject minimum**:
- 10 standard queries (topic-based)
- 5 hard queries (naturalistic, synonym, multi-concept)
- All slugs validated via API

### Query Categories (Preserve Existing)

| Category | Description | Priority |
|----------|-------------|----------|
| naturalistic | Teacher/student language | high |
| misspelling | Typos, mobile errors | critical |
| synonym | Alternative terminology | high |
| multi-concept | Topic intersections | medium |
| colloquial | Informal language | medium |
| intent-based | Pedagogical purpose | exploratory |

### User Story Groupings (NEW)

Group benchmarks by user intent:

| User Story | Example Queries |
|------------|-----------------|
| **Teacher planning** | "KS2 fractions introduction" |
| **Student revision** | "GCSE biology cell division" |
| **Curriculum navigation** | "what comes before quadratics" |
| **Resource discovery** | "worksheets for photosynthesis" |

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

| File | Count | Focus |
|------|-------|-------|
| `maths.ts` | ~140 | KS4 vocabulary |
| `science.ts` | ~20 | Biology, Chemistry, Physics |
| `english.ts` | ~10 | Grammar, literature |
| `education.ts` | ~25 | Pedagogical terms |
| Others | ~30 | Key stages, subjects, exam boards |

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

## Phase 4: Bulk Download Data Analysis

### Goal

Extract valuable metadata from bulk downloads to enrich search quality.

### Data Sources

From `BulkLesson` schema (30 files, ~47K lessons):

| Field | Count | Value |
|-------|-------|-------|
| `lessonKeywords` | 13,349 unique | Term definitions |
| `misconceptionsAndCommonMistakes` | 12,777 | Teacher guidance |
| `teacherTips` | Varies | Pedagogical advice |
| `transcript_sentences` | ~47K | Spoken language |

### Extraction Approach

**Preprocessing step** — Run before ingestion:

1. **Analyze bulk data** for vocabulary patterns
2. **Generate enrichment files** (static TypeScript)
3. **Consume at ingestion** as additional metadata

### NOT LLM-First

**Critical learning** (2025-12-26): Regex-based extraction produced 93% noise.

Approach:
1. Start with **structured data** (keywords, misconceptions)
2. Use **statistical analysis** for frequency/co-occurrence
3. Apply **LLM only** for complex patterns (transcript mining)

### Outputs

| Output | Purpose |
|--------|---------|
| High-frequency vocabulary list | Synonym candidate prioritisation |
| Subject-specific term maps | Subject-aware synonym scoping |
| Misconception clusters | Search guidance |
| Cross-subject terms | Universal synonym candidates |

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

| Task | Description | Status |
|------|-------------|--------|
| Create subject ground truths | 10+ queries per subject | 📋 |
| Validate all new slugs | API integration test | 📋 |
| Establish baselines | Per-subject, per-category | 📋 |
| Audit existing synonyms | Identify weak entries | 📋 |
| Analyze bulk vocabulary | High-frequency terms | 📋 |
| Add subject-specific synonyms | Based on analysis | 📋 |
| Measure and document | EXPERIMENT-LOG | 📋 |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [roadmap.md](../../roadmap.md) | Master roadmap |
| [search-acceptance-criteria.md](../../search-acceptance-criteria.md) | Tier definitions |
| [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md) | Experiment history |
| [ADR-084](../../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md) | Phrase boosting |
| [vocabulary-mining-bulk.md](../sdk-extraction/vocabulary-mining-bulk.md) | Vocab extraction |
