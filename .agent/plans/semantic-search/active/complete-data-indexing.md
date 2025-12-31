# Milestone 1: Complete Data Indexing (Bulk-First)

**Status**: 🚨 **FAILED** — Critical issues discovered during evaluation
**Priority**: High — BLOCKING all other work
**Parent**: [README.md](../README.md) | [roadmap.md](../roadmap.md)
**Session Context**: [semantic-search.prompt.md](../../../prompts/semantic-search/semantic-search.prompt.md)
**Created**: 2025-12-24
**Updated**: 2025-12-31
**Principle**: Index EVERYTHING — ES is a complete view of the curriculum

---

## 🚨 CRITICAL: Bulk Ingestion Failed (2025-12-31)

**A live bulk ingestion run revealed fundamental implementation failures.**

See [semantic-search.prompt.md](../../../prompts/semantic-search/semantic-search.prompt.md) for:

- **Master list of 15 unverified assumptions** that permeate all documentation
- **5 mandatory remediation actions** before further development
- **Root cause analysis** of failures

### Issues Discovered

| Issue | Cause | Impact |
|-------|-------|--------|
| **Only 2,884/12,833 lessons** | Unknown filter/logic bug | 78% data missing |
| **`oak_unit_rollup` empty** | Not implemented in bulk path | Unit search broken |
| **`lesson_structure` undefined** | Explicitly skipped in transformer | ELSER structure 100% zero-hit |
| **PE, Spanish missing** | Unknown | 2 subjects not indexed |

### Root Cause: `bulk-lesson-transformer.ts`

```typescript
// Lines 86-88 - VITAL DATA INTENTIONALLY SKIPPED
lesson_structure: undefined,
lesson_structure_semantic: undefined,
```

**This code deliberately skips required fields with no test asserting they are populated.**

---

## Implementation Progress (2025-12-31)

| Phase | Description | Status |
|-------|-------------|--------|
| **0** | SDK bulk export (schema-first) | ✅ Complete |
| **1** | BulkDataAdapter (Lesson/Unit transforms) | ⚠️ **INCOMPLETE** — missing structure fields |
| **2** | API supplementation (Maths KS4 tiers) | ✅ Complete |
| **3** | HybridDataSource (bulk + API) | ✅ Complete |
| **4** | VocabularyMiningAdapter | ✅ Complete |
| **5a** | Bulk thread transformer | ✅ Complete |
| **5b** | Wire bulk pipeline into CLI | ✅ Complete |
| **5c** | Full ingestion run | 🚨 **FAILED** |

**Completed work (Phase 5a)**:

- `src/adapters/bulk-thread-transformer.ts` — Extracts threads from `sequence[].threads[]`, deduplicates, builds ES docs
- `src/adapters/bulk-thread-transformer.unit.test.ts` — 9 unit tests passing
- `src/lib/indexing/bulk-ingestion.ts` — Updated to include thread operations in bulk preparation
- `src/lib/indexing/bulk-ingestion.unit.test.ts` — 3 tests passing with thread assertions

**Completed work (Phase 5b)**:

- `src/lib/elasticsearch/setup/ingest-cli-args.ts` — Added `--bulk` flag and `--bulk-dir` option
- `src/lib/elasticsearch/setup/ingest-live.ts` — Bulk mode execution path
- `src/lib/elasticsearch/setup/ingest-bulk.ts` — Bulk ingestion orchestration
- `src/lib/elasticsearch/setup/ingest-output.ts` — Output formatting

**FAILED (Phase 5c)**:

Ingestion ran but produced incorrect results:

- Only 2,884/12,833 lessons indexed (~22%)
- `oak_unit_rollup` has 0 documents
- `lesson_structure` fields are `undefined`
- Physical Education and Spanish missing entirely

---

## Foundation Documents (MANDATORY)

Before any implementation, read:

1. **[rules.md](../../../directives-and-memory/rules.md)** — Cardinal Rule, TDD, no type shortcuts
2. **[testing-strategy.md](../../../directives-and-memory/testing-strategy.md)** — TDD at ALL levels, test definitions
3. **[schema-first-execution.md](../../../directives-and-memory/schema-first-execution.md)** — Generator is source of truth

**Key rules for this work**:

- **TDD**: Write tests FIRST. Red → Green → Refactor.
- **No type shortcuts**: Never use `as`, `any`, `!`, or `Record<string, unknown>`
- **Reuse existing infrastructure**: Don't duplicate existing code
- **Fail fast**: Log errors with helpful messages, never silently

---

## Strategic Pivot (2025-12-30)

This plan has been updated to use the **bulk-first ingestion strategy** per [ADR-093](../../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md).

| Source | Purpose | Coverage |
|--------|---------|----------|
| **Bulk Download** | Lessons, transcripts (81%), units, threads | 16/17 subjects (30 files) |
| **API** | Tier info (maths KS4), unit options | Structural data only |

**Missing from bulk**: rshe-pshe (returns 422 Unprocessable Content)

**See**:

- [bulk-download-vs-api-comparison.md](../../../analysis/bulk-download-vs-api-comparison.md) — Strategic analysis
- [07-bulk-download-data-quality-report.md](../../../research/ooc/07-bulk-download-data-quality-report.md) — **Data quality issues and edge cases**

---

## ⚠️ CRITICAL: Existing Infrastructure to Reuse

**DO NOT reinvent these — they already exist and are production-ready:**

### Bulk Download Parsing (vocab-gen)

| Module | Path | Provides |
|--------|------|----------|
| **Zod Schemas** | `packages/sdks/oak-curriculum-sdk/vocab-gen/lib/` | Validated types |
| `bulk-file-schema.ts` | `bulkDownloadFileSchema` | Top-level file validation |
| `lesson-schema.ts` | `lessonSchema` | Lesson validation with null handling |
| `unit-schemas.ts` | `unitSchema` | Unit validation with year handling |
| `vocabulary-schemas.ts` | `nullSentinelSchema` | `"NULL"` string → `null` |
| `bulk-reader.ts` | `parseBulkFile()`, `readAllBulkFiles()` | File discovery and parsing |

**Existing types already handle**:

- `"NULL"` string → proper null conversion
- `downloadsavailable` typo
- Year as number OR "All years" (PE swimming)
- Thread arrays on units
- Optional transcripts

### Usage Example

**Note**: `vocab-gen` is currently a dev tool, not exported from SDK. Import via relative path:

```typescript
// Direct import (search SDK is in same monorepo)
import { parseBulkFile, readAllBulkFiles } from '../../../../packages/sdks/oak-curriculum-sdk/vocab-gen/lib/index.js';
import type { BulkDownloadFile, Lesson, Unit } from '../../../../packages/sdks/oak-curriculum-sdk/vocab-gen/lib/index.js';

// Parse single file with Zod validation
const data: BulkDownloadFile = await parseBulkFile(bulkDir, 'maths-primary.json');

// Or read all files
const allFiles = await readAllBulkFiles(bulkDir);
```

**Alternative**: Add `vocab-gen` export to SDK's `package.json` exports for cleaner imports. This is a decision to make during implementation.

### Data Quality Report

**READ FIRST**: [07-bulk-download-data-quality-report.md](../../../research/ooc/07-bulk-download-data-quality-report.md)

Key findings that affect implementation:

| Issue | Impact | Location in Report |
|-------|--------|-------------------|
| Maths KS4: 373 duplicate lessons | Simple deduplication + API tier enrichment | §2 - Implicit KS4 tier variants |
| Missing lesson reference | `further-demonstrating-of-pythagoras-theorem` not in lessons[] | §1 - Lesson references |
| 5 maths-primary lessons without transcripts | Handle gracefully | §Transcripts |
| Units without threads | `maths-and-the-environment`, etc. | §3 - Threads |
| NULL sentinel in contentGuidance | Already handled by vocab-gen | §Field completeness |

### Maths KS4 Duplicate Analysis (2025-12-30)

**Investigation confirmed** the 373 duplicate lessons break down as:

| Category | Count | Explanation |
|----------|-------|-------------|
| **Legitimate duplicates** | 210 | Lessons shared between BOTH tier variants (foundation + higher) |
| **Spurious duplicates** | 163 | Lessons in ONE tier only, incorrectly duplicated in `lessons[]` |

**Root cause**: The `lessons[]` array has data quality issues — some tier-specific lessons are duplicated even when they only appear in one unit variant.

**Solution**: Simple deduplication by `lessonSlug`, then apply tiers from API tier map.

### Maths KS4 Tier Coverage (2025-12-30)

**Investigation confirmed 100% tier coverage**:

| Metric | Value |
|--------|-------|
| Unique KS4 units in bulk | 36 |
| Units with tier info from API | 36 ✅ |
| Unique KS4 lessons in bulk | 436 |
| Lessons with tier derivable | 436 ✅ |

**Tier distribution**:
- **30 units** in BOTH tiers (foundation AND higher)
- **6 units** HIGHER only: `circle-theorems`, `non-right-angled-trigonometry`, `functions-and-proof`, `iteration`, `graphical-representations-of-data-cumulative-frequency-and-histograms`, `transformations-of-graphs`
- **0 units** foundation only

**Algorithm**:
1. Fetch API: `GET /sequences/maths-secondary/units`
2. Build: `Map<unitSlug, Set<'foundation' | 'higher'>>`
3. For each bulk lesson where `keyStageSlug === 'ks4'`:
   - Look up `lesson.unitSlug` in map
   - Assign `tiers: Array.from(map.get(unitSlug))`
4. Deduplicate bulk lessons by `lessonSlug`
5. Result: 436 unique KS4 lesson documents with correct tier arrays

---

## Architecture: Composition Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│  vocab-gen (REUSE)                     OakClient (EXISTING)      │
│  ├── parseBulkFile()                   ├── getSequenceUnits()    │
│  ├── readAllBulkFiles()                └── (for tier/options)    │
│  ├── Lesson, Unit, Thread types                                  │
│  └── Zod validation                                              │
│                              ↓                                   │
│              ┌─────────────────────────────────────┐             │
│              │      HybridDataSource (NEW)         │             │
│              │  Composes bulk + API as needed      │             │
│              │  Transforms to ES document format   │             │
│              └─────────────────────────────────────┘             │
│                              ↓                                   │
│              ┌─────────────────────────────────────┐             │
│              │    Existing Pipeline (MODIFIED)     │             │
│              │    index-oak.ts → ES Indexer        │             │
│              └─────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Current Pipeline Interface (What Needs to Change)

The existing `index-oak.ts` has this entry point:

```typescript
// Current: API-driven
async function buildIndexBulkOps(
  client: OakClient,                    // ← Currently the only data source
  keyStages: readonly string[],
  subjects: readonly string[],
): Promise<BuildIndexBulkOpsResult>
```

**What it does today** (all via API):

1. `client.getSubjectSequences(subject)` → sequence metadata
2. `buildSequenceFacetSources(client, ...)` → facet documents
3. `buildKs4ContextMap(client, ...)` → tier/exam board context
4. `buildKeyStageOps(client, ...)` → units, lessons, rollups
5. `fetchAndBuildThreadOps(client, ...)` → thread documents

**What we need to change**:

| Document Type | Current Source | New Source |
|---------------|----------------|------------|
| **Lessons** | `OakClient.getLessonSummary()` + `getTranscript()` | Bulk download `lessons[]` |
| **Units** | `OakClient.getSequenceUnits()` | Bulk download `sequence[]` |
| **Threads** | `OakClient.getThreads()` | Bulk download `sequence[].threads[]` |
| **KS4 Context** | API sequence traversal | API (still needed for tiers) |
| **Sequence Facets** | API | API (or derive from bulk) |

### Field Mapping: Bulk → ES Document

The `createLessonDocument()` function expects certain field names. Here's the mapping:

| ES Document Field | Bulk Download Field | Transform |
|-------------------|---------------------|-----------|
| `lesson_id` | `lessonSlug` | Direct |
| `lesson_slug` | `lessonSlug` | Direct |
| `lesson_title` | `lessonTitle` | Direct |
| `subject_slug` | `subjectSlug` | Direct |
| `key_stage` | `keyStageSlug` | Direct |
| `lesson_content` | `transcript_sentences` | Direct (may be `undefined`) |
| `lesson_keywords` | `lessonKeywords[].keyword` | Map array |
| `key_learning_points` | `keyLearningPoints[].keyLearningPoint` | Map array |
| `misconceptions_and_common_mistakes` | `misconceptionsAndCommonMistakes[].misconception` | Map array |
| `teacher_tips` | `teacherTips[].teacherTip` | Map array |
| `content_guidance` | `contentGuidance` | Already null-normalized by vocab-gen |
| `downloads_available` | `downloadsavailable` | Already handled by vocab-gen |
| `years` | *(derived)* | Join via `unitSlug` → `unit.yearSlug` |
| `unit_ids` | `unitSlug` | From lesson |
| `unit_titles` | `unitTitle` | From lesson |
| `tier` | *(from API)* | Maths KS4 only |

---

## Implementation Phases

### Phase 1: Bulk Data Adapter (TDD)

**Goal**: Create an adapter that wraps vocab-gen bulk reader for search indexing use

**Key insight**: The parsing is already done by `vocab-gen`. We need an adapter that:

1. Loads bulk data using existing `readAllBulkFiles()`
2. Transforms `Lesson` → `SearchLessonsIndexDoc` format
3. Builds unit/thread documents from `sequence[]` array
4. Handles year derivation (lesson → unit join)

**Bulk data location**: `apps/oak-open-curriculum-semantic-search/bulk-downloads/`

- 30 JSON files (one per subject-phase combination)
- Refresh with: `pnpm bulk:download` (reads API key from `.env.local`)
- `manifest.json` contains download timestamp and file list

**Files to create**:

| File | Purpose |
|------|---------|
| `src/lib/indexing/bulk-data-adapter.ts` | Transforms vocab-gen types → ES docs |
| `src/lib/indexing/bulk-data-adapter.unit.test.ts` | Unit tests |

**Files to REUSE (not create)**:

| Module | Already Exists At |
|--------|-------------------|
| Zod schemas | `@oaknational/oak-curriculum-sdk/vocab-gen` |
| Bulk reader | `@oaknational/oak-curriculum-sdk/vocab-gen` |
| Types | `BulkDownloadFile`, `Lesson`, `Unit` from vocab-gen |

**TDD Sequence**:

1. **RED**: Write test for transforming a `Lesson` to `SearchLessonsIndexDoc`
2. **GREEN**: Implement minimal transformer using vocab-gen types
3. **REFACTOR**: Add year derivation via unit join

```typescript
import { readAllBulkFiles } from '@oaknational/oak-curriculum-sdk/vocab-gen';
import type { BulkDownloadFile, Lesson, Unit } from '@oaknational/oak-curriculum-sdk/vocab-gen';

// Adapter interface (TDD will drive final shape)
interface BulkDataAdapter {
  /** Load all bulk files and build indexes */
  readonly initialize: (bulkDir: string) => Promise<void>;
  
  /** Get all lessons with derived year info */
  readonly getLessons: () => Iterable<LessonWithYear>;
  
  /** Get all units with thread info */
  readonly getUnits: () => Iterable<UnitWithThreads>;
  
  /** Get all threads (deduplicated across units) */
  readonly getThreads: () => Iterable<Thread>;
  
  /** Check if subject has bulk data */
  readonly hasSubject: (slug: string) => boolean;
}
```

**Data normalization already handled by vocab-gen**:

| Issue | Handled By |
|-------|------------|
| `"NULL"` strings | `nullSentinelSchema` in `vocabulary-schemas.ts` |
| `downloadsavailable` (typo) | `lessonSchema` accepts both |
| Year as number or "All years" | `unitSchema` with union type |
| Optional transcripts | `transcript_sentences: z.string().optional()` |

**What we still need to handle**:

| Issue | Solution |
|-------|----------|
| Maths duplicates (373 lessons) | Simple deduplication by `lessonSlug` (210 legitimate + 163 spurious) |
| Missing lesson `further-demonstrating-of-pythagoras-theorem` | Skip with warning |
| yearSlug on lessons | Join via `unitSlug` to get from unit |
| Tier assignment (maths KS4) | Derive from API unit→tier map (100% coverage confirmed) |

**Test fixtures**: Use existing vocab-gen test fixtures or create minimal ones:

```typescript
// vocab-gen already has tests - check for reusable fixtures
// packages/sdks/oak-curriculum-sdk/vocab-gen/lib/bulk-reader.unit.test.ts
// packages/sdks/oak-curriculum-sdk/vocab-gen/lib/bulk-schemas.unit.test.ts
```

### Phase 2: API Supplementation

**Goal**: Enrich bulk data with structural information from API

**API calls needed**:

| Subject | Key Stage | API Call | Purpose |
|---------|-----------|----------|---------|
| Maths | KS4 | `/sequences/maths-secondary/units` | Tier info (foundation/higher) |
| Geography | KS4 | `/sequences/geography-secondary/units` | Unit options |
| English | KS4 | `/sequences/english-secondary-*/units` | Unit options |

**Note**: RSHE-PSHE bulk files are NOT available despite being listed on the website. Verified 2025-12-30.

**RSHE-PSHE Handling**: Two contexts:

1. **Ingestion CLI**: Skip RSHE-PSHE during `pnpm es:ingest-live --all`, log warning
2. **Search API** (if filtering by subject): Return 422 Unprocessable Content

```json
HTTP 422 Unprocessable Content
Cache-Control: public, max-age=86400

{
  "error": "subject_not_available",
  "message": "We don't have source material for rshe-pshe yet. We will add it as soon as bulk download data becomes available.",
  "subject": "rshe-pshe"
}
```

**Note**: For general search queries (no subject filter), RSHE-PSHE simply won't appear in results — no error needed.

**Maths tier enrichment logic** (CONFIRMED 2025-12-30):

The API endpoint `/sequences/maths-secondary/units` returns units grouped by year with tier structure for KS4:

```json
{
  "data": [
    { "year": 7, "units": [/* KS3 - no tiers */] },
    { "year": 10, "tiers": [
        { "tierTitle": "Higher", "tierSlug": "higher", "units": [{ "unitSlug": "algebraic-manipulation", ... }] },
        { "tierTitle": "Foundation", "tierSlug": "foundation", "units": [{ "unitSlug": "algebraic-manipulation", ... }] }
      ]
    },
    { "year": 11, "tiers": [/* similar structure */] }
  ]
}
```

**Processing** (100% coverage confirmed):

1. Fetch API response for maths-secondary units
2. Build `Map<unitSlug, Set<'foundation' | 'higher'>>` from years 10-11
3. For each bulk KS4 lesson:
   - Look up `lesson.unitSlug` in map
   - Assign `tiers: Array.from(map.get(unitSlug))`

**Confirmed tier distribution**:
- 30 units appear in BOTH tiers → lessons get `tiers: ['foundation', 'higher']`
- 6 units are HIGHER only → lessons get `tiers: ['higher']`
- 0 units are foundation only

**Decision**: Use `tiers: string[]` (array format) — already matches ES schema. No separate documents needed.

**Unit options enrichment** (geography/english KS4):

The API endpoint `/sequences/{seq}/units` returns unit options:

```json
{
  "units": [
    {
      "unitSlug": "coastal-landscapes",
      "unitOptions": [
        { "slug": "coastal-landscapes-option-a", "title": "Coastal Landscapes (AQA)" },
        { "slug": "coastal-landscapes-option-b", "title": "Coastal Landscapes (Edexcel)" }
      ]
    }
  ]
}
```

**Note**: The bulk download does NOT have `unitOptions` — lessons appear without any option indicator. For now, index lessons without unit option metadata. This is acceptable as:
- Unit options are a navigation concern, not a search concern
- Users searching for "coastal landscapes" should find all related lessons regardless of option

**Future enhancement**: If unit option filtering is needed, can add enrichment later.

**Implementation**:

```typescript
interface ApiSupplementation {
  /** Get tier assignments for maths KS4 units (100% coverage confirmed) */
  readonly getMathsUnitTierMap: () => Promise<Map<string, readonly ('foundation' | 'higher')[]>>;
  
  /** Get unit options for subjects that have them */
  readonly getUnitOptions: (subject: string) => Promise<UnitOption[]>;
}
```

### Phase 3: HybridDataSource

**Goal**: Compose bulk + API into unified data source that produces ALL document types

```typescript
interface HybridDataSource {
  /** Get all lessons with materials (transcript from bulk, tier from API) */
  readonly getLessonsWithMaterials: () => AsyncIterable<LessonWithMaterials>;
  
  /** Get all units (from bulk sequence[]) */
  readonly getUnits: () => AsyncIterable<UnitDocument>;
  
  /** Get all threads (from bulk sequence[].threads, deduplicated) */
  readonly getThreads: () => AsyncIterable<ThreadDocument>;
  
  /** Get lesson count for progress tracking */
  readonly getLessonCount: () => number;
  
  /** Check if a subject has bulk data available */
  readonly isSubjectSupported: (subject: string) => boolean;
}
```

### Document Types to Build from Bulk

**The current pipeline builds 6 ES indices. Here's how each maps to bulk data:**

| Index | Current Source | Bulk Source | Notes |
|-------|----------------|-------------|-------|
| `oak_lessons` | API `/lessons/{slug}/summary` | `lessons[]` array | Primary focus |
| `oak_units` | API `/sequences/{seq}/units` | `sequence[]` array | Direct mapping |
| `oak_unit_rollup` | Aggregation of lesson data | Aggregation of bulk lessons | Build from lessons |
| `oak_threads` | API `/threads` | `sequence[].threads[]` | Dedupe across units |
| `oak_sequences` | API `/subjects/{s}/sequences` | Top-level `sequenceSlug` | Metadata only |
| `oak_sequence_facets` | API sequence traversal | Derive from sequence[] | May still need API |

### Thread Building from Bulk

Bulk download `sequence[]` contains threads on each unit:

```json
{
  "unitSlug": "fractions-year-3",
  "threads": [
    { "slug": "number-fractions", "order": 1, "title": "Number: Fractions" }
  ]
}
```

**Thread extraction**:

1. Iterate all `sequence[]` entries across all files
2. Collect unique thread slugs
3. Build `ThreadDocument` with:
   - `thread_id`: thread slug
   - `thread_title`: thread title
   - `units`: list of unit slugs in this thread (ordered by `order`)
   - `subjects`: subjects this thread appears in

### Unit Building from Bulk

Each `sequence[]` entry maps directly to a unit:

```typescript
// Bulk unit → ES unit document
function buildUnitDocument(unit: Unit, sequenceSlug: string): SearchUnitsIndexDoc {
  return {
    unit_id: unit.unitSlug,
    unit_slug: unit.unitSlug,
    unit_title: unit.unitTitle,
    year: unit.year,
    year_slug: unit.yearSlug,
    key_stage: unit.keyStageSlug,
    threads: unit.threads.map(t => t.slug),
    // ... other fields
  };
}
```

**Composition logic**:

1. Start with bulk download lessons (all 16 supported subjects)
2. For maths KS4: Enrich with tier from API
3. For geography/english KS4: Enrich with unit options from API
4. For any subject without bulk data: Return 422 Unprocessable Content

**Deduplication logic** (CONFIRMED 2025-12-30):

| Subject | Duplicates In Bulk | Handling |
|---------|--------------------|-----------------------------|
| Maths KS4 | 373 (210 legitimate tier-shared + 163 spurious) | Simple dedupe by `lessonSlug`, apply tiers from API unit map |
| Science KS4 | None (subjectSlug distinguishes) | `lessonSlug` is unique |
| Others | None | `lessonSlug` is unique |

**Key insight**: The 373 duplicates include 163 spurious duplicates (data quality issue in bulk). Simple deduplication by `lessonSlug` handles both cases correctly. Tier assignment comes from the API unit→tier map, NOT from duplicate analysis.

**Error handling for missing subjects**:

If Oak adds new subjects to the API but bulk files are not yet available, return:

```json
HTTP 422 Unprocessable Content
Cache-Control: public, max-age=86400

{
  "error": "subject_not_available",
  "message": "We don't have source material for {subject} yet. We will add it as soon as bulk download data becomes available.",
  "subject": "{subject}"
}
```

**Error scenarios**:

| Scenario | Handling |
|----------|----------|
| Bulk file missing/corrupted | Log error, skip subject, continue with others |
| API call fails (tier/options) | Retry 3x, then proceed without enrichment (log warning) |
| Lesson in bulk not in API | Normal — API has TPC filtering, bulk is complete |
| Lesson in API not in bulk | Unexpected — log warning, don't create entry |

### Phase 4: Pipeline Integration

**Goal**: Minimal changes to existing pipeline

**Files to modify**:

| File | Change |
|------|--------|
| `src/lib/index-oak.ts` | Accept `HybridDataSource` instead of `OakClient` for lessons |
| `src/lib/elasticsearch/setup/ingest-live.ts` | Instantiate `HybridDataSource` |
| `src/lib/indexing/index.ts` | Export new adapter |

**Preserved code**:

- `OakClient` and adapters (used for API supplementation)
- ES indexing logic (document structure unchanged)
- Cache wrappers (used for API calls)
- Pattern-aware traversal (used for API-only subjects)

### Phase 5b: CLI Wiring Implementation Detail

**Goal**: Add bulk mode execution path to `ingest-live.ts`

**Key insight**: Bulk mode still needs API calls for maths KS4 tier enrichment. The rate limiting strategy:

```
┌─────────────────────────────────────────────────────────────────┐
│  Bulk Mode Execution Flow                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. CREATE CLIENT (with rate limit tracker)                      │
│     └── createIngestionClient({ bypassCache, ignoreCached404 })  │
│                                                                  │
│  2. PREPARE BULK OPERATIONS (no rate limit wrapper)              │
│     └── prepareBulkIngestion({ bulkDir, client })                │
│         ├── readAllBulkFiles(bulkDir)  ← File I/O, no rate limit │
│         ├── createHybridDataSource()                             │
│         │   └── buildKs4SupplementationContext()                 │
│         │       └── client.getSequenceUnits()  ← API, rate limited│
│         └── extractThreadsFromBulkFiles()  ← Pure, no rate limit │
│                                                                  │
│  3. DISPATCH TO ES (if not dry-run)                              │
│     └── dispatchBulk(es, operations)  ← ES call, no rate limit   │
│                                                                  │
│  4. PRINT SUMMARY AND STATS                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Why no `withRateLimitMonitoring` wrapper for bulk mode**:

- API mode calls the Oak API repeatedly (once per lesson/unit/transcript)
- Bulk mode calls the Oak API sparingly (once per subject with KS4 tiers)
- The `OakClient` already has rate limit tracking built in
- Wrapping the entire bulk operation would be misleading (most work is file I/O)

**Implementation checklist**:

1. Add `if (args.bulk)` branch in `runIngestion` or create `runBulkIngestion` function
2. Create ES transport using existing `esClient()`
3. Create `OakClient` using `createIngestionClient()` (for API supplementation)
4. Call `prepareBulkIngestion({ bulkDir: args.bulkDir, client })`
5. If dry-run: log stats only
6. If not dry-run: call `dispatchBulk(es, result.operations)`
7. Print summary using existing `printSummary` or create bulk-specific output

---

## Testing Strategy

**Follow [testing-strategy.md](../../../directives-and-memory/testing-strategy.md)**.

### Unit Tests (TDD First)

| Test File | Tests |
|-----------|-------|
| `bulk-data-adapter.unit.test.ts` | Transform lesson → ES doc |
| | Transform unit → ES doc |
| | Transform thread → ES doc |
| | Year derivation via unit join |
| | Handle missing transcripts (MFL) |
| | Handle null sentinel values (already done by vocab-gen) |

**Use fixtures, not real data**:

```typescript
// Example fixture (minimal)
const minimalBulkFile: BulkDownloadFile = {
  sequenceSlug: 'maths-primary',
  subjectTitle: 'Maths',
  sequence: [{
    unitSlug: 'unit-1',
    unitTitle: 'Unit One',
    year: 1,
    yearSlug: 'year-1',
    keyStageSlug: 'ks1',
    threads: [],
    unitLessons: ['lesson-1'],
    // ... other required fields
  }],
  lessons: [{
    lessonSlug: 'lesson-1',
    lessonTitle: 'Lesson One',
    unitSlug: 'unit-1',
    subjectSlug: 'maths',
    keyStageSlug: 'ks1',
    transcript_sentences: 'Hello, welcome to this lesson...',
    // ... other required fields
  }],
};
```

### Integration Tests

| Test File | Tests |
|-----------|-------|
| `hybrid-data-source.integration.test.ts` | Bulk + API composition |
| | Maths tier enrichment |
| | Missing subject → 422 |
| | Error handling (missing file) |

**Integration tests use simple mocks**:

```typescript
// Simple mock for API client
const mockOakClient = {
  getSequenceUnits: vi.fn().mockResolvedValue({
    units: [{ unitSlug: 'unit-1', tiers: [{ tier: 'foundation', lessons: ['lesson-1'] }] }]
  })
};
```

### E2E Tests

E2E tests validate the full system:

```typescript
// e2e-tests/ingest-bulk.e2e.test.ts
describe('Bulk ingestion E2E', () => {
  it('should ingest lessons from bulk download', async () => {
    // Spawn ingest process with test bulk data
    // Verify ES contains expected documents
  });
});
```

---

## Acceptance Criteria

### Phase 0: SDK Bulk Export — ✅ COMPLETE

- [x] Generated Zod schemas at `type-gen` time (schema-first)
- [x] All extractors moved to `src/bulk/extractors/`
- [x] All generators moved to `src/bulk/generators/`
- [x] Public export via `@oaknational/oak-curriculum-sdk/public/bulk`
- [x] `vocab-gen` updated to import from SDK (DRY)

### Phase 1: Bulk Data Adapter — ⚠️ INCOMPLETE

- [x] Unit tests written FIRST (TDD red phase)
- [x] SDK types used (schema-first)
- [x] Transform `Lesson` → `SearchLessonsIndexDoc` works
- [x] Transform `Unit` → `SearchUnitsIndexDoc` works
- [x] Year derivation via unit join works
- [ ] ❌ **`lesson_structure` fields populated** — explicitly set to `undefined`
- [ ] ❌ **`lesson_structure_semantic` fields populated** — explicitly set to `undefined`
- [ ] ❌ **Tests asserting structure fields are populated** — no such tests exist

### Phase 2: API Supplementation — ✅ COMPLETE

- [x] Maths tier assignments retrieved (436 KS4 lessons)
- [x] Tier enrichment tested with simple mock
- [x] 100% coverage confirmed for maths KS4

### Phase 3: HybridDataSource — ✅ COMPLETE

- [x] Composition logic tested with unit test
- [x] KS4 tier enrichment working
- [x] Lessons and units produced

### Phase 4: Vocabulary Mining — ✅ COMPLETE

- [x] VocabularyMiningAdapter created
- [x] Uses SDK's `processBulkData()` and `generateMinedSynonyms()`
- [x] Unit tests passing

### Phase 5: Pipeline Integration — 🚨 FAILED

**Phase 5a: Bulk Thread Transformer — ✅ COMPLETE**

- [x] `bulk-thread-transformer.ts` created with `extractThreadsFromBulkFiles()` and `buildThreadBulkOperations()`
- [x] Unit tests passing (9 tests)
- [x] `bulk-ingestion.ts` updated to include thread operations
- [x] Unit tests passing (3 tests with thread assertions)

**Phase 5b: Wire into CLI — ✅ COMPLETE**

- [x] `ingest-cli-args.ts` — Added `--bulk` flag and `--bulk-dir <path>` option
- [x] `ingest-live.ts` — Bulk mode execution path
- [x] `ingest-bulk.ts` — Bulk ingestion orchestration
- [x] `ingest-output.ts` — Output formatting
- [x] Quality gates passing

**Phase 5c: Full Ingestion — 🚨 FAILED**

Ingestion completed but with critical failures:

| Expected | Actual | Status |
|----------|--------|--------|
| ~12,833 lessons | 2,884 | 🚨 **22% — 78% MISSING** |
| 16 subjects | 14 | 🚨 **PE, Spanish missing** |
| `oak_unit_rollup` populated | 0 docs | 🚨 **EMPTY** |
| `lesson_structure` fields | `undefined` | 🚨 **MISSING** |

**Rate Limiting Approach** (implemented correctly):

| Operation | Rate Limited? | Reason |
|-----------|---------------|--------|
| Bulk file I/O (reading JSON from disk) | ❌ No | Local disk, no external calls |
| ES bulk dispatch (writing to Elasticsearch) | ❌ No | Local ES, not Oak API |
| Maths KS4 tier enrichment (API call) | ✅ Yes | Calls Oak API `/sequences/maths-secondary/units` |

### Quality Gates (ALL must pass)

```bash
pnpm type-gen && pnpm build && pnpm type-check
pnpm lint:fix && pnpm format:root && pnpm markdownlint:root
pnpm test && pnpm test:e2e && pnpm test:e2e:built
```

---

## Expected Counts (from Bulk Download)

| Subject              | Unique Lessons | Notes                    |
| -------------------- | -------------- | ------------------------ |
| maths                | 1,934          | Includes KS4 tiers       |
| english              | 2,525          | Has unit options         |
| science              | 1,277          | Includes KS4 exam subjects |
| physical-education   | 992            |                          |
| geography            | 683            | Has unit options         |
| history              | 684            |                          |
| religious-education  | 612            |                          |
| computing            | 528            |                          |
| french               | 522            | MFL — no transcripts     |
| spanish              | 525            | MFL — no transcripts     |
| music                | 434            |                          |
| german               | 411            | MFL — no transcripts     |
| art                  | 403            | Has unit options         |
| design-technology    | 360            | Has unit options         |
| citizenship          | 318            |                          |
| cooking-nutrition    | 108            | No KS4                   |
| rshe-pshe            | —              | ❌ **422** (bulk file unavailable) |
| **TOTAL**            | **~12,300**    | 16 subjects              |

---

## CLI Flags (Unchanged)

| Flag                  | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `--all`               | Ingest all 17 subjects                           |
| `--subject <slug>`    | Ingest specific subject(s)                       |
| `--keystage <slug>`   | Filter by key stage                              |
| `--verbose`           | Detailed logging                                 |
| `--dry-run`           | Show what would be indexed                       |
| `--force`             | Use `index` action (overwrites existing docs)    |
| `--bypass-cache`      | Skip Redis cache (API calls only)                |

---

## Removed: Video Availability Detection

The `video-availability.ts` code has been removed per ADR-093. With bulk-first:

- Transcripts come directly from bulk download (no API 404 detection needed)
- Video availability is implicit in transcript presence
- TPC filtering is no longer relevant for transcripts

**See**: [ADR-091](../../../../docs/architecture/architectural-decisions/091-video-availability-detection-strategy.md) (superseded)

---

## Related Documents

### Foundation (MANDATORY)

- [rules.md](../../../directives-and-memory/rules.md) — Cardinal Rule, TDD, no type shortcuts
- [testing-strategy.md](../../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
- [schema-first-execution.md](../../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

### ADRs

- [ADR-093](../../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) - Bulk-first ingestion strategy
- [ADR-089](../../../../docs/architecture/architectural-decisions/089-index-everything-principle.md) - Index Everything principle
- [ADR-087](../../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) - Batch-atomic ingestion
- [ADR-091](../../../../docs/architecture/architectural-decisions/091-video-availability-detection-strategy.md) - Superseded by ADR-093

### Analysis & Research

- [bulk-download-vs-api-comparison.md](../../../analysis/bulk-download-vs-api-comparison.md) - Strategic analysis
- [07-bulk-download-data-quality-report.md](../../../research/ooc/07-bulk-download-data-quality-report.md) - **Data quality issues**

### Existing Infrastructure (REUSE)

**Bulk Parsing (vocab-gen)**:

- [`vocab-gen` module](../../../../packages/sdks/oak-curriculum-sdk/vocab-gen/) - Bulk parsing, Zod schemas
- [`bulk-reader.ts`](../../../../packages/sdks/oak-curriculum-sdk/vocab-gen/lib/bulk-reader.ts) - File reading
- [`lesson-schema.ts`](../../../../packages/sdks/oak-curriculum-sdk/vocab-gen/lib/lesson-schema.ts) - Lesson validation
- [`unit-schemas.ts`](../../../../packages/sdks/oak-curriculum-sdk/vocab-gen/lib/unit-schemas.ts) - Unit validation

**ES Document Building (search SDK)**:

- [`lesson-document-builder.ts`](../../../../apps/oak-open-curriculum-semantic-search/src/lib/indexing/lesson-document-builder.ts) - Creates lesson ES docs
- [`document-transforms.ts`](../../../../apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transforms.ts) - Transform utilities
- [`bulk-action-factory.ts`](../../../../apps/oak-open-curriculum-semantic-search/src/lib/indexing/bulk-action-factory.ts) - ES bulk actions
