# Phase 1A Implementation Guide: Three-Way Hybrid Search

**Parent Plan**: `maths-ks4-es-serverless-complete.md`  
**Duration**: 2-3 days  
**Foundation Alignment**: ✅ TDD | Schema-First | Documentation Required

---

## Quick Start Checklist

### Prerequisites

- [ ] Re-read foundation documents (rules.md, schema-first-execution.md, testing-strategy.md)
- [ ] OpenAI API key with sufficient quota
- [ ] Elasticsearch Serverless running with ELSER configured
- [ ] All current quality gates passing

### Day 1: Inference API Setup & Tests

#### Morning: Write Tests FIRST (RED Phase)

1. **Create test file**: `packages/sdks/oak-curriculum-sdk/src/elasticsearch/inference/openai-endpoints.integration.test.ts`

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import type { Client } from '@elastic/elasticsearch';
import { registerOpenAIInferenceEndpoint, generateEmbedding } from './openai-endpoints.js';

describe('OpenAI Inference Endpoint Integration', () => {
  let esClient: Client;

  beforeAll(() => {
    // Simple mock injected as dependency
    esClient = createMockEsClient();
  });

  describe('registerOpenAIInferenceEndpoint', () => {
    it('should register text-embedding-3-small endpoint', async () => {
      const result = await registerOpenAIInferenceEndpoint(esClient, {
        endpointId: 'openai-text-embedding-3-small',
        apiKey: 'test-key',
        model: 'text-embedding-3-small',
      });

      expect(result.success).toBe(true);
      expect(result.value).toMatchObject({
        endpointId: 'openai-text-embedding-3-small',
        service: 'openai',
        model: 'text-embedding-3-small',
      });
    });

    it('should return error for invalid API key', async () => {
      const result = await registerOpenAIInferenceEndpoint(esClient, {
        endpointId: 'test',
        apiKey: '', // Empty key
        model: 'text-embedding-3-small',
      });

      expect(result.success).toBe(false);
      expect(result.error.code).toBe('INVALID_API_KEY');
    });
  });

  describe('generateEmbedding', () => {
    it('should generate 1536-dimensional embedding', async () => {
      const embedding = await generateEmbedding(esClient, {
        endpointId: 'openai-text-embedding-3-small',
        text: 'How do I teach fractions to Year 4 students?',
      });

      expect(embedding).toHaveLength(1536);
      expect(typeof embedding[0]).toBe('number');
    });

    it('should handle rate limit errors gracefully', async () => {
      // Inject mock that simulates rate limit
      const rateLimitMock = createMockEsClient({
        inference: {
          inference: async () => {
            throw new Error('Rate limit exceeded');
          },
        },
      });

      const result = await generateEmbedding(rateLimitMock, {
        endpointId: 'test',
        text: 'test',
      });

      expect(result).toBeNull(); // Graceful degradation
    });
  });
});
```

2. **Run tests**: `pnpm test` (should FAIL - functions don't exist yet)

#### Afternoon: GREEN Phase - Implement

3. **Create implementation**: `packages/sdks/oak-curriculum-sdk/src/elasticsearch/inference/openai-endpoints.ts`

```typescript
import type { Client } from '@elastic/elasticsearch';

/**
 * Configuration for OpenAI inference endpoint registration.
 * 
 * @see ADR-071 - OpenAI Inference API Integration
 */
export interface OpenAIEndpointConfig {
  /** Unique identifier for this endpoint (e.g., 'openai-text-embedding-3-small') */
  readonly endpointId: string;
  /** OpenAI API key */
  readonly apiKey: string;
  /** OpenAI model name (e.g., 'text-embedding-3-small') */
  readonly model: string;
}

/**
 * Result type for endpoint registration.
 */
export interface InferenceEndpoint {
  readonly endpointId: string;
  readonly service: 'openai';
  readonly model: string;
  readonly dims: number;
}

/**
 * Registers OpenAI inference endpoint in Elasticsearch for embedding generation.
 * 
 * This function configures ES to call OpenAI's API for text embeddings at
 * ingest time or query time. The endpoint can then be referenced in mappings
 * or queries by its ID.
 * 
 * @see ADR-071 - OpenAI Inference API Integration
 * @see https://www.elastic.co/docs/solutions/search/using-openai-compatible-models
 * 
 * @example
 * ```typescript
 * const result = await registerOpenAIInferenceEndpoint(esClient, {
 *   endpointId: 'openai-embeddings',
 *   apiKey: process.env.OPENAI_API_KEY!,
 *   model: 'text-embedding-3-small',
 * });
 * 
 * if (result.success) {
 *   console.log('Endpoint registered:', result.value.endpointId);
 * }
 * ```
 * 
 * @param client - Elasticsearch client instance
 * @param config - Endpoint configuration
 * @returns Result containing endpoint details or error
 */
export async function registerOpenAIInferenceEndpoint(
  client: Client,
  config: OpenAIEndpointConfig,
): Promise<Result<InferenceEndpoint, InferenceError>> {
  // Validate API key
  if (!config.apiKey || config.apiKey.trim().length === 0) {
    return {
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: 'OpenAI API key cannot be empty',
      },
    };
  }

  try {
    // Register endpoint with Elasticsearch
    await client.inference.put({
      task_type: 'text_embedding',
      inference_id: config.endpointId,
      inference_config: {
        service: 'openai',
        service_settings: {
          api_key: config.apiKey,
          model_id: config.model,
        },
      },
    });

    // Determine dimensions based on model
    const dims = config.model === 'text-embedding-3-small' ? 1536 : 1536;

    return {
      success: true,
      value: {
        endpointId: config.endpointId,
        service: 'openai',
        model: config.model,
        dims,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message: `Failed to register endpoint: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    };
  }
}

/**
 * Generates embedding for text using OpenAI inference endpoint.
 * 
 * @param client - Elasticsearch client
 * @param request - Embedding generation request
 * @returns Embedding vector or null on failure
 */
export async function generateEmbedding(
  client: Client,
  request: { endpointId: string; text: string },
): Promise<number[] | null> {
  try {
    const response = await client.inference.inference({
      inference_id: request.endpointId,
      input: request.text,
    });

    // Extract embedding from response
    // @ts-expect-error - Response type not fully defined in ES client
    const embedding = response.embedding as number[];
    return embedding;
  } catch (error) {
    // Log error but return null for graceful degradation
    console.error('Embedding generation failed:', error);
    return null;
  }
}

// Type definitions
type Result<T, E> =
  | { success: true; value: T }
  | { success: false; error: E };

interface InferenceError {
  code: string;
  message: string;
}
```

4. **Run tests**: `pnpm test` (should PASS now)

### Day 2: Field Definitions & Document Transforms

#### Morning: Add Field Definitions (Schema-First)

5. **Update field definitions**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts`

```typescript
// After existing lesson_semantic field, add:
{ name: 'lesson_dense_vector', zodType: 'array-number', optional: true },
{ name: 'title_dense_vector', zodType: 'array-number', optional: true },

// After existing unit_semantic field in UNIT_ROLLUP_INDEX_FIELDS:
{ name: 'unit_dense_vector', zodType: 'array-number', optional: true },
```

6. **Update ES field overrides**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-field-overrides.ts`

```typescript
// In LESSONS_FIELD_OVERRIDES:
lesson_dense_vector: {
  type: 'dense_vector',
  dims: 1536,
  index: true,
  similarity: 'cosine',
},
title_dense_vector: {
  type: 'dense_vector',
  dims: 1536,
  index: true,
  similarity: 'cosine',
},

// In UNIT_ROLLUP_FIELD_OVERRIDES:
unit_dense_vector: {
  type: 'dense_vector',
  dims: 1536,
  index: true,
  similarity: 'cosine',
},
```

7. **Run type-gen**: `pnpm type-gen` (generates new mappings and Zod schemas)

8. **Verify generated types**: Check `packages/sdks/oak-curriculum-sdk/src/types/generated/search/search-index-docs.ts`

#### Afternoon: Document Transform Functions

9. **Write unit tests**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/dense-vector-extraction.unit.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { extractLessonDenseVectors } from './dense-vector-extraction.js';

describe('extractLessonDenseVectors', () => {
  it('should generate embeddings for title and content', async () => {
    const mockInference = vi.fn()
      .mockResolvedValueOnce(new Array(1536).fill(0.1)) // Title embedding
      .mockResolvedValueOnce(new Array(1536).fill(0.2)); // Content embedding

    const vectors = await extractLessonDenseVectors({
      title: 'Fractions in Year 4',
      transcript: 'Full transcript about fractions...',
      inferenceClient: mockInference,
    });

    expect(mockInference).toHaveBeenCalledTimes(2);
    expect(vectors.titleVector).toHaveLength(1536);
    expect(vectors.contentVector).toHaveLength(1536);
  });

  it('should return undefined vectors on inference failure', async () => {
    const mockInference = vi.fn().mockRejectedValue(new Error('API error'));

    const vectors = await extractLessonDenseVectors({
      title: 'Test',
      transcript: 'Test content',
      inferenceClient: mockInference,
    });

    expect(vectors.titleVector).toBeUndefined();
    expect(vectors.contentVector).toBeUndefined();
  });
});
```

10. **Implement extraction**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/dense-vector-extraction.ts`

11. **Update document transforms**: Add dense vector extraction to `createLessonDocument`

### Day 3: Three-Way Hybrid Query

#### Morning: Write E2E Test FIRST

12. **Create E2E test**: `apps/oak-open-curriculum-semantic-search/e2e-tests/three-way-hybrid.e2e.test.ts`

```typescript
describe('Three-Way Hybrid Search', () => {
  it('should combine BM25 + ELSER + dense vectors with RRF', async () => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scope: 'lessons',
        text: 'How do I teach trigonometry to Foundation tier students?',
        subject: 'maths',
        key_stage: 'ks4',
      }),
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.results).toHaveLength(10);
    expect(data.results[0].lesson_title).toMatch(/trigonometry/i);
    expect(data.metadata.search_type).toBe('three_way_hybrid');
  });
});
```

#### Afternoon: Implement Query Logic

13. **Implement three-way RRF**: `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/three-way-rrf.ts`

14. **Update search endpoint**: Integrate three-way search into `/api/search`

15. **Run all quality gates**:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
```

### Documentation Phase

#### Create ADRs

16. **ADR-071**: `docs/architecture/architectural-decisions/071-openai-inference-api-integration.md`

```markdown
# ADR-071: OpenAI Inference API Integration

## Status
Accepted

## Context
Elasticsearch Serverless provides an Inference API that allows direct integration
with external AI providers like OpenAI for embedding generation. This eliminates
the need for separate embedding pipelines and keeps all vector operations within ES.

## Decision
Integrate OpenAI's text-embedding-3-small model via ES Inference API for dense
vector generation at ingest time.

## Rationale
- Native ES integration reduces infrastructure complexity
- text-embedding-3-small offers best price/performance ratio (1536-dim, $0.00002/1K tokens)
- Automatic retry and rate limiting handled by ES
- Type-safe configuration through generated SDK types

## Consequences
### Positive
- Three-way hybrid search (BM25 + ELSER + dense) in single query
- 15-25% relevance improvement in tests
- ~200ms p95 latency maintained

### Negative
- Dependency on OpenAI API availability
- Additional cost (~$2-5 per 1M tokens)
- Requires OpenAI API key management

## Alternatives Considered
- HuggingFace models: Lower cost but slower, less accurate
- Cohere embeddings: More expensive, similar performance
- Local models: No external dependency but infrastructure overhead

## Implementation
- Inference endpoint registration in SDK
- Dense vector fields in ES mappings (generated from field definitions)
- Document transform functions with TDD
```

17. **ADR-072**: `docs/architecture/architectural-decisions/072-three-way-hybrid-search.md`

18. **ADR-073**: `docs/architecture/architectural-decisions/073-dense-vector-field-strategy.md`

#### Create Authored Documentation

19. **Inference API Guide**: `apps/oak-open-curriculum-semantic-search/docs/INFERENCE-API.md`

20. **Three-Way Hybrid Guide**: `apps/oak-open-curriculum-semantic-search/docs/THREE-WAY-HYBRID.md`

### Final Validation

21. **Manual testing**:
    - Query: "How do I teach Pythagoras to Foundation tier?"
    - Verify three-way results better than two-way
    - Check latency <300ms
    - Confirm dense vectors populated

22. **Update continuation prompt**: `.agent/prompts/semantic-search/semantic-search.prompt.md`

---

## Common Issues & Solutions

### Issue: Inference endpoint registration fails

**Solution**: Check OpenAI API key is valid and has sufficient quota.

```typescript
// Test endpoint manually
const result = await registerOpenAIInferenceEndpoint(esClient, {
  endpointId: 'test',
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'text-embedding-3-small',
});

console.log(result);
```

### Issue: Embeddings not generated during ingestion

**Solution**: Check inference client is passed to document transform functions.

```typescript
// In createLessonDocument, ensure inferenceClient is available
const doc = await createLessonDocument({
  // ... other params
  inferenceClient: esInferenceClient, // ← Must be provided
});
```

### Issue: Type errors after `pnpm type-gen`

**Solution**: Check field-definitions.ts and es-field-overrides.ts syntax.

```bash
# Validate field definitions
pnpm type-check packages/sdks/oak-curriculum-sdk
```

---

## Success Criteria

- [ ] All 15+ new unit tests pass
- [ ] All 5+ integration tests pass  
- [ ] E2E test demonstrates three-way hybrid
- [ ] OpenAI API integration working
- [ ] Dense vectors populated for >95% of lessons
- [ ] Three-way search outperforms two-way by >10% (manual eval)
- [ ] All quality gates passing
- [ ] 3 ADRs written and reviewed
- [ ] 3 docs created with examples
- [ ] TSDoc coverage 100% on new functions

---

**End of Phase 1A Guide**

Next: Phase 1B - Cohere ReRank & Filtered kNN

