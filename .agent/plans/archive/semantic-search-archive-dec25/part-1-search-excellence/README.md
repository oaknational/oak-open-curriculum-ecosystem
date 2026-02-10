# Part 1: Search Excellence — Master Plan

**Status**: 🔄 BLOCKED — Complete ES Ingestion Required  
**Priority**: High  
**Created**: 2025-12-19  
**Last Updated**: 2025-12-28  
**Strategy**: [ADR-082: Fundamentals-First Search Strategy](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)

---

## 🚀 Current Focus: Complete ES Ingestion (2025-12-28)

**BLOCKED**: All evaluation, ground truth, and synonym validation work is blocked until we have FULL curriculum data in Elasticsearch.

**Prompt**: [semantic-search.prompt.md](../../../prompts/semantic-search/semantic-search.prompt.md) — Contains ES vs bulk download comparison and ingestion commands

### ES Coverage Status

| Category | Subjects | ES Status |
|----------|----------|-----------|
| ✅ Complete | art, computing, design-technology, citizenship, cooking-nutrition | 5 subjects ingested |
| ⚠️ Incomplete | english | Missing ~1,030 lessons |
| ❌ Lost on Reset | maths, history, geography | Need re-ingestion |
| ❌ Not Started | science, french, spanish, german, PE, RE, music, rshe-pshe | 8 subjects pending |

**Current coverage**: ~27% (3,438 of ~12,783 lessons from bulk download)

### Requirements Before Proceeding

1. **Complete ingestion of ALL 17 subjects** — Run `pnpm es:ingest-live -- --subject X` for each
2. **Verify counts against bulk download reference** — See prompt for comparison table
3. **Comprehensive ground truths** — Queries for ALL subjects and key stages (not just GCSE Maths)
4. **Comprehensive benchmark evaluations** — Per-subject and per-keystage MRR baselines

---

## 🎯 Executive Summary

**What we thought**: "Get MRR to 0.45, done."

**What we learned**: Search excellence requires exhausting ALL fundamental improvements before declaring any tier complete. Meeting a target is the _beginning_ of validation, not the end.

**Current State**: MRR 0.614 exceeds the Tier 1 target (0.45). **Tier 1 is EXHAUSTED** (2025-12-24) — all standard approaches verified. Intent-based category (0.229) has documented exception (requires Tier 4). Now expanding to multi-subject for proper synonym validation.

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
| [05-complete-data-indexing.md](05-complete-data-indexing.md)       | Index ALL curriculum data            | High     | 🔄 ~27% done   |
| [06-reference-indices.md](06-reference-indices.md)                 | Reference data (subjects, key stages)| Medium   | 📋 Pending     |
| [07-resource-types.md](07-resource-types.md)                       | Worksheets, quizzes, sequences       | Medium   | 📋 Pending     |
| [08-mcp-graph-tools.md](08-mcp-graph-tools.md)                     | MCP tools for graph data             | Medium   | ✅ Partial     |
| [09-knowledge-graph-evolution.md](09-knowledge-graph-evolution.md) | Property graph → True knowledge graph| Medium   | 📋 Planned     |
| [10-transcript-mining.md](10-transcript-mining.md)                 | Mine transcripts for spoken synonyms | Medium   | 📋 Planned     |
| [11-synonym-quality-audit.md](11-synonym-quality-audit.md)         | Audit existing synonyms + weighting  | High     | 🔄 Blocked on ingestion |
| [12-curriculum-pattern-config.md](12-curriculum-pattern-config.md) | **Static pattern config for traversal** | **HIGH** | 📋 Planned |
| [13-thread-based-search.md](13-thread-based-search.md)             | **Thread data for progression search** | **HIGH** | 📋 Planned |
| **[17-synonym-enrichment.md](../../../plans/sdk-and-mcp-enhancements/17-synonym-enrichment-from-owa-oala.md)** | **OWA/OALA synonym import** | Medium | ✅ Complete |

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

## 🧵 Thread-Based Search: The Learning Progression Advantage

**Threads are the pedagogical backbone of Oak's curriculum** — they show how ideas BUILD over time. No other education search service has this data in a form that can be searched.

### What Threads Enable

| Query Type | Without Threads | With Threads |
|------------|----------------|--------------|
| "What comes before fractions?" | ❌ Cannot answer | ✅ Return prior units in Number thread |
| "How does algebra develop?" | ❌ Keyword match only | ✅ Show Year 7→11 progression |
| "Related topics to trigonometry" | ❌ Guesswork | ✅ Geometry & Measure thread siblings |
| "Foundation for this lesson" | ❌ No context | ✅ Thread-ordered prerequisites |

### Thread Data Available

| Data Point | Source | Count |
|------------|--------|-------|
| Threads | `/threads` | 164 across 14 subjects |
| Thread → Unit mappings | `/threads/{slug}/units` | ~1,600 units with thread associations |
| Unit order within thread | `ThreadUnitsResponse.unitOrder` | Ordered progression data |
| Thread title | `ThreadUnitsResponse.threadTitle` | Human-readable names |

### Planned Search Features

1. **Progression Search** — "What should I teach before X?"
2. **Thread Filtering** — Filter results to a conceptual strand
3. **Sibling Discovery** — "Other units in this thread"
4. **Vertical Connections** — Show how concept develops across years
5. **Thread Rollups** — Aggregate metrics per thread (lessons, units, years)

**See**: [13-thread-based-search.md](13-thread-based-search.md) for comprehensive implementation plan

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

- [rules.md](../../directives/rules.md) — TDD, quality gates
- [testing-strategy.md](../../directives/testing-strategy.md) — Test types
- [schema-first-execution.md](../../directives/schema-first-execution.md) — Generator-first

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
| 2025-12-27 | **Multi-Subject Ingestion** — CLI enhanced with `--all` flag, TDD complete |
| 2025-12-27 | CLI now uses schema-derived SUBJECTS (17 total), requires explicit subject selection |
| 2025-12-27 | Dropped maths-only focus — expanding to all subjects for proper synonym testing |
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
