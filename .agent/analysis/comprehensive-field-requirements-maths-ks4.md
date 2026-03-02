# Comprehensive Field Requirements for Maths KS4 Demo

**Date**: 2025-12-07  
**Purpose**: Complete field inventory to avoid re-uploads  
**Strategy**: Add ALL planned/potential fields NOW, populate gradually

## Executive Summary

To minimize re-uploads (which trigger ES index resets), this document identifies **every field** needed across:

- ✅ **Phase 1**: Core search (current)
- 🎯 **Phase 2**: Enhanced metadata & threads
- 🎯 **Phase 3**: Reference indices
- 🎯 **Phase 4**: RAG & AI features
- 🎯 **Phase 5**: Advanced discovery

**Key Insight**: Elasticsearch allows **NULL/missing fields** without schema changes. We can add fields now and populate them incrementally **without re-uploading**.

---

## Index 1: `oak_lessons` (Primary Content)

### Current Fields (21) ✅

```typescript
// Identifiers
lesson_id: string
lesson_slug: string
lesson_title: string

// Taxonomy
subject_slug: Subject  // enum
key_stage: KeyStage    // enum
years: string[]

// Hierarchy
unit_ids: string[]
unit_titles: string[]
unit_count: number

// Lesson Planning Metadata
lesson_keywords: string[]
key_learning_points: string[]
misconceptions_and_common_mistakes: string[]
teacher_tips: string[]
content_guidance: string[]

// Content
transcript_text: string              // with term_vectors
lesson_semantic: string              // semantic_text for ELSER

// Navigation
lesson_url: string
unit_urls: string[]
thread_slugs: string[]
thread_titles: string[]

// Search Features
title_suggest: CompletionSuggester
```

### Phase 2 Additions (11 fields) 🎯

```typescript
// KS4 Complexity
tier: 'foundation' | 'higher' | 'core'
exam_board: 'AQA' | 'Edexcel' | 'OCR' | 'WJEC' | 'generic'
pathway: string  // e.g., "Higher Maths Pathway A"

// Content Characteristics
difficulty_level: number  // 1-10 scale
estimated_duration_minutes: number
resource_types: string[]  // ['video', 'worksheet', 'quiz', 'slides']

// Relationships
prerequisite_lesson_ids: string[]
related_lesson_ids: string[]  // Similar content

// Topic Structure
topic_hierarchy: string[]  // ['Number', 'Fractions', 'Adding Fractions']
primary_topic: string  // Main topic for filtering

// Audit
last_reviewed_date: string  // ISO 8601
```

### Phase 4 Additions (8 fields) 🎯

```typescript
// AI Enrichment
ai_generated_summary: string  // 2-3 sentence overview
curriculum_concepts: string[]  // Extracted key concepts
difficulty_reasoning: string  // Why this difficulty level

// Graph Features
mentions_entities: string[]  // NER extracted: people, places, events
semantic_keywords: string[]  // AI-extracted vs authored

// RAG Support
chunked_for_rag: boolean  // Has corresponding chunks in transcript index
chunk_count: number

// Quality Signals
teacher_rating_avg: number  // If we add ratings feature
usage_count: number  // Popularity signal
```

### Total: 40 fields (21 current + 11 phase 2 + 8 phase 4)

---

## Index 2: `oak_units` (Aggregation & Analytics)

### Current Fields (16) ✅

```typescript
// Identifiers
unit_id: string
unit_slug: string
unit_title: string

// Taxonomy
subject_slug: Subject
key_stage: KeyStage
years: string[]

// Lessons
lesson_ids: string[]
lesson_count: number

// Topics
unit_topics: string[]

// Navigation
unit_url: string
subject_programmes_url: string

// Hierarchy
sequence_ids: string[]
thread_slugs: string[]
thread_titles: string[]
thread_orders: number[]

// Search
title_suggest: CompletionSuggester
```

### Phase 2 Additions (12 fields) 🎯

```typescript
// KS4 Metadata
tier: 'foundation' | 'higher' | 'core'
exam_board: string
pathway: string

// Unit Classification
unit_type: 'core' | 'support' | 'development' | 'extension'
duration_weeks: number
assessment_included: boolean

// Progression
prerequisite_unit_ids: string[]
follows_unit_ids: string[]  // Recommended next units

// Topics
topic_hierarchy: string[]  // Structured path
primary_thread: string  // Main thread this unit belongs to

// Planning
resource_count: number
has_video_lessons: boolean
```

### Total: 28 fields (16 current + 12 phase 2)

---

## Index 3: `oak_unit_rollup` (Search Surface)

### Current Fields (18) ✅

```typescript
// (Same as oak_units PLUS:)
rollup_text: string; // Aggregated lesson content
unit_semantic: string; // semantic_text
```

### Phase 2 Additions (15 fields) 🎯

```typescript
// Same as oak_units phase 2 additions PLUS:

// Aggregated Metadata
combined_misconceptions: string[]  // All lesson misconceptions
combined_keywords: string[]  // All lesson keywords
combined_learning_points: string[]  // All key learning points
```

### Total: 33 fields (18 current + 15 phase 2)

---

## Index 4: `oak_sequences` (Pathways)

### Current Fields (14) ✅

```typescript
sequence_id: string
sequence_slug: string
sequence_title: string
subject_slug: Subject
subject_title: string
phase_slug: string
phase_title: string
category_titles: string[]
key_stages: string[]
years: string[]
unit_slugs: string[]
sequence_semantic: string
sequence_url: string
title_suggest: CompletionSuggester
```

### Phase 2 Additions (8 fields) 🎯

```typescript
// KS4 Attributes
tier: 'foundation' | 'higher' | 'mixed'
exam_board: string
pathway_name: string  // Descriptive pathway name

// Coverage
threads_covered: string[]  // Which threads in this sequence
learning_outcomes: string[]  // High-level goals

// Ordering
sequence_order: number  // Position in curriculum
year_groups: string[]  // Which years

// Stats
unit_count: number  // Computed from unit_slugs
```

### Total: 22 fields (14 current + 8 phase 2)

---

## Index 5: `oak_sequence_facets` (Navigation)

### Current Fields (13) ✅

```typescript
sequence_slug: string
subject_slug: Subject
phase_slug: string
phase_title: string
key_stages: string[]
key_stage_title: string
years: string[]
unit_slugs: string[]
unit_titles: string[]
unit_count: number
lesson_count: number
has_ks4_options: boolean
sequence_canonical_url: string
```

### Phase 2 Additions (6 fields) 🎯

```typescript
// Facets for Discovery
threads_available: string[]  // List of threads
tiers_available: string[]  // Foundation, Higher, Core
exam_boards_available: string[]
pathways_available: string[]
years_available: string[]

// Counts
lesson_count_by_thread: Record<string, number>  // {'algebra': 45, 'number': 67}
```

### Total: 19 fields (13 current + 6 phase 2)

---

## Index 6: `oak_threads` (NEW - Phase 2)

**Purpose**: Thread-centric navigation and search

```typescript
interface ThreadDoc {
  // Identification
  thread_id: string; // Auto-generated or from API
  thread_slug: string; // 'maths-number', 'maths-algebra'
  thread_title: string; // 'Number', 'Algebra'
  thread_description: string; // What this thread covers

  // Taxonomy
  subject_slug: string; // 'maths'
  key_stages: string[]; // ['ks3', 'ks4'] - threads span keystages
  phase: string; // 'secondary'

  // Content Coverage
  unit_ids: string[]; // All units in this thread
  lesson_count: number;

  // KS4-Specific
  tier_coverage: {
    foundation: string[]; // Topics in Foundation
    higher: string[]; // Topics in Higher
  };

  // Core Concepts
  core_concepts: string[]; // Key concepts in this thread
  skills_developed: string[]; // Mathematical skills

  // Progression
  related_threads: string[]; // Connected threads
  prerequisite_threads: string[]; // What comes before

  // Search
  thread_semantic: string; // semantic_text field
  canonical_url: string;

  // Suggestion
  title_suggest: CompletionSuggester;
}
```

### Total: 18 fields (all new)

---

## Index 7: `oak_ontology` (NEW - Phase 4 RAG)

**Purpose**: Domain knowledge for RAG grounding

```typescript
interface OntologyDoc {
  // Identification
  concept_id: string; // Unique ID
  concept_type: string; // 'thread', 'tier', 'exam_board', 'mathematical_concept'
  concept_name: string;

  // Definition
  definition: string; // What is this?
  explanation: string; // Detailed explanation
  context: string; // When/where relevant

  // Taxonomy
  subject_slug: string; // 'maths'
  key_stage: string; // 'ks4'

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

  // Source
  source: 'manual' | 'generated' | 'extracted';
  confidence: number; // 0.0-1.0
}
```

### Total: 17 fields (all new)

---

## Index 8: `oak_lesson_transcripts` (NEW - Phase 4 RAG)

**Purpose**: Chunked transcripts for deep RAG retrieval

```typescript
interface TranscriptChunkDoc {
  // Identification
  chunk_id: string;
  lesson_id: string;
  lesson_slug: string;
  lesson_title: string;

  // Chunk Content
  chunk_text: string; // ~500-1000 words
  chunk_index: number; // Position in lesson (0, 1, 2...)
  chunk_semantic: string; // semantic_text for retrieval

  // Context
  topic: string; // What's being discussed in this chunk
  timestamp_start: string; // Video timestamp '00:03:45'
  timestamp_end: string;

  // Taxonomy (denormalized for filtering)
  subject_slug: string;
  key_stage: string;
  tier: string;

  // Relations
  previous_chunk_id: string;
  next_chunk_id: string;

  // URLs
  canonical_url: string; // Deep link to timestamp
  lesson_url: string; // Full lesson URL
}
```

### Total: 17 fields (all new)

---

## Index 9: `oak_curriculum_graph` (NEW - Phase 4 Graph)

**Purpose**: Store curriculum relationships as triples

```typescript
interface CurriculumTriple {
  // Triple Identification
  triple_id: string; // "lesson:fractions|hasKeyword|keyword:denominator"

  // Source Entity
  source_id: string; // "lesson:adding-fractions"
  source_type: string; // "lesson"
  source_label: string; // "Adding Fractions with Same Denominator"

  // Relationship
  relation: string; // "hasKeyword", "containedIn", "addresses", etc.
  relation_category: string; // "hierarchical", "semantic", "pedagogical"

  // Target Entity
  target_id: string; // "keyword:denominator"
  target_type: string; // "keyword"
  target_label: string; // "denominator"

  // Metadata
  confidence: number; // 0.0-1.0 (1.0 for explicit, <1.0 for inferred)
  extraction_source: string; // "api", "ner", "cooccurrence"
  context: string; // Sentence/context where relationship found

  // Provenance
  source_doc_id: string; // Document this was extracted from
  created_at: string; // ISO 8601

  // Subject filtering (denormalized)
  subject_slug: string;
  key_stage: string;
}
```

### Total: 16 fields (all new)

---

## Index 10: `oak_entities` (NEW - Phase 4 Graph)

**Purpose**: Canonical entity records

```typescript
interface EntityDoc {
  // Identification
  entity_id: string; // "keyword:denominator"
  entity_type: string; // "keyword", "lesson", "unit", "person", "concept"
  canonical_label: string; // "Denominator"
  aliases: string[]; // Alternative names

  // Description
  description: string;
  description_semantic: string; // semantic_text

  // Type-specific metadata
  metadata: Record<string, unknown>; // Flexible per type

  // Graph Metrics (computed periodically)
  in_degree: number; // How many edges point TO this entity
  out_degree: number; // How many edges point FROM this entity
  centrality: number; // PageRank or similar (0.0-1.0)

  // Usage Stats
  lesson_count: number; // How many lessons reference this
  unit_count: number;

  // Subject filtering
  subject_slugs: string[];
  key_stages: string[];

  // Provenance
  source: 'api' | 'ner' | 'manual';
  created_at: string;
  updated_at: string;
}
```

### Total: 16 fields (all new)

---

## Index 11: `oak_maths_topics` (NEW - Phase 3 Reference)

**Purpose**: Hierarchical topic structure for Maths

```typescript
interface MathsTopicDoc {
  // Identification
  topic_id: string;
  topic_name: string;
  topic_slug: string;

  // Hierarchy
  parent_topic_id: string;
  child_topic_ids: string[];
  level: number; // Depth in hierarchy (0=root, 1=major, 2=sub-topic)

  // KS4 Tier Relevance
  tier_relevance: {
    foundation: boolean;
    higher: boolean;
    core: boolean;
  };

  // Content Coverage
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
  topic_semantic: string; // semantic_text
  keywords: string[];

  // Metadata
  complexity_level: number; // 1-10
}
```

### Total: 17 fields (all new)

---

## Summary by Phase

| Phase | Index                          | Status        | Fields   | Re-upload?                |
| ----- | ------------------------------ | ------------- | -------- | ------------------------- |
| **1** | oak_lessons                    | ✅ Current    | 21       | No - exists               |
| **1** | oak_units                      | ✅ Current    | 16       | No - exists               |
| **1** | oak_unit_rollup                | ✅ Current    | 18       | No - exists               |
| **1** | oak_sequences                  | ✅ Current    | 14       | No - exists               |
| **1** | oak_sequence_facets            | ✅ Current    | 13       | No - exists               |
| **2** | oak_lessons (enhanced)         | 🎯 Add fields | +11 → 40 | **YES** if schema changes |
| **2** | oak_units (enhanced)           | 🎯 Add fields | +12 → 28 | **YES** if schema changes |
| **2** | oak_unit_rollup (enhanced)     | 🎯 Add fields | +15 → 33 | **YES** if schema changes |
| **2** | oak_sequences (enhanced)       | 🎯 Add fields | +8 → 22  | **YES** if schema changes |
| **2** | oak_sequence_facets (enhanced) | 🎯 Add fields | +6 → 19  | **YES** if schema changes |
| **2** | oak_threads                    | 🎯 New        | 18       | No - new index            |
| **4** | oak_ontology                   | 🎯 New        | 17       | No - new index            |
| **4** | oak_lesson_transcripts         | 🎯 New        | 17       | No - new index            |
| **4** | oak_curriculum_graph           | 🎯 New        | 16       | No - new index            |
| **4** | oak_entities                   | 🎯 New        | 16       | No - new index            |
| **3** | oak_maths_topics               | 🎯 New        | 17       | No - new index            |

---

## Critical Decision: Add All Fields NOW or Later?

### Option A: Add All Fields NOW (Recommended ⭐)

**Pros**:

- ✅ Upload Maths KS4 **once**
- ✅ Fields can be NULL/missing without errors
- ✅ Gradual population (phase 1 → phase 4)
- ✅ No re-ingestion pain

**Cons**:

- ❌ Larger schema upfront
- ❌ Some fields unused initially
- ❌ More complex field definitions

### Option B: Add Fields Per Phase

**Pros**:

- ✅ Simpler initial schema
- ✅ Only add what's needed

**Cons**:

- ❌ **Re-upload required** for each phase
- ❌ Maths KS4 re-ingestion: 10-20 min each time
- ❌ Risk of data loss/errors during reindex

---

## Recommendation: Hybrid Approach

### Phase 1 Upload (NOW)

Add **high-confidence Phase 2 fields** immediately:

```typescript
// oak_lessons additions (5 fields)
tier: string  // Already in API data
exam_board: string  // May be in programme factors
pathway: string  // Programme slug hints
thread_slugs: string[]  // Already planned
thread_titles: string[]  // Already planned

// oak_units additions (same 5)
// oak_unit_rollup additions (same 5)
// oak_sequences additions (same 3)
```

**Result**: ~15-20 extra fields across 5 indexes, **all of which we'll likely populate soon**.

### Phase 2 Upload (Later)

Add remaining Phase 2 fields when ready to populate them.

### Phase 3-4: New Indexes Only

No re-upload of existing content - just create new indexes.

---

## Field Definition Updates Needed

### 1. Update `curriculum.ts`

Add Phase 2 fields to existing index definitions:

```typescript
// In LESSONS_INDEX_FIELDS
{ name: 'tier', zodType: 'string', optional: true },
{ name: 'exam_board', zodType: 'string', optional: true },
{ name: 'pathway', zodType: 'string', optional: true },
{ name: 'difficulty_level', zodType: 'number', optional: true },
{ name: 'estimated_duration_minutes', zodType: 'number', optional: true },
// ... etc
```

### 2. Create `field-definitions/graph.ts`

```typescript
export const CURRICULUM_GRAPH_FIELDS: IndexFieldDefinitions = [
  { name: 'triple_id', zodType: 'string', optional: false },
  { name: 'source_id', zodType: 'string', optional: false },
  // ... etc
];

export const ENTITIES_FIELDS: IndexFieldDefinitions = [
  { name: 'entity_id', zodType: 'string', optional: false },
  // ... etc
];
```

### 3. Create `field-definitions/rag.ts`

```typescript
export const ONTOLOGY_FIELDS: IndexFieldDefinitions = [
  { name: 'concept_id', zodType: 'string', optional: false },
  // ... etc
];

export const TRANSCRIPT_CHUNKS_FIELDS: IndexFieldDefinitions = [
  { name: 'chunk_id', zodType: 'string', optional: false },
  // ... etc
];
```

---

## Next Actions

1. **Decide on strategy**: Option A (all fields now) vs Hybrid (high-confidence fields now)
2. **Update field definitions** in SDK
3. **Run `pnpm sdk-codegen`** to generate schemas
4. **Verify ES mappings** are generated correctly
5. **Run quality gates**
6. **Upload Maths KS4** with new schema
7. **Populate fields incrementally** as features are built

---

## References

- **Hybrid Field Strategy**: `.agent/plans/semantic-search/hybrid-field-strategy.md` - Implementation plan for Phase 1+2 fields
- **Phase 4 Deferred Fields**: `.agent/plans/semantic-search/phase-4-deferred-fields.md` - Complete plan for AI/Graph fields
- **Maths KS4 Vertical Slice**: `.agent/plans/semantic-search/maths-ks4-vertical-slice.md`
- **Graph RAG Vision**: `.agent/research/elasticsearch/ai/graph-rag-integration-vision.md`
- **Reference Indices Plan**: `.agent/plans/semantic-search/reference-indices-plan.md`
- **Entity Discovery Pipeline**: `.agent/plans/semantic-search/entity-discovery-pipeline.md`
- **Current Field Definitions**: `packages/sdks/oak-sdk-codegen/code-generation/typegen/search/field-definitions/curriculum.ts`
