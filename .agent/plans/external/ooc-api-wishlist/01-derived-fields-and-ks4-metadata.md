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

