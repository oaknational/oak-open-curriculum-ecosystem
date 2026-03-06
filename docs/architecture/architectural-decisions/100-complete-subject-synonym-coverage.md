# ADR-100: Complete Subject Synonym Coverage

**Status**: Implemented  
**Date**: 2026-01-16  
**Authors**: AI Agent + Human Review

> **Implementation Note**: Complete coverage achieved 2026-01-16. All 17 subjects now have
> domain-specific synonym files. See `packages/sdks/oak-sdk-codegen/src/synonyms/README.md`
> for details.

## Context

The semantic search system uses Elasticsearch synonyms to expand query terms, improving recall for curriculum-specific vocabulary. Synonyms are currently maintained in:

```plaintext
packages/sdks/oak-sdk-codegen/src/synonyms/
```

### Current State (Post-Implementation)

All **17 subjects** now have domain-specific synonym files:

| Subject             | Has Synonyms | Notes                                            |
| ------------------- | ------------ | ------------------------------------------------ |
| art                 | ✅           | Added 2026-01-16                                 |
| citizenship         | ✅           | Added 2026-01-16 (medium sensitivity)            |
| computing           | ✅           | —                                                |
| cooking-nutrition   | ✅           | —                                                |
| design-technology   | ✅           | Added 2026-01-16                                 |
| english             | ✅           | —                                                |
| french              | ✅           | Added 2026-01-16                                 |
| geography           | ✅           | —                                                |
| german              | ✅           | Added 2026-01-16                                 |
| history             | ✅           | —                                                |
| maths               | ✅           | —                                                |
| music               | ✅           | —                                                |
| physical-education  | ✅           | Added 2026-01-16                                 |
| religious-education | ✅           | Added 2026-01-16 (HIGH sensitivity)              |
| rshe-pshe           | ✅           | Added 2026-01-16 (HIGH sensitivity, placeholder) |
| science             | ✅           | —                                                |
| spanish             | ✅           | Added 2026-01-16                                 |

### Problems Identified

1. **Incomplete coverage**: 8 of 16 subjects lack domain-specific synonyms
2. **DRY violation**: Adding a synonym file requires updates in 5+ places
3. **Confusing exports**: Individual synonym modules are re-exported alongside the collection
4. **No vocabulary mining**: Existing synonyms were manually curated, not mined from bulk data

## Decision

### 1. Complete Subject Coverage

Every subject with bulk data MUST have a corresponding synonym file. This is a requirement, not an optimisation.

### 2. Single Export Path

Remove individual re-exports from `synonyms/index.ts`. Only export the `synonymsData` collection. Consumers should access synonyms via `synonymsData.subjectConcepts`, not via individual imports.

**Before:**

```typescript
export { computingSynonyms } from './computing.js';  // ❌ Remove
export const synonymsData = { ... };  // ✅ Keep
```

**After:**

```typescript
export const synonymsData = { ... };  // ✅ Only this
export type SynonymsData = typeof synonymsData;
```

### 3. Iterate Dynamically in Export Functions

The `synonym-export.ts` functions (`buildElasticsearchSynonyms`, `buildSynonymLookup`, `buildPhraseVocabulary`) should iterate over `synonymsData` keys dynamically, not list each category explicitly.

**Before:**

```typescript
const entries = [
  ...processGroup('subjects', synonymsData.subjects),
  ...processGroup('keyStages', synonymsData.keyStages),
  // ... 11 more explicit calls (DRY violation)
];
```

**After:**

```typescript
const entries: ElasticsearchSynonymEntry[] = [];
for (const [categoryName, group] of typeSafeEntries(synonymsData)) {
  entries.push(...processGroup(categoryName, group));
}
```

### 4. Mine Vocabulary from Bulk Data

Each subject's synonyms should be mined from bulk data to capture:

- Lesson titles and keywords
- Unit titles
- Key learning points
- Common curriculum terminology

The mining process should identify:

- Alternative spellings (UK/US)
- Abbreviations and acronyms
- Multi-word phrases that need phrase matching
- Domain-specific vocabulary

## Consequences

### Positive

- **Complete coverage**: All subjects benefit from synonym expansion
- **Maintainability**: Adding new synonym categories requires only 2 changes (file + index.ts)
- **Clarity**: Single export path reduces confusion
- **Quality**: Vocabulary mined from actual curriculum data, not guessed

### Negative

- **Upfront work**: Creating 8 new synonym files requires bulk data analysis
- **MFL complexity**: Modern Foreign Language subjects may have limited synonym utility

### Neutral

- **No breaking changes**: Internal refactoring only; external API unchanged

## Implementation

See: `.agent/plans/semantic-search/archive/completed/synonym-complete-coverage.md`

## Related

- [ADR-063: SDK Domain Synonyms Source of Truth](063-sdk-domain-synonyms-source-of-truth.md)
- [SYNONYMS.md](../../../apps/oak-search-cli/docs/SYNONYMS.md)
