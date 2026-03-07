# Maths KS4 Vertical Slice: Complete ES Serverless Feature Integration

**Date**: 2025-12-08  
**Status**: ACTIVE - Enhanced Strategic Plan  
**Priority**: HIGH  
**Foundation Alignment**: ✅ principles.md | schema-first-execution.md | testing-strategy.md

---

## Executive Summary

This plan integrates **ALL high-impact Elasticsearch Serverless features** into the Maths KS4 vertical slice to create a deeply impressive demonstration of cutting-edge search capabilities. We will showcase:

- **Three-way hybrid search**: BM25 + ELSER sparse + dense vectors via Inference API
- **AI-powered relevance**: Cohere ReRank, NER entity extraction, LLM query understanding
- **Knowledge graph integration**: ES Graph API for curriculum relationships
- **Advanced retrieval**: Filtered kNN, enrich processors, semantic query rules
- **RAG infrastructure**: ES Playground prototyping, chunked transcripts, ontology grounding
- **Learning to Rank foundations**: Click-through data collection for personalized relevance

**Strategic Goal**: Create a production-ready demo that proves ES Serverless as the **definitive platform** for intelligent curriculum search.

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
2. **Authored documentation** in `apps/oak-search-cli/docs/`
3. **ADR creation** for architectural decisions (see ADR checklist per phase)
4. **Update semantic-search.prompt.md** with new capabilities
5. **typedoc-compatible** documentation for public APIs

---

## Phase Structure Overview

| Phase  | Focus                         | Duration | Key ES Features                                  | ADRs Required |
| ------ | ----------------------------- | -------- | ------------------------------------------------ | ------------- |
| **1A** | Hybrid Fields + Dense Vectors | 2-3 days | Inference API, dense_vector, three-way hybrid    | 3 ADRs        |
| **1B** | Relevance Enhancement         | 2-3 days | Cohere ReRank, filtered kNN, query rules         | 2 ADRs        |
| **1C** | Core Ingestion                | 1 day    | Maths KS4 with enhanced schema                   | -             |
| **2A** | Entity Extraction & Graph     | 3-4 days | NER models, Graph API, enrich processor          | 3 ADRs        |
| **2B** | Thread & Reference Indices    | 2-3 days | `oak_threads`, reference data enrichment         | 1 ADR         |
| **3**  | RAG Infrastructure            | 4-5 days | ES Playground, chunked transcripts, ontology     | 2 ADRs        |
| **4**  | Knowledge Graph               | 5-6 days | Triple store, entity resolution, graph traversal | 2 ADRs        |
| **5**  | Advanced Features             | 3-4 days | LTR foundations, multi-vector, runtime fields    | 2 ADRs        |

**Total Estimated Time**: 4-5 weeks for complete vertical slice

---

## Phase 1A: Three-Way Hybrid Search with Dense Vectors

### Goal

Implement cutting-edge hybrid search combining BM25 + ELSER sparse + OpenAI dense vectors with Reciprocal Rank Fusion.

### ES Serverless Features Integrated

1. **Inference API** - Direct OpenAI/Cohere/HuggingFace integration
2. **Dense Vector Fields** - `dense_vector` type with HNSW indexing
3. **Three-Way RRF** - Fuse lexical + sparse + dense results
4. **Query Vector Builder** - Dynamic embedding generation at query time

### Field Additions (Schema-First)

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts`

```typescript
// LESSONS_INDEX_FIELDS additions
{ name: 'lesson_dense_vector', zodType: 'array-number', optional: true },
{ name: 'title_dense_vector', zodType: 'array-number', optional: true },

// UNIT_ROLLUP_INDEX_FIELDS additions
{ name: 'unit_dense_vector', zodType: 'array-number', optional: true },
```

**ES Field Overrides** (`es-field-overrides.ts`):

```typescript
lesson_dense_vector: {
  type: 'dense_vector',
  dims: 1536,  // OpenAI text-embedding-3-small
  index: true,
  similarity: 'cosine'
},
title_dense_vector: {
  type: 'dense_vector',
  dims: 1536,
  index: true,
  similarity: 'cosine'
},
```

### Implementation Tasks (TDD)

#### 1. Configure Inference Endpoints (RED → GREEN)

**Test**: `inference-endpoints.integration.test.ts`

```typescript
describe('OpenAI Inference Endpoint', () => {
  it('should register text-embedding-3-small endpoint', async () => {
    const result = await registerOpenAIInferenceEndpoint({
      endpointId: 'openai-text-embedding-3-small',
      apiKey: 'mock-key',
      model: 'text-embedding-3-small',
    });
    expect(result.success).toBe(true);
  });

  it('should generate embeddings for text', async () => {
    const embedding = await generateEmbedding({
      endpointId: 'openai-text-embedding-3-small',
      text: 'How do I teach fractions to Year 4 students?',
    });
    expect(embedding).toHaveLength(1536);
    expect(embedding[0]).toBeCloseTo(0.01, 2);
  });
});
```

**Implementation**: `src/lib/elasticsearch/inference/openai-endpoints.ts`

````typescript
/**
 * Registers OpenAI inference endpoint in Elasticsearch.
 *
 * @see ADR-071 - OpenAI Inference API Integration
 * @example
 * ```typescript
 * const result = await registerOpenAIInferenceEndpoint({
 *   endpointId: 'openai-embeddings',
 *   apiKey: process.env.OPENAI_API_KEY,
 *   model: 'text-embedding-3-small',
 * });
 * ```
 */
export async function registerOpenAIInferenceEndpoint(
  config: OpenAIEndpointConfig,
): Promise<Result<InferenceEndpoint, InferenceError>> {
  // Implementation follows TDD
}
````

#### 2. Add Dense Vector Extraction (Unit Tests FIRST)

**Test**: `dense-vector-extraction.unit.test.ts`

```typescript
describe('extractDenseVector', () => {
  it('should call inference API with lesson text', async () => {
    const mockInference = vi.fn().mockResolvedValue([0.1, 0.2 /* ... */]);
    const vector = await extractDenseVector('Lesson about fractions', mockInference);
    expect(mockInference).toHaveBeenCalledWith('Lesson about fractions');
    expect(vector).toHaveLength(1536);
  });

  it('should handle inference API errors gracefully', async () => {
    const mockInference = vi.fn().mockRejectedValue(new Error('API error'));
    const result = await extractDenseVector('text', mockInference);
    expect(result).toBeUndefined(); // Field remains optional
  });
});
```

#### 3. Update Document Transforms (Integration Tests)

**Test**: `document-transforms-dense-vectors.integration.test.ts`

```typescript
describe('createLessonDocument with dense vectors', () => {
  it('should include dense vectors when inference available', async () => {
    const mockInferenceClient = {
      generateEmbedding: vi.fn().mockResolvedValue(new Array(1536).fill(0.1)),
    };

    const doc = await createLessonDocument({
      lesson: { lessonSlug: 'test', lessonTitle: 'Fractions' },
      transcript: 'Full transcript...',
      summary: mockSummary,
      inferenceClient: mockInferenceClient,
      // ... other params
    });

    expect(doc.lesson_dense_vector).toHaveLength(1536);
    expect(doc.title_dense_vector).toHaveLength(1536);
  });
});
```

#### 4. Implement Three-Way Hybrid Query (E2E Test FIRST)

**Test**: `three-way-hybrid-search.e2e.test.ts`

```typescript
describe('Three-Way Hybrid Search E2E', () => {
  it('should fuse BM25 + ELSER + dense vector results', async () => {
    const response = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({
        scope: 'lessons',
        text: 'How do I teach trigonometry to Foundation tier?',
        subject: 'maths',
        key_stage: 'ks4',
      }),
    });

    const data = await response.json();
    expect(data.results).toHaveLength(10);
    expect(data.results[0].lesson_title).toContain('trigonometry');
    // Verify it outperforms two-way hybrid in relevance
  });
});
```

**Implementation**: `src/lib/hybrid-search/three-way-rrf.ts`

````typescript
/**
 * Executes three-way hybrid search combining lexical, sparse, and dense retrieval.
 *
 * Uses Reciprocal Rank Fusion (RRF) to combine:
 * 1. BM25 lexical matching on text fields
 * 2. ELSER sparse semantic vectors
 * 3. OpenAI dense embeddings
 *
 * @see ADR-071 - Three-Way Hybrid Search Architecture
 * @see ADR-067 - ES Mappings Generation
 *
 * @example
 * ```typescript
 * const results = await executeThreeWayHybridSearch({
 *   queryText: 'fractions foundation tier',
 *   scope: 'lessons',
 *   filters: { subject: 'maths', key_stage: 'ks4' },
 *   inferenceEndpoint: 'openai-text-embedding-3-small',
 * });
 * ```
 */
export async function executeThreeWayHybridSearch(
  request: ThreeWaySearchRequest,
): Promise<SearchResponse> {
  // Implementation with proper type safety
}
````

### Quality Gates Checklist

- [ ] All unit tests pass (RED → GREEN executed)
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] `pnpm type-gen` generates correct mappings
- [ ] `pnpm build` succeeds
- [ ] `pnpm type-check` passes (no type errors)
- [ ] `pnpm lint:fix` passes
- [ ] `pnpm format:root` applied
- [ ] `pnpm markdownlint:root` passes
- [ ] TSDoc coverage 100% for new functions
- [ ] Authored docs created in `docs/INFERENCE-API.md`

### Documentation Deliverables

1. **ADR-071**: OpenAI Inference API Integration
   - Decision: Use OpenAI text-embedding-3-small via Inference API
   - Rationale: Balance cost, performance, quality
   - Alternatives considered: HuggingFace, Cohere, local models

2. **ADR-072**: Three-Way Hybrid Search Architecture
   - Decision: BM25 + ELSER + Dense with RRF
   - Rationale: Optimal relevance for curriculum search
   - Performance benchmarks: ~200ms p95 latency

3. **ADR-073**: Dense Vector Field Strategy
   - Decision: Separate vectors for title and content
   - Rationale: Aspect-based retrieval, query-dependent weighting
   - Field sizing: 1536-dim for future-proofing

4. **Authored Docs**:
   - `apps/oak-search-cli/docs/INFERENCE-API.md`
   - `apps/oak-search-cli/docs/THREE-WAY-HYBRID.md`
   - `apps/oak-search-cli/docs/DENSE-VECTORS.md`

5. **Prompt Updates**:
   - Update `.agent/prompts/semantic-search/semantic-search.prompt.md` §2.1

---

## Phase 1B: Relevance Enhancement with Reranking

### Goal

Add Cohere ReRank for 10-25% relevance improvement and implement filtered kNN for 50% faster constrained searches.

### ES Serverless Features Integrated

1. **Cohere ReRank** - Cross-encoder reranking via Inference API
2. **Filtered kNN Search** - Apply filters during vector search (not after)
3. **Semantic Query Rules** - Pattern-based query boosting

### Implementation Tasks (TDD)

#### 1. Cohere ReRank Integration (Unit Tests FIRST)

**Test**: `cohere-rerank.unit.test.ts`

```typescript
describe('rerankResults', () => {
  it('should reorder results by relevance score', async () => {
    const mockCohere = vi.fn().mockResolvedValue([
      { index: 2, relevance_score: 0.95 },
      { index: 0, relevance_score: 0.87 },
      { index: 1, relevance_score: 0.73 },
    ]);

    const reranked = await rerankResults({
      query: 'Pythagoras theorem',
      documents: [doc0, doc1, doc2],
      cohereClient: mockCohere,
    });

    expect(reranked[0]).toBe(doc2); // Highest score moved to top
    expect(reranked[1]).toBe(doc0);
  });
});
```

**Implementation**: Two-stage retrieval pattern

````typescript
/**
 * Executes two-stage retrieval: fast candidate generation → precise reranking.
 *
 * Stage 1: Three-way hybrid returns top 50 candidates (fast)
 * Stage 2: Cohere ReRank scores each candidate (slower but accurate)
 *
 * @see ADR-074 - Two-Stage Retrieval with Cohere ReRank
 *
 * @example
 * ```typescript
 * const results = await twoStageRetrievalSearch({
 *   query: 'How do I teach simultaneous equations?',
 *   candidateCount: 50,
 *   finalCount: 10,
 *   rerankModel: 'rerank-english-v3.0',
 * });
 * ```
 */
export async function twoStageRetrievalSearch(
  request: TwoStageSearchRequest,
): Promise<RerankedSearchResponse> {
  // Implementation
}
````

#### 2. Filtered kNN Optimization (Integration Test)

**Test**: `filtered-knn.integration.test.ts`

```typescript
describe('filtered kNN search', () => {
  it('should apply filters during vector search', async () => {
    const startTime = Date.now();

    const results = await executeFilteredKnnSearch({
      vector: queryEmbedding,
      k: 20,
      filters: [
        { term: { subject_slug: 'maths' } },
        { term: { key_stage: 'ks4' } },
        { term: { tier: 'foundation' } },
      ],
    });

    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(100); // ~50% faster than post-filter
    expect(results.every((r) => r.tier === 'foundation')).toBe(true);
  });
});
```

#### 3. Semantic Query Rules (E2E Test FIRST)

**Test**: `semantic-query-rules.e2e.test.ts`

```typescript
describe('Semantic Query Rules', () => {
  it('should boost higher tier for "GCSE" queries', async () => {
    const response = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({
        scope: 'lessons',
        text: 'GCSE algebra equations',
        subject: 'maths',
        key_stage: 'ks4',
      }),
    });

    const data = await response.json();
    const higherCount = data.results.filter((r) => r.tier === 'higher').length;
    expect(higherCount).toBeGreaterThan(5); // Boosted to top
  });
});
```

### Documentation Deliverables

1. **ADR-074**: Two-Stage Retrieval with Cohere ReRank
2. **ADR-075**: Filtered kNN Performance Optimization
3. **Authored Docs**:
   - `docs/RERANKING.md`
   - `docs/FILTERED-KNN.md`

---

## Phase 1C: Maths KS4 Core Ingestion

### Goal

Ingest Maths KS4 with enhanced schema (hybrid fields + dense vectors).

### Tasks

1. Run `pnpm type-gen` to generate updated mappings
2. Reset ES indexes with new schemas
3. Configure OpenAI inference endpoint in ES
4. Run ingestion with dense vector extraction
5. Verify all fields populated correctly

### Expected Results

- ~50-100 lessons with 31 fields (21 original + 8 hybrid + 2 dense vectors)
- ~15-25 units with 26 fields (16 original + 8 hybrid + 2 dense vectors)
- All quality gates passing
- Three-way hybrid search functional
- Reranking improves relevance by 10-25%

### Success Criteria

- [ ] `tier` populated for >80% of lessons
- [ ] `lesson_dense_vector` populated for >95% of lessons
- [ ] Three-way hybrid returns results <200ms p95
- [ ] Reranked results score higher in manual relevance tests
- [ ] Zero mapping errors during ingestion

---

## Phase 2A: Entity Extraction & Knowledge Graph

### Goal

Extract curriculum entities (concepts, misconceptions, topics) using NER models and build implicit knowledge graph via ES Graph API.

### ES Serverless Features Integrated

1. **NER Models via Inference API** - HuggingFace BERT NER at ingest time
2. **Graph API** - Explore co-occurrence relationships
3. **Enrich Processor** - Join reference data during indexing
4. **Significant Terms Aggregation** - Discover unusual associations

### Field Additions

```typescript
// LESSONS_INDEX_FIELDS
{ name: 'extracted_concepts', zodType: 'array-string', optional: true },
{ name: 'extracted_entities', zodType: 'array-object', optional: true },
{ name: 'difficulty_reasoning', zodType: 'string', optional: true },
```

### Implementation Tasks (TDD)

#### 1. NER Pipeline Integration (Unit Tests)

**Test**: `ner-extraction.unit.test.ts`

```typescript
describe('extractEntitiesFromTranscript', () => {
  it('should extract mathematical concepts', async () => {
    const mockNer = vi.fn().mockResolvedValue([
      { entity: 'Pythagoras', type: 'THEOREM', confidence: 0.95 },
      { entity: 'right-angled triangle', type: 'CONCEPT', confidence: 0.89 },
    ]);

    const entities = await extractEntitiesFromTranscript(
      'Pythagoras theorem applies to right-angled triangles.',
      mockNer,
    );

    expect(entities).toHaveLength(2);
    expect(entities[0].entity).toBe('Pythagoras');
  });
});
```

#### 2. Graph API Exploration (Integration Test)

**Test**: `graph-api-exploration.integration.test.ts`

```typescript
describe('Graph API - Misconception Networks', () => {
  it('should find lessons sharing common misconceptions', async () => {
    const graph = await exploreGraph({
      startingTerms: [
        { field: 'misconceptions_and_common_mistakes', term: 'denominator confusion' },
      ],
      connections: { field: 'lesson_keywords' },
      maxDepth: 2,
    });

    expect(graph.vertices).toContain('fractions');
    expect(graph.vertices).toContain('equivalent fractions');
    expect(graph.connections).toHaveLength(15);
  });
});
```

#### 3. Enrich Processor for Thread Data (E2E Test)

**Test**: `enrich-processor.e2e.test.ts`

```typescript
describe('Thread Enrichment Pipeline', () => {
  it('should add thread metadata to lessons at ingest time', async () => {
    // Create enrich policy from oak_threads index
    await createThreadEnrichmentPolicy();

    // Ingest lesson with thread_slugs
    const doc = await ingestLesson({
      lesson_slug: 'adding-fractions-y4',
      thread_slugs: ['maths-number'],
    });

    // Verify enriched data added
    const enriched = await getLesson('adding-fractions-y4');
    expect(enriched.thread_details).toBeDefined();
    expect(enriched.thread_details[0].thread_title).toBe('Number');
  });
});
```

### Documentation Deliverables

1. **ADR-076**: NER Entity Extraction Strategy
2. **ADR-077**: Graph API for Curriculum Relationships
3. **ADR-078**: Enrich Processor Architecture
4. **Authored Docs**:
   - `docs/ENTITY-EXTRACTION.md`
   - `docs/GRAPH-API.md`
   - `docs/ENRICH-PROCESSORS.md`

---

## Phase 2B: Thread & Reference Indices

### Goal

Create searchable thread and reference indices with enriched metadata.

### New Indices

1. **`oak_threads`** - Thread documents with progression and tier coverage
2. **`oak_subjects`** - Subject catalog (Maths only for now)
3. **`oak_key_stages`** - KS4 definitions
4. **`oak_years`** - Year 10, Year 11
5. **`oak_maths_topics`** - Hierarchical topic structure

### Implementation

All indices follow schema-first pattern:

1. Define fields in `field-definitions/references.ts` (NEW FILE)
2. Run `pnpm type-gen` to generate mappings
3. Implement population functions with TDD
4. Create integration tests for cross-index queries

### Documentation Deliverables

1. **ADR-079**: Reference Indices Architecture

---

## Phase 3: RAG Infrastructure with ES Playground

### Goal

Build production-ready RAG infrastructure using ES Playground for rapid prototyping and chunked transcripts for context injection.

### ES Serverless Features Integrated

1. **ES Playground** - Low-code RAG prototyping interface
2. **`semantic_text` Field** - Auto-chunking with external embeddings
3. **LLM Integration** - GPT-4 via Inference API for answer generation
4. **Multi-Retriever Queries** - Combine document and ontology retrieval

### New Index

**`oak_lesson_transcripts`** - Chunked transcripts with ~500-1000 words per chunk

```typescript
// LESSON_TRANSCRIPTS_INDEX_FIELDS
{ name: 'chunk_id', zodType: 'string', optional: false },
{ name: 'lesson_id', zodType: 'string', optional: false },
{ name: 'chunk_text', zodType: 'string', optional: false },
{ name: 'chunk_semantic_text', zodType: 'string', optional: true }, // Uses semantic_text type
{ name: 'chunk_index', zodType: 'number', optional: false },
{ name: 'chunk_dense_vector', zodType: 'array-number', optional: true },
```

### Implementation Tasks (TDD)

#### 1. Transcript Chunking Strategy (Unit Tests)

**Test**: `transcript-chunking.unit.test.ts`

```typescript
describe('chunkTranscript', () => {
  it('should create overlapping chunks of ~750 words', () => {
    const transcript = 'A very long transcript...'; // 3000 words
    const chunks = chunkTranscript(transcript, {
      targetWords: 750,
      overlapWords: 100,
    });

    expect(chunks).toHaveLength(4);
    expect(chunks[0].word_count).toBeGreaterThan(700);
    expect(chunks[0].word_count).toBeLessThan(800);
  });

  it('should preserve sentence boundaries', () => {
    const transcript = 'First sentence. Second sentence. Third sentence.';
    const chunks = chunkTranscript(transcript, { targetWords: 5 });

    // Should not split mid-sentence
    expect(chunks[0].text.endsWith('.')).toBe(true);
  });
});
```

#### 2. ES Playground RAG Configuration (Integration Test)

**Test**: `es-playground-rag.integration.test.ts`

```typescript
describe('ES Playground RAG Setup', () => {
  it('should configure retrieval + LLM pipeline', async () => {
    const config = await configurePlaygroundRAG({
      retrievalIndex: 'oak_lesson_transcripts',
      embeddingModel: 'openai-text-embedding-3-small',
      llmModel: 'gpt-4-turbo-preview',
      topK: 5,
      promptTemplate: `Use the following curriculum content to answer the question:
{context}

Question: {question}
Answer:`,
    });

    expect(config.retriever).toBeDefined();
    expect(config.llm_endpoint).toBe('openai-gpt-4');
  });
});
```

#### 3. RAG Query Execution (E2E Test FIRST)

**Test**: `rag-query.e2e.test.ts`

```typescript
describe('RAG Query Execution', () => {
  it('should answer curriculum question with grounded response', async () => {
    const response = await fetch('/api/rag/ask', {
      method: 'POST',
      body: JSON.stringify({
        question: 'What is Pythagoras theorem and when do students learn it?',
        subject: 'maths',
      }),
    });

    const data = await response.json();
    expect(data.answer).toContain('Pythagoras');
    expect(data.answer).toContain('KS4');
    expect(data.sources).toHaveLength(3);
    expect(data.sources[0].lesson_title).toBeDefined();
  });
});
```

### Documentation Deliverables

1. **ADR-080**: RAG Architecture with ES Playground
2. **ADR-081**: Transcript Chunking Strategy
3. **Authored Docs**:
   - `docs/RAG-INFRASTRUCTURE.md`
   - `docs/ES-PLAYGROUND.md`
   - `docs/CHUNKING-STRATEGY.md`

---

## Phase 4: Instance-Level Knowledge Graph

### Goal

Create explicit knowledge graph of curriculum relationships with triple store and entity resolution.

### New Indices

1. **`oak_curriculum_graph`** - Triple store (subject, relation, object)
2. **`oak_entities`** - Canonical entity records with disambiguation

### Implementation (Deferred to Phase 4 of vertical slice)

See `entity-discovery-pipeline.md` for detailed multi-step extraction process.

### Documentation Deliverables

1. **ADR-082**: Knowledge Graph Triple Store Architecture
2. **ADR-083**: Entity Resolution and Disambiguation

---

## Phase 5: Advanced Features & Learning to Rank

### Goal

Implement advanced ES features for production-ready system.

### ES Serverless Features Integrated

1. **Learning to Rank (LTR) Foundations** - Click-through data collection
2. **Multi-Vector Fields** - Separate embeddings for different aspects
3. **Runtime Fields** - Computed fields at query time
4. **Scripted Similarity** - Custom relevance scoring

### Implementation Tasks

#### 1. Click-Through Data Collection (Unit Tests)

**Test**: `click-through-tracking.unit.test.ts`

```typescript
describe('trackSearchClick', () => {
  it('should record query, rank, and clicked document', async () => {
    const event = await trackSearchClick({
      query: 'fractions foundation tier',
      resultRank: 3,
      clickedDocId: 'lesson-fractions-y4',
      userId: 'teacher-123',
    });

    expect(event.query_text).toBe('fractions foundation tier');
    expect(event.result_position).toBe(3);
  });
});
```

#### 2. Multi-Vector Aspect-Based Retrieval (Integration Test)

**Test**: `multi-vector-retrieval.integration.test.ts`

```typescript
describe('Aspect-Based Vector Search', () => {
  it('should use title vector for keyword queries', async () => {
    const results = await searchByAspect({
      query: 'Pythagoras',
      aspect: 'title', // Use title_dense_vector
      k: 10,
    });

    expect(results[0].lesson_title).toContain('Pythagoras');
  });

  it('should use content vector for concept queries', async () => {
    const results = await searchByAspect({
      query: 'teaching strategies for visual learners',
      aspect: 'content', // Use lesson_dense_vector
      k: 10,
    });

    // Matches teaching strategies in transcript, not title
    expect(results[0].transcript_text).toContain('visual');
  });
});
```

### Documentation Deliverables

1. **ADR-084**: Learning to Rank Strategy
2. **ADR-085**: Multi-Vector Aspect-Based Retrieval

---

## Quality Gate Requirements (ALL Phases)

### Pre-Implementation Checklist

- [ ] Foundation documents re-read (principles.md, schema-first, testing-strategy)
- [ ] TDD approach planned (RED → GREEN → REFACTOR)
- [ ] Unit tests written FIRST
- [ ] Integration tests planned
- [ ] E2E tests specified before implementation

### Post-Implementation Checklist (Per Phase)

- [ ] All unit tests pass (no mocks, pure functions)
- [ ] All integration tests pass (simple mocks injected)
- [ ] All E2E tests pass (running system validation)
- [ ] `pnpm type-gen` generates correct artifacts
- [ ] `pnpm build` succeeds
- [ ] `pnpm type-check` passes (zero errors)
- [ ] `pnpm lint:fix` passes (zero violations)
- [ ] `pnpm format:root` applied
- [ ] `pnpm markdownlint:root` passes
- [ ] `pnpm test` passes (all 1,310+ tests)
- [ ] `pnpm test:e2e` passes
- [ ] `pnpm test:e2e:built` passes
- [ ] TSDoc coverage 100% for new code
- [ ] Authored documentation created
- [ ] ADRs written and reviewed
- [ ] `.agent/prompts/semantic-search/semantic-search.prompt.md` updated

---

## ADR Creation Schedule

### Phase 1A (Dense Vectors & Inference)

- [ ] **ADR-071**: OpenAI Inference API Integration
- [ ] **ADR-072**: Three-Way Hybrid Search Architecture
- [ ] **ADR-073**: Dense Vector Field Strategy

### Phase 1B (Reranking)

- [ ] **ADR-074**: Two-Stage Retrieval with Cohere ReRank
- [ ] **ADR-075**: Filtered kNN Performance Optimization

### Phase 2A (Entities & Graph)

- [ ] **ADR-076**: NER Entity Extraction Strategy
- [ ] **ADR-077**: Graph API for Curriculum Relationships
- [ ] **ADR-078**: Enrich Processor Architecture

### Phase 2B (References)

- [ ] **ADR-079**: Reference Indices Architecture

### Phase 3 (RAG)

- [ ] **ADR-080**: RAG Architecture with ES Playground
- [ ] **ADR-081**: Transcript Chunking Strategy

### Phase 4 (Knowledge Graph)

- [ ] **ADR-082**: Knowledge Graph Triple Store Architecture
- [ ] **ADR-083**: Entity Resolution and Disambiguation

### Phase 5 (Advanced)

- [ ] **ADR-084**: Learning to Rank Strategy
- [ ] **ADR-085**: Multi-Vector Aspect-Based Retrieval

**Total ADRs**: 15 new architectural decisions documented

---

## Success Metrics

### Technical Excellence

- [ ] Three-way hybrid search outperforms two-way by >15% MRR
- [ ] Reranking improves top-10 relevance by 10-25%
- [ ] Filtered kNN 50% faster than post-filter approach
- [ ] RAG answers achieve 80% factual accuracy (human eval)
- [ ] Graph API reveals 50+ non-obvious curriculum connections
- [ ] P95 search latency <300ms with all features enabled

### Feature Completeness

- [ ] 15 ES Serverless features integrated (from 22 currently)
- [ ] 100% TSDoc coverage on new code
- [ ] 15 new ADRs documenting architecture
- [ ] 12 new authored documentation files
- [ ] Zero type shortcuts (`as`, `any`, `Record<string, unknown>`)
- [ ] All quality gates passing after each phase

### Demo Impact

- [ ] Stakeholders impressed with cutting-edge capabilities
- [ ] Clear differentiation from basic search
- [ ] Production-ready code quality
- [ ] Scalable to full curriculum
- [ ] Foundation for future AI features

---

## Timeline Estimate

| Phase                | Duration | Cumulative |
| -------------------- | -------- | ---------- |
| 1A: Dense Vectors    | 2-3 days | 2-3 days   |
| 1B: Reranking        | 2-3 days | 4-6 days   |
| 1C: Ingestion        | 1 day    | 5-7 days   |
| 2A: Entities & Graph | 3-4 days | 8-11 days  |
| 2B: References       | 2-3 days | 10-14 days |
| 3: RAG               | 4-5 days | 14-19 days |
| 4: Knowledge Graph   | 5-6 days | 19-25 days |
| 5: Advanced          | 3-4 days | 22-29 days |

**Total**: **4-5 weeks** for complete ES Serverless feature integration

**Aggressive**: 3 weeks with parallel work
**Conservative**: 6 weeks with thorough testing and documentation

---

## References

### Foundation Documents (MUST RE-READ REGULARLY)

- `.agent/directives/principles.md`
- `.agent/directives/schema-first-execution.md`
- `.agent/directives/testing-strategy.md`

### Related Plans

- `hybrid-field-strategy.md` - Phase 1A field additions
- `phase-4-deferred-fields.md` - AI-generated fields strategy
- `entity-discovery-pipeline.md` - Multi-step entity extraction
- `graph-rag-integration-vision.md` - Strategic Graph + RAG vision

### ES Serverless Research

- `.agent/research/elasticsearch/ai/elasticsearch_serverless_ai_kg_detailed.md`
- `.agent/research/elasticsearch/ai/graph-rag-integration-vision.md`
- `.agent/research/elasticsearch/expanded-architecture-analysis.md`

### Existing ADRs

- ADR-067: SDK Generated Elasticsearch Mappings
- ADR-068: Per-Index Completion Context Enforcement
- ADR-069: Systematic Ingestion with Progress Tracking
- ADR-070: SDK Rate Limiting and Exponential Backoff Retry

---

## Notes on Simplicity (First Question)

**Before each phase, ask**: Could it be simpler without compromising quality?

**Simplification opportunities**:

1. **Start with two-way hybrid** before three-way (validate improvement)
2. **Use ES Playground** before building custom RAG (rapid validation)
3. **Manual entity curation** before NER models (prove value first)
4. **Implicit graph** (Graph API) before explicit triple store (validate queries)
5. **Collect LTR data** before training models (foundation first)

**Principle**: Deliver value incrementally. Each phase should be demonstrable.

---

**End of Enhanced Plan**

This plan integrates ALL high-impact ES Serverless features while maintaining strict adherence to foundation documents. Every feature includes TDD approach, schema-first implementation, comprehensive documentation, and appropriate ADRs.
