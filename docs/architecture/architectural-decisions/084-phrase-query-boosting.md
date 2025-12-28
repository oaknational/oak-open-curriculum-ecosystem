# ADR-084: Phrase Query Boosting for Multi-Word Curriculum Terms

## Status

Accepted

## Context

The search system uses **two complementary mechanisms** for vocabulary support, both drawing from the same SDK synonym data:

1. **ES Synonym Expansion** — Single-word tokens are expanded at query time via the `synonym_graph` filter
2. **Phrase Detection + Boosting** — Multi-word terms are detected and boosted via `match_phrase` queries

This ADR documents the phrase boosting mechanism, which is architecturally necessary because ES synonym filters apply after tokenization. Multi-word synonyms like "straight line" are tokenized to `["straight", "line"]` before the synonym filter runs, so phrase-level synonym rules cannot match.

Diagnostic analysis (18 queries) revealed that approximately 40% of SDK synonyms are multi-word phrases:

| Pattern             | Mechanism                   | Purpose                      |
| ------------------- | --------------------------- | ---------------------------- |
| Single-word synonym | ES synonym expansion        | Query token expansion        |
| Multi-word synonym  | Phrase detection + boosting | Exact phrase relevance boost |

Examples of multi-word curriculum terms requiring phrase boosting:

- "straight line" (boosts linear-graphs lessons)
- "completing the square" (boosts quadratics lessons)
- "circle rules" (boosts circle-theorems lessons)

## Decision

Add phrase detection at query time and boost documents with `match_phrase` queries for detected curriculum phrases. This is a **complementary mechanism** to ES synonym expansion, not a replacement. The SDK remains single source of truth for all vocabulary via the `buildPhraseVocabulary()` function.

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

### Two Complementary Mechanisms Architecture

The SDK `synonymsData` remains a **single source of truth** for all vocabulary. At export time, two different consumers extract what they need:

```text
synonymsData (SDK)
    │
    ├── buildElasticsearchSynonyms() → All synonyms → ES synonym set
    │                                   (single-word tokens will expand)
    │
    └── buildPhraseVocabulary() → Multi-word terms only → Phrase detection
                                   (for match_phrase boosting)
```

This is not a workaround — it's a principled separation of concerns:

- **ES synonym expansion**: Token-level term equivalence (query expansion)
- **Phrase boosting**: Exact phrase relevance boost (ranking improvement)

Both mechanisms serve different purposes and have different precision characteristics:

| Mechanism            | Precision Risk                       | When Used            |
| -------------------- | ------------------------------------ | -------------------- |
| ES synonym expansion | Higher (expands all matching tokens) | Single-word synonyms |
| Phrase boosting      | Lower (only exact phrase matches)    | Multi-word phrases   |

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
