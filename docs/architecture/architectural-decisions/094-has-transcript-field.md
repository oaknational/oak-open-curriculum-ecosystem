# ADR-094: `has_transcript` Boolean Field

**Status**: Accepted
**Created**: 2025-12-31
**Updated**: 2026-01-01
**Context**: Semantic Search Bulk Ingestion

## Context

The Oak Curriculum bulk download contains lessons where some have transcripts and some do not. MFL subjects (French, German, Spanish) have ~0% transcript coverage. PE has partial coverage (~28.5% secondary, ~0.6% primary). All other subjects have 95-100% coverage.

During search, we need to:

1. **Filter**: Allow users to request "only lessons with video/transcript"
2. **Debug**: Understand transcript coverage per subject/keystage
3. **UI indication**: Potentially mark lessons without video in search results
4. **RRF behavior**: Understand why a document ranked where it did

## Decision

Add a `has_transcript` boolean field to the `oak_lessons` Elasticsearch mapping.

```typescript
// In generated mapping
has_transcript: {
  type: 'boolean';
}
```

**Population logic** (in `bulk-lesson-transformer.ts`):

```typescript
const hasTranscript =
  typeof lesson.transcript_sentences === 'string' && lesson.transcript_sentences.length > 0;

return {
  has_transcript: hasTranscript,
  // ... other fields
};
```

## Consequences

### Positive

- **Explicit truth**: The field captures what we know, not what we've substituted
- **Filterable**: Users can exclude lessons without transcripts if needed
- **Debuggable**: Easy to query transcript coverage: `GET oak_lessons/_search?q=has_transcript:false`
- **UI-ready**: Search results can show "no video" indicators
- **RRF explainability**: When a lesson without transcript ranks lower, the reason is clear

### Negative

- **Schema change**: Requires update to SDK mapping generator
- **Re-index**: Existing indices need refresh after mapping change

### Neutral

- **Storage**: One boolean per document (~12K documents) is negligible

## Implementation

1. Update SDK mapping generator to include `has_transcript: { type: 'boolean' }`
2. Update `bulk-lesson-transformer.ts` to populate the field
3. Run `pnpm type-gen` to regenerate types
4. Re-ingest with new mapping

## Related

- [ADR-095: Missing Transcript Handling](095-missing-transcript-handling.md) — How we handle missing transcripts in content fields
- [ADR-093: Bulk-First Ingestion Strategy](093-bulk-first-ingestion-strategy.md) — Why bulk download is primary data source
