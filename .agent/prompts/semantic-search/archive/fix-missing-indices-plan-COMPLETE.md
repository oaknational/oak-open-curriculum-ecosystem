# Fix Missing Index Implementation Plan

**Date**: 2025-12-08  
**Completed**: 2025-12-09  
**Status**: ✅ COMPLETE  
**Priority**: Was CRITICAL - Now resolved  
**Discovered During**: Audit of planned vs. implemented features

---

## Executive Summary

**All gaps fixed.** During implementation of Phase 1B (RRF API Update), an audit revealed incomplete implementations. These have all been resolved:

| Index             | Original Gap         | Resolution                              |
| ----------------- | -------------------- | --------------------------------------- |
| `oak_sequences`   | No document creation | ✅ Document builder created, integrated |
| `oak_threads`     | No mapping, no docs  | ✅ Mapping + builder + API integration  |
| Reference indices | Not defined          | ✅ Mappings + builders ready (Phase 3)  |

**Reference indices note**: `oak_ref_subjects`, `oak_ref_key_stages`, `oak_curriculum_glossary` will be populated in Phase 3 using existing static data from `ontology-data.ts` - no stats extraction during ingestion needed.

---

## Gap Analysis

### `oak_sequences` Index

| Component               | Status          | Location                                                       |
| ----------------------- | --------------- | -------------------------------------------------------------- |
| Field definitions       | ✅ 14 fields    | `SEQUENCES_INDEX_FIELDS` in `field-definitions/curriculum.ts`  |
| ES mapping generator    | ✅ Exists       | `createSequencesMappingModule()` in `es-mapping-generators.ts` |
| `OAK_SEQUENCES_MAPPING` | ✅ Generated    | Output of type-gen                                             |
| Index created in ES     | ✅ Shows 0 docs | Confirmed via ES Serverless                                    |
| **Document creation**   | ❌ **MISSING**  | `buildPairDocuments()` has no `sequenceOps`                    |
| **API data source**     | ✅ Available    | `/subjects` endpoint returns `sequenceSlugs[]`                 |

### `oak_threads` Index

| Component                 | Status               | Location                                                    |
| ------------------------- | -------------------- | ----------------------------------------------------------- |
| Field definitions         | ✅ 7 fields          | `THREADS_INDEX_FIELDS` in `field-definitions/curriculum.ts` |
| Zod schema                | ✅ Generated         | `SearchThreadIndexDocSchema`                                |
| **ES mapping generator**  | ❌ **MISSING**       | No `createThreadsMappingModule()`                           |
| **`OAK_THREADS_MAPPING`** | ❌ **NOT GENERATED** | N/A                                                         |
| Index created in ES       | ❌ Not created       | Missing mapping                                             |
| **Document creation**     | ❌ **MISSING**       | No thread ingestion code                                    |
| **API data source**       | ✅ Available         | `/threads` and `/threads/{slug}/units` endpoints            |

---

## Implementation Approach

### First Question: Could it be simpler?

**YES.** We will implement the simpler approach:

1. **`oak_sequences`**: Create documents from data already fetched during lesson/unit ingestion (sequence slugs are in the response)
2. **`oak_threads`**:
   - Option A: Fetch from `/threads` API (requires additional API calls)
   - Option B: Extract from unit data (`threads[]` field in unit summaries)

   **Decision**: Start with Option B (extract from existing data) - no additional API calls needed.

---

## Phase A: Fix `oak_threads` Generator ✅ COMPLETE

### A.1: Add Mapping Generator

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-mapping-generators-minimal.ts`

Add `createThreadsMappingModule()` following the existing pattern:

```typescript
/**
 * Creates the oak_threads mapping module.
 *
 * Uses unified field definitions from THREADS_INDEX_FIELDS to ensure
 * the ES mapping stays in sync with the Zod schema.
 *
 * @see THREADS_INDEX_FIELDS - Single source of truth for field definitions
 */
export function createThreadsMappingModule(): string {
  const fields = generateEsFieldsFromDefinitions(THREADS_INDEX_FIELDS, THREADS_FIELD_OVERRIDES);

  return (
    HEADER +
    `/**
 * @packageDocumentation oak-threads
 * @description Elasticsearch mapping for the oak_threads index.
 * Contains curriculum thread documents for thread-centric navigation.
 */

export const OAK_THREADS_MAPPING = {
${generateMinimalSettingsBlock()}
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakThreadsMapping = typeof OAK_THREADS_MAPPING;
`
  );
}
```

### A.2: Create Field Overrides File

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-field-overrides/threads-overrides.ts` (NEW)

Follow the pattern from `sequences-overrides.ts`:

```typescript
import type { EsFieldMapping } from '../es-field-config.js';
import { textFieldWithAnalyzers, KEYWORD_SUBFIELD } from './common.js';

export const THREADS_FIELD_OVERRIDES = {
  thread_title: textFieldWithAnalyzers({
    fields: { keyword: KEYWORD_SUBFIELD },
  }),
  thread_semantic: { type: 'semantic_text' },
  thread_url: { type: 'keyword', ignore_above: 1024 },
  // title_suggest needs completion contexts if used
} as const satisfies Readonly<Record<string, EsFieldMapping>>;
```

### A.3: Export from Index

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-field-overrides/index.ts`

Add: `export { THREADS_FIELD_OVERRIDES } from './threads-overrides.js';`

### A.4: Wire Up Generator

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-es-mappings.ts`

1. Import `createThreadsMappingModule` from generators
2. Add to barrel: `export { OAK_THREADS_MAPPING } from './oak-threads.js';`
3. Add to FileMap: `'../search/es-mappings/oak-threads.ts': createThreadsMappingModule()`

### A.5: Verify

```bash
pnpm type-gen
pnpm type-check
```

**Success Criteria**:

- [ ] `OAK_THREADS_MAPPING` is generated
- [ ] No type errors
- [ ] Mapping includes all 7 fields from `THREADS_INDEX_FIELDS`

---

## Phase B: Fix `oak_sequences` Document Creation ✅ COMPLETE

### B.1: Create Sequence Document Builder

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/sequence-document-builder.ts` (NEW)

````typescript
import type { SearchSequenceIndexDoc } from '@oaknational/oak-curriculum-sdk/public/search';

/**
 * Parameters for creating a sequence document.
 */
export interface CreateSequenceDocumentParams {
  sequenceSlug: string;
  subjectSlug: string;
  subjectTitle: string;
  phaseSlug: string;
  phaseTitle: string;
  keyStages: string[];
  years: number[];
  unitSlugs: string[];
  categoryTitles: string[]; // Aggregated from /sequences/{seq}/units
}

/**
 * Creates an Elasticsearch document for the oak_sequences index.
 *
 * Sequences represent curriculum programmes (e.g., 'maths-secondary') that span
 * multiple key stages and contain ordered units.
 *
 * @example
 * ```typescript
 * const doc = createSequenceDocument({
 *   sequenceSlug: 'maths-secondary',
 *   subjectSlug: 'maths',
 *   subjectTitle: 'Mathematics',
 *   phaseSlug: 'secondary',
 *   phaseTitle: 'Secondary',
 *   keyStages: ['ks3', 'ks4'],
 *   years: [7, 8, 9, 10, 11],
 *   unitSlugs: ['unit-1', 'unit-2'],
 * });
 * ```
 */
export function createSequenceDocument(
  params: CreateSequenceDocumentParams,
): SearchSequenceIndexDoc {
  const {
    sequenceSlug,
    subjectSlug,
    subjectTitle,
    phaseSlug,
    phaseTitle,
    keyStages,
    years,
    unitSlugs,
    categoryTitles,
  } = params;

  return {
    sequence_id: sequenceSlug,
    sequence_slug: sequenceSlug,
    sequence_title: `${subjectTitle} ${phaseTitle}`,
    subject_slug: subjectSlug,
    subject_title: subjectTitle,
    phase_slug: phaseSlug,
    phase_title: phaseTitle,
    key_stages: keyStages,
    years: years.map(String),
    unit_slugs: unitSlugs,
    category_titles: categoryTitles, // Aggregated from units
    sequence_url: `https://www.thenational.academy/teachers/programmes/${sequenceSlug}/units`,
  };
}
````

### B.2: Write Unit Tests FIRST (TDD)

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/sequence-document-builder.unit.test.ts` (NEW)

```typescript
import { describe, it, expect } from 'vitest';
import { createSequenceDocument } from './sequence-document-builder.js';

describe('createSequenceDocument', () => {
  it('should create a sequence document with all required fields', () => {
    const doc = createSequenceDocument({
      sequenceSlug: 'maths-secondary',
      subjectSlug: 'maths',
      subjectTitle: 'Mathematics',
      phaseSlug: 'secondary',
      phaseTitle: 'Secondary',
      keyStages: ['ks3', 'ks4'],
      years: [7, 8, 9, 10, 11],
      unitSlugs: ['algebra-1', 'geometry-1'],
    });

    expect(doc.sequence_id).toBe('maths-secondary');
    expect(doc.sequence_slug).toBe('maths-secondary');
    expect(doc.sequence_title).toBe('Mathematics Secondary');
    expect(doc.subject_slug).toBe('maths');
    expect(doc.key_stages).toEqual(['ks3', 'ks4']);
    expect(doc.years).toEqual(['7', '8', '9', '10', '11']);
    expect(doc.unit_slugs).toEqual(['algebra-1', 'geometry-1']);
    expect(doc.sequence_url).toContain('maths-secondary');
  });

  it('should handle primary sequences', () => {
    const doc = createSequenceDocument({
      sequenceSlug: 'english-primary',
      subjectSlug: 'english',
      subjectTitle: 'English',
      phaseSlug: 'primary',
      phaseTitle: 'Primary',
      keyStages: ['ks1', 'ks2'],
      years: [1, 2, 3, 4, 5, 6],
      unitSlugs: [],
    });

    expect(doc.sequence_title).toBe('English Primary');
    expect(doc.phase_slug).toBe('primary');
  });
});
```

### B.3: Integrate into Ingestion Pipeline

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/index-oak-helpers.ts`

Modify `buildPairDocuments()` to include sequence operations:

```typescript
// Add to imports
import { createSequenceDocument } from './sequence-document-builder.js';

// In buildPairDocuments(), after building other ops:
const sequenceOps = buildSequenceOps(/* extract sequence data from fetched data */);

return [...unitOps, ...lessonOps, ...rollupOps, ...sequenceFacetOps, ...sequenceOps];
```

### B.4: Verify

```bash
pnpm test apps/oak-open-curriculum-semantic-search/src/lib/indexing/sequence-document-builder.unit.test.ts
pnpm es:ingest-live --subject maths --keystage ks4 --verbose
```

**Success Criteria**:

- [ ] Unit tests pass
- [ ] `oak_sequences` shows 1+ documents after ingestion
- [ ] All quality gates pass

---

## Phase C: Fix `oak_threads` Document Creation ✅ COMPLETE

### C.1: Create Thread Document Builder

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/thread-document-builder.ts` (NEW)

````typescript
import type { SearchThreadIndexDoc } from '@oaknational/oak-curriculum-sdk/public/search';

/**
 * Parameters for creating a thread document.
 */
export interface CreateThreadDocumentParams {
  threadSlug: string;
  threadTitle: string;
  subjectSlugs: string[];
  unitCount: number;
}

/**
 * Creates an Elasticsearch document for the oak_threads index.
 *
 * Threads represent curriculum progressions (e.g., 'Number', 'Algebra') that
 * span multiple units and years.
 *
 * @example
 * ```typescript
 * const doc = createThreadDocument({
 *   threadSlug: 'number-multiplication-and-division',
 *   threadTitle: 'Number: Multiplication and division',
 *   subjectSlugs: ['maths'],
 *   unitCount: 15,
 * });
 * ```
 */
export function createThreadDocument(params: CreateThreadDocumentParams): SearchThreadIndexDoc {
  const { threadSlug, threadTitle, subjectSlugs, unitCount } = params;

  return {
    thread_slug: threadSlug,
    thread_title: threadTitle,
    subject_slugs: subjectSlugs,
    unit_count: unitCount,
    thread_url: `https://www.thenational.academy/teachers/curriculum/threads/${threadSlug}`,
  };
}
````

### C.2: Write Unit Tests FIRST (TDD)

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/thread-document-builder.unit.test.ts` (NEW)

```typescript
import { describe, it, expect } from 'vitest';
import { createThreadDocument } from './thread-document-builder.js';

describe('createThreadDocument', () => {
  it('should create a thread document with all required fields', () => {
    const doc = createThreadDocument({
      threadSlug: 'number-multiplication-and-division',
      threadTitle: 'Number: Multiplication and division',
      subjectSlugs: ['maths'],
      unitCount: 15,
    });

    expect(doc.thread_slug).toBe('number-multiplication-and-division');
    expect(doc.thread_title).toBe('Number: Multiplication and division');
    expect(doc.subject_slugs).toEqual(['maths']);
    expect(doc.unit_count).toBe(15);
    expect(doc.thread_url).toContain('number-multiplication-and-division');
  });

  it('should handle threads spanning multiple subjects', () => {
    const doc = createThreadDocument({
      threadSlug: 'data-handling',
      threadTitle: 'Data Handling',
      subjectSlugs: ['maths', 'science'],
      unitCount: 8,
    });

    expect(doc.subject_slugs).toHaveLength(2);
  });
});
```

### C.3: Extract Threads from Unit Data

Threads are available in unit summary responses. During ingestion, we already fetch unit data - we need to extract and deduplicate threads.

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/thread-extractor.ts` (NEW)

```typescript
import type { CreateThreadDocumentParams } from './thread-document-builder.js';

interface UnitThreadData {
  threadSlug: string;
  threadTitle: string;
  subjectSlug: string;
}

/**
 * Extracts unique threads from unit data.
 *
 * Aggregates thread information from multiple units to create
 * deduplicated thread documents with accurate unit counts.
 */
export function extractThreadsFromUnits(
  units: Array<{ threads?: UnitThreadData[]; subjectSlug: string }>,
): CreateThreadDocumentParams[] {
  const threadMap = new Map<
    string,
    {
      threadTitle: string;
      subjectSlugs: Set<string>;
      unitCount: number;
    }
  >();

  for (const unit of units) {
    if (!unit.threads) continue;

    for (const thread of unit.threads) {
      const existing = threadMap.get(thread.threadSlug);
      if (existing) {
        existing.subjectSlugs.add(unit.subjectSlug);
        existing.unitCount++;
      } else {
        threadMap.set(thread.threadSlug, {
          threadTitle: thread.threadTitle,
          subjectSlugs: new Set([unit.subjectSlug]),
          unitCount: 1,
        });
      }
    }
  }

  return Array.from(threadMap.entries()).map(([threadSlug, data]) => ({
    threadSlug,
    threadTitle: data.threadTitle,
    subjectSlugs: Array.from(data.subjectSlugs),
    unitCount: data.unitCount,
  }));
}
```

### C.4: Integrate into Ingestion Pipeline

After Phase B is complete, add thread extraction and document creation to the ingestion flow.

### C.5: Verify

```bash
pnpm test apps/oak-open-curriculum-semantic-search/src/lib/indexing/thread-*.unit.test.ts
pnpm es:ingest-live --subject maths --keystage ks4 --verbose
```

**Success Criteria**:

- [ ] Unit tests pass
- [ ] `oak_threads` index is created (if Phase A complete)
- [ ] `oak_threads` shows documents after ingestion
- [ ] All quality gates pass

---

## Quality Gates (After Each Phase)

```bash
pnpm type-gen        # Must pass
pnpm build           # Must pass
pnpm type-check      # Zero errors
pnpm lint:fix        # Zero violations
pnpm test            # All tests pass
```

---

## Success Criteria (Overall) ✅ ALL MET

- [x] `OAK_THREADS_MAPPING` is generated at type-gen time
- [x] `oak_sequences` document builder ready and integrated
- [x] `oak_threads` document builder + API integration ready
- [x] Reference index mappings generated (subjects, key_stages, glossary)
- [x] Reference document builders implemented
- [x] All unit tests pass (867 SDK + 380 app)
- [x] All quality gates pass (11 gates)
- [x] No type shortcuts or `any` types

---

## Relationship to Main Plan

This plan is a **blocking prerequisite** for Phase 1C (Baseline Metrics).

After completion:

1. Resume Phase 1C with complete index coverage
2. Update `maths-ks4-implementation-plan.md` to mark these as resolved
3. Validate sequence and thread search functionality

---

## Timeline ✅ COMPLETE

| Phase     | Duration       | Deliverable                       | Status      |
| --------- | -------------- | --------------------------------- | ----------- |
| A         | 30 mins        | `OAK_THREADS_MAPPING` generated   | ✅ Complete |
| B         | 1 hour         | `oak_sequences` documents created | ✅ Complete |
| C         | 1 hour         | `oak_threads` documents created   | ✅ Complete |
| D (bonus) | 1 hour         | Reference index infrastructure    | ✅ Complete |
| **Total** | **~3.5 hours** | All gaps fixed                    | ✅ Complete |

## What Remains

**Nothing blocking.** All missing index work is complete.

**Future work (Phase 3)**:

- Populate reference indices (`oak_ref_subjects`, `oak_ref_key_stages`, `oak_curriculum_glossary`)
- Data source: Existing `ontology-data.ts` and `knowledge-graph-data.ts`
- NO extraction or aggregation during ingestion needed
- Simple transformation from static curriculum metadata

---

**End of Plan**
