# ADR-095: Missing Transcript Handling (Option D)

**Status**: Accepted
**Created**: 2025-12-31
**Updated**: 2026-01-01
**Context**: Semantic Search Bulk Ingestion

## Context

Approximately 19% of Oak Curriculum lessons lack transcripts:

| Subject Group                 | Transcript Coverage |
| ----------------------------- | ------------------- |
| MFL (French, German, Spanish) | ~0%                 |
| PE Primary                    | ~0.6%               |
| PE Secondary                  | ~28.5%              |
| All other subjects            | 95-100%             |

The current implementation substitutes a placeholder string for missing transcripts:

```typescript
// Current (problematic)
const transcriptText = lesson.transcript_sentences ?? '[No transcript available]';
```

This pollutes:

- **BM25 index**: Tokenizes "No", "transcript", "available" as searchable terms
- **ELSER embeddings**: Creates semantic representation of meaningless placeholder

## Decision

**Option D: Conditional Retriever** — Omit content fields for lessons without transcripts.

```typescript
// New implementation
const hasTranscript =
  typeof lesson.transcript_sentences === 'string' && lesson.transcript_sentences.length > 0;

return {
  has_transcript: hasTranscript,
  ...(hasTranscript
    ? {
        lesson_content: lesson.transcript_sentences,
        lesson_content_semantic: lesson.transcript_sentences,
      }
    : {}),
  // Structure fields always populated from pedagogical data
  lesson_structure: structureSummary,
  lesson_structure_semantic: structureSummary,
  // ... other fields
};
```

## Elasticsearch Documentation Confirms This Approach

**Official Elasticsearch `null_value` documentation states:**

> "A `null` value cannot be indexed or searched. When a field is set to `null`, (or an empty array or an array of `null` values) it is treated as though that field has no values."
>
> — [ES null_value documentation](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/null-value)

**Key implications:**

1. **Omitting fields is safe** — Documents with missing fields are indexed normally; those fields simply have no values
2. **No inference error** — `semantic_text` fields that are null/missing don't trigger inference calls
3. **Queries don't match** — Documents missing a field won't match queries on that field
4. **No `null_value` workaround needed** — We can simply omit the fields entirely

This confirms Option D is the correct approach. No experiment was needed — the official documentation is definitive.

## Rejected Alternatives

### Option A: Empty String

```typescript
lesson_content: lesson.transcript_sentences ?? '';
```

**Rejected**: While ES would handle this, ELSER may still run inference on empty string, wasting resources. Explicit omission is cleaner.

### Option B: Explicit Null

```typescript
lesson_content: lesson.transcript_sentences ?? null;
```

**Rejected**: Functionally equivalent to omitting the field per ES documentation. Explicit omission via spread operator is clearer code intent.

### Option C: Use Structure as Fallback

```typescript
lesson_content: lesson.transcript_sentences ?? structureSummary;
```

**Rejected**: Conflates two distinct signals. Structure is always available; content is conditional. Mixing them reduces retriever independence.

## Consequences

### Positive

- **Truthful**: No placeholder data in index
- **Clean retrieval**: BM25/ELSER content retrievers only match documents with actual content
- **RRF natural handling**: Documents without content fields simply don't appear in content retriever results; structure retrievers still find them
- **No garbage embeddings**: ELSER doesn't waste inference on placeholders
- **Documented behavior**: ES documentation confirms this is the correct approach

### Negative

- **Lessons without transcripts rank lower**: They only match via structure retrievers (2 of 4 retrievers)
  - This is **correct behavior** — MFL lessons should rank lower on transcript-based queries

### RRF Behavior

| Retriever       | Doc with transcript   | Doc without transcript         |
| --------------- | --------------------- | ------------------------------ |
| BM25 content    | ✅ Appears in ranking | ❌ Field missing, no match     |
| ELSER content   | ✅ Appears in ranking | ❌ Field missing, no inference |
| BM25 structure  | ✅ Appears in ranking | ✅ Appears in ranking          |
| ELSER structure | ✅ Appears in ranking | ✅ Appears in ranking          |

**Result**: Lessons without transcripts can still be found via structure queries (pedagogical fields: title, keywords, learning points, misconceptions, tips). They will rank lower than transcript-bearing lessons for content queries, which is correct behavior.

## Implementation

1. Update unit tests FIRST (TDD: remove `[No transcript available]` assertions)
2. Make `lesson_content` and `lesson_content_semantic` optional in search schema
3. Add `has_transcript` field per [ADR-094](094-has-transcript-field.md)
4. Update `bulk-lesson-transformer.ts` to conditionally include content fields
5. Run `pnpm type-gen` to regenerate types
6. Re-ingest and verify MRR

## References

- [Elasticsearch null_value documentation](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/null-value) — Confirms omitting fields is safe
- [Elasticsearch semantic_text documentation](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text) — Field type reference

## Related

- [ADR-094: `has_transcript` Field](094-has-transcript-field.md) — Boolean field for filtering/debugging
- [ADR-093: Bulk-First Ingestion Strategy](093-bulk-first-ingestion-strategy.md) — Why bulk download is primary data source
- [ADR-076: ELSER-Only Embedding Strategy](076-elser-only-embedding-strategy.md) — Why we use ELSER for semantic search
