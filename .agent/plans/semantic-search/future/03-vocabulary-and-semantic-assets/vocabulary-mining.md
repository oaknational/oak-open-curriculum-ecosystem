# Vocabulary Mining

**Boundary**: vocabulary-and-semantic-assets  
**Legacy Stream Label**: bulk-data-analysis  
**Status**: 📋 Pending  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-01-03  
**Last Updated**: 2026-01-17  
**Research**: [aliases-and-equivalances.md](../../../../research/elasticsearch/oak-data/aliases-and-equivalances.md), [bulk-metadata-opportunities.research.md](bulk-metadata-opportunities.research.md), [vocabulary-glossary-and-mining-surfaces.research.md](vocabulary-glossary-and-mining-surfaces.research.md)

---

## Overview

This plan consolidates all bulk data analysis work into a single cohesive effort. It mines Oak's bulk download data (~630MB, 30 files) to extract:

1. **Vocabulary patterns** — Synonym candidates, keyword relationships
2. **Transcript patterns** — Spoken teacher language, colloquial terms
3. **Entity relationships** — Concept co-occurrence, misconception clusters

**Future direction**: This analysis will eventually move upstream to the bulk-data *generation* pipeline.

---

## Architecture: Two SDKs, Two Data Sources

### SDK Context

| SDK | Location | Role in Bulk Analysis |
| --- | --- | --- |
| **Codegen SDK** | `packages/sdks/oak-sdk-codegen/` | Owns bulk sdk-codegen, vocab generation, and generated artefacts |
| **Runtime SDKs** | `packages/sdks/oak-curriculum-sdk/`, `packages/sdks/oak-search-sdk/` | Consume generated outputs at runtime |

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

Bulk analysis code lives in the **codegen workspace**:

```
packages/sdks/oak-sdk-codegen/
├── vocab-gen/              # Vocabulary mining and graph generation tools
├── src/vocab-gen/          # Runtime helpers consumed by vocab-gen
└── src/types/generated/    # Generated outputs consumed by runtime workspaces
```

### Type Requirements

All bulk analysis code MUST use types from:

1. **Oak API SDK sdk-codegen** — `BulkLesson`, `BulkUnit`, etc.
2. **Search SDK Elastic types** — Index document schemas

**NO ad-hoc types** — this follows the Cardinal Rule.

---

## What's Already Done

| Component                    | Status      | Output                         |
| ---------------------------- | ----------- | ------------------------------ |
| Pipeline infrastructure      | ✅ COMPLETE | `vocab-gen/` CLI               |
| Bulk reader + Zod validation | ✅ COMPLETE | Handles all data quality issues |
| 7 Extractors                 | ✅ COMPLETE | 13K keywords, 12K misconceptions |
| Thread progression generator | ✅ COMPLETE | `thread-progression-data.ts`   |
| Prerequisite graph generator | ✅ COMPLETE | `prerequisite-graph-data.ts`   |
| Complete synonym coverage    | ✅ COMPLETE | 17 subject files (~580 entries) |

**Run with**: `pnpm vocab-gen` (from repo root)

---

## Phase 1: Synonym Bucket Classification

**Priority**: 🔴 HIGHEST — Quick win, builds on existing work

**Related**: [mfl-synonym-architecture.md](mfl-synonym-architecture.md) — MFL-specific DRY refactoring

Classify existing ~580 synonyms into 4 buckets (from research):

| Bucket | Definition | Example | ES Treatment |
|--------|------------|---------|--------------|
| **Alias** | Strict equivalence, always interchangeable | "add" ↔ "plus" | Synonym set |
| **Paraphrase** | Teacher/student vernacular | "bottom number" → "denominator" | Query-time weak expansion |
| **Sense-bound** | Context-dependent meaning | "cell" (biology) vs "cell" (spreadsheet) | Gated by subject filter |
| **Relationship** | Related but not equivalent | "fraction" → "ratio" | Relationship channel (NOT synonyms) |

**Output**: Classification annotations on existing synonym files.

**Research**: [aliases-and-equivalances.md](../../../../research/elasticsearch/oak-data/aliases-and-equivalances.md), [handling-existing-synonymish-things.md](../../../../research/elasticsearch/oak-data/handling-existing-synonymish-things.md)

---

## Phase 2: Science Synonym Expansion

**Priority**: 🔴 HIGHEST — Addresses known gap

| Subject | Current Lines | Target | Notes |
|---------|--------------|--------|-------|
| Maths | 375 | — | Already comprehensive |
| Science | 37 | ~200 | **Needs expansion** |

Science secondary is significantly underdeveloped compared to maths:

- Biology/Chemistry/Physics sub-domains need separate treatment
- KS4 exam board variance (AQA, Edexcel, OCR)
- Complex cross-topic relationships (energy, particles)

**Research**: [aliases-and-equivalances.md](../../../../research/elasticsearch/oak-data/aliases-and-equivalances.md) Appendix C

---

## Phase 3: Definition Mining

**Priority**: 🟡 MEDIUM — Enables colloquial → curriculum bridging

Definition text IS the synonym source:

```text
adjective: "a word that DESCRIBES a noun"     → "describing word"
noun: "a NAMING word for people..."           → "naming word"
denominator: "the BOTTOM NUMBER in a fraction" → "bottom number"
```

**Output**: Definition-derived synonyms for high-value vocabulary terms.

**Feeds into**: [definition-retrieval.md](../04-retrieval-quality-engine/definition-retrieval.md)

**Research**: [data-and-domain-vocabulary.md](../../../../research/elasticsearch/oak-data/data-and-domain-vocabulary.md)

---

## Phase 4: Transcript Mining

### The Opportunity

| Pattern                  | Example                                        | Value              |
| ------------------------ | ---------------------------------------------- | ------------------ |
| "Also called..."         | "photosynthesis, also called plant energy production" | Explicit synonym |
| "Another word for..."    | "subtract is take away"                        | Plain English synonym |
| "Remember, X means..."   | "denominator means the bottom number"          | Teacher language   |
| "Don't confuse X with Y" | "perimeter with area"                          | Misconception pattern |

### Critical Constraint: LLM Required

**Regex-based extraction will not work.**

WE WILL NEVER USE REGEX

The 2025-12-26 experiment showed:

- 93% of regex-mined synonyms were noise
- Only 7% were genuinely useful

**Transcript mining MUST use LLM-based extraction.**

---

## Phase 5: Entity Extraction

### Entity Types

| Type        | Examples                           | Use Case              |
| ----------- | ---------------------------------- | --------------------- |
| `CONCEPT`   | "quadratic equation", "photosynthesis" | Concept-based search |
| `TOPIC`     | "algebra", "cell biology"          | Topic clustering      |
| `SKILL`     | "solving", "analysing", "comparing" | Skill-based filtering |
| `NOTATION`  | "x²", "∑", "≤"                     | Mathematical notation |
| `TERM`      | "coefficient", "mitochondria"      | Vocabulary search     |

---

## Success Metrics

| Metric                          | Target              | How Measured               |
| ------------------------------- | ------------------- | -------------------------- |
| Search MRR on vocabulary queries | +10% improvement    | Before/after evaluation    |
| Science secondary MRR           | +15% improvement    | Currently underperforming  |
| Colloquial query MRR            | +15% improvement    | `benchmark:lessons` category slices (`--category`) |

---

## Checklist

### Phase 1: Synonym Bucket Classification

- [ ] Audit existing ~580 synonyms
- [ ] Classify each into Alias/Paraphrase/Sense-bound/Relationship
- [ ] Update synonym files with bucket annotations
- [ ] Separate strict equivalences for ES synonym sets

### Phase 2: Science Expansion

- [ ] Analyse science bulk data for vocabulary gaps
- [ ] Create physics sub-domain synonyms
- [ ] Create chemistry sub-domain synonyms
- [ ] Create biology sub-domain synonyms
- [ ] Handle exam board variance

### Phase 3: Definition Mining

- [ ] Extract definitions from keyword data
- [ ] Identify definition-derived synonyms
- [ ] Review and curate
- [ ] Feed into definition-retrieval.md

### Phase 4: Transcript Mining (LLM)

- [ ] Design LLM prompt for synonym extraction
- [ ] Process transcripts with LLM
- [ ] Human review of LLM outputs
- [ ] Promote high-confidence synonyms

---

## Related Documents

| Document                                                                                      | Purpose              |
| --------------------------------------------------------------------------------------------- | -------------------- |
| [bulk-metadata-opportunities.research.md](bulk-metadata-opportunities.research.md) | Lesson/unit signal audit |
| [vocabulary-glossary-and-mining-surfaces.research.md](vocabulary-glossary-and-mining-surfaces.research.md) | Vocabulary and glossary asset model |
| [vocab-gen/](../../../../../packages/sdks/oak-sdk-codegen/vocab-gen/) | Pipeline code |
| [ADR-086](../../../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md) | Graph export pattern |
| [aliases-and-equivalances.md](../../../../research/elasticsearch/oak-data/aliases-and-equivalances.md) | Synonym classification |
| [data-and-domain-vocabulary.md](../../../../research/elasticsearch/oak-data/data-and-domain-vocabulary.md) | Definition registry |
| [definition-retrieval.md](../04-retrieval-quality-engine/definition-retrieval.md) | Consumes definition data |
| [../roadmap.md](../../roadmap.md) | Master plan |

---

## Foundation Documents

Before starting work, re-read:

1. [principles.md](../../../../directives/principles.md) — TDD, quality gates, no type shortcuts
2. [testing-strategy.md](../../../../directives/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../../../directives/schema-first-execution.md) — Generator is source of truth
