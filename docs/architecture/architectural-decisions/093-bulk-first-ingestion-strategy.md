# ADR-093: Bulk-First Ingestion Strategy

**Status**: Accepted (Revised)  
**Date**: 2025-12-30  
**Revised**: 2026-02-28 — CLI interface updated: bulk mode is now the default, per-index filtering added
**Revised**: 2026-03-21 — Category supplementation added as a third API supplementation path
**Related**: ADR-083 (Complete Lesson Enumeration), ADR-087 (Batch-Atomic Ingestion), ADR-091 (Video Availability Detection), ADR-092 (Transcript Cache Categorization)

## Context

Investigation into transcript availability revealed fundamental differences between the Oak bulk download and live API:

| Source            | Transcript Coverage | Structural Data                 |
| ----------------- | ------------------- | ------------------------------- |
| **Bulk Download** | ~81.9% overall      | Missing tier info, unit options |
| **Live API**      | ~16% (maths only)   | Complete structural data        |

The current ingestion pipeline uses the API exclusively, which results in:

- ~65% of transcript requests returning 404 for non-maths subjects
- Many "transcript not found" warnings (expected, not bugs)
- Semantic search limited to maths + metadata for other subjects

### Root Cause

The API documentation explicitly states:

> "Currently, the API includes **all lesson resources for KS1-4 maths**, plus a **sample of lesson resources** for [other subjects]"

This is intentional TPC (Third Party Content) license filtering, not a bug.

### Bulk Download Analysis

The bulk download (`reference/bulk_download_data/`) contains:

- Complete lesson enumeration (~12,833 lessons; 12,320 unique)
- Transcripts for ~81.9% of lessons (MFL and PE sparse; missing often `"NULL"`)
- Rich metadata (keywords, learning points, misconceptions, teacher tips)
- Exam board information on units
- Exam subject information (biology, chemistry, physics, combined-science)

However, it lacks:

- **Tier information** for Maths KS4 (373 lessons duplicated with no discriminator)
- **Unit options** for Geography, English, and History KS4
- `phaseSlug`, `categories`, `canonicalUrl` fields

## Decision

### Strategy: Bulk Download as Primary, API for Supplementary Data

```text
┌─────────────────────────────────────────────────────────────────┐
│                    INGESTION FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. PARSE BULK DOWNLOAD                                          │
│     ├── Enumerate all lessons                                    │
│     ├── Extract transcripts (~81.9% coverage)                    │
│     ├── Extract metadata (keywords, learning points, etc.)       │
│     ├── Extract exam boards from unit `examBoards` field         │
│     └── Extract exam subjects from `subjectSlug`                 │
│                                                                  │
│  2. SUPPLEMENT FROM API                                          │
│     ├── Tier info for Maths KS4                                  │
│     │   └── Via `/sequences/maths-secondary/units`               │
│     ├── Unit options for Geography/English/History KS4           │
│     │   └── Via `/sequences/{seq}/units` with `unitOptions`      │
│     └── Categories (unit topics) for all sequences               │
│         └── Via `/sequences/{seq}/units` → `categories` field    │
│                                                                  │
│  3. MERGE AND INDEX                                              │
│     ├── Join lesson → unit → year                                │
│     ├── Deduplicate by (lessonSlug, tier, examSubject)           │
│     └── Index to Elasticsearch                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Normalization

The bulk download has data quality issues that must be handled:

| Issue                                   | Solution                             |
| --------------------------------------- | ------------------------------------ |
| `"NULL"` strings instead of JSON `null` | Convert during parsing               |
| `downloadsavailable` (lowercase typo)   | Map to `downloadsAvailable`          |
| Maths tier duplicates                   | Use API to determine tier membership |
| Science exam board duplicates           | Deduplicate `examBoards` array       |

### Year Derivation

Neither bulk download nor API provides `yearSlug` directly on lessons. Derivation:

```text
lesson.unitSlug → sequence.units[].unitSlug → unit.yearSlug
```

Note: `lesson.unitSlug` here refers to a bulk-download row, which is
variant-flattened (one row per lesson-unit variant). The API lesson
resource exposes its unit membership structurally via `lesson.units[]`
with embedded `programmeFactors` — see ADR-080 §"Context".

## Rationale

### Why Bulk-First?

1. **~81.9% transcript coverage** vs 16% from API
2. **No wasted API calls** — bulk has all data locally
3. **Faster ingestion** — read from disk vs HTTP requests
4. **Complete enumeration** — no pagination bugs or TPC filtering
5. **Full metadata** — keywords, misconceptions, teacher tips all present

### Why Still Use API?

1. **Tier information** — bulk cannot distinguish foundation vs higher
2. **Unit options** — bulk lacks alternative unit choices
3. **Real-time updates** — API has latest curriculum changes (bulk may be stale)

### Why Not Bulk-Only?

Without tier information, maths KS4 lessons cannot be correctly associated with foundation or higher tier. This affects:

- Search filtering by tier
- Lesson-unit relationships
- Curriculum coherence

## Consequences

### Positive

- ✅ **~81.9% transcript coverage** — semantic search across most subjects (MFL/PE sparse)
- ✅ **No 404 noise** — transcripts available locally
- ✅ **Faster ingestion** — no per-lesson API calls for transcripts
- ✅ **Complete metadata** — all fields available in bulk

### Negative

- ⚠️ **Bulk data staleness** — requires periodic re-download
- ⚠️ **Implementation effort** — new parser and merge logic
- ⚠️ **Hybrid complexity** — two data sources to coordinate

### Neutral

- ℹ️ **Video availability detection obsolete** — ADR-091 approach no longer needed
- ℹ️ **Cache categorization still useful** — for API-only fields if needed later

## Implementation

### Software Architecture: Composition Pattern

The implementation uses **composition over inheritance** to combine bulk and API data sources while preserving existing code:

```text
┌─────────────────────────────────────────────────────────────────┐
│                    DATA SOURCES                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  BulkDownloadSource (NEW)              OakClient (EXISTING)      │
│  ├── parseSequence(file)               ├── getSequenceUnits()    │
│  ├── getAllLessons()                   ├── getLessonsByUnit()    │
│  ├── getAllUnits()                     └── (tier/unit options)   │
│  ├── getTranscript(slug)                                         │
│  └── buildLessonUnitYearMap()                                    │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                    COMPOSITION LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  HybridDataSource (NEW)                                          │
│  ├── getLessonWithMaterials(slug)                                │
│  │   → bulk.getLesson() + api.getTierInfo() if maths KS4        │
│  ├── getUnitWithOptions(slug)                                    │
│  │   → bulk.getUnit() + api.getUnitOptions() if applicable      │
│  └── enumerateLessons()                                          │
│      → bulk.getAllLessons() (complete enumeration)              │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                    EXISTING PIPELINE (MINIMAL CHANGES)           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  index-oak.ts                                                    │
│  ├── Uses HybridDataSource instead of OakClient directly        │
│  └── Rest of pipeline unchanged                                  │
│                                                                  │
│  ES Indexer (UNCHANGED)                                          │
│  └── Receives same document format                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Principles

1. **Interface segregation**: `BulkDownloadSource` has methods for bulk data, `OakClient` for API — they don't share an interface because they serve different purposes

2. **Single Responsibility**: `HybridDataSource` is the only place that knows about the composition logic

3. **Dependency Injection**: Pass sources as constructor parameters — testable without real data

4. **Minimal modification**: Existing `OakClient`, adapters, caching all stay intact

5. **TDD-driven**: Write tests for `BulkDownloadSource` first, then `HybridDataSource`

### Phase 1: Bulk Download Parser

Create `src/lib/indexing/bulk-download-source.ts`:

- Parse JSON files from `reference/bulk_download_data/`
- Normalize null values (`"NULL"` → `null`)
- Extract lesson-unit-year relationships
- Handle data quality issues (typos, duplicates)
- Unit tests for all parsing logic

### Phase 2: API Supplementation

Create `src/lib/indexing/api-supplementation.ts`:

- Fetch tier info for maths KS4 via sequences endpoint
- Fetch unit options for geography/english KS4
- Fetch categories (unit topics) for all sequences via `/sequences/{seq}/units`
- RSHE-PSHE full API fallback (no bulk file exists)
- Cache results for subsequent ingestion runs

### Phase 3: Hybrid Data Source

Create `src/lib/indexing/hybrid-data-source.ts`:

- Compose bulk + API sources
- Implement composition logic (when to use which source)
- Handle deduplication for maths tiers
- Unit tests for composition behavior

### Phase 4: Pipeline Integration

Update `src/lib/index-oak.ts`:

- Accept `HybridDataSource` for lesson enumeration
- Minimal changes to existing flow
- Full ingestion run

### Phase 5: Cleanup (Completed)

- ✅ Remove `video-availability.ts` (no longer needed)
- ✅ Update ADR-091 to note obsolescence
- ✅ Archive efficient API traversal plan

## Alternatives Considered

### Alternative 1: API-Only (Current Approach)

Continue with current pipeline, accepting ~16% transcript coverage.

**Rejected**: Significantly inferior coverage; semantic search limited to maths.

### Alternative 2: Dual-Index Architecture

Separate indexes for bulk-sourced and API-sourced content.

**Rejected**: Added complexity without clear benefit; single index simpler.

### Alternative 3: Wait for API Completion

Wait for Oak to complete TPC clearance (Autumn 2025).

**Rejected**: 9+ month delay; uncertain timeline; blocks important demo.

## Related Documents

- Bulk Download vs API Comparison
- Transcript Availability Analysis
- Curriculum Structure Analysis
- [ADR-083: Complete Lesson Enumeration](083-complete-lesson-enumeration-strategy.md)
- [ADR-091: Video Availability Detection](091-video-availability-detection-strategy.md)

## Revision: CLI Interface (2026-02-28)

### Change

The ingest CLI (`pnpm es:ingest`) now defaults to bulk mode. Previously,
API mode was the default and bulk mode required `--bulk --bulk-dir <path>`.

| Before (2025-12-30)                                                               | After (2026-02-28)                                                  |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `pnpm es:ingest-live -- --all` (API default)                                      | `pnpm es:ingest` (bulk default)                                     |
| `pnpm es:ingest-live -- --bulk --bulk-dir ./bulk-downloads`                       | `pnpm es:ingest` (bulk default, dir defaults to `./bulk-downloads`) |
| `pnpm es:ingest-live -- --bulk --bulk-dir ./bulk-downloads --all --index threads` | `pnpm es:ingest -- --index threads`                                 |
| N/A                                                                               | `pnpm es:ingest -- --api --all` (explicit API mode)                 |

### Per-Index Filtering

Both bulk and API paths now skip unnecessary processing when `--index` is
specified. For example, `--index threads` skips curriculum file processing
(lessons, units, rollups, sequences, vocabulary mining) and only extracts
threads from the bulk files. This reduces a full-curriculum read + process
down to thread extraction only.

| `--index` value                        | Skipped processing                                                 |
| -------------------------------------- | ------------------------------------------------------------------ |
| `threads` only                         | Curriculum file processing, sequence extraction, vocabulary mining |
| `lessons`, `units`, `unit_rollup` only | Thread extraction, sequence extraction                             |
| `sequences`, `sequence_facets` only    | Curriculum file processing, thread extraction                      |

### Bulk Directory Validation

The CLI validates the bulk directory at startup. If the directory does not
exist or contains no JSON files, the CLI throws immediately with an
actionable error directing the user to run `pnpm bulk:download` or use
`--api` mode.

### Rationale

Bulk ingestion is significantly faster and more reliable than API ingestion
(local file reads vs rate-limited HTTP calls). Making it the default
eliminates a common source of confusion: new users running `pnpm es:ingest`
without `--bulk` would trigger slow API-based ingestion when fast bulk
data was available locally. The per-index filtering addresses a concrete
problem observed during the M1-S001a reindex: even with `--index threads`,
the CLI was fetching all curriculum data from the API before filtering —
wasting 30+ minutes of API calls that would be discarded.

## Open Questions

1. ~~**Bulk download refresh cadence**: How often should we re-download?~~ **RESOLVED**: Manual refresh every few weeks.
2. **Staleness detection**: How do we know when new lessons are added via API but not in bulk?
3. **RSHE-PSHE handling**: Oak's UI shows RSHE-PSHE as available, but the `/api/bulk` endpoint does NOT return these files (confirmed 2025-12-30). Return 422 Unprocessable Content for this subject until bulk files become available.

---

**Decision Made By**: Development Team  
**Date**: 2025-12-30 (original), 2026-02-28 (CLI revision), 2026-03-21 (category supplementation)
**Review Date**: 2026-03-30 (or when Oak API reaches full coverage)
