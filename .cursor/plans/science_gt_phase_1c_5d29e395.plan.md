---
name: Science GT Phase 1C
overview: "Execute Phase 1C (Comparison) for Science ground truths: three-way comparison for existing 8 queries, create files for 16 new queries from COMMIT rankings, update index files, and run benchmark validation."
todos:
  - id: foundation-reread
    content: Re-read foundation documents (rules.md, testing-strategy.md, schema-first-execution.md)
    status: completed
  - id: primary-track-a
    content: "PRIMARY Track A: Three-way comparison for 4 existing queries (PT-1, NE-1, II-1, CT-1)"
    status: completed
  - id: primary-track-b
    content: "PRIMARY Track B: Create 8 new query/expected files (PT-2, PT-3, NE-2, NE-3, II-2, II-3, CT-2, CT-3)"
    status: completed
  - id: primary-index
    content: "PRIMARY: Update index.ts to wire in all 12 queries"
    status: completed
  - id: primary-benchmark
    content: "PRIMARY: Run full benchmark, record aggregate metrics"
    status: completed
  - id: secondary-track-a
    content: "SECONDARY Track A: Three-way comparison for 4 existing queries (PT-1, NE-1, II-1, CT-1)"
    status: completed
  - id: secondary-track-b
    content: "SECONDARY Track B: Create 8 new query/expected files (PT-2, PT-3, NE-2, NE-3, II-2, II-3, CT-2, CT-3)"
    status: completed
  - id: secondary-index
    content: "SECONDARY: Update index.ts to wire in all 12 queries"
    status: completed
  - id: secondary-benchmark
    content: "SECONDARY: Run full benchmark, record aggregate metrics"
    status: completed
  - id: validation
    content: "Run all quality gates: type-check, ground-truth:validate, benchmark"
    status: completed
  - id: documentation
    content: Update checklist, current-state, and prompt with Science completion
    status: completed
---

# Science Ground Truth: Phase 1C — Comparison

**Scope**: 24 queries (12 primary + 12 secondary) across 4 categories with 3 queries each

**Foundation Commitment**: Re-read [rules.md](.agent/directives-and-memory/rules.md), [testing-strategy.md](.agent/directives-and-memory/testing-strategy.md), and [schema-first-execution.md](.agent/directives-and-memory/schema-first-execution.md) at session start and before each checkpoint.

---

## Context

**Phase 1B Complete**: 24 COMMIT tables exist with independent rankings (no `.expected.ts` files read, no benchmark run).

**Current File Structure**: Only 8 query files exist (Q1 for each category). Q2 and Q3 files must be created.

**Key Finding from Phase 1B**: "electromagnet" vs "electromagnetic waves" are different concepts — search could confuse them.

---

## Structure

The work divides into two tracks:

**Track A (8 queries)**: Existing Q1 files — full three-way comparison (COMMIT vs SEARCH vs EXPECTED)

**Track B (16 queries)**: New Q2/Q3 files — create from COMMIT rankings, two-way comparison (COMMIT vs SEARCH)

---

## Phase 1C Protocol Per Query

### For Track A (Existing Queries)

1. Run `pnpm benchmark -s science -p PHASE -c CATEGORY --review`
2. Create three-way comparison table:

   - Column 1: YOUR COMMIT ranking (from Phase 1B)
   - Column 2: SEARCH results (from benchmark)
   - Column 3: EXPECTED slugs (from existing `.expected.ts`)

3. Answer: Which source has the BEST slugs?
4. Record ALL 4 metrics: MRR, NDCG@10, P@3, R@10
5. Update `.expected.ts` if COMMIT or SEARCH is better than EXPECTED

### For Track B (New Queries)

1. Create `.query.ts` file following maths pattern:

```typescript
// Example: precise-topic-2.query.ts
import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_PRIMARY_PRECISE_TOPIC_2_QUERY: GroundTruthQueryDefinition = {
  query: 'electrical circuits conductors insulators',
  category: 'precise-topic',
  description: 'Tests retrieval of electricity content using curriculum terminology',
  expectedFile: './precise-topic-2.expected.ts',
} as const;
```

2. Create `.expected.ts` file from COMMIT rankings:

```typescript
// Example: precise-topic-2.expected.ts
import type { ExpectedRelevance } from '../../types';

export const SCIENCE_PRIMARY_PRECISE_TOPIC_2_EXPECTED: ExpectedRelevance = {
  'what-materials-are-electrical-conductors-and-insulators': 3,
  'electrical-conductors-and-insulators': 3,
  'components-in-an-electrical-circuit': 2,
  // ... from COMMIT table
} as const;
```

3. Run benchmark to get metrics
4. Create two-way comparison (COMMIT vs SEARCH)
5. Adjust expected slugs if SEARCH reveals better candidates

---

## Execution Order

### Block 1: PRIMARY Phase 1C

**Step 1.1**: Track A — Existing PRIMARY queries (4 queries)

| Query | File | COMMIT Rank 1 |

|-------|------|---------------|

| "evolution Darwin finches Year 6" | precise-topic | charles-darwin-and-finches |

| "why do birds have different shaped beaks" | natural-expression | adaptations-of-birds-beaks |

| "evoloution and adaptashun" | imprecise-input | charles-darwin-and-adaptations |

| "habitats and food chains" | cross-topic | what-is-a-simple-food-chain |

**Step 1.2**: Track B — New PRIMARY queries (8 queries)

Create files for:

- `precise-topic-2` ("electrical circuits conductors insulators")
- `precise-topic-3` ("states of matter solids liquids gases")
- `natural-expression-2` ("why do things fall down")
- `natural-expression-3` ("what makes ice turn into water")
- `imprecise-input-2` ("electrisity and magnits")
- `imprecise-input-3` ("evapration and condensashun")
- `cross-topic-2` ("light and plants growing")
- `cross-topic-3` ("friction and different materials")

**Step 1.3**: Update [science/primary/index.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/science/primary/index.ts)

Follow maths pattern — import all 12 query/expected pairs, add to `SCIENCE_PRIMARY_ALL_QUERIES`.

**Step 1.4**: Run PRIMARY benchmark

```bash
pnpm benchmark --subject science --phase primary --verbose
```

Record aggregate metrics.

---

### Block 2: SECONDARY Phase 1C

**Step 2.1**: Track A — Existing SECONDARY queries (4 queries)

| Query | File | COMMIT Rank 1 |

|-------|------|---------------|

| "cell structure and function" | precise-topic | animal-cell-structures-and-their-functions |

| "how do plants make their own food" | natural-expression | photosynthesis |

| "resperation in humans" | imprecise-input | aerobic-cellular-respiration-in-humans-and-other-organisms |

| "energy and chemical reactions" | cross-topic | energy-changes-in-reactions |

**Step 2.2**: Track B — New SECONDARY queries (8 queries)

Create files for:

- `precise-topic-2` ("ionic and covalent bonding")
- `precise-topic-3` ("electromagnetic spectrum waves")
- `natural-expression-2` ("why does metal go rusty")
- `natural-expression-3` ("what makes things hot or cold")
- `imprecise-input-2` ("photosythesis in plants")
- `imprecise-input-3` ("electromagnatic waves and spectrum")
- `cross-topic-2` ("cells and genetics inheritance")
- `cross-topic-3` ("electricity and magnetism motors")

**Step 2.3**: Update [science/secondary/index.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/science/secondary/index.ts)

**Step 2.4**: Run SECONDARY benchmark

```bash
pnpm benchmark --subject science --phase secondary --verbose
```

---

### Block 3: Validation

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject science --phase primary --verbose
pnpm benchmark --subject science --phase secondary --verbose
```

All gates must pass.

---

## COMMIT Rankings Reference (from Phase 1B)

### PRIMARY

| Cat | Q | Query | Rank 1 | Rank 2 | Rank 3 |

|-----|---|-------|--------|--------|--------|

| PT | 1 | "evolution Darwin finches Year 6" | charles-darwin-and-finches | charles-darwin-and-adaptations | evidence-for-evolution |

| PT | 2 | "electrical circuits conductors insulators" | what-materials-are-electrical-conductors-and-insulators | electrical-conductors-and-insulators | components-in-an-electrical-circuit |

| PT | 3 | "states of matter solids liquids gases" | states-of-matter | solids-liquids-and-gases | properties-of-solids-liquids-and-gases |

| NE | 1 | "why do birds have different shaped beaks" | adaptations-of-birds-beaks | adaptations-of-birds-legs-and-feet | evolution-by-natural-selection |

| NE | 2 | "why do things fall down" | isaac-newton-and-gravity | gravity-and-its-effects | what-is-gravity |

| NE | 3 | "what makes ice turn into water" | changes-of-state-melting | changes-of-state-freezing | reversible-and-irreversible-changes |

| II | 1 | "evoloution and adaptashun" | charles-darwin-and-adaptations | evolution-by-natural-selection | adaptations-of-birds-beaks |

| II | 2 | "electrisity and magnits" | generating-and-transporting-electricity-non-statutory | electromagnets | series-circuits |

| II | 3 | "evapration and condensashun" | evaporation-and-condensation | evaporation | the-water-cycle |

| CT | 1 | "habitats and food chains" | what-is-a-simple-food-chain | predators-and-prey | food-chains |

| CT | 2 | "light and plants growing" | what-is-photosynthesis | what-do-plants-need-to-survive | how-do-plants-make-food |

| CT | 3 | "friction and different materials" | how-do-different-surfaces-affect-the-motion-of-an-object | forces-including-friction | reducing-friction |

### SECONDARY

| Cat | Q | Query | Rank 1 | Rank 2 | Rank 3 |

|-----|---|-------|--------|--------|--------|

| PT | 1 | "cell structure and function" | animal-cell-structures-and-their-functions | plant-cell-structures-and-their-functions | comparing-animal-and-plant-cells |

| PT | 2 | "ionic and covalent bonding" | forming-ions-for-ionic-bonding | ionic-bonding | covalent-bonding |

| PT | 3 | "electromagnetic spectrum waves" | the-spectrum-of-electromagnetic-radiation | ionising-electromagnetic-radiation | non-ionising-electromagnetic-radiations |

| NE | 1 | "how do plants make their own food" | photosynthesis | photosynthesis-an-endothermic-process | producers-photosynthesis-and-consumers |

| NE | 2 | "why does metal go rusty" | chemical-reactions-oxidation | oxidation-of-metals | reactions-of-metals-and-oxygen |

| NE | 3 | "what makes things hot or cold" | thermal-conduction-and-insulation | heating-different-substances | heating-and-cooling-curves |

| II | 1 | "resperation in humans" | aerobic-cellular-respiration-in-humans-and-other-organisms | anaerobic-cellular-respiration-in-humans | aerobic-cellular-respiration |

| II | 2 | "photosythesis in plants" | photosynthesis | photosynthesis-an-endothermic-process | producers-photosynthesis-and-consumers |

| II | 3 | "electromagnatic waves and spectrum" | the-spectrum-of-electromagnetic-radiation | ionising-electromagnetic-radiation | non-ionising-electromagnetic-radiations |

| CT | 1 | "energy and chemical reactions" | energy-changes-in-reactions | exothermic-and-endothermic-chemical-reactions | breaking-and-making-bonds |

| CT | 2 | "cells and genetics inheritance" | genetic-material-and-dna | dna-chromosomes-genes-and-the-genome | reproduction-and-inheritance |

| CT | 3 | "electricity and magnetism motors" | an-electric-motor | applications-of-electromagnets | an-electromagnet |

---

## Key Hazard: Electromagnet vs Electromagnetic Waves

**Query II-3** ("electromagnatic waves and spectrum") has a false positive risk:

- `an-electromagnet` = magnet made with electricity
- `electromagnetic waves` = oscillations in EM fields
- These are DIFFERENT concepts

Correct slugs are in "Electromagnetic waves" unit, NOT "Electromagnetism" unit.

---

## Documentation Updates

After completion:

1. Update [ground-truth-review-checklist.md](.agent/plans/semantic-search/active/ground-truth-review-checklist.md) — mark science complete
2. Update [current-state.md](.agent/plans/semantic-search/current-state.md) — add metrics
3. Update [semantic-search.prompt.md](.agent/prompts/semantic-search/semantic-search.prompt.md) — change next session to Spanish

---

## Anti-Patterns to Avoid

1. **DO NOT skip three-way comparison** — even if COMMIT matches SEARCH, document it
2. **DO NOT assume existing EXPECTED is correct** — it may have been placeholder
3. **DO NOT conflate electromagnet with electromagnetic** — different concepts
4. **DO NOT rush** — 24 queries deserve thorough attention
5. **DO NOT skip foundation document re-reads** — they prevent drift

---

## Success Criteria

- All 24 queries have comparison tables documented
- All 24 queries have all 4 metrics recorded
- All 24 `.query.ts` and `.expected.ts` files exist
- Both `index.ts` files updated to wire in all 12 queries
- All quality gates pass (type-check, validate, benchmark)
- Aggregate metrics recorded for both phases
- Checklist and current-state updated
