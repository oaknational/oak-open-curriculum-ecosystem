# Maths KS4 Vertical Slice: Complete Demo Implementation

**Date**: 2025-12-07  
**Status**: ACTIVE - Strategic Focus  
**Priority**: HIGH

## Strategic Context

Given the **Oak API 1000 requests/hour limit** (discovered 2025-12-07), full ingestion of 340 combinations would take 17-24 hours. Instead, we're focusing on a complete vertical slice implementation using **Maths KS4** to demonstrate all capabilities with manageable scope.

**Why Maths KS4?**

- ✅ Maximum complexity (tiers, pathways, exam boards)
- ✅ High value to teachers (exam preparation)
- ✅ Tests all features (sequences, facets, semantic search)
- ✅ Reasonable API cost (~100-200 requests = 10-20 minutes)
- ✅ Foundation for expanding to other subjects/keystages

## Vision: Impressive Demo Capabilities

Create a **production-ready demonstration** of semantic search and AI features using only Maths KS4 content that showcases:

### 1. Core Search Features (Phase 1 - Current)

**Hybrid Search**:

- ✅ Semantic search via ELSER sparse embeddings
- ✅ Lexical search with synonyms
- ✅ RRF (Reciprocal Rank Fusion) combining both approaches

**Content Coverage**:

- ✅ Lessons with full metadata and transcripts
- ✅ Units with aggregated content
- ✅ Unit rollups for unit-level search
- ✅ Sequences (Foundation/Higher pathways)
- ✅ Sequence facets for navigation

**Search Interfaces**:

- ✅ Structured search with filters
- ✅ Natural language queries
- ✅ Context-aware suggestions (type-ahead)

**Faceted Navigation**:

- ✅ Filter by tier (Foundation/Higher)
- ✅ Filter by exam board
- ✅ Filter by pathway
- ✅ Filter by year group
- ✅ Filter by topic

### 2. Enhanced Features (Phase 2 - To Implement)

**Thread-Based Organization**:

- 🎯 Maths threads: Number, Algebra, Geometry, Statistics, Ratio/Proportion
- 🎯 Thread-based search scope
- 🎯 Progression through threads across units

**Rich Content Metadata**:

- 🎯 Programme factors (tier, exam board, pathway)
- 🎯 Unit types (Core, Support, Development)
- 🎯 Content guidance (complexity, prerequisites)
- 🎯 Pedagogical context (common misconceptions, teacher tips)

**Lesson Planning Support**:

- 🎯 Key learning points indexed
- 🎯 Keywords and topics searchable
- 🎯 Misconceptions highlighted
- 🎯 Teacher tips surfaced in results

### 3. AI & RAG Features (Phase 4 - To Implement)

**Ontology Integration**:

- 🎯 `oak_ontology` index for domain knowledge
- 🎯 Maths-specific concept definitions
- 🎯 KS4 tier explanations
- 🎯 Exam board differences
- 🎯 Pathway guidance

**Knowledge Graph**:

- 🎯 Concept relationships (e.g., "Pythagoras → Right-angled triangles")
- 🎯 Thread connections
- 🎯 Prerequisite knowledge chains
- 🎯 Topic dependencies

**RAG-Ready Context**:

- 🎯 Chunked lesson transcripts for context injection
- 🎯 Ontology snippets for grounding AI responses
- 🎯 Related content recommendations
- 🎯 Cross-unit connections

**Semantic Discovery**:

- 🎯 "Find lessons similar to this one"
- 🎯 "What comes before/after this topic?"
- 🎯 "Show related misconceptions"
- 🎯 "Find supporting materials"

### 4. Advanced Search Features

**Multi-Index Search**:

- 🎯 Search across lessons, units, and sequences simultaneously
- 🎯 Unified results ranked by relevance
- 🎯 Faceted drill-down from aggregated results

**Query Understanding**:

- 🎯 Synonym expansion (e.g., "trig" → "trigonometry")
- 🎯 Natural language intent detection
- 🎯 Query reformulation suggestions

**Result Enrichment**:

- 🎯 Canonical URLs for traceability
- 🎯 Highlight matching snippets
- 🎯 Show related content
- 🎯 Preview lesson structure

### 5. Reference Data (Phase 3)

**Searchable Catalogs**:

- 🎯 `oak_subjects` - Maths subject definition
- 🎯 `oak_key_stages` - KS4 details
- 🎯 `oak_years` - Year 10, Year 11
- 🎯 `oak_threads` - Maths thread definitions
- 🎯 `oak_tiers` - Foundation, Higher, Core

## Data Features Mining

### Current ES Indexes (5 Content Indexes)

#### 1. `oak_lessons`

**Current Fields**:

- `lesson_id`, `lesson_slug`, `lesson_title`
- `lesson_semantic` (semantic_text for ELSER)
- `transcript_text` (with term vectors)
- `lesson_keywords`, `key_learning_points`
- `misconceptions_and_common_mistakes`
- `teacher_tips`, `content_guidance`
- `unit_id`, `unit_slug`, `unit_title`
- `subject_slug`, `key_stage`, `years`
- `canonical_url`
- `title_suggest` (completion suggester)
- `audit_created`, `audit_updated`

**Enhanced Features to Add**:

- 🎯 `tier` - Foundation/Higher/Core
- 🎯 `exam_board` - AQA, Edexcel, OCR, etc.
- 🎯 `pathway` - Which sequence this belongs to
- 🎯 `thread_slugs` - Which threads this lesson addresses
- 🎯 `topic_hierarchy` - Nested topic structure
- 🎯 `difficulty_level` - Numeric or categorical
- 🎯 `estimated_duration` - Minutes
- 🎯 `prerequisite_lesson_ids` - Dependencies
- 🎯 `related_lesson_ids` - Similar content
- 🎯 `resource_types` - Video, worksheet, quiz, etc.

#### 2. `oak_units`

**Current Fields**:

- `unit_id`, `unit_slug`, `unit_title`
- `subject_slug`, `key_stage`, `years`
- `lesson_ids`, `lesson_count`
- `canonical_url`
- `title_suggest`

**Enhanced Features to Add**:

- 🎯 `unit_type` - Core/Support/Development
- 🎯 `thread_slugs` - Which threads covered
- 🎯 `tier`
- 🎯 `exam_board`
- 🎯 `pathway`
- 🎯 `topics` - Structured topic list
- 🎯 `duration_weeks` - Teaching time
- 🎯 `prerequisite_unit_ids`
- 🎯 `follows_unit_ids` - Progression
- 🎯 `assessment_included` - Boolean

#### 3. `oak_unit_rollup`

**Current Fields**:

- Same as `oak_units` plus:
- `rollup_text` - Aggregated lesson content
- `unit_semantic` (semantic_text)

**Enhanced Features to Add**:

- Same enhancements as `oak_units`
- 🎯 `combined_misconceptions` - Aggregated from lessons
- 🎯 `combined_keywords` - All unit keywords
- 🎯 `combined_learning_points` - Key takeaways

#### 4. `oak_sequences`

**Current Fields**:

- `sequence_slug`, `sequence_title`
- `subject_slug`, `phase`
- `unit_ids`, `unit_count`
- `canonical_url`

**Enhanced Features to Add**:

- 🎯 `tier` - Foundation/Higher
- 🎯 `exam_board` - Specific or generic
- 🎯 `pathway_name` - Descriptive name
- 🎯 `threads_covered` - Which threads in this sequence
- 🎯 `year_groups` - Which years this sequence is for
- 🎯 `sequence_order` - Position in curriculum
- 🎯 `learning_outcomes` - High-level goals

#### 5. `oak_sequence_facets`

**Current Fields**:

- `subject_slug`
- `key_stages` - Array of key stages
- `phase`
- `sequence_slugs` - Available sequences
- `tiers_available` - Foundation, Higher
- `exam_boards_available`

**Enhanced Features to Add**:

- 🎯 `threads_available` - List of threads
- 🎯 `pathways_available` - Different routes
- 🎯 `years_available` - Year groups
- 🎯 `unit_count_by_tier` - Counts per tier
- 🎯 `lesson_count_by_thread` - Counts per thread

### New Indexes to Create (Phase 2-4)

#### 6. `oak_threads` (Phase 2)

**Purpose**: Thread-centric search and navigation

```typescript
interface ThreadDoc {
  thread_slug: string; // e.g., "maths-number"
  thread_title: string; // e.g., "Number"
  thread_description: string; // What this thread covers
  subject_slug: string; // "maths"
  key_stages: string[]; // ["ks3", "ks4"] - threads span keystages
  phase: string; // "secondary"

  // Progression
  unit_ids: string[]; // Units in this thread across KS
  lesson_count: number;

  // KS4-specific
  tier_coverage: {
    // What's covered in each tier
    foundation: string[]; // Topics in Foundation
    higher: string[]; // Topics in Higher
  };

  // Content
  core_concepts: string[]; // Key concepts in this thread
  skills_developed: string[]; // Mathematical skills

  // Relationships
  related_threads: string[]; // Connected threads
  prerequisite_threads: string[]; // What comes before

  // Search
  thread_semantic: string; // semantic_text field
  canonical_url: string;
}
```

#### 7. `oak_ontology` (Phase 4)

**Purpose**: Domain knowledge for RAG grounding

```typescript
interface OntologyDoc {
  concept_id: string; // Unique ID
  concept_type: string; // "thread", "tier", "exam_board", etc.
  concept_name: string;

  // Definition
  definition: string; // What is this?
  explanation: string; // Detailed explanation
  context: string; // When/where relevant

  // Maths-specific
  subject_slug: string; // "maths"
  key_stage: string; // "ks4"

  // Examples
  examples: Array<{
    description: string;
    context: string;
  }>;

  // Relationships
  related_concepts: string[];
  parent_concepts: string[];
  child_concepts: string[];

  // Usage
  lesson_ids: string[]; // Lessons using this concept
  unit_ids: string[]; // Units covering this

  // Search
  ontology_semantic: string; // semantic_text
  tags: string[]; // Keywords for discovery
}
```

**Maths KS4 Ontology Content**:

- Tier definitions (Foundation, Higher, Core)
- Exam board differences
- Pathway explanations
- Topic hierarchies
- Mathematical concepts (e.g., "Pythagoras Theorem")
- Common misconceptions
- Teaching strategies

#### 8. `oak_lesson_transcripts` (Phase 4)

**Purpose**: Chunked transcripts for deep RAG retrieval

```typescript
interface TranscriptChunkDoc {
  chunk_id: string;
  lesson_id: string;
  lesson_slug: string;
  lesson_title: string;

  // Chunk content
  chunk_text: string; // ~500-1000 words
  chunk_index: number; // Position in lesson
  chunk_semantic: string; // semantic_text

  // Context
  topic: string; // What's being discussed
  timestamp_start: string; // Video timestamp
  timestamp_end: string;

  // Metadata
  subject_slug: string;
  key_stage: string;
  tier: string;

  // Relations
  previous_chunk_id: string;
  next_chunk_id: string;

  canonical_url: string;
}
```

#### 9. `oak_content_guidance` (Phase 2)

**Purpose**: Safeguarding and content warnings

```typescript
interface ContentGuidanceDoc {
  guidance_id: string;
  guidance_type: string; // "safeguarding", "complexity", etc.
  guidance_title: string;
  guidance_description: string;

  // Severity/Level
  level: string; // "low", "medium", "high"
  requires_review: boolean;

  // Associated content
  lesson_ids: string[];
  unit_ids: string[];

  // Maths-specific
  related_to_tier: string; // Some guidance tier-specific

  // Search
  guidance_semantic: string;
}
```

#### 10. `oak_maths_topics` (Maths-specific Reference)

**Purpose**: Hierarchical topic structure for Maths

```typescript
interface MathsTopicDoc {
  topic_id: string;
  topic_name: string;
  topic_slug: string;

  // Hierarchy
  parent_topic_id: string;
  child_topic_ids: string[];
  level: number; // Depth in hierarchy

  // KS4-specific
  tier_relevance: {
    foundation: boolean;
    higher: boolean;
    core: boolean;
  };

  // Content coverage
  lesson_ids: string[];
  unit_ids: string[];
  thread_slugs: string[];

  // Description
  description: string;
  learning_outcomes: string[];

  // Progression
  prerequisite_topic_ids: string[];
  builds_to_topic_ids: string[];

  // Search
  topic_semantic: string;
  keywords: string[];
}
```

## Implementation Phases

### Phase 1: Core Maths KS4 Ingestion (Current)

**Goal**: Populate 5 existing indexes with Maths KS4 content **using hybrid field strategy**

**Strategy**: Add **20 high-confidence Phase 2 fields** during initial upload to avoid re-ingestion.

**Why Hybrid?**

- ✅ Fields like `tier`, `exam_board`, `pathway` are **already in API responses**
- ✅ Adding them now = **zero re-uploads** for Phase 2
- ✅ Empty/NULL fields allowed - populate incrementally

**Data Completeness**: ✅ We already upload **full, untruncated transcripts** in `transcript_text`. No sampling. All lesson-planning metadata (keywords, learning points, tips) uploaded in full.

**See**: `.agent/plans/semantic-search/hybrid-field-strategy.md` for complete field list and implementation plan.

**Tasks**:

1. ✅ SDK rate limiting and retry implemented
2. ✅ Rate limit monitoring active
3. ⏳ Update field definitions with hybrid fields (see plan)
4. ⏳ Run `pnpm type-gen` to generate schemas
5. ⏳ Update ingestion logic to extract new fields
6. ⏳ Run quality gates
7. ⏳ Run Maths KS4 ingestion

```bash
cd apps/oak-search-cli
pnpm es:ingest-live --subject maths --keystage ks4 --verbose
```

**Expected**:

- ~50-100 lessons
- ~15-25 units
- ~15-25 unit rollups
- ~2-4 sequences (Foundation, Higher pathways)
- ~1 sequence facet
- **Time**: 10-20 minutes
- **API cost**: 100-200 requests
- **New fields**: tier, exam_board, pathway, difficulty_level, resource_types, etc.

**Success Criteria**:

- All 5 indexes populated with hybrid schema
- `tier` populated for >80% of lessons
- `resource_types` populated for >90% of lessons
- Search works for Maths KS4
- Facets work for tier filtering
- Zero mapping errors

### Phase 2: Enhanced Metadata & Threads

**Goal**: Populate hybrid fields and add thread index (NO RE-UPLOAD REQUIRED ✅)

**Tasks**:

1. ✅ Fields already added in Phase 1 (hybrid strategy):
   - `tier`, `exam_board`, `pathway` ← from API
   - `thread_slugs` ← from unit metadata
   - `difficulty_level`, `resource_types` ← computed
2. Create `oak_threads` index (NEW index, not a re-upload)
3. Generate thread documents for Maths
4. Populate empty fields using `_update_by_query`:
   - `prerequisite_lesson_ids` ← similarity search
   - `related_lesson_ids` ← semantic analysis
   - `combined_misconceptions` ← aggregate from lessons
5. Update search UI to support thread filtering

**New Capabilities**:

- Thread-based navigation
- Tier/pathway filtering
- Topic hierarchy browsing

**Key Win**: No re-ingestion needed! Fields were added in Phase 1, we're just populating them.

### Phase 3: Reference Indices

**Goal**: Create searchable catalogs

**Tasks**:

1. Create `oak_subjects` index (just Maths)
2. Create `oak_key_stages` index (just KS4)
3. Create `oak_years` index (Years 10, 11)
4. Create `oak_maths_topics` index
5. Populate with generated data

**New Capabilities**:

- "Browse Maths curriculum"
- "Explore KS4 topics"
- "Navigate topic hierarchy"

### Phase 4: Ontology & RAG

**Goal**: Enable RAG features with domain knowledge

**Tasks**:

1. Create `oak_ontology` index
2. Generate Maths KS4 ontology content:
   - Tier definitions
   - Exam board info
   - Mathematical concepts
   - Common misconceptions
3. Create `oak_lesson_transcripts` index
4. Chunk and ingest Maths KS4 transcripts
5. Build RAG demonstration endpoints

**New Capabilities**:

- "Explain Foundation vs Higher tier"
- "What's Pythagoras theorem?"
- "Show me lessons about this concept"
- Context-aware AI responses

### Phase 5: Advanced Search Features

**Goal**: Multi-index search and enhanced discovery

**Tasks**:

1. Implement multi-index search endpoint
2. Add "more like this" functionality
3. Build query understanding layer
4. Create result enrichment
5. Add cross-content recommendations

**New Capabilities**:

- Unified search across all content types
- Semantic similarity discovery
- Smart query suggestions
- Related content recommendations

## Demo Scenarios

### Scenario 1: Teacher Looking for Trigonometry Lessons

**Query**: "trigonometry foundation tier"

**Experience**:

1. Structured search returns relevant lessons
2. Facets show Foundation/Higher split
3. Thread filter shows "Geometry" thread
4. Results show:
   - Foundation tier trig lessons
   - Related units
   - Sequence context (where in pathway)
5. Click lesson → see full metadata, transcript, resources

### Scenario 2: Finding Prerequisite Knowledge

**Query**: "What do students need to know before Pythagoras?"

**Experience**:

1. Natural language search understands intent
2. Ontology provides "Pythagoras theorem" definition
3. Knowledge graph shows prerequisites:
   - Right-angled triangles
   - Square numbers
   - Square roots
4. Returns lessons covering prerequisites
5. Shows progression path

### Scenario 3: Planning a Unit on Algebra

**Query**: "algebra factorisation higher tier"

**Experience**:

1. Search returns:
   - Relevant units
   - Individual lessons
   - Full sequences
2. Thread view shows "Algebra" thread
3. Topic hierarchy shows factorisation subtopics
4. Results include:
   - Common misconceptions
   - Teacher tips
   - Prerequisite topics
5. "More like this" suggests related algebra topics

### Scenario 4: Exploring Mathematical Concepts

**Query**: "simultaneous equations"

**Experience**:

1. Ontology provides concept definition
2. Shows coverage in Foundation vs Higher
3. Lists all lessons/units covering this
4. Shows prerequisite concepts
5. Suggests related topics (e.g., substitution, elimination)
6. Links to actual lesson content

## Success Metrics

### Technical Success

- ✅ All indexes populated with Maths KS4 data
- ✅ Zero mapping errors
- ✅ Sub-second search response times
- ✅ Accurate semantic search results
- ✅ Working faceted navigation

### Feature Success

- ✅ Hybrid search (semantic + lexical) demonstrable
- ✅ Thread-based navigation working
- ✅ Tier filtering functional
- ✅ RAG features respond accurately
- ✅ Multi-index search returns relevant results

### Demo Success

- ✅ Impressive to stakeholders
- ✅ Showcases all major capabilities
- ✅ Proves viability of approach
- ✅ Foundation for scaling to other subjects
- ✅ Demonstrates ROI of semantic search

## Next Steps After Maths KS4

### Horizontal Expansion

1. Add other KS4 subjects (Science, English)
2. Add Maths at other keystages (KS3, KS2)
3. Gradually expand to full curriculum

### Vertical Deepening

1. Add more advanced RAG features
2. Implement graph-based reasoning
3. Build recommendation engine
4. Add user personalization

### Production Readiness

1. Request higher API rate limit
2. Migrate to Vercel functions for automated re-ingestion
3. Add monitoring and alerting
4. Implement incremental updates

## Timeline Estimate

- **Phase 1** (Core): 1 day (ingestion + validation)
- **Phase 2** (Enhanced): 3-5 days (field updates + threads)
- **Phase 3** (References): 2-3 days (new indexes)
- **Phase 4** (RAG): 5-7 days (ontology + chunking)
- **Phase 5** (Advanced): 3-5 days (multi-index + features)

**Total**: 2-3 weeks for complete Maths KS4 vertical slice

## References

- **API Rate Limit**: `.agent/analysis/api-rate-limit-investigation.md`
- **Rate Limit Resolution**: `.agent/plans/semantic-search/api-rate-limit-resolution-plan.md`
- **ES Mappings**: `docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md`
- **Systematic Ingestion**: `docs/architecture/architectural-decisions/069-systematic-ingestion-progress-tracking.md`
- **Field Definitions**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/`
