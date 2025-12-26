# Semantic Search - Fresh Chat Entry Point

**Status**: Part 1 ACTIVE — Tier 1 EXHAUSTED, 02b IN PROGRESS (generators pending)  
**Architecture**: Four-Retriever Hybrid (BM25 + ELSER on Content + Structure)  
**Strategy**: [ADR-082: Fundamentals-First](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)  
**Last Updated**: 2025-12-26

---

> **Scope Note**: This plan focuses on **search implementation** (extraction, graphs, ES indexing).
> MCP tool integration is deferred to [08-mcp-graph-tools.md](../../plans/semantic-search/part-1-search-excellence/08-mcp-graph-tools.md).

---

## 🎯 The Goal: User Value Through Impact

**We are here to enhance the usefulness of search results for multiple audiences.**

This work is NOT about extraction counts or technical metrics in isolation. It's about delivering value to real people through positive impact, enabled by context awareness and truly excellent software and data engineering.

### User Personas

| Persona | Context | What They Need | Example Query |
|---------|---------|----------------|---------------|
| **Student** | Learning new concepts | Clear definitions, learning paths, "what comes next" | "What does photosynthesis mean?" |
| **Teacher** | Lesson planning | Vocabulary to introduce, misconceptions to address | "Common mistakes with fractions" |
| **School Leader** | Curriculum planning | NC coverage, progression mapping | "Which units cover Year 5 NC statements?" |
| **Curriculum Planner** | Strategic design | Cross-subject vocabulary, prerequisite chains | "What's the learning path for algebra?" |
| **Parent (Homeschool)** | Supporting learning | Clear structure, prerequisites | "What should my child know before this?" |
| **Adult Learner** | Self-directed learning | Context-appropriate explanations, flexible paths | "Explain this for someone new to the subject" |

### Success = Measurable User Impact

| Metric | What It Measures | Target |
|--------|------------------|--------|
| Search MRR | Do users find what they need? | Tier 1: 0.45 ✅ achieved (0.614) |
| Query→Lesson match | Does vocabulary help matching? | Improved recall on hard queries |
| Learning path accuracy | Can AI answer "what comes before?" | Prerequisites traceable |
| Misconception coverage | Can AI detect common mistakes? | Addressable in tutoring context |

---

## Pipeline Architecture: Extraction → Processing → Impact

The vocabulary mining pipeline is **multi-step by design**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         VOCAB-GEN PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  STEP 1: EXTRACTION (Exploratory)                                        │
│  ─────────────────────────────────                                       │
│  Mine EVERYTHING from bulk data. We don't know what will be useful yet. │
│  Keywords, phrases, relationships (implicit & explicit), progressions.   │
│                                                                          │
│                              ↓                                           │
│                                                                          │
│  STEP 2: PROCESSING (Value Creation)                                     │
│  ────────────────────────────────────                                    │
│  Transform raw data into user-valuable structures:                       │
│  • Curate high-value terms from raw keywords                             │
│  • Build prerequisite graphs from prior knowledge                        │
│  • Cluster misconceptions by topic                                       │
│  • Extract implicit relationships                                        │
│                                                                          │
│                              ↓                                           │
│                                                                          │
│  STEP 3: OUTPUT (User-Facing)                                            │
│  ─────────────────────────────                                           │
│  Generate structures that directly serve user needs:                     │
│  • Static graph files for MCP tools                                      │
│  • Elasticsearch indexes for search                                      │
│  • Synonym sets for query expansion                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key insight**: Extraction is speculative. We mine broadly because we don't yet know what will create the most value. Processing and output steps are where we make deliberate choices about what serves users best.

---

## Current State

| Component | Status | Notes |
|-----------|--------|-------|
| Tier 1 target | ✅ MET | MRR 0.614 ≥ 0.45 |
| 02a Synonym architecture | ✅ COMPLETE | 163 curated synonyms |
| **02b Extraction** | ✅ COMPLETE | All 7 extractors working |
| **02b Graph Data** | ✅ PARTIAL | Thread progressions + prerequisite graph generated |
| **02b ES Indexing** | 📋 PENDING | Glossary, misconception indices |
| **08 MCP Tools** | 📋 DEFERRED | See [08-mcp-graph-tools.md](../../plans/semantic-search/part-1-search-excellence/08-mcp-graph-tools.md) |
| Type remediation | ✅ COMPLETE | `formatOptimizedResult` refactored |
| Quality gates | ✅ PASS | All 11 gates |

### What's Been Built

```
packages/sdks/oak-curriculum-sdk/
├── vocab-gen/
│   ├── lib/                    ← Bulk reader with Zod validation
│   ├── extractors/             ← 7 extractors (keywords, misconceptions, etc.)
│   └── generators/             ← Thread progressions ✅, prerequisite graph ✅, others pending
└── src/mcp/
    ├── knowledge-graph-data.ts ← Pattern reference
    ├── thread-progression-data.ts ← ✅ GENERATED (164 threads, 14 subjects)
    └── prerequisite-graph-data.ts ← ✅ GENERATED (1601 units, 3408 edges)
```

> **Note**: MCP tool files (`aggregated-*.ts`) exist but are deferred to [08-mcp-graph-tools.md](../../plans/semantic-search/part-1-search-excellence/08-mcp-graph-tools.md) for remaining work.

### What Extraction Captures (Raw Data)

The extractors mine everything available. Counts are informational, not success metrics:

| Data Type | Raw Count | User Value Potential |
|-----------|-----------|---------------------|
| Keywords with definitions | ~13K | Glossary, synonym mining |
| Misconceptions with responses | ~12K | AI tutoring, teacher guidance |
| Learning points | ~51K | Outcome mapping |
| Teacher tips | ~12K | Pedagogical guidance |
| Prior knowledge requirements | ~7K | Prerequisite graphs |
| NC statements | ~7K | Curriculum coverage |
| Threads | 164 | Learning paths ✅ |

---

## What's Next — By User Need

### 1. "What's the learning path for X?" — ✅ Data COMPLETE

**Thread Progressions**: 164 threads showing ordered unit sequences across years.

- Data: `thread-progression-data.ts` (generated by `pnpm vocab-gen`)
- ES Index: 📋 PENDING — Index for search queries

### 2. "What should I know before this?" — ✅ Data COMPLETE

**Prerequisite Graph**: 1,601 units with prior knowledge requirements and 3,408 edges.

- Data: `prerequisite-graph-data.ts` (generated by `pnpm vocab-gen`)
- ES Index: 📋 PENDING — Index for prerequisite search queries

### 3. "What mistakes should I watch for?" — PLANNED

**Misconception Graph**: Cluster ~12K misconceptions by topic for searchable access.

- Generator: 📋 PENDING — `misconception-graph-generator.ts`
- ES Index: 📋 PENDING — `oak-misconceptions` index

User value: Teachers prepare for common errors, search finds lessons addressing specific mistakes.

### 4. "Improve search for vocabulary queries" — PLANNED

**Synonym Enhancement**: Mine definitions for patterns ("also known as", parentheticals).

- Processor: 📋 PENDING — `synonym-miner.ts`
- ES Synonyms: 📋 PENDING — Update `oak-syns` synonym set

User value: User queries match curriculum content even with different wording.

---

## Before You Start (MANDATORY)

### 1. Read Foundation Documents

1. **[rules.md](../../directives-and-memory/rules.md)** — TDD, quality gates, no type shortcuts
2. **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — Test types
3. **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator-first
4. **[02b-vocabulary-mining.md](../../plans/semantic-search/part-1-search-excellence/02b-vocabulary-mining.md)** — Full plan

### 2. The First Question

Before every change: **"Could it be simpler without compromising quality?"**

### 3. User Value Question

Before every feature: **"Which user persona does this serve? How will we measure impact?"**

---

## Fresh Chat First Steps

### 1. Verify Quality Gates

```bash
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix && pnpm format:root && pnpm markdownlint:root && pnpm test && pnpm test:e2e && pnpm test:e2e:built && pnpm test:ui && pnpm smoke:dev:stub
```

### 2. Verify Pipeline Works

```bash
pnpm vocab-gen --dry-run  # Shows extraction stats
pnpm vocab-gen            # Generates output files
```

### 3. Review Generated Output

```bash
cat packages/sdks/oak-curriculum-sdk/src/mcp/thread-progression-data.ts | head -50
```

### 4. Continue With Next User Need

Pick the next generator based on which user need is highest priority.

---

## Key Principles

1. **User value first** — Every feature serves a persona with measurable impact
2. **Extraction is exploratory** — Mine everything; we don't know what's valuable yet
3. **Processing creates value** — Transform raw data into user-serving structures
4. **Pipeline is multi-step** — Extraction → Processing → Output
5. **TDD at ALL levels** — RED → GREEN → REFACTOR
6. **First Question** — Could it be simpler without compromising quality?

---

## TDD Sequence for New Generators

For each new generator, follow this exact sequence:

1. **RED**: Write failing test for `generate[GraphName](extractedData)`
2. **GREEN**: Implement generator to pass the test
3. **RED**: Write failing test for serialisation
4. **GREEN**: Implement TypeScript file writer
5. **REFACTOR**: Extract common patterns

**Then**: Run all quality gates and confirm user value.

---

## Quality Gate Checkpoints

After completing any piece of work:

```bash
# Run one at a time, analyse issues only after ALL complete
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

**Then**: Re-read foundation documents and confirm adherence.

---

## Data Quality Notes

The bulk download data has known issues that the pipeline handles:

| Issue | Solution |
|-------|----------|
| `"NULL"` sentinel strings | Zod transforms to `undefined` |
| Maths-secondary tier variants | Merged by unitSlug (tier-agnostic) |
| Empty `teacherTip` strings | Filtered before extraction |
| Complex `contentGuidance` array | Custom Zod schema |

See [02b-vocabulary-mining.md](../../plans/semantic-search/part-1-search-excellence/02b-vocabulary-mining.md) for full data quality handling strategy.

---

## Key File Locations

### Vocab-Gen Pipeline

```
packages/sdks/oak-curriculum-sdk/vocab-gen/
├── run-vocab-gen.ts           ← CLI entry point
├── vocab-gen.ts               ← Pipeline orchestrator
├── vocab-gen-core.ts          ← Core processing (pure, testable)
├── lib/                       ← Bulk reader, schemas
├── extractors/                ← 7 extractors
└── generators/                ← Graph generators
```

### Generated Outputs

```
packages/sdks/oak-curriculum-sdk/src/mcp/
├── knowledge-graph-data.ts       ← Pattern reference
├── thread-progression-data.ts    ← ✅ GENERATED
├── prerequisite-graph-data.ts    ← TO BE GENERATED
├── misconception-graph-data.ts   ← TO BE GENERATED
└── vocabulary-graph-data.ts      ← TO BE GENERATED
```

### Bulk Download Data

```
reference/bulk_download_data/oak-bulk-download-2025-12-07T09_37_04.693Z/
└── 30 files, ~630MB
```

---

**Ready?**

1. Run: `pnpm vocab-gen` to verify generation works
2. Read: [02b-vocabulary-mining.md](../../plans/semantic-search/part-1-search-excellence/02b-vocabulary-mining.md)
3. Pick: Next user need to address (focus on search implementation, not MCP tools)
