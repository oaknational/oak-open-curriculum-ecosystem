# Upstream Open Curriculum API Metadata Enhancement Wish List

- Upstream API docs: <https://open-api.thenational.academy/docs/about-oaks-api/api-overview>
- OpenAPI schema: <https://open-api.thenational.academy/api/v0/swagger.json>
- API front page: <https://open-api.thenational.academy/>

## Open Questions

- Does OpenAPI 3.0 support `examples` at the path level, rather than just at the parameter level?
- Can we update the OpenAPI spec to OpenAPI 3.1? Does GCP support this?
- Can we make sure that the API uses Zod 4?
- Can we make sure that the API ships the Zod schemas as code snippets, in addition to JSON Schema?
- Can we enhance the metadata of the API to make it more useful for AI agents?
- Can we improve data integrity at the API level?

---

## Binary Response Schema Fix (2025-12-16)

**Status**: 🔴 HIGH PRIORITY — Causes `z.unknown()` in generated SDK  
**Endpoint**: `/api/v0/lessons/{lessonSlug}/assets/{assetSlug}`  
**Response**: `LessonAssetResponse`

### Problem

The upstream OpenAPI schema incorrectly declares a JSON response for what is actually a binary file stream:

```yaml
# Current (incorrect)
responses:
  200:
    content:
      application/json:
        schema: {}   # Empty schema → generates z.unknown()
```

This generates `LessonAssetResponseSchema = z.unknown()` in the SDK, which:

1. Provides no type information
2. Cannot validate the response
3. Violates our strictness requirements

### Requested Fix

Change to idiomatic OpenAPI for binary responses:

```yaml
# Correct
responses:
  200:
    description: Binary asset file (PDF, image, video, etc.)
    content:
      application/octet-stream:
        schema:
          type: string
          format: binary
      application/pdf:
        schema:
          type: string
          format: binary
      image/*:
        schema:
          type: string
          format: binary
```

### Why This Matters

- **Type safety**: SDK can generate proper `Blob` or `ArrayBuffer` types
- **Documentation**: Consumers understand the response is binary, not JSON
- **Validation**: Response type validation becomes meaningful

### SDK Workaround (Current)

We currently accept `z.unknown()` for this endpoint because:

1. We cannot validate binary streams with Zod anyway
2. The upstream schema is the source of truth
3. This is documented as a legitimate exception pending upstream fix

---

## Legitimate `z.unknown()` Exceptions Registry (2025-12-16)

**Context**: Our strictness requirements mandate that all Zod schemas be explicit. However, some `z.unknown()` usages are **legitimate** due to genuinely dynamic data. This registry documents those exceptions.

### Exception 1: Elasticsearch Aggregations

**Pattern**: `z.record(z.string(), z.unknown())`  
**Location**: Search response schemas (`responses.lessons.ts`, `responses.units.ts`, etc.)  
**Field**: `AggregationsSchema`

```typescript
const AggregationsSchema = z.record(z.string(), z.unknown()).default({});
```

**Justification**:

- Elasticsearch aggregations have genuinely dynamic structure
- Shape depends on the query (terms, histogram, nested, etc.)
- Keys are aggregation names chosen at query time
- Values are polymorphic aggregation results

**Status**: ✅ LEGITIMATE — Cannot be made stricter without losing functionality

### Exception 2: Binary File Responses (Pending Upstream Fix)

**Pattern**: `z.unknown()`  
**Location**: `curriculumZodSchemas.ts`  
**Schema**: `LessonAssetResponseSchema`

**Justification**:

- Upstream declares empty JSON schema for binary endpoint
- See "Binary Response Schema Fix" section above for upstream request

**Status**: ⚠️ PENDING UPSTREAM — Will become `z.instanceof(Blob)` or similar when fixed

---

## Bulk Download Data Integrity Issues (2025-12-19)

**Context**: Analysis of the bulk download data (`/bulk-download` endpoint) revealed inconsistencies that affect downstream filtering and search capabilities.

### Issue 1: Title Fields Null Despite Slug Fields Populated

**Affected Endpoints**: Bulk download JSON files (e.g., `maths-secondary.json`)
**Fields Affected**: `yearTitle`, `keyStageTitle`, `subjectTitle`

**Observation**:

```json
{
  "yearTitle": null,        // ← null
  "yearSlug": "year-7",     // ← populated
  "keyStageTitle": null,    // ← null
  "keyStageSlug": "ks3",    // ← populated
  "subjectTitle": null,     // ← null
  "subjectSlug": null,      // ← also null (double issue)
  "unitTitle": "Place value",
  "unitSlug": "place-value"
}
```

**Scope**: All 98 units in `maths-secondary.json` have `yearTitle: null` and `keyStageTitle: null`.

**Impact**:

- Consumers expecting human-readable titles get null
- Inconsistency between slug availability and title availability
- `subjectSlug` is also null in some cases (expected: `"maths"`)

**Requested Fix**:

Populate all `*Title` fields when corresponding `*Slug` fields are populated:

```json
{
  "yearTitle": "Year 7",
  "yearSlug": "year-7",
  "keyStageTitle": "Key Stage 3",
  "keyStageSlug": "ks3",
  "subjectTitle": "Maths",
  "subjectSlug": "maths"
}
```

## Derived Fields Registry (2025-12-13)

**Context**: Schema analysis revealed that several fields used in semantic search indexing are **derived** from other schema fields rather than being directly available. These derivations are documented here so they can be added to the upstream API.

### Currently Derived Fields

| Field            | Current Derivation     | Schema Source                                            | Ideal API Field                                                  | Status          |
| ---------------- | ---------------------- | -------------------------------------------------------- | ---------------------------------------------------------------- | --------------- |
| `tier`           | Parse from slug suffix | `tiers[].tierSlug` in `SequenceUnitsResponseSchema`      | Flat `tier: 'foundation' \| 'higher' \| null` on lesson/unit     | ✅ Derivable    |
| `examBoard`      | Use `examBoardTitle`   | `examBoardTitle` in `LessonSearchResponseSchema.units[]` | Consistent `examBoardSlug` and `examBoardTitle` on all resources | ✅ Derivable    |
| `ks4OptionSlug`  | Use `ks4Options.slug`  | `ks4Options` object on sequences                         | Flat `ks4OptionSlug` on lessons/units                            | ✅ Derivable    |
| `ks4OptionTitle` | Use `ks4Options.title` | `ks4Options` object on sequences                         | Flat `ks4OptionTitle` on lessons/units                           | ✅ Derivable    |
| ~~`pathway`~~    | N/A                    | N/A                                                      | N/A                                                              | ❌ GHOST—DELETE |

### Schema Clarifications (2025-12-13)

**What IS in the schema** (all derivable):

| Field            | Location                             | Description                        |
| ---------------- | ------------------------------------ | ---------------------------------- |
| `tiers[]`        | `SequenceUnitsResponseSchema`        | Array with `tierTitle`, `tierSlug` |
| `examBoardTitle` | `LessonSearchResponseSchema.units[]` | String or null                     |
| `ks4Options`     | Sequence schemas                     | Object with `title`, `slug`        |

**What is NOT in the schema**:

| Concept            | Reality                                  | Action                      |
| ------------------ | ---------------------------------------- | --------------------------- |
| `programmeFactors` | **Never existed** — was assumed to exist | **REMOVE** from code        |
| `pathway`          | **NEVER EXISTED** — pure ghost concept   | **DELETE ALL REFERENCES**   |
| `tier` standalone  | Derivable from slugs                     | **DERIVE** from slug suffix |
| `examBoard`        | Available as `examBoardTitle`            | **DERIVE** from searches    |

### ⚠️ `pathway` is a Ghost Concept

The `pathway` field **never existed** in the API. It was a misunderstanding. What actually exists is `ks4Options`:

- **`ks4Options.slug`** — The KS4 study option identifier
- **`ks4Options.title`** — Human-readable name

All code referencing `pathway` or `extractPathway()` should be deleted.

### Request: KS4 Programme Factors on Lesson/Unit Level (HIGH PRIORITY)

**Status**: 🔴 HIGH PRIORITY, HIGH IMPACT  
**Updated**: 2025-12-15

**Problem**: Tier, exam board, and KS4 option information is essential for KS4 filtering, but currently requires traversing the sequence hierarchy to determine.

#### ⚠️ Critical Complexity: Many-to-Many Relationships

The V0 API wisely handles KS4 attributes top-down (via sequences) rather than bottom-up because **relationships are many-to-many**:

| Relationship                | Cardinality   | Example                                                    |
| --------------------------- | ------------- | ---------------------------------------------------------- |
| Lesson → Tiers              | Many-to-many  | "quadratic-factorising" appears in Foundation AND Higher   |
| Lesson → Exam Boards        | Many-to-many  | Same lesson may appear in AQA AND Edexcel sequences        |
| Lesson → Units              | Many-to-many  | Same lesson may appear in multiple units                   |
| Unit → Programmes           | Many-to-many  | Same unit may appear in multiple programme contexts        |

**Bottom-up** (from lesson/unit): Complex—a single lesson can have multiple valid values  
**Top-down** (from sequence): Deterministic—you traverse a specific path to a specific context

This is why the schema provides these attributes at the sequence level, not the resource level.

#### The Critical Distinction: Search vs Filtering

| Concern       | Purpose                                       | Technical Need                          | Example                                    |
| ------------- | --------------------------------------------- | --------------------------------------- | ------------------------------------------ |
| **Search**    | Find relevant content by meaning/keywords     | Full-text fields, semantic embeddings   | "quadratic equations" → ranked results     |
| **Filtering** | Narrow results by exact categorical criteria  | Keyword/enum fields for faceting        | tier="foundation" AND examBoard="aqa"      |

**Search** is about *relevance ranking*—which results best match the query?  
**Filtering** is about *inclusion/exclusion*—which results meet exact criteria?

Both are orthogonal and both are essential. The current API supports search well (rich text content) but makes filtering on KS4 attributes difficult without upstream enhancements.

#### What "Good" Looks Like

##### Part 1: Define Enums in OpenAPI Schema (CRITICAL)

All filterable values should be defined as proper enums in `components/schemas`:

```yaml
components:
  schemas:
    Tier:
      type: string
      enum: ["foundation", "higher"]
      description: "GCSE tier level"
    
    ExamBoard:
      type: string
      enum: ["aqa", "edexcel", "ocr", "eduqas", "edexcelb"]
      description: "Exam board identifier"
    
    KeyStage:
      type: string
      enum: ["ks1", "ks2", "ks3", "ks4"]
      description: "UK National Curriculum key stage"
    
    Subject:
      type: string
      enum: ["art", "citizenship", "computing", ...]
      description: "Curriculum subject"
```

**Why enums matter**:

- **Type safety**: Code generators produce strongly-typed SDKs
- **Validation**: Invalid values rejected at API boundary
- **Discovery**: Consumers know all valid values without guessing
- **Filtering**: Enables `GET /lessons?tier=foundation` with validation

##### Part 2: Include Arrays on Resources (Handles Many-to-Many)

Because relationships are many-to-many, use **arrays** not scalar values:

```json
{
  "lessonSlug": "quadratic-equations-factorising",
  "lessonTitle": "Factorising Quadratic Equations",
  "tiers": ["foundation", "higher"],
  "examBoards": ["aqa", "edexcel"],
  "programmes": [
    "maths-secondary-ks4-foundation-aqa",
    "maths-secondary-ks4-higher-aqa",
    "maths-secondary-ks4-foundation-edexcel",
    "maths-secondary-ks4-higher-edexcel"
  ]
}
```

**Why arrays work**:

- **Truthful**: Reflects reality that one lesson can belong to multiple contexts
- **Filterable**: ES/SQL can query "WHERE 'foundation' IN tiers"
- **No false negatives**: Searching for "foundation tier" content finds ALL applicable lessons

##### Part 3: Support Contextual Fetching (Optional Enhancement)

For consumers who need a specific context, support path-based fetching:

```text
GET /sequences/maths-secondary-ks4-higher-aqa/lessons/quadratic-equations-factorising
```

Response includes the **context** in which it was fetched:

```json
{
  "lessonSlug": "quadratic-equations-factorising",
  "context": {
    "tier": "higher",
    "examBoard": "aqa",
    "programme": "maths-secondary-ks4-higher-aqa"
  },
  "allTiers": ["foundation", "higher"],
  "allExamBoards": ["aqa", "edexcel"]
}
```

#### Consumer Value Matrix

| Enhancement                          | Consumer Benefit                                               | Implementation Effort |
| ------------------------------------ | -------------------------------------------------------------- | --------------------- |
| **Define tier/examBoard as enums**   | Type-safe SDKs, validation, discoverability                    | Low                   |
| **Arrays on lesson/unit responses**  | Truthful representation enabling "any match" filtering         | Medium                |
| **Contextual path-based fetching**   | Exact context when needed (e.g., for canonical URLs)           | Medium-High           |
| `GET /lessons?tier=...` query param  | Server-side filtering (most efficient for large result sets)   | Medium-High           |

#### Current Workaround (Suboptimal)

Our semantic search indexing currently:

1. Fetches sequence-level data via top-down traversal
2. Associates lessons/units with ALL tiers and exam boards they appear in
3. Indexes as arrays for "any match" ES queries
4. Cannot efficiently pre-filter at the API level (must fetch all, filter client-side)

This works but is expensive and requires complex traversal logic.

#### Request Summary

**Minimum viable request** (Low effort, high impact):

1. Define `Tier`, `ExamBoard`, and other filterable values as proper enums in OpenAPI schema
2. Include array fields on lesson/unit responses showing ALL applicable values

```json
{
  "lessonSlug": "quadratic-equations-factorising",
  "tiers": ["foundation", "higher"],
  "examBoards": ["aqa", "edexcel"]
}
```

**Priority**: 🔴 HIGH — KS4 content is incomplete without these fields for filtering. This blocks meaningful GCSE curriculum navigation.

**Note**: The many-to-many nature of these relationships is respected—arrays handle reality accurately.

#### Interim Workaround: Sequence Traversal Denormalisation

Until the upstream API provides flat fields, we implement **denormalisation at ingest time**:

1. Traverse `/sequences/{sequence}/units?year={year}` endpoints
2. Build lookup tables mapping `unitSlug` → tiers, examBoards, examSubjects
3. Decorate indexed documents with arrays of all applicable values
4. Cache all SDK requests in Redis (14-day TTL with jitter)

**Documented in**: [ADR-080: KS4 Metadata Denormalisation Strategy](../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md)

**Limitations**:

- ~200 additional API calls per full curriculum ingest (cached on subsequent runs)
- Coverage depends on sequence data availability
- Requires maintaining parsing logic for exam board extraction from slugs

This workaround enables KS4 filtering now while upstream enhancements are pending.

---

## New Enhancement Request: Rerank-Optimized Summary Field (2025-12-11)

**Context**: Phase 2 semantic search experimentation revealed that cross-encoder reranking models (like Elastic's `.rerank-v1`) require text fields of ~100-200 tokens for effective semantic signal. Full transcripts (5000+ tokens) cause 22+ second latency due to O(n²) complexity. Short titles (~10 tokens) lack semantic signal and actually degrade quality.

**Request**: Add a pre-computed `rerank_summary` field to lesson responses containing a dense ~200 token summary combining:

- Lesson title
- Keywords
- Key learning points/pupil lesson outcome
- First 1-2 sentences of transcript (if space permits)

**Benefits**:

- Enables effective semantic reranking without latency penalty
- Pre-computed at API level (not computed at query time)
- Could improve NDCG by enabling cross-encoder reranking
- Same field could improve search snippets in UI

**Priority**: Medium - current two-way hybrid (BM25 + ELSER) achieves MRR 0.900, NDCG 0.716. Reranking may close remaining NDCG gap but requires this field to be effective.

**See**: `.agent/research/elasticsearch/hybrid-search-reranking-evaluation.md` for full experimental findings.

## New Enhancement Request: Semantic Summary Field for All Resource Types (2025-12-12)

**Context**: Semantic search requires high-quality text representations for embedding creation. Current API responses contain raw data (titles, transcripts, metadata) but lack pre-computed, information-dense summaries optimised for vector embeddings.

**The Problem**:

- **Lessons**: Full transcripts (5000+ tokens) are too long for effective embeddings; titles (~10 tokens) lack semantic signal
- **Units**: Unit titles alone don't capture pedagogical content; aggregating lesson data at query time is expensive
- **Programmes**: No summary field capturing the curriculum progression and scope
- **Threads**: Thread titles don't convey the conceptual journey across key stages
- **Sequences**: No semantic representation of the multi-year learning pathway
- **Subjects**: Subject responses (`/subjects`, `/subjects/{subject}`) contain only title/slug with no description of pedagogical approach, key themes, or curriculum scope
- **Categories**: Categories appear in unit responses but have only `categoryTitle` and optional `categorySlug` - no descriptions explaining what content types they group

**Request**: Add a `semantic_summary` field to ALL major resource types, pre-computed at API level:

### Lesson semantic_summary (~150-250 tokens)

```json
{
  "lessonSlug": "adding-fractions-same-denominator",
  "lessonTitle": "Adding fractions with the same denominator",
  "semantic_summary": "This KS2 maths lesson teaches Year 4 students to add fractions with common denominators. Students learn that when denominators match, only numerators are added. Key vocabulary includes numerator, denominator, and proper fraction. Prior knowledge: understanding fractions as parts of a whole. Common misconception: adding both numerators and denominators. Practical activities include fraction bar manipulation and pizza sharing problems."
  // ... other fields
}
```

**Composition**: Title + keywords + learning objectives + key vocabulary + prior knowledge + common misconceptions + brief content summary

### Unit semantic_summary (~200-300 tokens)

```json
{
  "unitSlug": "fractions-year-4",
  "unitTitle": "Fractions",
  "semantic_summary": "This Year 4 maths unit on fractions spans 8 lessons progressing from fraction recognition to addition and subtraction with common denominators. Students build on Year 3 understanding of fractions as parts of wholes. Key concepts: equivalent fractions, comparing fractions, adding/subtracting with same denominators, mixed numbers. Vocabulary includes numerator, denominator, equivalent, proper fraction, improper fraction, mixed number. Unit prepares students for Year 5 work on fractions with different denominators."
  // ... other fields
}
```

**Composition**: Unit scope + lesson count + progression summary + key concepts + vocabulary + prior/future knowledge links

### Programme semantic_summary (~250-350 tokens)

```json
{
  "programmeSlug": "maths-primary-ks2",
  "programmeTitle": "Mathematics Key Stage 2",
  "semantic_summary": "The KS2 Mathematics programme covers Years 3-6 (ages 7-11), building from KS1 foundations towards secondary readiness. Number strand progresses from place value and arithmetic to fractions, decimals, and percentages. Geometry develops from 2D shapes to 3D properties, angles, and coordinates. Statistics introduces data handling, charts, and averages. Algebra introduces patterns, sequences, and simple equations. Programme aligns with National Curriculum statutory requirements and prepares for KS3 transition."
  // ... other fields
}
```

**Composition**: Key stage scope + year coverage + strand summaries + progression overview + NC alignment

### Thread semantic_summary (~200-300 tokens)

```json
{
  "threadSlug": "number-fractions-decimals-percentages",
  "threadTitle": "Number: Fractions, Decimals and Percentages",
  "semantic_summary": "This conceptual thread traces fraction understanding from Year 1 (halves and quarters of shapes) through to Year 11 (algebraic fractions and complex conversions). 118 units across all key stages. Early years focus on concrete representations. KS2 introduces formal notation and operations. KS3 connects fractions to decimals and percentages. KS4 applies to ratio, proportion, and algebraic contexts. Thread demonstrates how abstract number concepts build from physical manipulation to symbolic reasoning."
  // ... other fields
}
```

**Composition**: Conceptual journey + unit count + key stage coverage + progression narrative + pedagogical approach

**Important Composition Principle**: Each resource type's `semantic_summary` should be **curated at that level**, NOT a simple aggregation of child summaries. For example:

- Unit summary uses lesson TITLES and themes, not concatenated lesson summaries
- Programme summary describes strands and progression, not concatenated unit summaries
- Subject summary describes curriculum scope and pedagogy, not concatenated programme summaries

This keeps summaries information-dense (~200 tokens) rather than bloated with redundant nested content.

### Subject semantic_summary (~150-250 tokens)

```json
{
  "subjectSlug": "maths",
  "subjectTitle": "Mathematics",
  "semantic_summary": "Mathematics curriculum spanning KS1-KS4 (ages 5-16) across primary and secondary phases. Core strands: Number (place value, operations, fractions, decimals, percentages), Algebra (patterns, equations, graphs), Geometry (shapes, angles, transformations, coordinates), Statistics (data handling, probability, averages), Ratio and Proportion. Primary focus on concrete and pictorial representations building to abstract reasoning. Secondary develops formal mathematical thinking and problem-solving. Supports National Curriculum statutory requirements with tiered pathways at KS4 (Foundation/Higher).",
  "sequenceSlugs": [...],
  "years": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  "keyStages": [...]
}
```

**Composition**: Subject scope + key stage coverage + core strands/themes + pedagogical approach + curriculum alignment

### Sequence semantic_summary (~200-300 tokens)

```json
{
  "sequenceSlug": "science-secondary-aqa",
  "sequenceTitle": "Science Secondary AQA",
  "semantic_summary": "Secondary science sequence for Years 7-11 following AQA exam board specification. KS3 (Years 7-9) builds foundational understanding across Biology, Chemistry, and Physics with integrated practical skills. KS4 (Years 10-11) offers differentiated pathways: Combined Science (2 GCSEs covering all three disciplines), or separate Biology, Chemistry, Physics GCSEs. Each pathway available at Foundation and Higher tiers. Sequence emphasises scientific enquiry, working scientifically, and real-world applications. Prepares students for A-Level sciences or vocational pathways.",
  "years": [7, 8, 9, 10, 11],
  "keyStages": [...],
  "ks4Options": {...}
}
```

**Composition**: Sequence scope + year range + exam board context + pathway descriptions + tier information + progression outcomes

### Category semantic_summary (~100-150 tokens)

Categories group units thematically within subjects. Currently, categories only have titles without descriptions.

```json
{
  "categorySlug": "reading-writing-oracy",
  "categoryTitle": "Reading, writing & oracy",
  "semantic_summary": "Units focused on developing core literacy skills: reading comprehension, decoding, fluency and inference; writing composition, grammar, punctuation and spelling; and spoken language including listening, discussion, and presentation. These skills form the foundation for accessing all curriculum areas and are developed progressively from EYFS through to KS4."
  // ... other fields
}
```

**Composition**: Category purpose + skills covered + cross-curricular importance + progression context

**Why This Matters for Semantic Search**:

1. **Sparse embeddings (ELSER)**: Pre-computed summaries provide optimal token density for sparse vector models. Current approach aggregates lesson snippets at index time, but API-level summaries would be authoritative and consistent.

2. **Dense embeddings**: Information-dense summaries (~200 tokens) are ideal for dense vector models. Full transcripts exceed context windows; titles lack signal.

3. **Multi-index search**: Enables consistent semantic representation across lesson index, unit index, and future programme/thread indices.

4. **Hybrid search quality**: Semantic summaries improve both BM25 (keyword density) and vector search (semantic signal) simultaneously.

5. **Reranking**: Same field can be used for cross-encoder reranking (see related request above).

**Embedding Strategy**:

For sparse embeddings (ELSER), we may want to create semantic indices for BOTH:

- Full lesson transcript (for detailed content matching)
- Semantic summary (for conceptual/pedagogical matching)

This dual-index approach allows queries like "adding fractions" to match both:

- Lessons that mention "adding fractions" in transcript (lexical + sparse)
- Lessons about fraction addition concepts even if exact phrase isn't used (semantic summary)

**Current Workaround**:

We currently create `rollup_text` fields at index time by aggregating:

- Lesson planning snippets
- Prior knowledge requirements
- National curriculum statements

This works but:

- Requires re-indexing when aggregation logic changes
- Not authoritative (we compute from API data)
- Inconsistent with what API consumers see
- No semantic summaries for units/programmes/threads

**Interim Solution: Local Generation at Ingest Time**

Until the upstream API provides `semantic_summary` fields, we can generate them locally during data ingestion. Here's what's feasible with current API data:

| Resource Type | Feasibility | Available Fields for Composition                                                                                                                             |
| ------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Lesson**    | ✅ High     | `lessonTitle`, `lessonKeywords`, `keyLearningPoints`, `misconceptionsAndCommonMistakes`, `pupilLessonOutcome`, `teacherTips`, transcript excerpt             |
| **Unit**      | ✅ High     | `unitTitle`, `priorKnowledgeRequirements`, `nationalCurriculumContent`, `whyThisWhyNow`, `threads`, `categories`, `unitLessons[].lessonTitle`, `description` |
| **Sequence**  | ⚠️ Medium   | `sequenceSlug`, year groupings, unit titles per year, `ks4Options` (exam board/tier)                                                                         |
| **Thread**    | ⚠️ Medium   | `threadTitle`, `threadSlug`, unit titles with order, key stage span (derivable)                                                                              |
| **Subject**   | ⚠️ Medium   | `subjectTitle`, `sequenceSlugs`, `years`, `keyStages` - limited pedagogical content                                                                          |
| **Programme** | ❌ Low      | Programme endpoints don't exist yet; would need to derive from sequences                                                                                     |
| **Category**  | ❌ Low      | Only `categoryTitle` and `categorySlug` available - no descriptions                                                                                          |

---

### Current Implementation Status (2025-12-12)

**Phase 3 Scope**: Lessons and units only. Other resource types are deferred.

**ADRs**:

- [ADR-075](../../docs/architecture/architectural-decisions/075-dense-vector-removal.md) - Dense vector code removal
- [ADR-076](../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) - ELSER-only embedding strategy
- [ADR-077](../../docs/architecture/architectural-decisions/077-semantic-summary-generation.md) - Semantic summary generation

**Current Embedding State**:

| Resource | ELSER Field       | Content Source              | Issue                      |
| -------- | ----------------- | --------------------------- | -------------------------- |
| Lessons  | `lesson_semantic` | Full transcript (~5000 tok) | Dilutes pedagogical signal |
| Units    | `unit_semantic`   | `rollupText` (~200-400 tok) | Aggregated, not curated    |

**Planned Enhancement**:

| Resource | New/Updated Field         | Content                     | Generation     |
| -------- | ------------------------- | --------------------------- | -------------- |
| Lessons  | `lesson_summary_semantic` | ~200 token summary (NEW)    | Template-based |
| Units    | `unit_semantic`           | Replace rollup with summary | Template-based |

**Note**: `rollup_text` retained for units to enable side-by-side quality comparison.

---

**Local Generation Approach**:

1. **Template-based composition** (Phase 3): For lessons and units, compose summaries using templates:

   ```text
   Lesson: "{lessonTitle} is a {keyStage} {subject} lesson for Year {year}.
   Key learning: {keyLearningPoints[0..2]}. Keywords: {keywords}.
   Prior knowledge: {priorKnowledge}. Common misconception: {misconceptions[0]}.
   Pupil outcome: {pupilLessonOutcome}."
   ```

   ```text
   Unit: "{unitTitle} is a {keyStage} {subject} unit containing {lessonCount} lessons.
   Overview: {whyThisWhyNow}. Key concepts: {derived from lesson titles}.
   Prior knowledge: {priorKnowledgeRequirements[0..2]}.
   National curriculum: {nationalCurriculumContent[0..2]}.
   Lessons: {lessonTitles as comma-separated list}."
   ```

2. **LLM-enhanced generation** (Future): For richer summaries, use Elastic-native LLM (`.gp-llm-v2-chat_completion`) to synthesise available fields into coherent prose. This adds compute cost but produces more natural, information-dense summaries. Deferred to Phase 4+ after template approach is validated.

3. **Static enrichment** (Deferred): For subjects and threads with limited API data, maintain a hand-authored enrichment file with semantic descriptions that gets merged at ingest time.

**Caching Strategy**:

- Use existing Redis instance (same as curriculum API caching per ADR-066)
- Cache key pattern: `semantic_summary:{type}:{slug}:v{version}`
- TTL: Same as curriculum data (24 hours or until next ingest)
- Version key incremented on template changes to invalidate cache

**Implementation Location**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transforms.ts`

**Tracking**: This interim solution should be replaced when upstream API provides native `semantic_summary` fields. The local generation logic can then be removed or repurposed for validation.

**Benefits**:

- **Single source of truth**: API provides the canonical semantic representation
- **Consistent embeddings**: All consumers (semantic search, RAG, AI assistants) use same summary
- **Reduced compute**: Pre-computed at API level, not at query/index time
- **Better search quality**: Optimised summaries improve retrieval metrics
- **Future-proof**: Supports dense, sparse, and hybrid embedding strategies

**Priority**: **High** - foundational for semantic search quality across all resource types

**Effort**: Medium - requires content team to define summary composition rules; backend to compute and cache summaries

**Enables**:

- High-quality semantic search across lessons, units, programmes, threads, subjects, sequences, and categories
- Consistent embeddings for RAG-based curriculum assistants
- Improved reranking (complements the ~200 token rerank_summary request)
- Multi-index search with consistent semantic representation across all resource types
- Subject-level and sequence-level search (e.g., "find science sequences with practical work focus")
- Category-aware filtering and discovery
- Future AI features requiring comprehensive curriculum understanding

## Executive Summary

Oak National Academy has built something unique: a comprehensive, open curriculum API containing 30,000+ lessons, 1,000+ units, and rich educational metadata. This isn't just another education dataset—it's one of the most complete, openly accessible curriculum resources in the world.

**The opportunity**: With relatively straightforward OpenAPI schema improvements, we can transform this resource from a traditional API into an intelligent curriculum platform that AI assistants can reason about, compose, and use to help teachers in entirely new ways. The same schema that helps human developers understand our API can be enriched to help AI agents discover, combine, and intelligently apply our curriculum data.

**The multiplier effect**: Because our tooling generates everything from the OpenAPI schema, each enhancement you make flows automatically to:

- Type-safe SDKs
- AI tool descriptors for ChatGPT, Claude, Gemini
- Model Context Protocol (MCP) servers
- Semantic search integration
- Future intelligent curriculum assistants

Small improvements to the schema unlock exponential value through AI tooling. This document outlines those improvements.

**Note**: Oak is in a unique position—most education organisations either have closed APIs or limited content. You have both comprehensive curriculum data AND an open API. These enhancements help us make the most of this incredible resource by making it intelligently accessible to AI assistants that can help teachers in their day-to-day work.

## Vision: From API Documentation to Intelligent Curriculum Platform

### The Paradigm Shift

Traditionally, API documentation serves **human developers** who:

- Read endpoint descriptions to understand what they do
- Consult parameter docs to learn valid inputs
- Study response schemas to parse outputs
- Browse through multiple endpoints to find what they need

Now, we're enabling **AI agents** to:

- Discover appropriate tools based on natural language queries ("find KS3 science lessons about photosynthesis")
- Compose multiple tools to accomplish complex tasks (search → filter → fetch details → compare → recommend)
- Understand curriculum structure and relationships (key stage → unit → lesson hierarchy)
- Validate educational appropriateness (prior knowledge requirements, NC alignment)
- Generate teacher-ready resources (lesson plans, unit overviews, progression pathways)

**The key insight**: AI agents don't just call APIs—they reason about when to use them, how to combine them, and what the results mean. This requires richer metadata than traditional API documentation provides.

### What We're Building: The Tool Ecosystem

Our AI integration comprises four layers of tools, each building on the last:

#### **Layer 1: Direct Proxy Tools** ✅ (Currently Available)

26 tools that directly map to API endpoints:

- `get-lessons-summary` → `GET /lessons/{lesson}/summary`
- `get-search-lessons` → `GET /search/lessons`
- `get-units-summary` → `GET /units/{unit}/summary`
- etc.

**Value**: AI assistants can access any curriculum data via natural language requests.

**Enabled by**: Current API endpoints + OpenAPI schema.

#### **Layer 2: Aggregated Tools** ✅ (Currently Available)

Tools that combine multiple endpoints for efficiency:

- **`search`**: Searches both lessons and transcripts in parallel
- **`fetch`**: Routes to appropriate endpoint based on ID prefix (lesson:, unit:, subject:)

**Value**: Reduces tool call overhead; agents don't need to know which specific endpoint to use.

**Enabled by**: Well-structured endpoint patterns + clear response schemas.

**Would be improved by**: Items #1-2 (descriptions, summaries) help agents choose between `search` and direct access.

#### **Layer 3: Service Integration Tools** 🔄 (In Development)

Tools that integrate external AI services with curriculum data. **Note**: These tools require external services beyond the curriculum API itself.

**Semantic Search** (In Development - Requires External Search Service):

- Hybrid lexical + semantic search across curriculum content
- Natural language queries: "lessons about the water cycle for year 5"
- Contextual recommendations based on teaching goals
- **What the API provides**: Curriculum data endpoints that semantic search indexes
- **What external services provide**: Vector embeddings, semantic matching, hybrid search orchestration

**Pedagogical Validation** (Planned - Requires AI Platform Team Service):

- Validates lesson plans against curriculum standards
- Checks NC alignment and age-appropriateness
- Suggests improvements based on pedagogical principles
- **What the API provides**: Lesson metadata, NC mapping, curriculum structure
- **What external services provide**: Pedagogical analysis, validation rules, recommendation engine

**Content Sensitivity Analysis** (Planned - Requires AI Platform Team Service):

- Analyzes lesson content for safeguarding requirements
- Recommends supervision levels
- Flags content guidance needs
- **What the API provides**: Lesson content and context
- **What external services provide**: Content analysis, sensitivity detection, safeguarding rules

**Value**: AI-powered enhancements to curriculum discovery and validation.

**Enabled by**: Items #3 (ontology), #4 (error handling), #5 (parameter examples) provide the structural knowledge these services need.

#### **Layer 4: Advanced Intelligence Tools** 📋 (Planned)

High-level tools that combine everything. **Note**: Some are purely API-driven, others require external AI services.

**Discovery & Filtering** (Mix of API + Services):

- `find-units-by-thread`: Cross-key-stage progression pathways (e.g., "show me how fractions progress from KS1 to KS4")
  - **API provides**: Ontology, curriculum structure, thread/topic metadata
  - **MCP orchestration**: Queries multiple endpoints, filters by thread
- `find-lessons-with-fieldwork`: Context-aware filtering (e.g., "outdoor learning opportunities in geography")
  - **API provides**: Lesson metadata, tags, activity types
  - **MCP orchestration**: Filters and ranks based on criteria
- `discover-curriculum-gaps`: Identify missing content for specific topics/year groups
  - **API provides**: Complete curriculum map, coverage data
  - **External services**: Gap analysis algorithm, NC mapping

**Comparative Analysis** (API-Driven with MCP Orchestration):

- `compare-units`: Side-by-side comparison of units across year groups
  - **API provides**: All unit data, relationships, progression indicators
  - **MCP orchestration**: Fetches multiple units, structures comparison
- `analyse-nc-coverage`: Gap analysis for National Curriculum requirements
  - **API provides**: NC alignment metadata, curriculum coverage
  - **MCP orchestration**: Aggregates and analyses coverage patterns
- `trace-prior-knowledge`: Map prerequisite chains across lessons
  - **API provides**: Ontology relationships, prerequisite metadata (if available)
  - **MCP orchestration**: Traverses dependency graph

**Intelligent Recommendations** (Requires External AI Services):

- `recommend-adaptations`: Suggest how to adapt lessons for different contexts (e.g., "adapt this lesson for students with dyslexia")
  - **API provides**: Lesson content, resources, structure
  - **External services**: Pedagogical AI, adaptation recommendations
- `suggest-progression`: Recommend next lessons based on current teaching
  - **API provides**: Curriculum structure, lesson sequences
  - **External services**: Learning path optimization, student progress tracking
- `find-related-content`: Semantic similarity-based discovery across subjects
  - **API provides**: Lesson content for indexing
  - **External services**: Semantic search, similarity matching

**Bulk Operations** (API-Driven with MCP Orchestration):

- `bulk-unit-summaries`: Fetch multiple units efficiently for comparison
  - **API provides**: All endpoint data
  - **MCP orchestration**: Batch requests, error handling, response aggregation
- `generate-lesson-plan`: Compile lesson + assets + quiz into teacher-ready format
  - **API provides**: Lesson data, downloadable resources, quiz content
  - **MCP orchestration**: Fetches related data, formats output
- `export-curriculum-data`: Structured exports (JSON, Markdown, CSV) for external tools
  - **API provides**: All curriculum data
  - **MCP orchestration**: Format transformation, export generation

**Value**: Transform the API from data access to intelligent curriculum assistance. Instead of teachers searching for lessons, the AI helps them plan entire units, adapt content to their context, and understand progression pathways.

**Enabled by**: All items in this wish list, especially #1 (descriptions for tool selection), #3 (ontology for relationships), #4 (error handling for robustness).

### The Multiplier Effect of Schema Improvements

Here's the key: **every enhancement you make to the OpenAPI schema automatically enables new capabilities across all four tool layers**.

**Example 1: Adding "Use this when" descriptions (Item #1)**

- Layer 1 tools: AI chooses correct endpoint 70% more reliably
- Layer 2 tools: Better routing in `search` vs `fetch` decisions
- Layer 3 tools: Semantic search knows when to call curriculum API vs search service
- Layer 4 tools: Intelligent recommendations compose the right tools in the right order

**Example 2: Creating `/ontology` endpoint (Item #3)**

- Layer 1 tools: Responses include relationship context
- Layer 2 tools: `fetch` can traverse relationships (lesson → unit → programme)
- Layer 3 tools: Pedagogical validation understands curriculum structure
- Layer 4 tools: Comparative analysis and progression tracking become possible

**Example 3: Documenting error responses (Item #4)**

- Layer 1 tools: Handle legitimate 404s gracefully (practical lessons have no transcripts)
- Layer 2 tools: Aggregated tools provide helpful messages instead of failing
- Layer 3 tools: Services can distinguish "resource unavailable" from "request error"
- Layer 4 tools: Bulk operations handle partial failures intelligently

### Why This Matters for Teachers

The ultimate beneficiaries are teachers. With these enhancements, AI assistants can:

1. **"Find me KS3 science lessons about photosynthesis"** → Semantic search + filtering + NC alignment checking
2. **"Show me how fractions progress from year 1 to year 6"** → Cross-key-stage analysis + progression pathways
3. **"Adapt this lesson for outdoor learning at our school"** → Context-aware recommendations + related content discovery
4. **"What prior knowledge do students need for this unit?"** → Prerequisite tracing + knowledge mapping
5. **"Generate a 6-week unit plan on ancient civilizations"** → Bulk operations + comparative analysis + export

All of this becomes possible through simple OpenAPI schema enhancements combined with intelligent tooling.

## How We Generate Tools from Your OpenAPI Schema

To understand why these enhancements matter, here's how our system works:

```plaintext
Your OpenAPI Schema
        ↓
   pnpm type-gen (automated)
        ↓
    ┌────────────────────────────┐
    │ Generated Artefacts        │
    ├────────────────────────────┤
    │ • TypeScript types         │
    │ • Zod validators           │
    │ • MCP tool descriptors     │
    │ • Client SDK methods       │
    │ • Documentation            │
    └────────────────────────────┘
        ↓
   AI Assistants
   (ChatGPT, Claude, Gemini)
```

**The key**: Everything flows from your schema. You don't need to understand MCP, SDKs, or AI tooling—you just need to enrich your OpenAPI documentation in ways that benefit both human and AI consumers.

**The result**: Better API metadata = better AI integration for free.

## Audience

This wish list is for the Open Curriculum API cross-functional squad (backend engineers, product, documentation). Items are prioritised by impact on AI tool capabilities and teacher value.

---

## High Priority – AI Tool Discovery

### 1. Enrich Operation Descriptions with "Use This When" Pattern

**Current state:**

```yaml
description: 'This endpoint returns lessons matching search criteria'
```

**Desired state:**

```yaml
summary: 'Search curriculum lessons'
description: |
  Use this when searching for specific lessons by title, topic, or content keywords.

  Returns lesson metadata filtered by optional key stage (ks1-ks4) and subject.
  Results include lesson titles, slugs, canonical URLs, and subject/unit context.

  Do not use this for:
  - Searching within video transcripts (use GET /search/transcripts)
  - Finding lessons by exact slug (use GET /lessons/{lesson}/summary)
  - Browsing all lessons in a unit (use GET /key-stages/{keyStage}/subject/{subject}/lessons)

  Example queries: "KS3 science photosynthesis", "fractions year 5", "World War 2"
```

**Pattern for all endpoints:**

1. **Line 1:** "Use this when [primary scenario]"
2. **Middle:** Key parameters, filters, and what's returned
3. **Exclusions:** "Do not use this for [negative cases]" pointing to alternative endpoints
4. **Examples:** Concrete query examples showing intended use

**Why:** Dramatically improves AI tool selection accuracy. Models use descriptions to choose between similar endpoints. Clear boundaries prevent tool misuse.

**Impact:** Reduces wrong-tool invocations by ~70% based on OpenAI's metadata guidance.

**Applies to:** All 26+ endpoints in the API schema.

**Enables**:

- **Layer 1**: Agents choose `get-lessons-summary` vs `get-search-lessons` correctly
- **Layer 2**: `search` and `fetch` tools make better routing decisions
- **Layer 3**: Semantic search knows when to call curriculum API vs search service
- **Layer 4**: Advanced tools like `find-lessons-with-fieldwork` can compose the right tools in sequence

---

### 2. Add Operation Summaries for Display Names

**Current state:**

```yaml
/search/lessons:
  get:
    operationId: 'searchLessons-searchLessons'
    # No summary field
```

**Desired state:**

```yaml
/search/lessons:
  get:
    operationId: 'searchLessons-searchLessons'
    summary: 'Search curriculum lessons'
    description: |
      Use this when searching for specific lessons...
```

**Why:** AI tools can use `summary` as a human-readable display name separate from programmatic `operationId`. Improves UI presentation in ChatGPT, Claude, and other AI interfaces.

**Guidelines:**

- Keep summaries under 50 characters
- Use title case
- Focus on user intent, not implementation
- Good: "Search Curriculum Lessons", "Get Lesson Transcript"
- Avoid: "Retrieve lesson data via search endpoint"

**Impact:** Better tool organisation and discovery in AI interfaces.

**Applies to:** All endpoints.

**Enables**:

- **All layers**: Human-readable tool names in ChatGPT/Claude interfaces
- **Layer 4**: Clearer tool categorisation for complex workflows (e.g., grouping "Search Tools", "Detail Tools", "Export Tools")

---

## High Priority – Structural Knowledge

### 3. Create `/ontology` or `/schema/curriculum` Endpoint

**What:** New endpoint returning curriculum domain model metadata.

**Returns:**

```json
{
  "version": "2024-10",
  "curriculum_structure": {
    "key_stages": [
      {
        "slug": "ks1",
        "name": "Key Stage 1",
        "age_range": "5-7",
        "year_groups": ["1", "2"],
        "description": "Foundation stage covering basic literacy and numeracy"
      },
      {
        "slug": "ks2",
        "name": "Key Stage 2",
        "age_range": "7-11",
        "year_groups": ["3", "4", "5", "6"],
        "description": "Primary education building on KS1 foundations"
      }
    ],
    "subjects": [
      {
        "slug": "maths",
        "name": "Mathematics",
        "key_stages": ["ks1", "ks2", "ks3", "ks4"],
        "typical_unit_count": 12,
        "description": "Core mathematics curriculum across all key stages"
      }
    ]
  },
  "resource_types": {
    "lesson": {
      "has_video": true,
      "has_transcript": true,
      "has_downloadable_resources": true,
      "canonical_url_pattern": "https://www.thenational.academy/teachers/lessons/{lessonSlug}",
      "description": "Individual teaching session with video, resources, and assessment",
      "note": "URL pattern must match OWA production URLs"
    },
    "unit": {
      "contains": ["lessons"],
      "typical_lesson_count": "4-8",
      "canonical_url_pattern": "https://www.thenational.academy/teachers/units/{unitSlug}",
      "description": "Collection of related lessons forming a teaching block",
      "note": "URL pattern must match OWA production URLs"
    },
    "programme": {
      "contains": ["units"],
      "groups_by": "year",
      "canonical_url_pattern": "https://www.thenational.academy/teachers/programmes/{programmeSlug}",
      "description": "Year-long progression pathway for a subject in a specific context",
      "note": "URL pattern must match OWA production URLs (if applicable)"
    },
    "thread": {
      "spans": ["units"],
      "typical_unit_count": "10-100+",
      "description": "Cross-unit conceptual strand showing how ideas build from early years to GCSE",
      "examples": [
        "number (118 units, Reception→Year 11)",
        "bq01-biology-what-are-living-things (32 units, KS1→KS4)"
      ],
      "note": "Threads are programme-agnostic and show pedagogical progression"
    }
  },
  "relationships": {
    "lesson_belongs_to": ["unit", "subject", "key_stage"],
    "unit_belongs_to": ["programme", "subject", "key_stage"],
    "unit_in_thread": ["thread"],
    "programme_belongs_to": ["subject"],
    "thread_spans": ["key_stages", "years", "programmes"],
    "hierarchy": "programme → unit → lesson",
    "progression": "thread → units (ordered by conceptual development)"
  },
  "tool_usage_guidance": {
    "discovery_flow": [
      "Start with GET /subjects to see available subjects",
      "Use GET /key-stages/{keyStage}/subject/{subject}/units to browse units",
      "Use GET /search/lessons for keyword-based discovery",
      "Use GET /threads to explore conceptual progression pathways"
    ],
    "lesson_detail_flow": [
      "GET /lessons/{lesson}/summary for overview",
      "GET /lessons/{lesson}/transcript for video content",
      "GET /lessons/{lesson}/quiz for assessment",
      "GET /lessons/{lesson}/assets for downloadable resources"
    ],
    "planning_workflow": [
      "Search or browse to find relevant lessons",
      "Fetch lesson summaries to review content",
      "Download resources for classroom use"
    ],
    "progression_workflow": [
      "GET /threads to list conceptual strands",
      "GET /threads/{threadSlug}/units to see how a concept develops",
      "Use unit order to identify prerequisites and next steps",
      "Cross-reference with programmes for context-specific delivery"
    ]
  }
}
```

**Why:** **Biggest impact for AI integration.** Provides structural knowledge that AI models cannot infer from individual endpoint schemas. Enables intelligent tool composition and reduces trial-and-error API exploration.

**Benefits:**

- AI understands curriculum hierarchy without guessing
- Clearer resource type distinctions (lesson vs unit vs programme)
- Canonical URL patterns enable link generation
- Tool usage guidance improves workflow composition
- Single source of truth for domain model

**Impact:** Reduces multi-turn discovery conversations by ~60%; enables AI to plan efficient tool call sequences.

**Effort:** 1-2 days (backend + documentation).

**Enables**:

- **Layer 1**: Tools can include relationship context in responses (e.g., "this lesson is part of unit X in programme Y")
- **Layer 2**: `fetch` tool can traverse relationships intelligently (fetch lesson → include parent unit info)
- **Layer 3**:
  - Pedagogical validation understands NC alignment and progression
  - Semantic search can weight results by curriculum position
  - Content analysis knows age-appropriateness from key stage metadata
- **Layer 4**: **CRITICAL FOR ALL ADVANCED TOOLS**
  - `find-units-by-thread`: Needs hierarchy to trace progression pathways
  - `compare-units`: Needs structure to do meaningful comparisons
  - `analyse-nc-coverage`: Needs ontology to map content to standards
  - `trace-prior-knowledge`: Needs relationships to find prerequisite chains
  - All recommendation tools need structural understanding

**Current State & Roadmap:**

1. **Immediate** (POC): A static `get-ontology` tool serving hand-authored JSON validates the value proposition in ~2 hours. See `.agent/plans/sdk-and-mcp-enhancements/00-ontology-poc-static-tool.md`.

2. **Short term** (MCP Layer): Full schema-extraction implementation that auto-generates ontology from OpenAPI at type-gen time, merged with educational guidance. See `.agent/plans/sdk-and-mcp-enhancements/02-curriculum-ontology-resource-plan.md`.

3. **Medium term** (Data Platform Team): The Data Platform team is working on a proper, comprehensive curriculum ontology that will be the authoritative source of truth for curriculum structure, relationships, and metadata.

4. **Long term** (API Integration): When the Data Platform ontology is complete and exposed via the API, we can consume it directly through the `/ontology` endpoint.

**Note on "Start Here" Experience (Nov 2025):**

We have implemented a comprehensive "start here" experience in the MCP layer with hand-crafted metadata:

- **`tool-guidance-data.ts`**: Server overview, tool categories (discovery, browsing, fetching, progression), workflow guides, tips, and ID format documentation
- **Documentation Resources**: Markdown docs exposed via MCP `resources/list` (`docs://oak/getting-started.md`, `docs://oak/tools.md`, `docs://oak/workflows.md`)
- **`get-help` Tool**: Aggregated tool returning structured guidance about how to use the server's tools effectively
- **MCP Prompts**: Workflow templates for common tasks (find-lessons, lesson-planning, progression-map)

This hand-crafted metadata provides server-level onboarding that tool descriptions alone cannot achieve. Ideally, this guidance would eventually be:

1. Generated from enriched OpenAPI metadata (Items #1, #2 in this wishlist)
2. Supplemented by the upstream `/ontology` endpoint (Item #3)
3. Enhanced with behavioural metadata for tool safety (Item #8)

See `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts` and related files for the current implementation.

**Benefits of Native API Endpoint:**

- Benefit all API consumers, not just AI tools
- Provide a single source of truth across all Oak systems
- Enable dynamic curriculum updates without rebuild cycles
- Reduce build-time processing in consuming applications
- Ensure consistency between curriculum data and structural knowledge

**Migration Path:** Interim solution → Data Platform ontology → API endpoint. The educational guidance layer (AI-specific pedagogy) remains at the AI tool level, while structural knowledge comes from the API.

---

## High Priority – Error Response Documentation

### 4. Document All Error Responses Including Legitimate 404s

**Current state:**

Most endpoints only document `200` success responses. Error responses are undocumented in the OpenAPI schema, even though the API returns them in production.

```yaml
/lessons/{lesson}/transcript:
  get:
    responses:
      '200':
        description: 'Successful response'
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TranscriptResponseSchema'
      # No other responses documented
```

**Actual API behavior:**

```bash
# Lesson with transcript
GET /api/v0/lessons/add-and-subtract-two-numbers-that-bridge-through-10/transcript
→ HTTP 200 with {transcript, vtt}

# Practical lesson without video content
GET /api/v0/lessons/making-apple-flapjack-bites/transcript
→ HTTP 404 with {"message": "Transcript not available for this query", "code": "NOT_FOUND"}
```

**Desired state:**

Document all actual API responses, distinguishing between:

1. **Legitimate resource absence** (404s that aren't errors - resource can't exist)
2. **Client errors** (400, 401, 403, 404 for invalid IDs)
3. **Server errors** (500, 502, 503)

```yaml
/lessons/{lesson}/transcript:
  get:
    responses:
      '200':
        description: 'Successful response - lesson has video transcript available'
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TranscriptResponseSchema'
      '404':
        description: |
          Transcript not available. This is expected for lessons without video content,
          such as practical lessons (cooking, PE activities), lessons with only slides,
          or lessons where video has not yet been produced.

          This response indicates the lesson exists but has no transcript, not that
          the lesson itself is missing.
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NotFoundResponse'
            example:
              message: 'Transcript not available for this query'
              code: 'NOT_FOUND'
              data:
                code: 'NOT_FOUND'
                httpStatus: 404
                path: 'getLessonTranscript.getLessonTranscript'
                zodError: null
      '401':
        $ref: '#/components/responses/Unauthorized'
      '500':
        $ref: '#/components/responses/InternalError'
```

**Create reusable error response schemas:**

```yaml
components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        message:
          type: string
          description: 'Human-readable error message'
        code:
          type: string
          description: 'Machine-readable error code'
        data:
          type: object
          properties:
            code:
              type: string
            httpStatus:
              type: integer
            path:
              type: string
            zodError:
              nullable: true
              type: 'null'
      required: [message, code, data]

    NotFoundResponse:
      allOf:
        - $ref: '#/components/schemas/ErrorResponse'
        - type: object
          properties:
            code:
              enum: [NOT_FOUND]

  responses:
    Unauthorized:
      description: 'API key missing or invalid'
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            message: 'API token not provided or invalid'
            code: 'UNAUTHORIZED'

    InternalError:
      description: 'Server encountered an unexpected error'
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            message: 'Internal server error'
            code: 'INTERNAL_ERROR'
```

**Why this matters:**

1. **Type-safe client generation:** Tools like openapi-fetch, openapi-typescript, and code generators require documented responses to generate correct types
2. **Better error handling:** Consumers can distinguish "resource unavailable" from "invalid request" from "server error"
3. **Clearer API contract:** Documents actual production behaviour, not just happy paths
4. **Reduced confusion:** Makes it clear when 404 is expected (e.g., practical lessons have no transcripts) vs when it indicates an error
5. **AI tool integration:** LLMs can provide helpful messages ("This lesson has no transcript") instead of generic errors

**Real-world scenario:**

A lesson planning app uses the API to fetch lesson details:

- Without error documentation: Gets cryptic validation errors, assumes API is broken
- With error documentation: Receives "no transcript available", understands this is expected for practical lessons, gracefully shows alternate content

**Endpoints needing error documentation:**

- **All authenticated endpoints:** Need 401 response documented
- `/lessons/{lesson}/transcript` - Legitimate 404 for practical lessons
- `/lessons/{lesson}/assets` - May return 404 if downloads not yet available
- Any endpoint where resources are optional or conditional
- All endpoints should document 500 responses for completeness

**Differentiation pattern in descriptions:**

- ✅ **"Resource not available"** / **"Not yet published"** = legitimate absence, expected
- ❌ **"Resource not found"** / **"Invalid ID"** = client error, check your request

**Benefits for API maintainers:**

- Single source of truth for error responses
- Easier to keep documentation and implementation in sync
- Better API testing (can verify error responses match schema)
- Reduced support burden (clearer error messages)

**Benefits for all API consumers:**

- SDKs and clients can properly type error handling
- Better debugging (know which errors are expected)
- Clearer integration paths (no trial-and-error to discover error responses)
- Improved application reliability (proper error handling)

**Impact:** Foundational improvement affecting every API consumer. Enables correct error handling in generated clients and AI tools.

**Effort:** 2-3 hours for common error schemas + incremental per-endpoint review (15 minutes each).

**Implementation approach:**

1. Define `ErrorResponse` and `NotFoundResponse` component schemas
2. Create reusable response objects for common errors (401, 500)
3. Document 404 responses for endpoints where resource absence is legitimate
4. Add standard 401, 500 responses to all authenticated endpoints
5. Test that error responses match schema definitions

**Priority:** High - affects correctness of all generated clients and error handling code.

**Enables**:

- **Layer 1**: Tools provide helpful messages ("This practical lesson has no video transcript") instead of generic errors
- **Layer 2**: Aggregated tools handle partial failures gracefully (e.g., `search` continues if transcript search fails)
- **Layer 3**: Services distinguish legitimate absence from errors (pedagogical validator doesn't fail when resources are optional)
- **Layer 4**:
  - `bulk-unit-summaries`: Handles partial failures (some units missing data) intelligently
  - `generate-lesson-plan`: Adapts to available resources (creates plan without transcript if unavailable)
  - `export-curriculum-data`: Marks optional fields as unavailable rather than failing export

**Current State:** We've implemented a temporary workaround that adds expected error responses at build time. This works but requires maintenance. Native error documentation would be cleaner and benefit all API consumers.

---

## High Priority – Programme Variant Information

### 5. Expose Programme Context and Variant Metadata

**Current state:**

The API uses "sequences" as the primary curriculum structure, but the Oak Web Application (OWA) uses "programmes" in user-facing URLs. Our analysis of production data reveals these are **not the same thing**—programmes are contextualized views of sequences.

**The problem:**

**Sequence** (API concept): `science-secondary-aqa`

- Spans Years 7-11 (KS3 + KS4)
- Contains 4 exam subjects (Biology, Chemistry, Combined Science, Physics)
- Each KS4 subject has 2 tiers (Foundation, Higher)
- **Result**: One sequence represents **8 different programme contexts** for Year 10

**Programme** (OWA concept): `biology-secondary-ks4-foundation-aqa`

- Specific to one key stage (ks4)
- Specific to one exam subject (biology)
- Specific to one tier (foundation)
- **Result**: One programme is a single teaching pathway

**Concrete example from production:**

**API sequence** `science-secondary-aqa` maps to these **OWA programme URLs**:

```plaintext
https://www.thenational.academy/teachers/programmes/biology-secondary-ks4-foundation-aqa/units
https://www.thenational.academy/teachers/programmes/biology-secondary-ks4-higher-aqa/units
https://www.thenational.academy/teachers/programmes/chemistry-secondary-ks4-foundation-aqa/units
https://www.thenational.academy/teachers/programmes/chemistry-secondary-ks4-higher-aqa/units
https://www.thenational.academy/teachers/programmes/combined-science-secondary-ks4-foundation-aqa/units
https://www.thenational.academy/teachers/programmes/combined-science-secondary-ks4-higher-aqa/units
https://www.thenational.academy/teachers/programmes/physics-secondary-ks4-foundation-aqa/units
https://www.thenational.academy/teachers/programmes/physics-secondary-ks4-higher-aqa/units
```

**Current API behaviour:**

Tier information is nested deep in Year 10/11 responses only:

```typescript
GET /sequences/science-secondary-aqa/units?year=10

Response:
{
  "year": 10,
  "examSubjects": [
    {
      "examSubjectTitle": "Biology",
      "examSubjectSlug": "biology",
      "tiers": [
        { "tierTitle": "Foundation", "tierSlug": "foundation", "units": [...] },
        { "tierTitle": "Higher", "tierSlug": "higher", "units": [...] }
      ]
    }
  ]
}
```

But:

- `GET /subjects` doesn't include tier information
- Can't query by tier (must fetch all tiers, filter client-side)
- No clear way to map sequence slugs to programme slugs

**What we need:**

**Option A: Add `/programmes` endpoint** (Recommended)

New top-level resource that exposes contextualized curriculum views:

```typescript
GET /programmes

Response:
{
  "programmes": [
    {
      "programmeSlug": "biology-secondary-ks4-foundation-aqa",
      "programmeTitle": "Biology Foundation AQA",
      "subjectSlug": "biology",
      "phaseSlug": "secondary",
      "keyStageSlug": "ks4",
      "tier": { "tierSlug": "foundation", "tierTitle": "Foundation" },
      "examBoard": { "slug": "aqa", "title": "AQA" },
      "baseSequenceSlug": "science-secondary-aqa",
      "years": [10, 11],
      "canonicalUrl": "https://www.thenational.academy/teachers/programmes/biology-secondary-ks4-foundation-aqa"
    },
    {
      "programmeSlug": "maths-primary-ks1",
      "programmeTitle": "Maths Key Stage 1",
      "subjectSlug": "maths",
      "phaseSlug": "primary",
      "keyStageSlug": "ks1",
      "tier": null,
      "examBoard": null,
      "baseSequenceSlug": "maths-primary",
      "years": [1, 2],
      "canonicalUrl": "https://www.thenational.academy/teachers/programmes/maths-primary-ks1"
    }
  ]
}

GET /programmes/{programmeSlug}/units

Response: (similar to current /sequences/{sequence}/units but filtered)
```

**Option B: Enhance existing `/subjects` and `/sequences` endpoints**

Add programme variant information to existing responses:

```typescript
GET /subjects

Response:
{
  "subjects": [
    {
      "subjectSlug": "science",
      "subjectTitle": "Science",
      "sequences": [
        {
          "sequenceSlug": "science-secondary-aqa",
          "programmes": [
            {
              "programmeSlug": "biology-secondary-ks4-foundation-aqa",
              "keyStage": "ks4",
              "tier": "foundation",
              "examSubject": "biology",
              "examBoard": "aqa"
            },
            // ... 7 more programmes for this sequence
          ]
        }
      ]
    }
  ]
}

GET /sequences/{sequence}/programmes

Response: (list of programme variants for this sequence)
```

**Programme factors to expose:**

Based on analysis of OWA URL patterns:

1. **Key Stage** (`ks1`, `ks2`, `ks3`, `ks4`) - programme splits by key stage
2. **Tier** (`foundation`, `higher`, `null`) - KS4 sciences only
3. **Exam Subject** (`biology`, `chemistry`, `physics`, `combined-science`) - KS4 sciences only
4. **Exam Board** (`aqa`, `ocr`, `edexcel`, `eduqas`, `edexcelb`) - KS4 subjects
5. **Pathway** (`core`, `gcse`) - some KS4 subjects (citizenship, computing, PE)
6. **Legacy Flag** (`-l` suffix in programme slugs) - marks older curriculum versions

**Why this matters:**

1. **Teachers navigate by programme** - OWA shows programme URLs, not sequence URLs
2. **AI needs to match teacher mental model** - when teachers say "Year 10 Foundation Biology AQA", they mean a programme, not a sequence
3. **Canonical URLs require programmes** - to generate correct OWA URLs, need programme slugs
4. **Filtering requires context** - can't filter "show me Foundation tier lessons" without programme information
5. **One sequence = many teaching contexts** - sciences especially: 1 sequence → 8 programmes

**Real teacher scenario:**

Teacher: "Find me Year 10 Foundation Biology lessons for AQA"

**Current API flow** (clunky):

1. Search lessons, hope for the best
2. Or: Get sequence `science-secondary-aqa`, filter year 10, dig into nested `examSubjects.tiers`, find Biology → Foundation → units
3. No clear programme slug, can't generate correct OWA URL

**With programme endpoint** (natural):

1. Query `/programmes?subject=biology&keyStage=ks4&tier=foundation&examBoard=aqa`
2. Get `biology-secondary-ks4-foundation-aqa` programme
3. Get units for that programme
4. Generate correct OWA URLs

**Breaking changes are acceptable:**

If implementing proper programme support requires breaking changes (e.g., restructuring sequence responses, changing URL patterns), that's fine—this is important enough to warrant a major version bump (v1.0 → v2.0).

**Impact:** **Critical for AI tool Layer 4** (comparative analysis, progression tracking, recommendations). Also improves clarity for all API consumers who are confused by sequence vs programme distinction.

**Effort:** 3-5 days (new endpoint + response restructuring + documentation).

**Priority:** **High** - blocks accurate OWA URL generation and programme-based filtering.

**Enables**:

- **Layer 1**: Tools can filter by programme context (tier, exam board)
- **Layer 2**: `fetch` can route to programmes correctly
- **Layer 3**: Semantic search can weight by programme context (find "Foundation" content)
- **Layer 4**: **CRITICAL** - all advanced tools need programme-level granularity:
  - `find-units-by-thread` can trace progression within a programme
  - `compare-units` can compare across tiers (Foundation vs Higher)
  - `analyse-nc-coverage` can check coverage for specific exam boards
  - `recommend-adaptations` can suggest tier-appropriate content

---

## High Priority – Resource Identity & Cross-Service Consistency

### 6. Consistent Resource Identifiers Across Oak Services

> **⚠️ Note:** We need to verify whether identifier inconsistency is actually an issue in practice. The API and OWA may already use consistent slugs—this requires investigation before prioritising any work.

**Current state:**

Resource identifiers (slugs, IDs) may differ between the Open Curriculum API and the Oak Web Application (OWA) at <www.thenational.academy>. This creates friction when:

- AI tools generate links to OWA that don't work
- Teachers search for lessons they found on the website using different identifiers
- Cross-referencing data between services requires complex slug/ID translation
- Embedding services (semantic search, analytics) can't reliably deduplicate resources

**The problem:**

When a teacher finds a lesson on <www.thenational.academy> and wants to use it via an AI tool, they may have:

```plaintext
OWA URL: https://www.thenational.academy/teachers/lessons/the-roman-invasion-of-britain-abc123
API lookup: GET /lessons/the-roman-invasion-of-britain  → 404 (different slug format)
```

Or conversely:

```plaintext
API response: { "lessonSlug": "roman-invasion-britain", ... }
Generated URL: https://www.thenational.academy/teachers/lessons/roman-invasion-britain → 404
```

**What we need:**

**Option A: Unified identifiers (Recommended)**

The same identifier works across all Oak services:

```typescript
// OWA URL
https://www.thenational.academy/teachers/lessons/roman-invasion-of-britain-6fgh8j

// API request (same slug)
GET /api/v0/lessons/roman-invasion-of-britain-6fgh8j

// API response
{
  "lessonSlug": "roman-invasion-of-britain-6fgh8j",
  "canonicalUrl": "https://www.thenational.academy/teachers/lessons/roman-invasion-of-britain-6fgh8j"
}
```

**Option B: Explicit mapping endpoint**

If identifiers must differ, provide a clear 1:1 mapping:

```typescript
GET /api/v0/resource-mappings?owaSlug=the-roman-invasion-of-britain-abc123

Response:
{
  "owaSlug": "the-roman-invasion-of-britain-abc123",
  "apiSlug": "roman-invasion-of-britain",
  "resourceType": "lesson",
  "canonicalUrl": "https://www.thenational.academy/teachers/lessons/the-roman-invasion-of-britain-abc123"
}

// And reverse lookup
GET /api/v0/resource-mappings?apiSlug=roman-invasion-of-britain

Response:
{
  "apiSlug": "roman-invasion-of-britain",
  "owaSlug": "the-roman-invasion-of-britain-abc123",
  "resourceType": "lesson",
  "canonicalUrl": "https://www.thenational.academy/teachers/lessons/the-roman-invasion-of-britain-abc123"
}
```

**Option C: Include both identifiers in all responses**

Every resource response includes both the API identifier and the OWA identifier:

```typescript
GET /api/v0/lessons/roman-invasion-of-britain/summary

Response:
{
  "lessonSlug": "roman-invasion-of-britain",           // API identifier
  "owaSlug": "the-roman-invasion-of-britain-abc123",   // OWA identifier
  "canonicalUrl": "https://www.thenational.academy/teachers/lessons/the-roman-invasion-of-britain-abc123",
  "lessonTitle": "The Roman Invasion of Britain",
  // ... other fields
}
```

**Why this matters:**

1. **Teacher workflow continuity**: Teachers browse OWA, then want to use AI tools with the same resources—identifiers must match or map clearly
2. **AI-generated links must work**: When AI creates lesson plans with Oak links, teachers must be able to click them and land on the correct page
3. **Cross-service data integrity**: Analytics, search, and caching systems need reliable deduplication
4. **SDK canonical URL generation**: Without consistent identifiers, SDKs cannot reliably generate working URLs
5. **Embedding/vector search**: Semantic search indices need stable, unique identifiers to avoid duplicates

**Real teacher scenario:**

Teacher: "Find lessons about the Roman invasion for my Year 4 class and give me the links"

**Without consistent identifiers:**

- AI finds lesson via API: `roman-invasion-britain`
- AI generates URL: `https://www.thenational.academy/teachers/lessons/roman-invasion-britain`
- Teacher clicks link → 404 error
- Teacher loses trust in AI tool

**With consistent identifiers:**

- AI finds lesson via API: `the-roman-invasion-of-britain-abc123`
- AI generates URL: `https://www.thenational.academy/teachers/lessons/the-roman-invasion-of-britain-abc123`
- Teacher clicks link → Correct lesson page
- Teacher trusts AI tool and uses it again

**Applies to:**

All resource types that have both API and OWA representations:

- Lessons
- Units
- Programmes
- Subjects
- Sequences

**Benefits:**

- **Single source of truth**: One identifier per resource across all Oak systems
- **Reliable URL generation**: SDKs and AI tools can confidently construct working OWA links
- **Simpler caching**: Cache keys work across services without translation
- **Better analytics**: Track resource usage consistently across API and web
- **Reduced confusion**: Teachers, developers, and AI agents use the same identifiers

**Impact:** **Critical for AI tool reliability.** Broken links destroy teacher trust in AI-generated content.

**Effort:** Depends on current identifier architecture:

- If already consistent: Document and verify (1 day)
- If mapping exists internally: Expose via Option B or C (2-3 days)
- If identifiers diverge significantly: Option A requires data migration (significant effort)

**Recommendation:** Start with Option C (include both identifiers in responses) as a short-term fix, then migrate toward Option A (unified identifiers) for long-term consistency.

**Priority:** **High** – broken links are immediately visible failures that undermine all AI tool value.

**Enables:**

- **Layer 1**: Tools return working canonical URLs
- **Layer 2**: Aggregated tools cross-reference resources reliably
- **Layer 3**: Semantic search indexes with stable, deduplicable IDs
- **Layer 4**:
  - `generate-lesson-plan`: Creates plans with clickable links that actually work
  - `export-curriculum-data`: Exports include consistent identifiers for external systems
  - `bulk-unit-summaries`: Can be cached and referenced across services

---

## Medium Priority – Parameter Richness

### 7. Add Parameter Examples

**Current state:**

```yaml
parameters:
  - name: keyStage
    in: query
    schema:
      type: string
      enum: [ks1, ks2, ks3, ks4]
      description: 'Key stage slug to filter by'
```

**Desired state:**

```yaml
parameters:
  - name: keyStage
    in: query
    schema:
      type: string
      enum: [ks1, ks2, ks3, ks4]
      description: "Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"
    examples:
      ks1:
        value: 'ks1'
        summary: 'Key Stage 1 (ages 5-7, years 1-2)'
      ks2:
        value: 'ks2'
        summary: 'Key Stage 2 (ages 7-11, years 3-6)'
      ks3:
        value: 'ks3'
        summary: 'Key Stage 3 (ages 11-14, years 7-9)'
      ks4:
        value: 'ks4'
        summary: 'Key Stage 4 (ages 14-16, years 10-11)'
```

**Why:** Examples help AI models understand parameter semantics, especially educational terminology unfamiliar to general-purpose models.

**Benefits:**

- Clearer parameter meaning for international AI models
- Reduces invalid parameter values
- Provides age-range context for UK education system

**Applies to:** All enum parameters, especially educational domain terms (key stages, subjects, year groups).

**Enables**:

- **All layers**: Fewer invalid parameter errors (AI understands "ks2" vs "KS2" vs "key-stage-2")
- **Layer 3**: Semantic search uses correct age ranges for filtering
- **Layer 4**: Comparative analysis tools understand year group boundaries for progression tracking

---

### 8. Add Custom Schema Extensions for Tool Metadata

**What:** OpenAPI `x-oak-*` extensions providing tool-specific metadata.

**Examples:**

```yaml
/search/lessons:
  get:
    x-oak-metadata:
      category: 'discovery'
      use-cases: ['lesson-planning', 'resource-discovery']
      read-only: true
      typical-response-time-ms: 200
      result-stability: 'high'
      idempotent: true
```

```yaml
/lessons/{lesson}/summary:
  get:
    x-oak-canonical-url:
      template: 'https://www.thenational.academy/teachers/lessons/{lesson}'
      context: 'lesson'
      user-facing: true
```

```yaml
parameters:
  - name: subject
    x-oak-display-name: 'Subject'
    x-oak-category: 'curriculum-filter'
```

**Why:** Provides structured metadata that can flow to generated tool descriptors without hand-coding.

**Benefits:**

- Canonical URLs auto-generated in SDK
- Tool categorisation for better organisation
- Read-only hints for AI confirmation flows
- Performance expectations for AI planning

**Effort:** Low (add fields to existing schema); can be done incrementally.

**Enables**:

- **Layer 1**: Canonical URLs auto-generated (no hard-coding in SDK)
- **Layer 2**: Aggregated tools use metadata for routing decisions
- **Layer 4**: Advanced tools can optimise based on performance hints (batch slow operations, parallelise fast ones)

---

### 9. Add Behavioural Metadata for Tool Safety and Retry Logic

**What:** Custom OpenAPI extensions indicating tool behaviour characteristics for AI safety and orchestration.

**Examples:**

```yaml
/lessons/{lesson}/summary:
  get:
    x-oak-behavior:
      readOnly: true # Tool doesn't modify environment
      idempotent: true # Safe to call multiple times
      requiresConfirmation: false # Can execute without user approval
      retryable: true # Safe to retry on failure
```

```yaml
/lessons/{lesson}/assets:
  post:
    x-oak-behavior:
      readOnly: false # Modifies state
      idempotent: false # Each call has additional effect
      destructive: false # Additive, not destructive
      requiresConfirmation: true # Should prompt user before execution
      retryable: false # Don't auto-retry (may duplicate data)
```

**Behavioural Properties:**

- **`readOnly`** (boolean, default: `true` for GET, `false` for POST/PUT/DELETE/PATCH): Tool doesn't modify its environment. AI agents can call freely without confirmation.

- **`idempotent`** (boolean, default: `false`): Calling repeatedly with the same arguments has no additional effect. Safe to retry on network errors.

- **`destructive`** (boolean, default: `false` for additive operations): If `true`, may delete or overwrite existing data. Requires explicit user confirmation in most AI interfaces.

- **`requiresConfirmation`** (boolean, default: `false` for reads, `true` for writes): AI should prompt user before executing. Helps prevent unintended actions.

- **`retryable`** (boolean, default: `idempotent` value): Safe to automatically retry on transient failures.

**Why:** AI agents need to understand tool safety characteristics to make appropriate orchestration decisions. This metadata enables:

1. **Automatic Retry Logic**: Agents can safely retry idempotent operations without risk of duplication
2. **User Confirmation Flows**: Destructive operations can trigger confirmation prompts
3. **Parallel Execution**: Read-only tools can be safely parallelised
4. **Error Recovery**: Retryable operations can be automatically retried; non-retryable operations fail gracefully
5. **Security & Trust**: Clear labeling of write operations builds user confidence

**Benefits:**

- Safer AI agent behaviour (fewer accidental destructive actions)
- Better error handling and recovery
- More efficient orchestration (parallelise reads, serialise writes)
- Clearer API contract for all consumers

**Effort:** Low (add to existing endpoints); mechanical process once properties are defined.

**Applies to:** All endpoints, but especially important for POST/PUT/DELETE/PATCH operations.

**Enables**:

- **Layer 1**: Tools clearly labelled with safety characteristics
- **Layer 2**: Aggregated tools can implement smart retry logic
- **Layer 3**: Services distinguish safe operations from risky ones
- **Layer 4**:
  - `bulk-unit-summaries`: Can parallelise all requests (read-only, retryable)
  - `generate-lesson-plan`: Can retry failed fetches without duplication
  - Export tools: Can safely retry chunks without confirmation

**Industry Standards:** These properties align with:

- **MCP Specification**: `ToolAnnotations` interface (`readOnlyHint`, `idempotentHint`, `destructiveHint`)
- **OpenAI Apps SDK Guidelines**: "Mark any tool that changes external state as a write action. Read-only tools must be side-effect-free and safe to retry."
- **HTTP Semantics (RFC 9110)**: GET/HEAD are safe (read-only); PUT/DELETE are idempotent; POST is neither

**Current Workaround:** We infer behaviour from HTTP method (GET = read-only, POST = write), but this is imprecise. Explicit metadata would be more accurate.

**Example Use Case:**

A teacher asks: "Find 10 KS3 science lessons about cells and download the assets for each."

- **Without behavioural metadata**: AI agent downloads assets one by one, doesn't retry failures (risk of duplication), asks for confirmation before each download (10 prompts)
- **With behavioural metadata**: AI knows `get-lessons-assets` is read-only and retryable, so it parallelises requests, automatically retries failures, and doesn't prompt user (trusted read operation)

---

### 10. Enhance Thread Endpoints for Progression Analysis

**What:** Enrich thread endpoints with metadata about conceptual progression and cross-programme relationships.

**Current state:**

```typescript
GET / threads;
Response: [{ title: 'Number', slug: 'number' }]; // Minimal metadata

GET / threads / { threadSlug } / units;
Response: [{ unitTitle: '...', unitSlug: '...', unitOrder: 5 }]; // No progression context
```

**Desired state:**

```typescript
GET /threads

Response:
{
  "threads": [
    {
      "slug": "number",
      "title": "Number",
      "description": "Core number concepts from counting to surds",
      "subjectSlug": "maths",
      "keyStagesCovered": ["ks1", "ks2", "ks3", "ks4"],
      "unitCount": 118,
      "ageRange": "5-16",
      "conceptualProgression": "Concrete counting → Abstract mathematical concepts"
    },
    {
      "slug": "bq01-biology-what-are-living-things-and-what-are-they-made-of",
      "title": "BQ01 Biology: What are living things and what are they made of?",
      "description": "Progression from observable features to cellular/molecular biology",
      "subjectSlug": "science",
      "keyStagesCovered": ["ks1", "ks2", "ks3", "ks4"],
      "unitCount": 32,
      "ageRange": "5-16",
      "conceptualProgression": "Observable features → Systems → Molecular & cellular"
    }
  ]
}

GET /threads/{threadSlug}/units

Response:
{
  "threadSlug": "number",
  "threadTitle": "Number",
  "units": [
    {
      "unitSlug": "counting-recognising-and-comparing-numbers-0-10",
      "unitTitle": "Counting, recognising and comparing numbers 0-10",
      "unitOrder": 15,
      "keyStageSlug": "ks1",
      "year": 1,
      "conceptualLevel": "concrete",
      "prerequisiteUnits": [], // First in progression
      "nextUnits": [16, 19], // Unit orders that follow
      "appearsInProgrammes": ["maths-primary-ks1"]
    },
    {
      "unitSlug": "surds",
      "unitTitle": "Surds",
      "unitOrder": 8,
      "keyStageSlug": "ks4",
      "year": 11,
      "conceptualLevel": "abstract",
      "prerequisiteUnits": [1, 2, 7], // Earlier units in progression
      "nextUnits": [], // Terminal unit
      "appearsInProgrammes": ["maths-secondary-ks4-higher-aqa", "maths-secondary-ks4-higher-ocr"]
    }
  ]
}
```

**Additional enhancement: Thread filtering**

```typescript
GET /threads?subject=maths&keyStage=ks2
// Returns only threads relevant to KS2 maths

GET /threads?contains=unit-slug-here
// Returns threads containing a specific unit (reverse lookup)
```

**Why:** Threads are Oak's pedagogical backbone—they show how concepts build over time. Currently, thread endpoints provide minimal metadata, making it hard for AI tools to:

- Understand what a thread represents conceptually
- Identify prerequisites for a unit
- Trace progression pathways
- Compare coverage across programmes

**Benefits:**

- **Progression tracking**: AI can trace how "fractions" develop from Year 1 to Year 11
- **Prerequisite identification**: Find what students should know before a unit
- **Cross-key-stage continuity**: Support transitions (primary → secondary, KS3 → KS4)
- **Programme-agnostic planning**: Show conceptual coherence independent of exam board/tier
- **Gap analysis**: Identify missing units in a thread for specific contexts

**Impact:** **High for Layer 4 tools**. Threads enable the most sophisticated AI capabilities:

- `trace-concept-progression`: Show how ideas build across years
- `find-prerequisites`: Map prerequisite chains
- `compare-programme-paths`: Compare Foundation vs Higher progression
- `discover-curriculum-gaps`: Identify missing content

**Effort:** 2-3 days (metadata enhancement + filtering endpoints).

**Priority:** **Medium-High** - threads are crucial for pedagogical intelligence, but current endpoints are usable (just limited).

**Enables**:

- **Layer 4**: **CRITICAL FOR PROGRESSION TOOLS**
  - `find-units-by-thread`: Needs thread metadata to filter and present progression pathways
  - `trace-prior-knowledge`: Needs `prerequisiteUnits` to build dependency graphs
  - `compare-units`: Needs `conceptualLevel` and `unitOrder` to show progression differences
  - `analyse-nc-coverage`: Can map threads to NC statements for coherence checking
  - All recommendation tools benefit from understanding conceptual progression

**Example use case:**

Teacher: "Show me how fractions progress from Year 1 to Year 6"

**Current flow** (clunky):

1. Search for "fractions" → get mixed results
2. Try to manually order by year
3. No clear progression pathway

**With enhanced threads** (natural):

1. Query `/threads?subject=maths&contains=fraction`
2. Get `number` thread
3. Query `/threads/number/units`
4. Filter by `year` 1-6, `unitTitle` contains "fraction"
5. See clear progression with order, prerequisites, and next steps

---

## Medium Priority – Schema Validation & Type Safety

### 11. Standardise Parameter and Schema Types with `$ref`

**What:** Use OpenAPI `$ref` to define reusable parameter and schema components, ensuring type consistency across all endpoints.

**Current state:**

The same semantic concept has inconsistent types across the spec:

```yaml
# /sequences/{sequence}/units - year is STRING enum
parameters:
  - name: year
    schema:
      type: string
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "all-years"]

# /sequences/{sequence}/assets - year is NUMBER
parameters:
  - name: year
    schema:
      type: number

# Response schemas - MIXED
year:
  anyOf:
    - type: number
    - type: string
      enum: ["all-years"]
# OR
year:
  anyOf:
    - type: number
    - type: string  # Too broad!
```

**Problems:**

1. **Code generators produce inconsistent types** - TypeScript/Zod can't decide if `year` is `number | string` or `1 | 2 | ... | 11 | "all-years"`
2. **Runtime validation breaks** - A valid `year: 5` might fail validation on one endpoint but succeed on another
3. **Client confusion** - Should I send `5` or `"5"`?
4. **Maintenance nightmare** - Changing year representation requires hunting through the entire spec

**Desired state:**

Define reusable components:

```yaml
components:
  parameters:
    YearQueryParameter:
      name: year
      in: query
      description: "The year group to filter by. Accepts year numbers 1-11 or 'all-years' for content spanning multiple years."
      schema:
        $ref: '#/components/schemas/Year'
      examples:
        year3:
          value: 3
          summary: 'Year 3 (age 7-8)'
        allYears:
          value: 'all-years'
          summary: 'Content spanning multiple year groups'

  schemas:
    Year:
      oneOf:
        - type: integer
          minimum: 1
          maximum: 11
          description: 'Year group (1-11)'
        - type: string
          const: 'all-years'
          description: 'Content spanning multiple years'
```

Then reference consistently:

```yaml
# In path definitions
paths:
  /sequences/{sequence}/units:
    get:
      parameters:
        - $ref: '#/components/parameters/YearQueryParameter'

  /sequences/{sequence}/assets:
    get:
      parameters:
        - $ref: '#/components/parameters/YearQueryParameter'

# In response schemas
SequenceUnitsResponseSchema:
  properties:
    year:
      $ref: '#/components/schemas/Year'
```

**Other candidates for standardisation:**

- `keyStage`: Sometimes has description, sometimes doesn't, casing notes vary
- `subject`: Enum values identical across ~12 endpoints but duplicated
- `lessonSlug`, `unitSlug`, `sequenceSlug`: Pattern is `[a-z0-9-]+` but not documented
- `offset`, `limit`: Pagination params duplicated on every list endpoint

**Why:** Single source of truth for types → consistent codegen → fewer runtime errors.

**Benefits:**

- **Type-safe client generation**: Zod/TypeScript/etc. generate correct union types
- **DRY principle**: Define once, reference everywhere
- **Easier API evolution**: Change `Year` schema in one place, all endpoints update
- **Better validation**: Code generators can create proper validators
- **Self-documenting**: Clear that these are the same concept across endpoints

**Effort:** Low-Medium (mostly find-replace, but requires careful review)

**Enables**:

- **All layers**: Reliable type inference and validation
- **Layer 1**: Direct proxy tools use correct types in function signatures
- **Layer 2**: Aggregated tools can confidently pass parameters between endpoints
- **Layer 3/4**: Advanced tools can reason about parameter compatibility across endpoints

---

### 12. Expose Zod Validators for Perfect Type Fidelity

**Current state:**

The API maintains rich, hand-written Zod schemas internally using `zod-openapi/extend`:

```typescript
// reference/oak-openapi/src/lib/handlers/sequences/types.ts
import { z } from 'zod';
import 'zod-openapi/extend';

const categorySchema = z.object({
  categoryTitle: z.string().openapi({ description: 'The title of the category' }),
  categorySlug: z.string().optional().openapi({
    description: 'The unique identifier for the category',
  }),
});
```

These schemas:

- Define request/response validation
- Include field descriptions and examples
- Power the tRPC procedures
- Generate the OpenAPI specification via `trpc-to-openapi`

**The duplication problem:**

Currently, consuming applications:

1. Fetch the generated OpenAPI JSON
2. Re-generate Zod schemas from OpenAPI
3. Use those schemas for validation

**This creates**:

- Round-trip conversion losses (Zod → OpenAPI → Zod)
- Potential type fidelity issues (nullable handling, discriminated unions)
- Duplicated maintenance effort
- Version synchronisation challenges

**Desired state (Option A): Export as npm package**

```typescript
// API repo publishes:
// @oaknational/curriculum-api-schemas

{
  "name": "@oaknational/curriculum-api-schemas",
  "version": "1.0.0",
  "exports": {
    "./lesson": "./dist/handlers/lesson/schemas/index.js",
    "./units": "./dist/handlers/units/schemas/index.js",
    "./sequences": "./dist/handlers/sequences/schemas/index.js",
    "./subjects": "./dist/handlers/subjects/schemas/index.js",
    // ... all schemas
  }
}
```

```typescript
// Consuming applications use directly:
import {
  lessonSummaryRequestSchema,
  lessonSummaryResponseSchema,
} from '@oaknational/curriculum-api-schemas/lesson';

// Perfect type fidelity, no round-trip conversion
const validatedData = lessonSummaryResponseSchema.parse(apiResponse);
```

**Desired state (Option B): Expose via API endpoint**

```typescript
GET /api/v0/schemas/{schemaName}

// Returns the Zod schema as JSON Schema or TypeScript code
{
  "schemaName": "LessonSummaryResponse",
  "zodSchema": "z.object({ lessonTitle: z.string(), ... })",
  "jsonSchema": { "type": "object", "properties": { ... } },
  "typescript": "export interface LessonSummaryResponse { ... }"
}
```

Or even simpler:

```typescript
GET /api/v0/schemas

// Returns all schemas as a bundle
{
  "version": "1.0.0",
  "schemas": {
    "LessonSummaryRequest": { zodSchema: "...", jsonSchema: {...} },
    "LessonSummaryResponse": { zodSchema: "...", jsonSchema: {...} },
    // ... all schemas
  }
}
```

**Why this matters:**

1. **Perfect Type Fidelity**: No round-trip conversion means no data loss
2. **Single Source of Truth**: API's internal schemas ARE the public schemas
3. **Better DX**: Consuming apps get exact validation that API uses
4. **Reduced Duplication**: Stop regenerating what already exists
5. **Version Alignment**: Schema version matches API version automatically
6. **Better Error Messages**: Zod's validation errors are more helpful than OpenAPI validation errors

**Benefits for API team:**

- Schemas already exist (minimal additional work)
- Forces good schema maintenance (public-facing)
- Better API contract clarity
- Enables type-safe client libraries

**Benefits for all consumers:**

- Type-safe SDKs without code generation
- Runtime validation with excellent error messages
- Perfect alignment with API behaviour
- Easier integration testing

**Implementation options:**

**Option A (npm package):**

- **Pros**: Standard distribution method, versioned, npm ecosystem
- **Cons**: Requires package maintenance, breaking change management
- **Effort**: 1-2 days initial setup + ongoing maintenance

**Option B (API endpoint):**

- **Pros**: Always in sync with API, no separate publishing, simpler versioning
- **Cons**: Non-standard, requires schema serialisation, runtime fetching
- **Effort**: 2-3 days (endpoint creation + serialisation logic)

**Option C (Hybrid):**

- Expose via API endpoint for discovery/debugging
- Also publish as npm package for production use
- **Pros**: Best of both worlds
- **Effort**: Combined effort of both approaches

**Recommendation**: Option A (npm package) with Option B as future enhancement

**Priority**: Medium-High (solves real duplication problem, benefits all consumers)

**Enables**:

- **All layers**: Perfect type safety from API through to AI tools
- **Layer 1**: Generated tools use exact API validation logic
- **SDKs**: Type-safe client libraries without code generation step
- **Testing**: Consuming apps can validate test fixtures against API schemas

**Example use case:**

Current workflow:

```typescript
// 1. Fetch OpenAPI spec
// 2. Run type-gen to regenerate Zod schemas
// 3. Use generated schemas
import { lessonSummaryResponseSchema } from './generated/schemas';
```

With exposed schemas:

```typescript
// Just import and use
import { lessonSummaryResponseSchema } from '@oaknational/curriculum-api-schemas/lesson';
```

---

## Medium Priority – Response Metadata

### 13. Add Response Schema Examples

**Current state:**

```yaml
responses:
  '200':
    description: 'Successful response'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/SearchLessonsResponse'
```

**Desired state:**

```yaml
responses:
  '200':
    description: 'Successful response'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/SearchLessonsResponse'
        examples:
          typical-search:
            summary: 'Typical search with results'
            value:
              lessons:
                - slug: 'checking-understanding-of-basic-transformations'
                  title: 'Checking understanding of basic transformations'
                  subject: 'maths'
                  key_stage: 'ks3'
                  canonicalUrl: 'https://...'
          empty-results:
            summary: 'No matches found'
            value:
              lessons: []
              metadata:
                query: 'nonexistent topic'
                total: 0
```

**Why:** Helps AI understand response structure and common patterns (empty results, typical data shapes).

**Benefits:**

- Better error handling in AI tool calls
- Clearer expectation setting
- Improved documentation

**Applies to:** Major list/search endpoints.

**Enables**:

- **Layer 1**: Better handling of empty result sets (AI knows when no results is normal vs. error)
- **Layer 4**: Export tools can format data correctly based on example structure

---

### 14. Document Canonical URL Patterns

**Current state:**
Canonical URLs calculated client-side based on implicit rules.

**Critical requirement:** Canonical URL patterns **must match** the Oak Web Application (OWA) at [https://www.thenational.academy/](https://www.thenational.academy/). These are the user-facing URLs teachers will see when viewing resources on the Oak website.

**Desired state (option A – in schema):**

```yaml
components:
  schemas:
    LessonSummary:
      type: object
      properties:
        slug:
          type: string
          x-oak-canonical-url-component: true
        # other fields...
      x-oak-canonical-url-template: 'https://www.thenational.academy/teachers/lessons/{slug}'
```

**Example URL patterns** (must match OWA production URLs):

- Lessons: `https://www.thenational.academy/teachers/lessons/{lessonSlug}`
- Units: `https://www.thenational.academy/teachers/units/{unitSlug}`
- Programmes: `https://www.thenational.academy/teachers/programmes/{programmeSlug}` (if applicable)
- Curriculum plans: `https://www.thenational.academy/teachers/curriculum-plans/{subject}/{keyStage}` (if applicable)

**Note**: These are example patterns. The API team should document the **actual** OWA URL patterns used in production to ensure generated links work correctly for teachers.

**Desired state (option B – in ontology endpoint):**
Included in `/ontology` response (see item 3).

**Why:** Enables generated clients to construct user-facing URLs without hard-coding patterns. Teachers can click links in AI-generated lesson plans and go directly to the correct Oak website page.

**Current workaround:** SDK generator adds canonical URLs at type-gen time using hard-coded patterns that attempt to match OWA structure.

**Impact:** Single source of truth for URLs that's guaranteed to match OWA; easier updates when URL patterns change; ensures teachers always get working links.

**Enables**:

- **All layers**: Tools can include links to Oak website for teacher convenience
- **Layer 4**: Export tools can generate clickable lesson plans with correct URLs

---

## Medium Priority – Resource Timestamps for SDK Caching

### 15. Add `lastUpdated` Timestamp to All Resource Responses

**Current state:**

API responses contain resource data but no temporal metadata about when the content was last modified:

```json
{
  "lessonTitle": "Introduction to Fractions",
  "unitSlug": "maths-ks2-fractions",
  "subjectSlug": "maths"
  // No timestamp indicating content freshness
}
```

**Desired state:**

All resource responses include standardized timestamp fields:

```json
{
  "lessonTitle": "Introduction to Fractions",
  "unitSlug": "maths-ks2-fractions",
  "subjectSlug": "maths",
  "lastUpdated": "2024-11-15T14:32:00Z",
  "apiVersion": "0.5.0"
}
```

**For collection responses:**

```json
{
  "lessons": [
    {
      "lessonSlug": "fractions-intro",
      "lessonTitle": "Introduction to Fractions",
      "lastUpdated": "2024-11-15T14:32:00Z"
    }
  ],
  "metadata": {
    "lastUpdated": "2024-11-15T14:32:00Z", // Most recent item
    "apiVersion": "0.5.0"
  }
}
```

**Schema definition:**

```yaml
components:
  schemas:
    ResourceTimestamp:
      type: object
      required: [lastUpdated]
      properties:
        lastUpdated:
          type: string
          format: date-time
          description: 'ISO 8601 timestamp of when this resource was last modified in the curriculum database'
          example: '2024-11-15T14:32:00Z'
        apiVersion:
          type: string
          description: 'API version that generated this response'
          example: '0.5.0'
          readOnly: true

    LessonSummary:
      allOf:
        - $ref: '#/components/schemas/ResourceTimestamp'
        - type: object
          properties:
            lessonTitle: { type: string }
            # ... other fields
```

**Why this matters:**

**1. Efficient SDK-layer caching:**

Current situation - SDK must either:

- Cache blindly with TTL (wasteful bandwidth, stale data risk)
- Never cache (poor performance, unnecessary API calls)
- Implement complex ETag logic (adds HTTP overhead)

With `lastUpdated`:

```typescript
// SDK caching layer
async function fetchLesson(slug: string) {
  const cached = await cache.get(slug);

  if (cached) {
    // HEAD request just to check timestamp (or include in list endpoint)
    const current = await api.getLessonTimestamp(slug);

    if (current.lastUpdated === cached.lastUpdated) {
      return cached.data; // Still fresh
    }
  }

  // Fetch full resource
  const data = await api.getLesson(slug);
  await cache.set(slug, data, { timestamp: data.lastUpdated });
  return data;
}
```

**2. Intelligent cache invalidation:**

```typescript
// MCP server can maintain a smart cache
class CurriculumCache {
  async get(resourceId: string) {
    const cached = this.store.get(resourceId);
    if (!cached) return null;

    // Check if curriculum has been updated since cache
    const latest = await this.api.getLastUpdated(resourceId);

    if (latest <= cached.timestamp) {
      return cached.data; // Still valid
    }

    return null; // Stale, needs refresh
  }
}
```

**3. Bulk update detection:**

With timestamps in list responses, SDK can detect stale caches efficiently:

```typescript
// Check if any cached lessons are stale
const lessonList = await api.searchLessons({ subject: 'maths' });

const staleItems = lessonList.lessons.filter((lesson) => {
  const cached = cache.get(lesson.lessonSlug);
  return cached && cached.lastUpdated < lesson.lastUpdated;
});

// Only refetch stale items
await Promise.all(staleItems.map((l) => refreshCache(l.lessonSlug)));
```

**4. Change tracking for external systems:**

```typescript
// External curriculum platform can detect changes
const changes = await api.getUnits({ since: lastSyncTime });

changes.units
  .filter((unit) => unit.lastUpdated > lastSyncTime)
  .forEach((unit) => syncToExternalSystem(unit));
```

**Benefits:**

**For SDK developers:**

- Simple, reliable cache invalidation
- No need for complex ETag logic
- Can implement aggressive caching without staleness risk
- Reduces API calls by 60-80% for frequently accessed resources

**For API consumers:**

- Know exactly when content was last updated
- Can display "last modified" dates to users
- Efficient incremental synchronization
- Better offline support

**For API team:**

- Simple to implement (single database field)
- No custom caching headers needed
- Clearer cache semantics than ETag
- Supports eventual consistency patterns

**For teachers (end users):**

- Faster app responses (better caching)
- Less mobile data usage
- Works better offline
- Can see "Updated Nov 15" on curriculum items

**Implementation approaches:**

**Option A: Database timestamps (recommended):**

```sql
-- Add to existing tables
ALTER TABLE lessons ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE units ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- Update trigger
CREATE TRIGGER update_lesson_timestamp
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Option B: Version numbers:**

```json
{
  "lessonSlug": "fractions-intro",
  "version": 42,
  "lastUpdated": "2024-11-15T14:32:00Z"
}
```

**Option C: Hybrid (timestamp + ETag):**

```yaml
responses:
  '200':
    headers:
      ETag:
        schema: { type: string }
        description: 'Entity tag for cache validation'
    content:
      application/json:
        schema:
          type: object
          properties:
            lastUpdated: { type: string, format: date-time }
            etag: { type: string }
```

**Recommendation:** Option A (database timestamps) - simplest and most maintainable.

**Semantic meaning:**

`lastUpdated` should reflect:

- ✅ Lesson content changes (title, keywords, learning objectives)
- ✅ Associated resource updates (transcript corrections, quiz changes)
- ✅ Metadata updates (subject reclassification, unit reassignment)
- ❌ NOT user interaction (views, downloads)
- ❌ NOT API version bumps (unless content schema changes)

**Comparison with HTTP caching:**

| Approach                 | Pros                                     | Cons                                  |
| ------------------------ | ---------------------------------------- | ------------------------------------- |
| **ETag (HTTP)**          | Standards-compliant                      | Requires HEAD requests, opaque values |
| **Last-Modified (HTTP)** | Simple                                   | Not in JSON body, limited precision   |
| **`lastUpdated` (Body)** | Available in response, precise, semantic | Non-standard field                    |

**Recommendation:** Provide `lastUpdated` in body AND `Last-Modified` header (best of both).

**Special cases:**

**Static/historical content:**

```json
{
  "lessonSlug": "ww2-lesson",
  "lastUpdated": "2023-06-01T00:00:00Z",
  "contentStatus": "archived", // Won't change
  "archived": true
}
```

**Dynamic aggregations:**

```json
{
  "subject": "maths",
  "lessonCount": 1247,
  "lastUpdated": "2024-11-15T14:32:00Z", // Most recent lesson update
  "metadata": {
    "generatedAt": "2024-11-16T10:15:00Z" // When this response was created
  }
}
```

**Why:** Cache-friendly responses reduce API load, improve SDK performance, and enable offline support.

**Impact:** **Medium-High** - enables efficient caching across all SDK consumers, reduces API calls by 60-80%.

**Effort:** Low-Medium (2-3 days for database schema + endpoint updates).

**Priority:** **Medium** - significant performance improvement, relatively easy to implement.

**Enables:**

- **Layer 1**: Tools can cache aggressively and invalidate precisely
- **Layer 2**: Aggregated tools maintain efficient caches
- **Layer 3**: Services can sync incrementally (only changed content)
- **Layer 4**:
  - `bulk-unit-summaries`: Can detect which units need refresh
  - `export-curriculum-data`: Can do incremental exports
  - All tools benefit from faster response times

**Example use case:**

Teacher opens lesson planning app daily:

**Without timestamps:**

- App must fetch all lessons fresh each time (slow, high bandwidth)
- Or cache with TTL (might miss updates)

**With timestamps:**

- App fetches list with timestamps: 1 API call
- Compares with cache: 1247 lessons, 3 changed
- Refetches only 3 changed lessons: 3 API calls
- Total: 4 calls vs 1247 calls (99.7% reduction)

**Transition strategy:**

1. Add `lastUpdated` to new endpoints first
2. Backfill existing endpoints over 1-2 sprints
3. Document best practices for SDK consumers
4. Consider making it mandatory in v1.0

---

## Low Priority – Performance Hints

### 16. Add Performance and Caching Metadata

**What:** Extensions indicating response characteristics.

**Example:**

```yaml
/lessons/{lesson}/summary:
  get:
    x-oak-performance:
      typical-response-time-ms: 150
      cache-duration-seconds: 300
      rate-limit-cost: 1
      result-stability: 'stable' # stable | dynamic | realtime
```

**Why:** Helps AI plan efficient tool call sequences (cache-friendly vs always-fresh data).

**Benefits:**

- Better AI planning for batch operations
- Cache-aware tool composition
- Rate limit awareness

**Priority:** Low (nice-to-have for advanced optimisation).

**Enables**:

- **Layer 4**: `bulk-unit-summaries` can optimise batching based on rate limits; tools can cache stable data (lesson content) vs. dynamic data (user progress)

---

### 17. Complete OpenAPI Best Practices Checklist

**What:** Fill gaps in OpenAPI spec completeness following [OpenAPI Initiative best practices](https://learn.openapis.org/best-practices.html).

**References:**

- [OpenAPI Best Practices](https://learn.openapis.org/best-practices.html)
- [Providing Documentation and Examples](https://learn.openapis.org/specification/docs.html)
- [Describing API Security](https://learn.openapis.org/specification/security.html)
- [API Servers](https://learn.openapis.org/specification/servers.html)

---

#### **Section A: Core Metadata (High Priority)**

**A1. Complete `info` object:**

```json
{
  "info": {
    "title": "Oak National Academy Curriculum API",
    "version": "0.5.0",
    "description": "Access the UK's largest open curriculum with 40,000+ lessons across all key stages. This API provides programmatic access to lessons, units, quiz questions, transcripts, and downloadable resources aligned with the National Curriculum.",
    "contact": {
      "name": "Oak National Academy Developer Support",
      "email": "developers@thenational.academy",
      "url": "https://github.com/oaknational/oak-curriculum-api"
    },
    "license": {
      "name": "Open Government Licence v3.0",
      "url": "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
    },
    "termsOfService": "https://www.thenational.academy/legal/terms-and-conditions"
  }
}
```

**Why:** Per [OpenAPI structure guidelines](https://learn.openapis.org/specification/structure.html), complete `info` metadata is essential for discoverability and legal clarity.

**Current state:** Missing `description`, `contact`, `license`, `termsOfService`

---

**A2. Enhanced tag descriptions:**

```yaml
tags:
  - name: lessons
    description: |
      Retrieve comprehensive lesson content including:
      - **Summaries**: Learning objectives, keywords, misconceptions
      - **Transcripts**: Full video transcripts with VTT captions
      - **Quizzes**: Starter and exit quizzes with answers
      - **Assets**: Downloadable slide decks, worksheets, videos
    externalDocs:
      url: 'https://docs.thenational.academy/api/lessons'
  - name: search
    description: |
      Discover lessons using:
      - **Title search**: Keyword matching on lesson titles
      - **Transcript search**: Semantic search across video content
  - name: units
    description: 'Access curriculum units - thematic collections of 4-8 related lessons'
  - name: sequences
    description: 'Browse multi-year curriculum sequences spanning key stages'
  - name: threads
    description: 'Follow conceptual progression strands across the entire curriculum'
```

**Why:** [Enhanced tags](https://learn.openapis.org/specification/tags.html) with descriptions and external docs improve navigation in generated documentation.

**Current state:** Tags exist but have no descriptions or external documentation links.

---

#### **Section B: Documentation Best Practices (Medium-High Priority)**

**B1. Use `summary` AND `description` pattern:**

Per [OpenAPI documentation guidelines](https://learn.openapis.org/specification/docs.html), operations should have both fields:

```yaml
/sequences/{sequence}/units:
  get:
    summary: 'List units in a curriculum sequence'
    description: |
      ## Overview
      Returns all units within a curriculum sequence, grouped by year.

      ## Use Cases
      - Building year-by-year curriculum overviews
      - Filtering units for specific year groups
      - Understanding unit progression through key stages

      ## Ordering
      Units are returned in **pedagogical order** as defined by curriculum experts.

      ## Thread Associations
      Each unit includes thread memberships showing conceptual progression.

      ## Special Cases
      - PE Primary: Supports `year: "all-years"` for cross-year content
      - KS4 Science: Units are grouped by tier (Foundation/Higher)
```

**Why:**

- `summary`: Short (for list views, API explorers)
- `description`: Long with CommonMark formatting (for detail views)

**Current state:** Most operations only have `description`, not `summary`

---

**B2. Leverage CommonMark in descriptions:**

Descriptions support [CommonMark 0.27](https://learn.openapis.org/specification/docs.html#the-commonmark-syntax):

```yaml
description: |
  ### What This Returns
  A paginated list of lessons grouped by unit.

  ### Filtering Options
  - `unit`: Filter to a specific unit slug
  - `offset`/`limit`: Pagination (max 100 per page)

  ### Response Structure
  [
    {
      "unitSlug": "...",
      "unitTitle": "...",
      "lessons": [...]
    }
  ]

  **Note**: Only published lessons are returned.
```

**Why:** Richer formatting creates better auto-generated documentation.

**Current state:** Descriptions are plain text, not using CommonMark features.

---

**B3. Use `examples` (plural) over `example` (singular):**

Per [OpenAPI examples guide](https://learn.openapis.org/specification/docs.html#adding-examples), prefer `examples` (with Example Objects):

```yaml
responses:
  '400':
    description: Invalid request parameters
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/ErrorResponse'
        examples:
          invalidYear:
            summary: 'Year out of range'
            description: 'Year must be 1-11 or "all-years"'
            value:
              message: 'Invalid year parameter'
              code: 'INVALID_PARAMETER'
              data:
                parameter: 'year'
                provided: '99'
                allowed: ['1', '2', ..., '11', 'all-years']
          invalidKeyStage:
            summary: 'Unknown key stage'
            value:
              message: 'Invalid keyStage parameter'
              code: 'INVALID_PARAMETER'
```

**Why:** Multiple named examples with summaries improve documentation and enable mock servers.

**Current state:** Some endpoints use `example` (singular), most have none.

---

#### **Section C: Error Handling (High Priority)**

**C1. Document all HTTP responses:**

Current spec only documents `200` (and `404` for transcript). Should add:

```yaml
responses:
  '200':
    # ... existing
  '400':
    $ref: '#/components/responses/BadRequest'
  '401':
    $ref: '#/components/responses/Unauthorised'
  '403':
    $ref: '#/components/responses/Forbidden'
  '429':
    $ref: '#/components/responses/RateLimitExceeded'
  '500':
    $ref: '#/components/responses/InternalServerError'
  '503':
    $ref: '#/components/responses/ServiceUnavailable'
```

**C2. Define reusable error response components:**

```yaml
components:
  responses:
    BadRequest:
      description: Invalid request parameters
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          examples:
            invalidParameter:
              summary: 'Parameter validation failed'
              value:
                message: 'Invalid year parameter'
                code: 'INVALID_PARAMETER'
    RateLimitExceeded:
      description: Too many requests
      headers:
        X-RateLimit-Limit:
          schema: { type: integer }
        X-RateLimit-Remaining:
          schema: { type: integer }
        X-RateLimit-Reset:
          schema: { type: integer }
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
```

**Why:** Consistent error handling per [OpenAPI best practices](https://learn.openapis.org/best-practices.html).

---

#### **Section D: Response Headers (Medium Priority)**

**D1. Document rate limit headers:**

```yaml
responses:
  '200':
    headers:
      X-RateLimit-Limit:
        schema:
          type: integer
          example: 1000
        description: 'Maximum requests per time window'
      X-RateLimit-Remaining:
        schema:
          type: integer
          example: 953
        description: 'Requests remaining in current window'
      X-RateLimit-Reset:
        schema:
          type: integer
          example: 1740164400000
        description: 'Time when rate limit resets (milliseconds since Unix epoch)'
```

**Why:** Oak has `/rate-limit` endpoint but headers aren't documented in spec!

**D2. Add caching headers:**

```yaml
Cache-Control:
  schema:
    type: string
    example: 'public, max-age=300'
  description: 'Cache control directives (lesson content is cacheable)'
ETag:
  schema:
    type: string
  description: 'Entity tag for cache validation'
```

---

#### **Section E: Schema Constraints (Medium Priority)**

**E1. Add string patterns and constraints:**

```yaml
components:
  schemas:
    LessonSlug:
      type: string
      pattern: '^[a-z0-9]+(-[a-z0-9]+)*$'
      minLength: 3
      maxLength: 200
      example: 'the-roman-invasion-of-britain'
      description: 'URL-safe lesson identifier (lowercase, hyphen-separated)'
```

**E2. Use `format` validators:**

```yaml
properties:
  canonicalUrl:
    type: string
    format: uri
    readOnly: true
    example: 'https://www.thenational.academy/teachers/lessons/example'
```

**E3. Mark response-only fields:**

```yaml
properties:
  lessonSlug:
    type: string
    readOnly: true
  canonicalUrl:
    type: string
    format: uri
    readOnly: true
```

**Why:** Better code generation and validation per [reusing descriptions](https://learn.openapis.org/specification/reusing-descriptions.html).

---

#### **Section F: Pagination (Medium Priority)**

**F1. Include pagination metadata in responses:**

```yaml
KeyStageSubjectLessonsResponse:
  type: object
  properties:
    results:
      type: array
      items:
        $ref: '#/components/schemas/LessonUnit'
    pagination:
      type: object
      required: [offset, limit, total, hasMore]
      properties:
        offset:
          type: integer
          example: 0
        limit:
          type: integer
          example: 10
        total:
          type: integer
          example: 247
          description: 'Total number of results available'
        hasMore:
          type: boolean
          example: true
          description: 'Whether more results are available beyond current page'
```

**Why:** Clients need to know if there are more results.

---

#### **Section G: Additional Best Practices (Low-Medium Priority)**

**G1. Server variables for environments:**

```yaml
servers:
  - url: 'https://{environment}.thenational.academy/api/{version}'
    description: 'Oak Curriculum API'
    variables:
      environment:
        default: open-api
        enum: [open-api, open-api-staging]
        description: 'API environment'
      version:
        default: v0
        enum: [v0]
        description: 'API version'
```

**G2. Deprecation markers (when needed):**

```yaml
/legacy-endpoint:
  get:
    deprecated: true
    summary: 'Legacy endpoint'
    description: |
      **DEPRECATED**: Use `/new-endpoint` instead.

      This endpoint will be removed in v1.0 (December 2025).

      Migration guide: https://docs.thenational.academy/api/migration
```

**G3. Security scheme documentation:**

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        Obtain bearer tokens from https://open-api.thenational.academy/api/v0/auth

        Token lifetime: 1 hour
        Rate limit: 1000 requests/hour
```

---

### Summary

**Why:** Complete, well-documented specs following [OpenAPI best practices](https://learn.openapis.org/best-practices.html) enable:

- **Better tooling**: Swagger UI, Redoc, Postman, code generators
- **Clearer expectations**: Developers know what to expect
- **Standards compliance**: Passes linters/validators
- **Professional polish**: Shows API maturity

**Effort:** Low-Medium per item, comprehensive overall

**Priority breakdown:**

- **High**: Error responses, `info` metadata, rate limit headers, `summary` + `description` pattern
- **Medium**: Tag descriptions, CommonMark formatting, string constraints, pagination metadata
- **Low**: Server variables, deprecation markers (when needed)

**Enables**:

- **All layers**: More robust error handling, better validation
- **Tool ecosystem**: Better integration with OpenAPI toolchains
- **Documentation**: Auto-generated docs are comprehensive and navigable

---

## Summary Table

| Item                                  | Priority        | Impact        | Effort    | AI Benefit                            |
| ------------------------------------- | --------------- | ------------- | --------- | ------------------------------------- |
| **NEW: Flat tier/examBoard fields**   | **🔴 High**     | **Very High** | Medium    | KS4 filtering for GCSE navigation     |
| **NEW: semantic_summary field**       | **High**        | **Very High** | Medium    | High-quality embeddings for all types |
| 1. "Use this when" descriptions       | **High**        | Very High     | 2-4 hours | 70% fewer wrong-tool calls            |
| 2. Operation summaries                | **High**        | Medium        | 1 hour    | Better UI/organisation                |
| 3. `/ontology` endpoint               | **High**        | **Very High** | 1-2 days  | 60% fewer discovery turns             |
| 4. Error response docs                | **High**        | High          | 2-3 hours | Proper error handling                 |
| 5. Programme variant metadata         | **High**        | **Very High** | 3-5 days  | Programme-based filtering & OWA URLs  |
| 6. Consistent resource IDs            | **High**        | **Very High** | 1-5 days  | Working cross-service links           |
| 7. Parameter examples                 | Medium          | Medium        | Ongoing   | Clearer semantics                     |
| 8. Custom schema extensions           | Medium          | Medium        | Low       | Auto-generated metadata               |
| 9. Behavioural metadata               | **Medium**      | **High**      | Low       | Safety & retry logic                  |
| 10. Thread enhancements               | **Medium-High** | **High**      | 2-3 days  | Progression tracking & prerequisites  |
| 11. Standardise types with refs       | **Medium**      | **High**      | Low-Med   | Consistent types & validation         |
| 12. Expose Zod validators             | **Medium-High** | **High**      | 1-2 days  | Perfect type fidelity, no duplication |
| 13. Response examples                 | Medium          | Low           | Ongoing   | Better error handling                 |
| 14. Canonical URL patterns            | Medium          | Medium        | 1 hour    | URL generation                        |
| 15. Resource timestamps               | Medium          | Medium-High   | 2-3 days  | Efficient SDK caching                 |
| 16. Performance hints                 | Low             | Low           | Low       | Advanced optimisation                 |
| 17. OpenAPI best practices            | Low-Medium      | Medium        | Low-Med   | Better tooling & docs                 |

---

## Implementation Notes

### Iterative Approach

These enhancements can be implemented incrementally:

1. Start with high-priority items (descriptions, ontology)
2. Add examples and extensions to new endpoints as they're developed
3. Backfill existing endpoints during maintenance windows

### Testing Impact

After each schema change:

1. Run `pnpm type-gen` in oak-notion-mcp
2. Verify generated types and tools update correctly
3. Test AI tool discovery in ChatGPT Developer Mode
4. Measure tool selection accuracy improvements

### Cross-Team Coordination

- **API team:** Schema updates, new endpoint implementation
- **Documentation team:** Review descriptions for clarity and consistency
- **AI integration team (oak-notion-mcp):** Validate generated outputs, provide feedback
- **Product team:** Align tool usage guidance with user workflows

---

## Related Documentation

### External Resources

- **OpenAI Apps SDK Metadata Guidance**: <https://developers.openai.com/apps-sdk/guides/optimize-metadata/>
  - Best practices for API metadata that AI models can understand
  - Tool selection accuracy improvements
  - Real-world impact metrics

- **Model Context Protocol (MCP) Specification**: <https://spec.modelcontextprotocol.io/>
  - Open standard for AI tool integration
  - Supported by Anthropic (Claude), OpenAI (ChatGPT), and others
  - Tool descriptor format and capabilities

- **OpenAPI 3.1 Specification**: <https://spec.openapis.org/oas/v3.1.0>
  - Schema extensions (`x-*` fields)
  - Response examples and error documentation
  - Parameter metadata

- **OpenAPI Learning Site** (Official OpenAPI Initiative):
  - **Best Practices**: <https://learn.openapis.org/best-practices.html>
    - Design-first approach, single source of truth, version control
  - **Providing Documentation and Examples**: <https://learn.openapis.org/specification/docs.html>
    - `summary` vs `description` pattern
    - CommonMark 0.27 syntax for rich formatting
    - `examples` (plural) with Example Objects
  - **API Structure**: <https://learn.openapis.org/specification/structure.html>
    - Required vs optional fields in `info` object
    - Minimal viable OpenAPI description
  - **Describing Security**: <https://learn.openapis.org/specification/security.html>
    - Security schemes and requirements
  - **Enhanced Tags**: <https://learn.openapis.org/specification/tags.html>
    - Tag descriptions and external documentation
  - **Reusing Descriptions**: <https://learn.openapis.org/specification/reusing-descriptions.html>
    - `$ref` patterns and component reuse

### Oak AI Integration

- **Live Demo**: Try the current MCP tools at `https://open-api.thenational.academy/mcp` (requires API key)
- **Example ChatGPT Session**: [To be added - show real teacher using curriculum tools]
- **GitHub**: [oak-notion-mcp repository link - if public]

---

## Next Steps

We'd welcome the opportunity to:

1. **Demo the current AI tools** - Show you what's already possible and what becomes possible with these enhancements
2. **Discuss implementation priority** - Especially Items #3 (ontology) and #4 (error docs) which have the biggest impact
3. **Collaborate on metadata patterns** - We can provide draft descriptions/examples for your review
4. **Share success metrics** - Once improvements are live, we'll track and share tool selection accuracy and teacher satisfaction

---

## Contact

For questions, demos, or to discuss implementation:

- AI Integration Team: [contact details]
- API Squad: [contact details]
- Slack: [channel]

For proposing additional enhancements or reporting issues, please [raise an issue in the API schema repository / contact relevant team].
