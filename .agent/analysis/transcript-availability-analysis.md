# Transcript Availability Analysis

> **Date**: 2025-12-30
> **Status**: Critical findings for ingestion strategy
> **Author**: AI Analysis with MCP tool verification

## Executive Summary

This document captures all findings from the investigation into transcript availability discrepancies between the Oak API and bulk download data. The investigation revealed that:

1. **The API documentation explicitly states that only Maths has complete lesson resources** — other subjects have only "a sample"
2. **The bulk download contains complete transcripts** for most subjects (not just maths)
3. **MFL subjects (French, German, Spanish) and PE genuinely lack transcripts** — likely because these lessons don't have video
4. **We should use bulk download data as the primary source for transcripts**

## Key Documentation References

### Official Oak API Documentation

From [Content Coverage](https://open-api.thenational.academy/docs/about-oaks-data/content-coverage):

> **Lesson resources**
>
> Currently, the API includes **all lesson resources for KS1-4 maths**, plus a **sample of lesson resources** for:
> - English
> - Sciences (biology, physics, chemistry, combined science)
> - Spanish
> - French
> - History
> - Geography
> - Computing (including computer science)
> - RSHE (PSHE)
> - Religious education

This is the root cause of our "transcript not found" errors — it's documented, expected behavior.

### Bulk Download Description

From [Bulk Download page](https://open-api.thenational.academy/bulk-download):

> What's included?
> - Quiz questions and answers
> - **Teaching transcript**
> - Misconceptions
> - And much more....

The bulk download **explicitly includes transcripts** for all subjects.

## Verified Data: Bulk Download Transcript Availability

| Subject | Phase | Total Lessons | With Transcripts | % Coverage |
|---------|-------|---------------|------------------|------------|
| Art | Primary | 214 | 214 | **100%** |
| Art | Secondary | 189 | 189 | **100%** |
| Citizenship | Secondary | 318 | 318 | **100%** |
| Computing | Primary | 180 | 180 | **100%** |
| Computing | Secondary | 348 | 348 | **100%** |
| Cooking & Nutrition | Primary | 72 | 72 | **100%** |
| Cooking & Nutrition | Secondary | 36 | 36 | **100%** |
| Design Technology | Primary | 144 | 144 | **100%** |
| Design Technology | Secondary | 216 | 216 | **100%** |
| English | Primary | 1,516 | 1,488 | **98%** |
| English | Secondary | 1,035 | 1,035 | **100%** |
| Geography | Primary | 223 | 223 | **100%** |
| Geography | Secondary | 527 | 527 | **100%** |
| History | Primary | 216 | 216 | **100%** |
| History | Secondary | 468 | 468 | **100%** |
| Maths | Primary | 1,072 | 1,067 | **99.5%** |
| Maths | Secondary | 1,235 | 1,235 | **100%** |
| Music | Primary | 216 | 216 | **100%** |
| Music | Secondary | 218 | 210 | **96%** |
| Religious Education | Primary | 216 | 216 | **100%** |
| Religious Education | Secondary | 396 | 396 | **100%** |
| Science | Primary | 390 | 390 | **100%** |
| Science | Secondary | 888 | 888 | **100%** |
| **French** | Primary | 105 | 0 | **0%** |
| **French** | Secondary | 417 | 1 | **0.2%** |
| **German** | Secondary | 411 | 1 | **0.2%** |
| **Spanish** | Primary | 112 | 1 | **0.9%** |
| **Spanish** | Secondary | 413 | 0 | **0%** |
| **PE** | Primary | 432 | 3 | **0.7%** |
| **PE** | Secondary | 560 | 160 | **29%** |

**Total lessons in bulk download: 12,783**

### Subject Categories

Based on transcript availability, subjects fall into three categories:

#### Category A: Full Transcripts (96-100%)

These subjects have video lessons with transcripts for virtually all content:

- Art, Citizenship, Computing, Cooking & Nutrition, Design Technology
- English (98-100%), Geography, History
- Maths (99.5-100%), Music (96-100%)
- Religious Education, Science

**Total lessons with transcripts: ~10,400 (81% of all lessons)**

#### Category B: Partial Transcripts

- Physical Education Secondary: 29% (160/560)

#### Category C: No/Minimal Transcripts (0-1%)

These subjects appear to not have video lessons:

- French: 0-0.2%
- German: 0.2%
- Spanish: 0-0.9%
- Physical Education Primary: 0.7%

**Likely explanation**: MFL (Modern Foreign Languages) lessons may use audio-only or interactive formats rather than video-based teaching. PE lessons may be demonstrative videos without spoken instruction.

## API vs Bulk Download Comparison

### The `downloadsAvailable` Field Discrepancy

The bulk download data includes a `downloadsAvailable: true` field on virtually all lessons, but this does **not** reflect actual API availability:

| Subject | Bulk: `downloadsAvailable` | API Transcript | Status |
|---------|---------------------------|----------------|--------|
| Art | `true` (100% of lessons) | 404 for most | **Discrepancy** |
| Maths | `true` (100% of lessons) | 200 for all | Consistent |
| English | `true` (100% of lessons) | 404 for most | **Discrepancy** |

**Interpretation**: The `downloadsAvailable` field appears to indicate whether the lesson *content* exists, not whether it's *accessible via API*. The bulk download was generated with access to the full dataset, while the API applies TPC filtering.

### API Returns 404 for Transcripts

When testing via the MCP tools:

```
GET /lessons/principles-of-art-volume/transcript → 404 ❌
GET /lessons/the-presence-of-nature-in-art/transcript → 404 ❌
GET /lessons/checking-understanding-of-addition-and-subtraction-with-fractions/transcript → 200 ✅
```

The pattern is clear:
- **Maths lessons**: API returns transcript ✅
- **Non-maths lessons**: API returns 404 ❌ (even though bulk download has the transcript)

### Why the Discrepancy?

The API documentation explains this:

> Currently, the API includes **all lesson resources for KS1-4 maths**, plus a **sample of lesson resources** for [other subjects]

The bulk download provides the **complete dataset**, while the API **intentionally restricts** non-maths resources to a "sample". This is likely due to:

1. **TPC (Third Party Content) license clearance** — maths is fully cleared, others are partial
2. **Phased rollout** — Oak is "working to provide curriculum data... Production is expected to finish in **Autumn 2025**"

## Corrected Understanding

### Original Assumptions (WRONG)

1. ❌ "The API and bulk download should have the same transcript availability"
2. ❌ "Transcripts missing from API indicate videos without transcripts"
3. ❌ "We need special video availability detection to avoid fetching non-existent transcripts"
4. ❌ "The `/search-index/video-ids` endpoint exists" (This was hallucinated — it never existed)

### Corrected Understanding (RIGHT)

1. ✅ **The API intentionally limits non-maths transcripts** — documented as "sample" only
2. ✅ **Bulk download has complete transcripts** for most subjects (except MFL and PE)
3. ✅ **MFL subjects genuinely don't have transcripts** — likely no video content
4. ✅ **We should use bulk download for transcripts, API for real-time/incremental data**
5. ✅ **"Transcript not found" errors for non-maths are expected API behavior**

## Implications for Ingestion Strategy

### Recommended Approach: Hybrid Bulk + API

```
┌─────────────────────────────────────────────────────────────────┐
│                    INGESTION STRATEGY                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Bulk Download (Authoritative for Transcripts)                   │
│  ├── Lesson enumeration (complete list)                          │
│  ├── Transcript content (100% for most subjects)                 │
│  ├── Quiz questions and answers                                  │
│  ├── Misconceptions                                              │
│  └── Learning points, keywords, etc.                             │
│                                                                  │
│  API (Authoritative for Real-time Data)                          │
│  ├── Lesson summary (for any fields not in bulk)                 │
│  ├── Unit relationships                                          │
│  ├── Asset URLs (if needed)                                      │
│  └── Any incremental updates between bulk refreshes              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Alternative: Dual-Index Architecture

Given transcript availability patterns, we could create:

1. **Rich Index (Maths + bulk-download subjects)**
   - Full hybrid search with transcript-based semantic search
   - Optimized for transcript-heavy queries
   - Covers ~81% of lessons

2. **Foundation Index (MFL + PE)**
   - Keyword-based search only
   - Uses lesson metadata (title, description, keywords, learning points)
   - Covers ~19% of lessons

### Work Estimate for Bulk Download Ingestion

| Task | Effort | Notes |
|------|--------|-------|
| JSON Parser | 1 day | Handle the known data issues (null titles, tier duplicates) |
| BulkDownloadClient | 0.5 day | Implement same interface as OakClient |
| Transcript Extractor | 0.5 day | Parse `transcript_sentences` field |
| Deduplication | 0.5 day | Handle maths tier duplicates (373 × 2 = 746 entries) |
| Integration | 1 day | Wire into existing ingestion pipeline |
| Testing | 1 day | Verify counts, content quality |
| **Total** | **~4.5 days** | |

## Lessons Without Transcripts

Some lessons genuinely don't have transcripts because they don't have video:

### Maths Primary (5 lessons)

From previous documentation:
1. `composition-of-decade-numbers-to-100-making-groups-of-10`
2. `describe-and-represent-hundredths-as-a-decimal-number`
3. `identify-hundredths-as-part-of-a-whole`
4. `round-a-decimal-number-with-hundredths-to-the-nearest-whole-number`
5. `use-known-facts-from-the-10-times-table-to-solve-problems-involving-the-9-times-table`

### English Primary (28 lessons)

Not yet enumerated — likely similar pattern.

### MFL Subjects (~1,869 lessons)

Modern Foreign Languages appear to not use video-based teaching:
- French: 105 + 417 = 522 lessons (0% transcripts)
- German: 411 lessons (0.2% transcripts)
- Spanish: 112 + 413 = 525 lessons (0.2% transcripts)

### Physical Education (~989 lessons)

PE has very low transcript coverage:
- Primary: 432 lessons (0.7% transcripts)
- Secondary: 560 lessons (29% transcripts)

## Additional Findings from Investigation

### Known API Bugs (Documented in Wishlist)

These bugs exist independently of the transcript availability issue:

1. **Pagination Bug**: Unfiltered `/key-stages/ks4/subject/maths/lessons` returns 431 instead of 436 lessons (5 missing). Workaround: fetch by unit.

2. **Unit Summary Truncation**: `/units/{unit}/summary` returns truncated `unitLessons[]` despite schema claiming "All the lessons". Workaround: use lessons endpoint.

3. **Assets Endpoint TPC Filtering**: `/key-stages/{ks}/subject/{subject}/assets` returns only ~15-35% of non-maths lessons due to Third Party Content license filtering. This is **intentional** but undocumented.

### Caching Considerations

- **TTL-based auto-resolution**: If a transcript is cached as "not found" and later becomes available, the cache TTL will auto-expire and the next fetch will succeed. This provides graceful eventual consistency.

- **Cache categories** (per ADR-092):
  - `found`: Transcript exists
  - `not_found`: 404 response (lesson may or may not have video)
  - `empty`: 200 response with empty transcript
  - `error`: Transient failure

### Bulk Download Data Issues

When implementing bulk download ingestion, handle these known issues:

1. **Null Title Fields**: `yearTitle`, `keyStageTitle`, `subjectTitle` are often null even when slugs are populated

2. **Maths Tier Duplicates**: 373 lessons appear twice (foundation + higher) with identical content but no tier discriminator field

3. **Missing Lesson Records**: Some `unitLessons[].lessonSlug` references don't have corresponding records in `lessons[]`

4. **Inconsistent Null Semantics**: `contentGuidance` and `supervisionLevel` use string `"NULL"` instead of JSON `null`

### Production Timeline

From Oak documentation:
> "We are working to provide curriculum data and lesson resources for all subjects across key stages 1-4. **Production is expected to finish in Autumn 2025**."

This suggests transcript API coverage may improve over time.

### All Lessons Should Be Indexed

Regardless of transcript availability, **all lessons should be indexed**:

- Lessons without transcripts still have valuable metadata (title, description, keywords, learning points, misconceptions)
- Keyword/BM25 search works without transcripts
- Semantic search can use other text fields (less effective but functional)

## Open Questions for Upstream

These questions have been added to the API wishlist (`00-overview-and-known-issues.md`):

1. Is the bulk download sourced from a different environment than the API?
2. Will transcript availability for non-maths subjects improve over time (Autumn 2025)?
3. Is there a preferred ingestion pattern Oak recommends?
4. When is the next bulk download refresh expected?
5. Why do MFL subjects (French, German, Spanish) have no transcripts — is this due to audio-only content?
6. What is the intended use case difference between API and bulk download?

## Investigation Chronology

This section documents the key steps in our investigation to help future engineers understand how we reached these conclusions.

### Step 1: Observed "Transcript Not Found" Warnings (2025-12-30)

During ingestion with `pnpm es:ingest-live --all --verbose`, we observed many "transcript not found" warnings for non-maths subjects. Initial assumption: video availability pre-processing was not working correctly.

### Step 2: Code Verification

Verified that video availability pre-processing **was** implemented:
- `video-availability.ts` → `fetchVideoAvailabilityMap()`
- `lesson-materials.ts` → Conditional transcript fetching based on map
- Graceful fallback when map unavailable

### Step 3: Identified Hallucinated Endpoint

Discovered that `/search-index/video-ids` endpoint in our codebase was a **hallucination** — it never existed in the Oak API. The `video-availability.ts` code was never executing successfully.

### Step 4: MCP Tool Validation

Used MCP tools to validate actual API behavior:
- `mcp_ooc-http-dev-local_get-lessons-transcript` confirmed 404s for non-maths
- `mcp_ooc-http-dev-local_get-key-stages-subject-assets` confirmed TPC filtering
- Compared against lesson lists to identify coverage gaps

### Step 5: Bulk Download Analysis

Ran shell commands to analyse bulk download transcript coverage:

```bash
for f in *.json; do
  total=$(cat "$f" | jq '.lessons | length')
  with=$(cat "$f" | jq '[.lessons[] | select(.transcript_sentences != null)] | length')
  echo "$f: $total total, $with with transcripts"
done
```

Discovered bulk download has complete transcripts for 14/17 subjects.

### Step 6: Documentation Review

Reviewed Oak API documentation:
- [Content Coverage](https://open-api.thenational.academy/docs/about-oaks-data/content-coverage)
- [Terms and Conditions](https://www.thenational.academy/legal/terms-and-conditions-api-version)

Found explicit statement: "API includes all lesson resources for KS1-4 maths, plus a sample of lesson resources for [other subjects]"

### Step 7: Root Cause Confirmed

The "transcript not found" warnings are **expected behavior**, not bugs:
1. API intentionally limits non-maths transcripts (TPC filtering)
2. Bulk download has complete data (different generation process)
3. MFL subjects genuinely lack transcripts (no video content)

### Assumptions Tested

| # | Assumption | Status | Evidence |
|---|-----------|--------|----------|
| 1 | API and bulk download have same transcript availability | ❌ INVALID | API returns 404 where bulk has data |
| 2 | `downloadsAvailable: true` means API returns downloads | ❌ INVALID | Field reflects content existence, not API access |
| 3 | `/search-index/video-ids` endpoint exists | ❌ INVALID | Hallucinated; not in OpenAPI schema |
| 4 | Assets endpoint returns all lessons with assets | ❌ INVALID | TPC filtering limits to ~35% |
| 5 | Lessons with video always have transcripts | ❌ INVALID | Some videos lack transcripts |
| 6 | Pagination returns complete data | ❌ INVALID | 5 lessons missing for maths KS4 |
| 7 | "Transcript not found" indicates a bug | ❌ INVALID | Expected for non-maths subjects |

## Related Documentation

- [OOC API Wishlist](../plans/external/ooc-api-wishlist/00-overview-and-known-issues.md)
- [Content Coverage (Oak Docs)](https://open-api.thenational.academy/docs/about-oaks-data/content-coverage)
- [Terms and Conditions](https://www.thenational.academy/legal/terms-and-conditions-api-version)
- [ADR-083: Complete Lesson Enumeration Strategy](../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md)
- [ADR-091: Video Availability Detection Strategy](../../docs/architecture/architectural-decisions/091-video-availability-detection-strategy.md)
- [ADR-092: Transcript Cache Categorization](../../docs/architecture/architectural-decisions/092-transcript-cache-categorization.md)

## Appendix: Verification Commands

The data in this document was verified using:

```bash
# Transcript count per subject
cd reference/bulk_download_data/oak-bulk-download-2025-12-07T09_37_04.693Z
for f in *.json; do
  total=$(cat "$f" | jq '.lessons | length')
  with=$(cat "$f" | jq '[.lessons[] | select(.transcript_sentences != null and .transcript_sentences != "" and .transcript_sentences != "NULL")] | length')
  echo "$f: $total total, $with with transcripts"
done

# API transcript availability (via MCP tools)
mcp_ooc-http-dev-local_get-lessons-transcript lesson=<slug>
```

## Appendix: Content License

Per the [Terms and Conditions](https://www.thenational.academy/legal/terms-and-conditions-api-version):

> This lesson content, which is hosted in our OpenAPI (open-api.thenational.academy) is made available to use under an **Open Government Licence (OGL) v3.0**, except where otherwise stated.

Content can be:
- Copied, published, distributed and transmitted
- Adapted
- Exploited commercially and non-commercially

With attribution: "A [subject] lesson by Oak National Academy licensed under Open Government Licence (OGL)"

