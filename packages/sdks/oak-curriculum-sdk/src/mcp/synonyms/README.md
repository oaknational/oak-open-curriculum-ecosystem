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
├── # Subject-specific synonyms (alphabetical, complete coverage)
├── art.ts                  ← Art concept synonyms [NEW 2026-01-16]
├── citizenship.ts          ← Citizenship synonyms (medium sensitivity) [NEW 2026-01-16]
├── computing.ts            ← Computing concept synonyms
├── cooking-nutrition.ts    ← Cooking & nutrition synonyms
├── design-technology.ts    ← Design Technology synonyms [NEW 2026-01-16]
├── english.ts              ← English/literacy synonyms
├── french.ts               ← French language learning synonyms [NEW 2026-01-16]
├── geography.ts            ← Geography theme synonyms
├── german.ts               ← German language learning synonyms [NEW 2026-01-16]
├── history.ts              ← History topic synonyms
├── maths.ts                ← Maths concept synonyms (comprehensive KS4 coverage)
├── music.ts                ← Music concept synonyms
├── physical-education.ts   ← Physical Education synonyms [NEW 2026-01-16]
├── religious-education.ts  ← Religious Education synonyms (HIGH sensitivity) [NEW 2026-01-16]
├── rshe-pshe.ts            ← RSHE/PSHE synonyms (HIGH sensitivity, placeholder) [NEW 2026-01-16]
├── science.ts              ← Science concept synonyms
├── spanish.ts              ← Spanish language learning synonyms [NEW 2026-01-16]
│
├── # Structural/generic synonyms
├── education.ts            ← General educational terminology
├── exam-boards.ts          ← Exam board synonyms
├── key-stages.ts           ← Key stage synonyms (ks1 ↔ key stage 1)
├── numbers.ts              ← Number word synonyms (one ↔ 1)
├── subjects.ts             ← Subject name synonyms (maths ↔ mathematics)
└── index.ts                ← Barrel export → synonymsData
```

## Single Source of Truth Principle

**Subject name synonyms** (e.g., `physical-education` → `pe`, `p.e.`) are defined ONLY in `subjects.ts`.

**Concept synonyms** (e.g., `athletics` → `track and field`) are defined in subject-specific files (e.g., `physical-education.ts`).

This separation prevents duplicate definitions that can have conflicting values. Each subject concept file has a comment:

```typescript
// Subject name synonyms are defined in subjects.ts (single source of truth)
```

**Important**: Do NOT define subject names (like `french`, `german`, `spanish`, `physical-education`) in concept files. These belong exclusively in `subjects.ts`.

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
import { buildElasticsearchSynonyms } from '@oaknational/curriculum-sdk/public/mcp-tools';

const synonymSet = buildElasticsearchSynonyms();
// Returns: { synonyms_set: [{ id: 'subjects_maths', synonyms: 'maths, mathematics, math' }, ...] }
```

Deploy to Elasticsearch with:

```bash
cd apps/oak-search-cli
pnpm es:setup   # Creates indexes and deploys oak-syns synonym set
```

### 3. Search App (Phrase Detection)

The SDK also exports phrase vocabulary for query preprocessing:

```typescript
import { buildPhraseVocabulary } from '@oaknational/curriculum-sdk/public/mcp-tools';

const phrases = buildPhraseVocabulary();
// Returns Set<string> of multi-word curriculum terms
// Used for phrase boosting in hybrid search
```

## Adding New Synonyms

### 1. Identify Vocabulary Gaps

Run hard query tests and analyse failures:

```bash
cd apps/oak-search-cli
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

# Deploy synonyms to Elasticsearch (two options):

# Option A: Full setup (creates indexes + synonyms)
cd apps/oak-search-cli
pnpm es:setup

# Option B: Update synonyms ONLY (no reindexing required - RECOMMENDED)
cd apps/oak-search-cli
pnpm es:setup synonyms

# Run test — should now pass
pnpm vitest run -c vitest.smoke.config.ts synonym-coverage
```

### Live Synonym Updates (No Reindexing)

The `synonyms` command uses the **Elasticsearch Synonyms API** to update synonyms
without touching indexes or requiring reindexing. This is the preferred method for
production environments:

```bash
cd apps/oak-search-cli
pnpm es:setup synonyms
```

**How it works:**

1. Generates synonym set from SDK ontology (`buildElasticsearchSynonyms()`)
2. Calls `PUT /_synonyms/oak-syns` to update the synonym set
3. Elasticsearch automatically reloads search analyzers

**Available CLI commands:**

| Command    | Description                               | Reindex? |
| ---------- | ----------------------------------------- | -------- |
| `setup`    | Create synonyms + indexes (initial setup) | N/A      |
| `reset`    | Delete and recreate all indexes           | Yes      |
| `synonyms` | Update synonyms only (live reload)        | **No**   |
| `status`   | Show cluster info and index counts        | No       |

**API Reference:**

- [Elasticsearch Synonyms APIs](https://www.elastic.co/guide/en/elasticsearch/reference/current/synonyms-apis.html)
- Uses `PUT /_synonyms/{id}` to create or update a synonyms set
- Analyzers referencing the set are automatically reloaded

### 4. Document Impact

Record before/after MRR in the experiment log.

## Current Coverage

**Complete coverage achieved 2026-01-16**: All 17 subjects now have domain-specific synonym files.

| Category                           | Count | Example                                          |
| ---------------------------------- | ----- | ------------------------------------------------ |
| **Subject-specific (17 subjects)** |       |                                                  |
| `artConcepts`                      | ~45   | watercolour ↔ watercolor, collage ↔ mixed media  |
| `citizenshipConcepts`              | ~35   | democracy ↔ democratic system                    |
| `computingConcepts`                | ~15   | raster ↔ bitmap, algorithm ↔ set of instructions |
| `cookingNutritionConcepts`         | ~25   | nutrition ↔ nutrients, eatwell guide             |
| `designTechnologyConcepts`         | ~40   | prototype ↔ model, mechanism ↔ moving parts      |
| `englishConcepts`                  | ~10   | punctuation ↔ grammar marks                      |
| `frenchConcepts`                   | ~25   | verb ↔ action word, present tense                |
| `geographyThemes`                  | ~10   | climate change ↔ global warming                  |
| `germanConcepts`                   | ~25   | nominative ↔ accusative (cases)                  |
| `historyTopics`                    | ~10   | ww1 ↔ world war 1                                |
| `mathsConcepts`                    | ~40   | trigonometry ↔ sohcahtoa                         |
| `musicConcepts`                    | ~15   | semibreve ↔ whole note                           |
| `physicalEducationConcepts`        | ~45   | invasion games ↔ team games, stamina ↔ endurance |
| `religiousEducationConcepts`       | ~70   | church ↔ chapel, mosque ↔ masjid (distinct)      |
| `rshePsheConcepts`                 | ~25   | mental health ↔ emotional wellbeing              |
| `scienceConcepts`                  | ~15   | photosynthesis ↔ plant energy process            |
| `spanishConcepts`                  | ~20   | ser/estar distinction, preterite tenses          |
| **Structural/generic**             |       |                                                  |
| `subjects`                         | ~13   | maths ↔ mathematics                              |
| `keyStages`                        | ~4    | ks1 ↔ key stage 1                                |
| `examBoards`                       | ~5    | aqa ↔ assessment and qualifications alliance     |
| `numbers`                          | ~10   | one ↔ 1                                          |
| `generic`                          | ~5    | lesson ↔ teaching session                        |
| `educationalAcronyms`              | ~10   | sen ↔ special educational needs                  |

**Total: ~500+ synonym entries across 23 categories.**

### Sensitivity Notes

Some subject areas contain content requiring careful handling:

- **HIGH SENSITIVITY**: `religiousEducationConcepts`, `rshePsheConcepts`
- **MEDIUM SENSITIVITY**: `citizenshipConcepts`

These files include sensitivity notices and have undergone additional review for:

- Accurate representation of all groups
- Avoidance of conflating distinct concepts
- Respectful, inclusive terminology
- Theological/cultural precision where appropriate

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

- [search-operations-governance.md](../../../../../../.agent/research/elasticsearch/methods/search-operations-governance.md) — Synonym lifecycle, value scoring
- [curriculum-schema-field-analysis.md](../../../../../../.agent/research/elasticsearch/system/curriculum-schema-field-analysis.md) — Glossary and extracted vocabulary context

See:

- [02b-vocabulary-mining.md](../../../../../../.agent/plans/semantic-search/part-1-search-excellence/02b-vocabulary-mining.md) — Full plan
- [ADR-063](../../../../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) — Integration decisions

## Related Documents

- [ADR-063: SDK Domain Synonyms Source of Truth](../../../../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md)
- [synonym-export.ts](../synonym-export.ts) — Export utilities
- [ontology-data.ts](../ontology-data.ts) — Consumes synonymsData
- [SYNONYMS.md](../../../../../../apps/oak-search-cli/docs/SYNONYMS.md) — Search app synonym documentation
