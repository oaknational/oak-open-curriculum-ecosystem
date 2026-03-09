# Category Integration Remediation

**Status**: Not started
**Priority**: Medium — enrichment feature, not a correctness fix
**Prerequisite**: None (independent of unified-versioned-ingestion)
**Related**: [bulk-downloads-data-gaps.md](bulk-downloads-data-gaps.md)

## Problem

The CLI has complete category supplementation infrastructure that is never
activated. The transformers accept optional `categoryMap` parameters, but
the orchestration layer never builds or passes the map.

### What exists and works

- **`category-supplementation.ts`** — `buildCategoryMap()`,
  `getCategoriesForUnit()`, `extractCategoryTitles()`. Pure functions that
  transform API response data into a `CategoryMap` lookup.
- **`bulk-unit-transformer.ts`** — `BulkToESUnitParams.categoryMap?:
  CategoryMap` (line 55). `resolveUnitTopics()` uses it to populate
  `unit_topics` (lines 75–82).
- **`bulk-sequence-transformer.ts`** — `buildSequenceBulkOperations()`
  accepts optional `categoryMap` (line 236). `collectCategoryTitles()`
  aggregates category titles across a sequence's units (lines 79–91).

### What is missing

- **`bulk-ingestion-phases.ts`** — Zero references to `categoryMap` or
  `category-supplementation`. The orchestration layer never:
  1. Fetches category data from the API
  2. Builds the `CategoryMap`
  3. Passes it to the unit or sequence transformers
- **`hybrid-data-source.ts`** — Does not accept or thread `categoryMap`
  to the unit transformer it wraps.

## Fix

### Option A: API-based category fetching (available now)

Wire category fetching into the ingestion pipeline using the existing
`getSequenceUnits` API method, mirroring how `api-supplementation.ts`
fetches KS4 tier/exam board data.

#### Steps

1. **Create `fetchCategoryMap` orchestration function** — In
   `category-supplementation.ts`, add a function that takes an
   `OakClient` and a list of sequence slugs, calls
   `client.getSequenceUnits()` for each, and merges the results via
   `buildCategoryMap()` into a single `CategoryMap`.

2. **Thread `categoryMap` through `bulk-ingestion-phases.ts`**:
   - Add optional `categoryMap?: CategoryMap` parameter to
     `collectPhaseResults()`
   - Pass it to `extractAndBuildSequenceOperations()` → forward to
     `buildSequenceBulkOperations(files, seqIndex, facetsIndex, categoryMap)`
   - Pass it to `processSingleBulkFile()` → forward to
     `HybridDataSource` → unit transformer

3. **Thread `categoryMap` through `hybrid-data-source.ts`**:
   - Add optional `categoryMap?: CategoryMap` to
     `createHybridDataSource()` parameters
   - Pass it through to the unit transformer's `BulkToESUnitParams`

4. **Build and pass the map in `bulk-ingestion.ts`** (the caller of
   `collectPhaseResults`):
   - Before calling `collectPhaseResults`, call the new
     `fetchCategoryMap()` with the sequence slugs from the bulk files
   - Pass the resulting map into `collectPhaseResults()`

5. **Tests**: TDD throughout. Key test cases:
   - `fetchCategoryMap` returns merged map from multiple sequences
   - `fetchCategoryMap` handles API failures gracefully (categories are
     enrichment, not critical — log and continue with empty map)
   - `collectPhaseResults` passes categoryMap to sequence transformer
   - Unit transformer populates `unit_topics` when categoryMap provided
   - Sequence transformer populates category titles when categoryMap provided

### Option B: Bulk-download-based categories (pending API team)

If the API team adds category data to the bulk downloads (see
[bulk-downloads-data-gaps.md](bulk-downloads-data-gaps.md)), the
fix is simpler:

1. Extract category data from the bulk download file during parsing
2. Build `CategoryMap` directly from bulk data (no API calls)
3. Pass to transformers as in Option A steps 2–3

This option eliminates the API call overhead but depends on the API team
adding the data.

### Recommendation

Implement Option A first. It activates the existing infrastructure with
minimal new code and no external dependency. If/when the API team adds
category data to bulk downloads, swap the data source from API to bulk
(the transformer-side wiring stays identical).

## Files to modify

| File | Change |
|------|--------|
| `apps/oak-search-cli/src/adapters/category-supplementation.ts` | Add `fetchCategoryMap()` orchestration function |
| `apps/oak-search-cli/src/lib/indexing/bulk-ingestion-phases.ts` | Thread `categoryMap` through `collectPhaseResults`, `extractAndBuildSequenceOperations`, `processSingleBulkFile` |
| `apps/oak-search-cli/src/adapters/hybrid-data-source.ts` | Accept and thread `categoryMap` to unit transformer |
| `apps/oak-search-cli/src/lib/indexing/bulk-ingestion.ts` | Build `CategoryMap` before calling `collectPhaseResults` |
| Test files for all of the above | TDD: RED → GREEN → REFACTOR |

## Size estimate

Small-medium. The transformer-side code already works — this is wiring
and a single new orchestration function with tests.
