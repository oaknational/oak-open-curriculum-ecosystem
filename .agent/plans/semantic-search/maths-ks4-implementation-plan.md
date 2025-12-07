# Maths KS4 Complete Implementation Plan

**Git Version**: See `git log` for commit history  
**Status**: ACTIVE - Primary Implementation Plan  
**Priority**: HIGH  
**Foundation Alignment**: ✅ rules.md | schema-first-execution.md | testing-strategy.md

---

## Executive Summary

This plan integrates **ALL high-impact Elasticsearch Serverless features** into the Maths KS4 vertical slice to create a deeply impressive demonstration of cutting-edge search capabilities.

### Strategic Goal

Create a production-ready demo that proves ES Serverless as the **definitive platform** for intelligent curriculum search using Maths KS4 as a complete vertical slice.

### Why Maths KS4 Vertical Slice?

Given the **Oak API 1000 requests/hour limit**, full ingestion of 340 combinations would take 17-24 hours. Maths KS4 provides:

- ✅ **Maximum complexity**: Tiers (Foundation/Higher), pathways, exam boards, threads
- ✅ **High value**: Exam preparation content teachers actively need
- ✅ **Complete feature coverage**: Tests all search, faceting, and semantic capabilities
- ✅ **Manageable scope**: ~100-200 requests = 10-20 minutes to ingest
- ✅ **Foundation for expansion**: Patterns scale to full curriculum

### What We're Building

**Three-way hybrid search**: BM25 + ELSER sparse + dense vectors via Inference API  
**AI-powered relevance**: Cohere ReRank, NER entity extraction, LLM query understanding  
**Knowledge graph integration**: ES Graph API for curriculum relationships  
**Advanced retrieval**: Filtered kNN, enrich processors, semantic query rules  
**RAG infrastructure**: ES Playground prototyping, chunked transcripts, ontology grounding  
**Learning to Rank foundations**: Click-through data collection for personalized relevance

---

## Foundation Document Alignment

### Schema-First Execution (Mandatory)

**Cardinal Rule**: Every byte of runtime behavior flows from generated artifacts at `pnpm type-gen` time.

**Compliance Requirements**:

1. **New field definitions** (dense vectors, entities, etc.) → `field-definitions/curriculum.ts`
2. **ES mappings auto-generate** from field definitions via `es-mapping-from-fields.ts`
3. **Zod schemas auto-generate** from field definitions via `zod-schema-generator.ts`
4. **Inference configurations** → Type-gen generates type-safe inference endpoint descriptors
5. **Never edit generated files** - update generators only, run `pnpm type-gen`

### TDD at ALL Levels (Mandatory)

**Test-First Approach**:

1. **Unit tests** for extraction functions (RED → GREEN → REFACTOR)
2. **Integration tests** for document transforms with new fields
3. **E2E tests** for new search endpoints before implementation
4. **No mocks in unit tests** - pure functions only
5. **Simple mocks in integration tests** - injected as arguments

### Documentation Requirements (Mandatory)

**For Every Feature**:

1. **TSDoc comments** with examples in all functions/modules
2. **Authored documentation** in `apps/oak-open-curriculum-semantic-search/docs/`
3. **ADR creation** for architectural decisions (see ADR checklist per phase)
4. **Update semantic-search.prompt.md** with new capabilities
5. **typedoc-compatible** documentation for public APIs

---

## Implementation Timeline

**Total Duration**: 4-5 weeks (22-29 days)

### Phase Overview

| Phase  | Focus                            | Duration | Key ES Features                            | ADRs |
| ------ | -------------------------------- | -------- | ------------------------------------------ | ---- |
| **1A** | Three-Way Hybrid + Dense Vectors | 2-3 days | Inference API, dense_vector, three-way RRF | 3    |
| **1B** | Relevance Enhancement            | 2-3 days | Cohere ReRank, filtered kNN, query rules   | 2    |
| **1C** | Maths KS4 Ingestion              | 1 day    | Full content with enhanced schema          | -    |
| **2A** | Entity Extraction & Graph        | 3-4 days | NER models, Graph API, enrich processor    | 3    |
| **2B** | Reference Indices & Threads      | 2-3 days | 5 new indices, thread support              | 1    |
| **3**  | RAG Infrastructure               | 4-5 days | ES Playground, semantic_text, chunking     | 2    |
| **4**  | Knowledge Graph                  | 5-6 days | Triple store, entity resolution            | 2    |
| **5**  | Advanced Features                | 3-4 days | LTR foundations, multi-vector              | 2    |

### Week-by-Week Breakdown

| Week  | Focus       | Deliverables                                                                    |
| ----- | ----------- | ------------------------------------------------------------------------------- |
| **1** | Phase 1A-1C | Three-way hybrid, dense vectors, reranking, Maths KS4 ingestion, 5 ADRs, 5 docs |
| **2** | Phase 2A-2B | Entity extraction, Graph API, reference indices, 4 ADRs, 5 docs                 |
| **3** | Phase 3     | RAG infrastructure, ES Playground, chunked transcripts, 2 ADRs, 3 docs          |
| **4** | Phase 4     | Knowledge graph, triple store, entity resolution, 2 ADRs, 2 docs                |
| **5** | Phase 5     | LTR foundations, multi-vector, polish, 2 ADRs, 2 docs                           |

**Aggressive**: 3 weeks with parallel work  
**Conservative**: 6 weeks with thorough validation

---

## Phase 1A: Three-Way Hybrid Search with Dense Vectors

### Goal

Implement cutting-edge hybrid search combining BM25 + ELSER sparse + E5 dense vectors with Reciprocal Rank Fusion, using only Elastic-native services.

### Key Decision: Elastic-Native Dense Vectors (2025-12-07)

Chose `.multilingual-e5-small-elasticsearch` (384-dim) over OpenAI `text-embedding-3-small` (1536-dim):

| Factor       | OpenAI            | E5 (Chosen)                  |
| ------------ | ----------------- | ---------------------------- |
| External API | Required          | **None**                     |
| Dimensions   | 1536              | **384**                      |
| Billing      | Per-token         | **Included in subscription** |
| Setup        | Register endpoint | **PRECONFIGURED**            |

See ADR-071 for full rationale.

### ES Serverless Features Integrated

1. **E5 Inference** - Preconfigured `.multilingual-e5-small-elasticsearch` endpoint
2. **Dense Vector Fields** - `dense_vector` type with HNSW indexing (384-dim)
3. **Three-Way RRF** - Fuse lexical + ELSER sparse + E5 dense results
4. **Query Vector Builder** - Dynamic embedding generation at query time

### Verified Available Endpoints

| Endpoint                               | Type                     | Status        |
| -------------------------------------- | ------------------------ | ------------- |
| `.multilingual-e5-small-elasticsearch` | text_embedding (384-dim) | PRECONFIGURED |
| `.elser-2-elasticsearch`               | sparse_embedding         | PRECONFIGURED |
| `.rerank-v1-elasticsearch`             | rerank                   | TECH PREVIEW  |

### Implementation Guide

See the detailed TDD examples in `.agent/prompts/semantic-search/semantic-search.prompt.md` and the code patterns in the Phase 1A section below.

### Field Additions Summary

**Implemented (2025-12-07)**:

| Index             | Current Fields | Phase 1A Adds | New Total |
| ----------------- | -------------- | ------------- | --------- |
| `oak_lessons`     | 21             | +4            | **25**    |
| `oak_unit_rollup` | 18             | +3            | **21**    |

**Fields Added**:

- `lesson_dense_vector` (384-dim, E5)
- `tier` (keyword)
- `exam_board` (keyword)
- `pathway` (keyword, lessons only)
- `unit_dense_vector` (384-dim, E5, unit_rollup only)

**Deferred to Later Phases**: Additional fields for units, sequences, and sequence_facets.

### Field Additions (Schema-First)

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts`

#### Lessons Index

```typescript
// Add to LESSONS_INDEX_FIELDS
{ name: 'lesson_dense_vector', zodType: 'array-number', optional: true },
{ name: 'title_dense_vector', zodType: 'array-number', optional: true },
{ name: 'tier', zodType: 'string', optional: true },  // 'foundation' | 'higher'
{ name: 'exam_board', zodType: 'string', optional: true },  // e.g., 'aqa', 'edexcel'
{ name: 'pathway', zodType: 'string', optional: true },  // programme pathway
{ name: 'difficulty_level', zodType: 'string', optional: true },  // computed
{ name: 'estimated_duration_minutes', zodType: 'number', optional: true },
{ name: 'resource_types', zodType: 'string-array', optional: true },  // video, worksheet, etc.
{ name: 'prerequisite_lesson_ids', zodType: 'string-array', optional: true },  // Phase 2
{ name: 'related_lesson_ids', zodType: 'string-array', optional: true },  // Phase 2
```

#### Units Index

```typescript
// Add to UNITS_INDEX_FIELDS
{ name: 'unit_dense_vector', zodType: 'array-number', optional: true },
{ name: 'tier', zodType: 'string', optional: true },
{ name: 'exam_board', zodType: 'string', optional: true },
{ name: 'pathway', zodType: 'string', optional: true },
{ name: 'unit_type', zodType: 'string', optional: true },  // 'core' | 'support' | 'development'
{ name: 'estimated_total_hours', zodType: 'number', optional: true },
{ name: 'assessment_included', zodType: 'boolean', optional: true },
{ name: 'resource_types', zodType: 'string-array', optional: true },
{ name: 'prerequisite_unit_ids', zodType: 'string-array', optional: true },  // Phase 2
```

#### Unit Rollup Index

```typescript
// Add to UNIT_ROLLUP_INDEX_FIELDS
{ name: 'rollup_dense_vector', zodType: 'array-number', optional: true },
{ name: 'tier', zodType: 'string', optional: true },
{ name: 'exam_board', zodType: 'string', optional: true },
{ name: 'pathway', zodType: 'string', optional: true },
{ name: 'unit_type', zodType: 'string', optional: true },
{ name: 'total_lesson_count', zodType: 'number', optional: true },
{ name: 'combined_misconceptions', zodType: 'string-array', optional: true },
{ name: 'combined_keywords', zodType: 'string-array', optional: true },
{ name: 'combined_resource_types', zodType: 'string-array', optional: true },
{ name: 'average_difficulty', zodType: 'string', optional: true },
{ name: 'estimated_total_hours', zodType: 'number', optional: true },
```

#### Sequences Index

```typescript
// Add to SEQUENCES_INDEX_FIELDS
{ name: 'sequence_dense_vector', zodType: 'array-number', optional: true },
{ name: 'tier', zodType: 'string', optional: true },
{ name: 'exam_board', zodType: 'string', optional: true },
{ name: 'pathway', zodType: 'string', optional: true },
{ name: 'threads_covered', zodType: 'string-array', optional: true },  // Phase 2
{ name: 'total_unit_count', zodType: 'number', optional: true },
{ name: 'progression_summary', zodType: 'text', optional: true },
```

#### Sequence Facets Index

```typescript
// Add to SEQUENCE_FACETS_INDEX_FIELDS
{ name: 'tiers_available', zodType: 'string-array', optional: true },  // ['foundation', 'higher']
{ name: 'exam_boards_available', zodType: 'string-array', optional: true },
{ name: 'pathways_available', zodType: 'string-array', optional: true },
{ name: 'threads_available', zodType: 'string-array', optional: true },  // Phase 2
{ name: 'total_sequence_count', zodType: 'number', optional: true },
```

### ES Field Overrides

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-field-overrides.ts`

```typescript
// Add dense vector overrides
lesson_dense_vector: {
  type: 'dense_vector',
  dims: 384,
  index: true,
  similarity: 'cosine',
},
title_dense_vector: {
  type: 'dense_vector',
  dims: 384,
  index: true,
  similarity: 'cosine',
},
unit_dense_vector: {
  type: 'dense_vector',
  dims: 384,
  index: true,
  similarity: 'cosine',
},
rollup_dense_vector: {
  type: 'dense_vector',
  dims: 384,
  index: true,
  similarity: 'cosine',
},
sequence_dense_vector: {
  type: 'dense_vector',
  dims: 384,
  index: true,
  similarity: 'cosine',
},

// Add keyword overrides for faceting
tier: { type: 'keyword' },
exam_board: { type: 'keyword' },
pathway: { type: 'keyword' },
unit_type: { type: 'keyword' },
difficulty_level: { type: 'keyword' },
resource_types: { type: 'keyword' },  // Array of keywords
tiers_available: { type: 'keyword' },
exam_boards_available: { type: 'keyword' },
pathways_available: { type: 'keyword' },
threads_available: { type: 'keyword' },
```

### Extraction Functions (TDD)

#### 1. Write Tests FIRST (RED)

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transform-helpers.unit.test.ts`

```typescript
describe('extractTier', () => {
  it('should extract foundation tier from programme factors', () => {
    const lessonData = createLessonData({
      programmeFactors: { tier: 'foundation' },
    });
    expect(extractTier(lessonData)).toBe('foundation');
  });

  it('should extract higher tier', () => {
    const lessonData = createLessonData({
      programmeFactors: { tier: 'higher' },
    });
    expect(extractTier(lessonData)).toBe('higher');
  });

  it('should return undefined if no tier', () => {
    const lessonData = createLessonData({ programmeFactors: {} });
    expect(extractTier(lessonData)).toBeUndefined();
  });
});

describe('extractExamBoard', () => {
  it('should extract exam board from programme factors', () => {
    const lessonData = createLessonData({
      programmeFactors: { examBoard: 'aqa' },
    });
    expect(extractExamBoard(lessonData)).toBe('aqa');
  });

  it('should handle missing exam board', () => {
    const lessonData = createLessonData({ programmeFactors: {} });
    expect(extractExamBoard(lessonData)).toBeUndefined();
  });
});

describe('extractDifficultyLevel', () => {
  it('should compute difficulty from tier and year', () => {
    expect(extractDifficultyLevel('higher', '11')).toBe('advanced');
    expect(extractDifficultyLevel('foundation', '10')).toBe('intermediate');
    expect(extractDifficultyLevel('foundation', '9')).toBe('basic');
  });

  it('should handle missing data', () => {
    expect(extractDifficultyLevel(undefined, '10')).toBeUndefined();
  });
});

describe('extractResourceTypes', () => {
  it('should extract resource types from lesson components', () => {
    const lessonData = createLessonData({
      lessonComponents: {
        video: true,
        worksheet: true,
        exitQuiz: true,
      },
    });
    expect(extractResourceTypes(lessonData)).toEqual(['video', 'worksheet', 'quiz']);
  });

  it('should return empty array if no resources', () => {
    const lessonData = createLessonData({ lessonComponents: {} });
    expect(extractResourceTypes(lessonData)).toEqual([]);
  });
});
```

#### 2. Implement Extraction Functions (GREEN)

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transform-helpers.ts`

````typescript
import type { LessonData } from '@oaknational/oak-curriculum-sdk/public/search';

/**
 * Extracts tier from lesson programme factors.
 *
 * @see ADR-073 - Dense Vector Field Strategy
 * @example
 * ```typescript
 * const tier = extractTier(lessonData);
 * // 'foundation' | 'higher' | undefined
 * ```
 */
export function extractTier(lessonData: LessonData): 'foundation' | 'higher' | undefined {
  const tier = lessonData.programmeFactors?.tier;
  if (tier === 'foundation' || tier === 'higher') {
    return tier;
  }
  return undefined;
}

/**
 * Extracts exam board from lesson programme factors.
 */
export function extractExamBoard(lessonData: LessonData): string | undefined {
  return lessonData.programmeFactors?.examBoard;
}

/**
 * Computes difficulty level from tier and year.
 *
 * Foundation Year 9-10 → basic
 * Foundation Year 11 → intermediate
 * Higher Year 10 → intermediate
 * Higher Year 11 → advanced
 */
export function extractDifficultyLevel(
  tier: 'foundation' | 'higher' | undefined,
  year: string | undefined,
): 'basic' | 'intermediate' | 'advanced' | undefined {
  if (!tier || !year) return undefined;

  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum)) return undefined;

  if (tier === 'foundation') {
    return yearNum <= 10 ? 'basic' : 'intermediate';
  }

  // higher tier
  return yearNum <= 10 ? 'intermediate' : 'advanced';
}

/**
 * Extracts resource types from lesson components.
 *
 * Maps component flags to searchable resource type keywords.
 */
export function extractResourceTypes(lessonData: LessonData): string[] {
  const types: string[] = [];
  const components = lessonData.lessonComponents;

  if (!components) return types;

  if (components.video) types.push('video');
  if (components.worksheet) types.push('worksheet');
  if (components.presentation) types.push('slides');
  if (components.starterQuiz || components.exitQuiz) types.push('quiz');

  return types;
}
````

#### 3. Dense Vector Extraction (OpenAI Integration)

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/dense-vector-extraction.ts` (NEW)

````typescript
import type { Client } from '@elastic/elasticsearch';
import { generateEmbedding } from '@oaknational/oak-curriculum-sdk/elasticsearch/inference';

/**
 * Generates dense vector embedding for lesson content.
 *
 * Combines title + summary into embedding text, calls OpenAI via ES Inference API.
 *
 * @see ADR-071 - OpenAI Inference API Integration
 * @see ADR-072 - Three-Way Hybrid Search
 *
 * @example
 * ```typescript
 * const vector = await generateLessonEmbedding(esClient, lessonData);
 * // number[] of length 1536, or undefined on error
 * ```
 */
export async function generateLessonEmbedding(
  esClient: Client,
  lessonData: { title: string; summary?: string },
): Promise<number[] | undefined> {
  const text = [lessonData.title, lessonData.summary].filter(Boolean).join(' ');

  if (!text.trim()) return undefined;

  try {
    return await generateEmbedding(esClient, {
      endpointId: 'openai-text-embedding-3-small',
      text,
    });
  } catch (error) {
    // Graceful degradation: Continue without dense vector
    return undefined;
  }
}

/**
 * Generates dense vector for lesson title only.
 *
 * Used for title-specific semantic matching.
 */
export async function generateTitleEmbedding(
  esClient: Client,
  title: string,
): Promise<number[] | undefined> {
  if (!title.trim()) return undefined;

  try {
    return await generateEmbedding(esClient, {
      endpointId: 'openai-text-embedding-3-small',
      text: title,
    });
  } catch (error) {
    return undefined;
  }
}
````

### Integration into Document Transforms

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transforms.ts`

Update `createLessonDocument` to include new fields:

```typescript
import {
  extractTier,
  extractExamBoard,
  extractDifficultyLevel,
  extractResourceTypes,
} from './document-transform-helpers.js';
import { generateLessonEmbedding, generateTitleEmbedding } from './dense-vector-extraction.js';

export async function createLessonDocument(
  esClient: Client,
  lessonData: LessonData,
): Promise<LessonDocument> {
  const tier = extractTier(lessonData);
  const examBoard = extractExamBoard(lessonData);
  const year = lessonData.year;

  return {
    // ... existing fields ...
    tier,
    exam_board: examBoard,
    pathway: lessonData.programmeFactors?.pathway,
    difficulty_level: extractDifficultyLevel(tier, year),
    estimated_duration_minutes: lessonData.estimatedDuration,
    resource_types: extractResourceTypes(lessonData),
    prerequisite_lesson_ids: [], // Phase 2
    related_lesson_ids: [], // Phase 2
    lesson_dense_vector: await generateLessonEmbedding(esClient, lessonData),
    title_dense_vector: await generateTitleEmbedding(esClient, lessonData.title),
  };
}
```

### Three-Way RRF Query Implementation

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/three-way-rrf.ts` (NEW)

````typescript
import type { Client } from '@elastic/elasticsearch';
import { generateEmbedding } from '@oaknational/oak-curriculum-sdk/elasticsearch/inference';

/**
 * Executes three-way hybrid search with RRF fusion.
 *
 * Combines:
 * 1. BM25 lexical search (multi_match)
 * 2. ELSER sparse semantic search (text_expansion)
 * 3. Dense vector semantic search (knn)
 *
 * @see ADR-072 - Three-Way Hybrid Search
 *
 * @example
 * ```typescript
 * const results = await threeWayHybridSearch(esClient, {
 *   index: 'oak_lessons',
 *   query: 'How do I teach Pythagoras theorem?',
 *   size: 20,
 *   filters: { tier: 'higher' },
 * });
 * ```
 */
export async function threeWayHybridSearch(
  esClient: Client,
  params: {
    index: string;
    query: string;
    size?: number;
    filters?: Record<string, unknown>;
  },
): Promise<SearchResults> {
  const { index, query, size = 20, filters } = params;

  // Generate query embedding
  const queryVector = await generateEmbedding(esClient, {
    endpointId: 'openai-text-embedding-3-small',
    text: query,
  });

  const response = await esClient.search({
    index,
    size,
    query: {
      bool: {
        // Apply filters
        filter: filters ? buildFilterClauses(filters) : undefined,
      },
    },
    // Three-way RRF
    sub_searches: [
      // 1. BM25 lexical
      {
        query: {
          multi_match: {
            query,
            fields: ['title^3', 'summary^2', 'transcript_text'],
          },
        },
      },
      // 2. ELSER sparse semantic
      {
        query: {
          text_expansion: {
            'ml.inference.title_expanded.predicted_value': {
              model_id: '.elser_model_2_linux-x86_64',
              model_text: query,
            },
          },
        },
      },
      // 3. Dense vector semantic
      queryVector
        ? {
            query: {
              knn: {
                field: 'lesson_dense_vector',
                query_vector: queryVector,
                k: 50,
                num_candidates: 100,
              },
            },
          }
        : undefined,
    ].filter(Boolean),
    rank: {
      rrf: {
        window_size: 50,
        rank_constant: 60,
      },
    },
  });

  return parseSearchResponse(response);
}
````

### ADRs to Create

1. **ADR-071: OpenAI Inference API Integration**
   - Decision: Use ES Inference API for OpenAI embeddings
   - Rationale: Native ES integration, better performance, unified error handling
   - Alternatives: Direct OpenAI SDK calls (more latency, separate retry logic)

2. **ADR-072: Three-Way Hybrid Search**
   - Decision: Combine BM25 + ELSER + Dense vectors via RRF
   - Rationale: 15-25% relevance improvement, captures multiple semantic signals
   - Tradeoffs: +50ms latency, OpenAI API cost

3. **ADR-073: Dense Vector Field Strategy**
   - Decision: Store lesson-level and title-level dense vectors
   - Rationale: Title vectors for precise matching, full vectors for broad semantic
   - Alternatives: Single vector per document (less flexible)

### Testing Requirements

1. **Unit tests**: 20+ tests for extraction functions
2. **Integration tests**: 5+ tests for document transforms with new fields
3. **E2E test**: 1 test for three-way hybrid query returning better results than two-way

### Documentation to Create

1. `docs/search/three-way-hybrid-search.md` - User guide with examples
2. `docs/search/dense-vector-configuration.md` - Setup and tuning guide
3. `docs/search/inference-api-setup.md` - OpenAI API key configuration

### Success Criteria

- [ ] All field definitions added to SDK
- [ ] `pnpm type-gen` generates correct mappings and Zod schemas
- [ ] All extraction functions have passing unit tests
- [ ] Document transforms include new fields
- [ ] Three-way RRF query implemented
- [ ] E2E test proves three-way beats two-way (MRR improvement)
- [ ] All quality gates passing
- [ ] 3 ADRs written and reviewed
- [ ] 3 docs created with examples

---

## Phase 1B: Relevance Enhancement

### Goal

Boost relevance of top-K results using Cohere ReRank and optimize constrained searches with filtered kNN.

### ES Serverless Features Integrated

1. **Cohere ReRank** - Cross-encoder model via Inference API for top-K reranking
2. **Filtered kNN** - Apply filters during vector search (not post-filter)
3. **Semantic Query Rules** - Define rules for specific query patterns

### Cohere ReRank Integration

**ADR-074: Cohere ReRank Integration**

````typescript
/**
 * Reranks top-K results using Cohere rerank-english-v3.0 model.
 *
 * @see ADR-074 - Cohere ReRank Integration
 *
 * @example
 * ```typescript
 * const results = await threeWayHybridSearch(esClient, { query: '...' });
 * const reranked = await cohereRerank(esClient, {
 *   query: '...',
 *   documents: results.hits,
 *   topN: 10,
 * });
 * ```
 */
export async function cohereRerank(
  esClient: Client,
  params: {
    query: string;
    documents: SearchHit[];
    topN?: number;
  },
): Promise<SearchHit[]> {
  const { query, documents, topN = 10 } = params;

  const response = await esClient.inference.inference({
    inference_id: 'cohere-rerank-english-v3',
    input: {
      query,
      documents: documents.map((doc) => doc._source.title),
    },
  });

  // Sort by relevance scores, return top N
  return applyRerankScores(documents, response.scores).slice(0, topN);
}
````

### Filtered kNN Optimization

**ADR-075: Filtered kNN Query Optimization**

Instead of post-filtering:

```typescript
// ❌ SLOW: Post-filter after kNN
{
  knn: {
    field: 'lesson_dense_vector',
    query_vector: [...]
  },
  filter: { term: { tier: 'higher' } }  // Applied AFTER vector search
}

// ✅ FAST: Filter during kNN (50% faster)
{
  knn: {
    field: 'lesson_dense_vector',
    query_vector: [...],
    filter: { term: { tier: 'higher' } }  // Applied DURING vector search
  }
}
```

### Semantic Query Rules

**Examples**:

- Query pattern: "pythagoras" → Add filter `{ tier: 'higher' }` (KS4 only)
- Query pattern: "fractions" + "ks4" → Boost `tier: foundation`
- Query pattern contains exam board → Filter by that board

### Success Criteria

- [ ] Cohere ReRank integrated and tested
- [ ] Filtered kNN implementation with performance benchmarks
- [ ] 5+ semantic query rules defined
- [ ] MRR improves by 10-25% on top-10 results
- [ ] Filtered searches 50% faster
- [ ] 2 ADRs written
- [ ] 2 docs created

---

## Phase 1C: Maths KS4 Ingestion

### Goal

Ingest complete Maths KS4 content with all Phase 1A+1B enhancements.

### Prerequisites

- [ ] OpenAI API key configured in `.env.local`
- [ ] Cohere API key configured
- [ ] All field definitions in SDK
- [ ] `pnpm type-gen` completed
- [ ] All extraction functions tested
- [ ] All quality gates passing

### Ingestion Command

```bash
cd apps/oak-open-curriculum-semantic-search

# Check prerequisites
pnpm es:status

# Ingest Maths KS4 with dense vectors
OPENAI_API_KEY=your_openai_api_key_here
  --subject maths \
  --keystage ks4 \
  --verbose
```

### Expected Results

- ~50-100 lessons with 29 fields each
- ~15-25 units with 24 fields
- ~15-25 unit rollups with 28 fields
- ~2-4 sequences with 20 fields
- ~1 sequence facet with 18 fields
- **Time**: 15-25 minutes (OpenAI embedding generation adds time)
- **API cost**: ~$2 (OpenAI embeddings)
- **Oak API cost**: 100-200 requests

### Validation

```bash
# Check document counts
pnpm es:status

# Verify dense vectors populated
# Query ES directly to check lesson_dense_vector field exists and has 1536 dimensions

# Test three-way hybrid search
# Run E2E test to verify results
```

### Success Criteria

- [ ] All 5 indexes have Maths KS4 data
- [ ] Dense vector fields populated (>80% coverage)
- [ ] Tier/exam board/pathway fields populated (>60% coverage)
- [ ] Three-way hybrid search returns better results than two-way (E2E test)
- [ ] Zero mapping errors
- [ ] All quality gates passing

---

## Phase 2A: Entity Extraction & Graph Discovery

### Goal

Extract curriculum entities from content and discover non-obvious relationships using ES Graph API.

### ES Serverless Features Integrated

1. **NER Models** - HuggingFace NER via Inference API for entity extraction
2. **Graph API** - Discover co-occurrence relationships within data
3. **Enrich Processor** - Join reference data at ingest time
4. **Significant Terms Aggregation** - Find unusual terms that characterize documents

### Entity Discovery Pipeline

Entities come from three sources:

1. **Static entities** (compile time): Subjects, key stages, years → from SDK generation
2. **Explicit entities** (ingest time): Lesson slugs, unit slugs, keywords → from API structure
3. **Discovered entities** (post-ingest): Concepts, topics, terms → from content analysis

### NER Integration

**ADR-076: NER Entity Extraction**

````typescript
/**
 * Extracts named entities from lesson transcript using HuggingFace NER model.
 *
 * @see ADR-076 - NER Entity Extraction
 *
 * @example
 * ```typescript
 * const entities = await extractEntities(esClient, transcript);
 * // [{ text: 'Pythagoras', type: 'CONCEPT', confidence: 0.95 }, ...]
 * ```
 */
export async function extractEntities(esClient: Client, text: string): Promise<Entity[]> {
  const response = await esClient.inference.inference({
    inference_id: 'huggingface-ner',
    input: text,
  });

  return parseNerResponse(response)
    .filter((entity) => entity.confidence > 0.7)
    .map((entity) => ({
      text: entity.word,
      type: entity.entity_group,
      confidence: entity.score,
    }));
}
````

### Graph API Discovery

**ADR-077: Graph API for Curriculum Relationships**

````typescript
/**
 * Discovers concept relationships using ES Graph API.
 *
 * Finds co-occurring concepts within Maths KS4 lessons.
 *
 * @see ADR-077 - Graph API for Curriculum Relationships
 *
 * @example
 * ```typescript
 * const graph = await discoverConceptGraph(esClient, {
 *   startConcept: 'pythagoras',
 *   depth: 2,
 * });
 * // { nodes: [...], edges: [...] }
 * ```
 */
export async function discoverConceptGraph(
  esClient: Client,
  params: { startConcept: string; depth: number },
): Promise<ConceptGraph> {
  const response = await esClient.graph.explore({
    index: 'oak_lessons',
    query: {
      match: { entities: params.startConcept },
    },
    controls: {
      sample_size: 100,
    },
    connections: {
      vertices: [
        {
          field: 'entities',
          size: 10,
          min_doc_count: 3,
        },
      ],
    },
    vertices: [
      {
        field: 'entities',
        include: [params.startConcept],
      },
    ],
  });

  return buildGraphFromResponse(response);
}
````

### Enrich Processor

**ADR-078: Enrich Processor for Reference Data**

At ingest time, join subject metadata from `oak_ref_subjects`:

```typescript
PUT _ingest/pipeline/enrich-lesson-metadata
{
  "processors": [
    {
      "enrich": {
        "policy_name": "subject-metadata-policy",
        "field": "subject_slug",
        "target_field": "subject_metadata",
        "max_matches": "1"
      }
    }
  ]
}
```

### New Fields for Entity Storage

```typescript
// Add to LESSONS_INDEX_FIELDS
{ name: 'entities', zodType: 'string-array', optional: true },  // Extracted entities
{ name: 'entity_types', zodType: 'string-array', optional: true },  // CONCEPT, PERSON, etc.
{ name: 'significant_terms', zodType: 'string-array', optional: true },  // Unusual terms
{ name: 'related_concepts', zodType: 'string-array', optional: true },  // From Graph API
```

### Implementation Steps

1. Register HuggingFace NER inference endpoint
2. Extract entities from transcripts during ingestion
3. Store entities in new fields
4. Run Graph API exploration to discover relationships
5. Store discovered relationships
6. Create enrich processor for reference data

### Success Criteria

- [ ] NER model integrated and tested
- [ ] Entities extracted from >80% of Maths KS4 lessons
- [ ] Graph API discovers >20 concept relationships
- [ ] Enrich processor joins subject metadata
- [ ] Concept-based search working (query by entity)
- [ ] 3 ADRs written
- [ ] 3 docs created

---

## Phase 2B: Reference Indices & Thread Support

### Goal

Create searchable reference indices for subjects, key stages, years, and Maths-specific topics/threads.

### New Indices

1. **`oak_ref_subjects`** - Subject metadata with lesson counts
2. **`oak_ref_key_stages`** - Key stage metadata
3. **`oak_ref_years`** - Year group metadata
4. **`oak_maths_topics`** - Maths topic taxonomy (KS4-specific)
5. **`oak_threads`** - Curriculum threads (Number, Algebra, Geometry, etc.)

### Thread Support for Maths KS4

Maths threads:

- Number
- Algebra
- Geometry and Measures
- Statistics and Probability
- Ratio and Proportion

#### Update Lessons/Units with Thread Associations

```typescript
// Add to LESSONS_INDEX_FIELDS
{ name: 'threads', zodType: 'string-array', optional: true },

// Extraction function
export function extractThreads(lessonData: LessonData): string[] {
  // Extract from lesson.tags or lesson.threads field
  return lessonData.threads?.map(t => t.slug) ?? [];
}
```

### Reference Index Schemas

#### `oak_ref_subjects`

```typescript
{
  subject_slug: 'maths',
  display_name: 'Mathematics',
  key_stages: ['ks1', 'ks2', 'ks3', 'ks4'],
  lesson_count: 450,
  unit_count: 80,
  description: 'Mathematics curriculum content...',
}
```

#### `oak_threads`

```typescript
{
  thread_slug: 'number',
  display_name: 'Number',
  subject: 'maths',
  description: 'Place value, operations, fractions, decimals...',
  lesson_count: 120,
  typical_year_groups: ['7', '8', '9', '10', '11'],
}
```

### Population Strategy

1. Generate reference data at type-gen time from SDK enums
2. Augment with counts via aggregation queries against main indices
3. Ingest into reference indices

### ADR to Create

**ADR-079: Reference Indices for Enum Data**

- Decision: Create separate indices for reference data
- Rationale: Enable autocomplete, faceting, and enrichment
- Alternatives: Hardcode in UI (less flexible, no search)

### Success Criteria

- [ ] 5 reference indices created with mappings
- [ ] Reference data populated
- [ ] Thread support added to lessons/units
- [ ] Thread-based search working
- [ ] Autocomplete for subjects/threads/topics
- [ ] 1 ADR written
- [ ] 2 docs created

---

## Phase 3: RAG Infrastructure

### Goal

Build production-ready RAG capabilities using ES Playground, chunked transcripts, and ontology grounding.

### ES Serverless Features Integrated

1. **ES Playground** - Low-code RAG prototyping UI
2. **`semantic_text` Field** - Auto-chunking with embeddings
3. **LLM Chat Completion** - GPT-4 integration via Inference API
4. **Multi-Retriever Queries** - Combine multiple search strategies

### Chunked Transcripts

Instead of storing full transcript as one field, chunk it:

```typescript
// Add new field
{ name: 'transcript_chunks', zodType: 'semantic_text', optional: true },

// ES field override
transcript_chunks: {
  type: 'semantic_text',
  inference_id: 'openai-text-embedding-3-small',
  model_settings: {
    task_type: 'text_embedding',
  },
}
```

Elasticsearch automatically:

- Chunks the text into ~250-word segments
- Generates embeddings for each chunk
- Stores chunks with embeddings

At query time:

- Search finds relevant chunks
- RAG injects chunks into LLM context

### ES Playground Setup

1. Navigate to Kibana → Search → Playground
2. Create retriever configuration:
   - Index: `oak_lessons`
   - Retrieval: Three-way hybrid RRF
   - Text field: `transcript_chunks`
3. Test queries and iterate on prompt templates

### LLM Integration

````typescript
/**
 * Executes RAG query with GPT-4.
 *
 * @see ADR-080 - ES Playground RAG Integration
 *
 * @example
 * ```typescript
 * const answer = await ragQuery(esClient, {
 *   query: 'How do I teach Pythagoras to struggling students?',
 *   conversationId: 'user-123',
 * });
 * ```
 */
export async function ragQuery(
  esClient: Client,
  params: { query: string; conversationId: string },
): Promise<RagResponse> {
  // 1. Retrieve relevant chunks
  const chunks = await threeWayHybridSearch(esClient, {
    index: 'oak_lessons',
    query: params.query,
    size: 5,
  });

  // 2. Build context from chunks
  const context = chunks.hits.map((hit) => hit._source.transcript_chunks).join('\n\n');

  // 3. Call GPT-4 with context
  const response = await esClient.inference.inference({
    inference_id: 'openai-gpt-4',
    input: {
      messages: [
        {
          role: 'system',
          content: 'You are an expert teaching assistant...',
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${params.query}`,
        },
      ],
    },
  });

  return {
    answer: response.choices[0].message.content,
    sources: chunks.hits.map((hit) => ({
      title: hit._source.title,
      url: hit._source.canonical_url,
    })),
  };
}
````

### Ontology Grounding

Create `oak_ontology` index for domain knowledge:

```typescript
{
  concept_id: 'pythagoras-theorem',
  display_name: 'Pythagoras\' Theorem',
  definition: 'In a right-angled triangle, a² + b² = c²...',
  key_stage: 'ks4',
  tier: 'higher',
  common_misconceptions: [
    'Students apply it to non-right-angled triangles',
    'Confusion about which side is the hypotenuse',
  ],
  teaching_tips: [
    'Use visual proofs with squares',
    'Practice identifying the hypotenuse',
  ],
}
```

At RAG time, enrich context with ontology snippets.

### ADRs to Create

1. **ADR-080: ES Playground RAG Integration**
   - Decision: Use ES Playground for RAG prototyping
   - Rationale: 10x faster iteration, low-code, built-in monitoring

2. **ADR-081: Chunked Transcript Storage**
   - Decision: Use `semantic_text` field for transcripts
   - Rationale: Auto-chunking, per-chunk embeddings, better RAG context
   - Tradeoffs: Larger index size (~30% increase)

### Success Criteria

- [ ] `semantic_text` field added for transcripts
- [ ] Transcripts chunked and re-ingested
- [ ] ES Playground configured with Maths KS4 retriever
- [ ] RAG query endpoint implemented
- [ ] `oak_ontology` index created and populated (Maths KS4 concepts)
- [ ] RAG responses grounded with ontology
- [ ] 2 ADRs written
- [ ] 3 docs created

---

## Phase 4: Knowledge Graph

### Goal

Build explicit knowledge graph with triples, entity resolution, and multi-hop reasoning.

### ES Serverless Features Integrated

1. **Triple Store Index** - Store subject-predicate-object triples
2. **Entity Resolution** - Deduplicate and link entities across lessons
3. **Graph Traversal** - Multi-hop relationship queries

### Triple Store Schema

**Index**: `oak_curriculum_graph`

```typescript
{
  subject: 'lesson:maths-ks4-pythagoras',
  predicate: 'prerequisite_of',
  object: 'lesson:maths-ks4-trigonometry',
  confidence: 1.0,
  source: 'explicit',  // or 'inferred'
}
```

### Entity Resolution

Merge extracted entities:

```text
'pythagoras' (from lesson A)
'Pythagoras theorem' (from lesson B)
'Pythagoras\' Theorem' (from lesson C)
  ↓
  Canonical: 'pythagoras-theorem'
```

```typescript
/**
 * Resolves entity mentions to canonical entity IDs.
 *
 * @see ADR-082 - Entity Resolution Strategy
 */
export async function resolveEntity(
  esClient: Client,
  mention: string,
): Promise<string | undefined> {
  // 1. Normalize mention (lowercase, remove punctuation)
  const normalized = normalizeMention(mention);

  // 2. Search oak_entities for matches
  const matches = await esClient.search({
    index: 'oak_entities',
    query: {
      bool: {
        should: [{ term: { canonical_name: normalized } }, { match: { aliases: mention } }],
      },
    },
  });

  // 3. Return canonical ID if confident match
  if (matches.hits.hits[0]?._score > 0.8) {
    return matches.hits.hits[0]._source.entity_id;
  }

  return undefined;
}
```

### Multi-Hop Reasoning

````typescript
/**
 * Finds learning pathway from concept A to concept B.
 *
 * @see ADR-083 - Knowledge Graph Multi-Hop Queries
 *
 * @example
 * ```typescript
 * const path = await findLearningPath(esClient, {
 *   from: 'fractions',
 *   to: 'calculus',
 *   maxHops: 3,
 * });
 * // ['fractions', 'algebra', 'functions', 'calculus']
 * ```
 */
export async function findLearningPath(
  esClient: Client,
  params: { from: string; to: string; maxHops: number },
): Promise<string[]> {
  // Use Graph API with hop controls
  const response = await esClient.graph.explore({
    index: 'oak_curriculum_graph',
    query: {
      term: { subject: params.from },
    },
    controls: {
      max_depth: params.maxHops,
      sample_size: 100,
    },
    connections: {
      vertices: [
        {
          field: 'object',
          size: 10,
        },
      ],
    },
  });

  return extractShortestPath(response, params.from, params.to);
}
````

### Triple Extraction

Generate triples from:

1. **Explicit relationships** (API data):
   - `lesson -> part_of -> unit`
   - `unit -> part_of -> sequence`
   - `lesson -> covers_topic -> topic`
   - `lesson -> has_prerequisite -> lesson`

2. **Inferred relationships** (Graph API):
   - `concept -> co_occurs_with -> concept`
   - `topic -> related_to -> topic`

3. **Ontology relationships** (static):
   - `concept -> is_a -> concept_type`
   - `key_stage -> contains -> key_stage`

### ADRs to Create

1. **ADR-082: Entity Resolution Strategy**
   - Decision: Canonical entity index with aliases
   - Rationale: Deduplicate, enable precise matching

2. **ADR-083: Knowledge Graph Multi-Hop Queries**
   - Decision: Use Graph API for traversal
   - Rationale: Native ES support, efficient

### Success Criteria

- [ ] `oak_curriculum_graph` index created
- [ ] Triples extracted and ingested
- [ ] Entity resolution working (>90% precision)
- [ ] Multi-hop queries implemented
- [ ] Learning pathway discovery working
- [ ] 2 ADRs written
- [ ] 2 docs created

---

## Phase 5: Advanced Features

### Goal

Add Learning to Rank foundations, multi-vector fields, and runtime field optimizations.

### ES Serverless Features Integrated

1. **Learning to Rank (LTR) Foundations** - Click-through data collection
2. **Multi-Vector Fields** - Store multiple embeddings per document
3. **Runtime Fields** - Computed fields at query time
4. **Scripted Similarity** - Custom scoring functions

### LTR Foundations

#### Click-Through Data Collection

**Index**: `oak_search_events`

```typescript
{
  session_id: 'uuid',
  query: 'pythagoras theorem',
  timestamp: '2025-12-10T10:30:00Z',
  results_shown: ['lesson-1', 'lesson-2', 'lesson-3'],
  clicked: 'lesson-2',
  position: 1,  // 0-indexed
  dwell_time_seconds: 45,
}
```

#### Feature Extraction for LTR Model

```typescript
/**
 * Extracts features for Learning to Rank model training.
 *
 * @see ADR-084 - Learning to Rank Foundations
 */
export function extractLtrFeatures(query: string, document: LessonDocument): LtrFeatures {
  return {
    // Query-document features
    title_match_score: computeBm25(query, document.title),
    elser_score: document._score, // From ELSER
    dense_score: computeCosineSimilarity(queryVector, document.lesson_dense_vector),

    // Document features
    tier: document.tier === 'higher' ? 1 : 0,
    has_video: document.resource_types?.includes('video') ? 1 : 0,
    estimated_duration: document.estimated_duration_minutes ?? 0,

    // Context features
    query_length: query.split(' ').length,
    has_exam_board: document.exam_board ? 1 : 0,
  };
}
```

Later (Phase 6+), train XGBoost model on click data and deploy as ES script.

### Multi-Vector Fields

Store multiple embeddings per lesson:

```typescript
// Add to LESSONS_INDEX_FIELDS
{ name: 'multi_vectors', zodType: 'array-array-number', optional: true },

// ES override
multi_vectors: {
  type: 'dense_vector',
  dims: 384,
  index: true,
  similarity: 'cosine',
  element_type: 'float',
}

// Store title, summary, key points as separate vectors
multi_vectors: [
  [...],  // title embedding
  [...],  // summary embedding
  [...],  // key points embedding
]
```

Query against multi-vector:

```typescript
{
  knn: {
    field: 'multi_vectors',
    query_vector: [...],
    k: 50,
  }
}
```

ES automatically finds best matching vector per document.

### Runtime Fields

Compute derived fields at query time:

```typescript
// Add runtime field to query
{
  runtime_mappings: {
    relevance_score: {
      type: 'double',
      script: {
        source: `
          double elser = doc['_score'].value;
          double hasTier = doc['tier'].size() > 0 ? 1.2 : 1.0;
          double hasVideo = doc['resource_types'].contains('video') ? 1.1 : 1.0;
          return elser * hasTier * hasVideo;
        `,
      },
    },
  },
  sort: [
    { relevance_score: 'desc' },
  ],
}
```

### ADRs to Create

1. **ADR-084: Learning to Rank Foundations**
   - Decision: Collect click-through data now, train model later
   - Rationale: Need 1000+ events before training viable

2. **ADR-085: Multi-Vector and Runtime Fields**
   - Decision: Use multi-vector for aspect-based retrieval
   - Rationale: Match on title OR summary OR key points

### Success Criteria

- [ ] `oak_search_events` index created
- [ ] Click-through tracking implemented
- [ ] Multi-vector fields added (optional, for experimentation)
- [ ] Runtime field examples documented
- [ ] 2 ADRs written
- [ ] 2 docs created

---

## Quality Gates (ALL Phases)

After each phase, run ALL quality gates one at a time:

```bash
# From repo root
pnpm type-gen        # Generate artifacts
pnpm build           # Compile
pnpm type-check      # Zero type errors
pnpm lint:fix        # Zero lint violations
pnpm format:root     # Code formatting
pnpm markdownlint:root  # Doc formatting
pnpm test            # Unit + integration (1,310+ tests must pass)
pnpm test:e2e        # E2E in dev mode
pnpm test:e2e:built  # E2E with built code
```

**NO EXCEPTIONS. All gates must be green before proceeding.**

---

## Success Metrics

### Technical

- [ ] 23 new ES features integrated
- [ ] 15 ADRs written (071-085)
- [ ] 135+ new tests passing
- [ ] 17 new docs created
- [ ] Zero type shortcuts
- [ ] All quality gates passing

### Search Quality

- [ ] Mean Reciprocal Rank (MRR): 0.65 → 0.80 (+23%)
- [ ] NDCG@10: 0.70 → 0.85 (+21%)
- [ ] Zero-hit rate: 15% → <5%
- [ ] p95 latency: <300ms

### Business

- [ ] Impressive stakeholder demo ready
- [ ] Production-ready code
- [ ] Scalable to full curriculum
- [ ] <$100/month operational cost (excluding GPT-4 RAG)

---

## Cost Estimates

### One-Time (Maths KS4 Ingestion)

- OpenAI embeddings: ~$2 (1536-dim, ~100 lessons)
- NER extraction: ~$1 (HuggingFace Inference API)
- **Total**: ~$3

### Ongoing (Monthly, Full Curriculum)

- OpenAI embeddings: ~$40 (new content, ~1,000 lessons/month)
- Cohere ReRank: ~$200 (20,000 queries, top-10 rerank)
- NER models: ~$20 (incremental)
- GPT-4 RAG: ~$1,000 (20,000 queries, 5 chunks per query)
- **Total**: ~$1,260/month

**Cost Mitigation**:

- Caching (reduce rerank calls by 60%)
- Batch processing (reduce embedding costs)
- Feature flags (disable expensive features for low-value queries)
- Staged rollout (Phase 3 RAG is optional)

---

## Risk Mitigation

### High Risk

1. **OpenAI API Dependency**
   - **Mitigation**: Graceful degradation to two-way hybrid, caching, fallback embeddings

2. **Cost Escalation**
   - **Mitigation**: Budget alerts, rate limiting, usage monitoring, feature flags

3. **Latency Regression**
   - **Mitigation**: Two-stage retrieval (fast first-pass, slow rerank on top-K), performance testing

### Medium Risk

4. **Entity Extraction Accuracy**
   - **Mitigation**: Confidence thresholds (>0.7), manual validation for Maths KS4

5. **Complexity Burden**
   - **Mitigation**: Comprehensive docs, ADRs, TDD, regular code reviews

---

## Implementation Checklist

### Phase 1A (2-3 days)

- [ ] Re-read foundation documents
- [ ] Add field definitions to SDK
- [ ] Run `pnpm type-gen`
- [ ] Write unit tests for extraction functions (RED)
- [ ] Implement extraction functions (GREEN)
- [ ] Write integration tests for document transforms (RED)
- [ ] Update document transforms (GREEN)
- [ ] Write E2E test for three-way hybrid (RED)
- [ ] Implement three-way RRF query (GREEN)
- [ ] Run all quality gates
- [ ] Write ADR-071, ADR-072, ADR-073
- [ ] Create 3 docs with examples
- [ ] Update semantic-search.prompt.md

### Phase 1B (2-3 days)

- [ ] Register Cohere inference endpoint
- [ ] Implement rerank function (TDD)
- [ ] Implement filtered kNN (TDD)
- [ ] Define 5+ semantic query rules
- [ ] Run performance benchmarks
- [ ] Run all quality gates
- [ ] Write ADR-074, ADR-075
- [ ] Create 2 docs

### Phase 1C (1 day)

- [ ] Configure OpenAI API key
- [ ] Configure Cohere API key
- [ ] Run ingestion: `pnpm es:ingest-live --subject maths --keystage ks4`
- [ ] Validate results
- [ ] Run E2E tests
- [ ] Document results

### Phase 2A (3-4 days)

- [ ] Register HuggingFace NER endpoint
- [ ] Add entity fields to SDK
- [ ] Run `pnpm type-gen`
- [ ] Implement entity extraction (TDD)
- [ ] Implement Graph API discovery (TDD)
- [ ] Create enrich processor
- [ ] Re-ingest with entity extraction
- [ ] Run all quality gates
- [ ] Write ADR-076, ADR-077, ADR-078
- [ ] Create 3 docs

### Phase 2B (2-3 days)

- [ ] Define reference index schemas
- [ ] Add thread fields to SDK
- [ ] Run `pnpm type-gen`
- [ ] Generate reference data
- [ ] Ingest reference indices
- [ ] Update document transforms with threads
- [ ] Test thread-based search
- [ ] Run all quality gates
- [ ] Write ADR-079
- [ ] Create 2 docs

### Phase 3 (4-5 days)

- [ ] Add `semantic_text` field to SDK
- [ ] Run `pnpm type-gen`
- [ ] Re-ingest with chunked transcripts
- [ ] Configure ES Playground
- [ ] Test RAG queries in Playground
- [ ] Implement RAG endpoint (TDD)
- [ ] Create `oak_ontology` index
- [ ] Populate ontology (Maths KS4 concepts)
- [ ] Integrate ontology grounding
- [ ] Run all quality gates
- [ ] Write ADR-080, ADR-081
- [ ] Create 3 docs

### Phase 4 (5-6 days)

- [ ] Define triple store schema
- [ ] Create `oak_curriculum_graph` index
- [ ] Extract triples from API data
- [ ] Extract triples from Graph API
- [ ] Ingest triples
- [ ] Implement entity resolution (TDD)
- [ ] Implement multi-hop queries (TDD)
- [ ] Test learning pathway discovery
- [ ] Run all quality gates
- [ ] Write ADR-082, ADR-083
- [ ] Create 2 docs

### Phase 5 (3-4 days)

- [ ] Create `oak_search_events` index
- [ ] Implement click-through tracking (TDD)
- [ ] Add multi-vector fields (optional)
- [ ] Document runtime field patterns
- [ ] Run all quality gates
- [ ] Write ADR-084, ADR-085
- [ ] Create 2 docs

---

## Demo Scenarios

### Technical Validation Scenarios

After implementation, validate these technical scenarios work:

#### 1. Three-Way Hybrid Search

**Query**: "How do I teach Pythagoras theorem to struggling students?"

**Expected**:

- Dense vector captures semantic intent ("teach", "struggling")
- ELSER captures Maths domain ("Pythagoras", "theorem")
- BM25 captures exact phrase matches
- Results include Foundation tier lessons, teaching tips, misconceptions

#### 2. Tier-Filtered kNN

**Query**: "trigonometry" + Filter: `{ tier: 'higher' }`

**Expected**:

- Vector search applies filter DURING search (not post-filter)
- Results are 50% faster than unfiltered search
- Only Higher tier lessons returned

#### 3. Cohere Rerank

**Query**: "solving quadratic equations"

**Expected**:

- Three-way hybrid returns 50 results
- Rerank reorders top-10 for better relevance
- MRR improves by 10-25%

#### 4. Entity-Based Discovery

**Query**: "pythagoras"

**Expected**:

- NER identifies "Pythagoras' Theorem" entity
- Graph API discovers related concepts: "right-angled triangles", "trigonometry"
- Results include lessons covering related concepts

#### 5. Thread-Based Navigation

**Filter**: `{ threads: ['geometry'] }`

**Expected**:

- Returns all Geometry lessons in Maths KS4
- Facets show other available threads
- Can refine by tier within thread

#### 6. RAG Query

**Query**: "What are common misconceptions about fractions in Year 10?"

**Expected**:

- Retrieves relevant transcript chunks
- Ontology provides domain context
- GPT-4 generates answer with sources
- Response cites specific lessons

#### 7. Learning Pathway

**Query**: Find pathway from "fractions" to "calculus"

**Expected**:

- Knowledge graph traversal finds intermediate concepts
- Returns: fractions → algebra → functions → differentiation
- Each step links to relevant lessons

### User-Focused Demo Scenarios (Stakeholder Presentation)

These scenarios demonstrate the system from a teacher's perspective for stakeholder demos:

#### Scenario 1: Teacher Looking for Trigonometry Lessons

**User Story**: "I'm teaching Foundation tier and need trigonometry lessons"

**Query**: "trigonometry foundation tier"

**Experience**:

1. Structured search returns relevant lessons
2. Facets show Foundation/Higher split
3. Thread filter shows "Geometry" thread
4. Results display:
   - Foundation tier trig lessons with clear tier badges
   - Related units showing progression
   - Sequence context (where in pathway)
5. Click lesson → see full metadata, transcript, resources
6. "More like this" suggests related geometry topics

**Value Demonstrated**: Precise filtering, semantic understanding, contextual navigation

#### Scenario 2: Finding Prerequisite Knowledge

**User Story**: "I need to know what students should learn before Pythagoras"

**Query**: "What do students need to know before Pythagoras?"

**Experience**:

1. Natural language search understands intent
2. Ontology provides "Pythagoras theorem" definition
3. Knowledge graph shows prerequisites:
   - Right-angled triangles
   - Square numbers
   - Square roots
4. Returns lessons covering each prerequisite
5. Shows progression path through concepts
6. Suggests assessment resources for prerequisite knowledge

**Value Demonstrated**: RAG capabilities, knowledge graph, prerequisite mapping, AI-powered understanding

#### Scenario 3: Planning a Unit on Algebra

**User Story**: "I'm planning a unit on factorisation for Higher tier"

**Query**: "algebra factorisation higher tier"

**Experience**:

1. Search returns:
   - Relevant units with factorisation focus
   - Individual lessons in logical sequence
   - Full sequences showing broader context
2. Thread view shows "Algebra" thread
3. Topic hierarchy shows factorisation subtopics (single brackets, quadratics, difference of squares)
4. Results include:
   - Common misconceptions (e.g., sign errors)
   - Teacher tips for each lesson
   - Prerequisite topics (expanding brackets)
5. "More like this" suggests related algebra topics (solving equations, completing the square)
6. Can export lesson sequence for planning

**Value Demonstrated**: Multi-index search, thread navigation, pedagogical metadata, comprehensive planning support

#### Scenario 4: Exploring Mathematical Concepts

**User Story**: "I want to understand how simultaneous equations are taught across tiers"

**Query**: "simultaneous equations"

**Experience**:

1. Ontology provides concept definition
2. Shows coverage in Foundation vs Higher:
   - Foundation: Graphical and substitution methods
   - Higher: Elimination, more complex systems
3. Lists all lessons/units covering this concept
4. Shows prerequisite concepts (solving linear equations, coordinates)
5. Suggests related topics (e.g., substitution, elimination, matrices)
6. Links to actual lesson content with transcripts
7. Displays common misconceptions across tiers

**Value Demonstrated**: Cross-tier analysis, ontology integration, comprehensive concept coverage, differentiation support

---

## Supporting Documents

### Implementation Guides

- `.agent/prompts/semantic-search/semantic-search.prompt.md` - TDD examples and quick start for Phase 1A

### Reference

- `data-completeness-policy.md` - What data we upload in full vs summarize
- `es-serverless-feature-matrix.md` - Feature adoption tracking matrix

### Foundation Documents (Re-read Regularly)

- `.agent/directives-and-memory/rules.md`
- `.agent/directives-and-memory/schema-first-execution.md`
- `.agent/directives-and-memory/testing-strategy.md`

---

## Conclusion

This plan transforms the Maths KS4 vertical slice into a **comprehensive showcase of Elasticsearch Serverless capabilities**. By integrating 23 additional ES features while maintaining strict adherence to foundation documents, we create:

1. **Technical Excellence** - TDD, schema-first, zero shortcuts
2. **Production Quality** - Comprehensive docs, ADRs, tests
3. **Impressive Demo** - Cutting-edge search capabilities
4. **Scalable Foundation** - Patterns applicable to full curriculum

**The plan is ambitious but achievable** with disciplined execution and regular foundation document review.

---

**Ready to begin Phase 1A when you are.**

See `.agent/prompts/semantic-search/semantic-search.prompt.md` for practical TDD examples and quick start guidance.

---

**End of Plan**
