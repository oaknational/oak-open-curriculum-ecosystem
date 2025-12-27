# Part 1: Search Excellence — Master Plan

**Status**: 🔄 IN PROGRESS — Tier 1 EXHAUSTED, 02b Thread+Prereq done, Tier 2 ready  
**Priority**: High  
**Created**: 2025-12-19  
**Last Updated**: 2025-12-26  
**Strategy**: [ADR-082: Fundamentals-First Search Strategy](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)

---

## 🎯 Executive Summary

**What we thought**: "Get MRR to 0.45, done."

**What we learned**: Search excellence requires exhausting ALL fundamental improvements before declaring any tier complete. Meeting a target is the _beginning_ of validation, not the end.

**Current State**: MRR 0.614 exceeds the Tier 1 target (0.45). **Tier 1 is EXHAUSTED** (2025-12-24) — all standard approaches verified. Intent-based category (0.229) has documented exception (requires Tier 4). Tier 2 is ready when prioritised.

---

## Sub-Plans

This master plan coordinates workstreams for search excellence. The principle is: **Index EVERYTHING** — Elasticsearch is not just search, it's a view onto the data.

| Sub-Plan                                                           | Focus                                | Priority | Status         |
| ------------------------------------------------------------------ | ------------------------------------ | -------- | -------------- |
| [01-tier-1-fundamentals.md](01-tier-1-fundamentals.md)             | Exhaust all Tier 1 improvements      | High     | ✅ Complete    |
| [02a-synonym-architecture.md](02a-synonym-architecture.md)         | Fix synonym circular dependency      | Medium   | ✅ Complete    |
| [02b-vocabulary-mining.md](02b-vocabulary-mining.md)               | **Comprehensive vocabulary mining**  | **HIGH** | 🔄 Thread + Prereq done |
| [03-evaluation-infrastructure.md](03-evaluation-infrastructure.md) | Fix evaluation directory duplication | Medium   | 📋 Pending     |
| [04-documentation-debt.md](04-documentation-debt.md)               | Update outdated documentation        | Low      | ✅ Complete    |
| [05-complete-data-indexing.md](05-complete-data-indexing.md)       | Index ALL curriculum data            | High     | 📋 Pending     |
| [06-reference-indices.md](06-reference-indices.md)                 | Reference data (subjects, key stages)| Medium   | 📋 Pending     |
| [07-resource-types.md](07-resource-types.md)                       | Worksheets, quizzes, sequences       | Medium   | 📋 Pending     |
| [08-mcp-graph-tools.md](08-mcp-graph-tools.md)                     | MCP tools for graph data             | Medium   | ✅ Partial     |
| [09-knowledge-graph-evolution.md](09-knowledge-graph-evolution.md) | Property graph → True knowledge graph| Medium   | 📋 Planned     |
| [10-transcript-mining.md](10-transcript-mining.md)                 | Mine transcripts for spoken synonyms | Medium   | 📋 Planned     |
| [11-synonym-quality-audit.md](11-synonym-quality-audit.md)         | Audit existing synonyms + weighting  | High     | 📋 Planned     |

### Principle: Index EVERYTHING

Elasticsearch is most powerful when ALL data is available. Fields like `supervision_level`, `downloads_available`, and `canonical_url` may not contribute to semantic search, but they are vital metadata for filtering, display, and analysis. The index should be a complete view of the curriculum.

> **Scope Clarification**: "Bulk data extraction" ALWAYS means **ALL 30 bulk files** — all subjects, all key stages, all available data. When examples reference specific subjects (e.g., "maths-secondary"), this is for illustration only; the actual extraction covers the complete curriculum.

**Recent additions** (2025-12-24):
- `supervision_level` - Added to lessons index
- `downloads_available` - Added to lessons index

---

## Definition of Done

Part 1 is complete when:

1. **Tier 1 EXHAUSTED** — All fundamental improvements explored, not just target met
2. **Synonym architecture clarified** — Clear source of truth, bulk download mined
3. **Evaluation infrastructure unified** — No duplicate directories
4. **Documentation current** — All stale references updated
5. **Search SDK extracted** — Ready for MCP consumption (Stream F)

---

## Current Metrics (Verified 2025-12-24)

| Metric          | Value     | Target | Status                            |
| --------------- | --------- | ------ | --------------------------------- |
| Lesson Hard MRR | **0.614** | ≥0.45  | ✅ Tier 1 EXHAUSTED (2025-12-24) |
| Lesson Std MRR  | 0.963     | ≥0.92  | ✅ Met                            |
| Unit Hard MRR   | 0.806     | ≥0.50  | ✅ Met                            |
| Unit Std MRR    | 0.988     | ≥0.92  | ✅ Met                            |

### Per-Category Breakdown (Lesson Hard)

| Category         | MRR       | Status       | Action              |
| ---------------- | --------- | ------------ | ------------------- |
| misspelling      | 0.833     | ✅ Excellent | —                   |
| naturalistic     | 0.722     | ✅ Good      | —                   |
| multi-concept    | 0.625     | ✅ Good      | —                   |
| synonym          | 0.611     | ✅ Good      | —                   |
| colloquial       | 0.500     | ✅ Good      | —                   |
| **intent-based** | **0.229** | ⚠️ Exception | Tier 4 problem      |

---

## Tier 1 Exhaustion Status

**All standard approaches verified** (2025-12-24). See [Search Acceptance Criteria](../search-acceptance-criteria.md) for full details.

| Approach | Status | Verification |
|----------|--------|-------------|
| Synonym patterns | ✅ Complete | Single-word, phrase, UK/US, abbreviations, technical |
| Vocabulary gaps | ✅ Complete | Top 20 keywords analysed, no critical gaps |
| Intent-based queries | ⚠️ Exception | Documented; requires Tier 4 |
| MRR plateau | ✅ De facto | No more Tier 1 experiments possible |
| Category analysis | ✅ Complete | All ≥0.40 except intent-based (exception) |

**Tier 2 is now READY** when prioritised.

### Per-Category Thresholds

| Threshold | MRR Value | Meaning |
|-----------|-----------|---------|
| Critical | < 0.25 | Blocks tier completion |
| Investigation Required | < 0.40 | Must analyse root cause |
| Acceptable | ≥ 0.40 | Good enough to proceed |

**Intent-based exception**: 0.229 MRR — documented exception granted (requires Tier 4, not Tier 1).

---

## Resolved Issues

### ✅ Synonym Type-Gen Circular Dependency (RESOLVED 2025-12-24)

**Problem**: Type-gen code imported from SDK runtime code via `generate-synonyms-file.ts`.

**Resolution**: The file was **dead code** — never called from the type-gen pipeline. Deleted the file and documented the current (working) synonym architecture.

**See**: [02a-synonym-architecture.md](02a-synonym-architecture.md) (COMPLETE)

---

## 🌟 Vocabulary Mining Opportunity

Oak has **the most comprehensive structured vocabulary dataset for UK education**:

| Source | Count | Has Definition? |
|--------|-------|-----------------|
| Keywords | 13,349 unique | ✅ Yes |
| Misconceptions | 12,777 | ✅ Yes |
| Key Learning Points | 51,894 | ✅ Yes |
| Teacher Tips | 12,774 | ✅ Yes |

This is a **sector-transformative opportunity**. See [02b-vocabulary-mining.md](02b-vocabulary-mining.md) for the comprehensive plan to build:

- **Curriculum Glossary Index** — Searchable 13K+ terms with definitions
- **Enhanced Synonym Expansion** — 10x current coverage
- **Misconception Index** — Search by common mistakes
- **NC Coverage Map** — Which lessons cover which statements
- **Prerequisite Graph** — "What comes before this?"

---

## Quick Navigation

### Acceptance Criteria

- **[Search Acceptance Criteria](../search-acceptance-criteria.md)** — **Defines "Target Met" vs "Exhausted"**

### Current State & Metrics

- [current-state.md](../current-state.md) — Verified metrics
- [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) — Experiment history

### Foundation Documents (MANDATORY)

- [rules.md](../../directives-and-memory/rules.md) — TDD, quality gates
- [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — Test types
- [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator-first

### Key ADRs

- [ADR-082](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) — Fundamentals-first strategy
- [ADR-085](../../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) — Ground truth validation
- [ADR-063](../../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) — Synonym management

---

---

## 🆕 New Plans (2025-12-27)

Three new sub-plans emerged from vocabulary mining reflection:

### [09-knowledge-graph-evolution.md](09-knowledge-graph-evolution.md)

**Problem**: What we call a "knowledge graph" is actually a **property graph** (schema-only, no instances).

**Solution**: Connect bulk-mined instance data (13K keywords, 12K misconceptions) to the property graph schema to create a true knowledge graph.

**Impact**: Enables graph-based queries like "what keywords does this lesson teach?" and "which lessons address this misconception?"

### [10-transcript-mining.md](10-transcript-mining.md)

**Problem**: Lesson transcripts contain spoken vocabulary patterns (synonyms, explanations, misconceptions) that keyword definitions don't.

**Solution**: LLM-based extraction of transcript vocabulary (regex is insufficient).

**Impact**: +15-25 foundational synonyms in teacher language; +5-10% colloquial query MRR improvement.

### [11-synonym-quality-audit.md](11-synonym-quality-audit.md)

**Problem**: Existing synonyms may include weak entries that harm precision. No systematic prioritization for new synonyms.

**Solution**: 
1. Audit all existing synonyms for ambiguity and breadth
2. Implement weighting function: `Priority = Frequency × FoundationBonus × CrossSubjectBonus × SynonymNeed`
3. Establish LLM agent review as decision-making process

**Impact**: Improved precision by removing noisy synonyms; data-driven prioritization for additions.

**Key insight**: The weighting function is a **first pass** — it surfaces candidates. An LLM agent makes the final decisions because context matters more than metrics.

---

## Change Log

| Date       | Change                                                   |
| ---------- | -------------------------------------------------------- |
| 2025-12-27 | **NEW**: 09-knowledge-graph-evolution.md created         |
| 2025-12-27 | **NEW**: 10-transcript-mining.md created                 |
| 2025-12-27 | **NEW**: 11-synonym-quality-audit.md created             |
| 2025-12-24 | **02a COMPLETE** — Dead code deleted, synonyms documented |
| 2025-12-24 | **Tier 1 EXHAUSTED** — All approaches verified           |
| 2025-12-24 | Intent-based exception documented (requires Tier 4)      |
| 2025-12-24 | Restructured into directory with sub-plans               |
| 2025-12-24 | Corrected Tier 1 status: target met ≠ complete           |
| 2025-12-24 | Identified synonym architecture circular dependency      |
| 2025-12-24 | TRUE baseline established (MRR 0.614)                    |
| 2025-12-24 | Renamed 02 → 02a, created 02b vocabulary mining plan     |
| 2025-12-24 | Added missing fields to 05 (notes, lessonOrder, phaseSlug) |
