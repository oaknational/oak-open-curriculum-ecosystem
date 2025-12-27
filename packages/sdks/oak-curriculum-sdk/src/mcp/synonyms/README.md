# Curriculum Domain Synonyms

## Overview

This module is the **single source of truth** for curriculum domain synonyms used across:

- **MCP Tools**: Natural language understanding for AI agent queries
- **Elasticsearch**: Query expansion via the `oak-syns` synonym set
- **Search App**: Display-name mapping and autocomplete

All synonym definitions live here and flow to consumers via SDK exports.

## Architecture

```text
synonyms/
├── maths.ts          ← Maths concept synonyms (comprehensive KS4 coverage)
├── science.ts        ← Science concept synonyms
├── english.ts        ← English/literacy synonyms
├── history.ts        ← History topic synonyms
├── geography.ts      ← Geography theme synonyms
├── computing.ts      ← Computing concept synonyms [NEW 2025-12-26]
├── music.ts          ← Music concept synonyms [NEW 2025-12-26]
├── subjects.ts       ← Subject name synonyms (maths ↔ mathematics)
├── key-stages.ts     ← Key stage synonyms (ks1 ↔ key stage 1)
├── exam-boards.ts    ← Exam board synonyms
├── numbers.ts        ← Number word synonyms (one ↔ 1)
├── education.ts      ← General educational terminology + PE/DT terms
└── index.ts          ← Barrel export → synonymsData
```

## Synonym Structure

Synonyms map a **canonical term** to an array of **alternative terms**:

```typescript
export const mathsSynonyms = {
  // Canonical term → alternative terms
  'linear-equations': ['solving for x', 'solve for x', 'find x', 'find the unknown'],

  trigonometry: ['trig', 'sohcahtoa', 'sin cos tan'],
} as const;
```

The canonical term is typically the curriculum terminology; alternatives include:

- Teacher colloquialisms ("solving for x")
- Student language ("sohcahtoa")
- UK/US variants (factorising ↔ factoring)
- Abbreviations (trig ↔ trigonometry)

## How Synonyms Are Consumed

### 1. Ontology Data (AI Agents)

The `ontology-data.ts` module imports `synonymsData` and includes it in the ontology
returned to AI agents via the `get-ontology` MCP tool:

```typescript
// ontology-data.ts
import { synonymsData } from './synonyms/index.js';

export const ontologyData = {
  // ...
  synonyms: {
    description: 'Alternative terms users might use...',
    ...synonymsData,
  },
} as const;
```

### 2. Elasticsearch (Search)

The `synonym-export.ts` module provides utilities to transform synonyms into
Elasticsearch format:

```typescript
import { buildElasticsearchSynonyms } from '@oaknational/oak-curriculum-sdk/public/mcp-tools';

const synonymSet = buildElasticsearchSynonyms();
// Returns: { synonyms_set: [{ id: 'subjects_maths', synonyms: 'maths, mathematics, math' }, ...] }
```

Deploy to Elasticsearch with:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup   # Creates indexes and deploys oak-syns synonym set
```

### 3. Search App (Phrase Detection)

The SDK also exports phrase vocabulary for query preprocessing:

```typescript
import { buildPhraseVocabulary } from '@oaknational/oak-curriculum-sdk/public/mcp-tools';

const phrases = buildPhraseVocabulary();
// Returns Set<string> of multi-word curriculum terms
// Used for phrase boosting in hybrid search
```

## Adding New Synonyms

### 1. Identify Vocabulary Gaps

Run hard query tests and analyse failures:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm vitest run -c vitest.smoke.config.ts hard-query-baseline
```

Look for queries where expected results are not in top positions.

### 2. Add Synonyms Using TDD

**RED**: Write a failing test first:

```typescript
// smoke-tests/synonym-coverage.smoke.test.ts
it('finds linear equations for "solving for x"', async () => {
  const results = await searchLessons('solving for x');
  expect(results.slice(0, 3).map((r) => r.lesson_slug)).toContain(
    'solving-simple-linear-equations',
  );
});
```

Run test — it MUST fail before synonyms exist.

**GREEN**: Add synonyms to the appropriate file:

```typescript
// maths.ts
export const mathsSynonyms = {
  'linear-equations': [
    'solving for x',
    // ... other alternatives
  ],
} as const;
```

### 3. Deploy and Verify

```bash
# From repo root
pnpm type-gen && pnpm build

# Deploy synonyms to Elasticsearch
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup

# Run test — should now pass
pnpm vitest run -c vitest.smoke.config.ts synonym-coverage
```

### 4. Document Impact

Record before/after MRR in the experiment log.

## Current Coverage

| Category              | Count | Example                                      |
| --------------------- | ----- | -------------------------------------------- |
| `subjects`            | ~13   | maths ↔ mathematics                          |
| `keyStages`           | ~4    | ks1 ↔ key stage 1                            |
| `mathsConcepts`       | ~40   | trigonometry ↔ sohcahtoa                     |
| `scienceConcepts`     | ~15   | photosynthesis ↔ plant energy process        |
| `englishConcepts`     | ~10   | punctuation ↔ grammar marks                  |
| `geographyThemes`     | ~10   | climate change ↔ global warming              |
| `historyTopics`       | ~10   | ww1 ↔ world war 1                            |
| `examBoards`          | ~5    | aqa ↔ assessment and qualifications alliance |
| `generic`             | ~5    | lesson ↔ teaching session                    |
| `educationalAcronyms` | ~10   | sen ↔ special educational needs              |

Total: ~160+ synonym entries.

## Vocab-Gen Integration: Lessons Learned (2025-12-26)

**Status**: ✅ Experiment Complete — Key discovery: Regex alone is insufficient

### The Experiment

The `pnpm vocab-gen` pipeline mined 393 synonym candidates from bulk download keyword
definitions using regex patterns like "also known as" and parenthetical alternatives.

### What We Discovered

**Regex-based synonym mining is fundamentally limited:**

| Issue                          | Examples                                 | Count   |
| ------------------------------ | ---------------------------------------- | ------- |
| Language translations captured | `'tu': ['you']`, `'il': ['he']` (French) | ~300    |
| Phoneme patterns, not words    | `'[a]': ['banane']`                      | ~50     |
| Examples, not synonyms         | `'short vowel': ['cat', 'hot']`          | ~20     |
| **Genuinely useful synonyms**  | `'raster': ['bitmap']`                   | **~27** |

**93% of regex-mined synonyms were noise**. Only ~27 entries were usable.

### Why Regex Fails for Language Processing

| What We Need                                         | Regex Capability |
| ---------------------------------------------------- | ---------------- |
| Distinguish same-language synonyms from translations | Cannot           |
| Identify pedagogical examples vs definitions         | Cannot           |
| Understand phoneme notation vs vocabulary            | Cannot           |
| Detect figurative vs literal meaning                 | Cannot           |

**Key insight**: Regex patterns find TEXT PATTERNS, not SEMANTIC RELATIONSHIPS.
Synonym extraction is fundamentally a language understanding task, requiring an
LLM-powered agent to distinguish categories.

### What We Did

1. **LLM agent manually reviewed** all 393 candidates
2. **Extracted ~27 useful synonyms** into curated files:
   - `science.ts`: artificial-selection, pascal
   - `history.ts`: royalist/cavaliers, parliamentarian/roundheads, paleolithic/neolithic eras
   - `maths.ts`: upper/lower quartile
   - `music.ts`: semibreve/whole note, semiquaver/sixteenth note (NEW FILE)
   - `computing.ts`: raster/bitmap, colour-depth/bit-depth (NEW FILE)
   - `education.ts`: PE terms (sweating/perspiration), DT terms (PPE, BSI)
3. **Archived the rest**: `.agent/archive/vocab-gen/definition-synonyms-2025-12-26.ts.archived`

### Current Strategy

| Source                   | Process                                      | Quality             |
| ------------------------ | -------------------------------------------- | ------------------- |
| **Curated by humans**    | TDD: failing search → add synonym → verify   | High                |
| **Curated by LLM agent** | Review mined candidates, extract useful ones | High (LLM-verified) |
| **Regex-mined**          | ~~Generate automatically~~                   | ❌ Deprecated       |

**All synonyms now require human or LLM review before integration.**

### Future Direction

Instead of regex mining, consider:

1. **LLM-powered extraction**: Use language models to identify true synonyms
2. **Search log analysis**: Find actual user queries that fail, then add synonyms
3. **Teacher feedback**: Collect vocabulary gaps from real users

See:

- [elasticsearch-optimization-opportunities.md](../../../../../../.agent/research/semantic-search/elasticsearch-optimization-opportunities.md) — Full analysis
- [vocabulary-value-analysis.md](../../../../../../.agent/research/semantic-search/vocabulary-value-analysis.md) — Value scoring

See:

- [02b-vocabulary-mining.md](../../../../../../.agent/plans/semantic-search/part-1-search-excellence/02b-vocabulary-mining.md) — Full plan
- [ADR-063](../../../../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) — Integration decisions

## Related Documents

- [ADR-063: SDK Domain Synonyms Source of Truth](../../../../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md)
- [synonym-export.ts](../synonym-export.ts) — Export utilities
- [ontology-data.ts](../ontology-data.ts) — Consumes synonymsData
- [SYNONYMS.md](../../../../../../apps/oak-open-curriculum-semantic-search/docs/SYNONYMS.md) — Search app synonym documentation
