# Hybrid Field Strategy: Minimize Re-Uploads

**Date**: 2025-12-07  
**Status**: APPROVED - Ready for Implementation  
**Goal**: Add high-confidence Phase 2 fields NOW to avoid re-uploads  
**Approach**: TDD at all levels, schema-first architecture

---

## Executive Summary

To minimize re-ingestion cycles, we'll add **37 carefully selected Phase 2 fields** (20 unique + variations across 5 indexes) during the initial Maths KS4 upload. These fields are:

1. **Already in API responses** (tier, exam_board, pathway, threads)
2. **Easy to derive** (difficulty_level from tier, resource_types from components)
3. **Needed soon** (within 2-4 weeks for Phase 2 features)

**Result**: One upload now → Zero re-uploads for Phase 2 → Optional `_update_by_query` for Phase 4 AI features.

---

## Foundation Alignment ✅

This plan strictly adheres to:

1. **Schema-First** (`.agent/directives/schema-first-execution.md`):
   - ✅ All fields defined in SDK `field-definitions/curriculum.ts`
   - ✅ Zod schemas generated via `pnpm type-gen`
   - ✅ ES mappings generated from same source
   - ✅ Never edit generated files

2. **TDD** (`.agent/directives/testing-strategy.md`):
   - ✅ Write tests FIRST for all extraction functions
   - ✅ Red → Green → Refactor at unit level
   - ✅ Integration tests for document transforms
   - ✅ No type-only tests

3. **Quality Standards** (`.agent/directives/principles.md`):
   - ✅ No type shortcuts (`as`, `any`, `!`)
   - ✅ Pure extraction functions with unit tests
   - ✅ Functions ≤8 complexity
   - ✅ No unused code
   - ✅ All quality gates must pass

**Implementation must follow TDD at ALL steps** - see "Add extraction functions" section for RED → GREEN → REFACTOR sequence.

---

## Fields to Add NOW (Complete Inventory)

### Summary of Changes

| Index                 | Current Fields | Adding  | New Total | Phase 4 Deferred  |
| --------------------- | -------------- | ------- | --------- | ----------------- |
| `oak_lessons`         | 21             | +8      | **29**    | 8 more in Phase 4 |
| `oak_units`           | 16             | +8      | **24**    | 3 more in Phase 4 |
| `oak_unit_rollup`     | 18             | +10     | **28**    | 3 more in Phase 4 |
| `oak_sequences`       | 14             | +6      | **20**    | 2 more in Phase 4 |
| `oak_sequence_facets` | 13             | +5      | **18**    | 0 in Phase 4      |
| **TOTALS**            | **82**         | **+37** | **119**   | **16 deferred**   |

**Result**: After hybrid implementation, we'll have 119 fields across 5 indexes, with 16 AI/Graph fields deferred to Phase 4.

---

### All 5 Content Indexes Get These Core Fields (5 fields)

```typescript
// KS4 Programme Factors (from API)
tier: string; // 'foundation' | 'higher' | 'core'
exam_board: string; // 'AQA' | 'Edexcel' | 'OCR' | 'WJEC' | 'generic'
pathway: string; // e.g., "maths-secondary-ks4-higher"

// Derived/Computed
difficulty_level: number; // 1-10, initially derived from tier
estimated_duration_minutes: number; // Standard: lessons=60, varies by type
```

---

### Index-Specific Additions

#### `oak_lessons` (+8 fields → 29 total)

**Current** (21 fields): `lesson_id`, `lesson_slug`, `lesson_title`, `subject_slug`, `key_stage`, `years`, `unit_ids`, `unit_titles`, `unit_count`, `lesson_keywords`, `key_learning_points`, `misconceptions_and_common_mistakes`, `teacher_tips`, `content_guidance`, `transcript_text`, `lesson_semantic`, `lesson_url`, `unit_urls`, `thread_slugs`, `thread_titles`, `title_suggest`

**Adding** (8 fields):

```typescript
// Core (5 above) PLUS:
resource_types: string[]  // ['video', 'worksheet', 'quiz', 'slides']
prerequisite_lesson_ids: string[]  // Empty initially, populated in Phase 2
related_lesson_ids: string[]  // Empty initially, populated in Phase 2
```

**Phase 4 Deferred** (8 more): `ai_generated_summary`, `curriculum_concepts`, `difficulty_reasoning`, `mentions_entities`, `semantic_keywords`, `chunked_for_rag`, `chunk_count`, `teacher_rating_avg`, `usage_count` - see `phase-4-deferred-fields.md`

---

#### `oak_units` (+8 fields → 24 total)

**Current** (16 fields): `unit_id`, `unit_slug`, `unit_title`, `subject_slug`, `key_stage`, `years`, `lesson_ids`, `lesson_count`, `unit_topics`, `unit_url`, `subject_programmes_url`, `sequence_ids`, `thread_slugs`, `thread_titles`, `thread_orders`, `title_suggest`

**Adding** (8 fields):

```typescript
// Core (5 above) PLUS:
unit_type: string  // 'core' | 'support' | 'development' | 'extension'
assessment_included: boolean  // Check for quiz/assessment in lessons
prerequisite_unit_ids: string[]  // Empty initially
```

**Phase 4 Deferred** (3 more): `has_video_lessons`, `resource_count`, `primary_thread` - see `phase-4-deferred-fields.md`

---

#### `oak_unit_rollup` (+10 fields → 28 total)

**Current** (18 fields): Same as `oak_units` + `rollup_text`, `unit_semantic`

**Adding** (10 fields):

```typescript
// Same as oak_units (8 above) PLUS:
combined_misconceptions: string[]  // Aggregate from lessons
combined_keywords: string[]  // Aggregate from lessons
```

**Phase 4 Deferred** (3 more): Same as `oak_units` - see `phase-4-deferred-fields.md`

---

#### `oak_sequences` (+6 fields → 20 total)

**Current** (14 fields): `sequence_id`, `sequence_slug`, `sequence_title`, `subject_slug`, `subject_title`, `phase_slug`, `phase_title`, `category_titles`, `key_stages`, `years`, `unit_slugs`, `sequence_semantic`, `sequence_url`, `title_suggest`

**Adding** (6 fields):

```typescript
// Core (5 above) PLUS:
threads_covered: string[]  // From unit thread data
```

**Phase 4 Deferred** (2 more): `unit_count`, `sequence_order` - see `phase-4-deferred-fields.md`

---

#### `oak_sequence_facets` (+5 fields → 18 total)

**Current** (13 fields): `sequence_slug`, `subject_slug`, `phase_slug`, `phase_title`, `key_stages`, `key_stage_title`, `years`, `unit_slugs`, `unit_titles`, `unit_count`, `lesson_count`, `has_ks4_options`, `sequence_canonical_url`

**Adding** (5 fields):

```typescript
// Facet aggregations (NO core 5 fields - this is a navigation index)
tiers_available: string[]  // ['foundation', 'higher']
exam_boards_available: string[]  // Aggregated from sequences
pathways_available: string[]  // Available pathways
threads_available: string[]  // Available threads
lesson_count_by_thread: Record<string, number>  // {'algebra': 45, 'number': 67}
```

**Phase 4 Deferred**: None

---

## Data Sources for Each Field

### From API Responses (High Confidence)

| Field           | Source            | Extraction Logic                             |
| --------------- | ----------------- | -------------------------------------------- |
| `tier`          | Programme factors | `programme.tier` or infer from sequence slug |
| `exam_board`    | Programme factors | `programme.examBoard` or 'generic'           |
| `pathway`       | Programme slug    | `programme.slug`                             |
| `thread_slugs`  | Unit metadata     | `unit.threads[].slug`                        |
| `thread_titles` | Unit metadata     | `unit.threads[].title`                       |

### Computed/Derived (Medium Confidence)

| Field                        | Derivation             | Logic                                    |
| ---------------------------- | ---------------------- | ---------------------------------------- |
| `difficulty_level`           | From tier              | Foundation=3-5, Core=5-7, Higher=7-10    |
| `estimated_duration_minutes` | By content type        | Video lesson=60, Quiz=30, Worksheet=45   |
| `resource_types`             | From lesson components | Check for video, quiz, worksheet, slides |
| `assessment_included`        | From unit lessons      | Any lesson has quiz component            |
| `combined_misconceptions`    | Aggregate from lessons | Concat all lesson misconceptions         |
| `combined_keywords`          | Aggregate from lessons | Concat all lesson keywords               |

### Empty Initially, Populated in Phase 2 (Low Priority)

| Field                     | Population Strategy   | Phase                          |
| ------------------------- | --------------------- | ------------------------------ |
| `prerequisite_lesson_ids` | Manual curation or ML | Phase 2                        |
| `related_lesson_ids`      | Similarity search     | Phase 2                        |
| `prerequisite_unit_ids`   | Thread analysis       | Phase 2                        |
| `threads_covered`         | Aggregate from units  | Phase 2 (or Phase 1 if in API) |

---

## Implementation Checklist

### 1. Update Field Definitions (SDK)

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts`

**Current state**:

- `LESSONS_INDEX_FIELDS`: 21 fields (ends at line ~72)
- `UNITS_INDEX_FIELDS`: 16 fields (ends at line ~105)
- `UNIT_ROLLUP_INDEX_FIELDS`: 18 fields (ends at line ~136)
- `SEQUENCES_INDEX_FIELDS`: 14 fields (ends at line ~163)
- `SEQUENCE_FACETS_INDEX_FIELDS`: 13 fields (ends at line ~194)

**Changes** (append to each array, before `] as const;`):

```typescript
// ===== LESSONS_INDEX_FIELDS: Add these 8 fields at line ~72 =====
  { name: 'tier', zodType: 'string', optional: true },
  { name: 'exam_board', zodType: 'string', optional: true },
  { name: 'pathway', zodType: 'string', optional: true },
  { name: 'difficulty_level', zodType: 'number', optional: true },
  { name: 'estimated_duration_minutes', zodType: 'number', optional: true },
  { name: 'resource_types', zodType: 'array-string', optional: true },
  { name: 'prerequisite_lesson_ids', zodType: 'array-string', optional: true },
  { name: 'related_lesson_ids', zodType: 'array-string', optional: true },

// ===== UNITS_INDEX_FIELDS: Add these 8 fields at line ~105 =====
  { name: 'tier', zodType: 'string', optional: true },
  { name: 'exam_board', zodType: 'string', optional: true },
  { name: 'pathway', zodType: 'string', optional: true },
  { name: 'difficulty_level', zodType: 'number', optional: true },
  { name: 'estimated_duration_minutes', zodType: 'number', optional: true },
  { name: 'unit_type', zodType: 'string', optional: true },
  { name: 'assessment_included', zodType: 'boolean', optional: true },
  { name: 'prerequisite_unit_ids', zodType: 'array-string', optional: true },

// ===== UNIT_ROLLUP_INDEX_FIELDS: Add these 10 fields at line ~136 =====
  { name: 'tier', zodType: 'string', optional: true },
  { name: 'exam_board', zodType: 'string', optional: true },
  { name: 'pathway', zodType: 'string', optional: true },
  { name: 'difficulty_level', zodType: 'number', optional: true },
  { name: 'estimated_duration_minutes', zodType: 'number', optional: true },
  { name: 'unit_type', zodType: 'string', optional: true },
  { name: 'assessment_included', zodType: 'boolean', optional: true },
  { name: 'prerequisite_unit_ids', zodType: 'array-string', optional: true },
  { name: 'combined_misconceptions', zodType: 'array-string', optional: true },
  { name: 'combined_keywords', zodType: 'array-string', optional: true },

// ===== SEQUENCES_INDEX_FIELDS: Add these 6 fields at line ~163 =====
  { name: 'tier', zodType: 'string', optional: true },
  { name: 'exam_board', zodType: 'string', optional: true },
  { name: 'pathway', zodType: 'string', optional: true },
  { name: 'difficulty_level', zodType: 'number', optional: true },
  { name: 'estimated_duration_minutes', zodType: 'number', optional: true },
  { name: 'threads_covered', zodType: 'array-string', optional: true },

// ===== SEQUENCE_FACETS_INDEX_FIELDS: Add these 5 fields at line ~194 =====
  { name: 'tiers_available', zodType: 'array-string', optional: true },
  { name: 'exam_boards_available', zodType: 'array-string', optional: true },
  { name: 'pathways_available', zodType: 'array-string', optional: true },
  { name: 'threads_available', zodType: 'array-string', optional: true },
  { name: 'lesson_count_by_thread', zodType: 'object', optional: true },
```

**Total additions**: 37 fields across 5 indexes

### 2. Update ES Field Overrides (SDK)

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-field-overrides.ts`

**Why**: These fields should be `keyword` type for exact matching and faceting, not `text` type for full-text search.

**Add keyword overrides for new enum-like fields**:

```typescript
// Add to LESSONS_FIELD_OVERRIDES, UNITS_FIELD_OVERRIDES, UNIT_ROLLUP_FIELD_OVERRIDES:
tier: { type: 'keyword' },
exam_board: { type: 'keyword' },
pathway: { type: 'keyword' },
unit_type: { type: 'keyword' },  // units/rollup only
resource_types: { type: 'keyword' },  // lessons only

// Add to SEQUENCE_FACETS_FIELD_OVERRIDES:
tiers_available: { type: 'keyword' },
exam_boards_available: { type: 'keyword' },
pathways_available: { type: 'keyword' },
threads_available: { type: 'keyword' },

// Keep default mappings for:
// - difficulty_level (number)
// - estimated_duration_minutes (number)
// - assessment_included (boolean)
// - All array fields get default array mapping
```

### 3. Run Type Generation

```bash
cd ai_experiments/oak-notion-mcp
pnpm type-gen
```

**Expected output**:

- Updated Zod schemas in `src/types/generated/search/search-index-docs.ts`
- Updated ES mappings in `src/types/generated/search/elasticsearch-mappings.ts`

### 4. Update Ingestion Logic (Search App)

**Files to modify**:

- `apps/oak-search-cli/src/lib/indexing/lesson-ingestion.ts`
- `apps/oak-search-cli/src/lib/indexing/unit-ingestion.ts`
- `apps/oak-search-cli/src/lib/indexing/sequence-ingestion.ts`

**Add extraction functions** (TDD approach):

**Step 1: RED - Write tests FIRST**

```typescript
// document-transforms.unit.test.ts (NEW TESTS)

describe('extractTier', () => {
  it('extracts tier from programme factors', () => {
    const lesson = { programme: { tier: 'foundation' } };
    expect(extractTier(lesson)).toBe('foundation');
  });

  it('infers foundation from unit slug', () => {
    const lesson = { unitSlug: 'maths-ks4-foundation-unit-1' };
    expect(extractTier(lesson)).toBe('foundation');
  });

  it('returns undefined when tier cannot be determined', () => {
    const lesson = {};
    expect(extractTier(lesson)).toBeUndefined();
  });
});

describe('extractDifficultyLevel', () => {
  it('maps foundation tier to difficulty 4', () => {
    expect(extractDifficultyLevel('foundation')).toBe(4);
  });

  it('maps higher tier to difficulty 8', () => {
    expect(extractDifficultyLevel('higher')).toBe(8);
  });

  it('returns undefined for unknown tier', () => {
    expect(extractDifficultyLevel(undefined)).toBeUndefined();
  });
});

describe('extractResourceTypes', () => {
  it('identifies video resources', () => {
    const lesson = { hasVideo: true };
    expect(extractResourceTypes(lesson)).toContain('video');
  });

  it('identifies multiple resource types', () => {
    const lesson = { hasVideo: true, hasQuiz: true, hasWorksheet: true };
    const types = extractResourceTypes(lesson);
    expect(types).toContain('video');
    expect(types).toContain('quiz');
    expect(types).toContain('worksheet');
  });

  it('returns empty array when no resources', () => {
    const lesson = {};
    expect(extractResourceTypes(lesson)).toEqual([]);
  });
});

describe('estimateDuration', () => {
  it('defaults to 60 minutes for video lessons', () => {
    const lesson = { hasVideo: true };
    expect(estimateDuration(lesson)).toBe(60);
  });

  it('estimates 30 minutes for quiz-only', () => {
    const lesson = { hasQuiz: true, hasVideo: false };
    expect(estimateDuration(lesson)).toBe(30);
  });
});
```

**Step 2: GREEN - Implement to pass tests**

```typescript
// document-transforms.ts (NEW FUNCTIONS)

export function extractTier(lesson: LessonData): string | undefined {
  // Check programme factors
  if (lesson.programme?.tier) {
    return lesson.programme.tier;
  }

  // Infer from sequence slug
  if (lesson.unitSlug?.includes('foundation')) return 'foundation';
  if (lesson.unitSlug?.includes('higher')) return 'higher';

  return undefined;
}

export function extractDifficultyLevel(tier: string | undefined): number | undefined {
  if (!tier) return undefined;

  const tierLevels: Record<string, number> = {
    foundation: 4, // Mid-range 3-5
    core: 6, // Mid-range 5-7
    higher: 8, // Mid-range 7-10
  };

  return tierLevels[tier];
}

export function extractResourceTypes(lesson: LessonData): string[] {
  const types: string[] = [];

  if (lesson.hasVideo) types.push('video');
  if (lesson.hasQuiz) types.push('quiz');
  if (lesson.hasWorksheet) types.push('worksheet');
  if (lesson.hasSlides) types.push('slides');

  return types;
}

export function estimateDuration(lesson: LessonData): number {
  // Standard lesson duration
  let duration = 60;

  // Adjust based on components
  if (lesson.hasQuiz && !lesson.hasVideo) duration = 30;
  if (lesson.hasWorksheet && !lesson.hasVideo) duration = 45;

  return duration;
}
```

**Step 3: Integration - Update createLessonDocument**

```typescript
// In transformLessonToIndexDoc (MODIFIED):
export function createLessonDocument({...}): SearchLessonsIndexDoc {
  const tier = extractTier(lesson);

  return {
    // ... existing fields
    tier,
    exam_board: lesson.programme?.examBoard ?? 'generic',
    pathway: lesson.programme?.slug,
    difficulty_level: extractDifficultyLevel(tier),
    estimated_duration_minutes: estimateDuration(lesson),
    resource_types: extractResourceTypes(lesson),
    prerequisite_lesson_ids: [],  // Empty for now
    related_lesson_ids: [],  // Empty for now
  };
}
```

**Step 4: REFACTOR - Improve if needed while tests stay green**

### 5. Run Quality Gates

```bash
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm test
```

### 6. Ingest Maths KS4

```bash
cd apps/oak-search-cli
pnpm es:ingest-live --subject maths --keystage ks4 --verbose
```

**Expected**:

- ~100-200 docs across 5 indexes
- New fields populated where data available
- NULL/missing for fields to be populated later

---

## Verification Plan

### Field Population Checks

After ingestion, verify field coverage:

```typescript
// Check tier coverage
GET oak_lessons/_search
{
  "size": 0,
  "aggs": {
    "tier_coverage": {
      "terms": { "field": "tier", "missing": "_missing_" }
    }
  }
}

// Expected: foundation: X, higher: Y, _missing_: Z

// Check resource_types
GET oak_lessons/_search
{
  "size": 0,
  "aggs": {
    "resource_types": {
      "terms": { "field": "resource_types" }
    }
  }
}

// Expected: video: ~80, worksheet: ~60, quiz: ~40, slides: ~20
```

### Field Alignment Test

```typescript
// Ensure Zod schema validates documents
import { SearchLessonsIndexDocSchema } from '@oaknational/oak-curriculum-sdk';

const doc = {
  lesson_id: 'test',
  // ... all fields including new ones
  tier: 'foundation',
  exam_board: 'AQA',
};

const result = SearchLessonsIndexDocSchema.safeParse(doc);
expect(result.success).toBe(true);
```

---

## Phase 2 Field Population Strategy

Once hybrid fields are in place, populate empty fields:

### Prerequisites & Related Lessons

**Strategy**: Similarity search + manual curation

```typescript
// Find related lessons using semantic search
async function findRelatedLessons(lessonId: string): Promise<string[]> {
  const lesson = await getLesson(lessonId);

  const related = await esClient.search({
    index: 'oak_lessons',
    query: {
      semantic: {
        field: 'lesson_semantic',
        query: lesson.transcript_text,
      },
    },
    filter: [
      { term: { subject_slug: lesson.subject_slug } },
      { term: { key_stage: lesson.key_stage } },
      { bool: { must_not: { term: { lesson_id: lessonId } } } },
    ],
    size: 5,
  });

  return related.hits.hits.map((h) => h._source.lesson_id);
}
```

### Threads Covered

**Strategy**: Aggregate from unit data

```typescript
async function updateSequenceThreads(sequenceId: string): Promise<void> {
  const sequence = await getSequence(sequenceId);
  const units = await getUnitsInSequence(sequence.unit_slugs);

  const allThreads = new Set<string>();
  units.forEach((unit) => {
    unit.thread_slugs?.forEach((thread) => allThreads.add(thread));
  });

  await esClient.update({
    index: 'oak_sequences',
    id: sequenceId,
    body: {
      doc: {
        threads_covered: Array.from(allThreads),
      },
    },
  });
}
```

---

## Full Transcripts: Upload NOW ✅

### `transcript_text` Field (Already Uploading Full Transcripts!)

**Status**: ✅ **ALREADY IMPLEMENTED** - full transcripts stored in `oak_lessons`

We are **already storing complete, untruncated transcripts** in the `transcript_text` field:

```typescript
// In LESSONS_INDEX_FIELDS (already defined):
{ name: 'transcript_text', zodType: 'string', optional: false }

// ES Mapping (already generated):
transcript_text: {
  type: 'text',
  analyzer: 'oak_text_index',
  search_analyzer: 'oak_text_search',
  term_vector: 'with_positions_offsets'  // Enables highlighting
}

// Implementation (document-transforms.ts):
export function createLessonDocument({...}): SearchLessonsIndexDoc {
  return {
    // ... other fields
    transcript_text: transcript,  // ← FULL transcript, no sampling
    // ...
  };
}
```

**Current Implementation**:

- ✅ Full transcripts extracted from API via `getLessonTranscript`
- ✅ Stored without truncation or sampling in `transcript_text`
- ✅ No length limits (ES handles large text fields efficiently)
- ✅ `extractPassage()` utility exists but is **only used for error messages**, not data storage

**Use Cases (Available Immediately)**:

- ✅ Full-text search across complete lesson content
- ✅ Highlight matching passages (with term vectors)
- ✅ Semantic search via `lesson_semantic` (ELSER sparse embeddings)
- ✅ Foundation for Phase 4 RAG features

**Note on Rollup Snippets**: The `rollup_text` field in `oak_unit_rollup` uses ~300 character **summaries** per lesson from lesson-planning metadata (key learning points, teacher tips). This is **intentional** - rollups are unit-level summaries, not full transcripts. The full transcripts remain available in `oak_lessons.transcript_text`.

---

## Data Completeness Audit: What We Upload in Full

To ensure we're not inadvertently truncating or sampling data, here's what we upload:

### ✅ Full Data (No Truncation)

| Field                                | Index           | Status                          |
| ------------------------------------ | --------------- | ------------------------------- |
| `transcript_text`                    | `oak_lessons`   | ✅ Complete transcript from API |
| `lesson_title`                       | `oak_lessons`   | ✅ Full title                   |
| `lesson_keywords`                    | `oak_lessons`   | ✅ All keywords from API        |
| `key_learning_points`                | `oak_lessons`   | ✅ All learning points          |
| `misconceptions_and_common_mistakes` | `oak_lessons`   | ✅ All misconceptions           |
| `teacher_tips`                       | `oak_lessons`   | ✅ All teacher tips             |
| `content_guidance`                   | `oak_lessons`   | ✅ All guidance                 |
| `unit_title`                         | `oak_units`     | ✅ Full title                   |
| `unit_topics`                        | `oak_units`     | ✅ All topics                   |
| `sequence_title`                     | `oak_sequences` | ✅ Full title                   |
| `category_titles`                    | `oak_sequences` | ✅ All categories               |

### ⚠️ Intentional Summarization (By Design)

| Field         | Index             | Purpose                   | Why Summarized                                                                                                                                                                            |
| ------------- | ----------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rollup_text` | `oak_unit_rollup` | Unit-level search surface | Combines ~300 char snippets from lesson-planning data (NOT transcripts) per lesson. Prevents index bloat while enabling unit-level semantic search. Full details remain in `oak_lessons`. |

### 🔍 Data Source Hierarchy for Rollups

When building `rollup_text`, we prioritize lesson-planning metadata over transcripts:

1. **Preferred**: `key_learning_points` → `teacher_tips` → `lesson_keywords`
2. **Fallback**: First 300 chars of transcript (only if metadata missing)

**Rationale**: Teachers search units by pedagogical content, not full transcripts. Full transcripts are searchable via `oak_lessons` index.

### 📊 Data Availability Validation

After Maths KS4 ingestion, verify completeness:

```bash
# Check transcript lengths (should be >1000 chars for most lessons)
GET oak_lessons/_search
{
  "size": 10,
  "_source": ["lesson_id", "lesson_title"],
  "script_fields": {
    "transcript_length": {
      "script": "doc['transcript_text.keyword'].size() > 0 ? doc['transcript_text.keyword'].value.length() : 0"
    }
  }
}

# Check for missing transcripts
GET oak_lessons/_search
{
  "query": {
    "bool": {
      "must_not": { "exists": { "field": "transcript_text" } }
    }
  }
}
# Expected: 0 results (all lessons should have transcripts)
```

**Quality Gate**: >95% of lessons should have `transcript_text` >500 characters (typical lesson length: 2000-5000 characters).

**What's Deferred to Phase 4**: Chunked transcripts in a separate `oak_lesson_transcripts` index (~500-1000 word chunks for more granular RAG context injection). See `phase-4-deferred-fields.md` for details.

---

## Deferred to Phase 4: AI/Graph Fields

These fields require expensive processing (LLM calls, NER, graph analysis) and will be added via `_update_by_query`:

### AI-Generated Fields (8 fields)

```typescript
// Requires: LLM API calls (~$0.001-0.01 per lesson)
ai_generated_summary: string  // 2-3 sentence overview
difficulty_reasoning: string  // Explanation of difficulty_level
semantic_keywords: string[]   // AI-extracted vs authored keywords
curriculum_concepts: string[]  // Extracted key concepts from graph
```

### Graph-Derived Fields (3 fields)

```typescript
// Requires: NER extraction on transcripts
mentions_entities: string[]  // People, places, events, concepts

// Requires: Transcript chunking pipeline
chunked_for_rag: boolean
chunk_count: number
```

### Future Quality Signals (2 fields)

```typescript
// Requires: Usage data collection
teacher_rating_avg: number;
usage_count: number;
```

**Total Deferred**: 13 fields across `oak_lessons`, `oak_units`, `oak_unit_rollup`, `oak_sequences`

**See**: `.agent/plans/semantic-search/phase-4-deferred-fields.md` for complete implementation plan

**Strategy**: Use `_update_by_query` API instead of full re-ingest:

```typescript
POST oak_lessons/_update_by_query
{
  "script": {
    "source": "ctx._source.ai_generated_summary = params.summaries[ctx._source.lesson_id]",
    "params": {
      "summaries": { /* computed summaries */ }
    }
  }
}
```

---

## Benefits of Hybrid Approach

| Approach                          | Uploads | Time    | Risk                                   |
| --------------------------------- | ------- | ------- | -------------------------------------- |
| **Minimal** (current fields only) | 3-4     | ~40 min | High - multiple re-ingestions          |
| **Hybrid** (this plan)            | 1-2     | ~15 min | Low - one initial + optional AI update |
| **Maximal** (all future fields)   | 1       | ~12 min | Medium - unused fields, complex schema |

**Hybrid wins**: Best balance of flexibility and efficiency.

---

## Risk Mitigation

### What if API doesn't have tier/exam_board?

**Mitigation**: Fields are optional. NULL is fine. We can:

1. Manually curate for Maths KS4 (~50 lessons)
2. Infer from programme slug patterns
3. Leave NULL and populate in Phase 2

### What if we need more fields in Phase 3?

**Mitigation**: Phase 3 is **new indexes** (reference data) - no re-upload needed.

### What if Phase 4 fields change?

**Mitigation**: Use `_update_by_query` instead of re-ingest. Faster, no downtime.

---

## Success Criteria

### Before Ingestion

✅ All extraction function unit tests pass (RED → GREEN cycle followed)  
✅ All integration tests pass (document transforms with new fields)  
✅ All 10 quality gates pass:

- `pnpm type-gen` (generates new schemas)
- `pnpm build` (compiles)
- `pnpm type-check` (no type errors)
- `pnpm lint:fix` (no lint errors)
- `pnpm format:root` (formatted)
- `pnpm markdownlint:root` (docs formatted)
- `pnpm test` (867+ tests pass)
- `pnpm test:e2e` (E2E tests pass)
- `pnpm test:e2e:built` (built E2E tests pass)
- `pnpm test:ui` + `pnpm smoke:dev:stub` (UI tests pass)

### After Ingestion

✅ Maths KS4 ingested **once** with hybrid fields (37 new fields)  
✅ `tier` populated for >80% of lessons  
✅ `exam_board` populated for >60% of lessons  
✅ `resource_types` populated for >90% of lessons  
✅ `thread_slugs` populated where available  
✅ Phase 2 features work without re-upload  
✅ Total ingestion time <20 minutes  
✅ Zero mapping errors during bulk indexing  
✅ No type errors, lint errors, or test failures

---

## References

- **Comprehensive Field Analysis**: `.agent/analysis/comprehensive-field-requirements-maths-ks4.md`
- **Maths KS4 Vertical Slice**: `.agent/plans/semantic-search/maths-ks4-vertical-slice.md`
- **Current Field Definitions**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts`
- **ADR-067**: `docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md`
