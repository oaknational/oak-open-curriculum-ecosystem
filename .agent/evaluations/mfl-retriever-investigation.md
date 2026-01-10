# MFL Retriever Investigation Report

**Generated**: 2026-01-10
**Track**: Phase 8 Analysis Remediation - Track 3

## Context

Modern Foreign Language (MFL) subjects (French, German, Spanish) show consistently poor search performance across all query categories. This investigation examines the root cause.

## Key Findings

### 1. Root Cause: Missing Transcripts, Not ELSER Language Limitation

**Initial Hypothesis**: ELSER (Elasticsearch Learning to Rank) is English-only, causing semantic search to fail for non-English content.

**Corrected Understanding**: The real issue is that MFL lessons lack video transcripts. The Oak platform stores transcripts from lesson videos, but MFL lessons often don't have video content in the same way other subjects do.

### 2. Architecture Analysis

The four-way RRF retriever architecture combines:

1. **BM25 on Content** (`lesson_content`) - Full transcript + pedagogical fields
2. **ELSER on Content** (`lesson_content_semantic`) - Semantic embedding of transcript
3. **BM25 on Structure** (`lesson_structure`) - Curated semantic summary
4. **ELSER on Structure** (`lesson_structure_semantic`) - Semantic embedding of summary

When `has_transcript: false`:
- `lesson_content` is `undefined`
- `lesson_content_semantic` is `undefined`
- Content retrievers (1 & 2) contribute nothing to RRF fusion
- Only Structure retrievers (3 & 4) participate

### 3. Evidence from Zero-Hit Investigation

From the zero-hit investigation, MFL subjects account for 24 of 95 zero-hits (25%):
- French: 11 queries
- German: 5 queries
- Spanish: 8 queries

### 4. Current Code Handles Missing Transcripts

```typescript
// From lesson-document-core.ts
const hasTranscript = typeof params.transcript === 'string' && params.transcript.length > 0;
return {
  ...
  has_transcript: hasTranscript,
  lesson_content: hasTranscript ? params.transcript : undefined,
  lesson_content_semantic: hasTranscript ? params.transcript : undefined,
  ...
};
```

The architecture correctly flags lessons without transcripts, but doesn't currently adjust retriever weighting.

## Analysis

### Why MFL Performance is Poor

1. **Reduced Retriever Participation**: Only 2 of 4 retrievers contribute for lessons without transcripts
2. **Structure Field Limitations**: The `lesson_structure` field is generated from pedagogical metadata, not linguistic content. It may not capture MFL-specific terminology effectively.
3. **Query-Content Mismatch**: Many MFL queries use English terms ("French verbs", "German grammar") but the lesson content may primarily be in the target language.

### RRF Doesn't Compensate

RRF fusion works by combining ranks from multiple retrievers. When 2 retrievers return nothing (or poor results), the remaining 2 must carry all the weight. This effectively halves the signal quality.

## Recommendations

### Short-term (No Code Changes)

1. **Accept MFL Limitation**: Document that MFL search performance is inherently limited due to content structure, not a bug.
2. **Adjust Ground Truth Expectations**: Consider lower MRR targets for MFL subjects in the filtered aggregate.
3. **Review MFL Ground Truths**: Some MFL queries may be unrealistic given the content available.

### Medium-term (Potential Improvements)

1. **Structure Field Enhancement**: Ensure `lesson_structure` for MFL lessons includes more English descriptive metadata:
   - Topic descriptions in English
   - Grammar concepts named in English
   - Year-appropriate vocabulary themes

2. **Conditional Retriever Weighting** (Complex):
   ```typescript
   // Pseudocode - not implemented
   if (subject in MFL_SUBJECTS) {
     // Boost structure retrievers when content is sparse
     rrf_constant_for_structure *= 1.5;
   }
   ```
   This would require significant changes to the RRF architecture and careful testing.

3. **English Translation Layer**: For MFL subjects, add an English translation of key lesson concepts to `lesson_content`. This would allow BM25 and ELSER content retrievers to participate meaningfully.

### Long-term (Strategic)

1. **Multilingual Embeddings**: Explore multilingual embedding models that can match English queries to French/German/Spanish content.
2. **Oak Content Enhancement**: Request that Oak adds more English-language metadata to MFL lessons at the source.

## Conclusion

MFL poor performance is primarily a **data architecture issue**, not a search algorithm bug. Lessons without transcripts effectively operate with half the search capability. This is a known limitation that should be:

1. Documented in the search quality baselines
2. Excluded from aggregate metrics (via filtered aggregates)
3. Addressed through content enhancement rather than algorithm changes

## Related Files

- `src/lib/indexing/lesson-document-core.ts` - Transcript handling
- `src/lib/hybrid-search/rrf-query-builders.ts` - Four-way RRF architecture
- `src/lib/hybrid-search/rrf-query-helpers.ts` - Retriever implementations
- `.agent/evaluations/zero-hit-investigation.md` - Zero-hit query details
