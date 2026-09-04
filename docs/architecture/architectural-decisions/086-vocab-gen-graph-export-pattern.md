# ADR-086: Vocabulary Mining and Graph Export Pattern

**Status**: Accepted (amended 2026-09-03)  
**Date**: 2025-12-25 (amended 2026-09-03)  
**Authors**: AI Agent  
**Deciders**: Engineering Team

> **Amendment (2026-09-03 — the corpus carries curriculum order).**
>
> The corpus `edges` array is sorted by (type, source, target) for a
> deterministic artefact, so it is a SET: it records THAT a relation holds,
> never in what order. Two views had nonetheless read order off it, and so
> served the alphabet as though it were curriculum. Both are corrected here,
> and everything Oak authors as a sequence now lives in an ordered section
> beside the edges.
>
> - **A thread is a tag; the order is the curriculum's.** The G3 sequences
>   had sorted a thread's placements by `(year, unitId)`, so within a year the
>   served order was alphabetical by slug (90% of placements sat in a
>   same-year group), on the premise that the bulk carried no within-thread
>   unit order. The premise was too narrow: the bulk `sequence` array
>   ("Ordered list of units for the subject sequence") interleaves years but
>   holds Oak's authored unit order WITHIN each year — verified against the
>   live API's `unitOrder` for 160 of 166 programme-years on 2026-09-03. The
>   six exceptions are KS4 years where several programmes (tiers, exam
>   subjects) share one array so the bulk order is a merge of their authored
>   orders, plus one primary-PE "All years" pair.
>   `unit.threads[].order` is the thread's display index (constant per
>   thread, verified across all 160 threads) and orders nothing.
> - **Sequences are now per (thread, subject).** Each sequence is one
>   thread's units within ONE subject in that subject's curriculum order —
>   years ascending across the primary and secondary phases, the bulk array's
>   order within a year, "All years" units after the year-placed ones. A
>   thread spanning subjects (21 of 160; 17 are the modern-language grammar
>   and skill threads shared by French, German and Spanish) emits one
>   sequence per subject, never an interleaved chain: Oak authors no order
>   across subjects. `GraphCorpusSequence` gains `subject`; corpus version
>   1.4.0 → 1.5.0. The thread-progressions view and `get-thread-progressions`
>   serve the same shape (`progressions[]`, one run per subject).
> - **Unit→lesson order joins the corpus (`unitLessonRuns`).** A unit's
>   lessons are a taught sequence, but only `sequence[].unitLessons[]` in the
>   bulk carries `lessonOrder` — the flat `lessons` array that builds the
>   `containsLesson` edges has no order field at all. The new
>   `GraphCorpusUnitLessonRun` section joins the two: membership comes from
>   the edge set (so a run can never disagree with it), order from the
>   variant listings. Membership had to come from the edges — of the two
>   sources, 79 (unit, lesson) placements appear only in the lesson records,
>   and 40 appear only in `unitLessons`, the latter naming lessons with no
>   lesson node, which would dangle.
> - **The lesson sort key is (min authored position, lesson id).** A unit node
>   merges its programme variants, and a variant may place one lesson at a
>   different position than another (172 of 13,964 pairs, median spread 1).
>   No single scalar satisfies every variant, so the minimum is taken: a
>   lesson never appears LATER than the curriculum places it in any
>   programme. Measured against every programme variant, the served order
>   inverts 75 of 56,238 comparable within-programme lesson pairs (0.13%),
>   against 25,945 (46.13%) for the id-sorted order it replaces. The residual
>   is structural — lessons genuinely holding different positions in
>   different programmes. `max`, `mean` and `first-seen` were measured too
>   and land within 0.06 percentage points of `min`; `min` was chosen on
>   explicability (an authored integer, not an invented average) and
>   `first-seen` rejected as dependent on file enumeration order. One caveat
>   on that rejection: `extractUnitLessons` already backfills a missing
>   `lessonOrder` with the bulk array index, so a lesson lacking an authored
>   position would receive a file-order one before the sort key ever sees it.
>   That path is inert on this snapshot (0 of 16,741 rows lack an order) and
>   is left as-is rather than changed under an ordering ticket; the new
>   `stats.unitsWithoutAuthoredLessonOrder` counter (0 here) makes the related
>   whole-unit case visible rather than silent.
> - **The alternative shape considered and rejected** was a discriminated
>   `GraphCorpusEdge` union carrying `order` on the `containsLesson` variant
>   alone. It satisfies the closed-shape rule equally, but forces every
>   existing consumer of the currently homogeneous edge array to narrow by
>   edge type for a field only one variant has. The additive section avoids
>   that blast radius, at the cost of serialising each unit→lesson pair twice
>   in `data.json` (once as an edge, once in a run) — 11,172 duplicated
>   placements, the same trade the `sequences` section already makes.
> - **`get-misconception-graph` consumes both ordered sections.** Its thread
>   anchor windows units by `sequences` and its unit entries list lessons by
>   `unitLessonRuns`. Estate-wide after the change: 1,484 of 1,484 units with
>   3+ lessons serve their authored order (0 alphabetical, from 1,435 where
>   the two differ), and 0 of 17 multi-subject threads interleave.
> - **Counts recomputed at amendment time** from the regenerated
>   `graph-corpus/data.json` (2026-09-03 bulk snapshot): 36,077 nodes
>   (unit 1,835; thread 160; lesson 10,941; misconception 10,937;
>   keyword 12,204), 67,346 edges (prerequisiteFor 2,881; containsUnit
>   3,975; containsLesson 11,172; addressesMisconception 10,937;
>   containsKeyword 38,381), 199 sequences over 160 threads, and 1,722
>   unit-lesson runs placing 11,172 lessons (exactly the containsLesson edge
>   count). Corpus version 1.4.0 → 1.5.0 covers both ordered sections.
>
> **Amendment (2026-06-11 — graph-tools-value-redesign, deliverable G4b).**
>
> - **Keywords join the one-graph corpus.** The keyword extraction that fed the
>   standalone `vocabulary-graph` dataset now ALSO emits into `graph-corpus`:
>   a `keyword` node kind (kind-qualified `keyword:<normalised-term>` ids,
>   lc+trim normalisation; display casing kept on the node; node `frequency` =
>   unique placing lessons) and `containsKeyword` lesson→keyword edges. Corpus
>   version 1.2.0 → 1.3.0 (additive).
> - **Keyword tool surface live.** The §3 Vocabulary Processor's deferred
>   `get-vocabulary-graph` is superseded by the live `get-keyword-graph`
>   aggregated tool: bounded anchored (subject + keyStage) frequency-ranked
>   retrieval over the corpus, disambiguated against the generated live-API
>   `get-keywords` in both tools' served descriptions.
> - **Counts recomputed at amendment time** from the regenerated
>   `graph-corpus/data.json` (2026-06-10 bulk snapshot): 40,016 nodes
>   (unit 1,624; thread 164; lesson 12,391; misconception 12,385;
>   keyword 13,452) and 75,571 edges (prerequisiteFor 3,452;
>   containsUnit 3,583; containsLesson 12,491; addressesMisconception
>   12,385; containsKeyword 43,660); zero dropped edges, zero dropped
>   duplicates.
>
> **Amendment (2026-06-10 — graph-tools-value-redesign, deliverable G1a).**
>
> - **§2 overturned for the one-graph corpus.** Decision A of the
>   graph-tools-value-redesign supersedes "explicit interface types first": the
>   new `graph-corpus` dataset emits types **computed from the extracted data at
>   generation time** (ADR-031), defined once in the generator and re-exported by
>   the dataset's `types.ts` — no hand-maintained interface runs parallel to the
>   generated corpus.
> - **§4 freeze cleared.** "No new MCP tools until search optimisation" is a
>   fossil; the bounded-retrieval graph tools are the current sanctioned work. The
>   per-tool "deferred until search optimisation" notes in §3 are superseded — tool
>   builds are gated on bounded-retrieval value and a named consumer, not on search
>   optimisation.
> - **§3 corrected.** `get-misconception-graph` is live; the `prerequisite-graph`
>   naming residue is reconciled to the live `prior-knowledge-graph` dataset/tool;
>   the one-graph `graph-corpus` dataset (unit nodes + prerequisiteFor edges,
>   materialised kind-qualified `unit:<slug>` ids) is the new foundation.
> - **Counts recomputed** against the 2026-05-21 bulk re-mine (validators
>   recompute, never copy snapshots).

## Context

Oak National Academy has unique, structured educational content in bulk download files (~630MB across 30 files) containing:

- 13,452 unique keywords with definitions
- 12,858 misconceptions with teacher responses
- 7,929 prior knowledge requirements
- 7,473 National Curriculum statements
- 164 curriculum threads with ordered unit progressions

(Counts from the 2026-05-21 bulk re-mine; the authoritative figures live in the regenerated datasets.)

This data enables user-valuable features like "What's the learning path for fractions?" and "What should I know before trigonometry?" - questions that AI agents need to answer for teachers, students, and curriculum planners.

### User Personas

All vocabulary mining work exists to serve these audiences:

| Persona                 | Context                | Primary Needs                                                    |
| ----------------------- | ---------------------- | ---------------------------------------------------------------- |
| **Student**             | Learning new concepts  | Clear definitions, learning paths, "what comes next"             |
| **Teacher**             | Lesson planning        | Vocabulary to introduce, misconceptions to address               |
| **School Leader**       | Curriculum planning    | NC coverage, progression mapping                                 |
| **Curriculum Planner**  | Strategic design       | Cross-subject vocabulary, prerequisite chains                    |
| **Parent (Homeschool)** | Supporting learning    | Clear structure, prerequisites                                   |
| **Adult Learner**       | Self-directed learning | Context-appropriate explanations, flexible paths                 |
| **AI Agent**            | Search & tutoring      | Query expansion, prerequisite reasoning, misconception detection |

### Forces

1. **User value first**: Raw extraction counts are not success metrics. Value comes from transformed, user-facing structures.
2. **MCP tool consumption**: AI agents need static graph data in structuredContent to reason about curriculum relationships.
3. **Repeatability**: The pipeline must be fully automated and idempotent (`pnpm vocab-gen`).
4. **TypeScript limitations**: Large literal types with `as const` exceed TypeScript's serialization limits (error TS7056).
5. **Pattern consistency**: New graph exports should follow established patterns (`knowledge-graph-data.ts`).

## Decision

### 1. Multi-Step Pipeline Architecture

The vocabulary mining pipeline is multi-step by design:

```text
POLICY FILTER → EXTRACTION (Exploratory) → PROCESSING (Value Creation) → OUTPUT (User-Facing)
```

- **Policy filter**: Exclude restricted lessons before any extraction
  (`excludeRestrictedLessons`, the MCP-204 filter decision — every run
  reports the excluded count)
- **Extraction**: Mine everything from the filtered bulk data speculatively
- **Processing**: Transform raw data into user-valuable structures
- **Output**: Generate static graph files for MCP tool consumption

### 2. Graph Export Pattern

All generated graphs follow a consistent pattern with these requirements:

1. **Types computed from the extracted data at generation time** (ADR-031) — defined once in the generator and re-exported by the dataset's `types.ts`, never a hand-maintained interface parallel to the generated data (graph-tools-value-redesign Decision A overturns the earlier "explicit interface types first")
2. **Typed export** using `: InterfaceName` annotation
3. **Version and source metadata** for reproducibility
4. **TSDoc documentation** for AI agent understanding
5. **Cross-references** to related MCP tools

#### For small graphs (< 5,000 lines):

```typescript
export const threadProgressionGraph = {
  version: '1.0.0',
  // ... data
} as const;

export type ThreadProgressionGraph = typeof threadProgressionGraph;
```

#### For large graphs (> 5,000 lines): JSON loader pattern

The canonical pattern for large datasets uses a three-file directory
structure. This supersedes the earlier monolithic typed-export approach
which embedded 100k+ line TypeScript data files in the source tree.

```text
vocabulary-graph/
├── data.json    ← Raw JSON data (JSON.stringify, 2-space indent)
├── types.ts     ← TypeScript interface definitions
└── index.ts     ← Typed loader using createRequire
```

The loader uses `createRequire` to load JSON in ESM and re-exports
typed data:

```typescript
// index.ts
import { createRequire } from 'node:module';
import type { VocabularyGraph } from './types.js';

const require = createRequire(import.meta.url);
const data: VocabularyGraph = require('./data.json');

export const vocabularyGraph: VocabularyGraph = data;
export type { VocabularyGraph } from './types.js';
```

When the dataset contains union-literal fields (e.g., `rel:
'prerequisiteFor'`), the loader must include runtime validation to
narrow the JSON strings to the published literal types. See
`prior-knowledge-graph/index.ts` for the two-step validation pattern.

The generic `writeJsonDataset` function in
`packages/sdks/oak-sdk-codegen/src/bulk/generators/write-json-dataset.ts`
handles the mechanical directory creation and three-file write. Each
dataset provides its own `JsonDatasetDescriptor` with the types and
loader content.

Datasets using this pattern: prior-knowledge-graph, graph-corpus,
vocabulary-graph, misconception-graph, nc-coverage-graph.

### 3. Generator Specifications

Each generator serves specific user personas with measurable impact:

#### Thread Progression Generator ✅ COMPLETE

| Aspect        | Details                                                                                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Audiences** | Student, Teacher, Curriculum Planner, AI Agent                                                                                                                           |
| **User Need** | "What's the learning path for X?"                                                                                                                                        |
| **Impact**    | Enables clear progression through curriculum threads across years. Students see what comes next; teachers plan multi-year curricula; AI agents recommend learning paths. |
| **Output**    | `thread-progression-data.ts` (threads across all 16 subjects; counts are dynamic in generated data)                                                                      |
| **MCP Tool**  | `get-thread-progressions`                                                                                                                                                |

#### Prior Knowledge Graph Generator ✅ COMPLETE

| Aspect        | Details                                                                                                                                                                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Audiences** | Student, Teacher, Parent, AI Agent                                                                                                                                                                                                            |
| **User Need** | "What should I know before this?"                                                                                                                                                                                                             |
| **Impact**    | Enables learning path planning. Students identify gaps; teachers diagnose readiness; parents plan homeschool curricula; AI agents check prerequisites before recommending content.                                                            |
| **Output**    | `prior-knowledge-graph/` (JSON loader; 1607 units, 3452 edges). The one-graph `graph-corpus/` dataset (1612 unit nodes, 3452 prerequisiteFor edges, materialised `unit:<slug>` ids, zero dangling endpoints) supersedes it for bounded views. |
| **MCP Tool**  | `get-prior-knowledge-graph`                                                                                                                                                                                                                   |

#### Misconception Graph Generator ✅ COMPLETE

| Aspect        | Details                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Audiences** | Teacher, AI Agent                                                                                                                   |
| **User Need** | "What mistakes should I watch for?"                                                                                                 |
| **Impact**    | Enables proactive error prevention. Teachers prepare for common mistakes; AI tutors detect and address misconceptions in real-time. |
| **Output**    | `misconception-graph/` (JSON loader; 12,858 misconceptions)                                                                         |
| **MCP Tool**  | `get-misconception-graph` (live)                                                                                                    |

#### Vocabulary Processor ✅ COMPLETE

| Aspect        | Details                                                                                                                                                                                                                                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Audiences** | Student, Teacher, AI Agent                                                                                                                                                                                                                                                                                                                                         |
| **User Need** | "What does X mean?" "When is Y introduced?"                                                                                                                                                                                                                                                                                                                        |
| **Impact**    | Curated glossary enables clear definitions. Students get age-appropriate explanations; teachers know when terms are introduced; AI agents provide accurate vocabulary context.                                                                                                                                                                                     |
| **Output**    | `vocabulary-graph/` (JSON loader; 13,452 terms across 20 subjects). The one-graph `graph-corpus/` dataset carries the same terms as `keyword` nodes with `containsKeyword` lesson edges (v1.3.0) for bounded views.                                                                                                                                                |
| **MCP Tool**  | `get-keyword-graph` (live, 2026-06-11 — bounded anchored frequency-ranked retrieval over the corpus; supersedes the deferred `get-vocabulary-graph`). The generated `get-keywords` remains the live-API surface (server-paginated since upstream spec 0.7.x, 2026-07 — its description carries the paging guidance); the two descriptions disambiguate each other. |

#### Synonym Miner ✅ COMPLETE

| Aspect        | Details                                                                                                                                                        |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Audiences** | AI Agent, Search System                                                                                                                                        |
| **User Need** | "Find lessons about [synonym]"                                                                                                                                 |
| **Impact**    | Enables query expansion for search. User queries match curriculum content even with different wording. Improves search recall without manual synonym curation. |
| **Output**    | `synonyms/definition-synonyms.ts` (397 mined entries supplementing curated synonyms)                                                                           |
| **MCP Tool**  | None (feeds into search directly)                                                                                                                              |

#### NC Coverage Generator ✅ COMPLETE

| Aspect        | Details                                                                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Audiences** | School Leader, Curriculum Planner                                                                                                                                |
| **User Need** | "Does this cover the NC?" "What NC gaps exist?"                                                                                                                  |
| **Impact**    | Enables curriculum gap analysis. School leaders verify coverage; curriculum planners identify missing areas; MAT coordinators ensure consistency across schools. |
| **Output**    | `nc-coverage-graph/` (JSON loader; 7,473 NC statements across units)                                                                                             |
| **MCP Tool**  | `get-nc-coverage-graph` (deferred until search optimisation complete)                                                                                            |

### 4. MCP Tool Integration

Tools return graph data in `structuredContent` for AI agent reasoning.

The earlier freeze — "No new MCP tools until search optimisation is complete" — is **cleared** (2026-06-10). The bounded-retrieval graph tools are the current sanctioned work; tool builds are gated on bounded-retrieval value and a named consumer per the graph-tools-value-redesign, not on search optimisation. Bounded tools return the relevant anchored subset, never a whole corpus.

### 5. Pipeline Location

The `vocab-gen/` pipeline lives in `oak-sdk-codegen` alongside
`code-generation/`:

```text
packages/sdks/oak-sdk-codegen/
├── code-generation/           ← Generates types from OpenAPI
├── vocab-gen/                 ← Generates graphs from bulk data
│   ├── lib/                   ← Bulk file reading
│   ├── vocab-gen.ts           ← Pipeline entry point
│   └── vocab-gen-core.ts      ← Data processing core
├── src/bulk/
│   ├── extractors/            ← Pure functions, one per data type
│   └── generators/            ← Transform extracted data to graphs
└── src/generated/vocab/
    ├── thread-progression-data.ts    ← Generated (as const)
    ├── prior-knowledge-graph/        ← Generated (JSON loader)
    ├── graph-corpus/                 ← Generated (one-graph corpus; JSON loader)
    ├── vocabulary-graph/             ← Generated (JSON loader)
    ├── misconception-graph/          ← Generated (JSON loader)
    └── nc-coverage-graph/            ← Generated (JSON loader)
```

## Rationale

1. **Explicit interfaces for large graphs** solve TypeScript error TS7056 which occurs when the compiler tries to serialize literal types exceeding its maximum length. This is a documented TypeScript limitation with large `as const` structures.

2. **Multi-step pipeline** separates concerns: extractors are pure functions tested in isolation; generators transform to user-valuable output; writers handle serialization.

3. **SDK location** follows the pattern of `code-generation/` - both generate static artifacts consumed by the runtime.

4. **MCP tool integration** ensures AI agents can answer user questions about curriculum structure and prerequisites.

## Consequences

### Positive

- AI agents can answer "what comes before?" and "what's the learning path?" questions
- Pipeline is fully repeatable via `pnpm vocab-gen`
- Generated graphs have consistent structure following established patterns
- TypeScript compilation succeeds for graphs of any size

### Negative

- Large graph exports lose some type inference benefits (no literal types for property values)
- Two different patterns needed based on graph size (small uses `as const`, large uses JSON loader)
- JSON data files must be copied to `dist/` during build (handled by `copy-json-assets.ts`)

### Neutral

- Graphs must be regenerated when bulk download data updates
- MCP tools must be registered manually in `AGGREGATED_TOOL_DEFS`

## Related

- [ADR-059: Knowledge Graph for Agent Context](059-knowledge-graph-for-agent-context.md) - Original graph pattern
- 02b-vocabulary-mining.md - Full pipeline specification
- [TypeScript Issue #26979](https://github.com/microsoft/TypeScript/issues/26979) - Type inference performance with large literals
