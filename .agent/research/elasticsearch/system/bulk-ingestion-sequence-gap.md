# Bulk Ingestion Sequence Gap

**Date**: 2026-01-01
**Status**: Investigation complete

## Finding

The `oak_sequences` and `oak_sequence_facets` indices are empty (0 documents) because the bulk-first ingestion strategy does NOT include sequence operations.

## Evidence

### Bulk ingestion creates these indices only

From `apps/oak-search-cli/src/lib/indexing/bulk-ingestion.ts`:

```typescript
const LESSONS_INDEX = 'oak_lessons';
const UNITS_INDEX = 'oak_units';
const UNIT_ROLLUP_INDEX = 'oak_unit_rollup';
const THREADS_INDEX = 'oak_threads';
```

### Sequence operations exist but are only in API path

Sequence operations are implemented:
- `src/lib/indexing/sequence-bulk-helpers.ts` - `buildSequenceOps()`
- `src/lib/indexing/sequence-facet-index.ts` - `buildSequenceFacetOps()`

But these are only called from the **API-based ingestion path**:
- `src/lib/index-oak.ts` → `buildOpsForSubject()` → sequence sources
- `src/lib/index-oak-keystage-ops.ts` → sequence facet ops

The bulk-first pipeline (`bulk-ingestion.ts`) does NOT call these functions.

## Impact

- `oak_sequences`: 0 documents (expected: ~32 sequences)
- `oak_sequence_facets`: 0 documents (expected: hundreds of facets)

## Root Cause

The bulk-first ingestion strategy (ADR-093) focused on lessons, units, rollups, and threads.
Sequence operations were not migrated from the API path to the bulk path.

## Recommendation

This is a **known gap**, not a bug. Options:

1. **Add sequences to bulk path** - Create `buildSequenceOpsFromBulkData()` that extracts sequences from bulk download files
2. **Run API path for sequences** - Use the existing API-based ingestion just for sequences
3. **Accept gap** - If sequences aren't needed for current search use cases

## Priority

**Low** - The sequence indices are used for faceted navigation, not primary search.
The ELSER retry robustness issue is higher priority as it blocks ~50% of lesson content.

## Related

- [ADR-093: Bulk-First Ingestion Strategy](../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md)
- `src/lib/indexing/sequence-bulk-helpers.ts`
- `src/lib/indexing/sequence-facet-index.ts`

