# Semantic Search — Session Context

**Status**: ✅ Ready for implementation — Bulk-first ingestion strategy approved
**Last Updated**: 2025-12-30
**Master Plan**: [Semantic Search Roadmap](../../plans/semantic-search/roadmap.md)
**Implementation Plan**: [complete-data-indexing.md](../../plans/semantic-search/active/complete-data-indexing.md)
**Data Quality Report**: [07-bulk-download-data-quality-report.md](../../research/ooc/07-bulk-download-data-quality-report.md)
**ADR**: [ADR-093: Bulk-First Ingestion Strategy](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md)

---

## 📋 QUICK START FOR NEW SESSIONS

This document provides standalone context to continue semantic search implementation.

### What We're Building

A semantic search system for the Oak curriculum using Elasticsearch. The system indexes ~12,300 lessons across 16 subjects, enabling teachers, students, and AI agents to search curriculum content by meaning.

### Foundation Documents (MANDATORY)

**Read these before any work:**

1. **[rules.md](../../directives-and-memory/rules.md)** — Cardinal Rule, TDD, no type shortcuts
2. **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — TDD at ALL levels
3. **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator is source of truth

### Current Status

| Milestone | Status |
|-----------|--------|
| Strategic pivot to bulk-first | ✅ Complete |
| Bulk download infrastructure | ✅ Complete |
| `video-availability.ts` removal | ✅ Complete |
| Adapter refactoring | ✅ Complete |
| Pattern-aware traversal | ✅ Complete |
| **Bulk Data Adapter (TDD)** | 📋 **NEXT STEP** |
| HybridDataSource composition | 📋 Pending |
| Full ES ingestion | 📋 Pending |

### Key Commands

```bash
# From apps/oak-open-curriculum-semantic-search

# Refresh bulk download data (reads OAK_API_KEY from .env.local)
pnpm bulk:download

# Run quality gates (from repo root)
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix
pnpm format:root && pnpm markdownlint:root
pnpm test && pnpm test:e2e && pnpm test:e2e:built
```

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

### Usage

**Note**: `vocab-gen` is currently a dev tool, not exported from SDK. Import via relative path:

```typescript
// Direct import (search SDK is in same monorepo)
import { parseBulkFile, readAllBulkFiles } from '../../../../packages/sdks/oak-curriculum-sdk/vocab-gen/lib/index.js';
import type { BulkDownloadFile, Lesson, Unit } from '../../../../packages/sdks/oak-curriculum-sdk/vocab-gen/lib/index.js';

// Parse single file with Zod validation
const data: BulkDownloadFile = await parseBulkFile(bulkDir, 'maths-primary.json');
```

**Alternative**: Add `vocab-gen` export to SDK's `package.json` for cleaner imports (implementation decision).

### Data Quality Report (READ FIRST)

**[07-bulk-download-data-quality-report.md](../../research/ooc/07-bulk-download-data-quality-report.md)** documents all data quality issues.

Key issues that affect implementation:

- Maths KS4: 373 duplicate lessons (need API tier enrichment)
- Missing lesson reference: `further-demonstrating-of-pythagoras-theorem`
- 5 maths-primary lessons without transcripts
- Units without threads: `maths-and-the-environment`, etc.

---

## ✅ STRATEGIC DECISION (2025-12-30)

**Decision**: Use bulk download as primary data source with API for supplementary structural data only.

See [Bulk Download vs API Comparison](../../analysis/bulk-download-vs-api-comparison.md) for detailed analysis.

### Summary

| Source | Use For | Coverage |
|--------|---------|----------|
| **Bulk Download** | Lessons, units, threads, transcripts, keywords, learning points | 16/17 subjects (30 files) |
| **API** | Tier info (maths KS4), unit options (optional) | Structural data only |

### Key Implementation Notes

1. **Reuse vocab-gen**: Bulk parsing is already implemented — create adapter to transform to ES format
2. **Maths tier handling**: Must call API's `/sequences/maths-secondary/units` to determine tier
3. **RSHE-PSHE handling**: Skip in ingestion, return 422 in API (bulk file not available)
4. **Null handling**: Already done by vocab-gen's `nullSentinelSchema`
5. **✅ Removed**: `video-availability.ts` — no longer needed with bulk-first approach

---

## 🗂️ Bulk Download Infrastructure (2025-12-30)

Bulk download infrastructure is complete and working.

### Downloaded Files

**Location**: `apps/oak-open-curriculum-semantic-search/bulk-downloads/`

| Metric | Value |
|--------|-------|
| Download date | 2025-12-30T16:23:00Z |
| Source | `https://open-api.thenational.academy/api/bulk` |
| JSON files | 30 |
| Total size | ~757 MB |
| Missing | rshe-pshe-primary.json, rshe-pshe-secondary.json |

### Subject Coverage

**16 subjects available** (30 files):

| Subject | Primary | Secondary |
|---------|---------|-----------|
| art | ✅ | ✅ |
| citizenship | — | ✅ |
| computing | ✅ | ✅ |
| cooking-nutrition | ✅ | ✅ |
| design-technology | ✅ | ✅ |
| english | ✅ | ✅ |
| french | ✅ | ✅ |
| geography | ✅ | ✅ |
| german | — | ✅ |
| history | ✅ | ✅ |
| maths | ✅ | ✅ |
| music | ✅ | ✅ |
| physical-education | ✅ | ✅ |
| religious-education | ✅ | ✅ |
| **rshe-pshe** | ❌ | ❌ |
| science | ✅ | ✅ |
| spanish | ✅ | ✅ |

### RSHE-PSHE Status

**CONFIRMED MISSING**: The Oak bulk download website lists RSHE-PSHE as available, but the API does not return it. This has been verified:

1. Download script requests `rshe-pshe-primary` and `rshe-pshe-secondary`
2. API returns ZIP with 30 files, RSHE-PSHE not included
3. No error returned — files simply not in response

**Decision**: Return HTTP 422 Unprocessable Content with clear error message and 24-hour cache header for RSHE-PSHE requests.

### Refresh Cadence

Manual refresh every few weeks:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm bulk:download
```

---

## 📚 Historical Findings (2025-12-30)

A deep investigation into transcript availability revealed fundamental data source differences.

### The Core Discovery

| Data Source | Transcript Coverage | Notes |
|-------------|---------------------|-------|
| **Bulk Download** | ~81% of lessons (14/17 subjects) | Complete transcripts |
| **Live API** | ~16% of lessons (maths only) | TPC-filtered |
| **MFL Subjects** | 0% | No video content exists |

**Key insight**: The bulk download and API are not equivalent data sources. They serve different purposes.

### Why This Matters

The previous ingestion pipeline fetched transcripts via the live API. For non-maths subjects, this resulted in:

- ~65% of transcript requests returning 404
- Many "transcript not found" warnings (expected, not bugs)
- Semantic search limited to metadata-only for most subjects

**This is documented, expected behavior** — see [Oak API Content Coverage](https://open-api.thenational.academy/docs/about-oaks-data/content-coverage):

> "Currently, the API includes **all lesson resources for KS1-4 maths**, plus a **sample of lesson resources** for [other subjects]"

### ✅ Video/Transcript Detection Code REMOVED

The video availability detection code (`video-availability.ts`, ADR-091) was designed to optimize transcript fetching by pre-checking which lessons have videos. **This code has been removed because:**

1. **Bulk-first approach**: Transcripts come directly from bulk download — no API 404 detection needed
2. **TPC filtering is no longer relevant**: We don't call the transcript API anymore
3. **Simpler architecture**: One fewer module to maintain

**Files removed**: `src/lib/indexing/video-availability.ts`, `src/lib/indexing/video-availability.unit.test.ts`

**See**: [ADR-091](../../../docs/architecture/architectural-decisions/091-video-availability-detection-strategy.md) (superseded by ADR-093)

---

## 📊 Data Sources Compared

### Bulk Download (`reference/bulk_download_data/`)

| Attribute | Value |
|-----------|-------|
| **Last downloaded** | 2025-12-07 |
| **Total lessons** | 12,783 |
| **Subjects with full transcripts** | 14 (art, citizenship, computing, cooking-nutrition, design-technology, english, geography, history, maths, music, religious-education, science, RSHE) |
| **Subjects with no transcripts** | 3 (french, german, spanish — MFL subjects) |
| **Subjects with partial transcripts** | 1 (PE — 29% secondary, 0.7% primary) |
| **Data quality issues** | Null titles, tier duplicates, inconsistent null semantics |
| **Refresh frequency** | Unknown (no documented schedule) |

### Live API

| Attribute | Value |
|-----------|-------|
| **Transcript coverage** | Maths: 100%, Others: "sample" (~0-35%) |
| **Pagination bug** | 5 lessons missing from maths KS4 unfiltered queries |
| **TPC filtering** | Assets/transcripts filtered for license compliance |
| **Production timeline** | Full coverage expected **Autumn 2025** |

### Detailed Transcript Availability (Bulk Download)

| Subject | Primary | Secondary | Notes |
|---------|---------|-----------|-------|
| Art | 100% | 100% | |
| Citizenship | — | 100% | |
| Computing | 100% | 100% | |
| Cooking & Nutrition | 100% | 100% | |
| Design Technology | 100% | 100% | |
| English | 98% | 100% | 28 lessons without |
| Geography | 100% | 100% | |
| History | 100% | 100% | |
| **Maths** | 99.5% | 100% | 5 lessons without |
| Music | 100% | 96% | |
| Religious Education | 100% | 100% | |
| Science | 100% | 100% | |
| **French** | **0%** | **0.2%** | MFL — no video |
| **German** | — | **0.2%** | MFL — no video |
| **Spanish** | **0.9%** | **0%** | MFL — no video |
| **PE** | **0.7%** | **29%** | Partial video |

---

## 🔀 Strategic Options

Three approaches are available. None is assumed — discussion required.

### Option A: API-Only Ingestion (Current Implementation)

```
┌─────────────────────────────────────────────────────────────────┐
│  Continue with current pipeline                                  │
│                                                                  │
│  How it works:                                                   │
│  - Fetch lessons via API (unit-by-unit to avoid pagination bug) │
│  - Fetch transcripts via API (expect 404 for non-maths)         │
│  - Index all lessons, with or without transcripts               │
│                                                                  │
│  Pros:                                                           │
│  ✅ Already implemented and tested                               │
│  ✅ Real-time data (not stale)                                   │
│  ✅ Can proceed immediately                                      │
│                                                                  │
│  Cons:                                                           │
│  ❌ ~65% of non-maths transcript fetches return 404              │
│  ❌ Semantic search limited to maths + metadata                  │
│  ❌ Many expected warnings (noisy logs)                          │
│                                                                  │
│  Effort: 0 days                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Option B: Bulk Download Hybrid

```
┌─────────────────────────────────────────────────────────────────┐
│  Use bulk download for transcripts, API for metadata            │
│                                                                  │
│  How it works:                                                   │
│  - Parse bulk download JSON files for lesson enumeration        │
│  - Extract transcripts from bulk download                       │
│  - Supplement with API for real-time metadata if needed         │
│                                                                  │
│  Pros:                                                           │
│  ✅ 81% of lessons get full transcripts                          │
│  ✅ Semantic search works across 14/17 subjects                  │
│  ✅ No "transcript not found" noise                              │
│  ✅ Faster ingestion (no per-lesson API calls for transcripts)  │
│                                                                  │
│  Cons:                                                           │
│  ❌ ~4.5 days implementation                                     │
│  ❌ Bulk download may be stale (no refresh mechanism yet)        │
│  ❌ Must handle bulk download data issues (null titles, etc.)    │
│                                                                  │
│  Effort: ~4.5 days                                               │
└─────────────────────────────────────────────────────────────────┘
```

### Option C: Dual-Index Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Separate indexes for different content types                   │
│                                                                  │
│  How it works:                                                   │
│  - Index 1: Rich (maths + bulk subjects with transcripts)       │
│  - Index 2: Foundation (MFL + PE without transcripts)           │
│  - Different retrieval strategies per index                     │
│                                                                  │
│  Pros:                                                           │
│  ✅ Optimized retrieval per content type                         │
│  ✅ Clear separation of capabilities                             │
│  ✅ Maths serves as exemplar with full features                  │
│                                                                  │
│  Cons:                                                           │
│  ❌ ~2 days implementation                                       │
│  ❌ More complex retriever logic                                 │
│  ❌ Two indexes to maintain                                      │
│  ❌ User experience question ("why is maths search better?")     │
│                                                                  │
│  Effort: ~2 days                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Option D: Wait for Autumn 2025

```
┌─────────────────────────────────────────────────────────────────┐
│  Wait for Oak to complete full API coverage                     │
│                                                                  │
│  Oak documentation states:                                       │
│  "Production is expected to finish in Autumn 2025"              │
│                                                                  │
│  Pros:                                                           │
│  ✅ Full transcript coverage via API                             │
│  ✅ No hybrid complexity                                         │
│  ✅ Single source of truth                                       │
│                                                                  │
│  Cons:                                                           │
│  ❌ 9+ months delay                                              │
│  ❌ Uncertain timeline                                           │
│  ❌ Maths-only semantic search in the meantime                   │
│                                                                  │
│  Effort: Time-based                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤔 Discussion Points for Next Session

Before proceeding, consider:

### 1. What user impact are we optimizing for?

- **Option A**: Ship fast with maths-only semantic search
- **Option B/C**: Broader coverage but more work
- **Option D**: Best coverage but long wait

### 2. Is "maths as exemplar" an acceptable interim state?

The current implementation provides full semantic search for maths (~16% of lessons). Is this valuable enough to ship while other subjects get metadata-only search?

### 3. How stale is acceptable for bulk download data?

The bulk download is ~3 weeks old. If we use it:
- What refresh mechanism do we need?
- How do we detect/handle new lessons added via API?

### 4. Is dual-index complexity justified?

Option C adds retrieval complexity. Is the benefit of optimized per-type retrieval worth the maintenance cost?

### 5. What does "done" look like for Phase 2.6?

- All lessons indexed (regardless of transcript)? 
- Verified transcript coverage per subject?
- Search quality baseline established?

---

## 📚 Key References

### Analysis Documents

| Document | Content |
|----------|---------|
| **[transcript-availability-analysis.md](../../analysis/transcript-availability-analysis.md)** | **Comprehensive findings from this investigation** — data tables, assumptions tested, investigation chronology |
| [curriculum-structure-analysis.md](../../analysis/curriculum-structure-analysis.md) | All 6 structural patterns, traversal strategies |

### API Wishlist Updates (2025-12-30)

New items added to `00-overview-and-known-issues.md`:

| ID | Request | Priority |
|----|---------|----------|
| **ER1** | Full data coverage across all subjects | HIGH |
| **ER2** | Documentation of API vs bulk download differences | MEDIUM |
| **ER3** | `hasTranscript` boolean flag in lessons endpoint | MEDIUM |
| Q1-Q6 | Clarifying questions for upstream team | — |

### ADRs

| ADR | Decision |
|-----|----------|
| [ADR-083](../../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md) | Fetch lessons unit-by-unit (workaround for pagination bug) |
| [ADR-091](../../../docs/architecture/architectural-decisions/091-video-availability-detection-strategy.md) | Tri-state `hasVideo()` function for TPC-filtered assets |
| [ADR-092](../../../docs/architecture/architectural-decisions/092-transcript-cache-categorization.md) | Structured transcript cache metadata |

### External Documentation

| Link | Content |
|------|---------|
| [Oak Content Coverage](https://open-api.thenational.academy/docs/about-oaks-data/content-coverage) | Official statement on API resource availability |
| [Oak Terms](https://open-api.thenational.academy/docs/about-oaks-api/terms) | OGL v3.0 licensing |
| [Bulk Download](https://open-api.thenational.academy/bulk-download) | Full dataset download |

---

## ✅ Completed Work Summary

All prerequisite work is complete. The system is ready for BulkDownloadSource implementation.

### Strategic Pivot — COMPLETE ✅ (2025-12-30)

| Decision | Outcome |
|----------|---------|
| Bulk-first ingestion strategy | Approved — ADR-093 created |
| Video availability detection | Removed — `video-availability.ts` deleted |
| RSHE-PSHE handling | 422 Unprocessable Content (no API fallback) |
| Redis cache | Retained for API supplementation calls |

### Bulk Download Infrastructure — COMPLETE ✅ (2025-12-30)

| Task | Status | Result |
|------|--------|--------|
| Download script created | ✅ | `scripts/download-bulk.ts` |
| pnpm command added | ✅ | `pnpm bulk:download` |
| Fresh data downloaded | ✅ | 30 files, 757 MB |
| Manifest created | ✅ | `manifest.json` with timestamps |
| Gitignore configured | ✅ | JSON files excluded |

### Pattern-Aware Ingestion — COMPLETE ✅

All 7 curriculum structural patterns implemented (used for API calls):

| Pattern | Subjects |
|---------|----------|
| `simple-flat` | All KS1-KS3, some KS4 |
| `tier-variants` | Maths KS4 |
| `exam-subject-split` | Science KS4 |
| `exam-board-variants` | 12 subjects KS4 |
| `unit-options` | 6 subjects KS4 |
| `no-ks4` | Cooking-nutrition |
| `empty` | Edge cases |

### Infrastructure — COMPLETE ✅

| Task | Status | Result |
|------|--------|--------|
| Adapter refactoring | ✅ | 593→197 lines, TDD-driven |
| ES reset | ✅ | 7 indices, 192 synonyms |
| Cache validation | ✅ | 756 hits, 1 miss |
| ES upsert verify | ✅ | 638 docs (maths KS1) |
| Cache categorization | ✅ | Structured metadata, zero compat layers |
| Quality gates | ✅ | All 11 passing |

---

## 📋 Next Implementation Steps

### Phase 1: Bulk Data Adapter (TDD) — **NEXT STEP**

Create an adapter that wraps vocab-gen bulk reader for search indexing use.

**Full implementation details**: [complete-data-indexing.md](../../plans/semantic-search/active/complete-data-indexing.md)

**Key insight**: Parsing is already done. We need an adapter that:

1. Loads bulk data using existing `readAllBulkFiles()`
2. Transforms `Lesson` → `SearchLessonsIndexDoc`
3. Transforms `Unit` → `SearchUnitsIndexDoc`
4. Extracts threads from `sequence[].threads[]`

**TDD Sequence**:

1. **RED**: Write test for transforming a `Lesson` to ES doc
2. **GREEN**: Implement minimal transformer using vocab-gen types
3. **REFACTOR**: Add year derivation via unit join

**Files to create**:

- `src/lib/indexing/bulk-data-adapter.ts` — Transforms vocab-gen types → ES docs
- `src/lib/indexing/bulk-data-adapter.unit.test.ts` — Unit tests

**Files to REUSE (not create)**:

- Zod schemas — already in `@oaknational/oak-curriculum-sdk/vocab-gen`
- Bulk reader — already in `@oaknational/oak-curriculum-sdk/vocab-gen`
- Types — `BulkDownloadFile`, `Lesson`, `Unit` from vocab-gen

### Phase 2: API Supplementation

Enrich bulk data with structural information:

| Subject | API Call | Purpose |
|---------|----------|---------|
| Maths KS4 | `/sequences/maths-secondary/units` | Tier info (foundation/higher) |

**Note**: Unit options (geography/english) can be deferred — not critical for search.

### Phase 3: HybridDataSource

Compose bulk + API into unified data source:

```typescript
interface HybridDataSource {
  readonly getLessonsWithMaterials: () => AsyncIterable<LessonWithMaterials>;
  readonly getUnits: () => AsyncIterable<UnitDocument>;
  readonly getThreads: () => AsyncIterable<ThreadDocument>;
  readonly isSubjectSupported: (subject: string) => boolean;  // 422 for RSHE-PSHE
}
```

### Phase 4: Pipeline Integration

1. Update `index-oak.ts` to use `HybridDataSource`
2. Minimal changes to existing pipeline
3. Run full ingestion: `pnpm es:ingest-live --all --verbose`

---

## Infrastructure Status

### Bulk Download Status (2025-12-30)

| Metric | Value | Status |
|--------|-------|--------|
| Download location | `apps/.../bulk-downloads/` | ✅ Created |
| JSON files | 30 | ✅ Downloaded |
| manifest.json | Present | ✅ Written |
| Download script | `scripts/download-bulk.ts` | ✅ Working |
| pnpm command | `pnpm bulk:download` | ✅ Available |

### ES Index Status (After Reset — 2025-12-29)

| Index | Doc Count | Target | Status |
|-------|-----------|--------|--------|
| `oak_lessons` | 437 (maths KS1) | ~12,300 | 📋 Needs full ingestion |
| `oak_units` | TBD | — | 📋 Needs full ingestion |
| `oak_unit_rollup` | TBD | — | 📋 Needs full ingestion |
| `oak_threads` | 201 (maths KS1) | — | 📋 Needs full ingestion |
| `oak_sequences` | TBD | — | 📋 Needs full ingestion |
| `oak_sequence_facets` | TBD | — | 📋 Needs full ingestion |

### Redis Cache Status (Verified Working)

| Metric | Value | Status |
|--------|-------|--------|
| Lesson summaries cached | 7,089 | ✅ Accessible |
| Lesson transcripts cached | 4,281 | ✅ Accessible |
| Unit summaries cached | 669 | ✅ Accessible |
| **Total cached** | **12,039** | ✅ Working |

**Note**: Redis cache is used for API supplementation calls only (maths tier, unit options).

---

## Quality Gates

Run from repo root after any changes:

```bash
pnpm type-gen          # Generate types from schema
pnpm build             # Build all packages
pnpm type-check        # TypeScript validation
pnpm lint:fix          # Auto-fix linting issues
pnpm format:root       # Format code
pnpm markdownlint:root # Markdown lint
pnpm test              # Unit + integration tests
pnpm test:e2e          # E2E tests
pnpm test:e2e:built    # E2E on built app
pnpm test:ui           # Playwright UI tests
pnpm smoke:dev:stub    # Smoke tests
```

**All gates must pass. No exceptions.**

---

## Foundation Documents (MANDATORY)

Before any work, read:

1. **[rules.md](../../directives-and-memory/rules.md)** — First Question: "Could it be simpler?"
2. **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — TDD at all levels
3. **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator is source of truth
4. **[AGENT.md](../../directives-and-memory/AGENT.md)** — Agent-specific directives

---

## Key Files Reference

### ⭐ Bulk Parsing Infrastructure (REUSE)

| File | Purpose |
|------|---------|
| `packages/sdks/oak-curriculum-sdk/vocab-gen/lib/bulk-reader.ts` | **File reading** — `parseBulkFile()`, `readAllBulkFiles()` |
| `packages/sdks/oak-curriculum-sdk/vocab-gen/lib/bulk-file-schema.ts` | Top-level Zod schema |
| `packages/sdks/oak-curriculum-sdk/vocab-gen/lib/lesson-schema.ts` | Lesson Zod schema |
| `packages/sdks/oak-curriculum-sdk/vocab-gen/lib/unit-schemas.ts` | Unit Zod schema |
| `packages/sdks/oak-curriculum-sdk/vocab-gen/lib/vocabulary-schemas.ts` | Null sentinel handling |
| `packages/sdks/oak-curriculum-sdk/vocab-gen/lib/index.ts` | **Exports** — all types |

### ⭐ ES Document Building (search SDK — REUSE)

| File | Purpose |
|------|---------|
| `src/lib/indexing/lesson-document-builder.ts` | Creates lesson ES documents |
| `src/lib/indexing/document-transforms.ts` | Transform utilities |
| `src/lib/indexing/bulk-action-factory.ts` | ES bulk action creation |

### Adapter Layer

| File | Purpose |
|------|---------|
| `src/adapters/oak-adapter.ts` | **Public API** — `createOakClient()`, `OakClient` interface |
| `src/adapters/oak-adapter-types.ts` | Type definitions for all API methods |
| `src/adapters/sdk-api-methods.ts` | Factories for each API endpoint |
| `src/adapters/sdk-cache/` | Caching infrastructure |

### Ingestion Pipeline

| File | Purpose |
|------|---------|
| `src/lib/elasticsearch/setup/ingest-live.ts` | CLI entry point |
| `src/lib/index-oak.ts` | Main indexing logic |
| `src/lib/indexing/lesson-materials.ts` | Transcript + summary fetching |
| `src/lib/indexing/pattern-aware-fetcher.ts` | Pattern-aware traversal |

### Bulk Download Data

| Path | Content |
|------|---------|
| `apps/.../bulk-downloads/` | **Active data** — 30 JSON files (2025-12-30) |
| `apps/.../scripts/download-bulk.ts` | Download script |
| `reference/bulk_download_data/.../` | Reference copy (2025-12-07) |

---

## Upstream API Code Reference

For investigating API behavior, the upstream code is at `reference/oak-openapi/`:

| File | Purpose |
|------|---------|
| `src/lib/queryGate.ts` | **TPC license filtering** — explains assets/transcript incompleteness |
| `src/lib/queryGateData/supportedLessons.json` | 4,559 TPC-cleared lessons |
| `src/lib/queryGateData/supportedUnits.json` | 213 TPC-cleared units |
