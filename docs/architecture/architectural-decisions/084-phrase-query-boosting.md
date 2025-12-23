# ADR-084: Phrase Query Boosting for Multi-Word Synonym Support

## Status

Accepted

## Context

Elasticsearch synonym filters apply after tokenization, so phrase synonyms like "straight line => linear" never match. After tokenization, "straight line" becomes `["straight", "line"]`, so the phrase rule never fires.

Diagnostic analysis (18 queries) revealed that approximately 40% of the 163 deployed synonyms are multi-word phrases that are currently non-functional:

| Pattern                        | MRR   | Status    |
| ------------------------------ | ----- | --------- |
| Single-word synonym            | 0.500 | ✅ Works  |
| Phrase synonym (all positions) | 0.000 | ❌ Broken |

Examples of broken phrase synonyms:

- "straight line" (should map to linear-graphs)
- "completing the square" (should boost quadratics lessons)
- "circle rules" (should map to circle-theorems)

## Decision

Add phrase detection at query time and boost documents with `match_phrase` queries for detected curriculum phrases. The SDK remains source of truth for phrase vocabulary via the new `buildPhraseVocabulary()` function.

The solution adds three components:

1. **SDK Phrase Vocabulary Export** (`packages/sdks/oak-curriculum-sdk/src/mcp/synonym-export.ts`):
   - New `buildPhraseVocabulary()` function extracts multi-word terms (containing spaces) from synonym data
   - Returns `ReadonlySet<string>` for efficient lookup

2. **Phrase Detection** (`apps/oak-open-curriculum-semantic-search/src/lib/query-processing/detect-curriculum-phrases.ts`):
   - Pure function `detectCurriculumPhrases(query: string): readonly string[]`
   - Uses greedy matching (longest phrases first) with word boundary checking
   - Returns detected phrases in order of appearance

3. **Phrase Boosters** (`apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-helpers.ts`):
   - New `createPhraseBoosters()` function creates `match_phrase` queries for detected phrases
   - BM25 retrievers now accept optional `phrases` parameter
   - When phrases detected, query structure becomes `bool.must[multi_match] + bool.should[match_phrase...]`

Query preprocessing pipeline:

```text
User Query
    │
    ▼
removeNoisePhrases()          [EXISTING - B.4]
    │
    ▼
detectCurriculumPhrases()     [NEW - B.5]
    │
    ▼
Build RRF Retrievers with     [MODIFIED - B.5]
phrase boost sub-queries
    │
    ▼
ES Search
```

## Rationale

| Alternative                 | Why Rejected                                       |
| --------------------------- | -------------------------------------------------- |
| Shingle-based analyzers     | Requires index recreation, complex configuration   |
| Query-time expansion        | Adds latency, complex scoring                      |
| Pre-tokenized synonym rules | ES synonym graph API limitation                    |
| **Phrase boost queries**    | **Simple, non-invasive, follows existing pattern** |

The chosen approach mirrors the existing query structure patterns in `rrf-query-builders.ts`, keeping changes minimal and architectural consistency high.

Key benefits:

- **Non-invasive**: No index recreation required
- **Consistent**: Mirrors existing bool/should boost pattern
- **Performant**: Detection is O(n × m) where n = query length, m = vocabulary size (precompiled set)
- **Schema-first**: Phrase vocabulary flows from SDK (single source of truth)
- **TDD-compliant**: Unit tests written first for `detectCurriculumPhrases()`

## Consequences

### Positive

- Phrase synonyms now functional (was 0.000 MRR, now boosted)
- Follows existing architectural patterns
- No index changes required
- SDK remains single source of truth for vocabulary

### Negative

- Slight query complexity increase (additional `bool.should` clauses when phrases detected)
- Vocabulary must be maintained in SDK synonyms to take effect
- Phrase detection runs on every query (but is fast due to precompiled Set)

## Implementation

Files changed:

- `packages/sdks/oak-curriculum-sdk/src/mcp/synonym-export.ts` — Added `buildPhraseVocabulary()`
- `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts` — Exported new function
- `apps/oak-open-curriculum-semantic-search/src/lib/query-processing/detect-curriculum-phrases.ts` — NEW
- `apps/oak-open-curriculum-semantic-search/src/lib/query-processing/detect-curriculum-phrases.unit.test.ts` — NEW
- `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-helpers.ts` — Added `createPhraseBoosters()`, modified retrievers
- `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-builders.ts` — Integrated phrase detection

## Related ADRs

- [ADR-063: SDK Domain Synonyms Source of Truth](063-sdk-domain-synonyms-source-of-truth.md) — Establishes SDK as vocabulary source
- [ADR-082: Fundamentals-First Search Strategy](082-fundamentals-first-search-strategy.md) — This is Phase B.5 of Tier 1
