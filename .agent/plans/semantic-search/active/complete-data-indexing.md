# Milestone 1: Complete Data Indexing (Bulk-First)

**Status**: 📋 PENDING — Bulk download parser implementation required
**Priority**: High — BLOCKING all other work
**Parent**: [README.md](../README.md) | [roadmap.md](../roadmap.md)
**Created**: 2025-12-24
**Updated**: 2025-12-30
**Principle**: Index EVERYTHING — ES is a complete view of the curriculum

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
| Maths KS4: 373 duplicate lessons | Need API tier enrichment | §2 - Implicit KS4 tier variants |
| Missing lesson reference | `further-demonstrating-of-pythagoras-theorem` not in lessons[] | §1 - Lesson references |
| 5 maths-primary lessons without transcripts | Handle gracefully | §Transcripts |
| Units without threads | `maths-and-the-environment`, etc. | §3 - Threads |
| NULL sentinel in contentGuidance | Already handled by vocab-gen | §Field completeness |

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
| Maths duplicates (373 lessons) | Deduplicate after API tier enrichment |
| Missing lesson `further-demonstrating-of-pythagoras-theorem` | Skip with warning |
| yearSlug on lessons | Join via `unitSlug` to get from unit |

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

**Maths tier enrichment logic**:

The API endpoint `/sequences/maths-secondary/units` returns units with tier structure:

```json
{
  "units": [
    {
      "unitSlug": "algebraic-fractions",
      "tiers": [
        { "tier": "foundation", "lessons": ["lesson-slug-1", "lesson-slug-2"] },
        { "tier": "higher", "lessons": ["lesson-slug-1", "lesson-slug-3"] }
      ]
    }
  ]
}
```

**Processing**:

1. Fetch API response for maths-secondary units
2. Build a `Map<lessonSlug, Set<tier>>` — some lessons appear in both tiers
3. When enriching bulk lessons:
   - If lesson in foundation only → `tier: 'foundation'`
   - If lesson in higher only → `tier: 'higher'`
   - If lesson in both → create TWO index entries (one per tier) OR `tier: 'both'`

**Open decision**: For lessons in both tiers, do we:

- A) Create two ES documents (allows tier-specific filtering)
- B) Create one document with `tier: 'both'` (simpler, smaller index)

**Recommendation**: Option B — simpler, and tier filtering can use `tier IN ['foundation', 'both']`.

**Note**: This decision can be made during implementation — TDD will guide the right choice based on how tier filtering is used in search queries.

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
  /** Get tier assignments for maths KS4 lessons */
  readonly getMathsTierAssignments: () => Promise<Map<string, 'foundation' | 'higher' | 'both'>>;
  
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

**Deduplication logic**:

| Subject | Duplicates In Bulk | Unique Key After Enrichment |
|---------|--------------------|-----------------------------|
| Maths KS4 | 373 lessons × 2 (no tier discriminator) | `(lessonSlug, tier)` — dedupe to single entry with `tier: 'both'` if in both |
| Science KS4 | None (subjectSlug distinguishes) | `(lessonSlug, subjectSlug)` — biology, chemistry, physics, combined-science |
| Others | None | `lessonSlug` |

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

### Phase 1: Bulk Data Adapter

- [ ] Unit tests written FIRST (TDD red phase)
- [ ] vocab-gen types reused (no duplicate type definitions)
- [ ] Transform `Lesson` → `SearchLessonsIndexDoc` works
- [ ] Transform `Unit` → `SearchUnitsIndexDoc` works
- [ ] Thread extraction and deduplication works
- [ ] Year derivation via unit join works
- [ ] All 30 bulk files parseable (use `readAllBulkFiles()`)
- [ ] Lesson count matches expected (~12,783 raw, ~12,316 unique)

### Phase 2: API Supplementation

- [ ] Maths tier assignments retrieved (373 KS4 lessons)
- [ ] Tier enrichment tested with simple mock
- [ ] Unit options retrieved for geography/english (optional - can defer)
- [ ] RSHE-PSHE handling: skip in ingestion, 422 in API

### Phase 3: HybridDataSource

- [ ] Composition logic tested with integration test
- [ ] Deduplication correct (lesson × tier × exam-subject)
- [ ] All document types produced (lessons, units, threads)
- [ ] Error handling: missing file, API failure

### Phase 4: Pipeline Integration

- [ ] Full ingestion completes (`pnpm es:ingest-live --all`)
- [ ] ~12,300 unique lessons indexed
- [ ] All 6 indices populated
- [ ] All 16 supported subjects present
- [ ] Quality gates passing

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
