# Bulk Ingestion Fixes (Archived)

**Status**: ✅ COMPLETED — Archived 2025-12-31
**Created**: 2025-12-31
**Completed**: 2025-12-31

---

## Summary

This plan addressed three critical fixes for the bulk ingestion pipeline. All fixes were implemented and quality gates passed.

## Fixes Implemented

### Fix 1: Transcript NULL Handling ✅

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/bulk/bulk-schemas.ts`

**Problem**: Bulk data contains literal "NULL" strings for missing transcripts.

**Solution**: Changed to `nullSentinelSchema.optional()` which transforms "NULL" → `null` at parse time.

### Fix 2: Semantic Summary Generation ✅

**Location**: `apps/oak-open-curriculum-semantic-search/src/adapters/bulk-lesson-transformer.ts`

**Problem**: `lesson_structure` and `lesson_structure_semantic` were explicitly set to `undefined`.

**Solution**: Generate semantic summaries from bulk lesson's pedagogical fields (title, key stage, subject, unit, keywords, learning points, misconceptions, tips, guidance, outcome).

### Fix 3: Rollup Document Creation ✅

**Location**: `apps/oak-open-curriculum-semantic-search/src/adapters/bulk-rollup-builder.ts`

**Problem**: `oak_unit_rollup` index was completely empty.

**Solution**: Created `bulk-rollup-builder.ts` module that transforms bulk units, collects lesson snippets, and generates rollup documents.

### Fix 4: Bulk Upload Robustness ✅

**Location**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/bulk-chunk-uploader.ts`

**Changes**:

- Reduced `MAX_CHUNK_SIZE_BYTES` from 50MB to 20MB
- Added `DEFAULT_CHUNK_DELAY_MS` (500ms) for rate limiting
- Implemented retry logic with exponential backoff and jitter

## Files Modified

| File | Change |
|------|--------|
| `packages/sdks/.../bulk-schemas.ts` | nullSentinelSchema for transcripts |
| `apps/.../bulk-lesson-transformer.ts` | Semantic summary generation |
| `apps/.../bulk-rollup-builder.ts` | NEW — Rollup document creation |
| `apps/.../bulk-rollup-builder.unit.test.ts` | NEW — Unit tests |
| `apps/.../hybrid-data-source.ts` | Integrated rollup builder |
| `apps/.../bulk-chunk-uploader.ts` | NEW — Chunking with retry |
| `apps/.../ingest-harness-ops.ts` | Refactored for max-lines |

## Follow-up Work

**Fix 5 (Missing Transcript Handling)** was identified during this work but is tracked separately:

- See [missing-transcript-handling.md](../../active/missing-transcript-handling.md)
- See [ADR-095](../../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md)

## Related ADRs

- [ADR-093: Bulk-First Ingestion Strategy](../../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md)
- [ADR-094: `has_transcript` Field](../../../../docs/architecture/architectural-decisions/094-has-transcript-field.md)
- [ADR-095: Missing Transcript Handling](../../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md)


