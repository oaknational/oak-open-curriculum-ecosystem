# Phase 1A Implementation Guide: Three-Way Hybrid Search

**Parent Plan**: `maths-ks4-implementation-plan.md`  
**Duration**: 2-3 days  
**Foundation Alignment**: ✅ TDD | Schema-First | Documentation Required

---

## Key Decision: Elastic-Native Dense Vectors (2025-12-07)

**We use E5 instead of OpenAI for dense vectors:**

| Aspect       | OpenAI (Original Plan)  | E5 (Current Approach)                  |
| ------------ | ----------------------- | -------------------------------------- |
| Model        | text-embedding-3-small  | `.multilingual-e5-small-elasticsearch` |
| Dimensions   | 1536                    | **384**                                |
| External API | Required                | **None**                               |
| Billing      | Per-token ($0.00002/1K) | Included in subscription               |
| Setup        | Register endpoint       | **PRECONFIGURED**                      |

**Rationale**: No external dependencies for core search. E5 runs on ML nodes within ES Serverless.

---

## Quick Start Checklist

### Prerequisites

- [x] Re-read foundation documents (rules.md, schema-first-execution.md, testing-strategy.md)
- [x] Elasticsearch Serverless running with ELSER configured
- [x] E5 endpoint verified (`.multilingual-e5-small-elasticsearch` PRECONFIGURED)
- [x] Dense vector field definitions added (384-dim)
- [ ] All current quality gates passing

### Day 1: Dense Vector Extraction & Tests

#### Morning: Write Tests FIRST (RED Phase)

1. **Create test file**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/dense-vector-extraction.unit.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { generateDenseVector, prepareTextForEmbedding } from './dense-vector-extraction.js';

/**
 * Tests for E5 dense vector generation using preconfigured Elastic endpoint.
 *
 * The `.multilingual-e5-small-elasticsearch` endpoint is PRECONFIGURED and
 * produces 384-dimensional dense vectors.
 */
describe('Dense Vector Extraction (E5 Elastic-Native)', () => {
  describe('generateDenseVector', () => {
    it('should generate 384-dimensional vector from text', async () => {
      const mockEsClient = {
        inference: {
          inference: vi.fn().mockResolvedValue({
            text_embedding: [Array(384).fill(0.1)],
          }),
        },
      };

      const vector = await generateDenseVector(
        mockEsClient as unknown as Client,
        'How do I teach Pythagoras theorem to Foundation tier?',
      );

      expect(vector).toHaveLength(384);
      expect(mockEsClient.inference.inference).toHaveBeenCalledWith({
        inference_id: '.multilingual-e5-small-elasticsearch',
        input: expect.any(String),
      });
    });

    it('should return undefined on inference failure (graceful degradation)', async () => {
      const mockEsClient = {
        inference: {
          inference: vi.fn().mockRejectedValue(new Error('Inference failed')),
        },
      };

      const vector = await generateDenseVector(mockEsClient as unknown as Client, 'test query');

      expect(vector).toBeUndefined();
    });

    it('should return undefined for empty input', async () => {
      const mockEsClient = {
        inference: {
          inference: vi.fn(),
        },
      };

      const vector = await generateDenseVector(mockEsClient as unknown as Client, '');

      expect(vector).toBeUndefined();
      expect(mockEsClient.inference.inference).not.toHaveBeenCalled();
    });
  });

  describe('prepareTextForEmbedding', () => {
    it('should combine title and summary for lesson embedding', () => {
      const text = prepareTextForEmbedding({
        title: 'Introduction to Fractions',
        summary: 'Learn about numerators and denominators',
      });

      expect(text).toBe('Introduction to Fractions\n\nLearn about numerators and denominators');
    });

    it('should handle missing summary', () => {
      const text = prepareTextForEmbedding({
        title: 'Quadratic Equations',
      });

      expect(text).toBe('Quadratic Equations');
    });
  });
});
```

2. **Run tests**: `pnpm test` (should FAIL - functions don't exist yet)

#### Afternoon: GREEN Phase - Implement

3. **Create implementation**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/dense-vector-extraction.ts`

````typescript
import type { Client } from '@elastic/elasticsearch';

/**
 * E5 inference endpoint ID (PRECONFIGURED on ES Serverless).
 * Produces 384-dimensional dense vectors.
 */
const E5_ENDPOINT_ID = '.multilingual-e5-small-elasticsearch';

/**
 * E5 embedding dimensions.
 */
export const E5_DIMENSIONS = 384;

/**
 * Generates dense vector embedding using Elastic-native E5 model.
 *
 * Uses the preconfigured `.multilingual-e5-small-elasticsearch` endpoint
 * which produces 384-dimensional dense vectors. No external API required.
 *
 * @see ADR-071 - Elastic-Native Dense Vector Strategy
 *
 * @example
 * ```typescript
 * const vector = await generateDenseVector(esClient, 'How to teach Pythagoras theorem');
 * // Returns: number[384] or undefined on error
 * ```
 *
 * @param client - Elasticsearch client instance
 * @param text - Text to generate embedding for
 * @returns 384-dimensional vector or undefined on error (graceful degradation)
 */
export async function generateDenseVector(
  client: Client,
  text: string,
): Promise<number[] | undefined> {
  // Skip empty input
  if (!text || text.trim().length === 0) {
    return undefined;
  }

  try {
    const response = await client.inference.inference({
      inference_id: E5_ENDPOINT_ID,
      input: text.trim(),
    });

    // Extract embedding from response
    // The response structure for text_embedding contains an array of embeddings
    const embeddings = response.text_embedding;
    if (Array.isArray(embeddings) && embeddings.length > 0) {
      return embeddings[0] as number[];
    }

    return undefined;
  } catch {
    // Graceful degradation - search still works via BM25 + ELSER
    return undefined;
  }
}

/**
 * Prepares text for E5 embedding generation.
 *
 * Combines title and optional summary into a single text string
 * suitable for embedding.
 *
 * @param params - Title and optional summary
 * @returns Combined text for embedding
 */
export function prepareTextForEmbedding(params: { title: string; summary?: string }): string {
  if (params.summary) {
    return `${params.title}\n\n${params.summary}`;
  }
  return params.title;
}
````

4. **Run tests**: `pnpm test` (should PASS now)

### Day 2: Field Definitions & Extraction Functions

**NOTE**: Field definitions already added. Focus on extraction functions for tier/exam_board/pathway.

#### Morning: Verify Field Definitions (Already Done)

5. **Verify field definitions** in `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts`:

```typescript
// LESSONS_INDEX_FIELDS now includes:
{ name: 'lesson_dense_vector', zodType: 'array-number', optional: true },
{ name: 'tier', zodType: 'string', optional: true },      // 'foundation' | 'higher'
{ name: 'exam_board', zodType: 'string', optional: true }, // 'aqa', 'edexcel', etc.
{ name: 'pathway', zodType: 'string', optional: true },

// UNIT_ROLLUP_INDEX_FIELDS now includes:
{ name: 'unit_dense_vector', zodType: 'array-number', optional: true },
{ name: 'tier', zodType: 'string', optional: true },
{ name: 'exam_board', zodType: 'string', optional: true },
```

6. **Verify ES field overrides** in `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-field-overrides.ts`:

```typescript
// In LESSONS_FIELD_OVERRIDES:
lesson_dense_vector: {
  type: 'dense_vector',
  dims: 384,  // E5-small dimensions
  index: true,
  similarity: 'cosine',
},
tier: { type: 'keyword' },
exam_board: { type: 'keyword' },
pathway: { type: 'keyword' },

// In UNIT_ROLLUP_FIELD_OVERRIDES:
unit_dense_vector: {
  type: 'dense_vector',
  dims: 384,
  index: true,
  similarity: 'cosine',
},
tier: { type: 'keyword' },
exam_board: { type: 'keyword' },
```

7. **Run type-gen if not already done**: `pnpm type-gen`

8. **Verify generated types**: Check `packages/sdks/oak-curriculum-sdk/src/types/generated/search/search-index-docs.ts`

#### Afternoon: Extraction Functions (TDD)

9. **Write unit tests for tier/exam_board extraction**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transform-helpers.unit.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { extractTier, extractExamBoard, extractPathway } from './document-transform-helpers.js';

describe('Maths KS4 field extraction', () => {
  describe('extractTier', () => {
    it('should extract foundation tier from programme factors', () => {
      const tier = extractTier({
        programme_factors: [{ factor_type: 'tier', factor_value: 'foundation' }],
      });
      expect(tier).toBe('foundation');
    });

    it('should extract higher tier', () => {
      const tier = extractTier({
        programme_factors: [{ factor_type: 'tier', factor_value: 'higher' }],
      });
      expect(tier).toBe('higher');
    });

    it('should return undefined when no tier factor', () => {
      const tier = extractTier({
        programme_factors: [],
      });
      expect(tier).toBeUndefined();
    });
  });

  describe('extractExamBoard', () => {
    it('should extract exam board from programme factors', () => {
      const examBoard = extractExamBoard({
        programme_factors: [{ factor_type: 'exam_board', factor_value: 'aqa' }],
      });
      expect(examBoard).toBe('aqa');
    });
  });

  describe('extractPathway', () => {
    it('should extract pathway from programme', () => {
      const pathway = extractPathway({
        programme_slug: 'maths-secondary-ks4-higher-aqa',
      });
      expect(pathway).toContain('higher');
    });
  });
});
```

10. **Implement extraction functions**: Add to `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transform-helpers.ts`

11. **Update document transforms**: Integrate extraction functions and dense vector generation

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

16. **ADR-071**: `docs/architecture/architectural-decisions/071-elastic-native-dense-vector-strategy.md`

```markdown
# ADR-071: Elastic-Native Dense Vector Strategy

## Status

Accepted

## Context

Three-way hybrid search requires dense vector embeddings in addition to BM25 and ELSER.
We evaluated two approaches:

1. OpenAI text-embedding-3-small (1536-dim) via ES Inference API
2. Elastic-native E5 model via preconfigured `.multilingual-e5-small-elasticsearch` (384-dim)

## Decision

Use Elastic-native E5 model (`.multilingual-e5-small-elasticsearch`) for dense vector generation.

## Rationale

| Factor       | OpenAI                   | E5 (Chosen)                  |
| ------------ | ------------------------ | ---------------------------- |
| External API | Required                 | **None**                     |
| Dimensions   | 1536                     | 384                          |
| Billing      | Per-token (~$0.00002/1K) | **Included in subscription** |
| Setup        | Register endpoint        | **PRECONFIGURED**            |
| Latency      | API call overhead        | Local ML nodes               |
| Availability | External dependency      | **Within cluster**           |

## Consequences

### Positive

- No external API dependencies for core search functionality
- Simpler architecture - no API key management
- Lower operational cost (included in ES Serverless subscription)
- Lower latency - runs on ML nodes within cluster
- PRECONFIGURED - no endpoint registration needed

### Negative

- Smaller embedding dimension (384 vs 1536) may have slightly lower semantic precision
- E5 is multilingual but less specialized than domain-specific models

### Mitigated by

- ELSER sparse embeddings provide complementary semantic signal
- Three-way fusion (BM25 + ELSER + E5) compensates for individual model limitations
- Can upgrade to jina-embeddings-v3 (1024-dim) with higher-tier subscription

## Verified Available Endpoints (2025-12-07)

| Endpoint                               | Type                     | Status        |
| -------------------------------------- | ------------------------ | ------------- |
| `.multilingual-e5-small-elasticsearch` | text_embedding (384-dim) | PRECONFIGURED |
| `.elser-2-elasticsearch`               | sparse_embedding         | PRECONFIGURED |
| `.rerank-v1-elasticsearch`             | rerank                   | TECH PREVIEW  |

## Implementation

- Dense vector fields with `dims: 384` in ES mappings
- `generateDenseVector()` function using E5 endpoint
- Three-way RRF combining BM25 + ELSER + E5 kNN
```

17. **ADR-072**: `docs/architecture/architectural-decisions/072-three-way-hybrid-search-architecture.md`

18. **ADR-073**: `docs/architecture/architectural-decisions/073-dense-vector-field-configuration.md`

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

### Issue: E5 inference returns empty response

**Solution**: Check text input is not empty and endpoint is available.

```typescript
// Test E5 endpoint manually
const response = await esClient.inference.inference({
  inference_id: '.multilingual-e5-small-elasticsearch',
  input: 'Test query for embedding',
});

console.log('Embedding length:', response.text_embedding?.[0]?.length);
// Expected: 384
```

### Issue: Embeddings not generated during ingestion

**Solution**: Check ES client is passed to document transform functions.

```typescript
// In createLessonDocument, ensure esClient is available
const doc = await createLessonDocument({
  // ... other params
  esClient, // ← Must be provided for dense vector generation
});
```

### Issue: Type errors after `pnpm type-gen`

**Solution**: Check field-definitions.ts and es-field-overrides.ts syntax.

```bash
# Validate field definitions
pnpm type-check packages/sdks/oak-curriculum-sdk
```

### Issue: kNN query fails

**Solution**: Ensure dense_vector field has `index: true` in ES mapping.

```typescript
// Check mapping in es-field-overrides.ts
lesson_dense_vector: {
  type: 'dense_vector',
  dims: 384,  // Must match E5 dimensions
  index: true,  // ← Required for kNN
  similarity: 'cosine',
},
```

---

## Success Criteria

- [x] Dense vector fields added (384-dim)
- [x] ES field overrides configured
- [ ] All 15+ new unit tests pass
- [ ] All 5+ integration tests pass
- [ ] E2E test demonstrates three-way hybrid
- [ ] E5 embeddings generated via `.multilingual-e5-small-elasticsearch`
- [ ] Dense vectors populated for >95% of lessons
- [ ] Three-way search outperforms two-way by >10% (manual eval)
- [ ] All quality gates passing
- [ ] ADR-071 written (Elastic-Native Dense Vector Strategy)
- [ ] ADR-072 written (Three-Way Hybrid Search Architecture)
- [ ] ADR-073 written (Dense Vector Field Configuration)
- [ ] TSDoc coverage 100% on new functions
- [ ] No external API dependencies for core search

---

**End of Phase 1A Guide**

Next: Phase 1B - Cohere ReRank & Filtered kNN
