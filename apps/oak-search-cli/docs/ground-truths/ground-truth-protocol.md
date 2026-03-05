# Ground Truth Protocol

**Purpose**: Create and maintain ground truths that measure search quality across all indexes.

For the methodology rationale, see [ADR-106: Known-Answer-First Ground Truth Methodology](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md).

---

## Why Ground Truths Matter

Teachers use our search to find curriculum content. Ground truths test:

> **"If a teacher searches for X, do they get useful results?"**

Each ground truth is a known query with known expected results. The benchmark measures how well search performs against these expectations.

We test **our system** -- with **our data**, **our retrievers**, and **our configuration** -- not Elasticsearch in isolation.

---

## Core Protocol (All Indexes)

### Known-Answer-First Methodology

1. Find content in bulk data
2. Extract and understand what that content contains
3. Design a query around the content (NOT the title alone)
4. Test the query through the RRF pipeline
5. Capture results with relevance scores
6. Lock in or iterate

### Query Design Rules

Ask: **"What would a teacher actually type to find this content?"**

- 2-10 words
- Natural teacher vocabulary
- NO meta-phrases ("lessons on", "how to teach")
- NO redundant subject terms
- Must NOT just match the content title

### Relevance Scoring

| Score | Meaning                                         |
| ----- | ----------------------------------------------- |
| 3     | Direct match -- teaches exactly what query asks |
| 2     | Related -- covers topic but not directly        |
| 1     | Tangential -- mentions concept peripherally     |

### Common Mistakes

**Using raw ES queries**: Always test via the CLI search commands (`oaksearch search <scope>`), never `curl` against Elasticsearch directly.

**Matching on title**: Query "Brackets in equations" for content slug "brackets-in-equations" proves nothing. Use natural teacher vocabulary.

**Technical jargon**: "probabilities sum to one mutually exclusive" is not what a teacher types. "what is probability of all outcomes" is.

---

## Index: Lessons

**Index**: `oak_lessons` (12,833 documents)
**Ground truths**: 30 (one per subject-phase pair)
**Type**: `LessonGroundTruth`
**Baseline**: MRR=0.983, NDCG@10=0.944, P@3=0.767, R@10=1.000

### Running

```bash
cd apps/oak-search-cli

pnpm benchmark:lessons --all
pnpm benchmark:lessons -s maths -p secondary --review
oaksearch search lessons "expanding brackets algebra" --subject maths --key-stage ks3
```

### Search Architecture

4-way RRF hybrid search: BM25 + ELSER on both Content and Structure retrievers.

### Adding a Lesson Ground Truth

1. Choose subject-phase (check [queries-redesigned.md](./queries-redesigned.md))
2. Find a rich unit (5+ lessons) in bulk data:

   ```bash
   jq -r '.sequence[] | select(.unitLessons | length >= 5) |
     "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
     bulk-downloads/{subject}-{phase}.json | head -20
   ```

3. Pick a lesson and extract data:

   ```bash
   jq '.lessons[] | select(.lessonSlug == "LESSON-SLUG") | {
     slug: .lessonSlug, title: .lessonTitle, unit: .unitTitle,
     keyStage: .keyStageSlug, keywords: [.lessonKeywords[]?.keyword],
     keyLearning: [.keyLearningPoints[]?.keyLearningPoint]
   }' bulk-downloads/{subject}-{phase}.json
   ```

4. Design query, test, capture top 3 with scores
5. Create entry at `src/lib/search-quality/ground-truth/entries/{subject}-{phase}.ts`:

   ```typescript
   import type { LessonGroundTruth } from '../types';

   export const SUBJECT_PHASE: LessonGroundTruth = {
     subject: 'subject-slug',
     phase: 'primary',
     keyStage: 'ks2',
     query: 'the realistic teacher query',
     expectedRelevance: {
       'top-result-slug': 3,
       'second-result-slug': 2,
       'third-result-slug': 2,
     },
     description: 'Brief description explaining what the lesson teaches.',
   } as const;
   ```

6. Register in `ground-truth/index.ts`, run `pnpm type-check`, benchmark

### File Locations

| File                                               | Purpose                            |
| -------------------------------------------------- | ---------------------------------- |
| `src/lib/search-quality/ground-truth/entries/*.ts` | Ground truth definitions           |
| `src/lib/search-quality/ground-truth/types.ts`     | Type definitions (shared + lesson) |
| `src/lib/search-quality/ground-truth/index.ts`     | Exports and accessors              |
| CLI: `oaksearch search lessons`                    | Query testing via SDK              |
| `evaluation/analysis/benchmark-lessons.ts`         | Benchmark runner                   |
| `docs/ground-truths/queries-redesigned.md`         | Coverage tracking                  |

---

## Index: Units

**Index**: `oak_unit_rollup` (1,665 documents)
**Ground truths**: 2 (1 primary, 1 secondary)
**Type**: `UnitGroundTruth`
**Baseline**: MRR=1.000, NDCG@10=0.923, P@3=0.833, R@10=1.000

### Running

```bash
cd apps/oak-search-cli

pnpm benchmark:units --all
oaksearch search units "fractions year 5" --subject maths --key-stage ks2
```

### Search Architecture

4-way RRF hybrid search: BM25 + ELSER on Content and Structure retrievers.

### What Units Are

Units are collections of lessons organised around a topic. Key fields: `unit_title`, `unit_slug`, `description`, `why_this_why_now`, `lesson_count`, `thread_slugs`.

### Design Considerations

- Focus on multi-lesson concepts (not individual lesson topics)
- Planning-oriented queries: teachers search for units when planning delivery
- May include year/key stage context
- Units with descriptions and `why_this_why_now` text test semantic search

### Adding a Unit Ground Truth

Entry location: `src/lib/search-quality/ground-truth/units/entries/{subject}-{phase}.ts`

```bash
# Find units with enrichment data
jq -r '.sequence[] | select(.unitDescription != null) |
  "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/{subject}-{phase}.json | head -20
```

---

## Index: Threads

**Index**: `oak_threads` (164 documents)
**Ground truths**: 8 across 5 subjects (Maths, Science, English, Computing, Geography)
**Type**: `ThreadGroundTruth`
**Baseline**: MRR=0.938, NDCG@10=0.902, P@3=0.333, R@10=0.938
**Search**: SDK `searchThreads` (two-way RRF via `buildThreadRetriever`)
**CLI**: `oaksearch search threads`

### Running

```bash
cd apps/oak-search-cli

pnpm benchmark:threads --all
oaksearch search threads "algebra progression" --subject maths
```

### Search Architecture

2-way RRF hybrid search: BM25 on `thread_title` + ELSER on `thread_semantic`.

### What Threads Are

Threads are conceptual progression strands that run across units and years,
connecting units that build a common body of knowledge over time. They are
programme-agnostic: a single thread can span multiple programmes, key stages,
and years. Threads are the pedagogical backbone of Oak's curriculum -- they
show how ideas BUILD, not just what to teach.

Key fields: `thread_title`, `thread_slug`, `subject_slugs`, `unit_count`.
Predominantly Maths (~164 docs total, e.g., "Algebra" spans 118 units from
Reception to Year 11).

### Current Ground Truths

| Entry                           | Subject   | Query                                         | Primary target                                          |
| ------------------------------- | --------- | --------------------------------------------- | ------------------------------------------------------- |
| `maths.ts`                      | Maths     | `algebra equations progression`               | `algebra`                                               |
| `maths-fractions.ts`            | Maths     | `fractions progression primary maths`         | `number-fractions`                                      |
| `maths-geometry.ts`             | Maths     | `geometry shapes angles measurement`          | `geometry-and-measure`                                  |
| `science-forces.ts`             | Science   | `forces and motion physics progression`       | `bq11-physics-how-do-forces-make-things-happen`         |
| `science-chemical-reactions.ts` | Science   | `chemical reactions substances changing`      | `bq08-chemistry-how-can-substances-be-made-and-changed` |
| `english-fiction-writing.ts`    | English   | `fiction creative writing skills progression` | `developing-fiction-writing`                            |
| `computing-programming.ts`      | Computing | `programming coding skills progression`       | `programming`                                           |
| `geography-climate.ts`          | Geography | `climate weather patterns geography`          | `climate-and-weather`                                   |

### Design Considerations

- Progression-focused queries: "how does this concept develop across years?"
- May use curriculum vocabulary ("strand", "progression", "thread")
- No `phase` or `keyStage` -- threads span multiple by design
- With only 164 docs, GTs validate the retrieval pipeline more than ranking subtlety

### Adding a Thread Ground Truth

Entry location: `src/lib/search-quality/ground-truth/threads/entries/{subject}.ts`

```bash
# List threads from bulk data
jq -r '.threads[]? | "\(.threadSlug): \(.threadTitle) (\(.unitCount) units)"' \
  bulk-downloads/maths-*.json | sort -u | head -30
```

---

## Index: Sequences

**Index**: `oak_sequences` (30 documents)
**Ground truths**: 1 (maths secondary)
**Type**: `SequenceGroundTruth`
**Baseline** (1 query -- treat as mechanism check, not stable baseline): MRR=1.000, NDCG@10=1.000, P@3=0.333, R@10=1.000

### Running

```bash
cd apps/oak-search-cli

pnpm benchmark:sequences --all
oaksearch search sequences "secondary maths" --subject maths
```

### Search Architecture

2-way RRF hybrid search: BM25 on `sequence_title`, `category_titles`, `subject_title`, `phase_title` + ELSER on `sequence_semantic`.

### What Sequences Are

Sequences are API organizational structures for curriculum data storage
and retrieval. A sequence is a pragmatic grouping of units spanning
multiple key stages and years (e.g., "maths-primary" covers KS1 + KS2).
One sequence can generate many programme views -- the user-facing
curriculum pathways that teachers navigate by.

Key fields: `sequence_title`, `sequence_slug`, `subject_slug`,
`phase_slug`, `unit_slugs`, `category_titles`.

### The Filter vs Search Question

With only 30 documents, sequences may be better served by navigation/filters than free-text search. The GT validates that search works; in practice, sequences are likely a navigation/filter concern.

### Design Considerations

- Programme-level vocabulary: "curriculum", "programme", "sequence"
- Single-result expectation with such a small index
- GTs are mechanism checks, not ranking quality measures

### Adding a Sequence Ground Truth

Entry location: `src/lib/search-quality/ground-truth/sequences/entries/{subject}-{phase}.ts`

```bash
# List all sequences
jq -r '.sequences[]? | "\(.sequenceSlug): \(.sequenceTitle)"' \
  bulk-downloads/*.json | sort -u
```

---

## Related Documents

| Document                                                                                                 | Purpose                     |
| -------------------------------------------------------------------------------------------------------- | --------------------------- |
| [ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) | Methodology                 |
| [ADR-110](/docs/architecture/architectural-decisions/110-thread-search-architecture.md)                  | Thread search architecture  |
| [Semantic Search Architecture](/docs/agent-guidance/semantic-search-architecture.md)                     | Structure is the foundation |
| [queries-redesigned.md](./queries-redesigned.md)                                                         | Lessons coverage matrix     |
| [GROUND-TRUTH-GUIDE.md](/apps/oak-search-cli/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md)  | Design principles           |
