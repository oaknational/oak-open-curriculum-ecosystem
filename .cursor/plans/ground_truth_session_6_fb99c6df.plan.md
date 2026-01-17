---
name: Ground Truth Session 6
overview: "Session 6: Comprehensive ground truth review for cooking-nutrition/primary (4 queries, 72 lessons in pool). Uses ALL relevant MCP tools AND bulk data per the required standard."
todos:
  - id: prereq
    content: "Prerequisites: Verify ES access, bulk data (72 lessons)"
    status: completed
  - id: foundation
    content: Re-read rules.md, testing-strategy.md, schema-first-execution.md
    status: completed
  - id: cat1-bulk
    content: "precise-topic: Search bulk data for nutrition/healthy eating lessons"
    status: completed
  - id: cat1-mcp
    content: "precise-topic: Get MCP summaries (get-lessons-summary) for 5-10 candidates"
    status: completed
  - id: cat1-compare
    content: "precise-topic: Create comparison table, verify/update expected slugs"
    status: completed
  - id: cat2-bulk
    content: "natural-expression: Search bulk data for lunch/cooking/healthy lessons"
    status: completed
  - id: cat2-mcp
    content: "natural-expression: Get MCP summaries for 5-10 candidates"
    status: completed
  - id: cat2-compare
    content: "natural-expression: Create comparison table, evaluate MRR 0.500"
    status: completed
  - id: cat3-bulk
    content: "imprecise-input: Search bulk data for nutrition/healthy food lessons"
    status: completed
  - id: cat3-es
    content: "imprecise-input: Run direct ES query to test fuzzy matching"
    status: completed
  - id: cat3-mcp
    content: "imprecise-input: Get MCP summaries for 5-10 candidates"
    status: completed
  - id: cat3-compare
    content: "imprecise-input: Create comparison table, evaluate MRR 0.333"
    status: completed
  - id: cat4-bulk
    content: "cross-topic: Search bulk data for energy/nutrients/healthy intersection"
    status: completed
  - id: cat4-mcp
    content: "cross-topic: Get MCP summaries for 5-10 candidates"
    status: completed
  - id: cat4-compare
    content: "cross-topic: Create comparison table, verify intersection matches"
    status: completed
  - id: validate
    content: "Validation: type-check, ground-truth:validate, benchmark --verbose"
    status: completed
  - id: docs
    content: "Documentation: Update checklist, prompt, log session findings"
    status: completed
---

# Ground Truth Review Session 6: cooking-nutrition/primary

## Foundation Commitment

Before any work, re-read and commit to:

1. [rules.md](/.agent/directives-and-memory/rules.md) - TDD, no type shortcuts, fail fast
2. [testing-strategy.md](/.agent/directives-and-memory/testing-strategy.md) - TDD at ALL levels
3. [schema-first-execution.md](/.agent/directives-and-memory/schema-first-execution.md) - Generator is source of truth

**First Question**: Could it be simpler without compromising quality?

**Pre-First Question**: Are we solving the right problem, at the right layer?

---

## Context

| Attribute | Value |

|-----------|-------|

| Subject | cooking-nutrition |

| Phase | primary (KS1/KS2) |

| Pool size | 72 lessons |

| Categories | 4 queries to review |

### Current Ground Truths

| Category | Query | MRR | Expected Slugs |

|----------|-------|-----|----------------|

| precise-topic | "healthy eating nutrition" | 1.000 | 3 slugs |

| natural-expression | "learning to cook healthy lunches" | 0.500 | 2 slugs |

| imprecise-input | "nutrision and helthy food" | 0.333 | 2 slugs |

| cross-topic | "energy nutrients and healthy eating" | 1.000 | 2 slugs |

---

## Required Standard

**Use ALL relevant MCP tools AND bulk data** for every category.

| Tool | Purpose | When |

|------|---------|------|

| **Bulk data** (jq) | Find ALL candidate lessons | Always - search with multiple terms |

| **get-lessons-summary** | Keywords, key learning points | 5-10 candidates per category |

| **get-units-summary** | Lesson ordering within unit | For skill-level queries |

| **gt-review** | Actual search results and MRR | Every category |

### Anti-Pattern (DO NOT DO THIS)

- Looking at existing slugs then checking they appear in results and concluding "looks good"
- Using only get-lessons-summary without get-units-summary for skill-level queries

---

## Prerequisites

```bash
cd apps/oak-open-curriculum-semantic-search
source .env.local

# Verify MCP server (already confirmed available)
# Verify ES access
curl -s "${ELASTICSEARCH_URL}/oak_lessons/_count" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" | jq '.count'

# Verify bulk data
jq '.lessons | length' bulk-downloads/cooking-nutrition-primary.json
# Expected: 72
```

---

## Category 1: precise-topic

**Current query**: "healthy eating nutrition"

**Current expected**: `healthy-meals` (3), `why-we-need-energy-and-nutrients` (3), `sources-of-energy-and-nutrients` (2)

**Current MRR**: 1.000

### Process

1. **Search bulk data** for ALL nutrition/healthy eating lessons:
```bash
jq -r '.lessons[] | select(.lessonTitle | test("nutrition|nutrient|healthy|eating"; "i")) | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' bulk-downloads/cooking-nutrition-primary.json
```

2. **Get MCP summaries** for 5-10 candidates using `get-lessons-summary`

2. **Create comparison table** with key learning points and relevance assessment

3. **Run gt-review**:
```bash
pnpm gt-review --subject cooking-nutrition --phase primary --category precise-topic
```

4. **Select BEST matches** - verify current slugs are optimal or update

### Acceptance Criteria

- [ ] Searched bulk data with multiple terms (nutrition, nutrient, healthy, eating, eatwell)
- [ ] Got MCP summaries for at least 5 candidate lessons
- [ ] Created comparison table with key learning points
- [ ] Ran gt-review and documented results
- [ ] Decision documented: either confirmed current slugs or updated with evidence

---

## Category 2: natural-expression

**Current query**: "learning to cook healthy lunches"

**Current expected**: `making-a-healthy-wrap-for-lunch` (3), `healthy-meals` (2)

**Current MRR**: 0.500

### Key Consideration

This is a natural-expression category - tests vocabulary bridging. Does NOT contain a skill-level term (beginner/intro), so get-units-summary may not be critical here.

### Process

1. **Search bulk data** for lunch/cooking/healthy lessons:
```bash
jq -r '.lessons[] | select(.lessonTitle | test("lunch|cook|healthy|meal"; "i")) | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' bulk-downloads/cooking-nutrition-primary.json
```

2. **Get MCP summaries** for 5-10 candidates - look for lessons about practical cooking AND healthy choices

2. **Create comparison table** - focus on which lessons teach cooking skills vs theory

3. **Run gt-review**:
```bash
pnpm gt-review --subject cooking-nutrition --phase primary --category natural-expression
```

4. **Evaluate**: Is 0.500 MRR due to incorrect ground truth or search quality issue?

### Acceptance Criteria

- [ ] Searched bulk data with multiple terms
- [ ] Got MCP summaries for at least 5 candidates
- [ ] Created comparison table distinguishing practical cooking from theory
- [ ] Ran gt-review and documented results
- [ ] Determined if MRR 0.500 is: (a) ground truth needs fixing, or (b) correct spec, search needs improving

---

## Category 3: imprecise-input

**Current query**: "nutrision and helthy food" (typos: "nutrision", "helthy")

**Current expected**: `why-we-need-energy-and-nutrients` (3), `healthy-meals` (2)

**Current MRR**: 0.333

### Key Consideration

This tests search resilience to typos. The expected slugs should be what a user MEANT to search for, regardless of typos.

### Process

1. **Search bulk data** for nutrition/healthy food lessons (using correct spelling):
```bash
jq -r '.lessons[] | select(.lessonTitle | test("nutrition|nutrient|healthy|food"; "i")) | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' bulk-downloads/cooking-nutrition-primary.json
```

2. **Get MCP summaries** for 5-10 candidates

2. **Direct ES query** to understand fuzzy matching:
```bash
curl -s "${ELASTICSEARCH_URL}/oak_lessons/_search" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {"bool": {
      "must": [{"match": {"lesson_title": {"query": "nutrision helthy", "fuzziness": "AUTO"}}}],
      "filter": [{"term": {"subject_slug": "cooking-nutrition"}}]
    }},
    "size": 5,
    "_source": ["lesson_slug", "lesson_title"]
  }' | jq '.hits.hits[]._source'
```

3. **Create comparison table**

2. **Run gt-review**:
```bash
pnpm gt-review --subject cooking-nutrition --phase primary --category imprecise-input
```

3. **Evaluate**: Are expected slugs the best semantic matches for "nutrition and healthy food"?

### Acceptance Criteria

- [ ] Searched bulk data for nutrition/healthy food lessons
- [ ] Got MCP summaries for at least 5 candidates
- [ ] Ran direct ES query to understand fuzzy matching behaviour
- [ ] Created comparison table
- [ ] Determined if MRR 0.333 is: (a) ground truth needs fixing, or (b) correct spec, resilience issue

---

## Category 4: cross-topic

**Current query**: "energy nutrients and healthy eating"

**Current expected**: `sources-of-energy-and-nutrients` (3), `why-we-need-energy-and-nutrients` (2)

**Current MRR**: 1.000

### Key Consideration

Cross-topic tests multi-concept intersection. Query combines: energy + nutrients + healthy eating. Expected slugs must explicitly address ALL concepts.

### Process

1. **Search bulk data** for EACH concept:
```bash
# Energy
jq -r '.lessons[] | select(.lessonTitle | test("energy"; "i")) | .lessonSlug' bulk-downloads/cooking-nutrition-primary.json

# Nutrients
jq -r '.lessons[] | select(.lessonTitle | test("nutrient"; "i")) | .lessonSlug' bulk-downloads/cooking-nutrition-primary.json

# Healthy eating
jq -r '.lessons[] | select(.lessonTitle | test("healthy|eatwell"; "i")) | .lessonSlug' bulk-downloads/cooking-nutrition-primary.json
```

2. **Find intersection** - which lessons explicitly combine energy + nutrients + healthy?

2. **Get MCP summaries** for 5-10 candidates

3. **Create comparison table** - score based on how many concepts each lesson addresses

4. **Run gt-review**:
```bash
pnpm gt-review --subject cooking-nutrition --phase primary --category cross-topic
```


### Acceptance Criteria

- [ ] Searched bulk data for each concept separately
- [ ] Identified lessons combining multiple concepts
- [ ] Got MCP summaries for at least 5 candidates
- [ ] Created comparison table scoring concept coverage
- [ ] Verified expected slugs are best intersection matches

---

## Validation

After all 4 categories complete:

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject cooking-nutrition --phase primary --verbose
```

### Acceptance Criteria

- [ ] type-check passes
- [ ] ground-truth:validate passes (all 16 semantic checks)
- [ ] benchmark runs and MRR documented

---

## Documentation Updates

1. Update checklist in [ground-truth-review-checklist.md](/.agent/plans/semantic-search/active/ground-truth-review-checklist.md)
2. Update next session in [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md)
3. Add session log entry

---

## Session Completion Summary Template

| Category | MRR Before | MRR After | R@10 | Key Finding |

|----------|------------|-----------|------|-------------|

| precise-topic | 1.000 | ? | ? | |

| natural-expression | 0.500 | ? | ? | |

| imprecise-input | 0.333 | ? | ? | |

| cross-topic | 1.000 | ? | ? | |

### Changes Made

Document each change with:

- Category
- What changed (query, expected slugs, scores)
- Evidence justifying the change

### Key Learnings

Any new insights to add to GROUND-TRUTH-GUIDE.md

---

## Files to Modify

| File | Purpose |

|------|---------|

| [precise-topic.ts](/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/cooking-nutrition/primary/precise-topic.ts) | Ground truth definition |

| [natural-expression.ts](/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/cooking-nutrition/primary/natural-expression.ts) | Ground truth definition |

| [imprecise-input.ts](/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/cooking-nutrition/primary/imprecise-input.ts) | Ground truth definition |

| [cross-topic.ts](/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/cooking-nutrition/primary/cross-topic.ts) | Ground truth definition |

| [ground-truth-review-checklist.md](/.agent/plans/semantic-search/active/ground-truth-review-checklist.md) | Progress tracking |

| [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md) | Next session target |

---

## Measurable Acceptance Criteria (Session Complete When)

1. All 4 categories reviewed with documented evidence (comparison tables)
2. Each category has explicit decision: confirmed or updated with justification
3. Validation passes (type-check + ground-truth:validate)
4. Benchmark run with results documented
5. Checklist updated with completion status and MRR values
6. Prompt updated with next session target (cooking-nutrition/secondary)