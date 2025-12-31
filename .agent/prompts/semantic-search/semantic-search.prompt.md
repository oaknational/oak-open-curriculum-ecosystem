# Semantic Search — Session Context

**Status**: 🚨 BLOCKED — Critical issues discovered during bulk ingestion evaluation
**Last Updated**: 2025-12-31
**Master Plan**: [Semantic Search Roadmap](../../plans/semantic-search/roadmap.md)
**Implementation Plan**: [complete-data-indexing.md](../../plans/semantic-search/active/complete-data-indexing.md)
**Data Quality Report**: [07-bulk-download-data-quality-report.md](../../research/ooc/07-bulk-download-data-quality-report.md)
**ADR**: [ADR-093: Bulk-First Ingestion Strategy](../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md)

---

## 🚨 CRITICAL: Bulk Ingestion Failures (2025-12-31)

**A live bulk ingestion run revealed fundamental implementation failures.**

The bulk ingestion pipeline was improperly specified and implemented. An agent made decisions to skip vital data processing, violating the core principles in [rules.md](../../directives-and-memory/rules.md) and [testing-strategy.md](../../directives-and-memory/testing-strategy.md).

### ⚠️ MASTER LIST OF UNVERIFIED ASSUMPTIONS

**The following assumptions permeate this document and MUST be investigated:**

| ID | Assumption | Open Question |
|----|------------|---------------|
| A1 | Bulk download contains ~12,833 lessons | Has anyone counted the actual lessons in the bulk files? |
| A2 | `oak_unit_rollup` requires enriched documents with lesson snippets | What exactly should this index contain? Is it different from `oak_units`? |
| A3 | The parity requirements table is correct | What fields does API ingestion actually produce? |
| A4 | MFL subjects (French, German, Spanish) have ~0% transcripts | Has this been verified by examining actual bulk files? |
| A5 | RSHE-PSHE absence from bulk download is expected/intentional | Has anyone asked Oak? Is this a bug? |
| A6 | "MFL — no video" explanation is correct | What IS the lesson format for MFL subjects? |
| A7 | Transcript percentages in tables are accurate | When were these measured? How? By whom? |
| A8 | 100% maths KS4 tier coverage was confirmed | When? Has it been re-verified? |
| A9 | Duplicate lesson categorisation is correct | How were "legitimate" vs "spurious" determined? |
| A10 | Simple deduplication by lessonSlug is correct | Are we losing data by deduplicating? |
| A11 | Video availability code removal was justified | Was this validated? Do we ever need the transcript API? |
| A12 | RSHE is different from RSHE-PSHE | One table says RSHE has "full transcripts", another says RSHE-PSHE is missing |
| A13 | 422 with 24-hour cache for RSHE-PSHE is correct | What if Oak fixes this tomorrow? |
| A14 | The 14 subjects listed as "full transcripts" actually have full transcripts | Has this been verified against current bulk data? |
| A15 | PE has "partial video" explaining low transcript coverage | What format are PE lessons in? |

**NO FURTHER DEVELOPMENT SHOULD PROCEED UNTIL THESE ASSUMPTIONS ARE INVESTIGATED.**

### Issues Discovered

| Issue | Severity | Impact |
|-------|----------|--------|
| **`oak_unit_rollup` empty** | 🔴 CRITICAL | Unit search completely broken (100% zero-hit) |
| **Missing `lesson_structure` fields** | 🔴 CRITICAL | Structure retrievers fail (100% zero-hit for ELSER, 93% for BM25) |
| **Only 2,884/12,833 lessons indexed** | 🔴 CRITICAL | ~78% of curriculum missing |
| **14/16 subjects indexed** | 🟡 HIGH | Physical Education, Spanish missing entirely |
| **Kibana doc count misleading** | 🟡 MEDIUM | Shows 42,456 (ELSER vectors), actual docs = 2,884 |

### Retriever Status (from ablation test)

| Retriever | Lessons Standard | Lessons Hard | Units |
|-----------|-----------------|--------------|-------|
| `bm25_content` | 0.456 ✅ | 0.217 | 0.000 ❌ |
| `elser_content` | 0.393 ✅ | 0.172 | 0.000 ❌ |
| `bm25_structure` | 0.440 ⚠️ | 0.067 ⚠️ | 0.000 ❌ |
| `elser_structure` | **0.000** ❌ | **0.000** ❌ | 0.000 ❌ |
| `four_way_hybrid` | 0.458 ✅ | 0.221 | 0.000 ❌ |

### Root Causes Identified

**1. `bulk-lesson-transformer.ts` explicitly sets structure fields to `undefined`:**

```typescript
// Lines 86-88 - VITAL DATA INTENTIONALLY SKIPPED
lesson_structure: undefined,
lesson_structure_semantic: undefined,
```

**2. Bulk ingestion does not populate `oak_unit_rollup`:**

> ⚠️ **ASSUMPTION**: The unit rollup index requires enriched documents with lesson snippets.
> **OPEN QUESTION**: What exactly should `oak_unit_rollup` contain? Is it different from `oak_units`? What is the search contract for unit search?

The bulk pipeline only populated `oak_units` (basic metadata), not `oak_unit_rollup`.

**3. Unknown filter or logic bug causing 78% of lessons to be skipped:**

> ⚠️ **ASSUMPTION**: The bulk download contains ~12,833 lessons.
> **OPEN QUESTION**: How many lessons are actually in the bulk download files? Has anyone counted them?

Expected: ~12,833 lessons. Actual: 2,884 lessons. The cause is unknown and requires investigation.

---

## 🔴 MANDATORY REMEDIATION ACTIONS

Before ANY further development, the following MUST be completed:

### Action 1: Define Parity Requirements

**Both bulk and API ingestion MUST produce identical ES document structure.**

Create a formal specification document listing:

| Field | Required | Source (Bulk) | Source (API) | Notes |
|-------|----------|---------------|--------------|-------|
| `lesson_id` | ✅ | `lessonSlug` | `/lessons/{slug}/summary` | |
| `lesson_slug` | ✅ | `lessonSlug` | `/lessons/{slug}/summary` | |
| `lesson_title` | ✅ | `lessonTitle` | `/lessons/{slug}/summary` | |
| `lesson_content` | ✅ | `transcript_sentences` | `/lessons/{slug}/transcript` | |
| `lesson_content_semantic` | ✅ | `transcript_sentences` | `/lessons/{slug}/transcript` | ELSER embedding source |
| `lesson_structure` | ✅ | **MISSING — must synthesise** | Lesson summary fields | BM25 structure target |
| `lesson_structure_semantic` | ✅ | **MISSING — must synthesise** | Lesson summary fields | ELSER embedding source |

> ⚠️ **ASSUMPTION**: The fields listed above are the correct parity requirements.
> **OPEN QUESTION**: What fields does the API ingestion actually produce? This list must be validated against the actual API output, not assumed.
| `lesson_keywords` | ✅ | `lessonKeywords[]` | `/lessons/{slug}/summary` | |
| `key_learning_points` | ✅ | `keyLearningPoints[]` | `/lessons/{slug}/summary` | |
| `misconceptions_and_common_mistakes` | ✅ | `misconceptionsAndCommonMistakes[]` | `/lessons/{slug}/summary` | |
| `teacher_tips` | ✅ | `teacherTips[]` | `/lessons/{slug}/summary` | |
| ... | ... | ... | ... | **COMPLETE THIS LIST** |

> ⚠️ **ASSUMPTION**: `oak_units` and `oak_unit_rollup` are both required.
> **OPEN QUESTION**: Why do we have two unit indexes? What are their different purposes? Which one(s) does unit search actually use?

**For units (both `oak_units` AND `oak_unit_rollup`):**

| Field | Required | Source (Bulk) | Source (API) | Notes |
|-------|----------|---------------|--------------|-------|
| `unit_id` | ✅ | `unitSlug` | `/units/{slug}/summary` | |
| `unit_slug` | ✅ | `unitSlug` | `/units/{slug}/summary` | |
| `unit_content` | ✅ | **MUST BUILD** — from lesson rollups | `/units/{slug}` + lesson data | |
| `unit_content_semantic` | ✅ | **MUST BUILD** | Enriched text | ELSER embedding source |
| `unit_structure` | ✅ | **MUST BUILD** | Summary fields | BM25 structure target |
| `unit_structure_semantic` | ✅ | **MUST BUILD** | Summary fields | ELSER embedding source |
| ... | ... | ... | ... | **COMPLETE THIS LIST** |

### Action 2: Deep Code Review

**TDD was NOT properly employed.** The [testing-strategy.md](../../directives-and-memory/testing-strategy.md) requires:

> "ALWAYS use TDD at ALL levels (unit, integration, E2E)"
> "Write tests FIRST. Red → Green → Refactor"

**Evidence of TDD failure:**
- `bulk-lesson-transformer.ts` has no test asserting `lesson_structure` is populated
- `bulk-ingestion.ts` has no test asserting `oak_unit_rollup` is populated
- No integration test verifies ES document parity with API mode

**Required review:**

| File | Review Status | Issues |
|------|---------------|--------|
| `src/adapters/bulk-lesson-transformer.ts` | 📋 PENDING | Fields skipped |
| `src/adapters/bulk-unit-transformer.ts` | 📋 PENDING | Unknown |
| `src/adapters/bulk-data-adapter.ts` | 📋 PENDING | Unknown |
| `src/lib/indexing/bulk-ingestion.ts` | 📋 PENDING | Missing rollup |
| All `*.unit.test.ts` in adapters | 📋 PENDING | Coverage gaps |
| All `*.integration.test.ts` | 📋 PENDING | Missing parity tests |

### Action 3: Investigate Lesson Count Discrepancy

**Expected: ~12,833 lessons. Actual: 2,884 lessons (~22%).**

Possible causes to investigate:

1. **Filter bug**: Erroneous subject/keyStage filter in bulk processing
2. **File reading bug**: Not all 30 bulk files being read
3. **Deduplication bug**: Over-aggressive deduplication removing valid lessons
4. **Validation bug**: Zod schema rejecting valid lessons
5. **Silent failures**: Errors being swallowed without logging

**Investigation checklist:**

- [ ] Count lessons in each bulk JSON file (expected ~12,833 total)
- [ ] Log lesson counts at each processing stage
- [ ] Check for filter conditions in `prepareBulkIngestion()`
- [ ] Verify all 30 files are being read
- [ ] Check deduplication logic
- [ ] Review Zod validation errors

### Action 4: Deep Transcript Survey

**Previous reviews were shallow. A comprehensive survey is required.**

For EACH subject, for BOTH primary AND secondary:

| Subject | Phase | Total Lessons | With Transcript | % Coverage | Transcript Quality |
|---------|-------|---------------|-----------------|------------|-------------------|
| art | primary | ? | ? | ? | TBD |
| art | secondary | ? | ? | ? | TBD |
| citizenship | secondary | ? | ? | ? | TBD |
| computing | primary | ? | ? | ? | TBD |
| computing | secondary | ? | ? | ? | TBD |
| cooking-nutrition | primary | ? | ? | ? | TBD |
| cooking-nutrition | secondary | ? | ? | ? | TBD |
| design-technology | primary | ? | ? | ? | TBD |
| design-technology | secondary | ? | ? | ? | TBD |
| english | primary | ? | ? | ? | TBD |
| english | secondary | ? | ? | ? | TBD |
| french | primary | ? | ? | ? | TBD |
| french | secondary | ? | ? | ? | TBD |
| geography | primary | ? | ? | ? | TBD |
| geography | secondary | ? | ? | ? | TBD |
| german | secondary | ? | ? | ? | TBD |
| history | primary | ? | ? | ? | TBD |
| history | secondary | ? | ? | ? | TBD |
| maths | primary | ? | ? | ? | TBD |
| maths | secondary | ? | ? | ? | TBD |
| music | primary | ? | ? | ? | TBD |
| music | secondary | ? | ? | ? | TBD |
| physical-education | primary | ? | ? | ? | TBD |
| physical-education | secondary | ? | ? | ? | TBD |
| religious-education | primary | ? | ? | ? | TBD |
| religious-education | secondary | ? | ? | ? | TBD |
| **rshe-pshe** | primary | **N/A** | **N/A** | **N/A** | **NOT IN BULK** |
| **rshe-pshe** | secondary | **N/A** | **N/A** | **N/A** | **NOT IN BULK** |
| science | primary | ? | ? | ? | TBD |
| science | secondary | ? | ? | ? | TBD |
| spanish | primary | ? | ? | ? | TBD |
| spanish | secondary | ? | ? | ? | TBD |

> ⚠️ **ASSUMPTION**: MFL subjects (French, German, Spanish) have ~0% transcripts because "no video content exists".
> **OPEN QUESTION**: Has this been verified by examining the actual bulk files? What if there are transcripts we're missing due to a filter bug?

**Transcript Quality Assessment:**

For subjects with transcripts, assess:
- Average transcript length (words)
- Are transcripts actual lesson content or placeholder text?
- Are there structural patterns (intro, body, conclusion)?

**Design implications:**

If transcripts are sparse or non-existent for some subjects, we need:
- Different retrieval strategies per subject
- Metadata-only indexing for transcript-poor subjects
- Clear documentation of search capability differences

### Action 5: RSHE-PSHE 422 Handling

**RSHE-PSHE (health) lessons are NOT in the bulk download.**

> ⚠️ **ASSUMPTION**: RSHE-PSHE absence is expected and documented.
> **OPEN QUESTION**: Why is RSHE-PSHE not in the bulk download? Is this intentional by Oak? Will it be added in future? Is there a different source for this data? Has anyone contacted Oak to confirm this is permanent?

**Required implementation:**

The search SDK MUST return HTTP 422 Unprocessable Content when RSHE-PSHE is requested:

```typescript
// Example implementation requirement
if (subject === 'rshe-pshe') {
  return Response.json(
    {
      error: 'RSHE-PSHE content is not available',
      code: 'SUBJECT_NOT_AVAILABLE',
      detail: 'RSHE-PSHE lessons are not included in the Oak bulk download. This subject cannot be searched.',
    },
    { status: 422, headers: { 'Cache-Control': 'max-age=86400' } }
  );
}
```

**Locations requiring this check:**
- `app/api/search/route.ts`
- `app/api/search/nl/route.ts`
- `app/api/sdk/search-lessons/route.ts`
- Search SDK client functions

---

## 📋 QUICK START FOR NEW SESSIONS

This document provides standalone context to continue semantic search implementation.

### What We're Building

A semantic search system for the Oak curriculum using Elasticsearch.

> ⚠️ **ASSUMPTION**: The system indexes ~12,300 lessons across 16 subjects.
> **OPEN QUESTION**: The actual ingestion only produced 2,884 lessons across 14 subjects. What is the true expected count?

The system enables teachers, students, and AI agents to search curriculum content by meaning.

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
| Maths KS4 tier investigation | ✅ Complete |
| SDK restructure (bulk export) | ✅ Complete (Phase 0) |
| Bulk Data Adapter (TDD) | ⚠️ **INCOMPLETE** — missing structure fields |
| Tier enrichment from API | ✅ Complete (Phase 2) |
| HybridDataSource composition | ✅ Complete (Phase 3) |
| Vocabulary Mining Adapter | ✅ Complete (Phase 4) |
| Bulk Thread Transformer | ✅ Complete (Phase 5a) |
| CLI Wiring (`--bulk` mode) | ✅ Complete (Phase 5b) |
| **Full ES ingestion** | 🚨 **FAILED** — critical issues |
| **Remediation** | 📋 **BLOCKED** — see actions above |

### Key Commands

```bash
# From apps/oak-open-curriculum-semantic-search

# Refresh bulk download data (reads OAK_API_KEY from .env.local)
pnpm bulk:download

# Bulk ingestion (CURRENTLY BROKEN)
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --verbose
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --dry-run  # Preview

# Evaluation (to verify ingestion results)
pnpm eval:diagnostic      # 18 diagnostic queries
pnpm eval:per-category    # Hard query baseline
pnpm vitest run --config vitest.smoke.config.ts four-retriever-ablation

# ES status check
pnpm es:status

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

**✅ SDK RESTRUCTURE COMPLETE**: Bulk parsing is now available via public SDK export.

```typescript
// Clean import from SDK public export
import { parseBulkFile, readAllBulkFiles } from '@oaknational/oak-curriculum-sdk/public/bulk';
import type { BulkDownloadFile, Lesson, Unit } from '@oaknational/oak-curriculum-sdk/public/bulk';

// Parse single file with Zod validation
const data: BulkDownloadFile = await parseBulkFile(bulkDir, 'maths-primary.json');
```

**Also available**: Extractors and generators from vocab-gen are now in the SDK:

```typescript
import {
  extractKeywords,
  extractMisconceptions,
  generateMinedSynonyms,
  processBulkData,
} from '@oaknational/oak-curriculum-sdk/public/bulk';
```

### Data Quality Report (READ FIRST)

**[07-bulk-download-data-quality-report.md](../../research/ooc/07-bulk-download-data-quality-report.md)** documents all data quality issues.

> ⚠️ **ASSUMPTION**: This report is comprehensive and up-to-date.
> **OPEN QUESTION**: When was this report created? Is it based on the current bulk download or an older version? Have additional data quality issues been discovered since?

Key issues that affect implementation:

- Maths KS4: 373 duplicate lessons (need API tier enrichment)
- Missing lesson reference: `further-demonstrating-of-pythagoras-theorem`
- 5 maths-primary lessons without transcripts
- Units without threads: `maths-and-the-environment`, etc.

---

## ✅ STRATEGIC DECISION (2025-12-30)

**Decision**: Use bulk download as primary data source with API for supplementary structural data only.

See [Bulk Download vs API Comparison](../../analysis/bulk-download-vs-api-comparison.md) for detailed analysis.

> ⚠️ **ASSUMPTION**: This strategic decision is sound.
> **OPEN QUESTION**: Given the bulk ingestion failures, should this strategy be re-evaluated? Is the bulk download actually more complete than the API?

### Summary

| Source | Use For | Coverage |
|--------|---------|----------|
| **Bulk Download** | Lessons, units, threads, transcripts, keywords, learning points | 16/17 subjects (30 files) |
| **API** | Tier info (maths KS4), unit options (optional) | Structural data only |

> ⚠️ **ASSUMPTION**: Coverage claims above are accurate (16/17 subjects, 30 files).
> **OPEN QUESTION**: Only 14 subjects were indexed. Which 2 are missing and why?

### Key Implementation Notes

> ⚠️ **ASSUMPTION**: These implementation notes are all correct and current.
> **OPEN QUESTION**: Have all these been verified as still applicable given the ingestion failures?

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

**MISSING FROM BULK DOWNLOAD**: The Oak bulk download website lists RSHE-PSHE as available, but the API does not return it.

> ⚠️ **ASSUMPTION**: RSHE-PSHE absence has been "confirmed" and verified.
> **OPEN QUESTION**: When was this verified? Has anyone contacted Oak to ask why? Is this a bug on their end? Will it be fixed?

Observations:

1. Download script requests `rshe-pshe-primary` and `rshe-pshe-secondary`
2. API returns ZIP with 30 files, RSHE-PSHE not included
3. No error returned — files simply not in response

> ⚠️ **ASSUMPTION**: "No error returned" means this is intentional.
> **OPEN QUESTION**: Could this be a silent failure on Oak's end? Should we report this as a bug?

**Decision**: Return HTTP 422 Unprocessable Content with clear error message and 24-hour cache header for RSHE-PSHE requests. **This MUST be explicitly implemented in the search SDK.**

> ⚠️ **ASSUMPTION**: 422 with 24-hour cache is the correct response.
> **OPEN QUESTION**: Is 24-hour cache appropriate? What if Oak fixes this tomorrow? Should we check dynamically?

### Refresh Cadence

Manual refresh every few weeks:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm bulk:download
```

---

## 📊 ES Index Status (After Failed Bulk Ingestion — 2025-12-31)

| Index | Doc Count | Expected | Status |
|-------|-----------|----------|--------|
| `oak_lessons` | 2,884 | ~12,833 | 🚨 **22% — 78% MISSING** |
| `oak_units` | 1,635 | ~1,665 | ✅ Complete |
| `oak_unit_rollup` | **0** | ~1,665 | 🚨 **EMPTY — unit search broken** |
| `oak_threads` | 164 | 164 | ✅ Complete |
| `oak_sequences` | 0 | — | 📋 Not in scope |
| `oak_sequence_facets` | 0 | — | 📋 Not in scope |

### Subjects Indexed (Lessons)

| Subject | Doc Count | Expected | Status |
|---------|-----------|----------|--------|
| history | 433 | ? | 📋 Needs verification |
| art | 403 | ? | 📋 Needs verification |
| english | 399 | ? | 📋 Needs verification |
| religious-education | 332 | ? | 📋 Needs verification |
| design-technology | 304 | ? | 📋 Needs verification |
| maths | 216 | ? | 📋 Needs verification |
| computing | 199 | ? | 📋 Needs verification |
| french | 168 | ? | 📋 Needs verification |
| geography | 136 | ? | 📋 Needs verification |
| science | 81 | ? | 📋 Needs verification |
| german | 67 | ? | 📋 Needs verification |
| citizenship | 65 | ? | 📋 Needs verification |
| music | 57 | ? | 📋 Needs verification |
| cooking-nutrition | 24 | ? | 📋 Needs verification |
| **physical-education** | **0** | ? | 🚨 **MISSING** |
| **spanish** | **0** | ? | 🚨 **MISSING** |

---

## 📚 Historical Findings (2025-12-30)

A deep investigation into transcript availability revealed fundamental data source differences.

### The Core Discovery

> ⚠️ **ASSUMPTION**: The percentages below are accurate.
> **OPEN QUESTION**: When were these measured? How were they calculated? Have they been re-verified recently?

| Data Source | Transcript Coverage | Notes |
|-------------|---------------------|-------|
| **Bulk Download** | ~81% of lessons (14/17 subjects) | Complete transcripts |
| **Live API** | ~16% of lessons (maths only) | TPC-filtered |
| **MFL Subjects** | 0% | No video content exists |

> ⚠️ **ASSUMPTION**: "MFL Subjects have 0% because no video content exists."
> **OPEN QUESTION**: Has this been verified directly? What format are MFL lessons in if not video?

**Key insight**: The bulk download and API are not equivalent data sources. They serve different purposes.

### Why This Matters

The previous ingestion pipeline fetched transcripts via the live API. For non-maths subjects, this resulted in:

- ~65% of transcript requests returning 404
- Many "transcript not found" warnings (expected, not bugs)
- Semantic search limited to metadata-only for most subjects

> ⚠️ **ASSUMPTION**: The following quote explains the 404 behaviour.
> **OPEN QUESTION**: Does this documentation apply to the bulk download too, or only the API? Are bulk and API data independent?

See [Oak API Content Coverage](https://open-api.thenational.academy/docs/about-oaks-data/content-coverage):

> "Currently, the API includes **all lesson resources for KS1-4 maths**, plus a **sample of lesson resources** for [other subjects]"

### ✅ Video/Transcript Detection Code REMOVED

The video availability detection code (`video-availability.ts`, ADR-091) was designed to optimize transcript fetching by pre-checking which lessons have videos. **This code has been removed because:**

> ⚠️ **ASSUMPTION**: The following reasons justify removal.
> **OPEN QUESTION**: Was this removal decision validated? Do we ever need to call the transcript API?

1. **Bulk-first approach**: Transcripts come directly from bulk download — no API 404 detection needed
2. **TPC filtering is no longer relevant**: We don't call the transcript API anymore
3. **Simpler architecture**: One fewer module to maintain

**Files removed**: `src/lib/indexing/video-availability.ts`, `src/lib/indexing/video-availability.unit.test.ts`

**See**: [ADR-091](../../../docs/architecture/architectural-decisions/091-video-availability-detection-strategy.md) (superseded by ADR-093)

---

## 📊 Data Sources Compared

### Bulk Download (`reference/bulk_download_data/`)

> ⚠️ **ASSUMPTION**: The values below are accurate.
> **OPEN QUESTION**: These numbers differ from Elasticsearch ingestion results. Have they been re-verified by counting the actual bulk files?

| Attribute | Value |
|-----------|-------|
| **Last downloaded** | 2025-12-07 |
| **Total lessons** | 12,783 |
| **Subjects with full transcripts** | 14 (art, citizenship, computing, cooking-nutrition, design-technology, english, geography, history, maths, music, religious-education, science, RSHE) |
| **Subjects with no transcripts** | 3 (french, german, spanish — MFL subjects) |
| **Subjects with partial transcripts** | 1 (PE — 29% secondary, 0.7% primary) |
| **Data quality issues** | Null titles, tier duplicates, inconsistent null semantics |
| **Refresh frequency** | Unknown (no documented schedule) |

> ⚠️ **ASSUMPTION**: RSHE is listed as having "full transcripts" above, but earlier we said RSHE-PSHE is NOT in the bulk download.
> **OPEN QUESTION**: Is RSHE different from RSHE-PSHE? This is contradictory and needs investigation.

### Live API

| Attribute | Value |
|-----------|-------|
| **Transcript coverage** | Maths: 100%, Others: "sample" (~0-35%) |
| **Pagination bug** | 5 lessons missing from maths KS4 unfiltered queries |
| **TPC filtering** | Assets/transcripts filtered for license compliance |
| **Production timeline** | Full coverage expected **Autumn 2025** |

### Detailed Transcript Availability (Bulk Download)

**⚠️ WARNING: This table is from shallow analysis. Deep survey required (see Action 4).**

> ⚠️ **ASSUMPTION**: ALL percentages in this table are unverified.
> **OPEN QUESTION**: When were these measured? By whom? What methodology? Have they been re-verified against the current bulk download?

| Subject | Primary | Secondary | Notes |
|---------|---------|-----------|-------|
| Art | 100% | 100% | **UNVERIFIED** |
| Citizenship | — | 100% | **UNVERIFIED** |
| Computing | 100% | 100% | **UNVERIFIED** |
| Cooking & Nutrition | 100% | 100% | **UNVERIFIED** |
| Design Technology | 100% | 100% | **UNVERIFIED** |
| English | 98% | 100% | 28 lessons without — **UNVERIFIED** |
| Geography | 100% | 100% | **UNVERIFIED** |
| History | 100% | 100% | **UNVERIFIED** |
| **Maths** | 99.5% | 100% | 5 lessons without — **UNVERIFIED** |
| Music | 100% | 96% | **UNVERIFIED** |
| Religious Education | 100% | 100% | **UNVERIFIED** |
| Science | 100% | 100% | **UNVERIFIED** |
| **French** | **0%** | **0.2%** | MFL — no video — **UNVERIFIED** |
| **German** | — | **0.2%** | MFL — no video — **UNVERIFIED** |
| **Spanish** | **0.9%** | **0%** | MFL — no video — **UNVERIFIED** |
| **PE** | **0.7%** | **29%** | Partial video — **UNVERIFIED** |

> ⚠️ **ASSUMPTION**: "MFL — no video" explanation is correct.
> **OPEN QUESTION**: What IS the lesson format for MFL subjects? Do they have audio? Slides with text? Something else we could index?

---

## ✅ Confirmed Decisions (2025-12-30)

### Strategy: Option B — Bulk Download Hybrid

**Decided**: Use bulk download as primary data source with API for tier enrichment.

### Maths KS4 Tier Handling

> ⚠️ **ASSUMPTION**: Investigation confirmed 100% tier coverage.
> **OPEN QUESTION**: When was this investigation done? Has it been re-verified? What if the API or bulk data has changed since then?

| Metric | Value |
|--------|-------|
| Unique KS4 units in bulk | 36 |
| Units with tier info from API | 36 ✅ |
| Unique KS4 lessons in bulk | 436 |
| Lessons with tier derivable | 436 ✅ |

**Tier distribution**:
- 30 units in BOTH tiers → lessons get `tiers: ['foundation', 'higher']`
- 6 units HIGHER only → lessons get `tiers: ['higher']`
- 0 units foundation only

> ⚠️ **ASSUMPTION**: These tier distribution numbers are current.
> **OPEN QUESTION**: Is this data still accurate? What if Oak has added new tiers or changed the distribution?

**Algorithm**:
1. Fetch API: `GET /sequences/maths-secondary/units`
2. Build: `Map<unitSlug, Set<'foundation' | 'higher'>>`
3. For each bulk KS4 lesson: `tiers = Array.from(map.get(lesson.unitSlug))`

### Duplicate Lesson Analysis

> ⚠️ **ASSUMPTION**: The categorisation of duplicates is correct.
> **OPEN QUESTION**: How were "legitimate" vs "spurious" duplicates determined? What defines an "incorrectly duplicated" lesson? Has this analysis been re-verified?

**373 duplicate lessons break down as**:

| Category | Count | Explanation |
|----------|-------|-------------|
| Legitimate | 210 | Shared between BOTH tier variants |
| Spurious | 163 | Data quality issue — incorrectly duplicated |

> ⚠️ **ASSUMPTION**: Simple deduplication by lessonSlug is the correct solution.
> **OPEN QUESTION**: What if the duplicates have different content? Are we losing data by deduplicating?

**Solution**: Simple deduplication by `lessonSlug`. Tier assignment from API unit map.

### Architecture: SDK Restructure Required

The bulk parsing code in `vocab-gen/lib/` must be relocated to:
- `src/bulk/` — proper SDK location
- Export via `@oaknational/oak-curriculum-sdk/public/bulk`
- No cross-workspace imports

### Success Criteria

**These criteria are NOT MET. Remediation required.**

- ❌ All 16 subjects fully ingested in all indexes — **FAILED (only 14, 22% of lessons)**
- ❌ All retrievers working — **FAILED (structure retrievers broken)**
- ❌ Unit search working — **FAILED (unit_rollup empty)**
- 📋 Useful search SDK functions — **Pending**

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

**Note: Some "completed" items have been revealed as incomplete during evaluation.**

### Strategic Pivot — COMPLETE ✅ (2025-12-30)

| Decision | Outcome |
|----------|---------|
| Bulk-first ingestion strategy | Approved — ADR-093 created |
| Video availability detection | Removed — `video-availability.ts` deleted |
| RSHE-PSHE handling | 422 Unprocessable Content (no API fallback) — **NOT YET IMPLEMENTED** |
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

> ⚠️ **ASSUMPTION**: All 7 curriculum structural patterns are correctly implemented.
> **OPEN QUESTION**: Given the ingestion failures, have these patterns been verified against actual bulk data?

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

> ⚠️ **ASSUMPTION**: These infrastructure items are truly "complete".
> **OPEN QUESTION**: If TDD was properly employed, how did the ingestion fail so badly?

| Task | Status | Result |
|------|--------|--------|
| Adapter refactoring | ✅ | 593→197 lines, TDD-driven |
| ES reset | ✅ | 7 indices, 192 synonyms |
| Cache validation | ✅ | 756 hits, 1 miss |
| ES upsert verify | ✅ | 638 docs (maths KS1) |
| Cache categorization | ✅ | Structured metadata, zero compat layers |
| Quality gates | ✅ | All 11 passing |

---

## 📋 Implementation Status

### ✅ Phase 0: SDK Bulk Export — COMPLETE

Bulk parsing code moved to SDK with public exports. Schema-first approach:

- Generated Zod schemas at `type-gen` time via `bulkgen.ts`
- All extractors and generators moved to `src/bulk/`
- Export via `@oaknational/oak-curriculum-sdk/public/bulk`

### ⚠️ Phase 1: BulkDataAdapter — INCOMPLETE

Adapter transforms bulk data to ES document format, **but critical fields are missing**:

- `src/adapters/bulk-data-adapter.ts` — Main adapter
- `src/adapters/bulk-lesson-transformer.ts` — Lesson → ES doc — **MISSING STRUCTURE FIELDS**
- `src/adapters/bulk-unit-transformer.ts` — Unit → ES doc
- `src/adapters/bulk-transform-helpers.ts` — URL generation, phase derivation

### ✅ Phase 2: API Supplementation — COMPLETE

KS4 tier enrichment for Maths:

- `src/adapters/api-supplementation.ts` — Fetches tier data from API
- Builds `UnitContextMap` for tier assignment
- 100% coverage confirmed for maths KS4

### ✅ Phase 3: HybridDataSource — COMPLETE

Unified data source composing bulk + API:

- `src/adapters/hybrid-data-source.ts` — Main interface
- `src/adapters/hybrid-batch-processor.ts` — Batch KS4 enrichment

### ✅ Phase 4: Vocabulary Mining — COMPLETE

Vocabulary extraction integrated:

- `src/adapters/vocabulary-mining-adapter.ts` — Runs extractors, generates synonyms
- Uses SDK's `processBulkData()` and `generateMinedSynonyms()`

### ⚠️ Phase 5: Pipeline Integration — INCOMPLETE

**Completed (Phase 5a)**:

- `src/adapters/bulk-thread-transformer.ts` — Extracts threads from `sequence[].threads[]`
- `src/adapters/bulk-thread-transformer.unit.test.ts` — 9 tests passing
- `src/lib/indexing/bulk-ingestion.ts` — Updated to include thread operations
- `src/lib/indexing/bulk-ingestion.unit.test.ts` — 3 tests passing

**Completed (Phase 5b)**:

- `src/lib/elasticsearch/setup/ingest-cli-args.ts` — Added `--bulk` and `--bulk-dir` CLI options
- `src/lib/elasticsearch/setup/ingest-live.ts` — Bulk mode execution path
- `src/lib/elasticsearch/setup/ingest-bulk.ts` — Bulk ingestion orchestration
- `src/lib/elasticsearch/setup/ingest-output.ts` — Output formatting

**FAILED (Phase 5c)**:

- Full ingestion run produced incorrect results
- Only 2,884/12,833 lessons indexed
- `oak_unit_rollup` empty
- Structure fields missing

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

> ⚠️ **ASSUMPTION**: These schemas are complete and correct.
> **OPEN QUESTION**: Have the Zod schemas been validated against ALL bulk files? Could schema validation be silently rejecting valid lessons?

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

### ⭐ Bulk-First Ingestion Pipeline (Phase 5 — NEEDS REVIEW)

| File | Purpose | Status |
|------|---------|--------|
| `src/adapters/bulk-data-adapter.ts` | Main adapter — transforms bulk data to ES format | 📋 Review |
| `src/adapters/bulk-lesson-transformer.ts` | Lesson → ES doc transformation | 🚨 **Missing fields** |
| `src/adapters/bulk-unit-transformer.ts` | Unit → ES doc transformation | 📋 Review |
| `src/adapters/bulk-transform-helpers.ts` | URL generation, phase derivation | 📋 Review |
| `src/adapters/bulk-thread-transformer.ts` | Thread extraction | ✅ OK |
| `src/adapters/api-supplementation.ts` | Maths KS4 tier enrichment from API | ✅ OK |
| `src/adapters/hybrid-data-source.ts` | Composes bulk + API data | 📋 Review |
| `src/adapters/hybrid-batch-processor.ts` | Batch KS4 enrichment | 📋 Review |
| `src/adapters/vocabulary-mining-adapter.ts` | Runs extractors, generates synonyms | ✅ OK |
| `src/lib/indexing/bulk-ingestion.ts` | **Entry point** — orchestrates bulk operations | 🚨 **Missing rollup** |
| `src/lib/elasticsearch/setup/ingest-cli-args.ts` | CLI args | ✅ OK |
| `src/lib/elasticsearch/setup/ingest-bulk.ts` | Bulk execution | 📋 Review |
| `src/lib/elasticsearch/setup/ingest-output.ts` | Output formatting | ✅ OK |

### Ingestion Pipeline (API Mode — Reference)

| File | Purpose |
|------|---------|
| `src/lib/elasticsearch/setup/ingest-live.ts` | CLI entry point |
| `src/lib/index-oak.ts` | Main indexing logic (API mode) |
| `src/lib/indexing/lesson-materials.ts` | Transcript + summary fetching (API mode) |
| `src/lib/indexing/pattern-aware-fetcher.ts` | Pattern-aware traversal (API mode) |

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
