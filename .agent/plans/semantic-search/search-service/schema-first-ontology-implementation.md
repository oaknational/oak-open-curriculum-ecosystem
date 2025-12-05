# Search Service: Schema-First and Ontology Implementation Plan

Last updated: 2025-12-04

## Executive Summary

This plan details the migration of the semantic search backend from runtime-defined schemas to schema-first architecture while integrating comprehensive curriculum ontology support. No search indices have been deployed, so all changes are non-breaking.

**Goal**: Migrate all search schemas to type-gen (SDK compile time) and add complete ontology fields (threads, programme factors, unit types, content guidance) to enable powerful, type-safe search across Oak's curriculum data.

**Status**: **Phase 1 COMPLETE** ✅. **ES Serverless DEPLOYED** ✅. Ready for real data ingestion and Phase 2.

**Duration**: 6-8 weeks across 3 phases with clear sessions minimizing context switching.

## ⚠️ Phase 1 Status: COMPLETE

**All Phase 1 sessions completed (2025-12-04)**:

- ✅ Session 1.1: Search Index Document Schema Generation
- ✅ Session 1.2: Request/Response Schema Generation
- ✅ Session 1.3: Update Search App to Consume Generated Schemas
- ✅ Session 1.4: Remove Runtime Schema Definitions

**Additional completions**:

- ✅ Thread index document schema (`SearchThreadIndexDocSchema`)
- ✅ Thread fields embedded in lessons/units/rollup schemas
- ✅ SDK synonym export utilities (`buildElasticsearchSynonyms()`, `buildSynonymLookup()`)
- ✅ ES index mappings relocated to `src/lib/elasticsearch/definitions/`
- ✅ Static `synonyms.json` deleted - synonyms generated from SDK

**Next**: Clear test data, ingest real Maths curriculum via `pnpm es:setup && pnpm es:ingest-live --subject maths --verbose`.

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Why This Matters](#why-this-matters)
3. [Goals and Success Criteria](#goals-and-success-criteria)
4. [Phase 1: Schema-First Migration](#phase-1-schema-first-migration) ✅ COMPLETE
5. [Phase 2: Core Ontology Fields](#phase-2-core-ontology-fields) - Blocked on ES
6. [Phase 3: Ontology Enrichment](#phase-3-ontology-enrichment) - Blocked on ES
7. [Testing and Validation Strategy](#testing-and-validation-strategy)
8. [Dependencies and Prerequisites](#dependencies-and-prerequisites)
9. [Risk Management](#risk-management)

---

## Current State Analysis

### What Is Generated at Type-Gen Time

Currently, the SDK generates limited search-related types:

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/search/`

**Generated artifacts**:

- `facets.ts`: `SequenceFacetUnit`, `SequenceFacet`, `SearchFacets` derived from OpenAPI schema
- `index.ts`: Re-exports facet types

**Total**: ~2 files, covering only facets from the Open Curriculum API schema.

### What Is Defined at Runtime

The search app currently defines **all other schemas at runtime**, violating the cardinal rule.

**Location**: `apps/oak-open-curriculum-semantic-search/`

**Runtime schema files** (detailed in [search-schema-inventory.md](../archive/superseded/search-schema-inventory.md)):

1. **app/ui/structured-search.shared.ts** (~350 LOC)
   - `SearchRequest`, `SuggestionResponseSchema`, `HybridResponseSchema`, `MultiScopeHybridResponseSchema`
   - Search scopes, suggestion items, facet schemas

2. **app/api/search/route.ts** (~120 LOC)
   - Duplicate `StructuredSchema`, response payload types

3. **app/api/search/nl/route.ts** (~80 LOC)
   - Natural language body schema, scope resolution helpers

4. **app/api/search/suggest/route.ts** (~60 LOC)
   - Suggestion request schema

5. **src/lib/hybrid-search/types.ts** (~150 LOC)
   - `StructuredQuery`, `UnitResult`, `LessonResult`, `SequenceResult`, `HybridSearchResult`

6. **src/lib/suggestions/types.ts** (~90 LOC)
   - `SuggestScope`, `SuggestQuery`, `SuggestionItem`, `SuggestionResponse`

7. **src/lib/query-parser.ts** (~100 LOC)
   - `ParsedQuerySchema` for LLM output interpretation

8. **src/lib/openapi.schemas.ts** (~400 LOC)
   - Comprehensive Zod models with OpenAPI metadata (duplicates all above)

9. **app/ui/search-fixtures/builders/** (~600 LOC)
   - Fixture builders with local type definitions

**Total**: ~2,000 LOC of runtime schema definitions that should be generated.

### Current Index Structure

**Five Elasticsearch indices** (not yet deployed):

1. **`oak_lessons`** - Individual lesson documents
   - Fields: `lessonSlug`, `lessonTitle`, `unitSlug`, `subjectSlug`, `keyStageSlug`, `transcript`, `keywords`
   - Missing: Thread info, programme factors, component availability

2. **`oak_units`** - Unit documents
   - Fields: `unitSlug`, `unitTitle`, `lessonSlugs[]`, `topics[]` (categories), `sequenceIds[]`
   - Missing: Unit type classification, thread metadata, programme factors

3. **`oak_unit_rollup`** - Aggregated unit text for semantic search
   - Fields: Denormalized lesson text, unit metadata
   - Missing: Thread rollup, programme context

4. **`oak_sequences`** - Sequence documents
   - Fields: `sequenceSlug`, `phase`, `keyStages[]`, `years[]`, `unitSlugs[]`
   - Missing: Programme factor breakdown

5. **`oak_sequence_facets`** - Facet enrichment
   - Fields: Facet counts, year/key stage aggregations
   - Missing: Thread facets

**No thread index** - Threads are a primary ontology concept but not searchable.

### What Needs to Move to Type-Gen

According to the cardinal rule, ALL of the following must be generated:

1. **Request schemas**: Structured search, NL search, suggestions, filters
2. **Response schemas**: Hybrid results (lessons/units/sequences/multi-scope), suggestions, facets
3. **Index document schemas**: All five index types plus new thread index
4. **Enumerations**: SearchScope, SuggestScope, SearchIndexKind
5. **Type guards**: Runtime validation functions for all schemas
6. **Fixture builders**: Deterministic test data generators
7. **Helper types**: Meta objects, aggregation shapes, facet structures

---

## Why This Matters

### Cardinal Rule Compliance

From `.agent/directives-and-memory/rules.md`:

> ALL static data structures, types, type guards, Zod schemas, and other type related information MUST flow from the Open Curriculum OpenAPI schema in the SDK, and be generated at build/compile time, i.e. when `pnpm type-gen` is run. If the upstream OpenAPI schema changes, then running `pnpm type-gen` MUST be sufficient to bring all workspaces into alignment with the new schema.

**Current violation**: The search app defines ~2,000 LOC of schemas at runtime, completely bypassing type-gen. If the upstream API schema changes, there is no automated way to propagate those changes to search schemas.

**Impact**: Schema drift, maintenance burden, type safety violations, manual synchronization.

### Schema-First Execution

From `.agent/directives-and-memory/schema-first-execution.md`:

> The definitive source of truth for all data shapes is the OpenAPI schema. Types, validators, and runtime behavior MUST derive from this schema at compile time.

**Current violation**: Search app creates its own schemas independent of the OpenAPI source.

**Required solution**: Generate all schemas from the OpenAPI document at type-gen time, ensuring perfect alignment.

### Ontology Integration Enables Better Search

From `docs/architecture/curriculum-ontology.md`:

The curriculum ontology defines critical structures currently missing from search indices:

**Threads** - Vertical progression pathways:

- Example: "geometry-and-measure" thread spans Years 1-6 in primary maths
- Usage: Primary navigation tool on Oak website
- Missing from search: Cannot filter by thread, no thread search scope

**Programme Factors** - Contextual filtering hierarchy:

```text
Subject → Phase → Key Stage → Year → Pathway → Exam Board → Exam Subject → Tier
```

- Example: "AQA Biology GCSE Foundation Tier" requires all factors
- Missing from search: Cannot filter by tier, exam board, pathway

**Unit Types** - Classification for teacher understanding:

- Simple units, units with variants, optionality units
- Missing from search: No way to find "units with optionality"

**Structured Content Guidance** - Four categories with supervision levels:

- Categories: Resources, pupil, classroom, overarching
- Levels: 1-4 (increasing supervision)
- Missing from search: Cannot filter by supervision level or guidance type

**Lesson Components** - Availability flags:

- Eight components: Slide deck, video, starter quiz, exit quiz, worksheet, transcript, additional materials
- Missing from search: Cannot find "lessons with video and worksheet"

**Why this matters**:

- Teachers search by vertical progressions (threads)
- KS4 users need tier/exam board filtering
- Resource availability is critical for lesson planning
- Safeguarding requires content guidance filtering

### Performance Balanced with Comprehensive Relationships

**Goal**: Semantic search should be both **fast** and **powerful**.

**Fast**:

- RRF queries target specific indices
- Faceted filtering uses indexed fields
- p95 latency < 500ms for most queries

**Powerful**:

- Filter by any ontology dimension (thread, programme factors, unit type)
- Cross-cutting queries (e.g., "Year 3 geometry lessons with video")
- Relationship-aware results (thread progression, unit variants)

**Strategy**: Denormalize ontology fields into index documents to enable filtering without joins. Add fields incrementally, measuring performance impact.

---

## Goals and Success Criteria

### Overall Goals

1. **Schema-first compliance**: All types generated from OpenAPI schema
2. **Complete ontology integration**: Threads, programme factors, unit types, content guidance, component flags
3. **Zero functionality loss**: Existing search features continue working
4. **Improved search power**: New filtering and scoping capabilities
5. **Maintainability**: `pnpm type-gen` is sufficient for schema updates

### Success Criteria

#### Phase 1: Schema-First Migration

✅ All Zod schemas generated in SDK at `packages/sdks/oak-curriculum-sdk/src/types/generated/search/`
✅ Search app imports all types from SDK, zero runtime schema definitions
✅ `pnpm type-gen && pnpm build` succeeds with no type errors
✅ All existing functionality preserved (100% test pass rate)
✅ No `as`, `any`, `unknown`, `Record<string, unknown>` type shortcuts

#### Phase 2: Core Ontology Fields

✅ `oak_threads` index created and operational
✅ Thread fields in all indices: `thread_slugs[]`, `thread_titles[]`, `thread_orders[]`
✅ Programme factor fields in all indices: `programme_slugs[]`, `pathway`, `exam_board`, `exam_subject`, `tier`, `parent_subject`
✅ Thread filtering works: "Find all units in the 'number' thread"
✅ Programme factor filtering works: "Find Year 11 AQA Biology GCSE Foundation lessons"
✅ Thread search scope: `POST /api/search` with `scope: "threads"`

#### Phase 3: Ontology Enrichment

✅ Unit type classification: `unit_type` field with "simple" | "variant" | "optionality"
✅ Structured content guidance: Four categories, supervision levels 1-4
✅ Lesson component flags: Boolean fields for each of 8 components
✅ Filter by unit type: "Show me optionality units in Year 5 maths"
✅ Filter by supervision level: "Find lessons requiring level 3+ supervision"
✅ Filter by components: "Find lessons with video and exit quiz"
✅ Enhanced facets: Thread coverage, unit type distribution, component availability

#### Testing (All Phases)

✅ Unit tests for all generators, transforms, query builders (100% coverage goal)
✅ Integration tests for API routes with mocked Elasticsearch
✅ E2E tests for full search flows with real sandbox indices
✅ Quality gates pass: `format → type-check → lint → test → build`
✅ No type assertions, all types flow from schema

---

## Phase 1: Schema-First Migration

**Goal**: Migrate all search schemas from runtime to type-gen, following the cardinal rule.

**Duration**: 2-3 weeks

**Key Principle**: Minimize context switching by grouping related work into focused sessions.

### Session 1.1: Search Index Document Schema Generation

**Focus**: Create generators for Elasticsearch index document schemas.

**Implementation Tasks**:

1. **Create generator directory structure**

   ```text
   packages/sdks/oak-curriculum-sdk/type-gen/typegen/search-indices/
   ├── generate-index-documents.ts
   ├── generate-index-documents.unit.test.ts
   ├── index-document-templates.ts
   └── ontology-field-definitions.ts
   ```

2. **Define ontology field templates**
   - Create reusable field definitions for thread fields, programme factors, etc.
   - Export as constants to ensure consistency across indices

   ```typescript
   export const THREAD_FIELDS = {
     thread_slugs: { type: 'string[]', description: 'Thread slugs this entity appears in' },
     thread_titles: { type: 'string[]', description: 'Human-readable thread titles' },
     thread_orders: { type: 'number[]', description: 'Order within each thread' },
   };
   ```

3. **Implement index document generators**
   - `SearchLessonsIndexDoc`: Lessons with transcript, thread fields, component flags
   - `SearchUnitsIndexDoc`: Units with lesson refs, thread fields, programme factors
   - `SearchUnitRollupDoc`: Aggregated text with thread metadata
   - `SearchSequenceIndexDoc`: Sequences with programme factor breakdown
   - `SearchThreadIndexDoc`: NEW - Thread documents with unit rollups
   - `SearchSequenceFacetDoc`: Facet enrichment with thread coverage

4. **Generate TypeScript types and Zod schemas**
   - Output to `packages/sdks/oak-curriculum-sdk/src/types/generated/search/index-documents.ts`
   - Each index gets both a TypeScript type and a Zod schema
   - Include JSDoc comments with field descriptions

5. **Generate type guards**
   - `isSearchLessonsIndexDoc()`, etc.
   - Type-safe runtime validation

**TDD Approach**:

Write tests first:

```typescript
describe('generateIndexDocuments', () => {
  it('should generate SearchLessonsIndexDoc with all required fields', () => {
    const generated = generateIndexDocuments(apiSchema);
    expect(generated).toContain('export interface SearchLessonsIndexDoc');
    expect(generated).toContain('lessonSlug: string');
    expect(generated).toContain('thread_slugs: string[]');
    expect(generated).toContain('has_video: boolean');
  });

  it('should generate Zod schema for each index document', () => {
    const generated = generateIndexDocuments(apiSchema);
    expect(generated).toContain('export const SearchLessonsIndexDocSchema = z.object');
  });

  it('should include type guards for runtime validation', () => {
    const generated = generateIndexDocuments(apiSchema);
    expect(generated).toContain('export function isSearchLessonsIndexDoc');
  });
});
```

**Acceptance Criteria**:

- ✅ Generator creates all 6 index document types
- ✅ All generated types include ontology fields (threads, programme factors)
- ✅ Zod schemas validate correctly
- ✅ Type guards work at runtime
- ✅ `pnpm type-gen` completes without errors
- ✅ `pnpm type-check` passes in SDK package
- ✅ No `as`, `any`, or `unknown` in generated code

**Validation**:

```bash
cd packages/sdks/oak-curriculum-sdk
pnpm type-gen
pnpm type-check
pnpm test -- search-indices
```

### Session 1.2: Request/Response Schema Generation

**Focus**: Generate API request and response schemas.

**Implementation Tasks**:

1. **Create request schema generators**

   ```text
   type-gen/typegen/search-schemas/
   ├── generate-request-schemas.ts
   ├── generate-response-schemas.ts
   ├── generate-suggestion-schemas.ts
   └── __tests__/
   ```

2. **Generate request schemas**
   - `SearchStructuredRequestSchema`: Structured search with filters
   - `SearchNaturalLanguageRequestSchema`: Natural language input
   - `SearchSuggestionRequestSchema`: Type-ahead suggestions
   - All with full Zod validation and OpenAPI metadata

3. **Generate response schemas**
   - `SearchLessonsResponseSchema`: Hybrid RRF results for lessons
   - `SearchUnitsResponseSchema`: Hybrid results for units
   - `SearchSequencesResponseSchema`: Hybrid results for sequences
   - `SearchThreadsResponseSchema`: NEW - Thread search results
   - `SearchMultiScopeResponseSchema`: Multi-scope buckets
   - `SearchSuggestionResponseSchema`: Suggestion results with context

4. **Generate facet and aggregation schemas**
   - Reuse existing `SearchFacets` type
   - Add `ThreadFacet` type for thread coverage
   - Aggregation shapes with proper types (no `Record<string, unknown>`)

**TDD Approach**:

```typescript
describe('generateRequestSchemas', () => {
  it('should generate structured search request with thread filters', () => {
    const schema = generateRequestSchemas(apiSchema);
    expect(schema).toContain('thread?: string');
    expect(schema).toContain('tier?: "foundation" | "higher"');
    expect(schema).toContain('exam_board?: string');
  });

  it('should generate multi-scope response with thread bucket', () => {
    const schema = generateResponseSchemas(apiSchema);
    expect(schema).toContain('scope: "threads"');
    expect(schema).toContain('threads: SearchThreadsResponse');
  });
});
```

**Acceptance Criteria**:

- ✅ All request schemas generated with proper validation
- ✅ All response schemas generated with typed aggregations
- ✅ No `Record<string, unknown>` - all aggregations have specific types
- ✅ Zod schemas include `.openapi()` metadata for docs
- ✅ Generated schemas match runtime schema semantics exactly
- ✅ `pnpm type-gen && pnpm type-check` passes

**Validation**:

```bash
pnpm type-gen
pnpm type-check
pnpm test -- search-schemas
```

### Session 1.3: Update Search App to Consume Generated Schemas

**Focus**: Replace runtime schemas with SDK imports.

**Implementation Tasks**:

1. **Update app type imports**
   - Change `apps/oak-open-curriculum-semantic-search/src/types/oak.ts` to re-export from SDK

   ```typescript
   // OLD
   export {} from /* local types */ '../lib/hybrid-search/types';

   // NEW
   export * from '@oaknational/oak-curriculum-sdk/search';
   ```

2. **Replace API route schemas**
   - `app/api/search/route.ts`: Import `SearchStructuredRequestSchema` from SDK
   - `app/api/search/nl/route.ts`: Import `SearchNaturalLanguageRequestSchema`
   - `app/api/search/suggest/route.ts`: Import `SearchSuggestionRequestSchema`
   - Remove all local Zod schema definitions

3. **Update UI component imports**
   - `app/ui/structured-search.shared.ts`: Delete file, import from SDK
   - `app/ui/SearchResults.shared.tsx`: Import response types from SDK
   - `app/ui/client/useSearchController.ts`: Use SDK types

4. **Update library imports**
   - `src/lib/hybrid-search/types.ts`: Delete, import from SDK
   - `src/lib/suggestions/types.ts`: Delete, import from SDK
   - `src/lib/query-parser.ts`: Import `SearchParsedQuery` from SDK

5. **Fix type errors**
   - Run `pnpm type-check` to find all type errors
   - Fix each error by updating to SDK types
   - No type assertions (`as`) allowed - fix underlying types

**TDD Approach**:

Update existing tests to use SDK schemas:

```typescript
// OLD
import { SearchRequest } from '../structured-search.shared';

// NEW
import { SearchStructuredRequest } from '@oaknational/oak-curriculum-sdk/search';

describe('Search API', () => {
  it('should validate request with SDK schema', async () => {
    const result = SearchStructuredRequestSchema.safeParse(request);
    expect(result.success).toBe(true);
  });
});
```

**Acceptance Criteria**:

- ✅ Zero local schema definitions remain in search app
- ✅ All imports reference SDK-generated types
- ✅ `pnpm type-check` passes in search app
- ✅ All existing tests pass with SDK types
- ✅ No type assertions introduced during migration
- ✅ `pnpm build` succeeds

**Validation**:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm type-check
pnpm test
pnpm build
```

### Session 1.4: Remove Runtime Schema Definitions

**Focus**: Clean up and verify complete migration.

**Implementation Tasks**:

1. **Delete runtime schema files**
   - `app/ui/structured-search.shared.ts`
   - `src/lib/hybrid-search/types.ts` (keep query builders, delete types)
   - `src/lib/suggestions/types.ts`
   - Verify no imports reference deleted files

2. **Update OpenAPI registration**
   - `src/lib/openapi.schemas.ts`: Import schemas from SDK instead of defining
   - `src/lib/openapi.register.ts`: Verify all paths use SDK schemas

3. **Run full test suite**

   ```bash
   pnpm type-gen
   pnpm build
   pnpm type-check
   pnpm lint -- --fix
   pnpm test
   ```

4. **Verify no runtime schemas remain**
   - Grep for local Zod schema definitions
   - Ensure all `z.object({` references are imports, not definitions

**Acceptance Criteria**:

- ✅ No runtime Zod schemas in search app
- ✅ All schemas imported from SDK
- ✅ Full quality gate passes
- ✅ No functionality regressions
- ✅ Documentation updated reflecting SDK imports

**Validation**:

```bash
# Should find zero results
rg "export const.*Schema = z\\.object" apps/oak-open-curriculum-semantic-search/src
rg "export const.*Schema = z\\.object" apps/oak-open-curriculum-semantic-search/app

# Quality gates
pnpm -w type-gen
pnpm -F @oaknational/oak-open-curriculum-semantic-search type-check
pnpm -F @oaknational/oak-open-curriculum-semantic-search lint -- --fix
pnpm -F @oaknational/oak-open-curriculum-semantic-search test
pnpm -F @oaknational/oak-open-curriculum-semantic-search build
```

---

## Phase 2: Core Ontology Fields

**Goal**: Add thread and programme factor support to indices for vertical progression and contextual filtering.

**Duration**: 2-3 weeks

### Session 2.1: Thread Index and Embedded Fields

**Focus**: Create thread index and add thread fields to existing indices.

**Implementation Tasks**:

1. **Define thread index schema** (in SDK type-gen)

   ```typescript
   interface SearchThreadIndexDoc {
     thread_slug: string;
     thread_title: string;
     description?: string;
     subject_slugs: string[];
     unit_count: number;
     units: Array<{
       unit_slug: string;
       unit_title: string;
       order: number;
       key_stage: string;
       year: string;
     }>;
     years_span: string[]; // e.g., ["1", "2", "3"]
     key_stages_span: string[];
     progression_summary: string; // Aggregated text for semantic search
   }
   ```

2. **Add thread fields to existing index documents**
   - Update `SearchLessonsIndexDoc`, `SearchUnitsIndexDoc`, `SearchUnitRollupDoc`
   - Add `thread_slugs: string[]`, `thread_titles: string[]`, `thread_orders: number[]`

3. **Update Elasticsearch index mappings**
   - Add thread fields to mappings in `src/lib/indexing/index-mappings.ts`

   ```typescript
   thread_slugs: { type: 'keyword' },
   thread_titles: { type: 'text' },
   thread_orders: { type: 'integer' },
   ```

4. **Generate updated types**

   ```bash
   pnpm type-gen
   ```

**TDD Approach**:

```typescript
describe('Thread index schema', () => {
  it('should validate thread document structure', () => {
    const doc = {
      thread_slug: 'number',
      thread_title: 'Number',
      unit_count: 118,
      units: [{ unit_slug: 'counting-0-10', order: 0 /* ... */ }],
      years_span: ['R', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
      key_stages_span: ['ks1', 'ks2', 'ks3', 'ks4'],
      progression_summary: 'From counting 0-10 to surds and standard form...',
    };
    const result = SearchThreadIndexDocSchema.safeParse(doc);
    expect(result.success).toBe(true);
  });
});
```

**Acceptance Criteria**:

- ✅ `SearchThreadIndexDoc` schema generated
- ✅ Thread fields added to lessons, units, unit_rollup schemas
- ✅ Elasticsearch mappings updated
- ✅ Type validation tests pass
- ✅ `pnpm type-gen && pnpm type-check` passes

**Validation**:

```bash
pnpm type-gen
pnpm type-check
pnpm test -- thread-index
```

### Session 2.2: Thread Ingestion Pipeline

**Focus**: Extract thread data from API and populate indices.

**Implementation Tasks**:

1. **Create thread document transformer**
   - `src/lib/indexing/thread-document-transform.ts`
   - Fetch threads from SDK (`GET /threads`)
   - For each thread, fetch units (`GET /threads/:slug/units`)
   - Build thread document with progression summary

2. **Update existing document transformers**
   - `src/lib/indexing/lesson-document-transform.ts`: Extract thread info from lesson context
   - `src/lib/indexing/unit-document-transform.ts`: Extract thread info from unit metadata
   - Add thread fields to transformed documents

3. **Update bulk indexing**
   - `src/lib/indexing/bulk-ingest.ts`: Add thread ingestion step
   - Create `oak_threads` index before populating

4. **Add ingestion tests**
   - Mock SDK responses with fixture data
   - Test thread document creation
   - Test thread field extraction for lessons/units

**TDD Approach**:

```typescript
describe('Thread document transform', () => {
  it('should transform SDK thread response to index document', () => {
    const sdkThread = {
      threadSlug: 'number',
      threadTitle: 'Number',
      units: [
        /* unit data */
      ],
    };
    const doc = transformThreadToIndexDoc(sdkThread);
    expect(doc.thread_slug).toBe('number');
    expect(doc.unit_count).toBe(sdkThread.units.length);
    expect(doc.progression_summary).toContain('counting');
  });

  it('should extract thread fields from lesson data', () => {
    const lesson = {
      /* lesson with threads */
    };
    const doc = transformLessonToIndexDoc(lesson);
    expect(doc.thread_slugs).toContain('number');
    expect(doc.thread_titles).toContain('Number');
  });
});
```

**Acceptance Criteria**:

- ✅ Thread transformer extracts all fields correctly
- ✅ Lesson/unit transformers populate thread fields
- ✅ Bulk ingestion includes thread documents
- ✅ Transform tests pass with fixtures
- ✅ No network calls in unit tests

**Validation**:

```bash
pnpm test -- thread-transform
pnpm test -- lesson-transform
pnpm test -- bulk-ingest
```

### Session 2.3: Programme Factor Fields

**Focus**: Add programme factor filtering support.

**Implementation Tasks**:

1. **Add programme factor fields to index schemas** (in SDK type-gen)

   ```typescript
   interface ProgrammeFactorFields {
     programme_slugs: string[]; // All applicable programme slugs
     phase?: 'primary' | 'secondary';
     key_stage?: KeyStage;
     year?: string;
     pathway?: 'core' | 'gcse';
     exam_board?: 'aqa' | 'ocr' | 'edexcel' | 'eduqas' | 'edexcelb';
     exam_subject?: 'biology' | 'chemistry' | 'physics' | 'combined-science';
     tier?: 'foundation' | 'higher';
     parent_subject?: string; // For KS4 sciences
   }
   ```

2. **Update all index document types**
   - Add programme factor fields to lessons, units, sequences, threads

3. **Update Elasticsearch mappings**
   - Add programme factor fields with appropriate types (keyword for filters)

4. **Update document transformers**
   - Extract programme factors from sequence/unit metadata
   - Populate fields during ingestion

**TDD Approach**:

```typescript
describe('Programme factor extraction', () => {
  it('should extract all factors for KS4 science', () => {
    const unit = {
      programmeSlug: 'biology-secondary-ks4-year-11-gcse-aqa-foundation',
      /* ... */
    };
    const factors = extractProgrammeFactors(unit);
    expect(factors.phase).toBe('secondary');
    expect(factors.key_stage).toBe('ks4');
    expect(factors.year).toBe('11');
    expect(factors.pathway).toBe('gcse');
    expect(factors.exam_board).toBe('aqa');
    expect(factors.exam_subject).toBe('biology');
    expect(factors.tier).toBe('foundation');
  });
});
```

**Acceptance Criteria**:

- ✅ Programme factor fields in all schemas
- ✅ Elasticsearch mappings updated
- ✅ Extraction logic tested with fixtures
- ✅ All factor combinations validated
- ✅ `pnpm type-gen && pnpm type-check` passes

**Validation**:

```bash
pnpm type-gen
pnpm test -- programme-factors
```

### Session 2.4: Thread and Programme Filter Queries

**Focus**: Implement filtering by threads and programme factors.

**Implementation Tasks**:

1. **Update request schemas** (in SDK type-gen)

   ```typescript
   interface SearchFilters {
     // Existing
     subject?: string;
     key_stage?: string;
     year?: string;
     category?: string;

     // NEW - Thread filtering
     thread?: string;

     // NEW - Programme factors
     tier?: 'foundation' | 'higher';
     exam_board?: string;
     exam_subject?: string;
     pathway?: 'core' | 'gcse';
   }
   ```

2. **Update RRF query builders**
   - `src/lib/hybrid-search/rrf-query-builders.ts`
   - Add thread filtering to lesson/unit/sequence queries
   - Add programme factor filters with proper boolean logic

3. **Update API routes**
   - `app/api/search/route.ts`: Accept new filter parameters
   - Validate using generated schemas

4. **Add query builder tests**

   ```typescript
   describe('Thread filtering', () => {
     it('should filter by thread slug', () => {
       const query = buildLessonQuery({ thread: 'number' });
       expect(query.query.bool.filter).toContainEqual({
         term: { thread_slugs: 'number' },
       });
     });

     it('should filter by tier for KS4', () => {
       const query = buildLessonQuery({ tier: 'foundation' });
       expect(query.query.bool.filter).toContainEqual({
         term: { tier: 'foundation' },
       });
     });
   });
   ```

**TDD Approach**:

Write query builder tests first, then implement filters.

**Acceptance Criteria**:

- ✅ Thread filter works for all scopes
- ✅ Programme factor filters work independently and combined
- ✅ Query builder tests pass
- ✅ API routes accept and validate new parameters
- ✅ No type errors

**Validation**:

```bash
pnpm test -- rrf-query-builders
pnpm test -- api/search
```

### Session 2.5: Thread Search Scope

**Focus**: Add threads as a searchable scope.

**Implementation Tasks**:

1. **Update SearchScope enum** (in SDK type-gen)

   ```typescript
   type SearchScope = 'lessons' | 'units' | 'sequences' | 'threads' | 'all';
   ```

2. **Implement thread-specific query**
   - `src/lib/hybrid-search/thread-query.ts`
   - Build RRF query for thread index
   - Include semantic search on `progression_summary` field
   - Faceted filtering by subject, key stage, year

3. **Update multi-scope search**
   - `src/lib/run-hybrid-search.ts`
   - Add thread bucket to multi-scope results
   - Include thread facet counts

4. **Update API route**
   - Handle `scope: "threads"` requests
   - Return thread results with proper response schema

**TDD Approach**:

```typescript
describe('Thread search', () => {
  it('should search threads by query', async () => {
    const result = await searchThreads({ text: 'geometry', scope: 'threads' });
    expect(result.scope).toBe('threads');
    expect(result.results[0].thread_slug).toBeDefined();
  });

  it('should include thread results in multi-scope search', async () => {
    const result = await searchMultiScope({ text: 'number', scope: 'all' });
    expect(result.threads).toBeDefined();
    expect(result.threads.total_results).toBeGreaterThan(0);
  });
});
```

**Acceptance Criteria**:

- ✅ Thread search returns relevant threads
- ✅ Multi-scope includes thread bucket
- ✅ Faceting works for threads
- ✅ E2E tests with sandbox index pass
- ✅ Performance acceptable (<500ms p95)

**Validation**:

```bash
pnpm test -- thread-search
# Manual E2E with sandbox
pnpm e2e:thread-search
```

---

## Phase 3: Ontology Enrichment

**Goal**: Complete ontology representation for comprehensive search and filtering.

**Duration**: 2-3 weeks

### Session 3.1: Unit Classification Fields

**Focus**: Add unit type classification.

**Implementation Tasks**:

1. **Add unit type fields to schema** (SDK type-gen)

   ```typescript
   interface UnitClassification {
     unit_type: 'simple' | 'variant' | 'optionality';
     has_variants: boolean;
     has_optionality: boolean;
     variant_context?: string; // e.g., "tier-based", "pathway-based"
   }
   ```

2. **Implement classification logic**
   - `src/lib/indexing/unit-classification.ts`
   - Detect simple units (single lesson sequence)
   - Detect variants (unitOptions with different lessons)
   - Detect optionality (unitOptions with teacher choice)

3. **Update unit ingestion**
   - Classify units during document transformation
   - Populate classification fields

4. **Add filtering support**
   - Update query builders to filter by `unit_type`
   - Update request schemas to accept unit type filter

**TDD Approach**:

```typescript
describe('Unit classification', () => {
  it('should classify simple unit', () => {
    const unit = { unitOptions: null };
    const classification = classifyUnit(unit);
    expect(classification.unit_type).toBe('simple');
  });

  it('should classify variant unit', () => {
    const unit = {
      unitOptions: [
        /* variants with different lessons */
      ],
    };
    const classification = classifyUnit(unit);
    expect(classification.unit_type).toBe('variant');
    expect(classification.has_variants).toBe(true);
  });

  it('should classify optionality unit', () => {
    const unit = {
      unitOptions: [
        /* options with same structure */
      ],
    };
    const classification = classifyUnit(unit);
    expect(classification.unit_type).toBe('optionality');
  });
});
```

**Acceptance Criteria**:

- ✅ Classification logic correctly identifies all three types
- ✅ Unit documents include classification fields
- ✅ Filtering by unit type works
- ✅ Unit tests pass
- ✅ E2E tests validate classification

**Validation**:

```bash
pnpm test -- unit-classification
pnpm test -- unit-filter
```

### Session 3.2: Structured Content Guidance

**Focus**: Replace simple content guidance array with structured object.

**Implementation Tasks**:

1. **Define structured content guidance schema** (SDK type-gen)

   ```typescript
   interface ContentGuidanceStructured {
     resources: string[]; // Equipment, materials, physical resources
     pupil: string[]; // Pupil sensitivities, topics, themes
     classroom: string[]; // Classroom environment, setup
     overarching: string[]; // Broad safeguarding, policies
   }

   interface ContentGuidanceFields {
     content_guidance_structured?: ContentGuidanceStructured;
     supervision_level?: 1 | 2 | 3 | 4;
   }
   ```

2. **Parse and categorize content guidance**
   - `src/lib/indexing/content-guidance-parser.ts`
   - Map guidance strings to categories based on keywords
   - Extract supervision level from lesson metadata

3. **Update lesson documents**
   - Replace `content_guidance: string[]` with `content_guidance_structured`
   - Add `supervision_level` field

4. **Add filtering support**
   - Filter by supervision level: "Find lessons requiring level 3+"
   - Filter by category presence

**TDD Approach**:

```typescript
describe('Content guidance parsing', () => {
  it('should categorize guidance strings', () => {
    const guidance = [
      'Requires scissors and glue',
      'Contains themes of loss',
      'Small group setting recommended',
      'Follow safeguarding policy',
    ];
    const structured = parseContentGuidance(guidance);
    expect(structured.resources).toContain('Requires scissors and glue');
    expect(structured.pupil).toContain('Contains themes of loss');
    expect(structured.classroom).toContain('Small group setting recommended');
    expect(structured.overarching).toContain('Follow safeguarding policy');
  });

  it('should extract supervision level', () => {
    const lesson = { supervisionLevel: 3 };
    const level = extractSupervisionLevel(lesson);
    expect(level).toBe(3);
  });
});
```

**Acceptance Criteria**:

- ✅ Content guidance correctly categorized
- ✅ Supervision level extracted accurately
- ✅ Filtering works for both fields
- ✅ Parser tests pass with varied inputs
- ✅ E2E tests validate filtering

**Validation**:

```bash
pnpm test -- content-guidance-parser
pnpm test -- supervision-level-filter
```

### Session 3.3: Lesson Component Availability

**Focus**: Add boolean flags for lesson component availability.

**Implementation Tasks**:

1. **Add component availability fields** (SDK type-gen)

   ```typescript
   interface LessonComponentAvailability {
     has_slide_deck: boolean;
     has_video: boolean;
     has_starter_quiz: boolean;
     has_exit_quiz: boolean;
     has_worksheet: boolean;
     has_transcript: boolean;
     has_additional_materials: boolean;
     has_supplementary_materials: boolean;
   }
   ```

2. **Implement component detection**
   - `src/lib/indexing/component-detection.ts`
   - Check lesson assets for each component type
   - Set boolean flags based on presence

3. **Update lesson ingestion**
   - Detect components during transformation
   - Populate availability fields

4. **Add component filtering**
   - Update query builders to filter by component availability
   - Support combinations: "lessons with video AND exit quiz"

**TDD Approach**:

```typescript
describe('Component detection', () => {
  it('should detect video component', () => {
    const lesson = {
      assets: [{ type: 'video', url: 'https://...' }],
    };
    const availability = detectComponents(lesson);
    expect(availability.has_video).toBe(true);
  });

  it('should detect multiple components', () => {
    const lesson = {
      assets: [{ type: 'video' }, { type: 'worksheet' }, { type: 'exit-quiz' }],
    };
    const availability = detectComponents(lesson);
    expect(availability.has_video).toBe(true);
    expect(availability.has_worksheet).toBe(true);
    expect(availability.has_exit_quiz).toBe(true);
  });
});
```

**Acceptance Criteria**:

- ✅ All 8 component flags detected correctly
- ✅ Lesson documents include availability fields
- ✅ Filtering works for any combination
- ✅ Detection tests pass
- ✅ E2E tests validate component filters

**Validation**:

```bash
pnpm test -- component-detection
pnpm test -- component-filter
```

### Session 3.4: Enhanced Facets

**Focus**: Add ontology information to facets.

**Implementation Tasks**:

1. **Update facet schema** (SDK type-gen)

   ```typescript
   interface SequenceFacet {
     // Existing fields
     sequenceSlug: string;
     yearGroupSlug: string;
     /* ... */

     // NEW - Thread coverage
     threads?: Array<{
       thread_slug: string;
       thread_title: string;
       unit_count_in_thread: number;
     }>;

     // NEW - Unit type distribution
     unit_types?: {
       simple: number;
       variant: number;
       optionality: number;
     };
   }
   ```

2. **Update facet generation**
   - `src/lib/indexing/sequence-facet-utils.ts`
   - Aggregate thread information
   - Count unit types

3. **Return enhanced facets in search responses**
   - Include thread coverage in facet objects
   - Show unit type distribution

**TDD Approach**:

```typescript
describe('Enhanced facets', () => {
  it('should include thread coverage in facets', () => {
    const units = [{ threads: ['number', 'algebra'] }, { threads: ['number', 'geometry'] }];
    const facets = generateFacets(units);
    expect(facets.threads).toContainEqual({
      thread_slug: 'number',
      thread_title: 'Number',
      unit_count_in_thread: 2,
    });
  });

  it('should include unit type distribution', () => {
    const units = [{ unit_type: 'simple' }, { unit_type: 'simple' }, { unit_type: 'variant' }];
    const facets = generateFacets(units);
    expect(facets.unit_types).toEqual({
      simple: 2,
      variant: 1,
      optionality: 0,
    });
  });
});
```

**Acceptance Criteria**:

- ✅ Facets include thread coverage
- ✅ Facets include unit type counts
- ✅ Facet generation tests pass
- ✅ Search responses include enhanced facets
- ✅ Performance remains acceptable

**Validation**:

```bash
pnpm test -- facet-generation
pnpm test -- search-with-facets
```

---

## Testing and Validation Strategy

Following `.agent/directives-and-memory/testing-strategy.md`, the search service uses a three-tier testing approach.

### Unit Tests (Pure Functions, `.unit.test.ts`)

**What to test**:

- Schema generators (SDK type-gen)
- Document transform functions
- Query builder functions
- Field extraction helpers (programme factors, unit classification, etc.)
- Classification logic
- Parsing logic (content guidance)

**Characteristics**:

- No IO operations
- No mocks
- Pure function testing
- Fast execution (<1ms per test)

**Example**:

```typescript
describe('extractProgrammeFactors (unit test)', () => {
  it('should extract all factors from programme slug', () => {
    const input = 'biology-secondary-ks4-year-11-gcse-aqa-foundation';
    const factors = extractProgrammeFactors(input);

    expect(factors.subject).toBe('biology');
    expect(factors.phase).toBe('secondary');
    expect(factors.key_stage).toBe('ks4');
    expect(factors.year).toBe('11');
    expect(factors.pathway).toBe('gcse');
    expect(factors.exam_board).toBe('aqa');
    expect(factors.tier).toBe('foundation');
  });
});
```

### Integration Tests (Code Integration, `.integration.test.ts`)

**What to test**:

- Generated schema validation
- API route handlers with mocked Elasticsearch
- Ingestion pipeline with mocked SDK client
- Query builders with mocked ES client
- Schema consumption (app imports SDK types correctly)

**Characteristics**:

- Simple mocks injected as arguments
- No actual network calls
- Tests integration between modules
- Medium speed (10-100ms per test)

**Example**:

```typescript
describe('Search API route (integration test)', () => {
  it('should validate request with SDK schema and call ES', async () => {
    const mockEsClient = {
      search: vi.fn().mockResolvedValue({ hits: { hits: [] } }),
    };

    const response = await POST(
      {
        json: async () => ({ text: 'photosynthesis', scope: 'lessons' }),
      },
      mockEsClient,
    );

    expect(mockEsClient.search).toHaveBeenCalled();
    expect(response.status).toBe(200);
  });
});
```

### E2E Tests (Running System, `.e2e.test.ts`)

**What to test**:

- Full search flow with real Elasticsearch sandbox
- Index creation and bulk ingestion
- Multi-scope searches
- Suggestion endpoints
- Thread search
- Faceted navigation
- Component filtering

**Characteristics**:

- Real Elasticsearch instance (sandbox)
- Actual SDK calls (can be stubbed with recorded responses)
- Side effects (creates indices, inserts documents)
- Not run in CI (manual execution)
- Slow (1-10s per test)

**Example**:

```typescript
describe('Full search flow (E2E test)', () => {
  beforeAll(async () => {
    await createIndices(esClient);
    await ingestFixtures(esClient);
  });

  it('should search threads and return results', async () => {
    const response = await fetch('http://localhost:3000/api/search', {
      method: 'POST',
      body: JSON.stringify({ text: 'geometry', scope: 'threads' }),
    });

    const result = await response.json();
    expect(result.scope).toBe('threads');
    expect(result.results).toHaveLength(greaterThan(0));
  });

  afterAll(async () => {
    await deleteIndices(esClient);
  });
});
```

### Quality Gate Commands

All work must pass these commands in sequence:

```bash
# From repo root, one at a time, all must pass
pnpm type-gen           # Generate types from schema
pnpm build              # Production build
pnpm type-check         # TypeScript validation
pnpm lint:fix           # ESLint with auto-fix (or pnpm lint for verify)
pnpm format:root        # Format code
pnpm markdownlint:root  # Lint markdown
pnpm test               # Unit + integration tests
pnpm test:e2e           # E2E tests
pnpm test:e2e:built     # E2E tests on built artifacts
pnpm test:ui            # UI tests (Playwright)
pnpm smoke:dev:stub     # Smoke tests (stubbed)
```

**Shorthand commands**:

- `pnpm make` - Build, lint:fix, format (development workflow)
- `pnpm qg` - Full quality gate verification (CI workflow)
- `pnpm check` - Clean rebuild + full QG (thorough verification)

### Session-Specific Validation

Each session has its own validation commands:

**Phase 1 sessions**:

```bash
# After Session 1.1 (Schema generation)
pnpm type-gen
pnpm -F @oaknational/oak-curriculum-sdk type-check
pnpm -F @oaknational/oak-curriculum-sdk test -- search-indices

# After Session 1.3 (App migration)
pnpm -F @oaknational/oak-open-curriculum-semantic-search type-check
pnpm -F @oaknational/oak-open-curriculum-semantic-search test
```

**Phase 2 sessions**:

```bash
# After Session 2.2 (Thread ingestion)
pnpm test -- thread-transform
pnpm test -- bulk-ingest

# After Session 2.5 (Thread search scope)
pnpm test -- thread-search
# Manual E2E
pnpm e2e:thread-search
```

### Test Coverage Goals

- **Unit tests**: 100% coverage of pure functions
- **Integration tests**: All API routes, major pipelines
- **E2E tests**: Critical user journeys (structured search, NL search, thread search)

### Fixture Strategy

**Unit tests**: Use simple inline data
**Integration tests**: Use `vitest-mock-extended` or simple fakes
**E2E tests**: Use sandbox fixtures from `scripts/sandbox/fixtures/`

---

## Dependencies and Prerequisites

### Completed Dependencies ✅

1. **Curriculum ontology documentation**
   - Location: `docs/architecture/curriculum-ontology.md`
   - Status: ✅ COMPLETE (2025-11-11)
   - Provides: Entity definitions, relationships, official Oak API alignment

2. **Cardinal rule architecture**
   - Location: `.agent/directives-and-memory/rules.md`
   - Status: ✅ COMPLETE
   - Defines: Type-gen requirement, schema-first mandate

3. **Schema-first execution patterns**
   - Location: `.agent/directives-and-memory/schema-first-execution.md`
   - Status: ✅ COMPLETE
   - Defines: Compile-time generation, no runtime types

4. **Testing strategy**
   - Location: `.agent/directives-and-memory/testing-strategy.md`
   - Status: ✅ COMPLETE
   - Defines: Unit/integration/E2E patterns

### Active Dependencies

1. **SDK type-gen infrastructure**
   - Status: ✅ COMPLETE
   - All 13 search modules generated
   - Thread schema generation complete

2. **SDK Synonym Export**
   - Status: ✅ COMPLETE
   - `buildElasticsearchSynonyms()` and `buildSynonymLookup()` in SDK
   - Static `synonyms.json` deleted

3. **Elasticsearch Serverless**
   - Status: 🚨 BLOCKING
   - Instance provisioned but no indexes created
   - See `.agent/prompts/elasticsearch-serverless-deployment.prompt.md`

4. **OpenAI API access**
   - Status: ✅ AVAILABLE
   - Usage: Natural language query parsing
   - Note: Can be stubbed for testing

### Future Dependencies

1. **Aggregated tools refactor**
   - Status: ⏳ PLANNED
   - Location: `.agent/plans/curriculum-ontology-resource-plan.md` Sprint 0
   - Requirement: Prerequisite for MCP integration (post Phase 3)

2. **Production Elasticsearch cluster**
   - Status: ⏳ TBD
   - Requirement: Needed for production deployment
   - Note: Not required for development/testing

---

## Risk Management

### Technical Risks

#### 1. Schema Migration Complexity (Medium)

**Risk**: Moving ~2,000 LOC of schemas from runtime to type-gen could introduce subtle behavioral changes.

**Likelihood**: Medium
**Impact**: High (breaks search functionality)

**Mitigation**:

- Phased migration with parallel schema validation
- Comprehensive test suite before cutover
- Fixture coverage matrix ensuring all scenarios tested
- Manual QA of critical flows

**Indicators**:

- Test failures after schema migration
- Type errors during `pnpm type-check`
- Behavioral differences in E2E tests

#### 2. Elasticsearch Performance with Ontology Fields (Low-Medium)

**Risk**: Adding many denormalized fields could degrade query performance or increase index size significantly.

**Likelihood**: Low
**Impact**: Medium (slower queries)

**Mitigation**:

- Add fields incrementally, measuring performance
- Use appropriate field types (keyword vs text)
- Profile queries with Elasticsearch explain API
- Load test with realistic data volumes

**Indicators**:

- p95 latency > 500ms
- Index size grows >2x
- Query timeouts

#### 3. Type-Gen Generator Complexity (Medium)

**Risk**: Generating complex nested Zod schemas with proper validation could be error-prone.

**Likelihood**: Medium
**Impact**: Medium (blocks migration)

**Mitigation**:

- TDD approach for all generators
- Start with simple schemas, add complexity incrementally
- Extensive unit test coverage
- Validate generated code compiles and matches runtime behavior

**Indicators**:

- Generated schemas don't validate correctly
- Type errors in generated code
- Mismatches between generated and runtime schemas

### Operational Risks

#### 4. Breaking Changes During Migration (Medium)

**Risk**: Existing search functionality could break during schema migration, affecting users.

**Likelihood**: Medium
**Impact**: High (search stops working)

**Mitigation**:

- Maintain runtime schemas until cutover validated
- Feature flag for schema source (SDK vs runtime)
- Comprehensive E2E tests before cutover
- Rollback plan (revert to runtime schemas)

**Indicators**:

- E2E tests fail
- User-reported search errors
- Type errors in production

#### 5. Development Velocity During Refactor (Low)

**Risk**: Large refactor could slow feature development.

**Likelihood**: Low
**Impact**: Low (delays timeline)

**Mitigation**:

- Clear phase boundaries with defined completion criteria
- Well-documented sessions minimizing context switching
- Regular progress updates
- Defer new features until migration complete

**Indicators**:

- Sessions taking >2x estimated time
- Frequent context switching
- Blockers not resolved quickly

### Risk Monitoring

**Weekly Review**:

- Check progress against plan timeline
- Review test pass rates
- Monitor technical debt accumulation
- Identify blockers

**Escalation Triggers**:

- Any phase exceeds planned duration by >50%
- Test pass rate <95%
- Performance degradation >50% from baseline
- Type-gen generator issues not resolved in 1 week

---

---

## Observability and Error Tracking

### Overview

The search service requires comprehensive observability for production readiness. This includes error tracking, performance monitoring, and zero-hit telemetry.

**Related Plans:**

- [Logger Sentry & OpenTelemetry Integration Plan](../../observability/logger-sentry-otel-integration-plan.md) - Comprehensive plan for integrating Sentry and OTel into the logger
- [Logger Enhancement Plan](../../archive/logger-enhancement-plan.md) - Base logger functionality and error enrichment

### Current Observability

**Zero-Hit Telemetry**:

- Location: `src/lib/observability/zero-hit-store.ts`
- Captures searches returning zero results
- Stores in Elasticsearch for analysis
- Admin dashboard displays zero-hit trends

**Logging**:

- Uses [`@oaknational/mcp-logger`](../../../packages/libs/logger/README.md) for structured logging
- OpenTelemetry-format JSON logs (PascalCase fields)
- High-precision timing with `startTimer()`
- Error enrichment with `enrichError(error, context)`
- Correlation ID support via child loggers
- Console output in development, JSON logs in production

**Performance**:

- No systematic performance monitoring
- Manual timing of Elasticsearch queries
- No alerting on slow queries

### Enhanced Observability Integration

#### Logger Integration

The search service will use `@oaknational/mcp-logger` as the foundation for all observability:

```typescript
// src/lib/logger.ts
import {
  UnifiedLogger,
  parseLogLevel,
  logLevelToSeverityNumber,
  buildResourceAttributes,
  startTimer,
  enrichError,
  type ErrorContext,
} from '@oaknational/mcp-logger';
import { createNodeStdoutSink } from '@oaknational/mcp-logger/node';

// Create logger instance
const level = parseLogLevel(process.env.LOG_LEVEL, 'INFO');
export const logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber(level),
  resourceAttributes: buildResourceAttributes(
    process.env,
    'oak-open-curriculum-semantic-search',
    process.env.npm_package_version || '1.0.0',
  ),
  context: {},
  stdoutSink: createNodeStdoutSink(),
  fileSink: null, // Next.js uses stdout-only
});

// Create child loggers with correlation IDs
export function createCorrelatedLogger(correlationId: string) {
  return logger.child({ correlationId });
}
```

**Usage in API Routes**:

```typescript
// app/api/search/route.ts
import { logger, createCorrelatedLogger } from '@/lib/logger';
import { startTimer, enrichError, type ErrorContext } from '@oaknational/mcp-logger';

export async function POST(request: Request) {
  const timer = startTimer();
  const correlationId = request.headers.get('x-correlation-id') || generateCorrelationId();
  const childLogger = createCorrelatedLogger(correlationId);

  try {
    childLogger.info('Search request received', {
      scope: body.scope,
      filters: body.filters,
    });

    const results = await performSearch(body);
    const duration = timer.end();

    childLogger.info('Search completed', {
      hitCount: results.hits.total.value,
      duration: duration.formatted,
      durationMs: duration.ms,
    });

    return Response.json(results);
  } catch (error) {
    const duration = timer.end();
    const errorContext: ErrorContext = {
      correlationId,
      duration,
      requestMethod: 'POST',
      requestPath: '/api/search',
    };
    const enrichedError = enrichError(error as Error, errorContext);

    childLogger.error('Search failed', enrichedError, {
      scope: body.scope,
      duration: duration.formatted,
    });

    throw error;
  }
}
```

#### Sentry & OpenTelemetry Integration

**Scope**: Error tracking and distributed tracing for API routes, Elasticsearch queries, and ingestion pipelines.

**Implementation Status**: 🚧 Planned - see [Logger Sentry & OpenTelemetry Integration Plan](../../observability/logger-sentry-otel-integration-plan.md)

**Integration Approach**:

Once the logger integration is complete, Sentry and OpenTelemetry will be initialized through `@oaknational/mcp-logger/nextjs`:

```typescript
// instrumentation.ts (Next.js root)
import { initSentryNextjsServer, buildSentryOptionsFromEnv } from '@oaknational/mcp-logger/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const options = buildSentryOptionsFromEnv(process.env);
    if (options) {
      initSentryNextjsServer(options);
    }
  }
}
```

**Alternative** (until logger integration is complete):

```typescript
// src/lib/sentry.config.ts
import * as Sentry from '@sentry/nextjs';
import { readEnv } from './env';

export function initSentry() {
  const env = readEnv();

  if (!env.SENTRY_DSN) {
    console.warn('Sentry DSN not configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT || 'development',
    tracesSampleRate: parseFloat(env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    profilesSampleRate: parseFloat(env.SENTRY_PROFILES_SAMPLE_RATE || '0.1'),
    integrations: [Sentry.httpIntegration()],
  });
}
```

**API Route Wrapping**:

```typescript
import { withSentry } from '@sentry/nextjs';

export const POST = withSentry(async (request: Request) => {
  try {
    // Search logic
    return Response.json(results);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { endpoint: 'search', scope: request.scope },
    });
    throw error;
  }
});
```

**Elasticsearch Query Tracing** (with OpenTelemetry):

```typescript
import { withSpan } from '@oaknational/mcp-logger/node'; // Once logger OTel integration is complete

async function performSearch(query: SearchQuery, correlationId: string) {
  return withSpan(
    {
      name: 'elasticsearch.search',
      operation: `search.${query.scope}`,
      correlationId,
      attributes: {
        'search.scope': query.scope,
        'search.query': query.text,
        'search.filters': JSON.stringify(query.filters),
      },
    },
    async (span) => {
      const result = await esClient.search(esQuery);

      // Add result metadata to span
      span.setAttribute('search.hits', result.hits.total.value);
      span.setAttribute('search.took_ms', result.took);

      return result;
    },
  );
}
```

**Alternative** (until logger OTel integration is complete):

```typescript
async function performSearch(query: SearchQuery) {
  return Sentry.startSpan(
    {
      op: 'elasticsearch.search',
      name: `Search ${query.scope}`,
      attributes: {
        'search.scope': query.scope,
        'search.query': query.text,
        'search.filters': JSON.stringify(query.filters),
      },
    },
    async () => {
      const result = await esClient.search(esQuery);

      Sentry.setMeasurement('search.duration', result.took, 'millisecond');
      Sentry.setMeasurement('search.hits', result.hits.total.value, 'count');

      return result;
    },
  );
}
```

#### Environment Variables

```bash
# .env
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1   # 10% of requests
SENTRY_PROFILES_SAMPLE_RATE=0.1  # 10% of traces
```

#### Testing Strategy

**Unit Tests**:

```typescript
describe('Sentry configuration', () => {
  it('should not initialize without DSN', () => {
    const spy = vi.spyOn(console, 'warn');
    initSentry({ SENTRY_DSN: undefined });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Sentry DSN'));
  });

  it('should use provided sample rates', () => {
    const config = initSentry({
      SENTRY_DSN: 'https://test',
      SENTRY_TRACES_SAMPLE_RATE: '0.5',
    });
    expect(config.tracesSampleRate).toBe(0.5);
  });
});
```

**Integration Tests**:

```typescript
describe('API error tracking', () => {
  it('should capture exceptions to Sentry', async () => {
    const captureSpy = vi.spyOn(Sentry, 'captureException');

    // Trigger error
    await expect(POST(invalidRequest)).rejects.toThrow();

    expect(captureSpy).toHaveBeenCalled();
  });
});
```

#### Observability Metrics

**Error Tracking**:

- API route errors
- Elasticsearch connection errors
- Schema validation failures
- Ingestion pipeline errors

**Performance Monitoring**:

- Search query latency (p50, p95, p99)
- Elasticsearch query time
- Document transformation time
- API route response time

**Custom Metrics**:

- Zero-hit rate
- Search success rate
- Facet usage
- Filter combinations

#### Alerting (Future)

**Alert Conditions**:

- Error rate > 5% (5-minute window)
- p95 latency > 1000ms
- Zero-hit rate > 50%
- Elasticsearch connection failures

**Alert Channels**:

- Email notifications
- Slack integration
- PagerDuty (production only)

### Zero-Hit Dashboard

**Current Implementation**:

- Elasticsearch index: `oak_zero_hit_events`
- Admin UI: `/admin` displays recent zero-hits
- Fields: query, scope, filters, timestamp, user_id (optional)

**Future Enhancements**:

- Aggregate by query patterns
- Suggest alternative queries
- Feed back to improve search
- Ontology-aware analysis (zero hits by thread/programme)

### Performance Monitoring Goals

**Target Metrics**:

- p50 latency: <200ms
- p95 latency: <500ms
- p99 latency: <1000ms
- Error rate: <1%
- Zero-hit rate: <30%

**Monitoring Tools**:

- Sentry (optional)
- Built-in timing logs
- Elasticsearch slow query log
- Next.js analytics

---

## Appendix: Related Documentation

### Planning Documents

- [Semantic Search Overview](../semantic-search-overview.md)
- [Schema Migration Map](../archive/superseded/search-migration-map.md)
- [Schema Inventory](../archive/superseded/search-schema-inventory.md)
- [Generator Specification](../search-generator-spec.md)

### Architecture

- [Curriculum Ontology](../../../docs/architecture/curriculum-ontology.md)
- [OpenAPI Pipeline](../../../docs/architecture/openapi-pipeline.md)

### Guidance

- [Testing Strategy](../../../.agent/directives-and-memory/testing-strategy.md)
- [Schema-First Execution](../../../directives-and-memory/schema-first-execution.md)
- [Cardinal Rule](../../../directives-and-memory/rules.md)

### Application

- [Semantic Search App README](../../../../apps/oak-open-curriculum-semantic-search/README.md)

### Archived Plans

- [Archive Index](../archive/README.md)

---

## Document History

- 2025-12-05: Updated to reflect ES Serverless deployment complete, quality gates updated
- 2025-11-11: Created comprehensive implementation plan
- 2025-11-11: Defined all phases and sessions
- 2025-11-11: Integrated ontology requirements
- 2025-11-11: Added complete testing strategy
