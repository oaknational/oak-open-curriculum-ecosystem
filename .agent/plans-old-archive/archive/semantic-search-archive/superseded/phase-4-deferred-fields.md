# Phase 4 Deferred Fields: AI & Graph Enrichment

**Date**: 2025-12-07  
**Status**: PLANNED - For implementation after Phase 2-3 complete  
**Goal**: Document fields deferred from hybrid strategy for AI/Graph features

---

## Context

The **hybrid field strategy** adds high-confidence Phase 2 fields during Phase 1 upload to avoid re-ingestion. However, some **Phase 4 fields** require expensive processing (LLM calls, NER, graph analysis) and are deliberately deferred.

This document records those fields for pickup once Phases 2-3 are complete.

---

## Deferred Fields by Index

### `oak_lessons` (8 deferred fields)

#### AI-Generated Content (3 fields)

```typescript
// Requires: LLM API calls (~$0.001-0.01 per lesson)
ai_generated_summary: string  // 2-3 sentence overview
difficulty_reasoning: string  // Explanation of difficulty_level
semantic_keywords: string[]   // AI-extracted vs authored keywords
```

**Population Strategy**:

- Batch process all lessons through GPT-4 or similar
- Use lesson title + transcript + metadata as context
- Store results and update via `_update_by_query`

**Cost Estimate**: ~$5-20 for Maths KS4 (100 lessons)

#### Graph-Derived Content (3 fields)

```typescript
// Requires: NER processing on transcripts
mentions_entities: string[]  // People, places, events, concepts
```

**Population Strategy**:

- Run NER pipeline (Hugging Face model or OpenAI)
- Extract named entities from `transcript_text`
- Create corresponding entries in `oak_entities` index
- Link via `oak_curriculum_graph` triples

```typescript
// Requires: Graph analysis
curriculum_concepts: string[]  // Extracted key concepts from graph
```

**Population Strategy**:

- After graph is built, run concept extraction
- Use graph centrality to identify key concepts
- Tag lessons with top N concepts

#### RAG Infrastructure (2 fields)

```typescript
// Requires: Transcript chunking pipeline
chunked_for_rag: boolean; // Has corresponding chunks in transcript index
chunk_count: number; // Number of chunks created
```

**Population Strategy**:

- Create `oak_lesson_transcripts` index (Phase 4)
- Chunk transcripts (~500-1000 words each)
- Update lessons with chunk metadata

### `oak_units` (3 deferred fields)

```typescript
// Requires: Graph analysis
has_video_lessons: boolean; // Aggregate from lessons
resource_count: number; // Total resources across lessons

// Requires: Manual curation or ML
primary_thread: string; // Main thread this unit belongs to
```

**Population Strategy**:

- Compute from lesson data via aggregation
- `primary_thread`: Use most frequent thread from lessons, or ML classification

### `oak_unit_rollup` (3 deferred fields)

Same as `oak_units` above (inherited fields)

### `oak_sequences` (2 deferred fields)

```typescript
// Requires: Aggregation from units
unit_count: number; // Computed from unit_slugs.length

// Requires: Manual curation
sequence_order: number; // Position in curriculum
```

**Population Strategy**:

- `unit_count`: Simple aggregation
- `sequence_order`: Manual curation or infer from sequence metadata

---

## Update Strategy: `_update_by_query` vs Re-Ingest

### Option A: `_update_by_query` (Recommended ✅)

Update documents in-place without re-ingestion:

```typescript
// Example: Add AI summaries
POST oak_lessons/_update_by_query
{
  "script": {
    "source": """
      if (params.summaries.containsKey(ctx._source.lesson_id)) {
        ctx._source.ai_generated_summary = params.summaries[ctx._source.lesson_id];
        ctx._source.difficulty_reasoning = params.reasoning[ctx._source.lesson_id];
      }
    """,
    "params": {
      "summaries": {
        "lesson-123": "This lesson introduces...",
        "lesson-456": "Students explore..."
      },
      "reasoning": {
        "lesson-123": "Rated 8/10 because...",
        "lesson-456": "Rated 5/10 because..."
      }
    }
  }
}
```

**Pros**:

- ✅ No downtime
- ✅ Faster than re-ingest
- ✅ Can update subset of documents
- ✅ Existing data preserved

**Cons**:

- ❌ Scripting required
- ❌ Large updates need batching

### Option B: Re-Ingest with New Schema

1. Add fields to field definitions
2. Run `pnpm type-gen`
3. Reset indexes
4. Re-ingest all data with new fields populated

**Pros**:

- ✅ Simple, uses existing pipeline
- ✅ Clean slate, no update errors

**Cons**:

- ❌ Requires full re-ingestion (10-20 min for Maths KS4)
- ❌ Downtime during reindex
- ❌ More API quota usage

**Recommendation**: Use **Option A** (`_update_by_query`) for Phase 4 fields. Reserve re-ingestion for major schema changes only.

---

## Implementation Phases

### Phase 4.1: AI Enrichment

**Goal**: Add AI-generated summaries and reasoning

**Steps**:

1. Fetch all lessons from ES
2. For each lesson, call LLM with prompt:

   ```
   Based on this lesson, provide:
   1. A 2-3 sentence summary
   2. An explanation of difficulty level (given: {difficulty_level})
   3. Key semantic keywords not in the authored list

   Lesson: {title}
   Keywords: {lesson_keywords}
   Transcript: {transcript_text (first 2000 chars)}
   ```

3. Collect responses in batches of 100
4. Update ES via `_update_by_query` in batches
5. Verify coverage: >95% of lessons enriched

**Time**: 2-4 hours (including LLM API time)  
**Cost**: $5-20 for Maths KS4

### Phase 4.2: NER Entity Extraction

**Goal**: Extract named entities from transcripts

**Steps**:

1. Set up NER pipeline (Hugging Face `transformers` or OpenAI)
2. Process transcripts in batches
3. Extract entities by type: `person`, `place`, `scientific_term`, `concept`
4. Create `oak_entities` documents for each unique entity
5. Create `oak_curriculum_graph` triples: `lesson --mentions--> entity`
6. Update lessons with `mentions_entities` array
7. Verify: >80% of lessons have entities extracted

**Time**: 4-8 hours (depending on pipeline choice)  
**Cost**: $10-50 for Maths KS4 (if using OpenAI)

### Phase 4.3: Graph-Derived Concepts

**Goal**: Tag lessons with key curriculum concepts from graph

**Steps**:

1. Build curriculum graph from explicit relationships (Phase 5)
2. Run centrality analysis on graph
3. Identify high-centrality concepts (e.g., "Pythagoras", "Quadratic")
4. For each lesson, find connected concepts via graph traversal
5. Update lessons with top 5-10 concepts
6. Verify: All lessons have at least 3 concepts

**Time**: 2-4 hours  
**Cost**: Free (compute only)

### Phase 4.4: Transcript Chunking

**Goal**: Create chunked transcripts for deep RAG retrieval

**Steps**:

1. Create `oak_lesson_transcripts` index
2. For each lesson:
   - Split transcript into ~500-1000 word chunks
   - Preserve sentence boundaries
   - Add context (lesson title, subject, key stage)
   - Index as separate documents
3. Update lessons with `chunked_for_rag: true` and `chunk_count: N`
4. Verify: All lessons with transcripts have chunks

**Time**: 1-2 hours  
**Cost**: Free (indexing only)

---

## Quality Gates for Phase 4

Before Phase 4 completion, verify:

### AI Enrichment

- ✅ `ai_generated_summary` populated for >95% of lessons
- ✅ Summaries are factually accurate (spot check 20 random lessons)
- ✅ `difficulty_reasoning` aligns with `difficulty_level`

### NER Extraction

- ✅ `mentions_entities` populated for >80% of lessons
- ✅ Entities are relevant to lesson content (spot check 20)
- ✅ `oak_entities` index has >100 unique entities for Maths KS4

### Graph Concepts

- ✅ `curriculum_concepts` populated for 100% of lessons
- ✅ Concepts are curriculum-relevant (not generic)
- ✅ Concepts link to ontology or graph entities

### Chunking

- ✅ `chunked_for_rag: true` for 100% of lessons with transcripts
- ✅ `chunk_count` matches actual chunks in `oak_lesson_transcripts`
- ✅ Chunks are retrievable and semantically meaningful

---

## Field Definition Updates for Phase 4

When ready to implement Phase 4, add these to field definitions:

### `curriculum.ts` - LESSONS_INDEX_FIELDS

```typescript
// After the hybrid fields (line ~80):

// AI-Generated Content
{ name: 'ai_generated_summary', zodType: 'string', optional: true },
{ name: 'difficulty_reasoning', zodType: 'string', optional: true },
{ name: 'semantic_keywords', zodType: 'array-string', optional: true },

// Graph-Derived
{ name: 'mentions_entities', zodType: 'array-string', optional: true },
{ name: 'curriculum_concepts', zodType: 'array-string', optional: true },

// RAG Infrastructure
{ name: 'chunked_for_rag', zodType: 'boolean', optional: true },
{ name: 'chunk_count', zodType: 'number', optional: true },

// Quality Signals (future)
{ name: 'teacher_rating_avg', zodType: 'number', optional: true },
{ name: 'usage_count', zodType: 'number', optional: true },
```

### ES Field Overrides

```typescript
// In es-field-overrides.ts
mentions_entities: { type: 'keyword' },
curriculum_concepts: { type: 'keyword' },
semantic_keywords: { type: 'keyword' },
```

---

## Dependencies

### Prerequisite Phases

- ✅ Phase 1: Hybrid fields uploaded
- ✅ Phase 2: Empty fields populated
- ✅ Phase 3: Reference indices created
- ⏳ Phase 5: Curriculum graph built (for concept extraction)

### External Services

- **LLM API**: OpenAI GPT-4 or similar (for summaries)
- **NER Pipeline**: Hugging Face model or OpenAI (for entity extraction)
- **Compute**: Local or cloud (for graph analysis)

---

## Cost Estimates

| Task                | Time      | $ Cost     | Notes                         |
| ------------------- | --------- | ---------- | ----------------------------- |
| AI Summaries        | 2-4h      | $5-20      | $0.001-0.01 per lesson        |
| NER Extraction      | 4-8h      | $10-50     | If using OpenAI; free with HF |
| Graph Concepts      | 2-4h      | $0         | Compute only                  |
| Transcript Chunking | 1-2h      | $0         | Indexing only                 |
| **Total**           | **9-18h** | **$15-70** | For Maths KS4 (~100 lessons)  |

**Scale to full curriculum**: ~$500-2000 for all subjects/keystages.

---

## References

- **Hybrid Field Strategy**: `.agent/plans/semantic-search/hybrid-field-strategy.md`
- **Comprehensive Field Requirements**: `.agent/analysis/comprehensive-field-requirements-maths-ks4.md`
- **Graph RAG Vision**: `.agent/research/elasticsearch/ai/graph-rag-integration-vision.md`
- **Entity Discovery Pipeline**: `.agent/plans/semantic-search/entity-discovery-pipeline.md`
