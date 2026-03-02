# Bulk Ingestion Code Review — Complete Architecture Analysis

**Status**: ✅ COMPLETE — Action 2 of Remediation
**Created**: 2025-12-31
**Purpose**: Comprehensive code review documenting architecture, data flow, and TDD failures
**Cross-references**:

- [bulk-api-parity-requirements.md](./bulk-api-parity-requirements.md) — Field specifications
- [roadmap.md](../roadmap.md) — Master plan
- [semantic-search.prompt.md](../../../prompts/semantic-search/semantic-search.prompt.md) — Session context

---

## Foundation Documents (Re-commit before continuing)

1. **[rules.md](../../../directives/rules.md)** — TDD at ALL levels
2. **[testing-strategy.md](../../../directives/testing-strategy.md)** — Red → Green → Refactor
3. **[schema-first-execution.md](../../../directives/schema-first-execution.md)** — Generator is source of truth
4. **[ADR-088: Result Pattern](../../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md)** — No try/catch, use Result pattern
5. **[ADR-051: OpenTelemetry Logging](../../../../docs/architecture/architectural-decisions/051-opentelemetry-compliant-logging.md)** — Structured JSON logging

---

## Executive Summary

This code review documents the complete bulk ingestion architecture and identifies **systematic TDD failures**. The root cause is implementation-first development where tests verified what code *does* rather than specifying what code *should do*.

### Key Architecture Finding

The bulk ingestion path **intentionally diverges** from the API path. Rather than reusing the existing document creation infrastructure (`createLessonDocument`, `createRollupDocument`, `generateLessonSemanticSummary`), the bulk path implements parallel transformation logic that is incomplete.

### Critical Gaps

| Gap | API Path | Bulk Path | Impact |
|-----|----------|-----------|--------|
| **Semantic summaries** | `generateLessonSemanticSummary()` | `undefined` | ELSER retrievers broken |
| **Rollup documents** | `buildRollupDocuments()` | Not implemented | Unit search broken |
| **Parity validation** | N/A | None | 78% lesson loss undetected |

---

## Part 1: Architecture Overview

### 1.1 High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INGESTION ENTRY POINTS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  API Mode                              Bulk Mode                             │
│  ─────────                             ─────────                             │
│  ingest-live.ts                        ingest-live.ts                        │
│       │                                     │                                │
│       ↓                                     ↓                                │
│  createIngestHarness()                 prepareBulkIngestion()                │
│       │                                     │                                │
│       ↓                                     ↓                                │
│  runBatchIngestion()                   bulk-ingestion.ts                     │
│       │                                     │                                │
└───────┼─────────────────────────────────────┼────────────────────────────────┘
        │                                     │
        ↓                                     ↓
┌───────────────────────────────┐   ┌───────────────────────────────┐
│      API DATA LAYER           │   │      BULK DATA LAYER          │
│                               │   │                               │
│  OakClient                    │   │  readAllBulkFiles()           │
│    ↓                          │   │    ↓                          │
│  pattern-aware-fetcher.ts     │   │  BulkDownloadFile[]           │
│    ↓                          │   │    ↓                          │
│  lesson-materials.ts          │   │  HybridDataSource             │
│    (transcript + summary)     │   │    ↓                          │
│                               │   │  BulkDataAdapter              │
└───────────────────────────────┘   └───────────────────────────────┘
        │                                     │
        ↓                                     ↓
┌───────────────────────────────────────────────────────────────────┐
│                    DOCUMENT CREATION                              │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  API Path                          Bulk Path                      │
│  ────────                          ─────────                      │
│  lesson-document-builder.ts        bulk-lesson-transformer.ts     │
│  document-transforms.ts            bulk-unit-transformer.ts       │
│  semantic-summary-generator.ts     bulk-transform-helpers.ts      │
│  index-bulk-helpers.ts             (NO semantic summary)          │
│  (createRollupDocument)            (NO rollup creation)           │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
        │                                     │
        ↓                                     ↓
┌───────────────────────────────────────────────────────────────────┐
│                    ELASTICSEARCH                                   │
│                                                                   │
│  oak_lessons      ← Both paths write here                         │
│  oak_units        ← Both paths write here                         │
│  oak_unit_rollup  ← API path only (BULK PATH MISSING)             │
│  oak_threads      ← Bulk path only                                │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### 1.2 The Architectural Problem

The bulk path was designed as a **parallel implementation** rather than an **alternative data source** feeding the same document creation logic.

**What should have happened**:

```
Bulk Files → BulkDataAdapter → [same interfaces as API] → document-transforms.ts
                                                        → semantic-summary-generator.ts
                                                        → index-bulk-helpers.ts
```

**What actually happened**:

```
Bulk Files → BulkDataAdapter → bulk-lesson-transformer.ts (incomplete clone)
                             → bulk-unit-transformer.ts (incomplete clone)
                             → (no rollup, no semantic summaries)
```

---

## Part 2: Component-by-Component Analysis

### 2.1 Entry Point: `bulk-ingestion.ts`

**Location**: `src/lib/indexing/bulk-ingestion.ts`
**Role**: Orchestrates bulk ingestion from files to ES operations

**Data Flow**:

```typescript
prepareBulkIngestion(options)
    │
    ├── readAllBulkFiles(bulkDir)           // SDK: reads 30 JSON files
    │       → BulkFileResult[]
    │
    ├── filterBySubject(files, filter)      // 🐛 BUG: breaks hyphenated subjects
    │       → BulkFileResult[] (filtered)
    │
    ├── processAllBulkFiles(files, client)
    │       │
    │       └── processSingleBulkFile(file, client)
    │               │
    │               ├── createHybridDataSource(file.data, client)
    │               │       → HybridDataSource
    │               │
    │               └── hybridSource.toBulkOperations(LESSONS_INDEX, UNITS_INDEX)
    │                       → BulkOperations  // 🚨 NO ROLLUP INDEX
    │
    ├── extractAndBuildThreadOperations(files)
    │       → thread operations for oak_threads
    │
    └── extractVocabularyStats(files)
            → vocabulary mining stats
```

**Critical Issues**:

| Issue | Location | Impact |
|-------|----------|--------|
| No rollup index | Lines 93-95 | `oak_unit_rollup` never populated |
| Subject filter bug | Lines 85-88 | Hyphenated subjects filtered incorrectly |

**Missing from requirements**:

- ❌ `oak_unit_rollup` creation (see [parity requirements](./bulk-api-parity-requirements.md))
- ❌ `lesson_structure` semantic summary population

---

### 2.2 Data Source: `hybrid-data-source.ts`

**Location**: `src/adapters/hybrid-data-source.ts`
**Role**: Composes bulk data with API supplementation (KS4 tiers)

**Data Flow**:

```typescript
createHybridDataSource(bulkFile, client)
    │
    ├── deriveSubjectSlug(sequenceSlug)     // Extract subject from filename
    │
    ├── createBulkDataAdapter(bulkFile)     // Create transformer
    │       → BulkDataAdapter
    │
    ├── buildKs4Context(client, subject)    // Optional API tier enrichment
    │       → Ks4SupplementationContext | null
    │
    └── Return HybridDataSource interface:
            transformLessonsToES() → SearchLessonsIndexDoc[]
            transformUnitsToES()   → SearchUnitsIndexDoc[]
            toBulkOperations()     → ES bulk operations
```

**Critical Issues**:

| Issue | Location | Impact |
|-------|----------|--------|
| Delegates to incomplete adapter | Line 172 | All adapter issues inherited |
| No rollup transformation | Interface | No method exists for rollups |

**What's working**:

- ✅ KS4 tier enrichment via API (maths)
- ✅ Subject derivation from sequence slug
- ✅ Unit and lesson transformation delegation

---

### 2.3 Transformer: `bulk-lesson-transformer.ts`

**Location**: `src/adapters/bulk-lesson-transformer.ts`
**Role**: Transform bulk lesson data to ES document format

**Data Flow**:

```typescript
transformBulkLessonToESDoc(lesson, metadata)
    │
    ├── buildLessonIdentityFields(lesson)
    │       → lesson_id, lesson_slug, lesson_title
    │
    ├── buildLessonContextFields(lesson, metadata)
    │       → subject_slug, key_stage, years, unit_ids, etc.
    │
    ├── buildLessonContentFields(lesson)
    │       → lesson_content (transcript)
    │       → lesson_structure: undefined  // 🚨 CRITICAL BUG
    │       → lesson_content_semantic (transcript)
    │       → lesson_structure_semantic: undefined  // 🚨 CRITICAL BUG
    │
    ├── buildPedagogicalFields(lesson)
    │       → keywords, learning points, misconceptions, teacher tips
    │
    └── buildSuggestionPayload(lesson)
            → title_suggest autocomplete payload
```

**Critical Code (Lines 86-88)**:

```typescript
function buildLessonContentFields(lesson: Lesson): LessonContentFields {
  const transcriptText = lesson.transcript_sentences ?? '[No transcript available]';
  return {
    lesson_content: transcriptText,
    lesson_structure: undefined,  // 🚨 INTENTIONALLY SKIPPED
    lesson_content_semantic: transcriptText,
    lesson_structure_semantic: undefined,  // 🚨 INTENTIONALLY SKIPPED
    // ...
  };
}
```

**Comparison with API path** (`document-transforms.ts` line 183-185):

```typescript
export function createLessonDocument(params: CreateLessonDocumentParams): SearchLessonsIndexDoc {
  // ...
  const { f, ks4, sem, unitArrays } = extractDerivedLessonFields(params);
  // ...
  return {
    // ...
    lesson_structure: sem,           // ← Uses semantic summary
    lesson_structure_semantic: sem,  // ← Uses semantic summary
    // ...
  };
}
```

**Where `sem` comes from** (`semantic-summary-generator.ts`):

```typescript
export function generateLessonSemanticSummary(summary: SearchLessonSummary): string {
  const contextLine = `${summary.lessonTitle} is a ${summary.keyStageTitle} ${summary.subjectTitle} lesson...`;
  const pedagogicalParts = extractLessonPedagogicalContent(summary);
  return [contextLine, ...pedagogicalParts].join('\n\n');
}
```

**Required Fix**:

The bulk transformer must generate semantic summaries from available bulk data fields:

- `lessonTitle` ✅ Available
- `keyStageTitle` ← Must derive from `years`
- `subjectTitle` ✅ Available from metadata
- `unitTitle` ✅ Available
- `keyLearningPoints` ✅ Available
- `lessonKeywords` ✅ Available
- `misconceptionsAndCommonMistakes` ✅ Available
- `teacherTips` ✅ Available
- `contentGuidance` ✅ Available
- `pupilLessonOutcome` ✅ Available

---

### 2.4 Transformer: `bulk-unit-transformer.ts`

**Location**: `src/adapters/bulk-unit-transformer.ts`
**Role**: Transform bulk unit data to ES document format

**Status**: Produces `oak_units` documents correctly, but:

- ❌ Does not create `oak_unit_rollup` documents
- ❌ Missing semantic summary fields for unit structure

---

### 2.5 Helpers: `bulk-transform-helpers.ts`

**Location**: `src/adapters/bulk-transform-helpers.ts`
**Role**: URL generation, field extraction, normalisation

**Lines of Code**: 165
**Test Coverage**: 0% (no test file exists)

**Functions**:

| Function | Purpose | Tested? |
|----------|---------|---------|
| `generateLessonUrl` | Create canonical lesson URL | ❌ |
| `generateUnitUrl` | Create canonical unit URL | ❌ |
| `generateSubjectProgrammesUrl` | Create subject programmes URL | ❌ |
| `extractKeywordStrings` | Extract keywords from bulk data | ❌ |
| `extractLearningPointStrings` | Extract learning points | ❌ |
| `extractMisconceptionStrings` | Extract misconceptions | ❌ |
| `extractTeacherTipStrings` | Extract teacher tips | ❌ |
| `extractContentGuidanceLabels` | Extract content guidance | ❌ |
| `normaliseSupervisionLevel` | Normalise supervision level | ❌ |
| `derivePhaseSlug` | Derive phase from key stage | ❌ |
| `normaliseYearsFromUnit` | Normalise year values | ❌ |
| `getKeyStageTitle` | Get human-readable key stage | ❌ |
| `normaliseSubjectSlug` | Map combined-science → science | ❌ |

---

### 2.6 Reference: API Path Document Creation

For comparison, here is how the API path creates documents:

**Lesson Document Creation** (`lesson-document-builder.ts`):

```typescript
buildLessonDocFromAggregated(client, lesson, unitSummaries, subject, keyStage, unitContextMap)
    │
    ├── resolveUnitsForLesson(unitSlugs, unitSummaries)
    │
    ├── createLessonContext(units, primarySummary, subject, keyStage, unitContextMap)
    │
    └── buildLessonDocEntry(client, lesson, context)
            │
            ├── fetchLessonMaterials(client, lessonSlug)
            │       → { transcript, summary }
            │
            └── createLessonDocument(params)
                    │
                    └── generateLessonSemanticSummary(summary)
                            → lesson_structure, lesson_structure_semantic
```

**Rollup Document Creation** (`index-bulk-helpers.ts`):

```typescript
buildRollupDocuments(unitSummaries, rollupSnippets, subject, keyStage, url, contextMap)
    │
    └── for each unit:
            │
            └── createRollupDocument(params)
                    │
                    ├── extractRollupDocumentFields(summary)
                    │
                    ├── createEnrichedRollupText(snippets, pedagogicalData)
                    │
                    └── generateUnitSemanticSummary(summary)
                            → unit_structure, unit_structure_semantic
```

---

## Part 3: TDD Failure Analysis

### 3.1 Test Coverage Analysis

| File | Tests | Coverage | TDD Compliant? |
|------|-------|----------|----------------|
| `bulk-data-adapter.unit.test.ts` | 15 | Medium | ⚠️ Partial |
| `bulk-lesson-transformer.ts` | (tested via adapter) | Low | ❌ No |
| `bulk-unit-transformer.ts` | (tested via adapter) | Low | ❌ No |
| `bulk-transform-helpers.ts` | 0 | 0% | ❌ No |
| `hybrid-data-source.unit.test.ts` | ~10 | Medium | ⚠️ Partial |
| `bulk-ingestion.unit.test.ts` | 3 | Low | ❌ No |
| `bulk-thread-transformer.unit.test.ts` | 9 | Good | ✅ Yes |

### 3.2 Critical Missing Tests

**Test that should exist (but doesn't)**:

```typescript
describe('bulk-lesson-transformer', () => {
  it('generates lesson_structure from pedagogical fields', () => {
    const lesson = createBulkLesson({
      lessonTitle: 'Test Lesson',
      keyLearningPoints: [{ keyLearningPoint: 'Students learn X' }],
      lessonKeywords: [{ keyword: 'algebra', description: 'branch of maths' }],
      misconceptionsAndCommonMistakes: [{ misconception: 'X = Y', response: 'Actually...' }],
    });

    const doc = transformBulkLessonToESDoc(lesson, metadata);

    expect(doc.lesson_structure).toBeDefined();
    expect(doc.lesson_structure).toContain('Test Lesson');
    expect(doc.lesson_structure).toContain('Key learning');
    expect(doc.lesson_structure).toContain('Students learn X');
  });

  it('generates lesson_structure_semantic for ELSER', () => {
    const lesson = createBulkLesson({ /* ... */ });
    const doc = transformBulkLessonToESDoc(lesson, metadata);

    expect(doc.lesson_structure_semantic).toBeDefined();
    expect(doc.lesson_structure_semantic).not.toBe('');
    expect(doc.lesson_structure_semantic.length).toBeGreaterThan(100);
  });
});
```

**Test that should exist for rollups**:

```typescript
describe('bulk-ingestion', () => {
  it('creates oak_unit_rollup operations for each unit', async () => {
    const result = await prepareBulkIngestion({ bulkDir, client });

    const rollupOps = result.operations.filter(
      (op) => isIndexAction(op) && op.index._index === 'oak_unit_rollup'
    );

    expect(rollupOps.length).toBeGreaterThan(0);
  });
});
```

**Parity test that should exist**:

```typescript
describe('bulk vs API parity', () => {
  it('produces identical lesson documents for same lesson', async () => {
    const bulkLesson = getBulkLesson('lesson-slug');
    const apiLesson = await fetchApiLesson('lesson-slug');

    const bulkDoc = transformBulkLessonToESDoc(bulkLesson, metadata);
    const apiDoc = createLessonDocument(apiParams);

    // Compare all fields
    expect(bulkDoc.lesson_id).toBe(apiDoc.lesson_id);
    expect(bulkDoc.lesson_structure).toBeDefined();
    expect(bulkDoc.lesson_structure_semantic).toBeDefined();
    // ... all required fields from parity requirements
  });
});
```

### 3.3 Root Cause: Implementation-First Development

The tests were written **after** the implementation, verifying what code *does* rather than specifying what code *should do*.

**Evidence**:

1. `bulk-lesson-transformer.ts` explicitly sets `lesson_structure: undefined`
2. No test fails when this line is present
3. Tests verify extraction of existing fields but don't specify required fields

**TDD would have caught this**:

1. Write test: `lesson_structure must be populated`
2. Run test → RED (fails because field is undefined)
3. Implement semantic summary generation
4. Run test → GREEN (passes)

---

## Part 4: Subject Filter Bug (Action 3 Context)

### 4.1 The Bug

**Location**: `src/lib/indexing/bulk-ingestion.ts` lines 85-88

```typescript
function filterBySubject(
  files: readonly BulkFileResult[],
  subjectFilter?: readonly string[],
): readonly BulkFileResult[] {
  if (!subjectFilter || subjectFilter.length === 0) {
    return files;  // ← Unfiltered runs work correctly
  }

  const filterSet = new Set(subjectFilter);
  return files.filter((file) => {
    // Extract subject from sequenceSlug (e.g., "maths-primary" -> "maths")
    const subject = file.data.sequenceSlug.split('-')[0];  // 🐛 BUG
    return subject !== undefined && filterSet.has(subject);
  });
}
```

### 4.2 Impact

| Sequence Slug | Extracted Subject | Expected Subject | Result |
|---------------|-------------------|------------------|--------|
| `maths-primary` | `maths` | `maths` | ✅ Correct |
| `physical-education-primary` | `physical` | `physical-education` | ❌ Wrong |
| `design-technology-secondary` | `design` | `design-technology` | ❌ Wrong |
| `religious-education-primary` | `religious` | `religious-education` | ❌ Wrong |
| `cooking-nutrition-primary` | `cooking` | `cooking-nutrition` | ❌ Wrong |

### 4.3 When It Matters

- **Unfiltered runs**: Bug does NOT affect (line 80-81 returns early)
- **Filtered runs**: Bug DOES affect

If the failing ingestion used `--subject` flags, this could explain missing subjects.

### 4.4 Required Fix

Use the SDK's `extractSubjectPhase` or the existing `deriveSubjectSlug` pattern:

```typescript
import { extractSubjectPhase } from '@oaknational/oak-curriculum-sdk/public/bulk';

function filterBySubject(files, subjectFilter) {
  if (!subjectFilter || subjectFilter.length === 0) {
    return files;
  }
  const filterSet = new Set(subjectFilter);
  return files.filter((file) => {
    const parsed = extractSubjectPhase(`${file.data.sequenceSlug}.json`);
    return parsed && filterSet.has(parsed.subject);
  });
}
```

---

## Part 5: Hypotheses for 78% Missing Lessons

Based on this code review, the following are potential causes to investigate in Action 3:

| # | Hypothesis | Evidence | Investigation |
|---|------------|----------|---------------|
| 1 | **Subject filter bug** | `split('-')[0]` breaks hyphenated subjects | Check if `--subject` flag was used |
| 2 | **Zod validation rejection** | Strict schemas may silently reject | Add `logger.debug` to Zod parse |
| 3 | **File reading issue** | `readAllBulkFiles` may skip files | Add `logger.info` for file discovery |
| 4 | **Deduplication** | `buildLessonsByUnitMap` uses Map (overwrites) | Verify no data loss |
| 5 | **Transform errors** | Silent failures in transformation | Wrap in Result pattern with logging |
| 6 | **ES indexing failures** | Bulk API rejecting documents | Check ES response |

### Investigation Plan (Action 3)

1. Add diagnostic logging at each stage:
   - Files discovered
   - Files filtered
   - Lessons per file
   - Lessons after transformation
   - Operations created
   - ES indexing results

2. Run with verbose output and compare counts

3. Verify against bulk file lesson counts directly

---

## Part 6: Architectural Patterns Required

Any code changes to remediate the issues identified in this review MUST follow these architectural patterns.

### 6.1 Result Pattern (ADR-088)

**We do NOT use try/catch for error handling. We use the Result pattern.**

```typescript
import { ok, err, type Result, isOk, isErr } from '@oaknational/result';

// ❌ WRONG - Do not use try/catch
async function fetchData(): Promise<Data> {
  try {
    const result = await someOperation();
    return result;
  } catch (e) {
    throw new Error(`Failed: ${e}`);
  }
}

// ✅ CORRECT - Use Result pattern
async function fetchData(): Promise<Result<Data, FetchError>> {
  const result = await someOperation();
  if (!result.ok) {
    return err({ kind: 'fetch_failed', cause: result.error });
  }
  return ok(result.value);
}
```

**When to wrap third-party code**: Convert exceptions to Results at boundaries:

```typescript
async function safeParse<T>(
  operation: () => Promise<T>,
): Promise<Result<T, ParseError>> {
  try {
    return ok(await operation());
  } catch (error) {
    return err({ kind: 'parse_error', cause: error });
  }
}
```

### 6.2 Logging Infrastructure (ADR-051, ADR-033)

**All code must use the proper logging infrastructure with appropriate log levels.**

| Level | Use For | Example |
|-------|---------|---------|
| `logger.info` | Critical information, milestones, summary stats | Files processed, lesson counts, phase completion |
| `logger.debug` | Exhaustive detail for troubleshooting | Individual file processing, field values, loop iterations |
| `logger.warn` | Recoverable issues that may indicate problems | Missing optional fields, skipped items |
| `logger.error` | Errors that affect operation but don't crash | Failed to process file, validation errors |

**Example for bulk ingestion**:

```typescript
import { ingestLogger } from '../logger';

async function processBulkFiles(files: BulkFileResult[]): Promise<Result<ProcessingResult, ProcessingError>> {
  // INFO: Critical milestone
  ingestLogger.info('Starting bulk file processing', { fileCount: files.length });

  for (const file of files) {
    // DEBUG: Exhaustive detail
    ingestLogger.debug('Processing file', {
      sequenceSlug: file.data.sequenceSlug,
      lessonCount: file.data.lessons.length,
    });

    const result = await processFile(file);
    if (!result.ok) {
      // WARN: Recoverable issue
      ingestLogger.warn('Failed to process file, skipping', {
        sequenceSlug: file.data.sequenceSlug,
        error: result.error,
      });
      continue;
    }

    // DEBUG: Exhaustive detail
    ingestLogger.debug('File processed successfully', {
      sequenceSlug: file.data.sequenceSlug,
      lessonsProcessed: result.value.lessonCount,
    });
  }

  // INFO: Summary stats
  ingestLogger.info('Bulk file processing complete', {
    filesProcessed: successCount,
    filesSkipped: skipCount,
    totalLessons: lessonCount,
  });

  return ok({ filesProcessed: successCount, totalLessons: lessonCount });
}
```

### 6.3 Logging Gaps Identified

The current bulk ingestion code has **insufficient logging**:

| Location | Current State | Required |
|----------|---------------|----------|
| `readAllBulkFiles` | No logging | `logger.info` for file count, `logger.debug` for each file |
| `filterBySubject` | No logging | `logger.info` for filtered count, `logger.debug` for each filtered file |
| `processSingleBulkFile` | Minimal `logger.debug` | Add `logger.info` for summary per file |
| `transformBulkLessonToESDoc` | No logging | `logger.debug` for each lesson transformation |
| Zod validation | No logging | `logger.debug` for validation results, `logger.warn` for failures |

---

## Part 7: Required Remediation

### 7.1 Immediate (Unblocks search)

| # | Task | TDD Approach |
|---|------|--------------|
| 1 | Add `lesson_structure` generation | Write test first → implement |
| 2 | Add `oak_unit_rollup` creation | Write test first → implement |
| 3 | Fix subject filter bug | Write test first → fix |

### 7.2 Short-term (Prevents regression)

| # | Task | TDD Approach |
|---|------|--------------|
| 4 | Create `bulk-transform-helpers.unit.test.ts` | Cover all 13 functions |
| 5 | Add integration test for document validity | Compare against ES schema |
| 6 | Add parity test (bulk vs API) | Ensure identical output |

### 7.3 Ongoing (Architectural excellence)

| # | Practice |
|---|----------|
| 7 | All new bulk code must have tests FIRST |
| 8 | Regular re-read of foundation documents |
| 9 | Code review must verify TDD compliance |

---

## Part 8: File Reference

### Bulk Path Files (Review Required)

| File | Purpose | Status |
|------|---------|--------|
| `src/lib/indexing/bulk-ingestion.ts` | Entry point orchestration | 🚨 Missing rollup |
| `src/adapters/hybrid-data-source.ts` | Bulk + API composition | ⚠️ No rollup method |
| `src/adapters/bulk-data-adapter.ts` | Core transformation | 📋 Review |
| `src/adapters/bulk-lesson-transformer.ts` | Lesson → ES doc | 🚨 Missing structure |
| `src/adapters/bulk-unit-transformer.ts` | Unit → ES doc | 📋 Review |
| `src/adapters/bulk-transform-helpers.ts` | Helpers | 🚨 No tests |
| `src/adapters/bulk-thread-transformer.ts` | Thread extraction | ✅ OK |
| `src/adapters/api-supplementation.ts` | KS4 tier enrichment | ✅ OK |
| `src/adapters/vocabulary-mining-adapter.ts` | Vocabulary extraction | ✅ OK |

### API Path Files (Reference Implementation)

| File | Purpose | Reuse? |
|------|---------|--------|
| `src/lib/indexing/document-transforms.ts` | Document creation | ✅ Should reuse |
| `src/lib/indexing/semantic-summary-generator.ts` | Semantic summaries | ✅ Should reuse |
| `src/lib/indexing/index-bulk-helpers.ts` | Rollup creation | ✅ Should reuse |
| `src/lib/indexing/lesson-document-builder.ts` | Lesson building | Reference |
| `src/lib/indexing/document-transform-helpers.ts` | Field extraction | Reference |

### Test Files (Coverage Gaps)

| File | Status |
|------|--------|
| `src/adapters/bulk-data-adapter.unit.test.ts` | ⚠️ Missing structure tests |
| `src/adapters/bulk-transform-helpers.unit.test.ts` | ❌ Does not exist |
| `src/lib/indexing/bulk-ingestion.unit.test.ts` | ⚠️ Missing rollup tests |
| Parity test | ❌ Does not exist |
| Integration test | ❌ Does not exist |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [bulk-api-parity-requirements.md](./bulk-api-parity-requirements.md) | Field specifications (Action 1) |
| [roadmap.md](../roadmap.md) | Master plan |
| [semantic-search.prompt.md](../../../prompts/semantic-search/semantic-search.prompt.md) | Session context |
| [testing-strategy.md](../../../directives/testing-strategy.md) | TDD principles |
| [ADR-088: Result Pattern](../../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md) | Error handling pattern |
| [ADR-051: OpenTelemetry Logging](../../../../docs/architecture/architectural-decisions/051-opentelemetry-compliant-logging.md) | Logging format |
| [ADR-033: Log Level Configuration](../../../../docs/architecture/architectural-decisions/033-centralised-log-level-configuration.md) | Log levels |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-31 | Initial code review (TDD failures) | Agent |
| 2025-12-31 | Expanded to full architecture analysis | Agent |
