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

**User impact:** Teachers and learners get better search relevance; SDK/MCP engineers can build faster, higher-quality retrieval.

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

**Implementation Location**: `apps/oak-search-cli/src/lib/indexing/document-transforms.ts`

**Tracking**: This interim solution should be replaced when upstream API provides native `semantic_summary` fields. The local generation logic can then be removed or repurposed for validation.

**Benefits**:

- **Single source of truth**: API provides the canonical semantic representation
- **Consistent embeddings**: All consumers (semantic search, RAG, AI assistants) use same summary
- **Reduced compute**: Pre-computed at API level, not at query/index time
- **Better search quality**: Optimised summaries improve retrieval metrics
- **Future-proof**: Supports dense, sparse, and hybrid embedding strategies

**User impact:** Teachers, students, and adult learners get more relevant discovery; AI tool builders and API consumers share consistent semantic signals.

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
