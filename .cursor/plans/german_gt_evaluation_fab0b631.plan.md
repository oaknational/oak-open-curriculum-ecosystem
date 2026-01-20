---
name: German GT Evaluation
overview: Evaluate German secondary ground truths (4 categories) using the LINEAR EXECUTION PROTOCOL with COMMIT step. Every query requires fresh MCP analysis and bulk data exploration. Quality over speed — no shortcuts.
todos:
  - id: phase0
    content: "PHASE 0: Verify MCP tools, bulk data (77 units, 383 lessons), and benchmark working - STOP if unavailable"
    status: completed
  - id: cat1-query
    content: "precise-topic 1A: QUERY ANALYSIS - REFLECT on 'German present tense weak verbs' as test of basic curriculum retrieval"
    status: completed
  - id: cat1-discovery
    content: "precise-topic 1B: DISCOVERY - bulk search (present, weak, verb terms), get 5-10 MCP summaries, document unit context"
    status: completed
  - id: cat1-commit
    content: "precise-topic 1B.5: COMMIT - rank top 5 with scores and key learning justifications BEFORE benchmark"
    status: completed
  - id: cat1-comparison
    content: "precise-topic 1C: COMPARISON - benchmark --review, THREE-WAY table (your rankings vs search vs expected), all 4 metrics"
    status: completed
  - id: cat2-query
    content: "natural-expression 1A: QUERY ANALYSIS - REFLECT on 'teach German verb endings year 7' - is vocabulary natural?"
    status: completed
  - id: cat2-discovery
    content: "natural-expression 1B: FRESH DISCOVERY - new jq searches (ending, conjugat), new MCP summaries - NO copying from cat1"
    status: completed
  - id: cat2-commit
    content: "natural-expression 1B.5: COMMIT - rank BEFORE benchmark based on fresh MCP analysis"
    status: completed
  - id: cat2-comparison
    content: "natural-expression 1C: COMPARISON - three-way table, all 4 metrics"
    status: completed
  - id: cat3-query
    content: "imprecise-input 1A: QUERY ANALYSIS - REFLECT on 'german grammer present tence' - are typos realistic?"
    status: completed
  - id: cat3-discovery
    content: "imprecise-input 1B: FRESH DISCOVERY - search corrected terms (grammar, present tense), new MCP summaries"
    status: completed
  - id: cat3-commit
    content: "imprecise-input 1B.5: COMMIT - rank BEFORE benchmark based on semantic intent"
    status: completed
  - id: cat3-comparison
    content: "imprecise-input 1C: COMPARISON - three-way table, all 4 metrics"
    status: completed
  - id: cat4-query
    content: "cross-topic 1A: QUERY ANALYSIS - REFLECT on 'verbs and questions in German' - are BOTH concepts distinct?"
    status: completed
  - id: cat4-discovery
    content: "cross-topic 1B: FRESH DISCOVERY - search both concepts separately, find intersection, verify BOTH in MCP key learning"
    status: completed
  - id: cat4-commit
    content: "cross-topic 1B.5: COMMIT - rank lessons that combine BOTH concepts BEFORE benchmark"
    status: completed
  - id: cat4-comparison
    content: "cross-topic 1C: COMPARISON - three-way table, all 4 metrics"
    status: completed
  - id: phase2
    content: "PHASE 2: Validation - type-check, ground-truth:validate, benchmark --subject german --verbose"
    status: completed
  - id: phase3
    content: "PHASE 3: Documentation - update checklist with metrics, changes, and key learnings"
    status: completed
---

# German Secondary Ground Truth Evaluation

## Critical Context

**Subject**: german/secondary

**Dataset**: 77 units, 383 lessons

**MFL Note**: German has ~0% transcript coverage. Search relies on **structure metadata only** (title, keywords, key learning).

## Four Queries to Evaluate

| Category | Query | Capability Being Tested |

|----------|-------|------------------------|

| precise-topic | "German present tense weak verbs" | Basic retrieval with curriculum terminology |

| natural-expression | "teach German verb endings year 7" | Vocabulary bridging (informal to curriculum) |

| imprecise-input | "german grammer present tence" | Resilience to typos (3 errors: grammer, present, tence) |

| cross-topic | "verbs and questions in German" | Finding concept intersections |

## Cardinal Rules (Read Before Each Category)

1. **The search might be RIGHT. Expected slugs might be WRONG.**
2. **COMMIT to rankings BEFORE seeing search results OR expected slugs.**
3. **FRESH MCP analysis for EVERY query. NO EXCEPTIONS.**

## Phase 0: Prerequisites

```bash
cd apps/oak-open-curriculum-semantic-search
source .env.local

# Verify bulk data
jq '.sequence | length' bulk-downloads/german-secondary.json  # Should be 77

# List ALL lessons to reference file
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/german-secondary.json > /tmp/german-secondary-all.txt

wc -l /tmp/german-secondary-all.txt  # Should be 383
```

Verify MCP tools working via `get-lessons-summary` for any German lesson.

**CHECKPOINT 0**: If MCP or bulk data unavailable, STOP.

---

## Category 1: precise-topic

### Phase 1A: Query Analysis (REFLECT ONLY — No Tools)

**Query**: "German present tense weak verbs"

- **Capability tested**: Basic retrieval with curriculum terminology
- **Evaluate**: "Present tense" and "weak verbs" are standard German grammar terms
- **Design quality**: Good — tests whether curriculum terminology retrieves correct lessons
- **Potential issues**: None — this is precise curriculum vocabulary

### Phase 1B: Discovery + COMMIT

1. **Bulk search** (3+ search terms):

   - Search for "present" in lesson titles
   - Search for "weak" in lesson titles
   - Search for "verb" in lesson titles
   - Search relevant unit titles

2. **MCP summaries** (5-10 lessons): Get key learning for top candidates

3. **COMMIT rankings**: Fill table with top 5 ranked by key learning match — BEFORE benchmark

### Phase 1C: Comparison

- Run `pnpm benchmark -s german -p secondary -c precise-topic --review`
- Create THREE-WAY comparison table
- Record ALL 4 metrics

---

## Category 2: natural-expression

### Phase 1A: Query Analysis (REFLECT ONLY — No Tools)

**Query**: "teach German verb endings year 7"

- **Capability tested**: Vocabulary bridging from teacher language to curriculum terms
- **Evaluate**: "teach" and "year 7" are natural teacher language, not curriculum terms
- **Design quality**: Good — tests whether informal phrasing maps to curriculum
- **Potential issues**: "verb endings" IS curriculum vocabulary — mixed query

### Phase 1B: Discovery + COMMIT

**FRESH jq search required** — different from precise-topic:

- Search "ending" (specific to this query)
- Search "conjugat" (curriculum equivalent)
- Search foundational units for Year 7 content

**FRESH MCP summaries required** — cannot copy from precise-topic

### Phase 1C: Comparison

- Run `pnpm benchmark -s german -p secondary -c natural-expression --review`
- THREE-WAY comparison
- ALL 4 metrics

---

## Category 3: imprecise-input

### Phase 1A: Query Analysis (REFLECT ONLY — No Tools)

**Query**: "german grammer present tence"

- **Capability tested**: Resilience to typos
- **Evaluate**: Contains 3 typos — "grammer" (grammar), "tence" (tense), and arguably "present" without "tense" marker
- **Design quality**: Realistic — these are common misspellings
- **Potential issues**: Multiple errors may compound difficulty

### Phase 1B: Discovery + COMMIT

**FRESH jq search required** — search for corrected terms:

- "grammar" / "grammatik"
- "present tense"
- German foundational lessons

**FRESH MCP summaries required** — semantic intent is grammar/present tense

### Phase 1C: Comparison

- Run `pnpm benchmark -s german -p secondary -c imprecise-input --review`
- THREE-WAY comparison
- ALL 4 metrics

---

## Category 4: cross-topic

### Phase 1A: Query Analysis (REFLECT ONLY — No Tools)

**Query**: "verbs and questions in German"

- **Capability tested**: Finding concept intersections
- **Evaluate**: TWO distinct concepts — verb conjugation AND question formation
- **Design quality**: Good — requires finding lessons that teach BOTH
- **Potential issues**: May be no perfect intersection (document if so)

### Phase 1B: Discovery + COMMIT

**FRESH jq search required**:

- Search "question" in lesson titles
- Search "verb" in lesson titles
- Cross-reference for lessons in BOTH sets

**FRESH MCP summaries required** — verify BOTH concepts in key learning

### Phase 1C: Comparison

- Run `pnpm benchmark -s german -p secondary -c cross-topic --review`
- THREE-WAY comparison
- ALL 4 metrics

---

## Phase 2: Validation

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject german --verbose
```

Record aggregate metrics for all 4 categories.

---

## Phase 3: Documentation

Update [ground-truth-review-checklist.md](.agent/plans/semantic-search/active/ground-truth-review-checklist.md):

- Mark german/secondary complete
- Record metrics for each category
- Document key learnings and changes

---

## Key Files

- Query files (SAFE to read):
  - `src/lib/search-quality/ground-truth/german/secondary/precise-topic.query.ts`
  - `src/lib/search-quality/ground-truth/german/secondary/natural-expression.query.ts`
  - `src/lib/search-quality/ground-truth/german/secondary/imprecise-input.query.ts`
  - `src/lib/search-quality/ground-truth/german/secondary/cross-topic.query.ts`

- Expected files (ONLY read in Phase 1C):
  - `src/lib/search-quality/ground-truth/german/secondary/*.expected.ts`

- Bulk data:
  - `bulk-downloads/german-secondary.json`

---

## Evidence Requirements Per Category

Each category MUST have:

- [ ] Phase 1A reflection documented
- [ ] 10+ candidate slugs from bulk data
- [ ] 5-10 MCP summaries with key learning quotes
- [ ] Unit context documented
- [ ] COMMIT table filled BEFORE benchmark
- [ ] Benchmark output with ALL 4 metrics
- [ ] THREE-WAY comparison table
- [ ] Critical question answered with justification

**If any evidence is missing, the category is NOT complete.**
