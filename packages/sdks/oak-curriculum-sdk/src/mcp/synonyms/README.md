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
├── subjects.ts       ← Subject name synonyms (maths ↔ mathematics)
├── key-stages.ts     ← Key stage synonyms (ks1 ↔ key stage 1)
├── exam-boards.ts    ← Exam board synonyms
├── numbers.ts        ← Number word synonyms (one ↔ 1)
├── education.ts      ← General educational terminology
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

## Future Direction: Vocab-Gen Integration

**Status**: 🔄 In Progress (2025-12-24) — Extractors complete, generators not started

The `pnpm vocab-gen` pipeline will mine synonyms from:

- **Bulk download data**: 13,349 keywords with definitions
- **Definition patterns**: "also known as", parenthetical alternatives
- **Cross-subject terms**: Vocabulary appearing in multiple subjects

### Proposed Architecture

```text
synonyms/
├── maths.ts              ← CURATED (~40 entries, never modified by vocab-gen)
├── science.ts            ← CURATED (~15 entries)
├── subjects.ts           ← CURATED (~13 entries)
├── ...                   ← Other curated files
└── generated/            ← MINED (regenerated by vocab-gen)
    ├── definition-synonyms.ts    ← From "also known as" patterns
    ├── cross-subject-terms.ts    ← Terms in 2+ subjects
    └── index.ts
```

### Relationship: Curated vs Mined

| Aspect           | Curated                         | Mined                                 |
| ---------------- | ------------------------------- | ------------------------------------- |
| **Source**       | Human review of search failures | Automated extraction from definitions |
| **Priority**     | HIGH — always wins on conflict  | LOWER — supplements gaps              |
| **Quality**      | Verified through search testing | Confidence-scored                     |
| **Modification** | Manual edits only               | Regenerated by vocab-gen              |

### Open Questions (see ADR-063)

1. **Conflict resolution**: Log conflicts for review?
2. **Confidence scoring**: How to score extraction quality?
3. **Promotion workflow**: How do mined synonyms become curated?
4. **Size limits**: ES performance with 10x synonyms

### Target

- Current: ~160 curated entries
- Goal: 1,630+ total (curated + mined)

See:

- [02b-vocabulary-mining.md](../../../../../../.agent/plans/semantic-search/part-1-search-excellence/02b-vocabulary-mining.md) — Full plan
- [ADR-063](../../../../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) — Integration decisions

## Related Documents

- [ADR-063: SDK Domain Synonyms Source of Truth](../../../../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md)
- [synonym-export.ts](../synonym-export.ts) — Export utilities
- [ontology-data.ts](../ontology-data.ts) — Consumes synonymsData
- [SYNONYMS.md](../../../../../../apps/oak-open-curriculum-semantic-search/docs/SYNONYMS.md) — Search app synonym documentation
