# Feature Parity Analysis: Production Search vs Semantic Search

**Created**: 2025-12-10  
**Updated**: 2025-12-10 (Corrected for Oak Open API data source)  
**Purpose**: Detailed comparison of production search-api/OWA vs our semantic search implementation

---

## Executive Summary

**Critical Distinction**: The production search-api and our semantic search implementation use **different data sources**:

| System                    | Data Source            | Notes                                           |
| ------------------------- | ---------------------- | ----------------------------------------------- |
| **Production search-api** | GraphQL Curriculum API | Internal Oak API, more fields available         |
| **Our semantic search**   | Oak Open API           | Public API, fewer fields but pedagogically rich |

Our semantic search is architecturally more advanced (hybrid RRF vs BM25-only), and we have access to rich pedagogical content. However, some production fields used for OWA UI features are **not available** in the Open API.

---

## 1. Data Source Comparison

### Production search-api (GraphQL Curriculum API)

The production reindexer fetches from an internal GraphQL API with these fields (from `lessons.gql`):

- All taxonomy fields with both slugs AND titles
- `pupilLessonOutcome` ✅
- `cohort` (for NEW badges and legacy filtering)
- `pathways[]` (multi-pathway variants)
- `programmeSlug`, `unitVariantId` (for URL generation and deduplication)

### Our Implementation (Oak Open API)

We use the public Open API (`https://open-api.thenational.academy/api/v0/`).

**Available from `/lessons/{lesson}/summary`**:

```typescript
{
  lessonTitle: string;
  unitSlug: string;
  unitTitle: string;
  subjectSlug: string;
  subjectTitle: string;           // ✅ Available!
  keyStageSlug: string;
  keyStageTitle: string;          // ✅ Available!
  lessonKeywords: Array<{keyword, description}>;
  keyLearningPoints: Array<{keyLearningPoint}>;
  misconceptionsAndCommonMistakes: Array<{misconception, response}>;
  pupilLessonOutcome?: string;    // ✅ Available!
  teacherTips: Array<{teacherTip}>;
  contentGuidance: Array | null;
  supervisionLevel: string | null;
  downloadsAvailable: boolean;
  canonicalUrl: string;
}
```

**Available from `/lessons/{lesson}/transcript`**:

```typescript
{
  transcript: string; // ✅ Full transcript text
  vtt: string; // Captions with timestamps
}
```

**Available from `/units/{unit}/summary`**:

```typescript
{
  unitSlug: string;
  unitTitle: string;
  yearSlug: string;
  year: number | string;
  phaseSlug: string;
  subjectSlug: string;
  keyStageSlug: string;
  notes?: string;
  description?: string;
  priorKnowledgeRequirements: string[];
  nationalCurriculumContent: string[];
  whyThisWhyNow?: string;
  threads: Array<{slug, title, order}>;
  categories: Array<{categoryTitle, categorySlug?}>;
  unitLessons: Array<{lessonSlug, lessonTitle, lessonOrder?, state}>;
}
```

**Available from `/search/lessons`**:

```typescript
{
  lessonSlug: string;
  lessonTitle: string;
  similarity: number;
  units: Array<{
    unitSlug: string;
    unitTitle: string;
    examBoardTitle: string | null; // ✅ Available in search results
    keyStageSlug: string;
    subjectSlug: string;
  }>;
}
```

---

## 2. Field Availability Matrix

### Lesson Fields

| Field                   | Production GraphQL | Open API         | Our Index       | Notes                                     |
| ----------------------- | ------------------ | ---------------- | --------------- | ----------------------------------------- |
| **Identifiers**         |                    |                  |                 |                                           |
| lessonSlug              | ✅                 | ✅ `/summary`    | ✅              |                                           |
| lessonTitle             | ✅                 | ✅ `/summary`    | ✅              |                                           |
| programmeSlug           | ✅                 | ❌               | ❌              | Not in Open API - used for URL generation |
| unitSlug                | ✅                 | ✅ `/summary`    | ✅              |                                           |
| unitTitle               | ✅                 | ✅ `/summary`    | ✅              |                                           |
| unitVariantId           | ✅                 | ❌               | ❌              | Not in Open API                           |
| **Taxonomy**            |                    |                  |                 |                                           |
| keyStageSlug            | ✅                 | ✅ `/summary`    | ✅              |                                           |
| keyStageTitle           | ✅                 | ✅ `/summary`    | ❌              | **Can add** - available in Open API       |
| subjectSlug             | ✅                 | ✅ `/summary`    | ✅              |                                           |
| subjectTitle            | ✅                 | ✅ `/summary`    | ❌              | **Can add** - available in Open API       |
| tierSlug                | ✅                 | ❌               | ✅ (via search) | Only in search results                    |
| tierTitle               | ✅                 | ❌               | ❌              | Not directly available                    |
| examBoardSlug           | ✅                 | ❌               | ✅ (via search) | Only in search results                    |
| examBoardTitle          | ✅                 | ✅ (in search)   | ❌              | **Can add** - in search results           |
| yearSlug                | ✅                 | ✅ (via unit)    | ✅              |                                           |
| yearTitle               | ✅                 | ❌               | ❌              | Not in Open API                           |
| **Pedagogical Content** |                    |                  |                 |                                           |
| pupilLessonOutcome      | ✅                 | ✅ `/summary`    | ❌              | **Can add** - available!                  |
| lessonKeywords          | ✅                 | ✅ `/summary`    | ✅              |                                           |
| keyLearningPoints       | ✅                 | ✅ `/summary`    | ✅              |                                           |
| misconceptions          | ✅                 | ✅ `/summary`    | ✅              |                                           |
| teacherTips             | ✅                 | ✅ `/summary`    | ✅              |                                           |
| contentGuidance         | ✅                 | ✅ `/summary`    | ✅              |                                           |
| **Transcript**          |                    |                  |                 |                                           |
| transcript_text         | ❌                 | ✅ `/transcript` | ✅              | We have this, production doesn't!         |
| vtt (captions)          | ❌                 | ✅ `/transcript` | ❌              | Available but not indexed                 |
| **Cohort/Legacy**       |                    |                  |                 |                                           |
| cohort                  | ✅                 | ❌               | ❌              | **Not in Open API** - "NEW" badge         |
| isLegacy                | ✅                 | ❌               | ❌              | **Not in Open API** - legacy filtering    |
| **Pathways**            |                    |                  |                 |                                           |
| pathways[]              | ✅                 | ❌               | ❌              | **Not in Open API** - multi-pathway       |
| **Semantic/Vector**     |                    |                  |                 |                                           |
| lesson_semantic         | ❌                 | N/A              | ✅              | ELSER sparse vectors                      |
| lesson_dense_vector     | ❌                 | N/A              | ✅              | E5 dense vectors                          |
| title_dense_vector      | ❌                 | N/A              | ✅              | Title vectors                             |
| **Threads**             |                    |                  |                 |                                           |
| thread_slugs            | ❌                 | ✅ (via unit)    | ✅              |                                           |
| thread_titles           | ❌                 | ✅ (via unit)    | ✅              |                                           |
| **Suggestions**         |                    |                  |                 |                                           |
| title_suggest           | ❌                 | N/A              | ✅              | Completion suggestions                    |

### Unit Fields

| Field                      | Production GraphQL | Open API      | Our Index | Notes                     |
| -------------------------- | ------------------ | ------------- | --------- | ------------------------- |
| unitSlug                   | ✅                 | ✅ `/summary` | ✅        |                           |
| unitTitle                  | ✅                 | ✅ `/summary` | ✅        |                           |
| programmeSlug              | ✅                 | ❌            | ❌        | Not in Open API           |
| keyStageSlug               | ✅                 | ✅ `/summary` | ✅        |                           |
| keyStageTitle              | ❌                 | ❌            | ❌        | Not available             |
| subjectSlug                | ✅                 | ✅ `/summary` | ✅        |                           |
| subjectTitle               | ❌                 | ❌            | ❌        | Not in unit summary       |
| yearSlug                   | ✅                 | ✅ `/summary` | ✅        |                           |
| year                       | ✅                 | ✅ `/summary` | ✅        |                           |
| phaseSlug                  | ✅                 | ✅ `/summary` | ❌        | **Can add**               |
| cohort                     | ✅                 | ❌            | ❌        | **Not in Open API**       |
| isLegacy                   | ✅                 | ❌            | ❌        | **Not in Open API**       |
| pathways[]                 | ✅                 | ❌            | ❌        | **Not in Open API**       |
| threads[]                  | ❌                 | ✅ `/summary` | ✅        |                           |
| categories[]               | ❌                 | ✅ `/summary` | ❌        | **Can add**               |
| priorKnowledgeRequirements | ❌                 | ✅ `/summary` | ❌        | **Can add**               |
| nationalCurriculumContent  | ❌                 | ✅ `/summary` | ❌        | **Can add**               |
| whyThisWhyNow              | ❌                 | ✅ `/summary` | ❌        | **Can add**               |
| description                | ❌                 | ✅ `/summary` | ❌        | **Can add**               |
| unit_semantic              | ❌                 | N/A           | ✅        | ELSER vectors             |
| unit_dense_vector          | ❌                 | N/A           | ✅        | Dense vectors             |
| rollup_text                | ❌                 | N/A           | ✅        | Aggregated lesson content |

---

## 3. Query Strategy Comparison

### Production Query Structure

```typescript
// Two-stage BM25 with phrase priority
{
  bool: {
    should: [
      // Stage 1: Exact phrase matching (high boost)
      { multi_match: {
          query: term,
          type: "phrase",
          fields: ["title^6", "pupilLessonOutcome^3"]
      }},
      // Stage 2: Fuzzy fallback on all content
      { match: {
          all_fields: {
            query: term,
            fuzziness: "AUTO:4,7",
            prefix_length: 1
          }
      }}
    ],
    filter: [...filters],
    minimum_should_match: 1
  }
}
```

**Key Features**:

- Uses `copy_to` aggregated field (`all_fields`) for fuzzy matching
- Phrase matching prioritized with 6x boost on title
- `pupilLessonOutcome` boosted 3x for relevance
- Porter stemming at index time

### Our Query Structure

```typescript
// Two-way RRF (BM25 + ELSER)
{
  retriever: {
    rrf: {
      retrievers: [
        // BM25 with field boosts
        { standard: {
            query: { multi_match: {
              query: text,
              type: 'best_fields',
              tie_breaker: 0.2,
              fuzziness: 'AUTO',
              fields: ['lesson_title^3', 'lesson_keywords^2', ...]
            }},
            filter: ...
        }},
        // ELSER semantic
        { standard: {
            query: { semantic: { field: 'lesson_semantic', query: text }},
            filter: ...
        }}
      ],
      rank_window_size: 60,
      rank_constant: 60
    }
  }
}
```

**Key Features**:

- Hybrid retrieval combines lexical and semantic
- RRF fusion handles ranking without explicit boosts
- ELSER provides concept-level understanding
- Query-time synonym expansion

### Comparison

| Aspect                 | Production                | Ours                           | Winner                         |
| ---------------------- | ------------------------- | ------------------------------ | ------------------------------ |
| Search type            | BM25 only                 | RRF (BM25 + ELSER)             | **Ours**                       |
| Semantic understanding | None                      | ELSER sparse vectors           | **Ours**                       |
| Phrase matching        | Explicit boost            | RRF handles                    | Tie                            |
| Fuzzy config           | AUTO:4,7, prefix_length:1 | AUTO                           | Production (more precise)      |
| Aggregated field       | `all_fields` (copy_to)    | Direct field queries           | Tie                            |
| Stemming               | Porter (index-time)       | Snowball (query-time synonyms) | Tie                            |
| Snippet field          | `pupilLessonOutcome`      | N/A                            | **Production** (we should add) |

---

## 4. Analyzer Comparison

### Production Analyzers

```typescript
{
  index_analyzer: {
    tokenizer: "standard",
    filter: ["lowercase", "stop", "porter_stem"]
  },
  search_analyzer: {
    tokenizer: "standard",
    filter: ["lowercase", "stop", "porter_stem"]
  }
}
```

### Our Analyzers

```typescript
{
  oak_text_index: {
    tokenizer: 'standard',
    filter: ['lowercase', 'oak_synonyms_filter', 'oak_stop_filter', 'oak_snowball_filter']
  },
  oak_text_search: {
    tokenizer: 'standard',
    filter: ['lowercase', 'oak_synonyms_filter', 'oak_stop_filter', 'oak_snowball_filter']
  }
}
```

### Key Differences

| Aspect     | Production | Ours                         | Notes                                 |
| ---------- | ---------- | ---------------------------- | ------------------------------------- |
| Stemmer    | Porter     | Snowball (English)           | Both effective for English            |
| Synonyms   | None       | Query-time expansion         | **Ours** - curriculum domain synonyms |
| Stop words | Standard   | Custom curriculum stop words | **Ours** - domain-specific            |

---

## 5. OWA UI Requirements

Based on `SearchResultsItem.tsx`, the OWA search UI requires these fields:

```typescript
type SearchResultsItemProps = {
  // Required for display
  subjectSlug: string;         // Icon selection
  subjectTitle: string;        // ✅ We can add from Open API
  title: string;               // ✅ We have
  keyStageShortCode: string;   // Derivable from keyStageSlug
  keyStageTitle: string;       // ✅ We can add from Open API
  keyStageSlug: string;        // ✅ We have
  yearTitle?: string;          // ❌ Not in Open API

  // Snippet display
  description?: string;        // For units - we can add
  pupilLessonOutcome?: string; // ✅ We can add from Open API

  // Type discrimination
  type: "unit" | "lesson";     // ✅ We have
  unitTitle?: string;          // ✅ We have

  // Cohort/legacy - NOT IN OPEN API
  cohort?: string;             // ❌ Not available
  legacy?: boolean;            // ❌ Not available

  // Multi-pathway support - NOT IN OPEN API
  pathways: PathwaySchemaCamel[];  // ❌ Not available

  // Link building
  buttonLinkProps: ...;        // Needs programmeSlug (not available)
}
```

---

## 6. Gap Analysis Summary

### Fields We CAN Add (Available in Open API)

| Field                | Open API Source             | Priority | Implementation                        |
| -------------------- | --------------------------- | -------- | ------------------------------------- |
| `pupilLessonOutcome` | `/lessons/{lesson}/summary` | **HIGH** | Add to lesson index, use for snippets |
| `subjectTitle`       | `/lessons/{lesson}/summary` | MEDIUM   | Add to lesson index for UI display    |
| `keyStageTitle`      | `/lessons/{lesson}/summary` | MEDIUM   | Add to lesson index for UI display    |
| Unit `description`   | `/units/{unit}/summary`     | MEDIUM   | Add to unit index                     |
| Unit `categories`    | `/units/{unit}/summary`     | ✅ DONE  | Implemented via CategoryMap           |
| Unit `whyThisWhyNow` | `/units/{unit}/summary`     | LOW      | Could improve semantic search         |

### Corrections (2026-01-02)

> **CRITICAL**: The Open API contains ONLY new curriculum. There is NO legacy content.

| Field           | OLD Assessment            | CORRECT Assessment                                   |
| --------------- | ------------------------- | ---------------------------------------------------- |
| `cohort`        | ❌ Cannot show NEW badges | ✅ **NOT NEEDED** — All API content is new           |
| `isLegacy`      | ❌ Cannot filter legacy   | ✅ **NOT NEEDED** — No legacy content exists         |
| `tierTitle`     | ❌ Not available          | ✅ **AVAILABLE** — In `/sequences/.../units` KS4     |
| `tierSlug`      | ❌ Not available          | ✅ **AVAILABLE** — In `/sequences/.../units` KS4     |
| `examBoardTitle`| ❌ Not available          | ✅ **AVAILABLE** — In `/search/lessons` results      |

### Fields NOT Available in Open API (Genuinely Missing)

| Field           | Purpose                  | Workaround                                     |
| --------------- | ------------------------ | ---------------------------------------------- |
| `programmeSlug` | OWA URL generation       | Derive from sequence + year + tier + examboard |
| `pathways[]`    | Flat array of variants   | Use tiered structure from sequences API        |
| `unitVariantId` | Deduplication            | Handle via slug-based deduplication            |
| `yearTitle`     | Display "Year 3" text    | Derive: `Year ${year}` from number             |

### Impact Assessment

**What We CAN'T Support Without Open API Changes**:

1. **"NEW" content badges** - No cohort field
2. **Legacy curriculum filtering** - No isLegacy field
3. **Multi-pathway search results** - No pathways array
4. **Exact OWA URL format** - No programmeSlug

**What We CAN Support**:

1. **Full semantic search** - ELSER + dense vectors
2. **Rich pedagogical snippets** - pupilLessonOutcome available
3. **Transcript search** - Full transcript text available
4. **Thread navigation** - Thread data in unit summaries
5. **Curriculum synonyms** - Our own synonym system

---

## 7. What We Have That Production Doesn't

### Semantic Search Capabilities

| Feature                  | Description                 | Benefit                              |
| ------------------------ | --------------------------- | ------------------------------------ |
| **ELSER sparse vectors** | Semantic text understanding | Finds conceptually related content   |
| **E5 dense vectors**     | Neural embeddings           | Ready for three-way hybrid (Phase 2) |
| **RRF ranking**          | Reciprocal Rank Fusion      | Superior result fusion               |
| **Query-time synonyms**  | Domain-specific expansion   | "maths" ↔ "mathematics"              |

### Richer Content Search

| Content                 | Description                   | Benefit                    |
| ----------------------- | ----------------------------- | -------------------------- |
| **Full transcripts**    | ~45 min of content per lesson | Deep content search        |
| **Key learning points** | Educational objectives        | Structured learning search |
| **Misconceptions**      | Common mistakes & responses   | Pedagogical search         |
| **Teacher tips**        | Teaching guidance             | Professional development   |
| **Content guidance**    | Safety/sensitivity warnings   | Content filtering          |

### Navigation Features

| Feature                    | Description               | Benefit               |
| -------------------------- | ------------------------- | --------------------- |
| **Thread references**      | Curriculum thread linking | Cross-unit navigation |
| **Completion suggestions** | Search-as-you-type        | Better UX             |
| **Faceted aggregations**   | Dynamic filter counts     | Interactive filtering |

---

## 8. Recommendations

### Phase 1: Quick Wins (Can Implement Now)

1. **Add `pupilLessonOutcome` to lesson documents**
   - Source: `/lessons/{lesson}/summary` → `pupilLessonOutcome`
   - Location: `document-transforms.ts` → `createLessonDocument()`
   - Use for: Search result snippets, highlighting
   - Impact: **HIGH** - key UX improvement

2. **Add title fields to index**
   - `subjectTitle` from lesson summary
   - `keyStageTitle` from lesson summary
   - Impact: MEDIUM - better UI display

### Phase 2: Unit Enrichment

3. **Add unit description and categories**
   - Source: `/units/{unit}/summary`
   - Add `description`, `categories`, `whyThisWhyNow`
   - Impact: Richer unit search

### Phase 3: Response Format

4. **Align response schema with OWA expectations**
   - Map our field names to OWA expected format
   - Generate URLs without `programmeSlug` (use alternative pattern)
   - Derive `keyStageShortCode` from `keyStageSlug`

### Cannot Implement Without Upstream Changes

These require the Open API to be extended:

- `cohort` field for NEW badges
- `isLegacy` for legacy filtering
- `pathways[]` for multi-pathway support
- `yearTitle` for year display

---

## 9. Files Reference

### Production (search-api)

| File                                                          | Purpose                                    |
| ------------------------------------------------------------- | ------------------------------------------ |
| `curriculum/reindexer/src/curriculum_api/queries/lessons.gql` | GraphQL query - shows all available fields |
| `curriculum/reindexer/src/curriculum_api/helpers.ts`          | Pathway aggregation logic                  |
| `curriculum/reindexer/src/reindex/lessons.mappings.ts`        | ES index mappings with copy_to             |
| `curriculum/search_endpoint/src/constructElasticQuery.ts`     | Query building with phrase boost           |
| `curriculum/search_endpoint/src/elastic/helpers.ts`           | Porter stemmer analyzer config             |

### OWA (Oak-Web-Application)

| File                                                  | Purpose                             |
| ----------------------------------------------------- | ----------------------------------- |
| `src/context/Search/search.types.ts`                  | Search type definitions             |
| `src/context/Search/search.helpers.ts`                | Result transformation, highlighting |
| `src/components/TeacherComponents/SearchResultsItem/` | Result UI component                 |
| `src/context/Search/suggestions/oakCurriculumData.ts` | Curriculum aliases (rich!)          |
| `src/context/Search/suggestions/findPfMatch.ts`       | Direct PF matching                  |
| `src/context/Search/ai/callModel.ts`                  | LLM-based filter suggestion         |

### Our Implementation

| File                                                              | Purpose             |
| ----------------------------------------------------------------- | ------------------- |
| `apps/.../src/lib/indexing/document-transforms.ts`                | Document creation   |
| `apps/.../src/lib/hybrid-search/rrf-query-builders.ts`            | Query building      |
| `packages/sdks/.../src/types/generated/search/index-documents.ts` | Schema definitions  |
| `packages/sdks/.../src/mcp/synonyms/index.ts`                     | Curriculum synonyms |

### Oak Open API Schema

| File                                                                                  | Purpose                     |
| ------------------------------------------------------------------------------------- | --------------------------- |
| `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json` | Full Open API specification |

---

## Appendix A: Production Pathway Schema

Production has a rich pathway structure we cannot replicate:

```typescript
type PathwaySchema = {
  programme_slug: string; // ❌ Not in Open API
  unit_slug: string;
  unit_title: string;
  key_stage_slug: string;
  key_stage_title: string;
  subject_slug: string;
  subject_title: string;
  tier_slug?: string; // ❌ Not directly available
  tier_title?: string; // ❌ Not directly available
  exam_board_slug?: string; // ❌ Only in search results
  exam_board_title?: string; // ✅ In search results
  year_slug?: string;
  year_title?: string; // ❌ Not in Open API
  cohort?: string; // ❌ Not in Open API
  isLegacy?: boolean; // ❌ Not in Open API
};
```

A single lesson can have multiple pathways (e.g., same Maths lesson in AQA, Edexcel, OCR variants). We cannot support this multi-pathway display without Open API changes.

---

## Appendix B: Open API LessonSummaryResponseSchema

Full schema from `api-schema-sdk.json` (lines 5884-6121):

```typescript
{
  lessonTitle: string;
  unitSlug: string;
  unitTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  keyStageSlug: string;
  keyStageTitle: string;
  lessonKeywords: Array<{
    keyword: string;
    description: string;
  }>;
  keyLearningPoints: Array<{
    keyLearningPoint: string;
  }>;
  misconceptionsAndCommonMistakes: Array<{
    misconception: string;
    response: string;
  }>;
  pupilLessonOutcome?: string;  // Key for snippets!
  teacherTips: Array<{
    teacherTip: string;
  }>;
  contentGuidance: Array<{
    contentGuidanceArea: string;
    supervisionlevel_id: number;
    contentGuidanceLabel: string;
    contentGuidanceDescription: string;
  }> | null;
  supervisionLevel: string | null;
  downloadsAvailable: boolean;
  canonicalUrl?: string;
}
```

---

## Appendix C: Key Insights from OWA Alias System

The OWA has a rich alias system in `oakCurriculumData.ts` that we could leverage:

```typescript
// Example aliases (OWA uses these for direct PF matching)
const subjects = [
  { slug: 'maths', title: 'Maths', aliases: ['mathematics', 'math', 'numeracy'] },
  { slug: 'english', title: 'English', aliases: ['literacy', 'ela'] },
  { slug: 'science', title: 'Science', aliases: ['stem'] },
  // ... extensive alias coverage
];

const keyStages = [
  {
    slug: 'ks1',
    title: 'Key stage 1',
    aliases: ['key stage 1', 'keystage 1', 'y1', 'y2', 'year 1', 'year 2'],
  },
  {
    slug: 'ks2',
    title: 'Key stage 2',
    aliases: ['key stage 2', 'keystage 2', 'y3', 'y4', 'y5', 'y6'],
  },
  // ...
];
```

**Opportunity**: We have our own synonym system in `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/` that could be enriched with these OWA aliases for better direct PF matching in search queries.
