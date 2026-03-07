# Bulk Metadata Opportunities

**Boundary**: vocabulary-and-semantic-assets  
**Status**: Research  
**Last Updated**: 6 March 2026

---

## Scope

This document audits lesson and unit signals in the bulk-download pipeline and
answers:

- which fields exist in bulk data
- which fields are indexed, flattened, mined, or ignored
- which fields are already extractable but not wired into the main mining path
- which unit-level enrichments can be constructed from lesson data

It does **not** decide query-routing policy or execution sequence.

---

## Executive Summary

The bulk schema is richer than the current runtime surfaces.

- Lessons contain structured keyword definitions, misconception responses,
  content-guidance detail, transcript formats, and operational metadata that are
  not all preserved as first-class assets.
- Units contain pedagogical, sequencing, and KS4 metadata that is only partly
  reflected in the indexed or mined outputs.
- The repo already contains more extractors than the main `processBulkData()`
  pipeline uses.
- There is a second-order opportunity to build much better unit documents from
  the lesson signals we already have.

---

## Second Pass: Bulk Call Chain

The current bulk-first path from CLI to per-resource transformation is:

```text
pnpm es:ingest
  → createProgram() in ingest-cli-program.ts
  → executeBulkIngestion() in ingest-bulk.ts
  → prepareBulkIngestion() in bulk-ingestion.ts
  → readAllBulkFiles() in @oaknational/sdk-codegen/bulk/reader.ts
  → collectPhaseResults() in bulk-ingestion-phases.ts
    → createHybridDataSource() per bulk file
      → createBulkDataAdapter()
        → transformBulkLessonToESDoc()
        → transformBulkUnitToESDoc()
      → buildRollupDocs()
    → extractThreadsFromBulkFiles()
    → buildSequenceBulkOperations()
    → createVocabularyMiningAdapter()
      → processBulkData()
        → lesson/unit extractors
  → filterOperationsByIndex()
  → dispatchBulk()
```

This matters because the mining and indexing paths are related but not
identical. A field may be:

- present in the bulk schema
- used in a lesson or unit summary
- dropped from the indexed document
- never included in the mining outputs

---

## Lesson Signals

### Current State

Lessons in bulk currently include:

- `lessonKeywords[]` with `keyword` + `description`
- `keyLearningPoints[]`
- `misconceptionsAndCommonMistakes[]` with `misconception` + `response`
- `pupilLessonOutcome`
- `teacherTips[]`
- `contentGuidance[]`
- `supervisionLevel`
- `downloadsavailable`
- `transcript_sentences`
- `transcript_vtt`

Current live usage is mixed:

- indexed as flattened lesson fields:
  - keyword terms
  - learning-point text
  - misconception text
  - teacher-tip text
  - content-guidance labels
  - transcript text
  - pupil outcome
  - supervision level
  - downloads available
- used in lesson semantic summaries:
  - keyword definitions
  - misconception responses
- mined in `processBulkData()`:
  - keywords
  - misconceptions
  - learning points
  - teacher tips

### Under-used Lesson Signals

| Signal | Current Use | Gap |
|--------|-------------|-----|
| `lessonKeywords[].description` | Semantic summary, keyword extractor source | Not retained as a first-class searchable asset |
| `misconceptionsAndCommonMistakes[].response` | Semantic summary only | Not searchable as guidance |
| `contentGuidance[].contentGuidanceArea` | Dropped | No topical or safeguarding grouping |
| `contentGuidance[].contentGuidanceDescription` | Dropped | No detailed guidance retrieval |
| `contentGuidance[].supervisionlevel_id` | Dropped | No structured supervision semantics |
| `transcript_vtt` | Dropped | No caption- or timing-aware downstream use |
| Transcript coverage itself | Implicit only | No quality or suggestion feature built from it |

### Lesson Extractors That Exist But Are Not Centralised In `processBulkData()`

The extractor directory already contains richer paths than the current main
mining result publishes, including extractors for:

- content guidance
- pupil outcomes
- transcripts
- year/phase info

That is an opportunity to widen the mining outputs without inventing a new
pipeline from scratch.

---

## Unit Signals

### Current State

Units in bulk currently include:

- `threads[]`
- `priorKnowledgeRequirements[]`
- `nationalCurriculumContent[]`
- `description`
- `whyThisWhyNow`
- `unitLessons[]` with `lessonOrder` and `state`
- optional `examBoards[]`

Current live usage is stronger than on lessons:

- indexed on units or rollups:
  - threads
  - prior knowledge
  - national curriculum content
  - description
  - `whyThisWhyNow`
- mined in `processBulkData()`:
  - prior knowledge
  - NC statements
  - threads

### Under-used Unit Signals

| Signal | Current Use | Gap |
|--------|-------------|-----|
| `unitLessons[].lessonOrder` | Indirectly available only | No ordered unit-path or lesson-flow surface |
| `unitLessons[].state` | Dropped | No publication or readiness analysis surface |
| `examBoards[]` | Mostly ignored in bulk transforms | No bulk-native exam-board asset or validation source |
| `description` and `whyThisWhyNow` in mining | Indexed, but not mined as reusable asset sets | No reusable rationale/overview asset |

---

## Constructable Unit Enrichments From Lesson Data

These do **not** require new upstream fields. They can be constructed from the
existing unit plus its member lessons:

- aggregated lesson keyword terms
- aggregated lesson keyword definitions
- aggregated learning points
- aggregated misconceptions plus responses
- aggregated teacher tips
- aggregated pupil outcomes
- aggregated content-guidance labels, areas, and descriptions
- transcript coverage ratio
- download coverage ratio
- ordered lesson-path summary from lesson titles and `lessonOrder`

This is the clearest answer to “are we getting the most out of unit data?”:
no, not yet. We use some unit-native fields, but we are not yet synthesising the
lesson pedagogy into a richer unit-level retrieval surface.

Boundary note: this document owns the evidence that these assets are
constructable. See
[../04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md](../04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md)
for how Boundary 04 could consume them as retrieval surfaces.

---

## Existing But Partially Wired Paths

### Category Supplementation

The category-supplementation machinery exists and unit/sequence transformers can
accept category maps, but the active bulk-first ingestion path does not yet
build and pass that map through the whole flow. That means `unit_topics` and
sequence category coverage remain weaker than the architecture intends.

### Rollups

`buildRollupDocs()` currently leans on lesson transcripts plus unit-native
fields. It does not yet aggregate the richer lesson pedagogy listed above.

---

## Highest-Leverage Opportunities

These are opportunity signals for plan promotion, not committed backlog items.

1. Promote structured lesson metadata into first-class assets, not just summary
   text.
2. Wire the existing orphan extractors into the main mined output shape.
3. Build richer unit summaries from lesson pedagogy and ordered lesson flow.
4. Complete the category-supplementation path in bulk-first ingestion.
5. Use unit-native `examBoards` as bulk evidence rather than relying only on
   downstream supplementation.

---

## Operational Impact

- More fields and derived assets increase mapping and re-index cost.
- Structured fields require clear provenance and versioning.
- Some assets belong in dedicated indices rather than bloating lesson documents.
- Query policy should decide when specialised surfaces are used; this document
  only identifies the raw opportunities.

---

## Confidence Summary

| Finding | Confidence | Evidence |
|---------|------------|----------|
| Lesson schema is richer than current first-class surfaces | High | Verified in generated bulk schema and lesson transforms |
| Unit schema is richer than current mined outputs | High | Verified in generated bulk schema and `processBulkData()` |
| Existing extractors are under-wired | High | Verified in extractor inventory vs `processBulkData()` |
| Better unit enrichments can be derived from lesson data | High | Verified from available lesson-unit joins in bulk transforms |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [vocabulary-mining.md](vocabulary-mining.md) | Current future plan for mining work |
| [vocabulary-glossary-and-mining-surfaces.research.md](vocabulary-glossary-and-mining-surfaces.research.md) | Asset surfaces that can consume these signals |
| [../04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md](../04-retrieval-quality-engine/thread-sequence-derived-surfaces.research.md) | Derived surfaces on thinner search targets |
| [ADR-089](../../../../../docs/architecture/architectural-decisions/089-index-everything-principle.md) | Architectural principle for indexing more signals |
| [ADR-093](../../../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) | Bulk-first ingestion contract |
