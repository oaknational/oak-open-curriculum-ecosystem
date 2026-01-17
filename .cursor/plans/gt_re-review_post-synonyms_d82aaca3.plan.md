---
name: GT Re-Review Post-Synonyms
overview: Full ground truth re-review for art (primary + secondary), citizenship (secondary), and cooking-nutrition (primary + secondary) after synonym coverage fix. 5 subject-phases, 20 ground truths, using ALL exploration methods with no assumptions.
todos:
  - id: foundation
    content: "Re-read foundation documents: rules.md, testing-strategy.md, schema-first-execution.md"
    status: completed
  - id: prereq
    content: "Prerequisites: Verify MCP server, ES access, synonym count (~580)"
    status: completed
  - id: art-primary
    content: "Phase 1: art/primary - Full review of 4 categories (214 lessons)"
    status: completed
  - id: art-secondary
    content: "Phase 2: art/secondary - Full review of 4 categories (197 lessons)"
    status: completed
  - id: citizenship-secondary
    content: "Phase 3: citizenship/secondary - Full review of 4 categories (318 lessons)"
    status: completed
  - id: cooking-primary
    content: "Phase 4: cooking-nutrition/primary - Full review of 4 categories (72 lessons)"
    status: completed
  - id: cooking-secondary
    content: "Phase 5: cooking-nutrition/secondary - FIRST full review of 4 categories (36 lessons)"
    status: completed
  - id: final-validation
    content: "Final validation: benchmark all 3 subjects, update documentation"
    status: completed
---

# Ground Truth Re-Review: Art, Citizenship, Cooking-Nutrition (Post-Synonyms)

## Context

**Synonym deployment complete**: 580 synonyms deployed to Elasticsearch (up from ~234 baseline). New synonym files for art, citizenship, and cooking-nutrition may reveal better candidate lessons that weren't discoverable before.

**Scope**: 5 subject-phases, 20 ground truths total

| Subject-Phase | Lessons | Previous Review | New Synonyms |

|---------------|---------|-----------------|--------------|

| art/primary | 214 | 2026-01-14 | art.ts (~45 entries) |

| art/secondary | 197 | 2026-01-15 | art.ts (~45 entries) |

| citizenship/secondary | 318 | 2026-01-15 | citizenship.ts (~35 entries) |

| cooking-nutrition/primary | 72 | 2026-01-16 | cooking-nutrition.ts (enhanced) |

| cooking-nutrition/secondary | 36 | NOT YET | cooking-nutrition.ts (enhanced) |

---

## Foundation Documents (Re-read Before Starting)

Before any work, re-read and re-commit to:

- [rules.md](/.agent/directives-and-memory/rules.md) - TDD, no type shortcuts, fail fast
- [testing-strategy.md](/.agent/directives-and-memory/testing-strategy.md) - TDD at ALL levels
- [schema-first-execution.md](/.agent/directives-and-memory/schema-first-execution.md) - Generator is source of truth

---

## Required Standard

**Use ALL relevant tools** for every category - make no assumptions:

| Tool | Purpose | Required |

|------|---------|----------|

| **Bulk data** (`jq`) | Find ALL candidate lessons | Always |

| **`get-lessons-summary`** | Keywords, key learning points | 5-10 candidates per category |

| **`get-units-summary`** | Lesson ordering in unit | For skill-level queries |

| **`gt-review`** | Actual search results | Always |

---

## Prerequisites

```bash
cd apps/oak-open-curriculum-semantic-search
source .env.local

# Verify MCP server (oak-local) - call get-help
# Verify ES access
curl -s "${ELASTICSEARCH_URL}/oak_lessons/_count" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" | jq '.count'

# Verify synonym count (should be ~580)
curl -s "${ELASTICSEARCH_URL}/_synonyms/oak-syns?size=1000" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" | jq '.synonyms_set | length'
```

**STOP if any prerequisite fails.**

---

## Phase 1: art/primary (214 lessons)

### List ALL lessons first

```bash
jq -r '.lessons[] | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' \
  bulk-downloads/art-primary.json | sort
```

### 1.1 precise-topic

- **Query**: "drawing marks Year 1"
- **Current slugs**: `how-artists-make-marks` (3), `expressive-mark-making` (2)

### 1.2 natural-expression

- **Query**: "how to draw faces"
- **Current slugs**: `draw-a-profile-portrait` (3), `analyse-a-facial-expression-through-drawing` (2)

### 1.3 imprecise-input

- **Query**: "brush painting techneeques" (intentional typo)
- **Current slugs**: `explore-a-variety-of-painting-techniques` (3), `mixing-secondary-colours-autumn-oranges` (2)

### 1.4 cross-topic

- **Query**: "rainforest colour and texture painting"
- **Current slugs**: `explore-the-shades-textures-and-colours-of-a-rainforest` (3), `paint-a-rainforest` (2)

---

## Phase 2: art/secondary (197 lessons)

### List ALL lessons first

```bash
jq -r '.lessons[] | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' \
  bulk-downloads/art-secondary.json | sort
```

### 2.1 precise-topic

- **Query**: "abstract painting techniques"
- **Current slugs**: `abstract-art-painting-using-different-stimuli` (3), `abstract-marks-respond-to-stimuli-by-painting` (2), `abstract-art-dry-materials-in-response-to-stimuli` (2)

### 2.2 natural-expression

- **Query**: "feelings in pictures"
- **Current slugs**: `personal-to-universal-art-as-connection` (3), `expressing-emotion-through-art` (2)

### 2.3 imprecise-input

- **Query**: "teach drawing skills beginers" (intentional typo)
- **Current slugs**: `i-cant-draw-building-confidence-through-drawing-techniques` (3), `drawing-for-different-purposes-and-needs` (2)

### 2.4 cross-topic

- **Query**: "portraits and colour expression"
- **Current slugs**: `exploring-portraits-through-paint` (3), `exploring-power-in-the-portrait` (2)

---

## Phase 3: citizenship/secondary (318 lessons)

### List ALL lessons first

```bash
jq -r '.lessons[] | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' \
  bulk-downloads/citizenship-secondary.json | sort
```

### 3.1 precise-topic

- **Query**: "democracy voting elections UK"
- **Current slugs**: `how-can-we-tell-if-the-uk-is-democratic` (3), `how-do-elections-in-the-uk-work` (3), `why-does-voting-matter` (2)

### 3.2 natural-expression

- **Query**: "being fair to everyone rights"
- **Current slugs**: `what-does-fairness-mean-in-society` (3), `why-do-we-need-laws-on-equality-in-the-uk` (2), `what-are-rights-and-where-do-they-come-from` (2)

### 3.3 imprecise-input

- **Query**: "parliment functions and roles" (intentional typo)
- **Current slugs**: `what-is-parliament-and-what-are-its-functions` (3), `what-is-the-difference-between-the-government-and-parliament` (2)

### 3.4 cross-topic

- **Query**: "democracy and laws together"
- **Current slugs**: `what-does-it-mean-to-live-in-a-democracy` (3), `what-are-rights-and-where-do-they-come-from` (3), `what-is-the-right-to-protest-within-a-democracy-with-the-rule-of-law` (2)

---

## Phase 4: cooking-nutrition/primary (72 lessons)

### List ALL lessons first

```bash
jq -r '.lessons[] | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' \
  bulk-downloads/cooking-nutrition-primary.json | sort
```

### 4.1 precise-topic

- **Query**: "healthy eating nutrition"
- **Current slugs**: `why-we-need-energy-and-nutrients` (3), `sources-of-energy-and-nutrients` (3), `introducing-the-eatwell-guide` (3), `health-and-wellbeing` (2), `healthy-meals` (2)

### 4.2 natural-expression

- **Query**: "learning to cook healthy lunches"
- **Current slugs**: `making-a-healthy-wrap-for-lunch` (3), `making-an-international-salad` (2), `healthy-meals` (2)
- **Key consideration**: Query verb "learning to cook" indicates practical cooking lessons preferred over theory

### 4.3 imprecise-input

- **Query**: "nutrision and helthy food" (intentional typos)
- **Current slugs**: `why-we-need-energy-and-nutrients` (3), `sources-of-energy-and-nutrients` (3), `food-labels-for-health` (3), `healthy-meals` (2), `health-and-wellbeing` (2)

### 4.4 cross-topic

- **Query**: "energy nutrients and healthy eating"
- **Current slugs**: `sources-of-energy-and-nutrients` (3), `why-we-need-energy-and-nutrients` (3), `making-curry-in-a-hurry` (2)

---

## Phase 5: cooking-nutrition/secondary (36 lessons) - FIRST FULL REVIEW

### List ALL lessons first

```bash
jq -r '.lessons[] | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' \
  bulk-downloads/cooking-nutrition-secondary.json | sort
```

### 5.1 precise-topic

- **Query**: "macronutrients and micronutrients nutrition"
- **Current slugs**: `macronutrients-fibre-and-water` (3), `micronutrients` (2)

### 5.2 natural-expression

- **Query**: "teach students to make bread"
- **Current slugs**: `making-herby-focaccia` (3), `making-chelsea-buns` (2)
- **Key consideration**: Practical bread-making lessons, not bread theory

### 5.3 imprecise-input

- **Query**: "nutrision healthy food" (intentional typo)
- **Current slugs**: `eat-well-now` (3), `macronutrients-fibre-and-water` (2)

### 5.4 cross-topic

- **Query**: "nutrition and cooking techniques together"
- **Original slugs**: `eat-well-now` (3), `making-better-food-and-drink-choices` (2)
- **CORRECTED slugs**: `making-mushroom-bean-burgers-with-flatbreads` (3), `making-cheesy-bean-burritos` (2), `making-toad-in-the-hole` (2)
- **Reason**: Original slugs were nutrition THEORY without cooking techniques. Corrected slugs combine BOTH nutrition (Eatwell Guide, nutritional analysis) AND cooking techniques.

---

## Process Per Category

For EACH of the 20 categories:

1. **Search bulk data** - `jq` with multiple terms to find ALL potentially relevant lessons
2. **Get MCP summaries** - `get-lessons-summary` for 5-10 candidates (including current expected slugs)
3. **Get unit context** - `get-units-summary` for skill-level queries (beginner/intro/advanced)
4. **Run gt-review** - See actual search results and current MRR
5. **Create comparison table** - Key learning points + relevance assessment
6. **Select BEST matches** - Update ground truth if better candidates found

---

## Validation (After Each Subject-Phase)

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject SUBJECT --phase PHASE --verbose
```

---

## Final Validation (After All 5 Phases)

```bash
pnpm benchmark --subject art --verbose
pnpm benchmark --subject citizenship --verbose
pnpm benchmark --subject cooking-nutrition --verbose
```

---

## Documentation Updates

After completion:

1. Update [ground-truth-review-checklist.md](/.agent/plans/semantic-search/active/ground-truth-review-checklist.md)
2. Update [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md)
3. Update [current-state.md](/.agent/plans/semantic-search/current-state.md)

---

## Anti-Patterns to Avoid

1. **Validating existing slugs instead of exploring** - Do not just check if current slugs appear
2. **Skipping `get-units-summary`** - Critical for lesson ordering
3. **Using end-of-unit lessons for beginner queries** - Lessons 5-6 are often capstone content
4. **Accepting low MRR without investigation** - Lower MRR with correct ground truth is valuable
5. **Gaming benchmarks** - Ground truth correctness over benchmark scores
6. **Only searching by title keywords** - MCP key learning points may reveal hidden relevance

---

## Key Files

| Path | Purpose |

|------|---------|

| `src/lib/search-quality/ground-truth/art/` | Art ground truth definitions |

| `src/lib/search-quality/ground-truth/citizenship/` | Citizenship ground truth definitions |

| `src/lib/search-quality/ground-truth/cooking-nutrition/` | Cooking ground truth definitions |

| `bulk-downloads/*.json` | Lesson data for jq exploration |

| `evaluation/analysis/gt-review.ts` | Review CLI tool |

| `evaluation/analysis/benchmark.ts` | Benchmark runner |

---

## ✅ COMPLETION SUMMARY (2026-01-17)

### Results

| Subject-Phase | MRR | NDCG | R@10 | Changes |
|---------------|-----|------|------|---------|
| art/primary | 0.875 | 0.859 | 1.000 | None - verified correct |
| art/secondary | 0.833 | 0.800 | 1.000 | None - verified correct |
| citizenship/secondary | 1.000 | 0.856 | 1.000 | None - verified correct |
| cooking-nutrition/primary | 0.550 | 0.465 | 0.650 | None - low MRR reveals search quality gaps |
| cooking-nutrition/secondary | 0.833 | 0.764 | 1.000 | **cross-topic corrected** |

### Key Correction

**cooking-nutrition/secondary cross-topic** ("nutrition and cooking techniques together"):
- **Before**: Nutrition theory lessons without cooking techniques (MRR 0.000)
- **After**: Practical cooking lessons that combine nutrition + techniques (MRR 1.000)

### Key Insight

The low MRR in cooking-nutrition/primary (0.550) is **valuable search quality information**, not a ground truth issue. The expected slugs ARE the best semantic matches (verified via MCP exploration), but search doesn't rank them optimally. This reveals search prioritizes "community" and "wellbeing" lessons over nutrition-focused content.

### Documentation Updated

- `.agent/plans/semantic-search/active/ground-truth-review-checklist.md` - Progress 7/30
- `.agent/plans/semantic-search/current-state.md` - Added key learning #10
- `.agent/prompts/semantic-search/semantic-search.prompt.md` - Updated progress and next session
