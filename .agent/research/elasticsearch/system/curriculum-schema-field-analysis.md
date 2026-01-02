# Curriculum Schema Field Analysis for Search Enhancement

**Date**: 2025-12-08
**Status**: REFERENCE DOCUMENT
**Purpose**: Document available API schema fields and their search value

---

## Executive Summary

The Oak Curriculum API schema (`api-schema-sdk.json`) contains **rich pedagogical metadata** that is not currently indexed for search. This document catalogs available fields, assesses their search value, and maps them to implementation phases.

**Key Finding**: The schema provides expert-curated curriculum data that could significantly enhance search relevance and enable new features without any external API dependencies.

---

## Schema Analysis by Entity Type

### Lesson-Level Fields

#### Currently Indexed ✅

| Field                                             | Type     | Search Use           |
| ------------------------------------------------- | -------- | -------------------- |
| `lessonTitle`                                     | string   | Text search, suggest |
| `lessonSlug`                                      | string   | ID, URL              |
| `lessonKeywords[].keyword`                        | string[] | Keyword search       |
| `keyLearningPoints[].keyLearningPoint`            | string[] | Text search          |
| `misconceptionsAndCommonMistakes[].misconception` | string[] | Text search          |
| `teacherTips[].teacherTip`                        | string[] | Text search          |
| `contentGuidance`                                 | array    | Basic text           |
| `transcript`                                      | string   | Full-text search     |

#### Available But NOT Indexed 📋

| Field                                          | Type           | Schema Location | Search Value | Implementation Phase |
| ---------------------------------------------- | -------------- | --------------- | ------------ | -------------------- |
| `lessonKeywords[].description`                 | string         | L5915-5935      | ⭐⭐⭐⭐⭐   | **1A** (embeddings)  |
| `pupilLessonOutcome`                           | string         | L5972-5975      | ⭐⭐⭐⭐     | 2B                   |
| `misconceptions[].response`                    | string         | L5963           | ⭐⭐⭐       | 2B                   |
| `contentGuidance[].contentGuidanceArea`        | string         | L5999-6001      | ⭐⭐         | 2B                   |
| `contentGuidance[].supervisionlevel_id`        | number         | L6003-6005      | ⭐⭐         | 2B                   |
| `contentGuidance[].contentGuidanceDescription` | string         | L6011-6014      | ⭐⭐         | 2B                   |
| `supervisionLevel`                             | string\|null   | L6030-6039      | ⭐⭐         | 2B                   |
| `downloadsAvailable`                           | boolean        | L6041-6044      | ⭐           | 2B                   |
| `starterQuiz`                                  | QuizQuestion[] | L5400           | ⭐⭐⭐⭐     | 2B                   |
| `exitQuiz`                                     | QuizQuestion[] | L5402           | ⭐⭐⭐⭐     | 2B                   |

### Unit-Level Fields

#### Currently Indexed ✅

| Field         | Type   | Search Use  |
| ------------- | ------ | ----------- |
| `unitTitle`   | string | Text search |
| `unitSlug`    | string | ID          |
| `yearSlug`    | string | Filtering   |
| `categories`  | array  | Faceting    |
| `unitLessons` | array  | Rollup      |

#### Available But NOT Indexed 📋

| Field                        | Type     | Schema Location | Search Value | Implementation Phase |
| ---------------------------- | -------- | --------------- | ------------ | -------------------- |
| `priorKnowledgeRequirements` | string[] | L6275-6286      | ⭐⭐⭐⭐⭐   | **2A** (graph)       |
| `nationalCurriculumContent`  | string[] | L6287-6298      | ⭐⭐⭐⭐⭐   | **2B**               |
| `whyThisWhyNow`              | string   | L6299-6302      | ⭐⭐⭐       | 2B                   |
| `threads`                    | Thread[] | L6303-6331      | ⭐⭐⭐⭐⭐   | **2A** (graph)       |
| `notes`                      | string   | L6267-6269      | ⭐⭐         | 2B                   |
| `description`                | string   | L6271-6273      | ⭐⭐         | 2B                   |

### Bulk Download Extras and Graph Exports (Not Yet Indexed)

The bulk download and vocab-gen pipeline surface additional datasets and fields that are not indexed.

#### Graph-derived datasets not indexed

| Data Type | Extracted Count | Source | Potential Use |
| --------- | --------------- | ------ | ------------- |
| Keywords with definitions | 13,349 | `vocabulary-graph-data.ts` | Glossary index, definition lookup |
| Misconceptions with responses | 12,777 | `misconception-graph-data.ts` | Teacher guidance search |
| National curriculum statements | 7,454 | `nc-coverage-graph-data.ts` | Standards coverage search |
| Prior knowledge requirements | 7,881 | `prerequisite-graph-data.ts` | Prerequisite queries |
| Unit prerequisite edges | 3,408 edges | `prerequisite-graph-data.ts` | Learning-path traversal |
| Thread progressions | 164 | Thread tooling | Progression queries |

#### Bulk-only fields not currently mined

| Field | Structure | Potential Use |
| ----- | --------- | ------------- |
| `transcript_sentences` | Array of time-coded sentences | Time-based video search, synonym mining |
| `transcript_vtt` | WebVTT subtitle format | Transcript search, chaptering |
| `unitLessons[].lessonOrder` | Sequence order | Lesson flow queries |
| `threads[].order` | Thread ordering | Progression queries |
| `description` (units) | Rich text | Semantic recall for units |
| `whyThisWhyNow` | Rationale text | "Why teach this?" intent queries |

#### Extracted but under-used

- `teacherTips` and `keyLearningPoints` are indexed as arrays but not leveraged for intent-based ranking.
- `lessonKeywords[].description` contains definition text that can drive glossary and synonym work.

### Quiz Data Structure

```typescript
// From api-schema-sdk.json L5400-5746
interface QuizQuestion {
  question: string; // ← Searchable assessment text
  questionType: 'multiple-choice' | 'short-answer' | 'match' | 'order';
  questionImage?: ImageContent;
  answers: QuizAnswer[]; // Contains correct answers and distractors
}
```

### Thread Structure

```typescript
// From api-schema-sdk.json L6303-6331
interface Thread {
  slug: string; // 'number-multiplication-and-division'
  title: string; // 'Number: Multiplication and division'
  order: number; // Position in curriculum sequence
}
```

---

## Feature Value Assessment

### Tier 1: Highest Search Value (Must Implement)

#### 1. `lessonKeywords[].description` ⭐⭐⭐⭐⭐

**Why**: Expert-curated definitions improve semantic search accuracy for curriculum-specific terminology.

**Example**:

```json
{
  "keyword": "quadratic equations",
  "description": "An equation where the highest power of the variable is 2, in the form ax² + bx + c = 0"
}
```

**Implementation**:

- Phase 1A: Include in embedding text (`prepareTextForEmbedding`)
- Phase 1C: Store nested objects for glossary features
- Phase 2B: Create `oak_curriculum_glossary` index

**Search Enhancement**: "What is a quadratic equation?" → Returns lessons with definition context

#### 2. `priorKnowledgeRequirements` ⭐⭐⭐⭐⭐

**Why**: Enables prerequisite-based search and learning progression discovery.

**Example**:

```json
[
  "A simple sentence is about one idea and makes complete sense.",
  "Any simple sentence contains one verb and at least one noun.",
  "Two simple sentences can be joined with a co-ordinating conjunction."
]
```

**Implementation**:

- Phase 2A: Store as searchable array + include in embeddings
- Phase 2B: Create prerequisite graph edges
- Phase 4: Multi-hop pathway discovery

**Search Enhancement**: "What do students need to know before learning X?" → Returns prerequisite chain

#### 3. `nationalCurriculumContent` ⭐⭐⭐⭐⭐

**Why**: Standards alignment is critical for teacher planning and compliance.

**Example**:

```json
[
  "Ask relevant questions to extend their understanding and knowledge",
  "Articulate and justify answers, arguments and opinions",
  "Speak audibly and fluently with an increasing command of Standard English"
]
```

**Implementation**:

- Phase 2B: Store as keyword array for exact matching + text for semantic
- Enable: "Which lessons cover [curriculum objective]?" queries
- Enable: Coverage analysis aggregations

**Search Enhancement**: Find lessons by curriculum standard ID or statement text

#### 4. `threads` ⭐⭐⭐⭐⭐

**Why**: Natural knowledge graph structure for curriculum coherence.

**Example**:

```json
[
  {
    "slug": "developing-grammatical-knowledge",
    "title": "Developing grammatical knowledge",
    "order": 10
  }
]
```

**Implementation**:

- Phase 2A: Store thread associations on lessons/units
- Phase 2B: Create `oak_threads` index with aggregated counts
- Phase 4: Graph edges: thread → units → lessons

**Search Enhancement**: "Show all units in the 'Number' thread" → Cross-unit progression

### Tier 2: High Search Value (Should Implement)

#### 5. `pupilLessonOutcome` ⭐⭐⭐⭐

**Why**: Teachers search by learning outcomes - "I can..." statements.

**Example**: `"I can join two simple sentences with 'and'."`

**Implementation**:

- Phase 2B: Dedicated text field + keyword for exact matching
- Include in embeddings for semantic similarity

**Search Enhancement**: "Lessons where students learn to [outcome]"

#### 6. Quiz Content (`starterQuiz`, `exitQuiz`) ⭐⭐⭐⭐

**Why**: Turns search into assessment discovery tool.

**Example**:

```json
{
  "question": "Match the number to its written representation.",
  "questionType": "match",
  "answers": [...]
}
```

**Implementation**:

- Phase 2B: Extract question text into searchable array
- Store question counts by type for filtering
- Enable: "Find lessons with multiple-choice questions on fractions"

**Search Enhancement**: Search assessment content directly

#### 7. `misconceptions[].response` ⭐⭐⭐

**Why**: Currently only indexing misconception, but the teacher response is equally valuable.

**Example**:

```json
{
  "misconception": "Pupils may struggle to link related ideas together.",
  "response": "Give some non-examples to show what it sounds like when two ideas are unrelated."
}
```

**Implementation**:

- Phase 2B: Include response text in current misconception indexing
- Store as nested objects for structured display

**Search Enhancement**: "How do I address [misconception]?" → Returns teaching strategies

### Tier 3: Enhancement Value (Nice to Have)

#### 8. `whyThisWhyNow` ⭐⭐⭐

**Why**: Pedagogical context for curriculum design.

**Example**: `"An explanation of where the unit sits within the sequence and why..."`

**Implementation**:

- Phase 2B: Include in unit embeddings
- Phase 3: RAG context enhancement

#### 9. `contentGuidance` (structured) ⭐⭐

**Why**: Safeguarding and content safety filtering.

**Implementation**:

- Phase 2B: Store as nested objects
- Enable: Filter by supervision level
- Enable: Content warning search/filter

#### 10. `notes` and `description` ⭐⭐

**Why**: Additional unit context.

**Implementation**:

- Phase 2B: Include in embeddings

---

## Implementation Mapping

### Phase 1A (Current)

| Field                          | Action                                                          |
| ------------------------------ | --------------------------------------------------------------- |
| `lessonKeywords[].description` | Include in `prepareTextForEmbedding()` for richer dense vectors |

### Phase 1C (Ingestion)

| Field                           | Action                                       |
| ------------------------------- | -------------------------------------------- |
| `lessonKeywords` (full objects) | Store as nested for future glossary features |

### Phase 2A (Entity & Graph)

| Field                        | Action                                  |
| ---------------------------- | --------------------------------------- |
| `priorKnowledgeRequirements` | Index for prerequisite graph edges      |
| `threads`                    | Store associations, use for graph edges |

### Phase 2B (Reference Indices)

| Field                          | Action                                    |
| ------------------------------ | ----------------------------------------- |
| `pupilLessonOutcome`           | Dedicated searchable field                |
| `nationalCurriculumContent`    | Keyword + text field for standards search |
| `whyThisWhyNow`                | Include in embeddings                     |
| `starterQuiz`, `exitQuiz`      | Extract question text, count by type      |
| `misconceptions[].response`    | Include in misconception indexing         |
| `contentGuidance` (structured) | Nested objects with supervision level     |
| `notes`, `description`         | Include in embeddings                     |
| `threads`                      | Create `oak_threads` reference index      |

### Phase 3 (RAG)

| Field                        | Action                             |
| ---------------------------- | ---------------------------------- |
| `priorKnowledgeRequirements` | Include in RAG context             |
| `whyThisWhyNow`              | Include in RAG context             |
| Quiz content                 | Answer validation in RAG responses |

### Phase 4 (Knowledge Graph)

| Field                        | Action                                     |
| ---------------------------- | ------------------------------------------ |
| `priorKnowledgeRequirements` | Generate prerequisite relationship triples |
| `threads`                    | Generate thread progression triples        |
| `nationalCurriculumContent`  | Link to curriculum standard entities       |

---

## Reference Indices (Proposed)

These indices turn graph exports into first-class search surfaces.

### `oak_curriculum_glossary`

```typescript
interface GlossaryDocument {
  term: string;
  definition: string;
  subjects: string[];
  key_stages: string[];
  first_year: number;
  frequency: number;
  value_score: number;
  is_cross_subject: boolean;
  lesson_slugs: string[];
  definition_semantic?: string;
}
```

### `oak_misconceptions`

```typescript
interface MisconceptionDocument {
  misconception: string;
  response: string;
  lesson_slug: string;
  lesson_title: string;
  unit_slug: string;
  subject: string;
  key_stage: string;
  year: number;
  misconception_semantic?: string;
}
```

### `oak_nc_coverage`

```typescript
interface NCCoverageDocument {
  statement: string;
  statement_id: string;
  subject: string;
  key_stage: string;
  unit_slugs: string[];
  lesson_slugs: string[];
  coverage_depth: number;
  statement_semantic?: string;
}
```

### `oak_prerequisites`

```typescript
interface PrerequisiteEdgeDocument {
  from_unit: string;
  to_unit: string;
  from_title: string;
  to_title: string;
  subject: string;
  thread_slug?: string;
  edge_type: 'explicit' | 'thread_sequence' | 'prior_knowledge';
}
```

### Priority Summary

| Opportunity | Impact | Effort | Priority |
| ----------- | ------ | ------ | -------- |
| Glossary index | High | Medium | High |
| Misconception index | High | Medium | High |
| NC coverage index | Medium | Medium | Medium |
| Prerequisite edge index | Medium | Medium | Medium |

---

## Schema References

All line numbers refer to `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json`:

- **LessonSummaryResponseSchema**: L5884-6122
- **UnitSummaryResponseSchema**: L6222-6447
- **QuizQuestion types**: L5400-5746
- **lessonKeywords**: L5915-5935
- **priorKnowledgeRequirements**: L6275-6286
- **nationalCurriculumContent**: L6287-6298
- **threads**: L6303-6331
- **TranscriptResponseSchema**: L2366-2391

---

## Key Insight

The Oak Curriculum API already provides **expert-curated pedagogical metadata** that outperforms generic AI-generated content:

1. **Curriculum vocabulary with definitions** → Better than AI-generated keyword extraction
2. **Prior knowledge requirements** → Better than AI-inferred prerequisites
3. **National curriculum alignment** → Authoritative standards mapping
4. **Thread structure** → Pre-defined curriculum coherence

**All of this flows from the SDK at type-gen time** - zero external API dependencies, zero additional cost.

---

## Related Documents

- **Implementation Plan**: `.agent/plans/semantic-search/maths-ks4-implementation-plan.md`
- **Feature Matrix**: `.agent/plans/semantic-search/es-serverless-feature-matrix.md`
- **Data Policy**: `.agent/plans/semantic-search/data-completeness-policy.md`
- **API Schema**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json`

---

**End of Schema Analysis**
