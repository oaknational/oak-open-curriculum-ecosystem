# Phase 1A Implementation Guide - COMPLETE ✅

**Status**: Phase 1A Complete (2025-12-08)  
**Purpose**: Detailed TDD examples and implementation guidance for Phase 1A  
**Archived**: This content was moved from semantic-search.prompt.md after Phase 1A completion

---

## Phase 1A: Three-Way Hybrid Search Implementation

### Day 1 Morning: Foundation & Tests (RED Phase)

#### 1. Re-read Foundation Documents (15 min)

```bash
# Open in editor
code .agent/directives/rules.md
code .agent/directives/schema-first-execution.md
code .agent/directives/testing-strategy.md
```

Remind yourself of:

- TDD is MANDATORY (RED → GREEN → REFACTOR)
- No type shortcuts EVER
- All quality gates must pass

#### 2. Create Dense Vector Extraction Tests (2 hours)

**File**: `apps/oak-search-cli/src/lib/indexing/dense-vector-extraction.unit.test.ts` (NEW)

Write tests FIRST for:

- `generateDenseVector()` - Generate 384-dim vector using E5 endpoint
- Error handling: Inference failure, empty input
- Text preparation for embedding

**Example**:

```typescript
describe('Dense Vector Extraction', () => {
  it('should generate 384-dimensional vector from text', async () => {
    const mockEsClient = createMockEsClient({
      inferenceResponse: {
        text_embedding: {
          embeddings: [Array(384).fill(0.1)],
        },
      },
    });

    const vector = await generateDenseVector(mockEsClient, 'Pythagoras theorem lesson');

    expect(vector).toHaveLength(384);
  });

  it('should return undefined on inference failure', async () => {
    const mockEsClient = createMockEsClient({ throwError: true });

    const vector = await generateDenseVector(mockEsClient, 'test');

    expect(vector).toBeUndefined();
  });
});
```

#### 3. Run Tests (Should FAIL - RED)

```bash
cd apps/oak-search-cli
pnpm test dense-vector-extraction.unit.test.ts

# Expected: FAIL - function doesn't exist yet
```

This proves tests are actually testing something.

### Day 1 Afternoon: Implementation (GREEN Phase)

#### 4. Implement Dense Vector Extraction

**File**: `apps/oak-search-cli/src/lib/indexing/dense-vector-extraction.ts` (NEW)

Implement to pass tests:

````typescript
/**
 * Generates dense vector embedding using Elastic-native E5 model.
 *
 * Uses the preconfigured `.multilingual-e5-small-elasticsearch` endpoint
 * which produces 384-dimensional dense vectors.
 *
 * @see ADR-071 - Elastic-Native Dense Vector Strategy
 *
 * @example
 * ```typescript
 * const vector = await generateDenseVector(esClient, 'How to teach Pythagoras theorem');
 * // Returns: number[384] or undefined on error
 * ```
 */
export async function generateDenseVector(
  esClient: Client,
  text: string,
): Promise<number[] | undefined> {
  try {
    const response = await esClient.inference.inference({
      inference_id: '.multilingual-e5-small-elasticsearch',
      input: text,
    });
    // Extract and return 384-dim embedding
  } catch {
    // Graceful degradation - return undefined, search still works via BM25 + ELSER
    return undefined;
  }
}
````

#### 5. Run Tests Again (Should PASS - GREEN)

```bash
pnpm test dense-vector-extraction.unit.test.ts

# Expected: PASS - all tests green
```

### Day 2: Field Definitions & Extraction Functions

See the detailed steps in `maths-ks4-implementation-plan.md` Phase 1A section.

**Key steps**:

1. Add field definitions to SDK (`field-definitions/curriculum.ts`)
2. Run `pnpm type-gen` to generate mappings and Zod schemas
3. Write unit tests for extraction functions (RED)
4. Implement extraction functions (GREEN)
5. Write integration tests for document transforms (RED)
6. Update document transforms (GREEN)
7. Run all quality gates

### Day 3: Three-Way RRF Query

1. Write E2E test for three-way hybrid (RED)
2. Implement three-way RRF query (GREEN)
3. Benchmark against two-way hybrid
4. Run all quality gates
5. Write ADRs 071-074
6. Create docs with examples

---

## Detailed TDD Examples

### Example 1: Extraction Function with Unit Test

**Test (RED)**:

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
```

**Implementation (GREEN)**:

````typescript
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
````

### Example 2: Integration Test for Document Transform

**Test (RED)**:

```typescript
describe('createLessonDocument with Phase 1A fields', () => {
  it('should include tier, exam_board, and pathway', async () => {
    const mockEsClient = createMockEsClient();
    const lessonData = createLessonData({
      programmeFactors: {
        tier: 'higher',
        examBoard: 'aqa',
        pathway: 'gcse',
      },
    });

    const document = await createLessonDocument(mockEsClient, lessonData);

    expect(document.tier).toBe('higher');
    expect(document.exam_board).toBe('aqa');
    expect(document.pathway).toBe('gcse');
  });

  it('should include dense vector if generation succeeds', async () => {
    const mockEsClient = createMockEsClient({
      inferenceResponse: {
        text_embedding: { embeddings: [Array(384).fill(0.1)] },
      },
    });
    const lessonData = createLessonData({ title: 'Test lesson' });

    const document = await createLessonDocument(mockEsClient, lessonData);

    expect(document.lesson_dense_vector).toHaveLength(384);
  });

  it('should handle dense vector generation failure gracefully', async () => {
    const mockEsClient = createMockEsClient({ throwError: true });
    const lessonData = createLessonData({ title: 'Test lesson' });

    const document = await createLessonDocument(mockEsClient, lessonData);

    expect(document.lesson_dense_vector).toBeUndefined();
    expect(document.title).toBe('Test lesson'); // Document still created
  });
});
```

**Implementation (GREEN)**:

```typescript
export async function createLessonDocument(
  esClient: Client,
  lessonData: LessonData,
): Promise<LessonDocument> {
  const tier = extractTier(lessonData);
  const examBoard = extractExamBoard(lessonData);

  return {
    // ... existing fields ...
    tier,
    exam_board: examBoard,
    pathway: lessonData.programmeFactors?.pathway,
    lesson_dense_vector: await generateLessonEmbedding(esClient, lessonData),
  };
}
```

---

## Cost Estimates (Phase 1A)

### One-Time Costs (Maths KS4 Ingestion)

- **E5 embeddings**: $0 (Elastic-native, included in ES Serverless subscription)
- **Oak API calls**: ~100-200 requests (within existing quota)
- **Total**: $0

### Ongoing Costs (Monthly, if extended to full curriculum)

- **E5 embeddings**: $0 (Elastic-native, included in subscription)
- **ES Serverless**: Resource-based billing (existing subscription)
- **Total**: $0/month for AI/ML features

---

## Key Decisions Made

### Decision 1: Elastic-Native E5 vs OpenAI Embeddings

**Chosen**: `.multilingual-e5-small-elasticsearch` (384-dim)

**Rationale**:

- No external API dependencies
- Included in ES Serverless subscription ($0 additional cost)
- Preconfigured endpoint (no setup required)
- 384 dimensions sufficient for curriculum search
- Consistent with Elastic-native first philosophy

**See**: ADR-071, ADR-074

### Decision 2: Graceful Degradation for Dense Vectors

**Approach**: If dense vector generation fails, continue with BM25 + ELSER only

**Rationale**:

- Search still works without dense vectors
- Prevents ingestion failures
- Logs errors for monitoring
- Can retry failed embeddings later

### Decision 3: Two Dense Vector Fields per Lesson

**Fields**:

- `lesson_dense_vector` - Full lesson content (title + summary + keywords)
- `title_dense_vector` - Title only

**Rationale**:

- Title vectors for precise matching
- Full vectors for broad semantic search
- Enables multi-vector strategies in Phase 5

**See**: ADR-073

---

## Troubleshooting Guide

### Issue: Dense Vector Generation Fails

**Symptoms**: `generateDenseVector` returns `undefined`

**Causes**:

1. ES inference endpoint unavailable
2. Text too long (>512 tokens)
3. Network timeout

**Solutions**:

1. Check ES connection: `pnpm es:status`
2. Verify endpoint: Query ES for `.multilingual-e5-small-elasticsearch`
3. Check text length, truncate if needed
4. Add retry logic with exponential backoff

### Issue: Mapping Errors During Ingestion

**Symptoms**: `strict_dynamic_mapping_exception`

**Causes**:

1. Field not in ES mapping
2. Wrong field type
3. `pnpm type-gen` not run after field definition changes

**Solutions**:

1. Add field to `field-definitions/curriculum.ts`
2. Add ES override to `es-field-overrides.ts` if needed
3. Run `pnpm type-gen`
4. Verify generated mapping includes field
5. Re-create ES indexes: `pnpm es:setup --reset`

### Issue: Tests Failing After Implementation

**Symptoms**: Tests pass in RED phase, fail in GREEN phase (unexpected!)

**Causes**:

1. Test fixtures incorrect
2. Mock setup wrong
3. Implementation has side effects

**Solutions**:

1. Review test fixtures
2. Check mock responses match real API
3. Ensure functions are pure (no side effects)
4. Add more test cases to cover edge cases

---

## Lessons Learned

### What Went Well

1. **TDD approach caught issues early** - Tests revealed missing error handling before production
2. **Schema-first prevented drift** - Zero mapping errors during ingestion
3. **Elastic-native approach simplified** - No external API setup, no additional costs
4. **Graceful degradation worked** - Search continued when embeddings failed

### What Could Be Improved

1. **Initial file organization** - Had to refactor due to max-lines violations
2. **Mock setup complexity** - ES client mocks were verbose, could extract helper
3. **Documentation timing** - Should write docs alongside code, not after

### Recommendations for Phase 1B/1C

1. **Plan file structure upfront** - Avoid refactoring for linting
2. **Create mock helpers early** - Reusable across tests
3. **Document as you go** - Write ADRs and docs during implementation
4. **Test inference endpoints first** - Verify availability before coding

---

## Phase 1A Completion Checklist

- [x] Dense vector fields added to lessons and unit_rollup indexes (384-dim)
- [x] ES field overrides configured for dense_vector type
- [x] `pnpm type-gen` generates correct mappings
- [x] Extraction functions implemented (tier, exam_board, pathway) with unit tests
- [x] Dense vector generation using `.multilingual-e5-small-elasticsearch`
- [x] Document transforms include dense vector generation
- [x] Three-way RRF query implemented
- [x] ADR-071 written (Elastic-Native Dense Vector Strategy)
- [x] ADR-072 written (Three-Way Hybrid Search Architecture)
- [x] ADR-073 written (Dense Vector Field Configuration)
- [x] ADR-074 written (Elastic-Native First Philosophy)
- [x] No type shortcuts introduced
- [x] No external API dependencies for core search
- [x] Linting errors fixed (max-lines, unused import)
- [x] All 10 quality gates passing
- [x] Prompt updated with Phase 1A completion
- [ ] E2E test proves three-way beats two-way (requires Phase 1C ingestion)
- [ ] 3 docs created with examples

---

**End of Phase 1A Archive**
