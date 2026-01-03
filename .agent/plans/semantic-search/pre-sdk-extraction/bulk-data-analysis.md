# Bulk Data Analysis

**Status**: 📋 Planned — Prerequisite: M3 complete
**Priority**: HIGH — Part of search quality optimization chain
**Parent**: [README.md](README.md) | [../roadmap.md](../roadmap.md)
**Created**: 2026-01-03 (Consolidated from vocabulary-mining, transcript-mining, entity-extraction)

---

## Overview

This plan consolidates all bulk data analysis work into a single cohesive effort. It mines Oak's bulk download data (~630MB, 30 files) to extract:

1. **Vocabulary patterns** — Synonym candidates, keyword relationships
2. **Transcript patterns** — Spoken teacher language, colloquial terms
3. **Entity relationships** — Concept co-occurrence, misconception clusters

**Prerequisite**: [M3: Search Quality Optimization](../active/m3-search-quality-optimization.md) must complete first to identify what quality gaps exist through comprehensive ground truths.

---

## Architecture: Two SDKs, Two Data Sources

### SDK Context

| SDK               | Location                                | Role in Bulk Analysis |
| ----------------- | --------------------------------------- | --------------------- |
| **Curriculum SDK** | `packages/sdks/oak-curriculum-sdk/`    | Types for bulk data, API access for supplementary data |
| **Search SDK**    | `apps/oak-open-curriculum-semantic-search/` (current) | Where analysis code lives, ES types |

### Data Sources

| Source          | Format       | Use Case                       |
| --------------- | ------------ | ------------------------------ |
| **Bulk Downloads** | 30 JSON files, ~630MB | Fast ingestion, complete data |
| **API**         | REST endpoints | Supplementary fields, validation |

**Key insight**: API and bulk downloads are two views of the SAME curriculum data. We use both:

- Bulk downloads for speed (already downloaded)
- API for fields only available there (e.g., categories)

---

## Code Location

Bulk analysis code lives in the **Search SDK runtime** (currently the search app workspace):

```
apps/oak-open-curriculum-semantic-search/
├── bulk-analysis/          # NEW: Manual process, generates outputs
│   ├── vocabulary/         # Vocabulary mining
│   ├── transcripts/        # Transcript analysis
│   ├── entities/           # Entity extraction
│   └── outputs/            # Generated TypeScript files
└── src/lib/                # Runtime code that consumes outputs
```

**Why separate folder?**

- Manual process (not part of normal build)
- Generates static TypeScript files
- Consumed at ingestion/runtime
- Clear separation from runtime code

### Type Requirements

All bulk analysis code MUST use types from:

1. **Curriculum SDK type-gen** — `BulkLesson`, `BulkUnit`, etc.
2. **Search SDK Elastic types** — Index document schemas

**NO ad-hoc types** — this follows the Cardinal Rule.

---

## Phase 1: Vocabulary Mining

### What's Already Done

| Component                    | Status      | Output                         |
| ---------------------------- | ----------- | ------------------------------ |
| Pipeline infrastructure      | ✅ COMPLETE | `vocab-gen/` CLI               |
| Bulk reader + Zod validation | ✅ COMPLETE | Handles all data quality issues |
| 7 Extractors                 | ✅ COMPLETE | 13K keywords, 12K misconceptions |
| Thread progression generator | ✅ COMPLETE | `thread-progression-data.ts`   |
| Prerequisite graph generator | ✅ COMPLETE | `prerequisite-graph-data.ts`   |

**Run with**: `pnpm vocab-gen` (from repo root)

### What's Next

| Generator                       | User Need                            | Status      |
| ------------------------------- | ------------------------------------ | ----------- |
| `misconception-graph-generator.ts` | "What mistakes should I watch for?" | 📋 Next     |
| `synonym-miner.ts`              | "Better search for vocabulary queries" | 📋 Planned |
| `nc-coverage-generator.ts`      | "Does this cover the NC?"            | 📋 Planned |

### Key Discovery: Synonym Strategy is Inverted

| What We Have           | Reality                              |
| ---------------------- | ------------------------------------ |
| 163 curated synonyms   | Target GCSE-level compound terms     |
| Top 100 curriculum terms | **0% synonym coverage**            |
| Highest-value terms    | `adjective`, `noun`, `suffix`, `evaluate` |

**The high-volume vocabulary is foundational (KS1-KS2) single words**, not GCSE compound terms.

### Definition Text IS the Synonym Source

```text
adjective: "a word that DESCRIBES a noun"     → "describing word"
noun: "a NAMING word for people..."           → "naming word"
denominator: "the BOTTOM NUMBER in a fraction" → "bottom number"
```

Definitions contain explanatory phrases that teachers use to search.

---

## Phase 2: Transcript Mining

### The Opportunity

| Pattern                  | Example                                        | Value              |
| ------------------------ | ---------------------------------------------- | ------------------ |
| "Also called..."         | "photosynthesis, also called plant energy production" | Explicit synonym |
| "Another word for..."    | "subtract is take away"                        | Plain English synonym |
| "Remember, X means..."   | "denominator means the bottom number"          | Teacher language   |
| "Don't confuse X with Y" | "perimeter with area"                          | Misconception pattern |

### Why This Matters

**Keyword definitions** are formal curriculum language.
**Transcripts** are spoken classroom language.

Users search with **classroom language**, not curriculum language.

### Critical Constraint: LLM Required

**Regex-based extraction will not work.**

The 2025-12-26 experiment showed:

- 93% of regex-mined synonyms were noise
- Only 7% were genuinely useful

**Transcript mining MUST use LLM-based extraction.**

### Phases

1. **Transcript Availability Audit** — Count populated transcripts, estimate volume
2. **Pattern Identification** — Manual review of 20-30 samples
3. **LLM Extraction Pipeline** — Structured extraction with confidence scores
4. **Batch Processing** — Batched LLM calls, stored results
5. **Curation Review** — LLM produces candidates, human/agent reviews
6. **Integration** — Add curated synonyms, measure MRR impact

### Data Source

```typescript
// lesson-schema.ts
transcript_sentences: z.string().optional(),
transcript_vtt: z.string().optional(),
```

**Scope**: ~47K lessons across ALL subjects and key stages.

---

## Phase 3: Entity Extraction

### Entity Types

| Type        | Examples                           | Use Case              |
| ----------- | ---------------------------------- | --------------------- |
| `CONCEPT`   | "quadratic equation", "photosynthesis" | Concept-based search |
| `TOPIC`     | "algebra", "cell biology"          | Topic clustering      |
| `SKILL`     | "solving", "analysing", "comparing" | Skill-based filtering |
| `NOTATION`  | "x²", "∑", "≤"                     | Mathematical notation |
| `TERM`      | "coefficient", "mitochondria"      | Vocabulary search     |

### Co-occurrence Graph

```typescript
const coOccurrence = await esClient.search({
  index: 'oak_lessons',
  aggs: {
    concept_pairs: {
      significant_terms: {
        field: 'extracted_entities.text.keyword',
        min_doc_count: 3,
      },
    },
  },
});
```

### Relationship Types

| Relationship      | Example                                     |
| ----------------- | ------------------------------------------- |
| `CO_OCCURS_WITH`  | "algebra" co-occurs with "equations"        |
| `PREREQUISITE_OF` | "linear equations" prerequisite of "quadratics" |
| `PART_OF`         | "SOHCAHTOA" part of "trigonometry"          |

---

## Proposed Elasticsearch Indices

### 1. Curriculum Glossary Index (`oak_curriculum_glossary`)

| Field            | Type       | Source                        |
| ---------------- | ---------- | ----------------------------- |
| `term`           | keyword    | `lessonKeywords[].keyword`    |
| `definition`     | text       | `lessonKeywords[].description` |
| `subject`        | keyword    | Lesson subject                |
| `key_stage`      | keyword    | Lesson key stage              |
| `year`           | integer    | Lesson year                   |
| `lesson_slugs`   | keyword[]  | Lessons using this term       |
| `frequency`      | integer    | Usage count                   |
| `first_introduced` | integer  | Earliest year                 |

**Size**: ~13,349 documents (unique keywords)

### 2. Misconception Index (`oak_misconceptions`)

| Field           | Type      | Source              |
| --------------- | --------- | ------------------- |
| `misconception` | text      | The wrong belief    |
| `response`      | text      | How to address it   |
| `subject`       | keyword   | Subject             |
| `key_stage`     | keyword   | Key stage           |
| `year`          | integer   | Year                |
| `lesson_slug`   | keyword   | Lesson that addresses it |

**Size**: ~12,777 documents

---

## Open Questions

### Synonym Integration

| Question              | Options                                      | Decision |
| --------------------- | -------------------------------------------- | -------- |
| Conflict resolution   | Curated always wins, but log conflicts?      | TBD      |
| Confidence scoring    | Pattern clarity, definition length, cross-ref count? | TBD |
| Promotion workflow    | Manual review vs semi-auto PR vs auto-promote? | TBD    |
| Size limits           | ES performance with 10x synonyms?            | Benchmark needed |
| Regeneration safety   | vocab-gen must NEVER modify curated files    | ✅ Decided |

### Glossary Design

| Question                           | Consideration                          |
| ---------------------------------- | -------------------------------------- |
| Link back to lessons or units?     | Both? Configurable?                    |
| Term evolution across key stages?  | Same word, different meanings?         |
| Versioning on curriculum updates?  | How to track vocabulary changes?       |

---

## Success Metrics

| Metric                          | Target              | How Measured               |
| ------------------------------- | ------------------- | -------------------------- |
| Search MRR on vocabulary queries | +10% improvement    | Before/after evaluation    |
| Learning path accuracy          | 90%+ correct        | AI answering "what comes before?" |
| Misconception detection         | Relevant surfaced   | Teacher feedback           |
| Colloquial query MRR            | +15% improvement    | eval:per-category          |

---

## Evaluation Requirements

Before implementing new indices:

- [ ] Create ground truth queries for glossary search
- [ ] Baseline MRR for vocabulary-type queries
- [ ] After MRR for vocabulary-type queries
- [ ] Per-index ablation: measure impact of each new index
- [ ] Record all results in [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md)

---

## Related Documents

| Document                                                                                      | Purpose              |
| --------------------------------------------------------------------------------------------- | -------------------- |
| [vocab-gen/](../../../../packages/sdks/oak-curriculum-sdk/vocab-gen/)                         | Pipeline code        |
| [ADR-086](../../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md) | Graph export pattern |
| [vocabulary-value-analysis.md](../../../research/semantic-search/vocabulary-value-analysis.md) | Value score research |
| [../active/m3-search-quality-optimization.md](../active/m3-search-quality-optimization.md)   | Prerequisite work    |

---

## Foundation Documents

Before starting work, re-read:

1. [rules.md](../../../directives-and-memory/rules.md) — TDD, quality gates, no type shortcuts
2. [testing-strategy.md](../../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

