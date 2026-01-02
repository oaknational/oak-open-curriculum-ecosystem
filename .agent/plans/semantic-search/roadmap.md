# Semantic Search Roadmap

**Status**: ✅ **Full ingestion verified** — Now optimising search quality
**Last Updated**: 2026-01-02
**Metrics Source**: [current-state.md](current-state.md)
**Session Context**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

**Scope**: Search SDK/CLI capabilities. UI delivery is out of scope (separate repository).

This is THE authoritative roadmap for semantic search work.

---

## Current ES Index State (2026-01-02)

| Index | Documents | Storage |
|-------|-----------|---------|
| `oak_lessons` | 184,985 | 806.62MB |
| `oak_unit_rollup` | 165,345 | 706.06MB |
| `oak_units` | 1,635 | 8.94MB |
| `oak_threads` | 164 | 255.53KB |
| `oak_sequence_facets` | 57 | 375.14KB |
| `oak_sequences` | 30 | 267.67KB |
| `oak_meta` | 1 | 5.34KB |

**Note**: `oak_lessons` and `oak_unit_rollup` counts include ELSER sub-documents for sparse vectors.

---

## ✅ Completed Milestones

### Milestone 1: Complete ES Ingestion ✅

| Metric | Value |
|--------|-------|
| Documents indexed | 16,414 |
| Initial failures | 17 (0.10%) |
| Final failures | 0 |
| Duration | ~22 minutes |

See [ADR-096: ES Bulk Retry Strategy](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md).

### Milestone 2: Sequence Indexing ✅

| Index | Count |
|-------|-------|
| `oak_sequences` | 30 |
| `oak_sequence_facets` | 57 |

### Milestone 4: DRY/SRP Refactoring ✅

All document builders follow the shared pattern:

```text
[Bulk Data] → [Extractor] → [Params] → [Shared Builder] → [ES Doc]
[API Data]  → [Adapter]   → [Params] → [Shared Builder] → [ES Doc]
```

New shared utilities:
- `canonical-url-generator.ts` — Single source of truth for URLs
- `slug-derivation.ts` — Subject/phase extraction from slugs

### Milestone 5: Data Completeness ✅

| Field | Resolution |
|-------|------------|
| `unit_topics` / `categories` | API supplementation via CategoryMap |
| `category_titles` | Aggregated from unit categories |
| `sequence_canonical_url` | Shared URL generator |
| `thread_slugs`, `thread_titles`, `thread_orders` | Extracted from bulk data |

**Key Discovery**: Categories are subject-specific (English, Science, RE only). See [category-availability-by-subject.md](../../analysis/category-availability-by-subject.md).

---

## 🎯 NEXT: Milestone 3 — Search Quality Optimization

**Status**: 📋 Ready to start
**Priority**: HIGH — Foundation for all future search work
**ADR**: [ADR-097: Context Enrichment Architecture](../../../docs/architecture/architectural-decisions/097-context-enrichment-architecture.md)

This milestone combines:
1. **Synonym quality audit** — Remove noise, add high-impact synonyms
2. **Bulk download data analysis** — Extract valuable metadata for search enrichment
3. **Comprehensive ground truths** — Cover ALL subjects, ALL key stages
4. **Benchmarking infrastructure** — Measure search quality by user story

### Phase 1: Comprehensive Ground Truths

**Current gap**: Ground truths cover KS4 Maths only (73 queries). Full curriculum has 16,414 documents.

| Required | Current | Gap |
|----------|---------|-----|
| All 17 subjects | Maths only | 16 subjects |
| All 4 key stages | KS4 only | KS1-3 |
| All query categories | 6 categories ✅ | — |

**Categories** (preserve existing):
- naturalistic, misspelling, synonym, multi-concept, colloquial, intent-based

**Grouping** (by user story):
- Teacher planning queries
- Student revision queries  
- Curriculum navigation queries
- Resource discovery queries

### Phase 2: Baseline Benchmarks

Establish comprehensive MRR baselines BEFORE any changes:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category    # Per-category breakdown
pnpm eval:diagnostic      # Pattern analysis
```

Document in [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md).

### Phase 3: Synonym Audit

**Goal**: Remove low-value noise, add high-impact synonyms.

**NOT about arbitrary counts** — focus on measured impact:
- Audit existing 163 synonyms for precision issues
- Identify vocabulary gaps across ALL subjects
- Add synonyms that demonstrably improve MRR

**Two mechanisms** (from [ADR-084](../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md)):
1. ES synonym expansion (single-word tokens)
2. Phrase detection + boosting (multi-word terms)

### Phase 4: Bulk Download Data Analysis

**Goal**: Extract valuable metadata from bulk downloads to enrich search.

**Sources** (from `BulkLesson` schema):
- `lessonKeywords` — 13K+ unique keywords with definitions
- `misconceptionsAndCommonMistakes` — 12K+ misconceptions
- `teacherTips` — Pedagogical guidance
- `contentGuidance` — Content warnings/context
- `transcript_sentences` — Spoken teacher language

**Output**: Generated files consumed at ingestion time (preprocessing step).

### Phase 5: Measure and Iterate

After each change:
1. Run full benchmark suite
2. Compare MRR by category and user story
3. Document in EXPERIMENT-LOG.md
4. Accept/reject based on measured impact

**Success criteria**: Measurable improvement in search quality across ALL subjects.

---

## Future Milestones

### Milestone 6: ES Native MCP Research (NEW)

**Status**: 📋 Planned
**Purpose**: Evaluate ES MCP features vs building custom MCP tools

Research questions:
- Can ES native MCP capabilities replace custom MCP tools?
- Should we use ES MCP alongside custom tools?
- What capabilities does ES MCP offer?

**Deliverable**: ADR with decision and rationale.

### Milestone 7: SDK/CLI Extraction

**Status**: 📋 Planned
**Specification**: [search-sdk-cli.md](planned/sdk-extraction/search-sdk-cli.md)

Extract semantic search into:
1. **Search SDK** — `packages/libs/search-sdk/`
2. **Search CLI** — First-class CLI workspace
3. **Retire Next.js** — Remove app layer

### Milestone 8: Search MCP Tool

**Status**: 📋 Planned (after M7)
**Purpose**: Expose search via MCP for AI agents

Prerequisites:
- SDK extraction complete (M7)
- ES MCP research complete (M6)

### Milestone 9: Search Delivery Parity

**Status**: 📋 Planned
**Purpose**: Match current OWA search capabilities
**Research**: [feature-parity-analysis.md](../../research/feature-parity-analysis.md)

#### Scope Clarification (2026-01-02)

**NOT needed** (Open API is all new curriculum):
- `cohort` field — No legacy content exists
- `isLegacy` field — All content is current

**AVAILABLE via API**:
- Tier info (`tierSlug`, `tierTitle`) — Via `/sequences/{sequence}/units` KS4 structure
- Exam board (`examBoardTitle`) — Via `/search/lessons` results

**NOT in API** (OWA synthetic):
- `programmeSlug` — Derivable: sequence + year + tier + examboard
- `pathways[]` array — Different structure (tiered hierarchy)

#### Implementation Tasks

1. **Multi-select faceted filtering**
   - Subject, key stage, year (✅ facets exist)
   - Exam board, tier (need to expose from sequence data)

2. **Mixed content ranking**
   - Interleave lessons + units in results
   - Score normalisation across indices

3. **KS4 pathway handling**
   - Derive programme context from sequence + filters
   - Generate OWA-compatible URLs without `programmeSlug`

4. **Response schema alignment**
   - Map field names to OWA expectations
   - Add `keyStageShortCode` (derivable from slug)

### Milestone 10: Collaborative Improvements

**Status**: 📋 Planned
**Purpose**: Enhance search beyond current capabilities

- Pedagogical intent enrichment
- Relationship-aware ranking
- Typeahead integration

### Milestone 11: Conversational Search

**Status**: 📋 Deferred (Tier 4)
**Specification**: [conversational-search.md](planned/future/conversational-search.md)

LLM-based query understanding for intent-based queries. Only after M3-M10 are exhausted.

---

## Backlog (Post-MVP)

These features are documented but not prioritised:

| Feature | Specification | Notes |
|---------|---------------|-------|
| Reference Indices | [reference-indices.md](planned/future/reference-indices.md) | Glossary, NC coverage |
| Entity Extraction | [entity-extraction.md](planned/future/entity-extraction.md) | May be ingestion tweak |
| Knowledge Graph | [knowledge-graph-evolution.md](planned/future/knowledge-graph-evolution.md) | Property → instance graph |
| Advanced ES Features | [es-native-enhancements.md](planned/future/es-native-enhancements.md) | Phonetic, reranking |
| MCP Graph Tools | [mcp-graph-tools.md](planned/future/mcp-graph-tools.md) | Expose graphs via MCP |
| Resource Types | [resource-types.md](planned/future/resource-types.md) | Worksheets, quizzes |
| Evaluation Infrastructure | [evaluation-infrastructure.md](planned/sdk-extraction/evaluation-infrastructure.md) | Unify eval directories |

---

## Quality Gates

Run after every piece of work, from repo root:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**All gates must pass. No exceptions.**

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [current-state.md](current-state.md) | Authoritative metrics |
| [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) | Session context |
| [search-acceptance-criteria.md](search-acceptance-criteria.md) | Tier definitions |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Experiment history |
| [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) | ES Bulk Retry |
| [ADR-097](../../../docs/architecture/architectural-decisions/097-context-enrichment-architecture.md) | Context Enrichment |

---

## Foundation Documents

Before any work, read:

1. [rules.md](../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

**Do NOT guess how ES works** — read the official documentation:

- [ES semantic_text](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
- [ELSER model docs](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/elser)
- [Inference queue docs](https://www.elastic.co/docs/explore-analyze/machine-learning/inference/inference-queue)
