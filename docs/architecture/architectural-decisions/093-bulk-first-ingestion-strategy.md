# ADR-093: Bulk-First Ingestion Strategy

**Status**: Accepted  
**Date**: 2025-12-30  
**Related**: ADR-083 (Complete Lesson Enumeration), ADR-091 (Video Availability Detection), ADR-092 (Transcript Cache Categorization)

## Context

Investigation into transcript availability revealed fundamental differences between the Oak bulk download and live API:

| Source            | Transcript Coverage   | Structural Data                 |
| ----------------- | --------------------- | ------------------------------- |
| **Bulk Download** | ~81% (14/17 subjects) | Missing tier info, unit options |
| **Live API**      | ~16% (maths only)     | Complete structural data        |

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

- Complete lesson enumeration (~12,783 lessons)
- Transcripts for 81% of lessons (all subjects except MFL and PE)
- Rich metadata (keywords, learning points, misconceptions, teacher tips)
- Exam board information on units
- Exam subject information (biology, chemistry, physics, combined-science)

However, it lacks:

- **Tier information** for Maths KS4 (373 lessons duplicated with no discriminator)
- **Unit options** for Geography and English KS4
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
│     ├── Extract transcripts (81% coverage)                       │
│     ├── Extract metadata (keywords, learning points, etc.)       │
│     ├── Extract exam boards from unit `examBoards` field         │
│     └── Extract exam subjects from `subjectSlug`                 │
│                                                                  │
│  2. SUPPLEMENT FROM API                                          │
│     ├── Tier info for Maths KS4                                  │
│     │   └── Via `/sequences/maths-secondary/units`               │
│     └── Unit options for Geography/English KS4                   │
│         └── Via `/sequences/{seq}/units` with `unitOptions`      │
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

## Rationale

### Why Bulk-First?

1. **81% transcript coverage** vs 16% from API
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

- ✅ **81% transcript coverage** — semantic search across 14/17 subjects
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

- [Bulk Download vs API Comparison](../../../.agent/analysis/bulk-download-vs-api-comparison.md)
- [Transcript Availability Analysis](../../../.agent/analysis/transcript-availability-analysis.md)
- [Curriculum Structure Analysis](../../../.agent/analysis/curriculum-structure-analysis.md)
- [ADR-083: Complete Lesson Enumeration](083-complete-lesson-enumeration-strategy.md)
- [ADR-091: Video Availability Detection](091-video-availability-detection-strategy.md)

## Open Questions

1. ~~**Bulk download refresh cadence**: How often should we re-download?~~ **RESOLVED**: Manual refresh every few weeks.
2. **Staleness detection**: How do we know when new lessons are added via API but not in bulk?
3. **RSHE-PSHE handling**: Oak's UI shows RSHE-PSHE as available, but the `/api/bulk` endpoint does NOT return these files (confirmed 2025-12-30). Return 422 Unprocessable Content for this subject until bulk files become available.

---

**Decision Made By**: Development Team  
**Date**: 2025-12-30  
**Review Date**: 2026-03-30 (or when Oak API reaches full coverage)
